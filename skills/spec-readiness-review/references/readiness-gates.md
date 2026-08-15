# Readiness Gates

Approve only when every gate passes or is N/A with evidence.

## Contents

- Core Gates
- Judge Loop
- Coverage
- Clean Rebuild Gate
- Representation Reuse Gate
- Contract And Runtime Gate
- Production Gate

## Core Gates

- No ticket may decide behavior, interfaces, errors, data lifecycle, async,
  migrations, security/privacy, performance, observability, recovery, tests, or
  acceptance.
- No ticket may decide general file/folder placement. Specs define the intended
  domain/topic folder structure, ownership boundaries, shared/reusable module
  placement, generated-artifact locations, and public entrypoint or operational
  asset locations. Specs do not need to enumerate every implementation file.
- No ticket may choose dependency versions or third-party implementation
  guidance from model memory. Specs prefer current stable versions and cite
  current primary docs, package/release metadata, or dated research evidence.
  Older pins and nonstandard choices need explicit rationale.
- No ticket may discover features, access paths, data flows, state transitions,
  lifecycle rules, or operational outcomes. Specs define them end to end or
  record explicit N/A evidence.
- Checked prose is English: `language: en`.
- Vague text, unresolved markers, contradictions, duplicate facts, and missing
  N/A evidence block approval.
- Human approval is required for missing intent, compliance/security, public
  semantics, irreversible architecture, material side effects, contradictions,
  or hard guesses.
- Approval is bound to `spec-manifest.yaml.content_digest`. It requires an
  accountable approver, timestamp, immutable approval reference, scope refs,
  and matching digest; changing an authoritative artifact invalidates it.
- `00-applicability.yaml` is the only source for scoped applicability and N/A
  claims. A concern needs exact scope refs; `not_applicable` also needs a
  concrete rationale. A prose N/A never bypasses a gate.
- `00-decision-authority.yaml` gives agents a narrow autonomy budget: D0 is
  mechanical, D1 is private and reversible under an approved convention, D2
  is an approved semantic/architectural decision, and D3 is human-only. An
  implementation ticket may not create a D2/D3 decision.
- Deterministic checks are smoke tests; semantic approval needs judge evidence.

## Judge Loop

Run once before planning handoff. For every capability/business outcome, record
actor, entrypoint, reachability path, preconditions, data touched, state
transitions, side effects, permissions, contracts, observability, verification,
owner, final state, and N/A evidence. Walk success, unhappy, recovery,
frontend/client, interface, security/privacy, data lifecycle, data-integrity,
observability, performance, release, supply-chain, and testability paths.

Require `spec_judge_loop.status: passed`, `run_timing: approval_only`,
reviewed flows/paths/refs, uncertainty, finding counts, judge metadata, and
`blocking_findings_count: 0`.

## Coverage

- Requirements, flows, contracts, and NFRs are singular, owned, traceable, and
  verifiable.
- `02-capabilities/capability-inventory.md` lists every user-facing,
  admin-facing, API/CLI/SDK-facing, integration-facing, worker/job, data
  lifecycle, and operational capability or records why a category is N/A.
- `03-flows/e2e-coverage.md` maps outcomes to entrypoints, clients/consumers,
  UI/API state, service path, contracts, persistence, async/external deps,
  failures, recovery/final state, and verification.
- Every capability has an end-to-end definition chain: actor/consumer,
  trigger/entrypoint, access/reachability, preconditions, contracts, data,
  states, side effects, permissions, errors, recovery, observability,
  acceptance, verification, owner, and final state.
- Frontends, clients, SDKs, CLIs, integrations, adapters, UX states,
  accessibility/responsiveness, and design/component reuse are covered or N/A.
- General file/folder structure is covered or N/A: domain/topic folders,
  nested structure expectations, generated outputs, shared/reusable modules,
  public entrypoints, migrations, runbooks, and ownership boundaries.
