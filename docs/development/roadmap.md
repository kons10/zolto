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

## Phase 7 — Native Vector Graphics & Drawing Engine ✅

Declarative vector drawing language (`@vector`), scene graph, path language (Move, Line, Curve, Arc), shape primitives (rectangle, circle, ellipse, polygon, bezier, text, image, layer, symbol), transforms (rotate, scale, skew, matrix), gradients (`gradient:id` fill references), shadows, clip paths, and accessible SVG renderer. **601 tests total (cumulative)**.

**Patch v7.0.1** also includes deep bug fixes across the chart engine: signed-domain negative value support for bar, hbar, line, area, spline, step, scatter, and bubble charts; zero-value pie/donut slice skipping; pie chart 12-o'clock start; area chart zero-baseline close; `NaN`/`null` data point filtering; and full `escapeXml()` audit across all three SVG subsystems.

## Phase 8 — Spatial Layout & Canvas Engine ✅

Declarative page and spatial layout system (`@layout`, `@grid`, `@flex`, `@stack`, `@canvas`, `@pages`, `@page`, `@presentation`, `@slide`), responsive grid/flex columns, multi-page print layouts, presentation slide decks, absolute positioning canvas, sticky positioning, z-index layer ordering, and static layout validator. **642 tests total (cumulative)**.

## Phase 9 — Component, Template & Macro System ✅

Reusable abstraction system (`component`, `template`, `macro`, `slot`, `fill`, `if`, `each`), typed props, slot forwarding, fallback slots, logic conditionals (`if`/`elseif`/`else`), loops (`each`), component registry, and 12 built-in patterns (`Card`, `StatCard`, `FeatureCard`, `AlertBox`, `HeroSection`, `SectionHeader`, `EmptyState`, `InfoPanel`, `ComparePanel`, `CallToAction`, `ProfileCard`, `DashboardTile`). **673 tests total (cumulative)**.

## Phase 10 — Interactive Documents & Educational Features ✅

Safe declarative interactive block model (`@interactive`, `@form`, `@quiz`, `@deck`, `@poll`, `@tasks`, `@tabs`, `@accordion`, `@state`, `@shared`), forms, inputs, buttons, toggles, sliders, quizzes, flashcards, polls, pure deterministic scoring engines, state maps, and data bindings without arbitrary scripting. **732 tests total (cumulative)**.

## Phase 11 — Animation & Presentation Runtime 📋

Motion and presentation subsystem (`@animate`, `@keyframes`, easing, motion tokens), presentation slide decks (`@presentation`, `@slide`), speaker notes, presenter controls, timeline reveals, and reduced-motion accessibility.

## Phase 12 — Plugin API & Extension System 📋

Safe plugin & extension architecture (`@plugin`), lifecycle management (load, register, activate, unload), extension hooks (tokenizer, parser, renderer, validator), custom directives, sandboxing, and permissions model.

## Phase 13 — Language Server, IDE Tooling & Compiler Optimizations 📋

Full Language Server Protocol (LSP) implementation, autocomplete, hover tooltips, diagnostics, linter, formatter, refactorings, incremental parsing/rendering, multi-layer caching, and file watch support.

## Phase 14 — Collaboration, Versioning & Production Ecosystem 📋

Real-time multi-user collaboration, presence, version history, document branching & merging, inline review comments, workspace packaging, publishing pipeline, access control, audit trail.

## Phase 15 — Universal Theme System 📋

Design tokens, Light, Dark, and Eye Protection themes, runtime switching, theme packages, user overrides.

## Phase 16 — v1.0 Stable Release 📋

Feature & API freeze, formal specification, official CLI, security audit, starter templates, production readiness.
