import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/** Layouts where a lone picture-only row is the full-bleed background. */
const PHOTO_LAYOUTS = ['photo', 'photo-centred'];

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

/** Tag eyebrow, badge, highlight list and legal links inside the main copy. */
function decorateContent(content) {
  content.querySelectorAll(':scope > p').forEach((p) => {
    const only = p.children.length === 1 ? p.firstElementChild : null;
    if (only && only.tagName === 'EM' && !only.querySelector('a')
      && only.textContent.trim() === p.textContent.trim()) {
      p.classList.add('hero-card-badge');
    }
  });
  const headings = [...content.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4')];
  // An h1 followed by the headline is the eyebrow (the card name is the page's h1 on card PDPs).
  if (headings.length > 1 && headings[0].tagName === 'H1') {
    headings.shift().classList.add('hero-card-eyebrow');
  }
  const [heading] = headings;
  let prev = heading ? heading.previousElementSibling : null;
  while (prev) {
    if (prev.tagName === 'P' && !prev.classList.contains('hero-card-badge')
      && !prev.querySelector('a, picture, img')) {
      prev.classList.add('hero-card-eyebrow');
    }
    prev = prev.previousElementSibling;
  }
  content.querySelectorAll(':scope > ul').forEach((ul) => ul.classList.add('hero-card-highlights'));
}

export default async function decorate(block) {
  const layout = PHOTO_LAYOUTS.find((c) => block.classList.contains(c)) || null;
  const rows = [...block.children];

  const images = []; // picture-only cells, in authored order
  let content = null;
  let mediaFirst = false;
  const extras = []; // remaining rows, each an array of cells

  rows.forEach((row) => {
    const cells = [...row.children].filter(hasContent);
    if (!cells.length) return;
    if (!content) {
      const pics = cells.filter(isPictureOnly);
      const texts = cells.filter((c) => !isPictureOnly(c));
      if (texts.length === 0) {
        images.push(...pics);
        return;
      }
      if (texts.length === 1) {
        // image cell(s) sharing the row with the copy: order decides the image side
        if (pics.length) mediaFirst = cells.indexOf(pics[0]) < cells.indexOf(texts[0]);
        else if (images.length) mediaFirst = true;
        images.push(...pics);
        [content] = texts;
        return;
      }
    }
    extras.push(cells);
  });

  await Promise.all(extras.flat().map(inlineFragment));

  // two pictures: background + card image; one picture: background for photo layouts
  let background = null;
  let media = null;
  if (images.length >= 2) {
    [background, media] = images;
  } else if (images.length === 1) {
    if (layout) [background] = images;
    else [media] = images;
  }

  block.replaceChildren();

  if (background) {
    const bg = document.createElement('div');
    bg.className = 'hero-card-background';
    bg.append(...background.querySelectorAll('picture, img:not(picture img)'));
    block.append(bg);
    block.classList.add('hero-card-has-background');
  }

  const inner = document.createElement('div');
  inner.className = 'hero-card-inner';

  let mediaEl = null;
  if (media) {
    mediaEl = document.createElement('div');
    mediaEl.className = 'hero-card-media';
    mediaEl.append(...media.childNodes);
  }

  let contentEl = null;
  if (content) {
    contentEl = document.createElement('div');
    contentEl.className = 'hero-card-content';
    contentEl.append(...content.childNodes);
    decorateContent(contentEl);
  }

  // keep the authored order so the image side comes from the content
  const ordered = mediaFirst ? [mediaEl, contentEl] : [contentEl, mediaEl];
  inner.append(...ordered.filter(Boolean));
  if (mediaEl && contentEl) {
    block.classList.add(mediaFirst ? 'hero-card-media-start' : 'hero-card-media-end');
  }
  if (inner.children.length) block.append(inner);

  let titled = false;
  extras.forEach((cells) => {
    const extra = document.createElement('div');
    extra.className = 'hero-card-extra';
    if (cells.length > 1) {
      extra.classList.add('hero-card-extra-columns');
      extra.style.setProperty('--hero-card-columns', cells.length);
    }
    cells.forEach((cell) => {
      const col = document.createElement('div');
      col.className = 'hero-card-extra-item';
      col.append(...cell.childNodes);
      extra.append(col);
    });
    // photo layouts keep stats, APR box and legal copy inside the content panel
    const panel = inner.querySelector('.hero-card-content');
    if (layout === 'photo' && panel) {
      if (cells.length > 1) {
        block.classList.add('hero-card-has-columns');
        // a heading closing the copy ("Low Intro APR...") titles the column row that follows
        const last = panel.lastElementChild;
        const headline = panel.querySelector(':scope > :is(h2, h3, h4)');
        if (!titled && last && last !== headline && /^H[2-4]$/.test(last.tagName)) {
          last.classList.add('hero-card-extra-title');
          extra.prepend(last);
          titled = true;
        }
      }
      panel.append(extra);
    } else block.append(extra);
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isBg = !!img.closest('.hero-card-background');
    img.closest('picture').replaceWith(createOptimizedPicture(
      img.src,
      img.alt,
      isBg,
      isBg ? [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }] : [{ width: '750' }],
    ));
  });
}
