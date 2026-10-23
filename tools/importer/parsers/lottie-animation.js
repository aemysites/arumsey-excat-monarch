/* eslint-disable */
/* global WebImporter */

/**
 * Parser: lottie-animation
 * Source: section.column-control holding a .lottie-container with a
 *   <lottie-player src="....json"> (plus play/pause buttons).
 * Layout (blocks/lottie-animation/README.md): one cell: absolute link to the
 *   Lottie .json file (link text = accessible label), optional second link to
 *   the narrow (mobile) .json; optional fallback picture.
 * Variant: catalog lookup, falling back to `ribbon` for a full-width
 *   single-column animation strip (the only form used on these pages).
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/lp/creator-taxes/": [["#container-d8006e96a0 > section:nth-child(7)", "ribbon"]],
  // campaign-full-bleed-hero (catalog variant default, not ribbon)
  "/outlook-on-american-life/": [["section.column-control:has(lottie-player)", null]],
  // tool-guide-page (catalog variant default, not ribbon)
  "/tax-offices/business-services/business-formation-incorporation-services/": [["section.column-control:has(.lottie-container)", null]],
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


/* Lottie JSON lives on www.hrblock.com (/content/dam/...): site-relative links 404 on EDS */
function absolute(src) {
  try { return new URL(src, 'https://www.hrblock.com/').href; } catch (e) { return src; }
}

export default function parse(element, { document, params }) {
  const players = [...element.querySelectorAll('lottie-player[src], [data-lottie-src], [data-animation-path]')];
  const cell = [];
  const seen = new Set();
  const addLink = (src, label) => {
    const href = absolute(src);
    if (!src || seen.has(href)) return;
    seen.add(href);
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    const p = document.createElement('p');
    p.append(a);
    cell.push(p);
  };
  players.forEach((pl) => {
    const src = pl.getAttribute('src') || pl.getAttribute('data-lottie-src') || pl.getAttribute('data-animation-path');
    const label = pl.getAttribute('aria-label') || pl.getAttribute('title') || 'Animation';
    addLink(src, label);
    // mobile composition (a hide-large twin, recorded by hrblock-cleanup):
    // second link = narrow animation used below 900px
    const narrow = pl.getAttribute('data-excat-narrow-src');
    if (narrow) addLink(narrow, `${label} (mobile)`);
  });
  const fallback = element.querySelector('.lottie-container img, img');
  if (fallback && fallback.getAttribute('src')) cell.push(fallback);

  let variant = catalogVariant(element, params);
  if (variant === undefined) {
    const single = !element.matches('.two-column-control') && !!element.querySelector('li.col-1 .lottie-container');
    variant = single ? 'ribbon' : null;
  }

  const cells = cell.length ? [[cell]] : [];
  const name = variant ? `lottie-animation (${variant})` : 'lottie-animation';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
