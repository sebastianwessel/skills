#!/usr/bin/env node
/** Generate the content-bound plan manifest and pin its digest into tickets. */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const plansName = process.argv[3] || "plans";
const specsName = process.argv[4] || "specs";
const plans = path.join(root, plansName);
const specs = path.join(root, specsName);
const hash = (content) => `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;
const walk = (directory) => fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
}) : [];
const rel = (file) => path.relative(plans, file).split(path.sep).join("/");
const excluded = (file) => file === "plan-manifest.yaml" || /^(?:review|reviews|evidence|implementation-evidence)(?:\/|$)/.test(file);
// The plan digest is embedded back into ticket frontmatter. Excluding only this
// pointer prevents a digest cycle while preserving all implementation content.
const canonical = (file, content) => {
  const normalized = content.replace(/\r\n?/g, "\n");
  return file.endsWith(".md") && file.includes("/tickets/")
    ? normalized.replace(/^plan_manifest_digest:\s*.*(?:\n|$)/m, "")
    : normalized;
};
const manifestPath = path.join(plans, "plan-manifest.yaml");
const specManifestPath = path.join(specs, "spec-manifest.yaml");
if (!fs.existsSync(plans)) throw new Error(`missing plans root: ${plans}`);
if (!fs.existsSync(specManifestPath)) throw new Error(`missing spec manifest: ${specManifestPath}`);
const specText = fs.readFileSync(specManifestPath, "utf8");
const specDigest = (specText.match(/^content_digest:\s*(sha256:[a-f0-9]{64})\s*$/m) || [])[1];
if (!specDigest) throw new Error("spec-manifest.yaml lacks a valid content_digest");
const artifacts = walk(plans).map((file) => ({ file, path: rel(file) })).filter((entry) => !excluded(entry.path)).sort((left, right) => left.path.localeCompare(right.path)).map((entry) => ({ path: entry.path, sha256: hash(canonical(entry.path, fs.readFileSync(entry.file, "utf8"))) }));
const contentDigest = hash(artifacts.map((entry) => `${entry.path}\0${entry.sha256}\n`).join(""));
for (const artifact of artifacts.filter((entry) => entry.path.endsWith(".md") && entry.path.includes("/tickets/"))) {
  const file = path.join(plans, artifact.path);
  const source = fs.readFileSync(file, "utf8");
  const normalized = source.replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) throw new Error(`${artifact.path}: missing YAML frontmatter`);
  const updated = /^plan_manifest_digest:/m.test(normalized)
    ? normalized.replace(/^plan_manifest_digest:\s*.*$/m, `plan_manifest_digest: ${contentDigest}`)
    : normalized.replace(/^(spec_manifest_digest:\s*.*)$/m, `$1\nplan_manifest_digest: ${contentDigest}`);
  if (!/^plan_manifest_digest:/m.test(updated)) throw new Error(`${artifact.path}: add spec_manifest_digest before generating plan manifest`);
  const output = source.includes("\r\n") ? updated.replace(/\n/g, "\r\n") : updated;
  if (output !== source) fs.writeFileSync(file, output);
}
const yaml = [
  "plan_manifest_version: 1",
  `content_digest: ${contentDigest}`,
  `source_spec_manifest_digest: ${specDigest}`,
  "artifacts:",
  ...artifacts.flatMap((artifact) => [`  - path: ${artifact.path}`, `    sha256: ${artifact.sha256}`]),
  "provenance:",
  `  generated_at: ${new Date().toISOString()}`,
  "  generator: plan-manifest/v1",
  "",
].join("\n");
fs.writeFileSync(manifestPath, yaml);
console.log(`plan manifest generated: ${contentDigest}`);
