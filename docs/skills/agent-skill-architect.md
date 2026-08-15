# Agent Skill Architect

`agent-skill-architect` creates, repairs, reviews, and optimizes reusable agent
skills without colliding with default `skill-creator` skills. It is stricter
than a generic skill creator: it enforces precise triggers, one-level
progressive disclosure, deterministic checks, realistic evals, security gates,
and no-drift stop conditions.

## Installation

Install this skill package with the open skills ecosystem CLI:

```bash
npx skills add sebastianwessel/skills
```

The CLI and public skill directory are introduced in Vercel's
[`skills` announcement](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem).

## What It Does

- Creates new skill packages with unique, non-colliding names.
- Reviews existing skills for trigger quality, ambiguity, progressive
  disclosure, security, eval coverage, and validation evidence.
- Optimizes frontmatter descriptions so skills trigger on the right tasks and
  avoid near-miss false positives.
- Requires realistic eval prompts and expected outputs.
- Runs a deterministic shape checker before approval.
- Blocks unsafe, deceptive, vague, or untestable skill behavior.

## How It Works

The skill combines local `skill-creator` workflow ideas with the current
Claude and AgentSkills guidance: keep `SKILL.md` concise, set the right degree
of freedom, use references only when needed, write descriptions as the trigger
surface, and evaluate both should-trigger and near-miss prompts.

## Workflow

1. Select create, review, repair, optimize-description, or package-readiness
   mode.
2. Inspect existing skill names and repository conventions.
3. Capture intent, trigger contexts, non-trigger boundaries, outputs, tools,
   stop conditions, and evidence.
4. Draft or update `SKILL.md`, references, scripts, docs, and evals.
5. Run deterministic checks and plugin-eval when available.
6. Self-audit assumptions, skipped checks, trigger fit, security, and residual
   risk.

## Included Files

| Path | Purpose |
| --- | --- |
| `skills/agent-skill-architect/SKILL.md` | Executable agent instructions and trigger metadata. |
| `skills/agent-skill-architect/references/quality-gates.md` | Naming, description, structure, strictness, security, and approval gates. |
| `skills/agent-skill-architect/references/eval-design.md` | Eval prompt, description optimization, benchmark, and self-audit guidance. |
| `skills/agent-skill-architect/scripts/check_skill.mjs` | Deterministic local skill-shape checker. |
| `skills/agent-skill-architect/evals/evals.json` | Evaluation scenarios for the skill. |

## Validation And Safety

Run the checker against a skill directory:

```bash
node <agent-skill-architect-skill-root>/scripts/check_skill.mjs <skill-dir>
```

Then run plugin-eval when available:

```bash
plugin-eval analyze skills/<skill-name> --format markdown
```

The deterministic checker catches structural problems. It does not prove that a
skill is semantically strong; final approval still needs eval evidence and an
honest self-audit.
