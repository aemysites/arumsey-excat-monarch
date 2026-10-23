/* eslint-disable */
/* global WebImporter */

/**
 * Parser: country-selector
 * Source: expat resource-center div.all-countries-intro-row
 *   (div.ac-heading-content h2 + p, div.ac-filtering-system letter dropdown + Select button)
 * Layout (blocks/country-selector/README.md, single block table):
 *   row 1: intro (heading + text)
 *   row 2: list of country links (option label = link text, value = href)
 *   row 3: button label paragraph ("Select")
 *
 * The source dropdown filters an A-Z country list that the site loads per
 * letter over admin-ajax (only the A list is in the page, kept as default
 * content). The block navigates to a link, so its choices are the country
 * guides the page links to: the country grid (div.expat-hp-countries--grid,
 * which hrblock-fragments may already have moved into a fragment holder on
 * params.fragments) and linked names in the country list, in source order,
 * de-duplicated by href.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function guideLinks(element, document, params) {
  const roots = [];
  const grid = document.querySelector('.expat-hp-countries--grid');
  if (grid) roots.push(grid);
  else {
    (params && Array.isArray(params.fragments) ? params.fragments : [])
      .filter((f) => /country-grid/.test(f.path || ''))
      .forEach((f) => roots.push(f.element));
  }
  const section = element.closest('section') || element.parentElement || element;
  section.querySelectorAll('.ac-filtering-results').forEach((r) => roots.push(r));

  const seen = new Set();
  const links = [];
  roots.forEach((root) => {
    root.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      const label = text(a.querySelector('p')) || text(a);
      if (!href || !label || /^(#|javascript:)/i.test(href) || href.startsWith('/fragments/')) return;
      const key = href.replace(/\/$/, '');
      if (seen.has(key)) return;
      seen.add(key);
      links.push({ href, label });
    });
  });
  return links;
}

export default function parse(element, { document, params }) {
  const cells = [];

  const intro = [];
  const introRoot = element.querySelector('.ac-heading-content') || element;
  introRoot.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((el) => {
    if (el.closest('.ac-filtering-system') || !text(el)) return;
    const clone = el.cloneNode(true);
    clone.removeAttribute('class');
    intro.push(clone);
  });
  if (intro.length) cells.push([intro]);

  const links = guideLinks(element, document, params);
  if (links.length) {
    const ul = document.createElement('ul');
    links.forEach(({ href, label }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.append(a);
      ul.append(li);
    });
    cells.push([ul]);
  }

  const button = element.querySelector('.ac-filtering-system button, button');
  const label = text(button);
  if (label) {
    const p = document.createElement('p');
    p.textContent = label;
    cells.push([p]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'country-selector', cells });
  element.replaceWith(block);
}
