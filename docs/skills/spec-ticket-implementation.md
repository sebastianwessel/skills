# Spec Ticket Implementation

Use this skill to implement one ready ticket. Give the agent the ticket ID or
its path. It checks the approved spec, ticket digest, progress and accepted
dependencies before editing production files.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Implement the ready cancellation ticket. Follow the referenced spec and
> show which evidence verifies the first and repeated requests.

The implementer starts with the ticket's acceptance scenarios and writes the
corresponding tests before the behavior. When a contract generates types or
clients, it follows the project's generation process. It edits the declared
write scope, including product documentation when that is a ticket deliverable.
A missing policy decision goes to the author. A necessary edit outside the
approved scope goes to the planner.

## Inspect the handoff

Open the diff and `plans/progress/<id>.json`. Look for the implementation
revision, changed files, test-first evidence, verification results and evidence
for each acceptance ID. The implementation then goes to independent review.
When a check fails or a required path remains unverified, the handoff names
the gap and its effect.

[Review the implementation](spec-implementation-review.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-ticket-implementation/SKILL.md)
