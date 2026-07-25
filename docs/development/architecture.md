# Zolto Architecture

**Version:** 7.0.1 · Core & Modular Subsystem Architecture

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
    layout/            9 pluggable layout strategies:
      hierarchical.js  Layered Sugiyama algorithm
      tree.js          Reingold-Tilford hierarchy
      circular.js      Perimeter layout
      radial.js        Concentric ring layout
      force.js         Fruchterman-Reingold force-directed
      grid.js          Matrix grid layout
      orthogonal.js    Manhattan edge connector routing
      sequence.js      Sequence diagram lifeline layout
      manual.js        Explicit coordinate placement

  chart/               Phase 6 — Native Chart & Data Visualization Engine
    tokenizer.js       Chart-specific lexer
    parser.js          Grammar parser → chart AST
    ast.js             Chart AST node factories
    datasets.js        Multi-format data source loader (inline, CSV, TSV, JSON)
    statistics.js      Statistical engine (mean, median, stdev, rolling avg)
    svg.js             SVG DOM generator with escapeXml()
    renderer.js        Rendering facade
    renderers/
      index.js         24 chart renderer functions (bar, line, pie, gauge, etc.)
    validator.js       Semantic chart validator
    themes.js          Built-in & custom theme registry

  vector/              Phase 7 — Native Vector Graphics & Drawing Engine
    tokenizer.js       Vector-specific lexer
    parser.js          Grammar parser → vector AST
    ast.js             Vector AST node factories (shapes, groups, gradients)
    scene.js           Scene graph topology & traversal
    styles.js          Color resolution, gradient references, theme tokens
    transforms.js      Transform matrix composer (translate, rotate, scale, skew)
    svg.js             SVG DOM generator with escapeXml()
    renderer.js        Rendering facade
    validator.js       Semantic vector validator
    diagnostics.js     Vector-specific diagnostics collector
```

---

## Compilation Pipeline

```
Source string (.zl document)
     │
     ▼
lexer.js  ─────────────────────────────────────────────────────────
     │  Block tokens:
     │    T.HEADING, T.PARAGRAPH, T.TABLE, T.BLOCKQUOTE
     │    T.MATH_BLOCK, T.DIRECTIVE
     │    T.DIAGRAM_BLOCK, T.CHART_BLOCK, T.VECTOR_BLOCK
     ▼
parser.js ─────────────────────────────────────────────────────────
     │  DocumentNode AST:
     │    HeadingNode, ParagraphNode, TableNode, DirectiveNode
     │    MathBlockNode, DiagramNode, ChartNode, VectorNode
     ▼
validator.js ──────────────────────────────────────────────────────
     │  Diagnostics (errors[], warnings[], info[])
     │  AST is always returned — never null, never throws
     ▼
renderer.js ───────────────────────────────────────────────────────
     │  Visits each AST node:
     │  ┌─────────────────────────────────────────────────────┐
     │  │ DiagramNode   → diagram/renderer.js → SVG string    │
     │  │ ChartNode     → chart/renderer.js   → SVG string    │
     │  │ VectorNode    → vector/renderer.js  → SVG string    │
     │  │ MathBlockNode → math-renderer.js    → HTML + MathML │
     │  │ All other     → inline HTML                         │
     │  └─────────────────────────────────────────────────────┘
     ▼
HTML string (with embedded accessible SVG fragments)
```

### Inline Pipeline (within paragraphs)

```
Paragraph text
     │
     ▼
inline-parser.js  ─── cursor-based, precedence-aware
     │  InlineNode[]:
     │    TextNode, StrongNode, EmNode, CodeNode
     │    MathInlineNode, LinkNode, ImageNode
     │    HighlightNode, FootnoteRefNode, ...
     ▼
renderer.js (renderInline) → HTML string
```

---

## Key Design Invariants

| Invariant | Description |
| :--- | :--- |
| **No-throw guarantee** | `parse()`, `render()`, `compile()`, and all subsystem equivalents never throw. Errors are encoded in `diagnostics` or as error-recovery AST nodes in the output. |
| **Pure renderer** | `render(ast)` always produces byte-identical output for byte-identical input. No random IDs, no timestamps, no side effects. |
| **Zero external dependencies** | The entire `src/` tree is self-contained. No npm packages are required at runtime. |
| **800-line file limit** | Every source file stays strictly under 800 lines. Files that grow beyond this are split into focused modules. |
| **Monomorphic AST** | AST node shapes are stable and consistent across all subsystems. New node types are registered through `src/ast.js`. |
| **Signed domain charts** | Chart renderers include `0` in the y-axis domain so zero-baselines always render even when all data is negative. |
| **SVG security** | All user-provided content output into SVG (text, attributes, titles, tooltips) is passed through the subsystem's `escapeXml()`. |

---

## Phase Progression

| Phase | Subsystem | Status | Tests |
| :---- | :-------- | :----- | :---- |
| **Phase 1** | Markdown Core | ✅ Done | — |
| **Phase 2** | Extended Markdown Layer | ✅ Done | — |
| **Phase 3** | Native Block Directives | ✅ Done | — |
| **Phase 4** | Native Mathematics Engine | ✅ Done | — |
| **Phase 5** | Native Diagram & Graph Engine | ✅ Done | — |
| **Phase 6** | Native Chart & Data Visualization Engine | ✅ Done | — |
| **Phase 7** | Native Vector Graphics & Drawing Engine | ✅ Done | — |
| **Cumulative** | Phases 1–7 | ✅ | **601/601** |
| **Phases 8–16** | Layout, Components, Interactive, Animation, Plugins, LSP, Collaboration, Themes, v1.0 | 📋 Planned | — |
