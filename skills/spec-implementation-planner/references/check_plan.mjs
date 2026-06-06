#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const plansName = process.argv[3] || "plans";
const specsName = process.argv[4] || "specs";
const plans = path.join(root, plansName);
const specs = path.join(root, specsName);
const out = [];
const fail = (m) => out.push(m);
const exists = (p) => fs.existsSync(p);
const read = (p) => exists(p) ? fs.readFileSync(p, "utf8") : "";
const walk = (d) => exists(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : [p];
}) : [];
const clean = (s = "") => s.replace(/^["']|["']$/g, "").replace(/\s+#.*$/, "").trim();
const fm = (t) => t.startsWith("---\n") ? t.split("---\n")[1] || "" : "";
const scalar = (t, k) => clean((t.split("\n").find((l) => l.startsWith(`${k}:`)) || "").split(":").slice(1).join(":"));
const block = (t, k) => {
  const m = t.match(new RegExp(`(^|\\n)${k}:\\n([\\s\\S]*?)(?=\\n[A-Za-z_][\\w-]*:\\s|$)`));
  return m ? m[2].replace(/^  /gm, "") : "";
};
const list = (t, k) => {
  const lines = t.split("\n");
  const i = lines.findIndex((l) => l.startsWith(`${k}:`));
  if (i < 0) return [];
  const v = lines[i].split(":").slice(1).join(":").trim();
  if (v.startsWith("[") && v.endsWith("]")) return v.slice(1, -1).split(",").map(clean).filter(Boolean);
  const xs = [];
  for (const line of lines.slice(i + 1)) {
    if (/^\S/.test(line) && !line.trim().startsWith("- ")) break;
    if (line.trim().startsWith("- ")) xs.push(clean(line.trim().slice(2)));
  }
  return xs;
};
const child = (t, p, k) => scalar(block(t, p), k);
const childList = (t, p, k) => list(block(t, p), k);
const section = (t, k) => {
  const m = t.match(new RegExp(`(^|\\n)## ${k}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`));
  return m ? m[2].trim() : "";
};
const hasList = (t, k) => t.includes(`${k}:\n  - `) || new RegExp(`${k}:\\s*\\[[^\\]]*\\]`).test(t);
const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
const overlap = (a, b) => {
  const x = a.replace(/\/$/, ""), y = b.replace(/\/$/, "");
  return x && y && (x === y || x.startsWith(`${y}/`) || y.startsWith(`${x}/`));
};
const bad = /\b(decide|choose|determine|TBD|TODO|infer|fill gaps|use judgment|as appropriate|if needed|where possible)\b/i;
const badAction = /\b(wire up|hook up|make it work|clean up|etc\.|and so on|handle all|integrate with existing|follow existing patterns|finish the feature)\b/i;
const fake = /\b(use|add|create|implement|wire|return)\s+(a\s+)?(placeholder|fake|mock|stub|no-op|temporary)\b/i;
const happy = /\b(happy path|success path|valid request|successful|success)\b/i;
const unhappy = /\b(unhappy path|failure path|invalid|validation failure|denied|unauthorized|forbidden|timeout|retry|rollback|recovery|cancel|error)\b/i;
const nfr = /\b(security|privacy|performance|resilience|observability|logging|log level|redaction|data integrity|recovery|production|release|supply chain|SBOM|provenance|not applicable|N\/A|deferred by spec)\b/i;
const generated = /\b(generated_contracts|deterministic generator|generator|codegen|regeneration command|generated types?|generated clients?|generated server|generated stubs?|generated validators?|generated tests?|contract tests?|drift check|not applicable|N\/A|unavailable|unsafe|out of scope)\b/i;
const frontend = /\b(frontend|client|UI|UX|screen|surface|user flow|access path|navigation|loading|empty|error state|success state|permission state|accessibility|responsive|design system|design\.md|style reuse|shared style|component library|framework component|reusable component|not applicable|N\/A|out of scope)\b/i;
const slice = /\b(vertical slice|slice strategy|end-to-end increment|end-to-end outcome|horizontal exception|foundation exception|refactor exception|unblocks|next vertical slice)\b/i;
const coverage = /\b(unit tests?|end-to-end tests?|E2E tests?|code coverage|coverage threshold|80%|eighty percent|not applicable|N\/A|approved threshold)\b/i;
const testFirst = /\b(test-first|test driven|TDD|tests? before (business )?logic|failing tests?|contract tests?|acceptance tests?|unhappy-path tests?|public-interface tests?|generated tests?)\b/i;
const acceptanceStatus = /\b(implemented|tested|verified by command|verified by browser|not applicable|N\/A|blocked|partial)\b/i;
const preflightArtifacts = /\b(preflight|required generated artifacts?|prerequisite paths?|generation command|generated services?|generated clients?|not applicable|N\/A|blocked)\b/i;
const finalComplete = /\b(full(y)? implemented|all spec requirements|no gaps|no unresolved implementation work|no unapproved (fake|mock|stub|placeholder)|full end-to-end alignment|end-to-end working solution)\b/i;
const e2eDefinition = /\b(capability inventory|feature inventory|end-to-end definition|definition chain|actor|consumer|entrypoint|reachability|access path|data touched|state transition|side effects|permissions|final state)\b/i;
const cleanRebuild = /\b(clean rebuild|contract-first rebuild|incremental patch|incremental refactor|old boundary|new boundary|compatibility fallback|stale alias|breaking change|not applicable|N\/A)\b/i;
const generationMap = /\b(generation map|source contract|GraphQL|AsyncAPI|JSON Schema|error taxonomy|service manifest|database record|record ID|derived component|generated package|not applicable|N\/A)\b/i;
const strongBoundary = /\b(strong boundary type|weak boundary type|closed contract|open JSON leaf|map\[string\]any|TypeScript any|TS any|type any|`any`|TypeScript unknown|TS unknown|type unknown|`unknown`|Record<string, unknown>|JSONValue|json\.RawMessage|additionalProperties|not applicable|N\/A)\b/i;
const boundedParallel = /\b(read-only discovery|sidecar agent|disjoint write_scope|parallel write|bounded parallel|integrate centrally|not applicable|N\/A)\b/i;
const strictTyping = /\b(strict typing|strong types?|source-derived types?|generated types?|compile check|type check|typecheck|tsc|mypy|pyright|go test|cargo check|no any|no unknown|no unchecked casts?|not applicable|N\/A)\b/i;
const modularity = /\b(modular|module|domain|topic|bounded context|folder structure|directory structure|nested folders?|cohesion|separation of concerns|not applicable|N\/A)\b/i;
const reuse = /\b(reuse|shared helper|shared module|existing module|existing helper|component reuse|service reuse|avoid duplicate|no duplicate|DRY|deduplicate|not applicable|N\/A)\b/i;
const reviewAgainstSpecs = /\b(review|verify|audit|judge).{0,80}\b(spec|specs|spec_ref|ticket|acceptance matrix|requirements?)\b/i;
const specDrift = /\b(spec drift|drift control|source spec|spec_ref|requirement ID|contract anchor|forbidden interpretation|approved spec|not applicable|N\/A)\b/i;
const actionNumbered = /(^|\n)\s*\d+\.\s+\S/;
const actionPreflight = /\b(preflight|baseline|dependency|readiness|read_scope|status)\b/i;
const actionContract = /\b(contract|schema|IDL|codegen|generation|generated|drift check|not applicable|N\/A)\b/i;
const actionTests = /\b(test-first|failing tests?|already-existing proof|acceptance tests?|contract tests?|E2E|unit tests?|unhappy-path tests?)\b/i;
const actionImplement = /\b(implement|edit|update|create|remove|replace|migrate|generate|regenerate)\b/i;
const actionVerify = /\b(verify|verification|proof|expected failure|expected pass|pass proof|blocked proof|partial proof)\b/i;
const actionCommand = /\b(npm|pnpm|yarn|node|python3?|go|cargo|pytest|vitest|jest|npx|make|just|bun|deno|docker|kubectl|terraform|mvn|gradle|dotnet|ruff|eslint|tsc)\b|`[^`]*(test|check|build|lint|generate|codegen|compile|drift|verify)[^`]*`/i;
const actionPath = /(^|[\s`])([./]?\w[\w.@-]*(\/[\w.@-][\w.@-]*)+|[\w.@-]+\.(ts|tsx|js|jsx|mjs|cjs|go|rs|py|rb|java|kt|cs|php|md|yaml|yml|json|toml|sql|graphql|proto|openapi|env))\b/i;
const phaseGate = /\bphase gate:\b/i;
const domainForScope = (scope) => {
  const s = scope.toLowerCase();
  if (/(^|\/)(frontend|client|ui|web|app|pages|components|routes|screens)(\/|$)/.test(s)) return "frontend";
  if (/(^|\/)(backend|server|service|services|api|handlers|controllers|routes)(\/|$)/.test(s)) return "backend";
  if (/(^|\/)(contract|contracts|schemas|schema|openapi|graphql|asyncapi|proto|idl|generator|generators|codegen)(\/|$)/.test(s)) return "contracts";
  if (/(^|\/)(test|tests|e2e|integration|spec|__tests__)(\/|$)|\.(test|spec)\./.test(s)) return "tests";
  if (/(^|\/)(docs|documentation|examples|runbooks)(\/|$)|\.md$/.test(s)) return "docs";
  if (/(^|\/)(deploy|deployment|infra|ops|scripts|ci|\.github|docker|k8s)(\/|$)/.test(s)) return "ops";
  if (/(^|\/)(db|database|migrations|models|entities|repositories)(\/|$)/.test(s)) return "data";
  return "other";
};
const statuses = ["planned", "ready", "in_progress", "partial", "blocked", "done", "skipped"];
const sliceTypes = ["vertical_slice", "foundation_exception", "refactor_exception", "remediation", "migration"];

const plan = read(path.join(plans, "implementation-plan.md"));
const statusText = read(path.join(plans, "_status.yaml"));
const depsText = read(path.join(plans, "_dependencies.yaml"));
const specReady = read(path.join(specs, ".readiness-report.yaml"));
if (!plan) fail("plans/: missing implementation-plan.md");
if (plan && !/^status:\s*approved\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: status must be approved`);
if (plan && !/human_approval:[\s\S]*?^\s+status:\s*approved\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: human approval required`);
if (plan && !/^language:\s*en\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: language: en required`);
if (plan && !/semantic_judge_gate:\s*\n\s+status:\s*passed\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: semantic_judge_gate.status must be passed`);
if (plan && !/checklist_walk_gate:\s*\n\s+status:\s*passed\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: checklist_walk_gate.status must be passed`);
if (plan && !/end_to_end_definition_gate:\s*\n\s+status:\s*passed\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: end_to_end_definition_gate.status must be passed`);
if (plan && !/current_dependency_research_gate:\s*\n\s+status:\s*passed\s*$/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: current_dependency_research_gate.status must be passed`);
if (plan && !/checklist_walk:[\s\S]*?blocking_findings_count:\s*0\b/m.test(specReady)) fail(`${specsName}/.readiness-report.yaml: checklist_walk.blocking_findings_count must be 0`);
["_registry.yaml", "_status.yaml", "_dependencies.yaml", "_scope.yaml"].forEach((f) => plan && !exists(path.join(plans, f)) && fail(`plans/: missing ${f}`));
if (/Wave 0|Spec and Contract Closure|build-blocking gaps/i.test(plan)) fail("implementation-plan.md: forbidden spec-closure wave");
if (plan && !/\b(resume|resume_notes|last_verified|current_proof|partial)\b/i.test(statusText)) fail("_status.yaml: missing pause/resume tracking");
if (plan && !/Self-Audit/i.test(plan)) fail("implementation-plan.md: missing Self-Audit");
if (plan && !/\b(assumptions|blockers|evidence)\b/i.test(plan)) fail("implementation-plan.md: Self-Audit lacks assumptions/blockers/evidence");
if (plan && !/\b(requirement coverage|traceability|requirement IDs?|source requirements?)\b/i.test(plan)) fail("implementation-plan.md: missing requirement traceability coverage");
if (plan && !/\b(path coverage|unhappy|failure path|operational path)\b/i.test(plan)) fail("implementation-plan.md: missing path coverage");
if (plan && !e2eDefinition.test(plan)) fail("implementation-plan.md: missing capability inventory/end-to-end definition coverage");
if (plan && !nfr.test(plan)) fail("implementation-plan.md: missing NFR/operations/supply-chain ownership");
if (plan && !generated.test(plan)) fail("implementation-plan.md: missing generated contract/codegen ownership");
if (plan && !frontend.test(plan)) fail("implementation-plan.md: missing frontend/client UX ownership or N/A evidence");
if (plan && !slice.test(plan)) fail("implementation-plan.md: missing vertical slice strategy or horizontal exception");
if (plan && !coverage.test(plan)) fail("implementation-plan.md: missing unit/E2E test and coverage ownership");
if (plan && !testFirst.test(plan)) fail("implementation-plan.md: missing test-first implementation order");
if (plan && !acceptanceStatus.test(plan)) fail("implementation-plan.md: missing acceptance matrix status ownership");
if (plan && !preflightArtifacts.test(plan)) fail("implementation-plan.md: missing preflight/generated artifact ownership");
if (plan && !finalComplete.test(plan)) fail("implementation-plan.md: missing final completion/no-gap expectation");
if (plan && !cleanRebuild.test(plan)) fail("implementation-plan.md: missing clean rebuild vs incremental decision");
if (plan && !generationMap.test(plan)) fail("implementation-plan.md: missing generation map/source-contract coverage");
if (plan && !strongBoundary.test(plan)) fail("implementation-plan.md: missing strong boundary type coverage");
if (plan && !boundedParallel.test(plan)) fail("implementation-plan.md: missing bounded parallel-agent guidance or N/A evidence");
if (plan && !strictTyping.test(plan)) fail("implementation-plan.md: missing strict typing/type-check ownership");
if (plan && !modularity.test(plan)) fail("implementation-plan.md: missing modular domain/topic structure ownership");
if (plan && !reuse.test(plan)) fail("implementation-plan.md: missing reuse/no-duplication ownership");
if (plan && !reviewAgainstSpecs.test(plan)) fail("implementation-plan.md: missing review against specs/tickets");

const depBlock = (id) => {
  const m = depsText.match(new RegExp(`\\n\\s{2}${id}:\\s*\\n([\\s\\S]*?)(?=\\n\\s{2}TICKET-\\d+:|\\n\\S|$)`));
  return m ? m[1].replace(/^ {4}/gm, "") : "";
};
const tickets = new Map();
const groups = new Map();
for (const file of walk(plans).filter((p) => p.endsWith(".md") && p.includes(`${path.sep}tickets${path.sep}`))) {
  const rel = path.relative(plans, file);
  const text = read(file);
  const front = fm(text);
  const id = scalar(front, "id");
  const status = scalar(front, "status");
  const active = !["blocked", "done", "skipped"].includes(status);
  ["id", "wave", "status", "parallel_group", "depends_on", "blocked_by", "slice_type", "phase_gate_exception"].forEach((k) => !front.includes(`${k}:`) && fail(`${rel}: missing ${k}`));
  if (status && !statuses.includes(status)) fail(`${rel}: invalid status ${status}`);
  if (active && !sliceTypes.includes(scalar(front, "slice_type"))) fail(`${rel}: invalid slice_type`);
  if (active && !/^(true|false)$/.test(scalar(front, "phase_gate_exception"))) fail(`${rel}: phase_gate_exception must be true or false`);
  ["spec_refs", "write_scope", "read_scope"].forEach((k) => !hasList(front, k) && fail(`${rel}: missing ${k}`));
  ["Goal", "Context Digest", "Implementation Approach", "Action Plan", "Spec Drift Controls", "Generator And Type Plan", "Slice Strategy", "Test-First Order", "Modularity And Reuse Plan", "Tasks", "Acceptance", "End-To-End Definition Coverage", "Operational Path Coverage", "Review And Verification Plan", "Verification", "Non-goals", "Handoff"].forEach((s) => !text.includes(`## ${s}`) && fail(`${rel}: missing ${s}`));
  if (status !== "blocked" && child(front, "contract_readiness", "status") !== "ready") fail(`${rel}: contract_readiness.status must be ready`);
  if (status !== "blocked" && !childList(front, "contract_readiness", "required_contracts").length) fail(`${rel}: missing required_contracts`);
  if (childList(front, "contract_readiness", "missing_contracts").length) fail(`${rel}: missing_contracts must be empty`);
  if (active && !front.includes("generated_contracts:")) fail(`${rel}: missing generated_contracts`);
  if (active && !generated.test(block(front, "generated_contracts"))) fail(`${rel}: generated_contracts lacks generation/test/drift disposition`);
  if (active && child(front, "ticket_readiness", "status") !== "implementation_ready") fail(`${rel}: ticket_readiness.status must be implementation_ready`);
  if (active && childList(front, "ticket_readiness", "open_decisions").length) fail(`${rel}: open_decisions must be empty`);
  if (active && childList(front, "ticket_readiness", "ambiguous_phrases").length) fail(`${rel}: ambiguous_phrases must be empty`);
  ["Decision Ledger", "Requirements Traceability", "Contract Traceability", "Acceptance Test Matrix"].forEach((s) => active && !text.includes(`## ${s}`) && fail(`${rel}: missing ${s}`));
  if (active && bad.test(text)) fail(`${rel}: drift-prone decision language`);
  if (active && fake.test(text) && !/\b(test fixture|fake provider|mock provider|test double|contract test)\b/i.test(text)) fail(`${rel}: fake/mock implementation shortcut`);
  if (/ask (the )?human|ask user|read (all|the full|entire) specs/i.test(text)) fail(`${rel}: asks for clarification or too much context`);
  if (active && !happy.test(text)) fail(`${rel}: missing happy/success path coverage`);
  if (active && !unhappy.test(text)) fail(`${rel}: missing unhappy/failure path coverage`);
  if (active && !nfr.test(text)) fail(`${rel}: missing NFR disposition`);
  if (active && !generated.test(text)) fail(`${rel}: missing generated contract/codegen disposition`);
  if (active && !frontend.test(text)) fail(`${rel}: missing frontend/client UX or N/A disposition`);
  if (active && !e2eDefinition.test(text)) fail(`${rel}: missing capability inventory/end-to-end definition disposition`);
  if (active && !slice.test(text)) fail(`${rel}: missing vertical slice strategy or horizontal exception`);
  if (active && !coverage.test(text)) fail(`${rel}: missing unit/E2E test or coverage disposition`);
  if (active && !testFirst.test(text)) fail(`${rel}: missing test-first order`);
  if (active && !acceptanceStatus.test(text)) fail(`${rel}: missing acceptance matrix row status disposition`);
  if (active && !preflightArtifacts.test(text)) fail(`${rel}: missing generated artifact/preflight disposition`);
  if (active && !cleanRebuild.test(text)) fail(`${rel}: missing clean rebuild/incremental strategy disposition`);
  if (active && !generationMap.test(text)) fail(`${rel}: missing generation map/source-contract disposition`);
  if (active && !strongBoundary.test(text)) fail(`${rel}: missing strong boundary type disposition`);
  if (active && !strictTyping.test(text)) fail(`${rel}: missing strict typing/type-check disposition`);
  if (active && !modularity.test(text)) fail(`${rel}: missing modular domain/topic structure disposition`);
  if (active && !reuse.test(text)) fail(`${rel}: missing reuse/no-duplication disposition`);
  if (active && !reviewAgainstSpecs.test(text)) fail(`${rel}: missing review against ticket/specs`);
  if (active && !specDrift.test(section(text, "Spec Drift Controls"))) fail(`${rel}: Spec Drift Controls lacks source refs and drift guardrails`);
  if (active && !generated.test(section(text, "Generator And Type Plan"))) fail(`${rel}: Generator And Type Plan lacks generator disposition`);
  if (active && !strictTyping.test(section(text, "Generator And Type Plan"))) fail(`${rel}: Generator And Type Plan lacks strict typing/type-check proof`);
  if (active && !modularity.test(section(text, "Modularity And Reuse Plan"))) fail(`${rel}: Modularity And Reuse Plan lacks domain/topic structure`);
  if (active && !reuse.test(section(text, "Modularity And Reuse Plan"))) fail(`${rel}: Modularity And Reuse Plan lacks reuse/no-duplication proof`);
  if (active && !reviewAgainstSpecs.test(section(text, "Review And Verification Plan"))) fail(`${rel}: Review And Verification Plan must compare ticket to specs`);
  if (active && !e2eDefinition.test(section(text, "End-To-End Definition Coverage"))) fail(`${rel}: End-To-End Definition Coverage lacks capability/definition-chain refs`);
  if (active && scalar(front, "parallel_group") && !boundedParallel.test(text)) fail(`${rel}: parallel ticket lacks bounded sidecar/disjoint-scope guidance`);
  if (active && !/\b(requirement|acceptance).{0,80}\b(id|trace|source|spec_ref|verification)\b/i.test(text)) fail(`${rel}: missing requirement traceability`);
  const action = section(text, "Action Plan");
  if (active && !actionNumbered.test(action)) fail(`${rel}: Action Plan must use numbered executable steps`);
  if (active && !actionPreflight.test(action)) fail(`${rel}: Action Plan missing preflight/dependency step`);
  if (active && !actionContract.test(action)) fail(`${rel}: Action Plan missing contract/codegen or N/A step`);
  if (active && !actionTests.test(action)) fail(`${rel}: Action Plan missing test-first step`);
  if (active && !unhappy.test(action)) fail(`${rel}: Action Plan missing unhappy/failure-path test step`);
  if (active && !actionImplement.test(action)) fail(`${rel}: Action Plan missing implementation edit step`);
  if (active && !actionVerify.test(action)) fail(`${rel}: Action Plan missing verification/proof step`);
  if (active && !actionCommand.test(action)) fail(`${rel}: Action Plan missing exact commands`);
  if (active && !actionPath.test(action)) fail(`${rel}: Action Plan missing exact files or directories`);
  if (active && badAction.test(action)) fail(`${rel}: Action Plan uses vague implementation instructions`);
  const writeDomains = new Set(list(front, "write_scope").map(domainForScope));
  const multiLayer = writeDomains.size >= 4 || (writeDomains.has("contracts") && writeDomains.has("backend") && writeDomains.has("frontend"));
  if (active && multiLayer && scalar(front, "phase_gate_exception") !== "true") fail(`${rel}: broad multi-layer ticket must be split or marked phase_gate_exception: true`);
  if (active && scalar(front, "phase_gate_exception") === "true" && !phaseGate.test(action)) fail(`${rel}: phase-gated exception missing Phase Gate proof points`);
  for (const ref of list(front, "spec_refs")) {
    const target = ref.split("#")[0];
    if (target.startsWith(`${specsName}/`) && !exists(path.join(root, target))) fail(`${rel}: missing spec_ref ${ref}`);
  }
  const group = scalar(front, "parallel_group");
  if (group) groups.set(group, [...(groups.get(group) || []), { rel, scopes: list(front, "write_scope") }]);
  if (id) tickets.set(id, { rel, deps: list(front, "depends_on"), blocked: list(front, "blocked_by"), wave: Number(scalar(front, "wave")) || 0 });
}

for (const d of exists(plans) ? fs.readdirSync(plans, { withFileTypes: true }).filter((e) => e.isDirectory() && /^wave_\d+_/.test(e.name)) : []) {
  const wp = read(path.join(plans, d.name, "plan.md"));
  if (!wp) fail(`${d.name}: missing plan.md`);
  ["End-to-End Outcome", "Implementation Order", "Slice Strategy"].forEach((s) => wp && !new RegExp(s, "i").test(wp) && fail(`${d.name}/plan.md: missing ${s}`));
  if (wp && !/Parallelization|Parallel Work|Isolation/i.test(wp)) fail(`${d.name}/plan.md: missing isolation notes`);
  if (wp && !/Resume|Pause|Status/i.test(wp)) fail(`${d.name}/plan.md: missing status notes`);
  if (wp && !/Operational Path|Path Coverage|Unhappy|Failure/i.test(wp)) fail(`${d.name}/plan.md: missing path coverage`);
  if (wp && !e2eDefinition.test(wp)) fail(`${d.name}/plan.md: missing capability inventory/end-to-end definition coverage`);
  if (wp && !/Security|Privacy|Performance|Resilience|Observability|Recovery|Data Integrity|Production|Release|Supply Chain|SBOM|Provenance|N\/A|Not Applicable/i.test(wp)) fail(`${d.name}/plan.md: missing NFR/operations/supply-chain coverage`);
  if (wp && !generated.test(wp)) fail(`${d.name}/plan.md: missing generated contract/codegen coverage`);
  if (wp && !frontend.test(wp)) fail(`${d.name}/plan.md: missing frontend/client UX coverage or N/A evidence`);
  if (wp && !slice.test(wp)) fail(`${d.name}/plan.md: missing vertical slice strategy or horizontal exception`);
  if (wp && !coverage.test(wp)) fail(`${d.name}/plan.md: missing unit/E2E test or coverage ownership`);
  if (wp && !testFirst.test(wp)) fail(`${d.name}/plan.md: missing test-first implementation order`);
  if (wp && !cleanRebuild.test(wp)) fail(`${d.name}/plan.md: missing clean rebuild/incremental strategy`);
  if (wp && !generationMap.test(wp)) fail(`${d.name}/plan.md: missing generation map/source-contract coverage`);
  if (wp && !strongBoundary.test(wp)) fail(`${d.name}/plan.md: missing strong boundary type coverage`);
  if (wp && !boundedParallel.test(wp)) fail(`${d.name}/plan.md: missing bounded parallel-agent guidance or N/A evidence`);
  if (!exists(path.join(plans, d.name, "tickets"))) fail(`${d.name}: missing tickets/`);
}
for (const [id, t] of tickets) {
  const db = depBlock(id);
  if (!db) fail(`_dependencies.yaml: missing ${id}`);
  if (db && !same(list(db, "depends_on").sort(), t.deps.slice().sort())) fail(`_dependencies.yaml: ${id}.depends_on differs`);
  if (db && !same(list(db, "blocked_by").sort(), t.blocked.slice().sort())) fail(`_dependencies.yaml: ${id}.blocked_by differs`);
  for (const dep of t.deps) {
    if (!tickets.has(dep)) fail(`${t.rel}: missing dependency ${dep}`);
    if (tickets.get(dep)?.wave > t.wave) fail(`${t.rel}: depends on later-wave ${dep}`);
    if (!list(depBlock(dep), "unblocks").includes(id)) fail(`_dependencies.yaml: ${dep}.unblocks missing ${id}`);
  }
  for (const b of t.blocked) if (!tickets.has(b)) fail(`${t.rel}: missing blocker ${b}`);
}
for (const [g, xs] of groups) for (let i = 0; i < xs.length; i++) for (const y of xs.slice(i + 1)) {
  if (xs[i].scopes.some((a) => y.scopes.some((b) => overlap(a, b)))) fail(`${g}: ${xs[i].rel} overlaps ${y.rel}`);
}

if (out.length) {
  console.log("plan lint failed");
  out.forEach((p) => console.log(`- ${p}`));
  process.exit(1);
}
console.log("plan lint ok");
