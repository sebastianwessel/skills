#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseYaml, yamlStrings } from "./lib/simple-yaml.mjs";

const root = path.resolve(process.argv[2] || "specs");
const errors = [], warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const at = (file) => path.join(root, file);
const exists = (file) => fs.existsSync(at(file));
const read = (file) => fs.readFileSync(at(file), "utf8");
const rel = (file) => path.relative(root, file).split(path.sep).join("/");
const hash = (value) => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isId = (value) => isNonEmptyString(value) && /^[A-Za-z][A-Za-z0-9_.:-]*$/.test(value);
const isStringList = (value, minimum = 0) => Array.isArray(value) && value.length >= minimum && value.every(isNonEmptyString);
const contractTerm = String.raw`contract definition|interface definition|schema definition|machine-readable|source of truth|OpenAPI|GraphQL|AsyncAPI|JSON Schema|gRPC|protobuf|CloudEvents|Avro|Thrift|Smithy|OpenRPC|RAML|YANG|WSDL|schema registry|schema artifact|IDL`;
const generationMapTerm = String.raw`generation map|source contracts?|generated package|record ID template|derived component|service owner|generated outputs?|drift check`;
const weakBoundaryTerm = String.raw`map\\[string\\]any|TypeScript any|TS any|type any|literal any|TypeScript unknown|TS unknown|type unknown|literal unknown|Record<string, unknown>|anonymous map|handwritten duplicate interface|weak boundary type|strong boundary type|closed contract|open JSON leaf|JSONValue|json\\.RawMessage|additionalProperties`;
const currentResearchTerm = String.raw`current stable|latest stable|most recent|official docs?|primary documentation|package metadata|release metadata|changelog|release notes|version pin|dependency version|third-party|state of the art|dated research|research evidence|not applicable|N/A`;
const walk = (directory) => fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
}) : [];
const structured = (file) => {
  if (!exists(file)) return null;
  try { return parseYaml(read(file), file); }
  catch (error) { fail(`${file} invalid structured YAML: ${error.message}`); return null; }
};
const gates = [
  "no_drift_gate", "ambiguity_gate", "semantic_alignment_gate", "spec_structure_gate", "visualization_gate",
  "requirements_quality_gate", "end_to_end_definition_gate", "file_structure_gate", "current_dependency_research_gate",
  "concise_spec_gate", "client_consumer_coverage_gate", "frontend_ux_integration_gate", "standards_first_gate",
  "machine_readable_contract_gate", "async_semantics_gate", "clean_rebuild_boundary_gate", "generation_map_gate",
  "strong_boundary_type_gate", "representation_reuse_gate", "interface_gate", "e2e_gate", "unhappy_path_gate",
  "security_privacy_gate", "observability_gate", "performance_resilience_gate", "data_integrity_recovery_gate",
  "production_readiness_gate", "supply_chain_gate", "wave_readiness", "migration_gate", "checklist_walk_gate",
  "contradiction_check", "spec_judge_loop", "semantic_judge_gate", "self_audit_gate", "gate_simulation",
];

function exactFile(value) {
  return isNonEmptyString(value) && !path.isAbsolute(value) && !value.includes("\\") && !value.split("/").includes("..") && value !== ".";
}

