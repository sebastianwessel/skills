#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const fixture = path.join(scriptDir, "fixtures", "approved-spec");
const checker = path.join(scriptDir, "check_specs.mjs");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "spec-readiness-"));

function check(name, mutate, expected) {
  const target = path.join(temporary, name);
  fs.cpSync(fixture, target, { recursive: true });
  mutate(target);
  const result = spawnSync(process.execPath, [checker, target], { encoding: "utf8" });
  assert.equal(result.status, expected ? 1 : 0, `${name}: ${result.stderr}`);
  if (expected) assert.match(result.stderr, expected, `${name}: ${result.stderr}`);
}

try {
  check("valid", () => {}, null);
  check("stale-approval", (target) => {
    const report = path.join(target, ".readiness-report.yaml");
    fs.writeFileSync(report, fs.readFileSync(report, "utf8").replace(/manifest_digest: .*/, "manifest_digest: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
  }, /approval_evidence\.manifest_digest must match/);
  check("dangling-shape", (target) => {
    const catalog = path.join(target, "03-contracts", "representation-catalog.yaml");
    fs.writeFileSync(catalog, fs.readFileSync(catalog, "utf8").replace("to_shape: identity.user-read", "to_shape: identity.unknown"));
  }, /must link two distinct registered shapes/);
  console.log("check_specs fixtures ok");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
