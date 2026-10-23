import { createOptimizedPicture } from '../../scripts/aem.js';

/* options that render each card as a wide media | text split panel */
const SPLIT_OPTIONS = ['featured-offer', 'light-2', 'light-3', 'dark'];
const ALL_OPTIONS = [...SPLIT_OPTIONS, 'light', 'icon-left', 'dividers'];

/**
 * Only same-origin, non-SVG images can go through createOptimizedPicture.
 * @param {HTMLImageElement} img
 * @returns {boolean}
 */
function canOptimize(img) {
  const url = new URL(img.src, window.location.href);
  return url.origin === window.location.origin && !/\.svg$/i.test(url.pathname);
}

/**
 * A photo is a raster image; icons and logos arrive as SVG data URIs,
 * .svg files or Scene7 /is/content/ assets.
 * @param {HTMLImageElement} img
 * @returns {boolean}
 */
function isPhoto(img) {
  const src = img.getAttribute('src') || '';
  return !!src && !/^data:/i.test(src) && !/\.svg(\?|$)/i.test(src) && !/\/is\/content\//i.test(src);
}

/**
 * A cell is media when it holds a picture or an icon span and no text.
 * @param {Element} cell
 * @returns {boolean}
 */
function isMediaCell(cell) {
  return !!cell.querySelector('picture, img, .icon') && !cell.textContent.trim();
}

/**
 * Splits a row into its media cell and body cell.
 * @param {Element} li
 */
function classifyCells(li) {
  [...li.children].forEach((cell) => {
    if (isMediaCell(cell)) {
      cell.className = 'cards-icon-card-icon';
    } else if (!cell.textContent.trim()) {
      cell.remove();
    } else {
      cell.className = 'cards-icon-card-body';
    }
  });

  // an icon authored inline at the top of the body cell still counts as the icon
  const body = li.querySelector('.cards-icon-card-body');
  if (body && !li.querySelector('.cards-icon-card-icon')) {
    const first = body.firstElementChild;
    if (first && isMediaCell(first)) {
      const iconCell = document.createElement('div');
      iconCell.className = 'cards-icon-card-icon';
      iconCell.append(first);
      li.prepend(iconCell);
    }
  }
}

/**
 * Standalone links (the whole paragraph or heading is the link) get the
 * source's arrow-link treatment; inline links inside copy stay underlined.
 * @param {Element} ul
 */
function decorateLinks(ul) {
  ul.querySelectorAll('.cards-icon-card-body a:not(.button)').forEach((a) => {
    const parent = a.closest('p, h2, h3, h4, h5, h6');
    if (parent && parent.textContent.trim() === a.textContent.trim()) {
      a.classList.add('cards-icon-link');
    }
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    classifyCells(li);
    if (li.children.length) ul.append(li);
  });

  const items = [...ul.children];
  const hasOption = ALL_OPTIONS.some((option) => block.classList.contains(option));
  let split = SPLIT_OPTIONS.some((option) => block.classList.contains(option));

  // a default block whose rows are photo | text renders as a jumbo split card
  const photoRows = items.length > 0 && items.every((li) => {
    const img = li.querySelector('.cards-icon-card-icon img');
    return img && isPhoto(img) && li.querySelector('.cards-icon-card-body');
  });
  if (!hasOption && photoRows) {
    split = true;
    block.classList.add('cards-icon-jumbo');
  }

  if (split) {
    block.classList.add('cards-icon-split');
    items.forEach((li) => {
      const media = li.querySelector('.cards-icon-card-icon');
      if (!media) return;
      media.className = 'cards-icon-card-media';
      const img = media.querySelector('img');
      // logos and illustrations sit at natural size in a slim banner
      if (img && !isPhoto(img)) li.classList.add('cards-icon-card-logo');
    });
  }

  decorateLinks(ul);

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!canOptimize(img)) return;
    const width = img.closest('.cards-icon-card-media') ? '750' : '160';
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });

  block.replaceChildren(ul);
}
