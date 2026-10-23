/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-media
 * Source: section.column-control (two columns) holding one or more
 *   section.accordian-section lists plus an optional image / intro column.
 * Layout (blocks/accordion-media/README.md):
 *   single-cell intro rows (heading/text), then item rows [title | body],
 *   single-cell footer rows (e.g. "See all" link), and a single-cell
 *   image-only row for the shared side image.
 * Variants (variants.json / catalog):
 *   link-list   - two accordion lists side by side
 *   dark        - white-theme section with photo column
 *   image-light - eggshell-theme section with a single list + photo
 *   light-2     - green-dark section with an illustration intro column
 *   light       - green-dark section with a text intro column (no image)
 *   (none)      - green-dark section with a photo column
 *   checklist   - no accordion: photo + intro with an icon check list (parseChecklist)
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]];
// the catalog variant wins over the DOM cues below (page-scoped, so other pages keep the cues).
// Only the variant name changes; rows stay [title | content] accordion items, and the
// repeating units (column li.col-2 holding a list, accordion ul > li items) are unchanged.
const CATALOG_VARIANTS = {
  // card-grid-landing (catalog variants, class selectors stable between catalog and live)
  "/tax-offices/drop-off/": [["section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control", "link-list"]],
  "/tax-offices/office-tax-preparation/": [["section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control", "link-list"]],
  "/tax-offices/virtual-tax-preparation/": [["section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control", "checklist"]],
  // form-page (catalog variant link-list: intro + arrow-link list, no accordion)
  "/universal/privacy-contact/": [["section.column-control.spruce-eggshell-theme.two-column-control:has(.iconlist)", "link-list"]],
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

function cleanInline(root) {
  root.querySelectorAll('svg, span.reader, a.reader, span.spacer, input, script, style, link, noscript').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, ' ').trim()));
  });
}

function hasContent(el) {
  return !!(el && (el.textContent.trim() || el.querySelector('img, picture, iframe')));
}

/* Flatten wrapper divs to their meaningful block-level children */
function collectContent(root, document) {
  const out = [];
  [...root.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = n.textContent.trim();
        out.push(p);
      }
      return;
    }
    if (n.nodeType !== 1 || !hasContent(n)) return;
    if (n.tagName === 'DIV' || n.tagName === 'SECTION') {
      out.push(...collectContent(n, document));
    } else if (n.tagName === 'BUTTON') {
      // JS-only <button> (no URL on the source): keep it as a CTA link to "#"
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = n.textContent.replace(/\s+/g, ' ').trim();
      const strong = document.createElement('strong');
      strong.append(a);
      const p = document.createElement('p');
      p.append(strong);
      out.push(p);
    } else if (n.tagName === 'A') {
      const p = document.createElement('p');
      p.append(n);
      out.push(p);
    } else {
      out.push(n);
    }
  });
  return out;
}

function getImage(root) {
  const img = root.querySelector('img');
  return img && img.getAttribute('src') ? img : null;
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
    img.alt = '';
    return img;
  } catch (e) {
    return null;
  }
}

/*
 * Checklist (no accordion list): photo column + intro column whose div.iconlist
 * holds icon + label items (/tax-offices/our-tax-pros/ "Levels of tax pros").
 * Intro row = heading, text, then one icon-led paragraph per item (the block
 * marks these as check items); a single-cell image row holds the side photo.
 */
function parseChecklist(element, document, catalogName) {
  const checks = [];
  element.querySelectorAll('.iconlist li').forEach((li) => {
    if (li.parentElement.closest('.iconlist li')) return;
    const label = li.querySelector('.icon-text-wrap') || li;
    const t = label.textContent.replace(/\s+/g, ' ').trim();
    if (!t) return;
    const p = document.createElement('p');
    // arrow-link lists (/universal/privacy-contact/ "Additional resources"): the item is a
    // link; the arrow icon is decorative
    const link = li.querySelector('a[href]');
    if (link && link.textContent.replace(/\s+/g, ' ').trim() === t) {
      const a = document.createElement('a');
      const href = link.getAttribute('href');
      a.href = /^javascript:/i.test(href) ? '#' : href;
      a.textContent = t;
      p.append(a);
      checks.push(p);
      return;
    }
    const svg = li.querySelector('.icon-wrap svg, svg');
    const icon = svg ? svgToImg(document, svg) : null;
    if (icon) p.append(icon);
    p.append(document.createTextNode(t));
    checks.push(p);
  });
  element.querySelectorAll('.iconlist').forEach((n) => n.remove());
  cleanInline(element);

  const columns = [...element.querySelectorAll('ul.column-container > li.column')]
    .filter((c) => !c.parentElement.closest('li.column'));
  let sideImage = null;
  const intro = [];
  columns.forEach((col) => {
    const img = getImage(col);
    const holder = col.cloneNode(true);
    holder.querySelectorAll('img, picture').forEach((n) => n.remove());
    if (img && !sideImage) sideImage = img;
    if (holder.textContent.trim()) intro.push(...collectContent(holder, document));
  });
  const cells = [];
  // link-list (/universal/privacy-contact/ "Additional resources"): intro text and the
  // arrow-link list are the source's two columns, so the links get their own cell
  const linksOnly = checks.length && checks.every((c) => c.querySelector('a') && !c.querySelector('img'));
  if (catalogName === 'link-list' && linksOnly && intro.length) {
    cells.push([intro, checks]);
  } else {
    intro.push(...checks);
    if (intro.length) cells.push([intro]);
  }
  if (sideImage) cells.push([sideImage]);
  // a named catalog variant wins (page-scoped); otherwise the checklist layout
  const name = catalogName ? `accordion-media (${catalogName})` : 'accordion-media (checklist)';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}

