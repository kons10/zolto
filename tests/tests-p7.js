/**
 * Zolto Phase 7 Unit & Integration Test Suite — Native Vector Engine
 */

import { parseVector, renderVector, validateVector, VectorSceneGraph, resolveColorToken, buildTransformString } from '../src/vector/index.js';
import { compile, parse } from '../src/zolto.js';
import { vectorFixtures } from './fixtures-p7.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`    ✓ ${message}`);
  } else {
    failed++;
    console.error(`    ❌ ${message}`);
  }
}

export function runPhase7Tests() {
  console.log('\nPhase 7 · Vector Graphics Engine Suite');

  // 1. Fixture Parsing & Rendering Tests
  console.log('\n  Vector Parser & Renderer Fixtures');
  for (const fix of vectorFixtures) {
    const { ast, diagnostics } = parseVector(fix.source);
    assert(ast && ast.type === 'vector', `${fix.name} - produces vector AST`);
    assert(!diagnostics.hasErrors(), `${fix.name} - no parse errors`);

    const svg = renderVector(ast);
    assert(typeof svg === 'string' && svg.includes('<svg'), `${fix.name} - renders valid SVG output`);
    assert(svg.includes('role="img"') && svg.includes('aria-label'), `${fix.name} - includes ARIA accessibility attributes`);
  }

  // 2. Style & Color Token Resolution
  console.log('\n  Style & Color Token Engine');
  assert(resolveColorToken('$surface', 'dark') === '#1a1f2b', 'Resolves $surface token for dark theme');
  assert(resolveColorToken('$border', 'light') === '#e2e8f0', 'Resolves $border token for light theme');
  assert(resolveColorToken('#ff0055') === '#ff0055', 'Preserves raw HEX color string');

  // Tokenizer decimal check
  const { ast: decAst } = parseVector(`@vector\ncircle cx=.5 cy=-.5 r=.25\n@/vector`);
  assert(decAst.children[0].cx === 0.5 && decAst.children[0].cy === -0.5, 'Tokenizes leading-dot decimals and negative numbers');

  // 3. Transform String Builder
  console.log('\n  Transform Engine');
  const tfNode = { translate: '20 10', rotate: 45, origin: '100 100', scale: '1.5 1.5' };
  const tfStr = buildTransformString(tfNode);
  assert(tfStr.includes('translate(20 10)'), 'Transforms include translate');
  assert(tfStr.includes('rotate(45 100 100)'), 'Transforms include rotate around origin');
  assert(tfStr.includes('scale(1.5 1.5)'), 'Transforms include scale');

  // 4. Scene Graph Topology
  console.log('\n  Scene Graph Topology');
  const { ast: sceneAst } = parseVector(`@vector
symbol id="sym1"
  rect x=0 y=0 w=10 h=10
@endsymbol
style id="style1"
  fill="#7c5cff"
@endstyle
@/vector`);
  const scene = new VectorSceneGraph(sceneAst);
  assert(scene.getSymbol('sym1') !== undefined, 'Indexes symbol definition by ID');
  assert(scene.getStyle('style1') !== undefined, 'Indexes style block definition by ID');

  // 5. Validator
  console.log('\n  Vector Validator');
  const { ast: dupAst } = parseVector(`@vector
rect id="item1" x=0 y=0 w=10 h=10
circle id="item1" cx=50 cy=50 r=20
@/vector`);
  const vecDiag = validateVector(dupAst);
  assert(vecDiag.hasErrors(), 'Detects duplicate vector node ID');

  // 6. Zolto Core Integration
  console.log('\n  Phase 7 Zolto Integration');
  const docSrc = `
# Vector Illustration Document

> [!NOTE]
> Native vector drawing inside Zolto.

@vector width=800 height=400
rect x=20 y=20 w=200 h=100 fill="#7c5cff" radius=12
text x=40 y=60 size=18 fill="#ffffff"
  Zolto Vector
@endtext
@/vector
`;

  const { ast: docAst, errors } = parse(docSrc);
  assert(errors.length === 0, 'Compiles document mixing Markdown and @vector directive without errors');
  assert(docAst.children.some(c => c.type === 'vector'), 'Document AST contains vector node');

  const html = compile(docSrc);
  assert(html.includes('<svg') && html.includes('zl-vector'), 'Compiles to HTML containing responsive vector SVG');

  // 7. Performance Benchmark
  console.log('\n  Phase 7 Performance Stress Benchmark');
  const shapeLines = [];
  for (let i = 0; i < 5000; i++) {
    shapeLines.push(`rect x=${(i % 100) * 10} y=${Math.floor(i / 100) * 10} w=8 h=8 fill="#7c5cff"`);
  }
  const largeVecSrc = `@vector width=1000 height=1000\n${shapeLines.join('\n')}\n@/vector`;

  const startTime = Date.now();
  const { ast: perfAst } = parseVector(largeVecSrc);
  const perfSvg = renderVector(perfAst);
  const duration = Date.now() - startTime;

  assert(duration < 500, `Parses and renders 5,000 vector shapes under 500ms (took ${duration}ms)`);
  assert(perfSvg.length > 50000, 'Renders large vector illustration DOM output');

  // 8. Vector Text Multi-Line Wrapping & Group Parsing
  console.log('\n  Vector Text Multi-Line Wrapping & Group Parsing');
  const { ast: wrapAst } = parseVector(`@vector
layer id="content"
  group id="card" transform="translate 220 120"
    text id="body" x=100 y=84 size=14 fill="#a8b0c2" w=220 wrap=true
      Native vector graphics with scene graph, transforms, shapes, and export-ready SVG.
    @endtext
  @endgroup
@endlayer
@/vector`);
  const wrapSvg = renderVector(wrapAst);
  assert(wrapSvg.includes('<tspan'), 'Vector text with wrap=true renders multi-line <tspan> elements');
  assert(wrapSvg.includes('transform="translate(220 120)"'), 'Group transform translate 220 120 normalizes to valid SVG transform="translate(220 120)"');

  console.log(`\nPhase 7 Test Results: ${passed} passed, ${failed} failed.`);
  return { passed, failed };
}
