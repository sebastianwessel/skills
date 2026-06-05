# AI Skills

Reusable AI agent skills maintained in this repository. The work is shaped by
Sebastian Wessel's article
[Spec-Driven Development](https://sebastianwessel.de/articles/spec-driven-development/),
which explains this repository's spec-first approach for keeping autonomous AI
agents aligned from business intent through implementation and review. Each
skill lives in its own subdirectory under `skills/` and follows Anthropic's
[Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## Contents

- [Skill Index](#skill-index)
- [Spec-Driven Workflow](#spec-driven-workflow)
- [Spec-Driven Development](#spec-driven-development)
- [Installation](#installation)
- [Repository Layout](#repository-layout)
- [Documentation Pattern](#documentation-pattern)
- [Adding a Skill](#adding-a-skill)
- [Maintainer Notes](#maintainer-notes)

## Skill Index

<!-- skills-index:start -->
| Skill | Description | Human docs |
| --- | --- | --- |
| [agent-skill-architect](skills/agent-skill-architect/SKILL.md) | Creates, reviews, repairs, and optimizes agent skills. Use when a skill needs authoring, trigger tuning, evals, checks, packaging readiness, or drift controls. | [docs](docs/skills/agent-skill-architect.md) |
| [spec-architect](skills/spec-architect/SKILL.md) | Creates and updates canonical implementation specs. Use when specs need authoring, evolution, source-of-truth repair, contracts, UX, NFRs, release, or supply-chain definition before readiness review. | [docs](docs/skills/spec-architect.md) |
| [spec-driven-workflow](skills/spec-driven-workflow/SKILL.md) | Coordinates the spec-driven lifecycle. Use when choosing order across specs, plans, tickets, reviews, feedback routing, or pause/resume. | [docs](docs/skills/spec-driven-workflow.md) |
| [spec-implementation-planner](skills/spec-implementation-planner/SKILL.md) | Turns approved specs into waves, dependency indexes, AFK tickets, and status tracking. Use when specs need parallel-agent planning, ticket readiness, blockers/unblocks, or plan gap checks. | [docs](docs/skills/spec-implementation-planner.md) |
| [spec-implementation-review](skills/spec-implementation-review/SKILL.md) | Reviews implementation waves against approved specs and tickets. Use when completed or partial work needs acceptance, merge, release, or handoff review with path tracing and persisted findings. | [docs](docs/skills/spec-implementation-review.md) |
| [spec-readiness-review](skills/spec-readiness-review/SKILL.md) | Reviews, repairs, and approves implementation spec readiness. Use when specs need semantic review, deterministic checks, readiness reports, approval gates, or gap repair before planning. | [docs](docs/skills/spec-readiness-review.md) |
| [spec-ticket-implementation](skills/spec-ticket-implementation/SKILL.md) | Implements exactly one approved spec plan ticket in fixed scope. Use when a ready ticket needs code changes with contract/codegen-first, test-first, verification, and no invention. | [docs](docs/skills/spec-ticket-implementation.md) |
<!-- skills-index:end -->

## Spec-Driven Workflow

Use [`spec-driven-workflow`](skills/spec-driven-workflow/SKILL.md) when a task
spans more than one lifecycle stage or when the next step is unclear.

1. Specify with `spec-architect` until specs are approved.
2. Plan with `spec-implementation-planner` until waves, tickets, dependencies,
   scopes, status, and test-first order are ready.
3. Implement one ready ticket with `spec-ticket-implementation`.
4. Review ticket sets or waves with `spec-implementation-review`.
5. Route findings back to the owning skill and repeat until no blocking findings
   remain.

## Spec-Driven Development

Read
[Spec-Driven Development](https://sebastianwessel.de/articles/spec-driven-development/)
for the rationale behind this repository. The article describes how clear specs,
implementation plans, ticket execution, and review gates work together so AI
agents can build production-ready systems without drifting from the intended
business outcome.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

See Vercel's announcement of
[`skills`](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem)
and [skills.sh](https://skills.sh/) for the package ecosystem.

## Repository Layout

```text
skills/
└── <skill-name>/
    └── SKILL.md
```

Optional per-skill directories include `references/`, `scripts/`, `assets/`,
and `agents/`.

Human-facing skill documentation lives outside the executable skill package:

```text
docs/
└── skills/
    └── <skill-name>.md
```

## Documentation Pattern

Each skill should have a concise human docs page with the same structure:

1. What the skill is for.
2. Installation.
3. What it does.
4. How it works.
5. Workflow or modes.
6. Included files.
7. Validation and safety notes.

## Adding a Skill

1. Create `skills/<skill-name>/SKILL.md`.
2. Use concise YAML frontmatter with `name` and `description`.
3. Keep detailed reference material in files linked directly from `SKILL.md`.
4. Add `docs/skills/<skill-name>.md` for human-facing documentation.
5. Refresh this table of contents:

   ```bash
   python3 scripts/update-readme.py
   ```

## Maintainer Notes

Repository instructions for agents are in [AGENTS.md](AGENTS.md). Claude reads
[CLAUDE.md](CLAUDE.md), which points back to the same shared guidance.
