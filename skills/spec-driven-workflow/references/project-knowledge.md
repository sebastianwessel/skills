# Organizing project knowledge

Start at `specs/index.md`. A small project can keep its goals, design and flows
there. Add topic pages when readers need separate starting points or subjects
change independently. Group related variants by shared rules, boundaries or
recovery behavior. Give material topics a direct path from the index or
their section overview.

Read the request, controlling policy, decisions, contracts and code. Separate
desired behavior from what the code or release currently does. Trace the
actual entry point through permissions, state and data effects, errors,
recovery and final state. Define applicable privacy, data classification,
redaction, integrity, performance, operational, release/rollback and
supply-chain requirements. Cite the rules that establish them. Run the
[slice checker's](../scripts/check_specs.mjs) draft structure check and
project-native validators as relevant. Update linked diagrams, contracts,
consumer docs and acceptance rows when the behavior they describe changes.

| Subject | Questions its page answers |
| --- | --- |
| Business or domain | Who needs the outcome? What policy, terms, measures and exclusions apply? What authorizes them? |
| Solution design | How do actors, systems and boundaries fit together? What shared constraints shape the design? |
| Components | Which service, module or package owns an interface, data or operational responsibility? What can consumers depend on? |
| Flows | What starts the process? What happens on success and failure, including state, side effects, recovery and escalation? |
| Contracts | Which schema owns the representation? Which consumers reuse it? What do null values, conversions, permitted loss and redaction mean? |

Write each rule in one place. Link directly to its stable heading from
affected flows and consumers. Use an explicit HTML anchor directly above a
heading when a stable address matters. Use plain Markdown with relative
inline links and optional renderer metadata. Use OKF metadata where a project
exchanges OKF documents. Keep meeting notices and private notes optional and
access-controlled. Transfer confirmed decisions into the governing source.

## Define acceptance as behavior settles

Put the behavior and final outcome on its governing page. Add
`specs/acceptance.yaml` when there is a testable scenario. A row contains one
stable `id`, the exact section `source` (such as
`flows/export.md#access-denied`), and a `verify` list of tests, commands or
precise observations that distinguish an incorrect implementation. Tests may
be planned. Cite the IDs in reviews and tickets. When one outcome can mature
independently, give it its own section so it can be approved on its own.

## Record decisions and questions where they matter

Keep routine choices on the governing page. For a material business,
technical or mixed choice, store an ADR in a nearby `decisions/` directory
or in `specs/decisions/` for a shared decision. Explain the scope, options,
choice, consequences and links to affected rules. Mark ADRs `proposed`,
`accepted`, or `superseded` in frontmatter. An accepted ADR adds `evidence`
for the attributable approval. A superseded ADR adds the spec-root-relative
`replacement` path. Obtain business and technical authority where needed.
Use an overview for discovery and link active governing sections directly to
the accepted ADRs they rely on.

Keep a clear **Open question** beside the affected rule, naming the decision
needed, its impact and the next action. Include a decision-maker when useful.
Use a linked Markdown page in `gaps/` only when an investigation needs its
own space. Close the question by updating the rule and removing the open
note or record. Cite the decision on the rule if readers will need it. Git
keeps the history. A deferred question stays visible with a revisit condition.
Review whether the selected slice can proceed independently.
