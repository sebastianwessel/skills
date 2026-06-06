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
- Blocks planning when specs lack a capability inventory or end-to-end
  definition chains for UX/client, API, data lifecycle, state transition,
  async/integration, operational, acceptance, and verification paths.
- Blocks planning when specs omit the general file/folder structure by
  domain/topic, including ownership boundaries, shared/reusable module
  placement, generated artifacts, and public entrypoint or operational asset
  locations.
- Walks the root checklist index, relevant high-level indexes, and detailed
  topic checklist files; blocks approval when relevant topics such as database
  indexes, auth flows, permissions, secret handling, generated contracts,
  unhappy-path tests, release, or operations are gaps.
- Blocks approval when dependency versions or third-party implementation
  guidance rely on model memory instead of current primary docs,
  package/release metadata, or dated research evidence.
- Verifies contract-first clean rebuild decisions before planning starts.

## How It Works

The skill loads readiness gates and artifact-shape references only when review
is requested. It uses `scripts/check_specs.mjs` for repeatable smoke checks and
records semantic uncertainty instead of treating regex success as approval.

## Workflow

1. Confirm spec scope and source artifacts.
2. Run readiness gates, capability/end-to-end definition review, checklist
   walk, current dependency research review, and semantic review.
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
| `skills/spec-readiness-review/references/spec-checklists.md` | Root checklist index that routes to high-level indexes and topic-specific checklist files. |
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
