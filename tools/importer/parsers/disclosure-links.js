/* eslint-disable */
/* global WebImporter */

/**
 * disclosure-links parser.
 * Block table: one row per disclosure link.
 *   cell 1: optional <sup> footnote number + the disclosure link
 *   cell 2 (optional): disclosure content, when it is inside the source element
 *     (an expandable panel next to the link); the link then toggles it open.
 * Links keep their source href: external pricing-terms URLs stay links, #hash
 * links stay hash links (the block opens the matching details target).
 *
 * Source: tds-footer-section ul.section-footer > li (sup + a). Fallback: any
 * li / direct link in the element.
 *
 * Toggle-only anchors without a URL (e.g. "Additional Information +", which
 * opens a JS modal not present in the page) are kept as a text-only row.
 *
 * Variant dark: not detectable from the DOM (identical markup on dark-themed
 * product pages), so all instances use the plain block.
 */

const CHROME = 'script, style, svg, cds-icon, button, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function realHref(href) {
  const h = (href || '').trim();
  const bump = h.match(/^#modal:speedbump:(.+)$/i);
  if (bump) return bump[1];
  if (!h || /^javascript:/i.test(h)) return '';
  return h;
}

function inline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = realHref(a.getAttribute('href'));
    if (!href) a.replaceWith(...a.childNodes);
    else a.setAttribute('href', href);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target', 'src', 'alt'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('div, span, section').forEach((n) => n.replaceWith(...n.childNodes));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes];
}

function panelOf(item) {
  return item.querySelector('details > :not(summary), .disclosure-content, .panel, [role="region"], .collapse');
}

export default function parse(element, { document, params }) {
  let items = [...element.querySelectorAll('li')];
  if (!items.length) {
    items = [...element.querySelectorAll('a')].map((a) => {
      const sup = a.previousElementSibling && a.previousElementSibling.tagName === 'SUP' ? a.previousElementSibling : null;
      return { a, sup };
    });
  }
  const cells = [];
  items.forEach((item) => {
    const isLi = item.tagName === 'LI';
    const a = isLi ? item.querySelector('a') : item.a;
    const sup = isLi ? [...item.children].find((c) => c.tagName === 'SUP' && (!a || (c.compareDocumentPosition(a) & 4))) : item.sup;
    const first = document.createElement('p');
    if (sup && textOf(sup)) {
      const s = document.createElement('sup');
      s.textContent = textOf(sup);
      first.append(s);
    }
    if (a) {
      const href = realHref(a.getAttribute('href'));
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.append(...inline(a));
        first.append(link);
      } else {
        first.append(...inline(a));
      }
    } else if (isLi) {
      const clone = item.cloneNode(true);
      clone.querySelectorAll('sup').forEach((n) => n.remove());
      first.append(...inline(clone));
    }
    if (!textOf(first)) return;
    const panel = isLi ? panelOf(item) : null;
    if (panel && textOf(panel)) {
      const content = document.createElement('div');
      content.append(...inline(panel));
      cells.push([[first], [...content.childNodes]]);
    } else {
      cells.push([[first]]);
    }
  });

  // pad to a uniform column count when some rows carry inline content
  const width = Math.max(1, ...cells.map((r) => r.length));
  cells.forEach((r) => { while (r.length < width) r.push(''); });

  const block = WebImporter.Blocks.createBlock(document, { name: 'disclosure-links', cells });
  element.replaceWith(block);
}
