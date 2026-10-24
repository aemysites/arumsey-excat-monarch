/* eslint-disable */
/* global WebImporter */

/**
 * Parser: breadcrumb
 * Source: suncorp.com.au ol.breadcrumb inside div.Main-content > div.Middle-column.
 * Block table (blocks/breadcrumb/README.md): one cell holding a list of links,
 * home first; the last item (current page) is plain text.
 */
export default function parse(element, { document, params }) {
  const items = [...element.querySelectorAll('ol.breadcrumb > li, ol > li, ul.breadcrumb > li')];
  const list = document.createElement('ul');
  items.forEach((item) => {
    const a = item.querySelector('a[href]');
    const label = (item.textContent || '').replace(/\s+/g, ' ').trim()
      || (a && a.getAttribute('title')) || (a ? 'Home' : '');
    if (!label) return;
    const li = document.createElement('li');
    if (a) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = label;
      li.append(link);
    } else {
      li.textContent = label;
    }
    list.append(li);
  });

  const cells = [[list.children.length ? list : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
