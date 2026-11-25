---
name: spec-driven-workflow
description: Coordinates the spec-driven lifecycle. Use when choosing the next stage, routing feedback, or resuming work across specs, plans, tickets, and reviews.
---

# Spec Driven Workflow

Select the earliest incomplete stage affecting the requested work. Use
[stage selection and handoffs](references/process-checklist.md) to route it
to the specialist that owns the gate.

| Stage | Owner | Exit evidence |
| --- | --- | --- |
| Author | `spec-architect` | Canonical scope and sources, authority, traceability, and explicit gaps |
| Approve specs | `spec-readiness-review` | Current source digest, completed readiness gates and attributable judge and human approval |
| Plan | `spec-implementation-planner` | A content-bound plan, ticket scopes, dependencies, and contract/test-first order |
| Implement | `spec-ticket-implementation` | One ready ticket, scoped verification and implementation evidence |
| Accept | `spec-implementation-review` | End-to-end and consumer evidence, resolved blockers and independent acceptance |

1. Locate the current spec, report, plan, ticket state, and review findings.
   Start at `specs/index.md`. Follow direct links to the governing
   definitions and exact approval evidence. Use existing canonical sources to
   determine the approved incremental or clean-rebuild strategy.
2. Check the exit evidence for each preceding stage before proceeding.
   Route missing or conflicting requirements, authority, or strategy to
   authoring. Route stale approval, failed checks, or missing judge evidence
   to readiness. Route ticket scope and ordering defects to planning. Route
   implementation defects to the affected ticket.
3. Pause or resume with the proof, blockers, and next command in the owning
   artifact. Self-audit the stage, source revision, evidence, and owner.
   Report any unverified gate and stop the affected downstream work.

A tracked authoring gap can go to readiness for triage. An unresolved
in-scope gap blocks approval and downstream work. Only independent
implementation review can set a ticket or wave to `accepted`.
