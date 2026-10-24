// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Loads the nav fragment: /content first (local preview), then the site root (DA / EDS).
 * @returns {Promise<HTMLElement|null>} a container holding the fragment's sections
 */
async function loadNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = await resp.text();
  // relative image paths are relative to the fragment, not the page
  wrapper.querySelectorAll('img[src], source[srcset]').forEach((el) => {
    const attr = el.hasAttribute('src') ? 'src' : 'srcset';
    const value = el.getAttribute(attr);
    if (value && !/^([a-z]+:|\/)/i.test(value)) {
      const url = new URL(value, resp.url);
      el.setAttribute(attr, `${url.pathname}${url.search}`);
    }
  });
  // Document Authoring renders a list item that holds a nested list as <li><p>…</p><ul>:
  // unwrap those paragraphs so items look the same as in the local nav (<li><a>…</a><ul>)
  wrapper.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
  // menu icons are sized as <img> (local nav); DA delivers them as <picture>: keep the <img>
  wrapper.querySelectorAll('li picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (img) picture.replaceWith(img);
  });
  return wrapper;
}

/**
 * Moves an item's icon (an <img> that is a direct child of its <li>) to the start of its link.
 * @param {HTMLElement} li list item
 */
function placeIcon(li) {
  const icon = li.querySelector(':scope > img, :scope > picture');
  const link = li.querySelector(':scope > a, :scope > strong > a');
  if (!icon) return;
  icon.classList.add('nav-icon');
  if (icon.tagName === 'IMG') icon.setAttribute('aria-hidden', 'true');
  if (link) link.prepend(icon);
  else li.prepend(icon);
}

function closeAll(nav, except) {
  nav.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
    if (el !== except && !el.classList.contains('nav-hamburger')) el.setAttribute('aria-expanded', 'false');
  });
  const anyOpen = !!nav.querySelector('.nav-sections .nav-drop > [aria-expanded="true"]');
  nav.classList.toggle('panel-open', anyOpen);
}

function toggle(nav, trigger) {
  const open = trigger.getAttribute('aria-expanded') !== 'true';
  closeAll(nav, trigger);
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  nav.classList.toggle('panel-open', !!nav.querySelector('.nav-sections .nav-drop > [aria-expanded="true"]'));
}

/**
 * Builds the main nav list: top items, their mega panels (columns, groups, quick links).
 * @param {HTMLUListElement} list top-level list from the fragment
 * @param {HTMLElement} nav nav element (for toggling)
 */
function buildSections(list, nav) {
  list.classList.add('nav-sections-list', 'nav-list');
  [...list.children].forEach((item, index) => {
    item.classList.add('nav-item');
    const top = item.querySelector(':scope > a, :scope > strong > a');
    if (top) top.classList.add('nav-trigger');
    const panel = item.querySelector(':scope > ul');
    const strong = item.querySelector(':scope > strong');
    if (strong) {
      // an emphasised item (<strong><a>) keeps its styling but its link becomes a direct child
      item.classList.add('nav-item-emphasis');
      strong.replaceWith(...strong.childNodes);
    }
    if (!panel) return;
    item.classList.add('nav-drop');
    const link = item.querySelector(':scope > a');
    const id = `nav-panel-${index}`;
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', id);
    link.setAttribute('role', 'button');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggle(nav, link);
    });
    panel.id = id;
    panel.classList.add('nav-panel');
    [...panel.children].forEach((col) => {
      col.classList.add('nav-panel-col');
      const heading = col.querySelector(':scope > strong');
      if (heading) {
        col.classList.add('nav-panel-quick');
        heading.classList.add('nav-panel-heading');
      }
      const groups = col.querySelector(':scope > ul');
      if (!groups) return;
      groups.classList.add('nav-panel-groups');
      [...groups.children].forEach((group) => {
        group.classList.add(heading ? 'nav-quick-link' : 'nav-group');
        placeIcon(group);
        const sub = group.querySelector(':scope > ul');
        if (sub) sub.classList.add('nav-group-links');
      });
    });
  });
}

/**
 * Builds the tools: search (link + expandable search bar) and the login dropdown.
 * @param {HTMLUListElement} list tools list from the fragment
 * @param {HTMLElement} nav nav element
 * @returns {{ search: HTMLElement|null, login: HTMLElement|null }}
 */
