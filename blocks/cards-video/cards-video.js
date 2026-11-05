import { createOptimizedPicture } from '../../scripts/aem.js';

const VIDEO_HOST_RE = /(youtube\.com|youtu\.be|vimeo\.com)$/i;

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function toUrl(href) {
  try {
    return new URL(href, window.location.href);
  } catch (e) {
    return null;
  }
}

function isVideoLink(a) {
  const url = toUrl(a.getAttribute('href'));
  if (!url) return false;
  return VIDEO_HOST_RE.test(url.hostname) || /\.(mp4|webm)$/i.test(url.pathname);
}

/** Returns an embeddable src for YouTube/Vimeo links, or null for direct video files. */
function getEmbedSrc(url, autoplay) {
  const host = url.hostname.replace(/^www\./, '');
  if (host.endsWith('youtu.be') || host.endsWith('youtube.com')) {
    let id = url.searchParams.get('v');
    if (!id && host.endsWith('youtu.be')) [, id] = url.pathname.split('/');
    if (!id) {
      const m = url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
      if (m) [, id] = m;
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0${autoplay ? '&autoplay=1' : ''}`;
  }
  if (host.endsWith('vimeo.com')) {
    const m = url.pathname.match(/(\d+)/);
    if (!m) return null;
    return `https://player.vimeo.com/video/${m[1]}${autoplay ? '?autoplay=1' : ''}`;
  }
  return null;
}

function buildPlayer(url, title, autoplay) {
  const embedSrc = getEmbedSrc(url, autoplay);
  if (embedSrc) {
    const iframe = document.createElement('iframe');
    iframe.src = embedSrc;
    iframe.title = title || 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    return iframe;
  }
  const video = document.createElement('video');
  video.src = url.href;
  video.controls = true;
  video.preload = 'metadata';
  if (autoplay) video.autoplay = true;
  return video;
}

function decorateVideo(media, link, title) {
  const url = toUrl(link.getAttribute('href'));
  const picture = media.querySelector('picture');
  media.className = 'cards-video-card-video';
  media.textContent = '';
  if (!url) return;

  const load = (autoplay) => {
    if (media.classList.contains('cards-video-is-loaded')) return;
    media.replaceChildren(buildPlayer(url, title, autoplay));
    media.classList.add('cards-video-is-loaded');
  };

  if (picture) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cards-video-play';
    button.setAttribute('aria-label', title ? `Play video: ${title}` : 'Play video');
    media.append(picture, button);
    media.addEventListener('click', () => load(true), { once: true });
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        load(false);
      }
    });
    observer.observe(media);
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    // the video cell holds only a video link (plus an optional poster picture)
    const linkText = (c) => [...c.querySelectorAll('a')].map((a) => a.textContent).join('').trim();
    let videoCell = cells.find((c) => [...c.querySelectorAll('a')].some(isVideoLink)
      && c.textContent.trim() === linkText(c));
    if (!videoCell) videoCell = cells.find((c) => c.querySelector('picture') && c.querySelector('a'));

    const body = document.createElement('div');
    body.className = 'cards-video-card-body';
    cells.filter((c) => c !== videoCell).forEach((c) => body.append(...c.childNodes));
    body.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
    });
    if (body.children.length) li.append(body);

    if (videoCell) {
      const link = [...videoCell.querySelectorAll('a')].find(isVideoLink) || videoCell.querySelector('a');
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
      decorateVideo(videoCell, link, heading?.textContent.trim());
      li.append(videoCell);
    }
    if (li.children.length) ul.append(li);
  });
  optimizePictures(ul);
  block.replaceChildren(ul);
}