- `spec-checklists.md`, relevant high-level checklist indexes, and relevant
  detailed topic checklist files have been walked. Every relevant topic is
  `covered` or `not_applicable` with evidence; any `gap` blocks approval.
- Dependency, database, framework, cloud, and third-party solution choices have
  current-doc evidence. Database schemas, indexes, and query/performance
  guidance come from official docs or approved research, not generic
  "best practice" wording.
- Shared facts live once. Diagrams are optional and must stay aligned.

## Clean Rebuild Gate

For contract-heavy boundaries, decide incremental patch/refactor versus
contract-first clean rebuild. Prefer clean rebuild when stale aliases,
compatibility fallbacks, storage-era shapes, handwritten mirrors, drifting
protocol/language/storage surfaces, accepted breaking changes, source-of-truth
specs, and useful generators dominate.

When clean rebuild is selected, require source-contract inventory, generation
map, placeholder checks, generated outputs/commands/tests/compile/drift checks,
ownership, handwritten remainder, compatibility/migration stance, and frontend
contract timing.

Closed contract boundaries require strong generated/source-derived types. Go
`map[string]any`, TypeScript `any`/`unknown`, `Record<string, unknown>`,
anonymous map wrappers, and handwritten contract mirrors are blockers unless the
source contract defines an open JSON leaf.

## Representation Reuse Gate

When in-scope work introduces or changes domain data, API/event payloads,
commands, queries, persistence records, or client projections, require
`03-contracts/representation-catalog.yaml`. It is the single index of semantic
shape ownership, not a mandate to share one language type across all layers.

Each catalog entry has a stable `shape_id`, representation class, canonical
source artifact, owner, stability/open policy, allowed consumers, source
contract refs, and mapping refs. A canonical semantic shape is reused when the
meaning and lifecycle match. A boundary request, persistence record, event, or
view projection may differ only through a catalogued mapping that states its
direction, permitted field differences, redaction/loss policy, and verification.

Block approval when a capability or contract introduces an unregistered shape,
a duplicate semantic shape, an unmapped cross-layer transformation, a new
exported shape with no owner/canonical source, or a ticket would need to decide
whether a new shape is justified. `not_applicable` needs evidence that no
domain, boundary, durable-data, command/query, or projection shape is in scope.

The deterministic gate parses the catalog and rejects duplicate IDs, malformed
entries, dangling source-contract refs, missing endpoint references, mappings
to unknown/self shapes, mappings omitted from either endpoint, and unscoped
N/A. Mapping verification includes exact field operations as well as the loss
policy, so a mapper cannot choose defaults, null handling, conversions, or
redaction behavior during implementation.

## Contract And Runtime Gate

Prefer current documented standards and ecosystem-native contracts: OpenAPI, GraphQL, AsyncAPI, JSON Schema, protobuf/gRPC,
CloudEvents, Avro, Thrift, Smithy, OpenRPC/RAML, YANG, WSDL, schema registries,
and ecosystem logging/errors/auth/observability conventions. Boundaries define
owner, stability, version, validation, auth, errors, lifecycle, observability,
tests, generators, drift checks, and current documentation refs. Cross-language and async specs define
null/omitted/defaults, enum/precision/time/ID semantics, ordering,
concurrency, cancellation, timeout, retry, idempotency, ack, backpressure, DLQ,
transactions, locks, and worker behavior.

## Production Gate

Define failure, timeout, cancellation, retry exhaustion, duplicate replay,
partial write, rollback/compensation, cleanup, recovery, manual intervention,
final state, trust boundaries, classification, authn/authz, isolation,
validation, secrets, retention, redaction, audit/log fields, metrics, traces,
leak prevention, latency/resource budgets, deployment, config/secrets,
readiness/liveness, SLOs, runbooks, backup/restore, rollback, migrations,
flags, versioning, dependencies, lockfiles, vulnerability/license, SBOM,
provenance, signing, containers, and secret scanning. Waves require stable
contracts, E2E scope, disjoint write scopes, dependencies, acceptance matrix,
and verification.
