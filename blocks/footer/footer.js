// media query match that indicates the desktop footer layout
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Fetches the footer fragment. Metadata-independent dual fetch:
 * /content/footer.plain.html (local aem up) first, then /footer.plain.html (DA/EDS).
 * Relative image paths are resolved against the fragment URL, not the page.
 * @returns {Promise<HTMLElement|null>} container holding the fragment sections
 */
async function fetchFooter() {
  let base = '/content/footer.plain.html';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    base = '/footer.plain.html';
    resp = await fetch('/footer.plain.html');
  }
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  const baseUrl = new URL(base, window.location.href);
  container.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^([a-z]+:|\/)/i.test(src)) img.src = new URL(src, baseUrl).href;
    img.loading = 'lazy';
  });
  return container;
}

/**
 * Creates an element with optional class names.
 * @param {string} tag tag name
 * @param {string} [className] class names
 * @returns {HTMLElement}
 */
function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

/**
 * True when every link in the element wraps only an image (icon/badge links).
 * @param {Element} section fragment section
 * @returns {boolean}
 */
function hasOnlyImageLinks(section) {
  const links = [...section.querySelectorAll('a')];
  return links.length > 0 && links.every((a) => a.querySelector('img') && !a.textContent.trim());
}

/**
 * Classifies a fragment section by its content so authors can reorder or omit sections.
 * @param {Element} section fragment section
 * @returns {string} band name
 */
function classifySection(section) {
  if (section.querySelector('h3') && section.querySelector('strong')) return 'speedbump';
  if (section.querySelector('h2') && section.querySelector('ul')) return 'links';
  if (hasOnlyImageLinks(section)) return 'apps';
  if (section.querySelector('ul a')) return 'legal';
  if (section.querySelector('a')) return 'legal';
  if (section.querySelector('img') && !section.textContent.trim()) return 'brand';
  return 'disclosures';
}

/**
 * Turns an "Opens in new window" note (<em> after a link) into a new-window link
 * with a visually hidden description.
 * @param {Element} scope element to search
 */
function decorateNewWindowLinks(scope) {
  scope.querySelectorAll('li > em, p > em').forEach((em) => {
    const link = em.parentElement.querySelector(':scope > a');
    if (!link) return;
    link.target = '_blank';
    link.rel = 'noopener';
    const note = el('span', 'footer-sr-only');
    note.textContent = em.textContent.trim();
    link.append(note);
    em.remove();
  });
}

/**
 * Swaps a column heading between a static heading (desktop) and an
 * accordion toggle button (mobile). Each column toggles independently.
 * @param {HTMLElement} column footer column
 * @param {boolean} desktop desktop mode
 */
function setColumnMode(column, desktop) {
  const heading = column.querySelector('h2');
  const list = column.querySelector('ul');
  const label = heading.dataset.label || heading.textContent.trim();
  heading.dataset.label = label;
  heading.textContent = '';
  list.classList.remove('is-open');
  if (desktop) {
    heading.textContent = label;
    return;
  }
  const button = el('button', 'footer-column-toggle');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-controls', list.id);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    list.classList.toggle('is-open', !expanded);
  });
  heading.append(button);
}

/**
 * Builds the link-column band: one column per heading + list, plus any trailing images.
 * @param {Element} section fragment section
 * @returns {HTMLElement}
 */
function buildLinks(section) {
  const band = el('div', 'footer-links');
  const inner = el('div', 'footer-inner');
  band.append(inner);
  let column = null;
  [...section.children].forEach((child) => {
    if (/^H[1-6]$/.test(child.tagName)) {
      column = el('div', 'footer-column');
      const heading = el('h2');
      heading.innerHTML = child.innerHTML;
      column.append(heading);
      inner.append(column);
    } else if (child.tagName === 'UL' && column) {
      child.id = `footer-list-${inner.children.length}`;
      child.classList.add('footer-column-list');
      column.append(child);
      column = null;
    } else if (child.querySelector('img')) {
      const badge = el('div', 'footer-badge');
      badge.append(...child.querySelectorAll('img'));
      inner.append(badge);
    }
  });
  decorateNewWindowLinks(band);
  const columns = [...inner.querySelectorAll('.footer-column')].filter((c) => c.querySelector('ul'));
  const sync = () => columns.forEach((c) => setColumnMode(c, isDesktop.matches));
  sync();
  isDesktop.addEventListener('change', sync);
  return band;
}

/**
 * Builds the speed-bump dialog shown before leaving for a third-party site.
 * Copy comes from the fragment section (h3 title, paragraphs, strong CTA, em close label).
 * @param {Element} section fragment section
 * @returns {{open: Function}} dialog controller
 */
