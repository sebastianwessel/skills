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
- User-facing specs define access, UX states, and design/component/style reuse;
  otherwise record N/A evidence.
- Prefer standards and machine-readable contracts; custom protocols, formats,
  observability, errors, auth, architecture, or supply chain need rationale and
  readiness review.
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
3. Update layered specs and complete E2E success/failure/recovery paths across
   frontends, clients, consumers, integrations, or N/A.
4. Define frontend/client access, UX/design reuse, or N/A.
5. Select standards-first protocols, formats, interfaces, architecture.
6. Define best-fit contract/IDL/schema sources for in-scope interfaces; else
   record N/A evidence.
7. For overlapping contract surfaces, add a machine-readable generation map
   before readiness review or planning.
8. Freeze interfaces, strong boundary types, type/nullability, protocol
   semantics.
9. Define security/privacy, classification, logging/redaction, integrity/
   recovery, performance/resilience budgets.
10. Define production readiness, release/rollback, operations, supply chain.
11. Mark async/concurrency/runtime semantics explicitly.
12. Add `plans/migrations/` entries for material implemented-behavior changes.
13. Sync registries/provenance; prune duplicates.
14. Self-audit source coverage, assumptions, open decisions, and N/A evidence.
15. Hand off to `spec-readiness-review` for judge loop, deterministic checks,
    human approval evidence, and readiness report.

## Reference Map

- `spec-readiness-review/references/readiness-gates.md`: approval gates owned
  by the readiness review skill.
- `spec-readiness-review/references/artifact-shapes.md`: artifact and
  readiness report shapes owned by the readiness review skill.

## Lifecycle Handoff

After authoring or repair, hand off to `spec-readiness-review`. If the current
stage or route is unclear, use `spec-driven-workflow`.

## Approval Rule

Do not present specs as approved. If a future ticket would need to decide,
reconcile, interpret vague wording, or invent behavior, interfaces,
clean-rebuild strategy, generation mapping, frontend UX,
async/type/error/logging, security, performance, recovery, contracts, data
protection, release, supply-chain, migration, or tests, keep the gap in specs
and send the set to readiness review.
