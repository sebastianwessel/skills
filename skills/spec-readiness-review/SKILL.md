---
name: spec-readiness-review
description: Reviews, repairs, and approves implementation spec readiness. Use when specs need semantic review, deterministic checks, readiness reports, approval gates, or gap repair before planning.
---

# Spec Readiness Review

Review canonical specs after authoring and before planning. Own the readiness
decision, deterministic checks, semantic judge evidence, and spec gap repair.
Do not create implementation plans or implement code.

## Standard

Approve only when planning agents can create tickets without deciding behavior,
interfaces, failures, data, runtime, security, recovery, release, ops, tests,
clean-rebuild strategy, generation mapping, general file/folder structure, or
closed-boundary type semantics. Specs must define every capability end to end:
actor/consumer, entrypoint/reachability, contracts, data, states, side effects,
permissions, errors, recovery, observability, acceptance, verification, and
final state or explicit N/A. Use the checklist walk to find omitted topics
before planning. Third-party and dependency choices require current primary
documentation, package/release metadata, or dated research evidence.

## Modes

- `Review/Approve`: judge existing specs, run checks, write or update
  `specs/.readiness-report.yaml`, and route blocking findings.
- `Fix Gap`: update canonical specs from explicit findings, relink dependents,
  prune stale duplicates, record impact, then rerun readiness review. Do not
  invent broad requirements; route broad authoring to `spec-architect`.

## Workflow

1. Confirm source specs exist and the requested scope is clear.
2. Load `references/readiness-gates.md`, `references/artifact-shapes.md`, and
   `references/spec-checklists.md`; then load relevant high-level checklist
   indexes and only the detailed topic checklist files those indexes route to.
3. Run the approval-time spec judge loop from `references/readiness-gates.md`.
4. Verify the capability inventory and end-to-end definition chain across
   feature, UX/client, API, data lifecycle, state transition, async, and ops
   paths.
5. Walk relevant checklist indexes and topic files; record `covered`,
   `not_applicable`, or `gap` evidence and block on any relevant gap.
6. Verify dependency and third-party solution specs use current stable versions
   by default, official docs for schema/query/security/config/performance
   guidance, and explicit rationale for older pins or nonstandard choices.
7. Run semantic judge evidence when available.
8. Run `node skills/spec-readiness-review/scripts/check_specs.mjs <spec-root>`.
9. For contract-heavy boundaries, verify the clean-rebuild decision,
   generation map, generated outputs/checks, strong boundary type policy,
   handwritten remainder, and compatibility/migration stance.
10. If gaps exist, update canonical specs only in `Fix Gap` mode or persist
   findings for `spec-architect`; do not approve.
11. If all gates pass and human approval is recorded, write approved readiness.
12. Self-audit assumptions, skipped checks, current-doc uncertainty, checklist uncertainty, and residual
    risk.

## Stop Conditions

Stop without approval when specs are missing, scope is unclear, human approval is
missing, semantic judge evidence is unavailable when required, deterministic
checks fail, source contracts are ambiguous, generation mapping is incomplete,
weak closed-boundary types are accepted without an open JSON leaf, or planning
would need to invent behavior, file/folder placement, dependency versions, or
third-party implementation guidance.

## Reference Map

- `references/readiness-gates.md`: approval gates and judge loop.
- `references/artifact-shapes.md`: expected spec tree and readiness report.
- `references/spec-checklists.md`: root checklist index that routes to
  high-level checklist indexes and detailed topic files.
- `scripts/check_specs.mjs`: deterministic spec-shape checker.

## Lifecycle Handoff

Authoring and broad spec updates start in `spec-architect`. Approved readiness
hands off to `spec-implementation-planner`. Implementation review spec gaps
return here for persisted findings and repair routing. If stage is unclear, use
`spec-driven-workflow`.
