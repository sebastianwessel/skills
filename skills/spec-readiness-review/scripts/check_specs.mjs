#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateProjectKnowledge } from "./lib/check-project-knowledge.mjs";
import { parseYaml, yamlStrings } from "./lib/simple-yaml.mjs";

const root = path.resolve(process.argv[2] || "specs");
const errors = [];
const fail = (message) => errors.push(message);
const at = (file) => path.join(root, file);
const exists = (file) => fs.existsSync(at(file));
const read = (file) => fs.readFileSync(at(file), "utf8");
const rel = (file) => path.relative(root, file).split(path.sep).join("/");
const hash = (value) => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isId = (value) => isNonEmptyString(value) && /^[A-Za-z][A-Za-z0-9_.:-]*$/.test(value);
const isStringList = (value, minimum = 0) => Array.isArray(value) && value.length >= minimum && value.every(isNonEmptyString);
const walk = (directory) => fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
}) : [];
const structured = (file) => {
  if (!exists(file)) return null;
  try { return parseYaml(read(file), file); }
  catch (error) { fail(`${file} invalid structured YAML: ${error.message}`); return null; }
};
function exactFile(value) {
  return isNonEmptyString(value) && !path.isAbsolute(value) && !value.includes("\\") && !value.split("/").includes("..") && value !== ".";
}

function validateManifest(all) {
  const file = "spec-manifest.yaml";
  if (!exists(file)) {
    fail(`Missing ${file} for approved readiness`);
    return null;
  }
  const manifest = structured(file);
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    fail(`${file} must be a map`);
    return null;
  }
  if (manifest.spec_manifest_version !== 2) fail(`${file}.spec_manifest_version must be 2`);
  if (!/^sha256:[a-f0-9]{64}$/.test(manifest.content_digest || "")) fail(`${file}.content_digest must be a sha256 digest`);
  if (!Array.isArray(manifest.artifacts) || !manifest.artifacts.length) {
    fail(`${file}.artifacts must be a non-empty list`);
    return null;
  }
  // The manifest and readiness report attest to the source set.
  const expected = all.map(rel).filter((entry) => ![file, ".readiness-report.yaml"].includes(entry)).sort();
  const supplied = new Map();
  for (const entry of manifest.artifacts) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) { fail(`${file}.artifacts entries must be maps`); continue; }
    if (!exactFile(entry.path)) { fail(`${file}.artifacts has invalid path`); continue; }
    if (!/^sha256:[a-f0-9]{64}$/.test(entry.sha256 || "")) fail(`${file}.artifacts.${entry.path}.sha256 must be a sha256 digest`);
    if (supplied.has(entry.path)) fail(`${file}.artifacts has duplicate path: ${entry.path}`);
    supplied.set(entry.path, entry.sha256);
  }
  const actual = [];
  for (const entry of expected) {
    if (!supplied.has(entry)) fail(`${file} omits authoritative artifact: ${entry}`);
    const digest = hash(fs.readFileSync(at(entry)));
    if (supplied.has(entry) && supplied.get(entry) !== digest) fail(`${file} hash does not match: ${entry}`);
    actual.push(`${entry}\0${digest}\n`);
  }
  for (const entry of supplied.keys()) if (!expected.includes(entry)) fail(`${file} names non-authoritative or missing artifact: ${entry}`);
  const digest = hash(actual.sort().join(""));
  if (manifest.content_digest !== digest) fail(`${file}.content_digest does not match the declared artifact set`);
  if (!isNonEmptyString(manifest.source_revision)) fail(`${file}.source_revision is required`);
  return manifest;
}

