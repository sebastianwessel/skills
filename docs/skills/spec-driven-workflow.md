# Spec-driven development

Describe the feature, correction or outcome you need. The workflow can start
from an idea, an existing spec, a ready ticket or a change awaiting review.

## Installation

```bash
npx skills add sebastianwessel/skills --skill spec-driven-workflow
```

Choose your agent during setup.

## Try it

> Members should be able to cancel their confirmed reservations. A repeat
> request should leave the reservation cancelled. Use our support policy,
> implement the change and show me what you verified.

The agent finds the governing rule, defines the testable outcomes and works
through the applicable review, planning, implementation and verification in
the same conversation. When the policy leaves a material decision open, the
agent asks about the behavior it affects. When approval is needed, it shows
what the approval would cover. Reply in ordinary language and the agent
records the decision and continues when the inputs are current.

## What to expect

- A request to draft, check status or review stays within that scope.
- A delivery request can start with an idea or resume from existing evidence.
  The agent prepares the files, runs the checks and arranges an independent
  review when available.
- If the spec changes after delivery, the agent plans a follow-up against the
  current code and keeps earlier reviews as history.

For a completed change, expect the verified outcome and its evidence. For
work that needs a decision or an independent review, expect the smallest
next action and what it would unblock.

[Project knowledge and worked example](../project-knowledge.md) · [Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-driven-workflow/SKILL.md)
