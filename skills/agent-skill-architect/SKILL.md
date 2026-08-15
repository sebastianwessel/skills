---
name: agent-skill-architect
description: Creates, reviews, repairs, and optimizes agent skills. Use when a skill needs authoring, trigger tuning, evals, checks, packaging readiness, or drift controls.
---

# Agent Skill Architect

Create and improve reusable agent skills without colliding with default skill
creators.

## Standard

A skill is ready only when trigger, workflow, resources, checks, evals, and stop
conditions prevent drift, hidden assumptions, and project-specific hardcoding.

## Invariants

- Unique lowercase hyphenated name; no `skill-creator`, reserved, vague, or
  existing names.
- Description is the trigger surface: third person, concise, specific, and
  includes `Use when ...`.
- `SKILL.md` stays procedural; details live in one-level `references/`, checks
  in `scripts/`.
- Risk decides strictness: fragile tasks need exact gates and stop conditions;
  flexible tasks get defaults with bounded escape hatches.
- No inference through missing behavior, resources, validation, or boundaries.
- New or changed skills need realistic evals, including near misses when the
  harness supports them.
- Self-audit against evidence; report missing checks or evals.

## Workflow

1. Identify mode: `Create`, `Review`, `Repair`, `Optimize Description`, or
   `Package Readiness`.
2. Read repository rules and inspect existing skill names to avoid collisions.
3. Capture intent, trigger contexts, non-trigger boundaries, outputs, tools,
   resources, stop conditions, and verification evidence.
4. Draft or update `SKILL.md`, references, scripts, docs, and evals.
5. Apply `references/quality-gates.md`.
6. Create or update `evals/evals.json` using `references/eval-design.md`.
7. Add deterministic scripts only for fragile/repeated checks.
8. Run `node <agent-skill-architect-skill-root>/scripts/check_skill.mjs <skill-dir>`.
9. Run `plugin-eval analyze <skill-dir> --format markdown` when available.
10. Self-audit trigger fit, ambiguity, disclosure, security, eval coverage,
    deterministic checks, and residual risk.

## Stop Conditions

Stop instead of writing or approving a skill when:

- behavior is unsafe, deceptive, secret-extracting, or outside user intent
- the name collides with an existing skill or reserved term
- trigger and non-trigger boundaries cannot be stated precisely
- workflow depends on missing files, unavailable tools, private data, or
  unapproved services
- eval expectations cannot be made observable enough for review
- required checks fail and the fix would change user intent

## Reference Map

- `references/quality-gates.md`: skill structure, trigger, strictness,
  progressive disclosure, security, and packaging gates.
- `references/eval-design.md`: eval prompt design, near-miss tests,
  description optimization, and benchmark evidence.
- `scripts/check_skill.mjs`: deterministic local skill-shape checker.

## Approval Rule

Do not approve a skill on prose quality alone. Approval requires deterministic
checks, realistic evals or an explicit N/A reason, concise self-audit, and a
clear statement of any remaining risk.
