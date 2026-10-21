import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Optimises same-origin, non-SVG images only; migrated images keep their source URLs.
 * @param {Element} scope
 * @param {string} width
 */
function optimizeImages(scope, width) {
  scope.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });
}

/**
 * card-picker: each list item (thumbnail + title + text + link) becomes one
 * clickable card row.
 * @param {Element} cell
 */
function decorateCardPicker(cell) {
  const candidates = [...cell.querySelectorAll(':scope > ul > li, :scope > ol > li, :scope > p')]
    .filter((el) => el.querySelector('a[href]') && el.querySelector('picture, img'));
  if (!candidates.length) return;

  candidates.forEach((el) => {
    el.classList.add('columns-key-terms-card');
    const link = el.querySelector('a[href]');
    link.classList.add('columns-key-terms-card-link');
    const pic = el.querySelector('picture, img');
    const thumb = document.createElement('span');
    thumb.className = 'columns-key-terms-card-thumb';
    pic.replaceWith(thumb);
    thumb.append(pic);
    // drop an empty element the picture used to sit in
    el.querySelectorAll('p, strong, a').forEach((node) => {
      if (node !== link && !node.textContent.trim() && !node.querySelector('picture, img')) node.remove();
    });
    if (el.tagName === 'P') el.classList.remove('button-wrapper');
    link.classList.remove('button', 'primary', 'secondary', 'accent');

    // title = the element holding the link; loose text before it = eyebrow line
    let title = link;
    while (title.parentElement && title.parentElement !== el) title = title.parentElement;
    title.classList.add('columns-key-terms-card-title');
    const eyebrowNodes = [];
    let node = el.firstChild;
    while (node && node !== title) {
      const next = node.nextSibling;
      if (node.nodeName === 'BR') node.remove();
      else if (!node.contains(thumb)) eyebrowNodes.push(node);
      node = next;
    }
    if (eyebrowNodes.some((n) => n.textContent.trim())) {
      const eyebrow = document.createElement('span');
      eyebrow.className = 'columns-key-terms-card-eyebrow';
      eyebrowNodes.forEach((n) => eyebrow.append(n));
      eyebrow.innerHTML = eyebrow.innerHTML.trim();
      el.insertBefore(eyebrow, title);
    }
    el.querySelectorAll(':scope > br').forEach((br) => br.remove());
  });

  const lists = [...new Set(candidates.map((el) => el.parentElement))];
  lists.forEach((list) => {
    if (list !== cell) list.classList.add('columns-key-terms-cards');
  });
}

/**
 * default: tag a term cell's parts. The value is the paragraph that is only
 * bold text; text before it is the label, text after it the note.
 * @param {Element} cell
 */
function decorateTerm(cell) {
  const parts = [...cell.children];
  const value = parts.find((el) => {
    const strong = el.querySelector(':scope > strong, :scope > b');
    return strong && strong.textContent.trim() === el.textContent.trim();
  });
  const valueIndex = value ? parts.indexOf(value) : 1;
  parts.forEach((el, i) => {
    if (i < valueIndex) el.classList.add('columns-key-terms-label');
    else if (i === valueIndex) el.classList.add('columns-key-terms-value');
    else el.classList.add('columns-key-terms-note');
  });
}

/**
 * columns-key-terms: a row of key terms (label, value, note) split by rules.
 * `card-picker`: an image column beside a heading and a list of card links.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cardPicker = block.classList.contains('card-picker');

  const maxCols = Math.max(...rows.map((row) => row.children.length), 1);
  block.classList.add(`columns-key-terms-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-key-terms-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('columns-key-terms-col');
      const onlyPicture = cell.querySelector('picture') && !cell.textContent.trim();
      if (onlyPicture) {
        cell.classList.add('columns-key-terms-img-col');
        optimizeImages(cell, '750');
      } else if (cardPicker) {
        decorateCardPicker(cell);
      } else {
        decorateTerm(cell);
      }
    });
  });
}
