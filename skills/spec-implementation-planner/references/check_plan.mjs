#!/usr/bin/env node
/**
 * Structural plan checker for the deliberately small YAML subset documented in
 * planning-gates.md. It rejects YAML features that make a plan ambiguous to an
 * implementation agent: anchors, aliases, multiline scalars, merge keys, and
 * duplicate keys.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const plansName = process.argv[3] || "plans";
const specsName = process.argv[4] || "specs";
const plans = path.join(root, plansName);
const specs = path.join(root, specsName);
const problems = [];
const fail = (message) => problems.push(message);
const exists = (file) => fs.existsSync(file);
const read = (file) => exists(file) ? fs.readFileSync(file, "utf8") : "";
const hash = (content) => `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const asList = (value) => Array.isArray(value) ? value : [];
const asString = (value) => typeof value === "string" ? value : "";
const ids = (values) => asList(values).map(String);
const sorted = (values) => [...values].sort();
const exactSet = (left, right) => left.length === right.length && left.every((item) => right.includes(item));
const overlaps = (a, b) => {
  const left = a.replace(/\/$/, "");
  const right = b.replace(/\/$/, "");
  return left && right && (left === right || left.startsWith(`${right}/`) || right.startsWith(`${left}/`));
};
const scopeContains = (scope, file) => {
  const root = scope.replace(/\/$/, "");
  return file === root || file.startsWith(`${root}/`);
};
const walk = (dir) => exists(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
}) : [];
const planRelative = (file) => path.relative(plans, file).split(path.sep).join("/");
const excludedPlanArtifact = (file) => file === "plan-manifest.yaml" || /^(?:review|reviews|evidence|implementation-evidence)(?:\/|$)/.test(file);
const canonicalPlanText = (file, content) => {
  const normalized = content.replace(/\r\n?/g, "\n");
  return file.endsWith(".md") && file.includes("/tickets/")
    ? normalized.replace(/^plan_manifest_digest:\s*.*(?:\n|$)/m, "")
    : normalized;
};

function parseScalar(value, label, line) {
  if (!value) return "";
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === "true";
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value === "null" || value === "~") return null;
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => parseScalar(item.trim(), label, line));
  }
  if (value.startsWith("{")) throw new Error(`${label}:${line}: flow mappings are not allowed`);
  if (/[|>]/.test(value.slice(0, 1))) throw new Error(`${label}:${line}: multiline scalars are not allowed`);
  return value.replace(/\s+#.*$/, "").trim();
}

/** Parse mappings/lists with two-space indentation and no YAML implicit magic. */
function parseYaml(text, label) {
  const tokens = [];
  for (const [index, raw] of text.replace(/\r/g, "").split("\n").entries()) {
    const line = index + 1;
    if (!raw.trim() || /^\s*#/.test(raw)) continue;
    if (/\t/.test(raw)) throw new Error(`${label}:${line}: tabs are not allowed`);
    const match = raw.match(/^( *)(.*)$/);
    if (match[1].length % 2) throw new Error(`${label}:${line}: indentation must use two-space units`);
    if (/(^|\s)[&*][\w-]+|^<<:/.test(match[2])) throw new Error(`${label}:${line}: anchors, aliases, and merges are not allowed`);
    tokens.push({ indent: match[1].length, content: match[2], line });
  }
  let cursor = 0;
  const parseBlock = (indent) => {
    if (cursor >= tokens.length || tokens[cursor].indent < indent) return undefined;
    if (tokens[cursor].indent !== indent) throw new Error(`${label}:${tokens[cursor].line}: unexpected indentation`);
    const listMode = tokens[cursor].content.startsWith("-");
    const result = listMode ? [] : {};
    const keys = new Set();
    while (cursor < tokens.length && tokens[cursor].indent === indent) {
      const token = tokens[cursor++];
      if (listMode) {
        if (!token.content.startsWith("- ")) throw new Error(`${label}:${token.line}: list item required`);
        const rest = token.content.slice(2).trim();
        if (!rest) {
          if (cursor >= tokens.length || tokens[cursor].indent <= indent) throw new Error(`${label}:${token.line}: empty list item`);
          result.push(parseBlock(tokens[cursor].indent));
          continue;
        }
        const first = rest.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
        if (!first) { result.push(parseScalar(rest, label, token.line)); continue; }
        const item = {};
        item[first[1]] = first[2] ? parseScalar(first[2], label, token.line) : (cursor < tokens.length && tokens[cursor].indent > indent ? parseBlock(tokens[cursor].indent) : null);
        while (cursor < tokens.length && tokens[cursor].indent > indent) {
          if (tokens[cursor].indent !== indent + 2) throw new Error(`${label}:${tokens[cursor].line}: list map fields must be indented two spaces`);
          const next = tokens[cursor++];
          const mapping = next.content.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
          if (!mapping) throw new Error(`${label}:${next.line}: mapping field required`);
          if (Object.hasOwn(item, mapping[1])) throw new Error(`${label}:${next.line}: duplicate key ${mapping[1]}`);
          item[mapping[1]] = mapping[2] ? parseScalar(mapping[2], label, next.line) : (cursor < tokens.length && tokens[cursor].indent > next.indent ? parseBlock(tokens[cursor].indent) : null);
        }
        result.push(item);
      } else {
        if (token.content.startsWith("-")) throw new Error(`${label}:${token.line}: mapping field required`);
        const mapping = token.content.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
        if (!mapping) throw new Error(`${label}:${token.line}: invalid mapping field`);
        if (keys.has(mapping[1])) throw new Error(`${label}:${token.line}: duplicate key ${mapping[1]}`);
        keys.add(mapping[1]);
        result[mapping[1]] = mapping[2] ? parseScalar(mapping[2], label, token.line) : (cursor < tokens.length && tokens[cursor].indent > indent ? parseBlock(tokens[cursor].indent) : null);
      }
    }
    return result;
  };
  if (!tokens.length) return {};
  const parsed = parseBlock(0);
  if (cursor !== tokens.length) throw new Error(`${label}:${tokens[cursor].line}: trailing invalid YAML`);
  return parsed;
}

function frontmatter(text, label) {
  const normalized = text.replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) throw new Error(`${label}: missing YAML frontmatter`);
  const close = normalized.indexOf("\n---\n", 4);
  if (close < 0) throw new Error(`${label}: unterminated YAML frontmatter`);
  return { data: parseYaml(normalized.slice(4, close), label), body: normalized.slice(close + 5) };
}

