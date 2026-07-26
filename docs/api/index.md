# Zolto API Reference

**Version:** 10.0.0 · Phase 10 · Interactive Documents & Educational Features

---

## Core API (`src/zolto.js`)

| Export | Type | Description |
| :----- | :--- | :---------- |
| `parse(src)` | Function | Parse source → AST + diagnostics |
| `render(ast, opts?)` | Function | AST → HTML string |
| `compile(src, opts?)` | Function | parse + render combined |
| `parseComponent(src)` | Function | Parse component source → `{ nodes, registry }` |
| `renderComponent(node, context?, registry?)` | Function | Render component node → HTML |
| `validateComponent(nodes, registry?)` | Function | Validate component tree → ComponentDiagnostics |
| `ComponentRegistry` | Class | Registry for components, templates, and macros |
| `parseInteractive(src)` | Function | Parse interactive block content → `{ nodes, diagnostics }` |
| `renderInteractive(node, opts?)` | Function | Render interactive AST → accessible HTML |
| `validateInteractive(nodes)` | Function | Validate interactive AST → InteractiveDiagnostics |
| `parseLayout(src, header)` | Function | Parse spatial layout directive content → `{ ast, diagnostics }` |
| `renderLayout(ast, renderBlockFn?)` | Function | Render layout AST → HTML + CSS |
| `parseVector(src, header)` | Function | Parse vector directive content → `{ ast, diagnostics }` |
| `renderVector(ast, opts?)` | Function | Render vector AST → accessible SVG |
| `parseChart(src, header)` | Function | Parse chart directive content → `{ ast, diagnostics }` |
| `renderChart(ast, opts?)` | Function | Render chart AST → accessible SVG |
| `parseDiagram(src, header)` | Function | Parse diagram directive content → `{ ast, diagnostics }` |
| `renderDiagram(ast, opts?)` | Function | Render diagram AST → accessible SVG |
| `renderInline(nodes, ctx)` | Function | Render inline node array → HTML |
| `inlineToText(nodes)` | Function | Extract plain text from inline nodes |
| `about()` | Function | Return library metadata banner |
| `VERSION` | string | `'10.0.0'` |
| `PHASE` | number | `10` |

## Subsystem APIs

- **Interactive Subsystem (`src/interactive/`)**: `parseInteractive`, `renderInteractive`, `validateInteractive`, `INTERACTIVE_NODE_TYPES`, `INTERACTIVE_CSS`, `scoreMCQ`, `scoreMulti`, `scoreTrueFalse`, `scoreFillBlank`, `scoreMatching`, `quizScore`, `shuffleCards`, `deckProgress`, `groupByDifficulty`, `tally`, `createDocumentState`, `updateState`, `resolveBinding`.
- **Component Subsystem (`src/component/`)**: `parseComponent`, `renderComponent`, `validateComponent`, `ComponentRegistry`, `parsePropDeclaration`, `validateAndBindProps`, `resolveSlots`, `expandMacro`, `getBuiltinComponents`.
- **Spatial Layout Subsystem (`src/layout/`)**: `parseLayout`, `renderLayout`, `validateLayout`, `LAYOUT_NODE_TYPES`, `LAYOUT_BASE_CSS`.
- **Vector Subsystem (`src/vector/`)**: `parseVector`, `renderVector`, `validateVector`, `VectorSceneGraph`, `resolveColorToken`, `buildTransformString`, `renderVectorSvgNode`.
- **Chart Subsystem (`src/chart/`)**: `parseChart`, `renderChart`, `validateChart`, `getChartTheme`, `computeStatsSummary`, `parseCSV`, `parseTSV`, `parseJSONData`.
- **Diagram Subsystem (`src/diagram/`)**: `parseDiagram`, `renderDiagram`, `validateDiagram`, `DiagramGraph`, `computeGraphLayout`.

## Diagnostics API (`src/diagnostics.js`)

| Export | Description |
| :----- | :---------- |
| `Diagnostics` | Class — collects errors, warnings, info |
| `Severity` | Enum — `ERROR` `WARNING` `INFO` |
| `Code` | Enum — all error/warning codes |

## Detailed References

- [parser-api.md](parser-api.md) — `parse()` options, `ParseResult` shape
- [renderer-api.md](renderer-api.md) — Renderer options and compile pipeline
- [types.md](types.md) — TypeScript-style type definitions for all AST nodes
- [components.md](../guide/components.md) — Component, Template & Macro Guide
- [interactive.md](../guide/interactive.md) — Interactive Documents & Educational Features Guide
- [layout.md](../guide/layout.md) — Spatial Layout & Canvas Guide
- [vector.md](../guide/vector.md) — Native Vector Graphics & Drawing Guide
- [charts.md](../guide/charts.md) — Native Chart & Data Visualization Guide
- [diagrams.md](../guide/diagrams.md) — Native Diagram & Graph Guide
