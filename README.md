# AI Skills

Reusable AI agent skills maintained in this repository. Each skill lives in its
own subdirectory under `skills/` and follows Anthropic's
[Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## Contents

- [Skill Index](#skill-index)
- [Installation](#installation)
- [Repository Layout](#repository-layout)
- [Documentation Pattern](#documentation-pattern)
- [Adding a Skill](#adding-a-skill)
- [Maintainer Notes](#maintainer-notes)

## Skill Index

<!-- skills-index:start -->
| Skill | Description | Human docs |
| --- | --- | --- |
| [spec-architect](skills/spec-architect/SKILL.md) | Use when specs need creation, review, repair, or approval before autonomous or parallel AI implementation without ambiguity, invention, interface mismatch, drift, or gaps. | [docs](docs/skills/spec-architect.md) |
| [spec-implementation-planner](skills/spec-implementation-planner/SKILL.md) | Use when approved specs need end-to-end waves, AFK tickets, parallel-agent plans, dependencies, status tracking, or readiness checks. | [docs](docs/skills/spec-implementation-planner.md) |
| [spec-ticket-implementation](skills/spec-ticket-implementation/SKILL.md) | Use when implementing one approved spec plan ticket with strict read/write scope, acceptance verification, dependency checks, and no implementation-time decisions. | [docs](docs/skills/spec-ticket-implementation.md) |
<!-- skills-index:end -->

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
