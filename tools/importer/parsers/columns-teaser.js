/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-teaser
 * Source: suncorp.com.au single FAQ teasers (one sg-Accordion), boxed quick-link
 * menus (staticLinksMenu inside a shadowed content box) and grey image + text boxes.
 *
 * Block table (blocks/columns-teaser/README.md):
 *   default - [question] [answer]; a complex answer (tables, flextables, images,
 *             video) goes to a fragment: the cell holds the /fragments/ link and the
 *             content goes onto params.fragments as { element, path }
 *   shadow  - one row of cells, each an (icon +) link
 *   grey    - one row: [image] [heading, text, CTA]
 *
 * Variant classes (from markup): shadow = static link menu; grey = image + text
 * flextable / content box; default = accordion teaser.
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

const COMPLEX = '.sg-Flextable, .sg-Grid, table, img, video, iframe, .sg-Accordion, .youtubevideo, section.video';

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
    .replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'item';
}

function link(document, href, label) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  return a;
}

function teaserFromAccordion(acc, document, params) {
  const label = acc.querySelector('.sg-Accordion-label, button');
  const panel = acc.querySelector('.sg-Accordion-content');
  const question = text(label) || 'Details';
  const answer = document.createElement('div');
  if (panel) {
    cleanNode(panel);
    answer.append(...panel.childNodes);
  }
  if (answer.querySelector(COMPLEX) && params && Array.isArray(params.fragments)) {
    const base = `/fragments/${pagePath(document, params)}/${slugify(question)}`;
    let path = base;
    let n = 2;
    while (params.fragments.some((f) => f.path === path)) { path = `${base}-${n}`; n += 1; }
    params.fragments.push({ element: answer, path });
    return [question, link(document, path, path)];
  }
  const flat = document.createElement('div');
  flat.append(...flatten([...answer.childNodes], document));
  return [question, flat];
}

export default function parse(element, { document, params }) {
  let variant = null;
  let cells;
  const acc = element.matches('.sg-Accordion') ? element : element.querySelector('.sg-Accordion');
  const menu = element.querySelector('.staticLinksMenu ul.sg-Menu, ul.sg-Menu');

  if (menu && !acc) {
    variant = 'shadow';
    const row = [...menu.children].map((li) => li.querySelector('a[href]'))
      .filter((a) => a && text(a))
      .map((a) => {
        const p = document.createElement('p');
        p.append(link(document, a.getAttribute('href'), text(a)));
        return p;
      });
    cells = [row];
  } else if (acc) {
    cells = [teaserFromAccordion(acc, document, params)];
  } else {
    variant = 'grey';
    const units = cardUnits(element);
    const parts = units.cards.flat();
    const img = mainImage(parts);
    if (img) {
      const wrap = img.closest('.img-wrapper, .adaptive-image, .image-wrapper');
      img.remove();
      if (wrap && !hasContent(wrap)) wrap.remove();
    }
    parts.forEach(cleanNode);
    const body = document.createElement('div');
    body.append(...flatten(parts.flatMap((p) => [...p.childNodes]), document));
    body.querySelectorAll('a.sg-Btn').forEach((a) => {
      a.textContent = text(a);
      a.removeAttribute('class');
    });
    cells = [img ? [img, body] : [body]];
  }

  const name = variant ? `columns-teaser (${variant})` : 'columns-teaser';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
