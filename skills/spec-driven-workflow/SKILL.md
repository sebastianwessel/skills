---
name: spec-driven-workflow
description: Carries product and engineering changes from a living spec to verified code. Use when turning an idea or requirement into a project spec, changing business or system behavior, planning or completing a delivery slice, resuming work in a spec-driven repo, or checking if a change is ready to ship. Routine edits outside a spec-driven project use the normal development process.
---

# Spec-driven workflow

Take the user's request as the outcome. Handle the workflow files, stage
selection, checks and handoffs yourself. Open `specs/index.md` and relevant
existing evidence, or start with one page if the request needs a new spec.
Use the smallest coherent outcome the user asked for.

1. **Start where evidence is missing.** Read only the relevant references.
   A request for a draft, plan, status or review ends with that deliverable.
   A request to build, fix or finish authorizes the applicable stages within
   that scope. Resume from verified records and advance in the same turn.
2. **Use established decisions.** Check the conversation, governing sources
   and existing review before asking. Apply repository conventions to
   delegated implementation details. When a material decision or required
   approval is missing, prepare what you can and keep independent work
   moving. Present the decision once at the checkpoint, in plain language
   about the affected behavior and its impact.
3. **Arrange independent review.** If available, delegate required independent
   review to a fresh reviewer with the exact scope, sources and evidence.
   Verify the result. Otherwise use existing independent evidence or report
   what review is still needed. Record actual authority and earned states.
4. **Close the loop.** Run the packaged checks and project verification
   yourself. Report the outcome, concrete proof and any user decision
   that still blocks the requested work. Keep spec, code and evidence in sync.

| What needs work | Read |
| --- | --- |
| Define or refine behavior, decisions or open questions | [Writing project knowledge](references/project-knowledge.md) |
| Review defined behavior and record its approval | [Slice records](references/artifact-shapes.md) and [Readiness review](references/readiness-review.md) |
| Plan a slice, prepare a ticket or requeue unfinished work | [Planning and progress](references/planning-gates.md) |
| Implement and verify a ticket | [Execution and evidence](references/execution-evidence.md) |
| Review implementation, integration or release | [Implementation review](references/implementation-review.md) |
| Draw or publish project knowledge | [Diagrams and publishing](references/diagram-and-publishing.md) |

Use a new follow-up wave for a behavior change after acceptance. Preserve the
earlier implementation and reviews as history. Requeue affected unfinished
work against the new inputs.

Before finishing, verify the governing rules, checked paths, applicable risks,
and source and dependency revisions. Surface contradictions, missing proof
and uncertainty. Restrict changes, reviews, and publication to the requested
scope and available authority.
