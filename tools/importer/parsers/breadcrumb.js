/* eslint-disable */
/* global WebImporter */

/**
 * Parser: breadcrumb
 * Source: div.breadcrumbs-container (expat resource-center trail)
 * Layout (blocks/breadcrumb/README.md): one cell with the trail as a list of
 * links; the current page (span.breadcrumb-current) is plain text and last.
 */
export default function parse(element, { document }) {
  const ul = document.createElement('ul');
  // Crumbs are span.ListItem children; helix-importer unwraps class-less
  // spans before parsing, so a crumb can also be a bare <a> child.
  const crumbs = [...element.querySelectorAll('.ba--breadcrumbs > span, .ba--breadcrumbs > a')]
    .filter((n) => !n.classList.contains('ba--breadcrumbs--divide'));

  const items = crumbs.length ? crumbs : [...element.querySelectorAll('a')];
  items.forEach((crumb) => {
    const a = crumb.tagName === 'A' ? crumb : crumb.querySelector('a');
    const text = (a || crumb).textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const li = document.createElement('li');
    const isCurrent = crumb.classList.contains('breadcrumb-current') || crumb.getAttribute('aria-current') === 'page';
    if (a && a.getAttribute('href') && !isCurrent) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = text;
      li.append(link);
    } else {
      li.textContent = text;
    }
    ul.append(li);
  });

  const cells = ul.children.length ? [[ul]] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
