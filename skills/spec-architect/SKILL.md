---
name: spec-architect
description: Use when specs need creation, review, repair, or approval before autonomous or parallel AI implementation without ambiguity, invention, interface mismatch, drift, or gaps.
---

# Spec Architect

Create specs that let AI agents implement without inventing behavior.

## Non-Negotiable Standard

A spec is ready only when an agent can implement its scope without deciding
product, architecture, interface, failure, security, data, async/type,
migration, performance, recovery, release, supply-chain, observability, or tests.

## Invariants

- Ask humans only for scope, compliance/security, irreversible architecture,
  public semantics, contradictions, or unsafe inference.
- Specs are precise, concise, non-contradictory, language agnostic unless
  contractual, and define behavior/contracts not code.
- Prefer industry standards; custom protocols, formats, observability, errors,
  auth, architecture, or supply-chain choices need rationale and approval.
- Flow business/user outcome to components, workflows, interfaces, UX, NFRs,
  production/release/supply-chain, and acceptance. Centralize shared facts.
- Requirements/flows/contracts/NFRs need IDs, source/rationale, verification
  method, priority/risk where relevant, and traceability to acceptance.
- Machine-checked spec prose uses `language: en`. Regex/literal checks are
  smoke tests only; semantic approval needs a judge pass.
- Self-audit with evidence; do not approve on confidence.
- Planning starts only after approved readiness and human approval.

## Workflow

1. Select mode: `Create`, `Review/Approve`, `Update`, or `Fix Gap`.
2. Apply `references/readiness-gates.md`.
3. Normalize requirements into verifiable, traceable statements.
4. Update layered specs and active-wave end-to-end paths, including unhappy
   paths and recovery paths.
5. Select standards-first protocols, formats, interfaces, and architecture.
6. Freeze service/client/storage/event/job/adapter/CLI/config/policy/tool
   interface, including type/nullability and protocol semantics.
7. Define security/privacy, data classification, log levels/redaction,
   data-integrity/recovery, and performance/resilience budgets.
8. Define production readiness, release/rollback, operations, supply chain.
9. Mark async/concurrency/runtime semantics explicitly.
10. Add migration plans under `plans/migrations/` when implemented behavior
   changes materially.
11. Run semantic judge review and
    `node skills/spec-architect/scripts/check_specs.mjs <spec-root>`.
12. Simulate every wave/ticket; unresolved decisions stay in specs, not plans.
13. Record deterministic, judge, and self-audit evidence in the report.

## Reference Map

- `references/readiness-gates.md`: approval gates and anti-drift rules.
- `references/artifact-shapes.md`: artifacts, report fields, inference policy.

## Modes

- `Create`: build a new spec set from intent.
- `Review/Approve`: approve only after gates pass and the human approves.
- `Update`: change specs and dependent contracts.
- `Fix Gap`: turn planner/implementer/reviewer gaps into spec changes.

## Approval Rule

Do not approve if a ticket must decide behavior, reconcile contradictions,
interpret vague wording, align type systems, define async behavior, or invent
security, performance, recovery, logging, protocols, data protection, release,
supply-chain, migration, or tests. Regex success is not semantic approval.
