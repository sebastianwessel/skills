import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parseYaml } from "./lib/simple-yaml.mjs";

function execute(script, ...args) {
  return spawnSync(process.execPath, [path.join(import.meta.dirname, script), ...args], { encoding: "utf8" });
}

function fixture(t) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "spec-bundle-"));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  const root = path.join(repo, "specs");
  function write(file, text) {
    const target = path.join(repo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
  const spec = (file, text) => write(path.join("specs", file), text);
  spec("index.md", "# Export\n\nThe data owner authorizes team-scoped access.\n\n## Access denied\n\nReturn 403 without queueing work.\n");
  const acceptance = "scenarios:\n  - id: EXPORT-DENIED\n    source: index.md#access-denied\n    verify: [\"Assert HTTP 403 and an empty queue\"]\n";
  spec("acceptance.yaml", acceptance);
  function generate() {
    const generated = execute("generate_spec_manifest.mjs", root, "fixture-revision");
    assert.equal(generated.status, 0, generated.stderr);
    return parseYaml(fs.readFileSync(path.join(root, "spec-manifest.yaml"), "utf8")).content_digest;
  }
  function approve() {
    const digest = generate();
    write("reviews/semantic.md", `Assessed all scenarios in ${digest}.\n`);
    write("reviews/approval.md", `Approved whole bundle ${digest}.\n`);
    const report = `status: approved
approval_evidence:
  scope: whole_bundle
  approver_id: fixture-owner
  approved_at: "2026-08-15T12:05:00Z"
  approval_ref: reviews/approval.md
  manifest_digest: ${digest}
semantic_judge_evidence:
  status: passed
  judge: fixture-reviewer
  reviewed_at: "2026-08-15T12:00:00Z"
  evidence_ref: reviews/semantic.md
  manifest_digest: ${digest}
`;
    spec(".readiness-report.yaml", report);
    return report;
  }
  function check(diagnostic, ...args) {
    const run = execute("check_specs.mjs", root, ...args);
    assert.equal(run.status, diagnostic ? 1 : 0, run.stderr);
    if (diagnostic) assert.match(run.stderr, diagnostic);
  }
  return { root, write, spec, generate, approve, check, acceptance };
}

test("one-page spec runs as draft and needs current full-bundle approval for planning", (t) => {
  const f = fixture(t);
  f.check(null);
  f.check(/requires approved readiness/, "--approved");
  f.approve();
  f.check(null, "--approved");
  f.spec("index.md", "# Export\n## Access denied\nThe behavior changed.\n");
  f.check(/no longer matches/, "--approved");
});

test("a waiting or blocked decision cannot start planning", (t) => {
  const f = fixture(t);
  const report = f.approve();
  for (const state of ["draft", "blocked", "needs_human_review"]) {
    f.spec(".readiness-report.yaml", report.replace("status: approved", `status: ${state}`));
    f.check(null);
    f.check(/requires approved readiness/, "--approved");
  }
});

test("both evidence records bind the current digest and human approval covers the entire bundle", (t) => {
  const f = fixture(t);
  const report = f.approve();
  for (const [before, after, diagnostic] of [
    ["whole_bundle", "one_scenario", /scope must be whole_bundle/],
    ["reviews/semantic.md", "reviews/missing.md", /missing evidence file/],
    ["reviews/approval.md", "specs/index.md", /outside the spec bundle/],
    ["2026-08-15T12:05:00Z", "yesterday", /ISO 8601/],
    [/manifest_digest: sha256:[a-f0-9]+/, "manifest_digest: stale-human", /approver_id: manifest_digest/],
    [/manifest_digest: sha256:[a-f0-9]+\n$/, "manifest_digest: stale-judge\n", /judge: manifest_digest/],
  ]) {
    f.spec(".readiness-report.yaml", report.replace(before, after));
    f.check(diagnostic, "--approved");
  }
});

test("acceptance IDs must be unique and each proof and source must resolve", (t) => {
  const f = fixture(t);
  for (const [body, diagnostic] of [
    [f.acceptance + f.acceptance.split("scenarios:\n")[1], /duplicate scenario/],
    [f.acceptance.replace("access-denied", "missing"), /unique Markdown anchor/],
    [f.acceptance.replace("index.md#", "../private.md#"), /unique Markdown anchor/],
    [f.acceptance.replace(/verify: .*/, "verify: []"), /verification reference/],
    [f.acceptance.replace("    source:", "    id: CONFLICT\n    source:"), /duplicate key/],
  ]) {
    f.spec("acceptance.yaml", body);
    f.check(diagnostic);
  }
});

test("headings and links inside examples cannot supply scenario evidence", (t) => {
  const f = fixture(t);
  f.spec("index.md", "# Index\n\n````md\n## Access denied\n```\n<a id=\"access-denied\"></a>\n````\n");
  f.check(/unique Markdown anchor/);
  f.spec("index.md", '# Index\n\n<a id="access-denied"></a>\nDenied.\n');
  f.check(null);
  f.spec("index.md", "## Access denied\n## Access denied\n");
  f.check(/unique Markdown anchor/);
});

test("links to governing headings must survive renames", (t) => {
  const f = fixture(t);
  f.spec("index.md", "## Access denied\nSee [authorization](policy.md#access).\n");
  f.spec("policy.md", "## Authorization\n");
  f.check(/link must target a unique Markdown anchor/);
  f.spec("policy.md", "## Access\n");
  f.check(null);
});

test("optional decisions and gaps have one owner and authority checks", (t) => {
  const f = fixture(t);
  const index = "## Access denied\n[Export policy](topics/decisions/export.md) [Question](gaps/owner.md)\n";
  f.spec("index.md", index);
  const decision = "---\nowner: identity-team\nstatus: accepted\nevidence: POLICY-PR-17\n---\n# Export scope\n";
  const gap = "---\nowner: export-team\nstatus: deferred\nevidence: SCOPE-PR-20\nrevisit: Launch of cross-team sharing\n---\n# Sharing\n";
  f.spec("topics/decisions/export.md", decision);
  f.spec("gaps/owner.md", gap);
  f.approve();
  f.check(null, "--approved");
  for (const [file, source, before, after, diagnostic] of [
    ["topics/decisions/export.md", decision, "accepted", "proposed", /proposed blocks/],
    ["topics/decisions/export.md", decision, "evidence: POLICY-PR-17", "", /requires evidence/],
    ["topics/decisions/export.md", decision, "accepted", "superseded\nreplacement: topics/decisions/export.md", /replacement must lead/],
    ["gaps/owner.md", gap, "deferred", "open", /open blocks/],
    ["gaps/owner.md", gap, "revisit: Launch of cross-team sharing", "", /revisit trigger/],
  ]) {
    f.spec(file, source.replace(before, after));
    f.approve();
    f.check(diagnostic, "--approved");
    f.spec(file, source);
  }
  f.spec("index.md", index.replace("[Question](gaps/owner.md)", "`[Question](gaps/owner.md)`"));
  f.check(/unreachable/);
});

test("changed diagram, stale manifest, wrong path or invalid contract bytes fail", (t) => {
  const f = fixture(t);
  const index = '## Access denied\n![Denial flow](visuals/access.svg) [Editable](visuals/access.drawio)\n';
  f.spec("index.md", index);
  f.spec("visuals/access.svg", "<svg/>");
  f.spec("visuals/access.drawio", "<mxfile/>");
  f.approve();
  f.check(null, "--approved");
  f.spec("visuals/access.svg", "<svg><g/></svg>");
  f.check(/no longer matches/, "--approved");
  f.approve();
  const manifest = fs.readFileSync(path.join(f.root, "spec-manifest.yaml"), "utf8");
  f.spec("spec-manifest.yaml", manifest.replace('path: "index.md"', 'path: "unknown.md"'));
  f.check(/path or hash mismatch/, "--approved");
  f.spec("index.md", index.replace("[Editable](visuals/access.drawio)", ""));
  f.check(/link the editable source/);
  fs.unlinkSync(path.join(f.root, "visuals/access.drawio"));
  f.check(/missing editable diagram source/);
  f.spec("visuals/access.drawio", "<mxfile/>");
  f.spec("index.md", index);
  f.spec("export.schema.json", "{\"bad\":");
  f.check(/invalid JSON/);
});
