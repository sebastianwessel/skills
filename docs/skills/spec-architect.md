# Spec Architect

Use this skill to turn product decisions into the rules that govern a project.
It also handles a change to an existing rule or a gap raised by a reviewer.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Our policy allows a member to cancel their own confirmed reservation.
> Document the first cancellation and a repeated request. Ask who owns any
> policy decision the source leaves open.

Give the agent the policy, approved decision or other source it should use.
Open `specs/index.md` to find the resulting topic page. Look for the actor,
entry point, outcome and any failure or recovery behavior. In
`specs/acceptance.yaml`, each scenario points to a heading on its owning page
and says what someone can verify.

## What happens next

The author owns changes to specs. For an uncertain decision, it records the
affected scope, owner and missing evidence. When a rule changes, it updates
the affected scenarios, contracts or diagrams. The readiness reviewer checks
the revised source and obtains approval before planning begins.

[Worked example](../project-knowledge.md#cancelling-a-reservation) · [Review the spec](spec-readiness-review.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-architect/SKILL.md)
