/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-office-services
 * Source: international tax office pages, section.column-control.two-column-control
 *   with an empty Dynamic Media column and an .opp-services-container column:
 *   h2.opp-services-title, ul.opp-services > li (img.opp-service-icon +
 *   strong.opp-service-title + .opp-service-desc paragraph), then the
 *   "See all tax pros at this office" button (.btn-container).
 * Layout (cards convention, blocks/cards-office-services/README.md): one row
 *   per card = icon cell | text cell (title as bold paragraph, then the
 *   description). The README's optional single-cell rows frame the cards:
 *   first row = intro heading, last row = CTA link only.
 * Variant: `alt` (services always in two columns) when the office lists three
 *   or more services (catalog: stuttgart/62651 alt, one or two services default).
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(root) {
  root.querySelectorAll('span.reader, a.reader, span.spacer, input, script, style, link, noscript, svg').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
  root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute('href', '#'));
  root.querySelectorAll('a.opp-services-seemore, a.opp-services-seeless').forEach((a) => a.remove());
}

export default function parse(element, { document }) {
  cleanInline(element);
  const container = element.querySelector('.opp-services-container') || element;
  const rows = [];

  const heading = container.querySelector('.opp-services-title, h1, h2, h3');
  if (heading && text(heading)) {
    const h = document.createElement('h2');
    h.textContent = text(heading);
    rows.push([h]);
  }

  const services = [...container.querySelectorAll('ul.opp-services > li')];
  services.forEach((li) => {
    const icon = li.querySelector('img.opp-service-icon, img');
    const iconCell = [];
    if (icon && icon.getAttribute('src')) {
      const img = document.createElement('img');
      img.src = icon.getAttribute('src');
      img.alt = icon.getAttribute('alt') || '';
      iconCell.push(img);
    }
    const body = [];
    const title = text(li.querySelector('.opp-service-title, strong'));
    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title;
      p.append(strong);
      body.push(p);
    }
    const desc = li.querySelector('.opp-service-desc');
    if (desc) {
      const paras = [...desc.querySelectorAll('p')];
      if (paras.length) paras.forEach((p) => { if (text(p)) body.push(p); });
      else if (text(desc)) {
        const p = document.createElement('p');
        p.append(...desc.childNodes);
        body.push(p);
      }
    }
    if (!iconCell.length && !body.length) return;
    rows.push([iconCell.length ? iconCell : '', body.length ? body : '']);
  });

  const ctas = [...element.querySelectorAll('.btn-container a[href], a.btn[href]')]
    .filter((a, i, all) => text(a) && all.indexOf(a) === i);
  if (ctas.length) {
    const p = document.createElement('p');
    ctas.forEach((a, i) => {
      if (i) p.append(' ');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = text(a);
      const strong = document.createElement('strong');
      strong.append(link);
      p.append(strong);
    });
    rows.push([p]);
  }

  const name = services.length >= 3 ? 'cards-office-services (alt)' : 'cards-office-services';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: rows.length ? rows : [['']] });
  element.replaceWith(block);
}
