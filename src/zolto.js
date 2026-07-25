/**
 * Zolto — Public API
 * ════════════════════════════════════════════════════════════════════════════
 * Phase 5 · "Native Diagram & Graph Engine" — High-performance native diagrams,
 * deeply integrated with the Zolto AST foundation.
 *
 *   import { parse, render, compile } from './zolto.js';
 *
 *   const { ast, errors, warnings } = parse(src);
 *   const html = render(ast, { xhtml: false });
 *   const html2 = compile(src);   // parse + render in one call
 *
 * Backward compatible with Phase 1–4 API surface — every prior call site
 * continues to work unchanged.
 */

import { tokenize }      from './lexer.js';
import { parseTokens }   from './parser.js';
import { validate }      from './validator.js';
import { render as renderAst, renderInline, inlineToText } from './renderer.js';
import { Diagnostics }   from './diagnostics.js';
import { parseMath }               from './math-parser.js';
import { renderMathHTML, mathToPlainText } from './math-renderer.js';
import { renderMathML }            from './math-mathml.js';
import { parseDiagram }            from './diagram/parser.js';
import { renderDiagram }          from './diagram/renderer.js';
import { parseChart }            from './chart/parser.js';
import { renderChart }            from './chart/renderer.js';

export const VERSION = '6.0.0';
export const PHASE   = 6;

// ─── parse() ──────────────────────────────────────────────────────────────────

/**
 * Parse Zolto/Markdown source into an AST plus diagnostics.
 *
 * @param {string} src  Raw source text
 * @returns {{
 *   ast: DocumentNode,
 *   errors: string[],
 *   warnings: string[],
 *   diagnostics: Diagnostics
 * }}
 */
export function parse(src) {
  if (typeof src !== 'string') {
    throw new TypeError(`Zolto.parse: expected string, got ${typeof src}`);
  }

  const { tokens, errors: lexErrors } = tokenize(src);
  const ast = parseTokens(tokens);

  const { errors: valErrors, warnings, diagnostics } = validate(ast);

  const d = new Diagnostics();
  for (const e of lexErrors) d.error('E001', e.message, { line: e.line });
  d.merge(diagnostics);

  return {
    ast,
    errors:   [...lexErrors.map(e => `${e.message} (line ${e.line})`), ...valErrors],
    warnings,
    diagnostics: d,
  };
}

// ─── render() ─────────────────────────────────────────────────────────────────

/**
 * Render a Document AST to an HTML string.
 *
 * @param {DocumentNode} ast
 * @param {object}  [opts]
 * @param {boolean} [opts.xhtml=false]           Self-close void elements (<br />)
 * @param {boolean} [opts.footnoteSection=true]   Append <section class="zl-footnotes">
 * @returns {string}
 */
export function render(ast, opts = {}) {
  if (!ast || ast.type !== 'document') {
    throw new TypeError('Zolto.render: expected a Document AST node (ast.type === "document")');
  }
  return renderAst(ast, opts);
}

// ─── compile() ────────────────────────────────────────────────────────────────

/**
 * Parse + render in a single call.
 *
 * @param {string} src
 * @param {object} [opts]  Same options as render()
 * @returns {string} HTML
 */
export function compile(src, opts = {}) {
  const { ast } = parse(src);
  return render(ast, opts);
}

// ─── Utility re-exports ───────────────────────────────────────────────────────

export { renderInline, inlineToText };

export {
  parseMath as parseMathExpr,
  renderMathHTML as renderMathExpr,
  renderMathML as renderMathExprML,
  mathToPlainText,
};

export {
  parseDiagram,
  renderDiagram,
};

export {
  parseChart,
  renderChart,
};

/**
 * Library metadata banner.
 * @returns {string}
 */
export function about() {
  return `Zolto v${VERSION} · Phase ${PHASE} · Native Charts & Data Visualization Engine\n` +
         `  parse(src) → { ast, errors, warnings, diagnostics }\n` +
         `  render(ast, opts?) → html\n` +
         `  compile(src, opts?) → html\n` +
         `  parseDiagram(src, header) → { ast, diagnostics }\n` +
         `  renderDiagram(ast, opts?) → svg\n` +
         `  parseChart(src, header) → { ast, diagnostics }\n` +
         `  renderChart(ast, opts?) → svg`;
}
