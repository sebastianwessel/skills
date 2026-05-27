# Readiness Gates

Specs are approvable only when every gate passes or is marked not applicable
with evidence.

## No Drift, Ambiguity, And Honesty

- No ticket may decide product behavior, interfaces, errors, security/privacy,
  data lifecycle, async behavior, migrations, performance, observability,
  recovery, tests, or acceptance.
- Machine-checked spec prose is English (`language: en`) unless the checker is
  replaced with language-aware structured validation.
- Replace vague text such as `as appropriate`, `if needed`, `handle errors`,
  `support auth`, `recover gracefully`, `log appropriately`, `securely`,
  `performant`, `TBD`, and `TODO` with exact conditions and outcomes.
- Keep one source of truth per fact; contradictions block approval.
- Self-audit must list weakest assumptions, inferred defaults, evidence, and
  blockers. Do not approve on confidence without evidence.

## Validation Layers

Deterministic checks validate files, links, gates, markers, obvious ambiguity,
and English smoke phrases. They do not prove semantic completeness.

Semantic judge review is required before approval. Record verdict, evidence,
gaps, uncertainty, and ambiguous implementation risk. Failed/missing judge
blocks approval.

Judge steps: read approved specs/registries/provenance/gaps only. Record
`pass`, `fail`, or `n/a` with refs per gate. Trace happy, unhappy, recovery,
interface, security/privacy, production/release, supply-chain paths. Fail if two
agents could implement different valid behavior, or if decisions,
contradictions, unsafe assumptions, inferred defaults, or judgment remain.

## Human Decision Requests

Generate specs autonomously from business intent and standards. Ask humans only
for missing business intent, compliance/security boundaries, public semantics,
irreversible architecture, material side effects, contradictions, or hard guesses.

Ask crisply: decision, business/technical context, recommendation, useful
alternatives with pros/cons, impact, blocked refs. Do not ask about details
derivable from standards or project conventions.

## Requirements And Structure

Requirements, flows, contracts, NFRs are necessary, singular, feasible,
implementation-independent, unambiguous, consistent, verifiable, traceable. Use
IDs, source/rationale, owner, priority/risk, verification method, links to
acceptance. Mark N/A with evidence.

Structure specs business-to-technical: outcome/rationale, scope, components,
workflows, interfaces/data, UX, operations, verification. Shared facts live
once. Mermaid is optional and aligned.

## Standards First

Default to standards: OpenTelemetry, structured JSON logs, RFC 9457,
OpenAPI/GraphQL/gRPC/protobuf, OAuth/OIDC/JWT, framework conventions.
Custom protocols, log levels, envelopes, serialization, auth, architecture, or
interface semantics need rationale, tooling impact, migration, and approval.

## Interfaces And Runtime Semantics

Each boundary defines owner, audience, stability, version, inputs, outputs,
validation, errors, auth/policy, lifecycle, observability, tests.

Cross-language/protocol specs map source/wire/target types, required/optional,
defaulted, `null`, `undefined`, omitted, zero/empty, enum unknowns, precision,
time zones, IDs, encoding, ordering, pagination, partial data, errors.

Async specs define runtime model, ordering, concurrency, cancellation, timeout,
retry budget, idempotency, ack/commit, lease/heartbeat, backpressure, DLQ,
transactions, locks, worker behavior.

## Paths, Integrity, And Recovery

Each workflow defines success, failure, timeout, cancellation, retry exhaustion,
duplicate replay, partial write, rollback/compensation, cleanup, recovery,
manual intervention, final state. No data, jobs, locks, caches, sessions, or
side effects may be undefined.

## Security, Privacy, Observability, Performance

Define trust boundaries, data classification, authn/authz, isolation,
validation, encoding, secrets, retention, redaction, audit/log fields,
correlation IDs, metrics, traces, leak prevention.

Define budgets/overload for latency, throughput, memory/CPU, concurrency,
pagination/batching, cache/index use, rate limits, timeouts, retries/backoff,
backpressure, health checks, degraded mode, bounded healing, alerts.

## Production, Release, And Supply Chain

Define production: environments, topology, config/secrets, readiness/liveness,
SLO/SLA/error budgets, runbooks, owner, support handoff, incident response,
backup/restore, disaster recovery, decommissioning.

Define release/supply chain: CI, build/package, feature flags, rollout,
rollback, compatibility, migration ordering, versioning, artifacts, dependency
policy, lockfiles, vulnerability/license handling, SBOM, provenance,
signing/attestation, containers, secret scanning. Prefer SPDX/CycloneDX/SLSA.

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
