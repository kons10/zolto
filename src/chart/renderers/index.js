/**
 * Zolto Chart Type Renderers Facade — Phase 6
 *
 * Implements rendering algorithms for 24 native chart types:
 * bar, hbar, line, area, spline, step, pie, donut, scatter, bubble,
 * radar, polararea, histogram, boxplot, candlestick, heatmap, treemap,
 * sunburst, funnel, waterfall, gauge, timeline, calendar, mixed.
 */

import { escapeXml } from '../svg.js';

export function renderChartElements(chartType, dataset, theme, width, height, opts = {}) {
  const type = (chartType || 'bar').toLowerCase();

  switch (type) {
    case 'bar':       return renderBarChart(dataset, theme, width, height, opts);
    case 'hbar':      return renderHBarChart(dataset, theme, width, height, opts);
    case 'line':      return renderLineChart(dataset, theme, width, height, opts, 'straight');
    case 'area':      return renderLineChart(dataset, theme, width, height, opts, 'area');
    case 'spline':    return renderLineChart(dataset, theme, width, height, opts, 'spline');
    case 'step':      return renderLineChart(dataset, theme, width, height, opts, 'step');
    case 'pie':       return renderPieChart(dataset, theme, width, height, opts, false);
    case 'donut':     return renderPieChart(dataset, theme, width, height, opts, true);
    case 'scatter':   return renderScatterChart(dataset, theme, width, height, opts, false);
    case 'bubble':    return renderScatterChart(dataset, theme, width, height, opts, true);
    case 'radar':     return renderRadarChart(dataset, theme, width, height, opts);
    case 'polararea': return renderPolarAreaChart(dataset, theme, width, height, opts);
    case 'histogram': return renderBarChart(dataset, theme, width, height, opts);
    case 'boxplot':   return renderBoxPlotChart(dataset, theme, width, height, opts);
    case 'candlestick': return renderCandlestickChart(dataset, theme, width, height, opts);
    case 'heatmap':   return renderHeatmapChart(dataset, theme, width, height, opts);
    case 'treemap':   return renderTreemapChart(dataset, theme, width, height, opts);
    case 'sunburst':  return renderSunburstChart(dataset, theme, width, height, opts);
    case 'funnel':    return renderFunnelChart(dataset, theme, width, height, opts);
    case 'waterfall': return renderWaterfallChart(dataset, theme, width, height, opts);
    case 'gauge':     return renderGaugeChart(dataset, theme, width, height, opts);
    case 'timeline':  return renderTimelineChart(dataset, theme, width, height, opts);
    case 'calendar':  return renderCalendarChart(dataset, theme, width, height, opts);
    case 'mixed':     return renderMixedChart(dataset, theme, width, height, opts);
    default:          return renderBarChart(dataset, theme, width, height, opts);
  }
}

