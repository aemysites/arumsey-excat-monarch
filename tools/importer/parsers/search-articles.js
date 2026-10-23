/* eslint-disable */
/* global WebImporter */

/**
 * Parser: search-articles
 * Source: expat resource-center search box (section.expat-hp-search /
 *   div.ba-search-box--controls with form#ba-page--search-form).
 * Layout (blocks/search-articles/README.md): rows (all optional):
 *   label / placeholder text; link to the results page (form action, submits ?q=);
 *   link to a .json query index (omitted -> block default /query-index.json).
 * Topic pages filter inline (no form action) so they get the label row only.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  const cells = [];
  const form = element.querySelector('form') || element;
  const label = form.querySelector('label');
  const input = form.querySelector('input[type="search"], input[name="q"]');
  // state picker forms (/makeeveryblockbetter/ map) have only a select: use its prompt option
  const prompt = !input && form.querySelector('select option');
  const labelText = text(label) || (input && input.getAttribute('placeholder')) || text(prompt) || 'Search';
  cells.push([labelText]);

  const action = form.getAttribute && form.getAttribute('action');
  if (action && !/^javascript:/i.test(action)) {
    const a = document.createElement('a');
    a.href = action;
    a.textContent = action;
    cells.push([a]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'search-articles', cells });
  element.replaceWith(block);
}
