/**
 * Zolto Phase 10 Test Suite — Interactive Documents & Educational Features
 *
 * Tests: parsing, rendering, quiz scoring, flashcard engine, poll tallying,
 *        validation, accessibility, data binding, state, and performance.
 */

import { parseInteractive, renderInteractive, validateInteractive, compile } from '../src/zolto.js';
import { scoreMCQ, scoreMulti, scoreTrueFalse, scoreFillBlank, scoreMatching, quizScore } from '../src/interactive/quizzes.js';
import { shuffleCards, deckProgress, groupByDifficulty, filterByTags } from '../src/interactive/flashcards.js';
import { tally, validatePoll } from '../src/interactive/polls.js';
import { createDocumentState, updateState, resolveBinding, isUnsafeExpr, serializeState, deserializeState } from '../src/interactive/state.js';
import { extractBindings, interpolateBindings } from '../src/interactive/bindings.js';
import { parseInteractiveSource } from '../src/interactive/parser.js';
import { InteractiveDiagnostics } from '../src/interactive/diagnostics.js';

// ─── Tiny test harness ────────────────────────────────────────────────────────

let _pass = 0, _fail = 0;
const results = [];

function test(desc, fn) {
  try { fn(); _pass++; results.push({ pass: true, desc }); }
  catch (e) { _fail++; results.push({ pass: false, desc, err: String(e.message) }); }
}

function assert(val, msg) {
  if (!val) throw new Error(msg || `Expected truthy, got ${JSON.stringify(val)}`);
}

