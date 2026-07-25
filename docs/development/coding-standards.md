# Coding Standards

## File size

**Hard limit: 800 lines per file.** Split when approaching this limit.
The entire Phase 2 engine ships in 9 files, none exceeding 800 lines.

## ES modules

```javascript
// ✅ Correct
import { parse } from './parser.js';
export function compile(src) { ... }

// ❌ Never
const { parse } = require('./parser.js');
module.exports = { compile };
```

## Equality

Always `===`, never `==`.

## Variables

`const` everywhere possible. `let` only when reassignment is required.
Never `var`.

## Null vs undefined

Optional scalar fields are `null` when absent — never `undefined`.
This keeps AST node shapes stable (V8 hidden class optimisation).

## Arrays

Collection fields on AST nodes are always `[]` — never `null`.
Renderers can safely call `.map()` without null-checks.

## Error handling in engine code

- Parser / renderer: return an `ErrorNode` or `zl-broken-ref` span — never throw
- Public API: throw `TypeError` for wrong argument types only

## Token mutations in the lexer

Never `tokens.pop()` — use `tokens.splice(lastRealIndex(tokens), 1)` so
blank tokens between the target token and the array tail don't cause
the wrong token to be removed.

## CSS classes

All rendered HTML classes use the `zl-` prefix. No exceptions.
This prevents collisions with user-authored CSS.

## SVG Security

All user-provided content rendered into SVG output **must** be passed through the subsystem's `escapeXml()` function before being inserted into any SVG attribute or text node.

```javascript
// ✅ Correct — user content is escaped
html += `<text>${escapeXml(label)}</text>`;
html += `<title>${escapeXml(series.name)}: ${val}</title>`;
html += `<rect id="${escapeXml(shape.id)}" ...>`;

// ❌ Never — raw interpolation of user content
html += `<text>${label}</text>`;
html += `<rect id="${shape.id}" ...>`;
```

This rule applies to: node labels, edge labels, series names, chart labels, chart titles, vector text content, vector shape `id` attributes, and any `aria-label` or `title` elements.

## Chart Domain Bounds

Chart renderers must always include `0` in the y-axis (or x-axis for horizontal) domain range. This ensures a zero-baseline is always visible, even when all data values are negative.

```javascript
// ✅ Correct — 0 is always included in domain
const domainMin = Math.min(0, ...allVals);
const domainMax = Math.max(0, ...allVals, 1);
const domainRange = domainMax - domainMin;

// ❌ Never — domain starts at minVal, so negative data has no baseline
const maxVal = Math.max(1, ...allVals);
const y = pad.top + h - (val / maxVal) * h;
```

Use this pattern:
- `val >= 0` → bar grows upward from the zero-baseline pixel
- `val < 0` → bar grows downward from the zero-baseline pixel
- SVG `height` attribute must always be `Math.max(0, barH)` — never negative

*Version: 7.0.1*
