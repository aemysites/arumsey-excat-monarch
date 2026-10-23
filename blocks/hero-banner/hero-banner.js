import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root, eager) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, eager, [
      { media: '(min-width: 900px)', width: '2000' },
      { width: '900' },
    ]));
  });
}

/** True when a cell only holds pictures (no text). */
function isPictureCell(cell) {
  if (!cell.querySelector('picture, img')) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture, img').forEach((el) => el.remove());
  return !clone.textContent.trim();
}

/** Runs once the image has its natural size. */
function whenLoaded(img, fn) {
  if (img.complete && img.naturalWidth) fn();
  else img.addEventListener('load', fn, { once: true });
}

/**
 * Mean relative luminance (0-1) of the left part of an image, where the
 * content sits. Uses a small CORS copy of the image so the canvas stays
 * readable. Resolves null when it cannot be measured.
 */
function measureLuminance(img, share = 0.5) {
  return new Promise((resolve) => {
    const src = img.currentSrc || img.src;
    if (!src) {
      resolve(null);
      return;
    }
    const url = new URL(src, window.location.href);
    if (url.searchParams.has('wid')) url.searchParams.set('wid', '64');
    else if (url.origin === window.location.origin) url.searchParams.set('width', '64');
    const probe = new Image();
    probe.crossOrigin = 'anonymous';
    probe.addEventListener('error', () => resolve(null));
    probe.addEventListener('load', () => {
      try {
        const w = 64;
        const h = Math.max(1, Math.round((probe.naturalHeight / probe.naturalWidth) * w));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(probe, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, Math.max(1, Math.round(w * share)), h);
        let sum = 0;
        let weight = 0;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3] / 255;
          sum += a * ((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255);
          weight += a;
        }
        resolve(weight ? sum / weight : null);
      } catch (e) {
        resolve(null);
      }
    });
    probe.src = url.href;
  });
}

/**
 * hero-banner: full-width background photo with an overlaid eyebrow,
 * heading, text and CTA. A picture-only cell after the text is a foreground
 * image. Options: alt (centred content), image-only (image in flow, not
 * cropped; several images sit side by side), dark (darker scrim over the
 * background), alt-2 (foreground image anchored bottom-right).
 * Derived classes: backdrop (alt over one wide image), is-light (alt-2 over a
 * light photo).
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  let background = null;
  const foreground = [];
  const contentCells = [];

  cells.forEach((cell) => {
    if (isPictureCell(cell)) {
      if (!background && !contentCells.length) background = cell;
      else foreground.push(cell);
    } else if (cell.textContent.trim() || cell.querySelector('a, form, input')) {
      contentCells.push(cell);
    }
  });

  const bg = document.createElement('div');
  bg.className = 'hero-banner-background';
  if (background) bg.append(...background.querySelectorAll('picture, img:not(picture img)'));

  const content = document.createElement('div');
  content.className = 'hero-banner-content';
  contentCells.forEach((cell) => content.append(...cell.childNodes));
  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img, a')) p.remove();
  });

  // Eyebrow: a short paragraph directly before the first heading, or a lone
  // leading paragraph followed only by CTAs.
  const first = content.firstElementChild;
  if (first && first.tagName === 'P' && !first.classList.contains('button-wrapper')) {
    const next = first.nextElementSibling;
    if (next && (/^H[1-6]$/.test(next.tagName) || next.classList.contains('button-wrapper'))) {
      first.classList.add('hero-banner-eyebrow');
    }
  }

  const buttons = [...content.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const group = document.createElement('div');
    group.className = 'hero-banner-actions';
    buttons[0].before(group);
    group.append(...buttons);
    // A paragraph holding only a plain link right after the CTAs is an arrow
    // link beside them (source .btn-container a.right-arrow).
    let next = group.nextElementSibling;
    while (next && next.tagName === 'P' && next.children.length === 1
      && next.firstElementChild.tagName === 'A'
      && next.textContent.trim() === next.firstElementChild.textContent.trim()) {
      const link = next;
      next = next.nextElementSibling;
      link.classList.add('hero-banner-link');
      group.append(link);
    }
  }

  const children = [];
  if (bg.childElementCount) children.push(bg);
  if (content.childElementCount) children.push(content);
  else block.classList.add('no-content');

  if (foreground.length) {
    const fg = document.createElement('div');
    fg.className = 'hero-banner-foreground';
    foreground.forEach((cell) => fg.append(...cell.querySelectorAll('picture, img:not(picture img)')));
    children.push(fg);
  }
  if (!bg.childElementCount) block.classList.add('no-background');

  block.replaceChildren(...children);

  // The banner is usually the LCP element when it is in the first section.
  const section = block.closest('.section');
  const eager = !section || !section.previousElementSibling;
  optimizeImages(block, eager);

  const bgImg = bg.querySelector('img');
  if (!bgImg) return;
  // alt with a single background image and no foreground illustration: a wide
  // image is a full-width backdrop behind centred text (source report hero); a
  // small mark (logo) keeps the teaser layout. The first-section hero is set up
  // as a backdrop straight away so the LCP image does not shift.
  if (block.classList.contains('alt') && !foreground.length && content.childElementCount) {
    if (eager) block.classList.add('backdrop');
    whenLoaded(bgImg, () => {
      block.classList.toggle('backdrop', bgImg.naturalWidth / bgImg.naturalHeight >= 1.5);
    });
  }
  // alt-2 text sits on the photo: a light photo takes dark text and dark CTAs
  // (source W-4 marquee) instead of the light-on-dark default (source homepage).
  if (block.classList.contains('alt-2') && content.childElementCount) {
    whenLoaded(bgImg, () => {
      measureLuminance(bgImg).then((lum) => {
        if (lum !== null && lum > 0.6) block.classList.add('is-light');
      });
    });
  }
}
