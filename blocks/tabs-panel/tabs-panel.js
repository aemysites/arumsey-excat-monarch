/*
 * Tabs Panel
 * Tab strip over a panel. One row per tab: label cell | panel cell.
 * A panel cell that holds only a link to a /fragments/ path is loaded from that fragment
 * (when the tab is first shown), so panels can contain other blocks (e.g. accordions).
 * `steps` numbers the heading-led groups inside each panel.
 */
import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let tabsId = 0;

function getFragmentPath(cell) {
  const links = [...cell.querySelectorAll('a[href]')];
  if (links.length !== 1 || cell.querySelector('picture, img, ul, ol, table')) return null;
  if (cell.textContent.trim() !== links[0].textContent.trim()) return null;
  try {
    const url = new URL(links[0].href, window.location.href);
    if (!url.pathname.includes('/fragments/')) return null;
    return url.pathname.replace(/(\.plain)?\.html$/, '');
  } catch {
    return null;
  }
}

function groupSteps(panel) {
  const headings = [...panel.children].filter((el) => /^H[1-6]$/.test(el.tagName));
  if (!headings.length) return;
  const level = Math.min(...headings.map((h) => Number(h.tagName[1])));
  let step = null;
  let badgeOnly = false;
  // a picture-only paragraph right before a step heading is that step's badge
  const isBadge = (el) => el.tagName === 'P' && el.querySelector('picture')
    && !el.textContent.trim() && el.nextElementSibling?.tagName === `H${level}`;
  [...panel.children].forEach((el) => {
    const badge = isBadge(el);
    if (badge || (el.tagName === `H${level}` && !badgeOnly)) {
      step = document.createElement('div');
      step.className = 'tabs-panel-step';
      el.before(step);
    }
    badgeOnly = badge;
    if (step) step.append(el);
  });
}

async function loadPanelFragment(panel, isSteps) {
  const path = panel.dataset.fragment;
  if (!path) return;
  delete panel.dataset.fragment;
  const fragment = await loadFragment(path);
  if (!fragment) {
    panel.append(...(panel.fragmentFallback || []));
    return;
  }
  const sections = fragment.querySelectorAll(':scope > .section');
  // unwrap default content so panel children are the authored elements (steps, CSS)
  const unwrap = (node) => (node.classList?.contains('default-content-wrapper') ? [...node.childNodes] : [node]);
  if (sections.length) {
    sections.forEach((section) => panel.append(...[...section.childNodes].flatMap(unwrap)));
  } else panel.append(...fragment.childNodes);
  if (isSteps) groupSteps(panel);
}

export default async function decorate(block) {
  tabsId += 1;
  const isSteps = block.classList.contains('steps');
  const tablist = document.createElement('div');
  tablist.className = 'tabs-panel-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.textContent.trim() || row.querySelector('picture, img'));
  const panels = [];
  const buttons = [];
  const usedIds = new Set();

  rows.forEach((row, i) => {
    const [labelCell, ...contentCells] = [...row.children];
    let slug = `${toClassName(labelCell.textContent) || 'tab'}`;
    while (usedIds.has(slug)) slug = `${slug}-${i}`;
    usedIds.add(slug);
    const id = `tabs-panel-${tabsId}-${slug}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-panel-panel';
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${id}-tab`);
    panel.tabIndex = 0;
    contentCells.forEach((cell) => panel.append(...cell.childNodes));

    const path = getFragmentPath(panel);
    if (path) {
      panel.fragmentFallback = [...panel.childNodes];
      panel.replaceChildren();
      panel.dataset.fragment = path;
    } else if (isSteps) {
      groupSteps(panel);
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-panel-tab';
    button.id = `${id}-tab`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    const onlyChild = labelCell.children.length === 1 ? labelCell.firstElementChild : null;
    button.append(...(onlyChild && onlyChild.tagName === 'P' ? onlyChild : labelCell).childNodes);

    panels.push(panel);
    buttons.push(button);
    tablist.append(button);
  });

  const select = (index, focus = false) => {
    buttons.forEach((button, i) => {
      const selected = i === index;
      button.setAttribute('aria-selected', selected);
      button.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (focus) buttons[index].focus();
    loadPanelFragment(panels[index], isSteps);
  };

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') target = (i + 1) % buttons.length;
      else if (e.key === 'ArrowLeft') target = (i - 1 + buttons.length) % buttons.length;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = buttons.length - 1;
      if (target === null) return;
      e.preventDefault();
      select(target, true);
    });
  });

  block.replaceChildren(tablist, ...panels);
  if (buttons.length) select(0);
}
