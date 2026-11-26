# Spec Implementation Planner

Use this skill to divide approved behavior into tickets an agent can complete
and a reviewer can accept independently. It identifies which tickets may run
at the same time.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Plan the approved reservation flow. Keep cancellation and its repeat-request
> behavior together if one testable change can deliver both. Show which
> tickets can start and which must wait.

Bring the approved spec revision and its acceptance IDs. The planner writes
tickets under `plans/wave_XX_slug/tickets/`. Each ticket identifies its spec
headings, acceptance scenarios, allowed writes and prerequisite tickets.
Relative sizes run from XS to XL. A ticket that needs its own design decision
goes back to the spec author.

## Read a ticket

Read the intended outcome and verification before looking at its size.
For the cancellation example, a ticket may cite both `AC-CANCEL` and
`AC-CANCEL-REPEAT` and name the service and test paths it can change.
Independent tickets can run together when their changes are compatible.
Prerequisite tickets must be accepted before dependent work becomes ready.

The ticket contains the fixed instructions. Once it advances beyond planning,
its state and evidence live in `plans/progress/<id>.json`. A ticket without
a progress record is planned.

[See the acceptance example](../project-knowledge.md#cancelling-a-reservation) · [Implement a ready ticket](spec-ticket-implementation.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-implementation-planner/SKILL.md)
