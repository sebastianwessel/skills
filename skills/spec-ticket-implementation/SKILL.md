---
name: spec-ticket-implementation
description: Implements one ready ticket against approved project specs. Use when a specific ticket can be executed within its write scope with test-first verification.
---

# Spec Ticket Implementation

Implement the selected ticket. Work from its governing spec and acceptance
scenarios. Keep changes within `write_scope`.

1. **Preflight.** Run both checks from the installed packages before editing:

   ```text
   node <spec-readiness-review>/scripts/check_specs.mjs <repo-root>/specs --approved
   node <spec-implementation-planner>/scripts/check_plan.mjs <repo-root> --ticket <ticket-id>
   ```

   Read the ticket and its progress. Start from current `ready` or resume
   your current `in_progress` record. Verify accepted dependencies, exact
   scope, acceptance, safe verification commands, and the baseline. Claim
   `in_progress` through the controller or project lock. Rerun the ticket
   check after claiming and before editing.
2. **Prove the behavior.** Generate affected artifacts from approved source
   contracts. Write or select tests that exercise the approved success and
   failure paths before changing behavior. Record the failing proof or why
   existing evidence already covers the change.
3. **Implement and verify.** Follow approved interfaces, policies, and
   types. Use existing modules when the semantics match. Verify the actual
   affected paths, including security, redaction, data integrity, recovery,
   performance, and operational effects in scope. Refresh affected product
   docs and generated assets. Use local project-defined checks. Run external
   verification only with explicit authorization and scoped inputs.
4. **Hand off.** Check the actual diff against the write scope. Recheck the
   approved specs and selected ticket. Record test-first evidence, the
   implementation revision, exact changed files, and proof per acceptance
   ID using [Execution evidence](references/execution-evidence.md). Mark
   `implemented` only after verification passes. Independent review owns
   `accepted`.

## Stop Conditions

Stop on stale inputs, missing behavior, an unsafe command, a dependency that
is no longer accepted, an out-of-scope change, or incomplete verification.
Persist the reason and next action as blocked or partial. Route semantic gaps
to `spec-architect` and scope, readiness for execution, or requeue decisions
to `spec-implementation-planner`. Self-audit any skipped check and residual
risk before handoff.
