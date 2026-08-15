# Spec Ticket Implementation

`spec-ticket-implementation` executes exactly one approved AFK ticket from a spec implementation plan. It keeps implementation agents inside approved behavior, approved files, and approved acceptance criteria.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

The CLI and public skill directory are introduced in Vercel's
[`skills` announcement](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem).

## What It Does

- Confirms the ticket's pinned spec-manifest digest matches current approved
  readiness before editing.
- Runs configured spec and plan checkers.
- Reads only ticket `spec_refs` and `read_scope`.
- Writes only files listed by `write_scope`.
- Stops on missing behavior, missing contracts, unresolved decisions, blocked dependencies, or insufficient scope.
- Allows only D0 mechanical work and D1 policy-constrained private/reversible
  choices; all new D2/D3 choices are blockers.
- Stops when a full-slice ticket can only be partially implemented and routes to
  the planner for a split before production edits.
- Implements approved interfaces/contracts first when they are in scope, using
  deterministic project tools to generate types, validators, clients, stubs,
  fixtures, docs, and contract tests from approved machine-readable
  contract/IDL/schema sources when approved tooling or project configuration
  supports generation.
- Requires tests to be defined or generated from specs, contracts/schemas,
  acceptance criteria, and unhappy-path definitions before business logic is
  implemented.
- Blocks hand-edited generated artifacts unless manual edits are explicitly
  approved, and requires generation/drift-check evidence.
- Blocks handwritten service logic in contract-first clean rebuilds until the
  approved generation map, generator tests, generated artifacts, compile checks,
  and drift checks are in place.
- Blocks weak closed-boundary types unless the source contract explicitly
  defines an open JSON leaf.
- Blocks an unregistered exported DTO, entity, schema, event, record,
  projection, or mapper. Implementers reuse approved catalogued shapes and
  mappings, or stop for an approved new-shape decision.
- Requires every acceptance matrix row to be implemented, tested, verified, N/A
  with spec evidence, or blocked; blocked rows make the ticket partial.
- Requires happy-path and unhappy-path tests, proper error handling, logging through project conventions, and no unapproved mocks or fake implementations.
- Preserves data-integrity, rollback/recovery, no-data-loss, no-leak,
  performance-budget, log-level, and redaction guarantees from the specs.
- Preserves frontend/client access paths, screens/surfaces, user flows, UI
  states, accessibility/responsiveness, project design sources, shared styles,
  framework/component-library components, and reusable components/modules when
  user-facing work is in scope.
- Preserves requirement traceability plus production/release, configuration,
  dependency, SBOM/provenance, vulnerability, and license expectations when in
  scope.
- Records an implementation-evidence manifest with changed symbols, approved
  asset/module refs, command effects, and consumer impact before independent
  review. It may mark work `implemented` or `review_pending`, never `accepted`.
- Keeps default verification hermetic and separates opt-in external integration checks.

## How It Works

The skill starts with preflight checks, maps approved requirement IDs, generated-contract outputs, interfaces, and acceptance criteria to tests, implements one behavior at a time, then reviews its own work against the ticket. If the ticket requires invention, extra scope, unclear behavior, a missing contract, undefined deterministic generation commands, a fake implementation, or undefined security/recovery/performance/release/supply-chain behavior, it writes a blocker instead of coding.

## Workflow

1. Confirm approved specs and valid plan readiness.
2. Run baseline verification.
3. Parse ticket frontmatter and readiness fields.
4. Confirm dependencies are accepted, unless a ticket names an approved lower
   prerequisite and its exact evidence.
5. Read project conventions and scoped specs only.
6. Confirm frontend/client UX, design-source reuse, and component reuse
   expectations or explicit N/A evidence when relevant.
7. Verify the clean-rebuild/generation-map disposition when contract-heavy work
   is in scope.
8. Regenerate approved contract artifacts first when tooling exists.
9. Verify required generated artifacts and task prerequisite paths exist or run
   approved generation before production edits.
10. Add or generate failing unit, contract, integration, and E2E tests from
   specs/contracts/acceptance for happy paths, unhappy paths, recovery,
   security, frontend/client states, and performance behavior when relevant.
11. Implement approved interfaces/contracts and business logic after the tests
   exist and fail for the expected missing behavior.
12. Modify only `write_scope`.
13. Run ticket, project, contract, and drift verification.
14. Run the implementation-review-judge loop.
15. Record files changed, symbols, command effects, consumer impact, and
    implementation evidence; hand off for independent review.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-ticket-implementation/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/spec-ticket-implementation/references/pre-implementation-checks.md` | Preflight checklist before editing. |
| `skills/spec-ticket-implementation/references/implementation-loop.md` | Contract/codegen-first, test-first, quality, and review loop rules. |
| `skills/spec-ticket-implementation/references/definition-of-done.md` | Completion checklist for one ticket. |
| `skills/spec-ticket-implementation/references/write-scope-discipline.md` | Rules for strict write-scope enforcement. |
| `skills/spec-ticket-implementation/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Use this skill only for one approved ticket at a time. If the agent needs to decide product behavior, change contracts, expand scope, invent frontend UX/look and feel, duplicate styles/components, use files outside `write_scope`, handwrite around missing generated artifacts, accept weak closed-boundary types, or simulate missing work with mocks/fakes/placeholders, the correct output is a blocker/spec gap, not code.
