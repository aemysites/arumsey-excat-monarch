/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-split
 * Source: first two-column section.column-control on product pages: text column
 *   (eyebrow, heading, rating, price block, CTAs, disclaimer) + image column
 *   (Dynamic Media image or Lottie animation).
 * Layout (blocks/hero-split/README.md): one row:
 *   [eyebrow/heading, text, optional link list, price (pricing), CTA links | picture or Lottie .json link]
 * Variant: catalog lookup (page path + instance selector), falling back to DOM
 *   cues (price block -> pricing).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/corporate/income-tax-course/": [["#container-096c529025 > section:nth-child(1)", "bleed"]],
  "/easignup/": [["#container-5a359b941f > section.column-control.spruce-eggshell-theme.two-column-control", "bleed"]],
  "/expat-tax-preparation/": [["#container-0f429b6acb > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control", null]],
  "/expat-tax-preparation/diy-expat-tax-filing-online/": [["#container-458b5749c8 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
  "/expat-tax-preparation/expat-assisted-tax-filing/": [["#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
  "/financial-services/emerald-advance-loan-vs-refund-advance/": [["#container-6ed98747c7 > section.column-control.spruce-forest-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
  "/financial-services/emerald-advance-loan/": [["#container-5a359b941f > section.column-control.spruce-eggshell-theme.two-column-control", "bleed"]],
  "/financial-services/emerald-card-login/": [["#container-de97732295 > section.column-control.green-dark-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
  "/financial-services/tax-refund-payment/": [["#container-09ef37399b > section.column-control.green-dark-theme.two-column-control", "bleed"]],
  "/lp/creator-taxes/": [["#container-d8006e96a0 > section.column-control.spruce-forest-theme.two-column-control", "bleed"]],
  "/myblock-benefits/": [["#container-3d6b34a383 > section.column-control.spruce-forest-theme.two-column-control", null]],
  "/offers/gig-worker-side-business-taxes/": [["#container-1ef905b226 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/offers/saf/": [["#container-5b3cccfaf0 > section.column-control.white-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
  "/online-assist/": [["#container-33a468b3d9 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control", "bleed"]],
  "/online-tax-filing/": [["#container-33a468b3d9 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control", "bleed"]],
  "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > section.column-control.white-theme.two-column-control", "pricing"]],
  "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > section.column-control.white-theme.two-column-control", "pricing"]],
  "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > section.column-control.white-theme.two-column-control", "pricing"]],
  "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > section.column-control.white-theme.two-column-control", "pricing"]],
  "/online-tax-filing/tax-pro-review/": [["#container-f3913af060 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
  "/tax-extension/": [["#container-a975ba0354 > section.column-control.white-theme.two-column-control", null]],
  "/tax-offices/business-services/c-corp-taxes/": [["#container-4518bf9c06 > section", "pricing"]],
  "/tax-offices/business-services/partnership-taxes/": [["#container-305da01dce > section", "pricing"]],
  "/tax-offices/business-services/small-business-bookkeeping-services/": [["#container-971cbd754f > section.column-control.green-dark-theme.two-column-control", null]],
  "/tax-offices/business-services/small-business-payroll-services/": [["#container-adef7469f1 > section.column-control.green-dark-theme.two-column-control", null]],
  "/tax-offices/business-services/small-business-tax/s-corp-taxes/": [["#container-46376042e2 > section", "pricing"]],
  "/tax-offices/product-services/tax-identity-shield/": [["#container-5856a19837 > section.column-control.white-theme.padding-top-80.two-column-control", null]],
  "/tax-reform-and-law-changes/": [["#container-7266953ed0 > section.column-control.spruce-forest-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
  "/tax-software/state-editions/": [["#container-6d4ad41ada > section.product-details-wrapper.p-b-80.no-stateform > div > figure", "bleed"]],
  "/tax-software/updates-back-editions/": [["#container-670ec6f8c6 > section", null]],
  "/tax-software/updates-back-editions/2021-back-editions/": [["#container-814bc03364 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
  "/tax-software/updates-back-editions/2022-back-editions/": [["#container-6b09d829bd > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
  "/tax-software/updates-back-editions/2023-back-editions/": [["#container-fafb80b298 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
  "/tax-software/updates-back-editions/2024-back-editions/": [["#container-eeac4ab9ae > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
  "/taxes/products/software/updates/17buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/17mac-state/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/17macintosh-federal/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/17windows-federal/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/17windows-state/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/18buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/18mac-state/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/18macintosh-federal/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/18windows-federal/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/18windows-state/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/19buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/19mac-state/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/19macintosh-federal/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/19windows-federal/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/19windows-state/": [["#container-670ec6f8c6 > section", null]],
  "/taxes/products/software/updates/20buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
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


function normalizeWidgets(document, element) {
  // ratings widget: keep the accessible summary only
  element.querySelectorAll('.rating-stars').forEach((r) => {
    const summary = text(r.querySelector('.bv-off-screen'));
    if (summary) r.replaceWith(para(document, summary));
    else r.remove();
  });
  // price block: price paragraph (strike-through kept as <del>) + fee note
  element.querySelectorAll('.price-block, .pricing-container').forEach((pb) => {
    if (pb.parentElement && pb.parentElement.closest('.price-block, .pricing-container')) return;
    const out = [];
    pb.querySelectorAll('.card-price-section').forEach((sec) => {
      const label = text(sec.querySelector('.copy-small-t, .copy-small'));
      if (label) out.push(para(document, label));
      const price = sec.querySelector('.product-price') || sec.querySelector('.price');
      if (price && text(price)) {
        const strong = document.createElement('strong');
        strong.append(...[...price.childNodes]);
        out.push(para(document, strong));
      }
    });
    pb.querySelectorAll('.pricingtext').forEach((n) => { if (text(n)) out.push(para(document, text(n))); });
    pb.replaceWith(...out);
  });
  // lottie animations -> link to the .json file
  element.querySelectorAll('lottie-player, [data-lottie-src], .lottie-container').forEach((l) => {
    const player = l.matches('lottie-player') ? l : l.querySelector('lottie-player');
    const src = (player && player.getAttribute('src')) || l.getAttribute('data-lottie-src');
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.textContent = (player && (player.getAttribute('aria-label') || player.getAttribute('title'))) || 'Animation';
    (l.closest('.lottie-container') || l).replaceWith(para(document, a));
  });
}

// Year / product pickers: the page script turns the selected <option> into a
// destination URL. Known forms map value -> URL; URL-like values are used as is.
const PICKER_URLS = {
  'back-edition-year-selection': (v) => (/^\d{4}$/.test(v) ? `/tax-software/updates-back-editions/${v}-back-editions/` : ''),
};

// helix-importer heading ids: lower case, punctuation dropped, spaces -> hyphens
function anchorSlug(label) {
  return (label || '').replace(/\s+/g, ' ').trim().toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
}

function pickerHref(form, value, label) {
  const v = (value || '').trim();
  // in-page jump (state picker "#Alabama" -> the state heading): the imported heading id is
  // derived from the heading text, which is the option label
  if (/^#\S/.test(v)) return `#${anchorSlug(label)}`;
  if (/^(https?:)?\/\//i.test(v) || v.startsWith('/')) return v;
  const map = PICKER_URLS[form.id || form.getAttribute('name') || ''];
  return map ? map(v) : '';
}

/**
 * A <form> with a <select> (rendered by the site script as a custom dropdown,
 * hidden native select) becomes authored content the block turns back into a
 * select + go button: placeholder paragraph (label), list of option links, CTA.
 */
function normalizePickers(document, element) {
  // a picker is a <form> holding a <select>, or the wrapper of a form-less <select>
  // (state forms hero: section.federal-forms > div.form-group-state select + Submit link)
  const hosts = [...element.querySelectorAll('form')];
  element.querySelectorAll('select').forEach((sel) => {
    if (sel.closest('form')) return;
    const host = sel.closest('section.federal-forms') || (sel.parentElement && sel.parentElement.parentElement) || sel.parentElement;
    if (host && host !== element && !hosts.includes(host)) hosts.push(host);
  });
  hosts.forEach((form) => {
    const select = form.querySelector('select');
    if (!select) return;
    const options = [...select.querySelectorAll('option')];
    const placeholder = options.find((o) => o.getAttribute('value') === '0' || o.getAttribute('value') === '');
    const choices = options.filter((o) => o !== placeholder && text(o));
    if (!choices.length) return;
    const out = [];
    const label = text(placeholder) || text(form.querySelector('label'));
    if (label) out.push(para(document, label));
    const ul = document.createElement('ul');
    choices.forEach((o) => {
      const li = document.createElement('li');
      const href = pickerHref(form, o.getAttribute('value'), text(o));
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text(o);
        li.append(a);
      } else {
        li.textContent = text(o);
      }
      ul.append(li);
    });
    out.push(ul);
    const btn = [...form.querySelectorAll('.btn-container a, .btn-container button, a.btn, button.btn')].find((b) => text(b));
    if (btn) out.push(btn);
    const holder = document.createElement('div');
    holder.append(...out);
    form.replaceWith(holder);
  });
}

export default function parse(element, { document, params }) {
  element.querySelectorAll('span.hide, button.lottie-btn').forEach((n) => n.remove());
  normalizePickers(document, element);
  cleanInline(element);
  const hasPrice = !!element.querySelector('.price-block, .pricing-container');
  normalizeWidgets(document, element);

  const columnList = element.querySelector('ul.column-container');
  const columns = columnList ? [...columnList.children].filter((c) => c.matches('li')) : [...element.children];
  const row = columns.map((col) => extract(document, col)).filter((c) => c.length);

  let variant = catalogVariant(element, params);
  if (variant === undefined) variant = hasPrice ? 'pricing' : null;

  const cells = row.length ? [row] : [];
  const name = variant ? `hero-split (${variant})` : 'hero-split';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
