# Review Gates

Use these gates after building the path matrix.

## Spec And Interface Conformance

- Approved specs, plan, and tickets align with implementation.
- Requirement IDs trace from specs to plan tickets, changed code, tests,
  verification evidence, and acceptance status.
- Interfaces preserve fields, generated types, nullability, optionality,
  defaults, serialization, async timing, cancellation, retries, errors, and
  compatibility across languages, protocols, clients, services, jobs, and DBs.
- Generated types, clients, validators, stubs, fixtures, docs, and contract
  tests derive from approved machine-readable contract/IDL/schema artifacts
  through deterministic generators/tools when approved tooling or project
  configuration supports generation.
- No hand-written duplicate of an approved generated shape bypasses codegen,
  validation, compatibility, or drift checks.
- No product/API/security/persistence/test behavior was invented locally.

## Tests And Verification

- Ticket and wave verification commands pass.
- Every acceptance criterion and path has behavior evidence.
- Contract and end-to-end tests cover cross-ticket integration.
- Contract/codegen drift checks pass, or N/A evidence matches the approved plan.
- Tests include happy, unhappy, async/error, retry/timeout, and security paths.
- Default checks remain hermetic; external integrations are opt-in.

## Security And Privacy

- Auth, authorization, tenancy, isolation, input validation, output encoding,
  secrets handling, data classification, retention, redaction, log levels,
  audit logging, dependency use, and safe defaults match specs and conventions.
- No sensitive data leaks through logs, errors, metrics, traces, tests,
  fixtures, generated artifacts, caches, or persisted review files.

## Performance And Robustness

- Timeouts, retries, backpressure, batching, pagination, indexing, caching,
  memory/CPU bounds, concurrency, idempotency, rollback, cleanup, and recovery
  are implemented where required.
- No unbounded loops, N+1 work, blocking async calls, duplicate side effects,
  resource leaks, undefined states, data-loss paths, or hidden global state are
  introduced.
- Self-healing/recovery is bounded, idempotent, observable, and escalates when
  retry/recovery budgets are exhausted.

## Production, Release, And Supply Chain

- Deployment, configuration/secrets, readiness/liveness, SLO/error-budget,
  runbook, support handoff, incident response, backup/restore, and operational
  ownership match specs when in scope.
- Release, rollout, rollback, versioning, migration ordering, feature flag
  lifecycle, and artifact promotion match specs.
- Dependency policy, lockfiles, vulnerability/license handling, SBOM,
  provenance/attestation/signing, container/base-image policy, and secret
  scanning match specs when in scope.

## Maintainability And Public Surfaces

- Code is cohesive, readable, convention-aligned, and not over-abstracted.
- Names are speakable; constants are centralized and documented with units.
- Public APIs, exported constants, enum types/values, docs, examples,
  inventories, generated artifacts, and execution semantics are synchronized.
- No unapproved mocks, fakes, stubs, placeholders, no-ops, demo paths, or hidden
  feature flags create false completion.

## Honest Review

Reject rather than guess when evidence is missing. Record assumptions, skipped
commands, unreviewed paths, and residual risk in `review.md`.
