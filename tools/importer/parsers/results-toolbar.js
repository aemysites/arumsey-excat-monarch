/* eslint-disable */
/* global WebImporter */

/**
 * Parser: results-toolbar
 * Source: div.search-result-metrics (expat resource center listing toolbar):
 *   result count heading, custom sort select, "Reset Filters" link.
 * Layout (blocks/results-toolbar/README.md): one row:
 *   result count text | list of sort options (plain items) | reset link.
 * The JS-only reset link (javascript:void(0)) becomes "#".
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  const row = [];

  const count = element.querySelector('#ba-search-count, h2, h3');
  if (count && text(count)) {
    const p = document.createElement('p');
    // <span>29</span> result<span>s</span>: helix-importer unwraps the bare
    // count span before parsing, so read the heading text as a whole
    // ("29 results") and only make sure number and word are separated.
    p.textContent = text(count).replace(/(\d)\s*([A-Za-z])/, '$1 $2').replace(/\s+(s)\b/, '$1');
    row.push(p);
  }

  // one list per source dropdown (topic filter, then sort), each in its own cell
  const selects = [...element.querySelectorAll('select')];
  const groups = selects.length
    ? selects.map((s) => [...s.querySelectorAll('option')])
    : [...element.querySelectorAll('.all-items')].map((g) => [...g.querySelectorAll('.item')]);
  groups.map((items) => items.map((o) => text(o)).filter(Boolean)).filter((l) => l.length).forEach((labels) => {
    const ul = document.createElement('ul');
    labels.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
    row.push(ul);
  });

  const reset = [...element.querySelectorAll('a')].find((a) => /reset/i.test(text(a)) || a.matches('[class*="reset"]'));
  if (reset) {
    const a = document.createElement('a');
    const href = reset.getAttribute('href') || '#';
    a.href = /^javascript:/i.test(href) ? '#' : href;
    a.textContent = text(reset);
    const p = document.createElement('p');
    p.append(a);
    row.push(p);
  }

  const cells = row.length ? [row] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'results-toolbar', cells });
  element.replaceWith(block);
}
