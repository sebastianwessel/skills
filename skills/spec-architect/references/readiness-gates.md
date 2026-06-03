# Readiness Gates

Specs are approvable only when every gate passes or is N/A with evidence.

## Contents

- Approval Gates
- Judge Loop
- Structure And Coverage
- Contracts And Runtime
- Production Gates

## Approval Gates

- No ticket may decide behavior, interfaces, errors, security/privacy, data
  lifecycle, async, migrations, performance, observability, recovery, tests, or
  acceptance.
- Machine-checked prose is English (`language: en`) unless validation is
  language-aware.
- Replace vague text (`as appropriate`, `if needed`, `handle errors`, `support
  auth`, `recover gracefully`, `TBD`, `TODO`) with exact conditions/outcomes.
- Keep one source of truth per fact; contradictions block approval.
- Self-audit lists assumptions, inferred defaults, evidence, blockers.
- Humans are asked only for missing intent, compliance/security, public
  semantics, irreversible architecture, side effects, contradictions, or hard
  guesses. Ask one decision with context, recommendation, impact, refs.
- Deterministic checks are smoke tests. Semantic approval needs judge evidence.

## Judge Loop

Before approval/planning handoff, run the approval-time spec judge loop. Do not
run it after every intermediate edit unless approval is requested.

For every business outcome, list reachable entrypoint, actor/client or N/A,
requirement IDs, spec refs, owner, contract/IDL/schema refs or N/A,
verification, final state. Walk success, unhappy, recovery, frontend/client,
interface, security/privacy, data-integrity, observability, performance,
release, supply-chain, and testability paths. Judge business fit, end-user
clarity, implementation readiness, interface robustness, security/privacy,
recovery, runtime, operations, resilience, release/supply chain, testability,
and spec quality.

Record `spec_judge_loop.status: passed`, `run_timing: approval_only`,
reviewed flows, paths, refs, uncertainty, finding counts, judge metadata.
Approval blocks until `blocking_findings_count: 0`.

## Structure And Coverage

- Requirements, flows, contracts, NFRs are singular, feasible,
  implementation-independent, unambiguous, verifiable, traceable: ID,
  source/rationale, owner, priority/risk, verification, acceptance links.
- Structure business-to-technical: outcome, scope, components, workflows,
  interfaces/data, UX, operations, verification. Shared facts live once.
- `03-flows/e2e-coverage.md` maps each outcome to entrypoint, client/consumer
  or N/A, UI/API state, service path, contract, persistence, async/external
  deps, success/failures, recovery/final state, verification.
- Existing frontends, clients, SDKs, CLIs, integrations, adapters are covered or
  N/A. Backend-only waves need independently working slices and frozen future
  client contracts.
- User-facing specs define access, screens/surfaces, flows, UI states,
  accessibility/responsiveness, app fit, design/component/style reuse, custom UI
  rationale or N/A.
- Mermaid is optional and must stay aligned.

## Contracts And Runtime

- Prefer industry/ecosystem standards before custom text for contracts,
  observability, logging, errors, auth, security, architecture, framework
  conventions. Examples: OpenAPI, GraphQL, AsyncAPI, JSON Schema, protobuf/gRPC,
  CloudEvents, Avro, Thrift, Smithy, OpenRPC/RAML, YANG, WSDL, schema registries.
- Interfaces, APIs, events, queues, webhooks, plugins, configs, SDK/CLI, durable
  data use best-fit contract/IDL/schema sources; human specs link to them.
  Name generators, commands, outputs, generated tests, drift checks.
- Boundaries define owner, audience, stability, version, inputs/outputs,
  validation, errors, auth/policy, lifecycle, observability, tests.
- Cross-language specs map source/wire/target types, required/optional,
  defaults, `null`, `undefined`, omitted, zero/empty, unknown enums, precision,
  time zones, IDs, encoding, ordering, pagination, partial data, errors.
- Async specs define runtime, ordering, concurrency, cancellation, timeout,
  retry, idempotency, ack/commit, lease, backpressure, DLQ, transactions, locks,
  worker behavior.

## Production Gates

- Workflows define success, failure, timeout, cancellation, retry exhaustion,
  duplicate replay, partial write, rollback/compensation, cleanup, recovery,
  manual intervention, final state. No state or side effect may be undefined.
- Define trust boundaries, classification, authn/authz, isolation, validation,
  encoding, secrets, retention, redaction, audit/log fields, correlation IDs,
  metrics, traces, leak prevention.
- Define budgets for latency, throughput, memory/CPU, concurrency,
  pagination/batching, cache/index use, rate limits, timeouts, retries,
  backpressure, health, degraded mode, bounded healing, alerts.
- Define production, release, and supply chain: environments, topology,
  config/secrets, readiness/liveness, SLO/SLA/error budgets, runbooks, owner,
  support handoff, incident response, backup/restore, rollback, migration,
  flags, compatibility, versioning, artifacts, dependencies, lockfiles,
  vulnerability/license, SBOM, provenance, signing, containers, secret scanning.
- Waves proceed only when independently implementable end to end and future
  integration contracts are stable. Parallel tickets need disjoint write scope,
  frozen contracts, dependencies, acceptance matrix, verification.
- Material implemented-behavior changes need `plans/migrations/<id>.md` with
  impact, compatibility, rollout, migration/backfill, adapters, rollback,
  verification, owner.
