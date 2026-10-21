import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * cards-icon: a row of small icon + label items (feature strips, quick
 * links, category navigation, cross-sell lists).
 *
 * Authoring: one row per item.
 *  - a cell holding only an image or icon -> item icon (optional)
 *  - remaining cells -> label (first heading/paragraph, often a link) and
 *    optional supporting text.
 *  - an item with exactly one link becomes fully clickable.
 *  - quick-nav: the item linking to the current page is marked aria-current.
 */

function isIconCell(cell) {
  return cell.querySelector('picture, img, .icon') && cell.textContent.trim() === '';
}

function buildItem(row) {
  const li = document.createElement('li');
  const cells = [...row.children];

  const iconCell = cells.find(isIconCell);
  if (iconCell) {
    iconCell.className = 'cards-icon-icon';
    li.append(iconCell);
  }

  const body = document.createElement('div');
  body.className = 'cards-icon-body';
  cells.filter((c) => c !== iconCell).forEach((c) => body.append(...c.childNodes));

  // single-cell authoring: a leading icon-only paragraph is the icon
  if (!iconCell) {
    const first = body.firstElementChild;
    if (first && isIconCell(first)) {
      const icon = document.createElement('div');
      icon.className = 'cards-icon-icon';
      icon.append(first);
      li.append(icon);
    }
  }

  const label = body.firstElementChild;
  if (label) label.classList.add('cards-icon-label');

  // footnote links (<a><sup>1</sup></a>, <sup><a>2</a></sup>) don't make the item a link
  const isFootnote = (a) => a.closest('sup')
    || (a.children.length === 1 && a.firstElementChild.tagName === 'SUP'
      && a.textContent.trim() === a.firstElementChild.textContent.trim());
  const links = [...body.querySelectorAll('a')].filter((a) => !isFootnote(a));
  if (links.length === 1) {
    li.classList.add('is-link');
    links[0].classList.remove('button');
    links[0].closest('.button-container')?.classList.remove('button-container');
    const { pathname } = new URL(links[0].href, window.location.href);
    if (pathname === window.location.pathname) {
      li.classList.add('is-active');
      links[0].setAttribute('aria-current', 'page');
    }
  }

  if (body.childNodes.length) li.append(body);
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture, img, .icon')) return;
    ul.append(buildItem(row));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
  if (block.classList.contains('quick-nav')) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Quick navigation');
    nav.append(ul);
    block.replaceChildren(nav);
    return;
  }
  block.replaceChildren(ul);
}
