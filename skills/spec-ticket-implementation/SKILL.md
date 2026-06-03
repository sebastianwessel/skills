---
name: spec-ticket-implementation
description: Implements exactly one approved spec plan ticket in fixed scope. Use when a ready ticket needs code changes with contract/codegen-first, test-first, verification, and no invention.
---

# Spec Ticket Implementation

Implement exactly one approved AFK ticket. Work contract/codegen-first,
test-first, review-before-done, and only through approved interfaces, ticket
scope, and project conventions. Missing behavior is a blocker.

## Preflight

Before editing, load `references/pre-implementation-checks.md`, run spec/plan
gates, record baseline verification, confirm dependencies, and map ticket
refs/scopes, acceptance, contracts/codegen, requirement IDs, paths, NFRs,
frontend/client UX, design/component reuse, release, and supply chain. Stop on
active dependencies; record unrelated baseline failures.

## Stop Conditions

Stop and write a blocker when:

- specs or plan are not approved/ready
- ticket is blocked, HITL, ambiguous, or has open decisions
- scoped specs/ticket lack behavior, contract/codegen disposition,
  API/event/job/stream, persistence, policy, error, failure path, or test
- implementation needs files outside `write_scope`
- interface/type/nullability/async/error/logging semantics are missing or inconsistent
- user-facing/client scope lacks access path, screens, flows, UI states,
  accessibility/responsiveness, design source, component reuse, or custom UI
  rationale
- security/privacy, log-level/redaction, performance, data-integrity, rollback,
  recovery, or manual-intervention semantics are missing
- traceability, production/release, operations, dependency, SBOM/provenance, or
  vulnerability/license expectations are missing in scope
- a mock, fake, stub, placeholder, or test-only production path would be needed
  without explicit ticket/spec approval
- ticket asks the implementer to decide, infer, fill gaps, use judgment, ask
  humans, read all specs, or work "as appropriate"

## Discipline

- Modify only `write_scope`.
- Follow `references/implementation-loop.md`: generators/interfaces first,
  public-interface failing test first, minimal code, review.
- Cover happy, unhappy, async/error, security, recovery, and logging paths.
- For frontend/client work, preserve specified access, flows, screens, states,
  accessibility/responsiveness, design sources, shared styles, and reusable or
  framework components. Do not invent UX/components/styles without approval.
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

Read references for full checklists:

- `references/pre-implementation-checks.md`
- `references/implementation-loop.md`
- `references/definition-of-done.md`
- `references/write-scope-discipline.md`
