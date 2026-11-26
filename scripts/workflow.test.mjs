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
  for (const filename of ["simple-yaml.mjs", "markdown.mjs", "slice.mjs"]) {
    assert.deepEqual(fs.readFileSync(path.join(readiness, "lib", filename)),
      fs.readFileSync(path.join(planning, "lib", filename)), filename);
  }
});

test("living specs through two approved ticket handoffs and a later refinement", (context) => {
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

## Expiry

**Open question.** How long should a reservation last?
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
  const sliceDigests = new Map();
  function approve(slice, scenario) {
    const file = `reviews/readiness/${slice}.yaml`;
    const selection = `scenarios: [${scenario}]\n`;
    write(file, selection);
    assert.equal(node(specCheck, specs, "--approved", slice).status, 1, "a named draft cannot authorize work");
    const output = passes(specCheck, specs, "--digest", slice);
    const digest = output.match(/^slice_digest: (sha256:[a-f0-9]{64})$/m)?.[1];
    assert.ok(digest, output);
    sliceDigests.set(slice, digest);
    write(`reviews/${slice}-approval.md`, `Product owner approved ${scenario} at ${digest}.\n`);
    write(`reviews/${slice}-review.md`, `The reviewer walked ${scenario} at ${digest}.\n`);
    write(file, selection + `digest: ${digest}
approved_by: library-product
approval_ref: reviews/${slice}-approval.md
reviewed_by: library-review
review_ref: reviews/${slice}-review.md
`);
    passes(specCheck, specs, "--approved", slice);
  }
  approve("eligibility", "HOLD-ELIGIBLE");
  approve("refusal", "HOLD-REFUSED");

  const wave = "plans/wave_01_reservations";
  write(wave + "/plan.md", "# Reservations\n\nProve eligibility before enforcing it in the reservation operation.\n");
  function ticket(id, scope, dependency, scenario, heading, directory = wave) {
    const definition = `---
id: ${id}
slice: ${heading}
size: S
depends_on: [${dependency}]
write_scope: [${scope}]
---
# ${id}

Add the focused test for ${scenario} before implementing the approved rule.
`;
    write(`${directory}/tickets/${id}-reservations.md`, definition);
    return "sha256:" + crypto.createHash("sha256").update(definition).digest("hex");
  }
  const eligibility = ticket("TICKET-001", "membership", "", "HOLD-ELIGIBLE", "eligibility");
  const refusal = ticket("TICKET-002", "reservations", "TICKET-001", "HOLD-REFUSED", "refusal");
  const progress = (id, digest, fields) => write(`plans/progress/${id}.json`, {
    slice_digest: sliceDigests.get(id === "TICKET-001" ? "eligibility" : "refusal"),
    ticket_digest: digest, ...fields,
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
  const initialRefusal = verifyAndAccept({
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
  const liveSource = path.join(specs, "reservations.md");
  const before = fs.readFileSync(liveSource, "utf8");
  const unaffectedProgress = path.join(root, "plans/progress/TICKET-001.json");
  const accepted = fs.readFileSync(unaffectedProgress);
  const historicalProgress = path.join(root, "plans/progress/TICKET-002.json");
  const historicalAcceptance = fs.readFileSync(historicalProgress);
  fs.writeFileSync(liveSource, before.replace("How long should a reservation last?", "Should expiry differ by membership type?"));
  passes(planCheck, root);
  fs.writeFileSync(liveSource, before.replace("refuse the request", "refuse the request with a membership notice"));
  assert.match(passes(planCheck, root, "--ticket", "TICKET-001"), /accepted/);
  assert.match(runTicket("TICKET-002").output, /refusal: stale or missing slice approval/);
  const rowFile = path.join(specs, "acceptance.yaml");
  fs.writeFileSync(rowFile, fs.readFileSync(rowFile, "utf8").replace(
    "Refusal test leaves the reservation list unchanged",
    "Refusal test leaves the reservation list unchanged and checks the membership notice"));
  approve("refusal", "HOLD-REFUSED");
  assert.match(runTicket("TICKET-002").output, /TICKET-002: stale progress/);
  assert.match(passes(planCheck, root), /no open tickets/);
  const followUp = ticket("TICKET-003", "reservations", "TICKET-001", "HOLD-REFUSED", "refusal",
    "plans/wave_02_refusal_notice");
  progress("TICKET-003", followUp, { state: "ready", ...dependencies });
  passes(planCheck, root);
  progress("TICKET-003", followUp, { state: "in_progress", ...dependencies });
  passes(planCheck, root, "--ticket", "TICKET-003");
  const baseline = fs.readFileSync(path.join(root, "reservations/creation.mjs"), "utf8");
  const updatedRefusal = verifyAndAccept({
    id: "TICKET-003", digest: followUp, directory: "reservations", specCase: "HOLD-REFUSED",
    moduleName: "creation",
    baseline,
    change: baseline + 'export const refusalNotice = (member) => eligible(member) ? null : "Active membership required";\n',
    assertions: `
import assert from "node:assert/strict";
import * as reservations from "./creation.mjs";
const member = { status: "inactive" };
const existing = ["r1"];
assert.equal(reservations.reserve(member, existing, "r2"), existing);
assert.equal(reservations.refusalNotice?.(member), "Active membership required");
assert.equal(reservations.refusalNotice?.({ status: "active" }), null);
`,
    dependencies,
  });
  assert.notEqual(updatedRefusal, initialRefusal);
  assert.match(passes(planCheck, root), /no open tickets/);
  assert.deepEqual(fs.readFileSync(unaffectedProgress), accepted);
  assert.deepEqual(fs.readFileSync(historicalProgress), historicalAcceptance);

});
