---
name: spec-implementation-planner
description: Turns approved specs into waves, dependency indexes, AFK tickets, and status tracking. Use when specs need parallel-agent planning, ticket readiness, blockers/unblocks, or plan gap checks.
---

# Spec Implementation Planner

Turn approved specs into end-to-end waves and concise AFK tickets agents can execute in isolation.

## Hard Gate

Read `specs/.readiness-report.yaml`. Stop unless:

- `status: approved`
- `human_approval.status: approved`
- readiness/gate simulation passed or can be rerun successfully
- `language: en` and `semantic_judge_gate.status: passed` when deterministic
  English smoke checks are used

If blocked, write a spec gap/readiness note. Do not create executable tickets.

Generic planning is allowed only through approved specs, ticket rules,
contracts, and scoped verification. Otherwise create a spec/plan gap.

## Workflow

1. Verify ticket fields are fillable from approved specs.
2. Create `plans/implementation-plan.md` and `_registry`, `_status`,
   `_dependencies`, `_scope` indexes.
3. Split work into end-to-end waves and AFK tickets.
4. Start with interface/foundation tickets that wire approved contract/IDL/schema
   sources, deterministic generators/tools, and generated artifacts; then
   parallelize backend/client/adapter work against those outputs.
5. Keep parallel tickets isolated: disjoint writes, frozen contracts, no shared
   generated outputs.
6. Map happy/unhappy paths plus security, privacy, observability, performance,
   data-integrity, recovery, production/release, and supply-chain specs into
   ticket acceptance and verification.
7. Track status and resume state: planned, in_progress, partial, blocked, done,
   skipped.
8. Maintain wave `Implementation Order` plus `depends_on`, `blocked_by`, and
   `unblocks`.
9. Self-audit wave boundaries, path coverage, NFR ownership, parallel
   assumptions, ticket clarity, release/supply-chain ownership, fake-work risk,
   and blockers.
10. When specs change, update indexes/impact/follow-ups without rewriting done
    tickets.
11. Run `references/planning-gates.md`, then
    `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.

## Required Ticket Evidence

Tickets require exact refs/scopes/dependencies/status, ready contracts,
generated-contract evidence, implementation-ready ticket state, empty
decisions, decision ledger, contract and requirement traceability, acceptance
matrix, and hermetic verification. Keep tickets crisp: enough context to
prevent drift, no pasted specs, no implementation prose.

Return to `spec-architect` when behavior, interface shape, persistence, errors,
security/privacy, logging/redaction, performance budgets, data integrity,
recovery/self-healing, unhappy paths, async semantics, production readiness,
release/rollback, supply-chain integrity, migration, or test strategy is
missing.

## Plan Evolution

After a wave or ticket is `done`, keep it historical. New gates, spec changes,
or gaps create later remediation/migration tickets. Mark obsolete planned work
`skipped`, partial work `blocked` or `partial`, and record `superseded_by`,
affected specs, and resume notes.

## Approval Rule

Do not emit tickets that ask implementers to decide, infer, ask humans, read all
specs, hand-write generated contract shapes, or use vague phrasing. No
placeholder/fake/mock/stub/no-op work unless specs require a fixture/fake
provider. Plans need `Self-Audit` with assumptions, path/NFR evidence, and
blockers or `none`.

Use `references/planning-gates.md` for ticket shape, quality checks, public
developer workflow rules, and anti-patterns.
