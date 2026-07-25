# Zolto AST Specification

**Version:** 5.0.0

The AST is produced by `src/parser.js` and consumed by `src/renderer.js`
and `src/validator.js`. All nodes are created via `src/ast.js` and `src/diagram/ast.js` factory functions.

## Document Root

```js
{
  type: 'document',
  children: Node[],
  metadata: {
    title?: string,
    author?: string,
    variables?: Map<string, string>,
    references?: Map<string, { href, title }>
  }
}
```

## Phase 5 Diagram Nodes

### diagram
```js
{
  type: 'diagram',
  diagramType: string, // 23 types: flowchart, sequence, state, er, mindmap, etc.
  id: string|null,
  theme: string,       // light, dark, custom:neo, custom:night
  layout: string,      // hierarchical, tree, circular, radial, force, grid, orthogonal, manual
  aria: string|null,
  title: string|null,
  attributes: Record<string, any>,
  children: [ GraphNode ]
}
```

### graph
```js
{
  type: 'graph',
  nodes: DiagramNodeItem[],
  edges: DiagramEdgeNode[],
  groups: GroupNode[],
  clusters: ClusterNode[],
  references: ReferenceNode[]
}
```

### node
```js
{
  type: 'node',
  id: string,
  label: string,
  shape: string,      // rect, circle, diamond, round-rect, hexagon, pill, actor, cylinder
  style: string|null,
  fill: string|null,
  stroke: string|null,
  color: string|null,
  radius: number|null,
  shadow: boolean,
  opacity: number,
  animate: string|null
}
```

### edge
```js
{
  type: 'edge',
  from: string,
  to: string,
  label: string|null,
  style: string,      // solid, dashed
  color: string|null,
  arrow: string,      // filled, hollow, normal, dashed, none
  animate: string|null,
  value: number|null
}
```

### cluster & group
```js
{ type: 'cluster', id: string, label: string, nodeIds: string[], children: Node[] }
{ type: 'group', id: string, label: string, nodeIds: string[] }
```

## Phase 4 Math Nodes

### math_block
```js
{ type: 'math_block', config: string, content: string }
```

## Phase 3 Directive Nodes

`embed`, `collapse`, `tabs`, `tab`, `card`, `card_group`, `steps`, `step`, `columns`, `column`, `badge`, `tag`, `alert`, `timeline`, `timeline_event`, `progress`, `avatar`, `icon`.

## Phase 2 Block Nodes

`callout`, `admonition`, `figure`, `definition_list`, `definition_item`, `reference_def`.
