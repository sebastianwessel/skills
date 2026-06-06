# Spec Readiness Checklist Root Index

Use this index during spec authoring and readiness review. Load only the topic
indexes and topic checklists relevant to the requested scope, then record each
relevant topic as:

- `covered`: specs contain concrete traceable requirements
- `not_applicable`: specs explain why the topic is out of scope
- `gap`: planning or implementation would need to guess

Any relevant `gap` blocks readiness. Record source refs, missing decisions,
affected tickets, and risk.

## Routing

Always load:

- `checklist-core.md`: scope, traceability, drift risk, source of truth.
- `checklist-end-to-end-definition.md`: capability inventory and complete
  definition chains across UX, APIs, data, states, integrations, and ops.
- `checklist-index-structure.md`: architecture shape and file/folder routing.
- `checklist-index-quality.md`: verification, contracts, security, and risk
  gates that commonly apply across all app shapes.

Then load only matching high-level indexes:

- `checklist-index-backend.md`: APIs, services, data, jobs, integrations, auth,
  storage, backend security, and backend-facing domain features.
- `checklist-index-frontend.md`: screens, UX states, accessibility, content,
  client behavior, design systems, and frontend-facing domain features.
- `checklist-index-platform.md`: runtimes, dependencies, topology, deployment,
  operations, secrets, supply chain, and environments.
- `checklist-index-product-domain.md`: business capabilities such as payments,
  notifications, files, search, reporting, admin/support, import/export, and AI.
- `checklist-index-performance.md`: capacity, latency, caching, quotas,
  resilience, scalability, and cost controls.

Each high-level index names detailed files to load next. Do not load every
detailed checklist by default. If an index looks relevant but the scope excludes
it, record `not_applicable` with the exclusion reason.

## Evidence Format

```yaml
checklist_walk:
  status: passed
  topics:
    authentication:
      applicability: relevant
      checklist: references/checklist-auth-permissions.md
      evidence:
        - specs/02-capabilities/auth.md#login
      gaps: []
  blocking_findings_count: 0
```
