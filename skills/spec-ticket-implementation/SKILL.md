---
name: spec-ticket-implementation
description: Use when implementing one approved spec plan ticket with strict read/write scope, acceptance verification, dependency checks, and no implementation-time decisions.
---

# Spec Ticket Implementation

Implement exactly one approved AFK ticket. Do not invent behavior, expand scope,
or decide missing contracts.

## Preflight

Before editing:

1. Confirm `specs/.readiness-report.yaml` is approved.
2. Run available gates:
   - `node skills/spec-architect/scripts/check_specs.mjs specs`
   - `node skills/spec-implementation-planner/references/check_plan.mjs .`
3. Run baseline verification.
4. Parse ticket frontmatter: `depends_on`, `blocked_by`, `spec_refs`,
   `read_scope`, `write_scope`, readiness fields.
5. Confirm dependencies are done or merged.
6. Read conventions and only scoped specs/context.

If dependencies are missing, stop. If baseline failures are outside scope,
record them and continue.

## Stop Conditions

Stop and write a blocker when:

- specs or plan are not approved/ready
- ticket is blocked, HITL, ambiguous, or has open decisions
- behavior, contract, API/event/job/stream, persistence, policy, error, failure
  path, or acceptance test is absent from scoped specs/ticket
- implementation needs files outside `write_scope`
- ticket asks the implementer to decide, infer, fill gaps, use judgment, ask
  humans, read all specs, or work "as appropriate"

## Discipline

- Modify only `write_scope`.
- Implement acceptance criteria one behavior at a time.
- Test through public interfaces, including failure paths.
- Keep default verification hermetic; external integrations stay opt-in.
- Keep docs, examples, generated artifacts, public inventory, and execution
  semantics synced when public surfaces change.
- Preserve manifest identity/version/digest/canonicalization/snapshot/replay
  semantics when manifests are in scope.
- Record changed files and completion evidence.

## Done

Done means: ticket verification passes, project verification for scope passes,
all acceptance criteria have tests, no out-of-scope files changed, no TODO/FIXME
remains, no behavior was invented, and status/changed-file tracking is updated.

Read references for full checklists:

- `references/pre-implementation-checks.md`
- `references/definition-of-done.md`
- `references/write-scope-discipline.md`
