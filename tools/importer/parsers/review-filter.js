/* eslint-disable */
/* global WebImporter */

/**
 * Parser: review-filter
 * Source: div#review-form-selector (two chained selects: review type -> product,
 *   plus a Submit input), usually inside an experience fragment.
 * Layout (blocks/review-filter/README.md): optional keyed rows
 *   (Type label | placeholder, Filter label | placeholder, Submit | label), then
 *   one row per review type: type name | list of product links.
 * Only the currently selected type has its product options in the DOM (the rest
 * are loaded by JS), so other types get an empty product list.
 * Variant: catalog lookup, falling back to `dark` on the reviews hub (no type preselected).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/reviews/": [["#container-d76e475a04 > div.xf-content-height", "dark"]],
  "/reviews/basic-tax-software-reviews/": [["#container-e8ac0db58e > div.xf-content-height", null]],
  "/reviews/deluxe-online-tax-filing-reviews/": [["#container-6a4169bc40 > div.xf-content-height", null]],
  "/reviews/deluxe-tax-software-reviews/": [["#container-fb6a562fc5 > div.xf-content-height", null]],
  "/reviews/free-online-tax-filing-reviews/": [["#container-e065c7613e > div.xf-content-height", null]],
  "/reviews/online-filing-reviews/": [["#container-1a46e70555 > div.xf-content-height", null]],
  "/reviews/premium-online-tax-filing-reviews/": [["#container-6feec6ed8a > div.xf-content-height", null]],
  "/reviews/premium-small-business-tax-software-reviews/": [["#container-a9a561172e > div.xf-content-height", null]],
  "/reviews/premium-tax-software-reviews/": [["#container-908a641099 > div.xf-content-height", null]],
  "/reviews/software-filing-reviews/": [["#container-cf06b8eb4d > div.xf-content-height", null]],
};

function pagePath(params) {
  try {
    let p = new URL(params && params.originalURL).pathname.replace(/index\.html$/, '').replace(/\.html$/, '/');
    if (!p.endsWith('/')) p += '/';
    return p.toLowerCase();
  } catch (e) {
    return '';
  }
}

/* variant class recorded by the catalog for this page + instance; undefined when unknown */
function catalogVariant(element, params) {
  const entries = CATALOG_VARIANTS[pagePath(params)];
  if (!entries) return undefined;
  for (const [sel, v] of entries) {
    try { if (element.matches(sel)) return v; } catch (e) { /* invalid selector */ }
  }
  return undefined;
}


function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document, params }) {
  const cells = [];
  const form = element.querySelector('#review-form-selector, .form-container') || element;
  const typeSelect = form.querySelector('select#review-filter-step-1, select.first-custom-select, select');
  const productSelect = form.querySelector('select#review-filter-step-2, select.second-custom-select');
  const submit = form.querySelector('input[type="submit"], button[type="submit"]');

  // The dropdown placeholders are CSS generated content on the source
  // (button.button-container-one::after "Select review type",
  // .placeholder-button::after "Review filter"), captured by hrblock-cleanup
  // as data-excat-label; .tooltiptext is the hover hint of the disabled second
  // dropdown, not its label.
  const generated = (el) => (el && el.getAttribute('data-excat-label')) || '';
  const typeLabel = generated(form.querySelector('.button-container-one, .dropdown-container-one'));
  if (typeLabel) cells.push(['Type label', typeLabel]);
  const filterLabel = generated(form.querySelector('.placeholder-button')) || 'Review filter';
  cells.push(['Filter label', filterLabel]);
  if (submit) cells.push(['Submit', submit.getAttribute('value') || text(submit) || 'Submit']);

  const selectedLabel = text(form.querySelector('.dropdown-select-ul-one li.selected'));
  const types = typeSelect ? [...typeSelect.querySelectorAll('option')].filter((o) => text(o)) : [];
  types.forEach((opt) => {
    const name = text(opt);
    const ul = document.createElement('ul');
    if (productSelect && selectedLabel && selectedLabel === name) {
      productSelect.querySelectorAll('option').forEach((p) => {
        const value = p.getAttribute('value') || '';
        const href = value.split('|')[0];
        if (!href || !text(p)) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href.startsWith('/') ? `https://www.hrblock.com${href}` : href;
        a.textContent = text(p);
        li.append(a);
        ul.append(li);
      });
    }
    cells.push([name, ul.children.length ? ul : '']);
  });

  let variant = catalogVariant(element, params);
  if (variant === undefined) variant = selectedLabel ? null : 'dark';

  const name = variant ? `review-filter (${variant})` : 'review-filter';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
