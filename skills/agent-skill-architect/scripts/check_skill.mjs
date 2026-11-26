#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const name = path.basename(root);
const issues = [];
const text = (value) => typeof value === "string" && value.trim().length > 0;
const skill = path.join(root, "SKILL.md");

function localResource(ref) {
  if (path.isAbsolute(ref) || ref.includes("\\")) return false;
  const target = path.resolve(root, ref);
  const relative = path.relative(root, target);
  return relative !== ".." && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative) && fs.existsSync(target);
}

if (!fs.existsSync(skill)) {
  issues.push("Missing SKILL.md");
} else {
  const source = fs.readFileSync(skill, "utf8");
  const header = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!header) issues.push("Missing YAML frontmatter");
  const fields = new Map();
  for (const [, key, raw] of (header?.[1] || "").matchAll(/^(name|description):[ \t]*(.*)\r?$/gm)) {
    if (fields.has(key)) issues.push(`Duplicate frontmatter field ${key}`);
    fields.set(key, raw.trim().replace(/^(['"])(.*)\1$/, "$2"));
  }
  const declaredName = fields.get("name");
  const description = fields.get("description");
  if (declaredName !== name) issues.push("Frontmatter name must match the directory");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    issues.push("Name needs lowercase alphanumerics separated by single hyphens, up to 64 characters");
  }
  const vagueNames = new Set(["skill-creator", "helper", "tools", "documents", "data"]);
  if (vagueNames.has(name) || /(?:^|-)(?:anthropic|claude)(?:-|$)/.test(name)) {
    issues.push("Name is reserved or too broad");
  }
  if (!text(description) || description.length > 1024) {
    issues.push("Description needs a nonempty one-line value up to 1024 characters");
  }
  const body = source.slice(header?.[0].length || 0);
  for (const [, ref] of body.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
    const target = ref.split("#", 1)[0];
    if (target && !/^[a-z][a-z0-9+.-]*:/i.test(target) && !localResource(target)) {
      issues.push(`Missing packaged resource: ${target}`);
    }
  }
}

if (fs.existsSync(path.join(root, "README.md"))) issues.push("Put human docs outside the skill package");

try {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "evals/evals.json"), "utf8"));
  if (manifest?.skill_name !== name || !Array.isArray(manifest.evals) || manifest.evals.length < 3) {
    issues.push("evals/evals.json needs the matching skill_name and at least three cases");
  } else {
    const ids = new Set();
    for (const entry of manifest.evals) {
      const id = entry?.id;
      if ((!text(id) && typeof id !== "number") || ids.has(String(id))
          || !text(entry.prompt) || !text(entry.expected_output)) {
        issues.push("Each eval needs a unique id, prompt, and expected_output");
      }
      ids.add(String(id));
      if (entry?.files !== undefined
          && (!Array.isArray(entry.files) || entry.files.some((ref) => !text(ref) || !localResource(ref)))) {
        issues.push(`Eval ${id} has a missing or invalid packaged input`);
      }
    }
  }
} catch (error) {
  issues.push(`Cannot read evals/evals.json: ${error.message}`);
}

for (const issue of issues) console.error(`ERROR: ${issue}`);
process.exitCode = issues.length ? 1 : 0;
