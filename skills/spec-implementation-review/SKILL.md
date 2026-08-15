---
name: spec-implementation-review
description: Reviews implementation waves against approved specs and tickets. Use when completed or partial work needs acceptance, merge, release, or handoff review with path tracing and persisted findings.
---

# Spec Implementation Review

Review a wave/plan implementation against approved specs. Do not fix code.
Persist findings and per-ticket feedback for implementation agents.

## Inputs

Start with the requested wave/plan scope, then expand it to all consumers of a
changed public contract, generated artifact, shared asset, or module boundary:

- `specs/.readiness-report.yaml` and scoped specs
- `plans/implementation-plan.md`, indexes, wave plan, tickets
- changed files/diff, implementation-evidence manifest, verification output,
  impacted-consumer evidence, prior review findings

Run available gates from their loaded skill packages before semantic review;
pass the target repository explicitly rather than assuming it contains this
skill suite:

- `node <spec-readiness-review-skill-root>/scripts/check_specs.mjs <repo-root>/specs`
- `node <spec-implementation-planner-skill-root>/references/check_plan.mjs <repo-root>`
- `node <spec-implementation-review-skill-root>/scripts/check_implementation_evidence.mjs <repo-root>`

Stop if specs or plan are not approved, required evidence is missing, or the
review scope cannot be identified.

## Review Workflow

1. Confirm pinned readiness/plan/spec digests, ticket lifecycle state, changed
   files and symbols, verification evidence, impact set, and spec refs.
2. Build a solution path matrix using `references/path-tracing.md`.
3. Follow every relevant path end to end: request/input, validation, auth,
   routing, frontend/client access and states, design/component reuse, interface
   boundaries, domain logic, persistence, async work, external boundaries,
   generated artifacts, generation-map coverage, boundary type strength,
   observability, response/output, cleanup, recovery.
4. Run the loaded `scripts/check_implementation_evidence.mjs` and apply
   `references/implementation-evidence.md` plus `references/review-gates.md`
   for spec drift, interfaces, tests,
   requirements traceability, security, performance, operations, supply chain,
   robustness, maintainability, docs, and false work.
5. Persist findings with `references/findings-format.md`.
6. Self-audit honestly: unchecked paths, skipped commands, assumptions, weak
   evidence, and residual risk.

## Blocking Findings

Reject any failed gate in `references/review-gates.md`, including spec/contract
drift, unapproved representations or generated mirrors, weak boundary types,
untested happy/unhappy paths, security/privacy/data-loss/operations risks,
false completion, ownerless feedback, or stale source text. Also reject an
undeclared changed asset/module/command effect or an unreviewed affected
consumer. Persist the finding and route it; never accept around it.

## Persisted Output

Write `plans/reviews/<wave-or-plan-id>/<review-id>/`:

- `review.md`: decision, path coverage, commands, self-audit
- `findings.yaml`: structured findings
- `agent-feedback/<ticket-id>.md`: implementation-agent feedback for every
  ticket with findings

Use `references/findings-format.md` for required fields and status handoff. Do
not rely on chat-only feedback.

## Lifecycle Handoff

Route implementation findings to `spec-ticket-implementation`, plan gaps to
`spec-implementation-planner`, and spec gaps to `spec-readiness-review`. If
routing is unclear, use `spec-driven-workflow`.

## Decision

- `pass`: no blocking findings, commands pass, path matrix complete
- `needs_fixes`: implementation issues are actionable within tickets
- `blocked_spec_gap`: specs are missing, unclear, or contradictory
- `blocked_plan_gap`: plan/tickets/scopes/dependencies cannot route fixes
- `partial`: review was intentionally scoped and cannot accept the whole wave

Only independent review transitions reviewed work to `accepted`. An implementer
may record `implemented` or `review_pending`, never acceptance.

Return findings first, ordered by severity. Advisory cleanup must not hide
blocking correctness, security, spec, test, or path-coverage issues.
