# Testing And Verification Checklist

- Unit, contract/generated, integration, E2E, browser/client, migration,
  security, performance, and regression tests or N/A.
- Test-first happy and unhappy paths, including validation, authorization,
  timeout, retry, cancellation, recovery, logging/redaction, and error paths.
- Expected failing proof before implementation or already-existing proof traced
  to requirement IDs and contracts.
- Hermetic fixtures, approved test doubles, opt-in external integrations, and
  no production fake/stub/placeholder paths.
- Coverage thresholds, lint, static analysis, type checks, build, drift checks,
  and final review evidence against specs, tickets, changed files, and
  acceptance matrix.
