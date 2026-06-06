# Spec Architect

`spec-architect` creates and updates canonical implementation specs. It turns
product or engineering intent into source-of-truth requirements, flows,
contracts, UX, NFRs, release, and supply-chain definitions before a separate
readiness review approves the specs for planning.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

## What It Does

- Creates and updates project spec sets.
- Repairs source-of-truth gaps from explicit findings.
- Defines layered specs for domains, capabilities, contracts, ports, flows, UX,
  operations, release, and non-functional requirements.
- Maintains a capability inventory and defines every capability end to end:
  actor/consumer, entrypoint/reachability, contracts, data, states, side
  effects, permissions, errors, recovery, observability, acceptance,
  verification, owner, and final state or N/A.
- Defines the general file/folder structure by domain/topic for in-scope
  implementation areas, including ownership boundaries, nested structure
  expectations, generated-artifact locations, shared/reusable module placement,
  and public entrypoint or operational asset locations. It does not need to
  enumerate every implementation file.
- Walks the checklist index and relevant topic checklist files, filling gaps or
  recording N/A evidence for topics such as auth, data, secrets, APIs, tests,
  UX, operations, release, and supply chain.
- Uses current stable versions by default for dependencies and third-party
  solutions, backed by current primary docs, package/release metadata, or dated
  research evidence. Older pins require rationale.
- Centralizes shared facts such as vocabulary, policies, errors, type
  semantics, NFRs, and public contracts so specs link instead of repeating.
- Defines best-fit machine-readable contract/IDL/schema artifacts when
  interfaces exist.
- Defines patch/refactor versus contract-first clean-rebuild strategy,
  generation-map needs, strong boundary type policy, handwritten boundaries, and
  compatibility/migration stance for contract-heavy work.
- Records requirement IDs, source/rationale, verification method, ownership,
  priority/risk where relevant, and acceptance traceability.
- Self-audits assumptions, open decisions, N/A evidence, contradictions, and
  readiness-review blockers.
- Hands authored specs to `spec-readiness-review`; it does not approve its own
  specs.

## How It Works

The skill drafts autonomously where defaults are safe. It asks humans only for
missing business intent, compliance or security boundaries, irreversible
architecture choices, public contract semantics, material side effects, or
contradictions.

## Workflow

1. Generate or update layered specs from business/user intent to technical
   detail.
2. Create or update the capability inventory, including user-facing,
   admin/support, API/CLI/SDK, integration/webhook, worker/job, data lifecycle,
   and operational capabilities or explicit N/A categories.
3. Define repository topology and the general file/folder structure by
   domain/topic, including ownership boundaries, reusable packages, components,
   modules, services, generated artifacts, public entrypoints, migrations, and
   runbooks.
4. Research current primary docs/package metadata for dependencies and
   third-party solutions, including database schema/query/index guidance.
5. Walk the checklist index plus relevant topic files and record covered, N/A,
   or gap evidence.
6. Normalize requirements into traceable, verifiable statements.
7. Define source-of-truth contracts and link human specs to them.
8. Define frontend/client access, UX states, accessibility, design reuse, and
   component reuse or N/A evidence.
9. Define data lifecycle, classification, PII handling, retention,
   deletion/export, unhappy paths, runtime semantics, security/privacy,
   observability, data integrity, recovery, performance, production, release,
   and supply chain.
10. For contract-heavy boundaries, define clean-rebuild strategy, generation map,
   strong boundary type policy, generated outputs/checks, and handwritten
   remainder.
11. Sync registries/provenance and prune stale duplicates.
12. Self-audit assumptions, gaps, contradictions, and skipped evidence.
13. Hand off to `spec-readiness-review` for semantic review, deterministic
    checks, readiness report, and approval.

## Modes

| Mode | Purpose |
| --- | --- |
| Create | Generate specs from a project description. |
| Update | Update affected specs and dependent layers. |
| Fix Gap | Apply explicit gap findings to canonical specs before readiness review. |

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-architect/SKILL.md` | Executable authoring instructions and trigger metadata. |
| `skills/spec-architect/evals/evals.json` | Evaluation scenarios for spec authoring. |

## Validation And Safety

This skill does not approve specs. Planning is allowed only after
`spec-readiness-review` records approved readiness, human approval, required
judge evidence, deterministic check results, and zero blocking findings.