function validateManifest(all) {
  const file = "spec-manifest.yaml";
  const manifest = structured(file);
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) return null;
  if (manifest.spec_manifest_version !== 1) fail(`${file}.spec_manifest_version must be 1`);
  if (!/^sha256:[a-f0-9]{64}$/.test(manifest.content_digest || "")) fail(`${file}.content_digest must be a sha256 digest`);
  if (!Array.isArray(manifest.artifacts) || !manifest.artifacts.length) fail(`${file}.artifacts must be a non-empty list`);
  // The manifest and approval/provenance records are attestations about the
  // source set. Excluding all three avoids a self-referential digest cycle.
  const expected = all.map(rel).filter((entry) => ![file, ".readiness-report.yaml", "_provenance.yaml"].includes(entry)).sort();
  const supplied = new Map();
  for (const entry of manifest.artifacts || []) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) { fail(`${file}.artifacts entries must be maps`); continue; }
    if (!exactFile(entry.path)) { fail(`${file}.artifacts has invalid path`); continue; }
    if (!/^sha256:[a-f0-9]{64}$/.test(entry.sha256 || "")) fail(`${file}.artifacts.${entry.path}.sha256 must be a sha256 digest`);
    if (supplied.has(entry.path)) fail(`${file}.artifacts has duplicate path: ${entry.path}`);
    supplied.set(entry.path, entry.sha256);
  }
  const actual = [];
  for (const entry of expected) {
    if (!supplied.has(entry)) fail(`${file} omits authoritative artifact: ${entry}`);
    else if (supplied.get(entry) !== hash(fs.readFileSync(at(entry)))) fail(`${file} hash does not match: ${entry}`);
    actual.push(`${entry}\0${hash(fs.readFileSync(at(entry)))}\n`);
  }
  for (const entry of supplied.keys()) if (!expected.includes(entry)) fail(`${file} names non-authoritative or missing artifact: ${entry}`);
  const digest = hash(actual.sort().join(""));
  if (manifest.content_digest !== digest) fail(`${file}.content_digest does not match the declared artifact set`);
  const provenance = manifest.provenance;
  if (!provenance || typeof provenance !== "object" || Array.isArray(provenance)) fail(`${file}.provenance must be a map`);
  else {
    ["source_revision", "generated_at", "generator"].forEach((key) => !isNonEmptyString(provenance[key]) && fail(`${file}.provenance.${key} is required`));
    if (isNonEmptyString(provenance.generated_at) && Number.isNaN(Date.parse(provenance.generated_at))) fail(`${file}.provenance.generated_at must be ISO-8601`);
  }
  const rootProvenance = structured("_provenance.yaml");
  if (rootProvenance && (!rootProvenance.spec_manifest || rootProvenance.spec_manifest.content_digest !== manifest.content_digest)) {
    fail(`_provenance.yaml.spec_manifest.content_digest must equal ${file}.content_digest`);
  }
  return manifest;
}

function validateReadinessReport(report, manifest) {
  if (!report || typeof report !== "object" || Array.isArray(report)) return false;
  const approved = report.status === "approved";
  if (!["draft", "needs_human_review", "approved", "blocked"].includes(report.status)) fail(".readiness-report.yaml.status is invalid");
  if (!approved) return false;
  if (report.language !== "en") fail(".readiness-report.yaml.language must be en");
  if (!Array.isArray(report.open_decisions) || report.open_decisions.length) fail(".readiness-report.yaml.open_decisions must be []");
  const approval = report.approval_evidence;
  if (!approval || typeof approval !== "object" || Array.isArray(approval)) fail("Approved readiness requires approval_evidence");
  else {
    if (approval.status !== "approved") fail("approval_evidence.status must be approved");
    ["approver_id", "approved_at", "approval_ref", "manifest_digest"].forEach((key) => !isNonEmptyString(approval[key]) && fail(`approval_evidence.${key} is required`));
    if (isNonEmptyString(approval.approved_at) && Number.isNaN(Date.parse(approval.approved_at))) fail("approval_evidence.approved_at must be ISO-8601");
    if (!isStringList(approval.scope_refs, 1)) fail("approval_evidence.scope_refs must be a non-empty list");
    if (manifest && approval.manifest_digest !== manifest.content_digest) fail("approval_evidence.manifest_digest must match spec-manifest.yaml.content_digest");
  }
  if (report.human_approval?.status !== "approved") fail("human_approval.status must be approved");
  const gateMap = report.gates && typeof report.gates === "object" ? report.gates : report;
  for (const gate of gates) if (gateMap[gate]?.status !== "passed") fail(`${gate}.status must pass`);
  const judge = report.spec_judge_loop;
  if (!judge || judge.run_timing !== "approval_only" || !Array.isArray(judge.reviewed_flows) || !judge.reviewed_flows.length || judge.blocking_findings_count !== 0) {
    fail("spec_judge_loop must be approval-only, record reviewed flows, and have zero blocking findings");
  }
  const walkEvidence = report.checklist_walk;
  if (!walkEvidence || !walkEvidence.topics || typeof walkEvidence.topics !== "object" || Array.isArray(walkEvidence.topics) || walkEvidence.blocking_findings_count !== 0) {
    fail("checklist_walk must record scoped topics and have zero blocking findings");
  }
  const semantic = report.semantic_judge_evidence;
  if (!semantic || semantic.status !== "passed" || !isNonEmptyString(semantic.judge) || !isNonEmptyString(semantic.evidence_ref) || !isNonEmptyString(semantic.reviewed_at)) {
    fail("semantic_judge_evidence requires passed status, judge, evidence_ref, and reviewed_at");
  }
  return approved;
}

