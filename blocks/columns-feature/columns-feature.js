import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'columns-feature';
const STEP_OPTIONS = ['steps', 'steps-2', 'steps-3'];
let accordionCount = 0;

/**
 * Optimize same-origin, non-SVG images only (migrated images keep source-site URLs).
 * @param {Element} block
 */
function optimizePictures(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function isImageOnly(col) {
  return !!col.querySelector('picture')
    && col.querySelectorAll('picture').length === 1
    && col.textContent.trim() === '';
}

/**
 * Mark list items that lead with an icon so the icon and label sit side by side.
 * @param {Element} col
 */
function decorateIconLists(col) {
  col.querySelectorAll('ul > li, ol > li').forEach((li) => {
    const first = li.firstElementChild;
    if (first && (first.matches('picture, img, .icon') || first.querySelector(':scope > picture, :scope > img'))) {
      li.classList.add(`${BLOCK}-icon-item`);
      // keep the label (text, inline links) together beside the icon
      const label = document.createElement('span');
      label.className = `${BLOCK}-icon-text`;
      label.append(...[...li.childNodes].filter((n) => n !== first));
      if (label.textContent.trim()) li.append(label);
    }
  });
}

/**
 * Consecutive lists (an icon list authored as two source columns) sit side by side.
 * @param {Element} col
 */
function groupConsecutiveLists(col) {
  [...col.children].forEach((el) => {
    if (!el.matches('ul') || !el.parentElement || el.parentElement !== col) return;
    const run = [el];
    let next = el.nextElementSibling;
    while (next && next.matches('ul')) {
      run.push(next);
      next = next.nextElementSibling;
    }
    if (run.length < 2) return;
    const group = document.createElement('div');
    group.className = `${BLOCK}-list-group`;
    el.before(group);
    group.append(...run);
  });
}

/**
 * A primary button followed by a link-only paragraph renders as one action row.
 * @param {Element} col
 */
function groupActions(col) {
  col.querySelectorAll(':scope > .button-wrapper').forEach((btn) => {
    const next = btn.nextElementSibling;
    if (!next || !next.matches('p') || next.classList.contains('button-wrapper')) return;
    const link = next.querySelector(':scope > a:only-child');
    if (!link || next.textContent.trim() !== link.textContent.trim()) return;
    const actions = document.createElement('div');
    actions.className = `${BLOCK}-actions`;
    btn.before(actions);
    actions.append(btn, next);
  });
}

/**
 * Step options: number the ordered list (or every list) in the text column.
 * @param {Element} col
 */
function decorateSteps(col) {
  const lists = col.querySelectorAll('ol');
  const targets = lists.length ? lists : col.querySelectorAll('ul');
  targets.forEach((list) => list.classList.add(`${BLOCK}-steps`));
}

/**
 * Accordion option: sub-headings below the column title (e.g. h3 under an h2) and the
 * content after each become exclusive <details> panels; the first panel starts open.
 * Trailing CTA paragraphs stay outside the panels.
 * @param {Element} col
 */
function decorateAccordion(col) {
  const headings = [...col.querySelectorAll(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6')];
  const level = (h) => Number(h.tagName.charAt(1));
  const [first, ...rest] = headings;
  if (!first || !rest.length || !rest.every((h) => level(h) > level(first))) return;
  const items = rest;
  accordionCount += 1;
  const groupName = `${BLOCK}-accordion-${accordionCount}`;
  items.forEach((heading, i) => {
    const details = document.createElement('details');
    details.className = `${BLOCK}-accordion-item`;
    details.name = groupName;
    if (i === 0) details.open = true;
    const summary = document.createElement('summary');
    const title = document.createElement('span');
    title.className = `${BLOCK}-accordion-title`;
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', heading.tagName.charAt(1));
    title.append(...heading.childNodes);
    summary.append(title);
    details.append(summary);
    const body = document.createElement('div');
    body.className = `${BLOCK}-accordion-body`;
    let next = heading.nextElementSibling;
    while (next && !items.includes(next) && !next.matches('.button-wrapper')) {
      const move = next;
      next = next.nextElementSibling;
      body.append(move);
    }
    details.append(body);
    heading.replaceWith(details);
  });

  // exclusive panels where the `name` attribute is not supported
  col.addEventListener('toggle', (e) => {
    const opened = e.target;
    if (!opened.matches?.(`.${BLOCK}-accordion-item`) || !opened.open) return;
    col.querySelectorAll(`.${BLOCK}-accordion-item[open]`).forEach((d) => {
      if (d !== opened) d.open = false;
    });
  }, true);
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  block.classList.add(`${BLOCK}-${firstRow.children.length}-cols`);

  const hasSteps = STEP_OPTIONS.some((opt) => block.classList.contains(opt));
  const isAccordion = block.classList.contains('accordion');

  [...block.children].forEach((row) => {
    row.classList.add(`${BLOCK}-row`);
    [...row.children].forEach((col) => {
      if (isImageOnly(col)) {
        col.classList.add(`${BLOCK}-img-col`);
        return;
      }
      col.classList.add(`${BLOCK}-text-col`);
      decorateIconLists(col);
      if (hasSteps) decorateSteps(col);
      if (isAccordion) decorateAccordion(col);
      groupConsecutiveLists(col);
      groupActions(col);
    });
  });

  optimizePictures(block);
}
