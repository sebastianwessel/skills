# Skill Evaluations

Start with a realistic failed or difficult task. Capture the operator request
and smallest input that exposes the problem. Include at least three scenarios:
a normal run, a failure or repair, and a near miss where another skill owns the
task. Avoid putting the answer in the prompt.

Keep `evals/evals.json` beside the skill with a matching `skill_name`, a unique
`id` per case, and nonempty `prompt` and `expected_output`. Use `files` for
bundled relative inputs. Add observable assertions such as a file change, a
specific blocker, or the verification proof expected in the handoff.

For mechanical checks, start from a known-good fixture and introduce one
failure per test. Run the actual packaged command and inspect its exit status
and diagnostic. For agent behavior, compare the same tasks with and without
the change if the runtime supports it. Record model, inputs, result, and any
measured time or tokens. Static package validation establishes file and
metadata integrity. Report live behavior separately.
