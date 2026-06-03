# Implementation Loop

Use this loop for one approved ticket.

## Contents

- Contract First
- Test First
- Quality Rules
- No False Completion
- Review-Judge Loop

## Contract First

- Identify approved interfaces, contracts, schemas, commands, events, jobs,
  config, persistence, and public APIs named by the ticket.
- Prefer approved contract/IDL/schema sources and
  deterministic project generators for code, types, clients, validators, server
  stubs, docs, fixtures, and contract tests. Run regeneration before manual
  edits when tooling exists.
- If the ticket owns an interface/foundation, implement it before dependents and
  run type/schema/contract checks.
- If the ticket consumes an interface, code against the approved interface
  unchanged.
- Do not hand-write or fork generated shapes unless the ticket/spec explicitly
  approves manual implementation and states why deterministic generation is
  unavailable, unsafe, or out of scope.
- Preserve null/undefined, optional fields, async timing, cancellation, retries,
  serialization, and error semantics exactly. Stop on mismatch.
- Preserve specified state transitions, data integrity, redaction, performance
  budgets, and recovery behavior exactly. Stop on mismatch.
- Preserve specified frontend/client access paths, screens/surfaces, user
  flows, UI states, accessibility/responsiveness, design sources, shared styles,
  framework/component-library use, reusable components/modules, and custom
  UI/style rationale exactly. Stop on mismatch.
- Preserve requirement IDs, release/rollback, configuration/secrets,
  operations, and supply-chain semantics exactly when in scope. Stop on mismatch.

## Test First

Tests are the executable form of the spec for one ticket. Define or generate
them before writing the business logic they validate.

For each acceptance criterion:

1. Map the criterion to source spec refs, approved contracts/schemas, expected
   outputs, and happy/unhappy paths.
2. Generate contract/schema tests from approved artifacts where project tooling
   supports it; otherwise write equivalent public-interface contract tests.
3. Write or update public-interface unit/integration/E2E tests before business
   logic changes.
4. Include happy, unhappy, validation, auth, async, timeout, cancellation, retry,
   logging, recovery, and error propagation tests when specified or required by
   convention.
5. Confirm the new or changed tests fail for the expected missing behavior or
   missing generated artifact.
6. Implement the minimum business logic to pass, then re-run focused, contract,
   drift, and ticket checks.

If strict test-first is mechanically impossible, record why and still map every
acceptance criterion to verification. "Already passing" is acceptable only when
the test already exists, traces to the source requirement, and proves the scoped
behavior before new business logic is added.

## Quality Rules

- Handle errors with canonical types/codes; never swallow sync, async, stream,
  timeout, cancellation, retry, or background task failures.
- Log only through project conventions, with specified levels, event names,
  useful context, and no PII, confidential, restricted, secret, or sensitive
  payloads.
- Keep failures safe: no undefined state, data loss, duplicate side effects, or
  unbounded self-healing loops. Use specified rollback, compensation,
  idempotency, recovery checkpoints, and manual escalation.
- Respect specified latency, throughput, memory/CPU, pagination, batching,
  timeout, retry, backpressure, and overload limits.
- Respect specified deployment, rollback, runbook, dependency, SBOM/provenance,
  vulnerability, license, artifact, and secret-scan requirements when in scope.
- For UI/client work, reuse project design sources, shared styles, framework or
  component-library components, and existing reusable components/modules before
  custom code. Do not invent look and feel, duplicate styling, or introduce
  custom components/interactions unless the ticket/spec explicitly approves the
  rationale.
- Use precise types. Avoid unapproved `any`, unchecked casts, dynamic maps,
  stringly typed unions, or broad exception types.
- Keep generated files deterministic, clearly marked as generated when the
  project does so, and regenerated from approved sources rather than edited by
  hand.
- Keep files cohesive with speakable names.
- Centralize repeated hardcoded values into inline-documented constants.
- Include units in duration, size, count, rate, and limit names.
- Inline-document public APIs, exported constants, enum types, and enum values.

## No False Completion

- Do not add production mocks, fakes, stubs, placeholders, no-ops, hidden feature
  flags, or hardcoded demo paths unless explicitly approved.
- Test doubles are allowed only by the test strategy or ticket, only at external
  boundaries, and never for the code under test.

## Review-Judge Loop

Before done, honestly check:

- Scope: changed files are inside `write_scope`.
- Spec: every behavior maps to scoped specs, ticket text, or approved convention.
- Traceability: source requirement IDs map to code, tests, and evidence.
- Interfaces: types, nullability, async, errors, and serialization align.
- Generation: generated outputs, generated tests, and drift checks align with
  approved contract/IDL/schema sources.
- Frontend/client: access path, screen/surface behavior, user flows, UI states,
  accessibility/responsiveness, design/style reuse, and component/module reuse
  match specs and project conventions.
- Tests: every acceptance criterion has happy/unhappy verification.
- Test order: spec/contract/acceptance tests existed or were generated before
  business logic for the behavior, or a concrete mechanical exception is
  recorded.
- Quality: errors, logs, security, names, types, constants, and docs are sound.
- Integrity: state transitions, recovery, data-loss prevention, and performance
  budgets match specs.
- Operations: release, production readiness, and supply-chain behavior match
  specs when in scope.
- Honesty: assumptions, skipped checks, pre-existing failures, gaps, and risks
  are reported.

Fix ticket-scope defects and re-run checks. For undefined or out-of-scope issues,
stop with a blocker instead of inventing behavior.
