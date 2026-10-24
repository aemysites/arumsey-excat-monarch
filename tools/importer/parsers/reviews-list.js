/* eslint-disable */
/* global WebImporter */

/**
 * Parser: reviews-list
 * Source: suncorp.com.au Bazaarvoice reviews widget (div[data-bv-show="reviews"]
 * [data-bv-product-id]). The reviews load by script, so the capture is usually an
 * empty container.
 *
 * Block table (blocks/reviews-list/README.md):
 *   summary rows      [score "4.3 out of 5"], [review count] (one per row)
 *   review rows       [rating] [title heading, author/date, review text]
 *   fragment row      [link to /fragments/reviews/<product-id>]
 * - Rendered reviews (schema.org itemprop="review") become review rows when the
 *   capture has them.
 * - The summary comes from the page's own server-rendered StarRating widget
 *   (same product), so the score and count stay real page data.
 * - Without rendered reviews, the review list is referenced as a shared fragment
 *   per product (/fragments/reviews/<product-id>); nothing is pushed onto
 *   params.fragments because the capture holds no review content to put there.
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function slugify(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'reviews';
}

function reviewRows(element, document) {
  return [...element.querySelectorAll('[itemprop="review"]')].map((review) => {
    const ratingEl = review.querySelector('[itemprop="ratingValue"]');
    const rating = (ratingEl && (ratingEl.getAttribute('content') || text(ratingEl))) || '';
    const body = document.createElement('div');
    const titleEl = review.querySelector('[itemprop="name"], h3, h4');
    if (titleEl && text(titleEl)) {
      const h = document.createElement('h3');
      h.textContent = text(titleEl);
      body.append(h);
    }
    const author = text(review.querySelector('[itemprop="author"]'));
    const dateEl = review.querySelector('[itemprop="datePublished"]');
    const date = dateEl ? (dateEl.getAttribute('content') || text(dateEl)) : '';
    if (author || date) {
      const p = document.createElement('p');
      p.textContent = [author, date].filter(Boolean).join(' · ');
      body.append(p);
    }
    const bodyEl = review.querySelector('[itemprop="reviewBody"], [itemprop="description"]');
    if (bodyEl && text(bodyEl)) {
      const p = document.createElement('p');
      p.textContent = text(bodyEl);
      body.append(p);
    }
    return rating && text(body) ? [rating, body] : null;
  }).filter(Boolean);
}

function pageSummary(element, document) {
  const star = [...document.querySelectorAll('.StarRating')].find((s) => !element.contains(s) && !s.closest('table'));
  if (!star) return null;
  const avg = text(star.querySelector('.StarRating-Summary--AverageOverallRating'));
  const range = text(star.querySelector('.StarRating-Summary--OverallRatingRange')) || '5';
  if (!avg) return null;
  const row = [`${avg} out of ${range}`];
  const countA = star.querySelector('.StarRating-Summary a[href]');
  const countText = text(star.querySelector('.StarRating-Summary--TotalReviewCount'));
  if (countA || countText) {
    const label = countA ? text(countA).replace(/^read all\s*/i, '') : `${countText} reviews`;
    row.push(label);
  }
  return row;
}

export default function parse(element, { document, params }) {
  const host = element.matches('[data-bv-show]') ? element : element.querySelector('[data-bv-show="reviews"]') || element;
  const product = host.getAttribute('data-bv-product-id') || '';
  const cells = [];

  const summary = pageSummary(element, document);
  // The block reads a 2+ cell row starting with a score as a review, so the
  // summary score and count go in separate single-cell rows (padded).
  if (summary) summary.forEach((value) => cells.push([value, '']));

  const reviews = reviewRows(element, document);
  if (reviews.length) {
    cells.push(...reviews);
  } else {
    const path = `/fragments/reviews/${slugify(product)}`;
    const a = document.createElement('a');
    a.href = path;
    a.textContent = path;
    cells.push([a, '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'reviews-list', cells });
  element.replaceWith(block);
}
