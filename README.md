# Spec-driven development skills

Use these skills to turn a product decision into software you can review. People
and agents read the same project specs. Each ticket names the behavior it
implements and the evidence a reviewer needs to accept it.

## Installation

In the project where you want to use the skills, run:

```bash
npx skills add sebastianwessel/skills
```

Select the six `spec-*` skills for the development workflow. The seventh,
`agent-skill-architect`, is for people who build reusable skills.

## Try it in your project

Give your agent a business rule and its source. For example:

> Our approved support policy says a member can cancel their own confirmed
> reservation. Repeating a cancellation leaves it cancelled. Use Spec Architect
> to document this flow. Flag any decisions the policy leaves open.

Open `specs/index.md`. Follow the link to the cancellation rule and check what
happens on a repeat request. When the rule matches your intent, ask for a
readiness review. You approve the reviewed revision before an agent plans
implementation. If your project already has tickets, ask Spec Driven Workflow
which ticket can run next and what evidence supports that choice.

[Choose a skill](docs/README.md) · [Worked acceptance example](docs/project-knowledge.md#cancelling-a-reservation) · [Spec-driven development rationale](https://sebastianwessel.de/articles/spec-driven-development/)

## Skill index

<!-- skills-index:start -->
| Skill | Description | Human docs |
| --- | --- | --- |
| [agent-skill-architect](skills/agent-skill-architect/SKILL.md) | Creates and improves Agent Skills packages. Use when writing a skill, fixing trigger overlap, shortening instructions, testing scenario behavior, or checking a skill before distribution. | [docs](docs/skills/agent-skill-architect.md) |
| [spec-architect](skills/spec-architect/SKILL.md) | Writes and revises project specs. Use when defining a business rule, system behavior, component boundary, failure path, decision, or acceptance scenario, or repairing a finding in a spec. | [docs](docs/skills/spec-architect.md) |
| [spec-driven-workflow](skills/spec-driven-workflow/SKILL.md) | Routes work through project knowledge, approval, planning, implementation, and review. Use when starting a spec-driven project, resuming work, or choosing which stage owns a blocker. | [docs](docs/skills/spec-driven-workflow.md) |
| [spec-implementation-planner](skills/spec-implementation-planner/SKILL.md) | Turns approved specs into scoped, dependency-ordered tickets. Use when creating or repairing a delivery plan, assigning acceptance scenarios, sizing work, or deciding which ticket can start. | [docs](docs/skills/spec-implementation-planner.md) |
| [spec-implementation-review](skills/spec-implementation-review/SKILL.md) | Independently reviews code and evidence against approved specs and tickets. Use when implemented work needs acceptance, merge review, or release verification. | [docs](docs/skills/spec-implementation-review.md) |
| [spec-readiness-review](skills/spec-readiness-review/SKILL.md) | Reviews a spec bundle and verifies approval for planning. Use when checking a draft, resolving review findings against revised sources, or deciding whether planning can begin. | [docs](docs/skills/spec-readiness-review.md) |
| [spec-ticket-implementation](skills/spec-ticket-implementation/SKILL.md) | Implements one ready ticket against approved project specs. Use when a specific ticket can be executed within its write scope with test-first verification. | [docs](docs/skills/spec-ticket-implementation.md) |
<!-- skills-index:end -->

## Maintaining this collection

Each installable package lives in `skills/<name>/`. Human guides live in
`docs/skills/`. After changing an entry, refresh the index and run the checks.

```bash
python3 scripts/update-readme.py
node scripts/check-all.mjs
```

[Repository conventions](AGENTS.md) · [Skill authoring guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
