import { createOptimizedPicture } from '../../scripts/aem.js';

const DARK_CELL = /^\(?\s*dark\s*\)?$/i;
const DARK_PREFIX = /^\s*\(\s*dark\s*\)\s*/i;
const ICON_MAX_WIDTH = 160;
const HEADING = 'h1, h2, h3, h4, h5, h6';
// Scene7 presets the source renders edge-to-edge (img-fb-rounded); other card media sits inset
const BLEED_MEDIA = /stacked-content-rounded-corners|[?&]scl=|[?&]op_sharpen=/i;
// statistic headline such as "63%", "$35", "22M", "1,000+"
const STAT = /^[<>~]?[$€£]?\d[\d.,]*\s?(%|\+|[kmb])?$/i;

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
 * Small or SVG images (files or inline data URIs) are treated as icons rather than card media.
 * @param {HTMLImageElement} img
 * @returns {boolean}
 */
function isIcon(img) {
  const src = img.getAttribute('src') || '';
  if (/^data:image\/svg/i.test(src)) return true;
  const url = new URL(src, window.location.href);
  if (/\.svg$/i.test(url.pathname)) return true;
  const width = parseInt(img.getAttribute('width'), 10);
  return Number.isFinite(width) && width > 0 && width <= ICON_MAX_WIDTH;
}

/**
 * Detects and strips the per-card dark marker.
 * Supported: an extra cell whose whole text is "dark" or "(dark)", or a
 * paragraph/heading that starts with "(dark)" (the marker text is stripped,
 * and the element is removed when nothing else is left).
 * @param {HTMLElement} li
 * @returns {boolean} true when the card was marked dark
 */
function extractDarkMarker(li) {
  let dark = false;
  [...li.children].forEach((cell) => {
    if (!cell.querySelector('picture, img') && DARK_CELL.test(cell.textContent.trim())) {
      cell.remove();
      dark = true;
    }
  });
  li.querySelectorAll(`p, ${HEADING}`).forEach((el) => {
    if (!DARK_PREFIX.test(el.textContent)) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node && !node.textContent.trim()) node = walker.nextNode();
    if (!node || !DARK_PREFIX.test(node.textContent)) return;
    node.textContent = node.textContent.replace(DARK_PREFIX, '');
    if (!el.textContent.trim() && !el.querySelector('picture, img')) el.remove();
    dark = true;
  });
  return dark;
}

/**
 * @param {Element} p
 * @returns {boolean} true when the paragraph holds only links
 */
function isLinkParagraph(p) {
  if (!p || p.tagName !== 'P' || p.querySelector('picture, img')) return false;
  const links = p.querySelectorAll('a');
  const linkText = [...links].map((a) => a.textContent).join('').trim();
  return links.length > 0 && linkText === p.textContent.trim();
}

/**
 * Trailing link-only paragraphs become the card CTA area (pinned to the card bottom).
 * @param {HTMLElement} body
 */
function buildCta(body) {
  const ctas = [];
  let el = body.lastElementChild;
  while (el && isLinkParagraph(el)) {
    ctas.unshift(el);
    el = el.previousElementSibling;
  }
  if (!ctas.length) return;
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cards-feature-card-cta';
  ctaWrap.append(...ctas);
  body.append(ctaWrap);
}

/**
 * Eyebrow: a short paragraph placed directly before the card heading.
 * @param {HTMLElement} body
 * @returns {HTMLElement|null}
 */
function findEyebrow(body) {
  const first = body.firstElementChild;
  if (!first || first.tagName !== 'P' || first.querySelector('picture, img')) return null;
  const next = first.nextElementSibling;
  return next && next.matches(HEADING) ? first : null;
}

/**
 * Icon cards: the icon sits on one row with the eyebrow or heading (source card header).
 * @param {HTMLElement} li
 * @param {HTMLElement} iconCell
 * @param {HTMLElement} body
 * @param {HTMLElement|null} eyebrow
 */
function buildIconHeader(li, iconCell, body, eyebrow) {
  const lead = eyebrow || body.firstElementChild;
  if (!lead || !(eyebrow || lead.matches(HEADING))) return;
  const header = document.createElement('div');
  header.className = 'cards-feature-card-header';
  iconCell.classList.add('cards-feature-card-header-icon');
  body.prepend(header);
  header.append(iconCell, lead);
  li.classList.add('has-icon-header');
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    if (extractDarkMarker(li)) li.classList.add('dark');

    [...li.children].forEach((cell) => {
      const onlyPicture = cell.children.length === 1 && cell.querySelector('picture')
        && !cell.textContent.trim();
      if (onlyPicture) {
        cell.className = 'cards-feature-card-image';
        const img = cell.querySelector('img');
        if (img && isIcon(img)) {
          cell.classList.add('cards-feature-card-icon');
          li.classList.add('has-icon');
        }
      } else {
        cell.className = 'cards-feature-card-body';
      }
    });

    // drop empty cells authors leave behind
    [...li.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) cell.remove();
    });

    const body = li.querySelector('.cards-feature-card-body');
    const heading = body && body.querySelector(HEADING);
    if (body) {
      buildCta(body);

      const eyebrow = findEyebrow(body);
      if (eyebrow) {
        eyebrow.classList.add('cards-feature-card-eyebrow');
        li.classList.add('has-eyebrow');
      }

      if (heading && STAT.test(heading.textContent.trim())) li.classList.add('is-stat');

      const iconCell = li.querySelector(':scope > .cards-feature-card-icon');
      if (iconCell && iconCell.nextElementSibling === body) {
        buildIconHeader(li, iconCell, body, eyebrow);
      }
    }

    // photo / illustration placement: edge-to-edge (bleed) or inset in the padded card
    const media = li.querySelector(':scope > .cards-feature-card-image:not(.cards-feature-card-icon) img');
    if (media && heading) {
      const bleed = BLEED_MEDIA.test(media.getAttribute('src') || '') && heading.tagName !== 'H2';
      li.classList.add(bleed ? 'has-media-bleed' : 'has-media-inset');
    }

    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!canOptimize(img)) return;
    const icon = img.closest('.cards-feature-card-icon');
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: icon ? '160' : '750' }]),
    );
  });

  block.replaceChildren(ul);
}
