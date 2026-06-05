---
name: spec-ticket-implementation
description: Implements exactly one approved spec plan ticket in fixed scope. Use when a ready ticket needs code changes with contract/codegen-first, test-first, verification, and no invention.
---

# Spec Ticket Implementation

Implement one approved AFK ticket. Work contract/codegen-first, test-first, and
only through approved interfaces, ticket scope, and project conventions.
Missing behavior is a blocker.

## Preflight

Before editing, load `references/pre-implementation-checks.md`. Record baseline
verification, dependency status, allowed reads/writes, contract/codegen
disposition, test-first order, acceptance matrix, and required UX/NFR/security/
release evidence.

## Stop Conditions

Stop and write a blocker when:

- specs or plan are not approved/ready
- ticket is blocked, HITL, ambiguous, or has open decisions
- the ticket is full-slice but only a subset can be implemented; route to
  `spec-implementation-planner` for a split before production edits
- scoped specs/ticket lack behavior, contract/codegen disposition, interface,
  persistence, policy, error, failure path, UX/client, NFR, release, or test
- ticket lacks test-first order from specs/contracts/acceptance before logic
- implementation needs files outside `write_scope`
- required generated artifacts or preflight paths from ticket tasks are absent
  and approved generation cannot be run
- contract-heavy work has no approved generation map, generator tests, compile
  check, drift check, or strong boundary type disposition
- interface/type/nullability/async/error/logging semantics are missing
- a closed contract boundary would use weak types such as Go `map[string]any`,
  TypeScript `any`, TypeScript `unknown`, `Record<string, unknown>`, anonymous
  map wrappers, or handwritten duplicate contract interfaces without an
  explicit open JSON leaf in the source contract
- user-facing/client scope lacks access, states, accessibility/responsiveness,
  design/component reuse, or custom UI rationale
- security/privacy, redaction, performance, integrity, rollback, recovery,
  production, operations, dependency, or supply-chain semantics are missing
- a mock, fake, stub, placeholder, or test-only production path would be needed
  without explicit ticket/spec approval
- ticket asks the implementer to decide, infer, ask humans, read all specs, or
  work "as appropriate"

## Discipline

- Modify only `write_scope`.
- Follow `references/implementation-loop.md`: generators/interfaces first,
  spec/contract/acceptance tests first, business logic second, review.
- For contract-first clean rebuild tickets, work against the new generated
  boundary and do not preserve stale aliases, fallback synthesis, compatibility
  wrappers, or storage-era shapes unless the ticket explicitly owns migration.
- Do not hand-edit generated files or implement local smoke paths as completion
  of full tickets.
- Cover happy, unhappy, async/error, security, recovery, logging, and UX/client
  paths when in scope.
- Preserve approved state, recovery, idempotency, no-data-loss/no-leak,
  frontend/client behavior, release, operations, and supply-chain behavior.
- Use precise types, documented public APIs/enums/constants, centralized values,
  and unit-bearing names such as `timeout_in_ms`.
- Keep default verification hermetic; external integrations stay opt-in.
- Keep docs, examples, generated artifacts, public inventory, and execution
  semantics synced when public surfaces change.
- Record changed files and completion evidence.

## Done

Done means `references/definition-of-done.md` passes: scoped verification,
acceptance happy/unhappy tests, exact `write_scope`, no unapproved fakes,
frontend/client and NFR gates in scope, no generated-file drift, review clean,
and tracking updated.

## Lifecycle Handoff

When the ticket is done, update status and return to the plan. When a wave or
partial wave is ready, use `spec-implementation-review`. If routing is unclear,
use `spec-driven-workflow`.

Read references for full checklists:

- `references/pre-implementation-checks.md`
- `references/implementation-loop.md`
- `references/definition-of-done.md`
- `references/write-scope-discipline.md`
