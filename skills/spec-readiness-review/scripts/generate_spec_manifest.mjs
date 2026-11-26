#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { snapshot, sourceFiles } from "./lib/manifest.mjs";

try {
  const [directory, revision, ...extra] = process.argv.slice(2);
  if (!directory || !revision?.trim() || extra.length) throw new Error("Usage: generate_spec_manifest.mjs <spec-root> <source-revision>");
  const root = path.resolve(directory);
  const { artifacts, content_digest } = snapshot(root, sourceFiles(root));
  const output = [
    "spec_manifest_version: 2",
    `content_digest: ${content_digest}`,
    `source_revision: ${JSON.stringify(revision)}`,
    "artifacts:",
    ...artifacts.flatMap((entry) => [`  - path: ${JSON.stringify(entry.path)}`, `    sha256: ${entry.sha256}`]),
    "",
  ].join("\n");
  const file = path.join(root, "spec-manifest.yaml");
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== output) fs.writeFileSync(file, output);
  console.log(`spec manifest: ${content_digest}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
