/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Sources:
 *   - div.fb-image-wrapper: responsive background images + column-control content
 *   - section.teaser: full-bleed illustrations + centred CTA
 *   - section.column-control > figure.hero-wrapper (herodefaultview image + figcaption)
 * Layout (blocks/hero-banner/README.md): one row:
 *   [background picture | eyebrow, heading, text, CTA links | optional foreground picture]
 * Only the desktop rendition of responsive image sets is kept.
 * Variant: catalog lookup (page path + instance selector), falling back to DOM cues
 *   (light/stacked hero figure -> alt, other hero figure -> dark, no text -> image-only,
 *   fb-image-wrapper -> alt-2, teaser -> alt).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/offers/turbotax-price-comparison/": [["#container-e8bf00d4c6 > div.fb-image-wrapper", "alt-2"], ["#container-e8bf00d4c6 > section:nth-child(12)", "dark"]],
  "/tax-payment-center/": [["#container-77a8166999 > section.teaser", "alt"]],
  "/corporate/founders/": [["figure.hero-wrapper", "image-only"]],
  // campaign-full-bleed-hero (catalog variants: eggshell illustration banners image-only, forest quote figure default)
  "/outlook-on-american-life/": [["section.column-control:has(figure.hero-wrapper.spruce-eggshell-theme)", "image-only"], ["figure.hero-wrapper.spruce-forest-theme", null], ["section.column-control:has(figure.hero-wrapper.white-theme)", "alt"]],
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

  // ratings widget: keep the accessible summary only
  element.querySelectorAll('.rating-stars').forEach((r) => {
    const summary = text(r.querySelector('.bv-off-screen'));
    if (summary) r.replaceWith(para(document, summary));
    else r.remove();
  });

  let bg = null;
  let fg = null;
  let contentRoot = element;

  if (element.querySelector('.fb-img-bg, .image-container > img')) {
    const imgs = [...element.querySelectorAll('.image-container img')];
    bg = imgs.find((i) => i.classList.contains('show-large')) || imgs[0] || null;
    element.querySelectorAll('.image-container').forEach((n) => n.remove());
  } else if (element.querySelector('.herodefaultview')) {
    bg = element.querySelector('img.herodefaultview');
    const fig = element.querySelector('figure.hero-wrapper');
    contentRoot = element.querySelector('figcaption') || element;
    if (fig) fig.querySelectorAll(':scope > div > img').forEach((n) => n.remove());
  } else if (element.querySelector('.teaser-bg-full-bleed, img.bg-img')) {
    const imgs = [...element.querySelectorAll('.teaser-bg-full-bleed img, img.bg-img')];
    [bg, fg] = imgs;
    element.querySelectorAll('.teaser-bg-full-bleed').forEach((n) => n.remove());
    imgs.forEach((i) => i.remove());
  } else {
    bg = element.querySelector('img');
    if (bg) bg.remove();
  }

  const content = extract(document, contentRoot).filter((n) => !(n.tagName === 'IMG'));
  const row = [bg || '', content.length ? content : ''];
  if (fg) row.push(fg);

  let variant = catalogVariant(element, params);
  if (variant === undefined) {
    const figure = element.querySelector('figure.hero-wrapper');
    // a light-theme figure (eggshell / stacked illustration with centred section-coloured
    // text, e.g. "We're here to help") is the centred teaser layout, not the dark photo banner
    if (figure && figure.matches('.spruce-eggshell-theme, .flex-column-r')) variant = 'alt';
    else if (figure) variant = 'dark';
    else if (!content.length) variant = 'image-only';
    else if (element.matches('.fb-image-wrapper')) variant = 'alt-2';
    else if (element.matches('.teaser')) variant = 'alt';
    else variant = null;
  }

  const name = variant ? `hero-banner (${variant})` : 'hero-banner';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
  element.replaceWith(block);
}
