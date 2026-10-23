/* eslint-disable */
/* global WebImporter */

/**
 * Parser: promo-strip
 * Source: an .alignBanner strip (section.spruce-forest-theme, optionally inside an
 *   experience fragment, or a section.rounded-border card inside a column-control).
 * Layout (blocks/promo-strip/README.md): one row, cells in order:
 *   icon/image (optional) | heading | text (optional) | links/buttons (optional).
 * Variant: catalog lookup (page path + instance selector), falling back to DOM
 *   cues (rounded card inside a column-control -> light).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/lp/creator-taxes/": [["#container-d8006e96a0 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-100", "light"]],
  "/offers/turbotax-price-comparison/": [["#container-e8bf00d4c6 > div:nth-child(8)", null]],
  "/online-assist/": [["#container-33a468b3d9 > div:nth-child(7)", null]],
  "/online-tax-filing/": [["#container-33a468b3d9 > div:nth-child(7)", null]],
  "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > section.spruce-forest-theme", null]],
  "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > div:nth-child(7)", null]],
  "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > section.spruce-forest-theme", null]],
  "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > div:nth-child(6)", null]],
  "/tax-offices/": [["#container-4bc6fad564 > div:nth-child(7)", null]],
  "/tax-reform-and-law-changes/": [["#container-7266953ed0 > section:nth-child(8)", null]],
  "/tax-software/updates-back-editions/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/tax-software/updates-back-editions/2021-back-editions/": [["#container-814bc03364 > div:nth-child(4)", null]],
  "/tax-software/updates-back-editions/2022-back-editions/": [["#container-6b09d829bd > div:nth-child(4)", null]],
  "/tax-software/updates-back-editions/2023-back-editions/": [["#container-fafb80b298 > div:nth-child(4)", null]],
  "/tax-software/updates-back-editions/2024-back-editions/": [["#container-eeac4ab9ae > div:nth-child(4)", null]],
  "/tax-software/updates-back-editions/prior-year/": [["#container-cd5f8a909a > section.spruce-forest-theme", "alt"]],
  "/taxes/products/software/updates/17buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/17mac-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/17macintosh-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/17windows-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/17windows-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/18buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/18mac-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/18macintosh-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/18windows-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/18windows-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/19buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/19mac-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/19macintosh-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/19windows-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/19windows-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/taxes/products/software/updates/20buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
  "/best-tax-services/": [["section.hrb-neon-green", "dark"]],
  // card-grid-landing (catalog variants, class selectors stable between catalog and live)
  "/filing-options-and-products/": [["section.column-control.green-dark-theme.padding-bottom-100:has(.col-1)", null]],
  "/tax-offices/drop-off/": [["div.xf-content-height:has(.skinnyHeader)", null]],
  "/tax-offices/office-tax-preparation/": [["div.xf-content-height:has(.skinnyHeader)", null]],
  "/tax-offices/virtual-tax-preparation/": [["div.xf-content-height:has(.alignBanner)", null]],
  "/tax-offices/tax-refund-payment/": [["div.xf-content-height:has(.spruce-neon-theme)", "yellow"]],
  "/taxes/products/software/updates/whyrequired/": [["section.spruce-forest-theme", "alt"]],
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
  cleanInline(element);
  const banner = element.querySelector('.alignBanner') || element;

  const row = [];
  const media = banner.querySelector(':scope > .text-center-sm, .cmp-column--image');
  if (media) {
    const img = media.querySelector('img');
    const svg = media.querySelector('svg');
    const icon = img || (svg ? svgToImg(document, svg) : null);
    if (icon) row.push(icon);
  }
  const heading = banner.querySelector('.skinnyHeader, h1, h2, h3, h4');
  if (heading && text(heading)) {
    const h = /^H[1-6]$/.test(heading.tagName) ? heading : document.createElement('h2');
    if (h !== heading) h.textContent = text(heading);
    row.push(h);
  }
  const copy = banner.querySelector('.skinnyBodyCopy');
  if (copy) {
    const content = extract(document, copy);
    if (content.length) row.push(content);
  }
  const actions = banner.querySelector('.removeLastPadding, .btn-container');
  if (actions) {
    const ctas = [...actions.querySelectorAll('a, button')].filter((c) => text(c)).map((c) => ctaPara(document, c));
    if (ctas.length) row.push(ctas);
  }

  let variant = catalogVariant(element, params);
  if (variant === undefined) {
    variant = element.matches('section.column-control') && element.querySelector('section.rounded-border') ? 'light' : null;
  }

  const cells = row.length ? [row] : [];
  const name = variant ? `promo-strip (${variant})` : 'promo-strip';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
