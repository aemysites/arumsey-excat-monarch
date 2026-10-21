import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * cards-product: product / offer cards (eyebrow, image, heading, text, CTAs).
 * Each authored row is one card; each cell becomes one part of the card, in order.
 * Options: stats (large figure tiles, usually no image), benefit-tiles (two wide
 * heading + text tiles). Unknown option classes are ignored.
 */

function isFragmentLink(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return false;
  try {
    const url = new URL(links[0].href, window.location.href);
    return url.origin === window.location.origin && url.pathname.includes('/fragments/');
  } catch (e) {
    return false;
  }
}

function isLinksOnly(cell) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (!links.length || cell.querySelector('picture, img, h1, h2, h3, h4, h5, h6, ul, ol')) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText === cell.textContent.replace(/\s+/g, '');
}

function isImageOnly(cell) {
  return cell.querySelector('picture, img') && !cell.textContent.trim();
}

async function decorateCell(cell) {
  if (isFragmentLink(cell)) {
    const fragment = await loadFragment(new URL(cell.querySelector('a').href).pathname);
    if (fragment) {
      const sections = [...fragment.querySelectorAll(':scope .section')];
      cell.replaceChildren(...(sections.length ? sections.flatMap((s) => [...s.childNodes])
        : [...fragment.childNodes]));
    }
  }
  if (isImageOnly(cell)) cell.className = 'cards-product-card-image';
  else if (isLinksOnly(cell)) cell.className = 'cards-product-card-actions';
  else cell.className = 'cards-product-card-body';
}

/**
 * stats: split a heading like "5<sup>%</sup> in Rewards<sup>2</sup>" or "BonusReward<sup>2</sup>"
 * into a large figure ("5%", "Bonus") and a smaller label ("in Rewards²", "Reward²").
 * Headings that don't start with a figure are left untouched.
 */
function splitFigure(heading) {
  const first = heading.firstChild;
  if (!first || first.nodeType !== Node.TEXT_NODE) return;
  const match = first.textContent.match(/^\s*([$]?\d[\d.,]*|[A-Z][a-z]+(?=[A-Z]))/);
  if (!match) return;
  const figure = document.createElement('span');
  figure.className = 'cards-product-figure';
  [, figure.textContent] = match;
  first.textContent = first.textContent.slice(match[0].length);
  // a unit superscript directly after the number ("5<sup>%</sup>") belongs to the figure
  if (!first.textContent.trim() && first.nextSibling?.nodeName === 'SUP') {
    figure.append(first.nextSibling);
  }
  const label = document.createElement('span');
  label.className = 'cards-product-label';
  label.append(...heading.childNodes);
  heading.replaceChildren(figure);
  if (label.textContent.trim()) heading.append(label);
}

export default async function decorate(block) {
  const ul = document.createElement('ul');
  const pending = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-product-card';
    cells.forEach((cell) => {
      li.append(cell);
      pending.push(decorateCell(cell));
    });
    ul.append(li);
  });

  await Promise.all(pending);

  // a leading text-only cell (no heading, image or list) is the card eyebrow
  ul.querySelectorAll('.cards-product-card').forEach((li) => {
    const first = li.firstElementChild;
    if (li.children.length > 1 && first.classList.contains('cards-product-card-body')
      && !first.querySelector('h1, h2, h3, h4, h5, h6, picture, img, ul, ol')) {
      first.className = 'cards-product-card-eyebrow';
    }
  });

  if (block.classList.contains('stats')) {
    ul.querySelectorAll('h2, h3, h4').forEach(splitFigure);
  }

  ul.querySelectorAll('.cards-product-card-actions').forEach((actions) => {
    actions.querySelectorAll('a[href]').forEach((a, i) => {
      a.classList.add(i === 0 ? 'cards-product-primary' : 'cards-product-secondary');
    });
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
