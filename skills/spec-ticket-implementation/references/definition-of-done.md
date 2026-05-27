# Definition of Done

A ticket is DONE only when ALL items are verified.

## Code Quality

- [ ] No new static analysis errors in scope
- [ ] No new linting warnings in scope
- [ ] Files within project size limits (from conventions)
- [ ] Naming follows project conventions
- [ ] No commented-out code
- [ ] No unresolved TODO or FIXME comments

## Error Handling

- [ ] All error paths handled (not silently ignored)
- [ ] Errors use project's canonical error types
- [ ] Error codes match the project's error taxonomy
- [ ] Errors include meaningful context
- [ ] Unexpected errors are caught and wrapped
- [ ] Error messages do not leak secrets or sensitive data

## Testing

- [ ] All tests pass (0 failures)
- [ ] Every public interface has at least one test
- [ ] Every acceptance criterion has a test that verifies it
- [ ] Failure paths have dedicated tests (not only happy path)
- [ ] Contract tests pass (if applicable)
- [ ] Default tests are hermetic and do not require external providers,
      credentials, network listeners, local daemons, cloud services, browsers,
      GPUs, or hardware
- [ ] Opt-in integration tests are skipped by default and can be enabled only by
      caller-supplied env/config
- [ ] Tests verify behavior through public interfaces only
- [ ] Tests are not coupled to implementation details

## Verification

- [ ] ALL verification commands from the ticket pass
- [ ] Static analysis: 0 errors in scope
- [ ] Linting: 0 warnings in scope
- [ ] Tests: all pass, 0 failures
- [ ] Build/compilation: succeeds (if applicable)
- [ ] Root/default verification scripts do not set env flags that force external
      integration tests

## Scope

- [ ] ONLY files in `write_scope` were modified
- [ ] No out-of-scope changes made
- [ ] Acceptance criteria ALL met (not partially)
- [ ] Non-goals respected
- [ ] No scope expansion attempted
- [ ] No product behavior, contracts, API/event/job/stream schemas, persistence semantics, policy, or failure behavior invented outside approved specs
- [ ] Public API inventory entries, execution semantics classification, docs,
      examples, and generated artifacts were updated together when a public
      surface changed
- [ ] Durable manifest changes preserve version, digest, canonicalization,
      immutable snapshot, replay, compatibility, and validation-error semantics
- [ ] Raw refs are not the default public developer path when a public
      builder/helper is specified

## Documentation

- [ ] Public APIs documented
- [ ] Public docs/examples are reachable and use the intended public
      builder/helper path unless documenting an explicit advanced escape hatch
- [ ] Complex logic annotated
- [ ] Deviations from plan documented

## Completion

- [ ] Ticket status updated to `done`
- [ ] Files created/modified recorded
- [ ] Status tracking file updated
- [ ] Any discovered missing spec was reported instead of implemented by guesswork
