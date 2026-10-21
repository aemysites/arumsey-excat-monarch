import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICON_SELECTOR = ':scope > picture, :scope > img, :scope > span.icon';

/**
 * Returns the fragment path when a cell holds nothing but a single fragment link.
 * @param {Element} cell
 * @returns {string|null}
 */
function getFragmentPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const link = links[0];
  if (cell.textContent.trim() !== link.textContent.trim()) return null;
  if (cell.querySelector('picture, img')) return null;
  try {
    const { pathname } = new URL(link.href, window.location.href);
    return pathname.includes('/fragments/') ? pathname : null;
  } catch {
    return null;
  }
}

/**
 * Replaces a fragment-link cell with the fragment's content.
 * @param {Element} cell
 */
async function inlineFragment(cell) {
  const path = getFragmentPath(cell);
  if (!path) return;
  const fragment = await loadFragment(path);
  if (!fragment) return;
  const content = [...fragment.querySelectorAll(':scope > .section > *')];
  if (!content.length) return;
  cell.replaceChildren(...content);
}

/**
 * Optimises same-origin, non-SVG images only; migrated images keep their source URLs.
 * @param {Element} scope
 */
function optimizeImages(scope) {
  scope.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function isImageOnly(cell) {
  return !!cell.querySelector('picture, img') && !cell.textContent.trim()
    && cell.querySelectorAll('picture, img').length <= 2;
}

/**
 * Marks paragraphs/list items that lead with an icon (checkmarks, feature icons).
 * @param {Element} cell
 */
function decorateIconItems(cell) {
  // li > p > picture (icon paragraph inside a list item): lift the icon out of its paragraph
  cell.querySelectorAll('li').forEach((li) => {
    const first = li.firstElementChild;
    if (!first || first.tagName !== 'P' || first.textContent.trim()) return;
    const icon = first.querySelector(ICON_SELECTOR);
    if (!icon || first.children.length !== 1) return;
    first.replaceWith(icon);
  });
  cell.querySelectorAll('p, li').forEach((item) => {
    const icon = item.querySelector(ICON_SELECTOR);
    if (!icon || item.firstElementChild !== icon) return;
    if (!item.textContent.trim()) return;
    item.classList.add('columns-media-icon-item');
    const body = document.createElement('div');
    body.className = 'columns-media-icon-item-body';
    const nodes = [...item.childNodes].filter((node) => node !== icon);
    body.append(...nodes);
    item.append(body);
  });
  cell.querySelectorAll('ul, ol').forEach((list) => {
    const items = [...list.children];
    if (items.length && items.every((li) => li.classList.contains('columns-media-icon-item'))) {
      list.classList.add('columns-media-icon-list');
    }
  });
}

/**
 * Marks the eyebrow (a short paragraph directly before the heading), plain lists
 * (rendered as checklists) and a trailing lone link (the module CTA).
 * @param {Element} cell
 * @param {Element} block
 */
function decorateTextParts(cell, block) {
  const heading = cell.querySelector(':scope > :is(h1, h2, h3, h4)');
  const prev = heading?.previousElementSibling;
  if (prev && prev.tagName === 'P' && !prev.previousElementSibling && !prev.querySelector('a, picture, img')) {
    prev.classList.add('columns-media-eyebrow');
  }

  cell.querySelectorAll(':scope > ul:not(.columns-media-icon-list), :scope > ol:not(.columns-media-icon-list)')
    .forEach((list) => {
      list.classList.add('columns-media-checklist');
      block.classList.add('columns-media-has-list');
    });

  // a trailing paragraph holding only a plain link is the module CTA on citi.com:
  // a filled button on promo modules, a chevron text link on faq
  const last = cell.lastElementChild;
  const link = last?.tagName === 'P' && last.children.length === 1 ? last.querySelector(':scope > a[href]') : null;
  if (!link || last.textContent.trim() !== link.textContent.trim()) return;
  if (link.classList.contains('button')) {
    last.classList.add('columns-media-cta');
    return;
  }
  if (block.classList.contains('faq')) {
    link.className = 'button accent';
  } else if (!['light', 'dark', 'icon-feature-list', 'centred-image'].some((c) => block.classList.contains(c))) {
    link.className = 'button primary';
  } else {
    return;
  }
  last.className = 'button-wrapper columns-media-cta';
}

/**
 * columns-media: an image column beside a text column (eyebrow, heading,
 * text, list, buttons). Options:
 * - faq: text-only columns split by rules
 * - icon-feature-list: the text column is a list of icon + heading + text items
 * - centred-image: image in the middle column, text items either side
 * - light / dark: tonal hooks; dark on a text-only block splits heading | copy
 * @param {Element} block
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const maxCols = Math.max(...rows.map((row) => row.children.length), 1);
  block.classList.add(`columns-media-${maxCols}-cols`);

  const cells = rows.flatMap((row) => {
    row.classList.add('columns-media-row');
    return [...row.children];
  });

  await Promise.all(cells.map((cell) => inlineFragment(cell).catch(() => {})));

  let hasImage = false;
  rows.forEach((row) => {
    const rowCells = [...row.children];
    rowCells.forEach((cell) => {
      cell.classList.add('columns-media-col');
      if (!cell.textContent.trim() && !cell.querySelector('picture, img, .icon')) {
        cell.classList.add('columns-media-col-empty');
        return;
      }
      if (isImageOnly(cell)) {
        hasImage = true;
        cell.classList.add('columns-media-img-col');
        optimizeImages(cell);
      } else {
        cell.classList.add('columns-media-text-col');
        decorateIconItems(cell);
        decorateTextParts(cell, block);
      }
    });
  });

  if (!hasImage) block.classList.add('columns-media-text-only');
}
