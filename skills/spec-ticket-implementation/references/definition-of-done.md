# Definition of Done

A ticket is done only when all relevant checks pass.

## Code Quality

- [ ] No new static analysis errors or lint warnings in scope.
- [ ] Naming, file/folder structure, and file sizes follow conventions.
- [ ] Types are precise; no unapproved `any`, unchecked casts, dynamic maps, or
      stringly typed contracts.
- [ ] Repeated or semantic hardcoded values are centralized into inline-
      documented constants.
- [ ] Duration, size, count, rate, and limit constants include units in names.
- [ ] No commented-out code or unresolved TODO/FIXME.

## Errors, Logging, And Security

- [ ] Expected errors use canonical types/codes and include useful context.
- [ ] Unexpected errors are caught/wrapped as the project requires.
- [ ] Sync, async, stream, timeout, cancellation, retry, and background task
      failures are handled when relevant.
- [ ] Logs use project conventions, include useful context, and leak no secrets,
      credentials, tokens, personal data, or sensitive payloads.
- [ ] Log levels, event names, redaction, audit/metric/trace behavior, and safe
      error messages match specs.
- [ ] Auth, authorization, tenancy/isolation, validation, output encoding,
      retention, and dependency-safety expectations match specs when in scope.

## Data Integrity, Recovery, And Performance

- [ ] State transitions are defined and cannot leave undefined or partial state.
- [ ] Rollback, compensation, idempotency, retry exhaustion, recovery
      checkpoints, and manual intervention match specs.
- [ ] No data loss, duplicate side effect, stale lock/session/cache, or leaked
      data path remains in scope.
- [ ] Latency, throughput, memory/CPU, pagination, batching, timeout, retry,
      backpressure, and overload behavior match specified budgets when relevant.

## Testing

- [ ] Every acceptance criterion has passing public-interface tests.
- [ ] Happy and relevant unhappy paths are covered.
- [ ] Failure paths have dedicated tests.
- [ ] Test-first evidence exists, or a concrete exception is recorded.
- [ ] Contract tests pass when applicable.
- [ ] Default tests are hermetic and require no external providers, credentials,
      network listeners, daemons, cloud services, browsers, GPUs, or hardware.
- [ ] Opt-in integration tests are skipped by default and require caller-supplied
      env/config.
- [ ] Tests avoid implementation coupling.
- [ ] Test doubles are allowed by the ticket/test strategy and only at external
      boundaries.

## Scope And Spec Compliance

- [ ] Only `write_scope` files changed.
- [ ] Source requirement IDs trace to implemented code paths, tests, and
      acceptance evidence.
- [ ] Acceptance criteria are fully met; non-goals are respected.
- [ ] No unapproved product behavior, contracts, API/event/job/stream schemas,
      persistence, policy, failure, async, error, logging, security,
      performance, or recovery behavior invented.
- [ ] No production mock, fake, stub, placeholder, no-op, hidden flag, or demo
      path remains unless explicitly approved.
- [ ] Public API inventory, execution semantics, docs, examples, and generated
      artifacts are synced when public surfaces change.
- [ ] Manifest identity/version/digest/canonicalization/snapshot/replay rules
      are preserved when manifests are in scope.
- [ ] Release, config/secrets, rollout/rollback, runbook, dependency, SBOM,
      provenance, artifact, vulnerability, and license expectations are met
      when in scope.

## Documentation And Completion

- [ ] Public APIs, exported constants, enum types, and enum values have inline
      comments suitable for IDE help and generated API docs.
- [ ] Public docs/examples are reachable and use intended public paths.
- [ ] Complex logic and plan deviations are documented.
- [ ] Ticket status and changed-file tracking are updated.
- [ ] Ticket commands, scoped project verification, build/compile, static
      analysis, lint, and tests pass.
- [ ] Review-judge loop found no unresolved ticket-scope defect.
- [ ] Assumptions, skipped checks, pre-existing failures, gaps, and residual
      risks are stated honestly.
