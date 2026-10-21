/*
 * Table Rates block
 * Rate / fee / comparison table built from authored rows.
 * - A leading single-cell row (in a multi-column table) becomes the caption.
 * - The first multi-cell row becomes the header when every cell has content.
 * - Single-cell body rows become full-width group rows.
 * - Short rows are padded so the grid stays aligned.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

// cells that only hold a check mark or a dash (comparison tables)
const MARK_RE = /^[✓✔✗✘—–-]$/;

function hasContent(cell) {
  return !!(cell && (cell.textContent.trim() || cell.querySelector('picture, img, a')));
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length > 0);
  if (!rows.length) return;

  const maxCols = Math.max(...rows.map((row) => row.children.length));
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  let index = 0;

  // caption: leading single-cell row in a multi-column table
  if (maxCols > 1 && rows[0].children.length === 1 && hasContent(rows[0].children[0])) {
    const caption = document.createElement('caption');
    caption.innerHTML = rows[0].children[0].innerHTML;
    table.append(caption);
    index = 1;
  }

  // header: first multi-cell row whose cells all have content
  // (an empty top-left corner cell is allowed, e.g. card comparison headers;
  // a row holding check marks is data, not a header)
  const headerRow = rows[index];
  const useHeader = headerRow
    && headerRow.children.length > 1
    && [...headerRow.children].slice(1).every(hasContent)
    && ![...headerRow.children].some((cell) => MARK_RE.test(cell.textContent.trim()))
    && (hasContent(headerRow.children[0]) || rows.length > index + 1);

  rows.slice(index).forEach((row, i) => {
    const isHeader = useHeader && i === 0;
    const tr = document.createElement('tr');
    const cells = [...row.children];

    if (!isHeader && cells.length === 1 && maxCols > 1) {
      tr.classList.add('table-rates-group');
    }

    cells.forEach((cell, c) => {
      const el = document.createElement(isHeader ? 'th' : 'td');
      if (isHeader) el.setAttribute('scope', 'col');
      el.innerHTML = cell.innerHTML;
      if (MARK_RE.test(el.textContent.trim())) el.classList.add('table-rates-mark');
      const isLast = c === cells.length - 1;
      if (isLast && cells.length < maxCols) {
        el.colSpan = maxCols - cells.length + 1;
      }
      tr.append(el);
    });

    if (isHeader) thead.append(tr);
    else tbody.append(tr);
  });

  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const wrapper = document.createElement('div');
  wrapper.className = 'table-rates-scroll';
  // column count drives the table's minimum width (horizontal scroll on mobile)
  block.style.setProperty('--table-rates-cols', maxCols);
  wrapper.append(table);
  optimizeImages(wrapper);
  block.replaceChildren(wrapper);
}
