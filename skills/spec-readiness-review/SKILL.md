---
name: spec-readiness-review
description: Reviews a spec bundle and verifies approval for planning. Use when checking a draft, resolving review findings against revised sources, or deciding whether planning can begin.
---

# Spec Readiness Review

Review the entire canonical bundle rooted at `specs/index.md`. Return a decision with the source digest, findings and supporting evidence. Normative edits go to `spec-architect`.

1. **Inspect the candidate.** Use the [record and command reference](references/artifact-shapes.md) for `acceptance.yaml`, the manifest, and the report. Run the default spec checker. Check cited contracts using the project’s own schema, code generation or validation tools. Capture commands and outcomes.
2. **Trace each scenario.** Apply the [review guide](references/review-guide.md). Follow the governing source from the index. Verify that a reader can find the business rule, boundary, failure outcome and decision that authorize it. Compare behavior to the source of authority and verify that the proposed proof could catch an incorrect implementation. Identify missing scenarios as well as defective ones.
3. **Route findings.** Record the affected source or scenario, evidence, consequence, owner and required decision or proof. Mark the report `blocked` for unresolved blockers. Return governing-source repairs to authoring. Resume against the revised bundle.
4. **Collect approval.** Generate the manifest on the final candidate. An independent reviewer or judge reviews that digest and records inspected sources, applicable risks, verification results, exclusions and outstanding findings. After blockers are cleared, record `needs_human_review` until the accountable human approves the entire bundle at that digest. Verify both references and the scope they actually authorize.
5. **Check the handoff.** Record `approved` only with both proofs. Run the checker with `--approved`. If it fails, immediately restore `blocked`, retain the diagnostic in the report, and route the failure to its owner. Hand off the passing digest, report path and scenario set to planning. Every change to canonical bytes requires a fresh manifest and review.

Before approval, reconcile uncertainty, contradictory claims, out-of-scope assumptions and missing checks. Stop on stale evidence, an untested material failure or recovery path, or an unavailable required check. State the exact blocker and who can resolve it.
