---
name: spec-architect
description: Creates and updates canonical project knowledge and implementation specs. Use when defining business rules, solution design, components, flows, ADRs, gaps, interfaces, UX, reliability, or release requirements.
---

# Spec Architect

Own canonical project knowledge and requirements. Use Create for a new
spec set, Update for a changed definition, and Fix Gap for a specific finding.
Send the result to `spec-readiness-review` for approval before planning.

## Workflow

1. **Find authority and scope.** Trace requested behavior to sources and
   rationale. Inspect affected repository sources read-only. When reuse or
   boundaries change, record the inspected revision, symbols, and consumers.
   Apply [Decision and reuse controls](references/decision-and-reuse-controls.md) for
   policy, applicability, and decision authority. Record a gap when a choice
   lacks authority and continue only with independent authoring work.
2. **Find or establish the owning page.** Apply
   [Project knowledge](references/project-knowledge.md) to establish and
   maintain the canonical spec set.
   Update the owner and dependents whose semantics, coverage, or links change.
   If an edit affects only wording, confirm existing behavior, traceability,
   and visuals remain accurate. Edit the owner, then go to step 7.
3. **Define observable behavior.** Update affected parts of
   `02-capabilities/capability-inventory.md`, `03-flows/e2e-coverage.md`, and
   `00-traceability.yaml`. Trace requirements
   through capability and path to acceptance by stable IDs. Cover end-to-end
   success, errors, and recovery for users, admins, API/CLI/SDK consumers,
   integrations, workers, data lifecycle, and operators. Record scoped N/A.
4. **Define boundaries.** Specify module ownership, public entrypoints,
   dependency directions, and a project-native architecture check or evidenced
   N/A. Set domain/topic layout, generated outputs, migrations and runbooks.
   Use current primary docs or release metadata for relevant dependencies.
   Define source contracts, strong boundary types, nullability, protocol,
   async and concurrency semantics. Identify incremental or clean-rebuild
   strategy, compatibility and migration needs, generation mapping across
   contract surfaces, and representation ownership in
   `03-contracts/representation-catalog.yaml` when in scope.
5. **Walk the risk and verification topics.** Use **Checklist selection** in the
   installed `spec-readiness-review` entry point. Load the selected files. Cover UX/client access and reuse,
   data classification, retention and deletion/export, security/privacy,
   log redaction, integrity and recovery, performance/resilience budgets,
   operations, production readiness, rollback, and supply chain.
6. **Reconcile affected evidence.** Sync canonical rules, ADRs, gap
   dispositions, and traceability. Apply
   [Diagrams and publishing](references/diagram-and-publishing.md) when a
   visual helps comprehension or publication is requested. Update visuals that
   depict changed behavior; keep stable navigation and history concise.
7. **Audit and hand off.** Check exact sources, unsupported assumptions,
   unresolved contradictions, coverage, and evidence for N/A. Generate the
   canonical manifest with the packaged `generate_spec_manifest.mjs` helper
   from `spec-readiness-review` after source edits. Hand off the digest,
   affected refs, and unresolved gaps. Approval belongs to readiness review.

## Stop Conditions

Block affected behavior when a source is missing, conflicting, or requires a
choice outside approved authority. Keep the question and its owner visible in
the applicable gap record. If a required companion skill or tool is missing,
report which check remains pending. Reserve implementation and planning for
their owning stages.
