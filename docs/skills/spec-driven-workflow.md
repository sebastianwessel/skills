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

- Chooses between `spec-architect`, `spec-implementation-planner`,
  `spec-ticket-implementation`, and `spec-implementation-review`.
- Defines the lifecycle order: specify, plan, implement, review, route feedback.
- Blocks implementation until specs are approved and tickets are ready.
- Requires planning before parallel agents start coding.
- Routes findings back to the right owner: spec, plan, ticket, or review.
- Supports pause/resume by requiring status, proof, blockers, and next commands.

## How It Works

The skill starts by identifying current artifacts: specs, readiness report,
plans, ticket status, implementation diff, and review findings. It then selects
the current stage and applies the corresponding gate from
`references/process-checklist.md`.

## Workflow

1. Orient: find current artifacts and stage.
2. Specify: use `spec-architect` until specs are approved.
3. Plan: use `spec-implementation-planner` for waves, tickets, dependencies,
   scopes, status, and test-first order.
4. Implement: use `spec-ticket-implementation` for one ready ticket at a time.
5. Review: use `spec-implementation-review` for wave, partial-wave, merge, or
   release acceptance.
6. Route feedback to the owning skill and repeat until no blocking findings
   remain.

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
feedback.
