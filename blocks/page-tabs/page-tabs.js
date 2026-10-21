/*
 * Page Tabs block
 * One row per tab: Tab label | panel content (optional).
 *
 * - Link tabs: a row whose only content is a link (label cell is a link and there is no
 *   panel cell) navigates to that page. The tab matching the current path is marked active.
 *   E.g. "Purchase Rates" -> /mortgage/purchase-rates,
 *   "Refinance Rates" -> /mortgage/refinance-rates.
 * - Panel tabs: the second cell is the panel. When it holds only a link to a same-site path
 *   (e.g. /fragments/rates/purchase), the panel is loaded as a fragment so it can contain
 *   other blocks. Otherwise the cell content renders inline.
 */
import { loadFragment } from '../fragment/fragment.js';

let uid = 0;

function normalizePath(path) {
  return path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
}

function fragmentPath(cell) {
  if (!cell) return null;
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  if (cell.textContent.trim() !== links[0].textContent.trim()) return null;
  if (cell.querySelector('picture, img')) return null;
  const url = new URL(links[0].getAttribute('href'), window.location.href);
  if (url.origin !== window.location.origin) return null;
  return normalizePath(url.pathname);
}

function decorateLinkTabs(block, tabs) {
  const nav = document.createElement('nav');
  nav.className = 'page-tabs-nav';
  nav.setAttribute('aria-label', 'Page tabs');
  const list = document.createElement('ul');
  list.className = 'page-tabs-list';
  const here = normalizePath(window.location.pathname);

  tabs.forEach(({ label }) => {
    const li = document.createElement('li');
    li.className = 'page-tabs-tab';
    const link = label.querySelector('a[href]');
    if (link) {
      const url = new URL(link.getAttribute('href'), window.location.href);
      const target = normalizePath(url.pathname);
      // suffix match so prefixed preview paths (e.g. /content/mortgage/...) still match
      const active = url.origin === window.location.origin
        && (target === here || (target !== '/' && here.endsWith(target)));
      link.className = 'page-tabs-link';
      if (active) {
        li.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
      li.append(link);
    } else {
      li.textContent = label.textContent.trim();
    }
    list.append(li);
  });

  // no match for the current page: mark the first tab active
  if (!list.querySelector('.active') && list.firstElementChild) {
    list.firstElementChild.classList.add('active');
  }

  nav.append(list);
  block.replaceChildren(nav);
}

async function fillPanel(panel, source) {
  if (panel.dataset.loaded) return;
  panel.dataset.loaded = 'true';
  const path = fragmentPath(source);
  if (path) {
    const fragment = await loadFragment(path);
    if (fragment) {
      panel.replaceChildren(...fragment.childNodes);
      return;
    }
    // fragment missing: fall back to the authored link
  }
  if (source) panel.append(...source.childNodes);
}

function decoratePanelTabs(block, tabs) {
  uid += 1;
  const prefix = `page-tabs-${uid}`;
  const tablist = document.createElement('div');
  tablist.className = 'page-tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];
  const buttons = [];

  tabs.forEach(({ label, panel: source }, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-tabs-tab';
    button.id = `${prefix}-tab-${i}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${prefix}-panel-${i}`);
    button.setAttribute('aria-selected', String(i === 0));
    button.tabIndex = i === 0 ? 0 : -1;
    button.textContent = label.textContent.trim();
    tablist.append(button);
    buttons.push(button);

    const panel = document.createElement('div');
    panel.className = 'page-tabs-panel';
    panel.id = `${prefix}-panel-${i}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.tabIndex = 0;
    panel.hidden = i !== 0;
    panel.source = source;
    panels.push(panel);
  });

  const select = (index, focus) => {
    buttons.forEach((b, i) => {
      const on = i === index;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) buttons[index].focus();
    fillPanel(panels[index], panels[index].source);
  };

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i, false));
    button.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % buttons.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = buttons.length - 1;
      if (next !== null) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  block.replaceChildren(tablist, ...panels);
  return fillPanel(panels[0], panels[0].source);
}

export default async function decorate(block) {
  const tabs = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      const label = cells[0];
      const panel = cells.slice(1).find((c) => c.textContent.trim() || c.querySelector('picture, img'));
      return { label, panel };
    })
    .filter(({ label }) => label && label.textContent.trim());

  if (!tabs.length) {
    block.replaceChildren();
    return;
  }

  const hasPanels = tabs.some(({ panel }) => panel);
  if (hasPanels) await decoratePanelTabs(block, tabs);
  else decorateLinkTabs(block, tabs);
}
