/*
 * Embed Interactive block
 * One or more embedded videos (YouTube / Vimeo) or third-party iframes (forms, tools),
 * with an optional intro (heading/text) row.
 */

function safeUrl(href) {
  try {
    const url = new URL(href, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch (e) {
    return null;
  }
}

function createIframe(src, title, allow) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allowfullscreen', '');
  if (allow) iframe.setAttribute('allow', allow);
  return iframe;
}

const VIDEO_ALLOW = 'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; clipboard-write';

function youtubeSrc(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') || '';
  if (url.hostname.includes('youtu.be')) [, vid] = url.pathname.split('/');
  else if (url.pathname.startsWith('/embed/')) [, , vid] = url.pathname.split('/');
  const suffix = autoplay ? '&mute=1&autoplay=1' : '';
  return `https://www.youtube.com/embed/${encodeURIComponent(vid)}?rel=0${suffix}`;
}

function vimeoSrc(url, autoplay) {
  const id = url.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part)) || '';
  const params = new URLSearchParams();
  const hash = url.searchParams.get('h');
  if (hash) params.set('h', hash);
  if (autoplay) {
    params.set('autoplay', '1');
    params.set('muted', '1');
  }
  const query = params.toString();
  return `https://player.vimeo.com/video/${id}${query ? `?${query}` : ''}`;
}

function buildEmbed(url, title, autoplay = false) {
  const frame = document.createElement('div');
  const host = url.hostname;
  if (host.includes('youtube') || host.includes('youtu.be')) {
    frame.className = 'embed-interactive-frame embed-interactive-video';
    frame.append(createIframe(youtubeSrc(url, autoplay), title || 'Content from YouTube', VIDEO_ALLOW));
  } else if (host.includes('vimeo')) {
    frame.className = 'embed-interactive-frame embed-interactive-video';
    frame.append(createIframe(vimeoSrc(url, autoplay), title || 'Content from Vimeo', VIDEO_ALLOW));
  } else {
    frame.className = 'embed-interactive-frame embed-interactive-iframe';
    frame.append(createIframe(url.href, title || `Content from ${host}`));
  }
  return frame;
}

function decorateItem(item, link) {
  const url = safeUrl(link.href);
  if (!url) return;
  const linkText = link.textContent.trim();
  const title = linkText && linkText !== link.href ? linkText : '';
  const placeholder = item.querySelector('picture');
  // drop the link (and its wrapping paragraph if it held only the link)
  const parent = link.parentElement;
  link.remove();
  if (parent && parent.tagName === 'P' && !parent.textContent.trim() && !parent.children.length) parent.remove();

  const media = document.createElement('div');
  media.className = 'embed-interactive-media';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-interactive-placeholder';
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'embed-interactive-play';
    play.setAttribute('aria-label', title ? `Play ${title}` : 'Play');
    const picParent = placeholder.parentElement;
    wrapper.append(placeholder, play);
    if (picParent && picParent.tagName === 'P' && !picParent.textContent.trim() && !picParent.children.length) picParent.remove();
    wrapper.addEventListener('click', () => {
      wrapper.replaceWith(buildEmbed(url, title, true));
    });
    media.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        media.append(buildEmbed(url, title));
      }
    });
    observer.observe(media);
  }

  const text = [...item.querySelectorAll(':scope > div')].filter((cell) => cell.textContent.trim());
  item.textContent = '';
  item.append(media);
  if (text.length) {
    const caption = document.createElement('div');
    caption.className = 'embed-interactive-caption';
    text.forEach((cell) => caption.append(...cell.childNodes));
    item.append(caption);
  }
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'embed-interactive-intro';
  const list = document.createElement('div');
  list.className = 'embed-interactive-items';

  [...block.children].forEach((row) => {
    const links = [...row.querySelectorAll('a[href]')];
    if (!links.length) {
      // rows without a link are intro content (heading / text)
      if (row.textContent.trim()) {
        [...row.children].forEach((cell) => intro.append(...cell.childNodes));
      }
      row.remove();
      return;
    }
    // one item per cell that holds a link; a row may hold several videos side by side
    const cells = [...row.children];
    const linkCells = cells.filter((cell) => cell.querySelector('a[href]'));
    if (linkCells.length > 1) {
      linkCells.forEach((cell) => {
        const item = document.createElement('div');
        item.className = 'embed-interactive-item';
        const inner = document.createElement('div');
        inner.append(...cell.childNodes);
        item.append(inner);
        list.append(item);
        decorateItem(item, item.querySelector('a[href]'));
      });
    } else {
      row.className = 'embed-interactive-item';
      list.append(row);
      decorateItem(row, links[0]);
    }
  });

  block.textContent = '';
  if (intro.childNodes.length) block.append(intro);
  block.append(list);
  block.classList.toggle('embed-interactive-multi', list.children.length > 1);
}
