---
name: spec-implementation-planner
description: Turns approved specs into waves, dependency indexes, AFK tickets, and status tracking. Use when specs need parallel-agent planning, ticket readiness, blockers/unblocks, or plan gap checks.
---

# Spec Implementation Planner

Turn approved specs into vertical-slice waves and concise AFK tickets agents can
execute in isolation.

## Hard Gate

Read `specs/.readiness-report.yaml`. Stop unless:

- `status: approved`
- `human_approval.status: approved`
- readiness/gate simulation passed or can be rerun successfully
- `language: en` and `semantic_judge_gate.status: passed` when deterministic
  English smoke checks are used

If blocked, write a spec gap/readiness note. Do not create executable tickets.

Plan only from approved specs, ticket rules, contracts, and verification.
Otherwise create a spec/plan gap.

## Workflow

1. Verify all ticket fields are fillable from approved specs.
2. Create `plans/implementation-plan.md` plus `_registry`, `_status`,
   `_dependencies`, and `_scope`.
3. Prefer vertical slices. Each wave ends with a working, testable end-to-end
   increment. If too large for one agent, split isolated tickets that converge
   into the same wave result.
4. Use horizontal waves only for approved foundation/interface work or
   reliability refactors; document rationale, unblocks, tests, and next vertical
   slice.
5. When specs select a contract-first clean rebuild, plan the generated
   foundation next to the old boundary and block handwritten service work until
   mapping metadata, generators, generated tests, compile checks, and drift
   checks pass.
6. Plan contract/codegen foundations before parallel backend/client/adapter
   work; keep parallel writes isolated and sidecar agents read-only unless their
   write scopes are disjoint.
7. Plan test-driven order: derive unit, contract, integration, and E2E tests
   from specs/contracts/acceptance/unhappy paths before business logic tickets
   implement the behavior those tests prove.
8. Map happy/unhappy paths, NFRs, operations, supply chain, frontend/client UX,
   design/component reuse, tests, and coverage into tickets.
9. Track planned, in_progress, partial, blocked, done, skipped; maintain
   `depends_on`, `blocked_by`, and `unblocks`.
10. Self-audit vertical-slice completeness, generation-map coverage, strong
    boundary types, path/NFR/frontend/release ownership, parallel risk,
    fake-work risk, and blockers.
11. Run `references/planning-gates.md`, then
   `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.

## Required Ticket Evidence

Tickets require refs/scopes/dependencies/status, ready contracts/codegen,
empty decisions, traceability, generation-map disposition, strong boundary type
checks, acceptance matrix, frontend/client UX and design/component reuse
evidence or N/A, unit/E2E test ownership, coverage evidence, test-before-logic
implementation order, and hermetic verification. Keep tickets crisp.

Return to `spec-readiness-review` when any behavior, interface, persistence,
error, security/privacy, budget, recovery, unhappy path, async, release,
supply-chain, migration, frontend/client UX, design/component reuse, custom UI
rationale, or test strategy is missing from approved readiness.

## Plan Evolution

After `done`, keep work historical. New gates, spec changes, or gaps create
later remediation/migration tickets. Mark obsolete planned work `skipped`,
partial work `blocked` or `partial`, with `superseded_by` and resume notes.

Ready tickets go to `spec-ticket-implementation`; waves go to
`spec-implementation-review`; unclear routing uses `spec-driven-workflow`.

## Approval Rule

Do not emit tickets that ask implementers to decide, infer, ask humans, read all
specs, hand-write generated shapes, invent frontend UX, or use vague phrasing.
No placeholder/fake/mock/stub/no-op work unless specs require it. Avoid many
horizontal parts with no working E2E result. Plans need `Self-Audit` with
assumptions, vertical-slice/path/NFR/frontend evidence, generator-first evidence,
bounded parallel-agent evidence, and blockers or `none`.

Use `references/planning-gates.md` for ticket shape, quality checks, public
developer workflow rules, and anti-patterns.
