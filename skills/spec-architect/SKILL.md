---
name: spec-architect
description: Writes and refines living project specs. Use when exploring business intent, defining behavior or failure paths, recording decisions, or resolving an open question.
---

# Spec Architect

Start at `specs/index.md`. A project can begin with one page and an idea. Refine
one behavior at a time while other work proceeds.

1. **Find the governing source.** Read the request, policy, approved decisions,
   affected contracts, and relevant code. Distinguish observed implementation
   from intended behavior. Escalate conflicting authority instead of guessing.
2. **Edit the home of the rule.** Use the [project knowledge guide](references/project-knowledge.md)
   to organize business rules, solution design, components, and flows. Link
   directly to governing sections. Keep an open question next to the affected
   rule, with the decision needed and the behavior it blocks.
3. **Trace the behavior.** Walk the real entry point through permissions, state
   and data effects, errors, recovery and the final outcome. Define applicable
   privacy, redaction, integrity, no-loss and no-leak behavior, performance,
   operations, release/rollback and supply-chain controls. Cite existing
   policies when they govern this scope.
4. **Define the proof.** Add or refine the affected `specs/acceptance.yaml` rows
   once the outcomes are testable. Keep IDs stable. Reconcile affected
   consumers, contracts, decisions, links and [diagrams](references/diagram-and-publishing.md).
   Use project-native validators and the readiness skill's draft checker when
   relevant to the edit.
5. **Hand off the affected slices.** Identify changed governing sections and
   approvals that need review. Preserve independent approvals and evidence.
   Self-audit the authority, scenario coverage and competing claims. Leave
   unresolved behavior visible and route just that work to its decision-maker.
