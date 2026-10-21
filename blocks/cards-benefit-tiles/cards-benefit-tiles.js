import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * cards-benefit-tiles: image-backed tiles with a title and a "+" toggle that
 * reveals the benefit detail.
 *
 * Authoring: one row per tile.
 *  - a cell holding only an image -> tile background (optional)
 *  - the first heading (or first paragraph) -> tile title
 *  - remaining content -> detail revealed by the "+" button (optional).
 *    A detail that is just a link to a /fragments/ path is loaded as a fragment.
 */

let tileCount = 0;

function isFragmentLink(el) {
  const links = el.querySelectorAll('a');
  if (links.length !== 1) return null;
  if (el.textContent.trim() !== links[0].textContent.trim()) return null;
  const { pathname } = new URL(links[0].href, window.location.href);
  return pathname.includes('/fragments/') ? pathname : null;
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function buildTile(row) {
  const li = document.createElement('li');
  li.className = 'cards-benefit-tiles-tile';
  const cells = [...row.children];

  const imageCell = cells.find((c) => c.querySelector('picture') && c.textContent.trim() === '');
  if (imageCell) {
    imageCell.className = 'cards-benefit-tiles-image';
    li.append(imageCell);
    li.classList.add('has-image');
  }

  const content = document.createElement('div');
  cells.filter((c) => c !== imageCell).forEach((c) => content.append(...c.childNodes));

  const titleEl = content.querySelector('h1, h2, h3, h4, h5, h6') || content.firstElementChild;
  const title = document.createElement('div');
  title.className = 'cards-benefit-tiles-title';
  if (titleEl) title.append(titleEl);
  li.append(title);

  const hasDetail = content.textContent.trim() !== '' || content.querySelector('picture, a');
  if (!hasDetail) return li;

  tileCount += 1;
  const detailId = `cards-benefit-tiles-detail-${tileCount}`;
  const detail = document.createElement('div');
  detail.className = 'cards-benefit-tiles-detail';
  detail.id = detailId;
  detail.hidden = true;
  const fragmentPath = isFragmentLink(content);
  if (!fragmentPath) detail.append(...content.childNodes);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'cards-benefit-tiles-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', detailId);
  toggle.setAttribute('aria-label', `More about ${title.textContent.trim() || 'this benefit'}`);

  let loaded = !fragmentPath;
  toggle.addEventListener('click', async () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (open && !loaded) {
      loaded = true;
      const fragment = await loadFragment(fragmentPath);
      if (fragment) detail.append(...fragment.childNodes);
    }
    toggle.setAttribute('aria-expanded', String(open));
    detail.hidden = !open;
    li.classList.toggle('is-open', open);
  });

  li.append(detail, toggle);
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    ul.append(buildTile(row));
  });
  optimizeImages(ul);
  block.replaceChildren(ul);
}
