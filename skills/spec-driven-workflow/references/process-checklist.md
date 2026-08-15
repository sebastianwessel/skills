# Process Checklist

Use this checklist to coordinate the specialized spec-driven skills in order.

## Contents

- Stage Selection
- Ordered Gates
- Handoff Matrix
- Pause And Resume

## Stage Selection

- No approved specs, changed requirements, spec contradiction, unclear behavior,
  missing interface/UX/NFR/security/release/test definition, decision authority,
  policy profile, reuse inventory, or module boundary:
  use `spec-architect`.
- Contract drift, stale aliases, compatibility fallbacks, handwritten mirrors,
  multiple protocol/language/storage surfaces, or unclear patch-vs-clean-rebuild
  strategy:
  use `spec-architect` for the clean-rebuild boundary decision and generation
  map before planning or coding.
- Specs are authored or repaired but readiness is unapproved, stale, digest-mismatched, missing
  semantic judge evidence, missing human approval, or deterministic checks have
  not passed:
  use `spec-readiness-review`.
- Approved readiness exists but no implementation plan, stale plan, missing wave
  order, missing dependencies, missing ticket scope, or no test-first order:
  use `spec-implementation-planner`.
- One ticket is ready, its pinned spec/plan digests match, required dependencies
  are accepted (or have an explicitly approved lower readiness requirement), and
  scope is fixed:
  use `spec-ticket-implementation`.
- A ticket set, wave, partial wave, release candidate, or merge candidate needs
  acceptance:
  use `spec-implementation-review`.

## Ordered Gates

1. **Spec Authoring Gate**
   - Do: define business outcome, flows, interfaces/contracts, UX, happy and
     unhappy paths, NFRs, security/privacy, recovery, release, supply chain,
     tests, acceptance, clean-rebuild boundary decision, generation-map
     ownership, strong boundary type rules, decision authority, approved policy,
     reuse inventory, and module/dependency contracts.
   - Check: source/rationale and canonical spec refs exist; each N/A is scoped;
     reusable assets/new abstractions and allowed dependencies are explicit;
     open authoring gaps are recorded; and the set is ready for readiness review.
   - Next: readiness review.

2. **Readiness Review Gate**
   - Do: run approval-time spec judge loop, deterministic structured spec checker,
     semantic judge, human approval recording, readiness report, and explicit
     gap repair when requested.
   - Check: readiness approved for the current spec manifest digest, human
     approval is attributable, semantic judge passed,
     `spec_judge_loop.status: passed`, zero blocking judge findings, no open
     implementation decisions.
   - Next: planning.

3. **Plan Gate**
   - Do: create vertical-slice waves, dependency indexes, ticket scopes, status
     tracking, contract/codegen foundations, generation-map/drift-check work,
     bounded parallel discovery or disjoint implementation, and test-first
     order.
   - Check: every ready ticket pins approved digests and has `Slice Strategy`, `Test-First Order`,
     acceptance matrix, traceability, scopes, dependencies, generated-contract
     evidence, generation-map disposition, closed-boundary type checks, coverage
     ownership, and verification.
   - Next: ticket implementation.

4. **Ticket Implementation Gate**
   - Do: run preflight, generate contract artifacts, write or generate
     spec/contract/acceptance/unhappy-path tests first, then implement business
     logic inside `write_scope`.
   - Check: focused tests, contract drift checks, scoped project verification,
     generated artifacts compile, closed contract boundaries expose strong
     generated types, changed-file/symbol/dependency tracking, and ticket review
     loop pass. Mark work `implemented` or `review_pending`, not accepted.
   - Next: continue tickets in the wave or review when the wave increment is
     ready.

5. **Wave Review Gate**
   - Do: trace every request/command/event/UI path from entry to output,
     including validation, auth, interfaces, persistence, async work,
     observability, recovery, frontend/client states, generated artifacts,
     boundary type strength, stale compatibility paths, and cleanup.
   - Check: findings are persisted, routed, and closed; impacted consumers are
     tested/reviewed; no blocking spec drift,
     path gap, test gap, security/privacy issue, false completion, or ownerless
     feedback remains.
   - Next: accept wave, implement routed fixes, replan, or repair specs.

6. **Completion Gate**
   - Do: verify all approved specs are implemented.
   - Check: full end-to-end solution works, no gaps, no unresolved
     implementation work, no unapproved mock/fake/stub/placeholder production
     path, policy-profile coverage threshold, and unit plus end-to-end tests pass.

## Handoff Matrix

| Finding | Route |
| --- | --- |
| Missing broad requirement, interface, UX, security, recovery, release, test definition, policy, decision authority, reuse asset, or module boundary | `spec-architect` |
| Missing readiness report, failed spec checks, stale approval, missing human approval, or semantic judge gap | `spec-readiness-review` |
| Missing clean-rebuild decision, generation map, source-of-truth coverage, or closed-boundary type policy | `spec-architect` |
| Missing wave order, dependency, status, ticket scope, vertical slice, test-first order, or owner | `spec-implementation-planner` |
| Over-broad parallel work, conflicting write scopes, missing sidecar-agent bounds, or missing generator-first phase order | `spec-implementation-planner` |
| Code, test, generated artifact, path, quality, or ticket-scope defect | `spec-ticket-implementation` |
| Completed or partial wave needs acceptance, merge, release, or persisted findings | `spec-implementation-review` |

## Lifecycle State Contract

`planned → ready → in_progress → implemented → review_pending → accepted` is
the normal progression. `blocked`, `partial`, and `skipped` are explicit side
states. Only `spec-implementation-review` can set `accepted`. A dependency may
declare a lower prerequisite (for example generated contract readiness), but
must name that state and evidence; it must never silently treat self-reported
`done` or `merged` as acceptance.

## Pause And Resume

- Before pausing, update ticket status, current proof, changed files, blockers,
  and next command.
- On resume, read readiness status, plan status, and latest review findings
  before doing new work.
- Never mark a wave done while blocking findings, active dependencies, or
  unverified paths remain.
