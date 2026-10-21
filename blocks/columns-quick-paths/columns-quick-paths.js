import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK_TAGS = /^(H[1-6]|P|UL|OL|DIV|TABLE|BLOCKQUOTE)$/;

/**
 * A paragraph is a CTA when it holds a single link and nothing else.
 * @param {Element} el
 * @returns {boolean}
 */
function isLinkOnly(el) {
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a[href]');
  return links.length === 1
    && !links[0].querySelector('picture, img')
    && el.textContent.trim() === links[0].textContent.trim();
}

/**
 * True when the element is only an icon (picture/img/.icon), bare or in an empty paragraph.
 * @param {Element} el
 * @returns {boolean}
 */
function isIcon(el) {
  if (!el || el.textContent.trim()) return false;
  if (['PICTURE', 'IMG'].includes(el.tagName) || el.classList.contains('icon')) return true;
  return el.tagName === 'P' && el.children.length === 1 && isIcon(el.firstElementChild);
}

/**
 * aem.js wraps a cell that starts with a picture in a <p>, which swallows the
 * heading and paragraphs that follow. Undo that so the cell children stay flat.
 * @param {Element} col
 */
function unwrapCell(col) {
  const only = col.children.length === 1 ? col.firstElementChild : null;
  if (!only || only.tagName !== 'P') return;
  if (![...only.children].some((child) => BLOCK_TAGS.test(child.tagName))) return;
  only.replaceWith(...only.childNodes);
}

/**
 * Scene7 pads an image to the requested `wid`, so a 24px icon delivered at
 * wid=2000 becomes a thin strip. Icons are tiny: request them at native size.
 * Renditions that already carry `fit` (the DM renderer in scripts.js adds
 * fit=constrain,0, which caps at native size) are left as they are; rewriting
 * them through URLSearchParams would encode the comma and Scene7 rejects that.
 * @param {Element} icon picture or img
 */
function fixIconRenditions(icon) {
  const dropWidth = (url) => {
    try {
      const u = new URL(url, window.location.href);
      if (!u.pathname.includes('/is/image/') || !u.searchParams.has('wid') || u.searchParams.has('fit')) return url;
      u.searchParams.delete('wid');
      return u.toString();
    } catch {
      return url;
    }
  };
  icon.querySelectorAll('source').forEach((source) => {
    source.srcset = dropWidth(source.srcset);
  });
  const img = icon.tagName === 'IMG' ? icon : icon.querySelector('img');
  if (img) img.src = dropWidth(img.getAttribute('src'));
}

function decorateColumn(col) {
  unwrapCell(col);
  col.classList.add('columns-quick-paths-col');

  if (col.children.length === 1 && isIcon(col.firstElementChild)) {
    col.classList.add('columns-quick-paths-img-col');
    return;
  }

  const heading = col.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
  if (heading) {
    heading.classList.add('columns-quick-paths-title');
    // group a leading icon with the heading so they sit on one line
    const prev = heading.previousElementSibling;
    if (isIcon(prev)) {
      const head = document.createElement('div');
      head.className = 'columns-quick-paths-head';
      const icon = prev.tagName === 'P' ? prev.firstElementChild : prev;
      icon.classList.add('columns-quick-paths-icon');
      fixIconRenditions(icon);
      heading.before(head);
      head.append(icon, heading);
      if (prev.isConnected && prev !== icon) prev.remove();
    }
  }

  let afterHeading = !heading;
  [...col.children].forEach((child) => {
    if (child.classList.contains('columns-quick-paths-head') || child === heading) {
      afterHeading = true;
      return;
    }
    if (isLinkOnly(child)) child.classList.add('columns-quick-paths-cta');
    else if (child.tagName === 'P') {
      child.classList.add(afterHeading ? 'columns-quick-paths-text' : 'columns-quick-paths-label');
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children].filter((row) => row.children.length);
  const maxCols = rows.reduce((max, row) => Math.max(max, row.children.length), 0) || 1;
  // cells may be wrapped by aem.js; flatten before inspecting rows
  rows.forEach((row) => [...row.children].forEach(unwrapCell));
  block.classList.add(`columns-quick-paths-${maxCols}-cols`);

  rows.forEach((row, i) => {
    // optional intro row: one heading-only cell above the columns ("What would you like to do?")
    const only = row.children.length === 1 ? row.firstElementChild : null;
    if (i === 0 && rows.length > 1 && only && only.querySelector('h1, h2, h3, h4, h5, h6')
      && !only.querySelector('a[href], picture, img')) {
      row.classList.add('columns-quick-paths-intro');
      return;
    }
    row.classList.add('columns-quick-paths-row');
    [...row.children].forEach((col) => {
      // drop empty cells authors leave behind
      if (!col.textContent.trim() && !col.querySelector('picture, img, .icon')) {
        col.remove();
        return;
      }
      decorateColumn(col);
    });
    if (!row.children.length) row.remove();
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
