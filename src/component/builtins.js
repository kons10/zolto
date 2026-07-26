/**
 * Zolto Built-in Reusable Components & Patterns — Phase 9
 *
 * Provides 12 standard built-in component patterns implemented using
 * Zolto component AST definitions:
 * - Card, StatCard, FeatureCard, AlertBox, HeroSection, SectionHeader,
 *   EmptyState, InfoPanel, ComparePanel, CallToAction, ProfileCard, DashboardTile
 */

import { createComponentDefNode, createSlotDefNode } from './ast.js';
import { parsePropDeclaration } from './props.js';

export function getBuiltinComponents() {
  const builtins = new Map();

  const register = (name, propDecls, slots, bodyHtmlFn) => {
    const props = propDecls.map(parsePropDeclaration);
    const slotNodes = slots.map(s => createSlotDefNode(s));
    const node = createComponentDefNode(name, props, slotNodes, [bodyHtmlFn], {
      author: 'Zolto System',
      version: '9.0.0',
      description: `Built-in ${name} component`,
    });
    builtins.set(name, node);
  };

  // 1. Card
  register('Card', ['title=""', 'subtitle=""', 'variant="default"'], ['default'], ctx => {
    return `<div class="zl-card zl-card-${ctx.variant || 'default'}">` +
           (ctx.title ? `<h3 class="zl-card-title">${ctx.title}</h3>` : '') +
           (ctx.subtitle ? `<p class="zl-card-subtitle">${ctx.subtitle}</p>` : '') +
           `<div class="zl-card-body">{slot:default}</div></div>`;
  });

  // 2. StatCard
  register('StatCard', ['title=""', 'value=""', 'change=""', 'trend="neutral"'], [], ctx => {
    return `<div class="zl-stat-card zl-trend-${ctx.trend}">` +
           `<div class="zl-stat-title">${ctx.title}</div>` +
           `<div class="zl-stat-value">${ctx.value}</div>` +
           (ctx.change ? `<div class="zl-stat-change">${ctx.change}</div>` : '') +
           `</div>`;
  });

  // 3. FeatureCard
  register('FeatureCard', ['title=""', 'icon="★"', 'description=""'], ['default'], ctx => {
    return `<div class="zl-feature-card">` +
           `<div class="zl-feature-icon">${ctx.icon}</div>` +
           `<h4 class="zl-feature-title">${ctx.title}</h4>` +
           `<p class="zl-feature-desc">${ctx.description || '{slot:default}'}</p></div>`;
  });

  // 4. AlertBox
  register('AlertBox', ['type="info"', 'title=""'], ['default'], ctx => {
    return `<div class="zl-alert-box zl-alert-${ctx.type}">` +
           (ctx.title ? `<strong class="zl-alert-title">${ctx.title}</strong>` : '') +
           `<div class="zl-alert-content">{slot:default}</div></div>`;
  });

  // 5. HeroSection
  register('HeroSection', ['title=""', 'subtitle=""', 'ctaText=""', 'ctaLink="#"'], ['default'], ctx => {
    return `<section class="zl-hero-section">` +
           `<h1 class="zl-hero-title">${ctx.title}</h1>` +
           (ctx.subtitle ? `<p class="zl-hero-subtitle">${ctx.subtitle}</p>` : '') +
           `<div class="zl-hero-content">{slot:default}</div>` +
           (ctx.ctaText ? `<a href="${ctx.ctaLink}" class="zl-hero-cta">${ctx.ctaText}</a>` : '') +
           `</section>`;
  });

  // 6. SectionHeader
  register('SectionHeader', ['title=""', 'badge=""'], [], ctx => {
    return `<div class="zl-section-header">` +
           (ctx.badge ? `<span class="zl-section-badge">${ctx.badge}</span>` : '') +
           `<h2 class="zl-section-title">${ctx.title}</h2></div>`;
  });

  // 7. EmptyState
  register('EmptyState', ['title="No Data"', 'message="Nothing to display"'], ['default'], ctx => {
    return `<div class="zl-empty-state">` +
           `<h4 class="zl-empty-title">${ctx.title}</h4>` +
           `<p class="zl-empty-msg">${ctx.message}</p>` +
           `<div class="zl-empty-actions">{slot:default}</div></div>`;
  });

  // 8. InfoPanel
  register('InfoPanel', ['title="Information"'], ['default'], ctx => {
    return `<div class="zl-info-panel">` +
           `<h4 class="zl-info-panel-title">${ctx.title}</h4>` +
           `<div class="zl-info-panel-body">{slot:default}</div></div>`;
  });

  // 9. ComparePanel
  register('ComparePanel', ['leftTitle="Before"', 'rightTitle="After"'], ['left', 'right'], ctx => {
    return `<div class="zl-compare-panel">` +
           `<div class="zl-compare-side"><div class="zl-compare-head">${ctx.leftTitle}</div>{slot:left}</div>` +
           `<div class="zl-compare-side"><div class="zl-compare-head">${ctx.rightTitle}</div>{slot:right}</div></div>`;
  });

  // 10. CallToAction
  register('CallToAction', ['title=""', 'buttonText="Get Started"'], ['default'], ctx => {
    return `<div class="zl-cta-block">` +
           `<h3 class="zl-cta-title">${ctx.title}</h3>` +
           `<div class="zl-cta-body">{slot:default}</div>` +
           `<button class="zl-cta-btn">${ctx.buttonText}</button></div>`;
  });

  // 11. ProfileCard
  register('ProfileCard', ['name=""', 'role=""', 'avatar=""'], ['default'], ctx => {
    return `<div class="zl-profile-card">` +
           (ctx.avatar ? `<img src="${ctx.avatar}" class="zl-profile-avatar" alt="${ctx.name}" />` : '') +
           `<h4 class="zl-profile-name">${ctx.name}</h4>` +
           `<span class="zl-profile-role">${ctx.role}</span>` +
           `<div class="zl-profile-bio">{slot:default}</div></div>`;
  });

  // 12. DashboardTile
  register('DashboardTile', ['label=""', 'value=""'], ['default'], ctx => {
    return `<div class="zl-dashboard-tile">` +
           `<div class="zl-tile-label">${ctx.label}</div>` +
           `<div class="zl-tile-value">${ctx.value}</div>` +
           `<div class="zl-tile-body">{slot:default}</div></div>`;
  });

  return builtins;
}
