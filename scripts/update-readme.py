#!/usr/bin/env python3
"""Refresh the generated skill index in README.md."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
SKILLS = ROOT / "skills"
DOCS = ROOT / "docs" / "skills"
START = "<!-- skills-index:start -->"
END = "<!-- skills-index:end -->"


def parse_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        return {}

    data: dict[str, str] = {}
    for raw_line in match.group(1).splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"').strip("'")
    return data


def markdown_cell(value: str) -> str:
    return value.replace("\n", " ").replace("|", r"\|").strip()


def skill_rows() -> list[str]:
    rows: list[str] = []
    if not SKILLS.exists():
        return rows

    for skill_file in sorted(SKILLS.glob("*/SKILL.md")):
        skill_dir = skill_file.parent.name
        rel = skill_file.relative_to(ROOT).as_posix()
        doc_file = DOCS / f"{skill_dir}.md"
        doc_rel = doc_file.relative_to(ROOT).as_posix()
        docs_link = f"[docs]({doc_rel})" if doc_file.exists() else ""
        frontmatter = parse_frontmatter(skill_file)
        name = markdown_cell(frontmatter.get("name") or skill_file.parent.name)
        description = markdown_cell(
            frontmatter.get("description") or "No description provided."
        )
        rows.append(f"| [{name}]({rel}) | {description} | {docs_link} |")

    return rows


def render_index() -> str:
    rows = skill_rows()
    if not rows:
        return "\nNo skills have been added yet.\n"

    return (
        "\n| Skill | Description | Human docs |\n"
        "| --- | --- | --- |\n"
        + "\n".join(rows)
        + "\n"
    )


def main() -> None:
    readme = README.read_text(encoding="utf-8")
    replacement = f"{START}{render_index()}{END}"

    if START not in readme or END not in readme:
        raise SystemExit(f"README.md must contain {START} and {END} markers")

    updated = re.sub(
        rf"{re.escape(START)}.*?{re.escape(END)}",
        replacement,
        readme,
        flags=re.DOTALL,
    )
    README.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()
