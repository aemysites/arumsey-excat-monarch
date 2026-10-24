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
 * True when a paragraph holds nothing but links.
 * @param {Element} p
 * @returns {boolean}
 */
function isLinkOnly(p) {
  const links = [...p.querySelectorAll('a')];
  if (!links.length || p.querySelector('picture, img')) return false;
  return links.map((a) => a.textContent).join('').trim() === p.textContent.trim();
}

/**
 * Tags body parts: eyebrow (short text before the heading), title, CTA.
 * @param {Element} body
 */
function decorateBody(body) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('cards-article-card-title');
    let prev = heading.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'P' && !prev.querySelector('picture, img')) {
        prev.classList.add('cards-article-card-eyebrow');
      }
      prev = prev.previousElementSibling;
    }
  }

  const paragraphs = [...body.querySelectorAll(':scope > p')];
  const ctas = [];
  for (let i = paragraphs.length - 1; i >= 0; i -= 1) {
    const p = paragraphs[i];
    if (p.classList.contains('cards-article-card-eyebrow') || !isLinkOnly(p)) break;
    // without a heading, a plain link is the card title; only buttons are CTAs
    if (!heading && !p.querySelector('a.button')) break;
    ctas.unshift(p);
  }
  if (ctas.length) {
    const wrap = document.createElement('div');
    wrap.className = 'cards-article-card-cta';
    wrap.append(...ctas);
    body.append(wrap);
  }
}

const PAGE_SIZE = 6;

function toSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Listing behaviour for a text-only results list (expat resource-center search):
 * a "Load more" link after the block in its section shows PAGE_SIZE more results
 * at a time; a results-toolbar in the section filters by category (eyebrow text)
 * and sorts ("most-recent" by date, anything else in authored order), and gets
 * the visible result count back.
 * @param {Element} block
 * @param {HTMLUListElement} ul
 */
function decorateListing(block, ul) {
  const section = block.closest('.section');
  if (!section) return;
  const more = [...section.querySelectorAll('.default-content-wrapper a')]
    .find((a) => /^load more$/i.test(a.textContent.trim()));
  const hasToolbar = !!section.querySelector('.results-toolbar');
  if (!more && !hasToolbar) return;

  const items = [...ul.children];
  const category = (li) => {
    const eyebrow = li.querySelector('.cards-article-card-eyebrow');
    const date = eyebrow?.querySelector('.cards-article-card-date');
    const text = eyebrow ? eyebrow.textContent.replace(date?.textContent || '', '') : '';
    return toSlug(text.split('•')[0] || '');
  };
  const time = (li) => {
    const date = li.querySelector('.cards-article-card-date')?.textContent || '';
    return Date.parse(date.replace(/[^\w ,]/g, ' ').trim()) || 0;
  };
  const params = new URLSearchParams(window.location.search);
  let topic = params.get('topic') || '';
  let sort = params.get('sort') || '';
  let shown = PAGE_SIZE;
  const moreHolder = more && (more.closest('p') || more);

  const render = (announce) => {
    const ordered = sort === 'most-recent' ? [...items].sort((a, b) => time(b) - time(a)) : items;
    ul.append(...ordered);
    const matches = ordered.filter((li) => !topic || category(li) === topic);
    ordered.forEach((li) => { li.hidden = true; });
    matches.forEach((li, i) => { li.hidden = !!more && i >= shown; });
    if (moreHolder) moreHolder.hidden = matches.length <= shown;
    if (announce) {
      document.dispatchEvent(new CustomEvent('results-toolbar:count', { detail: { count: matches.length } }));
    }
    return matches;
  };

  if (more) {
    more.setAttribute('role', 'button');
    more.addEventListener('click', (e) => {
      e.preventDefault();
      const first = shown;
      shown += PAGE_SIZE;
      const matches = render(false);
      matches[first]?.querySelector('a')?.focus();
    });
  }
  section.addEventListener('results-toolbar:filter', (e) => {
    topic = e.detail?.value || '';
    shown = PAGE_SIZE;
    render(true);
  });
  section.addEventListener('results-toolbar:sort', (e) => {
    sort = e.detail?.value || '';
    shown = PAGE_SIZE;
    render(true);
  });
  render(!!topic);
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture');
      if (hasPicture && !cell.textContent.trim()) {
        cell.className = 'cards-article-card-image';
      } else if (!cell.textContent.trim()) {
        cell.remove();
      } else {
        cell.className = 'cards-article-card-body';
        decorateBody(cell);
      }
    });

    if (!li.querySelector('.cards-article-card-image')) li.classList.add('no-image');
    if (li.children.length) ul.append(li);
  });

  // default variant: image teasers share one row; text-only results form a list
  const isDefault = [...block.classList].every((c) => c === 'cards-article' || c === 'block');
  if (isDefault && ul.children.length) {
    const hasImages = !!ul.querySelector('.cards-article-card-image');
    ul.classList.add(hasImages ? 'cards-article-row' : 'cards-article-list');
    if (!hasImages) {
      // "Category • Date": the date part renders in the body colour
      ul.querySelectorAll('.cards-article-card-eyebrow').forEach((p) => {
        const [category, ...rest] = p.textContent.split('•');
        if (!rest.length || p.children.length) return;
        const date = document.createElement('span');
        date.className = 'cards-article-card-date';
        date.textContent = `\u00a0\u00a0•\u00a0 ${rest.join('•').trim()}`;
        p.replaceChildren(category.trim(), date);
      });
    }
  }

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!canOptimize(img)) return;
    const width = block.classList.contains('country-grid') ? '120' : '750';
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });

  block.replaceChildren(ul);
  if (ul.classList.contains('cards-article-list')) decorateListing(block, ul);
}
