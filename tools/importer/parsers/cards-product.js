/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Source: suncorp.com.au product cards (cover-level cards with badge, tag, heading,
 * tick list and quote / find-out-more buttons; shadowed sg-Card benefit cards;
 * hospital vs extras compare cards).
 *
 * Block table (blocks/cards-product/README.md): one row per card, one merged cell:
 *   leading icon image, tag paragraph, heading, text, tick list or icon list,
 *   link/button paragraphs.
 * Icon list items (li.Icon-<name>-..., other than ticks) start with :<name>: so the
 * block renders the icon; badge images repeated per breakpoint are collapsed.
 *
 * Card units: .sg-Card | flextable column runs (CSS order 1..k) | grid columns.
 *
 * Variant classes (from markup, matching the catalog names):
 *   compare    - single-cell flextable cards with a "What's included" icon list
 *   shadow     - sg-Card cards
 *   grey-light - cards on neutral (grey) cells
 *   light      - flextable cards without a badge image
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

function iconName(li) {
  const m = li.className.match(/(?:^|\s)Icon-([A-Za-z0-9]+)--/);
  if (!m || /^tick$/i.test(m[1])) return null;
  return m[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function productVariant(element, units) {
  if (units.kind === 'flextable' && units.cards.every((g) => g.length === 1)
    && element.querySelector('.sg-Type--strikeBehind, li[class*="Icon-"]:not([class*="Icon-tick"])')) return 'compare';
  if (units.kind === 'sg-card') return 'shadow';
  if (units.cards.some((g) => g.some((c) => c.matches('.sg-Flextable-cell--neutral, .sg-Cell--neutral')))) return 'grey-light';
  if (units.kind === 'flextable' && !element.querySelector('img')) return 'light';
  return null;
}

export default function parse(element, { document, params }) {
  const units = cardUnits(element);
  const variant = productVariant(element, units);

  element.querySelectorAll('li[class*="Icon-"]').forEach((li) => {
    const name = iconName(li);
    if (name && !/^:[a-z0-9-]+:/.test(text(li))) li.prepend(`:${name}: `);
  });

  const cells = units.cards.map((g) => buildCard(g, document)).filter(Boolean).map(([img, body]) => {
    const cell = document.createElement('div');
    if (img) {
      const p = document.createElement('p');
      p.append(img);
      cell.append(p);
    }
    cell.append(...body.childNodes);
    return [cell];
  });

  // Rich text outside the cards (group heading) stays as default content before the block.
  const intro = [];
  if (units.kind !== 'single') {
    const inCard = (el) => units.cards.some((g) => g.some((c) => c.contains(el) || el.contains(c)));
    topLevel(element, 'div.rte').filter((r) => !inCard(r) && hasContent(r)).forEach((r) => {
      cleanNode(r);
      intro.push(...flatten([...r.childNodes], document));
    });
  }

  const name = variant ? `cards-product (${variant})` : 'cards-product';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (intro.length) element.before(...intro);
  element.replaceWith(block);
}
