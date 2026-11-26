#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, beforeEach, test } from "node:test";

import { readSlice } from "./lib/slice.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "plan-test-"));
const sliceDigests = new Map();
const mainSlice = "create";
const wave = "plans/wave_01_identity";
const ticketPath = (suffix) => `${wave}/tickets/TICKET-${suffix}-user.md`;
const run = (script, ...args) => {
  const result = spawnSync(process.execPath, [path.join(import.meta.dirname, script), root, ...args], { encoding: "utf8" });
  return { status: result.status, text: result.stdout + result.stderr };
};
const write = (file, text) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
};
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
function approve(slice, scenario) {
  const file = `reviews/readiness/${slice}.yaml`;
  const selection = `scenarios: [${scenario}]\n`;
  write(file, selection);
  const { digest } = readSlice(path.join(root, "specs"), slice, { approved: false });
  sliceDigests.set(slice, digest);
  write("reviews/proof.md", "Fixture proof.\n");
  write(file, selection + `digest: ${digest}
approved_by: test-product
approval_ref: reviews/proof.md
reviewed_by: test-reviewer
review_ref: reviews/proof.md
`);
}
const inspect = (...args) => run("check_plan.mjs", ...args);
const check = (...args) => {
  const result = inspect(...args);
  assert.equal(result.status, 0, result.text);
  return result.text;
};
const fails = (pattern, ...args) => {
  const result = inspect(...args);
  assert.equal(result.status, 1, result.text);
  assert.match(result.text, pattern);
};
function ticket(id, scope, scenarios, deps = [], slice = scenarios[0].toLowerCase()) {
  write(ticketPath(id), `---
id: TICKET-${id}
slice: ${slice}
size: S
depends_on: [${deps.join(", ")}]
write_scope: [${scope}]
acceptance_ids: [${scenarios.join(", ")}]
---
# Create user
Follow the existing public handler and verify both authorized and denied cases.
`);
}
function record(suffix, state, extra = {}) {
  const definition = read(ticketPath(suffix));
  const slice = definition.match(/^slice: (.*)$/m)[1];
  const digest = crypto.createHash("sha256").update(definition).digest("hex");
  write(`plans/progress/TICKET-${suffix}.json`, JSON.stringify({
    state, slice_digest: sliceDigests.get(slice), ticket_digest: `sha256:${digest}`, ...extra,
  }));
}
function completed() {
  return {
    implementation: {
      by: "alice", revision: "commit-abc", changed_files: ["src/api/index.ts"],
      acceptance: { CREATE: "run/2/create" }, verification: ["run/2"], test_first_ref: "run/1/create",
    },
    review: { reviewer: "bob", revision: "commit-abc", evidence_ref: "review/3" },
  };
}

beforeEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
  sliceDigests.clear();
  write("specs/identity.md", "# Identity\n\n## Create\nExisting identity rules.\n\n## Show\nRead by ID.\n");
  write("specs/acceptance.yaml", [
    "scenarios:", "  - id: CREATE", "    source: identity.md#create", "    verify: [returns a new user]",
    "  - id: SHOW", "    source: identity.md#show", "    verify: [displays existing user]",
  ].join("\n"));
  write(`${wave}/plan.md`, "# Create and show a user\n");
  ticket("001", "src/api", ["CREATE"]);
  ticket("002", "src/ui", ["SHOW"], ["TICKET-001"]);
  approve(mainSlice, "CREATE");
  approve("show", "SHOW");
});
after(() => fs.rmSync(root, { recursive: true, force: true }));

