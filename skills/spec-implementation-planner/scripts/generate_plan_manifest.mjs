#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { sourceDigest } from "./lib/plan.mjs";
import { readPlanSnapshot, serializeManifest } from "./lib/plan-snapshot.mjs";

try {
  const [repo, ...rest] = process.argv.slice(2);
  if (!repo || rest.length) throw new Error("usage: generate_plan_manifest.mjs <repo-root>");
  const root = path.resolve(repo);
  const snapshot = readPlanSnapshot(root);
  const manifest = path.join(root, "plans", "plan-manifest.yaml");
  const output = serializeManifest(sourceDigest(root), snapshot);
  const exists = fs.lstatSync(manifest, { throwIfNoEntry: false });
  if (exists && !exists.isFile()) throw new Error("plan manifest must be a regular file");
  if (!exists || fs.readFileSync(manifest, "utf8") !== output) fs.writeFileSync(manifest, output);
  console.log(`plan manifest: ${snapshot.contentDigest}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
