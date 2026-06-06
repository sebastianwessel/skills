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
const contractTerm = String.raw`contract definition|interface definition|schema definition|machine-readable|source of truth|OpenAPI|GraphQL|AsyncAPI|JSON Schema|gRPC|protobuf|CloudEvents|Avro|Thrift|Smithy|OpenRPC|RAML|YANG|WSDL|schema registry|schema artifact|IDL`;
const generationMapTerm = String.raw`generation map|source contracts?|generated package|record ID template|derived component|service owner|generated outputs?|drift check`;
const weakBoundaryTerm = String.raw`map\\[string\\]any|TypeScript any|TS any|type any|literal any|TypeScript unknown|TS unknown|type unknown|literal unknown|Record<string, unknown>|anonymous map|handwritten duplicate interface|weak boundary type|strong boundary type|closed contract|open JSON leaf|JSONValue|json\\.RawMessage|additionalProperties`;
const clientTerm = String.raw`frontend|client|consumer|UI|SDK|CLI|web app|mobile app|integration|adapter|N/A|not applicable`;
const frontendTerm = String.raw`frontend|UI|UX|screen|surface|navigation|access path|user flow|UI state|design system|design\.md|framework component|reusable component|shared styles|CSS|tokens|N/A|not applicable`;
const fileStructureTerm = String.raw`file structure|folder structure|directory structure|repository structure|project structure|domain folders?|topic folders?|nested folders?|ownership boundaries|shared module|reusable module|generated outputs?|generated artifacts?|public entrypoints?|migrations?|runbooks?|not applicable|N/A`;
const currentResearchTerm = String.raw`current stable|latest stable|most recent|official docs?|primary documentation|package metadata|release metadata|changelog|release notes|version pin|dependency version|third-party|state of the art|dated research|research evidence|not applicable|N/A`;
const capabilityTerm = String.raw`capability inventory|feature inventory|capability ID|feature ID|business capability|user-facing|admin-facing|API-facing|CLI|SDK|worker|job|operational capability|not applicable|N/A`;
const e2eDefinitionTerm = String.raw`end-to-end definition|definition chain|actor|consumer|trigger|entrypoint|reachability|access path|preconditions|data touched|state transitions?|side effects?|permissions?|errors?|recovery|observability|acceptance|verification|final state`;
const dataLifecycleTerm = String.raw`data lifecycle|classification|PII|personal data|sensitive data|collection reason|retention|deletion|anonymization|export|access request|masking|redaction|residency|lineage|no-data-loss|not applicable|N/A`;
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const f = path.join(d, e.name);
  return e.isDirectory() ? walk(f) : [f];
}) : [];

const gates = [
  "no_drift_gate", "ambiguity_gate", "semantic_alignment_gate",
  "spec_structure_gate", "visualization_gate", "requirements_quality_gate",
  "end_to_end_definition_gate", "file_structure_gate", "current_dependency_research_gate", "concise_spec_gate", "client_consumer_coverage_gate",
  "frontend_ux_integration_gate", "standards_first_gate", "machine_readable_contract_gate",
  "async_semantics_gate", "clean_rebuild_boundary_gate", "generation_map_gate",
  "strong_boundary_type_gate", "interface_gate", "e2e_gate",
  "unhappy_path_gate", "security_privacy_gate", "observability_gate",
  "performance_resilience_gate", "data_integrity_recovery_gate",
  "production_readiness_gate", "supply_chain_gate", "wave_readiness",
  "migration_gate", "checklist_walk_gate", "contradiction_check", "spec_judge_loop", "semantic_judge_gate",
  "self_audit_gate", "gate_simulation",
];

