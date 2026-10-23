import { createOptimizedPicture } from '../../scripts/aem.js';
import { findLottieLink, lazyRenderLottie } from '../../scripts/lottie.js';

function optimizeImages(root, width, eager) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, eager, [{ width }]));
  });
}

/** A cell is media when it holds a picture / video / Lottie link and no other text. */
function isMediaCell(cell) {
  const hasMedia = cell.querySelector('picture, img, video') || findLottieLink(cell);
  if (!hasMedia) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img, video, a').forEach((el) => el.remove());
  return !clone.textContent.trim();
}

/** A list whose items are each a single link becomes a select + go button. */
function buildLinkSelect(list, content) {
  const items = [...list.querySelectorAll(':scope > li')];
  if (items.length < 2) return;
  const links = items.map((li) => {
    const a = li.querySelector(':scope > a');
    return a && li.textContent.trim() === a.textContent.trim() ? a : null;
  });
  if (links.some((a) => !a)) return;

  const form = document.createElement('form');
  form.className = 'hero-split-select';
  const id = `hero-split-select-${Math.random().toString(36).slice(2, 8)}`;

  // An authored button after the list labels the go button; a preceding
  // short paragraph labels the select.
  const next = list.nextElementSibling;
  const goLink = next && next.matches('.button-wrapper') ? next.querySelector('a') : null;
  const prev = list.previousElementSibling;
  const labelText = prev && prev.tagName === 'P' && !prev.querySelector('a') ? prev.textContent.trim() : '';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.className = 'hero-split-select-label';
  label.textContent = labelText || 'Select an option';
  if (labelText) prev.remove();

  const select = document.createElement('select');
  select.id = id;
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = labelText || 'Select';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.append(placeholder);
  links.forEach((a) => {
    const option = document.createElement('option');
    option.value = a.href;
    option.textContent = a.textContent.trim();
    select.append(option);
  });

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary';
  button.textContent = goLink ? goLink.textContent.trim() : 'Select';
  if (goLink) next.remove();

  form.append(label, select, button);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (select.value) window.location.href = select.value;
  });
  list.replaceWith(form);
  content.classList.add('has-select');
}

/** pricing: group price text between the heading and the CTAs. */
function decoratePricing(content) {
  const children = [...content.children];
  const firstButton = children.findIndex((el) => el.matches('.button-wrapper, .hero-split-select'));
  const lastHeading = children.reduce((acc, el, i) => (/^H[1-6]$/.test(el.tagName) ? i : acc), -1);
  const end = firstButton === -1 ? children.length : firstButton;
  const priceEls = children.slice(lastHeading + 1, end)
    .filter((el) => !el.classList.contains('hero-split-eyebrow'));
  if (!priceEls.length) return;

  const pricing = document.createElement('div');
  pricing.className = 'hero-split-pricing';
  priceEls[0].before(pricing);
  pricing.append(...priceEls);

  pricing.querySelectorAll('ul, ol').forEach((list) => list.classList.add('hero-split-price-columns'));
  pricing.querySelectorAll('p, li').forEach((el) => {
    if (/^\s*[+]?\s*\$\s?\d/.test(el.textContent)) el.classList.add('hero-split-price');
  });
}

/**
 * hero-split: text column beside a framed media column.
 * Options: bleed (media fills its half to the page edge), pricing (price block above CTAs).
 * Section background colour comes from section metadata Style, not a block class.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const mediaCells = cells.filter(isMediaCell);
  const contentCells = cells.filter((c) => !mediaCells.includes(c) && c.textContent.trim());

  const content = document.createElement('div');
  content.className = 'hero-split-content';
  contentCells.forEach((cell) => content.append(...cell.childNodes));

  const media = document.createElement('div');
  media.className = 'hero-split-media';
  mediaCells.forEach((cell) => media.append(...cell.childNodes));

  // Drop empty paragraphs left behind by authoring.
  [content, media].forEach((el) => el.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img, video, a')) p.remove();
  }));

  // Eyebrow: a short paragraph directly before the first heading.
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  const before = heading && heading.previousElementSibling;
  if (before && before.tagName === 'P' && !before.classList.contains('button-wrapper')) {
    before.classList.add('hero-split-eyebrow');
    // An all-caps eyebrow is a tag label (source .eyebrow-label pill).
    const label = before.textContent.trim();
    if (/[A-Z]/.test(label) && label === label.toUpperCase()) before.classList.add('hero-split-tag');
  }

  // A paragraph holding only a plain link is an arrow link (source a.right-arrow).
  content.querySelectorAll(':scope > p:not(.button-wrapper)').forEach((p) => {
    const links = p.querySelectorAll('a');
    if (links.length === 1 && p.textContent.trim() === links[0].textContent.trim()) {
      p.classList.add('hero-split-link');
    }
  });

  content.querySelectorAll(':scope > ul').forEach((list) => buildLinkSelect(list, content));

  if (block.classList.contains('pricing')) decoratePricing(content);

  // Group consecutive CTAs.
  const buttons = [...content.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const group = document.createElement('div');
    group.className = 'hero-split-actions';
    buttons[0].before(group);
    group.append(...buttons);
    // Default variant: an arrow link right after the CTAs sits beside them
    // (source .btn-container holds the button and the a.right-arrow).
    if (!block.classList.contains('bleed') && !block.classList.contains('pricing')) {
      let next = group.nextElementSibling;
      while (next && next.classList.contains('hero-split-link')) {
        const link = next;
        next = next.nextElementSibling;
        group.append(link);
      }
    }
  }

  block.replaceChildren(content);
  if (media.childNodes.length) {
    block.append(media);
    const lottieLink = findLottieLink(media);
    if (lottieLink) {
      media.classList.add('is-lottie');
      lazyRenderLottie(media, lottieLink.getAttribute('href'), {
        loop: true,
        autoplay: true,
        controls: true,
        label: (lottieLink.title && !/\.json$/i.test(lottieLink.title)) ? lottieLink.title : '',
      });
    }
    // The hero is usually the LCP element: load its image eagerly in the first section.
    const section = block.closest('.section');
    const eager = !section || !section.previousElementSibling;
    optimizeImages(media, '1200', eager);
  } else {
    block.classList.add('no-media');
  }
}
