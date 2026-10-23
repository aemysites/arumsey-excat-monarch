/**
 * Fetches the footer fragment. Metadata-independent dual fetch:
 * /content/footer.plain.html (local preview) first, then /footer.plain.html (DA/EDS).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: resp.url };
}

/**
 * Resolves relative image paths in the fragment against the fragment URL.
 * @param {Element} root fragment root
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:|data:|\/)/.test(src)) img.src = new URL(src, base).href;
    img.loading = 'lazy';
  });
}

/**
 * Replaces an SVG <img> with the inline SVG markup so CSS can recolour it (hover states).
 * Falls back to keeping the <img> when the SVG cannot be fetched.
 * @param {HTMLImageElement} img image to inline
 * @returns {Promise<Element>} the element now in the DOM
 */
async function inlineSvg(img) {
  if (!/\.svg(\?|$)/i.test(img.src)) return img;
  const control = img.closest('a, button');
  if (img.alt && control && !control.textContent.trim()) control.setAttribute('aria-label', img.alt);
  try {
    const resp = await fetch(img.src);
    if (!resp.ok) return img;
    const holder = document.createElement('div');
    holder.innerHTML = await resp.text();
    const svg = holder.querySelector('svg');
    if (!svg) return img;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    img.replaceWith(svg);
    return svg;
  } catch (e) {
    return img;
  }
}

/**
 * Opens external links in a new tab (source parity) with a screen-reader hint.
 * @param {Element} root footer root
 */
function decorateExternalLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    let url;
    try {
      url = new URL(a.href, window.location.href);
    } catch (e) {
      return;
    }
    if (!/^https?:$/.test(url.protocol) || url.host === window.location.host) return;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
}

/**
 * Wraps an icon + text link into the circular-icon button layout.
 * @param {Element} control link or button
 */
function decorateIconControl(control) {
  control.classList.add('footer-icon-btn');
  const label = document.createElement('span');
  label.className = 'footer-icon-label';
  const icon = document.createElement('span');
  icon.className = 'footer-icon';
  [...control.childNodes].forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && /^(img|svg)$/i.test(node.tagName)) icon.append(node);
    else label.append(node);
  });
  label.textContent = label.textContent.trim();
  control.append(icon);
  if (label.textContent) control.append(label);
}

/**
 * Builds a dialog from a nested list: [prompt, field label, submit label].
 * Submitting continues to the trigger link's destination.
 * @param {HTMLAnchorElement} link trigger link (destination + title)
 * @param {Element} list nested list holding the dialog copy
 * @returns {HTMLDialogElement}
 */
