import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'columns-banner';
const VARIANTS = ['pair', 'no-panel', 'no-panel-image-background', 'bleed', 'strip', 'deadline',
  'stats', 'dark-3', 'dark-4'];

/**
 * Optimize same-origin, non-SVG images only. Migrated images keep their absolute
 * source-site URLs until upload, and createOptimizedPicture keeps only the pathname.
 * @param {Element} block
 */
function optimizePictures(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Whether a cell holds only a picture (optionally wrapped in a <p> or a link).
 * @param {Element} col
 */
function isImageOnly(col) {
  const pic = col.querySelector('picture');
  if (!pic) return false;
  const text = col.textContent.replace(/\s+/g, '');
  return text === '' && col.querySelectorAll('picture').length === 1;
}

/**
 * Deadline option: a cell holding both an illustration and text becomes a stacked
 * overlay — the picture is a background layer and the text sits on top of it.
 * @param {Element} col
 */
function buildOverlay(col) {
  const pic = col.querySelector('picture');
  const media = document.createElement('div');
  media.className = `${BLOCK}-overlay-media`;
  const text = document.createElement('div');
  text.className = `${BLOCK}-overlay-text`;

  // the picture's top-level wrapper (usually a <p>) moves to the media layer
  let picHolder = pic;
  while (picHolder && picHolder.parentElement && picHolder.parentElement !== col) {
    picHolder = picHolder.parentElement;
  }
  [...col.children].forEach((child) => {
    if (child === picHolder) media.append(child);
    else text.append(child);
  });
  // stray text nodes directly in the cell
  [...col.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      text.append(p);
    }
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });

  col.classList.add(`${BLOCK}-overlay-col`);
  if (media.children.length) col.append(media);
  else col.classList.add(`${BLOCK}-overlay-col-plain`);
  if (text.children.length) col.append(text);
}

/**
 * aem.js wraps a whole cell in one <p> when it starts with a picture followed by more
 * content (e.g. a bio photo rebuilt from a Scene7 link, then a heading and copy). That <p>
 * then holds block elements; unwrap it and keep the photo in its own paragraph.
 * @param {Element} col
 */
function unwrapPhotoCell(col) {
  const wrapper = col.firstElementChild;
  if (!wrapper || wrapper.tagName !== 'P' || col.children.length !== 1) return;
  if (!wrapper.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6, p, ul, ol, div)')) return;
  const pic = wrapper.firstElementChild;
  wrapper.replaceWith(...wrapper.childNodes);
  if (pic && pic.tagName === 'PICTURE') {
    const photo = document.createElement('p');
    photo.className = `${BLOCK}-photo`;
    pic.replaceWith(photo);
    photo.append(pic);
  }
}

/**
 * Whether a cell holds a single text link and nothing else (the expat ways-to-file panel).
 * @param {Element} col
 */
function isSingleLink(col) {
  const links = col.querySelectorAll('a');
  return links.length === 1 && !col.querySelector('picture, img, h1, h2, h3, h4, h5, h6')
    && col.textContent.trim() === links[0].textContent.trim();
}

/**
 * Marks authored text patterns the design styles:
 * - a paragraph holding only an undecorated link becomes an arrow link (source .right-arrow)
 * - a paragraph / list item that starts with an inline icon followed by text becomes an
 *   icon item (source .hrb-icon-link--check)
 * @param {Element} col
 */
function markTextPatterns(col) {
  col.querySelectorAll('p').forEach((p) => {
    const a = p.querySelector(':scope > a:only-child, :scope > strong:only-child > a:only-child');
    if (a && !a.classList.contains('button') && !a.querySelector('picture, img')
      && p.textContent.trim() === a.textContent.trim()) {
      p.classList.add(`${BLOCK}-link`);
    }
  });
  col.querySelectorAll('p, li').forEach((item) => {
    const first = item.firstElementChild;
    if (first && first.tagName === 'PICTURE' && item.textContent.trim()
      && !item.firstChild.textContent.trim()) {
      item.classList.add(`${BLOCK}-icon-item`);
    }
  });
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;

  const cols = [...firstRow.children];
  block.classList.add(`${BLOCK}-${cols.length}-cols`);

  const isDeadline = block.classList.contains('deadline');
  const isImageBackground = block.classList.contains('no-panel-image-background');
  const isPair = block.classList.contains('pair');

  // pair of bare links (fragment expat-ways-to-file): green panel with icon links
  if (isPair && cols.length && cols.every(isSingleLink)) {
    block.classList.add(`${BLOCK}-link-panel`);
  }

  // variant-less banner in a bright-green section: the expat tax-help CTA band
  if (!VARIANTS.some((v) => block.classList.contains(v)) && block.closest('.section.bright-green')) {
    block.classList.add(`${BLOCK}-cta`);
  }

  [...block.children].forEach((row) => {
    row.classList.add(`${BLOCK}-row`);
    [...row.children].forEach((col) => {
      unwrapPhotoCell(col);
      if (isImageOnly(col)) {
        col.classList.add(`${BLOCK}-img-col`);
      } else {
        col.classList.add(`${BLOCK}-text-col`);
        markTextPatterns(col);
        // deadline: the flag cell, or a heading-less first cell (date only, no flag)
        if (isDeadline && (col.querySelector('picture')
          || (col === row.firstElementChild && !col.querySelector('h1, h2, h3, h4, h5, h6')))) {
          buildOverlay(col);
        }
      }
    });

    // image-background: the image cell becomes a full-row background layer
    if (isImageBackground && row.querySelector(`.${BLOCK}-img-col`)) {
      row.classList.add(`${BLOCK}-has-bg`);
    }
  });

  if (block.querySelector(`.${BLOCK}-photo`)) block.classList.add(`${BLOCK}-photos`);

  optimizePictures(block);
}