function validateArtifactContracts() {
  const applicability = structured("00-applicability.yaml");
  if (!applicability || applicability.applicability_version !== 1 || !Array.isArray(applicability.concerns)) {
    fail("00-applicability.yaml must declare applicability_version: 1 and concerns");
  } else {
    const ids = new Set();
    for (const concern of applicability.concerns) {
      if (!concern || !isId(concern.concern_id) || ids.has(concern.concern_id)) fail("00-applicability.yaml concerns need unique concern_id values");
      ids.add(concern?.concern_id);
      if (!["applicable", "not_applicable"].includes(concern?.status)) fail(`00-applicability.yaml.${concern?.concern_id}.status is invalid`);
      if (!isStringList(concern?.scope_refs, 1)) fail(`00-applicability.yaml.${concern?.concern_id}.scope_refs must be non-empty`);
      if (concern?.status === "not_applicable" && !isNonEmptyString(concern.rationale)) fail(`00-applicability.yaml.${concern?.concern_id}.rationale is required for not_applicable`);
    }
    if (!ids.has("representation_reuse")) fail("00-applicability.yaml must declare representation_reuse");
  }
  const authority = structured("00-decision-authority.yaml");
  if (!authority || authority.decision_authority_version !== 1 || !isStringList(authority.default_allowed_classes, 1) || !authority.default_allowed_classes.every((value) => ["D0", "D1"].includes(value))) {
    fail("00-decision-authority.yaml must restrict default_allowed_classes to D0/D1");
  }
  for (const decision of authority?.decisions || []) {
    if (!isId(decision?.decision_id) || !["D0", "D1", "D2", "D3"].includes(decision?.class) || !isNonEmptyString(decision?.authority) || !isStringList(decision?.scope_refs, 1)) {
      fail("00-decision-authority.yaml decisions require id, class, authority, and scope_refs");
    }
    if (["D2", "D3"].includes(decision?.class) && !isStringList(decision?.source_refs, 1)) fail(`${decision.decision_id}.source_refs is required for D2/D3`);
  }
  const policy = structured("00-policy-profile.yaml");
  if (!policy || policy.policy_profile_version !== 1 || !isStringList(policy.allowed_default_refs)) fail("00-policy-profile.yaml must declare version and allowed_default_refs");
  else {
    const profiles = new Map();
    for (const profile of policy.profiles || []) {
      if (!isId(profile?.policy_ref) || profiles.has(profile.policy_ref) || !isNonEmptyString(profile?.name) || !isNonEmptyString(profile?.source_ref) || !isStringList(profile?.allowed_classes, 1) || !profile.allowed_classes.every((value) => ["D0", "D1"].includes(value))) fail("00-policy-profile.yaml profiles require unique ref, name, source_ref, and D0/D1 allowed_classes");
      else profiles.set(profile.policy_ref, profile);
    }
    for (const ref of policy.allowed_default_refs) if (!profiles.has(ref)) fail(`00-policy-profile.yaml.allowed_default_refs has unknown policy: ${ref}`);
  }
  const reuse = structured("00-reuse-inventory.yaml");
  if (!reuse || reuse.reuse_inventory_version !== 1 || !isNonEmptyString(reuse.discovery_revision)) fail("00-reuse-inventory.yaml must declare version and discovery_revision");
  else if (!Array.isArray(reuse.assets)) fail("00-reuse-inventory.yaml.assets must be a list");
  else {
    if (!reuse.assets.length && !isNonEmptyString(reuse.no_assets_rationale)) fail("00-reuse-inventory.yaml.no_assets_rationale is required when assets is empty");
    const ids = new Set();
    for (const asset of reuse.assets) {
      if (!isId(asset?.asset_id) || ids.has(asset.asset_id) || !isId(asset.kind) || !isNonEmptyString(asset.path) || !isNonEmptyString(asset.public_export) || !isId(asset.owner) || !isNonEmptyString(asset.stability) || !isStringList(asset.consumers, 1) || !isNonEmptyString(asset.extension_policy)) fail("00-reuse-inventory.yaml assets require unique id, kind, path, public_export, owner, stability, consumers, and extension_policy");
      ids.add(asset?.asset_id);
    }
  }
  const modules = structured("00-module-boundaries.yaml");
  if (!modules || modules.module_boundary_version !== 1 || !Array.isArray(modules.modules)) fail("00-module-boundaries.yaml must declare version and modules");
  else {
    if (!modules.modules.length && !isNonEmptyString(modules.no_modules_rationale)) fail("00-module-boundaries.yaml.no_modules_rationale is required when modules is empty");
    const ids = new Set();
    for (const module of modules.modules) {
      if (!isId(module?.module_id) || ids.has(module.module_id) || !isId(module.owner) || !isNonEmptyString(module.public_entrypoint) || !isStringList(module.owned_concepts, 1) || !Array.isArray(module.allowed_dependencies) || !Array.isArray(module.forbidden_dependencies) || !module.allowed_dependencies.every(isId) || !module.forbidden_dependencies.every(isId)) fail("00-module-boundaries.yaml modules require unique id, owner, public_entrypoint, owned_concepts, and dependency ID lists");
      ids.add(module?.module_id);
    }
  }
}

