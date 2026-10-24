/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-media
 * Source: suncorp.com.au two-column grids (text beside image, text beside text,
 * award badge boxes, cookie-type label/definition grids).
 *
 * Block table (blocks/columns-media/README.md): one row, one cell per column in
 * visual order: text cells (heading, paragraphs, lists, CTA links) and media cells
 * (one picture or a stack). Text columns holding complex content (accordions,
 * flextables, tables, video) are moved to a fragment: the cell holds the
 * /fragments/ link and the content goes onto params.fragments as { element, path }.
 * Rich text above the grid stays as default content before the block.
 *
 * Variant classes (from markup, matching the catalog's base names; numbered
 * catalog variants such as image-right-4 differ only visually and map to the base):
 *   alt          - more than two columns
 *   image-left   - media column first
 *   wide-right   - media column last, stacking several images
 *   image-right  - media column last
 *   wide         - two text columns, the first narrower
 *   image-left-2 - two text columns, the second narrower
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

const COMPLEX = '.sg-Accordion, .sg-Flextable, table, section.video, .youtube-video, .sg-Carousel';

function pagePath(document, params) {
  let u = params && params.originalURL;
  if (!u) {
    try {
      const canonical = document.querySelector('link[rel="canonical"]');
      u = (canonical && canonical.href) || document.location.href;
    } catch (e) { /* ignore */ }
  }
  try {
    const p = new URL(u).pathname.replace(/\.html?$/, '').replace(/^\/+|\/+$/g, '');
    return p || 'index';
  } catch (e) {
    return 'page';
  }
}

function slugify(s) {
  return (s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 50).replace(/-+$/, '') || 'content';
}

function colWidth(col) {
  const m = col.className.match(/sg-Grid-col(\d+)--xlarge/) || col.className.match(/sg-Grid-col(\d+)--large/)
    || col.className.match(/sg-Grid-col(\d+)(?:\s|$)/);
  return m ? Number(m[1]) : 12;
}

function mediaColumns(element) {
  const rows = [...element.querySelectorAll('.sg-Grid-row')]
    .filter((r) => [...r.children].filter(hasContent).length >= 2);
  const inner = rows.filter((r) => ![...r.querySelectorAll('.sg-Grid-row')].some((o) => rows.includes(o)));
  if (inner.length) return inner.flatMap((r) => [...r.children].filter(hasContent));
  // A canvas holding one single-row flextable (text cell beside an image cell, e.g. the
  // "My Home rewards" panel): the flextable cells are the columns, instead of the whole
  // canvas going to one fragment cell.
  const tables = topLevel(element, '.sg-Flextable');
  if (tables.length === 1 && tables[0] !== element) {
    const cells = [...tables[0].children].filter((c) => c.matches('.sg-Flextable-cell') && hasContent(c));
    const cols = colCount(tables[0]);
    if (cells.length >= 2 && cells.length === cols && cells.some(isMedia)
      && !cells.some((c) => c.querySelector(COMPLEX))) return cells;
  }
  return [element];
}

function isMedia(col) {
  if (!col.querySelector('img')) return false;
  const clone = col.cloneNode(true);
  clone.querySelectorAll('img, style, script, .image-data-container').forEach((e) => e.remove());
  return !text(clone) && !clone.querySelector('a[href]:not(.Image-linkWrapper), table, ul, ol');
}

function mediaVariant(columns) {
  if (columns.length > 2) return 'alt';
  if (columns.length < 2) return null;
  const media = columns.map(isMedia);
  if (media[0] && !media[1]) return 'image-left';
  if (media[1] && !media[0]) {
    return columns[1].querySelectorAll('img').length > 1 ? 'wide-right' : 'image-right';
  }
  if (!media[0] && !media[1]) {
    const [a, b] = columns.map(colWidth);
    if (a < b) return 'wide';
    if (a > b) return 'image-left-2';
  }
  return null;
}

export default function parse(element, { document, params }) {
  const columns = mediaColumns(element);
  const variant = mediaVariant(columns);
  const inColumns = (el) => columns.some((c) => c.contains(el) || el.contains(c));

  // Rich text above / outside the grid stays as default content before the block.
  const before = [];
  if (columns[0] !== element) {
    topLevel(element, 'div.rte').filter((r) => !inColumns(r) && hasContent(r)).forEach((r) => {
      cleanNode(r);
      before.push(...flatten([...r.childNodes], document));
    });
  }

  const row = columns.map((col, i) => {
    if (isMedia(col)) {
      const cell = document.createElement('div');
      [...col.querySelectorAll('img')]
        .filter((img) => !img.classList.contains('vs-badge-image') || img.classList.contains('badge-desktop'))
        .forEach((img) => {
          const link = img.closest('a[href]');
          const p = document.createElement('p');
          if (link) {
            const a = document.createElement('a');
            a.href = link.getAttribute('href');
            a.append(img);
            p.append(a);
          } else {
            p.append(img);
          }
          cell.append(p);
        });
      return cell;
    }
    const complex = col.querySelector(COMPLEX) && params && Array.isArray(params.fragments);
    cleanNode(col);
    const cell = document.createElement('div');
    if (complex) {
      // keep the column's structure for the fragment document
      cell.append(...col.childNodes);
      const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
      const base = `/fragments/${pagePath(document, params)}/${slugify(text(heading) || `column-${i + 1}`)}`;
      let path = base;
      let n = 2;
      while (params.fragments.some((f) => f.path === path)) { path = `${base}-${n}`; n += 1; }
      params.fragments.push({ element: cell, path });
      const a = document.createElement('a');
      a.href = path;
      a.textContent = path;
      return a;
    }
    col.querySelectorAll('a.sg-Btn').forEach((a) => {
      a.textContent = text(a);
      a.removeAttribute('class');
    });
    cell.append(...flatten([...col.childNodes], document));
    return cell;
  });

  const name = variant ? `columns-media (${variant})` : 'columns-media';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
  if (before.length) element.before(...before);
  element.replaceWith(block);
}
