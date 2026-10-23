/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-promo-card
 * Source: section.column-control holding one rounded promo card
 *   (div.card.card-secondary: article.card-content + span.card-img).
 * Layout (blocks/columns-promo-card/README.md): one row, two cells:
 *   [image | text: optional eyebrow, heading, copy, price, CTA buttons, footnote]
 * Variant: catalog lookup (page path + instance selector), falling back to DOM
 *   cues (check-icon copy -> checklist).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/easignup/": [["#container-69a88a9f0b > section.column-control.spruce-forest-theme.padding-top-100", "checklist"]],
  "/financial-services/emerald-advance-loan/": [["#container-69a88a9f0b > section.column-control.spruce-forest-theme.padding-top-100", "checklist"]],
  "/financial-services/emerald-card-services/": [["#container-e85b1470d9 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-120", "alt-3"]],
  "/mobile-apps/": [["section.column-control:has(.card-secondary.featurecard .spruce-neon)", "alt-2"]],
  "/offers/gig-worker-side-business-taxes/": [["#container-1ef905b226 > section:nth-child(10)", null]],
  "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
  "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
  "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
  "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
  "/tax-offices/": [["#container-4bc6fad564 > div:nth-child(10)", null]],
  // card-grid-landing (catalog variants, class selectors stable between catalog and live)
  "/filing-options-and-products/": [["section.column-control.white-theme.padding-top-100.padding-bottom-40", "alt-2"]],
  "/tax-offices/office-tax-preparation/": [["div.xf-content-height:has(.card-secondary)", null]],
  "/tax-offices/tax-refund-payment/": [["div.xf-content-height:has(.spruce-forest-theme)", "alt"]],
  // tool-guide-page (catalog variants: checklist app card, refund xf alt)
  "/tax-prep-checklist/": [["section.column-control:has(.card-secondary.featurecard)", "app"]],
  "/wheres-my-refund/": [["div.xf-content-height:has(.card-secondary)", "alt"]],
};

function pagePath(params) {
  try {
    let p = new URL(params && params.originalURL).pathname.replace(/index\.html$/, '').replace(/\.html$/, '/');
    if (!p.endsWith('/')) p += '/';
    return p.toLowerCase();
  } catch (e) {
    return '';
  }
}

/* variant class recorded by the catalog for this page + instance; undefined when unknown */
function catalogVariant(element, params) {
  const entries = CATALOG_VARIANTS[pagePath(params)];
  if (!entries) return undefined;
  for (const [sel, v] of entries) {
    try { if (element.matches(sel)) return v; } catch (e) { /* invalid selector */ }
  }
  return undefined;
}

/* ---- shared content helpers (inlined per parser) ---- */
const BLOCK_SEL = 'div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav';

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function isHidden(el) {
  const style = (el.getAttribute && el.getAttribute('style')) || '';
  return /display\s*:\s*none/i.test(style) || el.hidden === true;
}

function cleanInline(root) {
  root.querySelectorAll('span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
  root.querySelectorAll('h1 br, h2 br, h3 br, h4 br, h5 br, h6 br').forEach((br) => br.replaceWith(' '));
  root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute('href', '#'));
  // eyebrow labels marked up as headings are plain paragraphs in the authored content
  root.querySelectorAll('h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow').forEach((h) => {
    const p = h.ownerDocument.createElement('p');
    p.append(...[...h.childNodes]);
    h.replaceWith(p);
  });
}

function svgToImg(document, svg) {
  try {
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const markup = clone.outerHTML;
    const b64 = typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(markup)))
      : Buffer.from(markup, 'utf8').toString('base64');
    const img = document.createElement('img');
    img.src = `data:image/svg+xml;base64,${b64}`;
    img.alt = svg.getAttribute('aria-label') || '';
    return img;
  } catch (e) {
    return null;
  }
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else if (Array.isArray(content)) p.append(...content);
  else p.append(content);
  return p;
}

function ctaPara(document, el) {
  const link = document.createElement('a');
  link.href = (el.tagName === 'A' && el.getAttribute('href')) || '#';
  const img = el.querySelector('img');
  if (img && !text(el)) link.append(img);
  else link.textContent = text(el);
  const isButton = el.tagName === 'BUTTON' || /(^|\s)btn(\s|$)|button/.test(el.className || '');
  if (isButton && text(el)) {
    const strong = document.createElement('strong');
    strong.append(link);
    return para(document, strong);
  }
  return para(document, link);
}

