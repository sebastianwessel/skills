#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "specs");
const errors = [];
const warnings = [];
const gates = [
  "no_drift_gate",
  "ambiguity_gate",
  "semantic_alignment_gate",
  "async_semantics_gate",
  "interface_gate",
  "e2e_gate",
  "wave_readiness",
  "migration_gate",
  "contradiction_check",
  "gate_simulation",
];

const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const at = (f) => path.join(root, f);
const exists = (f) => fs.existsSync(at(f));
const read = (f) => fs.readFileSync(at(f), "utf8");
const rel = (f) => path.relative(root, f).split(path.sep).join("/");

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const f = path.join(dir, e.name);
    return e.isDirectory() ? files(f) : [f];
  });
}

function yaml(text, file) {
  const data = {};
  const stack = [{ indent: -1, obj: data }];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, "");
    const m = line.match(/^(\s*)([A-Za-z0-9_.-]+):(?:\s*(.*))?$/);
    if (!m || !line.trim().length || line.trim().startsWith("#")) continue;
    const indent = m[1].length;
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop();
    const parent = stack.at(-1).obj;
    let value = m[3] ?? "";
    if (value === "") {
      parent[m[2]] = {};
      stack.push({ indent, obj: parent[m[2]] });
    } else {
      value = value.replace(/^["']|["']$/g, "");
      parent[m[2]] = value === "[]" ? [] : value;
    }
  }
  if (!Object.keys(data).length) fail(`${file} does not contain parseable YAML keys`);
  return data;
}

if (!fs.existsSync(root)) {
  fail(`Spec root does not exist: ${root}`);
} else {
  const all = files(root);
  const text = all.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const required = [
    ".readiness-report.yaml",
    "_registry.yaml",
    "_provenance.yaml",
    "00-vision.md",
    "00-stack.md",
    "00-conventions.md",
    "00-architecture-overview.md",
    "glossary.md",
  ];
  required.forEach((f) => !exists(f) && fail(`Missing required spec artifact: ${f}`));

  let approved = false;
  if (exists(".readiness-report.yaml")) {
    const reportText = read(".readiness-report.yaml");
    const report = yaml(reportText, ".readiness-report.yaml");
    approved = report.status === "approved";
    if (!["draft", "needs_human_review", "approved", "blocked"].includes(report.status)) fail(`Invalid readiness status: ${String(report.status)}`);
    if (!["pending", "approved"].includes(report.human_approval?.status)) fail("Missing or invalid human_approval.status");
    if (approved && report.human_approval?.status !== "approved") fail("status approved requires human_approval.status approved");
    if (approved) {
      gates.forEach((g) => report[g]?.status !== "passed" && fail(`Approved specs require ${g}.status passed`));
      if (!/\bopen_decisions:\s*\[\]/.test(reportText)) fail("Approved specs require open_decisions: []");
    }
  }

  for (const file of all) {
    const r = rel(file);
    const body = fs.readFileSync(file, "utf8");
    if (/\.(json|schema)$/.test(file)) {
      try { JSON.parse(body); } catch (e) { fail(`${r} is invalid JSON: ${e.message}`); }
    }
    if (/\.(ya?ml)$/.test(file)) yaml(body, r);
    if (/\b(TODO|TBD|FIXME|OPEN QUESTION|QUESTION:)\b/i.test(body)) fail(`${r} contains unresolved marker`);
    for (const m of body.matchAll(/\[[^\]]+\]\((?!https?:\/\/|#)([^)]+)\)/g)) {
      const target = m[1].split("#")[0];
      if (target && !fs.existsSync(path.resolve(path.dirname(file), target))) fail(`${r} has broken relative link: ${m[1]}`);
    }
  }

  if (approved) {
    const ambiguous = /\b(as appropriate|if needed|where possible|to be determined|decide later|future work will decide|handle errors|support auth|validate input|make configurable|sync data)\b/i;
    all.forEach((f) => ambiguous.test(fs.readFileSync(f, "utf8")) && fail(`${rel(f)} contains ambiguous implementation language`));
    if (/\b(GraphQL|TypeScript|JavaScript|Go|Python|OpenAPI|REST|gRPC|protobuf)\b/i.test(text) && !/\b(null|undefined|omitted|required|optional|type mapping|semantic mapping)\b/i.test(text)) {
      fail("Cross-language/protocol specs require explicit semantic type/nullability mapping");
    }
    if (/\b(async|queue|stream|event|job|worker|callback|goroutine|promise|coroutine)\b/i.test(text) && !/\b(timeout|retry|cancellation|idempotency|ordering|concurrency|ack|backpressure)\b/i.test(text)) {
      fail("Async specs require runtime, ordering, timeout, retry, cancellation, idempotency, and backpressure semantics");
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
