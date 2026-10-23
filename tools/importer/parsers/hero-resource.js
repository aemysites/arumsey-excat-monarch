/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-resource
 * Sources (expat resource center): section.expat-homepage-hero (featured-list),
 *   section.ba--catall--header (illustration), section.ba--catsingle--header
 *   (featured-article / featured-article-2), div.tax-help-intro-row (default).
 * Layout (blocks/hero-resource/README.md):
 *   row 1: [breadcrumb links, heading, text, CTA links, "Share:" + social icon links | aside]
 *   aside: default = heading/text + list of links; featured-article = picture + linked title;
 *          illustration = picture; featured-list = heading, then one extra row per
 *          article [picture | category + linked title].
 * Variant: catalog lookup (page path + instance selector), falling back to DOM cues.
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/expat-tax-preparation/resource-center/": [["#site-content > section.expat-homepage-hero.expat-bg--grey", "featured-list"]],
  "/expat-tax-preparation/resource-center/all-topics/": [["#site-content > section.ba--catall--header", "illustration"]],
  "/expat-tax-preparation/resource-center/country/australia/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/canada/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/china/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/france/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/germany/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/hong-kong/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/japan/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/mexico/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/netherlands/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/new-zealand/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/philippines/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/singapore/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/switzerland/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/united-arab-emirates/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/country/united-kingdom/": [["#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row", null]],
  "/expat-tax-preparation/resource-center/filing/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/filing/page/2/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/filing/page/3/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/forms/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/forms/page/2/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/forms/page/3/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/income/": [["#site-content > section.ba--catsingle--header", "featured-article-2"]],
  "/expat-tax-preparation/resource-center/income/page/2/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/post-filing/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
  "/expat-tax-preparation/resource-center/tax-law-and-policy/": [["#site-content > section.ba--catsingle--header", "featured-article"]],
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


function linkTo(document, href, label) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  return a;
}

export default function parse(element, { document, params }) {
  cleanInline(element);
  const cells = [];

  // ---- main (left) column ----
  const main = [];
  const crumbs = element.querySelector('.ba--breadcrumbs');
  if (crumbs) {
    const links = [...crumbs.querySelectorAll('a[href]')].filter((a) => text(a));
    if (links.length) {
      const p = document.createElement('p');
      links.forEach((a, i) => { if (i) p.append(' '); p.append(linkTo(document, a.getAttribute('href'), text(a))); });
      main.push(p);
    }
  }
  const mainCol = element.querySelector('.tax-help-description')
    || (element.querySelector('h1') && element.querySelector('h1').parentElement)
    || element;
  [...mainCol.children].forEach((child) => {
    if (child.matches('.ba--breadcrumbs')) return;
    if (child.matches('.social-sharing')) {
      const p = document.createElement('p');
      const title = text(child.querySelector('.share-title'));
      if (title) p.append(`${title} `);
      child.querySelectorAll('a[href]').forEach((a, i) => {
        if (i) p.append(' ');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        const img = a.querySelector('img');
        if (img) link.append(img); else link.textContent = text(a);
        p.append(link);
      });
      main.push(p);
      return;
    }
    main.push(...extract(document, { childNodes: [child] }));
  });
  // social sharing outside the main column (catsingle header keeps it inside)
  if (!main.some((n) => n.querySelector && n.querySelector('a[href*="twitter.com"], a[href*="facebook.com"]'))) {
    const share = element.querySelector('.social-sharing');
    if (share && !mainCol.contains(share)) {
      const p = document.createElement('p');
      const title = text(share.querySelector('.share-title'));
      if (title) p.append(`${title} `);
      share.querySelectorAll('a[href]').forEach((a, i) => {
        if (i) p.append(' ');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        const img = a.querySelector('img');
        if (img) link.append(img); else link.textContent = text(a);
        p.append(link);
      });
      main.push(p);
    }
  }

  // ---- aside ----
  let variant;
  const aside = [];
  const extraRows = [];
  const featuredCard = element.querySelector('.featured-card');
  const featuredList = element.querySelectorAll('.featured-article-title');
  const illustration = element.querySelector('.featured-image.category-page, .ba--catall--header .featured-image');
  const helpLinks = element.querySelector('.tax-help-links');

  if (featuredList.length) {
    variant = 'featured-list';
    const heading = element.querySelector('.featured-articles-heading');
    if (heading) aside.push(heading);
    featuredList.forEach((t) => {
      const a = t.closest('a[href]');
      const box = a || t.parentElement;
      const img = box.querySelector('img');
      const body = [];
      // <span>Filing</span>: helix-importer unwraps bare spans before parsing,
      // so the category is the title box text outside the title paragraph
      const catBox = t.cloneNode(true);
      catBox.querySelectorAll('p, h2, h3, img, picture').forEach((n) => n.remove());
      const cat = text(t.querySelector('span')) || text(catBox);
      if (cat) body.push(para(document, cat));
      const title = text(t.querySelector('p, h2, h3')) || text(t);
      if (title) {
        const h = document.createElement('h3');
        h.append(a ? linkTo(document, a.getAttribute('href'), title) : title);
        body.push(h);
      }
      extraRows.push([img || '', body]);
    });
  } else if (featuredCard) {
    variant = 'featured-article';
    const a = featuredCard.querySelector('a[href]');
    const img = featuredCard.querySelector('.featured-image img, img');
    if (img) aside.push(img);
    const title = text(featuredCard.querySelector('.title, h2, h3'));
    if (title) {
      const h = document.createElement('h2');
      h.append(a ? linkTo(document, a.getAttribute('href'), title) : title);
      aside.push(h);
    }
  } else if (illustration) {
    variant = 'illustration';
    const img = illustration.querySelector('img');
    if (img) { img.removeAttribute('srcset'); aside.push(img); }
  } else if (helpLinks) {
    variant = null;
    aside.push(...extract(document, helpLinks));
  }

  cells.push([main.length ? main : '', aside.length ? aside : '']);
  extraRows.forEach((r) => cells.push(r));

  const fromCatalog = catalogVariant(element, params);
  if (fromCatalog !== undefined) variant = fromCatalog;
  const name = variant ? `hero-resource (${variant})` : 'hero-resource';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
