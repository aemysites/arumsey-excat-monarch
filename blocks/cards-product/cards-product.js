/*
 * Cards Product
 * Product cards with an icon badge, title, offer line, checklist and quote buttons.
 * One row per card; all cells of a row are merged into the card body.
 * A leading image-only paragraph is the icon badge; lists whose items start with an
 * image/icon render as icon lists, other lists as tick lists; link-only paragraphs are buttons.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function isImageOnly(el) {
  return !!el.querySelector('picture, img, .icon') && !el.textContent.trim();
}

function isLinkOnly(el) {
  if (el.tagName !== 'P') return false;
  const links = [...el.querySelectorAll('a[href]')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText.length > 0 && linkText === el.textContent.replace(/\s+/g, '');
}

function decorateCard(card) {
  const children = [...card.children];
  const headingIndex = children.findIndex((el) => /^H[1-6]$/.test(el.tagName));

  children.forEach((el, i) => {
    if (i < headingIndex || headingIndex < 0) {
      if (i === 0 && isImageOnly(el)) el.classList.add('cards-product-card-icon');
      else if (el.tagName === 'P' && !el.querySelector('a') && headingIndex >= 0) el.classList.add('cards-product-card-tag');
    }
  });

  card.querySelectorAll('ul, ol').forEach((list) => {
    const iconItems = [...list.children].filter((li) => {
      const first = li.firstElementChild;
      return first && (first.matches('picture, img, .icon') || (first.tagName === 'P' && isImageOnly(first)));
    });
    list.classList.add(iconItems.length ? 'cards-product-icon-list' : 'cards-product-check-list');
  });

  // offer line: first plain paragraph right after the heading
  const heading = card.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
  const offer = heading && heading.nextElementSibling;
  if (offer && offer.tagName === 'P' && !offer.querySelector('a, img') && offer.textContent.trim()) {
    offer.classList.add('cards-product-card-offer');
  }

  // rating: [review logo] + star images with "(x out of 5)" + [reviews link]
  const stars = [...card.children].find((el) => el.tagName === 'P'
    && el.querySelectorAll('img').length && /out of\s*\d/i.test(el.textContent));
  if (stars) {
    stars.classList.add('cards-product-card-stars');
    const imgs = [...stars.querySelectorAll('picture, img:not(picture img)')];
    const match = stars.textContent.match(/([\d.]+)\s*out of\s*([\d.]+)/i);
    if (imgs.length === 2 && match) {
      const meter = document.createElement('span');
      meter.className = 'cards-product-stars-meter';
      const fill = document.createElement('span');
      fill.className = 'cards-product-stars-fill';
      const pct = Math.max(0, Math.min(100, (parseFloat(match[1]) / parseFloat(match[2])) * 100));
      fill.style.width = `${pct}%`;
      imgs[0].before(meter);
      meter.append(imgs[0], fill);
      fill.append(imgs[1]);
    }
    const rating = document.createElement('div');
    rating.className = 'cards-product-card-rating';
    const prev = stars.previousElementSibling;
    const next = stars.nextElementSibling;
    stars.before(rating);
    if (prev && prev.tagName === 'P' && isImageOnly(prev)) {
      prev.classList.add('cards-product-card-rating-logo');
      rating.append(prev);
    }
    rating.append(stars);
    if (next && isLinkOnly(next) && next.querySelectorAll('a').length === 1
      && !next.querySelector('strong, em, .button')) {
      next.classList.add('cards-product-card-rating-link');
      rating.append(next);
    }
  }

  let group = null;
  [...card.children].forEach((el) => {
    if (isLinkOnly(el)) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'cards-product-card-actions';
        el.before(group);
      }
      group.append(el);
    } else {
      group = null;
    }
  });
  // paragraphs holding several formatted links are skipped by decorateButtons
  card.querySelectorAll('.cards-product-card-actions a[href]:not(.button)').forEach((a) => {
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;
    a.classList.add('button');
    if (strong && em) a.classList.add('accent');
    else a.classList.add(strong ? 'primary' : 'secondary');
    let outer = strong || em;
    if (strong && em) outer = strong.contains(em) ? strong : em;
    outer.replaceWith(a);
  });

  const last = card.lastElementChild;
  if (last && last.classList.contains('cards-product-card-actions')) last.classList.add('is-last');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-product-card';
    const body = document.createElement('div');
    body.className = 'cards-product-card-body';
    [...row.children].forEach((cell) => body.append(...cell.childNodes));
    [...body.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        node.replaceWith(p);
        p.append(node);
      }
    });
    if (!body.children.length) return;
    decorateCard(body);
    li.append(body);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '240' }]));
  });
  block.replaceChildren(ul);
}
