---
name: spec-ticket-implementation
description: Implements one ready ticket against its approved spec slice. Use when a bounded ticket needs scoped changes and test-first verification.
---

# Spec Ticket Implementation

Implement the selected ticket within its `write_scope`.

1. **Verify and claim.** Run
   `node <planner>/scripts/check_plan.mjs <repo-root> --ticket <ticket-id>`.
   Read the printed governing sources, the ticket and its progress. Start from
   current `ready` or resume your own authorized claim. Check dependencies,
   baseline and command safety. Claim `in_progress` through the controller or
   project lock, then check again before editing.
2. **Prove the expected behavior.** Use project-native generation for affected
   contracts. Add or select tests for approved success, error and recovery
   paths before changing behavior. Capture the failing assertion or cite
   existing proof and explain why it applies.
3. **Implement.** Follow approved interfaces and existing patterns. Verify
   affected consumers, privacy, redaction, data integrity, recovery,
   performance and operational controls. Update affected docs and generated
   assets. Keep verification within authorized inputs and services.
4. **Hand off.** Check the actual diff, results and [execution evidence](references/execution-evidence.md).
   Record `implemented` with proof per scenario and rerun the selected
   ticket check. Independent review makes the acceptance decision.

Stop affected work on stale inputs, missing behavior, unsafe commands,
out-of-scope changes or incomplete verification. Record `blocked` with the
reason, any work already done and what can unblock it. Route governing
behavior to authoring, stale slice approval to readiness, and scope or requeue
to planning. Self-audit any assumption, skipped check and unverified risk.
