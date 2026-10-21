/*
 * Notice Box block
 * Boxed notice / disclosure / callout. Each authored row may hold an optional
 * media cell (image or icon) and one or more content cells. Media-only cells
 * are moved into `.notice-box-media`; everything else goes into `.notice-box-body`.
 *
 * Options (block classes): contact, note, icon-callout, blue, with-image, with-icon.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function isMediaOnly(cell) {
  const hasMedia = cell.querySelector('picture, img, svg, .icon');
  if (!hasMedia) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img, svg, .icon').forEach((el) => el.remove());
  return clone.textContent.trim() === '';
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}

export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'notice-box-media';
  const body = document.createElement('div');
  body.className = 'notice-box-body';

  [...block.children].forEach((row) => {
    const cells = row.children.length ? [...row.children] : [row];
    cells.forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img, svg, .icon')) return;
      const target = isMediaOnly(cell) ? media : body;
      target.append(...cell.childNodes);
    });
  });

  // last standalone link in the body acts as the call to action
  const links = body.querySelectorAll('a[href]');
  const lastLink = links[links.length - 1];
  if (lastLink) {
    const parent = lastLink.parentElement;
    if (parent && parent !== body && parent.textContent.trim() === lastLink.textContent.trim()) {
      parent.classList.add('notice-box-cta');
    }
  }

  const content = [];
  if (media.childNodes.length) {
    block.classList.add('notice-box-has-media');
    content.push(media);
  }
  content.push(body);
  optimizeImages(media);
  block.replaceChildren(...content);
}
