#!/usr/bin/env node
/** Validate portable, dependency-free eval manifests. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || path.resolve(import.meta.dirname, ".."));
const failures = [];
const skillDirs = fs.readdirSync(path.join(root, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

function fail(message) {
  failures.push(message);
}

for (const skillName of skillDirs) {
  const file = path.join(root, "skills", skillName, "evals", "evals.json");
  if (!fs.existsSync(file)) {
    fail(`${skillName}: missing evals/evals.json`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${skillName}: invalid JSON: ${error.message}`);
    continue;
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail(`${skillName}: manifest must be an object`);
    continue;
  }
  if (data.skill_name !== skillName) fail(`${skillName}: skill_name must match directory`);
  if (!Array.isArray(data.evals) || data.evals.length < 3) {
    fail(`${skillName}: at least three evals are required`);
    continue;
  }

  const ids = new Set();
  for (const [index, evaluation] of data.evals.entries()) {
    const label = `${skillName}: eval ${index}`;
    if (!evaluation || typeof evaluation !== "object" || Array.isArray(evaluation)) {
      fail(`${label} must be an object`);
      continue;
    }
    if (!(typeof evaluation.id === "number" || typeof evaluation.id === "string") || evaluation.id === "") {
      fail(`${label} missing scalar id`);
    } else if (ids.has(String(evaluation.id))) {
      fail(`${skillName}: duplicate eval id ${evaluation.id}`);
    } else {
      ids.add(String(evaluation.id));
    }
    for (const key of ["prompt", "expected_output"]) {
      if (typeof evaluation[key] !== "string" || !evaluation[key].trim()) {
        fail(`${label} missing non-empty ${key}`);
      }
    }
    if (evaluation.files !== undefined && (!Array.isArray(evaluation.files) || evaluation.files.some((item) => typeof item !== "string"))) {
      fail(`${label} files must be an array of strings`);
    }
    if (evaluation.fixture !== undefined && (
      typeof evaluation.fixture !== "object" || evaluation.fixture === null || Array.isArray(evaluation.fixture)
      || typeof evaluation.fixture.case_id !== "string" || !evaluation.fixture.case_id
    )) {
      fail(`${label} fixture must contain a non-empty case_id`);
    }
    if (evaluation.assertions !== undefined && (!Array.isArray(evaluation.assertions) || !evaluation.assertions.length
      || evaluation.assertions.some((item) => typeof item !== "string" || !item.trim()))) {
      fail(`${label} assertions must be a non-empty array of strings`);
    }
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`error: ${failure}`));
  process.exit(1);
}
console.log(`eval manifests ok: ${skillDirs.length} skills`);
