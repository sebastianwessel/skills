#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "specs");
const errors = [], warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const at = (f) => path.join(root, f);
const exists = (f) => fs.existsSync(at(f));
const read = (f) => fs.readFileSync(at(f), "utf8");
const rel = (f) => path.relative(root, f).split(path.sep).join("/");
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const f = path.join(d, e.name);
  return e.isDirectory() ? walk(f) : [f];
}) : [];

const gates = [
  "no_drift_gate", "ambiguity_gate", "semantic_alignment_gate",
  "spec_structure_gate", "visualization_gate", "requirements_quality_gate",
  "standards_first_gate", "async_semantics_gate", "interface_gate", "e2e_gate",
  "unhappy_path_gate", "security_privacy_gate", "observability_gate",
  "performance_resilience_gate", "data_integrity_recovery_gate",
  "production_readiness_gate", "supply_chain_gate", "wave_readiness",
  "migration_gate", "contradiction_check", "semantic_judge_gate",
  "self_audit_gate", "gate_simulation",
];

if (!fs.existsSync(root)) {
  fail(`Missing spec root: ${root}`);
} else {
  const all = walk(root), text = all.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  [".readiness-report.yaml", "_registry.yaml", "_provenance.yaml", "00-vision.md",
   "00-stack.md", "00-conventions.md", "00-architecture-overview.md", "glossary.md"]
    .forEach((f) => !exists(f) && fail(`Missing artifact: ${f}`));

  const report = exists(".readiness-report.yaml") ? read(".readiness-report.yaml") : "";
  const approved = /^status:\s*approved\s*$/m.test(report);
  if (report && !/^status:\s*(draft|needs_human_review|approved|blocked)\s*$/m.test(report)) fail("Invalid readiness status");
  if (report && !/human_approval:\s*\n\s+status:\s*(pending|approved)\s*$/m.test(report)) fail("Missing or invalid human_approval.status");
  if (approved) {
    if (!/human_approval:\s*\n\s+status:\s*approved\s*$/m.test(report)) fail("Human approval required");
    if (!/^language:\s*en\s*$/m.test(report)) fail("language: en required");
    if (!/\bopen_decisions:\s*\[\]/.test(report)) fail("open_decisions must be []");
    gates.forEach((g) => !new RegExp(`${g}:\\s*\\n\\s+status:\\s*passed\\b`, "m").test(report) && fail(`${g}.status must pass`));
  }

  for (const file of all) {
    const r = rel(file), body = fs.readFileSync(file, "utf8");
    if (/\.(json|schema)$/.test(file)) try { JSON.parse(body); } catch (e) { fail(`${r} invalid JSON: ${e.message}`); }
    if (/\b(TODO|TBD|FIXME|OPEN QUESTION|QUESTION:)\b/i.test(body)) fail(`${r} contains unresolved marker`);
    for (const m of body.matchAll(/\[[^\]]+\]\((?!https?:\/\/|#)([^)]+)\)/g)) {
      const target = m[1].split("#")[0];
      if (target && !fs.existsSync(path.resolve(path.dirname(file), target))) fail(`${r} broken link: ${m[1]}`);
    }
  }

  if (approved) {
    const must = [
      [/\b(as appropriate|if needed|where possible|to be determined|decide later|future work will decide|handle errors|support auth|validate input|make configurable|sync data|recover gracefully|log appropriately|securely|performant|best effort)\b/i, "ambiguous implementation language", true],
      [/\b(GraphQL|TypeScript|JavaScript|Go|Python|OpenAPI|REST|gRPC|protobuf)\b/i, "Missing type mapping", false, /\b(null|undefined|omitted|required|optional|type mapping|semantic mapping)\b/i],
      [/\b(async|queue|stream|event|job|worker|callback|goroutine|promise|coroutine)\b/i, "Missing async semantics", false, /\b(timeout|retry|cancellation|idempotency|ordering|concurrency|ack|backpressure)\b/i],
      [/\b(unhappy|failure path|validation failure|authorization|denial|timeout|retry|rollback|recovery|cancellation|manual intervention)\b/i, "Missing unhappy/recovery paths"],
      [/\b(business|user|customer|outcome|goal|why|rationale)\b/i, "Missing business context"],
      [/\b(requirement|flow|contract|NFR|acceptance).{0,80}\b(id|trace|source|owner|priority|risk|verification method|test|inspection|analysis|demo)\b/i, "Missing requirement traceability"],
      [/\b(component|module|service|package|workflow|process|interface|contract|frontend|UX|design|accessibility|reusable)\b/i, "Missing component/workflow structure"],
      [/\b(source of truth|link|see |references?|shared|central|registry)\b/i, "Missing source links"],
      [/\b(standard|industry|convention|OpenTelemetry|structured JSON|RFC 9457|OpenAPI|GraphQL|gRPC|protobuf|OAuth|OIDC|JWT|framework-native|ports-and-adapters)\b/i, "Missing standards"],
      [/\b(security|privacy|PII|personal data|confidential|restricted|secret|credential|redaction|trust boundary|authorization|tenancy|input validation|output encoding)\b/i, "Missing security/privacy"],
      [/\b(log level|logging|observability|audit|metric|trace|correlation|redaction)\b/i, "Missing observability"],
      [/\b(performance|latency|throughput|rate limit|capacity|memory|CPU|pagination|batching|backpressure|timeout budget|retry budget|overload)\b/i, "Missing performance budgets"],
      [/\b(data integrity|consistency|state transition|transaction|rollback|compensation|checkpoint|idempotency|recovery|self-healing|manual intervention|data loss)\b/i, "Missing integrity/recovery"],
      [/\b(production readiness|deployment|environment|configuration|config|secret|SLO|SLA|error budget|runbook|incident|backup|restore|rollback|rollout|release|readiness|liveness|operational owner|support handoff|not applicable|N\/A)\b/i, "Missing production/release"],
      [/\b(supply chain|dependency policy|lockfile|vulnerability|license|SBOM|SPDX|CycloneDX|SLSA|provenance|attestation|signing|artifact|container|base image|secret scan|not applicable|N\/A)\b/i, "Missing supply chain"],
    ];
    all.forEach((f) => must[0][0].test(fs.readFileSync(f, "utf8")) && fail(`${rel(f)} contains ${must[0][1]}`));
    for (const [trigger, msg, badOnly, required] of must.slice(1)) {
      if (required ? trigger.test(text) && !required.test(text) : !trigger.test(text)) fail(msg);
    }
  }

  if (/\b(public\s+(api|sdk|cli|schema|protocol|workflow|config)|developer-facing|sdk|cli|plugin|tool manifest|builder)\b/i.test(text)) {
    if (!/(^|\n)#+\s+Public API Inventory\b|public_api_inventory:/i.test(text)) fail("Missing Public API Inventory");
    if (!/execution_semantics:/i.test(text)) fail("Missing execution_semantics");
  }
  if (!exists("03-contracts")) warn("Missing specs/03-contracts");
  if (!exists("03-flows")) warn("Missing specs/03-flows");
}

warnings.forEach((w) => console.warn(`warn: ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`error: ${e}`));
  process.exit(1);
}
console.log(`spec check ok: ${root}`);
