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
- Contract generation: source contract, generation map, generated artifact,
  generated test, compile check, drift check, strong boundary type evidence, and
  handwritten remainder or N/A.
- Representation reuse: catalog `shape_id`, canonical source, owner,
  representation class, mapping IDs/direction, permitted field differences, and
  mapper/generated artifact used or N/A.
- Shared-asset impact: changed public symbols, module/contract IDs, known
  consumers, compatibility or migration rule, affected tests, and the evidence
  that every consumer was reviewed, tested, or explicitly deferred by an
  approved migration ticket.
- Frontend/client surface: reachable access path, screen/surface, user flow,
  loading/empty/error/success/permission states, accessibility, responsiveness,
  design source, shared style reuse, framework/component-library reuse, and
  reusable component/module ownership when user-facing or client-consumed.
- Outputs: response, state change, emitted event/job, log/metric/audit entry,
  error envelope, retry/cancel behavior.
- Safety: data classification, redaction, state transition, rollback,
  recovery, performance budget, and final state.
- Tests: unit, contract, integration, end-to-end, and failure-path evidence.
- Specs: exact `spec_refs` and source requirement IDs that define the path.

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
- weak boundary type, handwritten contract mirror, stale alias, compatibility
  fallback, or storage-era shape crossing a clean generated boundary
- unregistered DTO/entity/schema/event/record/projection, semantic duplicate,
  or mapper whose output differs beyond its catalogued mapping
- changed shared/public asset whose consumers, dependency direction, or
  compatibility/migration behavior were not checked
- frontend/client path: navigation/access, loading, empty, success, error,
  permission/denied, responsive/accessibility behavior, and design/component
  reuse
- observability path: logs, metrics, audit, tracing, redaction
- overload/performance budget breach and degraded/recovery behavior
- production/release path: deploy, config/secrets, readiness, rollback,
  migration ordering, runbook handoff, and artifact promotion
- supply-chain path: dependency policy, lockfile, SBOM/provenance,
  vulnerability/license handling, signing/attestation, and secret scanning

## Review Rule

If a path is not applicable, record why. If applicability is unclear from specs,
write a spec gap. If implementation only proves the happy path, reject.
