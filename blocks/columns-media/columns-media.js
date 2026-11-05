import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

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
    if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0`;
    return url.href;
  }
  if (/vimeo\.com$/i.test(url.hostname)) {
    if (url.hostname.startsWith('player.')) return url.href;
    const id = url.pathname.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  return url.href;
}

function buildVideo(link) {
  const wrapper = document.createElement('div');
  wrapper.className = 'columns-media-video';
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

/* a cell whose only meaningful content is one link */
function soleLink(col) {
  const links = col.querySelectorAll('a');
  if (links.length !== 1) return null;
  const text = col.textContent.replace(/\s+/g, ' ').trim();
  const linkText = links[0].textContent.replace(/\s+/g, ' ').trim();
  return text === linkText || text === '' ? links[0] : null;
}

async function decorateCol(col) {
  const link = soleLink(col);
  if (link && VIDEO_RE.test(link.href)) {
    const video = buildVideo(link);
    if (video) {
      col.replaceChildren(video);
      col.classList.add('columns-media-video-col');
      return;
    }
  }
  if (link && link.getAttribute('href')?.includes('/fragments/')) {
    const path = new URL(link.href, window.location.href).pathname;
    let fragment = await loadFragment(path);
    // local preview serves content under /content
    if (!fragment && window.location.pathname.startsWith('/content/') && !path.startsWith('/content/')) {
      fragment = await loadFragment(`/content${path}`);
    }
    if (fragment) {
      col.replaceChildren(...fragment.childNodes);
      col.classList.add('columns-media-fragment-col');
      return;
    }
  }

  const pic = col.querySelector('picture');
  if (pic && col.children.length === 1 && col.textContent.trim() === '') {
    col.classList.add('columns-media-img-col');
  }

  // icon paragraphs: a small image leading a paragraph of text
  col.querySelectorAll(':scope > p').forEach((p) => {
    const first = p.firstElementChild;
    if (first && (first.matches('picture, img')) && p.textContent.trim() !== '') {
      p.classList.add('columns-media-icon-item');
      const icon = document.createElement('span');
      icon.className = 'columns-media-icon';
      icon.append(first);
      const body = document.createElement('span');
      body.className = 'columns-media-icon-text';
      body.append(...p.childNodes);
      p.append(icon, body);
    }
  });
}

export default async function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  const pending = [];
  [...block.children].forEach((row) => {
    row.classList.add('columns-media-row');
    [...row.children].forEach((col) => {
      if (!col.textContent.trim() && !col.querySelector('picture, img, iframe, video')) {
        col.classList.add('columns-media-empty-col');
      }
      pending.push(decorateCol(col));
    });
  });
  await Promise.all(pending);

  block.querySelectorAll('.columns-media-img-col picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
