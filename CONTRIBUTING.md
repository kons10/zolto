# Contributing to Zolto

Thank you for your interest in contributing! Zolto is a zero-dependency, pure ES-module document engine. This guide will get you set up and productive quickly.

---

## Getting Started

```bash
git clone https://github.com/uxle/zolto.git
cd zolto
npm run check          # verify syntax — all files must parse cleanly
npm run test:node      # run the full test suite (732 tests must pass)
```

No build step. No bundler in development. ES modules run natively in **Node.js 20 LTS or newer**.

---

## Project Architecture

Zolto follows a strict pipeline pattern: **Lex → Parse → Validate → Render**.

```
Source (.zl)
    │
    ▼
src/lexer.js          Block tokenizer — produces a flat token stream
    │
    ▼
src/parser.js         AST builder — produces a DocumentNode tree
    │
    ▼
src/validator.js      Static semantic analysis — populates diagnostics
    │
    ▼
src/renderer.js       HTML renderer — walks the AST and emits HTML
    │
    ├── src/diagram/     Phase 5 sub-pipeline (tokenizer → parser → layout → SVG)
    ├── src/chart/       Phase 6 sub-pipeline (tokenizer → parser → stats → SVG)
    ├── src/vector/      Phase 7 sub-pipeline (tokenizer → parser → scene → SVG)
    ├── src/layout/      Phase 8 sub-pipeline (tokenizer → parser → grid/flex/canvas → HTML)
    ├── src/component/   Phase 9 sub-pipeline (tokenizer → parser → props/slots/macros → HTML)
    └── src/interactive/ Phase 10 sub-pipeline (tokenizer → parser → quiz/form/deck → HTML)
```

---

## File Layout

| Path | Purpose |
|------|---------|
| `src/zolto.js` | Public API facade — the only import consumers need |
| `src/lexer.js` | Block-level tokenizer |
| `src/parser.js` | AST builder |
| `src/renderer.js` | HTML renderer |
| `src/inline-parser.js` | Inline markdown parser (bold, italic, math, links, etc.) |
| `src/math-parser.js` | Pratt (precedence-climbing) math expression parser |
| `src/ast.js` | AST node factory functions |
| `src/validator.js` | Static document validator |
| `src/diagnostics.js` | Diagnostics collector (errors, warnings, info) |
| `src/diagram/` | Phase 5 — Diagram engine |
| `src/chart/` | Phase 6 — Chart engine |
| `src/vector/` | Phase 7 — Vector graphics engine |
| `src/layout/` | Phase 8 — Spatial layout engine |
| `src/component/` | Phase 9 — Component, template & macro system |
| `src/interactive/` | Phase 10 — Interactive documents & quiz engine |

---

## Coding Guidelines

1. **Zero External Runtime Dependencies** — All functionality (math, diagrams, charts, vectors, layout, components, quizzes) must be written from scratch using standard JavaScript APIs.
2. **ES Modules Only** — Use native `import` / `export` syntax everywhere.
3. **No-Throw Guarantee** — Compiler functions (`parse`, `render`, `compile`) must never throw unhandled exceptions. Errors must be collected as diagnostic entries or error nodes.
4. **File Size Limit** — Source files must remain focused and under 800 lines of code.

---

## Commit Messages

Follow Conventional Commits format:
- `feat(component): add slot-forwarding support`
- `fix(interactive): fix checkbox validation on empty values`
- `docs(guide): add interactive quiz syntax reference`
- `test(interactive): add unit test for matching question scoring`

---

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Ensure `npm run check` passes with zero errors.
3. Ensure `npm run test:node` passes **732/732 tests**.
4. Submit a Pull Request with a clear description of the change.
