/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-pill
 * Source: div.reframe-tabs (pill tab list [role=tab] + [role=tabpanel] panels).
 * Layout (blocks/tabs-pill/README.md): one row per tab: [tab label | panel content].
 * Blocks cannot nest, so a panel with complex content (pricing/feature cards,
 * multi-column layouts, images, tables) is moved to its own fragment document:
 * the cell holds only a link to /fragments/<page-slug>-tab-<n> (tabs-pill.js
 * loads it with loadFragment) and the panel content is pushed onto
 * params.fragments as { element, path }. Inside the fragment, card grids become
 * cards-pricing / cards-feature blocks and other multi-column rows become
 * columns-feature blocks; single-column content stays default content.
 * Simple text / list panels stay inline.
 */

import parseSavingsCalculator from './savings-calculator.js';

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


function pageSlug(params) {
  try {
    const parts = new URL(params && params.originalURL).pathname.split('/').filter(Boolean);
    return (parts[parts.length - 1] || 'index').replace(/\.html?$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  } catch (e) {
    return 'page';
  }
}

function topColumns(section) {
  const list = section.querySelector(':scope > .container > ul.column-container')
    || section.querySelector('ul.column-container');
  if (!list) return [];
  return [...list.children].filter((li) => li.matches('li') && (text(li) || li.querySelector('img, svg')));
}

function isComplex(panel) {
  if (panel.querySelector('.card-v2, article, table, .featurecard, img, picture, iframe, .cq-dd-image')) return true;
  return [...panel.querySelectorAll('section.column-control')].some((s) => topColumns(s).length > 1);
}

/* ---- fragment content builder ---- */
function pricingCardBody(document, card) {
  const body = [];
  const h = card.querySelector('h1, h2, h3, h4');
  if (h && text(h)) { const nh = document.createElement('h3'); nh.textContent = text(h); body.push(nh); }
  const head = card.querySelector('.card-head') || card;
  head.querySelectorAll(':scope > p').forEach((p) => { if (text(p)) body.push(p); });
  const list = head.querySelector('ul');
  if (list && text(list)) {
    const ul = document.createElement('ul');
    [...list.children].forEach((li) => { if (text(li)) { const n = document.createElement('li'); n.textContent = text(li); ul.append(n); } });
    body.push(ul);
  }
  card.querySelectorAll('.card-price-section').forEach((sec) => {
    const label = text(sec.querySelector('.copy-small'));
    if (label) body.push(para(document, label));
    const price = sec.querySelector('.product-price') || sec.querySelector('strong');
    if (price && text(price)) body.push(para(document, text(price)));
  });
  card.querySelectorAll('.pricingtext').forEach((pt) => {
    pt.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
    if (text(pt)) body.push(para(document, text(pt)));
  });
  card.querySelectorAll('.card-footer a, .card-footer button').forEach((c) => { if (text(c)) body.push(ctaPara(document, c)); });
  return body;
}

function buildUnits(document, node, out) {
  [...node.children].forEach((child) => {
    if (!text(child) && !child.querySelector('img, picture, iframe, svg')) return;
    // S Corp savings calculator widget (business formation "LLC + S Corp" panel):
    // a savings-calculator block (+ its quiz strip as default content) in the fragment
    if (child.matches('.tax-saving-cal-container')) {
      out.push(...parseSavingsCalculator(child, { document }));
      return;
    }
    if (child.matches('section.column-control')) {
      const cols = topColumns(child);
      if (cols.length > 1) {
        const pricing = cols.every((c) => c.querySelector('.card-v2'));
        const stacked = cols.every((c) => c.querySelector('article.card-stacked'));
        if (pricing) {
          // (cards-pricing table inside a tab panel fragment, not the tabs-pill rows themselves)
          // first cell = card ribbon label (div.card-ribbon-v2), as the cards-pricing parser does
          const rows = cols.map((c) => {
            const ribbon = !c.closest('.hide-ribbon') ? c.querySelector('.card-ribbon-v2') : null;
            return [ribbon && text(ribbon) ? text(ribbon) : '', pricingCardBody(document, c.querySelector('.card-v2'))];
          });
          out.push(WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells: rows }));
        } else if (stacked) {
          const rows = cols.map((c) => {
            const card = c.querySelector('article.card-stacked');
            const img = card.querySelector('.cmp-column--image img');
            if (img) img.closest('.cmp-column--image').remove();
            return [img || '', extract(document, card)];
          });
          out.push(WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells: rows }));
        } else {
          const row = cols.map((c) => {
            c.querySelectorAll('.card-v2').forEach((card) => {
              const wrap = document.createElement('div');
              wrap.append(...pricingCardBody(document, card));
              card.replaceWith(wrap);
            });
            return extract(document, c);
          }).filter((c) => c.length);
          if (row.length) out.push(WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells: [row] }));
        }
        return;
      }
      if (cols.length === 1) { buildUnits(document, cols[0], out); return; }
    }
    if (child.matches('div, section') && child.querySelector('section.column-control')) {
      buildUnits(document, child, out);
      return;
    }
    out.push(...extract(document, { childNodes: [child] }));
  });
}

export default function parse(element, { document, params }) {
  element.querySelectorAll('span.reader, span.hide').forEach((n) => n.remove());
  cleanInline(element);

  const tabs = [...element.querySelectorAll('[role="tab"]')].filter((t) => text(t));
  const panels = [...element.querySelectorAll('[role="tabpanel"]')];

  const slug = pageSlug(params);
  if (params) params.tabsPillCount = (params.tabsPillCount || 0) + 1;
  const prefix = params && params.tabsPillCount > 1 ? `${slug}-${params.tabsPillCount}` : slug;

  const cells = [];
  panels.forEach((panel, i) => {
    panel.removeAttribute('style');
    const label = text(tabs[i]) || `Tab ${i + 1}`;
    if (isComplex(panel) && params && Array.isArray(params.fragments)) {
      const path = `/fragments/${prefix}-tab-${i + 1}`;
      const fragment = document.createElement('div');
      const units = [];
      buildUnits(document, panel, units);
      fragment.append(...units);
      params.fragments.push({ element: fragment, path });
      const a = document.createElement('a');
      a.href = path;
      a.textContent = path;
      cells.push([label, para(document, a)]);
    } else {
      const content = extract(document, panel);
      cells.push([label, content.length ? content : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-pill', cells });
  element.replaceWith(block);
}
