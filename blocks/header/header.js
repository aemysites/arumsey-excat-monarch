// breakpoint-exception: source switches to the desktop header at 992px
const isDesktop = window.matchMedia('(min-width: 992px)');

/**
 * Fetches the nav fragment. Metadata-independent dual fetch:
 * /content/nav.plain.html (local preview) first, then /nav.plain.html (DA/EDS).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
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
    img.loading = 'eager';
  });
}

/**
 * Wraps loose text nodes of an element into a span with the given class.
 * @param {Element} el element
 * @param {string} className class for the wrapper
 */
function wrapText(el, className) {
  const span = document.createElement('span');
  span.className = className;
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'IMG')) {
      span.append(n);
    }
  });
  el.append(span);
  return span;
}

/**
 * Wraps all child nodes of an element into a new div with the given class.
 * @param {Element} el parent element
 * @param {string} className wrapper class
 * @returns {HTMLDivElement} the wrapper
 */
function wrapChildren(el, className) {
  const wrapper = document.createElement('div');
  wrapper.className = className;
  wrapper.append(...[...el.childNodes]);
  el.append(wrapper);
  return wrapper;
}

/**
 * Decorates one promo card (layout shells only; copy stays in the fragment).
 * @param {HTMLLIElement} card promo card list item
 */
function decoratePromoCard(card) {
  card.classList.add('nav-promo-card');
  const img = card.querySelector(':scope > img, :scope > picture');
  let media = null;
  if (img) {
    card.classList.add('has-image');
    media = document.createElement('div');
    media.className = 'nav-promo-media';
    media.append(img);
  }
  const body = wrapChildren(card, 'nav-promo-body');
  if (media) card.prepend(media);
  const ps = body.querySelectorAll('p');
  if (ps[0]) ps[0].classList.add('nav-promo-cta');
  if (ps[1]) {
    ps[1].classList.add('nav-promo-text');
    const copy = document.createElement('div');
    copy.className = 'nav-promo-copy';
    ps[1].before(copy);
    copy.append(ps[1]);
  }
}

/**
 * Classifies a megamenu column by its content and decorates it.
 * @param {HTMLLIElement} col column list item
 */
function decorateColumn(col) {
  col.classList.add('nav-col');
  const heading = col.querySelector(':scope > h2, :scope > h3');
  const list = col.querySelector(':scope > ul');
  if (heading && heading.tagName === 'H2') {
    col.classList.add('nav-col-primary');
    heading.classList.add('nav-col-heading');
    if (list) list.classList.add('nav-arrow-links');
  } else if (heading) {
    col.classList.add('nav-col-group');
    heading.classList.add('nav-group-title');
    // mobile accordion toggle (multi-expand); inert styling on desktop
    const groupToggle = document.createElement('button');
    groupToggle.type = 'button';
    groupToggle.className = 'nav-group-toggle';
    groupToggle.setAttribute('aria-expanded', 'false');
    groupToggle.append(...[...heading.childNodes]);
    heading.append(groupToggle);
    groupToggle.addEventListener('click', () => {
      if (isDesktop.matches) return;
      const expanded = groupToggle.getAttribute('aria-expanded') === 'true';
      groupToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      col.classList.toggle('is-expanded', !expanded);
    });
    if (list) {
      list.classList.add('nav-group-links');
      const listWrap = document.createElement('div');
      listWrap.className = 'nav-group-list';
      list.before(listWrap);
      listWrap.append(list);
    }
  } else if (list) {
    col.classList.add('nav-col-promo');
    list.classList.add('nav-promo-cards');
    [...list.children].forEach(decoratePromoCard);
    if (col.querySelector('.nav-promo-card.has-image')) col.classList.add('has-image-card');
    col.querySelectorAll(':scope > p').forEach((p) => p.classList.add('nav-promo-disclaimer'));
  }
  wrapChildren(col, 'nav-col-inner');
}

/**
 * Closes every open megamenu panel.
 * @param {Element} nav nav element
 */
function closeAllPanels(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false');
  });
  nav.querySelectorAll('.nav-panel.is-open').forEach((panel) => panel.classList.remove('is-open'));
  nav.classList.remove('mega-open');
}

/**
 * Opens one megamenu panel.
 * @param {Element} nav nav element
 * @param {Element} drop nav-drop list item
 */
function openPanel(nav, drop) {
  closeAllPanels(nav);
  drop.setAttribute('aria-expanded', 'true');
  const panel = nav.querySelector(`#${drop.dataset.panel}`);
  if (panel) panel.classList.add('is-open');
  nav.classList.add('mega-open');
}

