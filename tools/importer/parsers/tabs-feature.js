/* eslint-disable */
/* global WebImporter */

/**
 * tabs-feature parser.
 *
 * Block table (see blocks/tabs-feature/README.md): one row per tab,
 *   cell 1 = tab label (optional icon <img> + text)
 *   cell 2 = panel content, or a single link to a fragment when the panel holds
 *            other blocks.
 *
 * Tabs / panels (fallback chains, paired by document order):
 *   tabs:   button.tab-label (cds-tab-bar-group) | button.tab-control (mkt-tab-list) |
 *           .nav-tabs > li (aem-tab-group) | [role=tab]
 *   panels: .tab-bar-panel | mkt-tab-panel | .x-tab | [role=tabpanel]
 *   The dropdown copy of the tabs (mobile <select>) is dropped; tooltip copy is kept.
 *
 * Panels: rich text stays inline. A panel laid out as a grid / columns / cards
 * (2+ similar column units) is pushed to params.fragments as
 *   /fragments/<page-path>/<slugified tab label>
 * holding the panel copy in document order with the grid as a section-subnav block (one column per unit); the
 * panel cell holds the link (text = href). Without params.fragments the panel
 * content stays inline (columns flattened in order). Empty panels (content not
 * rendered in the capture) leave the panel cell empty.
 *
 * Variants (generic cues):
 *   underlined-text-tabs-2 - aem-tab-group / ul.nav-tabs text tabs
 *   text-tabs-on-band      - cds-tab-bar-group with the dark theme
 *   icon-tiles-2           - light cds-tab-bar-group with icon tabs, large tiles
 *   icon-tiles             - light cds-tab-bar-group with icon tabs
 *   plain                  - anything else (e.g. mkt-tab-list icon tabs)
 * Font icons (cds-icon) have no asset, so icon-tile labels are text only.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanHref(href) {
  const h = (href || '').trim();
  if (!h || h === 'null' || h === 'undefined' || /^javascript:/i.test(h)) return '#';
  return h;
}

function isRealHref(href) {
  const h = cleanHref(href);
  return h !== '#' && !h.startsWith('#');
}

function imgSrc(img) {
  if (!img) return '';
  const candidates = [
    img.getAttribute('src'),
    img.getAttribute('data-src'),
    (img.getAttribute('srcset') || img.getAttribute('data-srcset') || '').split(/[\s,]+/)[0],
  ];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function isContentImg(img) {
  if (!imgSrc(img)) return false;
  if (/sprite/i.test(`${img.getAttribute('class') || ''} ${imgSrc(img)}`)) return false;
  return true;
}

function makeImg(document, img) {
  const n = document.createElement('img');
  n.setAttribute('src', imgSrc(img));
  const alt = (img.getAttribute('alt') || '').trim();
  n.setAttribute('alt', alt === 'null' ? '' : alt);
  return n;
}

const SKIP = '.select-controls, .mkt-dropdown, .triangle, hr, script, style, svg, cds-icon, citi-icon2, citi-modal, cds-modal-dialog, [role="dialog"], .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, input, select, textarea, noscript, template';
const BLOCKISH = 'h1, h2, h3, h4, h5, h6, p, ul, ol, div, section, article, table, img, picture, li';

function hasContent(el) {
  return !!(textOf(el) || [...el.querySelectorAll('img')].some(isContentImg) || (el.tagName === 'IMG' && isContentImg(el)));
}

/** Inline copy: keep text, formatting and real links; unwrap footnote/JS anchors. */
function inlineClone(document, el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(`${SKIP}, img, picture, button`).forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = cleanHref(a.getAttribute('href'));
    // footnote references (in <sup> / .foot-note) without a real target -> plain text;
    // other in-page / JS-only anchors stay links ("#..." kept, JS -> "#")
    const footnote = a.closest('sup') || /foot-?note/i.test(a.getAttribute('class') || '');
    if (!isRealHref(href) && footnote) { a.replaceWith(...a.childNodes); return; }
    a.setAttribute('href', href);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name !== 'href') n.removeAttribute(a.name); });
  });
  // unwrap layout wrappers and framework custom elements (e.g. <app-image>)
  clone.querySelectorAll('span, div, font').forEach((n) => n.replaceWith(...n.childNodes));
  [...clone.querySelectorAll('*')].reverse().forEach((n) => {
    if (n.tagName.includes('-')) n.replaceWith(...n.childNodes);
  });
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  clone.querySelectorAll('b, strong, i, em, u, sup, sub').forEach((n) => {
    if (!n.textContent.trim()) n.remove();
  });
  return clone;
}

