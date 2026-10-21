/* eslint-disable */
/* global WebImporter */

/**
 * page-tabs parser (citi.com rates tabs: .cds-rates-tabs-container > .rates-tab).
 *
 * Block table (see blocks/page-tabs/README.md): one row per tab, Label | optional panel.
 *
 * Link tabs (no panel): the source tabs are JS-only (href="javascript:void(0)") and
 * switch between sibling pages. The label becomes a link:
 *   - a real href is kept as-is;
 *   - the active tab (marked by .rates-table-tab-label / .active / aria-selected)
 *     links to the current page (params.originalURL);
 *   - other tabs link to a sibling page derived from the label
 *     ("Refinance Rates" on /mortgage/purchase-rates -> /mortgage/refinance-rates).
 *
 * Panel tabs: when the source has tab panels ([role=tabpanel] / .tab-pane), rich text
 * stays inline; a panel holding other blocks (grids, columns, accordions, tables of
 * cards) is pushed to params.fragments and replaced by a link to the fragment.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function isRealHref(href) {
  return !!href && !href.startsWith('#') && !/^javascript:/i.test(href);
}

function slugify(s) {
  return (s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim()
    .replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function pagePath(params) {
  try {
    if (params && params.originalURL) return new URL(params.originalURL).pathname.replace(/\.html$/, '').replace(/\/$/, '');
  } catch (e) { /* ignore */ }
  return '';
}

function cleanPanel(panel) {
  const clone = panel.cloneNode(true);
  clone.querySelectorAll('script, style, svg, cds-icon, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, input, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    if (!isRealHref((a.getAttribute('href') || '').trim())) a.replaceWith(...a.childNodes);
  });
  return clone;
}

function holdsBlocks(panel) {
  return !!panel.querySelector('[class*="card"], [class*="grid"], [class*="accordion"], [class*="column"], [class*="tile"], [role="tablist"], cds-row, citi-row');
}

export default function parse(element, { document, params }) {
  const cells = [];
  const base = pagePath(params);
  const dir = base.split('/').slice(0, -1).join('/');

  let tabs = [...element.querySelectorAll('.rates-tab')];
  if (!tabs.length) tabs = [...element.querySelectorAll('[role="tab"]')];
  if (!tabs.length) tabs = [...element.querySelectorAll('li')];
  if (!tabs.length) tabs = [...element.querySelectorAll('a, button')];
  tabs = tabs.filter((t, i) => textOf(t) && !tabs.some((o, j) => j !== i && o.contains(t)));

  const panels = [...element.querySelectorAll('[role="tabpanel"], .tab-pane')]
    .filter((p, i, all) => !all.some((o) => o !== p && o.contains(p)));

  tabs.forEach((tab, i) => {
    const control = tab.matches('a, button') ? tab : (tab.querySelector('a, button') || tab);
    const label = textOf(control) || textOf(tab);
    if (!label) return;

    // panel: by aria-controls, else by index
    const controls = control.getAttribute('aria-controls');
    const panel = (controls && panels.find((p) => p.id === controls)) || panels[i] || null;

    const href = control.tagName === 'A' ? (control.getAttribute('href') || '').trim() : '';
    const active = !!tab.querySelector('.rates-table-tab-label')
      || /\bactive\b|\bselected\b/.test(`${tab.className || ''} ${control.className || ''}`)
      || control.getAttribute('aria-selected') === 'true';

    if (panel && textOf(panel)) {
      const content = cleanPanel(panel);
      if (holdsBlocks(panel) && params && Array.isArray(params.fragments)) {
        const path = `/fragments/${(base || '/page-tabs').replace(/^\//, '')}/${slugify(label)}`;
        params.fragments.push({ element: content, path });
        const a = document.createElement('a');
        a.setAttribute('href', path);
        a.textContent = path;
        cells.push([label, [a]]);
      } else {
        cells.push([label, [...content.childNodes]]);
      }
      return;
    }

    // link tab
    let target = isRealHref(href) ? href : '';
    if (!target && active && base) target = base;
    if (!target && dir !== undefined && base) target = `${dir}/${slugify(label)}`;
    if (target) {
      const a = document.createElement('a');
      a.setAttribute('href', target);
      a.textContent = label;
      cells.push([[a]]);
    } else {
      cells.push([label]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'page-tabs', cells });
  element.replaceWith(block);
}