function buildTools(list, nav) {
  const result = { search: null, login: null };
  [...list.children].forEach((item) => {
    const sub = item.querySelector(':scope > ul');
    const link = item.querySelector(':scope > a');
    if (!sub && link) {
      // search: the link opens a search bar; the form submits to the link's page
      placeIcon(item);
      item.classList.add('nav-search');
      const form = document.createElement('form');
      form.className = 'nav-search-form';
      form.action = link.href;
      form.method = 'get';
      form.setAttribute('role', 'search');
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.setAttribute('aria-label', link.textContent.trim());
      input.type = 'search';
      input.name = 'q';
      input.maxLength = 50;
      input.placeholder = `${link.textContent.trim()}...`;
      label.append(input);
      const submit = document.createElement('button');
      submit.type = 'submit';
      submit.textContent = link.textContent.trim();
      form.append(label, submit);
      const bar = document.createElement('div');
      bar.className = 'nav-search-bar';
      bar.id = 'nav-search-bar';
      bar.append(form);
      link.setAttribute('aria-expanded', 'false');
      link.setAttribute('aria-controls', bar.id);
      link.setAttribute('role', 'button');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const open = link.getAttribute('aria-expanded') !== 'true';
        link.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) input.focus();
      });
      result.search = item;
      result.searchBar = bar;
    } else if (sub) {
      // login: the item's own text becomes a toggle button over its list
      item.classList.add('nav-login', 'nav-drop');
      const icon = item.querySelector(':scope > img, :scope > picture');
      // a link acting as a button, as on the source site
      const button = document.createElement('a');
      button.href = '#';
      button.setAttribute('role', 'button');
      button.className = 'nav-login-button';
      const text = [...item.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join('').trim();
      [...item.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).forEach((n) => n.remove());
      if (icon) {
        icon.classList.add('nav-icon');
        icon.setAttribute('aria-hidden', 'true');
        button.append(icon);
      }
      const label = document.createElement('span');
      label.className = 'nav-login-label';
      label.textContent = text;
      button.append(label);
      button.setAttribute('aria-expanded', 'false');
      sub.id = 'nav-login-panel';
      sub.classList.add('nav-login-panel');
      button.setAttribute('aria-controls', sub.id);
      button.addEventListener('click', (e) => {
        e.preventDefault();
        toggle(nav, button);
      });
      item.prepend(button);
      sub.querySelectorAll(':scope > li > strong').forEach((s) => s.parentElement.classList.add('nav-login-heading'));
      result.login = item;
    }
  });
  return result;
}

/**
 * Adds a Back row to each panel; on mobile panels slide in over the menu and Back closes them.
 * @param {HTMLElement} nav nav element
 */
function addBackButtons(nav) {
  nav.querySelectorAll('.nav-panel, .nav-login-panel').forEach((panel) => {
    const li = document.createElement('li');
    li.className = 'nav-panel-back';
    const back = document.createElement('button');
    back.type = 'button';
    back.textContent = 'Back';
    back.addEventListener('click', () => {
      const trigger = nav.querySelector(`[aria-controls="${panel.id}"]`);
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
      closeAll(nav);
    });
    li.append(back);
    panel.prepend(li);
  });
}

function toggleMenu(nav, hamburger, force) {
  const open = force ?? hamburger.getAttribute('aria-expanded') !== 'true';
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('menu-open', open);
  document.body.style.overflowY = open && !isDesktop.matches ? 'hidden' : '';
  if (!open) closeAll(nav);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await loadNav();
  if (!fragment) return;
  const [brandSection, sectionsSection, toolsSection, mobileSection] = [...fragment.children];
  // mobile-only labels: the open menu's title, then the login row's label
  const [menuTitle, mobileLoginLabel] = mobileSection
    ? [...mobileSection.querySelectorAll('p')].map((p) => p.textContent.trim()) : [];

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  const top = document.createElement('div');
  top.className = 'nav-top';
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) brand.append(...brandSection.childNodes);
  top.append(brand);

  const bar = document.createElement('div');
  bar.className = 'nav-bar';
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  const sectionsList = sectionsSection && sectionsSection.querySelector(':scope > ul');
  if (sectionsList) {
    buildSections(sectionsList, nav);
    sections.append(sectionsList);
  }
  bar.append(sections);

  const toolsList = toolsSection && toolsSection.querySelector(':scope > ul');
  if (toolsList) {
    const { search, searchBar, login } = buildTools(toolsList, nav);
    const tools = document.createElement('div');
    tools.className = 'nav-tools';
    if (search) {
      const searchList = document.createElement('ul');
      searchList.className = 'nav-tools-list';
      searchList.append(search);
      tools.append(searchList);
    }
    top.append(tools);
    if (searchBar) bar.append(searchBar);
    if (login && mobileLoginLabel) {
      const mobileLabel = document.createElement('span');
      mobileLabel.className = 'nav-login-label-mobile';
      mobileLabel.textContent = mobileLoginLabel;
      login.querySelector('.nav-login-button .nav-login-label').after(mobileLabel);
    }
    if (login) {
      const loginList = document.createElement('ul');
      loginList.className = 'nav-login-list';
      loginList.append(login);
      bar.append(loginList);
    }
  }

  // hamburger (mobile only)
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav-bar');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = `<span class="nav-hamburger-icon"></span><span class="nav-hamburger-label">${menuTitle || 'Menu'}</span>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, hamburger));
  top.append(hamburger);
  bar.id = 'nav-bar';

  // header of the open mobile menu: title and close button
  const drawerHeader = document.createElement('div');
  drawerHeader.className = 'nav-drawer-header';
  const drawerTitle = document.createElement('span');
  drawerTitle.className = 'nav-drawer-title';
  drawerTitle.textContent = menuTitle || 'Menu';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-drawer-close';
  close.setAttribute('aria-label', 'Close Mobile Menu');
  close.innerHTML = '<span class="nav-visually-hidden">Close Mobile Menu</span>';
  close.addEventListener('click', () => {
    toggleMenu(nav, hamburger, false);
    hamburger.focus();
  });
  drawerHeader.append(drawerTitle, close);
  bar.prepend(drawerHeader);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('click', () => closeAll(nav));

  nav.append(top, bar, overlay);
  addBackButtons(nav);

  // close on outside click / Escape
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAll(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    const expanded = nav.querySelector('.nav-drop [aria-expanded="true"]');
    closeAll(nav);
    if (expanded) expanded.focus();
    else if (!isDesktop.matches && nav.classList.contains('menu-open')) {
      toggleMenu(nav, hamburger, false);
      hamburger.focus();
    }
  });
  // switching between mobile and desktop resets the menu and any open panel
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, hamburger, false);
    closeAll(nav);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.textContent = '';
  block.append(navWrapper);
}
