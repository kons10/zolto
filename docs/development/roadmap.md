# Roadmap

## Phase 1 — Markdown Core ✅

Full CommonMark/GFM-compatible Markdown engine. 60+ tests.

## Phase 2 — Extended Markdown ✅

Callouts, admonitions, reference links, figures, definition lists,
table captions, code metadata, extended inlines, diagnostics. 233 tests.

## Phase 3 — Native Block Directives ✅

14 component types via universal `@directive` syntax: embed, collapse,
tabs, cards, steps, columns, badges, tags, alerts, timeline, progress,
avatar, icon. 380 tests (cumulative).

## Phase 4 — Native Mathematics Engine ✅

LaTeX-like math syntax with zero external dependencies (no KaTeX/MathJax
required). Inline `$...$` and block `@math...@/math`, equation numbering,
`@ref()` cross-references, dual HTML+MathML rendering. 511 tests total (cumulative).

## Phase 5 — Native Diagram & Graph Engine ✅

Human-readable, deterministic native diagram engine with 23 diagram types,
8 pluggable layout algorithms (hierarchical, tree, circular, radial, force, grid, orthogonal, manual),
theme system (`light`, `dark`, `custom:neo`, `custom:night`), groups, clusters, cross-references,
and responsive accessible SVG rendering. 548 tests total (cumulative).

## Phase 6 — Components + Layouts (planned)

- `@component` / `@slot` system
- JSX-style component invocation `<Card title="…">`
- `@grid` / `@flex` layout blocks
- Full editor UI (`js/editor/`) with contenteditable surface
- Command palette, autocomplete, folding

## Phase 7 — Enterprise Structure (planned)

- Extract CSS from `index.html` into `css/` modules
- Promote `js/` stubs to real implementations
- VS Code LSP extension
- npm package publication
- Full Playwright e2e test suite
