/**
 * Zolto Vector SVG Builder & Accessible Element Generator — Phase 7
 *
 * Generates semantic, high-DPI, responsive SVG DOM markup for vector shapes,
 * text, images, icons, gradients, transforms, and scene graph containers.
 */

import { buildTransformString } from './transforms.js';
import { resolveColorToken } from './styles.js';

export function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderVectorSvgNode(node, themeName = 'dark', vectorId = 'v1') {
  if (!node || typeof node !== 'object') return '';

  const theme = themeName || 'dark';
  const transformAttr = buildTransformString(node);
  const tfStr = transformAttr ? `transform="${transformAttr}"` : '';
  const fill = resolveColorToken(node.fill, theme);
  const stroke = resolveColorToken(node.stroke, theme);
  const opacityAttr = (node.opacity !== undefined && node.opacity !== null && node.opacity !== 1) ? `opacity="${escapeXml(node.opacity)}"` : '';

  switch (node.type) {
    case 'vector_artboard':
    case 'vector_frame':
    case 'vector_layer':
    case 'vector_scene':
    case 'vector_group': {
      const childrenHtml = (node.children || []).map(c => renderVectorSvgNode(c, theme, vectorId)).join('\n');
      const idAttr = node.id ? `id="${escapeXml(node.id)}"` : '';
      return `<g ${idAttr} ${tfStr} ${opacityAttr}>${childrenHtml}</g>`;
    }

    case 'vector_shape': {
      return renderShapePrimitive(node, fill, stroke, tfStr, opacityAttr);
    }

    case 'vector_text': {
      const textFill = fill || resolveColorToken('$textPrimary', theme) || '#ffffff';
      const fontSize = node.fontSize || 14;
      const maxW = node.w || node.maxWidth;
      const shouldWrap = node.wrap || (maxW > 0);

      if (!shouldWrap || !maxW) {
        return `<text x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" fill="${textFill}" font-family="${escapeXml(node.fontFamily)}" font-size="${escapeXml(fontSize)}" font-weight="${escapeXml(node.fontWeight)}" text-anchor="${escapeXml(node.textAlign)}" ${tfStr} ${opacityAttr}>${escapeXml(node.content)}</text>`;
      }

      const lines = wrapVectorText(node.content, maxW, fontSize);
      if (lines.length <= 1) {
        return `<text x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" fill="${textFill}" font-family="${escapeXml(node.fontFamily)}" font-size="${escapeXml(fontSize)}" font-weight="${escapeXml(node.fontWeight)}" text-anchor="${escapeXml(node.textAlign)}" ${tfStr} ${opacityAttr}>${escapeXml(node.content)}</text>`;
      }

      const lineHeight = fontSize * (node.lineHeight || 1.3);
      const tspans = lines.map((l, i) =>
        `<tspan x="${escapeXml(node.x)}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`
      ).join('');

      return `<text x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" fill="${textFill}" font-family="${escapeXml(node.fontFamily)}" font-size="${escapeXml(fontSize)}" font-weight="${escapeXml(node.fontWeight)}" text-anchor="${escapeXml(node.textAlign)}" ${tfStr} ${opacityAttr}>${tspans}</text>`;
    }

    case 'vector_image': {
      return `<image href="${escapeXml(node.src)}" x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" width="${escapeXml(node.w)}" height="${escapeXml(node.h)}" ${tfStr} ${opacityAttr} />`;
    }

    case 'vector_icon': {
      const iconColor = fill || resolveColorToken(node.color, theme) || '#7c5cff';
      const r = node.size / 2;
      return `<g ${tfStr} ${opacityAttr}><circle cx="${node.x + r}" cy="${node.y + r}" r="${escapeXml(r)}" fill="${iconColor}" /><text x="${node.x + r}" y="${node.y + r + 5}" fill="#ffffff" font-size="${r * 1.2}" text-anchor="middle">★</text></g>`;
    }

    case 'vector_use': {
      return `<use href="${escapeXml(node.href)}" x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" ${tfStr} />`;
    }

    case 'vector_gradient': {
      const stopsHtml = (node.stops || []).map(s =>
        `<stop offset="${s.offset ?? 0}" stop-color="${escapeXml(resolveColorToken(s.color, theme) || '#000000')}" />`
      ).join('\n');

      if (node.gradientType === 'radial') {
        return `<radialGradient id="${escapeXml(node.id)}" cx="${escapeXml(node.cx)}" cy="${escapeXml(node.cy)}" r="${escapeXml(node.r)}">${stopsHtml}</radialGradient>`;
      }
      return `<linearGradient id="${escapeXml(node.id)}" x1="${escapeXml(node.x1)}" y1="${escapeXml(node.y1)}" x2="${escapeXml(node.x2)}" y2="${escapeXml(node.y2)}">${stopsHtml}</linearGradient>`;
    }

    default:
      return '';
  }
}

