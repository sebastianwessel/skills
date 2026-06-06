---
name: spec-implementation-planner
description: Turns approved specs into waves, dependency indexes, AFK tickets, and status tracking. Use when specs need parallel-agent planning, ticket readiness, blockers/unblocks, or plan gap checks.
---

# Spec Implementation Planner

Turn approved specs into vertical-slice waves and implementation-ready AFK
tickets agents can execute in isolation without guessing.

## Hard Gate

Read `specs/.readiness-report.yaml`. Stop unless:

- `status: approved`
- `human_approval.status: approved`
- readiness/gate simulation passed or can be rerun successfully
- `checklist_walk_gate.status: passed` with zero blocking findings
- `end_to_end_definition_gate.status: passed`
- `current_dependency_research_gate.status: passed`
- `language: en` and `semantic_judge_gate.status: passed` when deterministic
  English smoke checks are used

If blocked, write a spec gap/readiness note. Do not create executable tickets.

Plan only from approved specs, ticket rules, contracts, and verification.
Otherwise create a spec/plan gap.

## Workflow

1. Verify all ticket fields and action-plan steps are fillable from approved
   specs.
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
8. Map capability inventory rows and end-to-end definition chains into tickets:
   actor/consumer, entrypoint/reachability, contracts, data lifecycle, states,
   side effects, permissions, recovery, observability, acceptance,
   verification, NFRs, operations, supply chain, frontend/client UX,
   design/component reuse, tests, and coverage.
9. Split tickets until each active ticket has one bounded deliverable, exact
   write scope, exact prerequisite artifacts, and a numbered action plan with
   files/commands/proof for every step. Use phase-gated exceptions only when
   the approved work is atomic and each phase blocks on explicit evidence.
10. Require ticket sections for spec-drift controls, generator-first artifacts,
   TDD including unhappy paths, strict typing, modular domain structure,
   reuse/no-duplication, and review against ticket plus specs. Domain structure
   and dependency choices must follow the approved readiness evidence.
11. Track planned, in_progress, partial, blocked, done, skipped; maintain
   `depends_on`, `blocked_by`, and `unblocks`.
12. Self-audit vertical-slice completeness, generation-map coverage, strong
    boundary types, path/NFR/frontend/release ownership, parallel risk,
    fake-work risk, and blockers.
13. Run `references/planning-gates.md`, then
   `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.

## Required Ticket Evidence

Tickets require refs/scopes/dependencies/status, ready contracts/codegen,
empty decisions, traceability, generation-map disposition, strong boundary type
checks, capability-inventory refs, end-to-end definition chain refs,
acceptance matrix, frontend/client UX and design/component reuse evidence or
N/A, unit/E2E test ownership, coverage evidence, test-before-logic
implementation order, a numbered action plan with exact files, commands,
prerequisite proof, expected test failures/passes, spec-drift review,
generator-first artifact generation, strict typing proof, modular domain/topic
placement from specs, reuse/no-duplication proof, and hermetic verification.
Keep tickets crisp but executable.

Return to `spec-readiness-review` when any behavior, interface, persistence,
error, security/privacy, budget, recovery, unhappy path, async, release,
supply-chain, migration, frontend/client UX, design/component reuse, custom UI
rationale, capability inventory, data lifecycle, state transition, access path,
final state, or test strategy is missing from approved readiness.

## Plan Evolution

After `done`, keep work historical. New gates, spec changes, or gaps create
later remediation/migration tickets. Mark obsolete planned work `skipped`,
partial work `blocked` or `partial`, with `superseded_by` and resume notes.

Ready tickets go to `spec-ticket-implementation`; waves go to
`spec-implementation-review`; unclear routing uses `spec-driven-workflow`.

## Approval Rule

Do not emit tickets that ask implementers to decide, infer, ask humans, read all
specs, hand-write generated shapes, invent frontend UX, duplicate existing
logic, weaken types, flatten domain structure, choose dependency versions, or
turn vague implementation prose into code. No placeholder/fake/mock/stub/no-op
work unless specs require it. Avoid many horizontal parts with no working E2E
result. Plans need `Self-Audit` with assumptions,
vertical-slice/path/NFR/frontend evidence, readiness research evidence,
generator-first evidence, strict typing/reuse/domain-structure evidence, bounded
parallel-agent evidence, broad-ticket split evidence, and blockers or `none`.

Use `references/planning-gates.md` for ticket shape, quality checks, public
developer workflow rules, and anti-patterns.
