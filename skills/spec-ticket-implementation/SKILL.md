---
name: spec-ticket-implementation
description: Use when implementing one approved spec plan ticket with strict read/write scope, acceptance verification, dependency checks, and no implementation-time decisions.
---

# Spec Ticket Implementation

Implement exactly one approved AFK ticket. Follow specs exactly: contract-first,
test-first, review-before-done. Stop on missing behavior instead of deciding it.

## Preflight

Before editing, load `references/pre-implementation-checks.md` and confirm:

- approved specs and plan gates pass:
  - `node skills/spec-architect/scripts/check_specs.mjs specs`
  - `node skills/spec-implementation-planner/references/check_plan.mjs .`
- baseline verification is recorded
- ticket dependencies are done or merged
- `spec_refs`, `read_scope`, `write_scope`, acceptance criteria, interfaces,
  error/logging/security/performance/recovery expectations, and happy/unhappy
  paths are mapped
- source requirement IDs, production/release, and supply-chain expectations are
  mapped or explicitly not applicable in the ticket/specs
- only scoped specs/context are needed

If dependencies are missing, stop. If baseline failures are outside scope,
record them and continue.

## Stop Conditions

Stop and write a blocker when:

- specs or plan are not approved/ready
- ticket is blocked, HITL, ambiguous, or has open decisions
- behavior, contract, API/event/job/stream, persistence, policy, error, failure
  path, or acceptance test is absent from scoped specs/ticket
- implementation needs files outside `write_scope`
- interface/type/nullability/async/error/logging semantics are missing or
  inconsistent
- security/privacy, log-level/redaction, performance, data-integrity, rollback,
  recovery, or manual-intervention semantics are missing
- requirement traceability, production readiness, release/rollback, dependency,
  SBOM/provenance, or vulnerability/license expectations are missing when in
  scope
- a mock, fake, stub, placeholder, or test-only production path would be needed
  without explicit ticket/spec approval
- ticket asks the implementer to decide, infer, fill gaps, use judgment, ask
  humans, read all specs, or work "as appropriate"

## Discipline

- Modify only `write_scope`.
- Follow `references/implementation-loop.md`: contract/interface first,
  public-interface failing test first, minimal implementation, review.
- Cover happy paths, unhappy paths, async/error paths, and required logging.
- Preserve defined state transitions, rollback/compensation, recovery,
  idempotency, and no-data-loss/no-leak guarantees.
- Preserve release, configuration, runbook, dependency, SBOM/provenance,
  artifact, and vulnerability/license behavior when in scope.
- Use precise types, documented public APIs/enums/constants, centralized
  constants, and unit-bearing names such as `timeout_in_ms`.
- Keep default verification hermetic; external integrations stay opt-in.
- Keep docs, examples, generated artifacts, public inventory, and execution
  semantics synced when public surfaces change.
- Preserve manifest identity/version/digest/canonicalization/snapshot/replay
  semantics when manifests are in scope.
- Record changed files and completion evidence.

## Done

Done means: ticket verification passes, project verification for scope passes,
all acceptance criteria have happy/unhappy path tests, no out-of-scope files
changed, no unapproved mocks/fakes/placeholders remain, review found no
unresolved ticket-scope defect, and status/changed-file tracking is updated.

Read references for full checklists:

- `references/pre-implementation-checks.md`
- `references/implementation-loop.md`
- `references/definition-of-done.md`
- `references/write-scope-discipline.md`
