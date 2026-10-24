/*
 * Accordion Panel
 * Collapsible question/answer rows. Rows with two or more cells are items
 * (label | body); single-cell rows are extra content (intro, "View all" links,
 * or - with the `sidebar` option - a side column of related links).
 * A body cell that holds only a link to a /fragments/ path is loaded from that fragment.
 */
import { loadFragment } from '../fragment/fragment.js';

let accordionId = 0;

function getFragmentPath(cell) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (links.length !== 1 || cell.querySelector('picture, img, ul, ol, table')) return null;
  if (cell.textContent.trim() !== links[0].textContent.trim()) return null;
  try {
    const url = new URL(links[0].href, window.location.href);
    if (!url.pathname.includes('/fragments/')) return null;
    return url.pathname.replace(/(\.plain)?\.html$/, '');
  } catch {
    return null;
  }
}

/**
 * Swaps a fragment-link cell for the fragment's content. The link is detached
 * synchronously so the page-level fragment auto-blocker does not also inline it.
 */
async function loadCellFragment(cell) {
  const path = cell.dataset.fragment;
  if (!path) return;
  delete cell.dataset.fragment;
  const fragment = await loadFragment(path);
  if (!fragment) {
    cell.append(...(cell.fragmentFallback || []));
    return;
  }
  const sections = fragment.querySelectorAll(':scope > .section');
  if (sections.length) {
    sections.forEach((section) => cell.append(...section.childNodes));
  } else {
    cell.append(...fragment.childNodes);
  }
}

function prepareFragmentCell(cell) {
  const path = getFragmentPath(cell);
  if (!path) return;
  cell.fragmentFallback = [...cell.childNodes];
  cell.replaceChildren();
  cell.dataset.fragment = path;
}

function buildItem(row, index) {
  const [labelCell, ...bodyCells] = [...row.children];

  const summary = document.createElement('summary');
  summary.className = 'accordion-panel-item-label';
  const onlyChild = labelCell.children.length === 1 ? labelCell.firstElementChild : null;
  if (onlyChild && /^(P|H[1-6])$/.test(onlyChild.tagName)) {
    summary.append(...onlyChild.childNodes);
  } else {
    summary.append(...labelCell.childNodes);
  }

  const body = document.createElement('div');
  body.className = 'accordion-panel-item-body';
  body.id = `accordion-panel-${accordionId}-item-${index}`;
  bodyCells.forEach((cell) => body.append(...cell.childNodes));
  prepareFragmentCell(body);

  const details = document.createElement('details');
  details.className = 'accordion-panel-item';
  details.append(summary, body);
  if (body.dataset.fragment) {
    details.addEventListener('toggle', () => {
      if (details.open) loadCellFragment(body);
    });
  }
  return details;
}

export default function decorate(block) {
  accordionId += 1;
  const isSidebar = block.classList.contains('sidebar');
  const rows = [...block.children];

  const isItem = (row) => row.children.length >= 2;
  let asideRow = null;
  if (isSidebar) {
    const extras = rows.filter((row) => !isItem(row) && row.textContent.trim());
    if (extras.length && rows.some(isItem)) asideRow = extras[extras.length - 1];
  }

  const main = document.createElement('div');
  main.className = 'accordion-panel-main';
  let group = null;
  let itemIndex = 0;

  rows.forEach((row) => {
    if (row === asideRow) return;
    if (isItem(row)) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'accordion-panel-items';
        main.append(group);
      }
      itemIndex += 1;
      group.append(buildItem(row, itemIndex));
      return;
    }
    group = null;
    const cell = row.firstElementChild || row;
    if (!cell.textContent.trim() && !cell.querySelector('picture, img')) return;
    const extra = document.createElement('div');
    extra.className = 'accordion-panel-extra';
    extra.append(...cell.childNodes);
    main.append(extra);
  });

  const children = [main];
  if (asideRow) {
    const aside = document.createElement('div');
    aside.className = 'accordion-panel-aside';
    aside.append(...(asideRow.firstElementChild || asideRow).childNodes);
    children.push(aside);
  }
  block.replaceChildren(...children);

  // a lone fragment-backed item without options ("More information") is an
  // unboxed text toggle on the source; the page-level fragment auto-blocker may
  // already have inlined the fragment as a section
  const options = ['terms', 'two-column', 'sidebar', 'lined', 'narrow'];
  const items = block.querySelectorAll('.accordion-panel-item');
  if (items.length === 1 && !options.some((o) => block.classList.contains(o))) {
    const body = items[0].querySelector('.accordion-panel-item-body');
    if (body.dataset.fragment || body.querySelector(':scope > .section, .block')) {
      block.classList.add('plain');
    }
  }

  // terms panels ("Things you should know") render expanded on the source;
  // fragment-backed items (e.g. policy document lists) stay collapsed, also when
  // the page-level fragment auto-blocker already inlined their blocks
  if (block.classList.contains('terms')) {
    block.querySelectorAll('.accordion-panel-item').forEach((details) => {
      const body = details.querySelector('.accordion-panel-item-body');
      if (!body.dataset.fragment && !body.querySelector('.block, .accordion-panel')) details.open = true;
    });
  }
}
