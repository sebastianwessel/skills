---
name: spec-implementation-review
description: Reviews implementation waves against approved specs and tickets. Use when completed or partial work needs acceptance, merge, release, or handoff review with path tracing and persisted findings.
---

# Spec Implementation Review

Review a wave/plan implementation against approved specs. Do not fix code.
Persist findings and per-ticket feedback for implementation agents.

## Inputs

Read only the requested wave/plan scope:

- `specs/.readiness-report.yaml` and scoped specs
- `plans/implementation-plan.md`, indexes, wave plan, tickets
- changed files/diff, verification output, prior review findings

Run available gates before semantic review:

- `node skills/spec-architect/scripts/check_specs.mjs specs`
- `node skills/spec-implementation-planner/references/check_plan.mjs .`

Stop if specs or plan are not approved, required evidence is missing, or the
review scope cannot be identified.

## Review Workflow

1. Confirm scope, ticket status, changed files, verification evidence, and spec refs.
2. Build a solution path matrix using `references/path-tracing.md`.
3. Follow every relevant path end to end: request/input, validation, auth,
   routing, frontend/client access and states, design/component reuse, interface
   boundaries, domain logic, persistence, async work, external boundaries,
   generated artifacts, observability, response/output, cleanup, recovery.
4. Apply `references/review-gates.md` for spec drift, interfaces, tests,
   requirements traceability, security, performance, operations, supply chain,
   robustness, maintainability, docs, and false work.
5. Persist findings with `references/findings-format.md`.
6. Self-audit honestly: unchecked paths, skipped commands, assumptions, weak
   evidence, and residual risk.

## Blocking Findings

Reject the wave/plan when any blocking issue exists:

- spec drift in behavior, interfaces, types/nullability, async, errors, logging,
  frontend/client UX, design/component reuse, persistence, security,
  performance, recovery, release, supply chain, or public contracts
- missing, stale, hand-edited, or bypassed generated contract outputs when
  approved contract/IDL/schema sources and deterministic tooling exist
- partial local slice presented as completion of a full-slice ticket
- missing source requirement traceability from specs to tickets, code, tests,
  and acceptance evidence
- missing evidence that tests were derived from specs/contracts/acceptance and
  created or generated before the business logic they prove
- missing, untested, or incorrect success/failure/retry/timeout/cancel/rollback/
  idempotency/recovery paths
- missing acceptance, cross-layer contract, unhappy-path, or end-to-end tests
- missing reachable frontend/client access, UI state, accessibility/
  responsiveness, design/component reuse, or approved custom UI rationale
- unapproved mocks, fakes, stubs, placeholders, no-ops, demo paths, or hidden flags
- material security, privacy, data-loss, isolation, performance, resource-leak,
  undefined-state, concurrency, release/rollback, supply-chain,
  maintainability, or public-contract risk
- composition file gained unrelated provider, persistence, security/session,
  tenant/workspace/invitation, or domain logic without approval
- feedback cannot route to a ticket, planner remediation, or spec gap
- stale, duplicate, or contradictory spec/plan text would mislead later agents

## Persisted Output

Write `plans/reviews/<wave-or-plan-id>/<review-id>/`:

- `review.md`: decision, path coverage, commands, self-audit
- `findings.yaml`: structured findings
- `agent-feedback/<ticket-id>.md`: implementation-agent feedback for every
  ticket with findings

Use `references/findings-format.md` for required fields and status handoff. Do
not rely on chat-only feedback.

## Lifecycle Handoff

Route implementation findings to `spec-ticket-implementation`, plan gaps to
`spec-implementation-planner`, and spec gaps to `spec-architect`. If routing is
unclear, use `spec-driven-workflow`.

## Decision

- `pass`: no blocking findings, commands pass, path matrix complete
- `needs_fixes`: implementation issues are actionable within tickets
- `blocked_spec_gap`: specs are missing, unclear, or contradictory
- `blocked_plan_gap`: plan/tickets/scopes/dependencies cannot route fixes
- `partial`: review was intentionally scoped and cannot accept the whole wave

Return findings first, ordered by severity. Advisory cleanup must not hide
blocking correctness, security, spec, test, or path-coverage issues.
