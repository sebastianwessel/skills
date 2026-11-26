# Get started

Install the workflow in the project where you work.

```bash
npx skills add sebastianwessel/skills --skill spec-driven-workflow
```

After setup, tell your agent what you want to accomplish in your own words.

| What you can ask | What the agent does |
| --- | --- |
| “We want members to cancel their own reservations. Write down the rule and flag decisions we still owe.” | Starts or updates the project spec and records open questions |
| “Customers are seeing a different result the second time they cancel. Fix it so the reservation stays cancelled.” | Checks the governing rule and takes the requested change through delivery as far as the evidence permits |
| “What can we finish next?” | Reads the spec, approvals and ticket progress and reports the next available outcome |
| “Can this change ship?” | Reviews the actual change against the agreed behavior, risks and proof |

The agent handles the stages, files and checks. If an authorized decision is
needed, it will show you the affected behavior and ask about that decision.
To keep working after a pause, say what you want to continue.

[How the workflow works](skills/spec-driven-workflow.md) · [Worked example](project-knowledge.md#cancelling-a-reservation)

If you maintain agent skills, see the [Agent Skill Architect guide](skills/agent-skill-architect.md).
