# Implementation Guide

## Purpose

This repository is a maintained library of AI agent skills. The implementation
surface is mostly Markdown plus small helper scripts. Optimize for concise,
discoverable, secure skill packages that can be loaded on demand.

## Module Organization

- Root guidance files:
  - `AGENTS.md`: repository rules for agents.
  - `CLAUDE.md`: short pointer for Claude-compatible agents.
  - `.agent/IMPLEMENTATION.md`: detailed maintainer conventions.
- Skill packages:
  - `skills/<skill-name>/SKILL.md` is required.
  - `skills/<skill-name>/references/` is for detailed docs loaded only when
    needed.
  - `skills/<skill-name>/scripts/` is for deterministic helper code.
  - `skills/<skill-name>/assets/` is for templates or non-context resources.
  - `skills/<skill-name>/agents/` is for UI metadata when needed.
- Repository helper scripts live in `scripts/`.
- Human-facing skill documentation lives in `docs/skills/<skill-name>.md`, not
  inside the executable skill package.

## Skill Authoring Conventions

- Follow Anthropic's Agent Skills best practices:
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Keep `SKILL.md` focused on trigger-critical workflow and navigation.
- Keep references one level deep from `SKILL.md`; do not require readers to
  chase nested reference chains.
- Add a table of contents to reference files longer than 100 lines.
- Use scripts for fragile, repetitive, or validation-sensitive operations.
- Keep examples short and directly useful.
- Test new or materially changed skills with realistic prompts before treating
  them as ready.

## Reliability And Self-Audit

- New and materially changed skills must include a concise self-audit or
  review gate when the workflow involves judgment, generation, planning,
  specification, implementation, review, or safety-sensitive output.
- The gate must instruct the agent to judge its own decisions against approved
  sources, distinguish verified facts from assumptions, surface contradictions,
  and state gaps honestly.
- For spec, planning, implementation, and review skills, the gate must be
  operational: list the exact artifacts, interfaces, acceptance criteria,
  verification evidence, and stop conditions to inspect.
- Do not add performative reflection. Keep self-audit short, concrete, and tied
  to pass/fail outcomes. If the audit finds an unresolved gap, the skill should
  stop or report a blocker instead of letting the agent proceed by guesswork.
- Spec, planning, implementation, and review skills must treat security,
  privacy, data integrity, recovery, observability, performance, unhappy paths,
  and no-leak/no-data-loss behavior as first-class gates, not advisory cleanup.

## Naming

- Skill directory names and frontmatter `name` values must match.
- Use lowercase letters, numbers, and hyphens only.
- Prefer gerund names for consistency, for example `reviewing-code` or
  `writing-documents`.
- Avoid vague names such as `helper`, `tools`, `documents`, or `data`.

## README Index

The root README acts as the repository table of contents. After any skill is
added, removed, renamed, or given a human docs page, run:

```bash
python3 scripts/update-readme.py
```

The script scans `skills/*/SKILL.md`, reads frontmatter, and rewrites the skill
index between the generated markers. When `docs/skills/<skill-name>.md` exists,
the index links it in the `Human docs` column.

## Human Skill Docs

Each maintained skill should have a concise human-facing page at
`docs/skills/<skill-name>.md` using this structure:

1. Title and one-paragraph summary.
2. Installation.
3. What it does.
4. How it works.
5. Workflow or modes.
6. Files included.
7. Validation or safety notes.

These docs explain the skill to repository users and maintainers. They should
not duplicate the full `SKILL.md`; link to the executable skill and summarize
the behavior in stable user language.

Use this installation section for each skill doc unless the package name
changes:

```bash
npx skills add sebastianwessel/skills
```

## Security

- Never commit `.env`, credentials, private keys, tokens, local config, or
  secret-bearing generated output.
- Treat skill scripts as executable supply-chain surface. Keep them small,
  auditable, and scoped to the skill's stated purpose.
- Do not add scripts that phone home, install dependencies, alter shell profiles,
  or modify files outside the repository without explicit user approval.
- Do not store private customer data, model transcripts, logs with secrets, or
  exported workspace data in this repo.

## Verification

For documentation-only changes:

```bash
python3 scripts/update-readme.py
git status --short
```

For script changes:

```bash
python3 -m py_compile scripts/update-readme.py
python3 scripts/update-readme.py
git status --short
```

## Version History

- 2026-05-27: Initial repository conventions for maintaining AI agent skills.
