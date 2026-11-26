#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { checkKnowledge, checkAcceptance } from "./lib/check-project-knowledge.mjs";
import { snapshot, sourceFiles } from "./lib/manifest.mjs";
import { parseYaml } from "./lib/simple-yaml.mjs";

const present = (value) => typeof value === "string" && value.trim().length > 0;
function read(root, file) {
  return parseYaml(fs.readFileSync(path.join(root, file), "utf8"), file);
}

function currentManifest(root, files) {
  const actual = snapshot(root, files);
  const saved = read(root, "spec-manifest.yaml");
  if (saved?.spec_manifest_version !== 2 || !present(saved.source_revision) || !Array.isArray(saved.artifacts)) {
    throw new Error("spec-manifest.yaml requires v2, source_revision and artifacts");
  }
  if (saved.content_digest !== actual.content_digest || saved.artifacts.length !== actual.artifacts.length) {
    throw new Error("spec-manifest.yaml no longer matches the canonical source bundle");
  }
  for (const [index, entry] of actual.artifacts.entries()) {
    const supplied = saved.artifacts[index];
    if (supplied?.path !== entry.path || supplied.sha256 !== entry.sha256) throw new Error(`spec-manifest.yaml: path or hash mismatch: ${entry.path}`);
  }
  return actual.content_digest;
}

function checkEvidence(root, evidence, fields, digest) {
  const [person, date, ref] = fields;
  if (!present(evidence?.[person]) || !present(evidence[date]) || !present(evidence[ref])) throw new Error(`Evidence requires ${fields.join(", ")}`);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(evidence[date]) || !Number.isFinite(Date.parse(evidence[date]))) {
    throw new Error(`${date}: use an ISO 8601 timestamp with time zone`);
  }
  if (evidence.manifest_digest !== digest) throw new Error(`${person}: manifest_digest does not match the reviewed bundle`);
  const value = evidence[ref];
  if (value.startsWith("https://") && URL.canParse(value)) return;
  const repository = fs.realpathSync(path.dirname(root));
  const [local] = value.split("#");
  if (!local || local.startsWith("/") || local.includes("\\") || local.split("/").includes("..") || /^[a-z]+:/i.test(local)) {
    throw new Error(`${ref}: use an HTTPS review URL or repository-relative evidence file`);
  }
  const file = path.resolve(repository, local);
  if (!fs.existsSync(file)) throw new Error(`${ref}: missing evidence file ${local}`);
  const real = fs.realpathSync(file);
  const relative = path.relative(repository, real);
  const specRelative = path.relative(fs.realpathSync(root), real);
  if (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || !specRelative.startsWith(`..${path.sep}`) || !fs.statSync(real).isFile()) {
    throw new Error(`${ref}: store local evidence inside the project and outside the spec bundle`);
  }
}

try {
  const [directory, mode, ...extra] = process.argv.slice(2);
  if (!directory || directory.startsWith("--") || (mode && mode !== "--approved") || extra.length) {
    throw new Error("Usage: check_specs.mjs <spec-root> [--approved]");
  }
  const root = path.resolve(directory);
  const files = sourceFiles(root);
  const reportFile = ".readiness-report.yaml";
  const report = fs.existsSync(path.join(root, reportFile)) ? read(root, reportFile) : { status: "draft" };
  if (!["draft", "blocked", "needs_human_review", "approved"].includes(report?.status)) throw new Error(`${reportFile}: invalid readiness status`);
  if (mode === "--approved" && report.status !== "approved") throw new Error(`Planning requires approved readiness (current status: ${report.status})`);
  const finalCandidate = ["needs_human_review", "approved"].includes(report.status);
  const pages = checkKnowledge(root, files, finalCandidate);
  const scenarios = checkAcceptance(read(root, "acceptance.yaml"), pages);
  for (const file of files.filter((name) => name.endsWith(".json"))) {
    try { JSON.parse(fs.readFileSync(path.join(root, file), "utf8")); }
    catch (error) { throw new Error(`${file}: invalid JSON: ${error.message}`); }
  }
  if (finalCandidate) {
    const digest = currentManifest(root, files);
    if (report.semantic_judge_evidence?.status !== "passed") throw new Error("Semantic judge evidence requires passed status");
    checkEvidence(root, report.semantic_judge_evidence, ["judge", "reviewed_at", "evidence_ref"], digest);
    if (report.status === "approved") {
      if (report.approval_evidence?.scope !== "whole_bundle") throw new Error("approval_evidence.scope must be whole_bundle");
      checkEvidence(root, report.approval_evidence, ["approver_id", "approved_at", "approval_ref"], digest);
    }
  }
  console.log(`Spec checks passed (${report.status}, ${scenarios.size} scenarios)`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