function buildLinkDialog(link, list) {
  const [prompt, fieldLabel, submitLabel] = [...list.children].map((li) => li.textContent.trim());
  const title = link.textContent.trim();
  const dialog = document.createElement('dialog');
  dialog.className = 'footer-dialog';
  dialog.setAttribute('aria-label', title);

  const head = document.createElement('div');
  head.className = 'footer-dialog-head';
  const heading = document.createElement('h2');
  heading.textContent = title;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'footer-dialog-close';
  close.setAttribute('aria-label', 'close');
  close.addEventListener('click', () => dialog.close());
  head.append(heading, close);

  const form = document.createElement('form');
  form.className = 'footer-dialog-form';
  form.method = 'dialog';
  if (prompt) {
    const p = document.createElement('p');
    p.textContent = prompt;
    form.append(p);
  }
  const id = `footer-dialog-field-${Math.random().toString(36).slice(2, 8)}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = fieldLabel || title;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  input.name = 'location';
  input.autocomplete = 'postal-code';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'footer-dialog-submit';
  submit.textContent = submitLabel || title;
  form.append(label, input, submit);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dest = new URL(link.href, window.location.href);
    if (input.value.trim()) dest.searchParams.set('location', input.value.trim());
    window.location.href = dest.href;
  });

  dialog.append(head, form);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  return dialog;
}

/**
 * Converts a link into a <button> that keeps the link's content.
 * @param {HTMLAnchorElement} link link to convert
 * @returns {HTMLButtonElement}
 */
function linkToButton(link) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.href = link.getAttribute('href');
  button.append(...link.childNodes);
  link.replaceWith(button);
  return button;
}

/**
 * Decorates the support row: icon controls; links with a nested list open a dialog,
 * the site-search link opens the page's search dialog (header) when available.
 * @param {Element} section support section
 * @param {HTMLDialogElement[]} dialogs collects dialogs to mount outside the bands
 */
function decorateSupport(section, dialogs) {
  section.classList.add('footer-support');
  const title = section.querySelector(':scope > p');
  if (title) title.classList.add('footer-support-title');
  const list = section.querySelector(':scope > ul');
  if (!list) return;
  list.classList.add('footer-support-list');
  [...list.children].forEach((li) => {
    const link = li.querySelector(':scope > a');
    if (!link) return;
    const nested = li.querySelector(':scope > ul');
    const isSearch = /\/search\/?$/.test(new URL(link.href, window.location.href).pathname);
    if (nested) {
      const dialog = buildLinkDialog(link, nested);
      nested.remove();
      const button = linkToButton(link);
      button.setAttribute('aria-haspopup', 'dialog');
      button.addEventListener('click', () => {
        dialog.showModal();
        button.setAttribute('aria-expanded', 'true');
      });
      dialog.addEventListener('close', () => button.setAttribute('aria-expanded', 'false'));
      // keep the dialog outside the footer bands (source mounts its dialog outside the footer rows)
      dialogs.push(dialog);
      decorateIconControl(button);
    } else if (isSearch) {
      const href = link.getAttribute('href');
      const button = linkToButton(link);
      button.setAttribute('aria-haspopup', 'dialog');
      button.addEventListener('click', () => {
        const trigger = [...document.querySelectorAll('header a[role="button"]')]
          .find((a) => /\/search\/?$/.test(a.pathname));
        if (trigger) trigger.click();
        else window.location.href = href;
      });
      decorateIconControl(button);
    } else {
      decorateIconControl(link);
    }
  });
}

/**
 * Binds a consent-settings link (#cookie-settings) to the consent manager when present;
 * otherwise removes it, mirroring the source page behaviour (10 tries, 500ms apart).
 * Unlike the source, the retry window also applies before the consent script exists,
 * because third-party scripts load late (delayed phase) on EDS.
 * @param {Element} root footer root
 */
function bindConsentSettings(root) {
  root.querySelectorAll('a[href="#cookie-settings"]').forEach((link) => {
    let tries = 0;
    const attempt = () => {
      const listener = window.truste?.eu?.clickListener;
      if (typeof listener === 'function') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          listener(e);
        });
        return;
      }
      tries += 1;
      if (tries < 10) setTimeout(attempt, 500);
      else link.remove();
    };
    attempt();
  });
}

/**
 * Decorates the copyright + social band.
 * @param {Element} section legal section
 */
function decorateLegal(section) {
  section.classList.add('footer-legal');
  const copy = document.createElement('div');
  copy.className = 'footer-copyright';
  section.querySelectorAll(':scope > p').forEach((p) => copy.append(p));
  const social = section.querySelector(':scope > ul');
  section.prepend(copy);
  if (!social) return;
  social.classList.add('footer-social');
  social.querySelectorAll('a').forEach((a) => {
    const img = a.querySelector('img');
    const name = a.getAttribute('aria-label') || (img && img.alt) || a.textContent.trim();
    if (name) a.setAttribute('aria-label', `${name}, opens in new tab`);
    decorateIconControl(a);
  });
}

/**
 * Decorates the seals band (certification seal + privacy choices).
 * @param {Element} section seals section
 */
function decorateSeals(section) {
  section.classList.add('footer-seals');
  section.querySelectorAll(':scope > p').forEach((p) => {
    if (p.querySelector('a > img') && !p.textContent.trim()) p.classList.add('footer-seal');
    else p.classList.add('footer-privacy');
  });
}

/**
 * Wraps a band's content in a centred inner container.
 * @param {Element} band band element
 * @param {Element[]} children children to move
 * @param {string} innerClass inner class
 */
function fillBand(band, children, innerClass = '') {
  const inner = document.createElement('div');
  inner.className = `footer-inner ${innerClass}`.trim();
  inner.append(...children);
  band.append(inner);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  if (!fragment) return;
  const content = document.createElement('div');
  content.innerHTML = fragment.html;
  resolveImages(content, fragment.base);

  const sections = [...content.children].filter((el) => el.tagName === 'DIV');
  const isColumn = (s) => !!s.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
  const firstColumn = sections.findIndex(isColumn);
  const support = firstColumn > 0 ? sections.slice(0, firstColumn) : [];
  const columns = sections.filter(isColumn);
  const rest = sections.slice(firstColumn >= 0 ? firstColumn + columns.length : support.length);
  const [legal, seals] = rest;

  // inline the monochrome icons so hover states can recolour them
  const icons = [...support, legal].filter(Boolean)
    .flatMap((s) => [...s.querySelectorAll('ul a img')]);
  await Promise.all(icons.map((img) => inlineSvg(img)));

  decorateExternalLinks(content);
  bindConsentSettings(content);

  block.textContent = '';
  const bands = [];
  const dialogs = [];
  support.forEach((s) => {
    decorateSupport(s, dialogs);
    const band = document.createElement('div');
    band.className = 'footer-band footer-band-support';
    fillBand(band, [...s.childNodes]);
    band.firstElementChild.classList.add('footer-support');
    bands.push(band);
  });

  if (columns.length) {
    const band = document.createElement('div');
    band.className = 'footer-band footer-band-links';
    const cols = columns.map((col) => {
      col.classList.add('footer-column');
      col.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6')
        .forEach((h) => h.classList.add('footer-column-heading'));
      return col;
    });
    fillBand(band, cols, 'footer-columns');
    bands.push(band);
  }

  if (legal) {
    decorateLegal(legal);
    const band = document.createElement('div');
    band.className = 'footer-band footer-band-legal';
    fillBand(band, [...legal.childNodes], 'footer-legal');
    bands.push(band);
  }

  if (seals) {
    decorateSeals(seals);
    const band = document.createElement('div');
    band.className = 'footer-band footer-band-seals';
    fillBand(band, [...seals.childNodes], 'footer-seals');
    bands.push(band);
  }

  block.append(...bands);
  (block.closest('footer') || block).append(...dialogs);
}
