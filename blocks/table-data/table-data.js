/*
 * Table Data block
 * Each block row becomes a table row; the first row is the header.
 * A row with a single cell in a multi-column table becomes a group heading
 * spanning all columns (used by the matrix option for grouped form lists).
 *
 * Availability cells authored as "Included" / "Not included" (or "Available" /
 * "Not available") render as check / cross marks, keeping the text as the
 * accessible name. When every product heading but one links to its own page,
 * the unlinked one is the current product and its column is highlighted.
 *
 * Text tables (no product headings, marks or images, not matrix) are legal /
 * data tables: left/top aligned, columns sized to content, the first column a
 * plain cell. Source row/col spans arrive as empty cells: trailing empty
 * columns are dropped and a two-level header gets its spans back.
 * The tables of a GLBA privacy notice (section whose first table starts with
 * "FACTS") use header bands: plain-text labels (source <th>) become green
 * header cells, bold-led cells stay plain cells.
 *
 * Matrix: when some row labels are wholly bold, they are parent rows and the
 * non-bold rows under them are child rows (indented).
 */

const MARKS = {
  included: 'included',
  available: 'included',
  'not included': 'excluded',
  'not available': 'excluded',
  unavailable: 'excluded',
};

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

const isEmpty = (cell) => !text(cell) && !cell.querySelector('img, picture, svg, .icon');

/* all text sits inside strong / b */
function isBold(cell) {
  const all = text(cell).replace(/\s/g, '');
  if (!all) return false;
  const bold = [...cell.querySelectorAll('strong, b')]
    .filter((b) => !b.parentElement.closest('strong, b'))
    .map((b) => b.textContent)
    .join('')
    .replace(/\s/g, '');
  return bold === all;
}

/* short plain-text label (source <th>): not bold, no block content */
function isLabel(cell) {
  const t = text(cell);
  return Boolean(t) && t.length <= 60 && !isBold(cell)
    && !cell.querySelector('ul, ol, h1, h2, h3, h4, h5, h6, img, picture, table');
}

function decorateMark(cell) {
  if (cell.querySelector('img, picture, a, .icon')) return false;
  const type = MARKS[text(cell).toLowerCase()];
  if (!type) return false;
  const mark = document.createElement('span');
  mark.className = `table-data-mark ${type}`;
  mark.setAttribute('role', 'img');
  mark.setAttribute('aria-label', text(cell));
  cell.replaceChildren(mark);
  cell.classList.add('table-data-mark-cell');
  return true;
}

/* index of the single unlinked product heading among linked ones, or -1 */
function findCurrentColumn(headerCells) {
  const products = headerCells
    .map((cell, i) => ({ i, heading: cell.querySelector('h1, h2, h3, h4, h5, h6') }))
    .filter(({ heading }) => heading);
  if (products.length < 3) return -1;
  const unlinked = products.filter(({ heading }) => !heading.querySelector('a[href]'));
  return unlinked.length === 1 ? unlinked[0].i : -1;
}

/* GLBA model privacy notice: the section's first table starts with "FACTS" */
function isFactsNotice(block) {
  const scope = block.closest('.section') || block.parentElement || block;
  const first = scope.querySelector('.table-data') || block;
  const cell = first.querySelector('tr > th, tr > td') || first.querySelector(':scope > div > div');
  return text(cell).toUpperCase() === 'FACTS';
}

function isTextTable(block, rows) {
  if (block.classList.contains('matrix')) return false;
  if (block.querySelector('h1, h2, h3, h4, h5, h6, img, picture, .icon')) return false;
  return !rows.some((row) => [...row.children]
    .some((cell) => MARKS[text(cell).toLowerCase()]));
}

/* legal tables: drop trailing columns that are empty in every row (colspan leftovers) */
function dropEmptyColumns(rows) {
  const multi = rows.filter((row) => row.children.length > 1);
  const width = multi.reduce((max, row) => Math.max(max, row.children.length), 0);
  const columnEmpty = (c) => multi.every((row) => !row.children[c] || isEmpty(row.children[c]));
  let keep = width;
  while (keep > 1 && columnEmpty(keep - 1)) keep -= 1;
  multi.forEach((row) => {
    [...row.children].slice(keep).forEach((cell) => cell.remove());
  });
}

function buildCell(tag, source) {
  const el = document.createElement(tag);
  el.append(...source.childNodes);
  return el;
}

/*
 * Legal / data table. Header: first row (or, with header bands, a first row of
 * labels); a second row starting with an empty cell under a spanned header is
 * the header's second level. Empty header slots fold into the cell before /
 * above them as colspan / rowspan.
 */
