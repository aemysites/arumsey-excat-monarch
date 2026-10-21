/* eslint-disable */
/* global WebImporter */

/**
 * columns-divided parser.
 * Block table: one row, one cell per column (heading, list or text, link).
 *
 * Column sources: .plan-invest-content-wraper (plan/invest tiles -> four-columns)
 * or .item-content (background-container lists -> plain). Divider elements are
 * dropped (the block draws the rules). A CTA below the columns (.inner-button)
 * is appended to the last column.
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
  // empty paragraphs left inside list items
  clone.querySelectorAll('p').forEach((p) => { if (!textOf(p) && !p.querySelector('img')) p.remove(); });
  clone.querySelectorAll('*').forEach((n) => {
    ['class', 'id', 'style', 'role', 'aria-label', 'aria-hidden', 'title'].forEach((a) => n.removeAttribute(a));
  });
  ['class', 'id', 'style', 'role'].forEach((a) => clone.removeAttribute(a));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return clone;
}

function blockEl(document, tag, source) {
  const el = document.createElement(tag);
  el.append(...cleanInline(source).childNodes);
  return el;
}

/** Semantic content of a column in document order. */
function flatten(document, root) {
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((child) => {
      const tag = child.tagName;
      if (/^(SCRIPT|STYLE|SVG|BUTTON|CDS-ICON)$/.test(tag)) return;
      if (child.matches('.separator, .item-divider, [class*="divider"], .ada-hidden, .sr-only')) return;
      if (/^H[1-6]$/.test(tag)) {
        if (textOf(child)) out.push(blockEl(document, tag.toLowerCase(), child));
      } else if (tag === 'P') {
        if (textOf(child)) out.push(blockEl(document, 'p', child));
      } else if (tag === 'UL' || tag === 'OL' || tag === 'TABLE') {
        if (textOf(child)) out.push(cleanInline(child));
      } else if (tag === 'IMG') {
        const src = imgSrc(child);
        if (src) {
          const img = document.createElement('img');
          img.setAttribute('src', src);
          img.setAttribute('alt', (child.getAttribute('alt') || '').trim());
          out.push(img);
        }
      } else if (tag === 'A') {
        const href = (child.getAttribute('href') || '').trim();
        const label = textOf(cleanInline(child));
        if (!label) return;
        const p = document.createElement('p');
        if (href && !href.startsWith('#') && !/^javascript:/i.test(href)) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.textContent = label;
          p.append(a);
        } else {
          p.textContent = label;
        }
        out.push(p);
      } else if ([...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
        && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, table')) {
        out.push(blockEl(document, 'p', child));
      } else {
        walk(child);
      }
    });
  };
  walk(root);
  return out;
}

export default function parse(element, { document, params }) {
  let variant = null;
  let cols = [...element.querySelectorAll('.plan-invest-content-wraper')];
  if (cols.length) {
    variant = 'four-columns';
  } else {
    cols = [...element.querySelectorAll('.item-content')];
  }
  if (!cols.length) {
    const inner = element.querySelector('.inner-items') || element;
    cols = [...inner.children].filter((c) => textOf(c) && !/separator|divider/.test(c.className || ''));
  }
  cols = cols.filter((c, i) => !cols.some((o, j) => j !== i && o.contains(c)));

  const row = cols.map((c) => flatten(document, c)).filter((c) => c.length);

  // CTA below the columns -> end of the last column
  const extra = [];
  element.querySelectorAll('.inner-button, .plan-invest-cta').forEach((b) => {
    if (cols.some((c) => c.contains(b))) return;
    extra.push(...flatten(document, b));
  });
  if (extra.length) {
    if (row.length) row[row.length - 1].push(...extra);
    else row.push(extra);
  }

  const cells = row.length ? [row] : [];
  const name = variant ? `columns-divided (${variant})` : 'columns-divided';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
