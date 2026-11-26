---
name: spec-architect
description: Writes and revises project specs. Use when defining a business rule, system behavior, component boundary, failure path, decision, or acceptance scenario, or repairing a finding in a spec.
---

# Spec Architect

Give the implementing team an answer to three questions. Who needs this outcome? What happens on success and failure? How will someone verify it?

1. **Find the owner.** Start at `specs/index.md`. Read the request, the governing policy or approved decision, and affected contracts or code. Cite the source. Distinguish the observed implementation and revision from the intended behavior. Surface conflicts to the accountable business or technical owner.
2. **Write the smallest complete change.** Put the rule and its acceptance behavior once on the owning page. A small change can fit entirely on the index. For a new project, cover business goals and rules, solution boundaries, and the flows connecting them. Follow the [project knowledge guide](references/project-knowledge.md) for ownership, decisions, gaps, and acceptance records.
3. **Walk the change.** Start at a real user, API, worker, or operator entrypoint. Follow permissions, state and data effects, failures, recovery and the terminal result. For each material boundary identify its contract, existing implementation or generator, consumers, and verification. Define applicable privacy, security, integrity, performance, operations, rollback and supply-chain requirements. Cite the reason for a material exclusion.
4. **Reconcile affected sources.** Add or update the relevant rows in `specs/acceptance.yaml`. Follow inbound links and check changed claims. Use the [diagrams and publishing guide](references/diagram-and-publishing.md) for a material visual or publication request. For a wording fix, preserve stable scenario IDs and links.
5. **Verify and hand off.** Walk each changed scenario from source to expected proof. Run available contract or schema validators and the draft structure check from `spec-readiness-review`. When revising an approved source, return the readiness report to draft before handing off. Identify what changed, any missing evidence, and each owned gap. Readiness review owns independent review and approval.

Stop on the affected decision when authority, a material outcome, or recovery is unknown. Record the question and continue independent work. Before handing off, distinguish verified requirements from assumptions, reconcile contradictory sources, and test that a reader can find the rule, failure outcome, decision and proof from the index.
