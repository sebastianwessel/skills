# Readiness Gates

Specs are approvable only when every gate passes or is marked not applicable
with evidence.

## No Drift, Ambiguity, And Honesty

- No ticket may decide product behavior, interfaces, errors, security/privacy,
  data lifecycle, async behavior, migrations, performance, observability,
  recovery, tests, or acceptance.
- Replace vague text such as `as appropriate`, `if needed`, `handle errors`,
  `support auth`, `recover gracefully`, `log appropriately`, `securely`,
  `performant`, `TBD`, and `TODO` with exact conditions and outcomes.
- Keep one source of truth per fact; contradictions block approval.
- Self-audit must list weakest assumptions, inferred defaults, evidence, and
  blockers. Do not approve on confidence without evidence.

## Structure, Reuse, And Visualization

Use a business-to-technical structure: outcome and rationale first, then scope,
components/services/packages, workflows, interfaces/data, frontend UX,
operational constraints, and verification. Shared facts live once and are
linked, not copied.

Use Mermaid only when useful for architecture, workflow, sequence, state,
dependency, data-flow, or migration clarity. Diagrams must be kept aligned with
authoritative text and never replace exact contracts or acceptance criteria.

## Interfaces And Runtime Semantics

Every boundary defines owner, audience, stability, version, inputs, outputs,
validation, errors, auth/policy, lifecycle, observability, tests, compatibility.

Cross-language/protocol specs include semantic mapping for source/wire/target
types, required/optional/defaulted fields, `null`, `undefined`, omitted,
zero/empty values, enum unknowns, precision, time zones, IDs, encoding,
ordering, pagination, partial data, errors, and deprecation.

Async specs define runtime model, ordering, concurrency, cancellation, timeout,
retry budget, idempotency key, ack/commit boundary, lease/heartbeat,
backpressure, DLQ/manual escalation, transactions, locks, and worker behavior.

## Paths, Integrity, And Recovery

Each workflow defines success plus relevant validation/auth failure, missing
resource, dependency failure, timeout, cancellation, retry exhaustion,
duplicate/idempotent replay, partial write, rollback/compensation, cleanup,
recovery, manual intervention, and final state.

No path may leave data, jobs, locks, caches, sessions, or external side effects
undefined. Define terminal states, compensating actions, retry limits, owner,
and verification.

## Security, Privacy, Observability, Performance

Define trust boundaries and data classification for public, internal,
confidential, restricted, PII, secrets, and credentials where applicable.

Define authn/authz, tenancy/isolation, input validation, output encoding, secret
handling, retention, redaction, audit events, safe defaults, log levels, event
names, fields, correlation IDs, metrics, traces, and leak-prevention rules.

Define budgets and overload behavior for latency, throughput, memory/CPU,
concurrency, pagination/batching, cache/index use, rate limits, timeouts,
retries/backoff, backpressure, health checks, degraded mode, bounded
self-healing, checkpoints, alerts, and escalation.

## Wave, Migration, And Rationale

A wave may proceed only when it is independently implementable end to end and
future integration contracts are stable. Parallel tickets need disjoint write
scope, frozen contracts, dependencies, acceptance matrix, and verification.

Material changes to implemented behavior need `plans/migrations/<id>.md` with
impact, compatibility, rollout, data migration/backfill, dual-read/write or
adapter strategy, rollback, verification, and owner.

Record rationale for drift-prone decisions: public contracts, architecture,
security, data lifecycle, compatibility, migration, async model,
provider/adapter choices, or non-obvious tradeoffs.
