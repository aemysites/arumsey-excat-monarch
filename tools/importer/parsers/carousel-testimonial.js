/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-testimonial
 * Source: section.full-width.gray-background (expat slick testimonial slider), or
 *   an AEM testimonial slider (figure.testimonial-card items, /makeeveryblockbetter/)
 * Layout (blocks/carousel-testimonial/README.md):
 *   optional single-cell intro row (heading), then one row per testimonial:
 *   [author (photo, name, role) | quote]
 * Slick clones (.slick-cloned) are skipped so each testimonial appears once.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  element.querySelectorAll('svg, script, style, link, noscript, button.slick-arrow, ul.slick-dots').forEach((n) => n.remove());
  const cells = [];

  const heading = [...element.querySelectorAll('.ts-heading, h1, h2, h3')].find((h) => text(h));
  if (heading && !heading.closest('.testimonial-slide')) {
    const intro = [heading];
    const introCol = heading.closest('[class*="col-"]');
    if (introCol) {
      introCol.querySelectorAll('p').forEach((p) => { if (text(p)) intro.push(p); });
    }
    cells.push([intro]);
  }

  // AEM testimonial slider (figure.testimonial-card: round photo, cite name,
  // address role lines, blockquote) -> author | quote rows, variant photo
  const figures = [...element.querySelectorAll('figure.testimonial-card')];
  if (figures.length) {
    let photo = false;
    figures.forEach((fig) => {
      const author = [];
      const img = fig.querySelector('.testimonial-img img, img');
      if (img && img.getAttribute('src')) { author.push(img); photo = true; }
      const cite = fig.querySelector('cite');
      if (text(cite)) {
        const strong = document.createElement('strong');
        strong.textContent = text(cite);
        const np = document.createElement('p');
        np.append(strong);
        author.push(np);
      }
      fig.querySelectorAll('address p').forEach((p) => { if (text(p)) author.push(p); });
      const quote = [...fig.querySelectorAll('blockquote p')].filter((p) => text(p));
      if (!quote.length && !author.length) return;
      if (author.length) cells.push([author, quote.length ? quote : '']);
      else cells.push([quote]);
    });
    const name = photo ? 'carousel-testimonial (photo)' : 'carousel-testimonial';
    element.replaceWith(WebImporter.Blocks.createBlock(document, { name, cells }));
    return;
  }

  let slides = [...element.querySelectorAll('.slick-slide:not(.slick-cloned) .testimonial-slide')];
  if (!slides.length) slides = [...element.querySelectorAll('.testimonial-slide')];

  slides.forEach((slide) => {
    const authorBox = slide.querySelector('.testimonial-author-info');
    const author = [];
    if (authorBox) {
      const img = authorBox.querySelector('img');
      if (img) author.push(img);
      authorBox.querySelectorAll('p').forEach((p) => {
        if (!text(p)) return;
        if (p.classList.contains('author-name')) {
          const strong = document.createElement('strong');
          strong.textContent = text(p);
          const np = document.createElement('p');
          np.append(strong);
          author.push(np);
        } else {
          author.push(p);
        }
      });
    }
    const quoteBox = slide.querySelector('.testimonial-copy') || slide;
    const quote = [...quoteBox.querySelectorAll('p')].filter((p) => text(p) && !(authorBox && authorBox.contains(p)));
    if (!quote.length && !author.length) return;
    if (author.length) cells.push([author, quote.length ? quote : '']);
    else cells.push([quote]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}
