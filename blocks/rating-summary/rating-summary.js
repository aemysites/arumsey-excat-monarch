/**
 * Rating summary: review badge, star rating, score and a review-count link,
 * optionally beside a heading and intro text.
 *
 * Authoring (defensive, any order of cells):
 * - Badge: a cell holding only an image (optionally linked).
 * - Score: a cell like "4.3", "(4.3 out of 5)" or "4.3/5". Star fill derives from it.
 * - Review count: a link such as "1770 Car Reviews" (a link like "4.3 (1770)"
 *   also supplies the score).
 * - Intro: any other content (heading, paragraphs).
 * - Optional key/value rows: `score`, `max` (default 5), `count`, `badge`.
 *
 * Options (classes): intro-text (rating beside a heading and paragraphs).
 */

const SCORE_RE = /(\d+(?:[.,]\d+)?)\s*(?:out of|\/|of)\s*(\d+)/i;
const BARE_SCORE_RE = /^\(?\s*(\d+(?:[.,]\d+)?)\s*\)?$/;
const KEYS = ['score', 'rating', 'max', 'count', 'reviews', 'badge'];

function parseNumber(value) {
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function parseScore(text) {
  const t = (text || '').trim();
  let m = t.match(SCORE_RE);
  if (m) return { score: parseNumber(m[1]), max: parseNumber(m[2]) };
  m = t.match(BARE_SCORE_RE);
  if (m) return { score: parseNumber(m[1]), max: null };
  return null;
}

// Star strip geometry (px): the default sprite spreads 5 stars 17px wide over 114px;
// the compact (key/value) row uses 20px stars 21px apart (104px), as on the source.
const STAR_GEOMETRY = {
  default: { width: 17, pitch: 24.25 },
  compact: { width: 20, pitch: 21 },
};

/**
 * Fill width as a share of the strip, so partial stars are cropped on the star
 * glyph rather than on the gaps between stars (4.3 of 5 fills ~89.6%).
 */
function fillPercent(score, total, { width: starWidth, pitch }) {
  const stripWidth = pitch * (total - 1) + starWidth;
  const full = Math.floor(score);
  const width = full >= total
    ? stripWidth
    : full * pitch + (score - full) * starWidth;
  return Math.round((width / stripWidth) * 10000) / 100;
}

function buildStars(score, max, geometry) {
  const total = Math.max(1, Math.round(max || 5));
  const clamped = Math.min(Math.max(score, 0), total);
  const stars = document.createElement('span');
  stars.className = 'rating-summary-stars';
  stars.setAttribute('role', 'img');
  stars.setAttribute('aria-label', `Rated ${clamped} out of ${total}`);
  stars.style.setProperty('--rating-summary-star-count', total);
  const fill = document.createElement('span');
  fill.className = 'rating-summary-stars-fill';
  fill.setAttribute('aria-hidden', 'true');
  fill.style.width = `${fillPercent(clamped, total, geometry)}%`;
  stars.append(fill);
  return stars;
}

/** Wraps a leading "Read all" so only the count shows, as on the source. */
function markCountPrefix(link) {
  const first = link.firstChild;
  if (first?.nodeType !== Node.TEXT_NODE) return;
  const m = first.textContent.match(/^\s*read all\s+/i);
  if (!m || !first.textContent.slice(m[0].length).trim()) return;
  const prefix = document.createElement('span');
  prefix.className = 'rating-summary-count-prefix';
  [prefix.textContent] = m;
  first.textContent = first.textContent.slice(m[0].length);
  link.prepend(prefix);
}

export default function decorate(block) {
  let badge = null;
  let score = null;
  let max = null;
  let scoreText = '';
  let countLink = null;
  let countText = '';
  const intro = [];
  let keyed = false;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (cells.length >= 2 && KEYS.includes(key)) {
      keyed = true;
      const value = cells[1];
      if (key === 'score' || key === 'rating') {
        const parsed = parseScore(value.textContent);
        if (parsed) ({ score } = parsed);
        if (parsed?.max) ({ max } = parsed);
      } else if (key === 'max') {
        max = parseNumber(value.textContent);
      } else if (key === 'badge') {
        badge = value.querySelector('picture, img')?.closest('a') || value.querySelector('picture, img');
      } else {
        countLink = value.querySelector('a');
        if (!countLink) countText = value.textContent.trim();
      }
      return;
    }

    cells.forEach((cell) => {
      const text = cell.textContent.trim();
      const media = cell.querySelector('picture, img');
      if (media && !text && !badge) {
        badge = media.closest('a') || media.closest('picture') || media;
        return;
      }
      const links = [...cell.querySelectorAll('a')];
      const nonLinkText = links.reduce((t, a) => t.replace(a.textContent.trim(), ''), text).trim();
      const parsed = parseScore(nonLinkText) || (links.length ? null : parseScore(text));
      if (parsed && score === null) {
        ({ score } = parsed);
        if (parsed.max) ({ max } = parsed);
        scoreText = nonLinkText;
      }
      if (links.length && !countLink && (parsed || !nonLinkText || /review/i.test(links[0].textContent))) {
        [countLink] = links;
        if (score === null) {
          const fromLink = parseScore(countLink.textContent.split('(')[0]);
          if (fromLink) ({ score } = fromLink);
        }
        return;
      }
      if (parsed && nonLinkText === text) return;
      if (text || media) intro.push(...cell.childNodes);
    });
  });

  // key/value rows with no badge and no intro: compact row of stars, "4.3" and "(1770)"
  const hasIntro = intro.some((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim());
  const compact = keyed && !badge && !hasIntro;
  block.classList.toggle('rating-summary-compact', compact);

  const rating = document.createElement('div');
  rating.className = 'rating-summary-rating';
  if (score !== null) {
    const value = document.createElement('span');
    value.className = 'rating-summary-value';
    value.append(buildStars(score, max, STAR_GEOMETRY[compact ? 'compact' : 'default']));
    const scoreEl = document.createElement('span');
    scoreEl.className = 'rating-summary-score';
    if (compact) scoreEl.textContent = String(score);
    else scoreEl.textContent = scoreText || `(${score} out of ${max || 5})`;
    if (!scoreText && countLink && /^\s*\d/.test(countLink.textContent)
      && parseScore(countLink.textContent.split('(')[0])) {
      scoreEl.hidden = true;
    }
    value.append(scoreEl);
    rating.append(value);
  }
  const countNumber = (countLink?.textContent || countText).match(/\d[\d,]*/)?.[0];
  if (compact && countNumber) {
    // source: "(1770)" scrolls to the reviews list
    // reuse the page's reviews anchor from a sibling rating-summary link (e.g. #home-reviews)
    const anchor = document.querySelector('main a.rating-summary-count[href^="#"]')?.getAttribute('href');
    const link = countLink || Object.assign(document.createElement('a'), { href: anchor || '#reviews' });
    link.className = 'rating-summary-count';
    link.textContent = `(${countNumber})`;
    link.setAttribute('aria-label', `Read ${countNumber} reviews`);
    link.removeAttribute('title');
    link.closest('.button-container')?.classList.remove('button-container');
    rating.append(link);
  } else if (countLink) {
    countLink.classList.remove('button', 'primary', 'secondary');
    countLink.classList.add('rating-summary-count');
    countLink.closest('.button-container')?.classList.remove('button-container');
    markCountPrefix(countLink);
    rating.append(countLink);
  } else if (countText) {
    rating.append(Object.assign(document.createElement('span'), { className: 'rating-summary-count', textContent: countText }));
  }

  const elements = [];
  const summary = document.createElement('div');
  summary.className = 'rating-summary-summary';
  if (badge) {
    const badgeEl = document.createElement('div');
    badgeEl.className = 'rating-summary-badge';
    badgeEl.append(badge);
    summary.append(badgeEl);
  }
  if (rating.children.length) summary.append(rating);
  if (summary.children.length) elements.push(summary);

  const introEl = document.createElement('div');
  introEl.className = 'rating-summary-intro';
  introEl.append(...intro.filter((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim()));
  if (introEl.textContent.trim() || introEl.querySelector('picture, img')) elements.push(introEl);

  if (!elements.length) {
    block.remove();
    return;
  }
  block.replaceChildren(...elements);
}
