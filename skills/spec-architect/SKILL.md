---
name: spec-architect
description: Creates and updates canonical implementation specs. Use when specs need authoring, evolution, source-of-truth repair, contracts, UX, NFRs, release, or supply-chain definition before readiness review.
---

# Spec Architect

## Standard

Create canonical specs that a separate readiness review can approve for
planning. Do not approve your own specs.

## Invariants

- Ask humans only for scope, compliance/security, public semantics,
  irreversible architecture, contradictions, unsafe inference.
- Specs define behavior/contracts, not code: precise, concise,
  non-contradictory, language agnostic unless contractual.
- Specs prove the complete working solution across clients/consumers,
  contracts, states, and verification; out-of-scope layers need N/A evidence.
- Specs maintain a capability inventory and define each capability end to end:
  actor/consumer, entrypoint/reachability, contracts, data touched, state
  transitions, side effects, permissions, errors, recovery, observability,
  acceptance, verification, owner, and final state or explicit N/A.
- Specs define the general file/folder structure by domain/topic for in-scope
  implementation areas. They need not enumerate every file, but must define
  ownership boundaries, nested structure expectations, reusable/shared module
  placement, generated-artifact locations, and files that are public contracts,
  entrypoints, migrations, runbooks, or operational assets.
- User-facing specs define access, UX states, and design/component/style reuse;
  otherwise record N/A evidence.
- Prefer standards and machine-readable contracts; custom protocols, formats,
  observability, errors, auth, architecture, or supply chain need rationale and
  readiness review.
- Prefer current stable dependency and third-party solution versions by default.
  Specs must cite current primary documentation, package/release metadata, or
  dated research evidence for chosen libraries, databases, cloud services,
  frameworks, and protocols. Older pins require compatibility/security/risk
  rationale. If current evidence cannot be checked, block or record a human
  decision instead of relying on model memory.
- For contract-heavy rebuilds, explicitly choose incremental patch/refactor or
  contract-first clean rebuild by boundary. If clean rebuild wins, specs must
  define source contracts, generation map, generated packages, drift checks,
  migration/compatibility stance, and handwritten boundaries before planning.
- Flow outcomes to components, workflows, interfaces, UX, NFRs, release, supply
  chain, acceptance.
- On update/fix-gap, update source of truth first, relink dependents, prune
  stale duplicates, and record impact.
- Requirements/flows/contracts/NFRs need IDs, source/rationale, verification,
  priority/risk where relevant, and acceptance traceability.
- English smoke checks require `language: en`; semantic review is owned by
  `spec-readiness-review`.
- Self-audit authoring assumptions and unresolved gaps; do not approve on
  confidence.
- Planning starts only after `spec-readiness-review` approves readiness and
  human approval is recorded.
- If applicability, standard/tool choice, or N/A lacks evidence, block or ask
  one minimum decision.

## Workflow

1. Select mode: `Create`, `Update`, or `Fix Gap`.
2. Normalize requirements and source/rationale.
3. Create or update `02-capabilities/capability-inventory.md`; enumerate
   user-facing, admin/support, API/CLI/SDK, integration/webhook, worker/job,
   data lifecycle, and operational capabilities or N/A categories.
4. Update layered specs and complete E2E success/failure/recovery paths across
   frontends, clients, consumers, integrations, or N/A.
5. Define frontend/client access, UX/design reuse, or N/A.
6. Select standards-first protocols, formats, interfaces, architecture.
7. Research current primary docs/package metadata for relevant dependencies and
   third-party solutions; define versions, alternatives considered, rationale,
   and doc refs.
8. Define best-fit contract/IDL/schema sources for in-scope interfaces; else
   record N/A evidence.
9. For overlapping contract surfaces, add a machine-readable generation map
   before readiness review or planning.
10. Freeze interfaces, strong boundary types, type/nullability, protocol
   semantics.
11. Define general file/folder structure by domain/topic, including generated
   outputs, shared/reusable modules, public entrypoints, migrations/runbooks,
   and N/A evidence for layers outside scope.
12. Load `spec-readiness-review/references/spec-checklists.md`, then load only
   relevant topic checklist files; fill spec gaps or record N/A evidence.
13. Define data lifecycle, security/privacy, classification, retention,
   deletion/export, masking/redaction, logging/redaction, integrity/recovery,
   performance/resilience budgets.
14. Define production readiness, release/rollback, operations, supply chain.
15. Mark async/concurrency/runtime semantics explicitly.
16. Add `plans/migrations/` entries for material implemented-behavior changes.
17. Sync registries/provenance; prune duplicates.
18. Self-audit source coverage, current-doc evidence, assumptions, checklist gaps, open decisions, and
    N/A evidence.
19. Hand off to `spec-readiness-review` for judge loop, deterministic checks,
    human approval evidence, and readiness report.

## Reference Map

- `spec-readiness-review/references/readiness-gates.md`: approval gates owned
  by the readiness review skill.
- `spec-readiness-review/references/artifact-shapes.md`: artifact and
  readiness report shapes owned by the readiness review skill.
- `spec-readiness-review/references/spec-checklists.md`: checklist index; load
  only relevant topic files listed there.

## Lifecycle Handoff

After authoring or repair, hand off to `spec-readiness-review`. If the current
stage or route is unclear, use `spec-driven-workflow`.

## Approval Rule

Do not present specs as approved. If a future ticket would need to decide,
reconcile, interpret vague wording, or invent behavior, interfaces,
clean-rebuild strategy, generation mapping, frontend UX,
async/type/error/logging, security, performance, recovery, contracts, general
file/folder structure, dependency versions, current third-party documentation,
reusable/shared module placement, data protection, release, supply-chain,
migration, or tests, keep the gap in specs and send the set to readiness review.