function section(body, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = body.match(new RegExp(`(^|\\n)## ${escaped}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`));
  return match ? match[2].trim() : "";
}

function requiredObject(value, label) {
  if (!isObject(value)) fail(`${label}: expected mapping`);
  return isObject(value) ? value : {};
}

function requiredList(value, label, { empty = false } = {}) {
  if (!Array.isArray(value)) { fail(`${label}: expected list`); return []; }
  if (!empty && value.length === 0) fail(`${label}: must not be empty`);
  return value;
}

function requireFields(object, fields, label) {
  for (const field of fields) if (!Object.hasOwn(object, field)) fail(`${label}: missing ${field}`);
}

function noUnknownFields(object, allowed, label) {
  for (const key of Object.keys(object)) if (!allowed.includes(key)) fail(`${label}: unknown field ${key}`);
}

function validRef(ref, label, { requiredAnchor = false } = {}) {
  if (typeof ref !== "string" || !ref.trim()) { fail(`${label}: invalid reference`); return false; }
  const [target, anchor] = ref.split("#", 2);
  if (!target.startsWith(`${specsName}/`)) { fail(`${label}: must start with ${specsName}/`); return false; }
  const absolute = path.join(root, target);
  if (!exists(absolute)) { fail(`${label}: missing ${ref}`); return false; }
  if (requiredAnchor && !anchor) { fail(`${label}: anchor required for ${ref}`); return false; }
  if (anchor && !read(absolute).includes(anchor)) { fail(`${label}: missing anchor ${ref}`); return false; }
  return true;
}

function uniqueIds(items, label) {
  const found = new Set();
  for (const item of items) {
    const id = asString(isObject(item) ? item.id : "");
    if (!id) { fail(`${label}: item missing id`); continue; }
    if (found.has(id)) fail(`${label}: duplicate id ${id}`);
    found.add(id);
  }
  return found;
}

