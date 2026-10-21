import { getMetadata } from '../../scripts/aem.js';

/*
 * rating-summary
 * Live Zillow lender rating (score, stars, review count, "as of" date) fetched from a
 * server-side proxy, next to authored static parts (Zillow logo, copyright, Terms of Use,
 * "How this rating is calculated" link).
 *
 * The proxy holds the Zillow partner key; this file never sees a key.
 * Expected proxy response (JSON):
 *   { "rating": 4.85, "reviewCount": 4474, "asOf": "2026-10-20",
 *     "scale": 5, "reviewsUrl": "https://www.zillow.com/lender-profile/..." }
 * `scale` and `reviewsUrl` are optional.
 */

const ENDPOINT_KEYS = ['endpoint', 'feed', 'feed-url', 'feed url', 'source'];
const REVIEWS_KEYS = ['reviews', 'reviews-url', 'reviews url', 'reviews link'];
const PLACEHOLDER_KEY = 'zillowRatingEndpoint';
const METADATA_KEY = 'zillow-rating-endpoint';
const FETCH_TIMEOUT = 8000;

function cellValue(cell) {
  if (!cell) return '';
  const link = cell.querySelector('a[href]');
  return (link ? link.getAttribute('href') : cell.textContent).trim();
}

function toCamel(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

/**
 * Reads the endpoint from /placeholders.json (single or multi-sheet).
 * @returns {Promise<string>}
 */
async function endpointFromPlaceholders() {
  try {
    const resp = await fetch('/placeholders.json');
    if (!resp.ok) return '';
    const json = await resp.json();
    const rows = json.data || json.default?.data || [];
    const match = rows.find((row) => row.Key && toCamel(row.Key) === PLACEHOLDER_KEY);
    return (match?.Text || '').trim();
  } catch {
    return '';
  }
}

function toSafeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

/**
 * Validates and normalises the proxy response. Returns null when malformed.
 */
function parseFeed(data) {
  if (!data || typeof data !== 'object') return null;
  const rating = Number(data.rating);
  const scale = data.scale === undefined ? 5 : Number(data.scale);
  const reviewCount = Number(data.reviewCount);
  const asOf = data.asOf ? new Date(data.asOf) : null;
  if (!Number.isFinite(scale) || scale <= 0) return null;
  if (!Number.isFinite(rating) || rating < 0 || rating > scale) return null;
  if (!Number.isInteger(reviewCount) || reviewCount < 0) return null;
  if (!asOf || Number.isNaN(asOf.getTime())) return null;
  return {
    rating,
    scale,
    reviewCount,
    asOf,
    reviewsUrl: toSafeUrl(data.reviewsUrl),
  };
}

async function fetchFeed(endpoint) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const resp = await fetch(endpoint.href, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) return null;
    return parseFeed(await resp.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function formatDate(date) {
  // "as of" dates from the feed are calendar dates; format in UTC to avoid a day shift
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit', day: '2-digit', year: '2-digit', timeZone: 'UTC',
  }).format(date);
}

function buildScore(feed, authoredReviewsUrl) {
  const ratingText = String(Math.round(feed.rating * 100) / 100);
  const score = document.createElement('div');
  score.className = 'rating-summary-score';

  const value = document.createElement('div');
  value.className = 'rating-summary-value';
  const number = document.createElement('span');
  number.className = 'rating-summary-number';
  number.textContent = ratingText;
  const scale = document.createElement('span');
  scale.className = 'rating-summary-scale';
  scale.textContent = `out of ${feed.scale}`;
  value.append(number, scale);

  const details = document.createElement('div');
  details.className = 'rating-summary-details';

  const stars = document.createElement('div');
  stars.className = 'rating-summary-stars';
  stars.setAttribute('role', 'img');
  stars.setAttribute('aria-label', `Rated ${ratingText} out of ${feed.scale} stars`);
  stars.style.setProperty('--rating-percent', `${(feed.rating / feed.scale) * 100}%`);

  const meta = document.createElement('p');
  meta.className = 'rating-summary-meta';
  meta.append(`Average rating as of ${formatDate(feed.asOf)} based on `);
  // citi.com prints the raw count ("4474 reviews"), no thousands separator
  const countText = `${feed.reviewCount} reviews`;
  const reviewsUrl = feed.reviewsUrl || authoredReviewsUrl;
  if (reviewsUrl) {
    const link = document.createElement('a');
    link.href = reviewsUrl.href;
    link.textContent = countText;
    meta.append(link);
  } else {
    meta.append(countText);
  }

  details.append(stars, meta);
  score.append(value, details);
  return score;
}

export default async function decorate(block) {
  let authoredEndpoint = '';
  let authoredReviews = '';
  const contentCells = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells.length > 1 ? cells[0].textContent.trim().toLowerCase() : '';
    if (ENDPOINT_KEYS.includes(key)) {
      authoredEndpoint = cellValue(cells[1]);
      row.remove();
      return;
    }
    if (REVIEWS_KEYS.includes(key)) {
      authoredReviews = cellValue(cells[1]);
      row.remove();
      return;
    }
    cells.forEach((cell) => {
      if (cell.textContent.trim() || cell.querySelector('picture, img')) contentCells.push(cell);
    });
    row.remove();
  });

  // attribution = cell with the Zillow logo (or the last cell when there are several)
  let attributionIndex = contentCells.findIndex((cell) => cell.querySelector('picture, img, .icon'));
  if (attributionIndex < 0 && contentCells.length > 1) attributionIndex = contentCells.length - 1;

  const ratingCol = document.createElement('div');
  ratingCol.className = 'rating-summary-rating';
  const attributionCol = document.createElement('div');
  attributionCol.className = 'rating-summary-attribution';

  const ratingStatic = document.createElement('div');
  ratingStatic.className = 'rating-summary-links';
  contentCells.forEach((cell, i) => {
    (i === attributionIndex ? attributionCol : ratingStatic).append(...cell.childNodes);
  });
  ratingCol.append(ratingStatic);
  block.append(ratingCol);
  if (attributionCol.childNodes.length) block.append(attributionCol);

  block.classList.add('rating-summary-loading');

  // load the live score without holding up section rendering
  const loadScore = async () => {
    const endpointValue = authoredEndpoint
      || getMetadata(METADATA_KEY)
      || await endpointFromPlaceholders();
    const endpoint = toSafeUrl(endpointValue);
    const feed = endpoint ? await fetchFeed(endpoint) : null;

    block.classList.remove('rating-summary-loading');
    if (!feed) {
      // no endpoint, failed request or malformed data: hide the score, keep static parts
      block.classList.add('rating-summary-unavailable');
      return;
    }
    ratingCol.prepend(buildScore(feed, toSafeUrl(authoredReviews)));
  };
  loadScore();
}
