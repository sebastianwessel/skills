#!/usr/bin/env node
/** Validate machine-readable implementation evidence before independent review. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const evidenceRoot = path.join(root, "plans", "implementation-evidence");
const errors = [];
const ticketIds = new Set();
const artifactKinds = new Set(["public_type", "schema", "mapper", "module", "generated", "contract", "configuration", "internal", "migration"]);
const statuses = new Set(["implemented", "review_pending"]);
const effects = new Set(["read_only", "local_write", "network", "external_write"]);
const dispositions = new Set(["tested", "reviewed", "migration_owned", "not_applicable"]);
const isList = (value) => Array.isArray(value) && value.length > 0;
const isDigest = (value) => typeof value === "string" && /^sha256:[a-f0-9]{16,}$/i.test(value);
const issue = (file, message) => errors.push(`${path.relative(root, file)}: ${message}`);
const manifestDigest = (file, label) => {
  if (!fs.existsSync(file)) { errors.push(`${label}: missing manifest`); return ""; }
  const match = fs.readFileSync(file, "utf8").match(/^content_digest:\s*(sha256:[a-f0-9]{64})\s*$/mi);
  if (!match) { errors.push(`${label}: missing valid content_digest`); return ""; }
  return match[1];
};
const expectedSpecDigest = manifestDigest(path.join(root, "specs", "spec-manifest.yaml"), "specs/spec-manifest.yaml");
const expectedPlanDigest = manifestDigest(path.join(root, "plans", "plan-manifest.yaml"), "plans/plan-manifest.yaml");

if (!fs.existsSync(evidenceRoot)) {
  errors.push("plans/implementation-evidence: missing implementation evidence directory");
} else {
  const files = fs.readdirSync(evidenceRoot).filter((name) => name.endsWith(".json")).sort();
  if (!files.length) errors.push("plans/implementation-evidence: no ticket evidence manifests");
  for (const name of files) {
    const file = path.join(evidenceRoot, name);
    let data;
    try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch (error) { issue(file, `invalid JSON: ${error.message}`); continue; }
    if (data.version !== 1) issue(file, "version must be 1");
    if (typeof data.ticket_id !== "string" || !data.ticket_id) issue(file, "ticket_id is required");
    else if (ticketIds.has(data.ticket_id)) issue(file, `duplicate ticket_id ${data.ticket_id}`);
    else ticketIds.add(data.ticket_id);
    if (!statuses.has(data.status)) issue(file, "status must be implemented or review_pending; only review may accept work");
    if (!isDigest(data.spec_manifest_digest)) issue(file, "spec_manifest_digest must be sha256:<hex>");
    if (!isDigest(data.plan_manifest_digest)) issue(file, "plan_manifest_digest must be sha256:<hex>");
    if (expectedSpecDigest && data.spec_manifest_digest !== expectedSpecDigest) issue(file, "spec_manifest_digest must match specs/spec-manifest.yaml");
    if (expectedPlanDigest && data.plan_manifest_digest !== expectedPlanDigest) issue(file, "plan_manifest_digest must match plans/plan-manifest.yaml");
    if (!isList(data.changed_artifacts)) issue(file, "changed_artifacts must be a non-empty list");
    for (const [index, artifact] of (data.changed_artifacts || []).entries()) {
      const prefix = `changed_artifacts[${index}]`;
      if (!artifact || typeof artifact !== "object") { issue(file, `${prefix} must be an object`); continue; }
      if (typeof artifact.path !== "string" || !artifact.path || path.isAbsolute(artifact.path) || artifact.path.split("/").includes("..")) issue(file, `${prefix}.path must be a safe repository-relative path`);
      if (!artifactKinds.has(artifact.kind)) issue(file, `${prefix}.kind is invalid`);
      if (!isList(artifact.spec_refs)) issue(file, `${prefix}.spec_refs must be a non-empty list`);
      const reusable = ["public_type", "schema", "mapper", "module", "generated", "contract"].includes(artifact.kind);
      if (reusable && !isList(artifact.asset_refs) && !isList(artifact.module_refs)) issue(file, `${prefix} must reference an approved asset or module`);
      if (isList(artifact.public_symbols) && !isList(artifact.asset_refs)) issue(file, `${prefix}.public_symbols require asset_refs`);
    }
    if (!isList(data.commands)) issue(file, "commands must be a non-empty list");
    for (const [index, command] of (data.commands || []).entries()) {
      const prefix = `commands[${index}]`;
      if (!command || typeof command !== "object" || typeof command.id !== "string" || !command.id || typeof command.command !== "string" || !command.command || !effects.has(command.effect) || typeof command.expected_result !== "string" || !command.expected_result) issue(file, `${prefix} requires id, command, effect, and expected_result`);
      if (["network", "external_write"].includes(command?.effect) && !(typeof command.approval_ref === "string" && command.approval_ref)) issue(file, `${prefix} ${command.effect} requires approval_ref`);
    }
    for (const [index, impact] of (data.consumer_impact || []).entries()) {
      const prefix = `consumer_impact[${index}]`;
      if (!impact || typeof impact !== "object" || typeof impact.asset_or_symbol !== "string" || !impact.asset_or_symbol || !dispositions.has(impact.disposition) || !isList(impact.evidence)) issue(file, `${prefix} requires asset_or_symbol, valid disposition, and evidence`);
      if (impact?.disposition === "not_applicable" && !(typeof impact.reason === "string" && impact.reason)) issue(file, `${prefix}.not_applicable requires reason`);
      if (impact?.disposition !== "not_applicable" && !isList(impact?.consumers)) issue(file, `${prefix} requires consumers unless not_applicable`);
    }
    for (const [index, check] of (data.architecture_checks || []).entries()) {
      if (!check || typeof check.command !== "string" || !check.command || !["passed", "not_applicable"].includes(check.status)) issue(file, `architecture_checks[${index}] requires command and passed/not_applicable status`);
    }
  }
}

if (errors.length) {
  console.log("implementation evidence lint failed");
  errors.forEach((error) => console.log(`- ${error}`));
  process.exit(1);
}
console.log("implementation evidence lint ok");
