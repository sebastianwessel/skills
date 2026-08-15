#!/usr/bin/env node
import assert from "node:assert/strict";
import childProcess from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const script = path.join(root, "scripts", "check-all.mjs");
const run = (argumentsList) => childProcess.spawnSync(process.execPath, [script, ...argumentsList], { cwd: root, encoding: "utf8" });

const syntax = run(["syntax"]);
assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
assert.match(syntax.stdout, /deterministic checks passed: syntax/);

const unknown = run(["not-a-check"]);
assert.notEqual(unknown.status, 0);
assert.match(`${unknown.stdout}${unknown.stderr}`, /unknown check not-a-check/);

console.log("check-all command routing tests ok");