test("ordinary progress changes preserve definition bytes and accepted evidence", () => {
  const definition = read(ticketPath("001"));
  assert.match(check("--ticket", "TICKET-001"), /planned\nslice_digest: sha256:[a-f0-9]{64}\nticket_digest: sha256:[a-f0-9]{64}/);
  record("001", "ready");
  check();
  record("001", "in_progress");
  check();
  record("001", "implemented", { implementation: completed().implementation });
  record("002", "ready", { dependency_revisions: { "TICKET-001": "commit-abc" } });
  fails(/dependency TICKET-001 must be accepted/);
  record("001", "accepted", completed());
  const acceptance = read("plans/progress/TICKET-001.json");
  check();
  record("002", "in_progress", { dependency_revisions: { "TICKET-001": "commit-abc" } });
  write("plans/reviews/identity.md", "Reviewed behavior and CI results.\n");
  check();
  assert.equal(read(ticketPath("001")), definition);
  assert.equal(read("plans/progress/TICKET-001.json"), acceptance);
});

test("stale prerequisite blocks dependents and independently selected work can continue", () => {
  ticket("003", "tests/browser", ["SHOW"]);
  record("001", "accepted", completed());
  record("002", "ready", { dependency_revisions: { "TICKET-001": "commit-abc" } });
  write(ticketPath("001"), read(ticketPath("001")) + "\nAdd recovery test.\n");
  fails(/TICKET-001: stale progress/);
  fails(/TICKET-001: stale progress/, "--ticket", "TICKET-002");
  check("--ticket", "TICKET-003");
});

