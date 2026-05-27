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
- Implements acceptance criteria through public interfaces and verifies each mapped test or command.
- Keeps default verification hermetic and separates opt-in external integration checks.

## How It Works

The skill starts with preflight checks, then implements one behavior at a time from the ticket. If the ticket requires invention, extra scope, unclear behavior, or a missing contract, it writes a blocker instead of coding.

## Workflow

1. Confirm approved specs and valid plan readiness.
2. Run baseline verification.
3. Parse ticket frontmatter and readiness fields.
4. Confirm dependencies are done or merged.
5. Read project conventions and scoped specs only.
6. Modify only `write_scope`.
7. Add behavior tests and failure-path tests.
8. Run ticket and project verification.
9. Record files changed and completion evidence.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/spec-ticket-implementation/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/spec-ticket-implementation/references/pre-implementation-checks.md` | Preflight checklist before editing. |
| `skills/spec-ticket-implementation/references/definition-of-done.md` | Completion checklist for one ticket. |
| `skills/spec-ticket-implementation/references/write-scope-discipline.md` | Rules for strict write-scope enforcement. |
| `skills/spec-ticket-implementation/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Use this skill only for one approved ticket at a time. If the agent needs to decide product behavior, change contracts, expand scope, or use files outside `write_scope`, the correct output is a blocker/spec gap, not code.
