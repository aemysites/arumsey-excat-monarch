/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-icon-list
 * Source: section.column-control.two-column-control with one intro column
 *   (div.introDefaultvariant: heading, body, optional CTA links) and one icon
 *   column (stacked div.introImageVariant items: icon, h3 title, body).
 *   (/corporate/our-company/ "We didn't just set the bar", audit-support
 *   "Comprehensive assistance").
 * Layout (blocks/columns-icon-list/README.md, columns convention): one row,
 *   two cells side by side: cell 1 = intro heading/text, cell 2 = icon items
 *   as paragraphs, each item an icon paragraph followed by its title and text.
 * Inline SVG icons have no image URL on the source, so they are kept as SVG
 * data-URI images (same as cards-icon).
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(root) {
  root.querySelectorAll('span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
  root.querySelectorAll('h1 br, h2 br, h3 br, h4 br, h5 br, h6 br').forEach((br) => br.replaceWith(' '));
  root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute('href', '#'));
  root.querySelectorAll('span.rte-right-arrow').forEach((s) => s.replaceWith(...s.childNodes));
}

function svgToImg(document, svg) {
  try {
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const markup = clone.outerHTML;
    const b64 = typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(markup)))
      : Buffer.from(markup, 'utf8').toString('base64');
    const img = document.createElement('img');
    img.src = `data:image/svg+xml;base64,${b64}`;
    img.alt = svg.getAttribute('aria-label') || '';
    return img;
  } catch (e) {
    return null;
  }
}

function iconOf(document, root) {
  if (!root) return null;
  const img = root.querySelector('img');
  if (img && img.getAttribute('src')) return img;
  const svg = root.querySelector('svg');
  return svg ? svgToImg(document, svg) : null;
}

/* Top-level text blocks (headings, paragraphs, lists) of a container, in order. */
function textBlocks(root) {
  return [...root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
    .filter((n) => {
      if (!text(n)) return false;
      // nested in another text block of this root (the column itself sits in a ul)
      const outer = n.parentElement.closest('p, ul, ol, h1, h2, h3, h4, h5, h6');
      return !outer || !root.contains(outer);
    })
    .filter((n) => {
      const btns = n.closest('.btn-container');
      return !btns || !root.contains(btns);
    });
}

/* CTA links of a .btn-container as one paragraph; .btn links become buttons (strong). */
function ctaParagraph(document, container) {
  const controls = [...container.querySelectorAll('a, button')].filter((c) => text(c));
  if (!controls.length) return null;
  const p = document.createElement('p');
  controls.forEach((c, i) => {
    if (i) p.append(' ');
    const link = document.createElement('a');
    link.href = (c.tagName === 'A' && c.getAttribute('href')) || '#';
    link.textContent = text(c);
    if (c.tagName !== 'A' || c.classList.contains('btn')) {
      const strong = document.createElement('strong');
      strong.append(link);
      p.append(strong);
    } else {
      p.append(link);
    }
  });
  return p;
}

function introContent(document, col) {
  const out = [];
  col.querySelectorAll('.introDefaultvariant, .introImageVariant').forEach((intro) => {
    if (intro.parentElement.closest('.introDefaultvariant, .introImageVariant')) return;
    out.push(...textBlocks(intro));
    intro.querySelectorAll('.btn-container').forEach((btns) => {
      const cta = ctaParagraph(document, btns);
      if (cta) out.push(cta);
    });
  });
  if (!out.length) out.push(...textBlocks(col));
  return out;
}

function iconItems(document, col) {
  const out = [];
  const items = [...col.querySelectorAll('.introImageVariant')]
    .filter((n) => !n.parentElement.closest('.introImageVariant'));
  items.forEach((item) => {
    const icon = iconOf(document, item.querySelector('.cmp-column--image') || item);
    const clone = item.cloneNode(true);
    clone.querySelectorAll('.cmp-column--image, svg, img').forEach((n) => n.remove());
    const body = textBlocks(clone);
    clone.querySelectorAll('.btn-container').forEach((btns) => {
      const cta = ctaParagraph(document, btns);
      if (cta) body.push(cta);
    });
    if (!icon && !body.length) return;
    const iconP = document.createElement('p');
    if (icon) iconP.append(icon);
    out.push(iconP, ...body);
  });
  return out;
}

export default function parse(element, { document }) {
  cleanInline(element);
  const cols = [...element.querySelectorAll('ul.column-container > li.column')]
    .filter((li) => !li.parentElement.closest('li.column'));
  const isIconCol = (li) => !!li.querySelector('.introImageVariant .icon-svg, .introImageVariant img');
  const iconCol = cols.find(isIconCol);
  const introCols = cols.filter((li) => li !== iconCol);

  const intro = [];
  introCols.forEach((li) => intro.push(...introContent(document, li)));
  const items = iconCol ? iconItems(document, iconCol) : [];

  // Authors may leave either side empty; keep the two-cell row so the block layout holds.
  const cells = [[intro.length ? intro : '', items.length ? items : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-icon-list', cells });
  element.replaceWith(block);
}
