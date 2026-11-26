import { isUtf8 } from "node:buffer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { markdownLinks, markdownSection } from "./markdown.mjs";
import { parseYaml } from "./simple-yaml.mjs";

const hash = (value) => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
const present = (value) => typeof value === "string" && value.trim().length > 0;
const textAssets = /\.(?:drawio|json|svg|toml|xml|xsd|ya?ml)$/i;
const normalizeLines = (text) => text.replace(/\r\n/g, "\n");
const scenarioPattern = /^[a-z][a-z0-9_.-]*$/i;

function fileIn(directory, relative) {
  if (!present(relative) || /[\\:\x00-\x1f]/.test(relative)
      || relative.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
    throw new Error(`Invalid relative path: ${relative}`);
  }
  let file = directory;
  for (const segment of relative.split("/")) {
    file = path.join(file, segment);
    const entry = fs.lstatSync(file, { throwIfNoEntry: false });
    if (!entry || entry.isSymbolicLink()) throw new Error(`Missing or unsafe file: ${relative}`);
  }
  if (!fs.statSync(file).isFile()) throw new Error(`Expected a regular file: ${relative}`);
  return fs.readFileSync(file);
}

export function scenarioRows(root) {
  if (!fs.existsSync(path.join(root, "acceptance.yaml"))) return new Map();
  const value = parseYaml(fileIn(root, "acceptance.yaml").toString("utf8"), "acceptance.yaml");
  if (!Array.isArray(value?.scenarios)) throw new Error("acceptance.yaml requires a scenarios list");
  const rows = new Map();
  for (const row of value.scenarios) {
    if (!present(row?.id) || !scenarioPattern.test(row.id) || rows.has(row.id)) {
      throw new Error(`acceptance.yaml: invalid or duplicate scenario ID ${row?.id}`);
    }
    rows.set(row.id, row);
  }
  return rows;
}

export function checkScenario(row) {
  if (!present(row.source) || !/^[^#]+\.md#[^#]+$/.test(row.source)
      || !Array.isArray(row.verify) || !row.verify.length || !row.verify.every(present)) {
    throw new Error(`${row.id}: use a Markdown source section and a nonempty verify list`);
  }
}

function references(value, label, optional = false) {
  if (value === undefined && optional) return [];
  if (!Array.isArray(value) || (!value.length && !optional) || !value.every(present)
      || new Set(value).size !== value.length) throw new Error(`${label}: expected unique references`);
  return [...value].sort();
}

export function recordKind(file) {
  if (!file.endsWith(".md") || file.endsWith("/index.md")) return undefined;
  return file.split("/").slice(0, -1).findLast((segment) => ["decisions", "gaps"].includes(segment));
}

export function decisionMetadata(text, file) {
  const header = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  const meta = header ? parseYaml(header[1], file) : {};
  if (!["proposed", "accepted", "superseded"].includes(meta?.status)) {
    throw new Error(`${file}: decision status must be proposed, accepted, or superseded`);
  }
  if (meta.status === "accepted" && !present(meta.evidence)) throw new Error(`${file}: accepted decision requires evidence`);
  return meta;
}

function linkedReference(file, target) {
  const [raw, fragment] = target.split("#", 2).map(decodeURIComponent);
  if (raw.startsWith("/") || raw.includes("\\")) throw new Error(`${file}: invalid local link ${target}`);
  const relative = raw ? path.posix.normalize(path.posix.join(path.posix.dirname(file), raw)) : file;
  return fragment ? `${relative}#${fragment}` : relative;
}

function proof(repo, root, actor, ref, label) {
  if (!present(actor) || !present(ref)) throw new Error(`Slice requires ${label} identity and evidence reference`);
  if (ref.startsWith("https://") && URL.canParse(ref)) return;
  const file = ref.split("#", 1)[0];
  fileIn(repo, file);
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(path.join(repo, file)));
  if (!relative.startsWith(`..${path.sep}`)) throw new Error("Keep local approval evidence outside the spec directory");
}

export function readSlice(root, id, { approved = true, rows = scenarioRows(root) } = {}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id || "")) throw new Error(`Invalid slice ID: ${id}`);
  if (!fs.lstatSync(root).isDirectory()) throw new Error("Expected a regular specs directory");
  const repo = path.dirname(root);
  const file = `reviews/readiness/${id}.yaml`;
  const scope = parseYaml(fileIn(repo, file).toString("utf8"), file);
  const scenarios = new Set(references(scope?.scenarios, `${file} scenarios`));
  const declared = references(scope.sources, `${file} sources`, true);
  const inputs = [];
  const pending = new Set(declared);
  for (const scenario of scenarios) {
    const row = rows.get(scenario);
    if (!row) throw new Error(`${id}: unknown acceptance scenario ${scenario}`);
    checkScenario(row);
    inputs.push([row.id, row.source, row.verify]);
    pending.add(row.source);
  }
  const sources = new Map();
  for (const ref of pending) {
    const [relative, anchor, extra] = ref.split("#");
    if (extra !== undefined || (anchor !== undefined && (!anchor || !relative.endsWith(".md")))) {
      throw new Error(`${id}: invalid governing reference ${ref}`);
    }
    const recordType = recordKind(relative);
    if (recordType === "gaps") throw new Error(`${id}: open question blocks this slice: ${relative}`);
    const bytes = fileIn(root, relative);
    if (!relative.endsWith(".md")) {
      const content = textAssets.test(relative) && isUtf8(bytes) ? normalizeLines(bytes.toString("utf8")) : bytes;
      sources.set(ref, hash(content));
      continue;
    }
    const text = normalizeLines(bytes.toString("utf8"));
    const section = anchor ? markdownSection(text, anchor) : text;
    if (section === null) throw new Error(`${id}: missing or ambiguous Markdown anchor ${ref}`);
    if (recordType === "decisions") {
      if (decisionMetadata(text, relative).status !== "accepted") throw new Error(`${id}: use the current accepted decision: ${relative}`);
      // An ADR may link back to all affected rules. Bind the record but
      // leave new governing dependencies to the reviewed slice scope.
      sources.set(ref, hash(text));
      continue;
    }
    sources.set(ref, hash(section));
    for (const { target } of markdownLinks(section)) {
      const linked = linkedReference(relative, target);
      const pathname = linked.split("#", 1)[0];
      // Whole-page Markdown links serve navigation. Cite a governing
      // heading or name the whole page explicitly in sources.
      if (linked.includes("#") || !pathname.endsWith(".md") || recordKind(pathname)) pending.add(linked);
    }
  }
  const digest = hash(JSON.stringify([id, inputs, [...sources].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)]));
  if (approved) {
    if (scope.digest !== digest) throw new Error(`${id}: stale or missing slice approval; review the affected sources`);
    proof(repo, root, scope.approved_by, scope.approval_ref, "human approval");
    proof(repo, root, scope.reviewed_by, scope.review_ref, "independent review");
  }
  return { digest, scenarios, sources };
}
