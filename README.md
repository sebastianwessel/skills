# Spec-driven development skills

Use these skills to refine a living project spec while delivering software in
reviewable slices. People and agents read the same business rules, system
boundaries and flows. Each slice can move when its governing behavior and
verification are clear.

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
readiness review for that slice. Once it is approved, an agent can plan the
work while you refine other parts of the project. If your project already has tickets, ask Spec Driven Workflow
which ticket can run next and what evidence supports that choice.

[Choose a skill](docs/README.md) · [Worked acceptance example](docs/project-knowledge.md#cancelling-a-reservation) · [Spec-driven development rationale](https://sebastianwessel.de/articles/spec-driven-development/)

## Skill index

<!-- skills-index:start -->
| Skill | Description | Human docs |
| --- | --- | --- |
| [agent-skill-architect](skills/agent-skill-architect/SKILL.md) | Creates and improves Agent Skills packages. Use when writing a skill, fixing trigger overlap, shortening instructions, testing scenario behavior, or checking a skill before distribution. | [docs](docs/skills/agent-skill-architect.md) |
| [spec-architect](skills/spec-architect/SKILL.md) | Writes and refines living project specs. Use when exploring business intent, defining behavior or failure paths, recording decisions, or resolving an open question. | [docs](docs/skills/spec-architect.md) |
| [spec-driven-workflow](skills/spec-driven-workflow/SKILL.md) | Finds the next step for a change in a living spec. Use when starting or resuming spec-driven work, handling a refinement, or routing a blocker. | [docs](docs/skills/spec-driven-workflow.md) |
| [spec-implementation-planner](skills/spec-implementation-planner/SKILL.md) | Turns an approved spec slice into sized, dependency-ordered tickets. Use when defining, splitting, requeueing, or preparing tickets for execution. | [docs](docs/skills/spec-implementation-planner.md) |
| [spec-implementation-review](skills/spec-implementation-review/SKILL.md) | Independently reviews implemented tickets against approved slices. Use when accepting a change or checking integrated behavior for a wave or release. | [docs](docs/skills/spec-implementation-review.md) |
| [spec-readiness-review](skills/spec-readiness-review/SKILL.md) | Reviews and verifies approval of a defined spec slice. Use when checking whether selected behavior and its governing sources are ready to implement or need decisions. | [docs](docs/skills/spec-readiness-review.md) |
| [spec-ticket-implementation](skills/spec-ticket-implementation/SKILL.md) | Implements one ready ticket against its approved spec slice. Use when a bounded ticket needs scoped changes and test-first verification. | [docs](docs/skills/spec-ticket-implementation.md) |
<!-- skills-index:end -->

## Maintaining this collection

Each installable package lives in `skills/<name>/`. Human guides live in
`docs/skills/`. After changing an entry, refresh the index and run the checks.

```bash
python3 scripts/update-readme.py
node scripts/check-all.mjs
```

[Repository conventions](AGENTS.md) · [Skill authoring guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
