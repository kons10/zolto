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

## 5. Negative Values & Mixed Data

**Supported chart types** (`bar`, `hbar`, `line`, `area`, `spline`, `step`, `scatter`, `bubble`) all fully support negative values as of v7.0.1.

The chart engine automatically computes a signed domain `[min(0, minValue), max(0, maxValue)]` and renders a zero-baseline axis rule. Positive and negative values are plotted relative to this baseline:

```zolto
@chart bar title="Profit & Loss"
labels: Q1 Q2 Q3 Q4
data: 420 -80 310 -25
@/chart
```

```zolto
@chart line title="Temperature Deviation"
labels: Jan Feb Mar Apr May Jun
data: -3.2 -1.8 0.5 2.1 4.4 3.9
@/chart
```

**Area charts** with negative values close the fill area to the zero-baseline (not the bottom of the viewport), which is the correct visual convention.

**`null` and `NaN` data points** are silently skipped in line, area, spline, and step charts. The line continues between the valid surrounding points.

---

## 6. JavaScript API

```js
import { parseChart, renderChart, validateChart } from './src/chart/index.js';

const { ast, diagnostics } = parseChart(sourceStr, headerStr);
const svgString = renderChart(ast, { theme: 'dark' });
```

---

## 7. Known Limitations & Best Practices

| Limitation | Details |
| :--- | :--- |
| **Pie/Donut — no negatives** | Negative values are clamped to `0` before pie slice computation. Use a bar or waterfall chart for signed data. |
| **Pie/Donut — zero slices** | Zero-value slices are silently skipped (they produce degenerate paths). This is intentional. |
| **Gauge — clamped to [0, 100]** | Gauge values above 100 are clamped to 100%; below 0 to 0%. |
| **Empty data** | Charts with no valid numeric data points return an empty string rather than rendering a blank SVG frame. |
| **Security** | All label text, series names, and tooltip values are XML-escaped via `escapeXml()`. Never bypass this function when extending renderers. |
| **Label count vs data count** | When `labels` has more entries than `data`, extra label ticks are not rendered. When `data` has more entries than `labels`, extra data points are plotted without a label. |

---

*Version: 7.0.1 · Phase 6 — Native Charts Engine*