function buildLegalTable(rows, columns, banded) {
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  let rowHeaders = false;

  const firstCells = rows[0] ? [...rows[0].children] : [];
  const filled = firstCells.filter((c) => !isEmpty(c));
  let headerRows = 0;
  if (firstCells.length > 1) {
    if (!banded) headerRows = 1;
    else if (filled.length > 1 && filled.every(isLabel)) headerRows = 1;
  } else if (firstCells.length === 1 && columns === 1) {
    headerRows = 1;
  }
  // second header level: row 2 opens with the slot of a header cell spanning two rows
  if (headerRows === 1 && rows[1] && rows[1].children.length === columns
    && firstCells.some((c, i) => i > 0 && isEmpty(c) && !isEmpty(firstCells[i - 1]))
    && isEmpty(rows[1].children[0]) && [...rows[1].children].slice(1).some((c) => !isEmpty(c))) {
    headerRows = 2;
  }

  const headerGrid = [];
  rows.forEach((row, r) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');

    if (r < headerRows) {
      headerGrid[r] = [];
      cells.forEach((cell, c) => {
        if (isEmpty(cell) && c > 0 && headerGrid[r][c - 1]) {
          headerGrid[r][c - 1].colSpan += 1;
          headerGrid[r][c] = headerGrid[r][c - 1];
          return;
        }
        if (isEmpty(cell) && r > 0 && headerGrid[r - 1][c]) {
          headerGrid[r - 1][c].rowSpan += 1;
          headerGrid[r][c] = null;
          return;
        }
        const th = buildCell('th', cell);
        th.scope = 'col';
        headerGrid[r][c] = th;
        tr.append(th);
      });
      if (cells.length === 1 && columns > 1) tr.cells[0].colSpan = columns;
      thead.append(tr);
      return;
    }

    if (cells.length === 1 && columns > 1) {
      tr.className = 'table-data-group';
      const th = buildCell('th', cells[0]);
      th.scope = 'colgroup';
      th.colSpan = columns;
      tr.append(th);
      tbody.append(tr);
      return;
    }

    // header bands: the row's first filled cell is its label when it is plain text
    const labelIndex = banded ? cells.findIndex((c) => !isEmpty(c)) : -1;
    const hasLabel = labelIndex >= 0 && isLabel(cells[labelIndex]);
    // title row (FACTS): label beside a wholly bold statement
    if (r === 0 && hasLabel && cells.length === 2 && isBold(cells[1])) {
      tr.className = 'table-data-title';
    }
    // trailing empty slots after a value cell are its colspan leftovers
    let last = cells.length - 1;
    while (last > 0 && isEmpty(cells[last])) last -= 1;
    if (last < cells.length - 1 && !isEmpty(cells[last]) && !(hasLabel && last === labelIndex)) {
      cells.splice(last + 1).forEach((cell) => cell.remove());
    }
    cells.forEach((cell, c) => {
      let el;
      if (hasLabel && c === labelIndex) {
        el = buildCell('th', cell);
        el.scope = 'row';
        rowHeaders = true;
      } else {
        el = buildCell('td', cell);
      }
      if (c === cells.length - 1 && cells.length < columns) {
        el.colSpan = columns - cells.length + 1;
      }
      tr.append(el);
    });
    tbody.append(tr);
  });

  return { thead, tbody, rowHeaders };
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  const legal = isTextTable(block, rows);
  const banded = legal && isFactsNotice(block);
  if (legal) dropEmptyColumns(rows);
  const columns = rows.reduce((max, row) => Math.max(max, row.children.length), 0);

  const table = document.createElement('table');
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');
  let hasMarks = false;

  if (legal) {
    const built = buildLegalTable(rows, columns, banded);
    ({ thead, tbody } = built);
    block.classList.add('table-data-legal');
    if (banded) block.classList.add('table-data-banded');
    if (built.rowHeaders) block.classList.add('table-data-row-headers');
  } else {
    rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      const cells = [...row.children];
      const isHeader = i === 0;

      if (!isHeader && cells.length === 1 && columns > 1) {
        tr.className = 'table-data-group';
        const th = buildCell('th', cells[0]);
        th.scope = 'colgroup';
        th.colSpan = columns;
        tr.append(th);
        tbody.append(tr);
        return;
      }

      let rowLabel = '';
      cells.forEach((cell, c) => {
        let el;
        if (isHeader) {
          el = document.createElement('th');
          el.scope = 'col';
        } else if (c === 0 && columns > 1) {
          el = document.createElement('th');
          el.scope = 'row';
          rowLabel = text(cell);
        } else {
          el = document.createElement('td');
          // small screens show the row label inside each value cell
          if (rowLabel) el.dataset.label = rowLabel;
        }
        el.append(...cell.childNodes);
        if (el.tagName === 'TD' && decorateMark(el)) hasMarks = true;
        // last cell absorbs any missing columns so rows stay aligned
        if (c === cells.length - 1 && cells.length < columns) {
          el.colSpan = columns - cells.length + 1;
        }
        tr.append(el);
      });

      (isHeader ? thead : tbody).append(tr);
    });
  }

  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const current = !legal && thead.rows.length ? findCurrentColumn([...thead.rows[0].cells]) : -1;
  if (current > 0) {
    [...table.rows].forEach((tr) => {
      if (tr.cells.length === columns) tr.cells[current].classList.add('table-data-current');
    });
  }

  // matrix hierarchy: wholly bold row labels are parents, the others their children
  if (block.classList.contains('matrix')) {
    const labelled = [...tbody.rows].filter((tr) => tr.cells[0]?.scope === 'row');
    if (labelled.some((tr) => isBold(tr.cells[0]))) {
      labelled.forEach((tr) => {
        tr.classList.add(isBold(tr.cells[0]) ? 'table-data-parent' : 'table-data-child');
      });
    }
  }

  block.classList.add(`table-data-cols-${Math.min(columns, 5)}`);
  if (hasMarks) block.classList.add('table-data-marks');
  block.style.setProperty('--table-data-columns', columns);

  const scroller = document.createElement('div');
  scroller.className = 'table-data-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  const label = [...(thead.rows.length ? thead : tbody).rows[0]?.cells || []]
    .map((cell) => text(cell))
    .filter(Boolean)
    .join(', ');
  scroller.setAttribute('aria-label', label ? `Table: ${label}`.slice(0, 120) : 'Table');
  scroller.append(table);
  block.replaceChildren(scroller);
}
