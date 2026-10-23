import { createOptimizedPicture } from '../../scripts/aem.js';

const ICON_SELECTOR = 'picture, img, svg, span.icon';
const FIGURE_PATTERN = /^[$€£]?\s?\d/;

/** Media elements in a container, counting a picture (and its img) or an icon once. */
function mediaOf(el) {
  return [...el.querySelectorAll(ICON_SELECTOR)]
    .filter((m) => !m.parentElement.closest('picture, span.icon'));
}

function iconOf(el) {
  if (el.matches(ICON_SELECTOR)) return el;
  return mediaOf(el)[0] || null;
}

/** Removes a paragraph left empty after its media moved out. */
function removeIfEmpty(el) {
  if (el && el.tagName === 'P' && !el.textContent.trim() && !el.children.length) el.remove();
}

function markFigure(container) {
  const figure = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, strong')]
    .find((el) => FIGURE_PATTERN.test(el.textContent.trim()));
  if (figure) (figure.closest('h1, h2, h3, h4, h5, h6, p') || figure).classList.add('columns-stats-figure');
}

/** Feature column: one photo plus a stat, laid out as media + text panel. */
function decorateFeature(col) {
  const pic = iconOf(col);
  const media = document.createElement('div');
  media.className = 'columns-stats-media';
  const holder = pic.parentElement;
  media.append(pic);
  removeIfEmpty(holder);

  const content = document.createElement('div');
  content.className = 'columns-stats-content';
  while (col.firstChild) content.append(col.firstChild);
  markFigure(content);
  col.append(media, content);
  col.classList.add('columns-stats-feature');
}

/** List column: each icon starts a new stat item; following text belongs to it. */
function decorateList(col) {
  const list = document.createElement('div');
  list.className = 'columns-stats-items';
  let current = null;
  const listEl = col.querySelector(':scope > ul, :scope > ol');
  const sources = listEl ? [...listEl.children] : [...col.children];
  sources.forEach((el) => {
    const icon = iconOf(el);
    if (icon) {
      current = document.createElement('div');
      current.className = 'columns-stats-item';
      const iconWrap = document.createElement('div');
      iconWrap.className = 'columns-stats-icon';
      const holder = icon.parentElement;
      iconWrap.append(icon);
      const text = document.createElement('div');
      text.className = 'columns-stats-text';
      if (el !== icon && el.textContent.trim()) {
        if (el.tagName === 'LI') [...el.childNodes].forEach((n) => text.append(n));
        else text.append(el);
      } else if (el !== icon) {
        el.remove();
      }
      removeIfEmpty(holder);
      current.append(iconWrap, text);
      list.append(current);
      markFigure(text);
    } else if (current) {
      const text = current.querySelector('.columns-stats-text');
      if (el.tagName === 'LI') [...el.childNodes].forEach((n) => text.append(n));
      else text.append(el);
      markFigure(text);
    }
  });
  if (listEl) listEl.remove();
  col.append(list);
  col.classList.add('columns-stats-list');
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  block.classList.add(`columns-stats-${firstRow.children.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const mediaCount = mediaOf(col).length;
      if (mediaCount === 1 && col.textContent.trim()) {
        decorateFeature(col);
      } else if (mediaCount > 1) {
        decorateList(col);
      } else if (mediaCount === 1) {
        col.classList.add('columns-stats-img-col');
      } else {
        col.classList.add('columns-stats-text-col');
        markFigure(col);
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
