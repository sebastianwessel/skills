import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const fixture = path.join(import.meta.dirname, "fixtures", "approved-spec");

function write(root, file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function change(root, file, before, after) {
  const original = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(typeof before === "string" ? original.includes(before) : before.test(original), `${file} should contain ${before}`);
  write(root, file, original.replace(before, after));
}

function run(script, ...args) {
  return spawnSync(process.execPath, [path.join(import.meta.dirname, script), ...args], { encoding: "utf8" });
}

function makeProfile(root) {
  write(root, "index.md", `---
okf_version: "0.3"
x-project-knowledge-version: 1
---
# Project map

- [Vision](00-vision.md)
- [Solution design](00-architecture-overview.md)
- [Capabilities](02-capabilities/capability-inventory.md)
- [Coverage](03-flows/e2e-coverage.md)
- [Decisions](decisions/index.md)
- [Gaps](gaps/index.md)
- [Components](components/index.md)
`);
  write(root, "components/index.md", "# Components\n\n- [Component](identity/identity.md)\n");
  write(root, "components/identity/identity.md", `---
type: Component
title: Identity
description: Owns the validation boundary.
x-project-id: COMPONENT-IDENTITY
x-project-owner: identity-team
---
# Identity

See [ADR-001](decisions/adr-001.md).

![Boundary](../../visuals/boundary.svg)

[Editable source](../../visuals/boundary.drawio)
`);
  write(root, "decisions/index.md", "# Decisions\n\n- [ADR-001](../components/identity/decisions/adr-001.md)\n");
  write(root, "components/identity/decisions/adr-001.md", `---
type: ADR
title: Own verification
description: Establishes the verification boundary.
x-project-id: ADR-001
x-project-owner: identity-team
x-project-domain: mixed
x-project-state: accepted
x-project-scope: [components/identity/identity.md, 00-vision.md]
x-project-evidence: FIXTURE-DECISION-001
---
# Own verification

Applies to [identity](../identity.md) and [vision](../../../00-vision.md).
`);
  write(root, "00-decision-authority.yaml", `decision_authority_version: 1
default_allowed_classes: [D0, D1]
decisions:
  - decision_id: ADR-001
    class: D3
    authority: fixture-owner
    scope_refs: [CAP-FIXTURE-001]
    source_refs: [components/identity/decisions/adr-001.md]
`);
  write(root, "gaps/index.md", "# Gaps\n\n- [GAP-001](gap-001.md)\n");
  write(root, "gaps/gap-001.md", `---
type: Gap
title: Verify ownership
description: Records the ownership clarification.
x-project-id: GAP-001
x-project-owner: identity-team
x-project-state: resolved
x-project-scope: [00-vision.md]
x-project-evidence: FIXTURE-DECISION-001
---
# Verify ownership

See [vision](../00-vision.md).
`);
  fs.appendFileSync(path.join(root, "00-vision.md"), "\nSee [GAP-001](gaps/gap-001.md).\n");
  write(root, "visuals/boundary.drawio", "<mxfile/>\n");
  write(root, "visuals/boundary.svg", '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n');
}

function pinFixtureApproval(root) {
  const generated = run("generate_spec_manifest.mjs", root, "fixture-revision");
  assert.equal(generated.status, 0, generated.stderr);
  const manifest = fs.readFileSync(path.join(root, "spec-manifest.yaml"), "utf8");
  const digest = manifest.match(/^content_digest: (sha256:[a-f0-9]{64})$/m)?.[1];
  assert.ok(digest);
  change(root, ".readiness-report.yaml", /manifest_digest: sha256:[a-f0-9]{64}/, `manifest_digest: ${digest}`);
}

function checkProfile(name, mutate, diagnostic, afterApproval = () => {}) {
  test(name, (context) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "specs-knowledge-"));
    context.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.cpSync(fixture, root, { recursive: true });
    makeProfile(root);
    mutate(root);
    pinFixtureApproval(root);
    afterApproval(root);
    const checked = run("check_specs.mjs", root);
    assert.equal(checked.status, diagnostic ? 1 : 0, checked.stderr);
    if (diagnostic) assert.match(checked.stderr, diagnostic);
  });
}

checkProfile("profile allows one owner backlink and preserves a small editorial diff", (root) => {
  change(root, "components/identity/identity.md", "Owns the validation boundary.", "Owns user validation.");
});
checkProfile("open gap blocks approval", (root) => {
  change(root, "gaps/gap-001.md", "x-project-state: resolved", "x-project-state: open");
}, /open Gap blocks readiness/);
checkProfile("open gap can be recorded during drafting", (root) => {
  change(root, ".readiness-report.yaml", "status: approved", "status: draft");
  change(root, "gaps/gap-001.md", "x-project-state: resolved", "x-project-state: open");
});
checkProfile("proposed decision blocks approval", (root) => {
  change(root, "components/identity/decisions/adr-001.md", "x-project-state: accepted", "x-project-state: proposed");
}, /proposed ADR blocks readiness/);
checkProfile("ADR approval is tied to exact source path in authority", (root) => {
  change(root, "00-decision-authority.yaml", "components/identity/decisions/adr-001.md", "00-vision.md");
}, /accepted ADR requires approval evidence and a matching decision authority entry/);
checkProfile("retired decision cannot remain an active authority source", (root) => {
  change(root, "components/identity/decisions/adr-001.md", "x-project-state: accepted", "x-project-state: rejected");
}, /decision authority must reference an accepted ADR with the matching ID/);
checkProfile("supersession must end in an accepted decision", (root) => {
  const record = "components/identity/decisions/adr-001.md";
  change(root, record, "x-project-state: accepted", `x-project-state: superseded\nx-project-replacement: ${record}`);
}, /replacement chain ending in an accepted ADR/);
checkProfile("fenced example does not satisfy a required direct owner link", (root) => {
  const link = "See [ADR-001](decisions/adr-001.md).";
  change(root, "components/identity/identity.md", link, "\x60\x60\x60md\n" + link + "\n\x60\x60\x60");
}, /identity\.md: missing direct project knowledge link to .*adr-001\.md/);
checkProfile("diagram export requires an editable source link", (root) => {
  change(root, "components/identity/identity.md", "[Editable source](../../visuals/boundary.drawio)", "");
}, /diagram must link its editable source/);
checkProfile("hidden component fails the discovery bound", (root) => {
  change(root, "components/index.md", "- [Component](identity/identity.md)", "");
}, /identity\.md: link from index\.md or a section index/);
checkProfile("untyped record cannot escape the knowledge checker", (root) => {
  write(root, "gaps/unresolved.md", "# Missing timeout terminal state\n");
}, /unresolved\.md: expected project knowledge type Gap/);
checkProfile("a diagram change invalidates the old approval", () => {}, /hash does not match: visuals\/boundary\.svg/, (root) => {
  write(root, "visuals/boundary.svg", '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>\n');
});

test("a YAML example in a legacy index does not activate the profile", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "specs-legacy-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(fixture, root, { recursive: true });
  write(root, "index.md", "# Legacy map\n\n\x60\x60\x60yaml\nx-project-knowledge-version: 1\n\x60\x60\x60\n");
  pinFixtureApproval(root);
  const checked = run("check_specs.mjs", root);
  assert.equal(checked.status, 0, checked.stderr);
});
