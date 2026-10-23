import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'columns-promo-card';
const PRICE_RE = /^\$\s?\d/;

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

const isButton = (el) => el.matches('p.button-wrapper');

/**
 * Group consecutive button paragraphs into one actions stack.
 * @param {Element} col
 */
function groupActions(col) {
  let group = null;
  [...col.children].forEach((child) => {
    if (isButton(child)) {
      if (!group) {
        group = document.createElement('div');
        group.className = `${BLOCK}-actions`;
        child.before(group);
      }
      group.append(child);
    } else {
      group = null;
    }
  });
}

/**
 * A price paragraph ("$130") plus its following plain paragraphs (state fee, strike price,
 * fee note) form a price group; it sits beside the CTA stack in a shared footer row.
 * An optional short lead-in ("Starting at") directly before the price joins the group.
 * @param {Element} col
 */
function groupPrice(col) {
  const price = [...col.children].find((el) => el.tagName === 'P' && PRICE_RE.test(el.textContent.trim()));
  if (!price) return;
  price.classList.add(`${BLOCK}-price`);

  const group = document.createElement('div');
  group.className = `${BLOCK}-price-group`;
  const lead = price.previousElementSibling;
  const leadIn = lead && lead.tagName === 'P' && !lead.querySelector('a, picture')
    && lead.textContent.trim().length <= 20 && !lead.classList.length;

  const members = [];
  if (leadIn) members.push(lead);
  members.push(price);
  let next = price.nextElementSibling;
  while (next && next.tagName === 'P' && !isButton(next)) {
    members.push(next);
    next = next.nextElementSibling;
  }
  members[0].before(group);
  group.append(...members);

  const footer = document.createElement('div');
  footer.className = `${BLOCK}-footer`;
  group.before(footer);
  footer.append(group);
  if (next && next.classList.contains(`${BLOCK}-actions`)) footer.append(next);
}

/**
 * A short paragraph directly before the first heading is the eyebrow label.
 * @param {Element} col
 */
function markEyebrow(col) {
  const heading = col.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4');
  const prev = heading?.previousElementSibling;
  if (prev && prev.tagName === 'P' && !prev.querySelector('picture, a') && prev.textContent.trim().length <= 60) {
    prev.classList.add(`${BLOCK}-eyebrow`);
  }
}

/**
 * Standalone (non-button) link paragraphs render as arrow links; plain paragraphs after
 * the CTAs are footnotes/disclaimers.
 * @param {Element} col
 */
function markTrailing(col) {
  let afterCta = false;
  [...col.children].forEach((child) => {
    if (child.matches(`.${BLOCK}-actions, .${BLOCK}-footer`)) {
      afterCta = true;
      return;
    }
    if (child.tagName !== 'P' || child.classList.length) return;
    const links = child.querySelectorAll('a');
    if (links.length === 1 && child.textContent.trim() === links[0].textContent.trim()) {
      child.classList.add(`${BLOCK}-link`);
      afterCta = true;
    } else if (afterCta) {
      child.classList.add(`${BLOCK}-footnote`);
    }
  });
}

/**
 * Footnote markers (<sup>*</sup>, <sup>1</sup>) jump to the matching page disclaimer: the
 * first disclaimer list item (a "disclaimer" section, else any default-content list) that
 * starts with the same marker. Markers with no disclaimer on the page stay plain text.
 * @param {Element} block
 */
function linkFootnotes(block) {
  let items = [...document.querySelectorAll('main .section.disclaimer li')];
  if (!items.length) {
    items = [...document.querySelectorAll('main .default-content-wrapper > :is(ol, ul) > li')];
  }
  if (!items.length) return;
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  block.querySelectorAll('sup').forEach((sup) => {
    const marker = sup.textContent.trim();
    if (!marker || sup.querySelector('a') || marker.length > 3) return;
    // "*" must not match "**" or "1" match "1099"
    const re = new RegExp(`^${escape(marker)}(?![\\w*†‡])`);
    const target = items.find((li) => re.test(li.textContent.trim()));
    if (!target) return;
    const n = [...target.parentElement.children].indexOf(target) + 1;
    if (!target.id) {
      let id = `disclaimer-${n}`;
      while (document.getElementById(id)) id = `${id}-x`;
      target.id = id;
    }
    const a = document.createElement('a');
    a.href = `#${target.id}`;
    a.className = `${BLOCK}-footnote-link`;
    a.textContent = marker;
    a.setAttribute('aria-label', `Go to disclaimer ${n} for more details`);
    sup.replaceChildren(a);
  });
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  block.classList.add(`${BLOCK}-${firstRow.children.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add(`${BLOCK}-row`);
    [...row.children].forEach((col) => {
      if (isImageOnly(col)) {
        col.classList.add(`${BLOCK}-img-col`);
        return;
      }
      col.classList.add(`${BLOCK}-text-col`);
      markEyebrow(col);
      groupActions(col);
      groupPrice(col);
      markTrailing(col);
    });
  });

  optimizePictures(block);
  linkFootnotes(block);
}
