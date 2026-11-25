import fs from "node:fs";
import path from "node:path";
import { parseYaml } from "./simple-yaml.mjs";

const profileKey = "x-project-knowledge-version";
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const markerPattern = /^\s*x-project-knowledge-version\s*:/m;
const recordIndexes = { ADR: "decisions/index.md", Gap: "gaps/index.md" };
const projectTypes = new Set(["Business Domain", "Component", "Flow", ...Object.keys(recordIndexes)]);
const present = (value) => typeof value === "string" && value.trim().length > 0;
const plainPath = /^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/;

function readPage(source, file) {
  const frontmatter = frontmatterPattern.exec(source);
  if (!frontmatter && /^---\r?\n/.test(source)) throw new Error(`${file}: unclosed frontmatter`);
  const meta = frontmatter ? parseYaml(frontmatter[1], file) : {};
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) throw new Error(`${file}: frontmatter must be a map`);
  const body = frontmatter ? source.slice(frontmatter[0].length) : source;
  const prose = body
    .replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*\r?$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^(?: {4}|\t).*$/gm, "")
    .replace(/(`+)[^`\n]+\1/g, "");
  const links = new Set();
  const images = new Set();
  for (const [, image, label, ref] of prose.matchAll(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    const [target] = ref.split("#", 1);
    if (!target || /^(?:[a-z][a-z0-9+.-]*:)/i.test(target)) continue;
    const resolved = target.startsWith("/") ? target : path.posix.normalize(path.posix.join(path.posix.dirname(file), target));
    if (image && present(label)) images.add(resolved);
    else if (!image) links.add(resolved);
  }
  return { meta, links, images };
}

function requiredType(file) {
  if (["index.md", "log.md"].includes(path.posix.basename(file))) return undefined;
  const directories = file.split("/").slice(0, -1);
  if (directories.includes("decisions")) return "ADR";
  if (directories.includes("gaps")) return "Gap";
  if (directories[0] === "components") return "Component";
}

function hasAcceptedReplacement(pages, file) {
  const visited = new Set();
  while (file && !visited.has(file)) {
    visited.add(file);
    const meta = pages.get(file)?.meta;
    if (meta?.type !== "ADR") return false;
    if (meta["x-project-state"] === "accepted") return true;
    if (meta["x-project-state"] !== "superseded") return false;
    file = meta["x-project-replacement"];
  }
  return false;
}

