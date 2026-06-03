# Eval Design

Evals prove the skill triggers and produces useful behavior; they are not a
replacement for deterministic checks.

## Prompt Set

Create at least five realistic prompts for a new skill:

- three should-trigger prompts for core workflows
- one casual or typo-heavy prompt that a real user might write
- one near-miss prompt that shares vocabulary but belongs to another skill

If the local eval schema supports only positive prompts, record near misses in
the expected output as rejection or routing behavior.

## Expected Output

Each expected output must state observable behavior:

- files or artifacts created
- checks or commands run
- blockers raised
- trigger/routing decision
- evidence reported

Avoid expectations that depend only on tone or subjective quality.

## Description Optimization

Optimize descriptions with train/validation separation:

1. Use a small train set to identify false negatives and false positives.
2. Rewrite the description by generalizing trigger categories, not by stuffing
   exact failed prompt wording.
3. Check a held-out validation set before accepting the description.
4. Keep the final description under the platform limit and short enough for
   always-loaded metadata.

## Benchmark Loop

When tools are available:

1. Run deterministic shape checks.
2. Run with-skill and without-skill or old-skill comparisons.
3. Capture timing and token usage if the runner exposes them.
4. Run `plugin-eval analyze <skill-dir> --format markdown`.
5. Iterate until failures are resolved or residual risk is explicitly accepted.

## Self-Audit

Before completion, answer:

- Did the skill trigger only where it should?
- Did it avoid collisions with adjacent/default skills?
- Did references reduce loaded context instead of hiding required steps?
- Are evals realistic enough to catch drift?
- Are unsafe, ambiguous, or missing-input cases blocked?
- What checks were skipped, and why?
