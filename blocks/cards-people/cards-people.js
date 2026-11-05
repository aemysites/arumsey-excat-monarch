import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });
}

function decorateBody(body) {
  body.className = 'cards-people-card-body';
  body.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach((a) => {
    const holder = a.closest('li, p');
    if (holder) holder.classList.add('cards-people-card-contact');
    const list = a.closest('ul');
    if (list) list.classList.add('cards-people-card-contacts');
  });
  // a paragraph holding only a non-contact link is the profile call to action
  body.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('img')) {
      p.remove();
      return;
    }
    const link = p.querySelector('a');
    if (link && p.children.length === 1 && p.textContent.trim() === link.textContent.trim()
      && !/^(tel|mailto):/.test(link.getAttribute('href') || '')) {
      p.classList.add('cards-people-card-cta');
    }
  });
  // the first paragraph right after the name heading is the role/title
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  const role = heading?.nextElementSibling;
  if (role && role.tagName === 'P' && !role.className) role.classList.add('cards-people-card-role');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    let body;
    [...row.children].forEach((cell) => {
      const hasPic = cell.querySelector('picture, img');
      if (hasPic && cell.textContent.trim() === '') {
        cell.className = 'cards-people-card-image';
        li.prepend(cell);
      } else if (!cell.textContent.trim() && !cell.children.length) {
        // empty cell: skip
      } else if (body) {
        body.append(...cell.childNodes);
      } else {
        body = cell;
        li.append(body);
      }
    });
    if (body) decorateBody(body);
    if (li.children.length) ul.append(li);
  });
  optimizePictures(ul);
  block.replaceChildren(ul);
}
