# Path Tracing

Trace the implemented solution from outside-in and back out. A wave passes only
when every relevant path is understood, implemented, tested, and spec-aligned.

## Path Matrix

For each entry point or workflow, record:

- Trigger: request, command, event, job, callback, stream, scheduler, UI action,
  webhook, or migration.
- Inputs: schema, type, nullability, defaults, auth context, idempotency key.
- Steps: validation, auth/policy, routing, domain logic, persistence, external
  calls, async queues/workers, transactions, cache, observability.
- Outputs: response, state change, emitted event/job, log/metric/audit entry,
  error envelope, retry/cancel behavior.
- Safety: data classification, redaction, state transition, rollback,
  recovery, performance budget, and final state.
- Tests: unit, contract, integration, end-to-end, and failure-path evidence.
- Specs: exact `spec_refs` that define the path.

## Required Paths

Check these when relevant:

- success path
- validation failure
- authorization or policy denial
- missing/unknown resource
- duplicate request or idempotent replay
- downstream failure and retry exhaustion
- timeout, cancellation, backpressure, or queue failure
- persistence failure, rollback, partial write, migration compatibility
- concurrency/race condition and resource cleanup
- serialization/deserialization mismatch across languages or protocols
- observability path: logs, metrics, audit, tracing, redaction
- overload/performance budget breach and degraded/recovery behavior

## Review Rule

If a path is not applicable, record why. If applicability is unclear from specs,
write a spec gap. If implementation only proves the happy path, reject.
