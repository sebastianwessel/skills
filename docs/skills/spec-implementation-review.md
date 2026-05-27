# Spec Implementation Review

`spec-implementation-review` reviews completed or partial implementation waves at the solution level. It checks whether the implemented system follows approved specs end to end, across tickets, interfaces, success paths, failure paths, security, performance, tests, and maintainability.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

The CLI and public skill directory are introduced in Vercel's
[`skills` announcement](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem).

## What It Does

- Reviews a wave or plan-level implementation before acceptance, merge, release, or handoff.
- Traces request, command, event, job, UI, and async paths from entry point to final output.
- Checks success, validation failure, authorization failure, downstream failure, timeout, retry, cancellation, rollback, idempotency, cleanup, and observability paths when relevant.
- Enforces spec conformance, interface correctness, test coverage, security, privacy, log redaction, data integrity, recovery, performance, robustness, maintainability, and public API/documentation quality.
- Rejects drift, missing tests, false completion, unapproved mocks/fakes/placeholders, and unresolved ownership.
- Persists findings, plan status handoff, and per-ticket feedback so implementation agents can resume with complete context.

## How It Works

The skill reads the approved specs, implementation plan, wave plan, tickets, changed files, verification evidence, and prior review artifacts. It builds a path matrix, checks each path against specs and tests, then writes structured review artifacts under `plans/reviews/<wave-or-plan-id>/<review-id>/`.

## Workflow

1. Confirm approved specs, valid plan, wave scope, ticket status, and verification evidence.
2. Build an end-to-end path matrix for every relevant entry point and failure mode.
3. Review spec conformance, interfaces, tests, security/privacy, observability, data integrity, recovery, performance, robustness, maintainability, and docs.
4. Persist `review.md`, `findings.yaml`, and `agent-feedback/<ticket-id>.md`.
5. Update plan status metadata for partial tickets, blocked spec gaps, or blocked plan gaps when a tracker exists.
6. Route implementation findings to tickets, plan gaps to `spec-implementation-planner`, and spec gaps to `spec-architect`.
7. Return a decision: `pass`, `needs_fixes`, `blocked_spec_gap`, `blocked_plan_gap`, or `partial`.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-implementation-review/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/spec-implementation-review/references/path-tracing.md` | End-to-end solution path review checklist. |
| `skills/spec-implementation-review/references/review-gates.md` | Spec, interface, test, security, performance, robustness, and maintainability gates. |
| `skills/spec-implementation-review/references/findings-format.md` | Required persisted review artifact and feedback formats. |
| `skills/spec-implementation-review/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

The review skill does not implement fixes. It writes persisted findings with exact ownership, evidence, expected behavior, actual behavior, fix boundaries, required verification, and status handoff. If ownership or expected behavior is missing, it blocks and routes the gap to planning or specs instead of letting an implementation agent decide.
