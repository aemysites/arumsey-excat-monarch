/*
 * Tabs Pill block
 * One row per tab: cell 1 = tab label, cell 2 = panel content.
 * Blocks cannot nest, so a panel whose content is only a link to a fragment
 * (e.g. /fragments/...) is replaced with that fragment's content.
 */
import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let instance = 0;

/* return the fragment path when the cell holds only a same-site link */
function getFragmentPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const link = links[0];
  if (cell.textContent.trim() !== link.textContent.trim()) return null;
  if (cell.querySelector('img, picture')) return null;
  const url = new URL(link.getAttribute('href'), window.location.href);
  if (url.origin !== window.location.origin && !/\.aem\.(page|live)$/.test(url.hostname)) {
    return null;
  }
  if (!url.pathname.includes('/fragments/')) return null;
  return url.pathname.replace(/\.(plain\.)?html$/, '');
}

async function fillPanel(panel, cell) {
  const path = cell ? getFragmentPath(cell) : null;
  if (path) {
    const fragment = await loadFragment(path);
    if (fragment) {
      const sections = [...fragment.querySelectorAll(':scope > .section')];
      if (sections.length) {
        sections.forEach((section) => {
          section.classList.add('tabs-pill-fragment');
          panel.append(section);
        });
      } else {
        panel.append(...fragment.childNodes);
      }
      return;
    }
  }
  if (cell) panel.append(...cell.childNodes);
}

export default async function decorate(block) {
  instance += 1;
  const prefix = `tabs-pill-${instance}`;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-pill-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.firstElementChild
    && row.firstElementChild.textContent.trim());
  const panels = [];
  const buttons = [];
  const loads = [];

  rows.forEach((row, i) => {
    const [label, content] = row.children;
    const slug = toClassName(label.textContent) || `tab-${i + 1}`;
    const tabId = `${prefix}-tab-${slug}-${i}`;
    const panelId = `${prefix}-panel-${slug}-${i}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-pill-tab';
    button.id = tabId;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.tabIndex = i === 0 ? 0 : -1;
    const only = label.children.length === 1 ? label.firstElementChild : null;
    const source = only && only.tagName === 'P' ? only : label;
    button.append(...source.childNodes);

    const panel = document.createElement('div');
    panel.className = 'tabs-pill-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.tabIndex = 0;
    panel.hidden = i !== 0;
    loads.push(fillPanel(panel, content));

    tablist.append(button);
    buttons.push(button);
    panels.push(panel);
  });

  const select = (index, focus = false) => {
    buttons.forEach((btn, i) => {
      const active = i === index;
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      btn.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) buttons[index].focus();
  };

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', (e) => {
      const last = buttons.length - 1;
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next === null) return;
      e.preventDefault();
      select(next, true);
    });
  });

  const panelWrap = document.createElement('div');
  panelWrap.className = 'tabs-pill-panels';
  panelWrap.append(...panels);

  block.replaceChildren(tablist, panelWrap);
  await Promise.all(loads);
}
