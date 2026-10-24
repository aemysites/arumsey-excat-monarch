import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/** A column holding only pictures (one or a stack of several) is a media column. */
function isMediaColumn(col) {
  if (!col.querySelector('picture, img')) return false;
  const clone = col.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return clone.textContent.trim() === '' && !clone.querySelector('a, table, ul, ol');
}

function fragmentPath(col) {
  const links = col.querySelectorAll('a[href]');
  if (links.length !== 1 || links[0].textContent.trim() !== col.textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

async function inlineFragment(col, path) {
  const fragment = await loadFragment(path);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  col.replaceChildren(...(sections.length
    ? sections.flatMap((section) => [...section.childNodes])
    : [...fragment.childNodes]));
}

function optimizeImages(col) {
  col.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  const colCount = Math.max(0, ...rows.map((row) => row.children.length));
  if (colCount) block.classList.add(`columns-media-${colCount}-cols`);

  const loads = [];
  rows.forEach((row) => {
    row.classList.add('columns-media-row');
    [...row.children].forEach((col, index) => {
      col.classList.add('columns-media-col', `columns-media-col-${index + 1}`);
      const path = fragmentPath(col);
      if (path) {
        col.classList.add('columns-media-text-col');
        loads.push(inlineFragment(col, path));
        return;
      }
      if (isMediaColumn(col)) {
        col.classList.add('columns-media-img-col');
        // count each picture once (not the picture and its img)
        const images = col.querySelectorAll('picture, img:not(picture img)');
        if (images.length > 1) col.classList.add('columns-media-img-stack');
        optimizeImages(col);
      } else {
        col.classList.add('columns-media-text-col');
        // an icon paragraph that leads the text column
        const first = col.firstElementChild;
        if (first && first.matches('p') && first.querySelector('picture, img, span.icon')
          && !first.textContent.trim()) {
          first.classList.add('columns-media-icon');
        }
      }
    });
    if (row.querySelector(':scope > .columns-media-img-col')) row.classList.add('columns-media-has-media');
  });

  // inline tables (for example a "how it works" grid) must scroll rather than overflow
  block.querySelectorAll('table').forEach((table) => {
    if (table.parentElement.classList.contains('columns-media-table')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'columns-media-table';
    table.before(wrapper);
    wrapper.append(table);
  });

  await Promise.all(loads);
}
