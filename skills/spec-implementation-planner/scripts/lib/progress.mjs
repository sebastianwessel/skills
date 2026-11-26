import fs from "node:fs";
import path from "node:path";

export const isText = (value) => typeof value === "string" && value.trim().length > 0;
export const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
export function insist(condition, message) {
  if (!condition) throw new Error(message);
}
export function strings(values, label, empty = false) {
  insist(Array.isArray(values) && (empty || values.length) && values.every(isText), `${label} must be a ${empty ? "" : "nonempty "}list of strings`);
  insist(new Set(values).size === values.length, `${label} contains duplicates`);
  return values;
}
export function safePath(value) {
  return isText(value) && !/[\\:\x00-\x1f]/.test(value) && value.split("/").every((part) => part && part !== "." && part !== "..");
}
// Probe a directory that the validated plan already requires; do not create a test file.
export function scopePolicy(root) {
  const plans = fs.statSync(path.join(root, "plans"));
  const alternate = fs.statSync(path.join(root, "PLANS"), { throwIfNoEntry: false });
  const foldCase = alternate?.dev === plans.dev && alternate?.ino === plans.ino;
  const key = (file) => foldCase ? file.normalize("NFC").toLowerCase() : file;
  function check(file, id) {
    insist(safePath(file) && !/[*?\[\]]/.test(file), `${id}: expected literal repository-relative path: ${file}`);
    const segments = file.split("/");
    insist(![".git", "plans", "specs"].includes(key(segments[0])), `${id}: workflow or Git metadata in write path: ${file}`);
    let target = root;
    for (const [index, segment] of segments.entries()) {
      target = path.join(target, segment);
      const entry = fs.lstatSync(target, { throwIfNoEntry: false });
      if (!entry) break; // The ticket can create new files or record removals.
      insist(!entry.isSymbolicLink(), `${id}: symlink in write path: ${file}`);
      insist(index === segments.length - 1 || entry.isDirectory(), `${id}: non-directory ancestor in write path: ${file}`);
    }
  }
  function contains(scope, file) {
    const prefix = key(scope);
    const candidate = key(file);
    return candidate === prefix || candidate.startsWith(prefix + "/");
  }
  return { check, contains };
}

const states = new Set(["ready", "in_progress", "blocked", "partial", "implemented", "accepted", "skipped"]);
const requireAcceptedDeps = new Set(["ready", "in_progress", "implemented", "accepted"]);

function validateRecord(ticket, record, specDigest, paths) {
  const { id } = ticket;
  insist(isObject(record) && states.has(record.state), `${id}: invalid progress state`);
  insist(record.spec_digest === specDigest && record.ticket_digest === ticket.digest, `${id}: stale progress; inspect affected work before recording fresh evidence`);
  if (["blocked", "partial", "skipped"].includes(record.state)) insist(isText(record.note), `${id}: ${record.state} needs a note`);
  if (record.state !== "implemented" && record.state !== "accepted") return;
  const implementation = record.implementation;
  insist(isObject(implementation) && isText(implementation.revision) && isText(implementation.by), `${id}: implementation needs by and revision`);
  const files = strings(implementation.changed_files, `${id}: implementation.changed_files`, true);
  insist(files.length || isText(record.note), `${id}: explain evidence-only work in note for empty changed_files`);
  for (const file of files) {
    paths.check(file, id);
    insist(ticket.write_scope.some((scope) => paths.contains(scope, file)), `${id}: changed file outside write_scope: ${file}`);
  }
  const accepted = implementation.acceptance;
  insist(isObject(accepted) && Object.keys(accepted).length === ticket.acceptance_ids.length &&
    ticket.acceptance_ids.every((key) => Object.hasOwn(accepted, key) && isText(accepted[key])),
    `${id}: implementation.acceptance needs evidence for exactly the ticket's scenarios`);
  strings(implementation.verification, `${id}: implementation.verification`);
  insist(isText(implementation.test_first_ref), `${id}: implementation.test_first_ref required`);
  if (record.state === "accepted") {
    const review = record.review;
    insist(isObject(review) && isText(review.reviewer) && isText(review.evidence_ref), `${id}: independent review requires reviewer and evidence_ref`);
    insist(review.reviewer.trim().toLowerCase() !== implementation.by.trim().toLowerCase(), `${id}: independent reviewer must differ from implementer`);
    insist(review.revision === implementation.revision, `${id}: reviewed revision differs from implementation revision`);
  }
}

export function validateProgress(root, tickets, specDigest, selected, paths) {
  const scope = new Set();
  function include(id) {
    if (scope.has(id)) return;
    scope.add(id);
    for (const dependency of tickets.get(id).depends_on) include(dependency);
  }
  if (selected) include(selected);
  else for (const id of tickets.keys()) include(id);

  const records = new Map();
  const dir = path.join(root, "plans", "progress");
  if (fs.existsSync(dir)) {
    insist(fs.lstatSync(dir).isDirectory(), "expected regular plans/progress directory");
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const id = path.basename(entry.name, ".json");
      insist(entry.isFile() && entry.name === id + ".json" && tickets.has(id), `unknown progress file: ${entry.name}`);
      let record;
      try { record = JSON.parse(fs.readFileSync(path.join(dir, entry.name), "utf8")); }
      catch { throw new Error(`${entry.name}: invalid progress JSON; cannot establish active writes`); }
      records.set(id, record);
      if (scope.has(id)) validateRecord(tickets.get(id), record, specDigest, paths);
    }
  }
  for (const id of scope) {
    if (!requireAcceptedDeps.has(records.get(id)?.state)) continue;
    const dependencies = tickets.get(id).depends_on;
    const record = records.get(id);
    for (const dependency of dependencies) {
      insist(records.get(dependency)?.state === "accepted", `${id}: dependency ${dependency} must be accepted`);
    }
    const revisions = record.dependency_revisions ?? {};
    insist(isObject(revisions) && Object.keys(revisions).length === dependencies.length,
      `${id}: dependency_revisions must pin exactly its prerequisites`);
    for (const dependency of dependencies) {
      insist(Object.hasOwn(revisions, dependency) && revisions[dependency] === records.get(dependency).implementation.revision,
        `${id}: stale or missing accepted revision for dependency ${dependency}`);
    }
  }
  const active = [...records].filter(([, record]) => record?.state === "in_progress").map(([id]) => tickets.get(id));
  for (let i = 0; i < active.length; i++) {
    for (const other of active.slice(i + 1)) {
      const first = active[i];
      if (!scope.has(first.id) && !scope.has(other.id)) continue;
      const overlaps = first.write_scope.some((left) => other.write_scope.some((right) => paths.contains(left, right) || paths.contains(right, left)));
      insist(!overlaps, `${first.id} and ${other.id} have overlapping in_progress write scopes`);
    }
  }
  return records;
}
