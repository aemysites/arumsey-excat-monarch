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

/** A paragraph (or bare cell) that holds only links. */
function isLinkOnly(el) {
  if (!['P', 'DIV'].includes(el.tagName)) return false;
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

export default async function decorate(block) {
  const cells = [];
  [...block.children].forEach((row) => {
    [...row.children].filter(hasContent).forEach((cell) => cells.push(cell));
  });
  await Promise.all(cells.map(inlineFragment));

  const content = document.createElement('div');
  content.className = 'section-heading-content';
  const actions = document.createElement('div');
  actions.className = 'section-heading-actions';
  const media = document.createElement('div');
  media.className = 'section-heading-media';
  let mediaFirst = false;

  cells.forEach((cell) => {
    if (isPictureOnly(cell)) {
      if (!content.childNodes.length) mediaFirst = true;
      media.append(...cell.childNodes);
      return;
    }
    const children = [...cell.children];
    if (children.length && children.every(isLinkOnly)) {
      actions.append(...children);
      return;
    }
    if (!children.length && isLinkOnly(cell)) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      actions.append(p);
      return;
    }
    content.append(...cell.childNodes);
  });

  // a single-cell authoring: trailing link-only paragraphs after the heading are the actions
  if (!actions.children.length && !block.classList.contains('promo-panel')) {
    const trailing = [];
    let last = content.lastElementChild;
    while (last && last.tagName === 'P' && isLinkOnly(last)) {
      trailing.unshift(last);
      last = last.previousElementSibling;
    }
    if (trailing.length && trailing.length < content.children.length) actions.append(...trailing);
  }

  // the promo panel keeps its CTA inside the coloured text panel
  if (block.classList.contains('promo-panel') && actions.children.length) {
    content.append(...actions.children);
  }

  block.replaceChildren();
  const parts = [];
  if (content.childNodes.length) parts.push(content);
  if (actions.children.length) parts.push(actions);
  if (media.children.length) {
    if (mediaFirst) parts.unshift(media);
    else parts.push(media);
    block.classList.add('section-heading-has-media');
  }
  block.append(...parts);

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
