import { createOptimizedPicture } from '../../scripts/aem.js';

const VIDEO_RE = /\.(mp4|webm|m4v|mov|ogv)$/i;

function isVideoUrl(href) {
  try {
    return VIDEO_RE.test(new URL(href, window.location.href).pathname);
  } catch (e) {
    return false;
  }
}

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

/** A media cell holds a video link and/or a poster picture, and no other text. */
function isMediaCell(cell) {
  const videoLink = [...cell.querySelectorAll('a[href]')].find((a) => isVideoUrl(a.href));
  if (!videoLink) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('a, picture, img').forEach((el) => el.remove());
  return !clone.textContent.trim();
}

function buildToggle(video) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-video-toggle';
  const sync = () => {
    const playing = !video.paused;
    button.dataset.state = playing ? 'playing' : 'paused';
    button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
  };
  button.addEventListener('click', () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  sync();
  return button;
}

/**
 * hero-video: full-bleed muted looping background video with an overlaid
 * eyebrow, heading (or title image) and CTAs. A poster picture in the video
 * cell shows until the video plays and is the fallback. The video does not
 * autoplay when the user prefers reduced motion; a play/pause toggle is added.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const mediaCell = cells.find(isMediaCell);
  const contentCells = cells.filter((c) => c !== mediaCell);

  const media = document.createElement('div');
  media.className = 'hero-video-media';

  const content = document.createElement('div');
  content.className = 'hero-video-content';
  contentCells.forEach((cell) => content.append(...cell.childNodes));
  // aem.js wrapTextNodes wraps a cell that starts with a <picture> in one <p>,
  // swallowing the following paragraphs: unwrap so every item is a direct child.
  content.querySelectorAll(':scope > p').forEach((p) => {
    if (p.querySelector(':scope > p, :scope > div, :scope > h1, :scope > h2, :scope > h3')) {
      p.replaceWith(...p.childNodes);
    }
  });
  // a bare title picture sits in its own paragraph like the other items
  [...content.children].filter((el) => el.tagName === 'PICTURE').forEach((pic) => {
    const p = document.createElement('p');
    p.className = 'hero-video-title';
    pic.replaceWith(p);
    p.append(pic);
  });
  [...content.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
  });
  content.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img, a')) p.remove();
  });
  content.querySelectorAll(':scope > p:not(.button-wrapper)').forEach((p) => {
    if (p.children.length === 1 && p.querySelector(':scope > picture') && !p.textContent.trim()) {
      p.classList.add('hero-video-title');
    }
  });

  const first = content.firstElementChild;
  if (first && first.tagName === 'P' && !first.classList.contains('button-wrapper') && !first.querySelector('picture')) {
    const next = first.nextElementSibling;
    if (next && (/^H[1-6]$/.test(next.tagName) || next.querySelector('picture'))) {
      first.classList.add('hero-video-eyebrow');
    }
  }

  const buttons = [...content.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const group = document.createElement('div');
    group.className = 'hero-video-actions';
    buttons[0].before(group);
    group.append(...buttons);
  }

  block.replaceChildren(media, content);

  const section = block.closest('.section');
  const eager = !section || !section.previousElementSibling;

  if (!mediaCell) {
    block.classList.add('no-video');
    optimizeImages(block, eager);
    return;
  }

  const poster = mediaCell.querySelector('picture');
  if (poster) {
    // the poster only stands in for the (aria-hidden) video
    const posterImg = poster.querySelector('img');
    if (posterImg) posterImg.alt = '';
    media.append(poster);
  }
  optimizeImages(block, eager);

  const link = [...mediaCell.querySelectorAll('a[href]')].find((a) => isVideoUrl(a.href));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const video = document.createElement('video');
  video.muted = true;
  video.setAttribute('muted', '');
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  // the poster <picture> sits behind the video, so no poster attribute (avoids a second download)
  video.preload = reduced ? 'none' : 'metadata';
  const source = document.createElement('source');
  source.src = link.href;
  const ext = new URL(link.href).pathname.split('.').pop().toLowerCase();
  source.type = ext === 'webm' ? 'video/webm' : 'video/mp4';
  video.append(source);

  video.addEventListener('playing', () => block.classList.add('is-playing'), { once: true });
  video.addEventListener('error', () => block.classList.add('video-failed'), { once: true });
  source.addEventListener('error', () => block.classList.add('video-failed'), { once: true });

  media.append(video);
  block.append(buildToggle(video));

  if (!reduced) {
    // Start after the poster (LCP) has painted.
    const start = () => video.play().catch(() => {});
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  }
}
