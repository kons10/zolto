# Writing Tests

## Test file locations

| What | Where |
| :--- | :---- |
| Fixture-based snapshot tests | `tests/fixtures.js` + `tests/tests.js` |
| Unit tests for src/ modules | `tests/tests.js` (dedicated suites) |
| Unit tests for js/ modules | `tests/unit/**/*.test.js` |
| Integration tests | `tests/integration/*.test.js` |
| e2e tests | `tests/e2e/*.spec.js` (Phase 4, Playwright) |

## Adding a fixture test

In `tests/fixtures.js`, add to the appropriate export array:

```javascript
export const calloutFixtures = [
  // ...
  {
    description: 'My new callout type',
    input: '> [!SUCCESS]\n> All done.',
    contains: ['zl-callout-success', 'All done.'],
    notContains: ['zl-callout-note'],
  },
];
```

The `fixturesSuite()` runner in `tests/tests.js` picks it up automatically.

## Adding a unit test

In `tests/tests.js`, inside the relevant suite function:

```javascript
function calloutSuite() {
  const suite = createSuite('Callouts');

  suite.test('Custom title is rendered', () => {
    contains(compile('> [!NOTE] My Title\n> Body'), 'My Title');
  });

  return suite;
}
```

Add the suite to `runAllTests()`:

```javascript
export function runAllTests() {
  const suites = [
    // ...
    calloutSuite(),
  ];
  return runSuites(suites);
}
```

## Assertions

```javascript
import { assert, eq, contains, notContains, deepEq } from './runner.js';

assert(condition, 'optional message');
eq(actual, expected);
contains(html, 'substring');
notContains(html, 'substring');
deepEq(obj1, obj2);
```

## Negative tests (notContains)

Be especially careful with `notContains` — the logic is inverted.
Always test by hand first:

```javascript
const html = compile(input);
console.log(html); // confirm the substring is absent
notContains(html, 'unwanted-string');
```

## Running a single suite manually

```javascript
import { validatorSuite } from './tests/tests.js';
const { results } = validatorSuite().run();
results.filter(r => !r.pass).forEach(r => console.log(r));
```

## Test file locations by phase

| Phase | Test file |
| :--- | :--- |
| Phases 1–4 | `tests/tests.js`, `tests/tests-p1.js` – `tests/tests-p4.js` |
| Phase 5 (Diagrams) | `tests/tests-p5.js` |
| Phase 6 (Charts) | `tests/tests-p6.js` |
| Phase 7 (Vector) | `tests/tests-p7.js` |

Total: **601 tests** across all 7 completed phases.

## Testing chart edge cases

Always add tests for these chart edge cases when adding or modifying chart renderers:

```javascript
// 1. Negative values — no negative SVG height/width attributes
test('Bar chart: negative values produce no negative height attrs', () => {
  const h = compile('@chart bar\nlabels: A B C\ndata: -10 -20 -5\n@/chart');
  const heights = [...h.matchAll(/height="(-?\d+(?:\.\d+)?)"/g)].map(m => parseFloat(m[1]));
  const bad = heights.filter(v => v < 0);
  assert(bad.length === 0, 'Found negative height attr: ' + bad.join(', '));
});

// 2. All-zero data — no divide-by-zero crash
test('Pie chart: all-zero data does not crash', () => {
  const h = compile('@chart pie\nlabels: A B C\ndata: 0 0 0\n@/chart');
  assert(typeof h === 'string', 'Should return a string');
});

// 3. NaN/null values — cleaned before computation
test('Line chart: NaN values are skipped', () => {
  const h = compile('@chart line\nlabels: A B C\ndata: 10 NaN 30\n@/chart');
  notContains(h, 'NaN');
});

// 4. Label count > data count — no orphan ticks
test('Line chart: more labels than data does not crash', () => {
  const h = compile('@chart line\nlabels: A B C D E\ndata: 10 20 30\n@/chart');
  contains(h, 'svg');
});

// 5. Gauge over 100 — clamped, no NaN/Infinity
test('Gauge: value over 100 is clamped', () => {
  const h = compile('@chart gauge\ndata: 150\n@/chart');
  notContains(h, 'NaN');
  notContains(h, 'Infinity');
});
```

## Testing SVG security (XSS escape)

Add tests to verify `escapeXml()` is applied to all user-provided content in SVG output:

```javascript
// 1. Diagram node label XSS
test('Diagram: XSS in node label is escaped', () => {
  const { ast } = parseDiagram('@diagram flowchart\nnode A [label="<script>alert(1)</script>"]\n@/diagram');
  const h = renderDiagram(ast);
  notContains(h, '<script>');
  contains(h, '&lt;script&gt;');
});

// 2. Chart label XSS
test('Chart: XSS in labels is escaped', () => {
  const h = compile('@chart bar\nlabels: <script>alert(1)</script>\ndata: 100\n@/chart');
  notContains(h, '<script>');
});

// 3. Vector text content XSS
test('Vector: XSS in text content is escaped', () => {
  const { ast } = parseVector('@vector\ntext x=0 y=0\n<script>alert(1)</script>\n@endtext\n@/vector');
  const h = renderVector(ast);
  notContains(h, '<script>');
});
```

*Version: 7.0.1*
