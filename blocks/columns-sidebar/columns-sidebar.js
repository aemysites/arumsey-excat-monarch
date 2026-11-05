import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Columns Sidebar
 * Each row: [main body content | sidebar content].
 * Sidebar content is grouped into promo cards: every image starts a new card
 * (image, heading, text, link). A lone video link in the sidebar becomes an embed.
 * Option `media-right`: equal-width columns for a text + media layout.
 */
const VIDEO_RE = /(youtube\.com|youtu\.be|vimeo\.com|\.mp4(\?|$))/i;

function videoEmbedUrl(href) {
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (e) {
    return null;
  }
  if (/youtu\.be$/i.test(url.hostname)) {
    return `https://www.youtube.com/embed/${url.pathname.split('/')[1]}?rel=0`;
  }
  if (/youtube\.com$/i.test(url.hostname)) {
    const id = url.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0` : url.href;
  }
  if (/vimeo\.com$/i.test(url.hostname) && !url.hostname.startsWith('player.')) {
    return `https://player.vimeo.com/video/${url.pathname.split('/').filter(Boolean).pop()}`;
  }
  return url.href;
}

function buildVideo(link) {
  const wrapper = document.createElement('div');
  wrapper.className = 'columns-sidebar-video';
  if (/\.mp4(\?|$)/i.test(link.href)) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.src = link.href;
    wrapper.append(video);
    return wrapper;
  }
  const src = videoEmbedUrl(link.href);
  if (!src) return null;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = link.title || link.textContent.trim() || 'Video';
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
  iframe.setAttribute('allowfullscreen', '');
  wrapper.append(iframe);
  return wrapper;
}

function decorateVideos(col) {
  let found = false;
  col.querySelectorAll('a').forEach((link) => {
    if (!VIDEO_RE.test(link.href)) return;
    const holder = link.closest('p') || link;
    if (holder.textContent.trim() !== link.textContent.trim()) return;
    const video = buildVideo(link);
    if (video) {
      holder.replaceWith(video);
      found = true;
    }
  });
  return found;
}

function buildCards(col) {
  const children = [...col.children];
  if (!children.some((el) => el.querySelector('picture, img') || el.matches('picture, img'))) return;
  const cards = [];
  let current = null;
  children.forEach((el) => {
    const hasImage = el.matches('picture, img') || (el.querySelector('picture, img') && !el.textContent.trim());
    if (hasImage || !current) {
      current = document.createElement('div');
      current.className = 'columns-sidebar-card';
      cards.push(current);
    }
    if (hasImage) el.classList.add('columns-sidebar-card-image');
    current.append(el);
  });
  cards.forEach((card) => {
    const body = document.createElement('div');
    body.className = 'columns-sidebar-card-body';
    [...card.children].filter((el) => !el.classList.contains('columns-sidebar-card-image'))
      .forEach((el) => body.append(el));
    if (body.children.length) card.append(body);
    const links = body.querySelectorAll(':scope > p > a');
    const cta = links[links.length - 1];
    if (cta && cta.parentElement.textContent.trim() === cta.textContent.trim()) {
      cta.parentElement.classList.add('columns-sidebar-card-cta');
    }
  });
  col.replaceChildren(...cards);
}

export default function decorate(block) {
  const mediaRight = block.classList.contains('media-right');

  [...block.children].forEach((row) => {
    row.classList.add('columns-sidebar-row');
    const cols = [...row.children];
    cols.forEach((col, idx) => {
      if (!col.textContent.trim() && !col.querySelector('picture, img, iframe, video')) {
        col.classList.add('columns-sidebar-empty-col');
        return;
      }
      if (idx === 0) {
        col.classList.add('columns-sidebar-main');
        return;
      }
      col.classList.add('columns-sidebar-aside');
      const hasVideo = decorateVideos(col);
      if (hasVideo || mediaRight) {
        col.classList.add('columns-sidebar-media');
      } else {
        buildCards(col);
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
