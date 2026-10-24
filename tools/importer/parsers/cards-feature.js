/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Source: suncorp.com.au feature / icon card groups (flextable cells, grid columns,
 * linked content boxes, shadowed link tiles, video boxes).
 *
 * Block table (blocks/cards-feature/README.md): one row per card,
 *   [image (optional)] [body: heading, text, lists, CTA links]
 * plus an optional first single-cell intro row holding the group heading.
 * Videos become a YouTube link (the block embeds a cell holding only a video link).
 * Font icons (<i class="Icon-...">) are stripped by the importer before parsing.
 *
 * Card units: .sg-Card | flextable cells grouped per column (CSS order runs) |
 * grid columns | the element itself.
 *
 * The catalog also maps the header row (<tr>) of some sg-Table comparison tables
 * to this block; such a row converts the WHOLE table into a 'table-comparison'
 * block (same logic as parsers/table-comparison.js), and the other rows are then
 * detached and skipped by the importer.
 *
 * Variant classes (from markup, matching the catalog names):
 *   shadow-image / grey-image - whole-card links (a.sg-Card content boxes), grey on neutral
 *   link-tiles                - shadowed boxes with cyan top border and a button
 *   shadow                    - shadowed boxes
 *   boxed                     - bordered boxes / video boxes
 *   cyan                      - flextable cards with a separate CTA cell under a ruled cell
 *   grey                      - flextable cards on neutral cells
 *   grey-light                - grid cards on a neutral panel
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
  // carousel of step / feature boxes (e.g. the car claims process): one card per slide
  const slides = topLevel(element, '.sg-Carousel-item:not(.slick-cloned)').filter(hasContent);
  if (slides.length >= 2) return { kind: 'carousel', cards: slides.map((s) => [s]) };
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
  // a.sg-Flextable-cell: a whole flextable cell that is a link (weather event tiles).
  const OVERLAY = 'a.sg-Card-inner, a.Article--link-mask, a.sg-Card, a.contentBoxContainer, a.Image-linkWrapper, a.sg-Flextable-cell[href]';
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


// ---- table-comparison helpers (for <tr> header rows) ----

const TC_WRAPPER_TAGS = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|FIGURE|SPAN)$/;

/** Cell content: clean rich text, tick/cross icons as symbols, buttons as links. */
function cellContent(cell, document) {
  cell.querySelectorAll('style, script, noscript, .image-data-container, .image-lazyload, .sg-u-hidden:not(img)').forEach((e) => e.remove());
  cell.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
  cell.querySelectorAll('img.vs-badge-image:not(.badge-desktop)').forEach((img) => img.remove());
  const icons = [...cell.querySelectorAll('i[class*="Icon-"]')];
  icons.forEach((i) => {
    const tick = /Icon-tick/.test(i.className);
    const cross = /Icon-cross/.test(i.className);
    // Import snapshots already put ✓ / ✗ text in these icons; always keep the mark.
    if (tick || cross) i.replaceWith(document.createTextNode(tick ? '✓' : '✗'));
    else i.remove();
  });
  cell.querySelectorAll('a.sg-Btn').forEach((a) => {
    a.textContent = text(a);
    a.removeAttribute('class');
  });
  const out = document.createElement('div');
  const walk = (node, target) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 1 && TC_WRAPPER_TAGS.test(child.tagName) && child.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol, div')) {
        walk(child, target);
      } else if (child.nodeType === 1 && child.tagName === 'DIV') {
        if (text(child) || child.querySelector('img')) target.append(...child.childNodes);
      } else if (child.nodeType === 1 && child.tagName === 'P' && !text(child) && !child.querySelector('img')) {
        // drop empty spacer paragraphs
      } else {
        target.append(child);
      }
    });
  };
  walk(cell, out);
  if (!text(out) && !out.querySelector('img')) return '';
  return out;
}

