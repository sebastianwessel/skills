# Implementation Loop

Use this loop for one approved ticket.

## Contents

- Contract First
- Test First
- Quality Rules
- No False Completion
- Review-Judge Loop

## Contract First

- Identify approved interfaces, contracts, schemas, commands/events/jobs,
  config, persistence, frontend/client paths, and public APIs named by ticket.
- Prefer approved contract/IDL/schema sources plus deterministic generators for
  code, types, clients, validators, stubs, docs, fixtures, and contract tests.
  Run regeneration before manual edits when tooling exists.
- For contract-first clean rebuilds, verify the approved generation map before
  codegen. Fix or block on missing source files, package layout, service-owner
  mappings, persistence mappings, record ID templates, derived components, or
  known definition gaps before generation.
- Add or run generator tests and drift checks before treating generated outputs
  as ready. Generated packages must compile before handwritten service logic
  depends on them.
- Interface/foundation tickets implement interfaces before dependents and run
  type/schema/contract checks; consumer tickets code against them unchanged.
- Do not hand-write or fork generated shapes unless approved and generation is
  unavailable, unsafe, or out of scope.
- Read the ticket's representation catalog refs before defining a data shape.
  Reuse the approved generated/shared artifact or mapping. Do not create an
  exported DTO, entity, schema, event, record, projection, or mapper without a
  registered shape and mapping or approved new-shape decision.
- If ticket tasks require generated services/resources/clients before handler
  edits, verify those paths exist or run approved generation. Stop if generation
  is unavailable; do not hand-write substitute skeletons.
- Closed contract boundaries must expose strong source-derived or generated
  types. Do not use Go `map[string]any`, TypeScript `any`, TypeScript
  `unknown`, `Record<string, unknown>`, anonymous request/response maps, or
  handwritten duplicate contract mirrors unless the source contract explicitly
  defines an open JSON leaf.
- Preserve approved type/nullability, async/cancel/retry/serialization/error,
  state, integrity, redaction, performance, recovery, UX/client,
  release/operations, and supply-chain semantics. Stop on mismatch.

## Test First

Tests are the executable form of the spec for one ticket. Define or generate
them before writing the business logic they validate.

For each acceptance criterion:

1. Map the criterion to source spec refs, approved contracts/schemas, expected
   outputs, and happy/unhappy paths.
2. Generate contract/schema tests when tooling supports it; otherwise write
   equivalent public-interface tests.
3. Add unit/integration/E2E tests before business logic.
4. Cover happy, unhappy, validation, auth, async/timeout/cancel/retry, logging,
   recovery, and error propagation when specified or convention-required.
5. Confirm new or changed tests fail for the expected missing behavior/artifact.
6. Implement minimum logic to pass, then rerun focused, contract, drift, and
   ticket checks.

If strict test-first is mechanically impossible, record why and still map every
acceptance criterion to verification. "Already passing" is acceptable only when
the test already exists, traces to the source requirement, and proves the scoped
behavior before new business logic is added.

## Quality Rules

- Use canonical errors; never swallow sync/async/stream/timeout/cancel/retry or
  background failures.
- Log through project conventions with specified levels/events/context and no
  PII, secrets, confidential, restricted, or sensitive payloads.
- Keep failures bounded and safe: no undefined state, data loss, duplicate side
  effects, or unbounded recovery loops.
- Respect specified performance, pagination, timeout, retry, backpressure,
  deployment, rollback, runbook, dependency, SBOM/provenance, vulnerability,
  license, artifact, and secret-scan requirements.
- For UI/client work, reuse design sources, shared styles, framework/component
  library components, and existing reusable modules before custom code.
- Use precise types, cohesive files, speakable names, centralized documented
  constants, unit-bearing names, and inline docs for public APIs/enums/constants.
- A layer-specific representation is valid only when its approved mapping
  records the boundary purpose and field differences. Never create a renamed
  semantic duplicate for local convenience.

## No False Completion

- No unapproved production mocks, fakes, stubs, placeholders, no-ops, hidden
  flags, hardcoded demo paths, or test doubles for code under test.
- No full-slice completion with a partial local slice; route to planner for
  split/partial scope.
- No direct generated-file edits unless approved evidence says regeneration is
  impossible or unsafe; otherwise run generator and drift check.
- No handwritten service implementation before required mapping metadata,
  generator tests, generated artifacts, compile checks, and drift checks are in
  place for the scoped boundary.
- No stale aliases, compatibility wrappers, fallback synthesis, or storage-era
  shapes in a clean rebuild unless approved migration scope requires them.
- No provider, persistence, security, session, tenant, workspace, invitation, or
  domain logic in composition files unless specs require it.

## Review-Judge Loop

Before claiming `implemented`, honestly check:

- Scope, spec traceability, interfaces, generation, acceptance matrix, tests,
  test order, quality, integrity, operations, and UX/client behavior match the
  approved ticket/spec evidence.
- Acceptance rows are implemented, tested, verified, N/A with spec evidence, or
  blocked; any missing/blocked row means partial, not implemented.
- Auth/tenancy tickets include negative tests for cross-tenant list/get-known-id,
  writes/deletes, owner-only commands, and missing/expired/revoked sessions
  before handler logic.
- Assumptions, skipped checks, pre-existing failures, gaps, and risks are stated
  honestly.
- New and changed representations/mappers match the catalog/ticket refs; any
  unregistered one is a blocker, not a local refactor.

Fix ticket-scope defects and re-run checks. For undefined or out-of-scope issues,
stop with a blocker instead of inventing behavior.
