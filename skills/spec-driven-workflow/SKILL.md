---
name: spec-driven-workflow
description: Finds the next step for a change in a living spec. Use when starting or resuming spec-driven work, handling a refinement, or routing a blocker.
---

# Spec Driven Workflow

Start at `specs/index.md` and choose one outcome to move forward. Different
parts of the same project can be explored, approved, built and refined in
parallel. Load the skill for the missing evidence.

| Situation | Use | Evidence |
| --- | --- | --- |
| Behavior or authority is unknown or changing | `spec-architect` | Governing section, open questions and testable outcomes |
| A defined slice needs current approval | `spec-readiness-review` | Human approval and independent review of the slice digest |
| An approved slice needs work organized or requeued | `spec-implementation-planner` | Bounded tickets with accepted prerequisites before execution |
| One ticket is ready | `spec-ticket-implementation` | Scoped changes and verification at an exact revision |
| Work is implemented | `spec-implementation-review` | Independent acceptance or an evidenced finding |

Read the current ticket progress, when it exists, and use the planner's
selected ticket check before acting on an approved handoff. A missing progress
record means planned. When governing behavior changes, reapprove the affected slice. Requeue
unfinished tickets that depend on it. If the work was already accepted,
start a follow-up wave against the current code and keep the prior tickets
and reviews as history. Keep independent work moving. Record a blocker near
its cause with the next decision or action.

Before handing off, verify authority, selected scope, dependency revisions and
available proof. Name any uncertainty so the next agent can resume without
assuming a decision was made.
