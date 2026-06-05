# Spec Readiness Review

`spec-readiness-review` is the approval gate between spec authoring and
implementation planning. It reviews canonical specs, repairs explicit readiness
gaps, runs deterministic and semantic checks, and records whether specs are
ready for planning.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

## What It Does

- Reviews specs after `spec-architect` authors or updates them.
- Runs the approval-time judge loop and deterministic spec checker.
- Owns `specs/.readiness-report.yaml` approval evidence.
- Repairs explicit spec gaps and reruns readiness checks.
- Blocks planning when behavior, contracts, failures, security, recovery,
  release, tests, generation mapping, or strong boundary type policy is missing.
- Verifies contract-first clean rebuild decisions before planning starts.

## How It Works

The skill loads readiness gates and artifact-shape references only when review
is requested. It uses `scripts/check_specs.mjs` for repeatable smoke checks and
records semantic uncertainty instead of treating regex success as approval.

## Workflow

1. Confirm spec scope and source artifacts.
2. Run readiness gates and semantic review.
3. Run the deterministic spec checker.
4. Repair explicit gaps when requested, then rerun review.
5. Write approved readiness only when all gates pass and human approval exists.
6. Hand off approved specs to `spec-implementation-planner`.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-readiness-review/SKILL.md` | Executable review and approval instructions. |
| `skills/spec-readiness-review/references/readiness-gates.md` | Approval gates and judge loop. |
| `skills/spec-readiness-review/references/artifact-shapes.md` | Expected spec tree and readiness report fields. |
| `skills/spec-readiness-review/scripts/check_specs.mjs` | Deterministic spec-shape checker. |
| `skills/spec-readiness-review/evals/evals.json` | Evaluation scenarios for readiness review. |

## Validation And Safety

Run the checker when a spec tree exists:

```bash
node skills/spec-readiness-review/scripts/check_specs.mjs specs
```

A passing deterministic check is not semantic approval. Planning is allowed only
after the readiness report is approved, human approval is recorded, required
judge evidence passes, and no blocking findings remain.
