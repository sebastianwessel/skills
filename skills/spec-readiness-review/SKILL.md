---
name: spec-readiness-review
description: Reviews and verifies approval of a defined spec slice. Use when checking whether selected behavior and its governing sources are ready to implement or need decisions.
---

# Spec Readiness Review

Review the selected outcome and anything it depends on. A living spec may
contain other unanswered questions.

1. **Define the review boundary.** From `specs/index.md`, select the acceptance
   scenarios and find their exact governing sections, contracts and decisions.
   Use the [record and commands](references/artifact-shapes.md) to compute the
   slice digest and list its inputs. Compare the list with the real
   dependencies. Add sources the checker cannot infer.
2. **Challenge the behavior.** An independent reviewer follows the
   [review guide](references/review-guide.md). Trace success, errors and
   recovery across applicable boundaries. Check authority and proof, and look
   for missing scenarios, contradictions, unknowns and stale visuals. Validate
   cited contracts with project tools. Return affected questions to the
   governing source.
3. **Capture the decision.** Once the scope is determinate, collect review
   evidence and explicit human approval of the same digest. Open the evidence,
   verify who decided and what they agreed to, and then record the references.
   Keep the slice unapproved while evidence or material behavior is missing.
4. **Check the handoff.** Run the named `--approved` check. Give planning the
   slice ID, included scenarios and any exclusions affecting neighboring work.

Self-audit scope and source authority, including shared rules, unresolved
reliability risks and the actual proof. A checker result confirms structure and
freshness. The review determines whether the behavior is complete.
