import fs from "node:fs";
import path from "node:path";
import { markdownAnchors } from "./markdown.mjs";
import { parseYaml } from "./simple-yaml.mjs";
import { readPlanSnapshot, serializeManifest, ticketPattern } from "./plan-snapshot.mjs";
import { insist, isObject, isText, scopePolicy, safePath, strings, validateProgress } from "./progress.mjs";

const read = (file) => fs.readFileSync(file, "utf8");
const readYaml = (root, file) => parseYaml(read(path.join(root, file)), file);
const fields = ["id", "size", "depends_on", "write_scope", "spec_refs", "acceptance_ids"];

export function sourceDigest(root) {
  const manifest = readYaml(root, "specs/spec-manifest.yaml");
  const report = readYaml(root, "specs/.readiness-report.yaml");
  const digest = manifest.content_digest;
  insist(manifest.spec_manifest_version === 2 && /^sha256:[a-f0-9]{64}$/.test(digest), "invalid spec manifest");
  insist(report.status === "approved" && report.approval_evidence?.scope === "whole_bundle" &&
    report.approval_evidence.manifest_digest === digest && report.semantic_judge_evidence?.status === "passed" &&
    report.semantic_judge_evidence.manifest_digest === digest, "approved readiness for this spec digest is required");
  return digest;
}

function checkReference(root, ref, label) {
  const [relative, anchor, extra] = ref.split("#");
  insist(safePath(relative) && relative.endsWith(".md") && isText(anchor) && extra === undefined, `${label}: expected spec-root-relative Markdown path#anchor: ${ref}`);
  const file = path.join(root, "specs", relative);
  insist(fs.existsSync(file) && fs.lstatSync(file).isFile(), `${label}: missing spec file ${relative}`);
  insist(markdownAnchors(read(file)).get(anchor) === 1, `${label}: missing or ambiguous Markdown anchor ${ref}`);
}

function readScenarios(root) {
  const { scenarios } = readYaml(root, "specs/acceptance.yaml");
  insist(Array.isArray(scenarios) && scenarios.length, "specs/acceptance.yaml: scenarios required");
  const ids = scenarios.map((row) => row?.id);
  return new Set(strings(ids, "specs/acceptance.yaml scenario IDs"));
}

function readTickets(root, artifacts, scenarios, paths) {
  const tickets = new Map();
  for (const artifact of artifacts) {
    if (!artifact.path.includes("/tickets/")) continue;
    const text = read(path.join(root, "plans", artifact.path));
    const frontmatter = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/.exec(text);
    insist(frontmatter && text.slice(frontmatter[0].length).trim(), `${artifact.path}: ticket needs YAML frontmatter and a handoff body`);
    const ticket = parseYaml(frontmatter[1], artifact.path);
    insist(isObject(ticket) && fields.every((field) => Object.hasOwn(ticket, field)) && Object.keys(ticket).length === fields.length,
      `${artifact.path}: expected fields ${fields.join(", ")}`);
    const id = ticketPattern.exec(path.basename(artifact.path))[1];
    insist(ticket.id === id && !tickets.has(id), `${artifact.path}: mismatched or duplicate ticket id ${ticket.id}`);
    insist(["XS", "S", "M", "L", "XL"].includes(ticket.size), `${id}: size must be XS, S, M, L or XL`);
    strings(ticket.depends_on, `${id}: depends_on`, true);
    for (const scope of strings(ticket.write_scope, `${id}: write_scope`, true)) {
      paths.check(scope, id);
    }
    for (const ref of strings(ticket.spec_refs, `${id}: spec_refs`)) checkReference(root, ref, id);
    for (const scenario of strings(ticket.acceptance_ids, `${id}: acceptance_ids`)) {
      insist(scenarios.has(scenario), `${id}: unknown acceptance scenario ${scenario}`);
    }
    tickets.set(id, { ...ticket, wave: Number(artifact.path.split("_")[1]), digest: artifact.sha256 });
  }
  return tickets;
}

function checkDependencies(tickets) {
  const visited = new Set();
  const visiting = new Set();
  function visit(ticket) {
    if (visited.has(ticket.id)) return;
    insist(!visiting.has(ticket.id), `dependency cycle at ${ticket.id}`);
    visiting.add(ticket.id);
    for (const id of ticket.depends_on) {
      const dependency = tickets.get(id);
      insist(dependency, `${ticket.id}: unknown dependency ${id}`);
      insist(dependency.wave <= ticket.wave, `${ticket.id}: later-wave dependency ${id}`);
      visit(dependency);
    }
    visiting.delete(ticket.id);
    visited.add(ticket.id);
  }
  for (const ticket of tickets.values()) visit(ticket);
}

export function checkPlan(root, selected) {
  const digest = sourceDigest(root);
  const snapshot = readPlanSnapshot(root);
  const manifest = path.join(root, "plans", "plan-manifest.yaml");
  insist(fs.existsSync(manifest) && read(manifest).replace(/\r\n/g, "\n") === serializeManifest(digest, snapshot),
    "stale or missing plan manifest; inspect definition changes before regenerating");
  const scenarios = readScenarios(root);
  const paths = scopePolicy(root);
  const tickets = readTickets(root, snapshot.artifacts, scenarios, paths);
  insist(!selected || tickets.has(selected), `unknown selected ticket: ${selected}`);
  checkDependencies(tickets);
  const records = validateProgress(root, tickets, digest, selected, paths);
  const covered = new Set([...tickets.values()].filter((ticket) => records.get(ticket.id)?.state !== "skipped").flatMap((ticket) => ticket.acceptance_ids));
  for (const id of scenarios) insist(covered.has(id), `acceptance scenario lacks a non-skipped ticket: ${id}`);
  if (!selected) return `plan ok: ${tickets.size} ticket(s), ${scenarios.size} scenario(s)`;
  return `${selected}: ${records.get(selected)?.state ?? "planned"}\nspec_digest: ${digest}\nticket_digest: ${tickets.get(selected).digest}`;
}
