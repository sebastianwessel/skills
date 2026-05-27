---
name: spec-architect
description: Use when specs need creation, review, repair, or approval before autonomous or parallel AI implementation without ambiguity, invention, interface mismatch, drift, or gaps.
---

# Spec Architect

Create specs that let AI agents implement independently without inventing behavior.

## Non-Negotiable Standard

A spec is ready only when an agent can implement its assigned scope without
making product, architecture, interface, failure, security, data, async, type,
migration, or verification decisions.

## Invariants

- Draft first; ask humans only for scope, compliance/security, irreversible
  architecture, public semantics, contradictions, or unsafe inference.
- Specs are precise, concise, non-contradictory, and language agnostic unless a
  language/runtime/protocol choice is part of the contract.
- Specs define behavior, contracts, rationale, and migration needs, not code.
- Planning starts only when `.readiness-report.yaml` says `status: approved`
  and `human_approval.status: approved`.

## Workflow

1. Select mode: `Create`, `Review/Approve`, `Update`, or `Fix Gap`.
2. Update layered specs and active-wave end-to-end paths.
3. Freeze every service/client/storage/event/job/adapter/CLI/config/policy/tool
   interface, including type/nullability and protocol semantics.
4. Mark async/concurrency/runtime semantics explicitly.
5. Add migration plans under `plans/migrations/` when implemented behavior
   changes materially.
6. Run `references/readiness-gates.md`, `references/artifact-shapes.md`, and
   `node skills/spec-architect/scripts/check_specs.mjs <spec-root>`.
7. Simulate every wave/ticket; unresolved decisions stay in specs, not plans.

## Reference Map

- `references/readiness-gates.md`: approval gates, semantic alignment, async,
  migration, wave, parallel, rationale, and anti-drift rules.
- `references/artifact-shapes.md`: required artifacts, report fields, inference
  policy, and default failure semantics.

## Modes

- `Create`: build a new spec set from intent.
- `Review/Approve`: approve only after gates pass and the human approves.
- `Update`: change specs and dependent contracts.
- `Fix Gap`: turn planner/implementer/reviewer gaps into spec changes.

## Approval Rule

Do not approve if an implementation ticket would need to decide behavior,
reconcile contradictions, interpret vague wording, align incompatible type
systems, define async behavior, or invent migration/verification details.
