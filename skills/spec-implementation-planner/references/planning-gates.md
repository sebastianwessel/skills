# Ticket and progress format

Place a ticket in a wave directory, for example
`plans/wave_01_identity/tickets/TICKET-001-create-user.md`. An optional
`plan.md` in the wave can explain shared sequencing, proof or risk.
Ticket IDs are unique across the project. Dependencies name earlier or
same-wave tickets.

```markdown
---
id: TICKET-001
slice: create-user
size: S
depends_on: []
write_scope: [src/identity, tests/identity]
---
# Create a user

Use the existing public handler and identity repository. Read the governing
rules printed by the ticket checker.

1. Verify generated types with npm run contracts:check.
2. Add public-handler tests for creation and duplicate email. Capture failing
   behavior with npm run test:identity.
3. Implement with the existing transaction. Rerun the tests and contract check
   and record the proof for each scenario.
```

A ticket inherits the slice’s acceptance IDs. When splitting a slice, use
`acceptance_ids: [CREATE, DUPLICATE]` to name the scenarios that ticket
verifies. Include all affected tests, generated files and docs in
`write_scope`. Use literal repository-relative files or directories.
Evidence-only work can use `[]`.

Estimate relative complexity and uncertainty. **XS** is localized with focused
proof. **S** is bounded to a component. **M** crosses related boundaries or
needs integration or recovery proof. **L** and **XL** signal substantial
coordination or multiple outcomes. Split independent outcomes and document
the sequencing proof for genuinely atomic work.

## Record the current state

```sh
node <planner>/scripts/check_plan.mjs <repo-root> --ticket TICKET-001
```

The selected check resolves the approval, acceptance IDs, governing sources
and prerequisites. It prints the current `slice_digest` and `ticket_digest`.
Running without `--ticket` checks open work and its prerequisites. Accepted
and blocked tickets outside that scope stay available as history or parked
work. Selecting an old ticket explicitly asks whether its evidence still
applies to current inputs. Read the printed state. A passing check can
describe a planned or blocked ticket. Start execution from a current ready
record or resume an authorized claim.

Write `plans/progress/<ticket-id>.json` when execution has something to track.

| State | Meaning |
| --- | --- |
| Planned | The ticket exists and has no progress record. |
| `ready` | The handoff was reviewed and its prerequisites are accepted. |
| `in_progress` | The controller or project lock has granted a claim. Recheck after claiming. |
| `blocked` | Record a `note` with the reason, work already done and next action. This state needs no digests. |
| `implemented` | The scoped change and required checks have concrete proof. |
| `accepted` | An independent reviewer verified that same implementation revision. |

For `ready`, `in_progress`, `implemented` and `accepted`, record both
printed digests. When there are prerequisites, pin their accepted
`implementation.revision` values in `dependency_revisions`, keyed by ticket
ID. For example, `{"TICKET-001": "commit-abc"}`.

```json
{
  "state": "accepted",
  "slice_digest": "sha256:<approved slice digest>",
  "ticket_digest": "sha256:<ticket definition digest>",
  "implementation": {
    "by": "contributor-a",
    "revision": "immutable-code-revision",
    "changed_files": ["src/identity/create.ts", "tests/identity/create.test.ts"],
    "acceptance": {"CREATE": "CI run 24, create", "DUPLICATE": "CI run 24, duplicate"},
    "verification": ["CI run 24, identity tests and contracts check"],
    "test_first_ref": "CI run 23, failing public-handler assertions"
  },
  "review": {
    "reviewer": "reviewer-b",
    "revision": "immutable-code-revision",
    "evidence_ref": "plans/reviews/TICKET-001.md"
  }
}
```

When a governing input or prerequisite changes, requeue affected unfinished
work with current inputs. When a later decision or refinement changes accepted
behavior, keep the finished wave and its progress as evidence of that revision.
Plan a new wave with fresh IDs that describes the delta from the current
implementation and tests the affected consumers. Cite the earlier revision as
baseline when useful. Declare a ticket dependency only on evidence the new work
still needs to be current. If a shared boundary changed, use the follow-up
ticket for that boundary as the prerequisite for dependent follow-up work.
