# Zolto Specification Roadmap (Phases 1 – 16)

## Phase 1 — Markdown Core ✅

Full CommonMark/GFM-compatible Markdown engine (headings, paragraphs, blockquotes, lists, checklists, links, images, bold, italic, code, tables, frontmatter, variables, footnotes).

## Phase 2 — Extended Markdown Layer ✅

Callouts (`> [!NOTE]`), admonitions (`[info]`), reference links (`[text][id]`), figure captions, definition lists, table captions, code metadata, extended inlines, and static diagnostics.

## Phase 3 — Native Block Directives ✅

14 document component types via universal `@directive` syntax: `@embed`, `@collapse`, `@tabs`, `@card`, `@steps`, `@columns`, `@badge`, `@tag`, `@alert`, `@timeline`, `@progress`, `@avatar`, `@icon`.

## Phase 4 — Native Mathematics Engine ✅

LaTeX-like math syntax with zero external dependencies. Inline `$...$` and block `@math ... @/math`, equation auto-numbering, `@ref()` cross-references, dual HTML + MathML rendering.

## Phase 5 — Native Diagram & Graph Engine ✅

Human-readable, deterministic native diagram engine with 23 diagram types, 8 pluggable layout algorithms (hierarchical, tree, circular, radial, force, grid, orthogonal, manual, sequence), themes (`light`, `dark`, `custom:neo`, `custom:night`), clusters, and responsive SVG rendering.

## Phase 6 — Native Charts & Data Visualization Engine ✅

Native chart engine supporting 24 chart types (`bar`, `hbar`, `line`, `area`, `spline`, `step`, `pie`, `donut`, `scatter`, `bubble`, `radar`, `polararea`, `histogram`, `boxplot`, `candlestick`, `heatmap`, `treemap`, `sunburst`, `funnel`, `waterfall`, `gauge`, `timeline`, `calendar`, `mixed`), statistical calculation engine, multi-format datasets (inline, CSV, TSV, JSON, `$var`), themes, responsive SVG rendering, and static validator.

## Phase 7 — Native Vector Graphics & Drawing Engine 📋

Declarative vector drawing language (`@vector`), scene graph, path language (Move, Line, Curve, Arc), primitives (rectangle, circle, ellipse, polygon, bezier, text, image, layer, symbol), transforms (rotate, scale, skew, matrix), gradients, shadows, and SVG renderer.

## Phase 8 — Spatial Layout & Canvas Engine 📋

Declarative page and spatial layout system (`@layout`, `@grid`, `@flex`, `@canvas`, `@page`), responsive grid/flex columns, multi-page print layouts, presentation slide decks, sticky positioning, and z-index ordering.

## Phase 9 — Component, Template & Macro System 📋

Reusable abstraction system (`@component`, `@slot`, `@template`, `@macro`), typed props, slot forwarding, fallback slots, logic directives (`{#if}`, `{#each}`), component registry, built-in patterns (StatCard, FeatureCard, HeroSection).

## Phase 10 — Interactive Documents & Educational Features 📋

Safe declarative interactive block model (`@interactive`, `@form`, `@quiz`, `@flashcard`, `@poll`, task progress), input validation, auto-grading, single/multi-choice questions, flip cards, data binding, and state preservation.

## Phase 11 — Animation & Presentation Runtime 📋

Motion and presentation subsystem (`@animate`, `@keyframes`, easing, motion tokens), presentation slide decks (`@presentation`, `@slide`), speaker notes, presenter controls, timeline reveals, and reduced-motion accessibility.

## Phase 12 — Plugin API & Extension System 📋

Safe plugin & extension architecture (`@plugin`), lifecycle management (load, register, activate, unload), extension hooks (tokenizer, parser, renderer, validator), custom directives, sandboxing, and permissions model.

## Phase 13 — Language Server, IDE Tooling & Compiler Optimizations 📋

Full Language Server Protocol (LSP) implementation, autocomplete, hover tooltips, diagnostics, linter, formatter, refactorings, incremental parsing/rendering, multi-layer caching, and file watch support.

## Phase 14 — Collaboration, Versioning & Production Ecosystem 📋

Real-time multi-user collaboration, presence, version history, document branching & merging, inline review comments, workspace packaging, publishing pipeline, access control, audit trail.

## Phase 15 — Universal Theme & Design System 📋

Universal visual design tokens, built-in **Light**, **Dark**, and **Eye Protection** (soft warm low-strain reading) themes, runtime theme switching, typography scale, theme packages, and export consistency.

## Phase 16 — v1.0 Stable Release & Production Launch 📋

Feature & API freeze, formal language specification, security & stability audit, official CLI (`zolto build/render/preview/doctor`), cross-platform packaging, starter templates, and production launch.
