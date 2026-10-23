/* eslint-disable */
/* global WebImporter */

/**
 * Parser: software-download
 * Source: two-column section.column-control: copy column (eyebrow/heading/text)
 *   with an optional version/state picker form (select + download button), and
 *   an optional Dynamic Media image column.
 * Layout (blocks/software-download/README.md): one row, cells by content:
 *   copy | list of versions/states (+ price and button label paragraphs) | image.
 * Download URLs are resolved by JS on the source, so list items are plain text
 * (the block disables the button for plain items).
 * Variant: catalog lookup (page path + instance selector), falling back to DOM cues.
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/amending-your-tax-return/": [["#container-e7335a08eb > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-60.two-column-control", "with-image"]],
  "/financial-services/emerald-card-services/": [["#container-e85b1470d9 > section.column-control.green-dark-theme.padding-top-40.padding-bottom-40.two-column-control", "product"]],
  "/tax-software/updates-back-editions/2021-back-editions/": [["#container-814bc03364 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "with-image-2"]],
  "/tax-software/updates-back-editions/2022-back-editions/": [["#container-6b09d829bd > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "with-image-2"]],
  "/tax-software/updates-back-editions/2023-back-editions/": [["#container-fafb80b298 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "with-image-2"]],
  "/tax-software/updates-back-editions/2024-back-editions/": [["#container-eeac4ab9ae > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "with-image-2"]],
  "/tax-software/updates-back-editions/federal-mac/": [["#container-3bbb7769f1 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/tax-software/updates-back-editions/federal-windows/": [["#container-8b72d90278 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/tax-software/updates-back-editions/state-mac/": [["#container-62e44eb0aa > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/tax-software/updates-back-editions/state-windows/": [["#container-7c8206b8d4 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/20mac-state/": [["#container-62a74fc296 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/20macintosh-federal/": [["#container-95ee986511 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/20windows-federal/": [["#container-509bc34bf1 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/20windows-state/": [["#container-61c18a55af > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/21mac-state/": [["#container-a9e9f7a2ca > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/21macintosh-federal/": [["#container-754775f969 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/21windows-federal/": [["#container-80ec1008f7 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/21windows-state/": [["#container-3a999bcadc > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/22mac-state/": [["#container-eec5ebd578 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/22macintosh-federal/": [["#container-f4cef2d4d9 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/22windows-federal/": [["#container-f49e8259cc > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/22windows-state/": [["#container-b0a872fffd > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/23mac-state/": [["#container-7b8daa2b37 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/23macintosh-federal/": [["#container-f29bfd99b9 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/23windows-federal/": [["#container-1b643a475c > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/23windows-state/": [["#container-59449d396f > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/24mac-state/": [["#container-c56bb7aaca > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/24macintosh-federal/": [["#container-dab93fbfd6 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/24windows-federal/": [["#container-ebca8ef71d > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  "/taxes/products/software/updates/24windows-state/": [["#container-ca8e446add > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control", null]],
  // campaign-full-bleed-hero (catalog variant; class selector stable between catalog and live)
  "/responsibilityisland/": [["section.column-control.spruce-forest-theme.two-column-control:has(.video-container)", "green"]],
};

function pagePath(params) {
  try {
    let p = new URL(params && params.originalURL).pathname.replace(/index\.html$/, '').replace(/\.html$/, '/');
    if (!p.endsWith('/')) p += '/';
    return p.toLowerCase();
  } catch (e) {
    return '';
  }
}

/* variant class recorded by the catalog for this page + instance; undefined when unknown */
function catalogVariant(element, params) {
  const entries = CATALOG_VARIANTS[pagePath(params)];
  if (!entries) return undefined;
  for (const [sel, v] of entries) {
    try { if (element.matches(sel)) return v; } catch (e) { /* invalid selector */ }
  }
  return undefined;
}

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


export default function parse(element, { document, params }) {
  const forms = [...element.querySelectorAll('form')];
  const pickers = forms.map((form) => {
    const select = form.querySelector('select');
    const options = select ? [...select.querySelectorAll('option')]
      .filter((o) => o.getAttribute('value') !== '0' && text(o)) : [];
    const placeholder = select ? [...select.querySelectorAll('option')].find((o) => o.getAttribute('value') === '0') : null;
    const label = text(form.querySelector('label#customLabel')) || text(form.querySelector('label'));
    const price = text(form.querySelector('.button-pricing'));
    const btn = [...form.querySelectorAll('.btn-container a, .btn-container button, button.btn, a.btn')].find((b) => text(b));
    form.remove();
    return { options, placeholder: text(placeholder), label, price, btn: text(btn) };
  });

  // video column (div.video-container: poster still + "play" overlay image; the YouTube
  // URL is kept by hrblock-cleanup as data-excat-video): the poster is the panel image,
  // the play overlay is dropped and the video becomes a "Watch now" link after the copy
  const videoLinks = [];
  element.querySelectorAll('.video-container').forEach((vc) => {
    vc.querySelectorAll('.playbutton-image, button').forEach((n) => n.remove());
    const url = vc.getAttribute('data-excat-video');
    if (url) videoLinks.push(url);
  });

  cleanInline(element);
  const columnList = element.querySelector('ul.column-container');
  const columns = columnList ? [...columnList.children].filter((c) => c.matches('li')) : [...element.children];

  const copy = [];
  let image = null;
  columns.forEach((col) => {
    const content = extract(document, col);
    content.forEach((n) => {
      const isImg = n.tagName === 'IMG' || n.tagName === 'PICTURE'
        || (n.tagName === 'P' && n.querySelector('img') && !text(n));
      if (isImg && !image) image = n.tagName === 'P' ? n.querySelector('img') : n;
      else if (!isImg) copy.push(n);
    });
  });

  videoLinks.forEach((url) => {
    const a = document.createElement('a');
    a.href = url;
    a.textContent = 'Watch now';
    const strong = document.createElement('strong');
    strong.append(a);
    copy.push(para(document, strong));
  });

  const row = [];
  if (copy.length) row.push(copy);
  pickers.forEach((pk) => {
    const cell = [];
    // option values that are download / page URLs become links (linked items are downloadable)
    const items = pk.options.length
      ? pk.options.map((o) => ({ label: text(o), href: (o.getAttribute('value') || '').trim() }))
      : [pk.placeholder || pk.label].filter(Boolean).map((label) => ({ label, href: '' }));
    if (items.length) {
      const ul = document.createElement('ul');
      items.forEach(({ label, href }) => {
        const li = document.createElement('li');
        if (/^(https?:)?\/\//i.test(href) || href.startsWith('/')) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = label;
          li.append(a);
        } else {
          li.textContent = label;
        }
        ul.append(li);
      });
      cell.push(ul);
    }
    if (pk.price) cell.push(para(document, pk.price));
    if (pk.btn) cell.push(para(document, pk.btn));
    if (cell.length) row.push(cell);
  });
  if (image) row.push(image);

  let variant = catalogVariant(element, params);
  if (variant === undefined) {
    if (pickers.length && image) variant = 'with-image-2';
    else if (!pickers.length && image) variant = 'with-image';
    else variant = null;
  }

  const cells = row.length ? [row] : [];
  const name = variant ? `software-download (${variant})` : 'software-download';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
