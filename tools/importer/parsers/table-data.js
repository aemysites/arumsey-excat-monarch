/* eslint-disable */
/* global WebImporter */

/**
 * Parser: table-data
 * Sources: comparison tables (section.green-dark-theme ... table.shtablecomparison)
 *   and plan tables (section.pricing-card-table table with plan cards in the header).
 * Layout (blocks/table-data/README.md): one block row per table row; first row =
 *   column header, first cell of each body row = row header; a single-cell row in
 *   a multi-column table is a full-width group heading.
 * Mobile-only duplicates (.hide-large labels, .feature-title) and the sticky
 * clone header row (tr.table-lock) are dropped; check/cross SVG marks become
 * their aria-label text (e.g. "Included" / "Not included").
 */

/* ---- shared content helpers (inlined per parser) ---- */
const BLOCK_SEL = 'div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav';

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function isHidden(el) {
  const style = (el.getAttribute && el.getAttribute('style')) || '';
  return /display\s*:\s*none/i.test(style) || el.hidden === true;
}

function cleanInline(root) {
  root.querySelectorAll('span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
  root.querySelectorAll('h1 br, h2 br, h3 br, h4 br, h5 br, h6 br').forEach((br) => br.replaceWith(' '));
  root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute('href', '#'));
  // eyebrow labels marked up as headings are plain paragraphs in the authored content
  root.querySelectorAll('h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow').forEach((h) => {
    const p = h.ownerDocument.createElement('p');
    p.append(...[...h.childNodes]);
    h.replaceWith(p);
  });
}

function svgToImg(document, svg) {
  try {
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const markup = clone.outerHTML;
    const b64 = typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(markup)))
      : Buffer.from(markup, 'utf8').toString('base64');
    const img = document.createElement('img');
    img.src = `data:image/svg+xml;base64,${b64}`;
    img.alt = svg.getAttribute('aria-label') || '';
    return img;
  } catch (e) {
    return null;
  }
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else if (Array.isArray(content)) p.append(...content);
  else p.append(content);
  return p;
}

function ctaPara(document, el) {
  const link = document.createElement('a');
  link.href = (el.tagName === 'A' && el.getAttribute('href')) || '#';
  const img = el.querySelector('img');
  if (img && !text(el)) link.append(img);
  else link.textContent = text(el);
  const isButton = el.tagName === 'BUTTON' || /(^|\s)btn(\s|$)|button/.test(el.className || '');
  if (isButton && text(el)) {
    const strong = document.createElement('strong');
    strong.append(link);
    return para(document, strong);
  }
  return para(document, link);
}

/**
 * Flatten a source subtree into block-level authoring content
 * (headings, paragraphs, lists, images, CTA paragraphs).
 * opts.icons: convert inline <svg> icons to data-URI images.
 */
function extract(document, root, opts = {}) {
  const out = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s+/g, ' ').trim();
        if (t) out.push(para(document, t));
        return;
      }
      if (n.nodeType !== 1 || isHidden(n)) return;
      const tag = n.tagName.toUpperCase();
      if (tag === 'SVG') {
        if (opts.icons) { const img = svgToImg(document, n); if (img) out.push(img); }
        return;
      }
      if (tag === 'IMG') { if (n.getAttribute('src')) out.push(n); return; }
      if (tag === 'HR') { out.push(n); return; }
      if (tag === 'PICTURE') { out.push(n); return; }
      if (tag === 'IFRAME' || tag === 'VIDEO') {
        const src = n.getAttribute('src') || (n.querySelector('source') && n.querySelector('source').getAttribute('src'));
        if (src) { const a = document.createElement('a'); a.href = src; a.textContent = src; out.push(para(document, a)); }
        return;
      }
      if (/^H[1-6]$/.test(tag)) {
        n.querySelectorAll('svg').forEach((s) => s.remove());
        if (text(n)) out.push(n);
        return;
      }
      if ((tag === 'UL' || tag === 'OL') && (n.matches('.column-container, .accordion, [role="tablist"]')
        || n.querySelector(':scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header'))) {
        walk(n); // layout list, not a content list
        return;
      }
      if (tag === 'P' || tag === 'UL' || tag === 'OL' || tag === 'TABLE' || tag === 'BLOCKQUOTE') {
        n.querySelectorAll('svg').forEach((s) => s.remove());
        n.querySelectorAll('button').forEach((b) => b.replaceWith(document.createTextNode(text(b))));
        if (text(n) || n.querySelector('img')) out.push(n);
        return;
      }
      if (tag === 'A') {
        if (text(n) || n.querySelector('img')) out.push(ctaPara(document, n));
        return;
      }
      if (tag === 'BUTTON') {
        if (text(n)) out.push(ctaPara(document, n));
        return;
      }
      // inline-only container with text: keep as one paragraph
      const hasHidden = [...n.querySelectorAll('[style]')].some((d) => isHidden(d));
      if (!hasHidden && !n.querySelector(BLOCK_SEL) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text(n)) {
        const p = document.createElement('p');
        p.append(...[...n.childNodes]);
        out.push(p);
        return;
      }
      walk(n);
    });
  };
  walk(root);
  return out;
}
/* ---- end shared helpers ---- */


