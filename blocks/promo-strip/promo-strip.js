import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Classify one authored cell by its content.
 * @param {Element} cell
 * @returns {'media'|'heading'|'cta'|'text'|'empty'}
 */
function classifyCell(cell) {
  const text = cell.textContent.trim();
  const hasMedia = cell.querySelector('picture, img, .icon, svg');
  if (!text && hasMedia) return 'media';
  if (!text) return 'empty';
  if (cell.querySelector('h1, h2, h3, h4, h5, h6')) return 'heading';
  const links = [...cell.querySelectorAll('a')];
  const linkText = links.map((a) => a.textContent.trim()).join('');
  if (links.length && linkText.length === text.length) return 'cta';
  return 'text';
}

/**
 * Scene7 renditions that carry both `hei` (authored) and `wid` (added per breakpoint)
 * come back letterboxed to the full width. Strip images keep their authored height,
 * so drop `wid` and let Scene7 return the natural aspect ratio.
 * @param {string} value URL
 * @returns {string}
 */
function unpadScene7(value) {
  try {
    const url = new URL(value, window.location.href);
    if (!/scene7\.com$/.test(url.hostname) || !url.searchParams.has('hei')) return value;
    url.searchParams.delete('wid');
    return url.toString();
  } catch (e) {
    return value;
  }
}

function optimizeImages(block) {
  block.querySelectorAll('.promo-strip-media picture').forEach((picture) => {
    picture.querySelectorAll('source[srcset]').forEach((source) => {
      source.srcset = unpadScene7(source.getAttribute('srcset'));
    });
    const img = picture.querySelector('img');
    if (img) img.src = unpadScene7(img.getAttribute('src'));
  });
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });
}

export default function decorate(block) {
  const inner = document.createElement('div');
  inner.className = 'promo-strip-inner';

  // Flatten every row's cells into one strip; authors may use one row or several.
  const cells = [...block.children].flatMap((row) => [...row.children]);
  let headingSeen = false;
  cells.forEach((cell) => {
    let type = classifyCell(cell);
    if (type === 'empty') return;
    // A lead cell made only of bold text acts as the heading.
    if (type === 'text' && !headingSeen && cell.querySelector('strong, b')
      && cell.textContent.trim() === cell.querySelector('strong, b').textContent.trim()) {
      type = 'heading';
    }
    if (type === 'heading') headingSeen = true;
    cell.className = `promo-strip-${type}`;
    if (type === 'cta') {
      cell.querySelectorAll('a').forEach((a) => {
        a.classList.add('promo-strip-link');
      });
    }
    inner.append(cell);
  });

  // A heading cell may also carry the body copy; split trailing paragraphs out.
  const heading = inner.querySelector('.promo-strip-heading');
  if (heading && !inner.querySelector('.promo-strip-text')) {
    const extras = [...heading.children].filter((el) => el.tagName === 'P' && !el.querySelector('a:only-child'));
    if (extras.length && heading.querySelector('h1, h2, h3, h4, h5, h6')) {
      const text = document.createElement('div');
      text.className = 'promo-strip-text';
      text.append(...extras);
      heading.after(text);
    }
  }

  block.replaceChildren(inner);
  optimizeImages(block);
}
