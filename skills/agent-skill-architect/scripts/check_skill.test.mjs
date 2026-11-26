import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const checker = path.join(import.meta.dirname, "check_skill.mjs");

test("package metadata, resources and eval input diagnostics", (context) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "skill-package-"));
  context.after(() => fs.rmSync(temporary, { recursive: true, force: true }));

  function check(name, { link = "", input = "" } = {}) {
    const root = path.join(temporary, name);
    fs.mkdirSync(path.join(root, "evals"), { recursive: true });
    fs.writeFileSync(path.join(root, "SKILL.md"), [
      "---", `name: ${name}`, "description: Reviews record quality. Use when reviewing a data set.",
      "---", "", "# Data Analysis", link,
    ].join("\r\n"));
    fs.writeFileSync(path.join(root, "evals/evals.json"), JSON.stringify({
      skill_name: name,
      evals: [1, 2, 3].map((id) => ({ id, prompt: "Check scope", expected_output: "Reports scope", files: input ? [input] : [] })),
    }));
    return spawnSync(process.execPath, [checker, root], { encoding: "utf8" });
  }

  assert.equal(check("data-analysis").status, 0);
  for (const name of ["-review-tickets", "review--tickets", "review-tickets-"]) {
    assert.match(check(name).stderr, /single hyphens/);
  }
  assert.match(check("tools").stderr, /too broad/);
  assert.match(check("data-analysis", { link: "[Reference](references/missing.md)" }).stderr, /Missing packaged resource/);
  assert.match(check("data-analysis", { input: "assets/missing.txt" }).stderr, /invalid packaged input/);
});
