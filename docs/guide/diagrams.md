# Native Diagram & Graph Engine Guide

Zolto Phase 5 introduces a native diagram and graph engine for `.zl` documents.

## Directive Syntax

```zl
@diagram flowchart id="auth-flow" theme="dark" layout="hierarchical" aria="Authentication flow"
  Start [label="Start", shape="circle"]
  Login [label="Login", shape="rect", style="primary"]
  Dashboard [label="Dashboard", shape="rect"]

  Start -> Login
  Login -> Dashboard
@/diagram
```

## Supported Diagram Types (23 Types)

1. `flowchart`
2. `sequence`
3. `state`
4. `er`
5. `mindmap`
6. `tree`
7. `decision`
8. `org`
9. `class`
10. `object`
11. `package`
12. `component`
13. `deployment`
14. `usecase`
15. `activity`
16. `network`
17. `dependency`
18. `filesystem`
19. `git`
20. `timeline`
21. `gantt`
22. `sankey`
23. `journey`

## Layout Engines

Pass `layout="..."` attribute:
- `hierarchical`
- `tree`
- `circular`
- `radial`
- `force`
- `grid`
- `orthogonal`
- `manual`

## Themes

Pass `theme="..."` attribute:
- `light`
- `dark`
- `custom:neo`
- `custom:night`
