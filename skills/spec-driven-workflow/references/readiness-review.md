# Reviewing behavior and risk

Start at the project entry point. Follow the selected outcome to its rules,
interfaces and decisions. Compare the digest input list with the sources that
actually govern it. Inspect the selected acceptance scenarios and walk their
material entry points in the other direction to discover missing scenarios.
Make a finding where an implementer would have to invent behavior.

## Review every change

- Identify the actor, goal, reachability, preconditions, authoritative rule and responsible owner. Follow success, denied and failed actions through observable outputs, durable state, side effects and recovery. Verify the claimed final state can be tested.
- Compare actual interfaces and existing reusable code to proposed contracts. Check field meanings, null/omitted values, conversions, ownership, permitted consumers, generators and drift checks. Validate schemas and contract examples with the project’s own tools and record the result.
- Inspect trust boundaries, data classification, minimization, retention, deletion, confidentiality and log redaction. Verify authorization, no-leak and no-data-loss behavior, including after partial failure.
- Establish measurable latency, throughput or resource budgets where workloads can exhaust capacity. Check failures under load, visibility of user and operator outcomes, alerting, recovery, rollback and operational readiness. Review dependency provenance and supply-chain controls for changes to build, deployment or runtime inputs.
- Inspect relevant ADRs, unresolved questions and conflicting policies. Require evidence of accepted decisions, authorized scope and concrete reasons for material exclusions. Each finding identifies its source, impact, owner and the proof needed to close it.

Give the reviewer the exact digest, bound inputs and applicable risk. A fresh
reviewer inspects the actual sources and planned proof, records the findings,
and leaves the approval decision to the authorized person. If the task is to
carry the work through delivery, resolve source or scope issues that already
have authority and rerun the review before asking for approval.

## Go deeper where the scope requires it

| Scope trigger | Inspect |
| --- | --- |
| Stateful or asynchronous boundaries | Ordering, concurrency, idempotency, timeout, cancellation, retries, replay, acknowledgement, partial writes, compensation, backup and restore. Trace recovery to a safe final state. |
| Authentication, tenants, privileged support | Permission grant and revocation, account recovery, tenant isolation, escalation, redacted audit evidence and denied-action side effects. |
| End-user or administrative interface | Reachability, navigation, device sizes, keyboard and assistive access, loading, empty, denied, error and recovery states, localized content and existing components. |
| Payments, entitlements and communications | Entitlement transition and revocation, reconciliation, duplicate delivery, opt-out, approval or consent, irreversible effects and dispute handling. |
| Imports, exports, media, search or reporting | Provenance, filtering, schema and size limits, deletion propagation, masking, pagination, authorization of derived data, integrity and recovery from incomplete transfers. |
| External dependencies, automation or AI | Current cited primary documentation and supported versions, failure/isolation limits, permissions, data disclosure, decision authority, human intervention and verification. |
| Build, deployment, operations or release | Reproducible build, locked dependencies, vulnerability/license checks, signing or provenance where required, deployment gates, secrets rotation, monitoring, capacity, staged rollout and tested rollback or recovery. |
| Material diagrams or publishing | Inspect the rendered artifact at normal and narrow widths. Compare paths, actors, boundaries and terminal outcomes with the owning source. Verify labels, contrast, text alternative and authorized publication scope. |

In the semantic review, cite the digest, exact scenarios, rules or artifacts inspected and the checks performed. Give a scoped reason when a material risk is excluded. A checklist tick or keyword match cannot establish a semantic pass.
