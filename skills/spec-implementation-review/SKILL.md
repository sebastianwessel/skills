---
name: spec-implementation-review
description: Independently reviews code and evidence against approved specs and tickets. Use when implemented work needs acceptance, merge review, or release verification.
---

# Spec Implementation Review

Review the selected implemented ticket or scoped set of tickets. Review the
actual change and proof independently of the implementer.

1. **Bind the review.** Verify the approved spec and current ticket with
   `check_specs.mjs <repo-root>/specs --approved` from
   `spec-readiness-review` and `check_plan.mjs <repo-root> --ticket <ticket-id>`
   from `spec-implementation-planner`, both under `scripts/` in their installed
   packages. Read the selected progress, acceptance IDs, and exact implementation
   revision. Verify the reviewed diff and evidence match that revision.
2. **Trace the changed behavior.** Follow success, failure, and recovery
   across affected consumers, interfaces, data, state, and operations.
   Independently check the results with the
   [Review guide](references/review-guide.md). If a shared contract changes,
   inspect the consumers affected beyond the ticket.
3. **Record one decision.** Put findings and proof in
   `plans/reviews/<ticket-id>.md` or an equivalent durable review record. For
   each finding record the requirement or scenario, actual behavior,
   evidence, impact, owner, and required fix. Prioritize blocking findings.
4. **Accept verified work.** With zero blockers, add `review.reviewer`,
   `review.revision` and `review.evidence_ref` to the progress and set its state
   to `accepted`. The revision must match the implementation; the reviewer
   must differ from the implementer. Rerun the selected ticket check before
   declaring acceptance. If the check fails, restore `implemented` and record
   the blocker.

For wave or release acceptance, verify the integrated outcome and affected
consumers on the exact candidate revision using the review guide.

## Stop And Route

Stop acceptance on missing, stale, or contradictory evidence, a failed
scenario, an unreviewed affected consumer, or a condition that requires a
policy decision. Route source gaps to `spec-architect`, stale approvals to
`spec-readiness-review`, and scope or sequencing problems to
`spec-implementation-planner`. Route code findings to the affected ticket
through planner requeue. Review records the finding and does not patch code.
Self-audit any unverified scope, skipped test, and residual risk.
