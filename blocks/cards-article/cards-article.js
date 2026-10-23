import { createOptimizedPicture } from '../../scripts/aem.js';

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
 * True when a paragraph holds nothing but links.
 * @param {Element} p
 * @returns {boolean}
 */
function isLinkOnly(p) {
  const links = [...p.querySelectorAll('a')];
  if (!links.length || p.querySelector('picture, img')) return false;
  return links.map((a) => a.textContent).join('').trim() === p.textContent.trim();
}

/**
 * Tags body parts: eyebrow (short text before the heading), title, CTA.
 * @param {Element} body
 */
function decorateBody(body) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('cards-article-card-title');
    let prev = heading.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'P' && !prev.querySelector('picture, img')) {
        prev.classList.add('cards-article-card-eyebrow');
      }
      prev = prev.previousElementSibling;
    }
  }

  const paragraphs = [...body.querySelectorAll(':scope > p')];
  const ctas = [];
  for (let i = paragraphs.length - 1; i >= 0; i -= 1) {
    const p = paragraphs[i];
    if (p.classList.contains('cards-article-card-eyebrow') || !isLinkOnly(p)) break;
    // without a heading, a plain link is the card title; only buttons are CTAs
    if (!heading && !p.querySelector('a.button')) break;
    ctas.unshift(p);
  }
  if (ctas.length) {
    const wrap = document.createElement('div');
    wrap.className = 'cards-article-card-cta';
    wrap.append(...ctas);
    body.append(wrap);
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture');
      if (hasPicture && !cell.textContent.trim()) {
        cell.className = 'cards-article-card-image';
      } else if (!cell.textContent.trim()) {
        cell.remove();
      } else {
        cell.className = 'cards-article-card-body';
        decorateBody(cell);
      }
    });

    if (!li.querySelector('.cards-article-card-image')) li.classList.add('no-image');
    if (li.children.length) ul.append(li);
  });

  // default variant: image teasers share one row; text-only results form a list
  const isDefault = [...block.classList].every((c) => c === 'cards-article' || c === 'block');
  if (isDefault && ul.children.length) {
    const hasImages = !!ul.querySelector('.cards-article-card-image');
    ul.classList.add(hasImages ? 'cards-article-row' : 'cards-article-list');
    if (!hasImages) {
      // "Category • Date": the date part renders in the body colour
      ul.querySelectorAll('.cards-article-card-eyebrow').forEach((p) => {
        const [category, ...rest] = p.textContent.split('•');
        if (!rest.length || p.children.length) return;
        const date = document.createElement('span');
        date.className = 'cards-article-card-date';
        date.textContent = `\u00a0\u00a0•\u00a0 ${rest.join('•').trim()}`;
        p.replaceChildren(category.trim(), date);
      });
    }
  }

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!canOptimize(img)) return;
    const width = block.classList.contains('country-grid') ? '120' : '750';
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });

  block.replaceChildren(ul);
}
