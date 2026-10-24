/* eslint-disable */
/* global WebImporter */

/**
 * Parser: table-comparison
 * Source: suncorp.com.au comparison / data tables: sg-Table <table>s and
 * "flextable" grids laid out as tables (cells carry a CSS `order` = visual row).
 *
 * Block table (blocks/table-comparison/README.md):
 *   optional leading single-cell rows (intro heading/text), then the column header
 *   row (plan names, CTA links), then one row per table row.
 * Tick / cross font icons become ✓ / ✗ when present. (Note: the importer strips
 * empty <i> icons before parsing, so icon-only cells can arrive empty.)
 *
 * The catalog sometimes maps single <tr> rows of one table to this block (and its
 * header row to cards-feature). Whichever row is parsed first converts the WHOLE
 * table; the other rows are then detached and skipped by the importer.
 *
 * Variant classes (from markup, matching the catalog names):
 *   flextable tables: image-* prefix when cells hold images; cyan-grey-light when
 *     value cells are neutral-tinted; else cyan-grey
 *   <table>: image-grey when header cells are colour-filled; dark when the
 *     top-left header cell is empty; else no class
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function orderOf(cell) {
  const m = (cell.getAttribute('style') || '').match(/(?:^|;)\s*order\s*:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

function topLevel(root, selector) {
  const all = [...root.querySelectorAll(selector)];
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
}

const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE)$/;
const WRAPPER_TAGS = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|FIGURE|SPAN)$/;

/** Cell content: clean rich text, tick/cross icons as symbols, buttons as links. */
function cellContent(cell, document) {
  cell.querySelectorAll('style, script, noscript, .image-data-container, .image-lazyload, .sg-u-hidden:not(img)').forEach((e) => e.remove());
  cell.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
  cell.querySelectorAll('img.vs-badge-image:not(.badge-desktop)').forEach((img) => img.remove());
  const icons = [...cell.querySelectorAll('i[class*="Icon-"]')];
  icons.forEach((i) => {
    const tick = /Icon-tick/.test(i.className);
    const cross = /Icon-cross/.test(i.className);
    // Import snapshots already put ✓ / ✗ text in these icons; always keep the mark.
    if (tick || cross) i.replaceWith(document.createTextNode(tick ? '✓' : '✗'));
    else i.remove();
  });
  cell.querySelectorAll('a.sg-Btn').forEach((a) => {
    a.textContent = text(a);
    a.removeAttribute('class');
  });
  const out = document.createElement('div');
  const walk = (node, target) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 1 && WRAPPER_TAGS.test(child.tagName) && child.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol, div')) {
        walk(child, target);
      } else if (child.nodeType === 1 && child.tagName === 'DIV') {
        if (text(child) || child.querySelector('img')) target.append(...child.childNodes);
      } else if (child.nodeType === 1 && child.tagName === 'P' && !text(child) && !child.querySelector('img')) {
        // drop empty spacer paragraphs
      } else {
        target.append(child);
      }
    });
  };
  walk(cell, out);
  if (!text(out) && !out.querySelector('img')) return '';
  return out;
}

function fromHtmlTable(table, document) {
  const rows = [...table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tr, :scope > tfoot > tr')];
  const cols = Math.max(...rows.map((r) => r.children.length), 0);
  return rows.map((tr) => {
    const cells = [...tr.children].map((c) => cellContent(c, document));
    while (cells.length < cols) cells.push('');
    return cells;
  });
}

function fromFlextable(flex, document) {
  let cells = [...flex.children].filter((c) => c.matches('.sg-Flextable-cell'));
  const orders = cells.map(orderOf);
  const groups = new Map();
  if (orders.every((o) => o !== null)) {
    cells.forEach((c) => {
      const o = orderOf(c);
      if (!groups.has(o)) groups.set(o, []);
      groups.get(o).push(c);
    });
  } else {
    const n = Number((flex.className.match(/sg-Flextable--(\d+)cols/) || [])[1]) || 1;
    for (let i = 0; i < cells.length; i += n) groups.set(i, cells.slice(i, i + n));
  }
  let rows = [...groups.keys()].sort((a, b) => a - b).map((k) => groups.get(k));
  // Columns that only hold mobile labels (visually hidden on large screens).
  const width = Math.max(...rows.map((r) => r.length));
  const hiddenCols = [];
  for (let i = 0; i < width; i += 1) {
    const body = rows.slice(1).filter((r) => r[i]);
    if (body.length && body.every((r) => r[i].matches('.sg-u-visuallyhiddenLarge'))) hiddenCols.push(i);
  }
  rows = rows.map((r) => r.filter((c, i) => !hiddenCols.includes(i) && !c.matches('.sg-u-visuallyhiddenLarge')));
  cells = null;
  const cols = Math.max(...rows.map((r) => r.length));
  return rows.map((r) => {
    const out = r.map((c) => cellContent(c, document));
    while (out.length < cols) out.push('');
    return out;
  }).filter((r) => r.some((c) => c));
}

function detectVariant(kind, source) {
  if (kind === 'flex') {
    const img = !!source.querySelector('img:not(.vs-badge-image), img.badge-desktop');
    const light = !!source.querySelector(':scope > .sg-Flextable-cell--neutral');
    if (img) return light ? 'image-cyan-grey-light' : 'image-cyan-grey';
    return light ? 'cyan-grey-light' : 'cyan-grey';
  }
  const firstRow = source.querySelector('tr');
  if (!firstRow) return null;
  const head = [...firstRow.children];
  if (head.some((c) => /sg-u-bg/.test(c.className))) return 'image-grey';
  if (head.length > 2 && !text(head[0]) && !head[0].querySelector('img')) return 'dark';
  return null;
}

/**
 * Converts the comparison table the element belongs to.
 * Returns { target, block } where target is the node to replace.
 */
function convertComparison(element, document) {
  let target = element;
  let table = null;
  let flex = null;
  if (element.matches('tr, td, th, thead, tbody')) {
    table = element.closest('table');
    target = table.closest('.sg-Overflow-container') || table;
  } else if (element.matches('table')) {
    table = element;
  } else {
    table = element.querySelector('table');
    if (!table) flex = element.matches('.sg-Flextable') ? element : topLevel(element, '.sg-Flextable')[0];
  }

  const cells = [];
  // Intro rich text inside the element, before the table.
  if (target === element && !element.matches('table, .sg-Flextable')) {
    const tableEl = table || flex;
    topLevel(element, 'div.rte').filter((r) => tableEl && !tableEl.contains(r) && text(r))
      // eslint-disable-next-line no-bitwise
      .filter((r) => r.compareDocumentPosition(tableEl) & 4)
      .forEach((r) => {
        r.querySelectorAll('.sg-u-mediumAndSmallHidden').forEach((s) => s.classList.remove('sg-u-mediumAndSmallHidden'));
        const c = document.createElement('div');
        c.append(...r.childNodes);
        cells.push([c]);
      });
  }

  let rows = [];
  let variant = null;
  if (table) {
    variant = detectVariant('table', table);
    rows = fromHtmlTable(table, document);
  } else if (flex) {
    variant = detectVariant('flex', flex);
    rows = fromFlextable(flex, document);
  }
  // Intro rows stay single-cell: the block reads leading 1-cell rows as intro.
  cells.push(...rows);

  const name = variant ? `table-comparison (${variant})` : 'table-comparison';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  return { target, block };
}

export default function parse(element, { document, params }) {
  const { target, block } = convertComparison(element, document);
  if (target === element) element.replaceWith(block);
  else target.replaceWith(block);
}