function buildSpeedBump(section) {
  let dialog = null;
  const title = section.querySelector('h3')?.textContent.trim() || '';
  const ctaPara = section.querySelector('p strong')?.closest('p');
  const ctaLabel = ctaPara?.querySelector('strong')?.textContent.trim() || '';
  const ctaNote = ctaPara?.querySelector('em')?.textContent.trim() || '';
  const closePara = [...section.querySelectorAll('p')].find((p) => p !== ctaPara && p.querySelector('em') && p.textContent.trim() === p.querySelector('em').textContent.trim());
  const closeLabel = closePara?.textContent.trim() || '';
  const body = [...section.querySelectorAll('p')].filter((p) => p !== ctaPara && p !== closePara);

  const create = () => {
    dialog = el('dialog', 'footer-speedbump');
    dialog.setAttribute('aria-labelledby', 'footer-speedbump-title');
    const close = el('button', 'footer-speedbump-close');
    close.type = 'button';
    close.setAttribute('aria-label', closeLabel);
    const closeText = el('span', 'footer-sr-only');
    closeText.textContent = closeLabel;
    close.append(closeText);
    close.addEventListener('click', () => dialog.close());
    const heading = el('h2', 'footer-speedbump-title');
    heading.id = 'footer-speedbump-title';
    heading.textContent = title;
    const content = el('div', 'footer-speedbump-body');
    body.forEach((p) => content.append(p.cloneNode(true)));
    const actions = el('div', 'footer-speedbump-actions');
    const cta = el('a', 'footer-speedbump-cta');
    cta.target = '_blank';
    cta.rel = 'noopener';
    cta.textContent = ctaLabel;
    if (ctaNote) {
      const note = el('span', 'footer-sr-only');
      note.textContent = ctaNote;
      cta.append(note);
    }
    cta.addEventListener('click', () => dialog.close());
    actions.append(cta);
    dialog.append(close, heading, content, actions);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.body.append(dialog);
  };

  return {
    open(href) {
      if (!dialog) create();
      dialog.querySelector('.footer-speedbump-cta').href = href;
      dialog.showModal();
    },
  };
}

/**
 * Builds the app badge + social icon band. Icon links open the speed bump when present.
 * @param {Element} section fragment section
 * @param {{open: Function}|null} speedBump dialog controller
 * @returns {HTMLElement}
 */
function buildApps(section, speedBump) {
  const band = el('div', 'footer-apps');
  const inner = el('div', 'footer-inner');
  band.append(inner);
  section.querySelectorAll(':scope > ul').forEach((ul, i, all) => {
    ul.className = i === all.length - 1 && all.length > 1 ? 'footer-social' : 'footer-app-badges';
    ul.querySelectorAll('a').forEach((a) => {
      a.setAttribute('aria-label', a.querySelector('img')?.alt || '');
      if (!speedBump) return;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        speedBump.open(a.href);
      });
    });
    inner.append(ul);
  });
  return band;
}

/**
 * Wraps a section's content in a band container.
 * @param {Element} section fragment section
 * @param {string} name band name
 * @returns {HTMLElement}
 */
function buildBand(section, name) {
  const band = el('div', `footer-${name}`);
  const inner = el('div', 'footer-inner');
  inner.append(...section.childNodes);
  band.append(inner);
  if (name === 'legal') {
    const copyright = inner.querySelector(':scope > p');
    if (copyright) copyright.className = 'footer-copyright';
  }
  if (name === 'brand') {
    // Desktop and mobile logo variants, each shown at its own breakpoint.
    const logo = inner.querySelector('img');
    if (logo) {
      inner.textContent = '';
      const desktopLogo = logo;
      const mobileLogo = logo.cloneNode(true);
      desktopLogo.className = 'footer-logo footer-logo-desktop';
      mobileLogo.className = 'footer-logo footer-logo-mobile';
      inner.append(mobileLogo, desktopLogo);
    }
  }
  return band;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  if (!fragment) return;
  const sections = [...fragment.children].filter((s) => s.tagName === 'DIV');
  const kinds = sections.map(classifySection);
  const bumpSection = sections[kinds.indexOf('speedbump')];
  const speedBump = bumpSection ? buildSpeedBump(bumpSection) : null;

  block.textContent = '';
  const footer = el('div', 'footer-content');
  sections.forEach((section, i) => {
    const kind = kinds[i];
    if (kind === 'speedbump') return;
    if (kind === 'links') footer.append(buildLinks(section));
    else if (kind === 'apps') footer.append(buildApps(section, speedBump));
    else footer.append(buildBand(section, kind));
  });
  block.append(footer);
}
