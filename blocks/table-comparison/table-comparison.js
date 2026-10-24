const ROW_HEADER_OPTIONS = ['dark', 'image-grey', 'image-cyan-grey', 'image-cyan-grey-light'];
const YES = /^(✓|✔|☑|yes|tick|included)$/i;
const NO = /^(✗|✕|✖|×|x|no|cross|not included)$/i;

function createMark(yes) {
  const mark = document.createElement('span');
  mark.className = `table-comparison-mark table-comparison-mark-${yes ? 'yes' : 'no'}`;
  mark.setAttribute('role', 'img');
  mark.setAttribute('aria-label', yes ? 'Included' : 'Not included');
  return mark;
}

function markSymbol(cell) {
  const text = cell.textContent.trim();
  const icon = cell.querySelector('span.icon');
  const iconName = icon ? [...icon.classList].find((c) => c.startsWith('icon-')) || '' : '';
  const hasMedia = cell.querySelector('picture, img, span.icon');
  if (YES.test(text) || NO.test(text)) {
    const yes = YES.test(text);
    cell.classList.add(yes ? 'table-comparison-yes' : 'table-comparison-no');
    // swap the authored glyph for a drawn mark (glyph shapes vary by font)
    if (!hasMedia) cell.replaceChildren(createMark(yes));
    return;
  }
  if (/tick|check/.test(iconName)) {
    cell.classList.add('table-comparison-yes');
    if (!text) cell.setAttribute('aria-label', 'Included');
    return;
  }
  if (/cross|close/.test(iconName)) {
    cell.classList.add('table-comparison-no');
    if (!text) cell.setAttribute('aria-label', 'Not included');
    return;
  }
  // mixed cell: a leading tick/cross paragraph followed by detail text
  const first = cell.firstElementChild;
  const firstText = first && first.tagName === 'P' ? first.textContent.trim() : '';
  if (firstText && (YES.test(firstText) || NO.test(firstText)) && !first.querySelector('picture, img, span.icon')) {
    first.replaceWith(createMark(YES.test(firstText)));
    cell.classList.add('table-comparison-has-mark');
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const colCount = Math.max(...rows.map((row) => row.children.length));

  // intro rows: leading single-cell rows in a multi-column table (heading, text)
  const intro = document.createElement('div');
  intro.className = 'table-comparison-intro';
  while (rows.length > 1 && colCount > 1 && rows[0].children.length === 1) {
    intro.append(...rows.shift().firstElementChild.childNodes);
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const [headerRow, ...bodyRows] = rows;

  const headerCells = [...headerRow.children];
  const firstHeaderEmpty = headerCells.length > 0 && !headerCells[0].textContent.trim()
    && !headerCells[0].querySelector('picture, img');
  const firstHeading = headerCells[0] && headerCells[0].querySelector('h1, h2, h3, h4, h5, h6');
  const firstHeaderIsHeading = !!firstHeading
    && firstHeading.textContent.trim() === headerCells[0].textContent.trim();
  const rowHeaders = colCount > 2 && bodyRows.length > 0
    && (firstHeaderEmpty || firstHeaderIsHeading
      || ROW_HEADER_OPTIONS.some((o) => block.classList.contains(o)));
  if (rowHeaders) block.classList.add('table-comparison-row-headers');

  const headTr = document.createElement('tr');
  headerCells.forEach((cell) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.append(...cell.childNodes);
    headTr.append(th);
  });
  thead.append(headTr);

  bodyRows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, index) => {
      const isRowHeader = rowHeaders && index === 0;
      const td = document.createElement(isRowHeader ? 'th' : 'td');
      if (isRowHeader) td.scope = 'row';
      td.append(...cell.childNodes);
      if (!isRowHeader) markSymbol(td);
      tr.append(td);
    });
    // fill gaps when authors leave out trailing cells
    for (let i = row.children.length; i < colCount; i += 1) tr.append(document.createElement('td'));
    tbody.append(tr);
  });

  // pad a short header row so columns line up
  for (let i = headerCells.length; i < colCount; i += 1) headTr.append(document.createElement('th'));

  table.append(thead);
  if (tbody.children.length) table.append(tbody);

  const scroller = document.createElement('div');
  scroller.className = 'table-comparison-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  const label = intro.querySelector('h1, h2, h3, h4, h5, h6');
  scroller.setAttribute('aria-label', label ? label.textContent.trim() : 'Comparison table');
  scroller.append(table);

  block.replaceChildren(...[intro.childNodes.length ? intro : null, scroller].filter(Boolean));
}