/** Trim leading/trailing <br> and whitespace inside an element (and its links). */
function tidy(el) {
  const edge = (pick) => {
    for (let n = pick(el); n; n = pick(el)) {
      if ((n.nodeType === 1 && n.tagName === 'BR') || (n.nodeType === 3 && !n.textContent.trim())) n.remove();
      else break;
    }
  };
  edge((e) => e.firstChild);
  edge((e) => e.lastChild);
  [el, ...el.querySelectorAll('a')].forEach((n) => {
    const f = n.firstChild;
    if (f && f.nodeType === 3) f.textContent = f.textContent.replace(/^\s+/, '');
    const l = n.lastChild;
    if (l && l.nodeType === 3) l.textContent = l.textContent.replace(/\s+$/, '');
  });
  return el;
}

function blockEl(document, tag, src) {
  const el = document.createElement(tag);
  el.append(...inlineClone(document, src).childNodes);
  return tidy(el);
}

function linkPara(document, a) {
  const label = textOf(inlineClone(document, a));
  if (!label) return null;
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.setAttribute('href', cleanHref(a.getAttribute('href')));
  link.append(...inlineClone(document, a).childNodes);
  tidy(link);
  p.append(link);
  return p;
}

/** Column content in document order; images become their own paragraphs. */
function columnContent(document, root, { skipImgs, replace } = {}) {
  const out = [];
  const pushImg = (img) => {
    if (skipImgs || !isContentImg(img)) return;
    const p = document.createElement('p');
    p.append(makeImg(document, img));
    out.push(p);
  };
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(SKIP)) return;
      if (replace && replace.has(child)) { out.push(replace.get(child)); return; }
      const tag = child.tagName;
      if (tag === 'IMG') { pushImg(child); return; }
      if (/^H[1-6]$/.test(tag)) {
        if (textOf(child)) out.push(blockEl(document, tag.toLowerCase(), child));
        return;
      }
      if (tag === 'P') {
        child.querySelectorAll('img').forEach(pushImg);
        if (textOf(inlineClone(document, child))) out.push(blockEl(document, 'p', child));
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        const list = document.createElement(tag.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          if (!textOf(li)) return;
          const item = document.createElement('li');
          // headed list items (h3 + description) -> bold lead-in
          const h = li.querySelector('h1, h2, h3, h4, h5, h6');
          if (h) {
            const strong = document.createElement('strong');
            strong.append(...inlineClone(document, h).childNodes);
            item.append(strong);
            const rest = li.cloneNode(true);
            rest.querySelector('h1, h2, h3, h4, h5, h6').remove();
            const restInline = inlineClone(document, rest);
            if (textOf(restInline)) item.append(document.createElement('br'), ...restInline.childNodes);
          } else {
            const links = li.querySelectorAll('a[href]');
            item.append(...inlineClone(document, li).childNodes);
            // keep nav-style links that inlineClone dropped (JS-only hrefs)
            if (!item.querySelector('a') && links.length === 1 && textOf(links[0]) === textOf(li)) {
              item.replaceChildren(linkPara(document, links[0]).firstChild);
            }
          }
          // paragraphs inside list items -> inline lines
          [...item.querySelectorAll('p')].forEach((p, pi) => {
            if (pi > 0 || p.previousSibling) p.before(document.createElement('br'));
            p.replaceWith(...p.childNodes);
          });
          tidy(item);
          if (textOf(item)) list.append(item);
        });
        if (list.children.length) out.push(list);
        return;
      }
      if (tag === 'A' || tag === 'BUTTON') {
        child.querySelectorAll('img').forEach(pushImg);
        if (tag === 'A') {
          const p = linkPara(document, child);
          if (p) out.push(p);
        } else if (textOf(child)) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.setAttribute('href', '#');
          a.textContent = textOf(child);
          p.append(a);
          out.push(p);
        }
        return;
      }
      if (tag === 'TABLE') {
        out.push(child.cloneNode(true));
        return;
      }
      const hasBlockChild = child.querySelector(BLOCKISH);
      if (!hasBlockChild) {
        if (textOf(inlineClone(document, child))) {
          // tile titles rendered as divs (div.title / .lTitle) -> heading
          const isTitle = /(^|\s)(title|[a-z]*Title|header|heading)(\s|$)/.test(child.getAttribute('class') || '')
            && textOf(child).length < 120;
          out.push(blockEl(document, isTitle ? 'h3' : 'p', child));
        }
        return;
      }
      // inline run with own text next to block children (e.g. <b>text</b> + <sup>)
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (ownText && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, section, table')) {
        child.querySelectorAll('img').forEach(pushImg);
        out.push(blockEl(document, 'p', child));
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return out;
}

