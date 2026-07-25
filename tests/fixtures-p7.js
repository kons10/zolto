/**
 * Zolto Phase 7 Test Fixtures — Native Vector Graphics Engine
 */

export const vectorFixtures = [
  {
    name: 'Basic vector directive with rect, circle, text',
    source: `@vector width=800 height=480 theme="dark"
rect id="card" x=40 y=40 w=240 h=120 radius=16 fill="#1e2230"
circle id="avatar" cx=80 cy=100 r=24 fill="#7c5cff"
text x=120 y=100 size=20 fill="#ffffff"
Hello Zolto Vector
@endtext
@/vector`,
    expectNodes: ['vector', 'vector_shape', 'vector_shape', 'vector_text'],
  },
  {
    name: 'Artboard, layers, group with transforms and bezier path',
    source: `@vector width=1920 height=1080
artboard id="main" x=0 y=0 w=1920 h=1080
  layer id="background"
    rect x=0 y=0 w=1920 h=1080 fill="#0f1115"
  @endlayer
  layer id="content"
    group id="hero" transform="translate 100 50"
      bezier cubic x1=20 y1=80 c1x=40 c1y=10 c2x=100 c2y=150 x2=140 y2=80 stroke="#7c5cff" strokeWidth=3
    @endgroup
  @endlayer
@endartboard
@/vector`,
    expectNodes: ['vector', 'vector_artboard', 'vector_layer', 'vector_shape', 'vector_layer', 'vector_group', 'vector_shape'],
  },
  {
    name: 'Structured path block',
    source: `@vector
path id="shape-path" fill="#7c5cff"
  move 10 10
  line 120 10
  line 120 80
  close
@endpath
@/vector`,
    expectNodes: ['vector', 'vector_shape'],
  },
  {
    name: 'Linear and radial gradient definitions',
    source: `@vector
gradient id="heroGrad" type="linear" x1=0 y1=0 x2=1 y2=1
  stop offset=0 color="#7c5cff"
  stop offset=1 color="#00d4ff"
@endgradient
circle cx=100 cy=100 r=50 fill="gradient:heroGrad"
@/vector`,
    expectNodes: ['vector', 'vector_gradient', 'vector_shape'],
  },
  {
    name: 'Symbol definition and use',
    source: `@vector
symbol id="starSymbol"
  circle cx=16 cy=16 r=16 fill="#f59e0b"
@endsymbol
use href="#starSymbol" x=100 y=100 scale=2
@/vector`,
    expectNodes: ['vector', 'vector_symbol', 'vector_shape', 'vector_use'],
  },
];
