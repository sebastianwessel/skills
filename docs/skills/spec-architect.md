# Spec Architect

`spec-architect` helps turn product or engineering intent into implementation-ready specs before planning or coding begins. It is designed to prevent downstream AI agents from drifting, inventing behavior, or interpreting vague requirements during autonomous or parallel implementation.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

The CLI and public skill directory are introduced in Vercel's
[`skills` announcement](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem).

## What It Does

- Creates, repairs, reviews, and approves project spec sets.
- Defines layered specs for foundations, domains, capabilities, contracts, ports, flows, and non-functional requirements.
- Structures specs from business and user outcomes down to components, workflows, interfaces, frontend UX/design behavior, operational constraints, and verification.
- Requires stable requirement IDs, source/rationale, verification method, ownership, priority/risk where relevant, and bidirectional traceability from business outcome to acceptance evidence.
- Requires `language: en` for machine-checked spec prose because the bundled
  deterministic smoke checks use English wording.
- Treats regex checks as fast smoke tests, not semantic proof, and requires a
  semantic judge gate before approval.
- Centralizes shared facts such as vocabulary, policies, errors, type semantics, NFRs, and public contracts so specs link instead of repeating.
- Keeps evolving specs concise by updating the source of truth first, relinking
  dependents, pruning stale or duplicate text, and recording plan impact.
- Uses Mermaid diagrams only when they improve human understanding, and requires diagrams to stay aligned with authoritative text.
- Defaults to industry-standard protocols, formats, errors, structured logging, observability, architecture, and framework conventions; custom designs need rationale and approval.
- Requires standard machine-readable contract artifacts whenever possible, such
  as OpenAPI, GraphQL SDL/schema, AsyncAPI, JSON Schema, gRPC/protobuf,
  CloudEvents, or Avro. Human-facing specs link to those artifacts instead of
  duplicating field lists.
- Requires clear, concise, non-contradictory specs with no implementation gaps.
- Defines robust interfaces and end-to-end paths before work is marked ready,
  including cross-language and protocol semantics such as `null`, `undefined`,
  omitted fields, defaults, generated types, and error envelopes.
- Marks async/runtime behavior explicitly for queues, streams, workers, jobs,
  callbacks, coroutines, promises, goroutines, timeouts, retries, cancellation,
  idempotency, ordering, and backpressure.
- Requires unhappy paths, recovery paths, data-integrity guarantees, security
  and privacy controls, log levels and redaction, performance budgets, and
  manual-intervention behavior before approval.
- Requires production readiness, release/rollback, operations, dependency
  policy, vulnerability/license handling, SBOM/provenance, and supply-chain
  disposition before approval or an explicit not-applicable rationale.
- Requires migration plans under `plans/migrations/` when specs materially
  change behavior that already has an implementation.
- Records rationale for decisions that affect contracts, security,
  compatibility, migration, async behavior, or non-obvious tradeoffs.
- Requires a self-audit before approval so assumptions, uncertainty, weak
  decisions, and remaining blockers are recorded honestly.
- Supports per-wave readiness when a wave is independently implementable and its future integration contracts are stable.
- Records readiness in `specs/.readiness-report.yaml`.
- Blocks planning until specs are approved by a human.
- Converts downstream implementation gaps into spec updates.

## How It Works

The skill drafts autonomously where defaults are safe. It asks humans only for missing business intent, compliance or security boundaries, irreversible architecture choices, public contract semantics, material side effects, or contradictions. Those questions must include concise business and technical context, a recommended option, and 2-3 alternatives with pros/cons only when useful.

It uses compact reference files for readiness gates and artifact shapes. It can also run a deterministic consistency checker against a spec tree.

## Workflow

1. Generate or update layered specs from business/user intent to technical detail.
2. Define repository topology, ownership boundaries, reusable packages/libs, components, modules, and services.
3. Describe public workflows, frontend UX states, accessibility, design-system usage, reusable components, and end-user behavior.
4. Normalize requirements into traceable, verifiable, implementation-ready statements.
5. Prefer industry-standard protocols, formats, interfaces, architectural patterns, observability, and framework conventions.
6. Define machine-readable interface and transport contracts as source-of-truth artifacts when possible, and mark not-applicable cases with evidence.
7. Specify developer experience, setup paths, safe defaults, and advanced escape hatches.
8. Ensure public APIs, configs, schemas, plugins, policies, and extension points have contracts, docs, examples, and source-of-truth links.
9. Define production readiness, release/rollback, operations, and supply-chain expectations.
10. Add Mermaid diagrams only where useful and keep them aligned with prose/contracts.
11. Check no-drift, ambiguity, requirements quality, spec-structure, visualization, standards-first, machine-readable-contract, semantic-alignment, async, interface, end-to-end, unhappy-path, security/privacy, observability, performance/resilience, data-integrity/recovery, production-readiness, supply-chain, contradiction, semantic-judge, migration, wave-readiness, and self-audit gates.
12. Run self-critique, semantic judge review, and deterministic checks when available.
13. Synchronize registries, provenance, readiness, dependent specs, and affected plan notes.
14. Simulate implementation planning across all waves.
15. Ask focused human review questions only for unsafe assumptions.
16. Write or update the readiness report.

## Modes

| Mode | Purpose |
| --- | --- |
| Create | Generate specs from a project description. |
| Review/Approve | Resolve blocking decisions and record approval. |
| Update | Update affected specs and dependent layers. |
| Fix Gap | Apply downstream gap reports, update specs, and re-run the gate. |

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-architect/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/spec-architect/references/readiness-gates.md` | No-drift, ambiguity, requirements quality, standards-first, machine-readable contracts, semantic-alignment, async, security, privacy, observability, performance, resilience, production, supply-chain, data-integrity, migration, wave, interface, and parallel readiness gates. |
| `skills/spec-architect/references/artifact-shapes.md` | Expected spec tree, readiness report fields, inference policy, and standard failure defaults. |
| `skills/spec-architect/scripts/check_specs.mjs` | Deterministic consistency checker. |
| `skills/spec-architect/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Run the checker when a spec tree exists:

```bash
node skills/spec-architect/scripts/check_specs.mjs specs
```

A passing deterministic check means the spec set is mechanically coherent. It does not prove semantic completeness. Planning is allowed only after `specs/.readiness-report.yaml` has `status: approved`, `human_approval.status: approved`, `language: en`, and the readiness gates for no drift, ambiguity, requirements quality, spec structure, visualization, standards-first choices, machine-readable contracts, semantic alignment, async semantics, interfaces, end-to-end paths, unhappy paths, security/privacy, observability/logging, performance/resilience, data-integrity/recovery, production readiness, supply-chain integrity, migrations, waves, contradictions, semantic judge review, and self-audit have passed.
