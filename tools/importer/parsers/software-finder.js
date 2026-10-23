/* eslint-disable */
/* global WebImporter */

/**
 * Parser: software-finder
 * Source: tax-software situation filter section (rating, heading, intro text,
 *   form#product-selector with checkbox situations).
 * Layout (blocks/software-finder/README.md): one row:
 *   intro (rating line "4.3 (495170)", heading, text) | list of situations.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  element.querySelectorAll('svg, script, style, link, noscript').forEach((n) => n.remove());
  const intro = [];

  const avg = text(element.querySelector('.bv_averageRating_component_container'));
  const count = text(element.querySelector('.bv_numReviews_component_container'));
  if (avg) {
    const p = document.createElement('p');
    p.textContent = count ? `${avg} ${count}` : avg;
    intro.push(p);
  }
  const heading = element.querySelector('h1, h2, h3');
  if (heading && text(heading)) intro.push(heading);
  const introCol = heading ? heading.parentElement : element;
  [...introCol.querySelectorAll(':scope > div > p, :scope > p')].forEach((p) => {
    if (text(p) && !p.closest('form, .assist-checkbox')) intro.push(p);
  });

  const ul = document.createElement('ul');
  const form = element.querySelector('form#product-selector') || element;
  form.querySelectorAll('li').forEach((li) => {
    const label = text(li.querySelector('label')) || text(li);
    if (!label) return;
    const item = document.createElement('li');
    item.textContent = label;
    ul.append(item);
  });

  const row = [];
  if (intro.length) row.push(intro);
  if (ul.children.length) row.push(ul);
  const cells = row.length ? [row] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'software-finder', cells });
  element.replaceWith(block);
}