/**
 * Builds the megamenu panels for every top-level section item with a nested list.
 * Panels are rendered in a shared container below the main bar.
 * @param {Element} nav nav element
 * @param {Element} sections nav-sections element
 * @param {Element} container panels container
 */
function buildPanels(nav, sections, container) {
  const topList = sections.querySelector(':scope ul');
  if (!topList) return;
  topList.classList.add('nav-top-list');
  [...topList.children].forEach((li, i) => {
    li.classList.add('nav-top-item');
    const trigger = li.querySelector(':scope > a');
    if (trigger) trigger.classList.add('nav-trigger');
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    const label = trigger ? trigger.textContent.trim() : '';
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');
    const panelId = `nav-panel-${i}`;
    li.dataset.panel = panelId;
    const panel = document.createElement('div');
    panel.className = 'nav-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', label);
    sub.classList.add('nav-panel-columns');
    [...sub.children].forEach(decorateColumn);

    // mobile sub-panel header: back arrow, trigger label (link), close
    const panelHead = document.createElement('div');
    panelHead.className = 'nav-panel-head';
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'nav-panel-back';
    back.setAttribute('aria-label', 'Submenu back');
    panelHead.append(back);
    if (trigger) {
      const title = trigger.cloneNode(true);
      title.className = 'nav-panel-title';
      panelHead.append(title);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'nav-panel-close';
    close.setAttribute('aria-label', 'Close navigation');
    panelHead.append(close);
    panel.append(panelHead, sub);
    container.append(panel);
    close.addEventListener('click', () => {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, false);
    });
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (isDesktop.matches) return;
        e.preventDefault();
        openPanel(nav, li);
      });
    }

    // drill-down toggle (chevron) next to the trigger label
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-drop-toggle';
    toggle.setAttribute('aria-controls', panelId);
    toggle.setAttribute('aria-label', `Show submenu for ${label}`);
    if (trigger) trigger.after(toggle);

    li.addEventListener('mouseenter', () => {
      if (isDesktop.matches) openPanel(nav, li);
    });
    li.addEventListener('focusin', () => {
      if (isDesktop.matches) openPanel(nav, li);
    });
    toggle.addEventListener('click', () => {
      const open = li.getAttribute('aria-expanded') === 'true';
      if (open) closeAllPanels(nav);
      else openPanel(nav, li);
    });
    back.addEventListener('click', () => {
      closeAllPanels(nav);
      toggle.focus();
    });
  });

  // keep one column grid across all panels: pad shorter panels with spacer
  // columns before the trailing promo column (layout only, no content)
  const lists = [...container.querySelectorAll('.nav-panel-columns')];
  const max = Math.max(0, ...lists.map((l) => l.children.length));
  lists.forEach((l) => {
    const promo = l.querySelector(':scope > .nav-col-promo');
    while (l.children.length < max) {
      const spacer = document.createElement('li');
      spacer.className = 'nav-col nav-col-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      l.insertBefore(spacer, promo);
    }
  });
}

/**
 * Builds the brand-family bar (row 0).
 * @param {Element} bar section element
 */
function decorateBrandBar(bar) {
  const items = bar.querySelectorAll('li');
  items.forEach((li, i) => {
    li.classList.add('nav-brand-item');
    const a = li.querySelector('a');
    if (a) {
      a.classList.add('nav-brand-link');
      a.setAttribute('aria-label', a.querySelector('img')?.alt || a.textContent.trim());
    }
    if (i === 0) li.classList.add('active-brand');
  });
}

/**
 * Builds the full-screen search takeover from the "Search" tool link.
 * @param {Element} nav nav element
 * @param {HTMLAnchorElement} link search link from the fragment
 * @param {Element} logo logo link to clone in the takeover header
 */
