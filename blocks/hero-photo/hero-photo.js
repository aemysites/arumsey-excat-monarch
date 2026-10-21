import { createOptimizedPicture } from '../../scripts/aem.js';

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

export default function decorate(block) {
  const cells = [];
  [...block.children].forEach((row) => {
    [...row.children].filter(hasContent).forEach((cell) => cells.push(cell));
  });

  const images = cells.filter(isPictureOnly);
  const texts = cells.filter((c) => !isPictureOnly(c));

  block.replaceChildren();

  if (images.length) {
    const bg = document.createElement('div');
    bg.className = 'hero-photo-background';
    bg.append(...images[0].querySelectorAll('picture, img:not(picture img)'));
    block.append(bg);
    block.classList.add('hero-photo-has-background');
  }

  if (texts.length) {
    const content = document.createElement('div');
    content.className = 'hero-photo-content';
    texts.forEach((c) => content.append(...c.childNodes));

    const heading = content.querySelector(':scope > h1, :scope > h2, :scope > h3');
    let prev = heading ? heading.previousElementSibling : null;
    while (prev) {
      if (prev.tagName === 'P' && !prev.querySelector('a, picture, img')) {
        prev.classList.add('hero-photo-eyebrow');
      }
      prev = prev.previousElementSibling;
    }

    const links = [...content.children].filter(isLinkOnly);
    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'hero-photo-actions';
      links[0].before(actions);
      let next = actions.nextElementSibling;
      while (next && isLinkOnly(next)) {
        const current = next;
        next = next.nextElementSibling;
        actions.append(current);
      }
    }
    block.append(content);
  }

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isBg = !!img.closest('.hero-photo-background');
    img.closest('picture').replaceWith(createOptimizedPicture(
      img.src,
      img.alt,
      isBg,
      isBg ? [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }] : [{ width: '750' }],
    ));
  });
}
