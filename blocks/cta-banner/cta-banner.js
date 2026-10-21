import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/** @param {Element} el */
function isPictureOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

/** A paragraph that holds one link and nothing else. */
function isLinkOnly(el) {
  if (!['P', 'DIV'].includes(el.tagName)) return false;
  const links = el.querySelectorAll('a[href]');
  return links.length >= 1
    && [...links].map((a) => a.textContent).join('').replace(/\s/g, '')
      === el.textContent.replace(/\s/g, '');
}

/** A cell holding nothing but a link to a fragment: load it in place. */
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
  const rows = [...block.children];
  const cells = [];

  // a leading picture-only row (with other rows after it) is the background image
  let background = null;
  if (rows.length > 1 && isPictureOnly(rows[0])) {
    background = rows.shift();
  }
  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.textContent.trim() || cell.querySelector('picture, img, a, .icon')) cells.push(cell);
    });
  });

  await Promise.all(cells.map(inlineFragment));

  const panel = document.createElement('div');
  panel.className = 'cta-banner-panel';
  const media = document.createElement('div');
  media.className = 'cta-banner-media';
  const content = document.createElement('div');
  content.className = 'cta-banner-content';
  const actions = document.createElement('div');
  actions.className = 'cta-banner-actions';

  cells.forEach((cell) => {
    if (isPictureOnly(cell)) {
      media.append(...cell.childNodes);
      return;
    }
    const children = [...cell.children];
    if (children.length && children.every(isLinkOnly)) {
      actions.append(...children);
      return;
    }
    if (!children.length && cell.querySelector('a[href]') && isLinkOnly(cell)) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      actions.append(p);
      return;
    }
    content.append(...cell.childNodes);
  });

  // pull trailing link-only paragraphs out of the copy when no actions cell was authored
  if (!actions.children.length) {
    let last = content.lastElementChild;
    const trailing = [];
    while (last && isLinkOnly(last) && last.tagName === 'P') {
      trailing.unshift(last);
      last = last.previousElementSibling;
    }
    if (trailing.length && trailing.length < content.children.length) actions.append(...trailing);
  }

  // citi.com CTA styles: a banner with body copy uses chevron text links; a heading-only
  // banner leads with a filled button and follows with underlined bold links.
  // Links the author already formatted as buttons keep their own style.
  const hasCopy = [...content.children].some((el) => el.tagName === 'P' && el.textContent.trim());
  [...actions.children].forEach((item, i) => {
    item.classList.add('cta-banner-action');
    const link = item.querySelector('a[href]');
    if (!link || link.classList.contains('button')) return;
    if (hasCopy) {
      link.classList.add('button', 'accent');
    } else if (i === 0) {
      link.classList.add('button', 'primary');
    } else {
      link.classList.add('cta-banner-link');
    }
  });

  if (media.children.length) panel.append(media);
  if (content.childNodes.length) panel.append(content);
  if (actions.children.length) panel.append(actions);

  block.replaceChildren();
  if (background) {
    const bg = document.createElement('div');
    bg.className = 'cta-banner-background';
    bg.append(...background.querySelectorAll('picture, img:not(picture img)'));
    block.append(bg);
    block.classList.add('cta-banner-has-background');
    // the photo bleeds to the viewport edges; 100vw includes a classic scrollbar
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) block.style.setProperty('--cta-banner-scrollbar', `${scrollbar}px`);
  }
  // nothing authored (e.g. an empty import): leave the block empty so it is hidden
  if (panel.children.length) block.append(panel);

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isBg = !!img.closest('.cta-banner-background');
    img.closest('picture').replaceWith(createOptimizedPicture(
      img.src,
      img.alt,
      isBg,
      isBg ? [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }] : [{ width: '750' }],
    ));
  });
}
