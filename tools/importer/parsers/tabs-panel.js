/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-panel
 * Source: suncorp.com.au sg-Tab components (button.sg-Tab-item labels over
 * div[role=tabpanel] panels): covered / not-covered item tiles, claim steps,
 * quick facts with accordions.
 *
 * Block table (blocks/tabs-panel/README.md): one row per tab,
 *   [tab label] [panel content | link to a /fragments/ path]
 * Panels holding complex content (tile grids, accordions, flextables, nested
 * canvases, images) are moved to a fragment: the cell holds the /fragments/ link
 * and the content goes onto params.fragments as { element, path }. Inside the
 * fragment, tile grids become a 'cards-feature (link-tiles)' block and accordions
 * an 'accordion-panel' block; everything else is flattened to default content.
 * A heading above the tab strip stays as default content before the block.
 *
 * Variant classes (from markup, matching the catalog names):
 *   tiles  - panels are grids of linked item tiles
 *   steps  - lifted tab bar (Tab--liftUp) whose panels are step-by-step sections
 *   shadow - panels made of shadowed content boxes
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

const COMPLEX = 'a.contentBoxContainer, .sg-Accordion, .sg-Flextable, .canvas__container, .sg-Grid, img, table, section.video, .youtube-video';

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
    .replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'tab';
}

function tilesBlock(tiles, document) {
  const cells = tiles.map((tile) => {
    const img = tile.querySelector('img');
    const a = document.createElement('a');
    a.href = tile.getAttribute('href');
    a.textContent = text(tile);
    const p = document.createElement('p');
    p.append(a);
    let media = '';
    if (img) {
      media = document.createElement('img');
      media.src = img.getAttribute('src');
      media.alt = img.getAttribute('alt') || '';
    }
    return [media, p];
  }).filter(([, p]) => text(p));
  return WebImporter.Blocks.createBlock(document, { name: 'cards-feature (link-tiles)', cells });
}

function accordionBlock(accordions, document) {
  const cells = accordions.map((acc) => {
    const label = acc.querySelector('.sg-Accordion-label');
    const panel = acc.querySelector('.sg-Accordion-content');
    const body = document.createElement('div');
    if (panel) {
      cleanNode(panel);
      body.append(...flatten([...panel.childNodes], document));
    }
    return [text(label) || 'Details', body];
  });
  return WebImporter.Blocks.createBlock(document, { name: 'accordion-panel', cells });
}

/** Panel content for a fragment: blocks for tiles / accordions, rest flattened. */
function fragmentContent(panel, document) {
  cleanNode(panel);
  const out = document.createElement('div');
  // Group consecutive tiles and consecutive accordions into one block each.
  const tiles = topLevel(panel, 'a.contentBoxContainer');
  if (tiles.length) {
    const block = tilesBlock(tiles, document);
    tiles[0].before(block);
    tiles.forEach((t) => t.remove());
  }
  const accs = topLevel(panel, '.sg-Accordion');
  if (accs.length) {
    const block = accordionBlock(accs, document);
    accs[0].before(block);
    accs.forEach((a) => a.remove());
  }
  panel.querySelectorAll('a.sg-Btn').forEach((a) => {
    a.textContent = text(a);
    a.removeAttribute('class');
  });
  // Flatten (generated block tables are kept intact as block-level nodes).
  out.append(...flatten([...panel.childNodes], document));
  return out;
}

function tabsVariant(element, panels) {
  if (panels.some((p) => p.querySelector('a.contentBoxContainer'))) return 'tiles';
  if (element.matches('.Tab--liftUp') || element.querySelector('.Tab--liftUp')) return 'steps';
  if (panels.some((p) => p.querySelector('[class*="sg-u-boxShadow"]'))) return 'shadow';
  return null;
}

export default function parse(element, { document, params }) {
  const tabRoot = element.querySelector('.sg-Tab') ? element : element;
  const buttons = [...tabRoot.querySelectorAll('.sg-Tab > button.sg-Tab-item, .sg-Tab > .sg-Tab-item, button.sg-Tab-item')]
    .filter((b, i, arr) => arr.indexOf(b) === i);
  const panels = [...tabRoot.querySelectorAll('.sg-Tab--panelContainer > [role="tabpanel"]')];
  const variant = tabsVariant(element, panels);

  // Heading above the tab strip stays as default content.
  const tabsEl = element.matches('.Tab--default, .Tab--liftUp') ? element
    : element.querySelector('.Tab--default, .Tab--liftUp') || (element.querySelector('.sg-Tab--panelContainer') || {}).parentElement;
  const before = [];
  if (tabsEl && tabsEl !== element) {
    topLevel(element, 'div.rte').filter((r) => !tabsEl.contains(r) && hasContent(r)).forEach((r) => {
      cleanNode(r);
      before.push(...flatten([...r.childNodes], document));
    });
  }

  const cells = panels.map((panel, i) => {
    const label = text(buttons[i]) || `Tab ${i + 1}`;
    if (panel.querySelector(COMPLEX) && params && Array.isArray(params.fragments)) {
      const base = `/fragments/${pagePath(document, params)}/${slugify(label)}`;
      let path = base;
      let n = 2;
      while (params.fragments.some((f) => f.path === path)) { path = `${base}-${n}`; n += 1; }
      params.fragments.push({ element: fragmentContent(panel, document), path });
      const a = document.createElement('a');
      a.href = path;
      a.textContent = path;
      return [label, a];
    }
    cleanNode(panel);
    const cell = document.createElement('div');
    cell.append(...flatten([...panel.childNodes], document));
    return [label, cell];
  });

  const name = variant ? `tabs-panel (${variant})` : 'tabs-panel';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (before.length) element.before(...before);
  element.replaceWith(block);
}
