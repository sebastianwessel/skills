#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const plansName = process.argv[3] || "plans";
const specsName = process.argv[4] || "specs";
const plans = path.join(root, plansName);
const specs = path.join(root, specsName);
const problems = [];
const fail = (m) => problems.push(m);
const exists = (p) => fs.existsSync(p);
const read = (p) => exists(p) ? fs.readFileSync(p, "utf8") : "";
const walk = (d) => exists(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : [p];
}) : [];
const clean = (s = "") => s.replace(/^["']|["']$/g, "").replace(/\s+#.*$/, "").trim();
const fm = (t) => t.startsWith("---\n") ? t.split("---\n")[1] || "" : "";
const scalar = (t, k, ind = "") => clean((t.split("\n").find((l) => l.startsWith(`${ind}${k}:`)) || "").split(":").slice(1).join(":"));
const list = (t, k, ind = "") => {
  const lines = t.split("\n");
  const i = lines.findIndex((l) => l.startsWith(`${ind}${k}:`));
  if (i < 0) return [];
  const inline = lines[i].split(":").slice(1).join(":").trim();
  if (inline.startsWith("[") && inline.endsWith("]")) return inline.slice(1, -1).split(",").map(clean).filter(Boolean);
  const out = [];
  for (const line of lines.slice(i + 1)) {
    if (line.startsWith(ind) && !line.trim().startsWith("- ") && line.trim().includes(":")) break;
    if (line.trim().startsWith("- ")) out.push(clean(line.trim().slice(2)));
  }
  return out;
};
const block = (t, k) => {
  const lines = t.split("\n");
  const i = lines.findIndex((l) => l.startsWith(`${k}:`));
  if (i < 0) return "";
  const out = [];
  for (const line of lines.slice(i + 1)) {
    if (/^[A-Za-z_][\w-]*:\s*/.test(line)) break;
    out.push(line.replace(/^  /, ""));
  }
  return out.join("\n");
};
const childScalar = (t, p, k) => scalar(block(t, p), k);
const childList = (t, p, k) => list(block(t, p), k);
const hasList = (t, k) => t.includes(`${k}:\n  - `) || new RegExp(`${k}:\\s*\\[[^\\]]*\\]`).test(t);
const badWords = /\b(decide|choose|determine|consider|TBD|TODO|infer|fill gaps|use judgment|as appropriate|if needed|where possible)\b/i;
const fakeWork = /\b(use|add|create|implement|wire|return)\s+(a\s+)?(placeholder|fake|mock|stub|no-op|temporary)\b/i;
const publicRe = /\b(public|developer-facing|sdk|api|cli|schema|protocol|plugin|tool|workflow|builder)\b/i;
const statuses = ["planned", "ready", "in_progress", "partial", "blocked", "done", "skipped"];
const overlap = (a, b) => {
  const x = a.replace(/\/$/, ""), y = b.replace(/\/$/, "");
  return x && y && (x === y || x.startsWith(`${y}/`) || y.startsWith(`${x}/`));
};

const plan = read(path.join(plans, "implementation-plan.md"));
const statusText = read(path.join(plans, "_status.yaml"));
const depsText = read(path.join(plans, "_dependencies.yaml"));
const specReady = read(path.join(specs, ".readiness-report.yaml"));
if (!plan && !exists(path.join(plans, "definition-readiness-report.md"))) fail("plans/: missing implementation plan or readiness report");
if (plan && !/^status:\s*approved\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: requires status approved`);
if (plan && !/human_approval:[\s\S]*?^\s+status:\s*approved\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: requires human approval`);
["_registry.yaml", "_status.yaml", "_dependencies.yaml", "_scope.yaml"].forEach((f) => plan && !exists(path.join(plans, f)) && fail(`plans/: missing ${f}`));
if (/Wave 0|Spec and Contract Closure|build-blocking gaps/i.test(plan)) fail("implementation-plan.md: contains forbidden spec-closure wave");
if (plan && !/\b(resume|resume_notes|last_verified|current_proof|partial)\b/i.test(statusText)) fail("_status.yaml: missing pause/resume tracking fields");
if (plan && !/Self-Audit/i.test(plan)) fail("implementation-plan.md: missing Self-Audit");
if (plan && !/\b(weakest assumptions|assumptions|blockers|evidence)\b/i.test(plan)) fail("implementation-plan.md: Self-Audit needs assumptions, blockers, and evidence");

const tickets = new Map();
const groups = new Map();
const depBlocks = new Map();

if (depsText) {
  let current;
  let lines = [];
  const flush = () => {
    if (current) depBlocks.set(current, lines.join("\n"));
  };
  for (const line of depsText.split("\n")) {
    const match = line.match(/^\s{2}(TICKET-\d+):\s*$/);
    if (match) {
      flush();
      current = match[1];
      lines = [];
    } else if (current) {
      lines.push(line.replace(/^ {4}/, ""));
    }
  }
  flush();
}

const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
for (const file of walk(plans).filter((p) => p.endsWith(".md") && p.includes(`${path.sep}tickets${path.sep}`))) {
  const rel = path.relative(plans, file);
  const text = read(file);
  const front = fm(text);
  const id = scalar(front, "id");
  const status = scalar(front, "status");
  const active = !["blocked", "done", "skipped"].includes(status);
  const contextLines = (text.match(/## Context Digest[\s\S]*?(?=\n## |\n$)/)?.[0] || "").split("\n").length;
  ["id", "wave", "status", "parallel_group", "depends_on", "blocked_by"].forEach((k) => !front.includes(`${k}:`) && fail(`${rel}: missing ${k}`));
  if (status && !statuses.includes(status)) fail(`${rel}: invalid status ${status}`);
  ["spec_refs", "write_scope", "read_scope"].forEach((k) => !hasList(front, k) && fail(`${rel}: missing ${k}`));
  ["Goal", "Context Digest", "Implementation Approach", "Tasks", "Acceptance", "Verification", "Non-goals", "Handoff"].forEach((s) => !text.includes(`## ${s}`) && fail(`${rel}: missing ${s}`));
  if (status !== "blocked" && childScalar(front, "contract_readiness", "status") !== "ready") fail(`${rel}: contract_readiness.status must be ready`);
  if (status !== "blocked" && childList(front, "contract_readiness", "required_contracts").length === 0) fail(`${rel}: contract_readiness.required_contracts is empty`);
  if (childList(front, "contract_readiness", "missing_contracts").length) fail(`${rel}: contract_readiness.missing_contracts is not empty`);
  if (active && childScalar(front, "ticket_readiness", "status") !== "implementation_ready") fail(`${rel}: ticket_readiness.status must be implementation_ready`);
  if (active && childList(front, "ticket_readiness", "open_decisions").length) fail(`${rel}: open_decisions must be empty`);
  if (active && childList(front, "ticket_readiness", "ambiguous_phrases").length) fail(`${rel}: ambiguous_phrases must be empty`);
  ["Decision Ledger", "Contract Traceability", "Acceptance Test Matrix"].forEach((s) => active && !text.includes(`## ${s}`) && fail(`${rel}: missing ${s}`));
  if (active && badWords.test(text)) fail(`${rel}: contains implementation-time decision language`);
  if (active && fakeWork.test(text) && !/\b(test fixture|fake provider|mock provider|test double|contract test)\b/i.test(text)) fail(`${rel}: contains placeholder/mock/fake implementation shortcut`);
  if (active && text.split("\n").length > 220) fail(`${rel}: ticket is too noisy; split or tighten it`);
  if (active && contextLines > 80) fail(`${rel}: Context Digest is too large`);
  if (/ask (the )?human|ask user|read (all|the full|entire) specs/i.test(text)) fail(`${rel}: asks for human clarification or too much context`);
  if (active && publicRe.test(text) && !/\b(docs?|documentation|examples?|approved deferral|deferred by spec)\b/i.test(text)) fail(`${rel}: public surface lacks docs/examples or deferral`);
  for (const ref of list(front, "spec_refs")) {
    const target = ref.split("#")[0];
    if (target.startsWith(`${specsName}/`) && !exists(path.join(root, target))) fail(`${rel}: missing spec_ref ${ref}`);
  }
  const group = scalar(front, "parallel_group");
  const scopes = list(front, "write_scope");
  if (group) groups.set(group, [...(groups.get(group) || []), { rel, scopes }]);
  if (id) tickets.set(id, {
    rel,
    blocked: list(front, "blocked_by"),
    deps: list(front, "depends_on"),
    wave: Number(scalar(front, "wave")) || 0,
  });
}

for (const d of exists(plans) ? fs.readdirSync(plans, { withFileTypes: true }).filter((e) => e.isDirectory() && /^wave_\d+_/.test(e.name)) : []) {
  const wavePlan = read(path.join(plans, d.name, "plan.md"));
  if (!wavePlan) fail(`${d.name}: missing plan.md`);
  if (wavePlan && !/End-to-End Outcome/i.test(wavePlan)) fail(`${d.name}/plan.md: missing End-to-End Outcome`);
  if (wavePlan && !/Implementation Order/i.test(wavePlan)) fail(`${d.name}/plan.md: missing Implementation Order`);
  if (wavePlan && !/Parallelization|Parallel Work|Isolation/i.test(wavePlan)) fail(`${d.name}/plan.md: missing parallelization/isolation notes`);
  if (wavePlan && !/Resume|Pause|Status/i.test(wavePlan)) fail(`${d.name}/plan.md: missing pause/resume status notes`);
  if (!exists(path.join(plans, d.name, "tickets"))) fail(`${d.name}: missing tickets/`);
}
for (const [id, t] of tickets) for (const dep of t.deps) {
  if (!tickets.has(dep)) fail(`${t.rel}: missing dependency ${dep}`);
  if (tickets.get(dep)?.wave > t.wave) fail(`${t.rel}: depends on later-wave ${dep}`);
}
for (const [id, t] of tickets) {
  const depBlock = depBlocks.get(id);
  if (!depBlock) fail(`_dependencies.yaml: missing ${id}`);
  if (depBlock) {
    if (!same(list(depBlock, "depends_on").sort(), t.deps.slice().sort())) fail(`_dependencies.yaml: ${id}.depends_on differs from ticket`);
    if (!same(list(depBlock, "blocked_by").sort(), t.blocked.slice().sort())) fail(`_dependencies.yaml: ${id}.blocked_by differs from ticket`);
  }
  for (const dep of t.deps) {
    const depBlockForDependency = depBlocks.get(dep) || "";
    if (!list(depBlockForDependency, "unblocks").includes(id)) fail(`_dependencies.yaml: ${dep}.unblocks missing ${id}`);
  }
  for (const blockedBy of t.blocked) if (!tickets.has(blockedBy)) fail(`${t.rel}: references missing blocker ${blockedBy}`);
}
for (const [g, xs] of groups) for (let i = 0; i < xs.length; i++) for (const y of xs.slice(i + 1)) {
  if (xs[i].scopes.some((a) => y.scopes.some((b) => overlap(a, b)))) fail(`${g}: ${xs[i].rel} overlaps ${y.rel}`);
}

if (problems.length) {
  console.log("plan lint failed");
  problems.forEach((p) => console.log(`- ${p}`));
  process.exit(1);
}
console.log("plan lint ok");
