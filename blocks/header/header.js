const isDesktop = window.matchMedia('(width >= 900px)');

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>',
};

/**
 * Fetches the nav fragment: /content first (local preview), then the site root (DA/EDS).
 * @returns {Promise<Element|null>} wrapper holding the fragment's sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = await resp.text();
  // image paths in the fragment are relative to the fragment, not to the page
  wrapper.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return wrapper;
}

function iconButton(className, label, icon) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.innerHTML = icon;
  return button;
}

/**
 * Closes every open dropdown panel except the one given.
 * @param {Element} nav the nav element
 * @param {Element} [keep] the item to leave open
 */
function closePanels(nav, keep) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((item) => {
    if (item === keep) return;
    item.setAttribute('aria-expanded', 'false');
    item.querySelector(':scope > .nav-drop-trigger')?.setAttribute('aria-expanded', 'false');
  });
}

function setPanel(nav, item, open) {
  if (open) closePanels(nav, item);
  item.setAttribute('aria-expanded', open ? 'true' : 'false');
  item.querySelector(':scope > .nav-drop-trigger').setAttribute('aria-expanded', open ? 'true' : 'false');
}

/**
 * Turns a fragment list item holding a label paragraph, a heading, a "view all" link and a list
 * into a dropdown: a trigger button plus a panel (title row + body).
 * @param {Element} li the nav item
 */
function buildDropdown(li) {
  const label = li.querySelector(':scope > p');
  const heading = li.querySelector(':scope > h2, :scope > h3');
  const viewAll = [...li.querySelectorAll(':scope > p')].find((p) => p !== label && p.querySelector('a'));
  const list = li.querySelector(':scope > ul');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav-drop-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `<span>${label.textContent.trim()}</span>${ICONS.chevron}`;

  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  const title = document.createElement('div');
  title.className = 'nav-panel-title';
  if (heading) title.append(heading);
  if (viewAll) {
    viewAll.classList.add('nav-panel-more');
    title.append(' ', viewAll);
  }
  const body = document.createElement('div');
  body.className = 'nav-panel-body';
  if (list) {
    const isCards = list.querySelector(':scope > li > p > a > img, :scope > li > p > img');
    if (isCards) {
      list.classList.add('nav-cards');
      list.querySelectorAll(':scope > li').forEach((card) => {
        card.classList.add('nav-card');
        const parts = [...card.children];
        const wrap = (className, nodes) => {
          const div = document.createElement('div');
          div.className = className;
          div.append(...nodes);
          return div;
        };
        const imageP = parts.find((p) => p.querySelector('img'));
        const flag = parts.find((p) => p.querySelector(':scope > em'));
        flag?.classList.add('nav-card-flag');
        const more = parts[parts.length - 1]?.querySelector('a') && !parts[parts.length - 1].querySelector('img')
          ? parts[parts.length - 1] : null;
        const date = parts.find((p) => /^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(p.textContent.trim()));
        date?.classList.add('nav-card-date');
        const text = parts.filter((p) => ![imageP, flag, more].includes(p));
        card.textContent = '';
        if (imageP) card.append(wrap('nav-card-image', [imageP, ...(flag ? [flag] : [])]));
        const cardBody = wrap('nav-card-body', [wrap('nav-card-text', text)]);
        if (more) cardBody.append(wrap('nav-card-more', [more]));
        card.append(cardBody);
      });
      body.append(list);
    } else {
      // links fill up to three columns top to bottom, at least four per column, as on the source
      const links = [...list.children];
      const perColumn = Math.max(4, Math.ceil(links.length / 3));
      const columns = document.createElement('div');
      columns.className = 'nav-columns';
      for (let i = 0; i < links.length; i += perColumn) {
        const column = document.createElement('div');
        column.className = 'nav-column';
        const ul = document.createElement('ul');
        ul.className = 'nav-links';
        ul.append(...links.slice(i, i + perColumn));
        column.append(ul);
        columns.append(column);
      }
      body.append(columns);
    }
  }
  panel.append(title, body);

  li.textContent = '';
  li.classList.add('nav-drop');
  li.setAttribute('aria-expanded', 'false');
  li.append(trigger, panel);
  return { trigger, panel };
}

