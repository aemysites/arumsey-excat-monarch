/* eslint-disable */
/* global WebImporter */

/**
 * Parser: country-selector
 * Source: expat resource-center div.all-countries-intro-row
 *   (div.ac-heading-content h2 + p, div.ac-filtering-system letter dropdown + Select button)
 * Layout (blocks/country-selector/README.md, single block table):
 *   row 1: intro (heading + text)
 *   A-Z mode: one row per letter: letter | list of countries (guide names linked)
 *   (fallback: one row with a list of country guide links)
 *   last row: button label paragraph ("Select")
 *
 * The source dropdown filters an A-Z country list. The page renders only the
 * A list; hrblock-cleanup (preprocess) writes every letter from the inline
 * script into div.ac-filtering-results > div.countries-list--<letter>. Without
 * those lists the block falls back to the country guides the page links to:
 * the country grid (div.expat-hp-countries--grid, which hrblock-fragments may
 * already have moved into a fragment holder on params.fragments) and linked
 * names in the country list, in source order, de-duplicated by href.
 */

function letterLists(element, document) {
  const section = element.closest('section') || element.parentElement || element;
  const lists = [...section.querySelectorAll('.ac-filtering-results .countries-list')];
  const rows = [];
  lists.forEach((list) => {
    const m = (list.className || '').match(/countries-list--([a-z])/);
    const items = [...list.querySelectorAll('p')].filter((p) => text(p));
    if (!m || !items.length) return;
    const ul = document.createElement('ul');
    items.forEach((p) => {
      const li = document.createElement('li');
      const a = p.querySelector('a[href]');
      if (a && text(a) === text(p)) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = text(a);
        li.append(link);
      } else li.textContent = text(p);
      ul.append(li);
    });
    rows.push([m[1].toUpperCase(), ul]);
  });
  return rows;
}

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

  const letters = letterLists(element, document);
  const links = letters.length > 1 ? [] : guideLinks(element, document, params);
  if (letters.length > 1) {
    letters.forEach((row) => cells.push(row));
    // the lists are authored in the block: drop the rendered A list from default content
    const section = element.closest('section') || element.parentElement || element;
    section.querySelectorAll('.ac-filtering-results').forEach((r) => r.remove());
  } else if (links.length) {
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
