#!/usr/bin/env node
/** Run the repository's non-mutating deterministic verification suite. */
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { walkFiles } from "./shared-filesystem.mjs";

const root = path.resolve(import.meta.dirname, "..");
const failures = [];
const requested = process.argv.slice(2);

function run(label, command, args) {
  const result = childProcess.spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error || result.status !== 0) {
    failures.push(`${label} failed${result.error ? `: ${result.error.message}` : ""}`);
  }
}

const checker = path.join(root, "skills", "agent-skill-architect", "scripts", "check_skill.mjs");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const checks = {
  syntax() {
    for (const file of walkFiles(root).filter((candidate) => candidate.endsWith(".mjs")).sort()) {
      run(`syntax ${path.relative(root, file)}`, process.execPath, ["--check", file]);
    }
  },
  tests() {
    for (const file of walkFiles(root).filter((candidate) => candidate.endsWith(".test.mjs")).sort()) {
      run(`test ${path.relative(root, file)}`, process.execPath, [file]);
    }
  },
  skills() {
    for (const entry of fs.readdirSync(path.join(root, "skills"), { withFileTypes: true }).filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      run(`skill ${entry.name}`, process.execPath, [checker, path.join(root, "skills", entry.name)]);
    }
  },
  evals() { run("eval manifests", process.execPath, [path.join(root, "scripts", "check-evals.mjs"), root]); },
  links() { run("resource links", process.execPath, [path.join(root, "scripts", "check-resource-links.mjs"), root]); },
  readme() { run("README generated state", python, [path.join(root, "scripts", "update-readme.py"), "--check"]); },
  fixtures() { run("adversarial fixtures", process.execPath, [path.join(root, "scripts", "run-fixtures.mjs"), root]); },
};
const selected = requested.length ? requested : Object.keys(checks);
for (const name of selected) {
  if (!Object.hasOwn(checks, name)) {
    failures.push(`unknown check ${name}; expected one of: ${Object.keys(checks).join(", ")}`);
    continue;
  }
  checks[name]();
}

if (failures.length) {
  failures.forEach((failure) => console.error(`error: ${failure}`));
  process.exit(1);
}
console.log(`deterministic checks passed: ${selected.join(", ")}`);
