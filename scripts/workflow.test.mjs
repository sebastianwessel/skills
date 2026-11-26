import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

const skills = path.resolve(import.meta.dirname, "../skills");
const readiness = path.join(skills, "spec-readiness-review/scripts");
const planning = path.join(skills, "spec-implementation-planner/scripts");

function node(...args) {
  const result = spawnSync(process.execPath, args, { encoding: "utf8" });
  if (result.error) throw result.error;
  return { status: result.status, output: result.stdout + result.stderr };
}

function passes(...args) {
  const result = node(...args);
  assert.equal(result.status, 0, result.output);
  return result.output;
}

test("standalone packages agree on the canonical YAML and anchors", () => {
  for (const filename of ["simple-yaml.mjs", "markdown.mjs"]) {
    assert.deepEqual(fs.readFileSync(path.join(readiness, "lib", filename)),
      fs.readFileSync(path.join(planning, "lib", filename)), filename);
  }
});

test("source approval through two ordered ticket handoffs", (context) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skills-workflow-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const specs = path.join(root, "specs");
  const specCheck = path.join(readiness, "check_specs.mjs");
  const planCheck = path.join(planning, "check_plan.mjs");
  function write(file, value) {
    const absolute = path.join(root, file);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, typeof value === "string" ? value : JSON.stringify(value, null, 2));
  }

  write("specs/index.md", "# Library reservations\n\n[Reservation rules](reservations.md) · [Acceptance](acceptance.yaml)\n");
  write("specs/reservations.md", `# Reservation rules

## Eligibility

Only an active member can create a reservation.

## Refusal

For an inactive member, refuse the request and leave the reservation list unchanged.
`);
  write("specs/acceptance.yaml", `scenarios:
  - id: HOLD-ELIGIBLE
    source: reservations.md#eligibility
    verify: [Eligibility test returns true only for active members]
  - id: HOLD-REFUSED
    source: reservations.md#refusal
    verify: [Refusal test leaves the reservation list unchanged]
`);
  passes(specCheck, specs);
  assert.equal(node(specCheck, specs, "--approved").status, 1, "draft cannot authorize planning");
  passes(path.join(readiness, "generate_spec_manifest.mjs"), specs, "fixture-source");
  const manifest = fs.readFileSync(path.join(specs, "spec-manifest.yaml"), "utf8");
  const specDigest = manifest.match(/^content_digest: (sha256:[a-f0-9]{64})$/m)?.[1];
  assert.ok(specDigest, manifest);
  write("reviews/approval.md", `Product owner approves the whole bundle at ${specDigest}.\n`);
  write("reviews/spec-review.md", `The reviewer walked both reservation scenarios at ${specDigest}.\n`);
  write("specs/.readiness-report.yaml", `status: approved
approval_evidence:
  scope: whole_bundle
  approver_id: library-product
  approved_at: "2026-11-26T09:20:00Z"
  approval_ref: reviews/approval.md
  manifest_digest: ${specDigest}
semantic_judge_evidence:
  status: passed
  judge: library-review
  reviewed_at: "2026-11-26T09:10:00Z"
  evidence_ref: reviews/spec-review.md
  manifest_digest: ${specDigest}
`);
  passes(specCheck, specs, "--approved");

  const wave = "plans/wave_01_reservations";
  write(wave + "/plan.md", "# Reservations\n\nProve eligibility before enforcing it in the reservation operation.\n");
  function ticket(id, scope, dependency, scenario, heading) {
    const definition = `---
id: ${id}
size: S
depends_on: [${dependency}]
write_scope: [${scope}]
spec_refs: ["reservations.md#${heading}"]
acceptance_ids: [${scenario}]
---
# ${id}

Add the focused test for ${scenario} before implementing the approved rule.
`;
    write(`${wave}/tickets/${id}-reservations.md`, definition);
    return "sha256:" + crypto.createHash("sha256").update(definition).digest("hex");
  }
  const eligibility = ticket("TICKET-001", "membership", "", "HOLD-ELIGIBLE", "eligibility");
  const refusal = ticket("TICKET-002", "reservations", "TICKET-001", "HOLD-REFUSED", "refusal");
  passes(path.join(planning, "generate_plan_manifest.mjs"), root);
  const planPath = path.join(root, "plans/plan-manifest.yaml");
  const planBytes = fs.readFileSync(planPath);
  const progress = (id, digest, fields) => write(`plans/progress/${id}.json`, {
    spec_digest: specDigest, ticket_digest: digest, ...fields,
  });
  const runTicket = (id) => node(planCheck, root, "--ticket", id);
  passes(planCheck, root);

  progress("TICKET-002", refusal, { state: "ready" });
  const blocked = runTicket("TICKET-002");
  assert.equal(blocked.status, 1);
  assert.match(blocked.output, /dependency TICKET-001 must be accepted/);
  fs.unlinkSync(path.join(root, "plans/progress/TICKET-002.json"));

  progress("TICKET-001", eligibility, { state: "ready" });
  passes(planCheck, root, "--ticket", "TICKET-001");
  progress("TICKET-001", eligibility, { state: "in_progress" });
  passes(planCheck, root, "--ticket", "TICKET-001");
  function verifyAndAccept({ id, digest, directory, specCase, moduleName, baseline, change, assertions, dependencies }) {
    const module = `${directory}/${moduleName}.mjs`;
    const testFile = `${directory}/${moduleName}.test.mjs`;
    write(module, baseline);
    write(testFile, assertions);
    const failed = node(path.join(root, testFile));
    assert.equal(failed.status, 1, failed.output);
    assert.match(failed.output, /AssertionError/, "the test should fail on behavior before the fix");
    write(module, change);
    passes(path.join(root, testFile));
    const checks = `plans/reviews/${id}-checks.md`;
    write(checks, `# Checks\n\nBefore: behavior assertion failed.\n\nAfter: all assertions passed.\n`);
    const implementation = {
      by: "implementer-a",
      revision: `fixture-${id}-revision`,
      changed_files: [testFile, module],
      acceptance: { [specCase]: checks },
      verification: [checks],
      test_first_ref: checks,
    };
    progress(id, digest, { state: "implemented", implementation, ...dependencies });
    passes(planCheck, root, "--ticket", id);
    const review = `plans/reviews/${id}.md`;
    write(review, `# Accepted\n\nVerified ${implementation.revision} and the passing assertions.\n`);
    progress(id, digest, { state: "accepted", implementation, ...dependencies, review: {
      reviewer: "reviewer-b", revision: implementation.revision, evidence_ref: review,
    } });
    passes(planCheck, root, "--ticket", id);
    return implementation.revision;
  }

  const firstRevision = verifyAndAccept({
    id: "TICKET-001", digest: eligibility, directory: "membership", specCase: "HOLD-ELIGIBLE",
    moduleName: "eligibility",
    baseline: 'export const eligible = () => false;\n',
    change: 'export const eligible = (member) => member.status === "active";\n',
    assertions: `
import assert from "node:assert/strict";
import { eligible } from "./eligibility.mjs";
assert.equal(eligible({ status: "active" }), true);
assert.equal(eligible({ status: "inactive" }), false);
`,
  });
  const dependencies = { dependency_revisions: { "TICKET-001": firstRevision } };
  progress("TICKET-002", refusal, { state: "ready", ...dependencies });
  passes(planCheck, root);
  progress("TICKET-002", refusal, { state: "in_progress", ...dependencies });
  passes(planCheck, root);
  verifyAndAccept({
    id: "TICKET-002", digest: refusal, directory: "reservations", specCase: "HOLD-REFUSED",
    moduleName: "creation",
    baseline: 'export const reserve = (member, holds, id) => [...holds, id];\n',
    change: `
import { eligible } from "../membership/eligibility.mjs";
export const reserve = (member, holds, id) => eligible(member) ? [...holds, id] : holds;
`,
    assertions: `
import assert from "node:assert/strict";
import { reserve } from "./creation.mjs";
const existing = ["r1"];
assert.equal(reserve({ status: "inactive" }, existing, "r2"), existing);
assert.deepEqual(reserve({ status: "active" }, existing, "r2"), ["r1", "r2"]);
assert.deepEqual(existing, ["r1"]);
`,
    dependencies,
  });
  assert.deepEqual(fs.readFileSync(planPath), planBytes, "progress and reviews must leave the manifest unchanged");

  fs.appendFileSync(path.join(specs, "reservations.md"), "\nThe requested function changed after approval.\n");
  const stale = node(specCheck, specs, "--approved");
  assert.equal(stale.status, 1);
  assert.match(stale.output, /no longer matches/);
});
