# Zolto

> **Native Diagram & Graph Engine** — a production-quality document engine that is a strict
> superset of standard Markdown. Every valid `.md` file is a valid `.zl` file.

[![CI](https://github.com/uxle/zolto/actions/workflows/ci.yml/badge.svg)](https://github.com/uxle/zolto/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Phase](https://img.shields.io/badge/phase-5-purple)](docs/development/roadmap.md)

## Features — Phase 5

### Native Diagram & Graph Engine (new)

Native, human-readable, deterministic diagram engine with 23 diagram types, 8 pluggable layout algorithms, responsive accessible SVG rendering, theme styling, and AST integration.

| Feature | Syntax | Description |
| :--- | :--- | :--- |
| **Diagram Directive** | `@diagram <type> … @/diagram` | Native block syntax for diagrams |
| **23 Diagram Types** | `flowchart`, `sequence`, `state`, `er`, `mindmap`, `tree`, `decision`, `org`, `class`, `object`, `package`, `component`, `deployment`, `usecase`, `activity`, `network`, `dependency`, `filesystem`, `git`, `timeline`, `gantt`, `sankey`, `journey` | Specialized AST node and SVG renderer for each type |
| **Graph Language** | `node`, `edge`, `group`, `cluster`, `ref`, `A -> B` | Explicit/shorthand nodes, edges, subgraphs, clusters, and aliases |
| **Layout Engine** | `layout="hierarchical\|tree\|circular\|radial\|force\|grid\|orthogonal\|manual"` | Pluggable layout strategy algorithms |
| **Themes & Styling** | `theme="light\|dark\|custom:neo\|custom:night"` | Curated and custom theme tokens, shapes, colors, shadows, borders |
| **Responsive SVG** | `<svg viewBox="..." role="img" aria-label="...">` | Accessible, responsive, high-DPI SVG output with stable element IDs |

### Native Mathematics Engine (Phase 4, fully supported)

No KaTeX, no MathJax, no LaTeX installation — a self-contained math parser and renderer.

| Syntax | Example | Purpose |
|--------|---------|---------|
| `$expr$` | `$E = mc^2$` | Inline math (currency-safe: `$10 or $20` stays plain text) |
| `@math … @/math` | `@math\nF = ma\n@/math` | Display math, auto-numbered |
| `label="…"` | `@math label="eq:newton"` | Anchor for cross-references |
| `@ref(label)` | `@ref(eq:newton)` | Linked reference to a numbered equation |

### Native Block Directives (Phase 3, fully supported)

| Directive | Syntax | Purpose |
|-----------|--------|---------|
| `@embed` | `@embed image src="…" @/embed` | image / video / audio / youtube / vimeo / figma / codepen / iframe |
| `@collapse` | `@collapse title="…" @/collapse` | Disclosure widget |
| `@tabs` / `@tab` | `@tabs @tab label="…" @/tab @/tabs` | Accessible tab groups |
| `@card` / `@card-group` | `@card title="…" @/card` | Variant cards, responsive grid |
| `@steps` / `@step` | `@steps @step title="…" @/step @/steps` | Numbered step lists |
| `@columns` / `@column` | `@columns @column width="…" @/column @/columns` | Responsive layout |
| `@badge` | `@badge success pill @/badge` | 7 variants × pill/outline |
| `@tag` | `@tag color=… href="…" @/tag` | Coloured topic tags |
| `@alert` | `@alert warning title="…" @/alert` | 6 alert types, dismissible |
| `@timeline` / `@event` | `@timeline @event title="…" @/event @/timeline` | Vertical event timeline |
| `@progress` | `@progress value=75 @/progress` | Linear progress bar |
| `@avatar` | `@avatar initials="…" status="…" @/avatar` | Image/initials/icon avatar |
| `@icon` | `@icon name size=24 @/icon` | Material Symbols icon |

### Extended Markdown (Phase 2, fully supported)

| Feature | Syntax | Output |
|---------|--------|--------|
| GitHub Callouts | `> [!NOTE]` | Coloured callout box with icon |
| Admonitions | `[info]…[/info]` | Boxed block with header |
| Reference links | `[text][id]` + `[id]: url` | Resolved `<a>` |
| Figures | Standalone `![alt](src)` | `<figure>` + `<figcaption>` |
| Definition lists | `term\n: def` | `<dl><dt><dd>` |

All Phase 1 features (headings, lists, tables, footnotes, variables, etc.) continue working unchanged.

## Quick start

```bash
git clone https://github.com/zolto/zolto.git
cd zolto
# Open index.html in any static server — no build step required
npx serve . --port 3000
```

Or use the engine in your own project (ES modules):

```javascript
import { compile, parse, parseDiagram, renderDiagram } from './src/zolto.js';

// One-call compile
const html = compile('# Architecture\n\n@diagram flowchart\nStart -> Login\nLogin -> Dashboard\n@/diagram');

// Step-by-step with diagnostics
const { ast, errors, warnings, diagnostics } = parse(source);
const html2 = render(ast, { xhtml: false });
```

## API

```typescript
// parse(src) → { ast, errors, warnings, diagnostics }
parse(src: string): ParseResult

// render(ast, opts?) → html string
render(ast: DocumentNode, opts?: { xhtml?: boolean, footnoteSection?: boolean }): string

// compile(src, opts?) → html string  (parse + render combined)
compile(src: string, opts?: RenderOptions): string

// parseDiagram(src, header?) → { ast, diagnostics }
parseDiagram(src: string, header?: string): { ast: DiagramNode, diagnostics: DiagramDiagnostics }

// renderDiagram(ast, opts?) → svg string
renderDiagram(ast: DiagramNode, opts?: object): string
```

## Tests

```bash
npm run test:node
```
