import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-teaser: image-topped teaser cards (image, heading, short text, "View ..." link).
 * Each authored row is one card: an image cell and a body cell (either may be missing).
 * Options: with-topic-tags (read time + topic tag pills), light-blue (cards on a
 * light-blue section). Unknown option classes are ignored.
 */

function onlyLink(el) {
  const links = el.querySelectorAll('a[href]');
  return links.length === 1 && el.textContent.trim() === links[0].textContent.trim();
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-teaser-card';

    cells.forEach((cell) => {
      if (cell.querySelector('picture, img') && !cell.textContent.trim()) {
        cell.className = 'cards-teaser-card-image';
      } else {
        cell.className = 'cards-teaser-card-body';
        // a trailing paragraph holding only a link is the card's call to action
        const paras = [...cell.querySelectorAll(':scope > p')];
        const last = paras[paras.length - 1];
        if (last && last === cell.lastElementChild && onlyLink(last)) last.classList.add('cards-teaser-cta');
        // a short line above the heading (or a "N min read" line) is the card's eyebrow
        const heading = cell.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
        const first = paras[0];
        const kids = [...cell.children];
        if (first && !first.classList.contains('cards-teaser-cta')
          && ((heading && kids.indexOf(first) < kids.indexOf(heading))
            || /\bmin(ute)?s?\.? read\b/i.test(first.textContent))) {
          first.classList.add('cards-teaser-eyebrow');
        }
        // a list made only of links is a set of topic tags
        cell.querySelectorAll(':scope > ul').forEach((list) => {
          const items = [...list.children];
          if (items.length && items.every((item) => onlyLink(item))) list.classList.add('cards-teaser-tags');
        });
      }
      li.append(cell);
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
