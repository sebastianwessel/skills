# Choose a skill

Start with the question you need answered. You can enter at any stage where
the required evidence already exists.

| What you need | Skill | What to look for |
| --- | --- | --- |
| “We paused last week. What can move forward?” | [Spec Driven Workflow](skills/spec-driven-workflow.md) | The next owner, evidence and any blocker |
| “What should happen when a customer cancels twice?” | [Spec Architect](skills/spec-architect.md) | A governing rule in `specs/` and testable outcomes |
| “Can the team plan against these requirements?” | [Spec Readiness Review](skills/spec-readiness-review.md) | Findings or approval tied to the reviewed source |
| “Which parts can we build independently?” | [Spec Implementation Planner](skills/spec-implementation-planner.md) | Tickets with fixed scope, dependencies and acceptance IDs |
| “Implement this ready ticket.” | [Spec Ticket Implementation](skills/spec-ticket-implementation.md) | A scoped change and verification evidence |
| “Can we accept this change?” | [Spec Implementation Review](skills/spec-implementation-review.md) | An independent decision backed by path and consumer evidence |
| “How can I make my own reusable skill reliable?” | [Agent Skill Architect](skills/agent-skill-architect.md) | A skill package, checks and realistic evaluations |

## Your first run

Install the skill collection in your project and select the six `spec-*` skills
if you want the full development workflow.

```bash
npx skills add sebastianwessel/skills
```

> Use Spec Architect. Our approved support policy allows a member to cancel a
> confirmed reservation they own. If they repeat the request, the reservation
> stays cancelled. Document the rule, the repeat request and any unanswered
> questions.

Open the project map at `specs/index.md` and follow the rule into its
acceptance scenarios. When you agree on what happens, ask for a readiness
review. The reviewer will identify the exact revision that needs your approval.
[Follow the cancellation example](project-knowledge.md#cancelling-a-reservation)
