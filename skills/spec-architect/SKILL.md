---
name: spec-architect
description: Creates, reviews, repairs, and approves implementation-ready specs. Use when specs need creation, evolution, gap repair, contracts, drift prevention, readiness gates, or approval.
---

# Spec Architect

## Standard

Approve only when agents can implement without deciding behavior, interfaces,
failures, data, async/type, security, recovery, release, ops, or tests.

## Invariants

- Ask humans only for scope, compliance/security, public semantics,
  irreversible architecture, contradictions, unsafe inference.
- Specs define behavior/contracts, not code: precise, concise,
  non-contradictory, language agnostic unless contractual.
- Specs prove the complete working solution across clients/consumers,
  contracts, states, and verification; out-of-scope layers need N/A evidence.
- User-facing specs define access, UX states, and design/component/style reuse;
  otherwise record N/A evidence.
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
2. Apply `references/readiness-gates.md`; normalize requirements.
3. Update layered specs and complete E2E success/failure/recovery paths,
   including existing frontends, clients, consumers, integrations, or N/A.
4. Define frontend/client access, UX/design reuse, or N/A.
5. Select standards-first protocols, formats, interfaces, and architecture.
6. Define best-fit standard/ecosystem-native contract/IDL/schema artifacts as
   source of truth for every in-scope interface; otherwise record N/A evidence.
7. Freeze interfaces, type/nullability, protocol semantics.
8. Define security/privacy, data classification, log levels/redaction,
   data-integrity/recovery, and performance/resilience budgets.
9. Define production readiness, release/rollback, operations, supply chain.
10. Mark async/concurrency/runtime semantics explicitly.
11. Add `plans/migrations/` entries for material implemented-behavior changes.
12. Sync registries/provenance/readiness; prune duplicates.
13. Run judge review and `node skills/spec-architect/scripts/check_specs.mjs <spec-root>`.
14. Simulate waves/tickets against the E2E coverage matrix; unresolved
    decisions stay in specs.
15. Record deterministic, judge, maintenance, and self-audit evidence.

## Reference Map

- `references/readiness-gates.md`: approval gates.
- `references/artifact-shapes.md`: artifacts and report fields.

## Lifecycle Handoff

After approved readiness, hand off to `spec-implementation-planner`. If the
current stage or route is unclear, use `spec-driven-workflow`.

## Approval Rule

Do not approve if a ticket must decide, reconcile, interpret vague wording, or
invent behavior, interfaces, frontend UX, async/type/error/logging, security,
performance, recovery, contracts, data protection, release, supply-chain,
migration, or tests. Regex success is not semantic approval.