/** Signature used to decide whether siblings are a repeating unit. */
function sig(el) {
  const first = ((el.getAttribute('class') || '').split(/\s+/).filter((c) => c && !/^(ng-|col-|d-|p[xytblr]?-|m[xytblr]?-|w-|h-|align-|justify-|flex-|tile-\d|offset-)/.test(c))[0]) || '';
  return `${el.tagName}.${first}`;
}

const INLINE_TAGS = /^(A|SPAN|B|STRONG|I|EM|U|SUP|SUB|BUTTON|SMALL|BR|LABEL|H[1-6]|P|LI|UL|OL|IMG|PICTURE|TABLE)$/;

function findUnits(element) {
  let node = element;
  for (let depth = 0; depth < 15 && node; depth += 1) {
    const kids = [...node.children].filter((c) => !c.matches(SKIP) && hasContent(c));
    if (!kids.length) return [node];
    if (kids.length === 1) {
      if (INLINE_TAGS.test(kids[0].tagName)) return [node];
      node = kids[0];
      continue;
    }
    if (kids.some((k) => INLINE_TAGS.test(k.tagName))) return [node];
    const sigs = kids.map(sig);
    const tags = new Set(kids.map((k) => k.tagName));
    if (new Set(sigs).size === 1 || tags.size === 1) return kids;
    return [node];
  }
  return [element];
}


