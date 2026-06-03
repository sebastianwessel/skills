---
name: spec-architect
description: Creates, reviews, repairs, and approves implementation-ready specs. Use when specs need creation, evolution, gap repair, contracts, drift prevention, readiness gates, or approval.
---

# Spec Architect

## Standard

Approve only when agents can implement without deciding product, architecture,
interfaces, failures, data, async/type, security, recovery, release,
observability, supply chain, or tests.

## Invariants

- Ask humans only for scope, compliance/security, public semantics,
  irreversible architecture, contradictions, or unsafe inference.
- Specs define behavior/contracts, not code: precise, concise,
  non-contradictory, language agnostic unless contractual.
- Specs prove the complete working solution across clients/consumers,
  contracts, states, and verification; out-of-scope layers need N/A evidence.
- Prefer industry standards and machine-readable contracts. Custom protocols,
  formats, observability, errors, auth, architecture, or supply-chain choices
  need rationale and approval.
- Flow business/user outcome to components, workflows, interfaces, UX, NFRs,
  production/release/supply-chain, and acceptance.
- On update/fix-gap, update source of truth first, relink dependents, prune
  stale duplicates, and record impact.
- Requirements/flows/contracts/NFRs need IDs, source/rationale, verification,
  priority/risk where relevant, and traceability to acceptance.
- English smoke checks require `language: en`; semantic approval needs a judge.
- Self-audit with evidence; do not approve on confidence.
- Planning starts only after approved readiness and human approval.
- If applicability, standard/tool choice, or N/A status lacks approved evidence,
  block or ask one minimum decision.

## Workflow

1. Select mode: `Create`, `Review/Approve`, `Update`, or `Fix Gap`.
2. Apply `references/readiness-gates.md`; normalize traceable requirements.
3. Update layered specs and complete E2E success/failure/recovery paths,
   including existing frontends, clients, consumers, integrations, or N/A.
4. Select standards-first protocols, formats, interfaces, and architecture.
5. Define best-fit standard/ecosystem-native contract/IDL/schema artifacts as
   source of truth for every in-scope interface; otherwise record N/A evidence.
6. Freeze interfaces, type/nullability, and protocol semantics.
7. Define security/privacy, data classification, log levels/redaction,
   data-integrity/recovery, and performance/resilience budgets.
8. Define production readiness, release/rollback, operations, supply chain.
9. Mark async/concurrency/runtime semantics explicitly.
10. Add `plans/migrations/` entries for material implemented-behavior changes.
11. Sync registries/provenance/readiness; prune superseded duplicate text.
12. Run semantic judge review and
    `node skills/spec-architect/scripts/check_specs.mjs <spec-root>`.
13. Simulate waves/tickets against the E2E coverage matrix; unresolved
    decisions stay in specs.
14. Record deterministic, judge, maintenance, and self-audit evidence.

## Reference Map

- `references/readiness-gates.md`: approval gates.
- `references/artifact-shapes.md`: artifacts and report fields.

## Modes

- `Create`: build specs from intent.
- `Review/Approve`: approve only after gates and human approval.
- `Update`: change source specs, dependents, and plan impact notes.
- `Fix Gap`: convert downstream gaps into specs and cleanup.

## Approval Rule

Do not approve if a ticket must decide, reconcile, interpret vague wording, or
invent behavior, interfaces, client/frontend alignment, async/type/error/logging
semantics, security, performance, recovery, contracts, data protection, release,
supply-chain, migration, or tests. Regex success is not semantic approval.