function renderShapePrimitive(node, fill, stroke, tfStr, opacityAttr) {
  const shape = (node.shape || 'rect').toLowerCase();
  const idAttr = node.id ? `id="${escapeXml(node.id)}"` : '';
  const ariaAttr = node.ariaLabel ? `role="img" aria-label="${escapeXml(node.ariaLabel)}"` : (node.ariaHidden ? 'aria-hidden="true"' : '');
  const titleChild = node.title ? `<title>${escapeXml(node.title)}</title>` : '';
  const fillAttr = fill ? `fill="${escapeXml(fill)}"` : (node.fill === 'none' ? 'fill="none"' : 'fill="#7c5cff"');
  const strokeAttr = stroke ? `stroke="${escapeXml(stroke)}" stroke-width="${escapeXml(node.strokeWidth || 1)}"` : '';

  if (shape === 'circle') {
    const r = node.r || node.radius || 20;
    return titleChild
      ? `<g ${idAttr} ${tfStr}><circle cx="${node.cx || node.x}" cy="${node.cy || node.y}" r="${escapeXml(r)}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<circle ${idAttr} cx="${node.cx || node.x}" cy="${node.cy || node.y}" r="${escapeXml(r)}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  if (shape === 'ellipse') {
    return titleChild
      ? `<g ${idAttr} ${tfStr}><ellipse cx="${escapeXml(node.cx || node.x)}" cy="${escapeXml(node.cy || node.y)}" rx="${escapeXml(node.rx || 30)}" ry="${escapeXml(node.ry || 15)}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<ellipse ${idAttr} cx="${escapeXml(node.cx || node.x)}" cy="${escapeXml(node.cy || node.y)}" rx="${escapeXml(node.rx || 30)}" ry="${escapeXml(node.ry || 15)}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  if (shape === 'line') {
    return titleChild
      ? `<g ${idAttr} ${tfStr}><line x1="${escapeXml(node.x1)}" y1="${escapeXml(node.y1)}" x2="${escapeXml(node.x2)}" y2="${escapeXml(node.y2)}" stroke="${escapeXml(stroke || fill || '#7c5cff')}" stroke-width="${escapeXml(node.strokeWidth || 2)}" ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<line ${idAttr} x1="${escapeXml(node.x1)}" y1="${escapeXml(node.y1)}" x2="${escapeXml(node.x2)}" y2="${escapeXml(node.y2)}" stroke="${escapeXml(stroke || fill || '#7c5cff')}" stroke-width="${escapeXml(node.strokeWidth || 2)}" ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  if (shape === 'polyline') {
    return titleChild
      ? `<g ${idAttr} ${tfStr}><polyline points="${escapeXml(node.points || '')}" fill="none" stroke="${escapeXml(stroke || fill || '#7c5cff')}" stroke-width="${escapeXml(node.strokeWidth || 2)}" ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<polyline ${idAttr} points="${escapeXml(node.points || '')}" fill="none" stroke="${escapeXml(stroke || fill || '#7c5cff')}" stroke-width="${escapeXml(node.strokeWidth || 2)}" ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  if (shape === 'polygon') {
    return titleChild
      ? `<g ${idAttr} ${tfStr}><polygon points="${escapeXml(node.points || '')}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<polygon ${idAttr} points="${escapeXml(node.points || '')}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  if (shape === 'path') {
    return titleChild
      ? `<g ${idAttr} ${tfStr}><path d="${escapeXml(node.d || '')}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<path ${idAttr} d="${escapeXml(node.d || '')}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  if (shape === 'bezier-quadratic' || shape === 'bezier-cubic') {
    const pathD = shape === 'bezier-cubic'
      ? `M ${escapeXml(node.x1)} ${escapeXml(node.y1)} C ${escapeXml(node.c1x)} ${escapeXml(node.c1y)}, ${escapeXml(node.c2x)} ${escapeXml(node.c2y)}, ${escapeXml(node.x2)} ${escapeXml(node.y2)}`
      : `M ${escapeXml(node.x1)} ${escapeXml(node.y1)} Q ${escapeXml(node.c1x)} ${escapeXml(node.c1y)}, ${escapeXml(node.x2)} ${escapeXml(node.y2)}`;
    return titleChild
      ? `<g ${idAttr} ${tfStr}><path d="${pathD}" fill="none" stroke="${escapeXml(stroke || fill || '#7c5cff')}" stroke-width="${escapeXml(node.strokeWidth || 2)}" ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
      : `<path ${idAttr} d="${pathD}" fill="none" stroke="${escapeXml(stroke || fill || '#7c5cff')}" stroke-width="${escapeXml(node.strokeWidth || 2)}" ${ariaAttr} ${tfStr} ${opacityAttr} />`;
  }

  // Default: rect
  const rVal = node.radius || node.r || 0;
  return titleChild
    ? `<g ${idAttr} ${tfStr}><rect x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" width="${escapeXml(node.w)}" height="${escapeXml(node.h)}" rx="${rVal}" ry="${rVal}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${opacityAttr} />${titleChild}</g>`
    : `<rect ${idAttr} x="${escapeXml(node.x)}" y="${escapeXml(node.y)}" width="${escapeXml(node.w)}" height="${escapeXml(node.h)}" rx="${rVal}" ry="${rVal}" ${fillAttr} ${strokeAttr} ${ariaAttr} ${tfStr} ${opacityAttr} />`;
}

function wrapVectorText(content, maxW, fontSize) {
  if (!maxW || !content) return [content];
  const charWidth = fontSize * 0.58;
  const maxChars = Math.max(10, Math.floor(maxW / charWidth));

  const words = String(content).split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxChars) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
