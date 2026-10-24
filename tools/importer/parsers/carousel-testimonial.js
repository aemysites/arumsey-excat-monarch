/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-testimonial
 * Source: suncorp.com.au review carousels (sg-Carousel slick list of content boxes:
 * a row of star images, the quote, and a "- Name from Suburb" line).
 *
 * Block table (blocks/carousel-testimonial/README.md): one row per review,
 *   [rating] [quote] [reviewer line starting with "-"]
 * The rating is the number of star images (half-star images count 0.5).
 * Slick clones, arrows and dots are dropped.
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function starCount(item) {
  // Each star sits in its own grid column, repeated once per breakpoint.
  const holders = [...item.querySelectorAll('.sg-Grid-col, [class*="sg-Grid-col"], span.Icon')]
    .filter((h) => h.querySelector('img[src*="star"]'));
  const units = holders.length
    ? holders.filter((h) => !holders.some((o) => o !== h && o.contains(h)))
    : [];
  let rating = 0;
  units.forEach((u) => {
    const img = u.querySelector('img[src*="star"]');
    const src = (img.getAttribute('src') || '').toLowerCase();
    if (/empty|outline|grey/.test(src)) return;
    rating += /half/.test(src) ? 0.5 : 1;
  });
  return rating;
}

export default function parse(element, { document, params }) {
  const carousel = element.closest('.sg-Carousel') || element;
  const items = [...element.querySelectorAll('.sg-Carousel-item')]
    .filter((item) => !item.classList.contains('slick-cloned'));

  const cells = items.map((item) => {
    const rating = starCount(item);
    const paras = [...item.querySelectorAll('div.rte p, div.rte li')].filter((p) => text(p));
    const reviewer = paras.find((p) => /^[-–—]/.test(text(p)));
    const quote = document.createElement('div');
    paras.filter((p) => p !== reviewer).forEach((p) => {
      const np = document.createElement('p');
      np.textContent = text(p);
      quote.append(np);
    });
    const who = reviewer ? text(reviewer).replace(/^[–—]\s*/, '- ') : '';
    return [rating ? String(rating) : '', quote.childNodes.length ? quote : '', who];
  }).filter((row) => row[1] || row[2]);

  // Arrows / dots of the slick wrapper are not content.
  if (carousel !== element) {
    carousel.querySelectorAll(':scope > .slick-arrow, :scope > button, :scope > .slick-dots').forEach((el) => el.remove());
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}
