/* eslint-disable */
/* global WebImporter */

/**
 * Parser: rating-summary
 * Source: suncorp.com.au Bazaarvoice rating summaries: the server-rendered
 * StarRating widget (badge, "(4.3 out of 5)", "Read all 1770 Car Reviews" link),
 * optionally beside a heading + intro text, and the client-rendered
 * bv_main_container summary button (score + count only).
 *
 * Block table (blocks/rating-summary/README.md):
 *   one row: [badge image] [score "(4.3 out of 5)"] [review count link]
 *            (+ heading / text cells with the intro-text option)
 *   or key/value rows [score] [4.2], [max] [5], [count] [978 reviews] when the
 *   source is the client-rendered widget without a link.
 * Star images (empty/full sprites) are not content and are dropped.
 *
 * Variant classes (from markup, matching the catalog names):
 *   intro-text - the rating sits in a grid column beside a heading and paragraphs
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

export default function parse(element, { document, params }) {
  const star = element.matches('.StarRating') ? element : element.querySelector('.StarRating');
  let variant = null;
  const cells = [];

  if (star) {
    const row = [];
    const badgeImg = star.querySelector('.CustomReview-image img');
    if (badgeImg) {
      const img = document.createElement('img');
      img.src = badgeImg.getAttribute('src');
      img.alt = badgeImg.getAttribute('alt') || '';
      row.push(img);
    }
    const avg = text(star.querySelector('.StarRating-Summary--AverageOverallRating'));
    const range = text(star.querySelector('.StarRating-Summary--OverallRatingRange')) || '5';
    if (avg) row.push(`(${avg} out of ${range})`);
    const countA = star.querySelector('.StarRating-Summary a[href], a.StarRating-Summary--intro');
    if (countA) {
      const a = document.createElement('a');
      a.href = countA.getAttribute('href');
      a.textContent = text(countA);
      row.push(a);
    }

    // Intro text beside the rating (grid column next to it).
    const ratingCol = star.closest('[class*="sg-Grid-col"]');
    if (ratingCol && element.contains(ratingCol)) {
      const siblings = [...ratingCol.parentElement.children].filter((c) => c !== ratingCol && text(c));
      if (siblings.length) {
        variant = 'intro-text';
        siblings.forEach((col) => {
          col.querySelectorAll('style, script, a:not([href])').forEach((e) => { if (!text(e) || e.tagName !== 'A') e.remove(); });
          const cell = document.createElement('div');
          col.querySelectorAll('div.rte').forEach((r) => {
            if (!r.parentElement.closest('div.rte')) cell.append(...r.childNodes);
          });
          if (text(cell)) row.push(cell);
        });
      }
    }
    cells.push(row);
  } else {
    // Client-rendered Bazaarvoice summary: score and count only.
    const score = text(element.querySelector('.bv_avgRating_component_container'))
      || (element.querySelector('meta[itemprop="ratingValue"]') || { getAttribute: () => '' }).getAttribute('content');
    const best = (element.querySelector('meta[itemprop="bestRating"]') || { getAttribute: () => '' }).getAttribute('content');
    const countMeta = element.querySelector('meta[itemprop="reviewCount"]');
    const count = (countMeta && countMeta.getAttribute('content'))
      || text(element.querySelector('.bv_numReviews_text')).replace(/[()]/g, '');
    if (score) cells.push(['score', score]);
    if (best && best !== '5') cells.push(['max', best]);
    if (count) cells.push(['count', `${count} reviews`]);
  }

  const name = variant ? `rating-summary (${variant})` : 'rating-summary';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
