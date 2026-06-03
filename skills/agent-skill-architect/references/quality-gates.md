# Quality Gates

Use these gates for every new or materially changed skill.

## Naming And Collision

- `name` and directory name match exactly.
- Name uses only lowercase letters, numbers, and hyphens.
- Name is specific to the capability and does not collide with installed,
  repository, or platform-default skills.
- Do not use reserved or misleading names such as `skill-creator`, `claude`,
  `anthropic`, `helper`, `tools`, `documents`, or `data`.

## Description

- One frontmatter `description`, third person, no XML tags.
- Includes what the skill does and a clear `Use when ...` trigger sentence.
- Names adjacent contexts where the skill should trigger.
- Avoids first person, vague claims, and broad catch-all wording.
- Stays concise enough for always-loaded metadata; if it becomes long, tighten
  triggers instead of adding examples.

## Structure

- `SKILL.md` is the only required executable instruction file.
- `SKILL.md` carries core workflow and navigation only.
- Reference files are one level from `SKILL.md`; do not require nested
  reference-chasing.
- Reference files longer than 100 lines include a contents section.
- Use `scripts/` for deterministic checks, packaging, transforms, or repeated
  fragile operations.
- Do not put `README.md`, changelogs, or human docs in the skill directory.
  Human docs belong in `docs/skills/<skill-name>.md`.

## Strictness

- Match specificity to fragility. Fragile tasks need exact commands, gates,
  pass/fail criteria, and stop conditions.
- Flexible tasks still need a default path and bounded escape hatches.
- Do not use vague operating text such as `as appropriate`, `if needed`,
  `where possible`, `handle errors`, `be secure`, or `best effort` unless the
  skill immediately defines objective applicability and evidence.
- A skill must block, ask one focused clarification, or report uncertainty when
  required inputs, tools, files, or behavior are missing.
- The skill must tell the agent what not to do when adjacent skills or workflows
  own the task.

## Security And Integrity

- No malware, credential collection, private-data export, hidden network calls,
  shell-profile edits, or unexpected filesystem changes.
- Scripts must be small, auditable, and scoped to the skill purpose.
- If external tools or services are required, state them explicitly and provide
  a safe fallback or blocker condition.
- Do not store transcripts, private customer data, model logs with secrets, or
  generated archives inside the skill package.

## Approval Evidence

Approval requires:

- frontmatter and directory checks pass
- description trigger is specific and concise
- workflow has stop conditions and validation
- progressive disclosure is one-level and purposeful
- evals cover common prompts and near misses, or N/A is justified
- deterministic checks and plugin-eval results are recorded when available
- self-audit lists assumptions, skipped checks, uncertainty, and residual risk
