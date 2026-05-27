---
name: spec-implementation-planner
description: Use when approved specs need end-to-end waves, AFK tickets, parallel-agent plans, dependencies, status tracking, or readiness checks.
---

# Spec Implementation Planner

Turn approved specs into end-to-end waves and concise AFK tickets agents can execute in isolation.

## Hard Gate

Read `specs/.readiness-report.yaml`. Stop unless:

- `status: approved`
- `human_approval.status: approved`
- readiness/gate simulation passed or can be rerun successfully

If blocked, write a spec gap/readiness note. Do not create executable tickets.

## Workflow

1. Verify ticket fields are fillable from approved specs.
2. Create `plans/implementation-plan.md` and `_registry`, `_status`,
   `_dependencies`, `_scope` indexes.
3. Split work into end-to-end waves and AFK tickets.
4. Start with interface/foundation tickets when parallel agents need shared
   contracts; then parallelize backend/client/adapter work.
5. Keep parallel tickets isolated: disjoint writes, frozen contracts, no shared
   generated outputs.
6. Track status and resume state: planned, in_progress, partial, blocked, done,
   skipped.
7. Maintain wave `Implementation Order` plus `depends_on`, `blocked_by`, and
   `unblocks`.
8. Self-audit wave boundaries, parallel assumptions, ticket clarity, fake-work
   risk, and blockers.
9. Run `references/planning-gates.md`, then:
   `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`
   and `node references/check_wave_readiness.mjs <repo-root> <wave-id>`.

## Required Ticket Evidence

Tickets require exact refs/scopes/dependencies/status, ready contracts,
implementation-ready ticket state, empty decisions, decision ledger, contract
traceability, acceptance matrix, and hermetic verification. Keep tickets crisp:
enough context to prevent drift, no pasted specs, no implementation prose.

Return to `spec-architect` when behavior, interface shape, persistence, errors,
security, async semantics, migration, or test strategy is missing.

## Plan Evolution

After a wave or ticket is `done`, keep it historical. New quality gates,
changed specs, or discovered gaps create follow-up remediation or migration
tickets in a later wave instead of rewriting completed ticket bodies.

## Approval Rule

Do not emit tickets that ask implementers to decide, infer, ask humans, read all
specs, or use vague phrasing. No placeholder/fake/mock/stub/no-op work unless
specs require a fixture/fake provider. Plans need `Self-Audit` with assumptions,
evidence, and blockers or `none`.

Use `references/planning-gates.md` for ticket shape, quality checks, public
developer workflow rules, and anti-patterns.
