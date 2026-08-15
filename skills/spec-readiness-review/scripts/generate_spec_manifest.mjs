#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseYaml } from "./lib/simple-yaml.mjs";

const root = path.resolve(process.argv[2] || "specs");
const requestedRevision = process.argv[3];
const excluded = new Set(["spec-manifest.yaml", ".readiness-report.yaml", "_provenance.yaml"]);
const digest = (value) => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const quote = (value) => {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";
  return /^[A-Za-z0-9_.:/-]+$/.test(value) ? value : JSON.stringify(value);
};
function yaml(value, indent = 0) {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) return value.map((item) => {
    if (item && typeof item === "object") return `${pad}- ${yamlObject(item, indent + 2, true)}`;
    return `${pad}- ${quote(item)}`;
  }).join("\n");
  return yamlObject(value, indent);
}
function yamlObject(value, indent = 0, listHead = false) {
  const entries = Object.entries(value || {});
  return entries.map(([key, item], index) => {
    const prefix = index === 0 && listHead ? `${key}:` : `${" ".repeat(indent)}${key}:`;
    if (Array.isArray(item)) return item.length ? `${prefix}\n${yaml(item, indent + (listHead && index === 0 ? 0 : 2))}` : `${prefix} []`;
    if (item && typeof item === "object") return `${prefix}\n${yamlObject(item, indent + (listHead && index === 0 ? 0 : 2))}`;
    return `${prefix} ${quote(item)}`;
  }).join("\n");
}
if (!fs.existsSync(root)) throw new Error(`Missing spec root: ${root}`);
const currentManifest = fs.existsSync(path.join(root, "spec-manifest.yaml")) ? parseYaml(fs.readFileSync(path.join(root, "spec-manifest.yaml"), "utf8"), "spec-manifest.yaml") : {};
const sourceRevision = requestedRevision || currentManifest?.provenance?.source_revision;
if (!sourceRevision || typeof sourceRevision !== "string") throw new Error("Provide <source-revision> or retain provenance.source_revision in spec-manifest.yaml");
const artifacts = walk(root).map((file) => path.relative(root, file).split(path.sep).join("/")).filter((file) => !excluded.has(file)).sort().map((file) => ({ path: file, sha256: digest(fs.readFileSync(path.join(root, file))) }));
const contentDigest = digest(artifacts.map((artifact) => `${artifact.path}\0${artifact.sha256}\n`).join(""));
const manifest = {
  spec_manifest_version: 1,
  content_digest: contentDigest,
  artifacts,
  provenance: { source_revision: sourceRevision, generated_at: new Date().toISOString(), generator: "spec-manifest/v1" },
};
fs.writeFileSync(path.join(root, "spec-manifest.yaml"), `${yamlObject(manifest)}\n`);
const provenancePath = path.join(root, "_provenance.yaml");
const provenance = fs.existsSync(provenancePath) ? parseYaml(fs.readFileSync(provenancePath, "utf8"), "_provenance.yaml") : {};
provenance.spec_manifest = { content_digest: contentDigest, source_revision: sourceRevision, generated_at: manifest.provenance.generated_at };
fs.writeFileSync(provenancePath, `${yamlObject(provenance)}\n`);
console.log(`spec manifest generated: ${contentDigest}`);
