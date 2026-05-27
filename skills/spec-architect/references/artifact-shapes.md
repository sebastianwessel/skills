# Artifact Shapes

Use these compact defaults unless the project already has a stronger convention.

## Spec Tree

- `specs/.readiness-report.yaml`
- `specs/_registry.yaml`, `specs/_provenance.yaml`
- `specs/00-vision.md`, `00-stack.md`, `00-conventions.md`,
  `00-architecture-overview.md`, `glossary.md`
- `specs/01-domains/*.md`
- `specs/02-capabilities/<domain>/*.md`
- `specs/03-contracts/**`: schemas, APIs, events, jobs, streams, configs,
  policies, auth, storage, errors, public API inventory
- `specs/03-flows/*.md`
- `specs/04-backend/*.md` or equivalent technical layer docs
- `specs/04-nfr/*.md`
- `plans/migrations/*.md` when implemented behavior changes materially

## Readiness Report

Approved specs require:

- `status: approved`
- `human_approval.status: approved`
- `open_decisions: []`
- each gate status `passed`: `no_drift_gate`, `ambiguity_gate`,
  `semantic_alignment_gate`, `async_semantics_gate`, `interface_gate`,
  `e2e_gate`, `wave_readiness`, `migration_gate`, `contradiction_check`,
  `self_audit_gate`, `gate_simulation`
- deterministic check command/status, inferred defaults, risks, wave evidence,
  migration plan links when applicable, self-audit findings

## Inference Policy

Infer safe defaults only for language/toolchain conventions, local-first
adapters, standard validation/test libraries, ports-and-adapters, OpenTelemetry,
and RFC 9457 HTTP errors. Block for human review on scope, compliance/privacy,
security boundaries, public semantics, irreversible architecture, trust
boundaries, or contradictions.

## Standard Failures

Validation rejects with no retry. Timeouts retry within a bounded budget then
escalate. Unknown errors are terminal unless explicitly retryable. Dependency
unavailability retries with backoff. Cancellation cleans up and marks cancelled.
Lease expiry requeues only if side effects are safe. Non-idempotent uncertainty
requires manual intervention. Always define ack timing, state transition,
telemetry, and manual-intervention record.
