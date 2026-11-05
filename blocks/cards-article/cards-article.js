import { createOptimizedPicture } from '../../scripts/aem.js';

const BANNER_OPTIONS = ['photo-banner', 'photo-banner-boxed'];
const DATE_RE = /^(january|february|march|april|may|june|july|august|september|october|november|december|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b.*\d{4}$/i;

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function isImageCell(cell) {
  const pic = cell.querySelector('picture, img');
  return pic && cell.textContent.trim() === '';
}

function isTagCell(cell) {
  const text = cell.textContent.trim();
  return text && text.length <= 40 && !cell.querySelector('picture, img, a, h1, h2, h3, h4, h5, h6');
}

/** First row is a banner when a banner option is set and the row is one cell with a heading. */
function isBannerRow(block, row) {
  if (!BANNER_OPTIONS.some((opt) => block.classList.contains(opt))) return false;
  const cells = [...row.children];
  return cells.length === 1 && !!cells[0].querySelector('h1, h2, h3, h4, h5, h6');
}

function decorateBanner(row) {
  const banner = document.createElement('div');
  banner.className = 'cards-article-banner';
  const cell = row.firstElementChild;
  const picture = cell.querySelector('picture');
  if (picture) {
    const bg = document.createElement('div');
    bg.className = 'cards-article-banner-image';
    (picture.closest('p') || picture).replaceWith(bg);
    bg.append(picture);
    banner.append(bg);
  }
  const content = document.createElement('div');
  content.className = 'cards-article-banner-content';
  const title = cell.querySelector('h1, h2, h3, h4, h5, h6');
  // the title sits on the photo; any intro text and the View all link follow below it
  const intro = document.createElement('div');
  intro.className = 'cards-article-intro';
  [...cell.childNodes].forEach((node) => {
    if (node === title) content.append(node);
    else if (node.nodeType === Node.ELEMENT_NODE) intro.append(node);
  });
  intro.querySelectorAll('a').forEach((a) => {
    const p = a.closest('p');
    if (p && p.textContent.trim() === a.textContent.trim()) p.classList.add('cards-article-view-all');
  });
  banner.append(content);
  return intro.children.length ? [banner, intro] : [banner];
}

function decorateBody(body) {
  body.className = 'cards-article-card-body';
  [...body.querySelectorAll('p')].forEach((p) => {
    const text = p.textContent.trim();
    if (!text && !p.querySelector('img, picture')) {
      p.remove();
      return;
    }
    if (DATE_RE.test(text)) p.classList.add('cards-article-card-date');
    const link = p.querySelector('a');
    if (link && p.children.length === 1 && text === link.textContent.trim()) {
      p.classList.add('cards-article-card-cta');
    }
  });
}

function decorateCard(row) {
  const li = document.createElement('li');
  const cells = [...row.children];
  let body;
  cells.forEach((cell) => {
    if (isImageCell(cell)) {
      cell.className = 'cards-article-card-image';
      li.append(cell);
    } else if (isTagCell(cell) && cells.length > 2) {
      cell.className = 'cards-article-card-tag';
      li.append(cell);
    } else if (!cell.textContent.trim() && !cell.children.length) {
      // empty cell: drop it
    } else if (body) {
      body.append(...cell.childNodes);
    } else {
      body = cell;
      li.append(body);
    }
  });
  if (body) decorateBody(body);

  // tag sits on the image; move it inside the image cell when both exist
  const tag = li.querySelector('.cards-article-card-tag');
  const image = li.querySelector('.cards-article-card-image');
  if (tag && image) image.append(tag);

  return li.children.length ? li : null;
}

export default function decorate(block) {
  const rows = [...block.children];
  const fragment = document.createDocumentFragment();

  if (rows.length && isBannerRow(block, rows[0])) {
    fragment.append(...decorateBanner(rows.shift()));
  }

  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const li = decorateCard(row);
    if (li) ul.append(li);
  });

  if (block.classList.contains('overlay')) {
    // overlay tiles are fully clickable: the first link stretches over the card (see CSS)
    ul.querySelectorAll('li').forEach((li) => {
      const link = li.querySelector('.cards-article-card-body a[href]');
      if (link) link.classList.add('cards-article-card-link');
    });
  }

  fragment.append(ul);
  optimizePictures(fragment);
  block.replaceChildren(fragment);
}
