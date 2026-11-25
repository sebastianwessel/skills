#!/usr/bin/env node
/** Generate the content-bound plan manifest without writing ticket files. */
import fs from "node:fs";
import path from "node:path";
import { readPlanSnapshot } from "./lib/plan-snapshot.mjs";

const root = path.resolve(process.argv[2] || ".");
const plansName = process.argv[3] || "plans";
const specsName = process.argv[4] || "specs";
const plans = path.join(root, plansName);
const specs = path.join(root, specsName);
const manifestPath = path.join(plans, "plan-manifest.yaml");
const specManifestPath = path.join(specs, "spec-manifest.yaml");
if (!fs.existsSync(plans)) throw new Error(`missing plans root: ${plans}`);
if (!fs.existsSync(specManifestPath)) throw new Error(`missing spec manifest: ${specManifestPath}`);
const specText = fs.readFileSync(specManifestPath, "utf8");
const specDigest = (specText.match(/^content_digest:\s*(sha256:[a-f0-9]{64})\s*$/m) || [])[1];
if (!specDigest) throw new Error("spec-manifest.yaml lacks a valid content_digest");
const { artifacts, contentDigest } = readPlanSnapshot(plans);
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
