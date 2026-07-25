# Zolto Native Diagram & Graph Engine Guide — Phase 5

Zolto Phase 5 introduces a high-performance, deterministic native diagram engine embedded directly inside `.zl` documents using the `@diagram` block directive.

## 1. Quick Start

```zl
@diagram flowchart id="auth-flow" theme="dark" layout="hierarchical" aria="Authentication flow"
  Start [label="Start", shape="circle"]
  Login [label="Login", shape="rect", style="primary"]
  Dashboard [label="Dashboard", shape="rect"]

  Start -> Login
  Login -> Dashboard
@/diagram
```

---

## 2. Supported Diagram Types (23 Types)

| Type | Directive | Default Layout | Description |
| :--- | :--- | :--- | :--- |
| Flowchart | `@diagram flowchart` | Hierarchical | Control flow & process diagrams |
| Sequence | `@diagram sequence` | Hierarchical | Message interaction between actors |
| State Machine | `@diagram state` | Hierarchical | State transitions (`[*] -> Idle`) |
| Entity Relationship | `@diagram er` | Hierarchical | ER database models (`||--o{`) |
| Mind Map | `@diagram mindmap` | Radial | Radial concept maps |
| Tree | `@diagram tree` | Tree | Hierarchical trees |
| Decision Tree | `@diagram decision` | Tree | Logic & decision branches |
| Org Chart | `@diagram org` | Tree | Organizational hierarchies |
| Class Diagram | `@diagram class` | Hierarchical | UML class declarations |
| Object Diagram | `@diagram object` | Hierarchical | Object instance diagrams |
| Package Diagram | `@diagram package` | Grid | Code package dependencies |
| Component Diagram | `@diagram component` | Grid | System component architecture |
| Deployment Diagram | `@diagram deployment` | Grid | Infrastructure deployment nodes |
| Use Case Diagram | `@diagram usecase` | Radial | Actor use case diagrams |
| Activity Diagram | `@diagram activity` | Hierarchical | Workflow activities |
| Network Diagram | `@diagram network` | Force | Network topologies |
| Dependency Graph | `@diagram dependency` | Hierarchical | Package & module dependencies |
| File System | `@diagram filesystem` | Tree | File directory graphs |
| Git Graph | `@diagram git` | Hierarchical | Branch & commit trees |
| Timeline | `@diagram timeline` | Grid | Chronological milestone timelines |
| Gantt | `@diagram gantt` | Grid | Project scheduling & task bars |
| Sankey | `@diagram sankey` | Grid | Flow & volume transitions |
| Journey Map | `@diagram journey` | Grid | User journey experiences |

---

## 3. Graph Language Syntax

### Node Declarations

Explicit:
```zl
node pay.start [label="Start", shape="circle", fill="#1e293b", stroke="#38bdf8"]
```

Shorthand (Auto-created):
```zl
Start -> Login
```

### Subgraphs, Groups, and Clusters

```zl
group payment.group [label="Payment Stage"]
  pay.form
  pay.verify
@/group

cluster backend.cluster [label="Backend"]
  node api.auth [label="Auth API"]
  node api.pay  [label="Payment API"]
@/cluster
```

### Cross References

```zl
ref DB as database.main
```

---

## 4. Layout Algorithms

Pass `layout="..."` in directive header:
- `hierarchical`: Layered Sugiyama topological layout.
- `tree`: Reingold-Tilford hierarchy layout.
- `circular`: Perimeter circle layout.
- `radial`: Concentric ring layout.
- `force`: Deterministic spring-embedder layout.
- `grid`: Matrix grid placement.
- `orthogonal`: Right-angle Manhattan edge connectors.
- `manual`: Explicit `x`, `y`, `width`, `height` placement.

---

## 5. Styling & Themes

Supported themes:
- `theme="light"` (default clean light)
- `theme="dark"` (sleek dark mode)
- `theme="custom:neo"` (vibrant neon dark)
- `theme="custom:night"` (deep purple night)

Node Shapes:
`rect`, `circle`, `diamond`, `round-rect`, `hexagon`, `pill`, `actor`