/**
 * Flatten a source subtree into block-level authoring content
 * (headings, paragraphs, lists, images, CTA paragraphs).
 * opts.icons: convert inline <svg> icons to data-URI images.
 */
function extract(document, root, opts = {}) {
  const out = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s+/g, ' ').trim();
        if (t) out.push(para(document, t));
        return;
      }
      if (n.nodeType !== 1 || isHidden(n)) return;
      const tag = n.tagName.toUpperCase();
      if (tag === 'SVG') {
        if (opts.icons) { const img = svgToImg(document, n); if (img) out.push(img); }
        return;
      }
      if (tag === 'IMG') { if (n.getAttribute('src')) out.push(n); return; }
      if (tag === 'HR') { out.push(n); return; }
      if (tag === 'PICTURE') { out.push(n); return; }
      if (tag === 'IFRAME' || tag === 'VIDEO') {
        const src = n.getAttribute('src') || (n.querySelector('source') && n.querySelector('source').getAttribute('src'));
        if (src) { const a = document.createElement('a'); a.href = src; a.textContent = src; out.push(para(document, a)); }
        return;
      }
      if (/^H[1-6]$/.test(tag)) {
        n.querySelectorAll('svg').forEach((s) => s.remove());
        if (text(n)) out.push(n);
        return;
      }
      if ((tag === 'UL' || tag === 'OL') && (n.matches('.column-container, .accordion, [role="tablist"]')
        || n.querySelector(':scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header'))) {
        walk(n); // layout list, not a content list
        return;
      }
      if (tag === 'P' || tag === 'UL' || tag === 'OL' || tag === 'TABLE' || tag === 'BLOCKQUOTE') {
        n.querySelectorAll('svg').forEach((s) => s.remove());
        n.querySelectorAll('button').forEach((b) => b.replaceWith(document.createTextNode(text(b))));
        if (text(n) || n.querySelector('img')) out.push(n);
        return;
      }
      if (tag === 'A') {
        if (text(n) || n.querySelector('img')) out.push(ctaPara(document, n));
        return;
      }
      if (tag === 'BUTTON') {
        if (text(n)) out.push(ctaPara(document, n));
        return;
      }
      // inline-only container with text: keep as one paragraph
      const hasHidden = [...n.querySelectorAll('[style]')].some((d) => isHidden(d));
      if (!hasHidden && !n.querySelector(BLOCK_SEL) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text(n)) {
        const p = document.createElement('p');
        p.append(...[...n.childNodes]);
        out.push(p);
        return;
      }
      walk(n);
    });
  };
  walk(root);
  return out;
}
/* ---- end shared helpers ---- */


export default function parse(element, { document, params }) {
  element.querySelectorAll('span.hide').forEach((n) => n.remove());
  cleanInline(element);

  const cards = [...element.querySelectorAll('div.card')].filter((c) => !c.parentElement.closest('div.card'));
  const card = cards[0] || element;
  const imgHolder = card.querySelector('.card-img') || card.querySelector('.cmp-column--image');
  const img = imgHolder ? imgHolder.querySelector('img') : card.querySelector('img');
  const content = card.querySelector('article.card-content') || card;

  // price line: strong price + "+ $0 per state filed"
  content.querySelectorAll('strong.price, .price').forEach((pr) => {
    if (pr.parentElement.closest('.price')) return;
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text(pr);
    p.append(strong);
    pr.replaceWith(p);
  });
  // check-icon paragraphs -> list items
  const checks = [...content.querySelectorAll('p')].filter((p) => p.querySelector('[class*="hrb-icon-link--check"]'));
  if (checks.length) {
    const ul = document.createElement('ul');
    checks[0].before(ul);
    checks.forEach((p) => {
      const li = document.createElement('li');
      li.append(...[...p.childNodes]);
      li.querySelectorAll('span[class*="hrb-icon-link--check"]').forEach((s) => s.replaceWith(...s.childNodes));
      ul.append(li);
      p.remove();
    });
  }

  const body = extract(document, content);
  const cells = [[img || '', body.length ? body : '']];

  let variant = catalogVariant(element, params);
  if (variant === undefined) variant = checks.length ? 'checklist' : null;
  const name = variant ? `columns-promo-card (${variant})` : 'columns-promo-card';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
