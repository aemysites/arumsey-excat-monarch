import { createOptimizedPicture } from '../../scripts/aem.js';

const hasContent = (el) => !!(el.textContent.trim() || el.querySelector('picture, img, .icon, a'));

/** Collect the links of a cell, preserving authored list order. */
function collectLinks(cell) {
  return [...cell.querySelectorAll('a[href]')];
}

export default function decorate(block) {
  const cells = [];
  [...block.children].forEach((row) => {
    const rowCells = row.children.length ? [...row.children] : [row];
    rowCells.filter(hasContent).forEach((cell) => cells.push(cell));
  });
  if (!cells.length) return;

  const brand = document.createElement('div');
  brand.className = 'legal-links-brand';
  const nav = document.createElement('nav');
  nav.className = 'legal-links-nav';
  nav.setAttribute('aria-label', 'Legal');
  const ul = document.createElement('ul');
  ul.className = 'legal-links-list';
  const extra = document.createElement('div');
  extra.className = 'legal-links-extra';

  // with several cells the first is the brand/home entry; with one, a leading
  // non-list item (logo, heading or home link) is
  let linkCells = cells;
  if (cells.length > 1) {
    brand.append(...cells[0].childNodes);
    linkCells = cells.slice(1);
  } else {
    const [only] = cells;
    const first = only.firstElementChild;
    if (first && first.tagName !== 'UL' && first.tagName !== 'OL' && only.querySelector('ul, ol')) {
      brand.append(first);
    }
  }

  linkCells.forEach((cell) => {
    const links = collectLinks(cell);
    links.forEach((a) => {
      const li = document.createElement('li');
      li.append(a);
      ul.append(li);
    });
    // keep any remaining copy (e.g. copyright line) that was not a link
    [...cell.children].forEach((child) => {
      if (child.textContent.trim() || child.querySelector('picture, img')) {
        if (!['UL', 'OL'].includes(child.tagName)) extra.append(child);
      }
    });
    if (!cell.children.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      extra.append(p);
    }
  });

  // links are plain text links here, never buttons
  block.querySelectorAll('a.button').forEach((a) => a.classList.remove('button', 'primary', 'secondary', 'accent'));
  block.querySelectorAll('.button-wrapper').forEach((p) => p.classList.remove('button-wrapper'));

  if (ul.children.length) nav.append(ul);
  block.replaceChildren(...[brand, nav, extra].filter((el) => el.childNodes.length));

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
}