export default function parse(element, { document }) {
  // availability images alone in a cell (state / federal form lists: software-available.png
  // alt "Available" / "Unavailable") -> mark text the block renders as check / cross
  element.querySelectorAll('td img[alt], th img[alt]').forEach((img) => {
    const alt = (img.getAttribute('alt') || '').replace(/\s+/g, ' ').trim();
    if (!/^(not )?(available|included)$|^unavailable$/i.test(alt)) return;
    const cell = img.closest('td, th');
    const clone = cell.cloneNode(true);
    clone.querySelectorAll('img').forEach((n) => n.remove());
    if (clone.textContent.trim()) return;
    img.replaceWith(document.createTextNode(alt));
  });
  // availability marks -> text before cleanup strips svgs
  element.querySelectorAll('svg[aria-label]').forEach((svg) => {
    const label = svg.getAttribute('aria-label');
    if (!label || /^(faq list|icon)$/i.test(label)) return;
    let mark = label;
    if (/not included|unavailable|no\b/i.test(label)) mark = 'Not included';
    else if (/included|available|yes\b/i.test(label)) mark = 'Included';
    svg.replaceWith(document.createTextNode(mark));
  });
  // unlabeled check icon alone in a cell = included
  element.querySelectorAll('td svg:not([aria-label])').forEach((svg) => {
    const td = svg.closest('td');
    const clone = td.cloneNode(true);
    clone.querySelectorAll('.hide-large, .feature-title, svg').forEach((n) => n.remove());
    if (!clone.textContent.trim()) svg.replaceWith(document.createTextNode('Included'));
  });
  // sticky clone of the header row: drop it only when a regular header row exists
  element.querySelectorAll('thead').forEach((thead) => {
    const locks = [...thead.querySelectorAll('tr.table-lock')];
    const regular = [...thead.querySelectorAll('tr')].filter((tr) => !tr.matches('.table-lock'));
    if (regular.length) locks.forEach((n) => n.remove());
  });
  element.querySelectorAll('tbody tr.table-lock, .hide-large, .feature-title, .reader, a.learn-more:empty').forEach((n) => n.remove());
  cleanInline(element);

  // the matched element may be the <table> itself (state / federal form lists: one block per table)
  const table = element.matches('table') ? element : element.querySelector('table');
  const cells = [];
  if (table) {
    const rows = [...table.querySelectorAll('tr')].filter((tr) => tr.closest('table') === table);
    const cellsOf = (tr) => [...tr.children].filter((c) => c.matches('th, td'));
    const span = (cell, attr) => Math.max(1, parseInt(cell.getAttribute(attr), 10) || 1);
    const hasSpans = rows.some((tr) => cellsOf(tr).some((c) => span(c, 'rowspan') > 1 || span(c, 'colspan') > 1));
    // federal forms matrix: worksheet rows (tr.child-form) sit under their form row;
    // the form (parent) row label is bold so the hierarchy survives (block CSS can
    // indent the non-bold child labels)
    const hasChildRows = rows.some((tr) => tr.matches('.child-form'));
    const content = (cell, tr, c) => {
      // inline-only cell (td > strong / a / text): keep its inline markup in one paragraph
      // (extract() would unwrap a bare <strong>)
      const inlineOnly = text(cell) && !cell.querySelector(BLOCK_SEL) && !cell.querySelector('img, svg, button');
      const out = inlineOnly ? [para(document, [...cell.childNodes])] : extract(document, cell);
      if (hasChildRows && c === 0 && !tr.matches('.child-form') && !tr.closest('thead') && !cell.matches('th[scope="col"]') && out.length) {
        const strong = document.createElement('strong');
        strong.textContent = out.map((n) => text(n)).join(' ');
        return [para(document, strong)];
      }
      return out.length ? out : '';
    };
    if (hasSpans) {
      // rowspan / colspan: the block has no spans, so lay the cells out on the source
      // grid (spanned slots left empty) to keep every value under its column header;
      // a cell spanning the whole row stays a single-cell group row
      const grid = [];
      rows.forEach((tr, r) => {
        grid[r] = grid[r] || [];
        let col = 0;
        cellsOf(tr).forEach((cell) => {
          while (grid[r][col] !== undefined) col += 1;
          const rs = span(cell, 'rowspan');
          const cs = span(cell, 'colspan');
          for (let dr = 0; dr < rs; dr += 1) {
            grid[r + dr] = grid[r + dr] || [];
            for (let dc = 0; dc < cs; dc += 1) grid[r + dr][col + dc] = (dr || dc) ? '' : { cell, tr, cs, c: col };
          }
          col += cs;
        });
      });
      const width = grid.reduce((m, r) => Math.max(m, (r || []).length), 0);
      grid.slice(0, rows.length).forEach((slots) => {
        const real = (slots || []).filter((x) => x && x.cell);
        if (real.length === 1 && real[0].cs >= width && width > 1) {
          const c = content(real[0].cell, real[0].tr, 0);
          if (c) cells.push([c]);
          return;
        }
        const row = [];
        for (let i = 0; i < width; i += 1) {
          const slot = slots && slots[i];
          row.push(slot && slot.cell ? content(slot.cell, slot.tr, i) : '');
        }
        cells.push(row); // blank rows stay: they are the form's blank lines
      });
    } else {
      let maxCols = 0;
      const built = rows.map((tr) => {
        const row = cellsOf(tr).map((cell, c) => content(cell, tr, c));
        maxCols = Math.max(maxCols, row.length);
        return row;
      }).filter((r) => r.some((c) => c !== ''));
      built.forEach((r) => {
        if (r.length === 1 && maxCols > 1) { cells.push(r); return; } // group heading
        while (r.length < maxCols) r.push('');
        cells.push(r);
      });
    }
  }

  // intro above the table inside the matched element (div.showcontents band: "Ways to work with
  // your tax pro" .introDefaultvariant) is not table data: keep it as default content before
  // the block. The block rows stay one row per source table row (plan tables keep their
  // heading in the first header cell, untouched).
  const intro = [];
  element.querySelectorAll('.introDefaultvariant h1, .introDefaultvariant h2, .introDefaultvariant h3, .introDefaultvariant h4, .introDefaultvariant p')
    .forEach((n) => {
      if (n.closest('table') || !n.textContent.trim()) return;
      const outer = n.parentElement.closest('p, h1, h2, h3, h4');
      if (outer && element.contains(outer)) return;
      const tag = /^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : 'p';
      const out = document.createElement(tag);
      out.textContent = n.textContent.replace(/\s+/g, ' ').trim();
      intro.push(out);
    });

  // heading/description above the table (plan tables keep it in the first header cell)
  // form availability grids (state table.grid-table, federal table.table-grid: form | Windows | Mac)
  // are the catalog's matrix variant
  const name = table && table.matches('.grid-table, .table-grid') ? 'table-data (matrix)' : 'table-data';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
  intro.forEach((n) => block.before(n));
}
