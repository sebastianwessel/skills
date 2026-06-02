---
name: spec-ticket-implementation
description: Use when implementing one approved spec plan ticket with strict read/write scope, acceptance verification, dependency checks, and no implementation-time decisions.
---

# Spec Ticket Implementation

Implement exactly one approved AFK ticket. Follow specs exactly:
contract/codegen-first, test-first, review-before-done. Stop on missing
behavior instead of deciding it.

## Preflight

Before editing, load `references/pre-implementation-checks.md`, run the spec
and plan gates, record baseline verification, confirm dependencies, and map
ticket refs/scopes, acceptance, generated contracts, requirement IDs, paths,
NFRs, release, and supply-chain expectations. If dependencies are missing,
stop. If baseline failures are outside scope, record and continue.

## Stop Conditions

Stop and write a blocker when:

- specs or plan are not approved/ready
- ticket is blocked, HITL, ambiguous, or has open decisions
- scoped specs/ticket lack behavior, contract, generated-contract disposition,
  API/event/job/stream, persistence, policy, error, failure path, or test
- implementation needs files outside `write_scope`
- interface/type/nullability/async/error/logging semantics are missing or inconsistent
- security/privacy, log-level/redaction, performance, data-integrity, rollback,
  recovery, or manual-intervention semantics are missing
- requirement traceability, production/release, operations, dependency,
  SBOM/provenance, or vulnerability/license expectations are missing in scope
- a mock, fake, stub, placeholder, or test-only production path would be needed
  without explicit ticket/spec approval
- ticket asks the implementer to decide, infer, fill gaps, use judgment, ask
  humans, read all specs, or work "as appropriate"

## Discipline

- Modify only `write_scope`.
- Follow `references/implementation-loop.md`: generated artifacts and
  interfaces first, public-interface failing test first, minimal code, review.
- Cover happy, unhappy, async/error, security, recovery, and logging paths.
- Preserve state, recovery, idempotency, no-data-loss/no-leak, release,
  operations, dependency, SBOM/provenance, artifact, and license behavior.
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
