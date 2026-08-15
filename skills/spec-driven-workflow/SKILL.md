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
   - Verify the spec-manifest digest, decision/policy authority, and current
     lifecycle state before selecting a stage. Select the current stage from
     `references/process-checklist.md`.

2. **Specify**
   - Use `spec-architect` for new specs, spec updates, gap repair, contracts,
     interface definitions, UX, NFRs, release, and supply chain.
   - Gate: canonical specs have source/rationale, a bounded reuse/module
     inventory, approved decision/policy records, no authoring gaps, and are
     ready for readiness review.

3. **Readiness Review**
   - Use `spec-readiness-review` after specs are authored or repaired.
   - Gate: approved readiness is content-bound to the current spec digest,
     human/semantic evidence is attributable, deterministic checks pass, and
     no open implementation decisions remain.

4. **Plan**
   - Use `spec-implementation-planner` after approved specs.
   - Gate: vertical-slice waves or justified horizontal exceptions, digest-pinned
     tickets, ready
     contracts/codegen, generation-map ownership, test-first order,
     dependencies, scopes, bounded parallel work, status tracking.

5. **Implement**
   - Use `spec-ticket-implementation` for exactly one ready ticket.
   - Gate: test/contract artifacts exist before business logic, scoped
     verification passes, implementation evidence and changed symbols are
     recorded, and status advances only to `implemented`/`review_pending`.

6. **Review**
   - Use `spec-implementation-review` after a ticket set, wave, partial wave,
     or before acceptance/merge/release.
   - Gate: end-to-end path matrix and impacted-consumer scope complete,
     findings persisted, no blocking issues; independent review alone may mark
     a ticket or wave `accepted`.

7. **Route Feedback**
   - Implementation defects return to `spec-ticket-implementation`.
   - Dependency/scope/order gaps return to `spec-implementation-planner`.
   - Missing, contradictory, or ambiguous normative requirements return to
     `spec-architect`. Failed, stale, or insufficient readiness evidence returns
     to `spec-readiness-review`; that skill may repair only explicit evidence gaps.

8. **Self-Audit**
   - Verify the selected stage, gate evidence, routed owner, blocked items, and
     skipped checks.
   - Report uncertainty honestly; do not move forward on assumed readiness.

## Stop Conditions

Stop and route backward when specs are unapproved, tickets are not ready,
dependencies are inactive/accepted as required, tests would be written after business logic, feedback
has no owner, or any agent would need to decide behavior, interfaces, UX,
security, recovery, release, tests, acceptance, generation mapping, clean-rebuild
  strategy, closed-boundary type semantics, decision authority, or a required
  reuse/module boundary.

## Reference

- `references/process-checklist.md`: ordered checklist, gates, handoffs, and
  pause/resume rules.
