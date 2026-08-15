# Review Gates

Use these gates after building the path matrix.

## Contents

- Spec And Interface Conformance
- Frontend, UX, And Reuse
- Tests And Verification
- Security And Privacy
- Performance And Robustness
- Production, Release, And Supply Chain
- Maintainability And Public Surfaces
- Honest Review

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
- Contract-first clean rebuilds follow the approved patch/refactor versus clean
  boundary decision. Source contracts and generation maps cover generated
  package layout, service-owner mappings, persistence mappings, record ID
  templates, derived components, generated tests, compile checks, and drift
  checks before handwritten service logic.
- No hand-written duplicate of an approved generated shape bypasses codegen,
  validation, compatibility, or drift checks.
- Every changed domain shape, boundary payload, persistence record, command,
  query, projection, and mapper traces to the approved representation catalog
  and mapping refs in its ticket. Reject unregistered exported shapes, semantic
  duplicates, and transformations that exceed their permitted differences.
- Closed contract surfaces use strong generated/source-derived types. Go
  `map[string]any`, TypeScript `any`, TypeScript `unknown`,
  `Record<string, unknown>`, anonymous map-shaped wrappers, and handwritten
  duplicate interfaces are blocking unless the source contract explicitly
  defines an open JSON leaf.
- Generated files were not hand-edited without approved manual evidence;
  generator/export commands and dirty-diff drift checks are recorded.
- Clean rebuild output does not preserve stale aliases, compatibility wrappers,
  fallback synthesis, or storage-era shapes unless an approved migration ticket
  owns them and tests their removal/rollback path.
- No product/API/security/persistence/test behavior was invented locally.
- Implementation evidence pins the current spec and plan manifests. Every
  changed exported symbol, schema, mapper, generated artifact, module boundary,
  and command effect traces to approved ticket/spec/asset refs.

## Frontend, UX, And Reuse

- User-facing/client behavior is reachable through the specified navigation,
  route, command, integration, or embedding path.
- Screens/surfaces, user flows, loading/empty/error/success/permission states,
  accessibility, responsiveness, keyboard/focus behavior, and visual states
  match approved specs and project conventions.
- Implementation reuses approved design sources, shared styles, framework or
  component-library components, and existing reusable components/modules before
  custom code.
- Custom UI, custom interactions, duplicate styles, or new reusable components
  have explicit spec/ticket rationale and do not fragment the application look,
  feel, UX, or maintenance model.
- Frontend/client tests or equivalent evidence cover access, state transitions,
  failure display, and contract alignment with backend/service interfaces.

## Tests And Verification

- Ticket and wave verification commands pass.
- Every acceptance criterion and path has behavior evidence.
- Test evidence derives from approved specs, contracts/schemas, acceptance
  criteria, and unhappy-path definitions before business logic is accepted.
- Unit, contract/generated, integration, and E2E tests were written or generated
  before the business logic they prove, or the ticket records a concrete
  mechanical exception.
- Contract and end-to-end tests cover cross-ticket integration.
- Contract/codegen drift checks pass, or N/A evidence matches the approved plan.
- Generation-map checks fail on stale generated artifacts and invalid mapping
  placeholders. Generated packages compile before dependent handwritten code is
  accepted.
- Tests include happy, unhappy, async/error, retry/timeout, and security paths.
- Default checks remain hermetic; external integrations are opt-in.

## Security And Privacy

- Auth, authorization, tenancy, isolation, input validation, output encoding,
  secrets handling, data classification, retention, redaction, log levels,
  audit logging, dependency use, and safe defaults match specs and conventions.
- Tenant isolation is proven at adapters/resources, not only middleware:
  cross-tenant list, known-id get, update/delete, owner-only command, and
  missing/expired/revoked-session negative paths are tested when relevant.
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
- Composition files only compose/mount. Domain/provider/persistence/security,
  session, tenant, workspace, invitation, or raw adapter logic in composition
  files is blocking drift unless specs approve it.
- Names are speakable; constants are centralized and documented with units.
- Public APIs, exported constants, enum types/values, docs, examples,
  inventories, generated artifacts, and execution semantics are synchronized.
- Generated manifests, service registrations, database metadata, error
  taxonomy helpers, payload validators, and frontend/client contract artifacts
  are synchronized with their source contracts or explicitly N/A.
- Changed shared/public assets list their consumers. Every consumer is tested,
  reviewed, or assigned to an approved compatibility/migration ticket; module
  dependency direction remains within the approved boundary contract.
- No unapproved mocks, fakes, stubs, placeholders, no-ops, demo paths, or hidden
  feature flags create false completion.

## Honest Review

Reject rather than guess when evidence is missing. Record assumptions, skipped
commands, unreviewed paths, and residual risk in `review.md`.