/**
 * Builds the search item from the fragment's search section: a toggle in the nav list and a panel
 * holding the search form and the quick links.
 * @param {Element} section the search section
 */
function buildSearch(section) {
  const label = section.querySelector('p')?.textContent.trim() || 'Search';
  const li = document.createElement('li');
  li.className = 'nav-drop nav-search';
  li.setAttribute('aria-expanded', 'false');

  const trigger = iconButton('nav-drop-trigger', label, `<span>${label}</span>${ICONS.search}${ICONS.chevron}`);
  trigger.setAttribute('aria-expanded', 'false');

  const panel = document.createElement('div');
  panel.className = 'nav-panel nav-search-panel';
  const close = iconButton('nav-search-close', 'Close search', ICONS.close);
  const form = document.createElement('form');
  form.action = '/en/search';
  form.method = 'get';
  form.setAttribute('role', 'search');
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = label;
  input.setAttribute('aria-label', label);
  const submit = iconButton('nav-search-submit', label, ICONS.search);
  submit.type = 'submit';
  form.append(input, submit);
  const quick = section.querySelector('ul');
  if (quick) quick.classList.add('nav-search-links');
  panel.append(close, form);
  if (quick) panel.append(quick);
  li.append(trigger, panel);
  return {
    li, trigger, close, input,
  };
}

function toggleMenu(nav, open) {
  const expanded = open ?? nav.getAttribute('aria-expanded') !== 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const hamburger = nav.querySelector('.nav-hamburger');
  hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  hamburger.innerHTML = expanded ? ICONS.close : ICONS.menu;
  document.body.style.overflowY = expanded && !isDesktop.matches ? 'hidden' : '';
  if (!expanded) closePanels(nav);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const [brandSection, toolsSection, sectionsSection, searchSection] = [...fragment.children];
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');
  nav.setAttribute('aria-expanded', 'false');

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) brand.append(...brandSection.childNodes);

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (toolsSection) tools.append(...toolsSection.childNodes);

  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  const list = sectionsSection?.querySelector(':scope > ul') || document.createElement('ul');
  list.classList.add('nav-list');
  sections.append(list);

  const utility = document.createElement('div');
  utility.className = 'nav-utility';
  utility.append(brand, tools);

  const hamburger = iconButton('nav-hamburger', 'Open navigation', ICONS.menu);
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.addEventListener('click', () => toggleMenu(nav));

  [...list.children].forEach((li) => {
    if (!li.querySelector(':scope > ul')) {
      li.classList.add('nav-link');
      return;
    }
    const { trigger, panel } = buildDropdown(li);
    trigger.addEventListener('click', () => setPanel(nav, li, li.getAttribute('aria-expanded') !== 'true'));
    li.addEventListener('mouseenter', () => { if (isDesktop.matches) setPanel(nav, li, true); });
    li.addEventListener('mouseleave', () => { if (isDesktop.matches) setPanel(nav, li, false); });
    panel.addEventListener('click', (e) => e.stopPropagation());
  });

  if (searchSection) {
    const search = buildSearch(searchSection);
    list.append(search.li);
    search.trigger.addEventListener('click', () => {
      const open = search.li.getAttribute('aria-expanded') !== 'true';
      setPanel(nav, search.li, open);
      if (open) search.input.focus();
    });
    search.close.addEventListener('click', () => setPanel(nav, search.li, false));
  }

  // mobile: utility links sit under the nav list
  const mobileTools = tools.querySelector('ul')?.cloneNode(true);
  if (mobileTools) {
    mobileTools.className = 'nav-tools-mobile';
    sections.append(mobileTools);
  }

  nav.append(utility, hamburger, sections);
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (nav.querySelector('.nav-drop[aria-expanded="true"]')) closePanels(nav);
    else if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, false);
  });
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) closePanels(nav);
  });
  isDesktop.addEventListener('change', () => {
    closePanels(nav);
    toggleMenu(nav, false);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
}
