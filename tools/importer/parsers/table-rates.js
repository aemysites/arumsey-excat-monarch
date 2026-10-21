/* eslint-disable */
/* global WebImporter */

/**
 * table-rates parser.
 *
 * Block table (see blocks/table-rates/README.md): rows of cells, copied from the
 * source <table> rows (thead, tbody, tfoot in order):
 *   - a visible <caption> becomes a leading single-cell row (block caption);
 *   - the first row is the header when every cell has content;
 *   - single-cell rows (row-group toggles, sub-headings) stay single-cell (group rows);
 *   - short rows are left to the block, which pads them.
 *
 * Cleanup: sr-only duplicates, toggle icons and modal triggers without text are
 * dropped; headings inside cells become bold text; check-mark icons
 * (.chk-img / *check*) become "✓"; CTA buttons without a URL become links to "#".
 * Mobile continuation rows (tr.outer, one cell) are merged into the previous row's
 * second cell so the desktop grid is kept.
 *
 * Variant: bordered when header cells carry an inline background image
 * (th.headerData / th[style*=background]); otherwise plain.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanHref(href) {
  const h = (href || '').trim();
  if (!h || h === 'null' || h === 'undefined' || /^javascript:/i.test(h)) return '#';
  return h;
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

const SKIP = 'script, style, svg, cds-icon, cds-icon-wrapper, citi-icon2, citi-modal, cds-modal-dialog, [role="dialog"], .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, input, select, textarea, noscript, template';

function isCheck(el) {
  return el.nodeType === 1 && /(^|\s)(chk-img|check-?mark|icon-check|checkmark)(\s|$)/i.test(el.getAttribute('class') || '');
}

/** Inline copy: text, formatting, links (footnotes unwrapped when they have no target). */
function inlineNodes(document, el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(SKIP).forEach((n) => n.remove());
  clone.querySelectorAll('img, picture').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = cleanHref(a.getAttribute('href'));
    if (!textOf(a)) { a.remove(); return; }
    // footnote references to in-page anchors -> plain text (the targets are not migrated)
    if (href.startsWith('#') && (a.closest('sup') || /foot-?note/i.test(a.getAttribute('class') || ''))) {
      a.replaceWith(...a.childNodes);
      return;
    }
    a.setAttribute('href', href);
  });
  clone.querySelectorAll('button').forEach((b) => {
    if (!textOf(b)) { b.remove(); return; }
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.textContent = textOf(b);
    b.replaceWith(a);
  });
  clone.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
    const s = document.createElement('strong');
    s.append(...h.childNodes);
    h.replaceWith(s);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name !== 'href') n.removeAttribute(a.name); });
  });
  clone.querySelectorAll('span, div, font, p').forEach((n) => n.replaceWith(...n.childNodes));
  [...clone.querySelectorAll('*')].reverse().forEach((n) => {
    if (n.tagName.includes('-')) n.replaceWith(...n.childNodes);
  });
  clone.querySelectorAll('b, strong, i, em, u, sup, sub').forEach((n) => {
    if (!n.textContent.trim()) n.remove();
  });
  const walker = document.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes];
}

function tidy(p) {
  const edge = (pick) => {
    for (let n = pick(p); n; n = pick(p)) {
      if ((n.nodeType === 1 && n.tagName === 'BR') || (n.nodeType === 3 && !n.textContent.trim())) n.remove();
      else break;
    }
  };
  edge((e) => e.firstChild);
  edge((e) => e.lastChild);
  p.normalize();
  // collapse whitespace and trim at the edges of p and of its inline children
  const tw = p.ownerDocument.createTreeWalker(p, 4);
  while (tw.nextNode()) tw.currentNode.textContent = tw.currentNode.textContent.replace(/[\s ]+/g, ' ');
  [p, ...p.querySelectorAll('strong, b, a, em, i')].forEach((n) => {
    const f = n.firstChild;
    if (f && f.nodeType === 3) f.textContent = f.textContent.replace(/^\s+/, '');
    const l = n.lastChild;
    if (l && l.nodeType === 3) l.textContent = l.textContent.replace(/\s+$/, '');
  });
  return p;
}

