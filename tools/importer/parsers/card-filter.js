/* eslint-disable */
/* global WebImporter */

/**
 * card-filter: one row per dropdown option -> [option label | filter value].
 * Source: a <select> (or a list of options / filter buttons). The first row is
 * the "show all" option (value "all" on the source). No variants.
 */
export default function parse(element, { document, params }) {
  const cells = [];
  const select = element.matches('select') ? element : element.querySelector('select');

  let options = [];
  if (select) {
    options = [...select.querySelectorAll('option')].map((o) => ({
      label: (o.textContent || '').replace(/\s+/g, ' ').trim(),
      value: (o.getAttribute('value') || '').trim(),
    }));
  } else {
    // fallback: filter chips / buttons / list items
    options = [...element.querySelectorAll('button, [role="option"], li')]
      .filter((el, i, arr) => !arr.some((o) => o !== el && o.contains(el)))
      .map((el) => ({
        label: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        value: (el.getAttribute('value') || el.getAttribute('data-value') || '').trim(),
      }));
  }

  const seen = new Set();
  options.forEach(({ label, value }) => {
    if (!label || seen.has(label)) return;
    seen.add(label);
    cells.push([label, value || label]);
  });

  if (!cells.length) cells.push(['All', 'all']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'card-filter', cells });
  element.replaceWith(block);
}
