// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 1200px)');

/**
 * Fetches the nav fragment. Metadata-independent dual fetch:
 * /content/nav.plain.html (local aem up) first, then /nav.plain.html (DA/EDS).
 * Relative image paths are resolved against the fragment URL, not the page.
 * @returns {Promise<HTMLElement|null>} container holding the fragment sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  let base = '/content/nav.plain.html';
  if (!resp.ok) {
    resp = await fetch('/nav.plain.html');
    base = '/nav.plain.html';
  }
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  const baseUrl = new URL(base, window.location.href);
  container.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^([a-z]+:|\/)/i.test(src)) img.src = new URL(src, baseUrl).href;
    img.loading = 'eager';
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
 * Returns the text of a list item without the text of nested lists/paragraphs.
 * @param {Element} li list item
 * @returns {string}
 */
function ownText(li) {
  return [...li.childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds an icon + label link from a fragment link that contains an image.
 * @param {HTMLAnchorElement} a fragment link
 * @param {string} className class for the link
 * @returns {HTMLAnchorElement}
 */
function buildIconLink(a, className) {
  const link = el('a', className);
  link.href = a.getAttribute('href');
  const img = a.querySelector('img');
  if (img) {
    img.classList.add(`${className}-icon`);
    link.append(img);
  }
  const label = el('span', `${className}-label`);
  label.textContent = a.textContent.trim();
  link.append(label);
  return link;
}

/**
 * Closes every open dropdown, except an optional one.
 * @param {Element} nav nav element
 * @param {Element} [except] trigger to keep open
 */
function closeDropdowns(nav, except) {
  nav.querySelectorAll('.nav-drop-trigger[aria-expanded="true"]').forEach((trigger) => {
    if (trigger === except) return;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.closest('.nav-drop').classList.remove('is-open', 'is-pinned');
  });
}

/**
 * Opens or closes a dropdown.
 * @param {Element} nav nav element
 * @param {Element} trigger dropdown trigger
 * @param {boolean} open whether to open
 */
function setDropdown(nav, trigger, open) {
  if (open) closeDropdowns(nav, trigger);
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  const li = trigger.closest('.nav-drop');
  li.classList.toggle('is-open', open);
  if (!open) li.classList.remove('is-pinned');
}

/**
 * Opens or closes the search drawer.
 * @param {Element} nav nav element
 * @param {boolean} open whether to open
 */
function setSearch(nav, open) {
  const toggle = nav.querySelector('.nav-search-toggle');
  const panel = nav.querySelector('.nav-search');
  if (!toggle || !panel) return;
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
  if (open) {
    closeDropdowns(nav);
    panel.querySelector('input')?.focus({ preventScroll: true });
  }
}

/**
 * Opens or closes the mobile menu.
 * @param {Element} nav nav element
 * @param {boolean} [force] desired state
 */
function setMenu(nav, force) {
  const open = force ?? nav.getAttribute('aria-expanded') !== 'true';
  const hamburger = nav.querySelector('.nav-hamburger');
  if (isDesktop.matches) {
    nav.removeAttribute('aria-expanded');
    hamburger.setAttribute('aria-label', 'Open navigation');
    return;
  }
  nav.setAttribute('aria-expanded', open ? 'true' : 'false');
  hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (open) setSearch(nav, false);
  else closeDropdowns(nav);
}

/**
 * Builds the brand area (logo + FDIC statement images).
 * @param {Element} section fragment section
 * @returns {HTMLElement}
 */
function buildBrand(section) {
  const brand = el('div', 'nav-brand');
  const logoLink = section.querySelector('a');
  if (logoLink) {
    const a = el('a', 'nav-brand-logo');
    a.href = logoLink.getAttribute('href');
    const img = logoLink.querySelector('img');
    a.setAttribute('aria-label', img?.alt || 'Home');
    if (img) a.append(img);
    brand.append(a);
  }
  const statements = [...section.querySelectorAll('img')].filter((img) => !img.closest('a'));
  statements.forEach((img, i) => {
    img.classList.add('nav-brand-statement', i === 0 ? 'nav-brand-statement-desktop' : 'nav-brand-statement-mobile');
    brand.append(img);
  });
  return brand;
}

/**
 * Builds a dropdown panel from the nested content of a fragment list item.
 * @param {Element} li fragment list item
 * @param {string} label trigger label
 * @returns {HTMLElement}
 */
function buildDropdown(li, label) {
  const panel = el('div', 'nav-dropdown');
  const inner = el('div', 'nav-dropdown-inner');
  const back = el('button', 'nav-dropdown-back');
  back.type = 'button';
  back.textContent = label;
  inner.append(back);

  const body = el('div', 'nav-dropdown-body');
  const lists = [...li.querySelectorAll(':scope > ul')];
  const linkList = lists.find((ul) => !ul.querySelector('img')) || lists[0];
  if (linkList) {
    linkList.className = 'nav-dropdown-links';
    const items = [...linkList.children];
    items.forEach((item) => {
      if (item.querySelector('strong')) item.classList.add('nav-dropdown-featured');
    });
    const featured = items.filter((item) => item.classList.contains('nav-dropdown-featured'));
    if (featured.length) featured[featured.length - 1].classList.add('nav-dropdown-featured-last');
    body.append(linkList);
  }
  const quickList = lists.find((ul) => ul !== linkList);
  const quick = el('div', 'nav-dropdown-quick');
  if (quickList) {
    const eyebrow = li.querySelector(':scope > p');
    if (eyebrow) {
      eyebrow.className = 'nav-dropdown-eyebrow';
      quick.append(eyebrow);
    }
    quickList.className = 'nav-dropdown-quicklinks';
    quickList.querySelectorAll('img').forEach((img) => img.classList.add('nav-dropdown-quick-icon'));
    quick.append(quickList);
  }
  body.append(quick);
  inner.append(body);
  panel.append(inner);
  return panel;
}

/**
 * Builds the main navigation list (dropdown triggers + plain links + mobile-only utilities).
 * @param {Element} nav nav element
 * @param {Element} section fragment section with the main list
 * @param {Element} [utilitySection] fragment section with utility links
 * @returns {HTMLElement}
 */
function buildSections(nav, section, utilitySection) {
  const wrapper = el('div', 'nav-sections');
  wrapper.id = 'nav-sections';
  const list = el('ul', 'nav-sections-list');
  const source = section.querySelector('ul');
  if (!source) return wrapper;

  [...source.children].forEach((li) => {
    const item = el('li');
    const directLink = li.querySelector(':scope > a');
    if (directLink && !li.querySelector(':scope > ul')) {
      item.className = 'nav-item nav-link';
      const a = el('a', 'nav-link-anchor');
      a.href = directLink.getAttribute('href');
      a.textContent = directLink.textContent.trim();
      item.append(a);
      list.append(item);
      return;
    }
    const label = ownText(li);
    item.className = 'nav-item nav-drop';
    const trigger = el('button', 'nav-drop-trigger');
    trigger.type = 'button';
    trigger.textContent = label;
    trigger.setAttribute('aria-expanded', 'false');
    const panel = buildDropdown(li, label);
    item.append(trigger, panel);
    list.append(item);

    item.addEventListener('mouseenter', () => {
      if (isDesktop.matches) setDropdown(nav, trigger, true);
    });
    item.addEventListener('mouseleave', () => {
      if (isDesktop.matches) setDropdown(nav, trigger, false);
    });
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      if (isDesktop.matches) {
        // hover opens the panel; a click pins it open, a second click closes it
        if (open && item.classList.contains('is-pinned')) {
          setDropdown(nav, trigger, false);
        } else {
          setDropdown(nav, trigger, true);
          item.classList.add('is-pinned');
        }
      } else {
        setDropdown(nav, trigger, !open);
      }
    });
    panel.querySelector('.nav-dropdown-back').addEventListener('click', () => {
      setDropdown(nav, trigger, false);
      trigger.focus();
    });
  });

  // utility links (ATM / branch, language) are part of the menu list on mobile
  if (utilitySection) {
    const lastLink = list.querySelector(':scope > .nav-link:last-child');
    utilitySection.querySelectorAll('a').forEach((a) => {
      const item = el('li', 'nav-item nav-utility-item');
      item.append(buildIconLink(a.cloneNode(true), 'nav-utility-item-link'));
      if (lastLink) list.insertBefore(item, lastLink);
      else list.append(item);
    });
  }

  wrapper.append(list);
  return wrapper;
}