const lifecycle = ["planned", "ready", "in_progress", "partial", "blocked", "implemented", "review_pending", "accepted", "skipped"];
const executableLifecycle = new Set(["ready", "in_progress"]);
const sliceTypes = new Set(["vertical_slice", "foundation_exception", "refactor_exception", "remediation", "migration"]);
const unsafeCommand = /[;&|`$()<>]|^\s*(?:sh|bash|zsh|fish|cmd|powershell)\b|^\s*[A-Za-z_][A-Za-z0-9_]*=|\b(?:curl|wget|ssh|scp)\b|\bgit\s+(?:clone|fetch|pull|push)\b|\b(?:npm|pnpm|yarn)\s+(?:install|add|upgrade)\b|\b(?:pip|pip3)\s+install\b|\bgo\s+get\b|\bcargo\s+(?:install|add)\b/i;
const requiredSections = ["Goal", "Context Digest", "Implementation Approach", "Decision Ledger", "Action Plan", "Requirements Traceability", "Contract Traceability", "Spec Drift Controls", "Generator And Type Plan", "Test-First Order", "Modularity And Reuse Plan", "Representation Reuse Plan", "Slice Strategy", "Tasks", "Acceptance", "Acceptance Test Matrix", "End-To-End Definition Coverage", "Operational Path Coverage", "Review And Verification Plan", "Verification", "Non-goals", "Handoff"];

const plan = read(path.join(plans, "implementation-plan.md"));
const specReady = read(path.join(specs, ".readiness-report.yaml"));
const specManifest = read(path.join(specs, "spec-manifest.yaml"));
const traceabilityText = read(path.join(specs, "00-traceability.yaml"));
const planManifestText = read(path.join(plans, "plan-manifest.yaml"));
if (!plan) fail("plans/: missing implementation-plan.md");
for (const file of ["_registry.yaml", "_status.yaml", "_dependencies.yaml", "_scope.yaml"]) if (plan && !exists(path.join(plans, file))) fail(`plans/: missing ${file}`);
let readiness = {}, manifest = {}, traceability = {}, planManifest = {};
try { readiness = parseYaml(specReady, `${specsName}/.readiness-report.yaml`); }
catch (error) { fail(error.message); }
try { manifest = parseYaml(specManifest, `${specsName}/spec-manifest.yaml`); }
catch (error) { fail(error.message); }
try { traceability = parseYaml(traceabilityText, `${specsName}/00-traceability.yaml`); }
catch (error) { fail(error.message); }
try { planManifest = parseYaml(planManifestText, `${plansName}/plan-manifest.yaml`); }
catch (error) { fail(error.message); }
const manifestDigest = asString(manifest.content_digest);
const planManifestDigest = asString(planManifest.content_digest);
const approvalEvidence = isObject(readiness.approval_evidence) ? readiness.approval_evidence : {};
if (plan && readiness.status !== "approved") fail(`${specsName}/.readiness-report.yaml: status must be approved`);
if (plan && readiness.human_approval?.status !== "approved") fail(`${specsName}/.readiness-report.yaml: human approval required`);
if (plan && manifest.spec_manifest_version !== 1) fail(`${specsName}/spec-manifest.yaml: spec_manifest_version must be 1`);
if (plan && !Array.isArray(manifest.artifacts)) fail(`${specsName}/spec-manifest.yaml: artifacts must be a list`);
if (plan && !/^sha256:[a-f0-9]{64}$/.test(manifestDigest)) fail(`${specsName}/spec-manifest.yaml: content_digest must be a sha256 digest`);
if (plan && approvalEvidence.status !== "approved") fail(`${specsName}/.readiness-report.yaml: approval_evidence.status must be approved`);
if (plan && approvalEvidence.manifest_digest !== manifestDigest) fail(`${specsName}/.readiness-report.yaml: approval_evidence.manifest_digest must equal spec-manifest.yaml.content_digest`);
if (plan && !exists(path.join(specs, "00-traceability.yaml"))) fail(`${specsName}/: missing 00-traceability.yaml`);
if (plan && traceability.traceability_version !== 1) fail(`${specsName}/00-traceability.yaml: traceability_version must be 1`);
const traceabilityIds = {};
for (const [plural, idField] of [["requirements", "requirement_id"], ["capabilities", "capability_id"], ["paths", "path_id"], ["acceptance", "acceptance_id"]]) {
  const seen = new Set();
  const rows = requiredList(traceability[plural], `${specsName}/00-traceability.yaml.${plural}`);
  for (const row of rows) {
    const id = asString(isObject(row) ? row[idField] : "");
    if (!id) fail(`${specsName}/00-traceability.yaml.${plural}: item missing ${idField}`);
    else if (seen.has(id)) fail(`${specsName}/00-traceability.yaml.${plural}: duplicate ${idField} ${id}`);
    else seen.add(id);
  }
  traceabilityIds[plural] = seen;
}
if (plan && planManifest.plan_manifest_version !== 1) fail(`${plansName}/plan-manifest.yaml: plan_manifest_version must be 1`);
if (plan && !/^sha256:[a-f0-9]{64}$/.test(planManifestDigest)) fail(`${plansName}/plan-manifest.yaml: content_digest must be a sha256 digest`);
if (plan && planManifest.source_spec_manifest_digest !== manifestDigest) fail(`${plansName}/plan-manifest.yaml: source_spec_manifest_digest must equal spec-manifest.yaml.content_digest`);
const planProvenance = isObject(planManifest.provenance) ? planManifest.provenance : {};
if (plan && (!asString(planProvenance.generated_at) || Number.isNaN(Date.parse(planProvenance.generated_at)) || planProvenance.generator !== "plan-manifest/v1")) fail(`${plansName}/plan-manifest.yaml: provenance requires ISO generated_at and generator: plan-manifest/v1`);
const planArtifacts = walk(plans).map((file) => ({ file, path: planRelative(file) })).filter((entry) => !excludedPlanArtifact(entry.path)).sort((left, right) => left.path.localeCompare(right.path));
const suppliedPlanArtifacts = new Map();
for (const artifact of asList(planManifest.artifacts)) {
  if (!isObject(artifact) || !asString(artifact.path) || !/^sha256:[a-f0-9]{64}$/.test(asString(artifact.sha256))) { fail(`${plansName}/plan-manifest.yaml: artifacts require path and sha256`); continue; }
  if (suppliedPlanArtifacts.has(artifact.path)) fail(`${plansName}/plan-manifest.yaml: duplicate artifact ${artifact.path}`);
  suppliedPlanArtifacts.set(artifact.path, artifact.sha256);
}
if (plan && !exactSet(sorted(planArtifacts.map((artifact) => artifact.path)), sorted([...suppliedPlanArtifacts.keys()]))) fail(`${plansName}/plan-manifest.yaml: artifacts must exactly cover canonical plan files`);
const expectedPlanRecords = [];
for (const artifact of planArtifacts) {
  const digest = hash(canonicalPlanText(artifact.path, read(artifact.file)));
  if (suppliedPlanArtifacts.get(artifact.path) !== digest) fail(`${plansName}/plan-manifest.yaml: artifact digest differs for ${artifact.path}`);
  expectedPlanRecords.push(`${artifact.path}\0${digest}\n`);
}
if (plan && planManifestDigest !== hash(expectedPlanRecords.join(""))) fail(`${plansName}/plan-manifest.yaml: content_digest does not match canonical plan artifacts`);
if (plan && /Wave 0|Spec and Contract Closure|build-blocking gaps/i.test(plan)) fail("implementation-plan.md: forbidden spec-closure wave");
if (plan && !section(plan, "Self-Audit")) fail("implementation-plan.md: missing Self-Audit");

let registry = {}, statusIndex = {}, dependencyIndex = {}, scopeIndex = {};
for (const [file, assign] of [["_registry.yaml", (value) => { registry = value; }], ["_status.yaml", (value) => { statusIndex = value; }], ["_dependencies.yaml", (value) => { dependencyIndex = value; }], ["_scope.yaml", (value) => { scopeIndex = value; }]]) {
  const absolute = path.join(plans, file);
  if (!exists(absolute)) continue;
  try { assign(parseYaml(read(absolute), `plans/${file}`)); }
  catch (error) { fail(error.message); }
}
registry = requiredObject(registry.tickets, "_registry.yaml.tickets");
statusIndex = requiredObject(statusIndex.tickets, "_status.yaml.tickets");
dependencyIndex = requiredObject(dependencyIndex.tickets, "_dependencies.yaml.tickets");
scopeIndex = requiredObject(scopeIndex.tickets, "_scope.yaml.tickets");

const tickets = new Map();
const parallelGroups = new Map();
const catalogs = new Map();
for (const file of walk(plans).filter((item) => item.endsWith(".md") && item.includes(`${path.sep}tickets${path.sep}`))) {
  const relative = path.relative(plans, file).split(path.sep).join("/");
  let data, body;
  try { ({ data, body } = frontmatter(read(file), relative)); }
  catch (error) { fail(error.message); continue; }
  const fields = ["id", "title", "wave", "lifecycle", "spec_manifest_digest", "plan_manifest_digest", "parallel_group", "depends_on", "blocked_by", "spec_refs", "traceability", "write_scope", "read_scope", "contract_readiness", "generated_contracts", "ticket_readiness", "slice_type", "phase_gate_exception", "representation_reuse", "autonomy", "verification_commands", "action_steps", "acceptance"];
  requireFields(data, fields, relative);
  noUnknownFields(data, fields, relative);
  const id = asString(data.id);
  const state = asString(data.lifecycle);
  const active = executableLifecycle.has(state);
  if (!/^TICKET-\d{3,}$/.test(id)) fail(`${relative}: id must be TICKET-NNN`);
  if (!lifecycle.includes(state)) fail(`${relative}: invalid lifecycle ${state}`);
  if (data.spec_manifest_digest !== manifestDigest) fail(`${relative}: spec_manifest_digest must equal spec-manifest.yaml.content_digest`);
  if (data.plan_manifest_digest !== planManifestDigest) fail(`${relative}: plan_manifest_digest must equal plan-manifest.yaml.content_digest`);
  if (!sliceTypes.has(data.slice_type)) fail(`${relative}: invalid slice_type ${data.slice_type}`);
  if (typeof data.phase_gate_exception !== "boolean") fail(`${relative}: phase_gate_exception must be boolean`);
  if (active && data.phase_gate_exception && !/Phase Gate:/i.test(section(body, "Action Plan"))) fail(`${relative}: phase_gate_exception requires explicit Phase Gate proof points in Action Plan`);
  if (!Number.isInteger(data.wave) || data.wave < 1) fail(`${relative}: wave must be a positive integer`);
  if (tickets.has(id)) fail(`${relative}: duplicate ticket id ${id}`);
  for (const name of requiredSections) if (!section(body, name)) fail(`${relative}: missing or empty ${name}`);
  const refs = requiredList(data.spec_refs, `${relative}.spec_refs`);
  for (const ref of refs) validRef(ref, `${relative}.spec_refs`, { requiredAnchor: true });
  const trace = requiredObject(data.traceability, `${relative}.traceability`);
  requireFields(trace, ["requirement_ids", "capability_ids", "path_ids", "acceptance_ids"], `${relative}.traceability`);
  const ticketTraceability = {};
  for (const [field, source] of [["requirement_ids", "requirements"], ["capability_ids", "capabilities"], ["path_ids", "paths"], ["acceptance_ids", "acceptance"]]) {
    const values = requiredList(trace[field], `${relative}.traceability.${field}`, { empty: state === "skipped" });
    const seen = new Set();
    for (const value of values) {
      const id = asString(value);
      if (!id || !traceabilityIds[source].has(id)) fail(`${relative}: unknown traceability ${field} ID ${id || "<empty>"}`);
      else if (seen.has(id)) fail(`${relative}: duplicate traceability ${field} ID ${id}`);
      else seen.add(id);
    }
    ticketTraceability[field] = seen;
  }
  const writes = requiredList(data.write_scope, `${relative}.write_scope`);
  const reads = requiredList(data.read_scope, `${relative}.read_scope`);
  for (const scope of [...writes, ...reads]) if (typeof scope !== "string" || !scope || path.isAbsolute(scope) || scope.includes("..")) fail(`${relative}: unsafe scope ${scope}`);
  const contract = requiredObject(data.contract_readiness, `${relative}.contract_readiness`);
  requireFields(contract, ["status", "required_contracts", "missing_contracts"], `${relative}.contract_readiness`);
  if (active && contract.status !== "ready") fail(`${relative}: contract_readiness.status must be ready`);
  if (active) requiredList(contract.required_contracts, `${relative}.contract_readiness.required_contracts`);
  if (requiredList(contract.missing_contracts, `${relative}.contract_readiness.missing_contracts`, { empty: true }).length) fail(`${relative}: missing_contracts must be empty`);
  const readiness = requiredObject(data.ticket_readiness, `${relative}.ticket_readiness`);
  requireFields(readiness, ["status", "open_decisions", "ambiguous_phrases"], `${relative}.ticket_readiness`);
  if (active && readiness.status !== "implementation_ready") fail(`${relative}: ticket_readiness.status must be implementation_ready`);
  if (requiredList(readiness.open_decisions, `${relative}.ticket_readiness.open_decisions`, { empty: true }).length) fail(`${relative}: open_decisions must be empty`);
  if (requiredList(readiness.ambiguous_phrases, `${relative}.ticket_readiness.ambiguous_phrases`, { empty: true }).length) fail(`${relative}: ambiguous_phrases must be empty`);
  const autonomy = requiredObject(data.autonomy, `${relative}.autonomy`);
  requireFields(autonomy, ["allowed_classes", "convention_refs", "approved_decision_refs", "escalation"], `${relative}.autonomy`);
  const allowed = requiredList(autonomy.allowed_classes, `${relative}.autonomy.allowed_classes`);
  if (active && (!allowed.includes("D0") || allowed.some((value) => !["D0", "D1"].includes(value)))) fail(`${relative}: executable tickets allow only D0 and optional D1 autonomy`);
  if (allowed.includes("D1") && !requiredList(autonomy.convention_refs, `${relative}.autonomy.convention_refs`).length) fail(`${relative}: D1 requires convention_refs`);
  if (autonomy.escalation !== "blocker") fail(`${relative}: autonomy.escalation must be blocker`);
  for (const ref of requiredList(autonomy.convention_refs, `${relative}.autonomy.convention_refs`, { empty: true })) validRef(ref, `${relative}.autonomy.convention_refs`, { requiredAnchor: true });
  for (const ref of requiredList(autonomy.approved_decision_refs, `${relative}.autonomy.approved_decision_refs`, { empty: true })) validRef(ref, `${relative}.autonomy.approved_decision_refs`, { requiredAnchor: true });
  const commands = requiredObject(data.verification_commands, `${relative}.verification_commands`);
  if (active && !Object.keys(commands).length) fail(`${relative}: verification_commands must not be empty`);
  for (const [commandId, command] of Object.entries(commands)) {
    if (!/^CMD-[A-Z0-9_-]+$/.test(commandId)) fail(`${relative}: verification command ID must be CMD-* (${commandId})`);
    const metadata = requiredObject(command, `${relative}.verification_commands.${commandId}`);
    requireFields(metadata, ["command", "purpose", "expected", "network", "writes", "secrets"], `${relative}.verification_commands.${commandId}`);
    if (!asString(metadata.command) || unsafeCommand.test(asString(metadata.command))) fail(`${relative}: unsafe command metadata ${commandId}`);
    if (!["pass", "fail_before_implementation", "record_only"].includes(metadata.expected)) fail(`${relative}: invalid expected outcome for ${commandId}`);
    if (metadata.network !== "forbidden") fail(`${relative}: ${commandId} must forbid network; external verification needs a separate approved ticket`);
    if (!["read_only", "workspace_only"].includes(metadata.writes)) fail(`${relative}: invalid writes policy for ${commandId}`);
    if (metadata.secrets !== "forbidden") fail(`${relative}: ${commandId} must forbid secrets`);
  }
  const actionSteps = requiredList(data.action_steps, `${relative}.action_steps`);
  const actionIds = uniqueIds(actionSteps, `${relative}.action_steps`);
  const actionKinds = new Set();
  const actionKindOrder = [];
  for (const step of actionSteps) {
    const item = requiredObject(step, `${relative}.action_steps`);
    requireFields(item, ["id", "kind", "files", "command_refs", "acceptance_refs", "expected_proof"], `${relative}.action_steps.${item.id || "?"}`);
    if (!["preflight", "contract", "test", "implement", "verify", "handoff"].includes(item.kind)) fail(`${relative}: action step ${item.id} has invalid kind`);
    actionKinds.add(item.kind);
    actionKindOrder.push(item.kind);
    const files = requiredList(item.files, `${relative}.action_steps.${item.id}.files`, { empty: item.kind === "handoff" });
    for (const actionFile of files) {
      if (typeof actionFile !== "string" || !actionFile || path.isAbsolute(actionFile) || actionFile.includes("..")) fail(`${relative}: unsafe action file ${actionFile}`);
      const allowedScopes = item.kind === "implement" ? writes : [...writes, ...reads];
      if (!allowedScopes.some((scope) => scopeContains(scope, actionFile))) fail(`${relative}: action step ${item.id} file outside allowed scope ${actionFile}`);
    }
    for (const commandRef of requiredList(item.command_refs, `${relative}.action_steps.${item.id}.command_refs`, { empty: item.kind === "implement" || item.kind === "handoff" })) if (!Object.hasOwn(commands, commandRef)) fail(`${relative}: action step ${item.id} references missing command ${commandRef}`);
  }
  for (const kind of ["preflight", "contract", "test", "implement", "verify", "handoff"]) if (active && !actionKinds.has(kind)) fail(`${relative}: action_steps missing ${kind}`);
  if (active) {
    const before = (left, right) => actionKindOrder.indexOf(left) < actionKindOrder.indexOf(right);
    for (const [left, right] of [["preflight", "contract"], ["contract", "test"], ["test", "implement"], ["implement", "verify"], ["verify", "handoff"]]) if (!before(left, right)) fail(`${relative}: action_steps must place ${left} before ${right}`);
  }
  const acceptance = requiredList(data.acceptance, `${relative}.acceptance`);
  const acceptanceIds = uniqueIds(acceptance, `${relative}.acceptance`);
  const localTraceabilityAcceptance = new Set();
  for (const row of acceptance) {
    const item = requiredObject(row, `${relative}.acceptance`);
    requireFields(item, ["id", "traceability_acceptance_ids", "requirement_refs", "test_refs", "command_refs", "expected_outcome", "lifecycle"], `${relative}.acceptance.${item.id || "?"}`);
    if (!asString(item.expected_outcome)) fail(`${relative}: acceptance ${item.id} missing expected_outcome`);
    if (!lifecycle.includes(item.lifecycle)) fail(`${relative}: acceptance ${item.id} invalid lifecycle`);
    if (active && ["implemented", "review_pending", "accepted"].includes(item.lifecycle)) fail(`${relative}: active ticket cannot pre-mark acceptance ${item.id} as ${item.lifecycle}`);
    for (const ref of requiredList(item.requirement_refs, `${relative}.acceptance.${item.id}.requirement_refs`)) validRef(ref, `${relative}.acceptance.${item.id}.requirement_refs`, { requiredAnchor: true });
    for (const traceId of requiredList(item.traceability_acceptance_ids, `${relative}.acceptance.${item.id}.traceability_acceptance_ids`)) {
      if (!ticketTraceability.acceptance_ids.has(traceId)) fail(`${relative}: acceptance ${item.id} references traceability acceptance outside ticket ${traceId}`);
      else localTraceabilityAcceptance.add(traceId);
    }
    requiredList(item.test_refs, `${relative}.acceptance.${item.id}.test_refs`);
    for (const commandRef of requiredList(item.command_refs, `${relative}.acceptance.${item.id}.command_refs`)) if (!Object.hasOwn(commands, commandRef)) fail(`${relative}: acceptance ${item.id} references missing command ${commandRef}`);
  }
  const coveredAcceptance = new Set(actionSteps.flatMap((step) => ids(step.acceptance_refs)));
  for (const acceptanceId of acceptanceIds) if (!coveredAcceptance.has(acceptanceId)) fail(`${relative}: acceptance ${acceptanceId} is not covered by an action step`);
  for (const acceptanceId of coveredAcceptance) if (!acceptanceIds.has(acceptanceId)) fail(`${relative}: action step references unknown acceptance ${acceptanceId}`);
  if (state !== "skipped" && !exactSet(sorted([...localTraceabilityAcceptance]), sorted([...ticketTraceability.acceptance_ids]))) fail(`${relative}: local acceptance rows must exactly cover traceability.acceptance_ids`);
  const representation = requiredObject(data.representation_reuse, `${relative}.representation_reuse`);
  requireFields(representation, ["status"], `${relative}.representation_reuse`);
  if (!["ready", "not_applicable"].includes(representation.status)) fail(`${relative}: invalid representation_reuse.status`);
  if (representation.status === "not_applicable") {
    requireFields(representation, ["rationale", "scope_refs"], `${relative}.representation_reuse`);
    if (!asString(representation.rationale) || !requiredList(representation.scope_refs, `${relative}.representation_reuse.scope_refs`).length) fail(`${relative}: not_applicable representation reuse needs scoped rationale and refs`);
    for (const ref of asList(representation.scope_refs)) validRef(ref, `${relative}.representation_reuse.scope_refs`, { requiredAnchor: true });
  } else {
    requireFields(representation, ["catalog_ref", "shape_refs", "mapping_refs", "new_shape_decision"], `${relative}.representation_reuse`);
    const catalogRef = asString(representation.catalog_ref);
    if (!catalogRef.startsWith(`${specsName}/`) || !exists(path.join(root, catalogRef))) fail(`${relative}: missing representation catalog ${catalogRef}`);
    let catalog = {};
    if (catalogRef && exists(path.join(root, catalogRef))) {
      try {
        if (!catalogs.has(catalogRef)) catalogs.set(catalogRef, parseYaml(read(path.join(root, catalogRef)), catalogRef));
        catalog = catalogs.get(catalogRef);
      } catch (error) { fail(error.message); }
    }
    const shapeIds = new Set(asList(catalog.shapes).map((shape) => asString(shape.shape_id)));
    const mappingIds = new Set(asList(catalog.mappings).map((mapping) => asString(mapping.mapping_id)));
    for (const shapeId of requiredList(representation.shape_refs, `${relative}.representation_reuse.shape_refs`)) if (!shapeIds.has(shapeId)) fail(`${relative}: unregistered representation shape_ref ${shapeId}`);
    for (const mappingId of requiredList(representation.mapping_refs, `${relative}.representation_reuse.mapping_refs`, { empty: true })) if (!mappingIds.has(mappingId)) fail(`${relative}: unregistered representation mapping_ref ${mappingId}`);
    if (!asString(representation.new_shape_decision)) fail(`${relative}: representation_reuse.new_shape_decision required`);
  }
  const generated = requiredObject(data.generated_contracts, `${relative}.generated_contracts`);
  requireFields(generated, ["status", "source_refs", "command_refs", "drift_command_refs"], `${relative}.generated_contracts`);
  for (const commandRef of [...asList(generated.command_refs), ...asList(generated.drift_command_refs)]) if (!Object.hasOwn(commands, commandRef)) fail(`${relative}: generated_contracts references missing command ${commandRef}`);
  const group = asString(data.parallel_group);
  if (group) parallelGroups.set(group, [...(parallelGroups.get(group) || []), { id, relative, writes }]);
  tickets.set(id, { id, relative, data, state, wave: data.wave, deps: ids(data.depends_on), blockers: ids(data.blocked_by), writes, reads, actionIds, traceability: ticketTraceability });
}

const ticketIds = [...tickets.keys()];
for (const [field, source] of [["requirement_ids", "requirements"], ["capability_ids", "capabilities"], ["path_ids", "paths"], ["acceptance_ids", "acceptance"]]) {
  const covered = new Set([...tickets.values()].filter((ticket) => ticket.state !== "skipped").flatMap((ticket) => [...ticket.traceability[field]]));
  for (const id of traceabilityIds[source]) if (!covered.has(id)) fail(`${specsName}/00-traceability.yaml: ${source} ID ${id} is not covered by a non-skipped ticket`);
}
for (const [name, index] of [["_registry.yaml", registry], ["_status.yaml", statusIndex], ["_dependencies.yaml", dependencyIndex], ["_scope.yaml", scopeIndex]]) if (!exactSet(sorted(Object.keys(index)), sorted(ticketIds))) fail(`${name}: ticket IDs must exactly reconcile with ticket files`);
for (const ticket of tickets.values()) {
  const registryRow = requiredObject(registry[ticket.id], `_registry.yaml.${ticket.id}`);
  requireFields(registryRow, ["path", "wave", "lifecycle"], `_registry.yaml.${ticket.id}`);
  if (registryRow.path !== ticket.relative || registryRow.wave !== ticket.wave || registryRow.lifecycle !== ticket.state) fail(`_registry.yaml.${ticket.id}: path/wave/lifecycle differs from ticket`);
  const statusRow = requiredObject(statusIndex[ticket.id], `_status.yaml.${ticket.id}`);
  requireFields(statusRow, ["lifecycle", "current_proof", "resume_notes", "affected_spec_refs"], `_status.yaml.${ticket.id}`);
  if (statusRow.lifecycle !== ticket.state) fail(`_status.yaml.${ticket.id}: lifecycle differs from ticket`);
  if (!["blocked", "partial"].includes(ticket.state) && !asString(statusRow.current_proof)) fail(`_status.yaml.${ticket.id}: current_proof required`);
  for (const ref of requiredList(statusRow.affected_spec_refs, `_status.yaml.${ticket.id}.affected_spec_refs`, { empty: true })) validRef(ref, `_status.yaml.${ticket.id}.affected_spec_refs`, { requiredAnchor: true });
  const dependencyRow = requiredObject(dependencyIndex[ticket.id], `_dependencies.yaml.${ticket.id}`);
  requireFields(dependencyRow, ["depends_on", "blocked_by", "unblocks"], `_dependencies.yaml.${ticket.id}`);
  if (!exactSet(sorted(ids(dependencyRow.depends_on)), sorted(ticket.deps))) fail(`_dependencies.yaml.${ticket.id}: depends_on differs from ticket`);
  if (!exactSet(sorted(ids(dependencyRow.blocked_by)), sorted(ticket.blockers))) fail(`_dependencies.yaml.${ticket.id}: blocked_by differs from ticket`);
  const scopeRow = requiredObject(scopeIndex[ticket.id], `_scope.yaml.${ticket.id}`);
  requireFields(scopeRow, ["write_scope", "read_scope"], `_scope.yaml.${ticket.id}`);
  if (!exactSet(sorted(ids(scopeRow.write_scope)), sorted(ticket.writes)) || !exactSet(sorted(ids(scopeRow.read_scope)), sorted(ticket.reads))) fail(`_scope.yaml.${ticket.id}: scopes differ from ticket`);
  for (const dependency of [...ticket.deps, ...ticket.blockers]) {
    if (!tickets.has(dependency)) fail(`${ticket.relative}: unknown dependency ${dependency}`);
    if (tickets.get(dependency)?.wave > ticket.wave) fail(`${ticket.relative}: depends on later-wave ${dependency}`);
  }
  for (const dependency of ticket.deps) if (!ids(dependencyIndex[dependency]?.unblocks).includes(ticket.id)) fail(`_dependencies.yaml.${dependency}.unblocks: missing ${ticket.id}`);
}

const visiting = new Set();
const visited = new Set();
const visit = (id, chain = []) => {
  if (visiting.has(id)) { fail(`_dependencies.yaml: cycle ${[...chain, id].join(" -> ")}`); return; }
  if (visited.has(id)) return;
  visiting.add(id);
  for (const dependency of tickets.get(id)?.deps || []) visit(dependency, [...chain, id]);
  visiting.delete(id); visited.add(id);
};
for (const id of ticketIds) visit(id);
for (const [group, members] of parallelGroups) for (let index = 0; index < members.length; index++) for (const other of members.slice(index + 1)) if (members[index].writes.some((left) => other.writes.some((right) => overlaps(left, right)))) fail(`${group}: ${members[index].relative} overlaps ${other.relative}`);
for (const wave of exists(plans) ? fs.readdirSync(plans, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^wave_\d+_/.test(entry.name)) : []) {
  const wavePlan = read(path.join(plans, wave.name, "plan.md"));
  if (!wavePlan) fail(`${wave.name}: missing plan.md`);
  for (const heading of ["End-to-End Outcome", "Implementation Order", "Slice Strategy", "Isolation", "Status", "Operational Path Coverage"]) if (!section(wavePlan, heading)) fail(`${wave.name}/plan.md: missing ${heading}`);
}

if (problems.length) {
  console.log("plan lint failed");
  for (const problem of problems) console.log(`- ${problem}`);
  process.exit(1);
}
console.log("plan lint ok");
