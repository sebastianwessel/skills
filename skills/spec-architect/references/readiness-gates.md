# Readiness Gates

Specs are approvable only when every gate passes or is marked not applicable
with evidence.

## Contents: Gate Sections Below

## No Drift, Ambiguity, And Honesty

- No ticket may decide behavior, interfaces, errors, security/privacy, data
  lifecycle, async, migrations, performance, observability, recovery, tests, or
  acceptance.
- Machine-checked spec prose is English (`language: en`) unless the checker is
  replaced with language-aware structured validation.
- Replace vague text (`as appropriate`, `if needed`, `handle errors`, `support
  auth`, `recover gracefully`, `TBD`, `TODO`) with exact conditions/outcomes.
- Keep one source of truth per fact; contradictions block approval.
- Self-audit must list weakest assumptions, inferred defaults, evidence, and
  blockers. Confidence without evidence is not approval.

## Validation Layers

Deterministic checks validate files, links, gates, markers, obvious ambiguity,
and English smoke phrases only. Semantic judge review records `pass`/`fail`/
`n/a` with refs per gate, traces happy/unhappy/recovery/interface/security/
production/supply-chain paths, and fails ambiguous behavior, contradictions,
unsafe assumptions, inferred defaults, or implementation judgment.

## Human Decision Requests

Generate from business intent and standards. Ask humans only for missing intent,
compliance/security, public semantics, irreversible architecture, side effects,
contradictions, or hard guesses. Ask one decision with context,
recommendation, material alternatives, impact, blocked refs.

## Maintenance, Sync, And Cleanup

On `Update`/`Fix Gap`, change canonical source first, then dependents,
registries, provenance, readiness, diagrams, contracts, plan notes. Prune
stale/duplicate/superseded/contradictory text. Preserve IDs when meaning stays;
create IDs for new behavior. Record superseded IDs, migrations, affected
waves/tickets, planner follow-up.

## Requirements And Structure

Requirements, flows, contracts, NFRs are necessary, singular, feasible,
implementation-independent, unambiguous, consistent, verifiable, traceable:
IDs, source/rationale, owner, priority/risk, verification, acceptance links.
Mark N/A with evidence. Structure business-to-technical: outcome, scope,
components, workflows, interfaces/data, UX, operations, verification. Shared
facts live once. Mermaid is optional and aligned.

## End-To-End Completeness And Concision

Specs prove the full working solution, not an isolated component.
`03-flows/e2e-coverage.md` maps each outcome to entrypoint, client/consumer or
N/A, UI/API state, service path, contract, persistence, async/external deps,
success/failures, recovery/final state, verification. Existing frontends,
clients, SDKs, CLIs, integrations, adapters are covered or N/A. Backend-only
waves need an independently working slice and frozen future client contracts.
Keep one source per fact; link contracts/conventions; no duplicate fields,
stale prose, or parallel definitions.

## Frontend, UX, And Reuse

For user-facing features or reachable clients/frontends, specs define access,
screens/surfaces, user flows, UI states, accessibility/responsiveness, and fit
with app behavior. Use design sources (`design.md`, design system, tokens,
shared CSS/styles, framework/component libraries) and reusable components before
custom UI. Custom UI or duplicate styles need rationale, reuse impact, approval.
No frontend/client in scope requires N/A evidence.

## Standards First

Default to industry/ecosystem definitions before custom text: contracts,
observability, logging, errors, auth, security, architecture, framework
conventions. Examples are non-exhaustive: OpenAPI, GraphQL, AsyncAPI, JSON
Schema, protobuf/gRPC, CloudEvents, Avro, Thrift, Smithy, OpenRPC/RAML, YANG,
WSDL, schema registries. Custom choices need rationale, tooling impact,
migration, approval.

## Machine-Readable Contract Sources

Interfaces, APIs, events, queues, webhooks, plugins, configs, SDK/CLI, durable
data shapes use best-fit standard/ecosystem contract/IDL/schema sources. Select
by transport, ecosystem, interop, generation, compatibility, runtime
validation. Human specs link to contracts instead of duplicating fields. Name
generators, commands, outputs, generated tests, drift checks. Manual/custom
contracts need rationale, approval, and unavailable/unsafe generation evidence.
N/A needs evidence no interface, transport, message, config, extension, or
durable data contract is in scope.

## Interfaces And Runtime Semantics

Each boundary defines owner, audience, stability, version, inputs/outputs,
validation, errors, auth/policy, lifecycle, observability, tests.
Cross-language specs map source/wire/target types, required/optional,
defaulted, `null`, `undefined`, omitted, zero/empty, unknown enums, precision,
time zones, IDs, encoding, ordering, pagination, partial data, errors.
Contracts define wire names, serialization, nullability, versioning,
compatibility, generation targets, validation entry points, owner. Diagrams/docs
link to contracts. Async specs define runtime, ordering, concurrency,
cancellation, timeout, retry budget, idempotency, ack/commit, lease,
backpressure, DLQ, transactions, locks, worker behavior.

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
