#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "specs");
const sourceRevision = process.argv[3];
if (!sourceRevision?.trim()) throw new Error("Provide <source-revision>");
if (!fs.existsSync(root)) throw new Error(`Missing spec root: ${root}`);

const excluded = new Set(["spec-manifest.yaml", ".readiness-report.yaml"]);
const digest = (value) => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(file);
    if (!entry.isFile()) throw new Error(`Canonical specs require regular files: ${file}`);
    return [path.relative(root, file).split(path.sep).join("/")];
  });
}

const artifacts = walk(root).filter((file) => !excluded.has(file)).sort().map((file) => ({
  path: file,
  sha256: digest(fs.readFileSync(path.join(root, file))),
}));
const contentDigest = digest(artifacts.map((artifact) => `${artifact.path}\0${artifact.sha256}\n`).join(""));
const output = [
  "spec_manifest_version: 2",
  `content_digest: ${contentDigest}`,
  `source_revision: ${JSON.stringify(sourceRevision)}`,
  "artifacts:",
  ...artifacts.flatMap((artifact) => [`  - path: ${JSON.stringify(artifact.path)}`, `    sha256: ${artifact.sha256}`]),
  "",
].join("\n");
const manifest = path.join(root, "spec-manifest.yaml");
if (!fs.existsSync(manifest) || fs.readFileSync(manifest, "utf8") !== output) {
  fs.writeFileSync(manifest, output);
}
console.log(`spec manifest: ${contentDigest}`);
