#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "specs");
const errors = [], warnings = [];
const gates = [
  "no_drift_gate", "ambiguity_gate", "semantic_alignment_gate",
  "spec_structure_gate", "visualization_gate", "standards_first_gate", "async_semantics_gate",
  "interface_gate", "e2e_gate",
  "unhappy_path_gate", "security_privacy_gate", "observability_gate",
  "performance_resilience_gate", "data_integrity_recovery_gate",
  "wave_readiness", "migration_gate", "contradiction_check",
  "self_audit_gate", "gate_simulation",
];
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

function yaml(text, file) {
  const data = {};
  const stack = [{ indent: -1, obj: data }];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, "");
    const m = line.match(/^(\s*)([A-Za-z0-9_.-]+):(?:\s*(.*))?$/);
    if (!m || !line.trim() || line.trim().startsWith("#")) continue;
    const indent = m[1].length;
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop();
    const parent = stack.at(-1).obj;
    let value = (m[3] ?? "").replace(/^["']|["']$/g, "");
    if (value === "") {
      parent[m[2]] = {};
      stack.push({ indent, obj: parent[m[2]] });
    } else {
      parent[m[2]] = value === "[]" ? [] : value;
    }
  }
  if (!Object.keys(data).length) fail(`${file} has no parseable YAML keys`);
  return data;
}

if (!fs.existsSync(root)) {
  fail(`Spec root does not exist: ${root}`);
} else {
  const all = walk(root);
  const text = all.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  [
    ".readiness-report.yaml", "_registry.yaml", "_provenance.yaml",
    "00-vision.md", "00-stack.md", "00-conventions.md",
    "00-architecture-overview.md", "glossary.md",
  ].forEach((f) => !exists(f) && fail(`Missing required spec artifact: ${f}`));

  let approved = false;
  if (exists(".readiness-report.yaml")) {
    const reportText = read(".readiness-report.yaml");
    const report = yaml(reportText, ".readiness-report.yaml");
    approved = report.status === "approved";
    if (!["draft", "needs_human_review", "approved", "blocked"].includes(report.status)) fail(`Invalid readiness status: ${String(report.status)}`);
    if (!["pending", "approved"].includes(report.human_approval?.status)) fail("Missing or invalid human_approval.status");
    if (approved && report.human_approval?.status !== "approved") fail("status approved requires human approval");
    if (approved) {
      gates.forEach((g) => report[g]?.status !== "passed" && fail(`Approved specs require ${g}.status passed`));
      if (!/\bopen_decisions:\s*\[\]/.test(reportText)) fail("Approved specs require open_decisions: []");
    }
  }

  for (const file of all) {
    const r = rel(file);
    const body = fs.readFileSync(file, "utf8");
    if (/\.(json|schema)$/.test(file)) try { JSON.parse(body); } catch (e) { fail(`${r} invalid JSON: ${e.message}`); }
    if (/\.(ya?ml)$/.test(file)) yaml(body, r);
    if (/\b(TODO|TBD|FIXME|OPEN QUESTION|QUESTION:)\b/i.test(body)) fail(`${r} contains unresolved marker`);
    for (const m of body.matchAll(/\[[^\]]+\]\((?!https?:\/\/|#)([^)]+)\)/g)) {
      const target = m[1].split("#")[0];
      if (target && !fs.existsSync(path.resolve(path.dirname(file), target))) fail(`${r} broken link: ${m[1]}`);
    }
  }

  if (approved) {
    const must = [
      [/\b(as appropriate|if needed|where possible|to be determined|decide later|future work will decide|handle errors|support auth|validate input|make configurable|sync data|recover gracefully|log appropriately|securely|performant|best effort)\b/i, "ambiguous implementation language", true],
      [/\b(GraphQL|TypeScript|JavaScript|Go|Python|OpenAPI|REST|gRPC|protobuf)\b/i, "Cross-language/protocol specs require type/nullability mapping", false, /\b(null|undefined|omitted|required|optional|type mapping|semantic mapping)\b/i],
      [/\b(async|queue|stream|event|job|worker|callback|goroutine|promise|coroutine)\b/i, "Async specs require runtime, ordering, timeout, retry, cancellation, idempotency, and backpressure semantics", false, /\b(timeout|retry|cancellation|idempotency|ordering|concurrency|ack|backpressure)\b/i],
      [/\b(unhappy|failure path|validation failure|authorization|denial|timeout|retry|rollback|recovery|cancellation|manual intervention)\b/i, "Approved specs require unhappy-path and recovery behavior"],
      [/\b(business|user|customer|outcome|goal|why|rationale)\b/i, "Approved specs require business/user context and rationale"],
      [/\b(component|module|service|package|workflow|process|interface|contract|frontend|UX|design|accessibility|reusable)\b/i, "Approved specs require component/workflow/interface/frontend structure where applicable"],
      [/\b(source of truth|link|see |references?|shared|central|registry)\b/i, "Approved specs require centralized shared facts and links instead of repetition"],
      [/\b(standard|industry|convention|OpenTelemetry|structured JSON|RFC 9457|OpenAPI|GraphQL|gRPC|protobuf|OAuth|OIDC|JWT|framework-native|ports-and-adapters)\b/i, "Approved specs require standards-first protocol/format/architecture choices"],
      [/\b(security|privacy|PII|personal data|confidential|restricted|secret|credential|redaction|trust boundary|authorization|tenancy|input validation|output encoding)\b/i, "Approved specs require security/privacy/data-classification behavior"],
      [/\b(log level|logging|observability|audit|metric|trace|correlation|redaction)\b/i, "Approved specs require observability/log-level/redaction behavior"],
      [/\b(performance|latency|throughput|rate limit|capacity|memory|CPU|pagination|batching|backpressure|timeout budget|retry budget|overload)\b/i, "Approved specs require performance/capacity/overload budgets"],
      [/\b(data integrity|consistency|state transition|transaction|rollback|compensation|checkpoint|idempotency|recovery|self-healing|manual intervention|data loss)\b/i, "Approved specs require data integrity/recovery/data-loss prevention"],
    ];
    all.forEach((f) => {
      const body = fs.readFileSync(f, "utf8");
      if (must[0][0].test(body)) fail(`${rel(f)} contains ${must[0][1]}`);
    });
    for (const [trigger, msg, badOnly, required] of must.slice(1)) {
      if (required ? trigger.test(text) && !required.test(text) : !trigger.test(text)) fail(msg);
    }
  }

  if (/\b(public\s+(api|sdk|cli|schema|protocol|workflow|config)|developer-facing|sdk|cli|plugin|tool manifest|builder)\b/i.test(text)) {
    if (!/(^|\n)#+\s+Public API Inventory\b|public_api_inventory:/i.test(text)) fail("Public surface detected without Public API Inventory");
    if (!/execution_semantics:/i.test(text)) fail("Public API inventory must classify execution_semantics");
  }
  if (!exists("03-contracts")) warn("No specs/03-contracts directory found");
  if (!exists("03-flows")) warn("No specs/03-flows directory found");
}

warnings.forEach((w) => console.warn(`warn: ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`error: ${e}`));
  process.exit(1);
}
console.log(`spec check ok: ${root}`);
