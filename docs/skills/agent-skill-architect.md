# Agent Skill Architect

Use this skill when you maintain a reusable agent skill. It can create one,
repair unclear instructions or investigate why the wrong skill activates.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Our release-notes skill also activates when people ask for a release plan.
> Review its description. Try a release-notes request, a release-planning
> request and a mixed request, and show which behavior changed.

Bring the existing package or describe the intended users, inputs and output.
The agent inspects how the skill is discovered, which resources it loads, what
it must verify and when it should stop. Expect a concise `SKILL.md` and
supporting references, examples or scripts where the work needs them.

## Check the result

Ask for the package checks and the observed results of realistic prompts.
Check whether the correct skill activated and inspect the produced artifact
against the expected outcome. Record which cases actually ran and which
outcomes still need verification.

[Agent Skills specification](https://agentskills.io/specification) · [Evaluating skill outputs](https://agentskills.io/skill-creation/evaluating-skills)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/agent-skill-architect/SKILL.md)
