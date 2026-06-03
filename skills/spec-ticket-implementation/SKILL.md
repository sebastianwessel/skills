---
name: spec-ticket-implementation
description: Implements exactly one approved spec plan ticket in fixed scope. Use when a ready ticket needs code changes with contract/codegen-first, test-first, verification, and no invention.
---

# Spec Ticket Implementation

Implement one approved AFK ticket. Work contract/codegen-first, test-first, and
only through approved interfaces, ticket scope, and project conventions. Define
or generate spec/contract/acceptance tests before business logic. Missing
behavior is a blocker.

## Preflight

Before editing, load `references/pre-implementation-checks.md`, run gates,
record baseline verification, confirm dependencies, and map refs/scopes,
acceptance, contracts/codegen, requirement IDs, paths, NFRs, frontend/client UX,
release, and supply chain. Stop on active dependencies; record unrelated
baseline failures.

## Stop Conditions

Stop and write a blocker when:

- specs or plan are not approved/ready
- ticket is blocked, HITL, ambiguous, or has open decisions
- scoped specs/ticket lack behavior, contract/codegen disposition,
  API/event/job/stream, persistence, policy, error, failure path, or test
- ticket lacks test-first order from specs/contracts/acceptance before business
  logic
- implementation needs files outside `write_scope`
- interface/type/nullability/async/error/logging semantics are missing
- user-facing/client scope lacks access, screens, states,
  accessibility/responsiveness, design/component reuse, or custom UI rationale
- security/privacy, redaction, performance, integrity, rollback, recovery, or
  manual-intervention semantics are missing
- traceability, production/release, operations, dependency, SBOM/provenance, or
  vulnerability/license expectations are missing in scope
- a mock, fake, stub, placeholder, or test-only production path would be needed
  without explicit ticket/spec approval
- ticket asks the implementer to decide, infer, fill gaps, use judgment, ask
  humans, read all specs, or work "as appropriate"

## Discipline

- Modify only `write_scope`.
- Follow `references/implementation-loop.md`: generators/interfaces first,
  spec/contract/acceptance failing tests first, business logic second, review.
- Cover happy, unhappy, async/error, security, recovery, and logging paths.
- For frontend/client work, preserve specified access, flows, screens, states,
  accessibility/responsiveness, design/style/component reuse. Do not invent UX.
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

Done means: scoped verification passes, acceptance has happy/unhappy tests, only
`write_scope` changed, no unapproved fakes/placeholders remain, review found no
ticket defect, frontend/client UX reuse checks pass when in scope, and tracking
is updated.

## Lifecycle Handoff

When the ticket is done, update status and return to the plan. When a wave or
partial wave is ready, use `spec-implementation-review`. If routing is unclear,
use `spec-driven-workflow`.

Read references for full checklists:

- `references/pre-implementation-checks.md`
- `references/implementation-loop.md`
- `references/definition-of-done.md`
- `references/write-scope-discipline.md`
