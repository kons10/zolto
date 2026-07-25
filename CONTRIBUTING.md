# Contributing to Zolto

Thank you for your interest in contributing! Zolto is a zero-dependency, pure ES-module document engine. This guide will get you set up and productive quickly.

---

## Getting Started

```bash
git clone https://github.com/uxle/zolto.git
cd zolto
npm run check          # verify syntax — all files must parse cleanly
npm run test:node      # run the full test suite (601 tests must pass)
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
    ├── src/diagram/  Phase 5 sub-pipeline (tokenizer → parser → layout → SVG)
    ├── src/chart/    Phase 6 sub-pipeline (tokenizer → parser → stats → SVG)
    └── src/vector/   Phase 7 sub-pipeline (tokenizer → parser → scene → SVG)
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
| `src/diagram/` | Phase 5 — Diagram engine (23 types, 9 layout algorithms) |
| `src/chart/` | Phase 6 — Chart engine (24 types, statistical engine) |
| `src/vector/` | Phase 7 — Vector engine (scene graph, shapes, SVG renderer) |
| `tests/` | Test suite — run with `npm run test:node` |
| `index.html` | Zolto Studio — browser live editor (GitHub Pages) |
| `examples/` | Example `.zl` source documents |
| `docs/` | Developer and user documentation |

---

## Making a Change

1. **Branch** — Create a feature branch: `git checkout -b feat/my-feature`
2. **Code** — Make your changes, following the code rules below
3. **Test** — Add or update tests for every changed behaviour
4. **Verify** — `npm run check && npm run test:node` — all 601+ tests must pass
5. **PR** — Open a pull request targeting `main`

---

## Code Rules

- **No files over 800 lines** — if a file grows beyond 800 lines, split it into focused modules
- **ES modules only** — no `require()`, no CommonJS, no dynamic `import()` inside hot paths
- **No external dependencies** — the `src/` directory must remain self-contained
- **Use the AST factory** — never construct raw AST objects; always call factory functions in `src/ast.js`
- **Never throw in the parser or renderer** — errors must be reported via `Diagnostics`; the render pipeline must always produce a string
- **SVG safety** — all user-provided content rendered into SVG attributes or text must be passed through the subsystem's `escapeXml()` function

---

## Adding a New Feature

The pipeline is the same regardless of which phase the feature belongs to:

### Core Language Features (Phases 1–4)
1. Add the AST node type to `src/ast.js`
2. Lex it in `src/lexer.js` or `src/inline-parser.js`
3. Parse it in `src/parser.js`
4. Validate it in `src/validator.js`
5. Render it in `src/renderer.js` (or `src/inline-parser.js` for inline nodes)
6. Add tests in `tests/tests-p1.js` through `tests/tests-p4.js`
7. Document it in `docs/guide/`

### Diagram Features (Phase 5)
1. Update `src/diagram/parser.js` for new grammar
2. Update `src/diagram/layout/` for layout logic
3. Update `src/diagram/svg.js` for rendering
4. Add tests to `tests/tests-p5.js`
5. Document in `docs/guide/diagrams.md`

### Chart Features (Phase 6)
1. Update `src/chart/parser.js` for new syntax
2. Add renderer to `src/chart/renderers/index.js`
3. Update `src/chart/statistics.js` if adding calculations
4. Add tests to `tests/tests-p6.js`
5. Document in `docs/guide/charts.md`

### Vector Features (Phase 7)
1. Update `src/vector/tokenizer.js` and `src/vector/parser.js`
2. Add shape/node type to `src/vector/ast.js`
3. Render it in `src/vector/svg.js`
4. Add tests to `tests/tests-p7.js`
5. Document in `docs/guide/vector.md`

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(chart): add waterfall chart renderer
fix(vector): escape XML in text content
docs(readme): update test count to 601
test(p7): add gradient resolution regression test
refactor(diagram): extract self-loop path into helper
```

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`

---

## Pull Request Guidelines

- PRs must have a clear description of what changed and why
- Link any related issues with `Closes #123` or `Fixes #123`
- All CI checks must pass before review
- Keep PRs focused — one feature or fix per PR
- Prefer small, reviewable commits over large squashed blobs
- Tests are **required** for all new features and bug fixes
- Documentation updates are **required** if you change public API behaviour

---

## Reporting Issues

Use the [GitHub Issues](https://github.com/uxle/zolto/issues) page. When reporting a bug, include:

1. The `.zl` source that triggers the bug
2. The actual output (or error) you got
3. The expected output
4. Your Node.js version (`node --version`)