function buildSearch(nav, link, logo) {
  const dialog = document.createElement('div');
  dialog.className = 'nav-search';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Search modal popup');
  dialog.hidden = true;

  const top = document.createElement('div');
  top.className = 'nav-search-top';
  if (logo) top.append(logo.cloneNode(true));
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-search-close';
  close.setAttribute('aria-label', 'Close Search');
  top.append(close);

  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = link.pathname;
  const label = document.createElement('label');
  label.className = 'nav-search-label';
  label.htmlFor = 'nav-search-input';
  label.textContent = link.textContent.trim();
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'nav-search-input';
  input.name = 'q';
  input.placeholder = link.textContent.trim();
  input.autocomplete = 'off';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'nav-search-submit';
  submit.setAttribute('aria-label', link.textContent.trim());
  const icon = link.querySelector('img');
  if (icon) submit.append(icon.cloneNode(true));
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'nav-search-clear';
  clear.setAttribute('aria-label', 'Clear');
  form.append(label, input, submit, clear);
  dialog.append(top, form);
  nav.append(dialog);

  const open = () => {
    closeAllPanels(nav);
    dialog.hidden = false;
    document.body.classList.add('nav-search-open');
    link.setAttribute('aria-expanded', 'true');
    input.focus();
  };
  const shut = () => {
    dialog.hidden = true;
    document.body.classList.remove('nav-search-open');
    link.setAttribute('aria-expanded', 'false');
  };
  link.setAttribute('role', 'button');
  link.setAttribute('aria-expanded', 'false');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });
  close.addEventListener('click', shut);
  clear.addEventListener('click', () => {
    input.value = '';
    input.focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    window.location.href = `${link.pathname}?#q=${encodeURIComponent(q)}`;
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') shut();
  });
}

/**
 * Toggles the mobile menu.
 * @param {Element} nav nav element
 * @param {boolean} [force] force open/closed
 */
function toggleMenu(nav, force) {
  const expanded = force !== undefined ? !force : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  const button = nav.querySelector('.nav-hamburger');
  if (button) button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = (!expanded && !isDesktop.matches) ? 'hidden' : '';
  if (expanded) closeAllPanels(nav);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  if (!fragment) return;
  const content = document.createElement('div');
  content.innerHTML = fragment.html;
  resolveImages(content, fragment.base);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.setAttribute('aria-expanded', 'false');

  const sectionsEls = [...content.children];
  const classes = ['brand-bar', 'brand', 'sections', 'tools'];
  sectionsEls.forEach((section, i) => {
    if (classes[i]) section.classList.add(`nav-${classes[i]}`);
  });

  const brandBar = content.querySelector('.nav-brand-bar');
  const brand = content.querySelector('.nav-brand');
  const sections = content.querySelector('.nav-sections');
  const tools = content.querySelector('.nav-tools');

  if (brandBar) decorateBrandBar(brandBar);
  const logo = brand ? brand.querySelector('a') : null;
  if (logo) {
    logo.classList.add('nav-logo');
    wrapText(logo, 'nav-sr-only');
  }

  const main = document.createElement('div');
  main.className = 'nav-main';
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Toggle Site navigation');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span><span class="nav-sr-only">Site navigation</span>';
  hamburger.addEventListener('click', () => toggleMenu(nav));

  if (brand) main.append(brand);
  const panels = document.createElement('div');
  panels.className = 'nav-megamenu';
  if (sections) {
    buildPanels(nav, sections, panels);
    main.append(sections);
  }
  if (tools) {
    tools.querySelectorAll(':scope li').forEach((li) => {
      li.classList.add('nav-tool');
      const a = li.querySelector('a');
      if (!a) return;
      a.classList.add('nav-tool-link');
      a.querySelectorAll('img').forEach((img) => img.classList.add('nav-tool-icon'));
      wrapText(a, 'nav-tool-label');
      if (a.querySelector('strong')) li.classList.add('nav-tool-cta');
    });
    main.append(tools);
    // mobile-only copy of the sign-in CTA at the top of the open menu (source parity)
    const cta = tools.querySelector('.nav-tool-cta');
    const topList = sections && sections.querySelector('.nav-top-list');
    if (cta && topList) {
      const mobileCta = cta.cloneNode(true);
      mobileCta.className = 'nav-top-item nav-mobile-only nav-mobile-signin';
      topList.prepend(mobileCta);
    }
    const searchLink = [...tools.querySelectorAll('a')].find((a) => /\/search\/?$/.test(a.pathname));
    if (searchLink) buildSearch(nav, searchLink, logo);
  }
  main.append(hamburger);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => closeAllPanels(nav));

  if (brandBar) nav.append(brandBar);
  nav.append(main, panels);
  nav.addEventListener('mouseleave', () => {
    if (isDesktop.matches) closeAllPanels(nav);
  });
  nav.addEventListener('focusout', (e) => {
    if (isDesktop.matches && !nav.contains(e.relatedTarget)) closeAllPanels(nav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (nav.classList.contains('mega-open') && isDesktop.matches) closeAllPanels(nav);
    else if (nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, false);
  });

  // viewport resize: reset mobile/desktop state when crossing the breakpoint
  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
    toggleMenu(nav, false);
    document.body.style.overflowY = '';
  });

  // source hides the brand-family bar as soon as the page scrolls; main bar moves to top 0
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 0);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav, overlay);
  block.append(navWrapper);
}
