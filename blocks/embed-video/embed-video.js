import { loadFragment } from '../fragment/fragment.js';

const VIDEO_URL = /youtube\.com|youtu\.be|vimeo\.com|\.mp4(\?|#|$)/i;
const TRANSCRIPT = /^(read\s+)?transcript(ion)?\b/i;

function getEmbedSrc(url, autoplay) {
  if (url.hostname.includes('youtu')) {
    let id = url.searchParams.get('v');
    if (url.hostname.includes('youtu.be')) [, id] = url.pathname.split('/');
    if (!id) id = url.pathname.split('/').filter(Boolean).pop();
    const params = new URLSearchParams({ rel: '0' });
    if (autoplay) params.set('autoplay', '1');
    return `https://www.youtube.com/embed/${id}?${params}`;
  }
  if (url.hostname.includes('vimeo')) {
    const id = url.pathname.split('/').filter(Boolean).pop();
    return `https://player.vimeo.com/video/${id}${autoplay ? '?autoplay=1' : ''}`;
  }
  return null;
}

function getYouTubeId(url) {
  if (!url.hostname.includes('youtu')) return null;
  if (url.hostname.includes('youtu.be')) return url.pathname.split('/')[1] || null;
  return url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop() || null;
}

function getTitle(link) {
  // scripts.js copies link text into title, so a bare-URL link has a URL title too
  const isUrl = (value) => /^https?:\/\//i.test(value);
  const title = (link.title || '').trim();
  if (title && !isUrl(title)) return title;
  const text = link.textContent.trim();
  if (text && !isUrl(text)) return text;
  return 'Video';
}

function buildPlayer(link, autoplay) {
  const url = new URL(link.href, window.location.href);
  const title = getTitle(link);
  if (/\.mp4(\?|#|$)/i.test(url.pathname)) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = url.href;
    video.setAttribute('aria-label', title);
    if (autoplay) video.autoplay = true;
    return video;
  }
  const src = getEmbedSrc(url, autoplay);
  if (!src) return null;
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  // the block already defers mounting until the player nears the viewport
  iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
  return iframe;
}

function fragmentPath(el) {
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1 || links[0].textContent.trim() !== el.textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

async function inlineFragment(el, path) {
  const fragment = await loadFragment(path);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  el.replaceChildren(...(sections.length
    ? sections.flatMap((section) => [...section.childNodes])
    : [...fragment.childNodes]));
}

/** Build a collapsible transcript from its label element and the content that follows it. */
function buildTranscript(label, contentNodes) {
  const wrapper = document.createElement('div');
  wrapper.className = 'embed-video-transcript';
  const panel = document.createElement('div');
  panel.className = 'embed-video-transcript-panel';
  panel.id = `embed-video-transcript-${Math.random().toString(36).slice(2, 8)}`;
  panel.append(...contentNodes);
  panel.hidden = true;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'embed-video-transcript-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', panel.id);
  button.textContent = label.textContent.trim();

  const path = fragmentPath(panel);
  let loaded = !path;
  button.addEventListener('click', async () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (!expanded && !loaded) {
      loaded = true;
      await inlineFragment(panel, path);
    }
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });

  wrapper.append(button, panel);
  return wrapper;
}

function decorateMedia(link, poster) {
  const media = document.createElement('div');
  media.className = 'embed-video-media';

  const mount = (autoplay) => {
    const player = buildPlayer(link, autoplay);
    if (player) media.replaceChildren(player);
  };

  if (poster) {
    // poster image: click (or keyboard) to load and play
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'embed-video-poster';
    const title = getTitle(link);
    button.setAttribute('aria-label', title === 'Video' ? 'Play video' : `Play ${title}`);
    button.append(poster);
    button.addEventListener('click', () => mount(true), { once: true });
    media.append(button);
  } else {
    // YouTube thumbnail placeholder so the frame is never an empty box before the player loads
    const id = getYouTubeId(new URL(link.href, window.location.href));
    if (id) {
      media.classList.add('embed-video-placeholder');
      media.style.backgroundImage = `url("https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg")`;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        mount(false);
      }
    }, { rootMargin: '200px' });
    observer.observe(media);
  }
  return media;
}

export default function decorate(block) {
  const items = [];
  const cells = [...block.querySelectorAll(':scope > div > div')];

  // find the video link (first YouTube/Vimeo/MP4 link) and an optional poster
  const link = [...block.querySelectorAll('a[href]')].find((a) => VIDEO_URL.test(a.href));
  const poster = link ? block.querySelector('picture') : null;

  if (link) {
    // name the player after the block heading (or poster alt) when the link is a bare URL
    const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
    const name = heading?.textContent.trim() || poster?.querySelector('img')?.alt.trim();
    if (getTitle(link) === 'Video' && name) link.title = name;
    const media = decorateMedia(link, poster);
    items.push(media);
    const holder = link.closest('p');
    if (holder && holder.textContent.trim() === link.textContent.trim()) holder.remove();
    else link.remove();
  }

  // remaining authored content: heading/text above or below, plus an optional transcript
  const body = document.createElement('div');
  body.className = 'embed-video-body';
  cells.forEach((cell) => {
    const children = [...cell.children];
    const labelIndex = children.findIndex((el) => TRANSCRIPT.test(el.textContent.trim())
      && el.textContent.trim().length < 40);
    if (labelIndex >= 0) {
      body.append(...children.slice(0, labelIndex));
      const label = children[labelIndex];
      const rest = children.slice(labelIndex + 1);
      // a two-cell row: label cell, transcript cell
      const sibling = cell.nextElementSibling;
      if (!rest.length && sibling) {
        rest.push(...sibling.childNodes);
        sibling.dataset.consumed = 'true';
      }
      body.append(buildTranscript(label, rest));
    } else if (cell.dataset.consumed !== 'true') {
      body.append(...cell.childNodes);
    }
  });

  if (body.textContent.trim() || body.querySelector('picture, img')) {
    // headings authored before the video stay above it
    const lead = [];
    while (block.classList.contains('dark') && body.firstElementChild
      && /^H\d$/.test(body.firstElementChild.tagName)) {
      const heading = body.firstElementChild;
      heading.remove();
      lead.push(heading);
    }
    if (lead.length) {
      const header = document.createElement('div');
      header.className = 'embed-video-header';
      header.append(...lead);
      items.unshift(header);
    }
    if (body.textContent.trim() || body.querySelector('picture, img')) items.push(body);
  }

  block.replaceChildren(...items);
}
