# Spec Driven Workflow

Use the coordinator when work spans stages or you need to resume a project.
It follows evidence in the project to identify the next task and its owner.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> We paused after implementing the cancellation ticket. Which stage is next?
> Show me the record that supports your answer and any decision I owe.

Start in the project workspace. The coordinator reads the spec and approval,
then the relevant ticket, progress record and review evidence. An implemented
ticket with fresh verification goes to independent review. If its governing
rule changed after approval, that slice needs fresh approval before affected work resumes. Other slices can keep moving.

## Follow the handoff

Expect the name of the owning skill, the relevant files, what they establish
and any blocker. On resume, use the recorded evidence and current source
revision. An open policy choice goes to the spec author. An unclear ticket
scope goes to the planner. A missing implementation test goes back to the
ticket implementer.

[Choose a stage directly](../README.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-driven-workflow/SKILL.md)
