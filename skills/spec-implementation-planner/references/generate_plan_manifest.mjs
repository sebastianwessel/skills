#!/usr/bin/env node
/** Generate the content-bound plan manifest without writing ticket files. */
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
const manifestPath = path.join(plans, "plan-manifest.yaml");
const specManifestPath = path.join(specs, "spec-manifest.yaml");
if (!fs.existsSync(plans)) throw new Error(`missing plans root: ${plans}`);
if (!fs.existsSync(specManifestPath)) throw new Error(`missing spec manifest: ${specManifestPath}`);
const specText = fs.readFileSync(specManifestPath, "utf8");
const specDigest = (specText.match(/^content_digest:\s*(sha256:[a-f0-9]{64})\s*$/m) || [])[1];
if (!specDigest) throw new Error("spec-manifest.yaml lacks a valid content_digest");
const artifacts = walk(plans).map((file) => ({ file, path: rel(file) })).filter((entry) => !excluded(entry.path)).sort((left, right) => left.path.localeCompare(right.path)).map((entry) => ({ path: entry.path, sha256: hash(fs.readFileSync(entry.file, "utf8").replace(/\r\n?/g, "\n")) }));
const contentDigest = hash(artifacts.map((entry) => `${entry.path}\0${entry.sha256}\n`).join(""));
const yaml = [
  "plan_manifest_version: 2",
  `content_digest: ${contentDigest}`,
  `source_spec_manifest_digest: ${specDigest}`,
  "artifacts:",
  ...artifacts.flatMap((artifact) => [`  - path: ${JSON.stringify(artifact.path)}`, `    sha256: ${artifact.sha256}`]),
  "",
].join("\n");
if (!fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, "utf8") !== yaml) {
  fs.writeFileSync(manifestPath, yaml);
}
console.log(`plan manifest generated: ${contentDigest}`);
