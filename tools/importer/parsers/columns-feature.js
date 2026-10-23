/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-feature
 * Source: two-column section.column-control (optionally inside an experience
 *   fragment): feature text column (icon lists, steps, price, CTAs) + image column.
 * Layout (blocks/columns-feature/README.md): one row, two cells:
 *   [feature text (heading, icon or numbered list, price, CTAs) | image]
 * Icon lists (div.iconlist) become one list per run of consecutive lists:
 *   steps / steps-2 / steps-3 -> <ol> (numbers come from the block), otherwise
 *   <ul> with the inline-SVG icon kept as a data-URI image at the start of each item.
 * Variant: catalog lookup (page path + instance selector), falling back to DOM
 *   cues (accordion list -> accordion).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/w-4-calculator/": [["section.white-theme.two-column-control:has(.iconlist)", "steps-2"]],
  "/offers/saf/": [["#container-5b3cccfaf0 > section.column-control.spruce-eggshell-theme.two-column-control", "steps-3"]],
  "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > div:nth-child(6)", "light"]],
  "/online-tax-filing/tax-pro-review/": [["#container-f3913af060 > section.column-control.white-theme.padding-top-80.padding-bottom-40.two-column-control", "accordion"]],
  "/tax-offices/business-services/small-business-bookkeeping-services/": [["#container-971cbd754f > section.column-control.white-theme.padding-top-80.padding-bottom-60.two-column-control", "accordion"]],
  "/tax-offices/extended-tax-services/past-taxes/": [["#container-5f4a923d82 > section.column-control.white-theme.padding-top-60.padding-bottom-20.two-column-control", "steps-2"]],
  "/tax-software/": [["#container-5dc21ea7b0 > div:nth-child(14)", "steps"]],
  "/tax-software/basic-tax-software/": [["#container-0183d81774 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/tax-software/deluxe-tax-software/": [["#container-7c3463266f > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/tax-software/deluxe-without-state/": [["#container-6a44599bfa > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/tax-software/premium-small-business-tax-software/": [["#container-23a1fc841d > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/tax-software/premium-tax-software/": [["#container-0f860f40c5 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/best-tax-services/": [["div.xf-content-height:has(.iconlist)", "light"]],
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


const STEP_VARIANTS = ['steps', 'steps-2', 'steps-3'];

function isEmptyWrapper(el) {
  return el && !text(el) && !el.querySelector('img, svg, picture, iframe');
}

/* Replace runs of div.iconlist with one semantic list */
function buildIconLists(document, root, ordered) {
  const lists = [...root.querySelectorAll('div.iconlist')];
  const done = new Set();
  lists.forEach((first) => {
    if (done.has(first)) return;
    const run = [first];
    let sib = first.nextElementSibling;
    while (sib) {
      if (sib.matches('div.iconlist')) { run.push(sib); sib = sib.nextElementSibling; continue; }
      if (isEmptyWrapper(sib)) { sib = sib.nextElementSibling; continue; }
      break;
    }
    run.forEach((r) => done.add(r));
    const before = [];
    const list = document.createElement(ordered ? 'ol' : 'ul');
    run.forEach((r) => {
      r.querySelectorAll('li').forEach((li) => {
        if (li.parentElement.closest('.icon-text-wrap')) return;
        const iconWrap = li.querySelector('.icon-wrap');
        const textWrap = li.querySelector('.icon-text-wrap') || li;
        const content = extract(document, textWrap);
        if (!content.length) return;
        // a heading/label item without an icon introduces the list
        if (!iconWrap && !list.children.length) { before.push(...content); return; }
        const item = document.createElement('li');
        if (!ordered && iconWrap) {
          const svg = iconWrap.querySelector('svg');
          const img = iconWrap.querySelector('img') || (svg ? svgToImg(document, svg) : null);
          if (img) item.append(img, ' ');
        }
        content.forEach((c, i) => {
          if (c.tagName === 'P' || /^H[1-6]$/.test(c.tagName)) {
            if (i) item.append(document.createElement('br'));
            item.append(...[...c.childNodes]);
          } else {
            item.append(c);
          }
        });
        list.append(item);
      });
    });
    const frag = document.createElement('div');
    frag.append(...before);
    if (list.children.length) frag.append(list);
    first.replaceWith(frag);
    run.slice(1).forEach((r) => r.remove());
  });
}

export default function parse(element, { document, params }) {
  cleanInline(element);
  let variant = catalogVariant(element, params);
  if (variant === undefined) {
    variant = element.querySelector('section.accordian-section, ul.accordion') ? 'accordion' : null;
  }
  const ordered = STEP_VARIANTS.includes(variant);

  // ratings widget: keep the accessible summary only
  element.querySelectorAll('.rating-stars').forEach((r) => {
    const summary = text(r.querySelector('.bv-off-screen'));
    if (summary) r.replaceWith(para(document, summary));
    else r.remove();
  });
  // price block: "<del>$50</del> $40" + fee note
  element.querySelectorAll('.price-block, .pricing-container').forEach((pb) => {
    if (pb.parentElement.closest('.price-block')) return;
    const out = [];
    const price = pb.querySelector('.product-price, .price');
    if (price && text(price)) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.append(...[...price.childNodes]);
      p.append(strong);
      out.push(p);
    }
    pb.querySelectorAll('.pricingtext').forEach((n) => { if (text(n)) out.push(para(document, text(n))); });
    pb.replaceWith(...out);
  });
  // accordion items -> heading + body (block's accordion option builds the panels)
  element.querySelectorAll('ul.accordion > li').forEach((li) => {
    const title = text(li.querySelector('.drawer-header, header'));
    const panel = li.querySelector('.detail-div, [role="region"]');
    const h = document.createElement('h3');
    h.textContent = title;
    const wrap = document.createElement('div');
    wrap.append(h, ...(panel ? extract(document, panel) : []));
    li.replaceWith(wrap);
  });

  buildIconLists(document, element, ordered);

  const columnList = element.querySelector('ul.column-container');
  const columns = columnList ? [...columnList.children].filter((c) => c.matches('li')) : [...element.children];
  const row = columns.map((col) => extract(document, col, { icons: true })).filter((c) => c.length);

  const cells = row.length ? [row] : [];
  const name = variant ? `columns-feature (${variant})` : 'columns-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