function validateTraceability(registry) {
  const file = "00-traceability.yaml";
  const trace = structured(file);
  if (!trace || trace.traceability_version !== 1) { fail(`${file}.traceability_version must be 1`); return; }
  const groups = [["requirements", "requirement_id"], ["capabilities", "capability_id"], ["paths", "path_id"], ["acceptance", "acceptance_id"]];
  const indexes = new Map();
  for (const [group, idField] of groups) {
    const records = trace[group];
    if (!Array.isArray(records) || !records.length) { fail(`${file}.${group} must be a non-empty list`); indexes.set(group, new Map()); continue; }
    const values = new Map();
    for (const item of records) {
      const id = item?.[idField];
      if (!item || typeof item !== "object" || Array.isArray(item) || !isId(id) || values.has(id)) fail(`${file}.${group} needs unique ${idField} values`);
      else values.set(id, item);
    }
    indexes.set(group, values);
  }
  const requirements = indexes.get("requirements"), capabilities = indexes.get("capabilities"), paths = indexes.get("paths"), acceptance = indexes.get("acceptance");
  const refs = (values, target, label) => {
    if (!isStringList(values, 1)) { fail(`${label} must be a non-empty ID list`); return; }
    for (const id of values) if (!target.has(id)) fail(`${label} has unknown ID: ${id}`);
  };
  for (const [id, item] of requirements) {
    refs(item.capability_ids, capabilities, `${file}.requirements.${id}.capability_ids`);
    refs(item.path_ids, paths, `${file}.requirements.${id}.path_ids`);
    refs(item.acceptance_ids, acceptance, `${file}.requirements.${id}.acceptance_ids`);
    for (const capabilityId of item.capability_ids || []) if (capabilities.get(capabilityId) && !capabilities.get(capabilityId).requirement_ids?.includes(id)) fail(`${file}: ${id} is not reciprocal with capability ${capabilityId}`);
    for (const pathId of item.path_ids || []) if (paths.get(pathId) && !paths.get(pathId).requirement_ids?.includes(id)) fail(`${file}: ${id} is not reciprocal with path ${pathId}`);
    for (const acceptanceId of item.acceptance_ids || []) if (acceptance.get(acceptanceId) && !acceptance.get(acceptanceId).requirement_ids?.includes(id)) fail(`${file}: ${id} is not reciprocal with acceptance ${acceptanceId}`);
  }
  for (const [id, item] of capabilities) {
    refs(item.requirement_ids, requirements, `${file}.capabilities.${id}.requirement_ids`);
    refs(item.path_ids, paths, `${file}.capabilities.${id}.path_ids`);
    for (const pathId of item.path_ids || []) if (paths.get(pathId) && !paths.get(pathId).capability_ids?.includes(id)) fail(`${file}: ${id} is not reciprocal with path ${pathId}`);
  }
  const registryIds = new Set(yamlStrings(registry));
  const pathKinds = new Set(["success", "validation_failure", "authorization_denial", "not_found", "conflict", "downstream_failure", "timeout", "cancellation", "recovery", "migration", "other"]);
  for (const [id, item] of paths) {
    refs(item.capability_ids, capabilities, `${file}.paths.${id}.capability_ids`);
    refs(item.requirement_ids, requirements, `${file}.paths.${id}.requirement_ids`);
    refs(item.acceptance_ids, acceptance, `${file}.paths.${id}.acceptance_ids`);
    if (!pathKinds.has(item.kind)) fail(`${file}.paths.${id}.kind is invalid`);
    if (!isStringList(item.contract_refs, 1)) fail(`${file}.paths.${id}.contract_refs must be a non-empty ID list`);
    for (const ref of item.contract_refs || []) if (!registryIds.has(ref)) fail(`${file}.paths.${id}.contract_refs has unregistered ref: ${ref}`);
    for (const acceptanceId of item.acceptance_ids || []) if (acceptance.get(acceptanceId) && !acceptance.get(acceptanceId).path_ids?.includes(id)) fail(`${file}: ${id} is not reciprocal with acceptance ${acceptanceId}`);
  }
  for (const [id, item] of acceptance) {
    refs(item.requirement_ids, requirements, `${file}.acceptance.${id}.requirement_ids`);
    refs(item.path_ids, paths, `${file}.acceptance.${id}.path_ids`);
    if (!isStringList(item.verification_refs, 1)) fail(`${file}.acceptance.${id}.verification_refs must be non-empty`);
  }
}

