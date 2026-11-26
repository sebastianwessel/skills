# Skill Quality Gates

- **Trigger and ownership.** The directory and metadata name match. The
  description tells the model when to load the skill. Test overlap with
  neighboring skills using realistic and near-miss requests.
- **Instruction cost.** Put the decisive steps and failure routes in
  `SKILL.md`. Link reference files directly and load them when useful. Give
  long references navigation. Remove examples, defaults, and scripts that
  repeat knowledge an agent already has or another artifact owns.
- **Correctness.** Each step has usable inputs and evidence of completion.
  Review exact commands, paths, and failure exits. Use source-backed decisions
  and explicit uncertainty. Exercise the normal path and a realistic failure.
- **Tool effects.** State requirements and limits for external tools, sensitive
  data, network access, and writes. Keep review read-only unless the task
  authorizes changes. Verify a script solves a repeated mechanical problem.
- **Release.** Validate the installable package and its resources. Run tests
  and distinguish manifest validation, scenario runs, and measured engagement.
  Review results against the intended outcome and report unverified behavior.
