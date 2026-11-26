---
name: spec-implementation-review
description: Independently reviews implemented tickets against approved slices. Use when accepting a change or checking integrated behavior for a wave or release.
---

# Spec Implementation Review

Review the implemented ticket and the actual proof independently of the
implementer.

1. **Bind scope and revision.** Run
   `node <planner>/scripts/check_plan.mjs <repo-root> --ticket <ticket-id>`.
   Read the governing sections and progress. Inspect the real diff,
   acceptance outcomes and check results at the recorded implementation revision.
2. **Walk the change.** Use the [review guide](references/review-guide.md) to
   trace success, failures and recovery through the real entry point, state
   changes and affected consumers. Inspect consumers of a changed shared
   contract, including downstream users outside the implementation ticket.
3. **Record the decision.** Use a durable PR review or one local
   `plans/reviews/<ticket-id>.md`. Link the scope and proof. Each blocking
   finding explains the violated rule, actual outcome, impact and required fix.
   Check integrated behavior on the exact candidate when reviewing a wave or
   release.
4. **Accept with evidence.** With blockers cleared, set the progress state to
   `accepted` and record the reviewer, reviewed revision and evidence link.
   Rerun the selected ticket check. If it fails, withdraw acceptance and route
   the finding.

Self-audit unverified claims, skipped tests and residual risks. Route behavior
gaps to authoring, stale approvals to readiness review, and scope or
unfinished implementation repair to the planner for requeue. Later changes
to accepted work need a follow-up ticket and their own proof.
