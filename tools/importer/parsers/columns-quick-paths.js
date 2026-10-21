/* eslint-disable */
/* global WebImporter */

/**
 * columns-quick-paths parser.
 * Block table: one row, one cell per column. Each cell: optional icon (own
 * paragraph, so the decorator moves it into the heading), heading or label,
 * optional body text, optional single-link CTA paragraph.
 *
 * Source families:
 *  - quick-path tiles (.rtb-tiles > .tile-container): icon, h2, description, arrow link
 *  - key terms (.rates-list-item > tds-ratesfees): label, value, fine print
 *
 * Variants:
 *  - in-box-with-text: tiles where at least one tile carries description text
 *  - key-terms: rates/fees terms whose footnote links use the primary colour (.text-primary)
 *  - light: rates/fees terms without primary-coloured links (light text on a dark band)
 *  - null: tiles with icon + heading + link only
 */

const CHROME = 'script, style, svg, cds-icon, button, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, .tile-divider';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0], img.getAttribute('data-desktop-src')];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function makeImg(document, img) {
  const src = img && imgSrc(img);
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  const alt = (img.getAttribute('alt') || '').trim();
  out.setAttribute('alt', /^(image alt|head|icon)$/i.test(alt) ? '' : alt);
  return out;
}

function inline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('img').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('div, p, span, section').forEach((n) => n.replaceWith(...n.childNodes));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes];
}

function wrap(document, tag, el) {
  if (!el || !textOf(el)) return null;
  const out = document.createElement(tag);
  out.append(...inline(el));
  return textOf(out) ? out : null;
}

function tileCell(document, tile) {
  const cell = [];
  const iconImg = tile.querySelector('.headline-icon img, .tile-headline img, img');
  const icon = makeImg(document, iconImg);
  if (icon) {
    const p = document.createElement('p');
    p.append(icon);
    cell.push(p);
  }
  const heading = tile.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const h = wrap(document, heading.tagName.toLowerCase(), heading);
    if (h) cell.push(h);
  } else {
    const t = wrap(document, 'h3', tile.querySelector('.headline-text'));
    if (t) cell.push(t);
  }
  const desc = tile.querySelector('.headline-desc');
  if (desc) {
    const parts = [...desc.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
    if (parts.length) {
      parts.forEach((part) => {
        if (part.tagName === 'P') {
          const p = wrap(document, 'p', part);
          if (p) cell.push(p);
        } else if (textOf(part)) {
          const list = document.createElement(part.tagName.toLowerCase());
          part.querySelectorAll(':scope > li').forEach((li) => {
            const item = document.createElement('li');
            item.append(...inline(li));
            list.append(item);
          });
          cell.push(list);
        }
      });
    } else {
      const p = wrap(document, 'p', desc);
      if (p) cell.push(p);
    }
  }
  const links = [...tile.querySelectorAll('.tile-btn a[href], a.rtb-link[href]')]
    .filter((a, i, all) => all.indexOf(a) === i);
  (links.length ? links : [...tile.querySelectorAll('a[href]')].filter((a) => !a.closest('h1, h2, h3, h4, h5, h6, .headline-desc'))).forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || /^javascript:/i.test(href)) return;
    const label = inline(a);
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.append(...label);
    if (!textOf(link)) return;
    p.append(link);
    cell.push(p);
  });
  return cell;
}

function termCell(document, term) {
  const cell = [];
  const l = wrap(document, 'p', term.querySelector('.eyebrow'));
  if (l) cell.push(l);
  const value = term.querySelector('.text');
  if (value && textOf(value)) {
    const h = document.createElement('h3');
    h.append(...inline(value));
    cell.push(h);
  }
  const n = wrap(document, 'p', term.querySelector('.description'));
  if (n) cell.push(n);
  if (!cell.length) {
    const p = wrap(document, 'p', term);
    if (p) cell.push(p);
  }
  return cell;
}

export default function parse(element, { document, params }) {
  let variant = null;
  let row = [];
  let terms = [...element.querySelectorAll('tds-ratesfees')];
  if (!terms.length) terms = [...element.querySelectorAll('.rates-fees-item')];
  if (terms.length) {
    row = terms.map((t) => termCell(document, t));
    variant = element.querySelector('.text-primary') ? 'key-terms' : 'light';
  } else {
    let tiles = [...element.querySelectorAll('.tile-container')];
    if (!tiles.length) tiles = [...element.querySelectorAll('.tile-wrapper')];
    if (!tiles.length) tiles = [...element.children].filter((c) => textOf(c));
    tiles = tiles.filter((t, i, all) => !all.some((o, j) => j !== i && o.contains(t)));
    row = tiles.map((t) => tileCell(document, t));
    const intro = element.querySelector('.rtb-headline, .intro-copy');
    if (intro && textOf(intro) && row.length) {
      // intro copy above the tiles leads the first column
      const p = wrap(document, 'p', intro);
      if (p) row[0].unshift(p);
    }
    if ([...element.querySelectorAll('.headline-desc')].some((d) => textOf(d))) variant = 'in-box-with-text';
  }
  row = row.filter((c) => c.length);
  const cells = row.length ? [row] : [];
  const name = variant ? `columns-quick-paths (${variant})` : 'columns-quick-paths';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
