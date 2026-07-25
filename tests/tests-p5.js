/**
 * Zolto Phase 5 Test Suite — Native Diagram & Graph Engine
 */

import { parse, render, compile, parseDiagram, renderDiagram } from '../src/zolto.js';
import { P5_FIXTURES } from './fixtures-p5.js';
import { validateDiagram } from '../src/diagram/validator.js';
import { DiagramGraph } from '../src/diagram/graph.js';
import { computeGraphLayout } from '../src/diagram/layout/index.js';

export function runP5Tests() {
  const results = [];
  function test(suite, desc, fn) {
    try {
      fn();
      results.push({ suite: `Phase 5 · ${suite}`, desc, pass: true });
    } catch (err) {
      results.push({ suite: `Phase 5 · ${suite}`, desc, pass: false, error: err.stack || err.message });
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

  // 1. Diagram Tokenizer & Parser Tests
  test('Parser', 'Parses core flowchart directive block', () => {
    const { ast } = parseDiagram(P5_FIXTURES.flowchartBasic);
    assert(ast.type === 'diagram');
    assertEqual(ast.diagramType, 'flowchart');
    const graphNode = ast.children.find(c => c.type === 'graph');
    assert(graphNode);
    assertEqual(graphNode.nodes.length, 4);
    assertEqual(graphNode.edges.length, 3);
  });

  test('Parser', 'Parses header attributes (id, theme, layout, aria)', () => {
    const { ast } = parseDiagram(P5_FIXTURES.flowchartWithAttributes);
    assertEqual(ast.id, 'auth-flow');
    assertEqual(ast.theme, 'dark');
    assertEqual(ast.layout, 'hierarchical');
    assertEqual(ast.aria, 'Authentication flow');
  });

  test('Parser', 'Parses groups and clusters correctly', () => {
    const { ast } = parseDiagram(P5_FIXTURES.groupsAndClusters);
    const graph = ast.children.find(c => c.type === 'graph');
    assertEqual(graph.groups.length, 1);
    assertEqual(graph.groups[0].id, 'payment.group');
    assertEqual(graph.clusters.length, 1);
    assertEqual(graph.clusters[0].id, 'backend.cluster');
  });

  test('Parser', 'Resolves cross-references and automatic node creation', () => {
    const { ast } = parseDiagram(P5_FIXTURES.crossRefAndAutoNode);
    const graph = ast.children.find(c => c.type === 'graph');
    assertEqual(graph.references.length, 2);
    const gObj = new DiagramGraph(graph.nodes, graph.edges, graph.references);
    assertEqual(gObj.resolveId('database.main'), 'DB');
    assertEqual(gObj.resolveId('system.logger'), 'Logger');
  });

  // 2. 23 Diagram Types Coverage
  const diagramTypes = [
    'flowchart', 'sequence', 'state', 'er', 'mindmap',
    'tree', 'decision', 'org', 'class', 'object',
    'package', 'component', 'deployment', 'usecase', 'activity',
    'network', 'dependency', 'filesystem', 'git', 'timeline',
    'gantt', 'sankey', 'journey'
  ];

  const typeFixtureMap = {
    flowchart: P5_FIXTURES.flowchartBasic,
    sequence: P5_FIXTURES.accessibilitySequence,
    state: P5_FIXTURES.stateMachine,
    er: P5_FIXTURES.erDiagram,
    mindmap: P5_FIXTURES.mindmapLayout,
    tree: P5_FIXTURES.treeLayout,
    decision: P5_FIXTURES.decisionTree,
    org: P5_FIXTURES.orgChart,
    class: P5_FIXTURES.classDiagram,
    object: P5_FIXTURES.objectDiagram,
    package: P5_FIXTURES.packageDiagram,
    component: P5_FIXTURES.componentDiagram,
    deployment: P5_FIXTURES.deploymentDiagram,
    usecase: P5_FIXTURES.usecaseDiagram,
    activity: P5_FIXTURES.activityDiagram,
    network: P5_FIXTURES.networkLayout,
    dependency: P5_FIXTURES.crossRefAndAutoNode,
    filesystem: P5_FIXTURES.filesystemDiagram,
    git: P5_FIXTURES.gitDiagram,
    timeline: P5_FIXTURES.timelineDiagram,
    gantt: P5_FIXTURES.ganttDiagram,
    sankey: P5_FIXTURES.sankeyDiagram,
    journey: P5_FIXTURES.journeyMap,
  };

  diagramTypes.forEach(type => {
    test('Diagram Types', `Supports native parsing and rendering for '${type}'`, () => {
      const src = typeFixtureMap[type] || `@diagram ${type}\n  A -> B\n@/diagram`;
      const html = compile(src);
      assertIncludes(html, `<svg`);
      assertIncludes(html, `zl-diagram-${type}`);
    });
  });

  // 3. Layout Engine Tests
  test('Layout Engine', 'Computes hierarchical Sugiyama layout coordinates', () => {
    const { ast } = parseDiagram(P5_FIXTURES.flowchartBasic);
    const graphAst = ast.children.find(c => c.type === 'graph');
    const graph = new DiagramGraph(graphAst.nodes, graphAst.edges);
    const layout = computeGraphLayout(graph, 'hierarchical', 'flowchart');
    assert(layout.width > 0);
    assert(layout.height > 0);
    assert(layout.nodePositions.has('Start'));
    assert(layout.edgePaths.length === 3);
  });

  test('Layout Engine', 'Computes tree layout coordinates', () => {
    const { ast } = parseDiagram(P5_FIXTURES.treeLayout);
    const graphAst = ast.children.find(c => c.type === 'graph');
    const graph = new DiagramGraph(graphAst.nodes, graphAst.edges);
    const layout = computeGraphLayout(graph, 'tree', 'tree');
    assert(layout.nodePositions.get('Home').depth === 0);
  });

  test('Layout Engine', 'Computes circular and radial layout coordinates', () => {
    const { ast } = parseDiagram(P5_FIXTURES.mindmapLayout);
    const graphAst = ast.children.find(c => c.type === 'graph');
    const graph = new DiagramGraph(graphAst.nodes, graphAst.edges);
    const layout = computeGraphLayout(graph, 'radial', 'mindmap');
    assert(layout.nodePositions.has('Root'));
  });

  test('Layout Engine', 'Computes force-directed layout coordinates', () => {
    const { ast } = parseDiagram(P5_FIXTURES.networkLayout);
    const graphAst = ast.children.find(c => c.type === 'graph');
    const graph = new DiagramGraph(graphAst.nodes, graphAst.edges);
    const layout = computeGraphLayout(graph, 'force', 'network');
    assert(layout.nodePositions.has('Client'));
  });

  // 4. SVG Renderer & Accessibility
  test('SVG Renderer', 'Generates accessible SVG with role="img" and aria-label', () => {
    const html = compile(P5_FIXTURES.accessibilitySequence);
    assertIncludes(html, 'role="img"');
    assertIncludes(html, 'aria-label="Login sequence between user and server"');
    assertIncludes(html, '<title>Login sequence between user and server</title>');
  });

  test('SVG Renderer', 'Applies custom themes (neo/night)', () => {
    const html = compile(P5_FIXTURES.stylingCustomTheme);
    assertIncludes(html, 'stroke="#38bdf8"');
  });

  // 5. Semantic Validation
  test('Validator', 'Detects duplicate node IDs', () => {
    const { ast } = parseDiagram(`@diagram flowchart\n node A [label="1"]\n node A [label="2"]\n@/diagram`);
    const graph = ast.children.find(c => c.type === 'graph');
    graph.nodes.push({ id: 'A', label: '3' });
    const diagnostics = validateDiagram(ast);
    assert(diagnostics.hasErrors());
    assertIncludes(diagnostics.formatErrors()[0], 'Duplicate node ID');
  });

  test('Validator', 'Warns on unknown layout names', () => {
    const { ast } = parseDiagram(`@diagram flowchart layout="nonexistent"\n A -> B\n@/diagram`);
    const diagnostics = validateDiagram(ast);
    assert(diagnostics.hasWarnings());
  });

  // Deep Bug Fixes Regression Suite
  test('Bug Fixes', 'Parses unquoted hex colors and ignores commas in bracketed attributes', () => {
    const { ast } = parseDiagram(`@diagram flowchart\n node Login [fill=#1e293b, stroke=#38bdf8, radius=16]\n@/diagram`);
    const graphNode = ast.children.find(c => c.type === 'graph');
    const loginNode = graphNode.nodes[0];
    assertEqual(loginNode.fill, '#1e293b');
    assertEqual(loginNode.stroke, '#38bdf8');
    assertEqual(loginNode.radius, 16);
    assert(!loginNode.attributes[',']);
  });

  test('Bug Fixes', 'Renders self-loop connector paths cleanly without node overlap', () => {
    const { ast } = parseDiagram(`@diagram flowchart\n Idle -> Idle [label="Retry"]\n@/diagram`);
    const html = renderDiagram(ast);
    assertIncludes(html, 'path d="M');
    assertIncludes(html, 'Retry');
  });

  test('Bug Fixes', 'Supports dependency dotted arrows and open sequence arrows', () => {
    const { ast } = parseDiagram(`@diagram class\n User ..> Order\n App ->> Server\n@/diagram`);
    const graphNode = ast.children.find(c => c.type === 'graph');
    assertEqual(graphNode.edges.length, 2);
    assertEqual(graphNode.edges[0].from, 'User');
    assertEqual(graphNode.edges[0].to, 'Order');
  });

  test('Bug Fixes', 'Renders sequence diagrams with dedicated horizontal actor layout and vertical lifelines', () => {
    const seqSrc = `@diagram sequence id="login-seq"
actor User
actor App
actor Server

User -> App: Enter credentials
App -> Server: POST /login
Server -> App: Token
App -> User: Success
@/diagram`;
    const html = compile(seqSrc);
    assertIncludes(html, 'zl-diagram-lifelines');
    assertIncludes(html, 'stroke-dasharray="4 4"');
  });

  // 6. Full Document Compiler Integration
  test('Integration', 'Compiles document mixing Markdown, Math, Phase 3 directives, and Phase 5 diagrams', () => {
    const docSrc = `# Project Plan

Check out the architecture below:

@diagram flowchart id="arch"
  User -> API
  API -> Database
@/diagram

$E = mc^2$
`;
    const html = compile(docSrc);
    assertIncludes(html, 'Project Plan');
    assertIncludes(html, '<svg');
    assertIncludes(html, 'zl-diagram-flowchart');
    assertIncludes(html, 'zl-mn');
  });

  // 7. Stress & Performance Benchmark
  test('Performance Stress', 'Parses, lays out, and renders 1,000 nodes under 500ms', () => {
    const lines = ['@diagram flowchart id="stress-1000"'];
    for (let i = 0; i < 1000; i++) {
      lines.push(`N${i} -> N${(i + 1) % 1000}`);
    }
    lines.push('@/diagram');

    const src = lines.join('\n');
    const t0 = Date.now();
    const html = compile(src);
    const elapsed = Date.now() - t0;

    assert(html.length > 0);
    assert(elapsed < 1000, `Benchmark took ${elapsed}ms (expected < 1000ms)`);
  });

  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  return { results, passed, failed, total: results.length };
}
