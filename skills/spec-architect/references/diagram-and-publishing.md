# Diagrams and publishing

## Choose a view

Use a visual when it helps someone understand scope, structure, or behavior.
Choose the audience and the question first. Use a context view for actors and
external systems, a structural view for ownership and dependencies, a
sequence or swimlane for handoffs, and a state or recovery view for failure
handling. Split views when different levels of detail or branch counts
compromise reading. A simple table can be enough for a short mapping.

## Design, export, review

1. Start with the owning page and its canonical refs. Decide the reading order
   and place boundaries, lanes, and major nodes before connecting them. In
   draw.io, use a grid, aligned baselines, consistent typography, and clear
   spacing for edge labels. Use whitespace, grouping and a restrained palette
   to make the hierarchy visible. Connect on sensible edges, route around
   labels and boxes, and avoid crossings. Review automated layout manually.
2. Use short labels using canonical names. Label actions, direction,
   asynchronous handoffs, guards, error branches, and terminal states where
   relevant. Make meaning visible in text as well as color.
3. Save an editable `.drawio` and a same-stem SVG or PNG in `specs/visuals/`.
   Embed the export with useful alt text, scope/caption, and an editable-source
   link on the owning page. Give a full-size link when dense views need zoom.
   Describe important paths in nearby Markdown. Use a static export without
   embedded editor data or remote assets for publishing. Use a local editor or
   an authorized service for restricted content.
4. Open the actual export at normal documentation width and narrow width.
   Inspect contrast, type size, truncation, alignment, spacing, connector
   crossings, reading order and usable zoom. Reconcile material nodes, edges,
   branches, and outcomes with exact canonical refs. Record owner, reviewed refs,
   review result, and rendered evidence in the approval review.
5. Update the owning text, diagram source and export together when semantics
   change. Re-export after a source change. The spec digest includes the assets
   and index pages. It detects content changes. Readiness review assesses
   visual fidelity, accessibility and correctness.

## Publish only reviewed content

Use ordinary Markdown, simple YAML frontmatter, portable relative links and
static images. Keep the rendered site outside `specs/`. For an internal
preview with permission to read the full tree, configure MkDocs with
`docs_dir: specs`. Start navigation at `index.md` and expose vision,
architecture, domains, components, flows, decisions, and gaps. Use strict link
and anchor checking and run `mkdocs build --strict`. Inspect the generated
files and a few canonical routes.

For public or limited-audience publication, build from a staging directory
containing only approved pages and assets. Treat source drawings, YAML,
machine-readable contracts, working status, sensitive evidence, and meeting
notes as restricted until the publication scope authorizes them. MkDocs
navigation only controls discoverability. Check the resulting files, images,
links, and search index for information outside the allowed scope. Preserve
relative layout where possible and rewrite or omit links to excluded material
in the staged view. Keep authoring and authority in the canonical source.

- [MkDocs configuration](https://www.mkdocs.org/user-guide/configuration/)
- [Draw.io layout controls](https://www.drawio.com/docs/manual/shapes/arrange-align-shapes/)
- [Draw.io SVG export](https://www.drawio.com/docs/manual/export/export-to-svg/)
- [W3C guidance for complex images](https://www.w3.org/WAI/tutorials/images/complex/)
