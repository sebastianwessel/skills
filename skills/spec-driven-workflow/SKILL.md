---
name: spec-driven-workflow
description: Routes work through project knowledge, approval, planning, implementation, and review. Use when starting a spec-driven project, resuming work, or choosing which stage owns a blocker.
---

# Spec Driven Workflow

Start at `specs/index.md`. Select the earliest stage whose evidence is missing
for the requested work. Load that skill and only the references it needs.

| Situation | Use | Evidence before moving forward |
| --- | --- | --- |
| Project intent or governing behavior is missing, unclear, or changing | `spec-architect` | Owning pages, source evidence, and acceptance scenarios |
| Specs are complete but lack current approval | `spec-readiness-review` | Human and judge evidence for the current spec digest |
| Approved scenarios need executable work, or a ticket needs a new scope or prerequisites | `spec-implementation-planner` | Scoped tickets and a current plan manifest |
| One ticket is ready and its dependencies are accepted | `spec-ticket-implementation` | Verified scoped change and current implementation evidence |
| One or more tickets are implemented | `spec-implementation-review` | Independent acceptance or a precise finding routed to its owner |

1. Verify the spec digest, plan, and current ticket progress at the selected
   stage. A work item without a progress record is planned. Resume from the
   verified evidence in `plans/progress/<ticket-id>.json`.
2. Route missing intent and contradictions to authoring, approval problems
   to readiness, and ticket scope or dependency problems to planning. Route
   code failures back to the ticket through an authorized requeue. Only
   independent review accepts implementation.
3. Stop affected downstream work on an unresolved blocker. Persist the
   finding, evidence, owner, and next action in its owning record. Self-audit
   the selected stage, source revision, dependencies, and unverified claims.
