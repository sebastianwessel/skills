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
- Centralizes shared facts such as vocabulary, policies, errors, type semantics, NFRs, and public contracts so specs link instead of repeating.
- Uses Mermaid diagrams only when they improve human understanding, and requires diagrams to stay aligned with authoritative text.
- Defaults to industry-standard protocols, formats, errors, structured logging, observability, architecture, and framework conventions; custom designs need rationale and approval.
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

The skill drafts autonomously where defaults are safe, but asks focused human questions for product scope, compliance or security boundaries, irreversible architecture choices, public contract semantics, or contradictions with stated intent.

It uses compact reference files for readiness gates and artifact shapes. It can also run a deterministic consistency checker against a spec tree.

## Workflow

1. Generate or update layered specs from business/user intent to technical detail.
2. Define repository topology, ownership boundaries, reusable packages/libs, components, modules, and services.
3. Describe public workflows, frontend UX states, accessibility, design-system usage, reusable components, and end-user behavior.
4. Prefer industry-standard protocols, formats, interfaces, architectural patterns, observability, and framework conventions.
5. Specify developer experience, setup paths, safe defaults, and advanced escape hatches.
6. Ensure public APIs, configs, schemas, plugins, policies, and extension points have contracts, docs, examples, and source-of-truth links.
7. Add Mermaid diagrams only where useful and keep them aligned with prose/contracts.
8. Check no-drift, ambiguity, spec-structure, visualization, standards-first, semantic-alignment, async, interface, end-to-end, unhappy-path, security/privacy, observability, performance/resilience, data-integrity/recovery, contradiction, migration, wave-readiness, and self-audit gates.
9. Run self-critique and deterministic checks when available.
10. Simulate implementation planning across all waves.
11. Ask focused human review questions only for unsafe assumptions.
12. Write or update the readiness report.

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
| `skills/spec-architect/references/readiness-gates.md` | No-drift, ambiguity, semantic-alignment, async, security, privacy, observability, performance, resilience, data-integrity, migration, wave, interface, and parallel readiness gates. |
| `skills/spec-architect/references/artifact-shapes.md` | Expected spec tree, readiness report fields, inference policy, and standard failure defaults. |
| `skills/spec-architect/scripts/check_specs.mjs` | Deterministic consistency checker. |
| `skills/spec-architect/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Run the checker when a spec tree exists:

```bash
node skills/spec-architect/scripts/check_specs.mjs specs
```

A passing deterministic check means the spec set is mechanically coherent. It does not replace semantic review or human approval. Planning is allowed only after `specs/.readiness-report.yaml` has `status: approved`, `human_approval.status: approved`, and the readiness gates for no drift, ambiguity, spec structure, visualization, standards-first choices, semantic alignment, async semantics, interfaces, end-to-end paths, unhappy paths, security/privacy, observability/logging, performance/resilience, data-integrity/recovery, migrations, waves, contradictions, and self-audit have passed.
