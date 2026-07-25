# Changelog

All notable changes to Zolto are documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) |
Versioning: [Semantic Versioning](https://semver.org/)

## [7.0.1] — Chart Rendering Correctness & Deep Bug Fixes

Date: 2026-07-25

### Fixed

#### Chart Engine — Negative Value & Domain Rendering
- **Bar chart** (`renderBarChart`): Bars with negative values previously produced invalid negative SVG `height` attributes, causing silent misrender in all browsers. Fixed by computing a signed domain `[min(0, minVal), max(0, maxVal)]` with an explicit zero-baseline axis rule. Positive bars grow upward from baseline; negative bars grow downward. A horizontal baseline guide line is rendered at y=0.
- **Horizontal bar chart** (`renderHBarChart`): Identical signed-domain fix applied to the horizontal axis. Negative bars now grow leftward from a vertical zero-baseline guide line. `NaN`-filtered data values are skipped safely.
- **Line / area / spline / step charts** (`renderLineChart`): Fixed `y`-coordinate computation for negative values — `y = pad.top + h - (val / maxVal) * h` produced coordinates below the chart viewport for negative `val`. Now uses `(val - domainMin) / domainRange`. Area charts close to the zero-baseline rather than the bottom of the viewport. `null`/`NaN` data points are skipped cleanly. Label ticks are clamped to `maxDataLen` to prevent orphan tick marks when labels outnumber data points.
- **Scatter / bubble charts** (`renderScatterChart`): Fixed `cy` computation for negative values. Bubble radius uses `Math.abs(val)` for magnitude instead of `val`, preventing negative radii.
- **Pie / donut charts** (`renderPieChart`): Zero-value slices (angle = 0) previously generated degenerate SVG paths (`M cx cy L x y A r r 0 0 1 x y Z` with coincident endpoints). Such slices are now silently skipped. Negative input values are clamped to 0 before computation. Pie rendering now starts at 12 o'clock (`−π/2`) instead of 3 o'clock (`0`) — matching chart design conventions.

#### Security
- Audited `escapeXml()` call coverage across all three SVG subsystems (diagram, chart, vector). All text content, `id` attributes, `title` text, tooltip content, label text, and series name output paths are correctly escaped.

#### Vector Engine — Gradient Fill Resolution
- `fill="gradient:id"` references in vector shapes now correctly resolve to `url(#id)` in SVG `fill` attributes via `resolveColorToken()` in `src/vector/styles.js`.

#### Diagram Engine — Sequence Self-Messages
- Sequence diagram self-messages (`Actor -> Actor: label`) previously rendered as a zero-length degenerate line. Self-messages now render as a rectangular loop path offset to the right of the lifeline, with the label positioned beside the loop.

### Tests
- Total: **601/601** tests passing across all 7 completed phases, with 0 regressions.

---

## [7.0.0] — Phase 7 — Native Vector Graphics & Drawing Engine

### Added

#### Native Vector Directive & Subsystem
- `@vector [attrs] … @/vector` block directive for declarative vector drawing inside `.zl` documents.
- Modular architecture under `src/vector/` with tokenization (`tokenizer.js`), parsing (`parser.js`), AST factory (`ast.js`), scene graph topology (`scene.js`), style & color engine (`styles.js`), transform matrix composer (`transforms.js`), accessible SVG DOM generator (`svg.js`), rendering facade (`renderer.js`), static validator (`validator.js`), and diagnostics collector (`diagnostics.js`).

#### Scene Graph & Document Hierarchy
- Support for structural hierarchy: `scene`, `artboard`, `layer`, `group`, `frame`, `symbol`, `use`, `marker`, `clipPath`, `mask`.

#### Shape Primitives & Path Language
- Native shapes: `rect` (rectangle & rounded rect), `circle`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `arc`, `bezier` (quadratic & cubic), `text`, `image`, `icon`.
- Path language: `M`, `L`, `H`, `V`, `C`, `Q`, `A`, `Z` commands and relative variants, plus structured path blocks (`move`, `line`, `quadratic`, `cubic`, `arc`, `close`).

#### Styling & Color Engine
- Fills, strokes, stroke width, line caps, line joins, dash patterns, opacity, filters, and blur effects.
- Multi-format colors: HEX, RGB, RGBA, HSL, HSLA, named colors, theme tokens (`$surface`, `$border`, `$textPrimary`), linear & radial gradients, patterns.

#### Accessibility & Performance
- Responsive `<svg viewBox="..." role="img" aria-label="...">` with title and description accessibility tags.
- High performance: 5,000 vector shapes parsed, laid out, and rendered in under 500ms.
- 601/601 tests passed with 0 regressions across all 7 completed phases.

## [6.0.0] — Phase 6 — Native Charts & Data Visualization Engine

### Added

#### Native Chart Directive & Subsystem
- `@chart <type> [attrs] … @/chart` block syntax for creating data visualizations in `.zl` documents.
- Modular architecture under `src/chart/` with tokenization, parsing, AST generation, statistical processing, multi-format datasets, SVG DOM generation, theme system, rendering facade, and static validator.

#### 24 Supported Chart Types
- Native support for 24 chart types: `bar`, `hbar`, `line`, `area`, `spline`, `step`, `pie`, `donut`, `scatter`, `bubble`, `radar`, `polararea`, `histogram`, `boxplot`, `candlestick`, `heatmap`, `treemap`, `sunburst`, `funnel`, `waterfall`, `gauge`, `timeline`, `calendar`, `mixed`.

#### Multi-Format Data Sources & Variable Bindings
- Supports inline values, `source csv:`, `source tsv:`, `source json:`, `$variable` references, `#docref` data, and computed expression datasets.

#### Statistical & Transformation Utility Engine
- Built-in functions: min, max, mean, median, standard deviation, rolling averages, data normalization, sorting, filtering, and aggregations.

#### Accessibility & Theme System
- Accessible SVG output (`role="img"`, `aria-label`, `<title>`, `<desc>`).
- Built-in theme presets (`light`, `dark`, `custom:neo`, `custom:night`) and custom color palette overrides.

## [5.0.0] — Phase 5 — Native Diagram & Graph Engine

### Added

#### Native Diagram Directive & Subsystem
- `@diagram <type> [attrs] … @/diagram` block syntax for embedding native diagrams.
- Dedicated diagram tokenizer (`src/diagram/tokenizer.js`), grammar parser (`src/diagram/parser.js`), AST builder (`src/diagram/ast.js`), topology engine (`src/diagram/graph.js`), SVG DOM generator (`src/diagram/svg.js`), renderer (`src/diagram/renderer.js`), theme engine (`src/diagram/themes.js`), and validator (`src/diagram/validator.js`).

#### 23 Diagram Types
- Native support for 23 diagram types: `flowchart`, `sequence`, `state`, `er`, `mindmap`, `tree`, `decision`, `org`, `class`, `object`, `package`, `component`, `deployment`, `usecase`, `activity`, `network`, `dependency`, `filesystem`, `git`, `timeline`, `gantt`, `sankey`, `journey`.

#### 8 Pluggable Layout Strategy Algorithms
- Layered Sugiyama (`hierarchical`), Reingold-Tilford hierarchy (`tree`), Perimeter (`circular`), Concentric ring (`radial`), Fruchterman-Reingold force-directed (`force`), Matrix grid (`grid`), Right-angle Manhattan edge connector routing (`orthogonal`), and explicit coordinate placement (`manual`).

#### Styling & Themes
- Built-in theme definitions (`light`, `dark`, `custom:neo`, `custom:night`) and custom theme registration support.
- Node shapes: `rect`, `circle`, `diamond`, `round-rect`, `hexagon`, `pill`, `actor`, `cylinder`.
- Arrowhead markers & styles: `filled`, `hollow`, `normal`, `dashed`, ER cardinality markers (`||--o{`).

#### Accessible SVG Generation & Performance
- Responsive `<svg viewBox="..." role="img" aria-label="...">` with title and description accessibility tags.
- 548/548 test suite passed with 0 regressions. 1,000-node performance benchmark under 500ms.

---

## [4.0.0] — Phase 4 — Native Mathematics Engine

### Added

#### Inline & Display Math
- `$expr$` inline math with Pandoc-style currency-safe delimiter matching —
  a candidate closing `$` is rejected when immediately followed by a digit,
  so `It costs $10 or $20` never triggers math mode; `\$` escapes a literal dollar
- `@math name="…" label="…" env=… numbered=… … @/math` display math blocks
- Equation numbering (shared counter across the document) with `numbered=false` opt-out
- `@ref(label)` cross-references — resolved links to numbered equations,
  with a visible broken-reference marker and validation warning when undefined
- `env=align` / `env=gather` multi-line equations (bare `&`/`\\`-separated
  rows, no `\begin{}` wrapper required)

#### Mathematical Expressions
- Fractions (`\frac`), roots (`\sqrt`, `\sqrt[n]{}`), powers, subscripts,
  combined sub+superscript
- Big operators: `\sum`, `\prod`, `\int`/`\iint`/`\iiint`/`\oint`, `\lim`
  (and `\limsup`/`\liminf`/`\max`/`\min`/`\sup`/`\inf`) — modeled as
  standalone atoms with `children:[lo,hi]`, matching real LaTeX semantics
  rather than a synthetic "body" argument
- Matrices: `matrix`, `pmatrix`, `bmatrix`, `vmatrix`, `Vmatrix`, `Bmatrix`,
  `cases` (piecewise functions), `aligned`
- Auto-sized `\left … \right` delimiters, plus automatic pairing of bare
  `(x)`, `[a,b]`, `|x|` typed without `\left`/`\right`
- Vectors (`\vec`), accents (`\hat` `\dot` `\ddot` `\tilde` `\bar`),
  `\overline`/`\underline`/`\overbrace`/`\underbrace`
- `\mathbf`/`\boldsymbol` bold, `\mathbb` blackboard-bold set symbols
- 25+ recognized functions (`\sin` `\cos` `\tan` `\log` `\ln` `\exp` `\gcd` …)
  rendered upright, never italicized

#### Symbols
- Full Greek alphabet (lower + upper), operators, relations, arrows,
  logic/set-theory symbols, geometry and misc symbols — ~150 named commands
  total, each with a Unicode mapping (`src/math-symbols.js`)

#### Architecture
- `src/math-tokenizer.js` — LaTeX-like lexical scanner, independent of the
  Markdown tokenizer; `\text{}`/`\mathrm{}`/`\operatorname{}` content is
  captured as raw text directly during tokenization (never re-tokenized as math)
- `src/math-ast.js` — 21 node types matching the Phase 4 spec's naming
  (`Number`, `Identifier`, `Operator`, `UnaryExpression`, `BinaryExpression`,
  `Fraction`, `Root`, `Power`, `Subscript`, `SubSup`, `Summation`, `Product`,
  `Integral`, `Limit`, `Matrix`, `FunctionCall`, `Vector`, `Equation`,
  `EquationGroup`, …)
- `src/math-parser.js` + `src/math-matrix.js` — Pratt precedence-climbing
  parser (relational → additive → multiplicative/implicit → unary → postfix
  → primary); matrix/environment parsing installed as a prototype mixin to
  avoid a circular import
- `src/math-renderer.js` — visual HTML/CSS output (stacked fractions,
  radical overlines, matrix grids, auto-scaling delimiters), plus
  `mathToPlainText()` for `aria-label` generation
- `src/math-mathml.js` — semantic MathML (`<mfrac>` `<msqrt>` `<msup>`
  `<mtable>` …) for native screen-reader accessibility
- `src/math-validator.js` — duplicate label and undefined `@ref()` detection
- Every equation renders **both** HTML (visible) and MathML (visually-hidden,
  `aria-label` fallback) — the same hybrid strategy KaTeX uses internally
- Math CSS injected once via `<style id="zl-math-styles">`, only when math
  nodes are present — same conditional-injection pattern as Phase 3's directive CSS
- New diagnostic codes: `M001`–`M006` (unknown command, unclosed environment,
  mismatched environment, duplicate label, undefined reference, parse error)

#### Tests
- `tests/fixtures-p4.js` — 60 fixtures across inline math, block math,
  equation refs, expressions, symbols, functions, and error recovery
- `tests/tests-p4.js` — unit tests for the tokenizer, symbol tables, parser
  (precedence, error recovery), HTML renderer, MathML renderer, validator,
  integration with Phases 1–3, and stress/performance
- 131 new tests; 511 total across 63 suites (Phases 1–4 combined)

### Fixed
- Two latent Phase 3 lexer gaps, discovered while extending the paragraph-break
  logic for `@math`: a paragraph immediately followed by an `@directive` or
  `@math` line with no blank-line separator was incorrectly absorbed as
  paragraph text instead of starting a new block

### Compatibility
- 100% backward compatible — every Phase 1–3 test (380 tests) still passes unchanged
- No existing syntax was modified; math is purely additive

---

## [3.0.0] — Phase 3 — Native Block Directives

### Added

#### Universal Directive Syntax
- `@name … @/name` block syntax — the single pattern behind all 14 new component types
- Attribute parser supporting quoted strings, bare strings, numbers, booleans, and
  positional first arguments (`@badge success` vs `@badge variant=success`)
- Recursive Markdown parsing inside every directive body (bold, links, lists, code
  blocks, footnotes, and even other directives all work inside directive content)
- Depth-aware nesting — directives can contain directives to unlimited depth

#### 14 New Directive Types
- **`@embed`** — image, video, audio, youtube, vimeo, figma, codepen, codesandbox, iframe;
  automatic YouTube/Vimeo ID extraction, lazy loading, captions, responsive `<figure>` wrapper
- **`@collapse`** — `<details>/<summary>` disclosure widget with `open` state control
- **`@tabs` / `@tab`** — accessible tab groups with ARIA roles, keyboard-navigable, unlimited tabs
- **`@card` / `@card-group`** — variant-aware cards (default/primary/success/warning/danger/
  outline/ghost) with icon, title, description, image, and href-as-link support; responsive grid groups
- **`@steps` / `@step`** — numbered step lists with automatic numbering, optional icon override
- **`@columns` / `@column`** — responsive flex columns with fixed or auto width
- **`@badge`** — 7 variants × pill/outline modifiers, optional icon
- **`@tag`** — coloured topic tags, optional icon and href-as-link
- **`@alert`** — 6 alert types, optional title, optional dismiss button hook
- **`@timeline` / `@event`** — vertical event timeline with dates and icons
- **`@progress`** — linear progress bar with label, percent display, 4 color variants
- **`@avatar`** — image, initials, or icon fallback; 5 sizes; 4 status indicator states
- **`@icon`** — Material Symbols icon rendering with size, color, and accessible label

#### Architecture
- `src/directive-lexer.js` — attribute string parser (`parseAttrStr`), child directive
  extractor (`extractChildren`), block lexer (`lexDirective`)
- `src/directives.js` — converts directive tokens into typed AST nodes for all 14 types
- `src/directive-renderer.js` — HTML output for all 14 types + embedded CSS, injected
  once via `<style id="zl-p3-styles">` only when Phase 3 directives are present in the document
- `PHASE3_NODE_TYPES` set added to `src/ast.js` for renderer dispatch and CSS-injection detection
- Phase 3 validator checks: missing `embed` src, `progress` value out of range, empty
  `tabs`/`steps`/`timeline` containers

#### Tests
- `tests/fixtures-p3.js` — 92 fixtures across embed, collapse, tabs, cards, steps, columns,
  badge, tag, alert, timeline, progress, avatar, icon, nesting, and attribute-parsing groups
- `tests/tests-p3.js` — unit tests for directive-lexer, directives→AST, directive-renderer
  CSS injection, Phase 3 validator diagnostics, integration, and stress/performance
- 147 new tests; 380 total across 54 suites (Phase 1 + 2 + 3 combined)

### Changed
- `VERSION` → `'3.0.0'`, `PHASE` → `3`
- `tests/tests.js` is now a thin combined runner over `tests-p2.js` + `tests-p3.js`
- CSS injection is conditional — documents with zero Phase 3 directives carry zero
  extra bytes of Phase 3 CSS

### Compatibility
- 100% backward compatible — every Phase 1 and Phase 2 test (233 tests) still passes unchanged
- No existing syntax was modified; directives are purely additive

---

## [2.0.0] — Phase 2 — Extended Markdown

### Added

#### Block syntax
- **GitHub-style callouts** `> [!NOTE]` · `> [!TIP]` · `> [!WARNING]` ·
  `> [!IMPORTANT]` · `> [!CAUTION]` · `> [!DANGER]` with icons, colour, ARIA
- **Native admonitions** `[type]…[/type]` with optional `title="…"` attr;
  supports 24 types including `info` `warning` `tip` `theorem` `definition` `proof`
- **Reference links** `[text][id]` + `[id]: url "optional title"` with validation
- **Figures** — standalone images auto-promoted to `<figure>/<figcaption>`
- **Definition lists** `term\n: definition` → `<dl><dt><dd>`
- **Table captions** — `Table: Caption text` before a table → `<caption>`

#### Code blocks (metadata system)
- `title="…"` — header bar with filename
- `numbers` — line-number gutter via CSS counters
- `{1,3-5}` — highlighted line ranges
- `diff` language or `diff` flag — `+`/`-` line colouring
- Copy button with instant clipboard feedback

#### Inline syntax
- Superscript `^text^` → `<sup>`
- Subscript `~text~` → `<sub>` (distinct from `~~strikethrough~~`)
- Highlight `==text==` → `<mark>`
- Keyboard keys `[[key]]` → `<kbd>`
- HTML entities `&copy;` `&#160;` `&#x2014;` — 150+ named entities decoded
- Smart punctuation `---` → `—`, `--` → `–`, `...` → `…`
- Reference-style links `[text][id]` and shorthand `[id][]`

#### Architecture
- `src/diagnostics.js` — `Diagnostics` class, `Severity` enum, `Code` constants
- `src/validator.js` — rewritten to use Diagnostics; Phase 2 checks added
- `parse()` returns `{ ast, errors, warnings, diagnostics }` — `diagnostics`
  is a full `Diagnostics` instance for structured access
- `lastRealIndex()` in lexer fixes `tokens.pop()` races with blank tokens
- Nested-emphasis `findClosingDelim` fixed: exact run-length matching only
- Unclosed frontmatter now emits a structured lexer error

### Fixed
- `*italic **bold** italic*` — nested emphasis now parses correctly
- Definition list: `tokens.pop()` replaced by `tokens.splice(lastRealIndex())`
- Table caption: same `splice(lastRealIndex())` fix for BLANK-separated caption
- Unclosed frontmatter `---` silently ignored → now emits `E001` diagnostic
- `diff` code block: auto-detects `lang="diff"` without requiring meta flag
- Paragraph loop: breaks before `: definition` marker lines

### Changed
- `VERSION` → `'2.0.0'`, `PHASE` → `2`
- Standalone images now produce `<figure>` nodes (renderer upgrade)
- Tables now wrapped in `<div class="zl-table-wrap" role="region">`
- Footnote / task-list CSS classes unified under `zl-` prefix
- Canvas header subtitle changed to "Extended Markdown" from "Spatial Runtime"

---

## [1.0.0] — Phase 1 — Markdown Core

### Added
- Block lexer, cursor-based inline parser, AST node factory
- Block parser, AST validator, stateless HTML renderer
- Public API `parse()`, `render()`, `compile()`
- 60+ tests across 20 suites
- Zolto Studio UI: deep navy dot-grid canvas, glassmorphic headers,
  brand gradient text, four themes, resizable divider, live preview,
  toolbar, toast notifications, file open/save, PDF export, test modal
