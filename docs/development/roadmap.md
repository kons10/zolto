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

## Phase 6 — Native Charts & Data Visualization Engine ✅

Native chart and data visualization engine supporting 24 chart types (`bar`, `hbar`, `line`, `area`, `spline`, `step`, `pie`, `donut`, `scatter`, `bubble`, `radar`, `polararea`, `histogram`, `boxplot`, `candlestick`, `heatmap`, `treemap`, `sunburst`, `funnel`, `waterfall`, `gauge`, `timeline`, `calendar`, `mixed`), statistical calculation engine, multi-format datasets (inline, CSV, TSV, JSON, variables), theme styling, responsive SVG rendering, and static validator. 562 tests total (cumulative).

## Phase 7 — Enterprise Structure (planned)

- Extract CSS from `index.html` into `css/` modules
- Promote `js/` stubs to real implementations
- VS Code LSP extension
- npm package publication
- Full Playwright e2e test suite