export function validateProjectKnowledge(root, files, { approved, readAuthority, fail }) {
  const entry = path.join(root, "index.md");
  if (!files.includes(entry)) return;
  const frontmatter = frontmatterPattern.exec(fs.readFileSync(entry, "utf8"));
  if (!frontmatter || !markerPattern.test(frontmatter[1])) return;

  const localFiles = new Set();
  const pages = new Map();
  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (!fs.lstatSync(file).isFile()) {
      fail(`${rel}: project knowledge requires regular files`);
      continue;
    }
    localFiles.add(rel);
    if (!rel.endsWith(".md")) continue;
    try {
      pages.set(rel, readPage(fs.readFileSync(file, "utf8"), rel));
    } catch (error) {
      fail(error.message);
    }
  }

  function directLink(from, to) {
    if (!pages.get(from)?.links.has(to) || !pages.has(to)) {
      fail(`${from}: missing direct project knowledge link to ${to}`);
    }
  }

  if (pages.get("index.md")?.meta[profileKey] !== 1) fail(`index.md: ${profileKey} must be 1`);
  for (const file of ["00-vision.md", "00-architecture-overview.md", "02-capabilities/capability-inventory.md", "03-flows/e2e-coverage.md", ...Object.values(recordIndexes)]) {
    directLink("index.md", file);
  }

  const visible = new Set(pages.get("index.md")?.links);
  for (const first of [...visible]) {
    if (first.endsWith("/index.md")) {
      for (const second of pages.get(first)?.links || []) visible.add(second);
    }
  }
  const ids = new Set();
  const publishedImages = new Set();
  const authority = readAuthority();
  const decisions = Array.isArray(authority?.decisions) ? authority.decisions : [];
  for (const [file, { meta, links, images }] of pages) {
    for (const target of [...links, ...images]) {
      if (target.startsWith("../") || !localFiles.has(target)) fail(`${file}: knowledge link must resolve inside specs to a file: ${target}`);
    }
    for (const image of images) {
      if (!/^visuals\/.+\.(svg|png)$/.test(image)) continue;
      publishedImages.add(image);
      const source = image.replace(/\.(svg|png)$/, ".drawio");
      if (!localFiles.has(source) || !links.has(source)) fail(`${file}: diagram must link its editable source ${source}`);
    }

    const expected = requiredType(file);
    if (expected && meta.type !== expected) fail(`${file}: expected project knowledge type ${expected}`);
    const index = Object.hasOwn(recordIndexes, meta.type) ? recordIndexes[meta.type] : undefined;
    const id = meta["x-project-id"];
    if (!projectTypes.has(meta.type) && id === undefined) continue;
    if (!present(id) || !/^[A-Z][A-Z0-9-]+$/.test(id) || ids.has(id)) fail(`${file}: missing, invalid or duplicate x-project-id`);
    ids.add(id);
    for (const field of ["type", "title", "description", "x-project-owner"]) {
      if (!present(meta[field])) fail(`${file}: ${field} is required`);
    }
    if (!visible.has(file)) fail(`${file}: link from index.md or a section index linked by it`);
    if (!index) continue;

    directLink(index, file);
    const scope = meta["x-project-scope"];
    if (!Array.isArray(scope) || !scope.length || new Set(scope).size !== scope.length || scope.some((ref) => typeof ref !== "string" || !plainPath.test(ref) || ref === file || !pages.has(ref))) {
      fail(`${file}: x-project-scope must name affected Markdown pages relative to specs`);
    } else {
      for (const ref of scope) directLink(file, ref);
      directLink(scope[0], file);
    }

    const state = meta["x-project-state"];
    const evidence = meta["x-project-evidence"];
    if (meta.type === "ADR") {
      if (!["business", "technical", "mixed"].includes(meta["x-project-domain"])) fail(`${file}: x-project-domain must be business, technical or mixed`);
      if (!["proposed", "accepted", "rejected", "superseded"].includes(state)) fail(`${file}: invalid ADR state`);
      if (state === "accepted" && (!present(evidence) || !decisions.some((decision) => decision?.decision_id === id && Array.isArray(decision.source_refs) && decision.source_refs.includes(file)))) {
        fail(`${file}: accepted ADR requires approval evidence and a matching decision authority entry with this source path`);
      }
      if (state === "superseded") {
        const replacement = meta["x-project-replacement"];
        if (!hasAcceptedReplacement(pages, file)) fail(`${file}: superseded ADR requires a replacement chain ending in an accepted ADR`);
        else {
          directLink(file, replacement);
          directLink(replacement, file);
        }
      }
      if (approved && state === "proposed") fail(`${file}: proposed ADR blocks readiness`);
    } else {
      if (!["open", "deferred", "resolved"].includes(state)) fail(`${file}: invalid Gap state`);
      if (["deferred", "resolved"].includes(state) && !present(evidence)) fail(`${file}: ${state} Gap requires disposition evidence`);
      if (approved && state === "open") fail(`${file}: open Gap blocks readiness`);
    }
  }

  for (const decision of decisions) {
    if (!Array.isArray(decision?.source_refs)) continue;
    for (const ref of decision.source_refs) {
      const adr = pages.get(ref)?.meta;
      if (adr?.type === "ADR" && (adr["x-project-id"] !== decision.decision_id || adr["x-project-state"] !== "accepted")) {
        fail(`${ref}: decision authority must reference an accepted ADR with the matching ID`);
      }
    }
  }

  for (const file of localFiles) {
    if (!file.startsWith("visuals/")) continue;
    if (/\.(svg|png)$/.test(file) && !publishedImages.has(file)) fail(`${file}: diagram export must be embedded with alt text on an owning page`);
    if (file.endsWith(".drawio") && !publishedImages.has(file.replace(/\.drawio$/, ".svg")) && !publishedImages.has(file.replace(/\.drawio$/, ".png"))) {
      fail(`${file}: editable diagram needs an embedded SVG or PNG export`);
    }
  }
}
