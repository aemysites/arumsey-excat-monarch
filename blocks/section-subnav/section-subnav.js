import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/** @param {Element} el */
function isPictureOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

/** @param {Element} el */
function hasContent(el) {
  return !!(el.textContent.trim() || el.querySelector('picture, img, a, .icon'));
}

/** A cell holding nothing but a link to a same-origin fragment: load it in place. */
async function inlineFragment(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return;
  const fragment = await loadFragment(url.pathname.replace(/(\.plain)?\.html$/, ''));
  if (!fragment) return;
  const nodes = [...fragment.querySelectorAll(':scope > .section > *')];
  cell.replaceChildren(...(nodes.length ? nodes : [...fragment.childNodes]));
}

/** A leading picture or icon paragraph inside a text column is its icon. */
function markIcon(col) {
  const first = col.firstElementChild;
  if (first && first.tagName === 'P' && !first.textContent.trim()
    && first.querySelector('picture, img, .icon')) {
    first.classList.add('section-subnav-icon');
  }
}

/** A paragraph holding nothing but one unformatted link is a text CTA. */
function markCtas(col) {
  col.querySelectorAll(':scope > p').forEach((p) => {
    const links = p.querySelectorAll('a[href]');
    if (links.length === 1 && !links[0].classList.contains('button')
      && p.textContent.trim() === links[0].textContent.trim()) {
      p.classList.add('section-subnav-cta');
    }
  });
  if (col.lastElementChild?.classList.contains('section-subnav-cta')) {
    col.classList.add('section-subnav-item-has-cta');
  }
}

/** A single column that is only a list of links is a link bar (e.g. the travel sub-nav). */
function isLinkBar(block) {
  const items = block.querySelectorAll('.section-subnav-item');
  if (items.length !== 1 || block.querySelector('.section-subnav-media')) return false;
  const kids = [...items[0].children];
  if (kids.length !== 1 || kids[0].tagName !== 'UL') return false;
  const lis = [...kids[0].children];
  return lis.length > 0 && lis.every((li) => {
    const a = li.querySelector('a[href]');
    return a && li.textContent.trim() === a.textContent.trim();
  });
}

/* media-feature images, sorted by natural size (citi.com banner vs tile icon vs feature art) */
const ICON_MAX = 160; // quote mark 80x80, card-list icons 24x24
const PHOTO_MAX_HEIGHT = 800; // banner photos are cut for the 422x400 slot (<= 440px tall)

/**
 * Tag a media-feature media cell once its image has loaded: small images are icons
 * (kept at natural size, top-left), slot-sized ones are photos (cropped to fill).
 * Taller, high-res feature art (credit-card pages, >= 1024px) is left untagged.
 */
function classifyMedia(cell) {
  const img = cell.querySelector('img');
  if (!img) return;
  const apply = () => {
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return;
    let kind;
    if (w <= ICON_MAX && h <= ICON_MAX) kind = 'icon';
    else if (h < PHOTO_MAX_HEIGHT) kind = 'photo';
    if (!kind) return;
    cell.classList.add(`section-subnav-media-${kind}`);
    cell.parentElement.classList.add(`section-subnav-row-has-${kind}`);
  };
  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener('load', apply, { once: true });
}

export default async function decorate(block) {
  const rows = [...block.children];
  const allCells = rows.flatMap((row) => [...row.children]);
  await Promise.all(allCells.filter(hasContent).map(inlineFragment));

  let maxCols = 1;
  rows.forEach((row) => {
    const cells = [...row.children].filter(hasContent);
    [...row.children].filter((c) => !cells.includes(c)).forEach((c) => c.remove());
    if (!cells.length) {
      row.remove();
      return;
    }
    row.className = 'section-subnav-row';
    row.style.setProperty('--section-subnav-columns', cells.length);
    maxCols = Math.max(maxCols, cells.length);
    cells.forEach((cell) => {
      if (isPictureOnly(cell)) {
        cell.className = 'section-subnav-media';
        row.classList.add('section-subnav-row-has-media');
      } else {
        cell.className = 'section-subnav-item';
        markIcon(cell);
        markCtas(cell);
        if (cell.querySelector(':scope > .section-subnav-icon')) {
          cell.classList.add('section-subnav-item-has-icon');
        }
      }
    });
  });
  block.classList.add(`section-subnav-${maxCols}-cols`);
  if (isLinkBar(block)) block.classList.add('section-subnav-links');

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  if (block.classList.contains('media-feature')) {
    block.querySelectorAll('.section-subnav-media').forEach(classifyMedia);
  }
}
