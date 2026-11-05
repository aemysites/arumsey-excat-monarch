/*
 * Columns Pricing
 * Row 1: [intro content | highlighted panel content]
 * Rows 2+: pricing table rows (first one is the header row), any number of cells.
 * The table is appended to the first (intro) column.
 */
// a cell holding a single paragraph keeps only the paragraph's content
function cellContent(cell) {
  const only = cell.children.length === 1 && cell.firstElementChild;
  if (only && only.tagName === 'P' && cell.textContent.trim() === only.textContent.trim()) {
    return [...only.childNodes];
  }
  return [...cell.childNodes];
}

function buildTable(rows) {
  const table = document.createElement('table');
  table.className = 'columns-pricing-table';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const labels = [...(rows[0]?.children || [])].map((cell) => cell.textContent.trim());
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, cellIdx) => {
      const td = document.createElement(idx === 0 ? 'th' : 'td');
      if (idx === 0) {
        td.scope = 'col';
        td.append(...cellContent(cell));
      } else {
        // label (column header) is shown beside the value on narrow screens
        if (labels[cellIdx]) td.dataset.label = labels[cellIdx];
        const value = document.createElement('span');
        value.className = 'columns-pricing-value';
        value.append(...cellContent(cell));
        td.append(value);
      }
      tr.append(td);
    });
    (idx === 0 ? thead : tbody).append(tr);
    row.remove();
  });
  if (thead.children.length) table.append(thead);
  if (tbody.children.length) table.append(tbody);
  const wrapper = document.createElement('div');
  wrapper.className = 'columns-pricing-table-wrapper';
  wrapper.append(table);
  return wrapper;
}

export default function decorate(block) {
  const [first, ...rest] = [...block.children];
  if (!first) return;

  first.classList.add('columns-pricing-row');
  const cols = [...first.children];
  block.classList.add(`columns-pricing-${cols.length}-cols`);
  cols.forEach((col, idx) => {
    col.classList.add(idx === 0 ? 'columns-pricing-intro' : 'columns-pricing-panel');
    if (!col.textContent.trim() && !col.querySelector('picture, img, table')) {
      col.classList.add('columns-pricing-empty-col');
    }
  });

  const tableRows = rest.filter((row) => row.textContent.trim());
  rest.filter((row) => !row.textContent.trim()).forEach((row) => row.remove());
  if (tableRows.length) {
    const target = cols[0] || first;
    target.append(buildTable(tableRows));
  }
}
