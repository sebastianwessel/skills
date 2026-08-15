#!/usr/bin/env node
import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const checker = path.resolve(import.meta.dirname, "check_skill.mjs");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "skill-frontmatter-"));
const skill = path.join(temporary, "portable-skill");

try {
  fs.mkdirSync(skill);
  fs.writeFileSync(path.join(skill, "SKILL.md"), [
    "---",
    "name: portable-skill",
    "description: Validates portable skill metadata. Use when testing skill frontmatter.",
    "---",
    "",
    "# Portable Skill",
    "",
    "Do not invent missing requirements; verify the result.",
    "",
  ].join("\r\n"));
  const result = childProcess.spawnSync(process.execPath, [checker, skill], { encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  console.log("check_skill CRLF frontmatter test ok");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
