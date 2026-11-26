# Spec Architect

Use this skill to start with a product idea or revise a rule already in use.
Keep open questions visible as the team learns and builds.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Our policy allows a member to cancel their own confirmed reservation.
> Document the first cancellation and a repeated request. Record any open policy choice next to the behavior it affects.

Give the agent the policy, approved decision or other source it should use.
Open `specs/index.md` to find the resulting topic page. Look for the actor,
entry point, outcome and any failure or recovery behavior. In
`specs/acceptance.yaml`, each scenario points to a heading on its owning page
and says what someone can verify.

## What happens next

On a rule change, update the relevant scenario, contract or diagram. Record
unanswered decisions next to their rule and name a decision-maker when useful.
When enough is defined for one outcome, ask for readiness review of that slice.
Keep the rest of the project open for refinement.

[Worked example](../project-knowledge.md#cancelling-a-reservation) · [Review the spec](spec-readiness-review.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-architect/SKILL.md)