export default function parse(element, { document, params }) {
  const fromCatalog = catalogVariant(element, params);
  if (!element.querySelector('section.accordian-section') && element.querySelector('.iconlist')) {
    parseChecklist(element, document, fromCatalog);
    return;
  }
  cleanInline(element);
  const cells = [];

  const accSections = [...element.querySelectorAll('section.accordian-section')];
  const accColumns = new Set(accSections.map((s) => s.closest('li.column') || s.parentElement));
  const columns = [...element.querySelectorAll(':scope > .container > ul.column-container > li.column, :scope ul.column-container > li.column')]
    .filter((c, i, arr) => arr.indexOf(c) === i && !c.parentElement.closest('li.column'));

  // Intro text / image from columns that hold no accordion. A text-only side
  // column (no image, e.g. /easignup/ repayment details) is not part of the
  // accordion: the block's side column only takes media, so that column stays
  // default content before the block instead of being merged into the intro.
  const introParts = [];
  const beforeBlock = [];
  let sideImage = null;
  columns.forEach((col) => {
    if (accColumns.has(col)) return;
    const img = getImage(col);
    if (!img && hasContent(col)) {
      beforeBlock.push(...collectContent(col, document));
      return;
    }
    if (img && !sideImage) sideImage = img;
    const textHolder = col.cloneNode(true);
    textHolder.querySelectorAll('img, picture').forEach((n) => n.remove());
    if (textHolder.textContent.trim()) introParts.push(...collectContent(col, document).filter((n) => !n.querySelector || !n.matches('img') ));
  });
  // strip any image that collectContent may have pulled in
  const introClean = introParts.filter((n) => !(n.matches && (n.matches('img, picture') || (n.querySelector('img') && !n.textContent.trim()))));

  let introPushed = false;
  accSections.forEach((acc, idx) => {
    const heading = acc.querySelector('.accordionhead h1, .accordionhead h2, .accordionhead h3, .accordionhead h4, .accordionhead h5, .accordionhead h6');
    if (idx === 0) {
      const intro = [];
      if (heading) intro.push(heading);
      intro.push(...introClean);
      if (intro.length) cells.push([intro]);
      introPushed = true;
    } else if (heading) {
      cells.push([heading]);
    }

    const items = [...acc.querySelectorAll('ul.accordion > li')];
    items.forEach((li) => {
      const titleEl = li.querySelector('.drawer-header, header h3, header h4, header h5, header');
      const titleText = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
      if (!titleText) return;
      const title = document.createElement('p');
      title.textContent = titleText;
      const panel = li.querySelector('.detail-div, [role="region"]');
      const body = panel ? collectContent(panel, document) : [];
      cells.push([title, body.length ? body : '']);
    });

    // footer content inside the accordion column after the list (e.g. "See all" links)
    const col = acc.closest('li.column');
    if (col) {
      let sib = acc.nextElementSibling;
      while (sib) {
        if (hasContent(sib) && !sib.matches('section.accordian-section')) {
          const footer = collectContent(sib, document);
          if (footer.length) cells.push([footer]);
        }
        sib = sib.nextElementSibling;
      }
    }
  });

  if (!introPushed && introClean.length) cells.unshift([introClean]);
  if (sideImage) cells.push([sideImage]);

  // Variant detection
  let variant = null;
  if (accSections.length > 1) variant = 'link-list';
  else if (element.matches('.white-theme')) variant = 'dark';
  else if (element.matches('.spruce-eggshell-theme')) variant = 'image-light';
  else if (element.querySelector('.introImageVariant')) variant = 'light-2';
  else if (!sideImage) variant = 'light';

  if (fromCatalog !== undefined) variant = fromCatalog;
  const name = variant ? `accordion-media (${variant})` : 'accordion-media';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
  beforeBlock.forEach((n) => block.before(n));
}
