#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const read = (file) => fs.readFileSync(file, "utf8");

const skillFile = path.join(root, "SKILL.md");
const skillName = path.basename(root);
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
const reserved = /\b(anthropic|claude|skill-creator|helper|tools|documents|data)\b/i;
const vague = /\b(as appropriate|if needed|where possible|to be determined|TBD|TODO|best effort|handle errors|be secure)\b/i;

function parseFrontmatter(text) {
  const match = text.match(frontmatterPattern);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    data[key] = value;
  }
  return data;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

if (!fs.existsSync(skillFile)) {
  fail("Missing SKILL.md");
} else {
  const text = read(skillFile);
  const fm = parseFrontmatter(text);
  const body = text.replace(frontmatterPattern, "");
  const lines = text.split("\n").length;

  if (!fm) fail("Missing YAML frontmatter");
  if (fm) {
    if (!fm.name) fail("Missing frontmatter name");
    if (!fm.description) fail("Missing frontmatter description");
    if (fm.name !== skillName) fail(`Frontmatter name '${fm.name}' must match directory '${skillName}'`);
    if (fm.name && !/^[a-z0-9-]{1,64}$/.test(fm.name)) fail("Name must be lowercase letters, numbers, and hyphens, max 64 chars");
    if (fm.name && reserved.test(fm.name)) fail("Name uses reserved or overly vague terms");
    if (fm.description) {
      if (fm.description.length > 1024) fail("Description exceeds 1024 chars");
      if (!/\bUse when\b/.test(fm.description)) fail("Description must include a clear 'Use when ...' trigger");
      if (/<[^>]+>/.test(fm.description)) fail("Description must not contain XML/HTML tags");
      if (/\b(I can|You can use this)\b/i.test(fm.description)) fail("Description must be third person");
      if (fm.description.length > 320) warn("Description is long for always-loaded metadata");
    }
  }

  if (lines > 500) fail("SKILL.md exceeds 500 lines");
  if (lines > 120) warn("SKILL.md is large; consider moving detail to references");
  if (!/\b(stop|blocker|do not|refuse)\b/i.test(body)) warn("SKILL.md lacks explicit stop/blocker behavior");
  if (!/\b(eval|test|verify|verification|check|check_|plugin-eval)\b/i.test(body)) warn("SKILL.md lacks validation or eval guidance");
  if (vague.test(body) && !/\b(vague|anti-pattern|forbidden|do not|stop|block|replace vague|work "as appropriate")\b/i.test(body)) {
    warn("SKILL.md contains vague wording; ensure it is defined as an anti-pattern or with evidence");
  }

  for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^https?:\/\//.test(target)) continue;
    const resolved = path.resolve(root, target);
    if (!fs.existsSync(resolved)) fail(`Broken SKILL.md link: ${match[1]}`);
  }
}

if (fs.existsSync(path.join(root, "README.md"))) {
  fail("Do not put README.md inside a skill directory; use docs/skills/<skill-name>.md");
}

const refs = walk(path.join(root, "references")).filter((file) => file.endsWith(".md"));
for (const file of refs) {
  const text = read(file);
  const lineCount = text.split("\n").length;
  const rel = path.relative(root, file);
  if (lineCount > 100 && !/\b(contents|table of contents)\b/i.test(text.slice(0, 1000))) {
    warn(`${rel} exceeds 100 lines without a contents section`);
  }
  for (const match of text.matchAll(/\[[^\]]+\]\((?!https?:\/\/|#)([^)]+\.md[^)]*)\)/g)) {
    warn(`${rel} links to another markdown file; prefer one-level references from SKILL.md`);
  }
}

const evalFile = path.join(root, "evals", "evals.json");
if (!fs.existsSync(evalFile)) {
  warn("Missing evals/evals.json");
} else {
  try {
    const data = JSON.parse(read(evalFile));
    const evals = Array.isArray(data.evals) ? data.evals : [];
    if (data.skill_name !== skillName) fail("evals/evals.json skill_name must match skill name");
    if (evals.length < 3) warn("Use at least 3 realistic eval prompts");
    const ids = new Set();
    for (const [index, item] of evals.entries()) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        fail(`Eval ${index} must be an object`);
        continue;
      }
      if (!(typeof item.id === "number" || typeof item.id === "string") || item.id === "") {
        fail(`Eval ${index} missing scalar id`);
      } else if (ids.has(String(item.id))) {
        fail(`Eval ${index} duplicates id ${item.id}`);
      } else {
        ids.add(String(item.id));
      }
      if (typeof item.prompt !== "string" || !item.prompt.trim()) fail(`Eval ${index} missing prompt`);
      if (typeof item.expected_output !== "string" || !item.expected_output.trim()) fail(`Eval ${index} missing expected_output`);
      if (item.files !== undefined && (!Array.isArray(item.files) || item.files.some((file) => typeof file !== "string"))) {
        fail(`Eval ${index} files must be an array of strings`);
      }
      if (item.fixture !== undefined && (
        typeof item.fixture !== "object" || item.fixture === null || Array.isArray(item.fixture)
        || typeof item.fixture.case_id !== "string" || !item.fixture.case_id
      )) fail(`Eval ${index} fixture must contain case_id`);
      if (item.assertions !== undefined && (!Array.isArray(item.assertions) || !item.assertions.length
        || item.assertions.some((assertion) => typeof assertion !== "string" || !assertion.trim()))) {
        fail(`Eval ${index} assertions must be a non-empty array of strings`);
      }
    }
  } catch (error) {
    fail(`Invalid evals/evals.json: ${error.message}`);
  }
}

const docsFile = path.resolve(root, "..", "..", "docs", "skills", `${skillName}.md`);
if (fs.existsSync(path.resolve(root, "..", "..", "docs")) && !fs.existsSync(docsFile)) {
  warn(`Missing human docs: docs/skills/${skillName}.md`);
}

for (const warning of warnings) console.error(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
process.exit(errors.length ? 1 : 0);
