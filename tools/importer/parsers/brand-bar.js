/* eslint-disable */
/* global WebImporter */

/**
 * Parser: brand-bar
 * Source: div.family-brands-nav (family-of-brands strip: H&R Block, Block Advisors, Spruce)
 * Layout (blocks/brand-bar/README.md): one row, one cell per brand; each brand
 * is a link. Logos are inline SVGs on the source (not importable), so the
 * brand name is used as the link text. The current brand (hrblock.com) is bolded.
 */

const BRAND_NAMES = {
  hrb: 'H&R Block',
  barc: 'Block Advisors',
  spruce: 'Spruce',
};

function brandName(a) {
  const cls = [...a.classList].find((c) => BRAND_NAMES[c]);
  if (cls) return BRAND_NAMES[cls];
  const label = a.getAttribute('aria-label') || a.getAttribute('title');
  if (label) return label.trim();
  const svgTitle = a.querySelector('svg title');
  if (svgTitle && svgTitle.textContent.trim()) return svgTitle.textContent.trim();
  if (a.textContent.trim()) return a.textContent.trim();
  try {
    return new URL(a.href).hostname.replace(/^www\./, '');
  } catch (e) {
    return a.getAttribute('href') || '';
  }
}

export default function parse(element, { document }) {
  const brands = [...element.querySelectorAll('a.family-brand, .family-brands-row > a')]
    .filter((a, i, arr) => arr.indexOf(a) === i && a.getAttribute('href'));

  const row = brands.map((a) => {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = brandName(a);
    const p = document.createElement('p');
    let isCurrent = a.classList.contains('hrb') || a.classList.contains('active');
    try {
      isCurrent = isCurrent || /(^|\.)hrblock\.com$/.test(new URL(a.href).hostname);
    } catch (e) { /* ignore */ }
    if (isCurrent) {
      const strong = document.createElement('strong');
      strong.append(link);
      p.append(strong);
    } else {
      p.append(link);
    }
    return p;
  });

  const cells = row.length ? [row] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'brand-bar', cells });
  element.replaceWith(block);
}
