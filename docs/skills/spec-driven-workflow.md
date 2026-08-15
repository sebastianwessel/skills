# Spec Driven Workflow

`spec-driven-workflow` coordinates the existing spec-driven skills so agents know
which step comes next, which gate must pass, and where to route blocked work.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

The CLI and public skill directory are introduced in Vercel's
[`skills` announcement](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem).

## What It Does

- Chooses between `spec-architect`, `spec-readiness-review`,
  `spec-implementation-planner`, `spec-ticket-implementation`, and
  `spec-implementation-review`.
- Defines the lifecycle order: specify, readiness review, plan, implement,
  implementation review, route feedback.
- Blocks planning until specs pass readiness review and blocks implementation
  until tickets are ready.
- Pins approval, planning, tickets, implementation evidence, and review to the
  same immutable spec revision; a relevant change routes work backward.
- Uses `planned → ready → in_progress → implemented → review_pending → accepted`.
  Only independent review can set `accepted`.
- Forces a patch/refactor versus contract-first clean-rebuild decision before
  agents edit contract-heavy boundaries with stale aliases, fallback synthesis,
  handwritten mirrors, or drifting protocol/language/storage surfaces.
- Requires planning before parallel agents start coding.
- Routes missing generation maps, weak boundary type policies, and broad
  parallel-agent requests back to specs or planning.
- Routes findings back to the right owner: spec, plan, ticket, or review.
- Supports pause/resume by requiring status, proof, blockers, and next commands.

## How It Works

The skill starts by identifying current artifacts: specs, readiness report,
plans, ticket status, implementation diff, review findings, pinned digests, and
decision/policy authority. It then selects the current stage and applies the corresponding gate from
`references/process-checklist.md`.

## Workflow

1. Orient: find current artifacts, digest/policy authority, stage, and
   clean-rebuild boundary decision.
2. Specify: use `spec-architect` until canonical specs are ready for review.
3. Readiness review: use `spec-readiness-review` until specs are approved.
4. Plan: use `spec-implementation-planner` for waves, tickets, dependencies,
   scopes, status, generation-map ownership, bounded parallel work, and
   test-first order.
5. Implement: use `spec-ticket-implementation` for one ready ticket at a time.
6. Review: use `spec-implementation-review` for wave, partial-wave, merge, or
   release acceptance.
7. Route missing normative content to the architect, stale/failed evidence to
   readiness, and implementation/plan defects to their owning stage.
8. Repeat until no blocking findings remain.
9. Self-audit stage choice, gate evidence, owner routing, skipped checks, and
   residual uncertainty.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-driven-workflow/SKILL.md` | Executable orchestration instructions and trigger metadata. |
| `skills/spec-driven-workflow/references/process-checklist.md` | Ordered gates, handoff matrix, and pause/resume checklist. |
| `skills/spec-driven-workflow/evals/evals.json` | Evaluation scenarios for lifecycle routing. |

## Validation And Safety

Use this skill when a task spans multiple spec-driven stages or when the next
step is unclear. It prevents agents from jumping directly to coding, skipping
planning, backfilling tests after business logic, or leaving ownerless review
feedback. Near-miss single-stage work should route to the specialized skill
instead of forcing orchestration.
