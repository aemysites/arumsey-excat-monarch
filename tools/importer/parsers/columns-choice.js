/* eslint-disable */
/* global WebImporter */

/**
 * columns-choice parser.
 * Block table: one row, one cell per column; the source "or" divider becomes a
 * short middle cell (the block turns it into the divider).
 *
 * Variants (generic DOM cues):
 *  - media-promo : image column + copy column (eyebrow, headline, description, CTA)
 *  - with-tables : columns are <table>s split by a divider
 *  - with-icons  : .card-container cards with an icon (inline SVG, omitted)
 *  - plain       : .column-dimensions teaser columns split by a divider
 *
 * Promo CTAs are <button>s without URLs; the primary CTA takes the image link URL.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function cleanInline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, button, cds-icon').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    n.removeAttribute('class');
    n.removeAttribute('id');
    n.removeAttribute('style');
    n.removeAttribute('role');
    n.removeAttribute('aria-label');
    n.removeAttribute('aria-hidden');
  });
  clone.removeAttribute('class');
  clone.removeAttribute('id');
  // drop framework comment nodes (<!---->)
  const doc = clone.ownerDocument;
  const walker = doc.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return clone;
}

function wrap(document, tag, source) {
  const el = document.createElement(tag);
  el.append(...cleanInline(source).childNodes);
  return el;
}

/** Collect block-level semantic content (headings, paragraphs, lists, tables, images, CTA links) in document order. */
function flatten(document, root) {
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((child) => {
      const tag = child.tagName;
      if (/^(SCRIPT|STYLE|SVG|BUTTON|CDS-ICON)$/.test(tag)) return;
      if (child.matches('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden')) return;
      if (/^H[1-6]$/.test(tag)) {
        if (textOf(child)) out.push(wrap(document, tag.toLowerCase(), child));
      } else if (tag === 'P') {
        if (textOf(child)) out.push(wrap(document, 'p', child));
      } else if (tag === 'UL' || tag === 'OL' || tag === 'TABLE') {
        if (textOf(child)) out.push(cleanInline(child));
      } else if (tag === 'IMG') {
        const src = imgSrc(child);
        if (src) {
          const img = document.createElement('img');
          img.setAttribute('src', src);
          img.setAttribute('alt', (child.getAttribute('alt') || '').replace(/\s+/g, ' ').trim());
          out.push(img);
        }
      } else if (tag === 'A') {
        const href = (child.getAttribute('href') || '').trim();
        const label = textOf(cleanInline(child));
        if (href && !href.startsWith('#') && !/^javascript:/i.test(href) && label) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.textContent = label;
          p.append(a);
          out.push(p);
        } else if (child.querySelector('img')) {
          walk(child);
        } else if (label) {
          out.push(wrap(document, 'p', child));
        }
      } else if (child.children.length === 0 || [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        // leaf or mixed-content container -> one paragraph
        if (textOf(child)) out.push(wrap(document, 'p', child));
      } else {
        walk(child);
      }
    });
  };
  walk(root);
  return out;
}

function promoColumns(document, element) {
  const img = element.querySelector('.reskin-image-container img, img');
  const imgLink = img ? img.closest('a[href]') : null;
  const imageCell = [];
  if (img && imgSrc(img)) {
    const out = document.createElement('img');
    out.setAttribute('src', imgSrc(img));
    out.setAttribute('alt', (img.getAttribute('alt') || '').replace(/\s+/g, ' ').trim());
    imageCell.push(out);
  }
  const copy = [];
  element.querySelectorAll('.eyebrow, .headline, .description, .disclosure p').forEach((n) => {
    if (!textOf(n)) return;
    if (n.matches('.headline')) copy.push(wrap(document, 'h2', n));
    else copy.push(wrap(document, 'p', n));
  });
  const actions = [];
  element.querySelectorAll('app-reskin-cta a[href], app-reskin-cta button, a.cds-button[href]').forEach((cta) => {
    const label = textOf(cleanInline(cta));
    let href = cta.getAttribute('href');
    if (!href && cta.tagName === 'BUTTON' && /primary/.test(cta.className) && imgLink) href = imgLink.getAttribute('href');
    if (!href || !label || actions.some((a) => a.textContent === label)) return;
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = label;
    actions.push(a);
  });
  if (actions.length) {
    const p = document.createElement('p');
    actions.forEach((a, i) => { if (i) p.append(' '); p.append(a); });
    copy.push(p);
  }
  // image column position follows the source order
  const imageFirst = img && copy.length
    && (element.querySelector('.reskin-image-container, app-reskin-image').compareDocumentPosition(
      element.querySelector('.reskin-copy') || element,
    ) & 4);
  const cols = [];
  if (imageFirst) cols.push(imageCell, copy);
  else cols.push(copy, imageCell);
  return cols.filter((c) => c.length);
}

export default function parse(element, { document, params }) {
  let variant = null;
  let columns = [];
  let dividerText = '';

  const tables = [...element.querySelectorAll('table')].filter((t) => !t.parentElement.closest('table'));
  const teaserCols = [...element.querySelectorAll('.column-dimensions')];
  const cardCols = [...element.querySelectorAll('.card-container')].filter((c) => !c.parentElement.closest('.card-container'));
  const dividerEl = element.querySelector('.table-divider-text, .tile-divider-text, .card-mid-text, [class*="divider-text"]');
  if (dividerEl) dividerText = textOf(dividerEl);

  if (element.querySelector('.reskin-image-container, app-reskin-image')) {
    variant = 'media-promo';
    columns = promoColumns(document, element);
    dividerText = '';
  } else if (tables.length >= 2) {
    variant = 'with-tables';
    columns = tables.map((t) => {
      const copy = t.cloneNode(true);
      // figure + caption spans render as one run of text; keep them apart
      copy.querySelectorAll('[class*="content-header"]').forEach((h) => {
        const strong = document.createElement('strong');
        strong.append(...h.childNodes);
        h.replaceWith(strong);
        if (strong.nextSibling) strong.after(document.createElement('br'));
      });
      return [cleanInline(copy)];
    });
  } else if (cardCols.length >= 2) {
    variant = element.querySelector('cds-icon, .cds-icon, img') ? 'with-icons' : null;
    columns = cardCols.map((c) => flatten(document, c));
  } else if (teaserCols.length) {
    columns = teaserCols.map((c) => flatten(document, c));
  } else {
    columns = [...element.children]
      .filter((c) => !c.matches('[class*="divider"], .card-mid-text') && textOf(c))
      .map((c) => flatten(document, c));
  }

  columns = columns.filter((c) => c.length);
  const row = [];
  columns.forEach((col, i) => {
    if (i && dividerText && dividerText.length <= 4 && columns.length === 2) row.push(dividerText.toLowerCase());
    row.push(col);
  });

  const cells = row.length ? [row] : [];
  const name = variant ? `columns-choice (${variant})` : 'columns-choice';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
