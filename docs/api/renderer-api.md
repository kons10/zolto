# Renderer API

**Version:** 10.0.0 · Phase 10 · Interactive Documents & Educational Features

---

## render(ast, opts?)

```typescript
function render(ast: DocumentNode, opts?: RenderOptions): string
```

### RenderOptions

```typescript
interface RenderOptions {
  xhtml?:           boolean;  // default: false — self-close void elements
  footnoteSection?: boolean;  // default: true  — append footnotes section
}
```

### Example

```javascript
import { parse, render } from './src/zolto.js';

const { ast } = parse('# Hello\n\nParagraph[^1].\n\n[^1]: A note.');
const html = render(ast, { xhtml: true, footnoteSection: false });
```

---

## compile(src, opts?)

Convenience wrapper: `compile(src, opts)` = `render(parse(src).ast, opts)`.

```javascript
import { compile } from './src/zolto.js';
const html = compile('# Hello **world**');
// → <h1 id="hello-world">Hello <strong>world</strong></h1>
```

---

## renderInteractive(node, opts?)

Render an interactive AST node or array of nodes (`@form`, `@quiz`, `@deck`, `@poll`, `@tasks`, `@tabs`, `@accordion`) into semantic, accessible HTML with `data-zl-*` progressive enhancement hooks.

```javascript
import { parseInteractive, renderInteractive } from './src/zolto.js';

const { nodes } = parseInteractive('@form login { @text username }');
const html = renderInteractive(nodes[0]);
```

---

## renderComponent(node, context?, registry?)

Render a component node (`ComponentUse`, `TemplateUse`, `MacroUse`, `ConditionalBlock`, `LoopBlock`) into HTML output.

```javascript
import { parseComponent, renderComponent, ComponentRegistry } from './src/zolto.js';

const registry = new ComponentRegistry();
const { nodes } = parseComponent(`
component Card(title="")
card variant="default"
### {title}
slot
end
end

Card(title="Hello")
Content
end
`, { registry });

const html = renderComponent(nodes[1], {}, registry);
```

---

## renderLayout(ast, renderBlockFn?)

Render a spatial layout AST node (`@layout`, `@grid`, `@flex`, `@canvas`, `@pages`, `@presentation`) into HTML and scoped CSS styles.

```javascript
import { parseLayout, renderLayout } from './src/layout/index.js';

const { ast } = parseLayout(`@grid columns=2 gap=16
@cell
Left
@/cell
@cell
Right
@/cell
@/grid`);
const html = renderLayout(ast);
```

---

## renderVector(ast, opts?)

Render a vector AST node (`@vector`) into responsive, accessible SVG.

```javascript
import { parseVector, renderVector } from './src/vector/index.js';

const { ast } = parseVector('rect x=10 y=10 w=100 h=50 fill="#7c5cff"');
const svg = renderVector(ast);
```
