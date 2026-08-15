#!/usr/bin/env node
/**
 * Validate repository-local Markdown links and local resource declarations.
 *
 * Cross-skill handoffs are deliberately not treated as filesystem paths: a
 * skill may name another installed capability without bundling its files.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || path.resolve(import.meta.dirname, ".."));
const failures = [];
const skip = new Set([".git", "node_modules", "__pycache__"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function localTarget(raw) {
  const target = raw.trim().split("#", 1)[0];
  if (!target || /^(https?:|mailto:|tel:|data:)/i.test(target)) return null;
  return target.replace(/^<|>$/g, "");
}

for (const file of walk(root).filter((candidate) => candidate.endsWith(".md"))) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
      failures.push(`${rel}: broken Markdown link ${match[1]}`);
    }
  }

  // Only paths rooted in the current package are local declarations. Other
  // inline paths can be capability handoffs and must be resolved by the host.
  if (path.basename(file) === "SKILL.md") {
    for (const match of text.matchAll(/`((?:references|scripts|evals)\/[\w./-]+\.(?:md|mjs|json|ya?ml))`/g)) {
      const target = match[1];
      if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
        failures.push(`${rel}: missing declared local resource ${target}`);
      }
    }
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`error: ${failure}`));
  process.exit(1);
}

console.log("resource links ok");
