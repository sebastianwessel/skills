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

- Confirms specs are approved before editing.
- Runs spec and plan checkers when available.
- Reads only ticket `spec_refs` and `read_scope`.
- Writes only files listed by `write_scope`.
- Stops on missing behavior, missing contracts, unresolved decisions, blocked dependencies, or insufficient scope.
- Implements approved interfaces/contracts first when they are in scope, then works test-first through public interfaces.
- Requires happy-path and unhappy-path tests, proper error handling, logging through project conventions, and no unapproved mocks or fake implementations.
- Preserves data-integrity, rollback/recovery, no-data-loss, no-leak,
  performance-budget, log-level, and redaction guarantees from the specs.
- Preserves requirement traceability plus production/release, configuration,
  dependency, SBOM/provenance, vulnerability, and license expectations when in
  scope.
- Runs a ticket-level implementation-review-judge loop before marking work done.
- Keeps default verification hermetic and separates opt-in external integration checks.

## How It Works

The skill starts with preflight checks, maps approved requirement IDs, interfaces, and acceptance criteria to tests, implements one behavior at a time, then reviews its own work against the ticket. If the ticket requires invention, extra scope, unclear behavior, a missing contract, a fake implementation, or undefined security/recovery/performance/release/supply-chain behavior, it writes a blocker instead of coding.

## Workflow

1. Confirm approved specs and valid plan readiness.
2. Run baseline verification.
3. Parse ticket frontmatter and readiness fields.
4. Confirm dependencies are done or merged.
5. Read project conventions and scoped specs only.
6. Implement approved interfaces/contracts first when the ticket owns them.
7. Add failing public-interface tests for happy paths, unhappy paths, recovery, security, and performance behavior when relevant.
8. Modify only `write_scope`.
9. Run ticket and project verification.
10. Run the implementation-review-judge loop.
11. Record files changed and completion evidence.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-ticket-implementation/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/spec-ticket-implementation/references/pre-implementation-checks.md` | Preflight checklist before editing. |
| `skills/spec-ticket-implementation/references/implementation-loop.md` | Contract-first, test-first, quality, and review loop rules. |
| `skills/spec-ticket-implementation/references/definition-of-done.md` | Completion checklist for one ticket. |
| `skills/spec-ticket-implementation/references/write-scope-discipline.md` | Rules for strict write-scope enforcement. |
| `skills/spec-ticket-implementation/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Use this skill only for one approved ticket at a time. If the agent needs to decide product behavior, change contracts, expand scope, use files outside `write_scope`, or simulate missing work with mocks/fakes/placeholders, the correct output is a blocker/spec gap, not code.