function validateCatalog(registry) {
  const file = "03-contracts/representation-catalog.yaml";
  const catalog = structured(file);
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) return;
  if (catalog.catalog_version !== 1) fail(`${file}.catalog_version must be 1`);
  const applicability = catalog.applicability;
  if (!applicability || !["applicable", "not_applicable"].includes(applicability.status) || !isStringList(applicability.scope_refs, 1)) fail(`${file}.applicability needs status and scope_refs`);
  if (applicability?.status === "not_applicable" && !isNonEmptyString(applicability.rationale)) fail(`${file}.applicability.rationale is required for not_applicable`);
  if (!Array.isArray(catalog.shapes) || !Array.isArray(catalog.mappings)) { fail(`${file}.shapes and ${file}.mappings must be lists`); return; }
  if (applicability?.status === "applicable" && !catalog.shapes.length) fail(`${file}.shapes must be non-empty when applicable`);
  if (applicability?.status === "not_applicable" && (catalog.shapes.length || catalog.mappings.length)) fail(`${file} cannot include shapes/mappings when not_applicable`);
  const allowedClasses = new Set(["domain", "boundary", "persistence", "command", "query", "projection"]);
  const allowedStability = new Set(["experimental", "internal", "versioned", "stable", "deprecated"]);
  const allowedOpen = new Set(["closed", "open_json_leaf"]);
  const shapes = new Map();
  const registryIds = new Set(yamlStrings(registry));
  for (const shape of catalog.shapes) {
    const prefix = `${file}.shapes`;
    if (!shape || typeof shape !== "object" || Array.isArray(shape) || !isId(shape.shape_id) || shapes.has(shape.shape_id)) { fail(`${prefix} needs unique shape_id values`); continue; }
    shapes.set(shape.shape_id, shape);
    if (!allowedClasses.has(shape.representation_class)) fail(`${prefix}.${shape.shape_id}.representation_class is invalid`);
    if (!isNonEmptyString(shape.canonical_source)) fail(`${prefix}.${shape.shape_id}.canonical_source is required`);
    else { const sourcePath = shape.canonical_source.split("#")[0]; if (sourcePath && !exists(sourcePath)) fail(`${prefix}.${shape.shape_id}.canonical_source does not exist: ${sourcePath}`); }
    if (!isId(shape.owner)) fail(`${prefix}.${shape.shape_id}.owner is required`);
    if (!allowedStability.has(shape.stability)) fail(`${prefix}.${shape.shape_id}.stability is invalid`);
    if (!allowedOpen.has(shape.open_policy)) fail(`${prefix}.${shape.shape_id}.open_policy is invalid`);
    if (!isStringList(shape.allowed_consumers, 1)) fail(`${prefix}.${shape.shape_id}.allowed_consumers must be non-empty`);
    if (!isStringList(shape.source_contract_refs, 1)) fail(`${prefix}.${shape.shape_id}.source_contract_refs must be non-empty`);
    for (const ref of shape.source_contract_refs || []) if (!registryIds.has(ref)) fail(`${prefix}.${shape.shape_id}.source_contract_refs has unregistered ref: ${ref}`);
    if (!Array.isArray(shape.mapping_refs) || !shape.mapping_refs.every(isId)) fail(`${prefix}.${shape.shape_id}.mapping_refs must be an ID list`);
  }
  const mappings = new Map();
  const directions = new Set(["domain_to_boundary", "boundary_to_domain", "domain_to_persistence", "persistence_to_domain", "domain_to_command", "command_to_domain", "domain_to_query", "query_to_domain", "domain_to_projection", "projection_to_domain", "custom"]);
  for (const mapping of catalog.mappings) {
    if (!mapping || typeof mapping !== "object" || Array.isArray(mapping) || !isId(mapping.mapping_id) || mappings.has(mapping.mapping_id)) { fail(`${file}.mappings needs unique mapping_id values`); continue; }
    mappings.set(mapping.mapping_id, mapping);
    if (!shapes.has(mapping.from_shape) || !shapes.has(mapping.to_shape) || mapping.from_shape === mapping.to_shape) fail(`${file}.mappings.${mapping.mapping_id} must link two distinct registered shapes`);
    if (!directions.has(mapping.direction)) fail(`${file}.mappings.${mapping.mapping_id}.direction is invalid`);
    if (!isStringList(mapping.allowed_differences, 1)) fail(`${file}.mappings.${mapping.mapping_id}.allowed_differences must be non-empty`);
    if (!isNonEmptyString(mapping.redaction_or_loss_policy)) fail(`${file}.mappings.${mapping.mapping_id}.redaction_or_loss_policy is required`);
    if (!isStringList(mapping.field_operations, 1)) fail(`${file}.mappings.${mapping.mapping_id}.field_operations must be non-empty`);
    if (!isStringList(mapping.verification, 1)) fail(`${file}.mappings.${mapping.mapping_id}.verification must be non-empty`);
  }
  for (const [shapeId, shape] of shapes) for (const ref of shape.mapping_refs || []) {
    const mapping = mappings.get(ref);
    if (!mapping) fail(`${file}.shapes.${shapeId}.mapping_refs has unknown mapping: ${ref}`);
    else if (mapping.from_shape !== shapeId && mapping.to_shape !== shapeId) fail(`${file}.shapes.${shapeId}.mapping_refs has unrelated mapping: ${ref}`);
  }
  for (const [mappingId, mapping] of mappings) for (const endpoint of [mapping.from_shape, mapping.to_shape]) {
    if (shapes.has(endpoint) && !shapes.get(endpoint).mapping_refs.includes(mappingId)) fail(`${file}.mappings.${mappingId} must be referenced by ${endpoint}.mapping_refs`);
  }
}

