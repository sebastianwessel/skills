# Spec Implementation Review

Use this skill to make an independent acceptance decision for an implemented
ticket or a set of tickets. Supply the requested scope and open the ticket,
its progress record and the implementation revision.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Review the cancellation ticket. Follow the original and repeated requests
> through the real entry point and persistence. Check affected consumers and
> say whether this revision meets both acceptance scenarios.

The reviewer traces each affected path from input through the observable
result. This includes applicable denial, retry, data integrity, redaction,
recovery and rollback behavior. For a public interface change, it also checks
the consumers and user-facing documents affected by that change. It compares
the diff and project verification with the approved scenarios.

## Read the decision

On acceptance, the ticket's progress record identifies the independent
reviewer, the revision and the review evidence. A finding identifies the
unverified path or defect, the source or scenario involved, and who can fix
it. A partial review tells you exactly which work it covered.

For a wave or release, the review also records the integrated outcome, current
member ticket decisions, affected consumers, and operational and rollback
evidence for the exact candidate revision.

[Fix a ticket](spec-ticket-implementation.md) · [Route a spec or plan gap](spec-driven-workflow.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-implementation-review/SKILL.md)
