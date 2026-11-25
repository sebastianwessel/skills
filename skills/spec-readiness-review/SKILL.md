---
name: spec-readiness-review
description: Reviews and approves project knowledge and implementation specs for planning. Use when checking completeness, contradictions, decision authority, readiness evidence, or repairing a targeted spec gap.
---

# Spec Readiness Review

Own the approval gate before planning. In Review/Approve mode, record findings
and approval evidence. In Fix Gap mode, apply a specific supported correction,
update affected references, and review the revised source. Route new business
or technical choices and broad authoring to `spec-architect`.

## Workflow

1. **Establish the review scope.** Confirm the canonical source exists. Use
   [Artifact shapes](references/artifact-shapes.md) for the spec tree and
   readiness report. Start from `specs/index.md`. Run the spec checker
   against existing records or a draft report
   for structural feedback. If a previous approval covers an older digest,
   record it as stale and return the report to draft before reviewing the new source.
2. **Review the sources.** Apply [Readiness gates](references/readiness-gates.md).
   Use **Checklist selection** below to open the baseline and applicable topics.
   Record source refs, evidenced N/A, or an owned gap for each topic. Load
   [Representation catalog](references/representation-catalog.md) for in-scope data shapes. Verify the trace from capabilities and
   contracts through success, failure, and recovery paths to acceptance.
   Check authority, scope, security, data integrity, operational outcomes,
   dependency research, and any applicable generation or migration evidence.
   Verify direct discovery, ADRs, gaps, and actual diagram exports using
   the project knowledge gate.
3. **Resolve or route blockers.** Record the affected requirement, owner,
   evidence, and missing decision or verification. Use `blocked` while a
   blocker remains. Resume from the revised canonical sources after repair.
4. **Bind the review to source.** Run the manifest generator after canonical
   edits. Run the approval-time judge loop and obtain attributable semantic
   judge evidence for that digest. Obtain human approval for the same digest
   and scope. Once the semantic review finds zero blockers, use
   `needs_human_review` while awaiting that approval. Keep new review evidence
   outside the spec tree or in the readiness report. A source change requires
   a new review and approval.
5. **Validate the approved report before handoff.** Self-audit scope, source
   authority, contradictions, N/A, and skipped proofs. Record approved
   readiness only with all required evidence. Run the checker against that
   report to exercise the approval gates. If it fails, record `blocked` and
   the failure. On success give `spec-implementation-planner` the report,
   manifest digest, and verified scope.

## Checklist selection

Read the baseline, then open the files for each applicable scope trigger.

### Baseline

- [Scope and traceability](references/checklist-core.md)
- [End-to-end definition](references/checklist-end-to-end-definition.md)
- [Architecture and file structure](references/checklist-architecture-structure.md)
- [Contracts and generation](references/checklist-contracts-generation.md)
- [Tests and verification](references/checklist-testing-verification.md)
- [Security and abuse](references/checklist-security-abuse.md)
- [Secrets and privacy](references/checklist-secrets-privacy.md)
- [Performance and capacity](references/checklist-performance-capacity.md)

### Scope triggers

| When scope includes | Open |
| --- | --- |
| Runtime configuration, workers, API/client boundaries, deployables or multiple packages | [Runtime](references/checklist-runtime-platform.md), [Service topology](references/checklist-service-topology.md) |
| Third-party dependencies or platform choices | [Dependency research](references/checklist-dependencies-research.md) |
| Deployment, operations, recovery or release | [Operations and release](references/checklist-operations-release.md) |
| Durable or cached data, volume, reporting storage | [Data persistence](references/checklist-data-persistence.md) |
| Identity, permissions or tenant boundaries | [Auth and permissions](references/checklist-auth-permissions.md) |
| Webhooks, jobs, external services, async or realtime | [Async integrations](references/checklist-async-integrations.md) |
| Web, mobile, desktop, embedded or public UX | [Frontend UX](references/checklist-frontend-ux.md), [Localization, content and SEO](references/checklist-i18n-content-seo.md) |
| Billing, commerce or entitlements | [Payments and entitlements](references/checklist-payments-entitlements.md) |
| Messaging, alerts or subscriptions | [Notifications](references/checklist-notifications-communications.md) |
| Uploads, media, moderation or rendered files | [Files and media](references/checklist-files-media.md) |
| Search, reporting, dashboards or analytics | [Search and reporting](references/checklist-search-reporting-analytics.md) |
| Ingestion, export, movement or synchronization of data | [Import, export and sync](references/checklist-import-export-sync.md) |
| Administration, support or governance | [Admin and governance](references/checklist-admin-support-governance.md) |
| AI, automated decisions or ML workflows | [AI and automation](references/checklist-ai-ml-automation.md) |

## Commands

Resolve the skill root from the installed skill. These commands use Node.js
and work on the target project passed as `<spec-root>` (normally `specs/`).

```text
node <spec-readiness-review-skill-root>/scripts/generate_spec_manifest.mjs <spec-root> <source-revision>
node <spec-readiness-review-skill-root>/scripts/check_specs.mjs <spec-root>
```

## Stop Conditions

Withhold approval when intent, authority, evidence, or a material failure path
is unresolved, or when a required checker or judge cannot run. Structural
success on a draft is authoring feedback. Planning requires the approved
report and a passing check against the current source bytes.
