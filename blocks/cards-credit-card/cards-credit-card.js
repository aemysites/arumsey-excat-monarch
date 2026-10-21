import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * cards-credit-card: credit card product tiles (card art, name, description,
 * feature list with icons, CTAs and footnote links), with an optional badge
 * strip on top ("Bonus Offer", "No Annual Fee").
 *
 * Authoring: one row per product.
 *  - optional first cell with short plain text only -> badge
 *  - a cell that starts with the card art image -> media (image plus any
 *    caption text in the same cell, e.g. the annual fee)
 *  - remaining cells -> content, in order. Paragraphs holding only links
 *    become CTAs; the first heading is the card name.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function isLinkOnly(el) {
  if (!el || el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a');
  if (!links.length) return false;
  const text = [...links].reduce((acc, a) => acc + a.textContent, '');
  return el.textContent.replace(/\s/g, '') === text.replace(/\s/g, '');
}

function isBadgeCell(cell, cells) {
  if (cells.length < 2 || cell !== cells[0]) return false;
  if (cell.querySelector(`picture, img, ul, ol, a, ${HEADING}`)) return false;
  const text = cell.textContent.trim();
  return text.length > 0 && text.length <= 60;
}

function buildCard(row) {
  const li = document.createElement('li');
  const cells = [...row.children];

  const badgeCell = cells.find((c) => isBadgeCell(c, cells));
  if (badgeCell) {
    badgeCell.className = 'cards-credit-card-badge';
    li.append(badgeCell);
    li.classList.add('has-badge');
  }

  const rest = cells.filter((c) => c !== badgeCell);
  const mediaCell = rest.find((c) => {
    const first = c.firstElementChild;
    return first && (first.tagName === 'PICTURE' || first.querySelector?.('picture'))
      && !c.querySelector(HEADING);
  });

  const top = document.createElement('div');
  top.className = 'cards-credit-card-top';
  const content = document.createElement('div');
  content.className = 'cards-credit-card-content';

  if (mediaCell) {
    mediaCell.className = 'cards-credit-card-media';
    top.append(mediaCell);
  }

  const nodes = [];
  rest.filter((c) => c !== mediaCell).forEach((c) => nodes.push(...c.childNodes));

  // single-cell authoring: pull a leading image paragraph into the media slot
  if (!mediaCell) {
    const firstEl = nodes.find((n) => n.nodeType === Node.ELEMENT_NODE);
    if (firstEl && firstEl.querySelector?.('picture') && firstEl.textContent.trim() === '') {
      const media = document.createElement('div');
      media.className = 'cards-credit-card-media';
      media.append(firstEl);
      nodes.splice(nodes.indexOf(firstEl), 1);
      top.append(media);
    }
  }

  // intro: card name heading and the paragraph right after it
  const intro = document.createElement('div');
  intro.className = 'cards-credit-card-intro';
  const headingIdx = nodes.findIndex((n) => n.matches?.(HEADING));
  if (headingIdx >= 0) {
    const [heading] = nodes.splice(headingIdx, 1);
    intro.append(heading);
    const next = nodes.slice(headingIdx).find((n) => n.nodeType === Node.ELEMENT_NODE);
    if (next && next.tagName === 'P' && !isLinkOnly(next) && !next.querySelector('picture')) {
      nodes.splice(nodes.indexOf(next), 1);
      intro.append(next);
    }
  }
  if (intro.children.length) top.append(intro);
  if (top.children.length) li.append(top);

  nodes.forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) {
      if (isLinkOnly(n)) n.classList.add('cards-credit-card-cta');
      if (n.tagName === 'UL' || n.tagName === 'OL') n.classList.add('cards-credit-card-features');
    }
    content.append(n);
  });
  if (content.textContent.trim() || content.querySelector('picture')) li.append(content);
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    ul.append(buildCard(row));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
  block.replaceChildren(ul);
}
