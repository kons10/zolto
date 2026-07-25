# Zolto Native Vector Graphics & Drawing Guide

**Version:** 7.0.1 · Phase 7 · Native Vector Engine

---

## Overview

Zolto Phase 7 introduces a high-performance **Native Vector Graphics & Drawing Engine** built directly into `.zl` documents.

Using the `@vector ... @/vector` directive, you can define scalable UI diagrams, scientific figures, technical drawings, and illustrations in plain text with zero external dependencies. All vector output is accessible, responsive SVG.

---

## Basic Vector Syntax

```zolto
@vector width=800 height=480 theme="dark"
rect id="card" x=40 y=40 w=240 h=120 radius=16 fill="#1e2230"
circle id="avatar" cx=80 cy=100 r=24 fill="#7c5cff"
text x=120 y=100 size=20 fill="#ffffff"
  Hello Zolto Vector
@endtext
@/vector
```

### Directive Attributes

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `width` | number | `400` | SVG viewport width in px |
| `height` | number | `300` | SVG viewport height in px |
| `viewBox` | string | `"0 0 width height"` | Custom SVG viewBox |
| `theme` | string | `"light"` | `light`, `dark`, `custom:neo`, `custom:night` |
| `background` | color | transparent | Background fill for the SVG canvas |
| `aria-label` | string | auto | Accessible label for the SVG element |

---

## Supported Shapes

| Shape Keyword | Key Attributes | Description |
| :--- | :--- | :--- |
| `rect` | `x y w h radius fill stroke strokeWidth` | Rectangle or rounded rectangle |
| `circle` | `cx cy r fill stroke` | Circle primitive |
| `ellipse` | `cx cy rx ry fill stroke` | Ellipse primitive |
| `line` | `x1 y1 x2 y2 stroke strokeWidth` | Line segment |
| `polyline` | `points="20,20 60,40 100,10"` | Connected open polyline |
| `polygon` | `points="50,10 90,90 10,90"` | Closed polygon |
| `path` | `d="M10 10 L120 10 Z"` | Raw SVG path string |
| `arc` | `cx cy rx ry start end` | Circular / elliptical arc |
| `bezier quadratic` | `x1 y1 cx cy x2 y2` | Quadratic Bézier curve |
| `bezier cubic` | `x1 y1 c1x c1y c2x c2y x2 y2` | Cubic Bézier curve |
| `text` | `x y size weight align` + `@endtext` | Text element with multi-line support |
| `image` | `src x y w h` | Embedded image element |
| `icon` | `name x y size` | Vector icon |
| `use` | `href x y scale` | Reusable symbol instance |

### Common Style Attributes

All shapes accept these styling attributes:

| Attribute | Description |
| :--- | :--- |
| `fill` | Fill color (see Color Formats below) |
| `stroke` | Stroke color |
| `strokeWidth` | Stroke width in px |
| `opacity` | Opacity `0.0` – `1.0` |
| `dashArray` | Stroke dash pattern e.g. `"5 3"` |
| `filter` | CSS filter e.g. `"blur(2px)"` |
| `id` | Element ID for `use` references and accessibility |

---

## Color Formats

Zolto's vector engine accepts any of these color formats:

```
#rrggbb          HEX
#rrggbbaa        HEX with alpha
rgb(r, g, b)     RGB
rgba(r, g, b, a) RGBA
hsl(h, s%, l%)   HSL
hsla(...)        HSLA
red, blue, ...   Named CSS colors
$accent          Theme token (resolved at render time)
$surface
$border
$textPrimary
$textSecondary
gradient:id      Reference to a @gradient block by id
```

---

## Transforms & Styling

Transforms can be applied to any shape, group, or layer:

```zolto
@vector
group transform="translate 100 50 rotate 15 scale 1.2"
  rect x=0 y=0 w=100 h=60 fill="$accent"
@endgroup
@/vector
```

Multiple transforms are composed in order (left to right):

```
translate tx ty   Move by (tx, ty)
rotate deg        Rotate by degrees around origin
scale sx [sy]     Scale uniformly or non-uniformly
skewX deg         Skew along X axis
skewY deg         Skew along Y axis
matrix a b c d e f  Raw SVG matrix transform
```

---

## Gradients

Define named gradients and reference them by ID using the `gradient:id` fill syntax:

