/* eslint-disable */
/* global WebImporter */

/**
 * cards-icon-links parser.
 * Block table: one row per item -> [icon (optional)] [label, linked when the source has a real URL].
 * Rich items (benefit drawer / content grid): h3 title + description paragraphs; links inside
 * the description are kept (the block keeps rich rows' markup instead of linking the item).
 *
 * Source families:
 *  - category nav bar : ul.category_nav_v2 > li (icon + .nav-text label)
 *  - benefit drawer   : tds-benefit items (icon + heading + description)
 *  - content grid     : cds-row.grid-items-container > cds-column (icon + heading + description)
 *
 * Variant "light" cannot be told apart in the DOM (identical markup; colour comes
 * from the page theme), so the plain block is emitted.
 * Icons are inline SVG (no hosted asset) and are omitted; hosted <img> icons are kept.
 * javascript: hrefs (in-page category switchers) are dropped; the label stays.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function realHref(a) {
  const href = a ? (a.getAttribute('href') || '').trim() : '';
  if (!href || /^javascript:/i.test(href) || href === '#') return '';
  return href;
}

function hostedImg(root, document) {
  const img = root && root.querySelector('img');
  if (!img) return null;
  // lazy-loaded images carry a data: placeholder in src and the real URL in data-src
  const src = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]]
    .find((s) => s && !/^data:/i.test(s)) || '';
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
  return out;
}

/** Inline content of el without links (the block turns a link into the item target). */
function inlineText(el, document) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('svg, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
  const frag = document.createDocumentFragment();
  frag.append(...clone.childNodes);
  return frag;
}

/** Inline content of a description, keeping real links ("Visit idprotectiononline.com to learn more"). */
function inlineRich(el, document) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('svg, button, .sr-only, .visually-hidden').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = realHref(a);
    if (!href) { a.replaceWith(...a.childNodes); return; }
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.append(...a.childNodes);
    a.replaceWith(link);
  });
  const frag = document.createDocumentFragment();
  frag.append(...clone.childNodes);
  return frag;
}

export default function parse(element, { document, params }) {
  const cells = [];

  const navItems = [...element.querySelectorAll('li')].filter((li) => li.querySelector('.nav-text, a'));
  const benefitItems = [...element.querySelectorAll('tds-benefit')];
  const gridItems = [...element.querySelectorAll('cds-column')].filter((c) => c.querySelector('.item-heading, h2, h3, h4'));

  const addRow = (icon, content) => {
    if (!content.length && !icon) return;
    if (icon) cells.push([icon, content]);
    else cells.push([content]);
  };

  if (benefitItems.length || (gridItems.length && !navItems.length)) {
    const items = benefitItems.length ? benefitItems : gridItems;
    items.forEach((item) => {
      const icon = hostedImg(item.querySelector('.benefit-icon-container, .icon-wrapper') || item, document);
      const content = [];
      const heading = item.querySelector('h1, h2, h3, h4, h5, h6') || item.querySelector('.item-heading');
      if (heading && textOf(heading)) {
        // title keeps its heading role (h3 in the source benefit drawer / content grid)
        const h3 = document.createElement('h3');
        h3.append(inlineText(heading, document));
        content.push(h3);
      }
      item.querySelectorAll('.benefit-description, .item-description').forEach((d) => {
        if (!textOf(d)) return;
        const p = document.createElement('p');
        p.append(inlineRich(d, document));
        content.push(p);
      });
      addRow(icon, content);
    });
  } else {
    navItems.forEach((li) => {
      const a = li.querySelector('a');
      const labelEl = li.querySelector('.nav-text') || a || li;
      const label = textOf(labelEl) || (a && (a.getAttribute('aria-label') || '').trim());
      if (!label) return;
      const icon = hostedImg(li, document);
      const p = document.createElement('p');
      const href = realHref(a);
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = label;
        p.append(link);
      } else {
        p.textContent = label;
      }
      addRow(icon, [p]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon-links', cells });
  element.replaceWith(block);
}
