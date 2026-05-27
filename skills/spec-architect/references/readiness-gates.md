# Readiness Gates

Specs must be precise enough for autonomous, parallel implementation without
agent drift. Approval means every gate below passed or is explicitly not
applicable with rationale.

## No Drift And Ambiguity

- No ticket may require deciding product behavior, interfaces, errors, security,
  data lifecycle, async behavior, migrations, tests, or acceptance criteria.
- Replace `as appropriate`, `if needed`, `where possible`, `handle errors`,
  `support auth`, `validate input`, `sync data`, `make configurable`, `TBD`, and
  `TODO` with exact conditions, actions, contracts, or descoped decisions.
- Keep one source of truth per fact. Summaries link to authoritative contracts.
  Contradictions block approval.

## Interface Semantic Alignment

Every boundary must define name, owner, audience, stability, version, inputs,
outputs, validation, errors, auth/policy, lifecycle, observability, tests, and
compatibility.

For cross-language or protocol boundaries, include a semantic mapping table:

- source type, wire/protocol type, target type
- required/optional/defaulted fields
- `null`, `undefined`, omitted, zero value, empty string/list/object behavior
- enum unknowns, numeric precision, time zones, IDs, binary/text encoding
- list/map ordering, pagination, partial data, error envelope, deprecation

Example: Go service + GraphQL + TypeScript client specs must define GraphQL
nullable fields, omitted variables, resolver errors, generated TS optional
properties, Go pointer/value/null handling, and end-to-end test fixtures.

## Async And Runtime Semantics

Mark every async boundary and runtime expectation:

- sync request, async job, stream, event, queue, task, callback, scheduled work
- ordering, concurrency, cancellation, timeout, retry budget, idempotency key
- ack/commit boundary, lease/heartbeat, backpressure, DLQ/manual escalation
- runtime model when relevant: Python `async`/thread/process, JS promises,
  Go goroutines/context, worker pools, transactions, locks

## Wave And Parallel Readiness

A wave may proceed only when it is independently implementable end to end and
future integration contracts are stable. A backend service may precede a client
only when service API/auth/errors/schemas/lifecycle/tests and client-facing
compatibility rules are frozen; the later client must conform.

Parallel tickets need write scope, read scope, frozen shared contracts,
dependencies, acceptance matrix, verification commands, and `open_decisions: []`.

## Migration Plans

When specs materially change behavior that already has an implementation, add a
separate plan under `plans/migrations/<id>.md` and link it from the affected
spec/readiness report. Include impact, compatibility, rollout, data migration,
backfill, dual-read/write or adapter strategy, rollback, verification, and owner.

## Rationale

Record decision reason when it prevents future drift: public contracts,
architecture, security, data lifecycle, compatibility, migration, async model,
provider/adapter choices, or non-obvious tradeoffs. Do not justify trivial field
names or obvious local details.

