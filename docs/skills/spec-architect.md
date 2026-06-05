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
2. Define repository topology, ownership boundaries, reusable packages,
   components, modules, and services.
3. Normalize requirements into traceable, verifiable statements.
4. Define source-of-truth contracts and link human specs to them.
5. Define frontend/client access, UX states, accessibility, design reuse, and
   component reuse or N/A evidence.
6. Define unhappy paths, runtime semantics, security/privacy, observability,
   data integrity, recovery, performance, production, release, and supply chain.
7. For contract-heavy boundaries, define clean-rebuild strategy, generation map,
   strong boundary type policy, generated outputs/checks, and handwritten
   remainder.
8. Sync registries/provenance and prune stale duplicates.
9. Self-audit assumptions, gaps, contradictions, and skipped evidence.
10. Hand off to `spec-readiness-review` for semantic review, deterministic
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
