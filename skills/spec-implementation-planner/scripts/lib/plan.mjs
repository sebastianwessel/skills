import path from "node:path";
import { parseYaml } from "./simple-yaml.mjs";
import { ticketFiles, ticketPattern } from "./ticket-files.mjs";
import { readSlice, scenarioRows } from "./slice.mjs";
import { insist, isObject, isText, scopePolicy, strings, readProgress, validateProgress } from "./progress.mjs";

const required = ["id", "slice", "size", "depends_on", "write_scope"];
const fields = new Set([...required, "acceptance_ids"]);

function readTickets(root) {
  const tickets = new Map();
  for (const artifact of ticketFiles(root)) {
    const { text } = artifact;
    const frontmatter = /^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/.exec(text);
    insist(frontmatter && text.slice(frontmatter[0].length).trim(), `${artifact.path}: ticket needs YAML frontmatter and a handoff body`);
    const ticket = parseYaml(frontmatter[1], artifact.path);
    insist(isObject(ticket) && required.every((field) => Object.hasOwn(ticket, field)) && Object.keys(ticket).every((field) => fields.has(field)),
      `${artifact.path}: expected fields ${required.join(", ")} and optional acceptance_ids`);
    const id = ticketPattern.exec(path.basename(artifact.path))[1];
    insist(ticket.id === id && !tickets.has(id), `${artifact.path}: mismatched or duplicate ticket id ${ticket.id}`);
    insist(["XS", "S", "M", "L", "XL"].includes(ticket.size), `${id}: size must be XS, S, M, L or XL`);
    strings(ticket.depends_on, `${id}: depends_on`, true);
    strings(ticket.write_scope, `${id}: write_scope`, true);
    insist(isText(ticket.slice), `${id}: expected a slice ID`);
    if (Object.hasOwn(ticket, "acceptance_ids")) strings(ticket.acceptance_ids, `${id}: acceptance_ids`);
    tickets.set(id, { ...ticket, wave: artifact.wave, digest: artifact.digest });
  }
  return tickets;
}

function ticketScope(tickets, records, selected) {
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
  if (selected) visit(tickets.get(selected));
  else {
    for (const ticket of tickets.values()) {
      if (!["accepted", "blocked"].includes(records.get(ticket.id)?.state)) visit(ticket);
    }
  }
  return visited;
}

export function checkPlan(root, selected) {
  const paths = scopePolicy(root);
  const tickets = readTickets(root);
  insist(!selected || tickets.has(selected), `unknown selected ticket: ${selected}`);
  const records = readProgress(root, tickets);
  const scope = ticketScope(tickets, records, selected);
  if (!scope.size) return "plan ok: no open tickets to check";
  const specs = path.join(root, "specs");
  const rows = scenarioRows(specs);
  const slices = new Map();
  for (const id of scope) {
    const ticket = tickets.get(id);
    for (const file of ticket.write_scope) paths.check(file, id);
    if (!slices.has(ticket.slice)) slices.set(ticket.slice, readSlice(specs, ticket.slice, { rows }));
    const { digest, scenarios } = slices.get(ticket.slice);
    ticket.sliceDigest = digest;
    ticket.acceptance_ids ??= [...scenarios];
    for (const scenario of ticket.acceptance_ids) {
      insist(scenarios.has(scenario), `${id}: scenario outside the approved slice: ${scenario}`);
    }
  }
  validateProgress(tickets, records, scope, paths);
  if (!selected) return `plan ok: ${scope.size} ticket(s) including prerequisites, ${slices.size} approved slice(s)`;
  const ticket = tickets.get(selected);
  const sources = [...slices.get(ticket.slice).sources.keys()].sort();
  return [
    `${selected}: ${records.get(selected)?.state ?? "planned"}`,
    `slice_digest: ${ticket.sliceDigest}`,
    `ticket_digest: ${ticket.digest}`,
    "acceptance:",
    ...ticket.acceptance_ids.map((id) => `  ${id} → ${rows.get(id).source}`),
    "governing sources:",
    ...sources.map((source) => `  ${source}`),
  ].join("\n");
}
