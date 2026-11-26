# Spec-driven development skills

Use these skills to refine a living project spec while delivering software in
reviewable slices. People and agents read the same business rules, system
boundaries and flows. Each slice can move when its governing behavior and
verification are clear.

## Installation

In the project where you want to use the skills, run:

```bash
npx skills add sebastianwessel/skills --skill spec-driven-workflow
```

After setup, describe the outcome you want. The agent handles the workflow
stages and asks you for material decisions or approvals when needed.

## Try it in your project

> Our support policy says a member can cancel their own confirmed
> reservation. Repeating a cancellation leaves it cancelled. Implement that
> behavior and show me what you verified.

To get a draft or review, ask for that directly. To resume delivery, say
which outcome to continue. The agent reads the current spec and progress.

[Get started](docs/README.md) · [Worked example](docs/project-knowledge.md#cancelling-a-reservation) · [Spec-driven development rationale](https://sebastianwessel.de/articles/spec-driven-development/)

## Skill index

<!-- skills-index:start -->
| Skill | Description | Human docs |
| --- | --- | --- |
| [agent-skill-architect](skills/agent-skill-architect/SKILL.md) | Creates and improves Agent Skills packages. Use when writing a skill, fixing trigger overlap, shortening instructions, testing scenario behavior, or checking a skill before distribution. | [docs](docs/skills/agent-skill-architect.md) |
| [spec-driven-workflow](skills/spec-driven-workflow/SKILL.md) | Carries product and engineering changes from a living spec to verified code. Use when turning an idea or requirement into a project spec, changing business or system behavior, planning or completing a delivery slice, resuming work in a spec-driven repo, or checking if a change is ready to ship. Routine edits outside a spec-driven project use the normal development process. | [docs](docs/skills/spec-driven-workflow.md) |
<!-- skills-index:end -->

## Maintaining this collection

Each installable package lives in `skills/<name>/`. Human guides live in
`docs/skills/`. After changing an entry, refresh the index and run the checks.

```bash
python3 scripts/update-readme.py
node scripts/check-all.mjs
```

[Repository conventions](AGENTS.md) · [Skill authoring guidance](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
