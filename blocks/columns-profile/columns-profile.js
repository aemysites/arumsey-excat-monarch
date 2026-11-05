import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Columns Profile
 * Optional first row: one cell with a heading (e.g. "Executive Committee").
 * Each profile row: [portrait | name, title, phone/email links, Read more | biography].
 * Cells are recognised by content, so a missing portrait or biography is tolerated.
 */
function isPortraitCell(cell) {
  return !!cell.querySelector('picture, img') && cell.textContent.trim() === '';
}

function decorateDetails(cell) {
  cell.classList.add('columns-profile-details');
  cell.querySelectorAll('a[href^="tel:"]').forEach((a) => a.classList.add('columns-profile-phone'));
  cell.querySelectorAll('a[href^="mailto:"]').forEach((a) => a.classList.add('columns-profile-email'));
  const contactList = [...cell.querySelectorAll('ul')]
    .find((ul) => ul.querySelector('a[href^="tel:"], a[href^="mailto:"]'));
  if (contactList) contactList.classList.add('columns-profile-contacts');
  const links = [...cell.querySelectorAll('a')]
    .filter((a) => !/^(tel|mailto):/.test(a.getAttribute('href') || ''));
  const more = links[links.length - 1];
  if (more && !more.closest('h1, h2, h3, h4, h5, h6')) {
    (more.closest('p') || more).classList.add('columns-profile-more');
  }
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => {
      if (c.textContent.trim() || c.querySelector('picture, img')) return true;
      c.remove();
      return false;
    });
    if (!cells.length) {
      row.remove();
      return;
    }

    if (cells.length === 1 && cells[0].querySelector('h1, h2, h3, h4, h5, h6')
      && !cells[0].querySelector('picture, img')) {
      row.className = 'columns-profile-heading';
      return;
    }

    row.className = 'columns-profile-row';
    let detailsDone = false;
    cells.forEach((cell) => {
      if (isPortraitCell(cell)) {
        cell.classList.add('columns-profile-portrait');
      } else if (!detailsDone) {
        decorateDetails(cell);
        detailsDone = true;
      } else {
        cell.classList.add('columns-profile-bio');
      }
    });
    if (!row.querySelector('.columns-profile-bio')) row.classList.add('columns-profile-no-bio');
    if (!row.querySelector('.columns-profile-portrait')) row.classList.add('columns-profile-no-portrait');
  });

  block.querySelectorAll('.columns-profile-portrait picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
  });
}
