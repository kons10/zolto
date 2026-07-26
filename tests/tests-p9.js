/**
 * Zolto Phase 9 Test Suite — Component, Template & Macro System
 */

import { parseComponent, renderComponent, validateComponent, ComponentRegistry } from '../src/zolto.js';
import { parseComponentSource } from '../src/component/parser.js';
import { renderComponentNode } from '../src/component/renderer.js';
import { validateAndBindProps, parsePropDeclaration } from '../src/component/props.js';
import { resolveSlots } from '../src/component/slots.js';
import { expandMacro } from '../src/component/macros.js';

export function runPhase9Tests() {
  let passed = 0;
  let failed = 0;
  const results = [];

  function assert(desc, condition) {
    if (condition) {
      passed++;
      results.push({ desc, pass: true });
    } else {
      failed++;
      results.push({ desc, pass: false });
      console.error(`FAIL: ${desc}`);
    }
  }

  function contains(actual, expected) {
    return String(actual || '').includes(expected);
  }

  // 1. Basic Component Definition & Usage
  const registry = new ComponentRegistry();
  const src1 = `
component Card(title, subtitle="", variant="default")
card variant=variant
### {title}
{subtitle}
slot
end
end

Card(title="Welcome", subtitle="Hello World", variant="primary")
This is the body.
end
`;
  const { nodes } = parseComponent(src1, { registry });
  assert('Parses component definition and invocation nodes', nodes.length === 2);

  const cardUseNode = nodes[1];
  const rendered1 = renderComponent(cardUseNode, {}, registry);
  assert('Renders component title', contains(rendered1, 'Welcome'));
  assert('Renders component subtitle', contains(rendered1, 'Hello World'));

  // 2. Typed & Required Props
  const declReq = parsePropDeclaration('text! : string');
  assert('Parses required prop flag !', declReq.required && declReq.name === 'text');

  const declEnum = parsePropDeclaration('tone : enum(info, warning, success)=info');
  assert('Parses enum prop choices', declEnum.type === 'enum' && declEnum.enumValues.includes('warning'));

  const bound = validateAndBindProps([declReq, declEnum], { text: 'Hello', tone: 'warning' });
  assert('Binds typed prop values', bound.text === 'Hello' && bound.tone === 'warning');

  // 3. Named Slots & Fallbacks
  const slotDefs = [
    { name: 'header', fallback: ['Default Header'] },
    { name: 'default', fallback: [] },
  ];
  const resolved1 = resolveSlots(slotDefs, { header: ['Custom Header'] }, []);
  assert('Resolves explicit slot content', resolved1.header[0] === 'Custom Header');

  const resolvedFallback = resolveSlots(slotDefs, {}, []);
  assert('Resolves slot fallback content', resolvedFallback.header[0] === 'Default Header');

  // 4. Template & Inheritance
  const srcTpl = `
template Dashboard()
slot header
end
slot body
end
end

template SalesDashboard extends Dashboard
fill header
# Sales Dashboard
end
fill body
Sales content
end
end
`;
  parseComponent(srcTpl, { registry });
  assert('Registers base and inherited templates in registry', registry.hasTemplate('Dashboard') && registry.hasTemplate('SalesDashboard'));

  // 5. Macros & Expansion
  const srcMacro = `
macro note(text)
info
{text}
end
end
`;
  const { nodes: macroNodes } = parseComponent(srcMacro, { registry });
  const macroDef = registry.getMacro('note');
  assert('Registers macro definition', !!macroDef);

  const expandedMacro = expandMacro(macroDef, ['This is a test note.']);
  assert('Expands parameterized macro text', contains(expandedMacro, 'This is a test note.'));

  // 6. Conditionals
  const condNode = {
    type: 'conditional_block',
    branches: [{ condition: 'featured', body: ['Featured Badge'] }],
    elseBranch: ['Standard Badge'],
  };
  const condRendered1 = renderComponentNode(condNode, { featured: true }, registry);
  assert('Evaluates true condition branch', contains(condRendered1, 'Featured Badge'));

  const condRendered2 = renderComponentNode(condNode, { featured: false }, registry);
  assert('Evaluates else condition branch', contains(condRendered2, 'Standard Badge'));

  // 7. Loops
  const loopNode = {
    type: 'loop_block',
    iterable: 'users',
    itemVar: 'user',
    indexVar: 'idx',
    body: ['User: {user.name} ({idx})'],
  };
  const loopRendered = renderComponentNode(loopNode, {
    users: [{ name: 'Alice' }, { name: 'Bob' }],
  }, registry);
  assert('Renders iterated items with indexing', contains(loopRendered, 'User: Alice (0)') && contains(loopRendered, 'User: Bob (1)'));

  // 8. Built-in Patterns
  const statCardDef = registry.getComponent('StatCard');
  assert('Registers built-in StatCard component', !!statCardDef);

  const statNode = {
    type: 'component_use',
    name: 'StatCard',
    props: { title: 'Total Revenue', value: '$100,000', change: '+12%', trend: 'positive' },
  };
  const statHtml = renderComponent(statNode, {}, registry);
  assert('Renders StatCard built-in pattern', contains(statHtml, 'Total Revenue') && contains(statHtml, '$100,000'));

  // 9. Validation & Diagnostics
  const invalidUse = [{ type: 'component_use', name: 'UnknownWidget', props: {} }];
  const diagnostics = validateComponent(invalidUse, registry);
  assert('Detects unknown component error', diagnostics.errors.length > 0);

  // 10. Performance Stress Benchmark
  const t0 = Date.now();
  for (let i = 0; i < 1000; i++) {
    renderComponent(statNode, {}, registry);
  }
  const duration = Date.now() - t0;
  assert('Renders 1,000 components in under 500ms', duration < 500);

  return { passed, failed, total: passed + failed, results };
}
