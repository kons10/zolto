/**
 * Zolto Test Fixtures — Phase 5 Native Diagram & Graph Engine
 */

export const P5_FIXTURES = {
  flowchartBasic: `@diagram flowchart
Start -> Login
Login -> Dashboard
Dashboard -> Settings
@/diagram`,

  flowchartWithAttributes: `@diagram flowchart id="auth-flow" theme="dark" layout="hierarchical" aria="Authentication flow"
  Start [label="Start", shape="circle"]
  Login [label="Login", shape="rect", style="primary"]
  Dashboard [label="Dashboard", shape="rect"]
  Settings [label="Settings", shape="rect"]

  Start -> Login
  Login -> Dashboard
  Dashboard -> Settings
@/diagram`,

  groupsAndClusters: `@diagram flowchart id="payment-flow"
  node pay.start   [label="Start", shape="circle"]
  node pay.form    [label="Payment Form", shape="round-rect"]
  node pay.verify  [label="Verify", shape="diamond"]
  node pay.done    [label="Success", shape="circle"]

  edge pay.start -> pay.form
  edge pay.form  -> pay.verify [label="Submit"]
  edge pay.verify -> pay.done  [label="Approved"]

  group payment.group [label="Payment Stage"]
    pay.form
    pay.verify
  @/group

  cluster backend.cluster [label="Backend"]
    node api.auth [label="Auth API"]
    node api.pay  [label="Payment API"]
  @/cluster
@/diagram`,

  crossRefAndAutoNode: `@diagram dependency id="deps-1"
  UI -> Auth
  Auth -> DB
  UI -> Logger

  ref DB as database.main
  ref Logger as system.logger

  Auth -> database.main
  UI -> system.logger
@/diagram`,

  treeLayout: `@diagram tree id="site-map" layout="tree"
  Home -> Docs
  Home -> Blog
  Home -> About
@/diagram`,

  mindmapLayout: `@diagram mindmap id="ideas" layout="radial"
  Root -> UI
  Root -> Performance
  Root -> Security
  Root -> Docs
@/diagram`,

  networkLayout: `@diagram network id="infra" layout="force"
  Client -> Gateway
  Gateway -> API
  API -> DB
  API -> Cache
@/diagram`,

  stylingCustomTheme: `@diagram flowchart theme="custom:neo" layout="orthogonal"
  node Login [label="Login", shape="round-rect", fill="#1e293b", stroke="#38bdf8", radius=16]
  node Dashboard [label="Dashboard", fill="#0f172a", stroke="#22c55e", shadow=true]

  Login -> Dashboard [style="dashed", color="#94a3b8", arrow="filled"]
@/diagram`,

  animationPlaceholders: `@diagram flowchart id="animated-flow"
  Start -> Load [animate="fade"]
  Load -> Ready [animate="slide"]
@/diagram`,

  accessibilitySequence: `@diagram sequence id="login-seq" aria="Login sequence between user and server"
  actor User
  actor App
  actor Server

  User -> App: Enter credentials
  App -> Server: Authenticate
  Server -> App: Token
  App -> User: Success
@/diagram`,

  stateMachine: `@diagram state
  [*] -> Idle
  Idle -> Loading
  Loading -> Ready
  Ready -> Error
  Error -> Idle
@/diagram`,

  erDiagram: `@diagram er
  entity User
  entity Order
  entity Product

  User ||--o{ Order
  Order }o--|| Product
@/diagram`,

  classDiagram: `@diagram class
  class User {
    +id: string
    +name: string
    +login()
  }

  class Order {
    +id: string
    +total: number
  }

  User --> Order
@/diagram`,

  objectDiagram: `@diagram object
  object user1 : User {
    id = "u1"
    name = "Lion"
  }

  object order1 : Order {
    id = "o1"
    total = 499
  }

  user1 -> order1
@/diagram`,

  packageDiagram: `@diagram package
  package Core
  package UI
  package Docs

  UI -> Core
  Docs -> Core
@/diagram`,

  componentDiagram: `@diagram component
  component Renderer
  component Parser
  component Validator

  Parser -> Validator
  Validator -> Renderer
@/diagram`,

  deploymentDiagram: `@diagram deployment
  node Client
  node Server
  node DB

  Client -> Server
  Server -> DB
@/diagram`,

  usecaseDiagram: `@diagram usecase
  actor User
  actor Admin

  User -> "Login"
  User -> "View Dashboard"
  Admin -> "Manage Users"
@/diagram`,

  activityDiagram: `@diagram activity
  Start -> OpenApp
  OpenApp -> CheckAuth
  CheckAuth -> Dashboard [ok]
  CheckAuth -> Login [fail]
@/diagram`,

  filesystemDiagram: `@diagram filesystem
  / -> home
  / -> etc
  home -> user
  user -> docs
@/diagram`,

  gitDiagram: `@diagram git
  main -> feature-a
  feature-a -> commit-1
  feature-a -> commit-2
  commit-2 -> main [merge]
@/diagram`,

  timelineDiagram: `@diagram timeline
  2025-01 -> Phase 1
  2025-03 -> Phase 2
  2025-06 -> Phase 3
@/diagram`,

  ganttDiagram: `@diagram gantt
  TaskA [start="2025-01-01", end="2025-01-10"]
  TaskB [start="2025-01-08", end="2025-01-20"]
@/diagram`,

  sankeyDiagram: `@diagram sankey
  SourceA -> MidA [value=30]
  SourceA -> MidB [value=20]
  MidA -> Sink [value=25]
  MidB -> Sink [value=25]
@/diagram`,

  journeyMap: `@diagram journey
  Discover -> Consider
  Consider -> Purchase
  Purchase -> Support
@/diagram`,

  fullStartupExample: `@diagram flowchart id="app-startup" theme="custom:night" layout="hierarchical" aria="Application startup flow"
  node boot.start   [label="Boot", shape="circle"]
  node load.config  [label="Load Config", shape="round-rect"]
  node init.ui      [label="Init UI", shape="round-rect"]
  node ready        [label="Ready", shape="circle"]

  boot.start -> load.config [label="read"]
  load.config -> init.ui [label="apply theme"]
  init.ui -> ready [label="show window"]

  group startup.group [label="Startup"]
    boot.start
    load.config
    init.ui
  @/group
@/diagram`,
};
