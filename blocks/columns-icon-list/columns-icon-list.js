import { createOptimizedPicture } from '../../scripts/aem.js';

const ICON_SELECTOR = 'picture, img, svg, span.icon';

function startsWithIcon(el) {
  const icon = el.querySelector(ICON_SELECTOR);
  if (!icon) return false;
  // the icon must lead the element (text may follow it)
  const range = document.createRange();
  range.setStart(el, 0);
  range.setEndBefore(icon);
  return !range.toString().trim();
}

function buildItem(icon, textNodes) {
  const item = document.createElement('div');
  item.className = 'columns-icon-list-item';
  const iconWrap = document.createElement('div');
  iconWrap.className = 'columns-icon-list-icon';
  iconWrap.append(icon);
  const text = document.createElement('div');
  text.className = 'columns-icon-list-text';
  textNodes.forEach((node) => text.append(node));
  item.append(iconWrap, text);
  return item;
}

/** Turn an icon column (ul of icon items, or icon paragraphs + text) into list items. */
function decorateItems(col) {
  const list = document.createElement('div');
  list.className = 'columns-icon-list-items';

  const ul = col.querySelector(':scope > ul, :scope > ol');
  if (ul) {
    [...ul.children].forEach((li) => {
      const icon = li.querySelector(ICON_SELECTOR);
      if (!icon) {
        list.append(buildItem(document.createElement('span'), [...li.childNodes]));
        return;
      }
      const iconEl = icon.closest('picture') || icon;
      iconEl.remove();
      list.append(buildItem(iconEl, [...li.childNodes]));
    });
    ul.replaceWith(list);
    return;
  }

  let current = null;
  [...col.children].forEach((el) => {
    if (startsWithIcon(el)) {
      const icon = el.querySelector(ICON_SELECTOR);
      const iconEl = icon.closest('picture') || icon;
      iconEl.remove();
      const hasText = !!el.textContent.trim();
      // an icon-only paragraph is emptied by moving its icon; drop the empty shell
      if (!hasText) el.remove();
      current = buildItem(iconEl, hasText ? [el] : []);
      list.append(current);
    } else if (current) {
      current.querySelector('.columns-icon-list-text').append(el);
    }
  });
  if (list.children.length) col.append(list);
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  block.classList.add(`columns-icon-list-${firstRow.children.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.querySelector(ICON_SELECTOR)) {
        col.classList.add('columns-icon-list-list-col');
        decorateItems(col);
      } else {
        col.classList.add('columns-icon-list-intro');
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
}