test("implementation needs scoped files, exact acceptance and verification, with independent review of the same revision", () => {
  for (const [change, message] of [
    [({ implementation }) => { implementation.changed_files = ["src/api-other/x.ts"]; }, /outside write_scope/],
    [({ implementation }) => { delete implementation.acceptance.CREATE; }, /exactly the ticket's scenarios/],
    [({ implementation }) => { implementation.acceptance.EXTRA = "run/3"; }, /exactly the ticket's scenarios/],
    [({ implementation }) => { implementation.verification = []; }, /verification.*nonempty/],
    [({ implementation }) => { delete implementation.test_first_ref; }, /test_first_ref required/],
    [({ review }) => { review.reviewer = " Alice "; }, /reviewer must differ/],
    [({ review }) => { review.revision = "old"; }, /reviewed revision differs/],
    [(proof) => { delete proof.review; }, /independent review requires/],
  ]) {
    const proof = completed();
    change(proof);
    record("001", "accepted", proof);
    fails(message, "--ticket", "TICKET-001");
  }
  const evidenceOnly = completed();
  evidenceOnly.implementation.changed_files = [];
  record("001", "accepted", evidenceOnly);
  fails(/explain evidence-only work/, "--ticket", "TICKET-001");
  record("001", "accepted", { ...evidenceOnly, note: "Reverified unchanged behavior at the pinned revision." });
  check();
});

test("dependency, scope and approval errors have actionable diagnostics", () => {
  ticket("001", "src", ["CREATE"], ["TICKET-002"]);
  fails(/dependency cycle/);
  ticket("001", "src", ["CREATE"]);
  ticket("002", "src/ui", ["SHOW"]);
  record("001", "in_progress");
  record("002", "in_progress");
  fails(/overlapping in_progress write scopes/);
  record("002", "blocked");
  fails(/blocked needs a note/, "--ticket", "TICKET-002");
  write("plans/progress/TICKET-002.json", JSON.stringify({ state: "blocked", note: "Await isolated UI scope." }));
  check();
  write("reviews/readiness/show.yaml", "scenarios: [SHOW]\n");
  fails(/stale or missing slice approval/, "--ticket", "TICKET-002");
  check("--ticket", "TICKET-001");
});

test("ticket scope, size and scenario references are checked", () => {
  const original = read(ticketPath("001"));
  for (const [from, to, message] of [
    ["size: S", "size: 3 hours", /size must be/],
    ["src/api", "src/../lib", /literal repository-relative/],
    ["src/api", "reviews/readiness", /workflow or Git metadata/],
    ["[CREATE]", "[UNKNOWN]", /scenario outside the approved slice/],
    ["[CREATE]", "[SHOW]", /scenario outside the approved slice/],
  ]) {
    write(ticketPath("001"), original.replace(from, to));
      fails(message, "--ticket", "TICKET-001");
  }
});

test("scope comparisons respect the repository volume's case sensitivity", () => {
  ticket("001", "src/Foo", ["CREATE"]);
  ticket("002", "Src/foo/nested", ["SHOW"]);
  record("001", "in_progress");
  record("002", "in_progress");
  const plans = fs.statSync(path.join(root, "plans"));
  const other = fs.statSync(path.join(root, "PLANS"), { throwIfNoEntry: false });
  if (other?.ino === plans.ino && other?.dev === plans.dev) fails(/overlapping in_progress write scopes/);
  else check();
});

test("descendant paths cannot cross symlinks or file ancestors", () => {
  write("src/api/file", "text");
  ticket("001", "src/api/file/nested", ["CREATE"]);
  fails(/non-directory ancestor/);
  ticket("001", "src/api", ["CREATE"]);
  fs.symlinkSync(path.join(root, "plans"), path.join(root, "src/api/alias"), "dir");
  const proof = completed();
  proof.implementation.changed_files = ["src/api/alias/file.ts"];
  record("001", "accepted", proof);
  fails(/symlink in write path/, "--ticket", "TICKET-001");
});

test("downstream acceptance stays stale after a prerequisite is reaccepted at a new revision", () => {
  record("001", "accepted", completed());
  record("002", "ready");
  fails(/dependency_revisions must pin exactly its prerequisites/);
  const proof = completed();
  proof.implementation.acceptance = { SHOW: "run/4/show" };
  proof.implementation.changed_files = ["src/ui/user.ts"];
  record("002", "accepted", { ...proof, dependency_revisions: { "TICKET-001": "commit-abc" } });
  check();
  const updated = completed();
  updated.implementation.revision = "commit-def";
  updated.review.revision = "commit-def";
  record("001", "accepted", updated);
  fails(/TICKET-002: stale or missing accepted revision for dependency TICKET-001/, "--ticket", "TICKET-002");
  check("--ticket", "TICKET-001");
});

test("unplanned draft scenarios and stale unrelated progress leave approved work available", () => {
  record("001", "accepted", completed());
  const before = read("plans/progress/TICKET-001.json");
  write("specs/acceptance.yaml", read("specs/acceptance.yaml") +
    "\n  - id: DELETE\n    source: identity.md#delete\n    verify: [Expected result pending]\n");
  write("specs/identity.md", read("specs/identity.md") + "\n## Delete\nWho can delete a user?\n");
  check();
  write("specs/identity.md", read("specs/identity.md").replace("Read by ID.", "Read by verified ID."));
  fails(/show: stale or missing slice approval/, "--ticket", "TICKET-002");
  check("--ticket", "TICKET-001");
  assert.equal(read("plans/progress/TICKET-001.json"), before);
});

test("a single-ticket slice inherits its scenarios and lists their exact sources", () => {
  write(ticketPath("001"), read(ticketPath("001")).replace("acceptance_ids: [CREATE]\n", ""));
  const output = check("--ticket", "TICKET-001");
  assert.match(output, /CREATE → identity\.md#create/);
  assert.doesNotMatch(output, /identity\.md#show/);
  record("001", "accepted", completed());
  check("--ticket", "TICKET-001");
});

test("completed and parked waves are history unless current work needs them", () => {
  record("001", "accepted", completed());
  record("002", "blocked", { note: "This outcome was set aside." });
  write("specs/identity.md", read("specs/identity.md").replace("Existing identity rules.", "The rules changed."));
  assert.match(check(), /no open tickets/);
  fails(/create: stale or missing slice approval/, "--ticket", "TICKET-001");
  ticket("003", "src/browser", ["SHOW"], ["TICKET-001"]);
  fails(/create: stale or missing slice approval/, "--ticket", "TICKET-003");
});
