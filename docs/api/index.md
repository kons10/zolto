# Zolto API Reference

**Version:** 6.0.0 · Phase 6

---

## Core API (`src/zolto.js`)

| Export | Type | Description |
| :----- | :--- | :---------- |
| `parse(src)` | Function | Parse source → AST + diagnostics |
| `render(ast, opts?)` | Function | AST → HTML string |
| `compile(src, opts?)` | Function | parse + render combined |
| `parseDiagram(src, header)` | Function | Parse diagram directive content → `{ ast, diagnostics }` |
| `renderDiagram(ast, opts?)` | Function | Render diagram AST → accessible SVG |
| `parseChart(src, header)` | Function | Parse chart directive content → `{ ast, diagnostics }` |
| `renderChart(ast, opts?)` | Function | Render chart AST → accessible SVG |
| `renderInline(nodes, ctx)` | Function | Render inline node array → HTML |
| `inlineToText(nodes)` | Function | Extract plain text from inline nodes |
| `about()` | Function | Return library metadata banner |
| `VERSION` | string | `'6.0.0'` |
| `PHASE` | number | `6` |

## Subsystem APIs

- **Diagram Engine (`src/diagram/`)**: `parseDiagram`, `renderDiagram`, `validateDiagram`, `DiagramGraph`, `computeGraphLayout`.
- **Chart Engine (`src/chart/`)**: `parseChart`, `renderChart`, `validateChart`, `getChartTheme`, `computeStatsSummary`, `parseCSV`, `parseTSV`, `parseJSONData`.

## Diagnostics API (`src/diagnostics.js`)

| Export | Description |
| :----- | :---------- |
| `Diagnostics` | Class — collects errors, warnings, info |
| `Severity` | Enum — `ERROR` `WARNING` `INFO` |
| `Code` | Enum — all error/warning codes |

## Detailed References

- [parser-api.md](parser-api.md) — `parse()` options, `ParseResult` shape
- [types.md](types.md) — TypeScript-style type definitions for all AST nodes
- [charts.md](../guide/charts.md) — Native Chart & Data Visualization Guide
- [diagrams.md](../guide/diagrams.md) — Native Diagram & Graph Guide
