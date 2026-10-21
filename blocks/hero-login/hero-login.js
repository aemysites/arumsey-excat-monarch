import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const FIELD_PATTERNS = [
  { test: /password/i, type: 'password', autocomplete: 'current-password' },
  { test: /remember/i, type: 'checkbox', autocomplete: 'off' },
  { test: /user\s*id|username|email/i, type: 'text', autocomplete: 'username' },
];

let fieldCounter = 0;

/** @param {Element} el */
function isPictureOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

/** @param {Element} el */
function hasContent(el) {
  return !!(el.textContent.trim() || el.querySelector('picture, img, a, .icon'));
}

/** A cell holding nothing but a link to a same-origin fragment: load it in place. */
async function inlineFragment(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return;
  const fragment = await loadFragment(url.pathname.replace(/(\.plain)?\.html$/, ''));
  if (!fragment) return;
  const nodes = [...fragment.querySelectorAll(':scope > .section > *')];
  cell.replaceChildren(...(nodes.length ? nodes : [...fragment.childNodes]));
}

/** @param {Element} cell */
function looksLikeSignOn(cell) {
  return /password/i.test(cell.textContent);
}

function buildField(label, pattern) {
  fieldCounter += 1;
  const id = `hero-login-field-${fieldCounter}`;
  const wrap = document.createElement('div');
  wrap.className = `hero-login-field hero-login-field-${pattern.type}`;
  const input = document.createElement('input');
  input.id = id;
  input.type = pattern.type;
  input.name = pattern.type === 'checkbox' ? 'remember' : pattern.autocomplete;
  input.autocomplete = pattern.autocomplete;
  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.textContent = label;
  if (pattern.type === 'checkbox') {
    wrap.append(input, labelEl);
  } else {
    wrap.append(labelEl, input);
  }
  if (pattern.type === 'password') {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'hero-login-reveal';
    toggle.setAttribute('aria-label', 'Show password');
    toggle.setAttribute('aria-pressed', 'false');
    toggle.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(show));
      toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
    wrap.append(toggle);
  }
  return wrap;
}

/** A list of plain options (no links) authored in the panel becomes a select. */
function buildSelect(ul) {
  fieldCounter += 1;
  const select = document.createElement('select');
  select.className = 'hero-login-select';
  select.id = `hero-login-field-${fieldCounter}`;
  select.setAttribute('aria-label', 'Account type');
  [...ul.children].forEach((li) => {
    const option = document.createElement('option');
    option.textContent = li.textContent.trim();
    select.append(option);
  });
  return select;
}

/**
 * Turn the authored sign-on cell (field labels, a Sign On link and helper links)
 * into a form. Unrecognised content is kept as-is below the form.
 */
function buildSignOn(cell) {
  const panel = document.createElement('div');
  panel.className = 'hero-login-panel';
  const form = document.createElement('form');
  form.className = 'hero-login-form';
  form.noValidate = true;
  const links = document.createElement('div');
  links.className = 'hero-login-links';

  const footer = [];
  let submitHref = null;
  [...cell.children].forEach((el) => {
    const text = el.textContent.trim();
    const anchors = el.querySelectorAll('a[href]');
    // "Passwordless Sign On" mentions "password": keep it out of the field patterns
    if (/passwordless/i.test(text)) {
      el.classList.add('hero-login-passwordless');
      footer.push(el);
      return;
    }
    if (/^H[1-6]$/.test(el.tagName)) {
      panel.append(el);
      return;
    }
    if (el.tagName === 'UL' && !el.querySelector('a')) {
      form.append(buildSelect(el));
      return;
    }
    if (el.tagName === 'P' && !anchors.length && text) {
      const pattern = FIELD_PATTERNS.find((p) => p.test.test(text));
      if (pattern) {
        form.append(buildField(text, pattern));
        return;
      }
    }
    if (!submitHref && anchors.length === 1 && /^sign\s*on$/i.test(text)) {
      submitHref = anchors[0].getAttribute('href');
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'button primary hero-login-submit';
      button.textContent = text;
      form.append(button);
      return;
    }
    // bare "/" between two links (Register / Activate) gets its own span for spacing
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '/') {
        const connector = document.createElement('span');
        connector.className = 'hero-login-connector';
        connector.textContent = '/';
        node.replaceWith(connector);
      }
    });
    links.append(el);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!submitHref || submitHref.startsWith('#')) return;
    window.location.href = new URL(submitHref, window.location.href).href;
  });

  if (form.children.length) panel.append(form);
  if (links.children.length) panel.append(links);
  panel.append(...footer);
  return panel;
}

export default async function decorate(block) {
  const cells = [];
  [...block.children].forEach((row) => {
    [...row.children].filter(hasContent).forEach((cell) => cells.push(cell));
  });
  await Promise.all(cells.map(inlineFragment));

  const images = cells.filter(isPictureOnly);
  const texts = cells.filter((c) => !isPictureOnly(c));

  // with two pictures the first is the background; a lone picture is the background
  // for the text-box layout and the product image otherwise
  let background = null;
  let media = null;
  if (images.length >= 2) {
    [background, media] = images;
  } else if (images.length === 1) {
    if (block.classList.contains('text-box-and-sign-on-panel')) [background] = images;
    else [media] = images;
  }

  let signOn = texts.find(looksLikeSignOn) || null;
  if (!signOn && texts.length > 1) signOn = texts[texts.length - 1];
  const copy = texts.filter((c) => c !== signOn);

  block.replaceChildren();

  if (background) {
    const bg = document.createElement('div');
    bg.className = 'hero-login-background';
    bg.append(...background.querySelectorAll('picture, img:not(picture img)'));
    block.append(bg);
    block.classList.add('hero-login-has-background');
  }

  const inner = document.createElement('div');
  inner.className = 'hero-login-inner';

  if (copy.length) {
    const content = document.createElement('div');
    content.className = 'hero-login-content';
    copy.forEach((c) => content.append(...c.childNodes));
    const heading = content.querySelector(':scope > h1, :scope > h2, :scope > h3');
    let prev = heading ? heading.previousElementSibling : null;
    while (prev) {
      if (prev.tagName === 'P' && !prev.querySelector('a, picture, img')) {
        prev.classList.add('hero-login-eyebrow');
      }
      prev = prev.previousElementSibling;
    }
    inner.append(content);
  }

  if (media) {
    const mediaEl = document.createElement('div');
    mediaEl.className = 'hero-login-media';
    mediaEl.append(...media.childNodes);
    inner.append(mediaEl);
  }

  if (signOn) inner.append(buildSignOn(signOn));

  block.append(inner);

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isBg = !!img.closest('.hero-login-background');
    img.closest('picture').replaceWith(createOptimizedPicture(
      img.src,
      img.alt,
      isBg,
      isBg ? [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }] : [{ width: '750' }],
    ));
  });
}
