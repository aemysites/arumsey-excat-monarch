import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

const isMediaOnly = (el) => !el.textContent.trim() && !!el.querySelector('picture, img, .icon');

/** Icons are :icon: spans or SVG images; other pictures are photos. */
function isIcon(el) {
  if (el.querySelector('.icon')) return true;
  const img = el.querySelector('img');
  if (!img) return false;
  return /\.svg$/i.test(new URL(img.src, window.location.href).pathname);
}

function decorateBody(body) {
  body.className = 'cards-service-card-body';
  [...body.children].forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector('picture, img, .icon')) el.remove();
  });
  // a leading icon/image paragraph (or heading wrapping only an icon) becomes the card icon
  const first = body.firstElementChild;
  if (first && isMediaOnly(first)) {
    const icon = document.createElement('div');
    icon.className = 'cards-service-card-icon';
    icon.append(...first.childNodes);
    first.replaceWith(icon);
  }
  // a paragraph holding only a link is the card call to action
  body.querySelectorAll(':scope > p').forEach((p) => {
    const link = p.querySelector('a');
    if (link && p.children.length === 1 && p.textContent.trim() === link.textContent.trim()) {
      p.classList.add('cards-service-card-cta');
    }
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    let body;
    [...row.children].forEach((cell) => {
      if (isMediaOnly(cell)) {
        cell.className = isIcon(cell) ? 'cards-service-card-icon' : 'cards-service-card-image';
        li.append(cell);
      } else if (!cell.textContent.trim()) {
        // empty cell: skip
      } else if (body) {
        body.append(...cell.childNodes);
      } else {
        body = cell;
        li.append(body);
      }
    });
    if (body) {
      decorateBody(body);
      const innerIcon = body.querySelector(':scope > .cards-service-card-icon');
      if (innerIcon) body.before(innerIcon);
    }
    // mark cards that link to a detail page (hook for hover styling)
    const cta = li.querySelector('.cards-service-card-cta a, .cards-service-card-body h2 a, .cards-service-card-body h3 a');
    if (cta) li.classList.add('cards-service-card-linked');
    if (li.children.length) ul.append(li);
  });
  optimizePictures(ul);
  block.replaceChildren(ul);
}
