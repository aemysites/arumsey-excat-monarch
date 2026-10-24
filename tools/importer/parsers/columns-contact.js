/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-contact
 * Source: suncorp.com.au contact columns (grid columns holding a bold label and
 * phone / email / postal lines, optionally as icon flextable cells).
 *
 * Block table (blocks/columns-contact/README.md): one row, one cell per column;
 * each cell holds the label then the contact paragraphs (tel:/mailto: links,
 * opening hours). Empty spacer anchors and icon fonts are dropped.
 *
 * Variant classes (from markup, matching the catalog names):
 *   image - columns use icon rows (flextable cellIcon cells / textIcon text-image)
 *           or carry images (e.g. interpreter logo)
 *   (the catalog's `alt` grouping has the same markup as the default two-column
 *    contact boxes, so it cannot be told apart and is emitted without a class)
 */

const JUNK = 'style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)';
const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
const WRAPPER_TAGS = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function hasContent(el) {
  return !!(text(el) || el.querySelector('img'));
}

function orderOf(cell) {
  const m = (cell.getAttribute('style') || '').match(/(?:^|;)\s*order\s*:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

function colCount(table) {
  const m = table.className.match(/sg-Flextable--(\d+)cols/);
  return m ? Number(m[1]) : 0;
}

/** Group flextable cells into per-card lists. */
function flextableCards(table) {
  const cells = [...table.children].filter((c) => c.matches('.sg-Flextable-cell'));
  const cols = colCount(table);
  const orders = cells.map(orderOf);
  if (cols && cells.length > cols && cells.length % cols === 0 && orders.every((o) => o !== null)) {
    const size = cells.length / cols;
    const groups = [];
    for (let i = 0; i < cells.length; i += size) groups.push(cells.slice(i, i + size));
    const ok = groups.every((g) => g.every((c, j) => orderOf(c) === j + 1));
    if (ok) return groups;
  }
  return cells.map((c) => [c]);
}

function topLevel(root, selector) {
  const all = [...root.querySelectorAll(selector)];
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
}

/** Returns { kind, cards: Element[][] } for the element. */
function cardUnits(element) {
  const sgCards = topLevel(element, '.sg-Card');
  if (sgCards.length) return { kind: 'sg-card', cards: sgCards.map((c) => [c]) };
  const tables = element.matches('.sg-Flextable') ? [element] : topLevel(element, '.sg-Flextable');
  if (tables.length) {
    return { kind: 'flextable', cards: tables.flatMap((t) => flextableCards(t)), tables };
  }
  // innermost grid row with 2+ content columns
  const rows = [...element.querySelectorAll('.sg-Grid-row')]
    .filter((r) => [...r.children].filter(hasContent).length >= 2)
    .filter((r) => ![...r.querySelectorAll('.sg-Grid-row')].some((inner) => [...inner.children].filter(hasContent).length >= 2));
  if (rows.length) return { kind: 'grid', cards: rows.flatMap((r) => [...r.children].map((c) => [c])) };
  return { kind: 'single', cards: [[element]] };
}

/** Flattens layout wrappers into block-level nodes (p, h*, ul, ol, table). */
function flatten(nodes, document) {
  const out = [];
  let para = null;
  const flush = () => {
    if (para && (text(para) || para.querySelector('img'))) out.push(para);
    para = null;
  };
  const walk = (node) => {
    if (node.nodeType === 3) {
      if (!node.textContent.trim()) { if (para) para.append(node); return; }
      if (!para) para = document.createElement('p');
      para.append(node);
      return;
    }
    if (node.nodeType !== 1) return;
    if (BLOCK_TAGS.test(node.tagName)) {
      flush();
      if (text(node) || node.querySelector('img')) out.push(node);
      return;
    }
    if (WRAPPER_TAGS.test(node.tagName) || (node.tagName === 'A' && node.querySelector('div, p, h1, h2, h3, h4, h5, h6, header, section'))) {
      flush();
      [...node.childNodes].forEach(walk);
      flush();
      return;
    }
    if (node.tagName === 'BR' && !para) return;
    if (!para) para = document.createElement('p');
    para.append(node);
  };
  nodes.forEach((n) => walk(n));
  flush();
  return out;
}

function cleanNode(root) {
  root.querySelectorAll(JUNK).forEach((el) => el.remove());
  root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
  root.querySelectorAll('img.vs-badge-image:not(.badge-desktop)').forEach((img) => img.remove());
}

/** Main card image: first img outside rich text (img-wrapper / adaptive image). */
function mainImage(parts) {
  for (const part of parts) {
    const imgs = part.matches && part.matches('img') ? [part] : [...part.querySelectorAll('img')];
    const img = imgs.find((i) => !i.closest('.rte, p, li'));
    if (img) return img;
  }
  return null;
}

function buildCard(parts, document) {
  parts.forEach(cleanNode);
  const img = mainImage(parts);
  // Overlay card link (a.sg-Card-inner wraps the whole card).
  let overlayHref = null;
  const OVERLAY = 'a.sg-Card-inner, a.Article--link-mask, a.sg-Card, a.contentBoxContainer, a.Image-linkWrapper';
  parts.forEach((p) => {
    const overlay = p.matches(OVERLAY) ? p : p.querySelector(OVERLAY);
    if (overlay && !overlayHref) overlayHref = overlay.getAttribute('href');
  });
  if (img) {
    const wrap = img.closest('.img-wrapper, .adaptive-image, .image-wrapper, .Image-linkWrapper');
    img.remove();
    if (wrap && !hasContent(wrap)) wrap.remove();
  }
  const blocks = flatten(parts.flatMap((p) => [...p.childNodes]), document);
  // sg-Btn links: plain links in their own paragraph.
  blocks.forEach((b) => b.querySelectorAll('a.sg-Btn').forEach((a) => {
    a.textContent = text(a);
    a.removeAttribute('class');
  }));
  if (overlayHref && !blocks.some((b) => b.querySelector('a[href]'))) {
    // Rebuild the overlay link on the "Read more" line, else on the title.
    const target = blocks.slice().reverse().find((b) => /read\s+more|find\s+out\s+more|learn\s+more/i.test(text(b)))
      || blocks.find((b) => /^H[1-6]$/.test(b.tagName)) || blocks[blocks.length - 1];
    if (target) {
      const a = document.createElement('a');
      a.href = overlayHref;
      a.append(...target.childNodes);
      target.append(a);
    }
  }
  const body = document.createElement('div');
  body.append(...blocks);
  if (!hasContent(body) && !img) return null;
  return img ? [img, body] : ['', body];
}

function contactColumns(element) {
  const rows = [...element.querySelectorAll('.sg-Grid-row')]
    .filter((r) => [...r.children].filter(hasContent).length >= 1);
  const outer = rows.filter((r) => !rows.some((o) => o !== r && o.contains(r)));
  if (outer.length) return outer.flatMap((r) => [...r.children].filter(hasContent));
  return [element];
}

export default function parse(element, { document, params }) {
  const columns = contactColumns(element);
  const variant = element.querySelector('.cellIcon, .textIcon, img:not(.vs-badge-image)') ? 'image' : null;

  const cells = [columns.map((col) => {
    cleanNode(col);
    col.querySelectorAll('a[href=""], a:not([href])').forEach((a) => { if (!text(a)) a.remove(); });
    const cell = document.createElement('div');
    cell.append(...flatten([...col.childNodes], document));
    return cell;
  })];

  const name = variant ? `columns-contact (${variant})` : 'columns-contact';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
