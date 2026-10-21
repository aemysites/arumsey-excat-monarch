import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const hasContent = (el) => !!(el.textContent.trim() || el.querySelector('picture, img, .icon, a'));

/** A cell made only of links whose content is an image or icon (social links). */
function isIconLinks(cell) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (!links.length || cell.textContent.trim().length > links.length * 20) return false;
  return links.every((a) => a.querySelector('picture, img, .icon, svg'))
    || (links.length > 1 && cell.querySelectorAll('.icon').length >= links.length);
}

const isPictureOnly = (cell) => !!cell.querySelector('picture, img, .icon') && !cell.textContent.trim() && !cell.querySelector('a[href]');

/** Same-origin link to a /fragments/ page, when that is all the cell holds. */
function fragmentPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname.replace(/(\.plain)?\.html$/, '');
}

function buildSocial(cell) {
  const ul = document.createElement('ul');
  ul.className = 'legal-disclosures-social-list';
  cell.querySelectorAll('a[href]').forEach((a) => {
    const li = document.createElement('li');
    if (!a.getAttribute('aria-label')) {
      const name = a.textContent.trim() || a.querySelector('img')?.alt
        || [...(a.querySelector('.icon')?.classList || [])].find((c) => c.startsWith('icon-'))?.slice(5);
      if (name) a.setAttribute('aria-label', name);
    }
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    li.append(a);
    ul.append(li);
  });
  return ul;
}

export default async function decorate(block) {
  const logo = document.createElement('div');
  logo.className = 'legal-disclosures-logo';
  const body = document.createElement('div');
  body.className = 'legal-disclosures-body';
  const social = document.createElement('div');
  social.className = 'legal-disclosures-social';

  const cells = [];
  [...block.children].forEach((row) => {
    const rowCells = row.children.length ? [...row.children] : [row];
    rowCells.filter(hasContent).forEach((cell) => cells.push(cell));
  });

  const fragments = await Promise.all(cells.map((cell) => {
    const path = fragmentPath(cell);
    return path ? loadFragment(path) : null;
  }));

  cells.forEach((cell, i) => {
    if (fragments[i]) {
      const nodes = [...fragments[i].querySelectorAll(':scope > .section > *')];
      body.append(...(nodes.length ? nodes : [...fragments[i].childNodes]));
    } else if (isPictureOnly(cell) && !logo.childNodes.length && !body.childNodes.length) {
      logo.append(...cell.childNodes);
    } else if (isIconLinks(cell)) {
      social.append(buildSocial(cell));
    } else {
      body.append(...cell.childNodes);
    }
  });

  // links in the legal copy are references, never buttons
  body.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    const wrapper = a.closest('.button-wrapper');
    if (wrapper) wrapper.classList.remove('button-wrapper');
  });

  block.replaceChildren(...[logo, body, social].filter((el) => el.childNodes.length));

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
}
