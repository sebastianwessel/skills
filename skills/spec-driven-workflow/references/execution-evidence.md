# Ticket execution and evidence

Run `node <skill-dir>/scripts/check_plan.mjs <repo-root> --ticket <ticket-id>`.
Read the exact governing sources, ticket, progress and baseline. From
`ready`, claim `in_progress` and run the check again before editing. Use the
project's controller or lock when writers overlap in time. In a single-agent
session, record the claim and continue. Resume an existing claim only with
authority. Work within `write_scope`.

Regenerate affected contracts through project tools. Exercise approved
success, error and recovery paths before editing behavior. Capture the
failing assertion or cite existing proof and explain why it applies.
Implement with approved interfaces and existing patterns. Verify affected
consumers, privacy, redaction, integrity, recovery, performance and
operational controls. Refresh affected docs and generated artifacts. Use
authorized inputs and services.

Keep progress in `plans/progress/<ticket-id>.json`. The ticket file owns its
definition and the progress file owns its mutable state. Preserve the checked
slice and ticket digests and the checked `dependency_revisions` while those
inputs remain current. When an input changes, assess the impact and requeue
affected unfinished work.

For successful implementation, set `state` to `implemented` and record the
following fields alongside the current `slice_digest` and `ticket_digest`.

| Field | Record |
| --- | --- |
| `implementation.by` | The implementer identity used for independent review |
| `implementation.revision` | Immutable code revision or durable exact diff reference, with the baseline identifiable from the evidence |
| `implementation.changed_files` | Repository-relative paths from the actual diff. For evidence-only work with an empty list, explain the work in `note`. |
| `implementation.acceptance` | Map from every ticket acceptance ID to its concrete test or inspection result |
| `implementation.verification` | Nonempty list of references to actual verification results |
| `implementation.test_first_ref` | Failing proof before the change, existing coverage, or a scoped rationale for evidence-only work |

Store supporting evidence with access-controlled CI results, repository review
artifacts, or another durable proof location. Cite the command, outcome, and
relevant output or test. Redact secrets and private data. Rerun the selected
ticket checker against the updated record.

For blocked work, record the failed check or missing input, work
already done, and the next action in `note`. Keep unaffected work available.
Check the fixed scope and dependencies before requeueing the ticket. Preserve the previous proof through version history.

A green local test with a stub response, disabled authorization, or skipped
recovery path cannot prove the approved end-to-end outcome. Record evidence
for the actual path, including changed consumers and operations when in scope.
If the evidence check fails, mark the ticket blocked and record what needs to happen next.
