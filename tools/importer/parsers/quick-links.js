/* eslint-disable */
/* global WebImporter */

/**
 * Parser: quick-links
 * Source: suncorp.com.au sticky in-page link bars (staticLinksMenu > ul.sg-Menu).
 *
 * Block table (blocks/quick-links/README.md): a list of links (one cell);
 * with the `label` option the first row holds the label text.
 * Empty sticky-CTA anchors (href="#") are dropped.
 *
 * Variant classes (from markup, matching the catalog names):
 *   label - the bar is led by text without a link (e.g. "I want to:")
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

export default function parse(element, { document, params }) {
  const menu = element.matches('ul') ? element : element.querySelector('ul.sg-Menu, ul');
  const list = document.createElement('ul');
  let label = '';
  let items = menu ? [...menu.querySelectorAll(':scope > li')] : [];
  // Homepage "I want to:" bar: a heading beside a grid of button links (no list).
  if (!items.length) {
    items = [...element.querySelectorAll('a.sg-Btn[href], a[href]')]
      .filter((a, i, all) => all.indexOf(a) === i)
      .map((a) => {
        const li = document.createElement('li');
        li.append(a.cloneNode(true));
        return li;
      });
    const heading = element.querySelector('h2, h3, h4');
    if (heading && !heading.querySelector('a') && text(heading)) label = text(heading);
  }
  items.forEach((li) => {
    const a = li.querySelector('a[href]');
    if (!a) {
      if (!label && text(li)) label = text(li);
      return;
    }
    const href = a.getAttribute('href');
    if (!text(a) || href === '#') return;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text(a);
    item.append(link);
    list.append(item);
  });
  // A label paragraph before the menu (outside the list).
  if (!label) {
    const lead = [...element.querySelectorAll('p, span.sg-Menu-label, .staticLinksMenu-label')]
      .find((el) => !el.closest('li') && text(el) && !el.querySelector('a'));
    if (lead) label = text(lead);
  }

  const cells = [];
  if (label) cells.push([label]);
  cells.push([list]);
  const name = label ? 'quick-links (label)' : 'quick-links';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
