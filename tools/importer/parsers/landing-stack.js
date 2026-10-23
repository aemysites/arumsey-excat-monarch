/* eslint-disable */
/* global WebImporter */

/**
 * Parser: landing-stack
 * Source: a whole Block Advisors landing page main (body > main with
 *   ba-tax-prep-checklist / ba-help-me-choose web components): a stack of
 *   section.column-control panels, experience fragments, a full-bleed image
 *   banner and a tab set.
 * Layout (blocks/landing-stack/README.md): many rows, one per landing panel;
 *   cells are the panel's columns (text, image or image gallery); image-only
 *   rows become image strips. Tab panels become one row each, led by the tab label.
 */

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


function normalizeWidgets(document, root) {
  root.querySelectorAll('span.hide, .sticky-header-btn, ba-tax-prep-checklist, ba-help-me-choose').forEach((n) => n.remove());
  root.querySelectorAll('.rating-stars').forEach((r) => {
    const summary = text(r.querySelector('.bv-off-screen'));
    if (summary) r.replaceWith(para(document, summary));
    else r.remove();
  });
  // price sections: label heading, "Starting at", price (strike kept), fee note
  root.querySelectorAll('.card-price-section').forEach((sec) => {
    const out = [];
    sec.querySelectorAll('h3, h4').forEach((h) => { if (text(h)) out.push(para(document, text(h))); });
    const label = text(sec.querySelector('.copy-small-t, .copy-small'));
    if (label) out.push(para(document, label));
    const price = sec.querySelector('.product-price') || sec.querySelector('strong.price, .price');
    if (price && text(price)) {
      const strong = document.createElement('strong');
      strong.textContent = text(price);
      out.push(para(document, strong));
    }
    sec.querySelectorAll('.pricingtext').forEach((n) => { if (text(n)) out.push(para(document, text(n))); });
    sec.replaceWith(...out);
  });
  // full-bleed banner images: keep only the desktop rendition
  root.querySelectorAll('.fb-image-wrapper .image-container').forEach((ic) => {
    const imgs = [...ic.querySelectorAll('img')];
    const keep = imgs.find((i) => i.classList.contains('show-large')) || imgs[0];
    imgs.forEach((i) => { if (i !== keep) i.remove(); });
  });
}

function columnsOf(section) {
  const list = section.querySelector(':scope > .container > ul.column-container, ul.column-container');
  return list ? [...list.children].filter((c) => c.matches('li')) : [];
}

function panelRow(document, panel) {
  const cols = columnsOf(panel);
  const cells = (cols.length ? cols : [panel])
    .map((c) => extract(document, c))
    .filter((c) => c.length);
  return cells;
}

function collectRows(document, node, rows) {
  [...node.children].forEach((child) => {
    if (!text(child) && !child.querySelector('img, picture, iframe')) return;
    if (child.matches('div.reframe-tabs')) {
      const labels = [...child.querySelectorAll('[role="tab"]')].map((t) => text(t));
      [...child.querySelectorAll('[role="tabpanel"]')].forEach((panel, i) => {
        panel.removeAttribute('style');
        if (labels[i]) {
          const h = document.createElement('h3');
          h.textContent = labels[i];
          rows.push([[h]]);
        }
        collectRows(document, panel, rows);
      });
      return;
    }
    if (child.matches('section.column-control') && columnsOf(child).length) {
      const row = panelRow(document, child);
      if (row.length) rows.push(row);
      return;
    }
    if (child.matches('div.fb-image-wrapper')) {
      const img = child.querySelector('.image-container img');
      const rest = child.cloneNode(true);
      rest.querySelectorAll('.image-container').forEach((n) => n.remove());
      const content = extract(document, rest);
      const row = [];
      if (content.length) row.push(content);
      if (img) row.push([img]);
      if (row.length) rows.push(row);
      return;
    }
    if (child.matches('div, section, article') && child.children.length) {
      collectRows(document, child, rows);
      return;
    }
    const content = extract(document, { childNodes: [child] });
    if (content.length) rows.push([content]);
  });
}

export default function parse(element, { document }) {
  cleanInline(element);
  normalizeWidgets(document, element);

  const rows = [];
  collectRows(document, element, rows);

  const block = WebImporter.Blocks.createBlock(document, { name: 'landing-stack', cells: rows });
  // the instance root is <main> itself: keep the element (later rules and the
  // html2md pass look for main) and swap its content for the block
  if (element.tagName === 'MAIN') element.replaceChildren(block);
  else element.replaceWith(block);
}
