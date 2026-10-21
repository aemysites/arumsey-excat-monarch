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

/** A paragraph that holds only links. */
function isLinkOnly(el) {
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a[href]');
  return links.length >= 1
    && [...links].map((a) => a.textContent).join('').replace(/\s/g, '')
      === el.textContent.replace(/\s/g, '');
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

/** Eyebrow before the heading; trailing link-only paragraphs become the action row. */
function decorateContent(content) {
  const headings = [...content.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4')];
  // an h1 followed by the main heading is the eyebrow (citi.com puts the product name in the h1)
  if (headings.length > 1 && headings[0].tagName === 'H1') {
    headings.shift().classList.add('hero-chevron-eyebrow');
  }
  const [heading] = headings;
  let prev = heading ? heading.previousElementSibling : null;
  while (prev) {
    if (prev.tagName === 'P' && !prev.querySelector('a, picture, img')) {
      prev.classList.add('hero-chevron-eyebrow');
    }
    prev = prev.previousElementSibling;
  }

  const links = [...content.children].filter(isLinkOnly);
  if (links.length) {
    const actions = document.createElement('div');
    actions.className = 'hero-chevron-actions';
    links[0].before(actions);
    // only gather consecutive link-only paragraphs starting at the first one
    let next = actions.nextElementSibling;
    while (next && isLinkOnly(next)) {
      const current = next;
      next = next.nextElementSibling;
      actions.append(current);
    }
  }
}

export default async function decorate(block) {
  const rows = [...block.children];
  const images = [];
  let content = null;
  let mediaFirst = false;
  const extras = [];

  rows.forEach((row) => {
    const cells = [...row.children].filter(hasContent);
    if (!cells.length) return;
    if (!content) {
      const pics = cells.filter(isPictureOnly);
      const texts = cells.filter((c) => !isPictureOnly(c));
      if (!texts.length) {
        images.push(...pics);
        return;
      }
      if (texts.length === 1) {
        if (pics.length) mediaFirst = cells.indexOf(pics[0]) < cells.indexOf(texts[0]);
        images.push(...pics);
        [content] = texts;
        return;
      }
    }
    extras.push(cells);
  });

  await Promise.all(extras.flat().map(inlineFragment));

  block.replaceChildren();

  const inner = document.createElement('div');
  inner.className = 'hero-chevron-inner';

  let contentEl = null;
  if (content) {
    contentEl = document.createElement('div');
    contentEl.className = 'hero-chevron-content';
    contentEl.append(...content.childNodes);
    decorateContent(contentEl);
  }

  let mediaEl = null;
  if (images.length) {
    mediaEl = document.createElement('div');
    mediaEl.className = 'hero-chevron-media';
    images.forEach((cell) => mediaEl.append(...cell.childNodes));
  }

  const ordered = mediaFirst ? [mediaEl, contentEl] : [contentEl, mediaEl];
  inner.append(...ordered.filter(Boolean));
  if (mediaEl && mediaFirst) block.classList.add('hero-chevron-media-start');
  if (inner.children.length) block.append(inner);

  // extra rows: a product-details strip (columns) or follow-on copy
  extras.forEach((cells) => {
    const extra = document.createElement('div');
    extra.className = 'hero-chevron-details';
    extra.style.setProperty('--hero-chevron-columns', cells.length);
    cells.forEach((cell) => {
      const col = document.createElement('div');
      col.className = 'hero-chevron-details-item';
      col.append(...cell.childNodes);
      extra.append(col);
    });
    block.append(extra);
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isHero = !!img.closest('.hero-chevron-media');
    img.closest('picture').replaceWith(createOptimizedPicture(
      img.src,
      img.alt,
      isHero,
      isHero ? [{ media: '(min-width: 900px)', width: '1200' }, { width: '750' }] : [{ width: '750' }],
    ));
  });
}
