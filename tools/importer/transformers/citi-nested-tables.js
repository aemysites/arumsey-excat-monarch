/* eslint-disable */
/* global WebImporter */

/**
 * Source data tables (rates, fees) must not reach html2md as bare tables: in Edge Delivery content a
 * table is a block named by its first cell (a fee table became a "deposit-account" block), and a
 * table inside a block cell breaks the grid conversion of the whole block.
 *
 * beforeTransform (before block discovery): mark every table that exists in the source page.
 * afterTransform: every marked table is a data table.
 *  - inside a block cell: the cell's content moves to a fragment document, with each data table
 *    wrapped as a `table-rates` block, and the cell links to the fragment (blocks load a cell that
 *    holds only a /fragments/ link from that fragment);
 *  - anywhere else: wrapped as a `table-rates` block in place.
 */

const MARK = 'data-citi-data-table';

function pagePath(params) {
  try {
    const p = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    return p || '/index';
  } catch (e) {
    return '/index';
  }
}

function slug(text) {
  return (text || 'block').toLowerCase().replace(/\(.*\)/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'block';
}

function wrapAsBlock(document, table) {
  const cells = [...table.rows].map((row) => [...row.cells].map((cell) => {
    const div = document.createElement('div');
    div.append(...cell.childNodes);
    return div;
  }));
  if (!cells.length) {
    table.remove();
    return;
  }
  table.replaceWith(WebImporter.Blocks.createBlock(document, { name: 'table-rates', cells }));
}

export default function transform(hookName, element, payload) {
  const document = (element && element.ownerDocument) || (payload && payload.document);
  if (!document) return;

  if (hookName === 'beforeTransform') {
    document.querySelectorAll('table').forEach((t) => t.setAttribute(MARK, ''));
    // WebImporter's createTable pads every <tr> inside a new block, nested tables included, and
    // throws on a row with no cells: a parser keeping such a table in a cell loses its block.
    document.querySelectorAll('tr').forEach((tr) => {
      if (!tr.querySelector('td, th')) tr.remove();
    });
    return;
  }
  if (hookName !== 'afterTransform') return;

  const root = element || document.body;
  const params = (payload && payload.params) || {};
  if (!Array.isArray(params.fragments)) params.fragments = [];
  const isData = (t) => t.hasAttribute(MARK);
  // Outermost data tables only; a table nested in a data table goes with it.
  const dataTables = [...root.querySelectorAll(`table[${MARK}]`)]
    .filter((t) => !t.parentElement || !t.parentElement.closest(`table[${MARK}]`));

  const counters = {};
  dataTables.forEach((table) => {
    if (!table.isConnected) return;
    const cell = table.closest('td, th');
    const blockTable = cell && cell.closest('table');
    if (cell && blockTable && !isData(blockTable)) {
      const name = slug(blockTable.rows[0] && blockTable.rows[0].textContent.trim());
      counters[name] = (counters[name] || 0) + 1;
      const path = `/fragments${pagePath(params)}/${name}-${counters[name]}`;
      const holder = document.createElement('div');
      holder.append(...cell.childNodes);
      [...holder.querySelectorAll(`table[${MARK}]`)]
        .filter((t) => !t.parentElement.closest(`table[${MARK}]`))
        .forEach((t) => wrapAsBlock(document, t));
      const link = document.createElement('a');
      link.href = path;
      link.textContent = path;
      cell.append(link);
      params.fragments.push({ element: holder, path });
      return;
    }
    wrapAsBlock(document, table);
  });

  root.querySelectorAll(`[${MARK}]`).forEach((t) => t.removeAttribute(MARK));
  params.fragments.forEach(({ element: frag }) => {
    if (frag && frag.querySelectorAll) frag.querySelectorAll(`[${MARK}]`).forEach((t) => t.removeAttribute(MARK));
  });
}
