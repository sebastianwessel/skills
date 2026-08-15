#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const checker = path.resolve(import.meta.dirname, "check_plan.mjs");
const generator = path.resolve(import.meta.dirname, "generate_plan_manifest.mjs");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "check-plan-"));
const write = (relative, content) => {
  const file = path.join(temp, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const body = ["Goal", "Context Digest", "Implementation Approach", "Decision Ledger", "Action Plan", "Requirements Traceability", "Contract Traceability", "Spec Drift Controls", "Generator And Type Plan", "Test-First Order", "Modularity And Reuse Plan", "Representation Reuse Plan", "Slice Strategy", "Tasks", "Acceptance", "Acceptance Test Matrix", "End-To-End Definition Coverage", "Operational Path Coverage", "Review And Verification Plan", "Verification", "Non-goals", "Handoff"].map((heading) => `## ${heading}\nEvidence.\n`).join("\n");
const ticket = (id = "TICKET-001", dependsOn = "[]") => `---
id: ${id}
title: User boundary
wave: 1
lifecycle: ready
spec_manifest_digest: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
parallel_group: ""
depends_on: ${dependsOn}
blocked_by: []
spec_refs: [specs/scope.md#REQ-001]
traceability:
  requirement_ids: [REQ-001]
  capability_ids: [CAP-001]
  path_ids: [PATH-001]
  acceptance_ids: [ACCEPT-001]
write_scope: [packages/identity/src]
read_scope: [packages/contracts/src/user.ts]
contract_readiness:
  status: ready
  required_contracts: [specs/contracts.md#CON-USER]
  missing_contracts: []
generated_contracts:
  status: not_applicable
  source_refs: []
  command_refs: []
  drift_command_refs: []
ticket_readiness:
  status: implementation_ready
  open_decisions: []
  ambiguous_phrases: []
slice_type: vertical_slice
phase_gate_exception: false
representation_reuse:
  status: not_applicable
  rationale: no representation crosses this private refactor
  scope_refs: [specs/scope.md#REQ-001]
autonomy:
  allowed_classes: [D0]
  convention_refs: []
  approved_decision_refs: []
  escalation: blocker
verification_commands:
  CMD-UNIT:
    command: node --version
    purpose: baseline verification
    expected: pass
    network: forbidden
    writes: read_only
    secrets: forbidden
action_steps:
  - id: STEP-PREFLIGHT
    kind: preflight
    files: [packages/identity/src]
    command_refs: [CMD-UNIT]
    acceptance_refs: []
    expected_proof: baseline recorded
  - id: STEP-CONTRACT
    kind: contract
    files: [packages/contracts/src/user.ts]
    command_refs: [CMD-UNIT]
    acceptance_refs: []
    expected_proof: contract unchanged
  - id: STEP-TEST
    kind: test
    files: [packages/identity/src/user.test.ts]
    command_refs: [CMD-UNIT]
    acceptance_refs: [ACC-001]
    expected_proof: fails before implementation
  - id: STEP-IMPLEMENT
    kind: implement
    files: [packages/identity/src/user.ts]
    command_refs: []
    acceptance_refs: [ACC-001]
    expected_proof: scoped code changed
  - id: STEP-VERIFY
    kind: verify
    files: [packages/identity/src/user.test.ts]
    command_refs: [CMD-UNIT]
    acceptance_refs: [ACC-001]
    expected_proof: tests pass
  - id: STEP-HANDOFF
    kind: handoff
    files: []
    command_refs: []
    acceptance_refs: []
    expected_proof: evidence recorded
acceptance:
  - id: ACC-001
    traceability_acceptance_ids: [ACCEPT-001]
    requirement_refs: [specs/scope.md#REQ-001]
    test_refs: [packages/identity/src/user.test.ts#creates_user]
    command_refs: [CMD-UNIT]
    expected_outcome: creates a valid user
    lifecycle: planned
---

${body}`;
const indexes = (id = "TICKET-001", dependsOn = "[]") => {
  write("plans/_registry.yaml", `tickets:\n  ${id}:\n    path: wave_01_identity/tickets/${id}-user.md\n    wave: 1\n    lifecycle: ready\n`);
  write("plans/_status.yaml", `tickets:\n  ${id}:\n    lifecycle: ready\n    current_proof: baseline-recorded\n    resume_notes: none\n    affected_spec_refs: [specs/scope.md#REQ-001]\n`);
  write("plans/_dependencies.yaml", `tickets:\n  ${id}:\n    depends_on: ${dependsOn}\n    blocked_by: []\n    unblocks: []\n`);
  write("plans/_scope.yaml", `tickets:\n  ${id}:\n    write_scope: [packages/identity/src]\n    read_scope: [packages/contracts/src/user.ts]\n`);
};
const run = () => {
  try { return { ok: true, output: execFileSync(process.execPath, [checker, temp], { encoding: "utf8" }) }; }
  catch (error) { return { ok: false, output: `${error.stdout || ""}${error.stderr || ""}` }; }
};

try {
  write("specs/.readiness-report.yaml", "status: approved\nhuman_approval:\n  status: approved\napproval_evidence:\n  status: approved\n  manifest_digest: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n");
  write("specs/spec-manifest.yaml", "spec_manifest_version: 1\ncontent_digest: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nartifacts: []\n");
  write("specs/scope.md", "# Scope\nREQ-001\n");
  write("specs/contracts.md", "# Contracts\nCON-USER\n");
  write("specs/00-traceability.yaml", "traceability_version: 1\nrequirements:\n  - requirement_id: REQ-001\ncapabilities:\n  - capability_id: CAP-001\npaths:\n  - path_id: PATH-001\nacceptance:\n  - acceptance_id: ACCEPT-001\n");
  write("plans/implementation-plan.md", "# Plan\n\n## Self-Audit\nEvidence.\n");
  write("plans/wave_01_identity/plan.md", "## End-to-End Outcome\nWorks.\n\n## Implementation Order\nOrdered.\n\n## Slice Strategy\nVertical.\n\n## Isolation\nIsolated.\n\n## Status\nReady.\n\n## Operational Path Coverage\nCovered.\n");
  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket());
  indexes();
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });
  assert.equal(run().ok, true, "valid structural plan should pass");

  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket().replace(/\n/g, "\r\n"));
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });
  assert.equal(run().ok, true, "CRLF ticket frontmatter should pass");
  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket());
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });

  write("specs/00-traceability.yaml", "traceability_version: 1\nrequirements:\n  - requirement_id: REQ-001\ncapabilities:\n  - capability_id: CAP-001\n  - capability_id: CAP-002\npaths:\n  - path_id: PATH-001\nacceptance:\n  - acceptance_id: ACCEPT-001\n");
  assert.match(run().output, /capabilities ID CAP-002 is not covered by a non-skipped ticket/, "every approved traceability ID must be planned");
  write("specs/00-traceability.yaml", "traceability_version: 1\nrequirements:\n  - requirement_id: REQ-001\ncapabilities:\n  - capability_id: CAP-001\npaths:\n  - path_id: PATH-001\nacceptance:\n  - acceptance_id: ACCEPT-001\n");

  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket().replace("capability_ids: [CAP-001]", "capability_ids: [CAP-UNKNOWN]"));
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });
  assert.match(run().output, /unknown traceability capability_ids ID CAP-UNKNOWN/, "unknown traceability IDs must fail");
  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket());
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });

  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket().replace("sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"));
  assert.match(run().output, /spec_manifest_digest must equal/, "stale ticket digest must fail");
  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket());
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });

  write("plans/_scope.yaml", "tickets: {}\n");
  assert.match(run().output, /ticket IDs must exactly reconcile/, "stale index must fail");
  indexes();
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });

  write("plans/wave_01_identity/tickets/TICKET-001-user.md", ticket("TICKET-001", "[TICKET-001]"));
  indexes("TICKET-001", "[TICKET-001]");
  write("plans/_dependencies.yaml", "tickets:\n  TICKET-001:\n    depends_on: [TICKET-001]\n    blocked_by: []\n    unblocks: [TICKET-001]\n");
  execFileSync(process.execPath, [generator, temp], { encoding: "utf8" });
  assert.match(run().output, /cycle TICKET-001 -> TICKET-001/, "dependency cycle must fail");

  console.log("check_plan tests ok");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
