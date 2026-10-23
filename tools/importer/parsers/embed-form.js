/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-form
 * Source: section.column-control holding a custom-HTML embed (iframe.mbsy-integration
 *   referral form), optionally with heading / intro / footnote text.
 * Layout (blocks/embed-form/README.md): one cell: optional heading and intro
 *   text, a standalone link to the form URL (block renders it as a lazy iframe),
 *   optional footnote text after the link.
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
  cleanInline(element);
  const iframe = element.querySelector('iframe[src]');
  const before = [];
  const after = [];
  let seenFrame = false;

  // text content around the iframe, in document order
  const content = extract(document, element);
  content.forEach((n) => {
    const a = n.querySelector && n.querySelector('a[href]');
    if (iframe && a && a.getAttribute('href') === iframe.getAttribute('src')) { seenFrame = true; return; }
    (seenFrame ? after : before).push(n);
  });

  const cell = [...before];
  if (iframe) {
    const a = document.createElement('a');
    a.href = iframe.getAttribute('src');
    a.textContent = iframe.getAttribute('src');
    cell.push(para(document, a));
  }
  cell.push(...after);

  const cells = cell.length ? [[cell]] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-form', cells });
  element.replaceWith(block);
}
