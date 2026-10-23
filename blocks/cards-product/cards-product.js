import { createOptimizedPicture } from '../../scripts/aem.js';

const VIDEO_PATTERN = /youtube\.com|youtu\.be|vimeo\.com|\.mp4($|\?)|\/video/i;
const PRICE_PATTERN = /^(starting at|from|you could get( up to)?|up to)?\s*[$€£]?\s?\d/i;
// "Starting at $124 + $49 per FBAR" -> ["Starting at $124", "+ $49 per FBAR"]
const PRICE_SPLIT_PATTERN = /^(.*?[$€£]?\s?\d[\d,.]*)\s+([+(].*)$/;
const AMOUNT_PATTERN = /^[$€£]\s?\d[\d,.]*$/;

function isButtonParagraph(el) {
  if (el.classList.contains('button-wrapper')) return true;
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a');
  return links.length > 0 && el.textContent.trim() === [...links].map((a) => a.textContent).join('').trim();
}

function isImageCell(cell) {
  return !!cell.querySelector('picture, img') && !cell.textContent.trim();
}

/**
 * Splits a price line into the headline amount and its detail text, e.g.
 * "Starting at $124 + $49 per FBAR" or "You could get up to $1,750<br>Available Nov – Dec".
 */
function splitPrice(price) {
  const amount = document.createElement('span');
  amount.className = 'cards-product-price-amount';
  const detail = document.createElement('span');
  detail.className = 'cards-product-price-detail';
  const br = price.querySelector(':scope > br');
  if (br) {
    while (price.firstChild && price.firstChild !== br) amount.append(price.firstChild);
    br.remove();
    while (price.firstChild) detail.append(price.firstChild);
  } else {
    const match = price.textContent.trim().match(PRICE_SPLIT_PATTERN);
    if (match && !price.children.length) {
      [, amount.textContent, detail.textContent] = match;
    } else {
      while (price.firstChild) amount.append(price.firstChild);
    }
  }
  price.replaceChildren(amount);
  if (detail.textContent.trim()) price.append(detail);
}

function decorateBody(body) {
  const children = [...body.children];
  const heading = children.find((el) => /^H[1-6]$/.test(el.tagName));
  if (heading && heading.querySelector('a')) heading.classList.add('cards-product-title-link');

  // a short line directly after the title that reads like a price is the price
  if (heading) {
    const next = heading.nextElementSibling;
    if (next && next.tagName === 'P' && !isButtonParagraph(next)
      && PRICE_PATTERN.test(next.textContent.trim()) && next.textContent.trim().length < 80) {
      next.classList.add('cards-product-price');
      splitPrice(next);
    }
  }

  // a bare amount ("$99") elsewhere in the card is a price too
  children.forEach((el) => {
    if (el.tagName === 'P' && AMOUNT_PATTERN.test(el.textContent.trim())) {
      el.classList.add('cards-product-price', 'cards-product-price-only');
    }
  });

  body.querySelectorAll('ul, ol').forEach((list) => list.classList.add('cards-product-list'));

  // trailing buttons are pinned to the bottom of the card
  let i = children.length - 1;
  while (i >= 0 && isButtonParagraph(children[i])) i -= 1;
  const actions = children.slice(i + 1);
  if (actions.length) {
    const footer = document.createElement('div');
    footer.className = 'cards-product-actions';
    actions.forEach((el) => footer.append(el));
    body.append(footer);
  }
}

function decorateVideo(li) {
  const image = li.querySelector('.cards-product-card-image');
  if (!image) return;
  const link = [...li.querySelectorAll('a[href]')].find((a) => VIDEO_PATTERN.test(a.href));
  if (!link) return;
  const anchor = document.createElement('a');
  anchor.className = 'cards-product-play';
  anchor.href = link.href;
  anchor.setAttribute('aria-label', link.textContent.trim() || 'Play video');
  while (image.firstChild) anchor.append(image.firstChild);
  const icon = document.createElement('span');
  icon.className = 'cards-product-play-icon';
  icon.setAttribute('aria-hidden', 'true');
  anchor.append(icon);
  image.append(anchor);
  // the authored video link is now on the image; drop it if it was a standalone button
  const linkParagraph = link.closest('p');
  if (linkParagraph && isButtonParagraph(linkParagraph) && linkParagraph.querySelectorAll('a').length === 1) {
    linkParagraph.remove();
  }
  const actions = li.querySelector('.cards-product-actions');
  if (actions && !actions.children.length) actions.remove();
}

const LAYOUT_OPTIONS = ['photo-side', 'video', 'article', 'checklist', 'checklist-green-image'];

export default function decorate(block) {
  const isVideo = block.classList.contains('video');
  // default layout and the image option share the cut-out photo that bleeds above the card
  if (!LAYOUT_OPTIONS.some((option) => block.classList.contains(option))) {
    block.classList.add('cards-product-bleed');
  }
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) return;
      if (isImageCell(cell)) {
        cell.className = 'cards-product-card-image';
      } else {
        cell.className = 'cards-product-card-body';
        decorateBody(cell);
      }
      li.append(cell);
    });
    if (!li.children.length) return;
    if (!li.querySelector('.cards-product-card-image')) li.classList.add('cards-product-no-image');
    if (isVideo) decorateVideo(li);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