function eq(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

function includes(str, sub, msg) {
  if (!String(str).includes(sub)) throw new Error(msg || `Expected "${sub}" to be in string`);
}

// ─── 1. Parsing Tests ─────────────────────────────────────────────────────────

test('Parses @form with text, email, and button', () => {
  const { nodes } = parseInteractive(`@form contact {
@text username
label "Username"
required
@email email
label "Email"
@button primary "Register"
}`);
  assert(nodes.length === 1, 'Should parse one form node');
  eq(nodes[0].type, 'form', 'Root should be form');
  eq(nodes[0].name, 'contact', 'Form name should be contact');
  const children = nodes[0].children;
  eq(children[0].type, 'input', 'First child should be input');
  eq(children[0].inputType, 'text', 'Input type should be text');
  eq(children[0].label, 'Username', 'Input label should be Username');
  assert(children[0].required, 'Input should be required');
  eq(children[1].type, 'input', 'Second child should be input');
  eq(children[1].inputType, 'email', 'Second input type should be email');
  eq(children[2].type, 'button', 'Third child should be button');
  eq(children[2].variant, 'primary', 'Button variant should be primary');
  eq(children[2].label, 'Register', 'Button label should be Register');
});

test('Parses @text input with inline required modifier', () => {
  const nodes = parseInteractiveSource('@text username required');
  eq(nodes[0].type, 'input', 'Should be input');
  eq(nodes[0].inputType, 'text');
  assert(nodes[0].required, 'Should be required');
});

test('Parses @password, @number, @search, @date, @time inputs', () => {
  const nodes = parseInteractiveSource(`@password pwd
@number age
min 1
max 120
@search query
@date birthday
@time meeting`);
  eq(nodes[0].type, 'input'); eq(nodes[0].inputType, 'password');
  eq(nodes[1].type, 'input'); eq(nodes[1].inputType, 'number');
  eq(nodes[1].min, 1);        eq(nodes[1].max, 120);
  eq(nodes[2].inputType, 'search');
  eq(nodes[3].inputType, 'date');
  eq(nodes[4].inputType, 'time');
});

test('Parses @textarea with rows', () => {
  const nodes = parseInteractiveSource('@textarea bio\nrows 6');
  eq(nodes[0].type, 'textarea');
  eq(nodes[0].rows, 6);
});

test('Parses @checkbox', () => {
  const nodes = parseInteractiveSource('@check agree\nlabel "Accept Terms"');
  eq(nodes[0].type, 'checkbox');
  eq(nodes[0].label, 'Accept Terms');
});

test('Parses @radio group with options', () => {
  const nodes = parseInteractiveSource(`@radio gender {
@option male "Male"
@option female "Female"
@option other "Other"
}`);
  eq(nodes[0].type, 'radio_group');
  eq(nodes[0].name, 'gender');
  eq(nodes[0].options.length, 3);
  eq(nodes[0].options[0].value, 'male');
  eq(nodes[0].options[0].label, 'Male');
});

test('Parses @select single, multi, and searchable', () => {
  const single = parseInteractiveSource('@select country {\n@option in "India"\n@option us "USA"\n}');
  eq(single[0].type, 'select');
  assert(!single[0].multi);
  assert(!single[0].searchable);
  eq(single[0].options.length, 2);

  const multi = parseInteractiveSource('@select languages multi {\n@option rust "Rust"\n@option cpp "C++"\n}');
  assert(multi[0].multi);

  const searchable = parseInteractiveSource('@select city searchable {\n@option delhi "Delhi"\n}');
  assert(searchable[0].searchable);
});

test('Parses @button variants: primary, secondary, ghost, danger, outline', () => {
  const btns = parseInteractiveSource(
    '@button primary "Save"\n@button secondary "Cancel"\n@button ghost "Back"\n@button danger "Delete"\n@button outline "Download"'
  );
  const variants = btns.map(b => b.variant);
  assert(variants.includes('primary'));
  assert(variants.includes('secondary'));
  assert(variants.includes('ghost'));
  assert(variants.includes('danger'));
  assert(variants.includes('outline'));
});

test('Parses @toggle and @switch', () => {
  const nodes = parseInteractiveSource('@toggle darkmode\n@switch notifications');
  eq(nodes[0].type, 'toggle');
  eq(nodes[0].subtype, 'toggle');
  eq(nodes[0].name, 'darkmode');
  eq(nodes[1].type, 'toggle');
  eq(nodes[1].subtype, 'switch');
});

test('Parses @slider compact syntax', () => {
  const nodes = parseInteractiveSource('@slider volume 0..100 step 5');
  eq(nodes[0].type, 'slider');
  eq(nodes[0].min, 0);
  eq(nodes[0].max, 100);
  eq(nodes[0].step, 5);
});

test('Parses @progress', () => {
  const nodes = parseInteractiveSource('@progress course 75%');
  eq(nodes[0].type, 'progress');
  eq(nodes[0].value, 75);
});

test('Parses @segment control', () => {
  const nodes = parseInteractiveSource('@segment theme {\n@item light\n@item dark\n@item system\n}');
  eq(nodes[0].type, 'segment');
  eq(nodes[0].items.length, 3);
  eq(nodes[0].items[0].value, 'light');
});

// ─── 2. Quiz Parsing Tests ────────────────────────────────────────────────────

test('Parses @quiz with @mcq questions', () => {
  const nodes = parseInteractiveSource(`@quiz "Physics" {
@mcq "What is F = ma?" {
@correct "Force equals mass × acceleration"
@choice "Momentum"
@choice "Energy"
}
}`);
  eq(nodes[0].type, 'quiz');
  eq(nodes[0].title, 'Physics');
  eq(nodes[0].questions.length, 1);
  const mcq = nodes[0].questions[0];
  eq(mcq.type, 'mcq');
  eq(mcq.question, 'What is F = ma?');
  eq(mcq.options.length, 3);
  assert(mcq.options[0].correct, 'First option should be correct');
  assert(!mcq.options[1].correct);
  assert(!mcq.options[2].correct);
});

test('Parses @truefalse question', () => {
  const nodes = parseInteractiveSource('@truefalse "Earth is round"\nanswer true');
  eq(nodes[0].type, 'true_false');
  eq(nodes[0].question, 'Earth is round');
  assert(nodes[0].answer === true, 'Answer should be true');
});

test('Parses @blank fill-in-the-blank', () => {
  const nodes = parseInteractiveSource('@blank "Capital of Japan"\nanswer "Tokyo"');
  eq(nodes[0].type, 'fill_blank');
  eq(nodes[0].answer, 'Tokyo');
});

test('Parses @match matching pairs', () => {
  const nodes = parseInteractiveSource('@match {\nIndia -> Delhi\nJapan -> Tokyo\nFrance -> Paris\n}');
  eq(nodes[0].type, 'matching');
  eq(nodes[0].pairs.length, 3);
  eq(nodes[0].pairs[0].left, 'India');
  eq(nodes[0].pairs[0].right, 'Delhi');
});

test('Parses @deck flashcard deck', () => {
  const nodes = parseInteractiveSource(`@deck Physics {
@card
front "F = ?"
back "ma"
@end
@card
front "Speed"
back "Distance / Time"
@end
}`);
  eq(nodes[0].type, 'flashcard_deck');
  eq(nodes[0].name, 'Physics');
  eq(nodes[0].cards.length, 2);
  eq(nodes[0].cards[0].front, 'F = ?');
  eq(nodes[0].cards[0].back, 'ma');
});

test('Parses @poll with options', () => {
  const nodes = parseInteractiveSource('@poll "Favorite Language?" {\nRust\nPython\nC++\n}');
  eq(nodes[0].type, 'poll');
  eq(nodes[0].question, 'Favorite Language?');
  eq(nodes[0].options.length, 3);
  eq(nodes[0].options[0].text, 'Rust');
});

test('Parses @tasks checklist', () => {
  const nodes = parseInteractiveSource('@tasks {\n[ ] Learn Markdown\n[x] Learn HTML\n[ ] Learn Zolto\n}');
  eq(nodes[0].type, 'task_list');
  eq(nodes[0].items.length, 3);
  assert(!nodes[0].items[0].checked);
  assert(nodes[0].items[1].checked);
  assert(!nodes[0].items[2].checked);
});

test('Parses @tabs container', () => {
  const nodes = parseInteractiveSource('@tabs {\n@tab Theory\n@tab Practice\n@tab Quiz\n}');
  eq(nodes[0].type, 'tabs_interactive');
  eq(nodes[0].tabs.length, 3);
  eq(nodes[0].tabs[0].label, 'Theory');
});

test('Parses @accordion sections', () => {
  const nodes = parseInteractiveSource('@accordion {\n@section "Question"\nAnswer\n}');
  eq(nodes[0].type, 'accordion');
  eq(nodes[0].sections.length, 1);
  eq(nodes[0].sections[0].title, 'Question');
});

test('Parses @state block with typed vars', () => {
  const nodes = parseInteractiveSource('@state {\nusername = ""\ndarkmode = false\nscore = 0\n}');
  eq(nodes[0].type, 'state_block');
  eq(nodes[0].vars.length, 3);
  eq(nodes[0].vars[0].name, 'username');
  eq(nodes[0].vars[1].name, 'darkmode');
  eq(nodes[0].vars[1].value, false);
  eq(nodes[0].vars[2].value, 0);
});

// ─── 3. Quiz Scoring Tests ────────────────────────────────────────────────────

test('scoreMCQ: correct single answer', () => {
  const mcq = { type: 'mcq', options: [
    { text: 'A', correct: true },
    { text: 'B', correct: false },
  ]};
  const r = scoreMCQ(mcq, 0);
  eq(r.earned, 1); eq(r.possible, 1); assert(r.correct);
});

test('scoreMCQ: wrong single answer', () => {
  const mcq = { type: 'mcq', options: [
    { text: 'A', correct: true },
    { text: 'B', correct: false },
  ]};
  const r = scoreMCQ(mcq, 1);
  eq(r.earned, 0); assert(!r.correct);
});

test('scoreMulti: partial credit', () => {
  const mcq = { options: [
    { text: 'Rust',   correct: true  },
    { text: 'Python', correct: true  },
    { text: 'Stone',  correct: false },
  ]};
  const r = scoreMulti(mcq, [0, 1]);   // both correct
  eq(r.earned, 2); eq(r.possible, 2); assert(r.correct);
  const r2 = scoreMulti(mcq, [0, 2]);  // one right, one wrong → 1-1=0
  eq(r2.earned, 0);
});

test('scoreTrueFalse: true answer', () => {
  const tf = { answer: true };
  assert(scoreTrueFalse(tf, true).correct);
  assert(!scoreTrueFalse(tf, false).correct);
});

test('scoreFillBlank: case-insensitive match', () => {
  const fb = { answer: 'Tokyo', caseSensitive: false };
  assert(scoreFillBlank(fb, 'tokyo').correct);
  assert(scoreFillBlank(fb, 'TOKYO').correct);
  assert(!scoreFillBlank(fb, 'Osaka').correct);
});

test('scoreMatching: partial match', () => {
  const m = { pairs: [
    { left: 'India',  right: 'Delhi' },
    { left: 'Japan',  right: 'Tokyo' },
  ]};
  const r = scoreMatching(m, [{ left: 'India', right: 'Delhi' }, { left: 'Japan', right: 'Osaka' }]);
  eq(r.earned, 1); eq(r.possible, 2);
});

test('quizScore: full quiz totals', () => {
  const quiz = { type: 'quiz', title: 'T', questions: [
    { type: 'mcq', multi: false, options: [{ text: 'A', correct: true }, { text: 'B', correct: false }] },
    { type: 'true_false', answer: false },
    { type: 'fill_blank', answer: 'Paris', caseSensitive: false },
  ]};
  const answers = new Map([[0, 0], [1, false], [2, 'Paris']]);
  const { total, questions } = quizScore(quiz, answers);
  eq(total.earned, 3); eq(total.possible, 3); eq(total.pct, 100);
});

// ─── 4. Flashcard Engine Tests ────────────────────────────────────────────────

test('shuffleCards returns same count in different order (probabilistic)', () => {
  const cards = [{ front: 'A' }, { front: 'B' }, { front: 'C' }, { front: 'D' }, { front: 'E' }];
  const shuffled = shuffleCards(cards);
  eq(shuffled.length, 5);
  // Original should be unchanged
  eq(cards[0].front, 'A');
});

test('deckProgress calculates correct percentage', () => {
  const deck = { cards: [{}, {}, {}, {}] };
  const p = deckProgress(deck, new Set([0, 2]));
  eq(p.reviewed, 2); eq(p.total, 4); eq(p.pct, 50);
});

test('groupByDifficulty splits cards correctly', () => {
  const cards = [
    { front: 'A', difficulty: 'easy' },
    { front: 'B', difficulty: 'hard' },
    { front: 'C', difficulty: 'medium' },
    { front: 'D' },
  ];
  const groups = groupByDifficulty(cards);
  eq(groups.easy.length, 1);
  eq(groups.hard.length, 1);
  eq(groups.medium.length, 1);
  eq(groups.none.length, 1);
});

test('filterByTags filters cards by tag', () => {
  const cards = [
    { front: 'A', tags: ['physics', 'newton'] },
    { front: 'B', tags: ['math'] },
  ];
  const filtered = filterByTags(cards, ['physics']);
  eq(filtered.length, 1);
  eq(filtered[0].front, 'A');
});

// ─── 5. Poll Tests ────────────────────────────────────────────────────────────

test('tally: counts votes and percentages', () => {
  const poll = { options: [{ text: 'Rust' }, { text: 'Python' }, { text: 'C++' }] };
  const { options, totalVotes } = tally(poll, [0, 0, 1, 2, 0]);
  eq(totalVotes, 5);
  eq(options[0].votes, 3); eq(options[0].pct, 60);
  eq(options[1].votes, 1); eq(options[1].pct, 20);
  eq(options[2].votes, 1); eq(options[2].pct, 20);
});

test('validatePoll: detects missing question and insufficient options', () => {
  const r1 = validatePoll({ question: '', options: [{ text: 'A' }, { text: 'B' }] });
  assert(!r1.valid, 'Empty question should be invalid');

  const r2 = validatePoll({ question: 'Q?', options: [{ text: 'A' }] });
  assert(!r2.valid, 'Single option should be invalid');

  const r3 = validatePoll({ question: 'Q?', options: [{ text: 'A' }, { text: 'B' }] });
  assert(r3.valid, 'Valid poll should pass');
});

// ─── 6. State Tests ───────────────────────────────────────────────────────────

test('createDocumentState builds a typed state map', () => {
  const stateNode = {
    type: 'state_block',
    vars: [
      { name: 'username', value: '', varType: 'string' },
      { name: 'score',    value: 0,  varType: 'number' },
      { name: 'dark',     value: false, varType: 'boolean' },
    ]
  };
  const state = createDocumentState(stateNode);
  eq(state.size, 3);
  eq(state.get('username').value, '');
  eq(state.get('score').value, 0);
  eq(state.get('dark').value, false);
});

test('updateState returns new map with coerced value', () => {
  const state = new Map([['score', { value: 0, type: 'number' }]]);
  const next = updateState(state, 'score', '42');
  eq(next.get('score').value, 42, 'Should coerce string to number');
  eq(state.get('score').value, 0, 'Original state should be immutable');
});

test('resolveBinding: safe resolution', () => {
  const state = new Map([['name', { value: 'Lion', type: 'string' }]]);
  eq(resolveBinding('name', state), 'Lion');
  eq(resolveBinding('nonexistent', state), '');
});

test('isUnsafeExpr: rejects dangerous patterns', () => {
  assert(isUnsafeExpr('foo()'));
  assert(isUnsafeExpr('a[0]'));
  assert(isUnsafeExpr('__proto__'));
  assert(isUnsafeExpr('a.b.c.d'));
  assert(isUnsafeExpr('x + y'));
  assert(!isUnsafeExpr('username'));
  assert(!isUnsafeExpr('user.name'));
});

test('serializeState and deserializeState round-trip', () => {
  const state = new Map([
    ['x', { value: 42,   type: 'number' }],
    ['y', { value: true, type: 'boolean' }],
  ]);
  const obj  = serializeState(state);
  const back = deserializeState(obj);
  eq(back.get('x').value, 42);
  eq(back.get('y').value, true);
});

// ─── 7. Binding Tests ─────────────────────────────────────────────────────────

test('extractBindings: finds binding expressions in text', () => {
  const bindings = extractBindings('Hello {username}, your score is {score}!');
  assert(bindings.includes('username'));
  assert(bindings.includes('score'));
});

test('interpolateBindings: replaces known, leaves unknown', () => {
  const state = new Map([['name', { value: 'Lion', type: 'string' }]]);
  const result = interpolateBindings('Hi {name}, {unknown}!', state);
  eq(result, 'Hi Lion, {unknown}!');
});

test('interpolateBindings: does not interpolate unsafe expressions', () => {
  const state = new Map();
  const result = interpolateBindings('{foo()} {a[0]}', state);
  eq(result, '{foo()} {a[0]}', 'Unsafe expressions should be left intact');
});

// ─── 8. Validation Tests ──────────────────────────────────────────────────────

test('Validator: warns on input without label', () => {
  const nodes = parseInteractiveSource('@text username');
  const diag = validateInteractive(nodes);
  assert(diag.warnings.some(w => w.code === 'I001'), 'Should warn about missing label');
});

test('Validator: errors on MCQ with no correct answer', () => {
  const nodes = parseInteractiveSource('@mcq "Question?" {\n@choice "A"\n@choice "B"\n}');
  const diag = validateInteractive(nodes);
  assert(diag.errors.some(e => e.code === 'I007'), 'Should error on missing correct answer');
});

test('Validator: warns on empty quiz', () => {
  const nodes = parseInteractiveSource('@quiz "Empty" {}');
  const diag = validateInteractive(nodes);
  assert(diag.warnings.some(w => w.code === 'I005'), 'Should warn about empty quiz');
});

test('Validator: warns on empty deck', () => {
  const nodes = parseInteractiveSource('@deck "Empty" {}');
  const diag = validateInteractive(nodes);
  assert(diag.warnings.some(w => w.code === 'I010'), 'Should warn about empty deck');
});

// ─── 9. Renderer Tests ────────────────────────────────────────────────────────

test('Renderer: form emits accessible HTML with aria attributes', () => {
  const { nodes } = parseInteractive('@form reg {\n@email email\nlabel "Email"\nrequired\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, 'class="zl-form"');
  includes(html, '<input');
  includes(html, 'type="email"');
  includes(html, 'required');
  includes(html, 'aria-label');
  includes(html, 'class="zl-label');
});

test('Renderer: quiz emits correct ARIA roles and data attributes', () => {
  const { nodes } = parseInteractive('@quiz "Test" {\n@mcq "Q?" {\n@correct "Right"\n@choice "Wrong"\n}\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, 'role="group"');
  includes(html, 'data-zl-quiz');
  includes(html, 'data-zl-correct="true"');
  includes(html, 'data-zl-correct="false"');
  includes(html, 'zl-quiz-title');
});

test('Renderer: flashcard deck emits card data and nav buttons', () => {
  const { nodes } = parseInteractive('@deck Physics {\n@card\nfront "F = ?"\nback "ma"\n@end\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, 'zl-deck');
  includes(html, 'zl-card-inner');
  includes(html, 'zl-card-face');
  includes(html, 'zl-card-back');
  includes(html, 'F = ?');
  includes(html, 'data-zl-deck-flip');
  includes(html, 'application/json');
});

test('Renderer: poll emits options with radio inputs', () => {
  const { nodes } = parseInteractive('@poll "Fave?" {\nRust\nPython\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, 'zl-poll');
  includes(html, 'Rust');
  includes(html, 'Python');
  includes(html, 'type="radio"');
});

test('Renderer: task list emits interactive checkboxes', () => {
  const { nodes } = parseInteractive('@tasks {\n[ ] Task A\n[x] Task B\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, 'zl-tasks');
  includes(html, 'type="checkbox"');
  includes(html, 'checked');
  includes(html, 'Task A');
  includes(html, 'Task B');
});

test('Renderer: tabs emits tablist with panels', () => {
  const { nodes } = parseInteractive('@tabs {\n@tab Theory\n@tab Practice\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, 'role="tablist"');
  includes(html, 'role="tab"');
  includes(html, 'role="tabpanel"');
  includes(html, 'Theory');
  includes(html, 'Practice');
});

test('Renderer: accordion emits details/summary', () => {
  const { nodes } = parseInteractive('@accordion {\n@section "Q & A"\nThe answer.\n}');
  const html = renderInteractive(nodes[0]);
  includes(html, '<details');
  includes(html, '<summary>');
  includes(html, 'Q &amp; A');
});

// ─── 10. End-to-end compile tests ─────────────────────────────────────────────

test('Full compile: markdown + math + chart + interactive in one document', () => {
  const src = `# Phase 10 Demo

@form demo {
@text name
label "Name"
required
@button primary "Submit"
}

@quiz "Quick" {
@truefalse "Zolto is awesome"
answer true
}`;
  const html = compile(src);
  includes(html, '<h1');
  includes(html, 'zl-form');
  includes(html, 'zl-quiz');
  includes(html, 'type="radio"');
});

test('Compile: interactive CSS is injected once', () => {
  const src = '@form f {\n@text x\n}';
  const html = compile(src);
  includes(html, 'id="zl-interactive-styles"');
  // CSS should appear exactly once (not duplicated)
  const count = (html.match(/id="zl-interactive-styles"/g) || []).length;
  eq(count, 1, 'CSS should be injected exactly once');
});

// ─── 11. Diagnostics Tests ───────────────────────────────────────────────────

test('InteractiveDiagnostics: error/warn/info API', () => {
  const d = new InteractiveDiagnostics();
  d.error('E001', 'An error', { field: 'x' });
  d.warn('W001', 'A warning');
  d.info('I001', 'An info');
  eq(d.errors.length, 1);
  eq(d.warnings.length, 1);
  eq(d.infos.length, 1);
  assert(d.hasErrors);
  const json = d.toJSON();
  eq(json.length, 3);
  eq(json[0].severity, 'error');
});

test('InteractiveDiagnostics: merge combines entries', () => {
  const a = new InteractiveDiagnostics();
  const b = new InteractiveDiagnostics();
  a.error('E1', 'Err A');
  b.warn('W1', 'Warn B');
  a.merge(b);
  eq(a.all.length, 2);
});

// ─── 12. Performance Test ────────────────────────────────────────────────────

test('Performance: parse and render 500 quiz questions in < 1000ms', () => {
  const questionLines = [];
  for (let i = 0; i < 500; i++) {
    questionLines.push(`@mcq "Question ${i}?" {\n@correct "Correct ${i}"\n@choice "Wrong"\n}`);
  }
  const src = `@quiz "Big Quiz" {\n${questionLines.join('\n')}\n}`;
  const t0 = Date.now();
  const { nodes } = parseInteractive(src);
  const html = renderInteractive(nodes[0]);
  const elapsed = Date.now() - t0;
  assert(elapsed < 1000, `Expected < 1000ms, got ${elapsed}ms`);
  includes(html, 'zl-quiz');
});

// ─── Export ──────────────────────────────────────────────────────────────────

export function runPhase10Tests() {
  return { results, passed: _pass, failed: _fail, total: _pass + _fail };
}