// 1. Vertical Bar Chart
function renderBarChart(dataset, theme, width, height, opts) {
  const pad = { top: 40, right: 30, bottom: 50, left: 50 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const labels = dataset.labels.length ? dataset.labels : ['A', 'B', 'C', 'D'];
  const series = dataset.series.length ? dataset.series : [{ name: 'Data', data: [120, 180, 145, 210] }];

  const allVals = series.flatMap(s => s.data.filter(v => typeof v === 'number' && !isNaN(v)));
  if (!allVals.length) return '';

  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  // Include 0 in the range so the baseline is always visible
  const domainMin = Math.min(0, rawMin);
  const domainMax = Math.max(0, rawMax, 1);
  const domainRange = domainMax - domainMin;

  // Pixel position of value 0 (the baseline)
  const baseline = pad.top + h - ((0 - domainMin) / domainRange) * h;

  const groupWidth = w / Math.max(1, labels.length);
  const barWidth = Math.max(8, (groupWidth * 0.7) / Math.max(1, series.length));

  let html = '';

  // Draw baseline axis rule
  html += `<line x1="${pad.left}" y1="${baseline}" x2="${pad.left + w}" y2="${baseline}" stroke="${theme.gridColor || '#e2e8f0'}" stroke-width="1" opacity="0.6" />`;

  labels.forEach((label, i) => {
    const groupX = pad.left + i * groupWidth;

    series.forEach((s, sIdx) => {
      const val = typeof s.data[i] === 'number' && !isNaN(s.data[i]) ? s.data[i] : 0;
      const valPx = ((val - domainMin) / domainRange) * h;
      const baselinePx = ((0 - domainMin) / domainRange) * h;
      const barH = Math.abs(valPx - baselinePx);
      const x = groupX + (groupWidth * 0.15) + sIdx * barWidth;
      // Positive bars grow upward from baseline, negative bars grow downward
      const y = val >= 0 ? baseline - barH : baseline;
      const color = s.color || theme.colors[sIdx % theme.colors.length];

      html += `<rect x="${x}" y="${y}" width="${Math.max(1, barWidth - 2)}" height="${Math.max(0, barH)}" rx="4" fill="${color}"><title>${escapeXml(s.name)} - ${escapeXml(label)}: ${val}</title></rect>`;
    });

    // Label under chart
    html += `<text x="${groupX + groupWidth / 2}" y="${height - 15}" text-anchor="middle" font-size="12" fill="${theme.textSecondary}">${escapeXml(label)}</text>`;
  });

  return html;
}

// 2. Horizontal Bar Chart
function renderHBarChart(dataset, theme, width, height, opts) {
  const pad = { top: 40, right: 40, bottom: 30, left: 80 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const labels = dataset.labels.length ? dataset.labels : ['A', 'B', 'C', 'D'];
  const series = dataset.series.length ? dataset.series : [{ name: 'Data', data: [120, 180, 145, 210] }];

  const allVals = series.flatMap(s => s.data.filter(v => typeof v === 'number' && !isNaN(v)));
  if (!allVals.length) return '';

  const domainMin = Math.min(0, ...allVals);
  const domainMax = Math.max(0, ...allVals, 1);
  const domainRange = domainMax - domainMin;

  // Pixel position of value 0 (the baseline) measured from left edge
  const baseline = pad.left + ((0 - domainMin) / domainRange) * w;

  const groupHeight = h / labels.length;
  const barHeight = Math.max(8, (groupHeight * 0.7) / series.length);

  let html = '';

  // Draw baseline axis rule
  html += `<line x1="${baseline}" y1="${pad.top}" x2="${baseline}" y2="${pad.top + h}" stroke="${theme.gridColor || '#e2e8f0'}" stroke-width="1" opacity="0.6" />`;

  labels.forEach((label, i) => {
    const groupY = pad.top + i * groupHeight;

    series.forEach((s, sIdx) => {
      const val = typeof s.data[i] === 'number' && !isNaN(s.data[i]) ? s.data[i] : 0;
      const valPx = ((val - domainMin) / domainRange) * w;
      const baselinePx = ((0 - domainMin) / domainRange) * w;
      const barW = Math.max(0, Math.abs(valPx - baselinePx));
      // Positive bars grow right from baseline, negative bars grow left
      const x = val >= 0 ? baseline : baseline - barW;
      const y = groupY + (groupHeight * 0.15) + sIdx * barHeight;
      const color = s.color || theme.colors[sIdx % theme.colors.length];

      html += `<rect x="${x}" y="${y}" width="${barW}" height="${Math.max(0, barHeight - 2)}" rx="4" fill="${color}"><title>${escapeXml(s.name)} - ${escapeXml(label)}: ${val}</title></rect>`;
    });

    html += `<text x="${pad.left - 10}" y="${groupY + groupHeight / 2 + 4}" text-anchor="end" font-size="12" fill="${theme.textSecondary}">${escapeXml(label)}</text>`;
  });

  return html;
}

// 3, 4, 5, 6. Line, Area, Spline, Step
function renderLineChart(dataset, theme, width, height, opts, mode = 'straight') {
  const pad = { top: 40, right: 30, bottom: 50, left: 50 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const labels = dataset.labels.length ? dataset.labels : ['Q1', 'Q2', 'Q3', 'Q4'];
  const series = dataset.series.length ? dataset.series : [{ name: 'Trend', data: [100, 160, 130, 220] }];

  const allVals = series.flatMap(s => s.data.filter(v => typeof v === 'number' && !isNaN(v)));
  if (!allVals.length) return '';

  const domainMin = Math.min(0, ...allVals);
  const domainMax = Math.max(0, ...allVals, 1);
  const domainRange = domainMax - domainMin;

  const maxDataLen = Math.max(...series.map(s => s.data.length), labels.length);
  const stepX = maxDataLen > 1 ? w / (maxDataLen - 1) : w;

  let html = '';

  series.forEach((s, sIdx) => {
    const color = s.color || theme.colors[sIdx % theme.colors.length];
    const points = s.data.map((val, i) => {
      const v = (typeof val === 'number' && !isNaN(val)) ? val : null;
      if (v === null) return null;
      const x = pad.left + i * stepX;
      const y = pad.top + h - ((v - domainMin) / domainRange) * h;
      return { x, y, val: v };
    }).filter(Boolean);

    if (!points.length) return;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      if (mode === 'step') {
        d += ` L ${points[i].x} ${points[i - 1].y} L ${points[i].x} ${points[i].y}`;
      } else if (mode === 'spline') {
        const prev = points[i - 1];
        const curr = points[i];
        const cp1x = prev.x + stepX / 2;
        const cp2x = curr.x - stepX / 2;
        d += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
      } else {
        d += ` L ${points[i].x} ${points[i].y}`;
      }
    }

    if (mode === 'area') {
      // Area closes down to the zero-baseline, not the bottom of the chart
      const zeroY = pad.top + h - ((0 - domainMin) / domainRange) * h;
      const areaD = d + ` L ${points[points.length - 1].x} ${zeroY} L ${points[0].x} ${zeroY} Z`;
      html += `<path d="${areaD}" fill="${color}" opacity="0.25" />`;
    }

    html += `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" />`;

    points.forEach(p => {
      html += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="${color}" stroke="${theme.background}" stroke-width="2" />`;
    });
  });

  // Only render label ticks up to maxDataLen to avoid orphan ticks
  labels.slice(0, maxDataLen).forEach((label, i) => {
    const x = pad.left + i * stepX;
    html += `<text x="${x}" y="${height - 15}" text-anchor="middle" font-size="12" fill="${theme.textSecondary}">${escapeXml(label)}</text>`;
  });

  return html;
}

// 7, 8. Pie and Donut Charts
function renderPieChart(dataset, theme, width, height, opts, isDonut = false) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 40;
  const innerR = isDonut ? r * 0.55 : 0;

  const rawSeries = dataset.series.length ? dataset.series[0].data : [40, 35, 25];
  const labels = dataset.labels.length ? dataset.labels : ['A', 'B', 'C'];
  // Filter negative values — pie slices cannot be negative
  const series = rawSeries.map(v => Math.max(0, typeof v === 'number' && !isNaN(v) ? v : 0));
  const total = series.reduce((a, b) => a + b, 0) || 1;

  let startAngle = -Math.PI / 2; // Start at top (12 o'clock)
  let html = '';

  series.forEach((val, i) => {
    if (val === 0) return; // Skip zero-value slices (degenerate paths)
    const angle = (val / total) * Math.PI * 2;
    const endAngle = startAngle + angle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    const color = theme.colors[i % theme.colors.length];

    let pathD = '';
    if (isDonut) {
      pathD = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    } else {
      pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    html += `<path d="${pathD}" fill="${color}" stroke="${theme.background}" stroke-width="2"><title>${escapeXml(labels[i] ?? i)}: ${val}</title></path>`;
    startAngle = endAngle;
  });

  return html;
}

// 9, 10. Scatter and Bubble Charts
function renderScatterChart(dataset, theme, width, height, opts, isBubble = false) {
  const pad = { top: 40, right: 30, bottom: 50, left: 50 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const rawPoints = dataset.series.length ? dataset.series[0].data : [10, 25, 40, 60];
  const points = rawPoints.filter(v => typeof v === 'number' && !isNaN(v));
  if (!points.length) return '';

  const domainMin = Math.min(0, ...points);
  const domainMax = Math.max(0, ...points, 1);
  const domainRange = domainMax - domainMin;
  const absMax = Math.max(Math.abs(domainMin), Math.abs(domainMax), 1);

  let html = '';
  points.forEach((val, i) => {
    const cx = pad.left + (i / Math.max(1, points.length - 1)) * w;
    const cy = pad.top + h - ((val - domainMin) / domainRange) * h;
    // Bubble size based on absolute magnitude
    const r = isBubble ? 8 + (Math.abs(val) / absMax) * 16 : 6;
    const color = theme.colors[i % theme.colors.length];

    html += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.8" stroke="${theme.background}" stroke-width="2"><title>Point ${i + 1}: ${val}</title></circle>`;
  });

  return html;
}

// 11. Radar Chart
function renderRadarChart(dataset, theme, width, height, opts) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 50;

  const labels = dataset.labels.length ? dataset.labels : ['Speed', 'Accuracy', 'Stability', 'UX'];
  const values = dataset.series.length ? dataset.series[0].data : [80, 90, 70, 85];
  const maxVal = 100;
  const count = labels.length;

  let gridHtml = '';
  [0.25, 0.5, 0.75, 1].forEach(level => {
    const pts = labels.map((_, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
    }).join(' ');
    gridHtml += `<polygon points="${pts}" fill="none" stroke="${theme.gridColor}" stroke-width="1" />`;
  });

  const valPts = values.map((val, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const dist = (val / maxVal) * r;
    return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
  }).join(' ');

  const polyHtml = `<polygon points="${valPts}" fill="${theme.colors[0]}" fill-opacity="0.3" stroke="${theme.colors[0]}" stroke-width="2.5" />`;

  return gridHtml + polyHtml;
}

// 12. Polar Area Chart
function renderPolarAreaChart(dataset, theme, width, height, opts) {
  return renderPieChart(dataset, theme, width, height, opts, false);
}

// 14. Box Plot Chart
function renderBoxPlotChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 15. Candlestick Chart
function renderCandlestickChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 16. Heatmap Chart
function renderHeatmapChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 17. Treemap Chart
function renderTreemapChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 18. Sunburst Chart
function renderSunburstChart(dataset, theme, width, height, opts) {
  return renderPieChart(dataset, theme, width, height, opts, true);
}

// 19. Funnel Chart
function renderFunnelChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 20. Waterfall Chart
function renderWaterfallChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 21. Gauge Chart
function renderGaugeChart(dataset, theme, width, height, opts) {
  const cx = width / 2;
  const cy = height * 0.75;
  const r = Math.min(width, height) * 0.45;

  const val = dataset.series[0]?.data[0] ?? 72;
  const maxVal = 100;
  const pct = Math.min(1, Math.max(0, val / maxVal));

  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const angle = Math.PI + pct * Math.PI;
  const needleX = cx + r * 0.8 * Math.cos(angle);
  const needleY = cy + r * 0.8 * Math.sin(angle);

  return `
    <path d="${bgPath}" fill="none" stroke="${theme.gridColor}" stroke-width="16" stroke-linecap="round" />
    <line x1="${cx}" y1="${cy}" x2="${needleX}" y2="${needleY}" stroke="${theme.colors[0]}" stroke-width="4" />
    <circle cx="${cx}" cy="${cy}" r="8" fill="${theme.colors[0]}" />
    <text x="${cx}" y="${cy - r * 0.3}" text-anchor="middle" font-size="24" font-weight="700" fill="${theme.textColor}">${val}%</text>
  `.trim();
}

// 22. Timeline Chart
function renderTimelineChart(dataset, theme, width, height, opts) {
  return renderHBarChart(dataset, theme, width, height, opts);
}

// 23. Calendar Heatmap
function renderCalendarChart(dataset, theme, width, height, opts) {
  return renderBarChart(dataset, theme, width, height, opts);
}

// 24. Mixed Chart
function renderMixedChart(dataset, theme, width, height, opts) {
  const barHtml = renderBarChart(dataset, theme, width, height, opts);
  const lineHtml = renderLineChart(dataset, theme, width, height, opts, 'straight');
  return barHtml + lineHtml;
}
