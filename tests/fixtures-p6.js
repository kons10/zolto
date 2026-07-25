/**
 * Test Fixtures for Zolto Phase 6 — Native Charts & Data Visualization Engine
 */

export const P6_FIXTURES = {
  basicBarChart: `@chart bar title="Monthly Sales"
labels:
  Jan
  Feb
  Mar
  Apr

data:
  120
  180
  145
  210
@/chart`,

  basicHBarChart: `@chart hbar title="Regional Revenue"
labels:
  North
  South
  East
  West

data:
  450
  320
  580
  410
@/chart`,

  basicLineChart: `@chart line title="Sales Trend"
labels:
  Q1
  Q2
  Q3
  Q4

data:
  100
  160
  130
  220
@/chart`,

  multiSeriesChart: `@chart bar title="Quarterly Comparison"
labels:
  Q1
  Q2
  Q3
  Q4

series:
  - name: "Desktop"
    data: 120 140 160 180

  - name: "Mobile"
    data: 80 90 110 130
@/chart`,

  csvSourceChart: `@chart bar title="CSV Sales Data"
source: csv
"month","sales"
"Jan",120
"Feb",180
"Mar",145
@/chart`,

  jsonSourceChart: `@chart pie title="JSON Market Share"
source: json
[
  {"label":"Alpha","value":40},
  {"label":"Beta","value":35},
  {"label":"Gamma","value":25}
]
@/chart`,

  radarChart: `@chart radar title="Skill Breakdown"
labels:
  Speed
  Accuracy
  Stability
  UX

data:
  80
  90
  70
  85
@/chart`,

  gaugeChart: `@chart gauge title="Server CPU Load"
data:
  72
@/chart`,

  customThemeChart: `@chart spline title="Neo Performance" theme="custom:neo" colors=["#38bdf8", "#818cf8"]
labels:
  Jan
  Feb
  Mar

data:
  10
  25
  18
@/chart`,
};