function validateReadinessReport(report, manifest) {
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    fail(".readiness-report.yaml must be a map");
    return;
  }
  const approved = report.status === "approved";
  if (!["draft", "needs_human_review", "approved", "blocked"].includes(report.status)) fail(".readiness-report.yaml.status is invalid");
  if (!approved) return;
  const approval = report.approval_evidence;
  if (!approval || typeof approval !== "object" || Array.isArray(approval)) fail("Approved readiness requires approval_evidence");
  else {
    ["approver_id", "approved_at", "approval_ref", "manifest_digest"].forEach((key) => !isNonEmptyString(approval[key]) && fail(`approval_evidence.${key} is required`));
    if (isNonEmptyString(approval.approved_at) && Number.isNaN(Date.parse(approval.approved_at))) fail("approval_evidence.approved_at must be ISO-8601");
    if (!isStringList(approval.scope_refs, 1)) fail("approval_evidence.scope_refs must be a non-empty list");
    if (manifest && approval.manifest_digest !== manifest.content_digest) fail("approval_evidence.manifest_digest must match spec-manifest.yaml.content_digest");
  }
  const semantic = report.semantic_judge_evidence;
  if (!semantic || semantic.status !== "passed" || !isNonEmptyString(semantic.judge) || !isNonEmptyString(semantic.evidence_ref) || !isNonEmptyString(semantic.reviewed_at)) {
    fail("semantic_judge_evidence requires passed status, judge, evidence_ref, and reviewed_at");
  } else if (Number.isNaN(Date.parse(semantic.reviewed_at))) {
    fail("semantic_judge_evidence.reviewed_at must be ISO-8601");
  }
  if (manifest && semantic?.manifest_digest !== manifest.content_digest) {
    fail("semantic_judge_evidence.manifest_digest must match spec-manifest.yaml.content_digest");
  }
}

function validateArtifactContracts(applicability, authority) {
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
  if (!authority || authority.decision_authority_version !== 1 || !isStringList(authority.default_allowed_classes, 1) || !authority.default_allowed_classes.every((value) => ["D0", "D1"].includes(value))) {
    fail("00-decision-authority.yaml must restrict default_allowed_classes to D0/D1");
  }
  const decisionIds = new Set();
  const decisions = authority?.decisions ?? [];
  if (!Array.isArray(decisions)) fail("00-decision-authority.yaml.decisions must be a list");
  for (const decision of Array.isArray(decisions) ? decisions : []) {
    if (decisionIds.has(decision?.decision_id)) fail(`00-decision-authority.yaml: duplicate decision_id ${decision.decision_id}`);
    if (isId(decision?.decision_id)) decisionIds.add(decision.decision_id);
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
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) {
    fail(`${file} must be a map`);
    return;
  }
  if (catalog.catalog_version !== 1) fail(`${file}.catalog_version must be 1`);
  if (!Array.isArray(catalog.shapes) || !catalog.shapes.length || !Array.isArray(catalog.mappings)) {
    fail(`${file} requires a non-empty shapes list and a mappings list`);
    return;
  }
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

if (!fs.existsSync(root)) fail(`Missing spec root: ${root}`);
else {
  const all = walk(root);
  for (const file of all) {
    if (!/\.(json|schema)$/i.test(file)) continue;
    try { JSON.parse(fs.readFileSync(file, "utf8")); }
    catch (error) { fail(`${rel(file)} invalid JSON: ${error.message}`); }
  }
  const report = structured(".readiness-report.yaml");
  const approved = report?.status === "approved";
  const authority = structured("00-decision-authority.yaml");
  validateProjectKnowledge(root, all, { approved, authority, fail });
  const manifest = approved ? validateManifest(all) : null;
  validateReadinessReport(report, manifest);
  if (approved) {
    const registry = structured("_registry.yaml");
    const applicability = structured("00-applicability.yaml");
    validateArtifactContracts(applicability, authority);
    validateTraceability(registry);

    const concerns = applicability?.concerns;
    const representation = Array.isArray(concerns) && concerns.find((concern) => concern?.concern_id === "representation_reuse");
    const catalog = "03-contracts/representation-catalog.yaml";
    if (representation?.status === "applicable" && !exists(catalog)) fail(`Missing representation catalog: ${catalog}`);
    if (exists(catalog)) {
      if (representation?.status === "not_applicable") fail(`${catalog} conflicts with representation_reuse applicability`);
      validateCatalog(registry);
    }
  }
}
if (errors.length) { [...new Set(errors)].forEach((message) => console.error(`error: ${message}`)); process.exit(1); }
console.log(`spec structure check passed: ${root}`);
