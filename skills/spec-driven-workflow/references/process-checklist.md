# Process Checklist

Use this checklist to coordinate the specialized spec-driven skills in order.

## Contents

- Stage Selection
- Ordered Gates
- Handoff Matrix
- Pause And Resume

## Stage Selection

- No approved specs, changed requirements, spec contradiction, unclear behavior,
  missing interface/UX/NFR/security/release/test definition:
  use `spec-architect`.
- Approved specs exist but no implementation plan, stale plan, missing wave
  order, missing dependencies, missing ticket scope, or no test-first order:
  use `spec-implementation-planner`.
- One ticket is ready, dependencies are done, and scope is fixed:
  use `spec-ticket-implementation`.
- A ticket set, wave, partial wave, release candidate, or merge candidate needs
  acceptance:
  use `spec-implementation-review`.

## Ordered Gates

1. **Spec Gate**
   - Do: define business outcome, flows, interfaces/contracts, UX, happy and
     unhappy paths, NFRs, security/privacy, recovery, release, supply chain,
     tests, and acceptance.
   - Check: readiness approved, human approval recorded, semantic judge passed,
     no open implementation decisions.
   - Next: planning.

2. **Plan Gate**
   - Do: create vertical-slice waves, dependency indexes, ticket scopes, status
     tracking, contract/codegen foundations, and test-first order.
   - Check: every ready ticket has `Slice Strategy`, `Test-First Order`,
     acceptance matrix, traceability, scopes, dependencies, generated-contract
     evidence, coverage ownership, and verification.
   - Next: ticket implementation.

3. **Ticket Implementation Gate**
   - Do: run preflight, generate contract artifacts, write or generate
     spec/contract/acceptance/unhappy-path tests first, then implement business
     logic inside `write_scope`.
   - Check: focused tests, contract drift checks, scoped project verification,
     changed-file tracking, and ticket review loop pass.
   - Next: continue tickets in the wave or review when the wave increment is
     ready.

4. **Wave Review Gate**
   - Do: trace every request/command/event/UI path from entry to output,
     including validation, auth, interfaces, persistence, async work,
     observability, recovery, frontend/client states, and cleanup.
   - Check: findings are persisted, routed, and closed; no blocking spec drift,
     path gap, test gap, security/privacy issue, false completion, or ownerless
     feedback remains.
   - Next: accept wave, implement routed fixes, replan, or repair specs.

5. **Completion Gate**
   - Do: verify all approved specs are implemented.
   - Check: full end-to-end solution works, no gaps, no unresolved
     implementation work, no unapproved mock/fake/stub/placeholder production
     path, default 80% coverage unless overridden, and unit plus end-to-end
     tests pass.

## Handoff Matrix

| Finding | Route |
| --- | --- |
| Missing or ambiguous requirement, interface, UX, security, recovery, release, or test definition | `spec-architect` |
| Missing wave order, dependency, status, ticket scope, vertical slice, test-first order, or owner | `spec-implementation-planner` |
| Code, test, generated artifact, path, quality, or ticket-scope defect | `spec-ticket-implementation` |
| Completed or partial wave needs acceptance, merge, release, or persisted findings | `spec-implementation-review` |

## Pause And Resume

- Before pausing, update ticket status, current proof, changed files, blockers,
  and next command.
- On resume, read status and latest review findings before doing new work.
- Never mark a wave done while blocking findings, active dependencies, or
  unverified paths remain.
