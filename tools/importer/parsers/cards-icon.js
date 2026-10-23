/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-icon
 * Sources (one block per section):
 *   - div.card-secondary.featurecard (photo + text panel)
 *        white card -> featured-offer, green-dark card -> dark
 *   - section.rounded-border award banner (logo + text)
 *        on an eggshell section -> light-3, otherwise -> light-2
 *   - div.iconlist columns (icon left of bold title, text, link) -> icon-left
 *   - div.introImageVariant columns (centred icon + optional text) -> default
 *   - section.snackBar (icon + title items split by rules) -> dividers
 * Variant: catalog lookup (page path + instance selector) wins over the DOM cues.
 * Layout (blocks/cards-icon/README.md): [icon or image | body].
 * Inline SVG icons have no image URL on the source, so they are kept as
 * SVG data-URI images.
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/financial-services/spruce/": [["section.column-control:has(.snackBar)", "dividers"], ["section.column-control:has(.card-secondary.featurecard)", "light-3"]],
  "/tax-calculator/": [["section.column-control.spruce-eggshell-theme:has(.alignBanner)", "light"]],
  "/best-tax-services/": [["section.column-control.green-dark-theme", null]],
  "/corporate/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
  "/support/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
  "/support/contact-options/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
  "/tax-offices/make-appointment/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
  "/tax-offices/our-tax-pros/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
  "/tax-offices/tax-prep/extended-service/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
  "/tax-offices/upfront-pricing/": [["section.column-control.spruce-eggshell-theme", "light"]],
  // card-grid-landing (catalog variants, class selectors stable between catalog and live)
  "/dsar/": [["section.column-control.spruce-forest-theme:has(.col-3)", null]],
  "/filing-options-and-products/": [["section.column-control.spruce-forest-theme:has(.col-3)", null]],
  "/tax-offices/drop-off/": [["section.column-control.spruce-forest-theme:has(.col-3)", null], ["section.column-control.spruce-eggshell-theme.padding-bottom-60:has(.spruce-eggshell-theme)", "featured-offer"]],
  "/tax-offices/international/": [["section.column-control.green-dark-theme:has(.col-3)", null]],
  "/tax-offices/office-tax-preparation/": [["section.column-control.spruce-forest-theme:has(.col-3)", null], ["section.column-control.spruce-eggshell-theme.padding-bottom-60", "featured-offer"]],
  "/tax-offices/tax-refund-payment/": [["section.column-control.green-dark-theme:has(.col-3)", null]],
  "/tax-offices/virtual-tax-preparation/": [["section.column-control.spruce-forest-theme:has(.col-3)", null]],
  "/find-a-cpa-or-enrolled-agent/": [["section.column-control.spruce-eggshell-theme:has(.col-3)", "light"]],
  "/no-surprise-guarantee/": [["section.column-control.spruce-eggshell-theme:has(.col-3)", "light"]],
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

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(root) {
  root.querySelectorAll('span.reader, span.spacer, input, script, style, link, noscript, meta').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
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

function iconOf(document, root) {
  const img = root.querySelector('img');
  if (img && img.getAttribute('src')) return img;
  const svg = root.querySelector('svg');
  return svg ? svgToImg(document, svg) : null;
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else p.append(content);
  return p;
}

function ctaParagraph(document, container) {
  const controls = [...container.querySelectorAll('a, button')].filter((c) => text(c));
  if (!controls.length) return null;
  const p = document.createElement('p');
  controls.forEach((c, i) => {
    if (i) p.append(' ');
    if (c.tagName === 'A' && c.getAttribute('href')) {
      const link = document.createElement('a');
      // JS-only links (javascript:void(0), app-setting tools) keep a "#" target
      link.href = /^javascript:/i.test(c.getAttribute('href')) ? '#' : c.getAttribute('href');
      link.textContent = text(c);
      if (c.classList.contains('btn')) {
        const strong = document.createElement('strong');
        strong.append(link);
        p.append(strong);
      } else {
        p.append(link);
      }
    } else {
      // JS-only <button> (no URL on the source): keep it as a CTA link to "#"
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = text(c);
      const strong = document.createElement('strong');
      strong.append(link);
      p.append(strong);
    }
  });
  return p;
}

function blockChildren(holder) {
  return [...holder.querySelectorAll(':scope > p, :scope > ul, :scope > ol, :scope > h2, :scope > h3, :scope > h4, :scope > div > p')]
    .filter((n) => text(n));
}

export default function parse(element, { document, params }) {
  const variantFromCatalog = catalogVariant(element, params);
  cleanInline(element);
  const cells = [];
  let variant = null;

  let featureCards = [...element.querySelectorAll('.card-secondary.featurecard, .featurecard')]
    .filter((c, i, arr) => arr.indexOf(c) === i);
  // jumbo offer cards (div.card-secondary.card-jumbo: photo, title, text, list,
  // Starting at price, CTA) read like feature cards (/offers/refund-advance/)
  const jumbo = !featureCards.length;
  if (jumbo) featureCards = [...element.querySelectorAll('.card-secondary.card-jumbo')];
  const banner = element.querySelector('section.rounded-border, .alignBanner');
  const iconLists = [...element.querySelectorAll('div.iconlist')];
  const snackCols = [...element.querySelectorAll('section.snackBar .snackBar-col')];

  if (snackCols.length) {
    variant = 'dividers';
    snackCols.forEach((col) => {
      const icon = iconOf(document, col.querySelector('.snackBar-col__media') || col);
      const content = col.querySelector('.snackBar-col__content') || col;
      const body = [...content.querySelectorAll('h1, h2, h3, h4, h5, p, ul, ol')]
        .filter((n) => {
          if (!text(n)) return false;
          const outer = n.parentElement.closest('p, ul, ol, h1, h2, h3, h4, h5');
          return !outer || !content.contains(outer);
        });
      body.forEach((n) => n.removeAttribute('style'));
      if (icon || body.length) cells.push([icon || '', body.length ? body : '']);
    });
  } else if (featureCards.length) {
    featureCards.forEach((card) => {
      variant = card.classList.contains('green-dark-theme') || card.classList.contains('spruce-forest-theme') ? 'dark' : 'featured-offer';
      const img = card.querySelector('.card-img img') || card.querySelector('img');
      const body = [];
      const content = card.querySelector('article.card-content') || card;
      const h = content.querySelector('h1, h2, h3, h4');
      if (h) body.push(h);
      if (jumbo) {
        content.querySelectorAll('header > div').forEach((div) => body.push(...blockChildren(div)));
      } else {
        const headerBody = content.querySelector('header [class*="body_max_width"], header > div');
        if (headerBody) body.push(...blockChildren(headerBody));
      }
      const price = content.querySelector('.product--state-price') || (jumbo && content.querySelector('.card-price-section'));
      if (price && text(price)) body.push(para(document, text(price)));
      const btns = content.querySelector('.btn-container, .card-btn');
      if (btns) { const cta = ctaParagraph(document, btns); if (cta) body.push(cta); }
      const disc = content.querySelector('[class*="disclaimer_max_width"]');
      if (disc) body.push(...blockChildren(disc));
      cells.push([img || '', body.length ? body : '']);
    });
  } else if (banner) {
    variant = element.matches('.spruce-eggshell-theme') ? 'light-3' : 'light-2';
    const root = banner.closest('section.rounded-border') || banner;
    const img = root.querySelector('.cmp-column--image img, img');
    const body = [];
    const header = root.querySelector('.skinnyHeader');
    if (header) {
      const spans = [...header.querySelectorAll(':scope > span')].filter((s) => text(s));
      if (spans.length >= 2) {
        body.push(para(document, text(spans[0])));
        const h = document.createElement('h3');
        h.textContent = text(spans[1]);
        body.push(h);
        spans.slice(2).forEach((s) => body.push(para(document, text(s))));
      } else if (text(header)) {
        const h = document.createElement('h3');
        h.textContent = text(header);
        body.push(h);
      }
    }
    const copy = root.querySelector('.skinnyBodyCopy');
    if (copy) body.push(...blockChildren(copy));
    const links = root.querySelector('.removeLastPadding, .btn-container');
    if (links) { const cta = ctaParagraph(document, links); if (cta) body.push(cta); }
    cells.push([img || '', body.length ? body : '']);
  } else if (iconLists.length) {
    variant = 'icon-left';
    iconLists.forEach((list) => {
      list.querySelectorAll('li').forEach((li) => {
        if (li.parentElement.closest('.icon-text-wrap')) return;
        const icon = iconOf(document, li.querySelector('.icon-wrap') || li);
        const holder = li.querySelector('.icon-text-wrap') || li;
        const body = [];
        [...holder.children].forEach((child) => {
          if (!text(child)) return;
          const onlyBold = child.tagName === 'P' && child.children.length === 1
            && /^(B|STRONG|SPAN)$/.test(child.firstElementChild.tagName)
            && child.firstElementChild.matches('b, strong, .font-bold')
            && text(child) === text(child.firstElementChild);
          if (onlyBold && !body.length) {
            const h = document.createElement('h3');
            h.textContent = text(child);
            body.push(h);
          } else {
            child.querySelectorAll('span.rte-right-arrow').forEach((s) => s.replaceWith(...s.childNodes));
            body.push(child);
          }
        });
        if (icon || body.length) cells.push([icon || '', body.length ? body : '']);
      });
    });
  } else {
    // Icon columns (introImageVariant): one row per column
    const cols = [...element.querySelectorAll('li.column')].filter((c) => !c.querySelector('li.column'));
    const items = cols.length ? cols : [...element.querySelectorAll('.introImageVariant')];
    items.forEach((col) => {
      const icon = iconOf(document, col.querySelector('.cmp-column--image') || col);
      const clone = col.cloneNode(true);
      clone.querySelectorAll('.cmp-column--image, svg, img').forEach((n) => n.remove());
      const body = [...clone.querySelectorAll('h1, h2, h3, h4, h5, p, ul, ol')]
        .filter((n) => text(n) && !n.parentElement.closest('p, ul, ol, h1, h2, h3, h4, h5'));
      const links = clone.querySelector('.btn-container');
      if (links) { const cta = ctaParagraph(document, links); if (cta) body.push(cta); }
      if (icon || body.length) cells.push([icon || '', body.length ? body : '']);
    });
  }

  if (variantFromCatalog !== undefined) variant = variantFromCatalog;
  const name = variant ? `cards-icon (${variant})` : 'cards-icon';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