function validateLegacySmoke(all, text) {
  // Structural artifacts above are approval gates. These legacy checks remain
  // intentionally labelled smoke tests for cross-cutting prose omissions.
  const contractFiles = all.filter((file) => rel(file).startsWith("03-contracts/") && /\.(ya?ml|json|graphql|gql|proto|avsc|thrift|smithy|yang|wsdl|raml)$/i.test(file));
  const must = [
    [/\b(unhappy|failure path|validation failure|authorization|denial|timeout|retry|rollback|recovery|cancellation|manual intervention)\b/i, "Missing unhappy/recovery paths"],
    [/\b(business|user|customer|outcome|goal|why|rationale)\b/i, "Missing business context"],
    [/\b(requirement|flow|contract|NFR|acceptance).{0,80}\b(id|trace|source|owner|priority|risk|verification method|test|inspection|analysis|demo)\b/i, "Missing requirement traceability"],
    [/\b(capability inventory|feature inventory|capability ID|feature ID|business capability|user-facing|admin-facing|API-facing|CLI|SDK|worker|job|operational capability|not applicable|N\/A)\b/i, "Missing capability/feature inventory or N/A evidence"],
    [/\b(end-to-end definition|definition chain|actor|consumer|trigger|entrypoint|reachability|access path|preconditions|data touched|state transitions?|side effects?|permissions?|errors?|recovery|observability|acceptance|verification|final state)\b/i, "Missing end-to-end definition chain evidence"],
    [/\b(data lifecycle|classification|PII|personal data|sensitive data|collection reason|retention|deletion|anonymization|export|access request|masking|redaction|residency|lineage|no-data-loss|not applicable|N\/A)\b/i, "Missing data lifecycle/classification/retention evidence or N/A evidence"],
    [/\b(file structure|folder structure|directory structure|repository structure|project structure|domain folders?|topic folders?|nested folders?|ownership boundaries|shared module|reusable module|generated outputs?|generated artifacts?|public entrypoints?|migrations?|runbooks?|not applicable|N\/A)\b/i, "Missing file/folder structure or N/A evidence"],
    [new RegExp(`\\b(${currentResearchTerm})\\b`, "i"), "Missing current dependency/docs/research evidence"],
    [/\b(concise|single source of truth|one source of truth|no duplicate|no stale|centralize|link instead of duplicating|shared facts)\b/i, "Missing concise single-source spec discipline"],
    [new RegExp(`\\b(${contractTerm})\\b`, "i"), "Missing machine-readable contract source"],
    [new RegExp(`\\b(${generationMapTerm})\\b`, "i"), "Missing generation map/source-contract ownership or N/A evidence"],
    [new RegExp(`\\b(${weakBoundaryTerm})\\b`, "i"), "Missing strong boundary type policy or N/A evidence"],
    [/\b(security|privacy|PII|personal data|confidential|restricted|secret|credential|redaction|trust boundary|authorization|tenancy|input validation|output encoding)\b/i, "Missing security/privacy"],
    [/\b(log level|logging|observability|audit|metric|trace|correlation|redaction)\b/i, "Missing observability"],
    [/\b(performance|latency|throughput|rate limit|capacity|memory|CPU|pagination|batching|backpressure|timeout budget|retry budget|overload)\b/i, "Missing performance budgets"],
    [/\b(data integrity|consistency|state transition|transaction|rollback|compensation|checkpoint|idempotency|recovery|self-healing|manual intervention|data loss)\b/i, "Missing integrity/recovery"],
    [/\b(production readiness|deployment|environment|configuration|config|secret|SLO|SLA|error budget|runbook|incident|backup|restore|rollback|rollout|release|readiness|liveness|operational owner|support handoff|not applicable|N\/A)\b/i, "Missing production/release"],
    [/\b(supply chain|dependency policy|lockfile|vulnerability|license|SBOM|SPDX|CycloneDX|SLSA|provenance|attestation|signing|artifact|container|base image|secret scan|not applicable|N\/A)\b/i, "Missing supply chain"],
  ];
  for (const [term, message] of must) if (!term.test(text)) fail(message);
  if (/\b(every file|all files|complete file list|exhaustive file list)\b/i.test(text)) fail("File/folder structure over-specifies every file");
  const interfaceScope = /\b(interface|contract|API|endpoint|GraphQL|REST|HTTP|event|message|queue|topic|webhook|SDK|CLI|plugin|configuration|schema|storage shape|data model)\b/i.test(text);
  const contractNa = /\b(machine-readable contract|contract artifact|03-contracts).{0,120}\b(not applicable|n\/a|no interface|no transport|no message|no durable data contract)\b/i.test(text);
  if (interfaceScope && !contractNa && !contractFiles.length) fail("Missing machine-readable contract artifact in specs/03-contracts");
  const hasContract = new RegExp(`\\b(${contractTerm})\\b`, "i").test(text);
  const generationNa = /\b(generator|codegen|generated|regeneration|drift check).{0,120}\b(not applicable|n\/a|unavailable|unsafe|out of scope)\b/i.test(text);
  if (hasContract && !generationNa && !/\b(deterministic generator|generator|codegen|regeneration command|generated types?|generated clients?|generated validators?|generated tests?|contract tests?|drift check)\b/i.test(text)) fail("Missing deterministic generator/tooling, generated output, or drift-check evidence");
  if (/\b(public\s+(api|sdk|cli|schema|protocol|workflow|config)|developer-facing|sdk|cli|plugin|tool manifest|builder)\b/i.test(text)) {
    if (!/(^|\n)#+\s+Public API Inventory\b|public_api_inventory:/i.test(text)) fail("Missing Public API Inventory");
    if (!/execution_semantics:/i.test(text)) fail("Missing execution_semantics");
  }
}

if (!fs.existsSync(root)) fail(`Missing spec root: ${root}`);
else {
  const all = walk(root);
  const text = all.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  [".readiness-report.yaml", "_registry.yaml", "_provenance.yaml", "00-vision.md", "00-stack.md", "00-conventions.md", "00-architecture-overview.md", "00-file-structure.md", "02-capabilities/capability-inventory.md", "glossary.md"].forEach((file) => !exists(file) && fail(`Missing artifact: ${file}`));
  for (const file of all) {
    const body = fs.readFileSync(file, "utf8");
    if (/\.(json|schema)$/i.test(file)) try { JSON.parse(body); } catch (error) { fail(`${rel(file)} invalid JSON: ${error.message}`); }
    if (/\b(TODO|TBD|FIXME|OPEN QUESTION|QUESTION:)\b/i.test(body)) fail(`${rel(file)} contains unresolved marker`);
    for (const match of body.matchAll(/\[[^\]]+\]\((?!https?:\/\/|#)([^)]+)\)/g)) { const target = match[1].split("#")[0]; if (target && !fs.existsSync(path.resolve(path.dirname(file), target))) fail(`${rel(file)} broken link: ${match[1]}`); }
  }
  const report = structured(".readiness-report.yaml");
  const approved = report?.status === "approved";
  const manifest = approved ? validateManifest(all) : null;
  validateReadinessReport(report, manifest);
  if (approved) {
    validateArtifactContracts();
    validateTraceability(structured("_registry.yaml"));
    const representationScope = /\b(domain model|domain data|entity|DTO|data shape|storage shape|database record|persistence record|API payload|request payload|response payload|event payload|command|query|projection|view model)\b/i.test(text);
    const catalog = "03-contracts/representation-catalog.yaml";
    if ((representationScope || exists(catalog)) && !exists(catalog)) fail(`Missing representation catalog: ${catalog}`);
    if (exists(catalog)) validateCatalog(structured("_registry.yaml"));
    if (!exists("03-flows/e2e-coverage.md")) fail("Missing E2E coverage matrix: 03-flows/e2e-coverage.md");
    const vague = /\b(as appropriate|if needed|where possible|to be determined|decide later|future work will decide|handle errors|support auth|validate input|make configurable|sync data|recover gracefully|log appropriately|securely|performant|best effort|best practices|standard protocols)\b/i;
    all.filter((file) => !file.endsWith(".readiness-report.yaml")).forEach((file) => vague.test(fs.readFileSync(file, "utf8")) && fail(`${rel(file)} contains ambiguous implementation language`));
    validateLegacySmoke(all, text);
  }
  if (!exists("03-contracts")) warn("Missing specs/03-contracts");
  if (!exists("03-flows")) warn("Missing specs/03-flows");
}
warnings.forEach((message) => console.warn(`warn: ${message}`));
if (errors.length) { [...new Set(errors)].forEach((message) => console.error(`error: ${message}`)); process.exit(1); }
console.log(`spec check ok: ${root}`);
