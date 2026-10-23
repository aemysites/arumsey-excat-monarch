/*
 * Embed Form block
 * Embeds a third-party form (iframe) with optional heading, intro and footnote text
 * authored around the form link.
 */

const BLOCK = 'embed-form';

/**
 * Pick the form link: a link that is the only content of its paragraph or cell,
 * falling back to the last link in the block.
 * @param {Element} block
 * @returns {HTMLAnchorElement|null}
 */
function findFormLink(block) {
  const links = [...block.querySelectorAll('a[href]')];
  const standalone = links.find((a) => {
    const holder = a.closest('p, div');
    return holder && holder.textContent.trim() === a.textContent.trim();
  });
  return standalone || links[links.length - 1] || null;
}

function buildIframe(href, title) {
  const iframe = document.createElement('iframe');
  iframe.src = href;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  return iframe;
}

export default function decorate(block) {
  const link = findFormLink(block);
  if (!link) return;

  let url;
  try {
    url = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  // split authored content around the link into intro (before) and footnote (after)
  const content = document.createElement('div');
  content.className = `${BLOCK}-content`;
  const intro = document.createElement('div');
  intro.className = `${BLOCK}-intro`;
  const footnote = document.createElement('div');
  footnote.className = `${BLOCK}-footnote`;

  const linkHolder = link.closest('p') || link;
  const frame = document.createElement('div');
  frame.className = `${BLOCK}-frame`;

  let target = intro;
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((child) => {
      if (child === linkHolder || child.contains(linkHolder)) {
        target = footnote;
        return;
      }
      target.append(child);
    });
  });

  // bare URL link text (also copied to a.title by scripts.js) makes a poor accessible name
  const notUrl = (text) => (text && !/^https?:\/\//i.test(text.trim()) ? text.trim() : '');
  const title = intro.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim()
    || notUrl(link.title) || notUrl(link.textContent) || `Form from ${url.hostname}`;

  if (intro.children.length) content.append(intro);
  content.append(frame);
  if (footnote.children.length) content.append(footnote);
  block.replaceChildren(content);

  const load = () => {
    if (block.classList.contains(`${BLOCK}-is-loaded`)) return;
    frame.append(buildIframe(url.href, title));
    block.classList.add(`${BLOCK}-is-loaded`);
  };

  // listen for common auto-height messages from the embedded form
  window.addEventListener('message', (event) => {
    if (event.origin !== url.origin) return;
    const height = Number(event.data?.height ?? event.data?.frameHeight);
    if (Number.isFinite(height) && height > 0) {
      frame.style.setProperty('--embed-form-height', `${Math.ceil(height)}px`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '200px' });
  observer.observe(block);
}
