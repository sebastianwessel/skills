# Implementation review

For a ticket, run
`node <skill-dir>/scripts/check_plan.mjs <repo-root> --ticket <ticket-id>`.
Read the exact governing sources and evidence. Review the immutable revision
or exact diff independently of the implementer. Run project checks as needed
to establish whether the observed outcome matches the spec.

Use the approved scenario IDs as the review index. For each affected
scenario, cite the governing source, relevant code path, actual outcome, and
test or other proof. Use a compact table when it clarifies a cross-boundary
flow. Inspect the actual diff and affected callers.

- **Behavior and boundaries.** Check entry, input validation, authorization,
  client states and accessibility, contracts, generated artifacts, and the
  final response or side effect. Check new public shapes against the owning
  definitions and existing representations. Require a scoped reason for new
  duplication, dependencies, or manual output.
- **Failure and recovery.** Trace relevant timeouts, retries, cancellation,
  duplicates, partial writes, and dependency loss through rollback,
  compensation, or escalation. Check terminal state, idempotency, and
  no-data-loss behavior against the approved paths.
- **Security, privacy, and integrity.** Check trust boundaries, permissions,
  isolation, data classification and retention, secret use, and redaction
  across logs, errors, interfaces, exports, and telemetry. Review test proof
  for no-leak behavior.
- **Production effects.** Review scoped performance budgets, operational
  signals, release and rollback, configuration, supply-chain changes, and
  runbooks. Read examples and user docs when callers or public behavior
  change.
- **Evidence.** Verify actual changed files and consumers, generated-file
  drift, tests, and check outputs. Distinguish skipped, failed, and passing
  checks. Trace findings to specific evidence. Treat fake completion, unknown
  behavior, and untested applicable failure paths as blocking.

### Review record

Give the ticket ID and exact implementation revision, reviewed scope and
consumers, scenario results and evidence links, findings with owners, and the
decision. Reuse a durable PR review or put the result in
`plans/reviews/<ticket-id>.md`. With blockers cleared, record
`review.reviewer`, `review.revision` and `review.evidence_ref`, then mark
the matching implementation revision accepted and rerun the ticket check.
If the record fails validation, withdraw acceptance. With unresolved
findings, keep the work unaccepted and route the cause to the rule, approval,
plan or code that needs repair. A changed implementation requires new review.

For a wave or release, link the current acceptance of each in-scope ticket
and verify the combined outcome on the integration or release revision.
Record the integrated scenario, affected consumers, and applicable operational
and rollback proof. An unverified combined outcome blocks wave or release
acceptance.
