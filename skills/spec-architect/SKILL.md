---
name: spec-architect
description: Creates, reviews, repairs, and approves implementation-ready specs. Use when specs need creation, evolution, gap repair, contracts, drift prevention, readiness gates, or approval.
---

# Spec Architect

## Non-Negotiable Standard

A spec is ready only when an agent can implement without deciding product,
architecture, interfaces, failures, security, data, async/type, migration,
performance, recovery, release, supply chain, observability, or tests.

## Invariants

- Ask humans only for scope, compliance/security, irreversible architecture,
  public semantics, contradictions, or unsafe inference; ask one focused
  decision with context, recommendation, and material alternatives.
- Specs define behavior/contracts, not code: precise, concise,
  non-contradictory, language agnostic unless contractual.
- Prefer industry standards and machine-readable contracts. Custom protocols,
  formats, observability, errors, auth, architecture, or supply-chain choices
  need rationale and approval.
- Flow business/user outcome to components, workflows, interfaces, UX, NFRs,
  production/release/supply-chain, and acceptance. Centralize shared facts.
- On update/fix-gap, update source of truth first, relink dependents, prune
  stale duplicates, and record impact.
- Requirements/flows/contracts/NFRs need IDs, source/rationale, verification
  method, priority/risk where relevant, and traceability to acceptance.
- Machine-checked spec prose uses `language: en`. Regex/literal checks are
  smoke tests only; semantic approval needs a judge pass.
- Self-audit with evidence; do not approve on confidence.
- Planning starts only after approved readiness and human approval.
- If applicability, standard/tool choice, or N/A status lacks approved evidence,
  block or ask one minimum decision.

## Workflow

1. Select mode: `Create`, `Review/Approve`, `Update`, or `Fix Gap`.
2. Apply `references/readiness-gates.md`.
3. Normalize traceable requirements.
4. Update layered specs and end-to-end success/failure/recovery paths.
5. Select standards-first protocols, formats, interfaces, and architecture.
6. Define best-fit standard or ecosystem-native contract/IDL/schema artifacts
   as source of truth for every in-scope interface; otherwise record N/A
   evidence. Examples are non-exhaustive.
7. Freeze interfaces, type/nullability, and protocol semantics.
8. Define security/privacy, data classification, log levels/redaction,
   data-integrity/recovery, and performance/resilience budgets.
9. Define production readiness, release/rollback, operations, supply chain.
10. Mark async/concurrency/runtime semantics explicitly.
11. Add `plans/migrations/` entries for material implemented-behavior changes.
12. Sync registries/provenance/readiness; prune superseded duplicate text.
13. Run semantic judge review and
    `node skills/spec-architect/scripts/check_specs.mjs <spec-root>`.
14. Simulate waves/tickets; unresolved decisions stay in specs.
15. Record deterministic, judge, maintenance, and self-audit evidence.

## Reference Map

- `references/readiness-gates.md`: approval gates.
- `references/artifact-shapes.md`: artifacts and report fields.

## Modes

- `Create`: build a new spec set from intent.
- `Review/Approve`: approve only after gates pass and the human approves.
- `Update`: change source specs, dependent contracts, and plan impact notes.
- `Fix Gap`: turn downstream gaps into spec changes and cleanup.

## Approval Rule

Do not approve if a ticket must decide, reconcile, interpret vague wording, or
invent behavior, interfaces, async/type/error/logging semantics, security,
performance, recovery, contracts, data protection, release, supply-chain,
migration, or tests. Regex success is not semantic approval.
