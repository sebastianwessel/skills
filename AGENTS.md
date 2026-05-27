# Repository Instructions

This repository maintains reusable AI agent skills. Treat skills as small,
self-contained capability packages, not as application code.

## Source of Truth

- Root conventions live in this file and `.agent/IMPLEMENTATION.md`.
- Claude-compatible agents should read this file through `CLAUDE.md`.
- Skill authoring follows Anthropic's Agent Skills best practices:
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

## Repository Layout

```text
.
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── .agent/
│   └── IMPLEMENTATION.md
├── scripts/
│   └── update-readme.py
└── skills/
    └── <skill-name>/
        └── SKILL.md
```

## Skill Rules

- Store every skill in `skills/<skill-name>/`.
- Every skill must include `SKILL.md` at the skill root.
- Optional skill resources should stay inside that skill directory, typically
  `scripts/`, `references/`, `assets/`, and `agents/`.
- Do not put a `README.md`, changelog, installation guide, or unrelated docs
  inside individual skill directories.
- Human-facing skill documentation belongs in `docs/skills/<skill-name>.md`.
  Keep executable skill packages focused on agent-loaded instructions and
  resources.
- Every human-facing skill doc must include an `Installation` section with the
  package command:

  ```bash
  npx skills add sebastianwessel/skills
  ```

- Keep `SKILL.md` concise. Move detailed reference material into one-level-deep
  files referenced directly from `SKILL.md`.
- Do not commit secrets, credentials, private data exports, local model caches,
  or generated archives.

## Skill Metadata

Each `SKILL.md` must start with YAML frontmatter:

```yaml
---
name: writing-documentation
description: Writes and maintains end-user documentation. Use when creating, editing, or reviewing user-facing docs, setup guides, or troubleshooting material.
---
```

- `name` must be lowercase letters, numbers, and hyphens only.
- Prefer gerund names such as `writing-documentation` or
  `testing-integrations`.
- `description` must explain both what the skill does and when to use it.
- Write descriptions in third person.

## Expected Commands

- Refresh the root README skill index after adding, removing, or renaming a
  skill or human docs page:

  ```bash
  python3 scripts/update-readme.py
  ```

- Check tracked files before finishing:

  ```bash
  git status --short
  ```

## Missing Definition Behavior

If a requested skill has unclear trigger conditions, unsafe behavior, missing
validation steps, or ambiguous resources, stop and tighten the skill definition
before adding more files.
