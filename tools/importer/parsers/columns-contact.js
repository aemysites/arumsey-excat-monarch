/* eslint-disable */
/* global WebImporter */

/**
 * columns-contact parser.
 * Block table: one row, one cell per column. Each cell: heading, icon-led lines
 * (icon image as the first child of the line it leads), text, phone links, CTA links.
 *
 * Column sources (fallback chain, first that matches):
 *  .tile-container (contact-us tiles) | benefit-card boxes (desktop copy only) |
 *  .col-size.col (dynamic templates) |
 *  .contact-us-option / citi-column | direct children with content.
 *
 * Variant with-select: the column holds a JS dropdown (role=combobox). Its options
 * are populated at runtime and are not in the DOM, so only the placeholder list
 * item is emitted for authors to complete.
 * Inline SVG icons have no hosted asset and are omitted; <img> and CSS
 * background-image icons are kept. Buttons without a URL are dropped.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function bgUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

function cleanInline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, button, cds-icon, img').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    ['class', 'id', 'style', 'role', 'aria-label', 'aria-hidden', 'title'].forEach((a) => n.removeAttribute(a));
  });
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return clone;
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.setAttribute('alt', (alt || '').trim());
  return img;
}

/** Column content in document order; a standalone icon leads the next line. */
function columnContent(document, root) {
  const out = [];
  let pendingIcon = null;

  const emit = (el) => {
    if (!textOf(el) && !el.querySelector('img')) return;
    if (pendingIcon) {
      if (el.tagName === 'P') {
        el.prepend(pendingIcon);
      } else {
        // headings/lists: icon on its own line, leading the next element
        const p = document.createElement('p');
        p.append(pendingIcon);
        out.push(p);
      }
      pendingIcon = null;
    }
    out.push(el);
  };
  const block = (tag, source) => {
    const el = document.createElement(tag);
    el.append(...cleanInline(source).childNodes);
    return el;
  };
  const icon = (img) => {
    if (pendingIcon) {
      const p = document.createElement('p');
      p.append(pendingIcon);
      out.push(p);
    }
    pendingIcon = img;
  };

  const walk = (node) => {
    const bg = bgUrl(node);
    if (bg && node !== root) icon(makeImg(document, bg, ''));
    [...node.children].forEach((child) => {
      const tag = child.tagName;
      if (/^(SCRIPT|STYLE|SVG|CDS-ICON|CITI-ICON2|INPUT)$/.test(tag)) return;
      if (child.matches('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden')) return;
      if (child.matches('[role="combobox"], select, .xDropdown2-wrapper')) {
        const label = textOf(child.querySelector('label, .dropdownLabel')) || textOf(child.querySelector('.dropdownText')) || child.getAttribute('aria-label') || '';
        const ul = document.createElement('ul');
        const options = [...child.querySelectorAll('option, [role="option"]')].filter((o) => textOf(o));
        const li = document.createElement('li');
        li.textContent = label || 'Select an option';
        ul.append(li);
        options.forEach((o) => {
          const item = document.createElement('li');
          const href = o.getAttribute('value') || o.getAttribute('data-href') || '';
          if (/^(https?:|\/)/.test(href)) {
            const a = document.createElement('a');
            a.setAttribute('href', href);
            a.textContent = textOf(o);
            item.append(a);
          } else {
            item.textContent = textOf(o);
          }
          ul.append(item);
        });
        emit(ul);
        return;
      }
      if (tag === 'IMG') {
        const src = imgSrc(child);
        if (src) icon(makeImg(document, src, child.getAttribute('alt')));
        return;
      }
      if (tag === 'BUTTON') return; // no URL to follow
      if (/^H[1-6]$/.test(tag)) {
        if (textOf(child)) emit(block(tag.toLowerCase(), child));
        return;
      }
      if (tag === 'P' || tag === 'SMALL') {
        if (textOf(child)) emit(block('p', child));
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        if (textOf(child)) emit(cleanInline(child));
        return;
      }
      if (tag === 'A') {
        const href = (child.getAttribute('href') || '').trim();
        const label = textOf(cleanInline(child));
        if (!label) return;
        const p = document.createElement('p');
        if (href && !href.startsWith('#') && !/^javascript:/i.test(href)) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.append(...cleanInline(child).childNodes);
          p.append(a);
        } else {
          p.textContent = label;
        }
        emit(p);
        return;
      }
      const hasOwnText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const hasBlockChild = child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, img, [role="combobox"]');
      if (hasOwnText && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div')) {
        // inline run (e.g. span with text, <br>s and phone links) -> one paragraph
        // a leading icon <img> inside the run leads this line
        const img = child.querySelector('img');
        if (img && imgSrc(img)) icon(makeImg(document, imgSrc(img), img.getAttribute('alt')));
        emit(block('p', child));
        return;
      }
      if (!hasBlockChild && textOf(child)) {
        emit(block('p', child));
        return;
      }
      walk(child);
    });
  };

  walk(root);
  if (pendingIcon) {
    const p = document.createElement('p');
    p.append(pendingIcon);
    out.push(p);
  }
  return out;
}

export default function parse(element, { document, params }) {
  const isMobileCopy = (c) => c.closest('.benefitcards__mobilevariation, [class*="mobilevariation"], .slide');
  let cols = [...element.querySelectorAll('.tile-container')];
  if (!cols.length) cols = [...element.querySelectorAll('.benefitcards__contentbox-boxmodel')].filter((c) => !isMobileCopy(c));
  if (!cols.length) cols = [...element.querySelectorAll('.col-size.col')];
  if (!cols.length) cols = [...element.querySelectorAll('.grid-column')];
  if (!cols.length) cols = [...element.querySelectorAll('.contact-us-option')];
  if (!cols.length) cols = [...element.querySelectorAll('citi-column')];
  if (!cols.length) {
    cols = [...element.children].filter((c) => textOf(c) && !/separator|seperator|divider/.test(c.className || ''));
    if (cols.length === 1 && cols[0].children.length > 1) {
      cols = [...cols[0].children].filter((c) => textOf(c));
    }
  }
  // keep outermost matches only
  cols = cols.filter((c, i) => !cols.some((o, j) => j !== i && o.contains(c)));

  const variant = element.querySelector('[role="combobox"], select, x-citi-dropdown2') ? 'with-select' : null;

  const row = cols.map((c) => columnContent(document, c)).filter((c) => c.length);
  const cells = row.length ? [row] : [];

  const name = variant ? `columns-contact (${variant})` : 'columns-contact';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