```zolto
@vector width=400 height=200
gradient id="gBlue" type="linear" x1=0 y1=0 x2=0 y2=1
  stop offset=0 color="#6ee7f7"
  stop offset=1 color="#3b82f6"
@endgradient

gradient id="gGold" type="radial" cx=0.5 cy=0.5 r=0.5
  stop offset=0 color="#fbbf24"
  stop offset=1 color="#b45309"
@endgradient

rect x=10 y=10 w=180 h=180 radius=12 fill="gradient:gBlue"
circle cx=300 cy=100 r=80 fill="gradient:gGold"
@/vector
```

> **Important**: The gradient block must appear before the shape that references it in the source.

---

## Scene Graph Structure

Complex drawings can use the full scene graph hierarchy:

```zolto
@vector width=600 height=400
artboard id="main" x=0 y=0 w=600 h=400
  layer id="background"
    rect x=0 y=0 w=600 h=400 fill="#0f1117"
  @endlayer
  layer id="content"
    group id="card"
      rect x=40 y=40 w=520 h=320 radius=16 fill="#1e2230"
    @endgroup
  @endlayer
@endartboard
@/vector
```

---

## Text Elements

Text blocks use `@endtext` to close:

```zolto
@vector
text x=50 y=50 size=24 weight=700 fill="#ffffff" align="left"
  Line one of text
@endtext

text x=50 y=90 size=14 fill="#a0aec0" align="left"
  Subtitle or secondary content
@endtext
@/vector
```

Text attributes:

| Attribute | Description |
| :--- | :--- |
| `x`, `y` | Position |
| `size` | Font size in px |
| `weight` | Font weight (`400`, `700`, `bold`, `normal`) |
| `align` | Text anchor: `left`, `center`, `right` |
| `font` | Font family |
| `fill` | Text color |

---

## Accessibility

Every `@vector` block renders a root `<svg>` with:

```html
<svg ... role="img" aria-label="Vector graphic">
  <title>Vector graphic</title>
  ...
</svg>
```

Set a custom accessible label with the `aria-label` attribute:

```zolto
@vector width=400 height=300 aria-label="Architecture diagram showing three microservices"
rect x=0 y=0 w=120 h=60 fill="#7c5cff"
text x=60 y=35 size=14 fill="#fff" align="center"
  Auth Service
@endtext
@/vector
```

Individual shapes can also receive `id` and `title` attributes for finer accessibility:

```zolto
circle id="avatar-ring" cx=60 cy=60 r=40 fill="#7c5cff"
  title="User avatar placeholder"
```

---

## Security

All text content and attribute values rendered into SVG output are passed through `escapeXml()`, which encodes `<`, `>`, `&`, `"`, and `'`. User-provided content is safe to embed in SVG.

---

## JavaScript API

```javascript
import { parseVector, renderVector, validateVector } from './src/vector/index.js';

const source = `
@vector width=300 height=200
rect x=10 y=10 w=280 h=180 fill="#1e2230" radius=8
@/vector
`;

const { ast, diagnostics } = parseVector(source);
const svgString = renderVector(ast, { theme: 'dark' });

// Validate only (no render)
const diag = validateVector(ast);
if (diag.errors.length) console.error(diag.errors);
```

---

## Full Example

```zolto
@vector width=640 height=360 theme="dark" aria-label="Monthly revenue dashboard card"

gradient id="headerGrad" type="linear" x1=0 y1=0 x2=1 y2=0
  stop offset=0 color="#7c5cff"
  stop offset=1 color="#00d4ff"
@endgradient

rect x=0 y=0 w=640 h=360 radius=16 fill="#0f1117"
rect x=0 y=0 w=640 h=72 radius=16 fill="gradient:headerGrad"

text x=32 y=44 size=20 weight=700 fill="#ffffff"
  Monthly Revenue Dashboard
@endtext

circle cx=600 cy=36 r=24 fill="#ffffff" opacity=0.15
text x=600 y=42 size=14 fill="#ffffff" align="center"
  ↑
@endtext

line x1=0 y1=72 x2=640 y2=72 stroke="#3d4466" strokeWidth=1

text x=32 y=110 size=36 weight=700 fill="#ffffff"
  $1,284,000
@endtext
text x=32 y=138 size=14 fill="#00d4ff"
  ▲ 18.4% vs last month
@endtext

@/vector
```

---

*Version: 7.0.1 · Phase 7 — Native Vector Graphics Engine*
