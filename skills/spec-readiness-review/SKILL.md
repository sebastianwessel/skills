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
For in-scope data shapes, approve only a catalog that distinguishes canonical
semantic shapes from valid boundary/persistence/projection representations and
records every allowed mapping.

## Modes

- `Review/Approve`: judge existing specs, run checks, write or update
  `specs/.readiness-report.yaml`, and route blocking findings.
- `Fix Gap`: update canonical specs from explicit findings, relink dependents,
  prune stale duplicates, record impact, then rerun readiness review. Do not
  invent broad requirements; route broad authoring to `spec-architect`.

## Workflow

1. Confirm source specs exist and the requested scope is clear.
2. Load `references/readiness-gates.md`, `references/artifact-shapes.md`, and
   `references/spec-checklists.md`, and `references/representation-catalog.md`;
   then load relevant high-level checklist
   indexes and only the detailed topic checklist files those indexes route to.
3. Run the approval-time spec judge loop from `references/readiness-gates.md`.
4. Verify the capability inventory and end-to-end definition chain across
   feature, UX/client, API, data lifecycle, state transition, async, and ops
   paths. Validate the reciprocal `00-traceability.yaml` graph from
   requirement through capability and path to testable acceptance.
5. Walk relevant checklist indexes and topic files; record `covered`,
   `not_applicable`, or `gap` evidence and block on any relevant gap.
6. Verify dependency and third-party solution specs use current stable versions
   by default, official docs for schema/query/security/config/performance
   guidance, and explicit rationale for older pins or nonstandard choices.
7. Run semantic judge evidence when available.
8. Run `node <spec-readiness-review-skill-root>/scripts/check_specs.mjs <spec-root>`.
   Before approval, run
   `node <spec-readiness-review-skill-root>/scripts/generate_spec_manifest.mjs <spec-root> <source-revision>`
   after every canonical-source edit, then obtain fresh, content-bound approval
   evidence; never carry approval forward across a digest change.
9. For contract-heavy boundaries, verify the clean-rebuild decision,
   generation map, generated outputs/checks, strong boundary type policy,
   handwritten remainder, and compatibility/migration stance.
10. Verify every in-scope representation has a catalog entry, canonical owner,
    closed/open policy, consumer list, and approved mapping or N/A evidence.
11. If gaps exist, update canonical specs only in `Fix Gap` mode or persist
   findings for `spec-architect`; do not approve.
12. If all gates pass and human approval is recorded, write approved readiness
    with the matching manifest digest, an accountable approval reference, and
    semantic-judge evidence. Verify decision authority, scoped applicability,
    reuse inventory, and module-boundary artifacts before handoff.
13. Self-audit assumptions, skipped checks, current-doc uncertainty, checklist uncertainty, and residual
    risk.

## Stop Conditions

Stop without approval when specs are missing, scope is unclear, human approval is
missing, approval evidence is not bound to the current manifest digest,
semantic judge evidence is unavailable when required, deterministic
checks fail, source contracts are ambiguous, generation mapping is incomplete,
weak closed-boundary types are accepted without an open JSON leaf, or planning
would need to invent behavior, file/folder placement, dependency versions, or
third-party implementation guidance, a data shape, or a representation mapping.

## Reference Map

- `references/readiness-gates.md`: approval gates and judge loop.
- `references/artifact-shapes.md`: expected spec tree and readiness report.
- `references/spec-checklists.md`: root checklist index that routes to
  high-level checklist indexes and detailed topic files.
- `references/representation-catalog.md`: required catalog shape and reuse
  decision rules for in-scope data representations.
- `scripts/check_specs.mjs`: deterministic spec-shape checker.

## Lifecycle Handoff

Authoring and broad spec updates start in `spec-architect`. Approved readiness
hands off to `spec-implementation-planner`. Implementation review spec gaps
return here for persisted findings and repair routing. If stage is unclear, use
`spec-driven-workflow`.
