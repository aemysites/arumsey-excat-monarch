import { createOptimizedPicture } from '../../scripts/aem.js';

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
  wrapper.className = 'columns-panel-video';
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

/* replace paragraphs that hold only a video link with an embed */
function decorateVideos(col) {
  col.querySelectorAll('a').forEach((link) => {
    if (!VIDEO_RE.test(link.href)) return;
    const holder = link.closest('p') || link;
    if (holder.textContent.trim() !== link.textContent.trim()) return;
    const video = buildVideo(link);
    if (video) {
      holder.replaceWith(video);
      col.classList.add('columns-panel-video-col');
    }
  });
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-panel-${cols.length}-cols`);
  const isTestimonials = block.classList.contains('testimonials');

  [...block.children].forEach((row) => {
    row.classList.add('columns-panel-row');
    [...row.children].forEach((col) => {
      decorateVideos(col);

      if (!col.textContent.trim() && !col.querySelector('picture, img, iframe, video')) {
        col.classList.add('columns-panel-empty-col');
        return;
      }

      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1 && col.textContent.trim() === '') {
        col.classList.add('columns-panel-img-col');
      }

      // link lists render as arrowed rows
      col.querySelectorAll(':scope > ul').forEach((ul) => {
        const items = [...ul.children];
        if (items.length && items.every((li) => li.querySelector('a')
          && li.textContent.trim() === li.querySelector('a').textContent.trim())) {
          ul.classList.add('columns-panel-links');
        }
      });

      if (isTestimonials) {
        col.classList.add('columns-panel-quote');
        const first = col.firstElementChild;
        if (first && first.tagName === 'P' && !first.textContent.trim() && first.querySelector('img')) {
          first.classList.add('columns-panel-quote-icon');
        }
        const last = col.lastElementChild;
        if (last && last !== first && last.tagName === 'P') {
          last.classList.add('columns-panel-quote-author');
        }
      }
    });
  });

  block.querySelectorAll('.columns-panel-img-col picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
