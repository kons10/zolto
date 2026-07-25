# Zolto Phase 6 — Native Charts & Data Visualization Guide

Zolto Phase 6 introduces a high-performance native chart and data visualization engine capable of rendering 24 chart types directly inside `.zl` documents using `@chart <type> ... @/chart` directive blocks.

---

## 1. Directive Syntax

```zolto
@chart <type> [title="..."] [subtitle="..."] [theme="..."] [width=N] [height=N] [responsive=true|false] [animation=true|false] [legend=true|false] [colors=[...]]

labels:
  Jan
  Feb
  Mar

data:
  120
  180
  145

@/chart
```

---

## 2. 24 Supported Chart Types

1. `bar` — Vertical bar chart
2. `hbar` — Horizontal bar chart
3. `line` — Straight line chart
4. `area` — Filled area chart
5. `spline` — Smooth curve chart
6. `step` — Step line chart
7. `pie` — Pie chart
8. `donut` — Donut chart
9. `scatter` — Scatter plot
10. `bubble` — Bubble chart
11. `radar` — Radar polygon chart
12. `polararea` — Polar sector chart
13. `histogram` — Histogram distribution chart
14. `boxplot` — Box plot
15. `candlestick` — Candlestick financial chart
16. `heatmap` — Heatmap grid chart
17. `treemap` — Nested treemap
18. `sunburst` — Radial sunburst chart
19. `funnel` — Conversion funnel chart
20. `waterfall` — Waterfall bridge chart
21. `gauge` — Progress gauge chart
22. `timeline` — Event timeline chart
23. `calendar` — Calendar activity heatmap
24. `mixed` — Mixed bar + line chart

---

## 3. Data Sources

### Inline Data
```zolto
@chart bar
labels:
  A
  B
data:
  10
  20
@/chart
```

### CSV Data Source
```zolto
@chart bar
source: csv
"month,value"
"Jan,120"
"Feb,180"
@/chart
```

### JSON Data Source
```zolto
@chart pie
source: json
[
  {"label":"Alpha","value":40},
  {"label":"Beta","value":35}
]
@/chart
```

---

## 4. Themes & Design System

Built-in themes:
- `light`
- `dark`
- `custom:neo`
- `custom:night`

Custom palettes can be passed via `colors=["#38bdf8", "#818cf8"]`.

---

## 5. JavaScript API

```js
import { parseChart, renderChart } from 'zolto/chart';

const { ast, diagnostics } = parseChart(sourceStr, headerStr);
const svgString = renderChart(ast, { theme: 'dark' });
```
