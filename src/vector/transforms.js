/**
 * Zolto Vector Transform Engine — Phase 7
 *
 * Parses and composes SVG transformation attributes:
 * translate, rotate, scale, skew, mirror, origin, matrix.
 */

export function buildTransformString(node) {
  const parts = [];

  if (node.transform) {
    parts.push(node.transform);
  }

  if (node.translate) {
    const val = String(node.translate).replace(/,/g, ' ');
    parts.push(`translate(${val})`);
  }

  if (node.rotate !== null && node.rotate !== undefined) {
    if (node.origin) {
      const orig = String(node.origin).replace(/,/g, ' ');
      parts.push(`rotate(${node.rotate} ${orig})`);
    } else {
      parts.push(`rotate(${node.rotate})`);
    }
  }

  if (node.scale) {
    const val = String(node.scale).replace(/,/g, ' ');
    parts.push(`scale(${val})`);
  }

  if (node.skew) {
    const val = String(node.skew).replace(/,/g, ' ');
    parts.push(`skewX(${val})`);
  }

  if (node.mirror) {
    const axis = String(node.mirror).toLowerCase();
    if (axis === 'x') parts.push('scale(-1, 1)');
    else if (axis === 'y') parts.push('scale(1, -1)');
    else if (axis === 'xy' || axis === 'both') parts.push('scale(-1, -1)');
  }

  return parts.length ? parts.join(' ') : null;
}
