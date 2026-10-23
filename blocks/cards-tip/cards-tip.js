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
 * True when an element holds nothing but links.
 * @param {Element} el
 * @returns {boolean}
 */
function isLinkOnly(el) {
  const links = [...el.querySelectorAll('a')];
  if (!links.length || el.querySelector('picture, img')) return false;
  return links.map((a) => a.textContent).join('').trim() === el.textContent.trim();
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  const footer = document.createElement('div');
  footer.className = 'cards-tip-footer';

  [...block.children].forEach((row) => {
    const text = row.textContent.trim();
    const hasMedia = !!row.querySelector('picture, img, .icon');
    if (!text && !hasMedia) return;

    // a row with only links and no icon is the trailing "learn more" link
    if (!hasMedia && isLinkOnly(row)) {
      [...row.children].forEach((cell) => footer.append(...cell.childNodes));
      return;
    }

    const li = document.createElement('li');
    const body = document.createElement('div');
    body.className = 'cards-tip-card-body';
    const links = document.createElement('div');
    links.className = 'cards-tip-card-links';

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img, .icon') && !cell.textContent.trim()) {
        cell.className = 'cards-tip-card-icon';
        li.append(cell);
      } else {
        body.append(...cell.childNodes);
      }
    });

    // trailing link-only paragraphs/lists become the card's link list
    let last = body.lastElementChild;
    while (last && ['P', 'UL', 'OL'].includes(last.tagName) && isLinkOnly(last)) {
      links.prepend(last);
      last = body.lastElementChild;
    }

    if (!li.querySelector('.cards-tip-card-icon')) li.classList.add('no-icon');
    if (body.childNodes.length) li.append(body);
    if (links.children.length) {
      li.classList.add('has-links');
      li.append(links);
    }
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!canOptimize(img)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '64' }]));
  });

  const children = [ul];
  if (footer.childNodes.length) children.push(footer);
  block.replaceChildren(...children);
}