/**
 * Builds the search drawer (title, search form, quick actions, FAQs).
 * @param {Element} section fragment section
 * @returns {HTMLElement}
 */
function buildSearch(section) {
  const panel = el('div', 'nav-search');
  panel.id = 'nav-search';
  panel.hidden = true;

  const top = el('div', 'nav-search-top');
  const close = el('button', 'nav-search-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close search');
  top.append(close);
  const title = section.querySelector('h2');
  // the paragraph right after the title holds the search placeholder text
  const hint = title?.nextElementSibling?.tagName === 'P' ? title.nextElementSibling : null;
  const placeholder = hint ? hint.textContent.trim() : '';
  if (hint) hint.remove();
  if (title) {
    title.className = 'nav-search-title';
    top.append(title);
  }

  const form = el('form', 'nav-search-form');
  form.setAttribute('role', 'search');
  form.action = 'https://www.citi.com/';
  form.method = 'get';
  const input = el('input', 'nav-search-input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder || 'Search');
  input.autocomplete = 'off';
  const submit = el('button', 'nav-search-submit');
  submit.type = 'submit';
  submit.setAttribute('aria-label', 'Search');
  form.append(input, submit);
  top.append(form);
  panel.append(top);

  const body = el('div', 'nav-search-body');
  let group = null;
  let faq = null;
  [...section.children].forEach((child) => {
    if (child.tagName === 'H3') {
      group = el('div', 'nav-search-group');
      child.className = 'nav-search-heading';
      group.append(child);
      body.append(group);
      faq = null;
      return;
    }
    if (!group) return;
    if (child.tagName === 'H4') {
      faq = el('details', 'nav-search-faq');
      const summary = el('summary', 'nav-search-faq-question');
      summary.textContent = child.textContent.trim();
      const answer = el('div', 'nav-search-faq-answer');
      faq.append(summary, answer);
      group.append(faq);
      return;
    }
    if (faq) {
      faq.querySelector('.nav-search-faq-answer').append(child);
      return;
    }
    if (child.tagName === 'UL') child.className = 'nav-search-actions';
    group.append(child);
  });
  panel.append(body);
  return panel;
}

/**
 * Builds the tools area (search toggle, divider, sign on).
 * @param {Element} section fragment section
 * @returns {HTMLElement}
 */
function buildTools(section) {
  const tools = el('div', 'nav-tools');
  [...section.querySelectorAll('li')].forEach((li) => {
    const a = li.querySelector('a');
    if (a) {
      const link = el('a', 'nav-tools-link');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      tools.append(el('span', 'nav-tools-divider'), link);
    } else {
      const toggle = el('button', 'nav-search-toggle');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'nav-search');
      toggle.textContent = li.textContent.trim();
      tools.append(toggle);
    }
  });
  return tools;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;
  const sections = [...fragment.children].filter((c) => c.tagName === 'DIV');
  const [brandSection, utilitySection, mainSection, toolsSection, searchSection] = sections;

  const nav = el('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  // row 0: brand + utility
  const banner = el('div', 'nav-banner');
  if (brandSection) banner.append(buildBrand(brandSection));
  if (utilitySection) {
    const utility = el('div', 'nav-utility');
    const ul = el('ul', 'nav-utility-list');
    utilitySection.querySelectorAll('a').forEach((a) => {
      const li = el('li');
      li.append(buildIconLink(a.cloneNode(true), 'nav-utility-link'));
      ul.append(li);
    });
    utility.append(ul);
    banner.append(utility);
  }

  // row 1: hamburger, sections, tools
  const bar = el('div', 'nav-bar');
  const hamburger = el('button', 'nav-hamburger');
  hamburger.type = 'button';
  hamburger.setAttribute('aria-controls', 'nav-sections');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  bar.append(hamburger);
  if (mainSection) bar.append(buildSections(nav, mainSection, utilitySection));
  if (toolsSection) bar.append(buildTools(toolsSection));

  nav.append(banner, bar);
  if (searchSection) nav.append(buildSearch(searchSection));

  // like the source, the desktop header hides its sign-on link on pages that
  // already show a sign-on form (e.g. the homepage hero)
  if (document.querySelector('main input[type="password"]')) {
    bar.querySelector('.nav-tools')?.classList.add('nav-tools-page-signon');
  }

  hamburger.addEventListener('click', () => setMenu(nav));
  const searchToggle = nav.querySelector('.nav-search-toggle');
  searchToggle?.addEventListener('click', () => {
    const open = searchToggle.getAttribute('aria-expanded') !== 'true';
    if (open && !isDesktop.matches) setMenu(nav, false);
    setSearch(nav, open);
  });
  nav.querySelector('.nav-search-close')?.addEventListener('click', () => {
    setSearch(nav, false);
    searchToggle?.focus();
  });

  // close panels on escape and on outside clicks
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const openTrigger = nav.querySelector('.nav-drop-trigger[aria-expanded="true"]');
    if (openTrigger) {
      setDropdown(nav, openTrigger, false);
      openTrigger.focus();
    } else if (searchToggle?.getAttribute('aria-expanded') === 'true') {
      setSearch(nav, false);
      searchToggle.focus();
    } else if (nav.getAttribute('aria-expanded') === 'true') {
      setMenu(nav, false);
      hamburger.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && isDesktop.matches) closeDropdowns(nav);
  });

  // reset state when crossing the desktop/mobile breakpoint
  const onViewportChange = () => {
    closeDropdowns(nav);
    setSearch(nav, false);
    if (isDesktop.matches) setMenu(nav);
    else setMenu(nav, false);
  };
  isDesktop.addEventListener('change', onViewportChange);
  onViewportChange();

  const navWrapper = el('div', 'nav-wrapper');
  navWrapper.append(nav);
  block.append(navWrapper);
}
