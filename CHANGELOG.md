# Changelog

All notable changes to Zolto are documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) |
Versioning: [Semantic Versioning](https://semver.org/)

## [10.0.0] — Phase 10 — Interactive Documents & Educational Features

Date: 2026-07-26

### Added

#### Interactive Engine Subsystem (`src/interactive/`)
- **Interactive Block Directives**: `@interactive`, `@form`, `@quiz`, `@deck`, `@poll`, `@tasks`, `@tabs`, `@accordion`, `@state`, and `@shared` directives.
- **Form Controls**: `@text`, `@email`, `@password`, `@number`, `@search`, `@date`, `@time`, `@textarea`, `@check`, `@radio`, `@select` (single, multi, searchable), `@toggle`, `@switch`, `@segment`, `@slider`, `@progress`, and `@button` (primary, secondary, ghost, danger, outline, icon, loading, disabled).
- **Quiz Engine**: `@quiz` containers with `@mcq`, `@multi`, `@truefalse`, `@blank`, `@match`, `@matrix`, `@hint`, `@explain`, and `@timer`. Pure deterministic scoring engine (`scoreMCQ`, `scoreMulti`, `scoreTrueFalse`, `scoreFillBlank`, `scoreMatching`, `quizScore`).
- **Flashcard Deck Engine**: `@deck` containers with `@card` (front, back, difficulty, tags). Built-in `shuffleCards`, `deckProgress`, `groupByDifficulty`, and `filterByTags` utilities.
- **Poll Engine**: `@poll` containers supporting single, multi, and anonymous polls with vote tallying and progress bar calculations (`tally`).
- **Checklist Engine**: `@tasks` nested checkable item lists.
- **State & Data Bindings**: `@state` and `@shared` blocks compiling to serializable, immutable state maps. Safe `{expr}` text interpolation (`extractBindings`, `interpolateBindings`, `resolveBinding`) with zero `eval` and prototype pollution guards.
- **Accessibility & Security**: Comprehensive ARIA role, label, focus ring, keyboard navigation (`tabindex`), and `@media (prefers-reduced-motion)` styling. Full HTML/XML escaping across all output nodes.
- **Diagnostics**: `validateInteractive()` static validator for detecting missing labels, duplicate field names, invalid slider bounds, missing quiz answers, and unsafe binding expressions.

### Tests
- Total **732/732** tests passing across all 10 completed phases with 0 regressions.

---

## [9.0.0] — Phase 9 — Component, Template & Macro System

Date: 2026-07-26

### Added

#### Component & Template Engine Subsystem (`src/component/`)
- **Component System**: Declarative PascalCase `component Card(title!, variant="default") ... end` definitions and `Card(...) ... end` invocation nodes.
- **Props Engine**: Typed props (`: string`, `: number`, `: bool`, `: enum(...)`, `: array`, `: object`), required props (`!`), default prop values, prop validation, and coercion.
- **Slot & Fill System**: Named slots (`slot header`), default slots, slot fallbacks (`slot default ... end`), slot forwarding (`fill header`), and nested slot resolution.
- **Template System**: Reusable document pattern templates (`template`) with template inheritance (`extends`).
- **Macro System**: Parameterized (`macro note(text)`), text, and inline (`version()`) macros with a 20-level safe recursion cap.
- **Control Flow**: Conditional rendering (`if` / `elseif` / `else`) and loop iteration (`each items as item,index key expr`).
- **Built-in Patterns**: 12 standard built-in component definitions (`Card`, `StatCard`, `FeatureCard`, `AlertBox`, `HeroSection`, `SectionHeader`, `EmptyState`, `InfoPanel`, `ComparePanel`, `CallToAction`, `ProfileCard`, `DashboardTile`).
- **Registry & Diagnostics**: `ComponentRegistry` for resolving document-scoped, imported, and built-in components/templates/macros; `validateComponent()` static validator.

### Tests
- Total **673/673** tests passing across all 9 completed phases with 0 regressions.

---

## [8.0.0] — Phase 8 — Spatial Layout & Canvas Engine

Date: 2026-07-26

### Added

#### Spatial Layout Engine Subsystem (`src/layout/`)
- `@layout` top-level wrapper with `@header`, `@main`, `@footer`, `@sidebar`, `@navigation`, `@section`, `@container`, `@spacer`, and `@box` blocks.
- `@grid` & `@cell` CSS grid layout system with fixed columns, `auto-fit`, `auto-fill`, `min-cell-width`, named `areas`, column spans, row spans, and cell alignment.
- `@flex` & `@item` Flexbox layout system with `row`/`column` directions, `wrap`, `justify`, `align`, `gap`, item `grow`, `shrink`, `basis`, and `align-self`.
- `@stack` layer stacking layout system supporting flow and overlay modes with `z` layer ordering.
- `@canvas` & `@layer` absolute positioning subsystem supporting snapped canvas objects (`@rect`, `@text`, `@image`, `@line`, `@shape`, `@box`), coordinate math, guides, and layer visibility.
- `@pages` & `@page` multi-page document and print layout system supporting A4/Letter/Legal/Custom page dimensions, page margins, bleed, and page breaks (`break=before|after|always`).
- `@presentation` & `@slide` slide deck presentation engine supporting 16:9 and 4:3 ratios, title/content/comparison/gallery/section slide types, speaker notes, and presentation styles.
- `validateLayout()` static validator for detecting invalid directive nesting, grid column overflows, and duplicate element IDs.

---

## [7.0.1] — Chart Rendering Correctness & Deep Bug Fixes

Date: 2026-07-25

### Fixed

#### Chart Engine — Negative Value & Domain Rendering
- **Bar chart** (`renderBarChart`): Bars with negative values previously produced invalid negative SVG `height` attributes. Fixed by computing a signed domain `[min(0, minVal), max(0, maxVal)]` with an explicit zero-baseline axis rule.
- **Horizontal bar chart** (`renderHBarChart`): Applied signed-domain fix to horizontal axis. Negative bars grow leftward from zero-baseline.
- **Line / area / spline / step charts** (`renderLineChart`): Fixed `y`-coordinate computation for negative values. Area charts close to zero-baseline.
- **Scatter / bubble charts** (`renderScatterChart`): Fixed `cy` computation for negative values. Bubble radius uses `Math.abs(val)`.
- **Pie / donut charts** (`renderPieChart`): Skipped zero-value slices. Pie rendering starts at 12 o'clock (`−π/2`).

---

## [7.0.0] — Phase 7 — Native Vector Graphics & Drawing Engine

### Added
- `@vector` declarative drawing engine with scene graphs, shapes, gradients, transforms, and SVG output.
