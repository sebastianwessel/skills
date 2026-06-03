---
name: spec-driven-workflow
description: Coordinates the spec-driven lifecycle. Use when choosing order across specs, plans, tickets, reviews, feedback routing, or pause/resume.
---

# Spec Driven Workflow

Use this skill to choose the next spec-driven skill and enforce lifecycle order.
It orchestrates; it does not replace the specialized skills.

## Core Rule

Move forward only when the current gate is complete. If a gate fails, route the
work backward to the owning skill instead of letting agents decide or invent.

## Workflow

1. **Orient**
   - Identify current artifacts: `specs/`, `.readiness-report.yaml`, `plans/`,
     ticket status, implementation diff, review findings.
   - Select the current stage from `references/process-checklist.md`.

2. **Specify**
   - Use `spec-architect` for new specs, spec updates, gap repair, contracts,
     interface definitions, UX, NFRs, release, supply chain, and approval.
   - Gate: approved readiness, human approval, semantic judge pass, no open
     implementation decisions.

3. **Plan**
   - Use `spec-implementation-planner` after approved specs.
   - Gate: vertical-slice waves or justified horizontal exceptions, ready
     contracts/codegen, test-first order, dependencies, scopes, status tracking.

4. **Implement**
   - Use `spec-ticket-implementation` for exactly one ready ticket.
   - Gate: test/contract artifacts exist before business logic, scoped
     verification passes, status and changed files are recorded.

5. **Review**
   - Use `spec-implementation-review` after a ticket set, wave, partial wave,
     or before acceptance/merge/release.
   - Gate: end-to-end path matrix complete, findings persisted, no blocking
     issues.

6. **Route Feedback**
   - Implementation defects return to `spec-ticket-implementation`.
   - Dependency/scope/order gaps return to `spec-implementation-planner`.
   - Missing, contradictory, or ambiguous requirements return to
     `spec-architect`.

## Stop Conditions

Stop and route backward when specs are unapproved, tickets are not ready,
dependencies are active, tests would be written after business logic, feedback
has no owner, or any agent would need to decide behavior, interfaces, UX,
security, recovery, release, tests, or acceptance.

## Reference

- `references/process-checklist.md`: ordered checklist, gates, handoffs, and
  pause/resume rules.
