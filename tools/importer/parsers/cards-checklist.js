/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-checklist
 * Source: suncorp.com.au tick-list columns (covered events, product features,
 * useful-link lists, image + tick/cross caption columns).
 *
 * Block table (blocks/cards-checklist/README.md): each cell is a column
 * (optional image, optional intro, bulleted list); a cell without a list is a
 * full-width note. All columns go in the first row; notes (e.g. the footnote
 * under the grid) follow as single-cell rows padded to the column count.
 * Cross list items (li.Icon-cross-*) start with :cross: so the block keeps the icon.
 * A heading above the columns stays as default content before the block.
 *
 * Variant classes (from markup, matching the catalog names):
 *   image     - columns carry images
 *   image-alt - columns open with an intro paragraph above the list
 *   light     - columns sit on a neutral (light grey) panel
 */

const JUNK = 'style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .SplitLine';

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function hasContent(el) {
  return !!(text(el) || el.querySelector('img'));
}

function topLevel(root, selector) {
  const all = [...root.querySelectorAll(selector)];
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
}

function cleanNode(root) {
  root.querySelectorAll(JUNK).forEach((el) => el.remove());
  root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
}

function columnsOf(element) {
  const tables = topLevel(element, '.sg-Flextable');
  if (tables.length) return tables.flatMap((t) => [...t.children].filter((c) => c.matches('.sg-Flextable-cell')));
  const rows = [...element.querySelectorAll('.sg-Grid-row')]
    .filter((r) => [...r.children].filter(hasContent).length >= 1)
    .filter((r) => ![...r.querySelectorAll('.sg-Grid-row')].some((inner) => [...inner.children].filter(hasContent).length >= 2));
  if (rows.length) return rows.flatMap((r) => [...r.children]);
  return [element];
}

function buildColumn(col, document) {
  cleanNode(col);
  const cell = document.createElement('div');
  const img = [...col.querySelectorAll('img')].find((i) => !i.closest('li, p'));
  if (img) cell.append(img);
  col.querySelectorAll('li').forEach((li) => {
    if (/(^|\s)Icon-cross/.test(li.className) && !/^:cross:/.test(text(li))) li.prepend(':cross: ');
    // leading &nbsp; spacing
    const first = li.firstChild;
    if (first && first.nodeType === 3) first.textContent = first.textContent.replace(/^[\s ]+/, '');
  });
  topLevel(col, 'div.rte').forEach((rte) => cell.append(...rte.childNodes));
  if (!topLevel(col, 'div.rte').length) {
    [...col.querySelectorAll('p, ul, ol, h1, h2, h3, h4, h5, h6')]
      .filter((n) => !n.parentElement.closest('ul, ol, p'))
      .forEach((n) => cell.append(n));
  }
  return hasContent(cell) ? cell : null;
}

function detectVariant(element, columns) {
  if (columns.some((c) => [...c.querySelectorAll('img')].some((i) => !i.closest('li, p')))) return 'image';
  const intro = columns.some((c) => {
    const rte = c.querySelector('div.rte');
    const first = rte && rte.firstElementChild;
    return first && first.tagName === 'P' && rte.querySelector('ul, ol');
  });
  if (intro) return 'image-alt';
  if (element.matches('.sg-Cell--neutral') || element.querySelector('.sg-Cell--neutral, .canvas__bg_image.BgPlaceholder--neutral')) return 'light';
  return null;
}

export default function parse(element, { document, params }) {
  const columns = columnsOf(element);
  const variant = detectVariant(element, columns);
  const inColumns = (el) => columns.some((c) => c.contains(el) || el.contains(c));

  // Rich text outside the columns: a heading before the grid stays default
  // content; text after the grid becomes a note row.
  const before = [];
  const notes = [];
  if (columns[0] !== element) {
    topLevel(element, 'div.rte').filter((r) => !inColumns(r) && hasContent(r)).forEach((r) => {
      cleanNode(r);
      // eslint-disable-next-line no-bitwise
      const isBefore = r.compareDocumentPosition(columns[0]) & 4;
      const onlyHeading = [...r.children].every((c) => /^H[1-6]$/.test(c.tagName));
      if (isBefore && onlyHeading) before.push(...r.children);
      else {
        const note = document.createElement('div');
        note.append(...r.childNodes);
        notes.push(note);
      }
    });
  }

  const cols = columns.map((c) => buildColumn(c, document)).filter(Boolean);
  const cells = [];
  if (cols.length) cells.push(cols);
  const width = Math.max(cols.length, 1);
  notes.forEach((n) => cells.push([n, ...Array(width - 1).fill('')]));

  const name = variant ? `cards-checklist (${variant})` : 'cards-checklist';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (before.length) element.before(...before);
  element.replaceWith(block);
}