function slugify(s) {
  return (s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim()
    .replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function pagePath(params) {
  try {
    if (params && params.originalURL) return new URL(params.originalURL).pathname.replace(/\.html$/, '').replace(/\/$/, '');
  } catch (e) { /* ignore */ }
  return '';
}

/** First selector (in priority order) that matches 1+ elements. */
function firstAll(root, selectors) {
  for (const s of selectors) {
    const found = [...root.querySelectorAll(s)];
    if (found.length) return found.filter((el, i) => !found.some((o, j) => j !== i && o.contains(el)));
  }
  return [];
}

/** Grid units in a panel: deepest node with 2+ similar block children. */
function panelUnits(panel) {
  const units = findUnits(panel);
  if (units.length >= 2 && new Set(units.map(sig)).size === 1) return units;
  // grids wrapped together with intro copy: look for a nested grid
  const candidates = [...panel.querySelectorAll('div, section, ul')].filter((n) => {
    if (n.tagName === 'UL') return false;
    const kids = [...n.children].filter((c) => !c.matches(SKIP) && hasContent(c) && !INLINE_TAGS.test(c.tagName));
    if (kids.length < 2) return false;
    const sigs = new Set(kids.map(sig));
    return sigs.size === 1 && kids.every((k) => k.querySelector('h1, h2, h3, h4, h5, h6, p, ul'));
  });
  if (!candidates.length) return units.length >= 2 ? units : null;
  const outer = candidates.find((c) => !candidates.some((o) => o !== c && o.contains(c)));
  return [...outer.children].filter((c) => !c.matches(SKIP) && hasContent(c));
}

function buildPanel(document, panel, label, params, base) {
  if (!panel || !hasContent(panel)) return '';
  const units = panelUnits(panel);
  if (units && units.length >= 2) {
    const container = units[0].parentElement;
    const cols = units.map((u) => columnContent(document, u)).filter((c) => c.length);
    if (params && Array.isArray(params.fragments)) {
      const rows = [];
      if (cols.length > 4) {
        for (let i = 0; i < cols.length; i += 3) {
          const chunk = cols.slice(i, i + 3);
          while (chunk.length < 3) chunk.push('');
          rows.push(chunk);
        }
      } else {
        rows.push(cols);
      }
      // panel copy in document order, with the grid replaced by a section-subnav block
      const grid = WebImporter.Blocks.createBlock(document, { name: 'section-subnav', cells: rows });
      const fragment = document.createElement('div');
      fragment.append(...columnContent(document, panel, { replace: new Map([[container, grid]]) }));
      if (!grid.isConnected && !fragment.contains(grid)) fragment.append(grid);
      const path = `/fragments/${(base || '/tabs-feature').replace(/^\//, '')}/${slugify(label) || 'tab'}`;
      params.fragments.push({ element: fragment, path });
      const a = document.createElement('a');
      a.setAttribute('href', path);
      a.textContent = path;
      return [a];
    }
    return columnContent(document, panel);
  }
  const content = columnContent(document, panel);
  return content.length ? content : '';
}

export default function parse(element, { document, params }) {
  const cells = [];
  const base = pagePath(params);

  const tabs = firstAll(element, ['button.tab-label', 'button.tab-control', '.nav-tabs > li', '[role="tab"]'])
    .filter((t) => !t.closest('select, .select-controls'));
  const panels = firstAll(element, ['.tab-bar-panel', 'mkt-tab-panel', '.x-tab', '[role="tabpanel"]']);

  tabs.forEach((tab, i) => {
    const labelEl = tab.querySelector('.tab-label-text') || tab;
    const label = textOf([...labelEl.childNodes].length ? (() => {
      const c = labelEl.cloneNode(true);
      c.querySelectorAll(SKIP).forEach((n) => n.remove());
      return c;
    })() : labelEl);
    if (!label) return;
    const labelCell = [];
    const icon = [...tab.querySelectorAll('img')].find(isContentImg);
    if (icon) {
      const p = document.createElement('p');
      p.append(makeImg(document, icon));
      labelCell.push(p);
    }
    const lp = document.createElement('p');
    lp.textContent = label;
    labelCell.push(lp);

    // panel: aria-controls / id match first, else by index
    const control = tab.matches('a, button') ? tab : (tab.querySelector('a, button') || tab);
    const controls = control.getAttribute('aria-controls');
    const panel = (controls && panels.find((p) => p.id === controls)) || panels[i] || null;
    cells.push([labelCell, buildPanel(document, panel, label, params, base)]);
  });

  let variant = null;
  const group = element.matches('cds-tab-bar-group') ? element : element.querySelector('cds-tab-bar-group');
  if (element.querySelector('.nav-tabs, aem-tab-group')) {
    variant = 'underlined-text-tabs-2';
  } else if (group) {
    const cls = group.getAttribute('class') || '';
    const iconTabs = !!element.querySelector('.tab-icon-content, .tab-label img, .tab-label cds-icon');
    if (/theme-dark/.test(cls)) variant = 'text-tabs-on-band';
    else if (iconTabs && element.querySelector('.large-tabs')) variant = 'icon-tiles-2';
    else if (iconTabs) variant = 'icon-tiles';
  }

  const name = variant ? `tabs-feature (${variant})` : 'tabs-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
