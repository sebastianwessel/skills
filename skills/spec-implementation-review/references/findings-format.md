# Findings Format

Persist review output under:

`plans/reviews/<wave-or-plan-id>/<review-id>/`

Use a stable `review-id` such as `YYYYMMDD-HHMM-review` or the existing review
directory when continuing.

## Contents

- review.md
- findings.yaml
- Status Handoff
- agent-feedback/<ticket-id>.md

## review.md

```markdown
# Implementation Review: <wave-or-plan-id>

Decision: pass | needs_fixes | blocked_spec_gap | blocked_plan_gap | partial
Review ID: <review-id>
Scope: <wave/plan/tickets/commit range>

## Findings
<blocking findings first, then advisory>

## Path Coverage
| Path | Status | Evidence | Notes |
| --- | --- | --- | --- |

## Digest And Impact Evidence

- Readiness/spec/plan digest:
- Changed asset/module/contract IDs:
- Affected consumers and test evidence:

## Verification
| Command | Result | Evidence |
| --- | --- | --- |

## Self-Audit
- Assumptions:
- Skipped checks:
- Unreviewed paths:
- Residual risk:
```

## findings.yaml

Each finding must be actionable without chat context:

```yaml
findings:
  - id: REVIEW-001
    severity: blocking # blocking | advisory
    category: SPEC_DRIFT # SPEC_DRIFT | TRACEABILITY | PATH | TEST | SECURITY | PERF | ROBUSTNESS | OPERATIONS | SUPPLY_CHAIN | MAINTAINABILITY | INTERFACE | FRONTEND_UX | PLAN | SPEC_GAP | CLEANUP
    root_cause: implementation_drift # spec_gap | plan_gap | implementation_drift | tooling_gap
    status: open # open | fixed | accepted | obsolete
    owner_ticket: TICKET-123
    route: implementation # implementation | planner | spec-readiness-review | skill-maintenance
    spec_refs:
      - specs/flows/user-login.md#validation-failure
    impacted_path: "POST /login invalid password"
    location: "packages/api/src/login.ts:88"
    expected: "Returns AUTH_INVALID without creating a session."
    actual: "Creates a refresh token before password validation fails."
    evidence: "Test auth.invalid-password passes only after token side effect."
    fix_boundary: "packages/api/auth only; no schema changes"
    required_verification:
      - "npm test -- auth.login.failure.test.ts"
    agent_instruction: "Move token creation after password validation and add side-effect assertion."
```

## Status Handoff

When `plans/_status.yaml` or an equivalent tracker exists:

- ticket-scope implementation findings set the owner ticket to `partial` with
  `review_id`, open finding ids, and resume note
- spec gaps set affected tickets or wave to `blocked` and route to
  `spec-readiness-review`
- stale/duplicate spec or plan text routes to `spec-readiness-review` or
  `spec-implementation-planner` with cleanup refs and affected tickets
- plan/scope/dependency gaps set affected tickets or wave to `blocked` and
  route to `spec-implementation-planner`
- tooling gaps route to the relevant skill/checker maintainer with reproducer,
  expected enforcement, and missing deterministic/semantic check
- passing review records `review_id`, pinned digest, reviewed scope/consumers,
  command evidence, and zero open blocking findings, then transitions the
  reviewed ticket or wave to `accepted`

Do not close, merge, or mark done when blocking findings remain open.

## agent-feedback/<ticket-id>.md

```markdown
# Feedback for <ticket-id>

## Blocking Findings
- REVIEW-001: <short title>
  - Spec refs:
  - Location:
  - Expected:
  - Actual:
  - Fix boundary:
  - Required verification:

## Advisory Findings

## Handoff
Use `spec-ticket-implementation` for fixes. Do not change files outside the
listed fix boundary. Return to planner or spec-readiness-review for routed gaps.
```

Findings routed to `planner` require remediation tickets or dependency/scope
changes. Findings routed to `spec-readiness-review` require spec clarification
before implementation continues.