if (!fs.existsSync(root)) {
  fail(`Missing spec root: ${root}`);
} else {
  const all = walk(root), text = all.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  const contractFiles = all.filter((f) =>
    rel(f).startsWith("03-contracts/") &&
    /\.(ya?ml|json|graphql|gql|proto|avsc|thrift|smithy|yang|wsdl|raml)$/i.test(f)
  );
  [".readiness-report.yaml", "_registry.yaml", "_provenance.yaml", "00-vision.md",
   "00-stack.md", "00-conventions.md", "00-architecture-overview.md",
   "00-file-structure.md", "02-capabilities/capability-inventory.md",
   "glossary.md"]
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
    if (!/spec_judge_loop:[\s\S]*?run_timing:\s*approval_only\b/m.test(report)) fail("spec_judge_loop.run_timing must be approval_only");
    if (!/spec_judge_loop:[\s\S]*?reviewed_flows:\s*\n\s+-\s+flow_id:/m.test(report)) fail("spec_judge_loop must record reviewed_flows");
    if (!/spec_judge_loop:[\s\S]*?blocking_findings_count:\s*0\b/m.test(report)) fail("spec_judge_loop.blocking_findings_count must be 0");
    if (!/checklist_walk:[\s\S]*?topics:\s*\n\s+\w+:/m.test(report)) fail("checklist_walk must record reviewed topics");
    if (!/checklist_walk:[\s\S]*?blocking_findings_count:\s*0\b/m.test(report)) fail("checklist_walk.blocking_findings_count must be 0");
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
      [/\b(as appropriate|if needed|where possible|to be determined|decide later|future work will decide|handle errors|support auth|validate input|make configurable|sync data|recover gracefully|log appropriately|securely|performant|best effort|best practices|standard protocols)\b/i, "ambiguous implementation language", true],
      [new RegExp(`\\b(GraphQL|TypeScript|JavaScript|Go|Python|OpenAPI|REST|AsyncAPI|JSON Schema|gRPC|protobuf|CloudEvents|Avro|Thrift|Smithy|OpenRPC|RAML|YANG|WSDL|schema registry|contract|schema|IDL)\\b`, "i"), "Missing type mapping", false, /\b(null|undefined|omitted|required|optional|type mapping|semantic mapping)\b/i],
      [/\b(async|queue|stream|event|job|worker|callback|goroutine|promise|coroutine)\b/i, "Missing async semantics", false, /\b(timeout|retry|cancellation|idempotency|ordering|concurrency|ack|backpressure)\b/i],
      [/\b(unhappy|failure path|validation failure|authorization|denial|timeout|retry|rollback|recovery|cancellation|manual intervention)\b/i, "Missing unhappy/recovery paths"],
      [/\b(business|user|customer|outcome|goal|why|rationale)\b/i, "Missing business context"],
      [/\b(requirement|flow|contract|NFR|acceptance).{0,80}\b(id|trace|source|owner|priority|risk|verification method|test|inspection|analysis|demo)\b/i, "Missing requirement traceability"],
      [new RegExp(`\\b(${capabilityTerm})\\b`, "i"), "Missing capability/feature inventory or N/A evidence"],
      [new RegExp(`\\b(${e2eDefinitionTerm})\\b`, "i"), "Missing end-to-end definition chain evidence"],
      [new RegExp(`\\b(${dataLifecycleTerm})\\b`, "i"), "Missing data lifecycle/classification/retention evidence or N/A evidence"],
      [/\b(component|module|service|package|workflow|process|interface|contract|frontend|UX|design|accessibility|reusable)\b/i, "Missing component/workflow structure"],
      [new RegExp(`\\b(${fileStructureTerm})\\b`, "i"), "Missing file/folder structure or N/A evidence"],
      [new RegExp(`\\b(${currentResearchTerm})\\b`, "i"), "Missing current dependency/docs/research evidence"],
      [/\b(concise|single source of truth|one source of truth|no duplicate|no stale|centralize|link instead of duplicating|shared facts)\b/i, "Missing concise single-source spec discipline"],
      [/\b(end-to-end|e2e|full working solution|complete working solution|coverage matrix|entrypoint).{0,120}\b(success|failure|verification|client|consumer|frontend|service|state)\b/i, "Missing E2E coverage matrix evidence"],
      [new RegExp(`\\b(${clientTerm})\\b`, "i"), "Missing frontend/client/consumer coverage or N/A evidence"],
      [new RegExp(`\\b(${frontendTerm})\\b`, "i"), "Missing frontend UX/design reuse or N/A evidence"],
      [/\b(reuse|reusable|shared|design system|design\.md|framework component|shared styles|CSS|tokens|custom UI|N\/A|not applicable)\b/i, "Missing frontend reuse or N/A evidence"],
      [/\b(source of truth|link|see |references?|shared|central|registry)\b/i, "Missing source links"],
      [/\b(standard|industry|ecosystem-native|convention|OpenTelemetry|structured JSON|RFC 9457|contract definition|interface definition|schema definition|OpenAPI|GraphQL|AsyncAPI|JSON Schema|gRPC|protobuf|CloudEvents|Avro|Thrift|Smithy|OpenRPC|RAML|YANG|WSDL|schema registry|OAuth|OIDC|JWT|framework-native|ports-and-adapters)\b/i, "Missing standards"],
      [new RegExp(`\\b(${contractTerm})\\b`, "i"), "Missing machine-readable contract source"],
      [/\b(clean rebuild|incremental patch|incremental refactor|contract-first rebuild|compatibility fallback|stale alias|breaking change|old boundary|new boundary|not applicable|N\/A)\b/i, "Missing clean rebuild boundary decision or N/A evidence"],
      [new RegExp(`\\b(${generationMapTerm})\\b`, "i"), "Missing generation map/source-contract ownership or N/A evidence"],
      [new RegExp(`\\b(${weakBoundaryTerm})\\b`, "i"), "Missing strong boundary type policy or N/A evidence"],
      [/\b(deterministic generator|generator|codegen|regeneration command|generated types?|generated clients?|generated validators?|generated tests?|contract tests?|drift check|not applicable|N\/A)\b/i, "Missing contract generation/tooling evidence"],
      [/\b(security|privacy|PII|personal data|confidential|restricted|secret|credential|redaction|trust boundary|authorization|tenancy|input validation|output encoding)\b/i, "Missing security/privacy"],
      [/\b(log level|logging|observability|audit|metric|trace|correlation|redaction)\b/i, "Missing observability"],
      [/\b(performance|latency|throughput|rate limit|capacity|memory|CPU|pagination|batching|backpressure|timeout budget|retry budget|overload)\b/i, "Missing performance budgets"],
      [/\b(data integrity|consistency|state transition|transaction|rollback|compensation|checkpoint|idempotency|recovery|self-healing|manual intervention|data loss)\b/i, "Missing integrity/recovery"],
      [/\b(production readiness|deployment|environment|configuration|config|secret|SLO|SLA|error budget|runbook|incident|backup|restore|rollback|rollout|release|readiness|liveness|operational owner|support handoff|not applicable|N\/A)\b/i, "Missing production/release"],
      [/\b(supply chain|dependency policy|lockfile|vulnerability|license|SBOM|SPDX|CycloneDX|SLSA|provenance|attestation|signing|artifact|container|base image|secret scan|not applicable|N\/A)\b/i, "Missing supply chain"],
    ];
    all.forEach((f) => must[0][0].test(fs.readFileSync(f, "utf8")) && fail(`${rel(f)} contains ${must[0][1]}`));
    if (/\b(every file|all files|complete file list|exhaustive file list)\b/i.test(text)) {
      fail("File/folder structure over-specifies every file");
    }
    for (const [trigger, msg, badOnly, required] of must.slice(1)) {
      if (required ? trigger.test(text) && !required.test(text) : !trigger.test(text)) fail(msg);
    }
    const hasInterfaceScope = /\b(interface|contract|API|endpoint|GraphQL|REST|HTTP|event|message|queue|topic|webhook|SDK|CLI|plugin|configuration|schema|storage shape|data model)\b/i.test(text);
    const machineReadableNotApplicable = /\b(machine-readable contract|contract artifact|03-contracts).{0,120}\b(not applicable|n\/a|no interface|no transport|no message|no durable data contract)\b/i.test(text);
    if (hasInterfaceScope && !machineReadableNotApplicable && contractFiles.length === 0) {
      fail("Missing machine-readable contract artifact in specs/03-contracts");
    }
    const hasMachineReadableContract = new RegExp(`\\b(${contractTerm})\\b`, "i").test(text);
    const generationNotApplicable = /\b(generator|codegen|generated|regeneration|drift check).{0,120}\b(not applicable|n\/a|unavailable|unsafe|out of scope)\b/i.test(text);
    if (hasMachineReadableContract && !generationNotApplicable && !/\b(deterministic generator|generator|codegen|regeneration command|generated types?|generated clients?|generated validators?|generated tests?|contract tests?|drift check)\b/i.test(text)) {
      fail("Missing deterministic generator/tooling, generated output, or drift-check evidence");
    }
    const thirdPartyScope = /\b(dependency|package|library|framework|database|ORM|cloud|provider|third-party|API client|SDK|driver|service)\b/i.test(text);
    const currentResearchNotApplicable = /\b(current dependency|third-party|external dependency|dependency version).{0,120}\b(not applicable|n\/a|no external dependency|no third-party)\b/i.test(text);
    if (thirdPartyScope && !currentResearchNotApplicable && !new RegExp(`\\b(${currentResearchTerm})\\b`, "i").test(text)) {
      fail("Missing current primary documentation, package/release metadata, or dated research evidence for third-party choices");
    }
    const hasOverlappingContracts = /\b(GraphQL|AsyncAPI|JSON Schema|error taxonomy|database record|service manifest|frontend contract|client contract)\b/i.test(text);
    const generationMapNotApplicable = /\b(generation map|mapping metadata).{0,120}\b(not applicable|n\/a|source contracts complete|single contract surface)\b/i.test(text);
    if (hasOverlappingContracts && !generationMapNotApplicable && !new RegExp(`\\b(${generationMapTerm})\\b`, "i").test(text)) {
      fail("Missing generation map for overlapping contract surfaces");
    }
    if (!exists("03-flows/e2e-coverage.md")) {
      fail("Missing E2E coverage matrix: 03-flows/e2e-coverage.md");
    }
    const frontendScope = /\b(frontend|UI|UX|screen|page|route|navigation|web app|mobile app|desktop app|dashboard|widget)\b/i.test(text);
    const accessPathNotApplicable = /\b(access path|user journey|screen|surface|navigation|frontend).{0,140}\b(not applicable|n\/a|no frontend|no user interface|api-only|backend-only)\b/i.test(text);
    if (frontendScope && !accessPathNotApplicable && !/\b(access path|user journey|reachability path|navigation|deep link|screen|surface|loading|empty|error|denied|success|recovery state)\b/i.test(text)) {
      fail("Missing frontend/user journey reachability and UI state evidence");
    }
    const piiScope = /\b(PII|personal data|sensitive data|confidential data|privacy|data subject|customer data|user data)\b/i.test(text);
    const piiNotApplicable = /\b(PII|personal data|sensitive data|privacy).{0,120}\b(not applicable|n\/a|no personal data|no sensitive data)\b/i.test(text);
    if (piiScope && !piiNotApplicable && !/\b(classification|collection reason|retention|deletion|anonymization|export|access request|masking|redaction|residency)\b/i.test(text)) {
      fail("Missing PII/privacy lifecycle evidence: classification, retention, deletion/export, masking/redaction, or residency");
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
