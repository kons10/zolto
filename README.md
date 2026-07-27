<div align="center">

<img src="social-preview.jpg" alt="Zolto — Next-Generation Document & Visualization Language" width="100%" />

# Zolto

### *The Next-Generation Document & Visualization Language*

A strict superset of standard Markdown with native Mathematics, Diagrams, Charts, Vector Graphics, Spatial Layouts, Components, and Interactive Runtime — built with **Zero Dependencies**.

[![static](https://github.com/uxle/zolto/actions/workflows/static.yml/badge.svg)](https://github.com/uxle/zolto/actions/workflows/static.yml)
[![Version](https://img.shields.io/badge/version-10.0.0-blue.svg)](package.json)
[![Phase](https://img.shields.io/badge/phase-10_Complete-purple)](docs/development/roadmap.md)
[![Tests](https://img.shields.io/badge/tests-732%2F732_passing-brightgreen.svg)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## ⚡ Highlights

- **100% Markdown Compatible** — Every valid `.md` file is a valid `.zl` file. Zero syntax regressions across all 10 phases.
- **Zero Dependencies** — Self-contained math engine, diagram layout engine, statistical chart renderer, vector drawing engine, spatial layout engine, component/template engine, and interactive widget engine.
- **Phase 10 — Interactive Documents & Educational Features** — Declarative interaction engine (`@form`, `@quiz`, `@deck`, `@poll`, `@tasks`, `@tabs`, `@accordion`, `@state`, `@shared`) supporting dynamic forms, auto-graded quizzes, flashcard study decks, live polls, checklists, and safe data bindings without arbitrary scripting.
- **Phase 9 — Component, Template & Macro System** — Declarative reusable content abstraction (`component`, `template`, `macro`, `slot`, `fill`, `if`, `each`) supporting typed/required props, default values, slot fallbacks/forwarding, template inheritance (`extends`), macro expansions, and component registries.
- **Phase 8 — Spatial Layout & Canvas Engine** — Declarative layout system (`@layout`, `@grid`, `@flex`, `@stack`, `@canvas`, `@pages`, `@presentation`) supporting responsive CSS grids, flexbox flows, absolute positioning canvas layers, multi-page print publications, and 16:9 / 4:3 slide presentations.
- **Phase 7 — Native Vector Engine** — Declarative vector drawing (`@vector`) with scene graph topology, artboards, layers, groups, symbols, shape primitives, Bezier curves, gradients, transforms, and accessible SVG output. Renders 5,000 shapes in under 500 ms.
- **Phase 6 — Native Chart Engine** — 24 native chart types (`bar`, `line`, `spline`, `radar`, `heatmap`, `candlestick`, `gauge`, `treemap`, etc.) with full negative-value support, zero-baseline axis rendering, statistical calculations, and multi-format data sources (inline, CSV, TSV, JSON, `$variables`).
- **Phase 5 — Native Diagram Engine** — 23 native diagram types (`flowchart`, `sequence`, `state`, `er`, `mindmap`, `tree`, `class`, `gantt`, `sankey`, `git`, etc.) with 9 pluggable graph layout algorithms, self-message arc rendering, and automatic sequence lifelines.
- **Phase 4 — Native Mathematics Engine** — Pandoc-style currency-safe `$expr$` inline math and `@math ... @/math` block math with auto-numbering, `@ref()` cross-references, and dual HTML + MathML accessibility.
- **Phase 3 — Native Block Directives** — Universal `@directive` syntax supporting 14 document component types (`@card`, `@tabs`, `@alert`, `@steps`, `@columns`, `@badge`, `@timeline`, `@progress`, `@avatar`, `@icon`, etc.).
- **Phase 2 — Extended Markdown** — Callouts (`> [!NOTE]`), admonitions (`[info]`), reference links, code headers, line numbers, and definition lists.
- **High Performance** — Parses and renders 10,000+ chart data points, 1,000+ diagram nodes, 5,000+ vector shapes, 500+ quiz questions, or 100+ layout cells in under **500 ms**.
- **Security-First & Accessible** — All SVG output and HTML widgets are XML/HTML-escaped to prevent injection. Full ARIA roles, labels, and focus rings built-in.

---

## 🚀 Quick Start

### 1. Run Zolto Studio (Browser Playground)

No build step required — launch the interactive live editor directly in your browser:

```bash
git clone https://github.com/uxle/zolto.git
cd zolto
npx serve . --port 3000
```

Open `http://localhost:3000` in your browser to start the live-preview editor.

### 2. Use the Engine (Node.js / ES Modules)

```javascript
import {
  compile,
  parse, render,
  parseDiagram, renderDiagram,
  parseChart, renderChart,
  parseVector, renderVector,
  parseLayout, renderLayout,
  parseComponent, renderComponent,
  parseInteractive, renderInteractive
} from './src/zolto.js';

const source = `
# Interactive Learning Module

component Alert(tone="info", title="")
card variant=tone
### {title}
slot
end
end

Alert(tone="warning", title="System Check")
Welcome to the Zolto 10 extended document engine.
end

@form contact {
  @text username required
  label "Username"
  @email email required
  label "Email"
  @button primary "Submit"
}

@quiz "Knowledge Assessment" {
  @mcq "Does Zolto have external runtime dependencies?" {
    @correct "Zero external dependencies"
    @choice "3 NPM packages"
  }
}
`;

const html = compile(source);
console.log(html); // → clean HTML with embedded accessible SVG & interactive controls
```

---

## 🎨 Feature Showcase

### ⚡ Interactive Documents & Quizzes (Phase 10)

```zolto
@quiz "Computer Science Fundamentals" {
  @mcq "What is CPU?" {
    @correct "Central Processing Unit"
    @choice "Computer Power Unit"

    @hint
    Think about the main processor executing instructions.
    @end

    @explain
    The Central Processing Unit calculates and executes code instructions.
    @end
  }

  @truefalse "Zolto supports native math equations without KaTeX."
  answer true

  @blank "Capital of France"
  answer "Paris"
}

@deck CSBasics {
  @card
    front "Algorithm"
    back "A step-by-step procedure for solving a problem."
  @end
}

@poll "Which Zolto phase is your favorite?" {
  Phase 7 — Vector Engine
  Phase 8 — Spatial Layout
  Phase 9 — Component System
  Phase 10 — Interactive Documents
}
```

- **Interactive Directives**: Declarative `@form`, `@quiz`, `@deck`, `@poll`, `@tasks`, `@tabs`, `@accordion`, `@state`, `@shared`.
- **Pure Quiz Scoring**: `scoreMCQ`, `scoreMulti`, `scoreTrueFalse`, `scoreFillBlank`, `scoreMatching`, `quizScore`.
- **Flashcard Deck Engine**: Shuffle, progress calculation, difficulty grouping, tag filtering.
- **Poll Engine**: Vote tallying and percentage calculation.
- **100% Accessible**: Built-in ARIA roles, labels, focus rings, keyboard navigation, and `@media (prefers-reduced-motion)` support.

---

### 🧩 Component, Template & Macro System (Phase 9)

```zolto
component Card(title!, subtitle="", variant="default")
card variant=variant
### {title}
{subtitle}
slot
end
end

Card(title="Welcome", subtitle="Hello World", variant="primary")
This is the body content injected into the default slot.
end

macro note(text)
info
{text}
end

note("Expanded via Zolto Phase 9 macro engine.")
```

- **Typed & Required Props**: `: string`, `: number`, `: bool`, `: enum(...)`, `: array`, `: object`, `title!` (required).
- **Slots & Fallbacks**: Named slots (`slot header`), default slots, fallback content, slot forwarding (`fill header`).
- **Templates**: Pattern templates (`template`) with template inheritance (`extends`).
- **Control Flow**: Conditional rendering (`if`/`elseif`/`else`) and loops (`each items as item,index key expr`).
- **12 Built-in Components**: `Card`, `StatCard`, `FeatureCard`, `AlertBox`, `HeroSection`, `SectionHeader`, `EmptyState`, `InfoPanel`, `ComparePanel`, `CallToAction`, `ProfileCard`, `DashboardTile`.

---

### 🖊️ Native Vector Engine (Phase 7)

```zolto
@vector width=600 height=300 theme="dark"
rect id="card" x=20 y=20 w=560 h=260 radius=12
  fill="#1e2230" stroke="#3d4466" strokeWidth=1
circle cx=80 cy=80 r=36 fill="#7c5cff" opacity=0.9
text x=140 y=72 size=22 weight=700 fill="#ffffff"
  Hello Zolto Vector
@endtext
text x=140 y=102 size=14 fill="#a0aec0"
  Scalable · Declarative · Accessible
@endtext
line x1=20 y1=140 x2=580 y2=140 stroke="#3d4466" strokeWidth=1
gradient id="gBlue" type="linear" x1=0 y1=0 x2=1 y2=0
  stop offset=0 color="#6ee7f7"
  stop offset=1 color="#7c5cff"
@endgradient
rect x=20 y=160 w=560 h=30 radius=6 fill="gradient:gBlue" opacity=0.5
@/vector
```

---

### 📊 Native Charts Engine (Phase 6)

```zolto
@chart spline title="Revenue Growth" theme="dark"
labels: Jan Feb Mar Apr May Jun
data: 120 180 240 310 420 580
@/chart
```

---

### 📐 Native Diagram Engine (Phase 5)

```zolto
@diagram sequence title="Authentication Sequence"
actor User
actor App
actor Server

User -> App: Enter credentials
App -> Server: POST /login
Server -> Server: Validate & sign token
Server -> App: Bearer Token
App -> User: Authenticated
@/diagram
```

---

### 🧮 Native Mathematics Engine (Phase 4)

```zolto
Inline math: $E = mc^2$

@math label="eq:lorentz"
E = \gamma m_0 c^2 \quad \text{where} \quad \gamma = \frac{1}{\sqrt{1-v^2/c^2}}
@/math

As shown in @ref(eq:lorentz), energy increases with velocity.
```

---

## 🗺️ Master Specification Roadmap (Phases 1 – 16)

See [`docs/development/roadmap.md`](docs/development/roadmap.md) and [`docs/P1 to p16/`](docs/P1%20to%20p16/) for complete technical specifications.

| Phase | Subsystem | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 1** | Markdown Core | ✅ | CommonMark & GFM foundation (headings, blockquotes, lists, tables, frontmatter, variables) |
| **Phase 2** | Extended Markdown | ✅ | Admonitions, GitHub callouts (`> [!NOTE]`), reference links, definition lists, figures |
| **Phase 3** | Native Block Directives | ✅ | Universal `@directive` syntax (cards, tabs, alerts, steps, columns, badge, timeline, progress) |
| **Phase 4** | Mathematics Engine | ✅ | LaTeX-style math (`$expr$`, `@math`), MathML, auto-numbering, `@ref()` cross-references |
| **Phase 5** | Native Diagram Engine | ✅ | `@diagram <type>` with 23 diagram types, 9 layout strategies, self-messages, themes, SVG |
| **Phase 6** | Native Chart Engine | ✅ | `@chart <type>` with 24 chart types, negative values, CSV/TSV/JSON, statistics, themes, SVG |
| **Phase 7** | Vector Graphics Engine | ✅ | `@vector` declarative drawing, scene graph, shapes, gradients, transforms, accessible SVG |
| **Phase 8** | Spatial Layout & Canvas | ✅ | `@layout`, `@grid`, `@flex`, `@stack`, `@canvas`, `@pages`, `@presentation`, responsive grids, print & slides |
| **Phase 9** | Component & Macro System | ✅ | `component`, `slot`, `fill`, `template`, `extends`, `macro`, typed props, logic (`if`, `each`) |
| **Phase 10** | Interactive & Educational | ✅ | `@interactive`, `@form`, `@quiz`, `@deck`, `@poll`, `@tasks`, inputs, auto-grading, binding |
| **Phase 11** | Animation & Presentation | 📋 | `@animate`, `@keyframes`, motion tokens, `@presentation`, `@slide`, speaker notes, reveals |
| **Phase 12** | Plugin API & Extensions | 📋 | `@plugin` manifest, extension hooks, custom directives, renderers, sandboxing, permissions |
| **Phase 13** | Language Server & Tooling | 📋 | Full LSP, autocomplete, hover, linter, formatter, refactorings, incremental parsing/rendering |
| **Phase 14** | Collaboration & Ecosystem | 📋 | Real-time collaboration, presence, versioning, branching, merging, review comments, publishing |
| **Phase 15** | Universal Theme System | 📋 | Design tokens, Light, Dark, and Eye Protection themes, runtime switching, theme packages |
| **Phase 16** | v1.0 Stable Release | 📋 | Feature & API freeze, formal specification, official CLI, security audit, starter templates |

---

## ⚙️ Public API Reference

```typescript
// ── Core Document API ──────────────────────────────────────────────────────
parse(src: string): { ast: DocumentNode, errors: Error[], warnings: Warning[], diagnostics: Diagnostics }
render(ast: DocumentNode, opts?: { xhtml?: boolean, footnoteSection?: boolean }): string
compile(src: string, opts?: RenderOptions): string

// ── Component & Template API (Phase 9) ─────────────────────────────────────
parseComponent(src: string): { nodes: ComponentNode[], registry: ComponentRegistry }
renderComponent(node: ComponentNode, context?: object, registry?: ComponentRegistry): string
validateComponent(nodes: ComponentNode[], registry?: ComponentRegistry): ComponentDiagnostics

// ── Interactive Engine API (Phase 10) ──────────────────────────────────────
parseInteractive(src: string): { nodes: InteractiveNode[], diagnostics: InteractiveDiagnostics }
renderInteractive(node: InteractiveNode | InteractiveNode[], opts?: object): string
validateInteractive(nodes: InteractiveNode[]): InteractiveDiagnostics

// ── Subsystem APIs ─────────────────────────────────────────────────────────
parseDiagram / renderDiagram / validateDiagram
parseChart / renderChart / validateChart
parseVector / renderVector / validateVector
parseLayout / renderLayout / validateLayout

// ── Constants ──────────────────────────────────────────────────────────────
VERSION: string   // '10.0.0'
PHASE: number     // 10
```

> **No-Throw Guarantee**: `parse`, `render`, `compile`, and all subsystem parse/render functions never throw. Errors and warnings are always returned through the `diagnostics` object or encoded as error nodes in the output HTML.

See [`docs/api/`](docs/api/) for detailed API documentation.

---

## 🧪 Testing & Verification

```bash
# Syntax check — all source and test files
npm run check

# Full test suite — 732 tests across all 10 completed phases
npm run test:node
```

**Current status: 732/732 tests passing · all green.**

---

## 📁 Project Structure

```
zolto/
├── src/                    # Core engine (ships as-is, no build step)
│   ├── zolto.js            # Public API facade
│   ├── lexer.js            # Block tokenizer
│   ├── parser.js           # AST builder
│   ├── renderer.js         # HTML renderer
│   ├── inline-parser.js    # Inline content parser
│   ├── math-parser.js      # Pratt parser for math expressions
│   ├── ast.js              # AST node factories
│   ├── validator.js        # Static document validator
│   ├── diagnostics.js      # Diagnostics collector
│   ├── diagram/            # Phase 5 — Diagram engine
│   ├── chart/              # Phase 6 — Chart engine
│   ├── vector/             # Phase 7 — Vector engine
│   ├── layout/             # Phase 8 — Spatial layout engine
│   ├── component/          # Phase 9 — Component, template & macro system
│   └── interactive/        # Phase 10 — Interactive document & quiz engine
├── tests/                  # Test suite (732 tests)
├── examples/               # Sample .zl documents
├── docs/                   # Developer & user documentation
├── index.html              # Zolto Studio (browser live editor)
└── package.json
```

---

## 📄 License

Zolto is released under the [MIT License](LICENSE).
