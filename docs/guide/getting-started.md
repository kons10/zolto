# Getting Started with Zolto

**Version:** 7.0.1 · Phases 1–7 Complete

Zolto is a **next-generation document & visualization language** — a strict superset of CommonMark that adds native Mathematics, Diagrams, Charts, Vector Graphics, and interactive components, all with zero external dependencies.

Every valid `.md` file is a valid `.zl` file. You can adopt Zolto incrementally, feature by feature.

---

## Prerequisites

- **Node.js 20 LTS** or newer (for running the engine and test suite)
- **Any modern browser**: Chrome 120+, Firefox 121+, Safari 17+, Edge 120+

---

## Installation

### Option A — Zolto Studio (browser live editor, no install)

```bash
git clone https://github.com/uxle/zolto.git
cd zolto
npx serve . --port 3000
```

Open `http://localhost:3000`. Zolto Studio loads instantly — type Zolto syntax on the left, see live-rendered output on the right.

### Option B — Engine only (pure ES module, Node.js or browser)

```javascript
import { compile } from './src/zolto.js';

const html = compile('# Hello, **Zolto**!');
console.log(html);
// → <h1 id="hello-zolto">Hello, <strong>Zolto</strong>!</h1>
```

No build step. No bundler. Import and use.

---

## Your First Document

Create a file called `hello.zl`:

```zolto
---
title: My First Zolto Document
author: Your Name
date: 2026-07-25
---

# Hello, Zolto!

> [!TIP]
> You already know Zolto if you know Markdown.
> Every `.md` file is a valid `.zl` file.

This document mixes **Phases 1–7** features:

- GitHub-style callout above using `> [!TIP]`
- ==Highlighted text== with `==text==`
- Inline math: $E = mc^2$

## A Native Chart

@chart bar title="Weekly Visitors"
labels: Mon Tue Wed Thu Fri Sat Sun
data: 420 580 310 760 890 1200 980
@/chart

## A Native Diagram

@diagram flowchart
node A [label="Start"]
node B [label="Process"]
node C [label="End"]
A -> B -> C
@/diagram

## A Native Vector Graphic

@vector width=400 height=120 theme="dark"
rect x=0 y=0 w=400 h=120 radius=10 fill="#1e2230"
circle cx=60 cy=60 r=36 fill="#7c5cff"
text x=112 y=52 size=18 weight=700 fill="#ffffff"
  Hello, Vector!
@endtext
text x=112 y=78 size=13 fill="#a0aec0"
  Declarative · Zero-dependency
@endtext
@/vector
```

Compile it programmatically:

```javascript
import { compile } from './src/zolto.js';
import { readFileSync } from 'fs';

const html = compile(readFileSync('hello.zl', 'utf8'));
// html is a complete HTML fragment with embedded SVG
```

Or paste it into [Zolto Studio](http://localhost:3000) and see it render live.

---

## Running the Test Suite

```bash
npm run check          # Syntax check all source and test files
npm run test:node      # Run the full test suite (601 tests)
```

All 601 tests across phases 1–7 should pass with ✓ green output.

---

## Next Steps

| Guide | What it covers |
| :--- | :--- |
| [Basic Syntax](basic-syntax.md) | CommonMark Markdown reference |
| [Advanced Syntax](advanced-syntax.md) | Phase 2 extended Markdown features |
| [Math Equations](math-equations.md) | LaTeX-style math with `$...$` and `@math` |
| [Diagrams](diagrams.md) | 23 diagram types with `@diagram` |
| [Charts](charts.md) | 24 chart types with `@chart`, including negative values |
| [Vector Graphics](vector.md) | Declarative drawing with `@vector` |
| [Configuration](configuration.md) | Themes, options, and render settings |
| [API Reference](../api/index.md) | Full public API documentation |
