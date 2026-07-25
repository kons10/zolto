<div align="center">

# Zolto

### *The Next-Generation Document & Visualization Language*

A strict superset of standard Markdown with native Mathematics, Diagrams, Charts, Vector Graphics, Spatial Layouts, Components, and Interactive Runtime — built with **Zero Dependencies**.

[![CI](https://github.com/uxle/zolto/actions/workflows/ci.yml/badge.svg)](https://github.com/uxle/zolto/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-6.0.0-blue.svg)](package.json)
[![Phase](https://img.shields.io/badge/phase-6.0.0_Complete-purple)](docs/development/roadmap.md)
[![Tests](https://img.shields.io/badge/tests-565%2F565_passing-brightgreen.svg)](tests/tests.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ⚡ Highlights

- **100% Markdown Compatible**: Every valid `.md` file is a valid `.zl` file. Zero syntax regressions.
- **Zero Dependencies**: Self-contained math engine, diagram layout engine, and statistical chart renderer. No KaTeX, MathJax, Mermaid, D3, or Chart.js needed.
- **Phase 6 Native Chart Engine**: 24 native chart types (`bar`, `line`, `spline`, `radar`, `heatmap`, `candlestick`, `gauge`, `treemap`, etc.) with statistical calculations (min, max, mean, median, stdev, rolling averages) and multi-format data sources (inline, CSV, TSV, JSON, `$variables`).
- **Phase 5 Native Diagram Engine**: 23 native diagram types (`flowchart`, `sequence`, `state`, `er`, `mindmap`, `tree`, `class`, `gantt`, `sankey`, `git`, etc.) with 9 pluggable graph layout algorithms and automatic sequence lifelines.
- **Phase 4 Native Mathematics Engine**: Pandoc-style currency-safe `$expr$` inline math and `@math ... @/math` block math with auto-numbering, `@ref()` cross-references, dual HTML + MathML accessibility.
- **Phase 3 Native Block Directives**: Universal `@directive` syntax supporting 14 document component types (`@card`, `@tabs`, `@alert`, `@steps`, `@columns`, `@badge`, `@timeline`, `@progress`, `@avatar`, `@icon`, etc.).
- **Phase 2 Extended Markdown**: Callouts (`> [!NOTE]`), admonitions (`[info]`), reference links, code headers, line numbers, and definition lists.
- **High Performance**: Parses and renders 10,000+ data points or 1,000 diagram nodes in under **500ms**.

---

## 🚀 Quick Start

### 1. Run Zolto Studio (Browser Playground)
No build step required — launch the interactive live editor directly in your browser:

```bash
git clone https://github.com/uxle/zolto.git
cd zolto
npx serve . --port 3000
```
Then open `http://localhost:3000` in your browser.

### 2. Using the Engine in Node.js or Web Apps (ES Modules)

```javascript
import { compile, parse, render, parseChart, renderChart, parseDiagram, renderDiagram } from './src/zolto.js';

// One-call document compilation to clean HTML + accessible SVG
const source = `
# Quarterly Engineering Report

> [!NOTE]
> All systems operational across regions.

@chart bar title="Monthly API Volume"
source: csv
"month","requests"
"Jan, 2026", 12000
"Feb, 2026", 18500
"Mar, 2026", 24000
@/chart

@diagram sequence id="login-flow"
actor User
actor App
actor Server

User -> App: Enter credentials
App -> Server: POST /login
Server -> App: Token
App -> User: Success
@/diagram
`;

const html = compile(source);
console.log(html);
```

---

## 🎨 Feature Showcase

### 📊 Native Charts Engine (Phase 6)
```zolto
@chart spline title="Revenue Growth" theme="dark"
labels: Jan Feb Mar Apr May Jun
data: 120 180 240 310 420 580
@/chart
```
- **24 Chart Types**: `bar`, `hbar`, `line`, `area`, `spline`, `step`, `pie`, `donut`, `scatter`, `bubble`, `radar`, `polararea`, `histogram`, `boxplot`, `candlestick`, `heatmap`, `treemap`, `sunburst`, `funnel`, `waterfall`, `gauge`, `timeline`, `calendar`, `mixed`.
- **Data Loaders**: Inline, CSV (with quoted comma handling), TSV, JSON, `$variable` bindings.
- **Statistics**: Built-in rolling average, standard deviation, mean, median, normalization.

### 📐 Native Diagram Engine (Phase 5)
```zolto
@diagram sequence title="Authentication Sequence"
actor User
actor App
actor Server

User -> App: Enter credentials
App -> Server: POST /login
Server -> App: Bearer Token
App -> User: Authenticated
@/diagram
```
- **23 Diagram Types**: `flowchart`, `sequence`, `state`, `er`, `mindmap`, `tree`, `decision`, `org`, `class`, `object`, `package`, `component`, `deployment`, `usecase`, `activity`, `network`, `dependency`, `filesystem`, `git`, `timeline`, `gantt`, `sankey`, `journey`.
- **9 Layout Strategies**: `hierarchical`, `tree`, `circular`, `radial`, `force`, `grid`, `orthogonal`, `manual`, `sequence`.

### 🧮 Native Mathematics Engine (Phase 4)
```zolto
Inline math: $E = mc^2$

@math label="eq:einstein"
E = \gamma m_0 c^2
@/math

As shown in @ref(eq:einstein), energy increases with velocity.
```
- **Currency-Safe**: `$10 or $20` remains plain text; `\$` escapes literal dollars.
- **Dual Output**: Renders visible HTML and visually-hidden semantic MathML for screen readers.

### 🧩 Native Block Directives (Phase 3)
```zolto
@tabs
  @tab label="Overview"
    @card title="System Status" variant="success"
      All services operational.
    @/card
  @/tab
  @tab label="Metrics"
    @progress value=85 @/progress
  @/tab
@/tabs
```
- **14 Built-in Components**: `@embed`, `@collapse`, `@tabs`, `@card`, `@steps`, `@columns`, `@badge`, `@tag`, `@alert`, `@timeline`, `@progress`, `@avatar`, `@icon`.

---

## 🗺️ Master Specification Roadmap (Phases 1 – 16)

See [`docs/development/roadmap.md`](docs/development/roadmap.md) and [`docs/P1 to p16/`](docs/P1%20to%20p16/) for complete technical specifications.

| Phase | Subsystem | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 1** | Markdown Core | ✅ | CommonMark & GFM foundation (headings, blockquotes, lists, tables, frontmatter, variables) |
| **Phase 2** | Extended Markdown | ✅ | Admonitions, GitHub callouts (`> [!NOTE]`), reference links, definition lists, figures |
| **Phase 3** | Native Block Directives | ✅ | Universal `@directive` syntax (cards, tabs, alerts, steps, columns, badge, timeline, progress) |
| **Phase 4** | Mathematics Engine | ✅ | LaTeX-style math (`$expr$`, `@math`), MathML, auto-numbering, `@ref()` cross-references |
| **Phase 5** | Native Diagram Engine | ✅ | `@diagram <type>` with 23 diagram types, 9 graph layout strategies, themes, responsive SVG |
| **Phase 6** | Native Chart Engine | ✅ | `@chart <type>` with 24 chart types, CSV/TSV/JSON data sources, statistics, themes, SVG |
| **Phase 7** | Vector Graphics Engine | 📋 | `@vector` declarative drawing, scene graph, shapes, paths, transforms, gradients |
| **Phase 8** | Spatial Layout & Canvas | 📋 | `@layout`, `@grid`, `@flex`, `@canvas`, `@page`, multi-page print, responsive slide decks |
| **Phase 9** | Component & Macro System | 📋 | `@component`, `@slot`, `@template`, `@macro`, typed props, logic (`{#if}`, `{#each}`) |
| **Phase 10** | Interactive & Educational | 📋 | `@interactive`, `@form`, `@quiz`, `@flashcard`, `@poll`, inputs, auto-grading, binding |
| **Phase 11** | Animation & Presentation | 📋 | `@animate`, `@keyframes`, motion tokens, `@presentation`, `@slide`, speaker notes, reveals |
| **Phase 12** | Plugin API & Extensions | 📋 | `@plugin` manifest, extension hooks, custom directives, renderers, sandboxing, permissions |
| **Phase 13** | Language Server & Tooling | 📋 | Full LSP, autocomplete, hover, linter, formatter, refactorings, incremental parsing/rendering |
| **Phase 14** | Collaboration & Ecosystem | 📋 | Real-time collaboration, presence, versioning, branching, merging, review comments, publishing |
| **Phase 15** | Universal Theme System | 📋 | Design tokens, Light, Dark, and Eye Protection themes, runtime switching, theme packages |
| **Phase 16** | v1.0 Stable Release | 📋 | Feature & API freeze, formal specification, official CLI, security audit, starter templates |

---

## ⚙️ Public API Reference

```typescript
// Document Parser & Renderer
parse(src: string): { ast: DocumentNode, errors: Error[], warnings: Warning[], diagnostics: Diagnostics }
render(ast: DocumentNode, opts?: { xhtml?: boolean, footnoteSection?: boolean }): string
compile(src: string, opts?: RenderOptions): string

// Diagram Engine API
parseDiagram(src: string, header?: string): { ast: DiagramNode, diagnostics: DiagramDiagnostics }
renderDiagram(ast: DiagramNode, opts?: object): string
validateDiagram(ast: DiagramNode): DiagramDiagnostics

// Chart Engine API
parseChart(src: string, header?: string): { ast: ChartNode, diagnostics: ChartDiagnostics }
renderChart(ast: ChartNode, opts?: object): string
validateChart(ast: ChartNode): ChartDiagnostics
```

---

## 🧪 Testing & Verification

Run the full test suite (565 tests across all 6 completed phases):

```bash
# Code syntax and check verification
npm run check

# Execute test suite
npm run test:node
```

---

## 📄 License

Zolto is released under the [MIT License](LICENSE).
