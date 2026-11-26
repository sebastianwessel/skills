import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

function fixture(t) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "living-spec-"));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  const root = path.join(repo, "specs");
  function write(file, text) {
    const target = path.join(repo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
  const spec = (file, text) => write(path.join("specs", file), text);
  const record = (id, text) => write(`reviews/readiness/${id}.yaml`, text);
  const index = "# Export\n\n## Access denied\n\nReturn 403 without queueing work.\n\n## Export format\n\nReturn CSV.\n";
  const acceptance = `scenarios:
  - id: EXPORT-DENIED
    source: index.md#access-denied
    verify: ["Assert HTTP 403 and an empty queue"]
  - id: EXPORT-CSV
    source: index.md#export-format
    verify: ["Assert valid CSV"]
`;
  spec("index.md", index);
  spec("acceptance.yaml", acceptance);
  function check(diagnostic, ...args) {
    const run = spawnSync(process.execPath, [path.join(import.meta.dirname, "check_specs.mjs"), root, ...args], { encoding: "utf8" });
    assert.equal(run.status, diagnostic ? 1 : 0, run.stderr);
    if (diagnostic) assert.match(run.stderr, diagnostic);
    return run.stdout;
  }
  function approve(id = "denial", scenarios = "EXPORT-DENIED", sources = "") {
    const selection = `scenarios: [${scenarios}]\n` + (sources ? `sources: [${sources}]\n` : "");
    record(id, selection);
    const output = check(null, "--digest", id);
    const digest = output.match(/^slice_digest: (sha256:[a-f0-9]{64})$/m)?.[1];
    assert.ok(digest, output);
    write(`reviews/${id}.md`, `Fixture review and approval of ${digest}.\n`);
    const approved = selection + `digest: ${digest}
approved_by: fixture-approver
approval_ref: reviews/${id}.md
reviewed_by: fixture-reviewer
review_ref: reviews/${id}.md
`;
    record(id, approved);
    check(null, "--approved", id);
    return approved;
  }
  return { root, spec, record, check, approve, index, acceptance };
}

test("a one-page draft needs neither YAML nor approval", (t) => {
  const f = fixture(t);
  fs.unlinkSync(path.join(f.root, "acceptance.yaml"));
  assert.match(f.check(null), /0 scenarios/);
  f.record("denial", "scenarios: [EXPORT-DENIED]\n");
  f.check(/unknown acceptance scenario/, "--approved", "denial");
  f.spec("acceptance.yaml", f.acceptance);
  f.check(/stale or missing slice approval/, "--approved", "denial");
  f.approve();
});

test("a same-page edit and acceptance change only reopen their slice", (t) => {
  const f = fixture(t);
  f.approve();
  f.approve("format", "EXPORT-CSV");
  f.spec("index.md", f.index.replace("Return CSV.", "Return CSV.\n\n**Open question.** How should an empty export appear?"));
  f.spec("acceptance.yaml", f.acceptance.replace("Assert valid CSV", "Assert the content type and valid CSV"));
  f.check(null, "--approved", "denial");
  f.check(/stale or missing slice approval/, "--approved", "format");
  f.spec("index.md", f.index.replace("403", "404"));
  f.check(/stale or missing slice approval/, "--approved", "denial");
});

test("transitive exact dependencies and explicit contracts bind only the slices using them", (t) => {
  const f = fixture(t);
  f.spec("index.md", f.index.replace("queueing work.", "queueing work. See [policy](policy.md#privacy).")
    + "\n[Presentation](presentation.md)\n");
  f.spec("policy.md", "## Privacy\nApply [audit rules](audit.md#redaction).\n\n## Access\nOther material.\n");
  f.spec("audit.md", "## Redaction\nRemove identifiers.\n");
  f.spec("presentation.md", "# Presentation\nPresentation guidance.\n");
  f.spec("export.schema.json", "{}\n");
  f.approve("denial", "EXPORT-DENIED", "export.schema.json");
  f.approve("format", "EXPORT-CSV");
  const output = f.check(null, "--digest", "denial");
  assert.match(output, /audit\.md#redaction/);
  assert.match(output, /export\.schema\.json/);
  assert.doesNotMatch(output, /presentation\.md/);
  f.spec("export.schema.json", "{}\r\n");
  f.check(null, "--approved", "denial");
  f.spec("audit.md", "## Redaction\nMask identifiers.\n");
  f.check(/stale or missing slice approval/, "--approved", "denial");
  f.check(null, "--approved", "format");
  f.approve("denial", "EXPORT-DENIED", "export.schema.json");
  f.spec("export.schema.json", '{"title":"Export"}\n');
  f.check(/stale or missing slice approval/, "--approved", "denial");
  f.check(null, "--approved", "format");
});

test("evidence must exist outside the specification", (t) => {
  const f = fixture(t);
  const approved = f.approve();
  for (const [from, to, diagnostic] of [
    ["reviewed_by: fixture-reviewer", "reviewed_by:", /independent review identity/],
    ["approval_ref: reviews/denial.md", "approval_ref: reviews/missing.md", /Missing or unsafe file/],
    ["review_ref: reviews/denial.md", "review_ref: specs/index.md", /outside the spec directory/],
  ]) {
    f.record("denial", approved.replace(from, to));
    f.check(diagnostic, "--approved", "denial");
  }
});

test("draft validation checks duplicate IDs, proof and link targets", (t) => {
  const f = fixture(t);
  for (const [body, diagnostic] of [
    [f.acceptance.replace("EXPORT-CSV", "EXPORT-DENIED"), /duplicate scenario/],
    [f.acceptance.replace("access-denied", "missing"), /unique Markdown anchor/],
    [f.acceptance.replace("index.md#", "../private.md#"), /unique Markdown anchor/],
    [f.acceptance.replace(/verify: .*/, "verify: []"), /nonempty verify list/],
    [f.acceptance.replace("    source:", "    id: CONFLICT\n    source:"), /duplicate key/],
  ]) {
    f.spec("acceptance.yaml", body);
    f.check(diagnostic);
  }
  f.spec("acceptance.yaml", f.acceptance);
  f.spec("index.md", f.index + "\n[Policy](policy.md#missing)\n");
  f.spec("policy.md", "# Privacy\n");
  f.check(/link must target a unique Markdown anchor/);
});

test("examples cannot supply evidence and explicit anchors can bind a section", (t) => {
  const f = fixture(t);
  f.spec("index.md", f.index.replace("## Access denied\n", '\x60\x60\x60md\n## Access denied\n<a id="access-denied"></a>\n\x60\x60\x60\n'));
  f.check(/unique Markdown anchor/);
  f.spec("index.md", f.index.replace("## Access denied", '<a id="access-denied"></a>\n\n## Denial'));
  f.check(null);
  f.approve();
  const stable = f.index.replace("## Access denied", '<a id="access-denied"></a>\n\n## Denial');
  f.spec("index.md", stable.replace("## Export format", '<a id="format-v2"></a>\n\n## Export format'));
  f.check(null, "--approved", "denial");
  f.spec("index.md", f.index.replace("## Access denied", "## Access denied\n## Access denied"));
  f.check(/unique Markdown anchor/);
});

test("open questions and decisions block only the scope that cites them", (t) => {
  const f = fixture(t);
  const withQuestion = f.index.replace("Return CSV.", "Return CSV. [Question](gaps/empty.md) [Decision](decisions/format.md)");
  f.spec("index.md", withQuestion);
  f.spec("gaps/empty.md", "# Empty exports\n\nShould an empty export include a header?\n");
  f.spec("decisions/format.md", "---\nstatus: proposed\n---\n# CSV\n");
  f.check(null);
  f.approve();
  f.record("format", "scenarios: [EXPORT-CSV]\n");
  f.check(/open question blocks this slice/, "--digest", "format");
  f.spec("index.md", withQuestion.replace(" [Question](gaps/empty.md)", ""));
  fs.unlinkSync(path.join(f.root, "gaps/empty.md"));
  f.check(/use the current accepted decision/, "--digest", "format");
  f.spec("decisions/format.md", "---\nstatus: accepted\nevidence: POLICY-17\n---\n# CSV\n");
  f.approve("format", "EXPORT-CSV");
  f.spec("decisions/format.md", "---\nstatus: superseded\nreplacement: decisions/format.md\n---\n# CSV\n");
  f.check(/replacement must lead to an accepted decision/);
  f.check(null, "--approved", "denial");
});

test("diagram assets affect scoped freshness and draft structure checks", (t) => {
  const f = fixture(t);
  const index = f.index.replace("queueing work.", "queueing work.\n![Denial flow](visuals/access.svg) [Editable](visuals/access.drawio)");
  f.spec("index.md", index);
  f.spec("visuals/access.svg", "<svg/>");
  f.spec("visuals/access.drawio", "<mxfile/>");
  f.check(null);
  f.approve();
  f.spec("visuals/access.svg", "<svg><g/></svg>");
  f.check(/stale or missing slice approval/, "--approved", "denial");
  f.spec("index.md", index.replace("[Editable](visuals/access.drawio)", ""));
  f.check(/link the editable source/);
  fs.unlinkSync(path.join(f.root, "visuals/access.drawio"));
  f.check(/missing editable diagram source/);
  f.spec("visuals/access.drawio", "<mxfile/>");
  f.spec("index.md", index);
  f.spec("export.schema.json", '{"bad":');
  f.check(/invalid JSON/);
});

test("shared decision backlinks do not bind a slice to every affected rule", (t) => {
  const f = fixture(t);
  f.spec("index.md", f.index.replace("queueing work.", "queueing work. [Decision](decisions/export.md).")
    .replace("Return CSV.", "Return CSV. [Decision](decisions/export.md)."));
  f.spec("decisions/export.md", "---\nstatus: accepted\nevidence: POLICY-42\n---\n# Export\nApplies to [format](../index.md#export-format).\n");
  f.approve();
  f.approve("format", "EXPORT-CSV");
  f.spec("index.md", fs.readFileSync(path.join(f.root, "index.md"), "utf8").replace("Return CSV.", "Stream CSV."));
  f.check(null, "--approved", "denial");
  f.check(/stale or missing slice approval/, "--approved", "format");
});

test("nested list links bind governing dependencies", (t) => {
  const f = fixture(t);
  f.spec("index.md", f.index.replace("Return 403 without queueing work.", "- Authorization\n    - Apply [the policy](policy.md#access)."));
  f.spec("policy.md", "## Access\nDeny unauthorized requests.\n");
  f.approve();
  f.spec("policy.md", "## Access\nDeny all requests.\n");
  f.check(/stale or missing slice approval/, "--approved", "denial");
});

test("angle-bracket links with spaces bind governing dependencies", (t) => {
  const f = fixture(t);
  f.spec("index.md", f.index.replace("queueing work.", "queueing work. [Policy](<access policy.md#access>)."));
  f.spec("access policy.md", "## Access\nDeny unauthorized requests.\n");
  f.approve();
  f.spec("access policy.md", "## Access\nDeny all requests.\n");
  f.check(/stale or missing slice approval/, "--approved", "denial");
});

test("nested list code examples do not create governing dependencies", (t) => {
  const f = fixture(t);
  f.spec("index.md", f.index.replace("Return 403 without queueing work.",
    "- Example\n\n        [sample](gaps/missing.md)\n\n    ```md\n    [sample](gaps/missing.md)\n    ```"));
  f.check(null);
  f.approve();
});
