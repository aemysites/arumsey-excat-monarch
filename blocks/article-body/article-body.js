/*
 * Article Body block
 * Leading one-cell rows: article header (category, title) shown above the meta on mobile
 *                        and above the content column on desktop.
 * Two-cell rows: cell 1 = sidebar meta (read time, date, author, reviewer, share links),
 *                cell 2 = article content.
 * Later one-cell rows: article content only.
 * With no sidebar content the article renders as a single column.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const SOCIAL_HOSTS = /(^|\.)(twitter\.com|x\.com|facebook\.com|linkedin\.com|pinterest\.com)$/i;
const SOCIAL_NAMES = /^(x|twitter|facebook|linkedin|pinterest)$/i;
const SHARE_LABEL = /^(share|follow)( on)?:?$/i;
const TAKEAWAYS_LABEL = /^key takeaways:?$/i;
const META_TYPES = [
  ['read-time', /\bmin(ute)?s?\.? read\b/i],
  ['author', /^(written by|author)\b/i],
  ['reviewer', /^reviewed by\b/i],
  ['date', /^(updated:?\s*)?([a-z]+\.? \d{1,2},? \d{4}|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})$/i],
];

function hasContent(el) {
  return !!el && (el.textContent.trim() !== '' || !!el.querySelector('img, picture, svg, a, table'));
}

function socialHost(a) {
  try {
    const { hostname } = new URL(a.href);
    return SOCIAL_HOSTS.test(hostname) ? hostname.replace(/^www\./, '') : null;
  } catch (e) {
    return null;
  }
}

/**
 * Marks social profile/share links so they render as the source icons.
 * Links keep their text as the accessible name.
 * @param {Element} root
 */
function decorateSocialLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const host = socialHost(a);
    if (!host) return;
    const text = a.textContent.trim();
    if (text && !SOCIAL_NAMES.test(text)) return;
    const network = host.split('.')[0] === 'x' ? 'twitter' : host.split('.')[0];
    a.classList.add('article-body-social', `article-body-social-${network}`);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (!text && !a.getAttribute('aria-label')) a.setAttribute('aria-label', host);
  });
}

function decorateMeta(meta) {
  // group share links into one row
  const shareLinks = [...meta.querySelectorAll('a[href]')].filter((a) => !!socialHost(a));
  if (shareLinks.length) {
    const share = document.createElement('div');
    share.className = 'article-body-share';
    const firstParent = shareLinks[0].closest('p, li') || shareLinks[0];
    firstParent.before(share);

    // a "Share:" paragraph right before the links becomes the row label
    const label = share.previousElementSibling;
    if (label && SHARE_LABEL.test(label.textContent.trim()) && !label.querySelector('a')) {
      label.classList.add('article-body-share-label');
      share.append(label);
    }

    shareLinks.forEach((a) => {
      const holder = a.closest('p, li');
      share.append(a);
      if (holder && holder !== firstParent && !hasContent(holder)) holder.remove();
    });
    if (firstParent !== shareLinks[0] && !hasContent(firstParent)) firstParent.remove();
  }

  // each remaining paragraph is a meta item, typed so the expat sidebar can show its icon
  [...meta.children].forEach((child) => {
    if (child.classList.contains('article-body-share')) return;
    child.classList.add('article-body-meta-item');
    const text = child.textContent.trim();
    const type = META_TYPES.find(([, pattern]) => pattern.test(text));
    if (type) child.classList.add(`article-body-meta-${type[0]}`);
  });
}

/**
 * Groups a leading "Key Takeaways" label and its summary into one element.
 * @param {Element} content
 */
function decorateTakeaways(content) {
  const label = [...content.children].find((el) => el.tagName === 'P'
    && TAKEAWAYS_LABEL.test(el.textContent.trim()));
  if (!label) return;
  const box = document.createElement('div');
  box.className = 'article-body-takeaways';
  label.classList.add('article-body-takeaways-label');
  label.before(box);
  box.append(label);
  let next = box.nextElementSibling;
  while (next && /^(P|UL|OL)$/.test(next.tagName) && !next.querySelector('picture, img')
    && !TAKEAWAYS_LABEL.test(next.textContent.trim())) {
    const current = next;
    next = next.nextElementSibling;
    box.append(current);
  }
}

/**
 * Marks the first image-only paragraph before the first heading as the featured image.
 * @param {Element} content
 */
function decorateFeaturedImage(content) {
  const children = [...content.children];
  const headingIndex = children.findIndex((el) => /^H[2-6]$/.test(el.tagName));
  const before = headingIndex < 0 ? children : children.slice(0, headingIndex);
  const image = before.find((el) => el.tagName === 'P'
    && el.querySelector('picture, img') && !el.textContent.trim());
  if (image) image.classList.add('article-body-featured-image');
}

/**
 * Moves a trailing author feature (image-only paragraph, name, "Follow on:" links)
 * out of the prose into its own element.
 * @param {Element} content
 * @returns {Element|null}
 */
function extractAuthor(content) {
  const children = [...content.children];
  const imageIndex = children.findLastIndex((el) => el.tagName === 'P'
    && el.querySelector('picture, img') && !el.textContent.trim());
  if (imageIndex < 0) return null;
  const rest = children.slice(imageIndex + 1);
  if (!rest.length || rest.length > 2 || rest.some((el) => el.tagName !== 'P')) return null;

  const author = document.createElement('div');
  author.className = 'article-body-author';
  const intro = document.createElement('div');
  intro.className = 'article-body-author-intro';
  const image = children[imageIndex];
  image.classList.add('article-body-author-image');
  intro.append(image);

  rest.forEach((p) => {
    if (p.querySelector('.article-body-social')) {
      p.classList.add('article-body-author-follow');
      author.append(p);
    } else {
      p.classList.add('article-body-author-name');
      intro.append(p);
    }
  });
  author.prepend(intro);
  return author;
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
  });
}

export default function decorate(block) {
  // expat resource-center articles (Metadata "Template: expat-article"): sidebar + 800px column
  if (document.body.classList.contains('expat-article')) block.classList.add('expat');

  const header = document.createElement('div');
  header.className = 'article-body-header';
  const meta = document.createElement('aside');
  meta.className = 'article-body-meta';
  const content = document.createElement('div');
  content.className = 'article-body-content';

  let seenTwoCellRow = false;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      seenTwoCellRow = true;
      if (hasContent(cells[0])) meta.append(...cells[0].childNodes);
      cells.slice(1).forEach((cell) => content.append(...cell.childNodes));
    } else if (cells[0]) {
      (seenTwoCellRow ? content : header).append(...cells[0].childNodes);
    }
  });

  decorateSocialLinks(meta);
  decorateSocialLinks(content);
  const author = extractAuthor(content);
  decorateTakeaways(content);
  decorateFeaturedImage(content);

  block.replaceChildren();
  if (hasContent(header)) block.append(header);
  if (hasContent(meta)) {
    decorateMeta(meta);
    block.classList.add('article-body-has-meta');
    block.append(meta);
  }
  block.append(content);
  if (author) block.append(author);

  // wide tables scroll inside the article column
  content.querySelectorAll('table').forEach((table) => {
    if (table.parentElement.classList.contains('article-body-table')) return;
    const wrap = document.createElement('div');
    wrap.className = 'article-body-table';
    table.replaceWith(wrap);
    wrap.append(table);
  });

  optimizeImages(block);
}