/** Cell content: block-level pieces in document order. */
function cellContent(document, cell) {
  const out = [];
  let run = null;
  const flush = () => {
    if (run) {
      tidy(run);
      if (textOf(run) || run.querySelector('img')) out.push(run);
    }
    run = null;
  };
  const addInline = (nodes) => {
    if (!run) run = document.createElement('p');
    run.append(...nodes);
  };
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        if (n.textContent.trim()) addInline([document.createTextNode(n.textContent.replace(/\s+/g, ' '))]);
        return;
      }
      if (n.nodeType !== 1 || n.matches(SKIP)) return;
      if (isCheck(n)) { addInline([document.createTextNode('✓')]); return; }
      const tag = n.tagName;
      if (tag === 'IMG') {
        const src = imgSrc(n);
        if (!src) return;
        flush();
        const p = document.createElement('p');
        const img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', (n.getAttribute('alt') || '').trim());
        p.append(img);
        out.push(p);
        return;
      }
      if (tag === 'BR') { if (run) run.append(document.createElement('br')); return; }
      if (tag === 'UL' || tag === 'OL') {
        flush();
        const list = document.createElement(tag.toLowerCase());
        n.querySelectorAll(':scope > li').forEach((li) => {
          const item = document.createElement('li');
          item.append(...inlineNodes(document, li));
          if (textOf(item)) list.append(item);
        });
        if (list.children.length) out.push(list);
        return;
      }
      if (/^H[1-6]$/.test(tag) || tag === 'P') {
        flush();
        if (n.querySelector('img')) n.querySelectorAll('img').forEach((i) => walk({ childNodes: [i] }));
        const p = document.createElement('p');
        p.append(...inlineNodes(document, n));
        if (/^H/.test(tag) && textOf(p)) {
          const s = document.createElement('strong');
          s.append(...p.childNodes);
          p.append(s);
        }
        tidy(p);
        if (textOf(p)) out.push(p);
        return;
      }
      if (tag === 'A' || tag === 'BUTTON') {
        n.querySelectorAll('img').forEach((i) => walk({ childNodes: [i] }));
        const nodes = inlineNodes(document, n.cloneNode(true).tagName === 'A' ? wrap(document, n) : wrap(document, n));
        if (!nodes.length || !nodes.some((x) => (x.textContent || '').trim())) return;
        // stand-alone CTA (block parent) -> own paragraph; inline link -> run
        const inline = n.parentElement && [...n.parentElement.childNodes].some((x) => x !== n && x.nodeType === 3 && x.textContent.trim());
        if (inline) { addInline(nodes); return; }
        flush();
        const p = document.createElement('p');
        p.append(...nodes);
        tidy(p);
        out.push(p);
        return;
      }
      if (/^(B|STRONG|I|EM|U|SUP|SUB|SMALL|SPAN|LABEL|CODE)$/.test(tag) && !n.querySelector('div, p, ul, ol, h1, h2, h3, h4, h5, h6, img, table, button')) {
        if (n.querySelector('.chk-img, [class*="check"]')) { walk(n); return; }
        const nodes = inlineNodes(document, wrap(document, n));
        if (nodes.some((x) => (x.textContent || '').trim())) addInline(nodes);
        return;
      }
      if (tag === 'TABLE') return; // nested tables are not supported by the block
      // block wrapper (div, section, custom elements): new run boundary
      const isBlock = /^(DIV|SECTION|ARTICLE|LI|DL|DT|DD|HEADER|FOOTER)$/.test(tag) || tag.includes('-');
      if (isBlock && tag !== 'SPAN') flush();
      walk(n);
      if (isBlock) flush();
    });
  };
  walk(cell);
  flush();
  // single simple paragraph -> inline content
  if (out.length === 1 && out[0].tagName === 'P' && !out[0].querySelector('img')) return [...out[0].childNodes];
  return out;
}

function wrap(document, n) {
  const d = document.createElement('div');
  d.append(n.cloneNode(true));
  return d;
}

function pickTables(element) {
  let tables = element.matches('table') ? [element] : [...element.querySelectorAll('table')];
  tables = tables.filter((t) => !tables.some((o) => o !== t && o.contains(t)));
  // prefer desktop copies when both mobile and desktop versions exist
  const isMobile = (t) => /(^|\s)(mode-mobile|mobile-only|d-lg-none|visible-xs)(\s|$)/.test(t.getAttribute('class') || '');
  if (tables.some((t) => !isMobile(t)) && tables.some(isMobile)) tables = tables.filter((t) => !isMobile(t));
  return tables;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const tables = pickTables(element);

  tables.forEach((table, ti) => {
    const caption = table.querySelector(':scope > caption');
    if (caption && !caption.matches('.sr-only, .visually-hidden') && textOf(caption) && ti === 0) {
      cells.push([inlineNodes(document, caption)]);
    }
    const rows = [...table.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr')];
    rows.forEach((tr) => {
      const srcCells = [...tr.children].filter((c) => /^(TH|TD)$/.test(c.tagName));
      const row = srcCells.map((c) => {
        const content = cellContent(document, c);
        // row headers in the body: bold
        const alreadyBold = content.length === 1 && content[0].nodeType === 1 && /^(STRONG|B)$/.test(content[0].tagName);
        if (c.tagName === 'TH' && !c.closest('thead') && !alreadyBold && content.length && content.every((x) => x.nodeType === 3 || /^(SUP|B|STRONG|I|EM|BR|A)$/.test(x.tagName))) {
          const s = document.createElement('strong');
          s.append(...content);
          return [s];
        }
        return content;
      });
      const hasAny = row.some((c) => c.some((x) => (x.textContent || '').trim() || (x.querySelector && x.querySelector('img'))));
      if (!hasAny) return;
      // mobile continuation row: merge into previous row
      if (/(^|\s)outer(\s|$)/.test(tr.getAttribute('class') || '') && row.length === 1 && cells.length && cells[cells.length - 1].length > 1) {
        const prev = cells[cells.length - 1];
        const target = prev[1];
        const p = document.createElement('p');
        p.append(...row[0]);
        if (Array.isArray(target)) {
          // wrap existing inline content so both stay separate lines
          if (target.length && target.every((x) => x.nodeType === 3 || !/^(P|UL|OL)$/.test(x.tagName))) {
            const first = document.createElement('p');
            first.append(...target);
            target.splice(0, target.length, first);
          }
          target.push(p);
        }
        return;
      }
      cells.push(row);
    });
  });

  if (!tables.length) {
    const content = cellContent(document, element);
    if (content.length) cells.push([content]);
  }

  const bordered = tables.some((t) => t.querySelector('th.headerData, thead th[style*="background"]'));
  const name = bordered ? 'table-rates (bordered)' : 'table-rates';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
