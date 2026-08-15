#!/usr/bin/env node
/** Run the repository's non-mutating deterministic verification suite. */
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const failures = [];
const skip = new Set([".git", "node_modules", "__pycache__"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function run(label, command, args) {
  const result = childProcess.spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) {
    failures.push(`${label} failed${result.error ? `: ${result.error.message}` : ""}`);
  }
}

for (const file of walk(root).filter((candidate) => candidate.endsWith(".mjs")).sort()) {
  run(`syntax ${path.relative(root, file)}`, process.execPath, ["--check", file]);
}

for (const file of walk(root).filter((candidate) => candidate.endsWith(".test.mjs")).sort()) {
  run(`test ${path.relative(root, file)}`, process.execPath, [file]);
}

const checker = path.join(root, "skills", "agent-skill-architect", "scripts", "check_skill.mjs");
for (const entry of fs.readdirSync(path.join(root, "skills"), { withFileTypes: true }).filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  run(`skill ${entry.name}`, process.execPath, [checker, path.join(root, "skills", entry.name)]);
}

run("eval manifests", process.execPath, [path.join(root, "scripts", "check-evals.mjs"), root]);
run("resource links", process.execPath, [path.join(root, "scripts", "check-resource-links.mjs"), root]);
run("README generated state", "python3", [path.join(root, "scripts", "update-readme.py"), "--check"]);
run("adversarial fixtures", process.execPath, [path.join(root, "scripts", "run-fixtures.mjs"), root]);

if (failures.length) {
  failures.forEach((failure) => console.error(`error: ${failure}`));
  process.exit(1);
}
console.log("all deterministic checks passed");