function fromHtmlTable(table, document) {
  const rows = [...table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tr, :scope > tfoot > tr')];
  const cols = Math.max(...rows.map((r) => r.children.length), 0);
  return rows.map((tr) => {
    const cells = [...tr.children].map((c) => cellContent(c, document));
    while (cells.length < cols) cells.push('');
    return cells;
  });
}

function fromFlextable(flex, document) {
  let cells = [...flex.children].filter((c) => c.matches('.sg-Flextable-cell'));
  const orders = cells.map(orderOf);
  const groups = new Map();
  if (orders.every((o) => o !== null)) {
    cells.forEach((c) => {
      const o = orderOf(c);
      if (!groups.has(o)) groups.set(o, []);
      groups.get(o).push(c);
    });
  } else {
    const n = Number((flex.className.match(/sg-Flextable--(\d+)cols/) || [])[1]) || 1;
    for (let i = 0; i < cells.length; i += n) groups.set(i, cells.slice(i, i + n));
  }
  let rows = [...groups.keys()].sort((a, b) => a - b).map((k) => groups.get(k));
  // Columns that only hold mobile labels (visually hidden on large screens).
  const width = Math.max(...rows.map((r) => r.length));
  const hiddenCols = [];
  for (let i = 0; i < width; i += 1) {
    const body = rows.slice(1).filter((r) => r[i]);
    if (body.length && body.every((r) => r[i].matches('.sg-u-visuallyhiddenLarge'))) hiddenCols.push(i);
  }
  rows = rows.map((r) => r.filter((c, i) => !hiddenCols.includes(i) && !c.matches('.sg-u-visuallyhiddenLarge')));
  cells = null;
  const cols = Math.max(...rows.map((r) => r.length));
  return rows.map((r) => {
    const out = r.map((c) => cellContent(c, document));
    while (out.length < cols) out.push('');
    return out;
  }).filter((r) => r.some((c) => c));
}

function detectTableVariant(kind, source) {
  if (kind === 'flex') {
    const img = !!source.querySelector('img:not(.vs-badge-image), img.badge-desktop');
    const light = !!source.querySelector(':scope > .sg-Flextable-cell--neutral');
    if (img) return light ? 'image-cyan-grey-light' : 'image-cyan-grey';
    return light ? 'cyan-grey-light' : 'cyan-grey';
  }
  const firstRow = source.querySelector('tr');
  if (!firstRow) return null;
  const head = [...firstRow.children];
  if (head.some((c) => /sg-u-bg/.test(c.className))) return 'image-grey';
  if (head.length > 2 && !text(head[0]) && !head[0].querySelector('img')) return 'dark';
  return null;
}

/**
 * Converts the comparison table the element belongs to.
 * Returns { target, block } where target is the node to replace.
 */
function convertComparison(element, document) {
  let target = element;
  let table = null;
  let flex = null;
  if (element.matches('tr, td, th, thead, tbody')) {
    table = element.closest('table');
    target = table.closest('.sg-Overflow-container') || table;
  } else if (element.matches('table')) {
    table = element;
  } else {
    table = element.querySelector('table');
    if (!table) flex = element.matches('.sg-Flextable') ? element : topLevel(element, '.sg-Flextable')[0];
  }

  const cells = [];
  // Intro rich text inside the element, before the table.
  if (target === element && !element.matches('table, .sg-Flextable')) {
    const tableEl = table || flex;
    topLevel(element, 'div.rte').filter((r) => tableEl && !tableEl.contains(r) && text(r))
      // eslint-disable-next-line no-bitwise
      .filter((r) => r.compareDocumentPosition(tableEl) & 4)
      .forEach((r) => {
        r.querySelectorAll('.sg-u-mediumAndSmallHidden').forEach((s) => s.classList.remove('sg-u-mediumAndSmallHidden'));
        const c = document.createElement('div');
        c.append(...r.childNodes);
        cells.push([c]);
      });
  }

  let rows = [];
  let variant = null;
  if (table) {
    variant = detectTableVariant('table', table);
    rows = fromHtmlTable(table, document);
  } else if (flex) {
    variant = detectTableVariant('flex', flex);
    rows = fromFlextable(flex, document);
  }
  // Intro rows stay single-cell: the block reads leading 1-cell rows as intro.
  cells.push(...rows);

  const name = variant ? `table-comparison (${variant})` : 'table-comparison';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  return { target, block };
}


// ---- cards-feature specific -------------------------------------------------

function videoLink(section, document) {
  const iframe = section.querySelector('iframe[src]');
  const contentUrl = section.querySelector('link[itemprop="contentUrl"]');
  let src = (iframe && iframe.getAttribute('src')) || (contentUrl && contentUrl.getAttribute('href'));
  if (!src) return null;
  const id = (src.match(/embed\/([^?&#/]+)/) || [])[1];
  if (id) src = `https://www.youtube.com/watch?v=${id}`;
  const a = document.createElement('a');
  a.href = src;
  a.textContent = src;
  return a;
}

function detectCardsVariant(element, units) {
  const boxes = [...element.querySelectorAll('.contentBoxContainer')];
  if (element.matches('.contentBoxContainer')) boxes.push(element);
  const linkedBoxes = boxes.filter((b) => b.matches('a.sg-Card, a.contentBoxContainer'));
  const neutral = (el) => el.matches('.sg-Cell--neutral, .sg-Flextable-cell--neutral')
    || !!el.querySelector('.canvas__bg_image.BgPlaceholder--neutral, .canvas__bg_image.BgPlaceholder--grey');
  if (linkedBoxes.length) return neutral(element) || linkedBoxes.some(neutral) ? 'grey-image' : 'shadow-image';
  if (boxes.some((b) => /sg-u-boxShadow/.test(b.className))) {
    if (element.querySelector('a.sg-Btn') && boxes.some((b) => b.matches('.content-box-border-top-secondary'))) return 'link-tiles';
    return 'shadow';
  }
  if (boxes.some((b) => /sg-u-border(?!TopNone)/.test(b.className) && !/u-noBorder/.test(b.className))) return 'boxed';
  if (element.querySelector('section.video, .youtube-video')) return 'boxed';
  if (units.kind === 'flextable') {
    const first = units.cards.map((g) => g[0]);
    if (first.some((c) => c.matches('.flexible-table-border-bottom-default')) && units.cards.some((g) => g.length > 1)) return 'cyan';
    if (first.every((c) => c.matches('.sg-Flextable-cell--neutral'))) return 'grey';
  }
  if (units.kind === 'grid' && neutral(element)) return 'grey-light';
  return null;
}

export default function parse(element, { document, params }) {
  // A row of an sg-Table (comparison header): convert the whole table.
  if (element.matches('tr, td, th') && element.closest('table')) {
    const { target, block } = convertComparison(element, document);
    target.replaceWith(block);
    return;
  }

  // Videos become plain links (the block embeds a cell holding only a video link).
  element.querySelectorAll('section.video, .youtube-video').forEach((v) => {
    const holder = v.closest('section.video') || v;
    if (!element.contains(holder) || !holder.isConnected) return;
    const a = videoLink(holder, document);
    if (!a) { holder.remove(); return; }
    const p = document.createElement('p');
    p.append(a);
    holder.replaceWith(p);
  });

  const units = cardUnits(element);
  const variant = detectCardsVariant(element, units);
  const cells = [];

  // Intro heading outside the cards -> first single-cell row.
  if (units.kind !== 'single') {
    const inCard = (el) => units.cards.some((g) => g.some((c) => c.contains(el) || el.contains(c)));
    const intro = [];
    topLevel(element, 'div.rte').filter((r) => !inCard(r) && hasContent(r)).forEach((r) => {
      cleanNode(r);
      intro.push(...flatten([...r.childNodes], document));
    });
    if (intro.length) {
      const c = document.createElement('div');
      c.append(...intro);
      cells.push([c]);
    }
  }

  units.cards.map((g) => buildCard(g, document)).filter(Boolean).forEach((row) => {
    // A single feature box whose only media is an icon token (own icon box above the copy):
    // the icon fills the card's media cell instead of leaving it empty.
    if (units.kind === 'single' && row[0] === '') {
      const first = row[1].firstElementChild;
      if (first && first.tagName === 'P' && /^:[a-z0-9-]+:$/.test(text(first)) && row[1].children.length > 1) {
        const media = document.createElement('div');
        media.append(first);
        row[0] = media;
      }
    }
    // A body that is only a video link goes in its own cell (rendered as embed).
    const [media, body] = row;
    const lone = body.children.length === 1 && body.querySelector('a[href*="youtube.com/watch"]');
    cells.push(lone ? [media, body] : row);
  });

  const name = variant ? `cards-feature (${variant})` : 'cards-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
