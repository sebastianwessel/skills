---
name: spec-implementation-planner
description: Use when approved specs need end-to-end waves, AFK tickets, parallel-agent plans, isolated work scopes, status tracking, or plan readiness checks.
---

# Spec Implementation Planner

Turn approved specs into end-to-end waves and concise AFK tickets that agents can execute in isolation without clarification.

## Hard Gate

Read `specs/.readiness-report.yaml`. Stop unless:

- `status: approved`
- `human_approval.status: approved`
- readiness/gate simulation passed or can be rerun successfully

If blocked, write a spec gap/readiness note. Do not create executable tickets.

## Workflow

1. Verify every planned ticket field can be filled from approved specs.
2. Create `plans/implementation-plan.md` plus `_registry.yaml`,
   `_status.yaml`, `_dependencies.yaml`, and `_scope.yaml`.
3. Split work into end-to-end dependency waves: `plans/wave_NN_slug/plan.md` and
   `plans/wave_NN_slug/tickets/TICKET-NNN-name.md`.
4. Start with contract/interface foundation tickets when parallel agents need a
   shared boundary, then parallelize backend/client/adapter work against it.
5. Keep parallel tickets isolated: disjoint write scopes, frozen shared
   contracts, no shared generated outputs.
6. Make each ticket concise and AFK: short description, boundaries,
   expectations, acceptance, verification, non-goals, and handoff.
7. Track pause/resume state in `_status.yaml`, `_dependencies.yaml`, and
   `_scope.yaml`: planned, in_progress, partial, blocked, done, skipped.
8. Self-audit the plan: challenge wave boundaries, parallel assumptions,
   ticket clarity, fake-work risk, and pause/resume state; record blockers
   honestly.
9. Run `references/planning-gates.md`, then:
   `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`
   and `node references/check_wave_readiness.mjs <repo-root> <wave-id>`.

## Required Ticket Evidence

Executable tickets require:

- exact `spec_refs`, `read_scope`, `write_scope`, dependencies, and status
- `contract_readiness.status: ready`, required contracts, no missing contracts
- `ticket_readiness.status: implementation_ready`, `open_decisions: []`
- decision ledger proving all material choices came from specs or conventions
- contract traceability for changed interfaces, artifacts, and consumers
- acceptance test matrix mapping each criterion to tests/examples/commands
- hermetic default verification and separate opt-in integration commands

Tickets should be instruction-like and crisp. Include enough context to prevent
drift, but do not paste specs, over-explain rationale, or pre-implement the
solution.

Return to `spec-architect` when behavior, interface shape, persistence, errors,
security, async semantics, migration, or test strategy is missing.

## Plan Evolution

After a wave or ticket is `done`, keep it historical. New quality gates,
changed specs, or discovered gaps create follow-up remediation or migration
tickets in a later wave instead of rewriting completed ticket bodies.

## Approval Rule

Do not emit executable tickets that ask implementers to decide, choose,
determine, design, infer, fill gaps, use judgment, ask humans, read all specs,
or implement behavior "as appropriate", "if needed", or "where possible". Do
not allow placeholder, fake, mock, stub, or no-op implementations unless specs
explicitly require a test fixture or fake provider.

Do not present a plan as ready until the plan-level `Self-Audit` section names
the weakest assumptions, confirms evidence for readiness claims, and lists
remaining blockers or `none`.

Use `references/planning-gates.md` for ticket shape, quality checks, public
developer workflow rules, and anti-patterns.
