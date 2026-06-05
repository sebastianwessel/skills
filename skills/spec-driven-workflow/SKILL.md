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
   - Decide whether the work is an incremental patch/refactor or a
     contract-first clean rebuild by boundary. If compatibility debt,
     overlapping contract surfaces, stale mirrors, or generator opportunity
     dominate, route to specs/planning before implementation.
   - Select the current stage from `references/process-checklist.md`.

2. **Specify**
   - Use `spec-architect` for new specs, spec updates, gap repair, contracts,
     interface definitions, UX, NFRs, release, and supply chain.
   - Gate: canonical specs have source/rationale, no obvious authoring gaps,
     and are ready for readiness review.

3. **Readiness Review**
   - Use `spec-readiness-review` after specs are authored or repaired.
   - Gate: approved readiness, human approval, semantic judge pass,
     deterministic checks pass, no open implementation decisions.

4. **Plan**
   - Use `spec-implementation-planner` after approved specs.
   - Gate: vertical-slice waves or justified horizontal exceptions, ready
     contracts/codegen, generation-map ownership, test-first order,
     dependencies, scopes, bounded parallel work, status tracking.

5. **Implement**
   - Use `spec-ticket-implementation` for exactly one ready ticket.
   - Gate: test/contract artifacts exist before business logic, scoped
   verification passes, status and changed files are recorded.

6. **Review**
   - Use `spec-implementation-review` after a ticket set, wave, partial wave,
     or before acceptance/merge/release.
   - Gate: end-to-end path matrix complete, findings persisted, no blocking
     issues.

7. **Route Feedback**
   - Implementation defects return to `spec-ticket-implementation`.
   - Dependency/scope/order gaps return to `spec-implementation-planner`.
   - Missing, contradictory, or ambiguous requirements return to
     `spec-readiness-review`, which may repair explicit spec gaps or route
     broad authoring work to `spec-architect`.

8. **Self-Audit**
   - Verify the selected stage, gate evidence, routed owner, blocked items, and
     skipped checks.
   - Report uncertainty honestly; do not move forward on assumed readiness.

## Stop Conditions

Stop and route backward when specs are unapproved, tickets are not ready,
dependencies are active, tests would be written after business logic, feedback
has no owner, or any agent would need to decide behavior, interfaces, UX,
security, recovery, release, tests, acceptance, generation mapping, clean-rebuild
strategy, or closed-boundary type semantics.

## Reference

- `references/process-checklist.md`: ordered checklist, gates, handoffs, and
  pause/resume rules.
