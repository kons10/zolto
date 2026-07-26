# Zolto Architecture

**Version:** 10.0.0 · Core & Modular Subsystem Architecture

---

## Source Tree

```
src/
  zolto.js             Public API facade — parse() / render() / compile()
  ast.js               AST node factory — core node shapes & type enums
  tokenizer.js         Character scanner, utilities, HTML entity map
  lexer.js             Block tokenizer → typed token stream (T.*)
  inline-parser.js     Cursor-based inline markdown parser
  parser.js            Block tokens → Document AST
  diagnostics.js       Structured error/warning accumulator (never throws)
  validator.js         AST walk + semantic diagnostic emission
  renderer.js          Pure-functional AST → HTML string

  math-tokenizer.js    LaTeX-like math scanner
  math-parser.js       Pratt precedence-climbing expression parser
  math-renderer.js     Visual HTML math renderer
  math-mathml.js       Semantic MathML renderer for screen readers
  math-validator.js    Equation label & cross-reference validator

  diagram/             Phase 5 — Native Diagram & Graph Engine
    tokenizer.js       Diagram-specific lexer
    parser.js          Grammar parser → diagram AST
    ast.js             Diagram AST node factories
    graph.js           Topology engine (nodes, edges, clusters)
    svg.js             SVG DOM generator with escapeXml()
    renderer.js        Rendering facade
    themes.js          Built-in & custom theme registry
    validator.js       Semantic diagram validator

  chart/               Phase 6 — Native Chart & Data Visualization Engine
    tokenizer.js       Chart-specific lexer
    parser.js          Grammar parser → chart AST
    ast.js             Chart AST node factories
    datasets.js        Multi-format data source loader (inline, CSV, TSV, JSON)
    statistics.js      Statistical engine (mean, median, stdev, rolling avg)
    svg.js             SVG DOM generator with escapeXml()
    renderer.js        Rendering facade
    renderers/         24 chart renderer functions (bar, line, pie, gauge, etc.)

  vector/              Phase 7 — Native Vector Graphics & Drawing Engine
    tokenizer.js       Vector-specific lexer
    parser.js          Grammar parser → vector AST
    ast.js             Vector AST node factories (shapes, groups, gradients)
    scene.js           Scene graph topology & traversal
    styles.js          Color resolution, gradient references, theme tokens
    transforms.js      Transform matrix composer (translate, rotate, scale, skew)
    svg.js             SVG DOM generator with escapeXml()
    renderer.js        Rendering facade

  layout/              Phase 8 — Spatial Layout & Canvas Engine
    tokenizer.js       Layout-specific lexer & attribute parser
    parser.js          Recursive descent layout parser
    ast.js             Layout AST node factories (grid, flex, stack, canvas, pages, presentation)
    styles.js          Scoped CSS rule generator & responsive layout engine
    renderer.js        HTML + inline CSS layout renderer

  component/           Phase 9 — Component, Template & Macro System
    tokenizer.js       Component/template/macro lexer
    parser.js          Grammar parser → component AST (component, slot, template, macro, if, each)
    ast.js             Component AST node factories
    props.js           Typed/required prop validation, context path evaluation & text interpolation
    slots.js           Named slot mapping, fallback resolution & slot forwarding
    templates.js       Template inheritance (`extends`) resolver
    macros.js          Parameterized macro expansion with 20-level recursion cap
    builtins.js        12 built-in pattern definitions (Card, StatCard, AlertBox, etc.)
    registry.js        Component, template & macro registry
    renderer.js        Component rendering facade
    validator.js       Static component validator

  interactive/         Phase 10 — Interactive Documents & Educational Features
    ast.js             35+ monomorphic interactive AST node factories
    tokenizer.js       Interactive directive scanner
    parser.js          Recursive descent parser → forms, quizzes, flashcards, polls, tasks
    quizzes.js         Pure deterministic quiz scoring engine (MCQ, multi, true/false, fill-blank, match)
    flashcards.js      Flashcard deck shuffle, progress calculation & difficulty grouping
    polls.js           Poll vote tallying and percentage computation
    state.js           Immutable typed state maps & safe binding resolution (no eval)
    bindings.js        Declarative `{expr}` text interpolation & dependency tracking
    styles.js          Embedded interactive CSS (~400 lines): dark mode & reduced motion
    renderer.js        Accessible HTML renderer with `data-zl-*` progressive enhancement hooks
    validator.js       Static interactive AST validator
    diagnostics.js     No-throw diagnostic accumulator
    index.js           Public facade (`parseInteractive`, `renderInteractive`, `validateInteractive`)
```
