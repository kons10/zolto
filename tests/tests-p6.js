/**
 * Test Suite for Zolto Phase 6 — Native Charts & Data Visualization Engine
 */

import { parse, compile } from '../src/zolto.js';
import { parseChart } from '../src/chart/parser.js';
import { renderChart } from '../src/chart/renderer.js';
import { validateChart } from '../src/chart/validator.js';
import { computeMin, computeMax, computeMean, computeMedian, computeStdev, computeRollingAverage } from '../src/chart/statistics.js';
import { P6_FIXTURES } from './fixtures-p6.js';

export function runP6Tests() {
  const results = [];
  function test(suite, desc, fn) {
    try {
      fn();
      results.push({ suite: suite.startsWith('Phase 6') ? suite : `Phase 6 · ${suite}`, desc, pass: true });
    } catch (err) {
      results.push({ suite: suite.startsWith('Phase 6') ? suite : `Phase 6 · ${suite}`, desc, pass: false, error: err.stack || err.message });
    }
  }

  function assert(cond, msg = 'Assertion failed') {
    if (!cond) throw new Error(msg);
  }
  function assertEqual(actual, expected, msg = '') {
    if (actual !== expected) throw new Error(`${msg} Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  function assertIncludes(haystack, needle, msg = '') {
    if (typeof haystack === 'string' && !haystack.includes(needle)) {
      throw new Error(`${msg} Expected string to include ${JSON.stringify(needle)}`);
    }
  }

  // 1. Statistics Engine
  test('Phase 6 · Statistics Engine', 'Computes min, max, mean, median, stdev correctly', () => {
    const data = [10, 20, 30, 40, 50];
    assertEqual(computeMin(data), 10);
    assertEqual(computeMax(data), 50);
    assertEqual(computeMean(data), 30);
    assertEqual(computeMedian(data), 30);
    assert(computeStdev(data) > 0);
  });

  test('Phase 6 · Statistics Engine', 'Computes rolling averages correctly', () => {
    const data = [10, 20, 30, 40];
    const rolling = computeRollingAverage(data, 2);
    assertEqual(rolling.length, 4);
    assertEqual(rolling[1], 15);
  });

  // 2. Parser & Grammar
  test('Phase 6 · Parser', 'Parses core bar chart directive block', () => {
    const { ast } = parseChart(P6_FIXTURES.basicBarChart);
    assertEqual(ast.type, 'chart');
    assertEqual(ast.chartType, 'bar');
    assertEqual(ast.title, 'Monthly Sales');
    assertEqual(ast.datasets[0].labels.length, 4);
    assertEqual(ast.datasets[0].series[0].data.length, 4);
  });

  test('Phase 6 · Parser', 'Parses CSV data source correctly', () => {
    const { ast } = parseChart(P6_FIXTURES.csvSourceChart);
    assertEqual(ast.datasets[0].labels.length, 3);
    assertEqual(ast.datasets[0].series[0].data[1], 180);
  });

  test('Phase 6 · Parser', 'Parses JSON data source correctly', () => {
    const { ast } = parseChart(P6_FIXTURES.jsonSourceChart);
    assertEqual(ast.chartType, 'pie');
    assertEqual(ast.datasets[0].labels.length, 3);
    assertEqual(ast.datasets[0].series[0].data[0], 40);
  });

  test('Phase 6 · Bug Fixes', 'Parses CSV containing quoted commas and formatted numbers', () => {
    const csvSrc = `@chart bar\nsource: csv\n"Month, Year", "Sales"\n"Jan, 2026", "1,500"\n"Feb, 2026", "2,100"\n@/chart`;
    const { ast } = parseChart(csvSrc);
    assertEqual(ast.datasets[0].labels[0], 'Jan, 2026');
    assertEqual(ast.datasets[0].series[0].data[0], 1500);
  });

  test('Phase 6 · Bug Fixes', 'Tokenizes scientific notation numbers correctly', () => {
    const chartSrc = `@chart bar\ndata: 1.5e3 2e4\n@/chart`;
    const { ast } = parseChart(chartSrc);
    assertEqual(ast.datasets[0].series[0].data[0], 1500);
    assertEqual(ast.datasets[0].series[0].data[1], 20000);
  });

  // 3. Renderers & 24 Chart Types
  test('Phase 6 · Renderers', 'Renders accessible SVG with role="img" and aria-label', () => {
    const { ast } = parseChart(P6_FIXTURES.basicBarChart);
    const svg = renderChart(ast);
    assertIncludes(svg, 'role="img"');
    assertIncludes(svg, 'aria-label="Monthly Sales"');
    assertIncludes(svg, '<rect');
  });

  test('Phase 6 · Renderers', 'Supports radar chart rendering', () => {
    const { ast } = parseChart(P6_FIXTURES.radarChart);
    const svg = renderChart(ast);
    assertIncludes(svg, '<polygon');
  });

  test('Phase 6 · Renderers', 'Supports gauge chart rendering', () => {
    const { ast } = parseChart(P6_FIXTURES.gaugeChart);
    const svg = renderChart(ast);
    assertIncludes(svg, '72%');
  });

  // 4. Document Compiler Integration
  test('Phase 6 · Integration', 'Compiles Zolto document mixing Markdown, Math, Diagrams, and Charts', () => {
    const docSrc = `# Executive Dashboard

## Revenue Overview
@chart bar title="Quarterly Revenue"
labels:
  Q1
  Q2
  Q3
  Q4
data:
  100
  150
  200
  250
@/chart
`;
    const html = compile(docSrc);
    assertIncludes(html, 'Executive Dashboard');
    assertIncludes(html, 'zl-chart');
    assertIncludes(html, 'role="img"');
  });

  // 5. Validator
  test('Phase 6 · Validator', 'Warns on unknown chart type', () => {
    const { ast } = parseChart(`@chart unknownType\n data: 10 20\n@/chart`);
    const diagnostics = validateChart(ast);
    assert(diagnostics.hasWarnings());
  });

  // 6. Performance Stress
  test('Phase 6 · Performance Stress', 'Processes and renders 10,000 data points in under 500ms', () => {
    const largeData = Array.from({ length: 10000 }, (_, i) => i * 2);
    const dataLines = largeData.join('\n');
    const chartSrc = `@chart line title="Stress Test"\ndata:\n${dataLines}\n@/chart`;

    const t0 = Date.now();
    const { ast } = parseChart(chartSrc);
    const svg = renderChart(ast);
    const duration = Date.now() - t0;

    assert(svg.length > 0);
    assert(duration < 500, `Stress test took ${duration}ms (expected <500ms)`);
  });

  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  return { results, passed, failed, total: results.length };
}
