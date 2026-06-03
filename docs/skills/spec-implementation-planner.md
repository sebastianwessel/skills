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
- Prefers vertical-slice waves that each end in a working, reachable, testable
  end-to-end increment for that wave's scope.
- Allows horizontal foundation or refactor waves only when they unlock safer
  parallel implementation or reliability, and requires a rationale, unblocked
  tickets, next vertical slice, and test evidence.
- Records implementation order plus `depends_on`, `blocked_by`, and `unblocks`
  relationships so agents know which tickets can start, which are blocked, and
  what becomes available when a ticket is done.
- Starts with shared contract/interface foundation work when parallel agents
  need stable boundaries, generated types, validators, clients, stubs,
  fixtures, or contract-test scaffolds, then isolates backend, frontend,
  adapter, docs, and test tickets against those outputs.
- Requires tickets to name approved contract/IDL/schema sources, generation
  commands, deterministic generators/tools, generated outputs,
  generated/contract tests, drift checks, or explicit not-applicable evidence.
- Maps unhappy paths, security/privacy, log redaction, performance budgets,
  data-integrity, recovery, and manual-intervention requirements into owned
  tickets with acceptance criteria and verification.
- Maps user-facing and client-consumed work into tickets for reachable access,
  screens/surfaces, user flows, UI states, accessibility/responsiveness, design
  source reuse, framework/component-library reuse, reusable components/modules,
  and explicit N/A evidence when there is no frontend/client scope.
- Preserves source requirement IDs and maps production readiness,
  release/rollback, operations, dependency, SBOM/provenance, vulnerability, and
  license responsibilities into tickets or explicit not-applicable dispositions.
- Writes AFK tickets with scoped reads/writes, acceptance criteria, verification commands, and handoff notes.
- Requires each ticket and wave to state its slice strategy so agents know
  whether they are delivering a vertical end-to-end increment or an approved
  horizontal exception.
- Requires unit tests, end-to-end tests, and a default 80% code coverage target
  unless approved specs or project standards define another threshold.
- Requires test-driven implementation order: tests are derived from approved
  specs, contracts/schemas, acceptance criteria, and unhappy-path definitions
  before business logic is planned or implemented.
- Blocks tickets that would require agents to invent behavior, choose
  interfaces, invent frontend look and feel, duplicate styles/components, or
  resolve missing specs.
- Rejects placeholder, mock, fake, stub, or no-op implementation shortcuts unless the specs explicitly require test fixtures or fake providers.
- Tracks planned, in-progress, partial, blocked, done, and skipped work so plans can pause and resume.
- Syncs changed specs into indexes, impact notes, dependencies, status, and
  follow-up tickets while preserving completed ticket history.
- Requires a plan-level self-audit that names weak assumptions, readiness
  evidence, fake-work risk, parallel-boundary risk, and blockers or `none`.
- Preserves completed tickets as historical records and creates remediation or migration tickets for later quality gates.
- Treats final plan completion as full spec implementation: no gaps, no
  unresolved implementation work, no unapproved mocks/fakes/placeholders, full
  end-to-end alignment with specs, and complete verification evidence.

## How It Works

The skill verifies that every planned ticket can be filled from approved specs before it emits executable work. It checks for contract readiness, generated-contract ownership, ticket readiness, decision ledgers, requirement and contract traceability, operational path coverage, acceptance test matrices, and concrete verification commands.

When a gap appears, it writes a blocked readiness note instead of creating implementation work. Missing product behavior, architecture decisions, API shapes, persistence semantics, failure behavior, or test strategy return to `spec-architect`.

## Workflow

1. Read the approved spec readiness report.
2. Simulate the planned ticket areas from specs.
3. Create the plan root and indexes.
4. Group work into vertical-slice waves with end-to-end outcomes and isolation notes.
5. Document horizontal foundation/refactor exceptions only when they unlock
   parallel work or reliability.
6. Plan contract/codegen foundation work before dependent parallel tickets.
7. Assign frontend/client access, UX states, design reuse, and component reuse
   ownership when relevant.
8. Assign unit, contract/generated, integration, end-to-end, and coverage
   verification ownership.
9. Put test-definition and generated-test tasks before business-logic tasks for
   the behavior they prove.
10. Write implementation-ready tickets with compact context digests.
11. Record a plan-level self-audit.
12. Update plan impact notes when specs changed.
13. Verify registry, dependencies, unblocks links, scope, status, slice strategy, test-first order, path coverage, frontend/client ownership, generated-contract ownership, NFR ownership, test coverage, and ticket readiness.
14. Run plan and wave checker scripts.

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
