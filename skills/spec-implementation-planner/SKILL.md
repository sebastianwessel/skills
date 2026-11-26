---
name: spec-implementation-planner
description: Turns an approved spec slice into sized, dependency-ordered tickets. Use when defining, splitting, requeueing, or preparing tickets for execution.
---

# Spec Implementation Planner

1. **Select the next verifiable outcome.** Read the relevant section from
   `specs/index.md` and its acceptance rows. Verify the named slice with
   `node <readiness>/scripts/check_specs.mjs specs --approved <slice-id>`.
   Planning for execution waits on that approval. Keep other draft work in the
   spec until it needs a ticket.
2. **Define bounded work.** Use the [ticket and progress format](references/planning-gates.md).
   Start with one ticket. Split when outcomes, prerequisites or write scopes
   genuinely differ. Group related tickets into a wave and add a short wave
   plan when coordination needs it. Size XS–XL by relative complexity, scope
   and uncertainty.
3. **Make verification executable.** Name the entry point, existing patterns,
   test-first steps, commands, and expected results. Put contract generation
   and drift checks before dependent work. Cover each scoped failure, recovery,
   security, redaction, integrity, performance, accessibility, operational,
   release and supply-chain obligation where it applies.
4. **Check and release the ticket.** Run
   `node <planner>/scripts/check_plan.mjs <repo-root> --ticket <ticket-id>`.
   Mark it `ready` when the handoff holds up and the exact prerequisites are
   accepted. Store the digests and dependency revisions in progress and check
   the resulting record. For changed inputs, assess and requeue unfinished
   work. For changed behavior after acceptance, start a follow-up wave with
   new tickets against the implemented baseline. Preserve earlier evidence.

Self-audit that every scenario in the slice has a bounded path to proof, the
proposed order can run, and no ticket needs to invent behavior. Send missing
decisions to authoring and stale governing approval to readiness review.
