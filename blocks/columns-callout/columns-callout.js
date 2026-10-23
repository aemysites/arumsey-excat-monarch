import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageCol(col) {
  const pic = col.querySelector('picture');
  return !!pic && !col.textContent.trim();
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-callout-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    const rowCols = [...row.children];
    rowCols.forEach((col) => {
      if (isImageCol(col)) col.classList.add('columns-callout-img-col');
      if (!col.textContent.trim() && !col.querySelector('picture, img')) col.classList.add('columns-callout-empty-col');
    });

    // the last text column is the callout panel
    const panel = [...rowCols].reverse().find((col) => !col.classList.contains('columns-callout-img-col')
      && !col.classList.contains('columns-callout-empty-col'));
    if (panel) {
      panel.classList.add('columns-callout-panel');
      panel.querySelectorAll('ul').forEach((list) => list.classList.add('columns-callout-checklist'));
    }
  });

  // a paragraph led by an inline icon (e.g. a check mark before a state name) is an icon item
  block.querySelectorAll('p').forEach((p) => {
    const lead = p.firstElementChild;
    if (!lead || p.firstChild !== lead || !lead.matches('picture, img, span.icon')) return;
    if (!p.textContent.trim()) return;
    p.classList.add('columns-callout-icon-item');
    lead.classList.add('columns-callout-icon');
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
