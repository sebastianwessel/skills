# Write Scope Discipline

`write_scope` is the exact allowed change boundary for one ticket.

## Rules

- Every created or modified file must start with a `write_scope` path.
- Files outside scope may be read for approved context, never changed.
- If implementation needs an out-of-scope file, stop and report the path as a
  spec/plan gap.
- New packages may include only minimum required files inside the scoped package
  directory.
- Root config and shared contracts require explicit scope. If missing, stop.
- If an interface is outside scope, implement against it exactly or stop on
  mismatch.
- Do not create production mocks, fakes, stubs, placeholders, no-ops, hidden
  feature flags, or hardcoded demo paths to appear complete.

## Verify

- Compare every changed path with `write_scope`.
- Revert any out-of-scope edit and report a blocker.
- Confirm no contract changed merely to fit implementation code.

## Anti-Patterns

| Anti-Pattern | Result |
| --- | --- |
| Fixed another module | Block: separate ticket |
| Improved global errors | Block: scope expansion |
| Added shared utility | Block: separate contract/design |
| Updated contract to match code | Block: spec change |
| Refactored for consistency | Block: unrelated change |
| Used temporary fake service | Block unless explicitly approved |
