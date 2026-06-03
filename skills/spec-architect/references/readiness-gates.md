# Readiness Gates

Specs are approvable only when every gate passes or is marked not applicable
with evidence.

## Contents

- No Drift, Ambiguity, And Honesty
- Validation Layers
- Human Decision Requests
- Maintenance, Sync, And Cleanup
- Requirements And Structure
- End-To-End Completeness And Concision
- Standards First
- Machine-Readable Contract Sources
- Interfaces And Runtime Semantics
- Paths, Integrity, And Recovery
- Security, Privacy, Observability, Performance
- Production, Release, And Supply Chain
- Wave, Migration, And Rationale

## No Drift, Ambiguity, And Honesty

- No ticket may decide product behavior, interfaces, errors, security/privacy,
  data lifecycle, async behavior, migrations, performance, observability,
  recovery, tests, or acceptance.
- Machine-checked spec prose is English (`language: en`) unless the checker is
  replaced with language-aware structured validation.
- Replace vague text (`as appropriate`, `if needed`, `handle errors`, `support
  auth`, `recover gracefully`, `TBD`, `TODO`) with exact conditions/outcomes.
- Keep one source of truth per fact; contradictions block approval.
- Self-audit must list weakest assumptions, inferred defaults, evidence, and
  blockers. Confidence without evidence is not approval.

## Validation Layers

Deterministic checks validate files, links, gates, markers, obvious ambiguity,
and English smoke phrases; they do not prove semantic completeness. Semantic
judge review is required. Record `pass`, `fail`, or `n/a` with refs per gate,
trace happy/unhappy/recovery/interface/security/production/supply-chain paths,
and fail on ambiguous behavior, contradictions, unsafe assumptions, inferred
defaults, or implementation judgment.

## Human Decision Requests

Generate from business intent and standards. Ask humans only for missing
business intent, compliance/security boundaries, public semantics, irreversible
architecture, side effects, contradictions, or hard guesses. Ask one decision
with business/technical context, recommendation, alternatives when material,
impact, and blocked refs. Do not ask derivable details.

## Maintenance, Sync, And Cleanup

On `Update`/`Fix Gap`, change the canonical source first, then dependents,
registries, provenance, readiness, diagrams, contracts, and plan impact notes.
Prune stale, duplicate, superseded, contradictory, broad text. Preserve IDs when
meaning stays; create IDs for new behavior. Record superseded IDs, migrations,
affected waves/tickets, and planner follow-up.

## Requirements And Structure

Requirements, flows, contracts, and NFRs are necessary, singular, feasible,
implementation-independent, unambiguous, consistent, verifiable, traceable. Use
IDs, source/rationale, owner, priority/risk, verification method, and acceptance
links. Mark N/A with evidence. Structure specs business-to-technical: outcome,
scope, components, workflows, interfaces/data, UX, operations, verification.
Shared facts live once. Mermaid is optional and aligned.

## End-To-End Completeness And Concision

Specs must prove the full working solution, not only an isolated component.
For every business outcome, `03-flows/e2e-coverage.md` maps entrypoint,
client/consumer or N/A, UI/API state, service path, contract source,
persistence, async/external dependencies, success, failures, recovery/final
state, and verification.

Existing frontends, clients, SDKs, CLIs, integrations, and adapters must be
covered end to end or marked N/A with evidence. Backend-only waves are allowed
only as independently working slices with future client/consumer contracts
frozen.

Specs stay concise: one source of truth per fact, links to contracts and
conventions, no duplicated field lists, repeated trivial rationale, stale prose,
or parallel definitions.

## Standards First

Default to industry-standard or ecosystem-native definitions before custom
text: contract/IDL/schema artifacts, observability, logging, errors, auth,
security controls, architecture, and framework conventions. Examples are
non-exhaustive: OpenAPI, GraphQL, AsyncAPI, JSON Schema, protobuf/gRPC,
CloudEvents, Avro, Thrift, Smithy, OpenRPC/RAML, YANG, WSDL, schema
registries. Custom choices need rationale, tooling impact, migration, approval.

## Machine-Readable Contract Sources

Interfaces, APIs, events, queues, webhooks, plugins, configs, SDK/CLI surfaces,
and durable data shapes use the best-fit standard or ecosystem-native
contract/IDL/schema source when one fits. Select by transport, ecosystem,
interop, generator support, compatibility checks, runtime validation. Human
specs explain intent/flows/UX/security/failures/operations and link to
contracts instead of duplicating fields. Specs name generators, commands,
outputs, generated tests, and drift checks when tooling exists. Manual/custom
contracts need rationale, approval, and evidence generation is unavailable or
unsafe. N/A needs evidence that no interface, transport, message, config,
extension, or durable data contract is in scope.

## Interfaces And Runtime Semantics

Each boundary defines owner, audience, stability, version, inputs, outputs,
validation, errors, auth/policy, lifecycle, observability, tests. Cross-language
specs map source/wire/target types, required/optional, defaulted, `null`,
`undefined`, omitted, zero/empty, unknown enums, precision, time zones, IDs,
encoding, ordering, pagination, partial data, errors. Contracts define wire
names, serialization, nullability, versioning, compatibility, generation
targets, validation entry points, owner. Diagrams/docs link back to contracts.
Async specs define runtime model, ordering, concurrency, cancellation, timeout,
retry budget, idempotency, ack/commit, lease, backpressure, DLQ, transactions,
locks, worker behavior.

## Paths, Integrity, And Recovery

Each workflow defines success, failure, timeout, cancellation, retry exhaustion,
duplicate replay, partial write, rollback/compensation, cleanup, recovery,
manual intervention, final state. No data, jobs, locks, caches, sessions, or
side effects may be undefined.

## Security, Privacy, Observability, Performance

Define trust boundaries, classification, authn/authz, isolation, validation,
encoding, secrets, retention, redaction, audit/log fields, correlation IDs,
metrics, traces, leak prevention. Define budgets/overload for latency,
throughput, memory/CPU, concurrency, pagination/batching, cache/index use, rate
limits, timeouts, retries/backoff, backpressure, health checks, degraded mode,
bounded healing, alerts.

## Production, Release, And Supply Chain

Define production: environments, topology, config/secrets, readiness/liveness,
SLO/SLA/error budgets, runbooks, owner, support handoff, incident response,
backup/restore, disaster recovery, decommissioning. Define release/supply
chain: CI, build/package, flags, rollout/rollback, compatibility, migration
order, versioning, artifacts, dependencies, lockfiles, vulnerability/license,
SBOM, provenance, signing, containers, secret scanning. Prefer
SPDX/CycloneDX/SLSA.

## Wave, Migration, And Rationale

A wave may proceed only when independently implementable end to end and future
integration contracts are stable. Parallel tickets need disjoint write scope,
frozen contracts, dependencies, acceptance matrix, verification. Material
implemented-behavior changes need `plans/migrations/<id>.md`: impact,
compatibility, rollout, data migration/backfill, adapter strategy, rollback,
verification, owner. Record rationale for drift-prone decisions: public
contracts, architecture, security, lifecycle, compatibility, migration, async
model, provider/adapter choices, non-obvious tradeoffs.
