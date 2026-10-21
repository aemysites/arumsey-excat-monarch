/* eslint-disable */
/* global WebImporter */

/**
 * cards-highlight: one row per tile -> [image / icon | body].
 * Body: stat (H3 or bold first paragraph), label / text paragraphs, lists, CTA links.
 * Rows are padded to 2 columns (the block ignores empty cells).
 *
 * Source tile shapes (generic, outermost match wins):
 *  - .accelerator-bar           credit-card PDP accelerator tiles (div) and rate strips (li)
 *  - .bubble-section            retail card header highlights
 *  - .card-info-col / cds-card-column-info   mortgage info tiles
 *  - section.banner             small-business product banners (no image)
 *  - .tile-container            hero "reason to believe" icon links
 *  - .citi-column-control__grid__cell        icon-text tiles in a column control
 *
 * Variants (README option classes), detected from generic source cues:
 *  - icon-links:                tiles that are only a link (.rtb-tiles / link-only tiles)
 *  - with-image:                AEM icon-text tiles (.citi-icon-text-tile) in a column control
 *  - rate-strip:                accelerator strip (li.accelerator-bar / ul.accelerator-container-bar)
 *  - coloured accelerator tiles: tile background colours are classified (blue, cyan, dark, grey, red)
 *    and mapped to blue-cyan-dark / blue-dark / blue-dark-red / cyan-grey; any other palette
 *    (e.g. green or 4+ colours) -> coloured-tiles-with-icons
 *  - plain:                     everything else
 */

const COLS = 2;
const COLOUR_VARIANTS = ['blue-cyan-dark', 'blue-dark', 'blue-dark-red', 'cyan-grey'];

function pad(row) {
  while (row.length < COLS) row.push('');
  return row;
}

