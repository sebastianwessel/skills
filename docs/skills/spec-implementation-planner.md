# Spec Implementation Planner

`spec-implementation-planner` turns approved specs into an implementation plan made of dependency-ordered waves and AFK tickets that autonomous agents can execute without clarification.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

The CLI and public skill directory are introduced in Vercel's
[`skills` announcement](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem).

## What It Does

- Reads `specs/.readiness-report.yaml` and stops unless specs are approved.
- Requires approved specs to declare `language: en` and pass semantic judge
  review when the deterministic English smoke checks are used.
- Creates `plans/implementation-plan.md` plus registry, status, dependency, and scope indexes.
- Splits implementation work into dependency-ordered waves that each end in a
  working end-to-end increment for that wave's scope.
- Records implementation order plus `depends_on`, `blocked_by`, and `unblocks`
  relationships so agents know which tickets can start, which are blocked, and
  what becomes available when a ticket is done.
- Starts with shared contract/interface foundation work when parallel agents
  need stable boundaries, then isolates backend, frontend, adapter, docs, and
  test tickets against those contracts.
- Maps unhappy paths, security/privacy, log redaction, performance budgets,
  data-integrity, recovery, and manual-intervention requirements into owned
  tickets with acceptance criteria and verification.
- Preserves source requirement IDs and maps production readiness,
  release/rollback, operations, dependency, SBOM/provenance, vulnerability, and
  license responsibilities into tickets or explicit not-applicable dispositions.
- Writes AFK tickets with scoped reads/writes, acceptance criteria, verification commands, and handoff notes.
- Blocks tickets that would require agents to invent behavior, choose interfaces, or resolve missing specs.
- Rejects placeholder, mock, fake, stub, or no-op implementation shortcuts unless the specs explicitly require test fixtures or fake providers.
- Tracks planned, in-progress, partial, blocked, done, and skipped work so plans can pause and resume.
- Requires a plan-level self-audit that names weak assumptions, readiness
  evidence, fake-work risk, parallel-boundary risk, and blockers or `none`.
- Preserves completed tickets as historical records and creates remediation or migration tickets for later quality gates.

## How It Works

The skill verifies that every planned ticket can be filled from approved specs before it emits executable work. It checks for contract readiness, ticket readiness, decision ledgers, requirement and contract traceability, operational path coverage, acceptance test matrices, and concrete verification commands.

When a gap appears, it writes a blocked readiness note instead of creating implementation work. Missing product behavior, architecture decisions, API shapes, persistence semantics, failure behavior, or test strategy return to `spec-architect`.

## Workflow

1. Read the approved spec readiness report.
2. Simulate the planned ticket areas from specs.
3. Create the plan root and indexes.
4. Group work into waves with end-to-end outcomes and isolation notes.
5. Write implementation-ready tickets with compact context digests.
6. Record a plan-level self-audit.
7. Verify registry, dependencies, unblocks links, scope, status, path coverage, NFR ownership, and ticket readiness.
8. Run plan and wave checker scripts.

## Output Files

| Path | Purpose |
| --- | --- |
| `plans/implementation-plan.md` | Top-level implementation plan. |
| `plans/_registry.yaml` | Ticket registry and file index. |
| `plans/_status.yaml` | Ticket status tracking. |
| `plans/_dependencies.yaml` | Ticket dependency graph. |
| `plans/_scope.yaml` | Read/write scope index. |
| `plans/wave_NN_slug/plan.md` | Per-wave plan and parallelization notes. |
| `plans/wave_NN_slug/tickets/TICKET-NNN-name.md` | AFK implementation ticket. |

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-implementation-planner/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/spec-implementation-planner/references/planning-gates.md` | Ticket shape, plan quality, public workflow, and verification gates. |
| `skills/spec-implementation-planner/references/check_plan.mjs` | Deterministic plan consistency checker. |
| `skills/spec-implementation-planner/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Run the checkers after creating or changing a plan:

```bash
node skills/spec-implementation-planner/references/check_plan.mjs .
```

Passing checks mean the plan is mechanically coherent. They do not replace spec approval or semantic review.
