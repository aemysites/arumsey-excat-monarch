/* eslint-disable */
/* global WebImporter */

/**
 * columns-icon-strip parser.
 * Block table: one row; first cell = strip title (heading + optional eyebrow),
 * each further cell = one item: icon image, eyebrow text, link title, optional
 * heading/body text (with-body-text).
 *
 * Source families (first that matches):
 *  - crosslink (app-cross-link / cds-cross-link): .crosslink__text + section.additional-options
 *  - icon text tiles (AEM column control): .citi-rte heading + .citi-icon-text-tile
 *  - pdp "more Citi" row: .flex-column (first column without icon is the title)
 *
 * Variants:
 *  - light: cds-cross-link markup / bordered items (.additional-options.with-border)
 *  - with-body-text: items carry their own heading (h3/h4) plus body text
 * Inline SVG icons (cds-icon) have no hosted asset and are omitted.
 * Tooltip popups are UI chrome and dropped.
 */

const CHROME = 'script, style, svg, cds-icon, button, aem-tooltip, citi-tooltip, .tooltipSufix, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0], img.getAttribute('data-desktop-src')];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function makeImg(document, img) {
  const src = imgSrc(img);
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  const alt = (img.getAttribute('alt') || '').trim();
  out.setAttribute('alt', /^gbIcon\d*$/i.test(alt) ? '' : alt);
  return out;
}

function clean(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('img').forEach((n) => n.remove());
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target', 'title'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return clone;
}

function para(document, el, tag = 'p') {
  if (!el || !textOf(clean(el))) return null;
  const p = document.createElement(tag);
  const c = clean(el);
  // unwrap nested block wrappers (e.g. <div class="eyebrow"><p>..</p></div>)
  c.querySelectorAll('p, div, section, article, h1, h2, h3, h4, h5, h6').forEach((n) => n.replaceWith(...n.childNodes));
  p.append(...c.childNodes);
  return p;
}

function linkPara(document, a) {
  const href = (a.getAttribute('href') || '').trim();
  const label = textOf(clean(a));
  if (!label) return null;
  const p = document.createElement('p');
  if (href && !href.startsWith('#') && !/^javascript:/i.test(href)) {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = label;
    p.append(link);
  } else {
    p.textContent = label;
  }
  return p;
}

function headingOf(document, el) {
  if (!el) return null;
  const h = el.matches('h1, h2, h3, h4, h5, h6') ? el : el.querySelector('h1, h2, h3, h4, h5, h6');
  if (h) return para(document, h, h.tagName.toLowerCase());
  return para(document, el, 'h2');
}

function firstIcon(document, root) {
  const img = [...root.querySelectorAll('img')].find((i) => !i.closest('a') && imgSrc(i));
  return img ? makeImg(document, img) : null;
}

function crosslink(document, element) {
  const cells = [];
  const title = [];
  const text = element.querySelector('.crosslink__text');
  if (text) {
    const h = headingOf(document, text.querySelector('.headline') || text.querySelector('h1, h2, h3, h4, h5, h6'));
    if (h) title.push(h);
    const eyebrow = text.querySelector(':scope > .eyebrow');
    const e = eyebrow && para(document, eyebrow);
    if (e) title.push(e);
  }
  if (title.length) cells.push(title);
  element.querySelectorAll('.additional-options').forEach((item) => {
    const c = [];
    const icon = firstIcon(document, item.querySelector('.icon-wrapper') || item);
    if (icon) c.push(icon);
    const eyebrow = item.querySelector('.eyebrow');
    const e = eyebrow && para(document, eyebrow);
    if (e) c.push(e);
    item.querySelectorAll('a[href]').forEach((a) => {
      const p = linkPara(document, a);
      if (p) c.push(p);
    });
    if (c.length) cells.push(c);
  });
  return cells;
}

function iconTiles(document, element) {
  const cells = [];
  const tiles = [...element.querySelectorAll('.citi-icon-text-tile')];
  const titleEl = [...element.querySelectorAll('.citi-rte, h1, h2, h3')].find((n) => !tiles.some((t) => t.contains(n)));
  const h = titleEl && headingOf(document, titleEl);
  if (h) cells.push([h]);
  tiles.forEach((tile) => {
    const c = [];
    const icon = firstIcon(document, tile.querySelector('.citi-icon-text-tile__image-wrapper') || tile);
    if (icon) c.push(icon);
    const content = tile.querySelector('.citi-icon-text-tile__content-wrapper') || tile;
    content.querySelectorAll('.citi-icon-text-tile-heading, .citi-icon-text-tile-description').forEach((part) => {
      const blocks = [...part.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > ul, :scope > ol')];
      if (!blocks.length) {
        const p = para(document, part);
        if (p) c.push(p);
        return;
      }
      blocks.forEach((b) => {
        const tag = b.tagName.toLowerCase();
        const p = (tag === 'ul' || tag === 'ol') ? (textOf(b) ? clean(b) : null) : para(document, b, tag);
        if (p) c.push(p);
      });
    });
    if (c.length) cells.push(c);
  });
  return cells;
}

function flexColumns(document, element) {
  const cells = [];
  element.querySelectorAll('.flex-column').forEach((col) => {
    const c = [];
    const icon = firstIcon(document, col);
    if (icon) c.push(icon);
    const txt = col.querySelector('.colTxt') || col;
    [...txt.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .text, .lowerDesc')]
      .filter((n) => !n.closest('aem-tooltip, citi-tooltip, .tooltipSufix'))
      .filter((n, i, all) => !all.some((o, j) => j !== i && o.contains(n)))
      .forEach((n) => {
        const tag = /^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : 'p';
        const p = para(document, n, tag);
        if (p) c.push(p);
      });
    if (c.length) cells.push(c);
  });
  return cells;
}

export default function parse(element, { document, params }) {
  let cells;
  if (element.querySelector('.additional-options')) cells = crosslink(document, element);
  else if (element.querySelector('.citi-icon-text-tile')) cells = iconTiles(document, element);
  else if (element.querySelector('.flex-column')) cells = flexColumns(document, element);
  else {
    cells = [...element.children].map((child) => {
      const c = [];
      const icon = firstIcon(document, child);
      if (icon) c.push(icon);
      const p = para(document, child);
      if (p) c.push(p);
      return c;
    }).filter((c) => c.length);
  }

  let variant = null;
  if (element.matches('cds-cross-link') || element.querySelector('cds-cross-link, .additional-options.with-border')) {
    variant = 'light';
  } else if (element.querySelector('.flex-column h3, .flex-column h4, .additional-options h3, .citi-icon-text-tile h3')) {
    variant = 'with-body-text';
  }

  const rows = cells.length ? [cells] : [];
  const name = variant ? `columns-icon-strip (${variant})` : 'columns-icon-strip';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: rows });
  element.replaceWith(block);
}