function text(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function strip(root) {
  root.querySelectorAll('cds-icon, cds-icon-wrapper, svg, button:not(.cds-button), .sr-only, .visually-hidden, .tile-divider').forEach((x) => x.remove());
  // presentational wrappers are dropped only when they hold no text (footnote <sup role=presentation> is kept)
  root.querySelectorAll('[role="presentation"]:not(img), [role="img"]:not(img)').forEach((x) => { if (!text(x)) x.remove(); });
  root.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
}

function imgFrom(document, img) {
  if (!img) return null;
  const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-desktop-src');
  // CSS sprite sheets (one SVG positioned per tile) are not usable as tile images
  if (!src || /sprite/i.test(src)) return null;
  const out = document.createElement('img');
  out.src = src;
  out.alt = img.getAttribute('alt') || '';
  return out;
}

function para(document, nodesOrText, tag = 'p') {
  const p = document.createElement(tag);
  if (typeof nodesOrText === 'string') p.textContent = nodesOrText;
  else p.append(...nodesOrText);
  return p;
}

function bold(document, label) {
  const p = document.createElement('p');
  const s = document.createElement('strong');
  s.textContent = label;
  p.append(s);
  return p;
}

function linkPara(document, a, label) {
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = label || text(a);
  p.append(link);
  return p;
}

/* ---------- per-shape body builders ---------- */

function acceleratorTile(document, tile) {
  const img = imgFrom(document, tile.querySelector('.icon-wrapper img, img'));
  strip(tile);
  const body = [];
  const heading = tile.querySelector('.item-heading, h2, h3, h4');
  const percent = tile.querySelector('.percent-text');
  if (heading && text(heading)) {
    body.push(para(document, [...heading.childNodes], 'h3'));
  } else if (percent) {
    const sym = tile.querySelector('[class*="percent-symbol"]');
    body.push(para(document, `${text(percent)}${sym ? text(sym) : ''}`, 'h3'));
  }
  const category = tile.querySelector('.item-category');
  if (category && text(category)) {
    body.push(heading || percent ? para(document, [...category.childNodes]) : bold(document, text(category)));
  }
  tile.querySelectorAll('.item-description').forEach((d) => {
    if (!text(d)) return;
    const inner = d.querySelectorAll('p');
    if (inner.length) inner.forEach((p) => body.push(para(document, [...p.childNodes])));
    else body.push(para(document, [...d.childNodes]));
  });
  return { img, body };
}

function bubbleTile(document, tile) {
  strip(tile);
  const body = [];
  const header = tile.querySelector('.bubble-header, h3, h2');
  // eyebrow before the header
  [...tile.children].forEach((child) => {
    if (child === header) return;
    if (header && (child.compareDocumentPosition(header) & 4)) {
      // child precedes header
      if (text(child)) body.push(para(document, [...child.childNodes]));
    }
  });
  if (header) {
    const num = header.querySelector('.number');
    const label = header.querySelector('.text');
    if (num && text(num)) {
      body.push(para(document, text(num), 'h3'));
      if (label && text(label)) body.push(para(document, [...label.childNodes]));
    } else if (text(header)) {
      body.push(para(document, [...header.childNodes], 'h3'));
    }
  }
  [...tile.children].forEach((child) => {
    if (child === header || !header || !(header.compareDocumentPosition(child) & 4)) return;
    const ps = child.querySelectorAll('p, ul, ol');
    if (ps.length) ps.forEach((p) => { if (text(p) && !p.parentElement.closest('p, ul, ol')) body.push(p); });
    else if (text(child)) body.push(para(document, [...child.childNodes]));
  });
  return { img: imgFrom(document, tile.querySelector('img')), body };
}

function genericTile(document, tile) {
  const img = imgFrom(document, tile.querySelector('img'));
  tile.querySelectorAll('img').forEach((i) => i.remove());
  strip(tile);
  const body = [];
  const ctas = [...tile.querySelectorAll('a.cds-button[href], .card-tile-button[href], .banner__content-buttonsection a[href]')];
  ctas.forEach((a) => a.remove());
  const buttons = [...tile.querySelectorAll('button')].filter((b) => text(b));
  buttons.forEach((b) => b.remove());

  let first = true;
  tile.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, table').forEach((el) => {
    if (el.parentElement.closest('p, ul, ol, table, h1, h2, h3, h4, h5, h6')) return;
    if (!text(el)) return;
    if (/^H[1-6]$/.test(el.tagName)) {
      body.push(para(document, [...el.childNodes], first ? 'h3' : 'h4'));
    } else {
      body.push(el);
    }
    first = false;
  });
  // icon-text tiles: a heading paragraph inside *-heading is the stat/label
  ctas.forEach((a) => { if (text(a)) body.push(linkPara(document, a)); });
  buttons.forEach((b) => body.push(bold(document, text(b))));
  if (!body.length && text(tile)) body.push(para(document, text(tile)));
  return { img, body };
}

function iconTextTile(document, tile) {
  const img = imgFrom(document, tile.querySelector('img'));
  tile.querySelectorAll('img').forEach((i) => i.remove());
  strip(tile);
  const body = [];
  const titleLink = tile.querySelector('.citi-icon-text-tile-plaintext a[href], h3 a[href], h2 a[href]');
  const titleEl = tile.querySelector('.citi-icon-text-tile-plaintext h1, .citi-icon-text-tile-plaintext h2, .citi-icon-text-tile-plaintext h3, .citi-icon-text-tile-plaintext p');
  if (titleEl && text(titleEl)) {
    const h = document.createElement('h3');
    if (titleLink) {
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = text(titleLink);
      h.append(a);
    } else {
      h.textContent = text(titleEl);
    }
    body.push(h);
  }
  tile.querySelectorAll('[class*="tile-heading"] p, [class*="tile-heading"] h3, [class*="tile-heading"] h4').forEach((p) => {
    if (text(p)) body.push(bold(document, text(p)));
  });
  tile.querySelectorAll('[class*="tile-description"] p, [class*="tile-description"] ul').forEach((p) => {
    if (text(p)) body.push(p);
  });
  return { img, body };
}

function linkTile(document, tile) {
  const a = tile.querySelector('a[href]');
  if (!a) return genericTile(document, tile);
  const label = text(a) || a.getAttribute('aria-label') || '';
  return { img: imgFrom(document, tile.querySelector('img')), body: label ? [linkPara(document, a, label)] : [] };
}

