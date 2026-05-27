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

## Requirements, Structure, Visualization

Requirements, flows, contracts, and NFRs are necessary, singular, feasible,
implementation-independent, unambiguous, consistent, verifiable, traceable.
Use stable IDs, source/rationale, owner, priority/risk when relevant,
verification method (`test`, `inspection`, `analysis`, `demo`), and links from
business outcome to acceptance evidence. Mark N/A with evidence.

Structure specs business-to-technical: outcome/rationale, scope,
components/services/packages, workflows, interfaces/data, frontend UX,
operations, verification. Shared facts live once and are linked. Use Mermaid
only when it improves architecture, workflow, sequence, state, dependency,
data-flow, or migration clarity; diagrams stay aligned with text.

## Standards First

Default to standards for protocols, APIs, schemas, errors, logging,
observability, auth, data formats, storage, frontend, runtime: OpenTelemetry,
structured JSON logs, RFC 9457, OpenAPI/GraphQL/gRPC/protobuf, OAuth/OIDC/JWT,
framework conventions. Custom protocols, log levels, envelopes, serialization,
auth, architecture, or interface semantics need rationale, tooling impact,
migration, and approval.

## Interfaces And Runtime Semantics

Each boundary defines owner, audience, stability, version, inputs, outputs,
validation, errors, auth/policy, lifecycle, observability, tests, compatibility.

Cross-language/protocol specs map source/wire/target types, required/optional,
defaulted, `null`, `undefined`, omitted, zero/empty, enum unknowns, precision,
time zones, IDs, encoding, ordering, pagination, partial data, errors,
deprecation.

Async specs define runtime model, ordering, concurrency, cancellation, timeout,
retry budget, idempotency, ack/commit, lease/heartbeat, backpressure, DLQ/manual
escalation, transactions, locks, worker behavior.

## Paths, Integrity, And Recovery

Each workflow defines success plus validation/auth failure, missing resource,
dependency failure, timeout, cancellation, retry exhaustion, duplicate replay,
partial write, rollback/compensation, cleanup, recovery, manual intervention,
final state. No path may leave data, jobs, locks, caches, sessions, or side
effects undefined.

## Security, Privacy, Observability, Performance

Define trust boundaries, data classification, authn/authz, tenancy/isolation,
validation, output encoding, secrets, retention, redaction, audit events, safe
defaults, log levels, event names/fields, correlation IDs, metrics, traces, and
leak prevention.

Define budgets/overload behavior for latency, throughput, memory/CPU,
concurrency, pagination/batching, cache/index use, rate limits, timeouts,
retries/backoff, backpressure, health checks, degraded mode, bounded healing,
checkpoints, alerts, escalation.

## Production, Release, And Supply Chain

Define production: environments, deployment topology, config/secrets,
readiness/liveness, SLO/SLA/error budgets, runbooks, owner, support handoff,
incident response, backup/restore, disaster recovery, decommissioning.

Define release/supply chain: CI gates, build/test/package, feature flags,
rollout/canary/blue-green, rollback, compatibility, migration ordering,
versioning, artifact promotion, dependency policy, lockfiles,
vulnerability/license handling, SBOM, provenance, signing/attestation,
container/base-image policy, secret scanning. Prefer SPDX/CycloneDX and SLSA.

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
