/*
 * Cards Checklist
 * Columns of tick-icon list items (covered events, useful links).
 * Each cell is a column: optional image, optional heading/intro, and a list.
 * A cell without a list is a note (e.g. footnote) spanning the full width.
 * List items that start with an icon (e.g. :cross:) keep it instead of the default tick.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function decorateColumn(column) {
  column.querySelectorAll('ul, ol').forEach((list) => {
    list.classList.add('cards-checklist-list');
    [...list.children].forEach((li) => {
      const first = li.firstElementChild;
      const leadsWithIcon = first && first.classList.contains('icon')
        && li.textContent.trim().startsWith(first.textContent.trim());
      if (leadsWithIcon) {
        li.classList.add('has-icon');
        const name = [...first.classList].find((c) => c.startsWith('icon-'));
        if (name) li.classList.add(`cards-checklist-item-${name.substring(5)}`);
      }
      if (li.querySelector(':scope > a, :scope > p > a') && li.textContent.trim() === li.querySelector('a').textContent.trim()) {
        li.classList.add('is-link');
      }
    });
  });

  const image = column.querySelector(':scope > p > picture, :scope > picture');
  if (image) {
    const wrapper = image.parentElement === column ? image : image.parentElement;
    wrapper.classList.add('cards-checklist-image');
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) return;
      const li = document.createElement('li');
      li.append(...cell.childNodes);
      if (li.querySelector('ul, ol')) {
        li.className = 'cards-checklist-column';
        decorateColumn(li);
      } else if (li.querySelector('picture, img') && !li.textContent.trim()) {
        li.className = 'cards-checklist-column';
        decorateColumn(li);
      } else {
        li.className = 'cards-checklist-note';
      }
      ul.append(li);
    });
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
