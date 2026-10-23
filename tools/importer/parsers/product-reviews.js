/* eslint-disable */
/* global WebImporter */

/**
 * Parser: product-reviews
 * Source: section.hrbcom-reviews - a Bazaarvoice placeholder
 *   (div[data-bv-show="reviews"][data-bv-product-id]) that BV fills client-side.
 * Layout (blocks/product-reviews/README.md): optional heading row; keyed rows
 *   Summary | rating | count | list of "5 stars: N"; Ratings | list; Page size | 8;
 *   Load more | label; then review rows: rating | content | sub-ratings | response.
 * The cached source DOM holds no review markup (BV renders it at runtime, often in
 * a shadow root). The parser reads rendered BV markup when present (light DOM or
 * open shadow roots, schema.org microdata / bv-* classes); otherwise it emits the
 * keyed config rows only so authors can paste reviews.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

/* all elements under root, including inside open shadow roots */
function deepQueryAll(root, selector) {
  const out = [];
  const visit = (node) => {
    if (!node) return;
    if (node.querySelectorAll) out.push(...node.querySelectorAll(selector));
    const all = node.querySelectorAll ? node.querySelectorAll('*') : [];
    all.forEach((el) => { if (el.shadowRoot) visit(el.shadowRoot); });
  };
  visit(root);
  if (root.shadowRoot) visit(root.shadowRoot);
  return [...new Set(out)];
}

function list(document, items) {
  const ul = document.createElement('ul');
  items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
  return ul;
}

function para(document, t) {
  const p = document.createElement('p');
  p.textContent = t;
  return p;
}

export default function parse(element, { document }) {
  const cells = [];

  const heading = [...element.querySelectorAll('h1, h2, h3')].find((h) => text(h) && !h.closest('[data-bv-show]'));
  if (heading) cells.push([heading]);

  // ---- summary (rendered BV markup, when available) ----
  const avgEl = deepQueryAll(element, '[itemprop="ratingValue"], .bv_avgRating_component_container, .bv-rating-ratio-number, .bv_averageRating_component_container')[0];
  const countEl = deepQueryAll(element, '[itemprop="reviewCount"], .bv_numReviews_text, .bv_numReviews_component_container')[0];
  const avg = avgEl ? (text(avgEl).match(/\d(\.\d)?/) || [])[0] : null;
  if (avg) {
    const dist = deepQueryAll(element, '.bv-histogram-filter-helper, [class*="histogram"] li, [data-bv-v="histogram"] li')
      .map((li) => text(li)).filter((t) => /\d\s*stars?/i.test(t))
      .map((t) => { const m = t.match(/(\d)\s*stars?\D*(\d[\d,]*)/i); return m ? `${m[1]} stars: ${m[2]}` : t; });
    const row = ['Summary', avg, countEl ? text(countEl).replace(/[()]/g, '') : ''];
    row.push(dist.length ? list(document, dist) : '');
    cells.push(row);
  }

  // ---- review items ----
  const reviews = deepQueryAll(element, '[itemprop="review"], li.bv-content-review, .bv-content-item, [data-bv-v="contentItem"]')
    .filter((r, i, arr) => !arr.some((o) => o !== r && o.contains(r)));
  reviews.forEach((r) => {
    const ratingEl = r.querySelector('[itemprop="ratingValue"], .bv-rating-stars-container, [class*="rating"]');
    const rating = ratingEl ? ((ratingEl.getAttribute('content') || text(ratingEl)).match(/\d(\.\d)?/) || [''])[0] : '';
    const content = [];
    const title = r.querySelector('[itemprop="name"], .bv-content-title, h3, h4');
    if (title && text(title)) { const h = document.createElement('h3'); h.textContent = text(title); content.push(h); }
    const author = r.querySelector('[itemprop="author"], .bv-author, .bv-content-author-name');
    if (author && text(author)) content.push(para(document, text(author)));
    const date = r.querySelector('[itemprop="dateCreated"], .bv-content-datetime, time');
    if (date && text(date)) content.push(para(document, text(date)));
    const body = r.querySelector('[itemprop="reviewBody"], .bv-content-summary-body-text, .bv-content-summary-body');
    if (body) body.querySelectorAll('p').forEach((p) => { if (text(p)) content.push(para(document, text(p))); });
    if (body && !body.querySelector('p') && text(body)) content.push(para(document, text(body)));
    const rec = r.querySelector('.bv-content-data-recommend-yes, .bv-content-recommend');
    if (rec && text(rec)) content.push(para(document, text(rec)));
    const subs = [...r.querySelectorAll('.bv-content-secondary-ratings-container li, .bv-secondary-rating')]
      .map((li) => text(li)).filter(Boolean);
    const response = r.querySelector('.bv-content-response, .bv-content-client-response');
    if (!content.length) return;
    cells.push([rating || '', content, subs.length ? list(document, subs) : '', response && text(response) ? para(document, text(response)) : '']);
  });

  cells.push(['Page size', '8']);
  cells.push(['Load more', 'Load more']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'product-reviews', cells });
  element.replaceWith(block);
}
