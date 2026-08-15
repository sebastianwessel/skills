---
name: spec-architect
description: Creates and updates canonical implementation specs. Use when specs need authoring, evolution, source-of-truth repair, contracts, UX, NFRs, release, or supply-chain definition before readiness review.
---

# Spec Architect

## Standard

Create canonical specs that a separate readiness review can approve for
planning. Do not approve your own specs.

## Invariants

- Define precise, concise, non-contradictory behavior—not implementation code.
- Maintain end-to-end capability/contract/acceptance traceability; scoped N/A
  and update impact are required.
- Use evidence-backed standards, current primary sources, and machine-readable
  contracts; only readiness may approve.
- Apply `references/decision-and-reuse-controls.md` before defining target
  structures, representations, modules, shared assets, or autonomous choices.

## Workflow

1. Select mode: `Create`, `Update`, or `Fix Gap`.
2. Normalize requirements and source/rationale.
3. Perform read-only repository discovery; create/update the reuse and module
   boundary inventory with the inspected revision and public symbols.
4. Create/update decision, policy-profile, and applicability records. Block on
   a normative choice without an approved authority.
5. Create or update `02-capabilities/capability-inventory.md` and
   `00-traceability.yaml`; enumerate user-facing, admin/support, API/CLI/SDK,
   integration/webhook, worker/job, data lifecycle, and operational
   capabilities or N/A categories. Bind each requirement, capability, path,
   and acceptance criterion by stable reciprocal IDs.
6. Update layered specs and complete E2E success/failure/recovery paths across
   frontends, clients, consumers, integrations, or N/A.
7. Define frontend/client access, UX/design reuse, or N/A.
8. Select standards-first protocols, formats, interfaces, architecture.
9. Research current primary docs/package metadata for relevant dependencies and
   third-party solutions; define versions, alternatives considered, rationale,
   and doc refs.
10. Define best-fit contract/IDL/schema sources for in-scope interfaces; else
   record N/A evidence.
11. For overlapping contract surfaces, add a machine-readable generation map
   before readiness review or planning.
12. Create/update `03-contracts/representation-catalog.yaml` for each in-scope
   shape; link capability, contract, generation, mapping, or evidenced N/A refs.
13. Freeze interfaces, strong boundary types, type/nullability, protocol
   semantics.
14. Define module contracts: ownership, responsibilities, public APIs,
   allowed/forbidden dependencies, consumers, and extension points. Define the
   project-native architecture check or an evidence-backed N/A.
15. Define general file/folder structure by domain/topic, including generated
   outputs, shared/reusable modules, public entrypoints, migrations/runbooks,
   and N/A evidence for layers outside scope.
16. Use the installed `spec-readiness-review` skill's checklist index, then load only
   relevant topic checklist files; fill spec gaps or record N/A evidence.
17. Define data lifecycle, security/privacy, classification, retention,
   deletion/export, masking/redaction, logging/redaction, integrity/recovery,
   performance/resilience budgets.
18. Define production readiness, release/rollback, operations, supply chain.
19. Mark async/concurrency/runtime semantics explicitly.
20. Record material migration requirements under specs; the planner creates
   executable migration tickets only after readiness approval.
21. Sync registries/provenance; prune duplicates and generate/update the
   canonical spec manifest.
22. Self-audit source/current-doc coverage, assumptions, checklist gaps, decisions, and N/A.
23. Hand off to `spec-readiness-review` for judge loop, deterministic checks,
    human approval evidence, and readiness report.

## Reference Map

Use the matching resources from the installed `spec-readiness-review` skill:
approval gates, artifact schemas, checklist routing, representation catalog,
and workflow contract. Do not assume these resources are paths inside the target
repository or relative to this skill package.

- `references/decision-and-reuse-controls.md`: decision authority, policy,
  scoped applicability, and reuse/module controls.

## Lifecycle Handoff

After authoring or repair, hand off to `spec-readiness-review`. If the current
stage or route is unclear, use `spec-driven-workflow`.

## Approval Rule

Do not present specs as approved. Apply
`references/decision-and-reuse-controls.md`; if an implementation ticket would
need a decision or an unapproved semantic fact, preserve the gap and route it to
readiness review.
