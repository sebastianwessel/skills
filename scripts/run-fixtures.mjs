#!/usr/bin/env node
/** Run adversarial checker fixtures declared in tests/fixtures/mutations.json. */
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || path.resolve(import.meta.dirname, ".."));
const manifestFile = path.join(root, "tests", "fixtures", "mutations.json");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const failures = [];

if (manifest.version !== 1 || !Array.isArray(manifest.cases) || !manifest.cases.length) {
  throw new Error("tests/fixtures/mutations.json requires version: 1 and non-empty cases");
}

for (const testCase of manifest.cases) {
  const { id, checker, args = [], expect } = testCase;
  if (!id || !checker || !expect || !Number.isInteger(expect.exit_code)
    || expect.exit_code < 0 || typeof expect.output_includes !== "string") {
    failures.push(`invalid fixture declaration: ${id || "<unnamed>"}`);
    continue;
  }
  const result = childProcess.spawnSync(process.execPath, [path.join(root, checker), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`;
  if (result.error) {
    failures.push(`${id}: checker could not run: ${result.error.message}`);
  } else if (result.status !== expect.exit_code) {
    failures.push(`${id}: expected exit ${expect.exit_code}, got ${result.status}; output: ${output.trim()}`);
  } else if (!output.includes(expect.output_includes)) {
    failures.push(`${id}: expected diagnostic ${JSON.stringify(expect.output_includes)}; output: ${output.trim()}`);
  } else {
    console.log(`fixture ok: ${id}`);
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`error: ${failure}`));
  process.exit(1);
}
console.log(`fixtures ok: ${manifest.cases.length}`);
