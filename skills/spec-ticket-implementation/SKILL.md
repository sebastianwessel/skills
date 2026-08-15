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
release evidence. Also record catalog shape/mapping refs and the approved
new-shape disposition.

Only start a ticket in `ready` or `in_progress`. After every scoped acceptance
row and local check passes, record the review-owned implementation-evidence
manifest and move it to `implemented`; do not mark a ticket `accepted` yourself.
Confirm its `spec_manifest_digest` exactly matches the approved readiness
manifest and `plan_manifest_digest` exactly matches the plan manifest before
editing; either mismatch is a spec/plan blocker.

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
- a ticket that touches data shapes lacks a ready representation catalog ref,
  registered shape/mapping refs, or scoped N/A evidence
- implementation would create an exported DTO, entity, schema, event, record,
  projection, or mapper absent from the approved catalog/ticket decision
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
- ticket allows a decision outside its D0/D1 autonomy budget, lacks cited
  conventions for D1 work, or requires a D2/D3 choice without an approved
  decision ref
- a preflight or verification command lacks safe metadata, requires network or
  secrets, chains shell operations, or writes outside its declared policy

## Discipline

- Modify only `write_scope`.
- Follow `references/implementation-loop.md`: generators/interfaces first,
  spec/contract/acceptance tests first, business logic second, review.
- For contract-first clean rebuild tickets, work against the new generated
  boundary and do not preserve stale aliases, fallback synthesis, compatibility
  wrappers, or storage-era shapes unless the ticket explicitly owns migration.
- Reuse catalogued shapes and mappings exactly. A different layer may use a
  distinct representation only through its approved mapping; do not create a
  convenience mirror or local transformation to avoid a dependency.
- Do not hand-edit generated files or implement local smoke paths as completion
  of full tickets.
- Cover happy, unhappy, async/error, security, recovery, logging, and UX/client
  paths when in scope.
- Preserve approved state, recovery, idempotency, no-data-loss/no-leak,
  frontend/client behavior, release, operations, and supply-chain behavior.
- Use precise types, documented public APIs/enums/constants, centralized values,
  and unit-bearing names such as `timeout_in_ms`.
- Keep default verification hermetic; external integrations stay opt-in.
- Run only declared safe commands. Record command output/effect classification
  in the implementation-evidence manifest; do not substitute a similar command.
- Keep docs, examples, generated artifacts, public inventory, and execution
  semantics synced when public surfaces change.
- Record changed files and completion evidence.

## Implementation Completion

Implementation completion means `references/definition-of-done.md` passes: scoped verification,
acceptance happy/unhappy tests, exact `write_scope`, no unapproved fakes,
frontend/client and NFR gates in scope, no generated-file drift, review clean,
and an evidence package ready for independent review and tracking update.

## Lifecycle Handoff

When the ticket is implemented, update lifecycle and return to the plan. The
controller queues `review_pending`; `spec-implementation-review` alone may
accept it. When a wave or partial wave is ready, use
`spec-implementation-review`. If routing is unclear,
use `spec-driven-workflow`.

Read references for full checklists:

- `references/pre-implementation-checks.md`
- `references/implementation-loop.md`
- `references/definition-of-done.md`
- `references/write-scope-discipline.md`
