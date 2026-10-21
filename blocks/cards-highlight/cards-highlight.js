import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * cards-highlight: highlight tiles led by a large stat or key word
 * ("3x", "5%", "Earn") followed by a label and supporting text.
 *
 * Authoring: one row per tile.
 *  - a cell holding only an image -> tile image (with-image) or icon
 *  - the remaining cells -> tile body. The first heading (or a first
 *    paragraph that is entirely bold) is styled as the stat.
 *  - icon-links: a tile whose body is a single link makes the whole tile
 *    clickable.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function isBoldOnly(el) {
  if (!el || el.tagName !== 'P') return false;
  const strong = el.querySelector('strong, b');
  return strong && strong.textContent.trim() === el.textContent.trim();
}

function buildTile(row, index) {
  const li = document.createElement('li');
  li.dataset.index = String(index + 1);
  const cells = [...row.children];

  const imageCell = cells.find((c) => c.querySelector('picture') && c.textContent.trim() === '');
  if (imageCell) {
    imageCell.className = 'cards-highlight-image';
    li.append(imageCell);
  }

  const body = document.createElement('div');
  body.className = 'cards-highlight-body';
  cells.filter((c) => c !== imageCell).forEach((c) => body.append(...c.childNodes));

  const first = body.firstElementChild;
  if (first && (first.matches(HEADING) || isBoldOnly(first))) {
    first.classList.add('cards-highlight-stat');
  } else {
    const heading = body.querySelector(HEADING);
    if (heading) heading.classList.add('cards-highlight-stat');
  }

  // a lone link makes the whole tile clickable
  const links = body.querySelectorAll('a');
  if (links.length === 1 && links[0].textContent.trim() === body.textContent.trim()) {
    li.classList.add('is-link');
    links[0].classList.remove('button');
    links[0].closest('.button-container')?.classList.remove('button-container');
  }

  if (body.childNodes.length) li.append(body);
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    ul.append(buildTile(row, ul.children.length));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
