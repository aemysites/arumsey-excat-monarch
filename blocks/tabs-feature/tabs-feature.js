import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let blockCount = 0;

/**
 * Returns the fragment path when a panel cell holds only a fragment link
 * (a lone link pointing at /fragments/..., or a link whose text is its own URL).
 * @param {Element} cell panel cell
 * @returns {string|null} same-origin path or null
 */
function getFragmentPath(cell) {
  if (!cell) return null;
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const link = links[0];
  if (cell.textContent.trim() !== link.textContent.trim()) return null;
  if (cell.querySelector('picture, img, h1, h2, h3, h4, h5, h6')) return null;
  let url;
  try {
    url = new URL(link.getAttribute('href'), window.location.href);
  } catch {
    return null;
  }
  const isFragmentPath = url.pathname.includes('/fragments/');
  const textIsUrl = link.textContent.trim() === link.getAttribute('href').trim();
  const sameSite = url.origin === window.location.origin
    || link.getAttribute('href').startsWith('/');
  if (!sameSite || !(isFragmentPath || textIsUrl)) return null;
  return url.pathname.replace(/(\.plain)?\.html$/, '');
}

function selectTab(block, tablist, button) {
  tablist.querySelectorAll('[role=tab]').forEach((btn) => {
    const selected = btn === button;
    btn.setAttribute('aria-selected', selected);
    btn.tabIndex = selected ? 0 : -1;
  });
  block.querySelectorAll(':scope > [role=tabpanel]').forEach((panel) => {
    panel.setAttribute('aria-hidden', panel.id !== button.getAttribute('aria-controls'));
  });
}

export default async function decorate(block) {
  blockCount += 1;
  const prefix = `tabs-feature-${blockCount}`;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-feature-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.children.length > 0);
  const fragmentLoads = [];
  const usedIds = new Set();

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    // panel content = every cell after the label (authors may add extra cells)
    const panelCells = cells.slice(1);

    let id = toClassName(labelCell.textContent) || `tab-${i + 1}`;
    while (usedIds.has(id)) id = `${id}-${i + 1}`;
    usedIds.add(id);
    const tabId = `${prefix}-tab-${id}`;
    const panelId = `${prefix}-panel-${id}`;

    // tab button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-feature-tab';
    button.id = tabId;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', i === 0);
    button.tabIndex = i === 0 ? 0 : -1;
    const icon = labelCell.querySelector('picture, img, .icon');
    if (icon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'tabs-feature-tab-icon';
      iconWrap.append(icon.closest('picture') || icon);
      button.append(iconWrap);
    }
    const label = document.createElement('span');
    label.className = 'tabs-feature-tab-label';
    label.textContent = labelCell.textContent.trim();
    if (!label.textContent && !icon) label.textContent = `Tab ${i + 1}`;
    button.append(label);
    button.addEventListener('click', () => selectTab(block, tablist, button));
    tablist.append(button);

    // tab panel
    const panel = document.createElement('div');
    panel.className = 'tabs-feature-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('aria-hidden', i !== 0);
    panel.tabIndex = 0;

    const fragmentPath = panelCells.length === 1 ? getFragmentPath(panelCells[0]) : null;
    if (fragmentPath) {
      panel.classList.add('tabs-feature-panel-fragment');
      fragmentLoads.push(loadFragment(fragmentPath).then((fragment) => {
        if (!fragment) return;
        panel.replaceChildren(...fragment.childNodes);
      }).catch(() => {
        // keep the authored link as a fallback
      }));
      panel.append(...panelCells[0].childNodes);
    } else {
      panelCells.forEach((cell) => panel.append(...cell.childNodes));
    }

    row.replaceWith(panel);
  });

  // drop empty rows that were filtered out
  [...block.children].forEach((child) => {
    if (!child.matches('[role=tabpanel]')) child.remove();
  });

  // keyboard navigation (roving tabindex)
  tablist.addEventListener('keydown', (e) => {
    const tabs = [...tablist.querySelectorAll('[role=tab]')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    tabs[next].focus();
    selectTab(block, tablist, tabs[next]);
  });

  block.prepend(tablist);
  await Promise.all(fragmentLoads);
}