/* ---------- variant detection ---------- */

function colourName(style) {
  const m = (style || '').match(/background(?:-color)?\s*:\s*rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return null;
  const [r, g, b] = m.slice(1, 4).map(Number);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (r > 150 && r > g * 2 && r > b * 2) return 'red';
  if (g > r + 40 && g > b + 40) return 'green';
  if (max - min < 20) return lum < 0.25 ? 'dark' : 'grey';
  if (r < 40 && g > 80) return 'cyan';
  if (b > r + 20) return 'blue';
  return 'other';
}

function detectVariant(element, tiles) {
  if (element.matches('.rtb-tiles') || element.querySelector('.rtb-tiles')) return 'icon-links';
  if (tiles.length && tiles.every((t) => t.matches('.tile-container'))) return 'icon-links';
  if (element.querySelector('.citi-icon-text-tile') || /column-control-background-color-elp-lto/.test(element.className || '')) return 'with-image';
  if (element.matches('ul.accelerator-container-bar') || element.querySelector('ul.accelerator-container-bar, li.accelerator-bar')) return 'rate-strip';
  const coloured = tiles.filter((t) => t.matches('.accelerator-bar') && /background/.test(t.getAttribute('style') || ''));
  if (coloured.length) {
    const names = [...new Set(coloured.map((t) => colourName(t.getAttribute('style'))).filter(Boolean))];
    const order = ['blue', 'cyan', 'dark', 'grey', 'red'];
    if (names.every((n) => order.includes(n))) {
      const combo = names.sort((a, b) => order.indexOf(a) - order.indexOf(b)).join('-');
      if (COLOUR_VARIANTS.includes(combo)) return combo;
    }
    return 'coloured-tiles-with-icons';
  }
  if (element.querySelector('.accelerator-bar.tile-width')) return 'coloured-tiles-with-icons';
  return null;
}

/* ---------- parse ---------- */

const TILE_SELECTOR = [
  '.accelerator-bar',
  '.bubble-section',
  'cds-card-column-info',
  '.card-info-col',
  'section.banner',
  '.tile-container',
  '.citi-column-control__grid__cell',
].join(', ');

export default function parse(element, { document, params }) {
  const cells = [];
  let tiles = [...element.querySelectorAll(TILE_SELECTOR)];
  if (element.matches(TILE_SELECTOR)) tiles.unshift(element);
  tiles = tiles.filter((t) => !tiles.some((o) => o !== t && o.contains(t)));
  if (!tiles.length) {
    tiles = [...element.querySelectorAll(':scope > ul > li, :scope > li')];
  }
  if (!tiles.length) tiles = [...element.children];

  const variant = detectVariant(element, tiles);
  // notes that sit outside the tiles (e.g. benefits explainer under accelerator tiles)
  const notes = [...element.querySelectorAll('.benefits-explainer-center, .accelerator-disclaimer')]
    .filter((n) => !tiles.some((t) => t.contains(n)) && text(n));

  tiles.forEach((tile) => {
    let res;
    if (tile.matches('.accelerator-bar')) res = acceleratorTile(document, tile);
    else if (tile.matches('.bubble-section')) res = bubbleTile(document, tile);
    else if (tile.matches('.tile-container')) res = linkTile(document, tile);
    else if (tile.querySelector('.citi-icon-text-tile')) res = iconTextTile(document, tile);
    else res = genericTile(document, tile);
    const body = res.body.filter(Boolean);
    if (!body.length && !res.img) return;
    const bodyCell = document.createElement('div');
    bodyCell.append(...body);
    cells.push(pad([res.img || '', text(bodyCell) ? bodyCell : '']));
  });

  notes.forEach((n) => {
    const p = document.createElement('p');
    p.textContent = text(n);
    cells.push(pad(['', p]));
  });

  if (!cells.length) {
    const div = document.createElement('div');
    div.append(...element.childNodes);
    cells.push(pad(['', div]));
  }

  const name = variant ? `cards-highlight (${variant})` : 'cards-highlight';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
