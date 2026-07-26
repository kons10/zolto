# Getting Started with Zolto

**Version:** 10.0.0 · Phases 1–10 Complete

Zolto is a **next-generation document & visualization language** — a strict superset of CommonMark that adds native Mathematics, Diagrams, Charts, Vector Graphics, Spatial Layouts, Components, and Interactive Documents, all with **zero external dependencies**.

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

## Your First Interactive Document

Create a file called `hello.zl`:

```zolto
---
title: My First Zolto Document
author: Your Name
date: 2026-07-26
---

# Hello, Zolto!

> [!TIP]
> You already know Zolto if you know Markdown.
> Every `.md` file is a valid `.zl` file.

component Card(title="")
card variant="primary"
### {title}
slot
end
end

Card(title="Phase 10 Active")
Zolto includes components, vector graphics, spatial layouts, and interactive widgets.
end

@form contact {
  @text username required
  label "Username"
  @email email required
  label "Email"
  @button primary "Submit"
}

@quiz "Knowledge Check" {
  @truefalse "Zolto requires zero external runtime dependencies."
  answer true
}
```

---

## Next Steps

- **[Basic Syntax](basic-syntax.md)** — Learn about extended inline elements, callouts, and admonitions.
- **[Math Equations](math-equations.md)** — Write LaTeX-style formulas with dual MathML output.
- **[Diagrams](diagrams.md)** — Create sequence, flowchart, ER, and mindmap diagrams.
- **[Charts](charts.md)** — Render 24 types of charts directly in your documents.
- **[Vector Graphics](vector.md)** — Draw scalable vector illustrations and artboards.
- **[Spatial Layout](layout.md)** — Use responsive CSS grids, flexbox flows, and slide presentation decks.
- **[Components & Templates](components.md)** — Build reusable content abstractions with props and slots.
- **[Interactive Documents](interactive.md)** — Create forms, quizzes, flashcard decks, and polls.
