# Ticket and progress format

## Contents

- [Plan definitions](#plan-definitions)
- [Progress and acceptance](#progress-and-acceptance)

## Plan definitions

A wave directory such as `plans/wave_01_identity/` contains `plan.md` and a
`tickets/` directory. Put the wave outcome, sequencing rationale, verification
and any shared risks in its plan. The optional `plans/implementation-plan.md`
can explain cross-wave decisions. The manifest hashes the bytes of these
files and each ticket. Ticket paths determine wave membership. A ticket ID
is unique across the plan.

For example, `tickets/TICKET-001-create-user.md` could contain the following.

```markdown
---
id: TICKET-001
size: S
depends_on: []
write_scope: [src/identity, tests/identity]
spec_refs: [identity.md#create-user]
acceptance_ids: [AC-CREATE, AC-DUPLICATE]
---
# Create a user

Return the user from the public create operation. Reuse the approved User
type and identity repository. Keep uniqueness in the existing transaction.

1. Read the transaction and error rules under the cited section. Verify
   that generated User types match the contract with npm run contracts:check.
2. Add public-handler tests for creation and duplicate email. Run
   npm run test:identity and capture the failing assertions.
3. Implement the operation in src/identity. The duplicate response must
   preserve the original record and omit email from error logs.
4. Run the same tests and the contract check. Record the revision, changed
   files and passing evidence for both scenarios.
```

Use simple YAML mappings and lists in frontmatter. Cite spec-root-relative
Markdown paths with a stable heading or explicit anchor. `acceptance_ids`
refers to scenarios in `specs/acceptance.yaml`. Use literal repository-relative
files or directories for write scope. An evidence-only ticket may use `[]`.
Include intended tests, generation outputs and docs in write scope. The ticket's
progress file and independent review records are workflow bookkeeping.

Size within the project. XS is a localized change with focused proof, S is a
bounded component change, and M crosses related boundaries or needs integration
and recovery verification. L and XL signal substantial coordination or several
outcomes. Split separable work. For genuinely atomic work such as a migration,
name the proof that blocks each later step. Keep sizes independent of deadlines.

## Progress and acceptance

A missing `plans/progress/TICKET-001.json` means `planned`. Only the progress
file records current state. Use the following command to obtain its two digests
and check the ticket and its dependencies. The full command checks every ticket.

```sh
node <planner>/scripts/check_plan.mjs <repo-root> --ticket TICKET-001
```

Start a progress record with `state`, `spec_digest`, and `ticket_digest`.
Copy the entire digests printed by the checker. For a ticket with prerequisites
in `ready`, `in_progress`, `implemented` or `accepted`, copy each prerequisite's
accepted `implementation.revision` into `dependency_revisions`, keyed by ticket
ID. For example, `{"TICKET-001": "commit-abc"}`. A root ticket omits this
field or uses an empty object. The following example shows
the additional fields in an accepted record. Evidence references must lead
the reviewer to the actual results for that revision.

```json
{
  "state": "accepted",
  "spec_digest": "sha256:<approved source digest>",
  "ticket_digest": "sha256:<ticket definition digest>",
  "implementation": {
    "by": "contributor-a",
    "revision": "implementation-commit-or-immutable-snapshot",
    "changed_files": ["src/identity/create.ts", "tests/identity/create.test.ts"],
    "acceptance": {"AC-CREATE": "CI run 24, create", "AC-DUPLICATE": "CI run 24, duplicate"},
    "verification": ["CI run 24, identity tests and contracts check"],
    "test_first_ref": "CI run 23, failing public-handler assertions"
  },
  "review": {
    "reviewer": "reviewer-b",
    "revision": "implementation-commit-or-immutable-snapshot",
    "evidence_ref": "plans/reviews/identity-review.md"
  }
}
```

- The planner or controller marks a bounded ticket `ready` only after its
  handoff is complete and all dependencies have current independent acceptance.
  Claim it as `in_progress` before editing. Coordinate claims through one
  controller or the project's existing locking mechanism. Check again after
  claiming. Concurrent writers need disjoint scopes.
- For `blocked`, `partial` or `skipped`, add a nonempty `note` naming the
  reason, owner and resumption condition. A skipped ticket cannot satisfy a
  dependency or be the only owner of an approved scenario.
- The implementer records `implemented` with every field under `implementation`.
  Each scenario needs a result, and verification references need actual
  command outcomes. Evidence-only work with no changed files needs a progress
  `note` explaining why and a `test_first_ref` citing prior proof or explaining
  why a failing code test does not apply.
- Independent review alone records `accepted`. Check reviewer identity,
  reviewed revision, changed files, verification and affected consumers against
  the real diff and results. The checker verifies record structure and
  references between records. Reviewers evaluate the linked evidence.
- On a finding or changed prerequisite, the planner/controller identifies
  affected dependents, records a hold, then requeues bounded work as `ready`
  once prerequisites pass. Retire stale implementation/review fields on requeue.
  At requeue, pin the current accepted prerequisite revisions. Verify
  integration against those revisions during the new execution. Obtain fresh
  independent review before accepting the result. Preserve prior records in
  version history. For changed definitions, review the impact before
  regenerating the manifest or refreshing any progress digest.
