import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Only same-origin, non-SVG images can go through createOptimizedPicture.
 * @param {HTMLImageElement} img
 * @returns {boolean}
 */
function canOptimize(img) {
  const url = new URL(img.src, window.location.href);
  return url.origin === window.location.origin && !/\.svg$/i.test(url.pathname);
}

/**
 * Classifies a row: intro heading, CTA (links only), or a service card.
 * @param {Element} row
 * @returns {'heading'|'cta'|'card'|'empty'}
 */
function classifyRow(row) {
  const text = row.textContent.trim();
  const hasMedia = !!row.querySelector('picture, img, .icon');
  if (!text && !hasMedia) return 'empty';
  if (hasMedia) return 'card';
  const cells = [...row.children].filter((c) => c.textContent.trim());
  const links = [...row.querySelectorAll('a')];
  const linkText = links.map((a) => a.textContent).join('').trim();
  if (links.length && linkText === text) return 'cta';
  if (cells.length === 1 && cells[0].querySelector('h1, h2, h3, h4, h5, h6')
    && !cells[0].querySelector('p')) return 'heading';
  return 'card';
}

/**
 * Builds one service card: icon + title header, then description.
 * @param {Element} row
 * @returns {HTMLLIElement}
 */
function buildCard(row) {
  const li = document.createElement('li');
  const header = document.createElement('div');
  header.className = 'cards-office-services-card-header';
  const body = document.createElement('div');
  body.className = 'cards-office-services-card-body';

  [...row.children].forEach((cell) => {
    const media = cell.querySelector('picture, img, .icon');
    if (media && !cell.textContent.trim()) {
      const icon = document.createElement('div');
      icon.className = 'cards-office-services-card-icon';
      icon.append(...cell.childNodes);
      header.append(icon);
    } else {
      body.append(...cell.childNodes);
    }
  });

  // first heading (or a leading bold-only paragraph) is the service title
  let title = body.querySelector('h1, h2, h3, h4, h5, h6');
  if (!title) {
    const first = body.firstElementChild;
    if (first && first.tagName === 'P' && first.querySelector('strong')
      && first.textContent.trim() === first.querySelector('strong').textContent.trim()) {
      title = first;
    }
  }
  if (title) {
    title.classList.add('cards-office-services-card-title');
    header.append(title);
  }

  if (header.children.length) li.append(header);
  if (body.textContent.trim() || body.querySelector('picture, img')) li.append(body);
  return li;
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'cards-office-services-intro';
  const footer = document.createElement('div');
  footer.className = 'cards-office-services-cta';
  const groups = [];
  let ul = null;

  [...block.children].forEach((row) => {
    const type = classifyRow(row);
    if (type === 'empty') return;
    if (type === 'heading' && !groups.length) {
      [...row.children].forEach((cell) => intro.append(...cell.childNodes));
      return;
    }
    if (type === 'cta') {
      [...row.children].forEach((cell) => footer.append(...cell.childNodes));
      ul = null;
      return;
    }
    if (type === 'heading') {
      // a heading row after cards starts a new group
      ul = null;
      const groupHeading = document.createElement('div');
      groupHeading.className = 'cards-office-services-group-heading';
      [...row.children].forEach((cell) => groupHeading.append(...cell.childNodes));
      groups.push(groupHeading);
      return;
    }
    if (!ul) {
      ul = document.createElement('ul');
      groups.push(ul);
    }
    ul.append(buildCard(row));
  });

  groups.forEach((group) => {
    group.querySelectorAll('picture > img').forEach((img) => {
      if (!canOptimize(img)) return;
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '96' }]));
    });
  });

  const children = [];
  if (intro.childNodes.length) children.push(intro);
  children.push(...groups);
  if (footer.childNodes.length) children.push(footer);
  block.replaceChildren(...children);
}
