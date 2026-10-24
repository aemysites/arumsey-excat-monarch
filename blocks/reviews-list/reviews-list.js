/**
 * Reviews list: an overall rating summary, optional star distribution and a
 * list of customer reviews. Replaces a third-party reviews widget with
 * authored content.
 *
 * Authoring (defensive):
 * - Summary row(s): heading/text, a score cell ("4.3" or "4.3 out of 5") and a
 *   review-count link.
 * - Distribution rows: [5 stars] [1110] — renders a bar per star level.
 * - Review rows: [rating number] [review content: heading = title, then
 *   author/date and text]. Optional third cell: extra details.
 * - A cell holding only a link to a /fragments/ path loads that fragment
 *   (e.g. reviews maintained in a separate document).
 */
import { loadFragment } from '../fragment/fragment.js';

const SCORE_RE = /(\d+(?:[.,]\d+)?)\s*(?:out of|\/)\s*(\d+)/i;
const BARE_SCORE_RE = /^\(?\s*(\d+(?:[.,]\d+)?)\s*\)?$/;
const DIST_RE = /^(\d)\s*stars?$/i;

function parseScore(text) {
  const t = (text || '').trim();
  const m = t.match(SCORE_RE) || t.match(BARE_SCORE_RE);
  if (!m) return null;
  const score = parseFloat(m[1].replace(',', '.'));
  const max = m[2] ? parseFloat(m[2]) : 5;
  return Number.isFinite(score) ? { score, max } : null;
}

function buildStars(score, max = 5) {
  const total = Math.max(1, Math.round(max));
  const clamped = Math.min(Math.max(score, 0), total);
  const stars = document.createElement('span');
  stars.className = 'reviews-list-stars';
  stars.setAttribute('role', 'img');
  stars.setAttribute('aria-label', `Rated ${clamped} out of ${total}`);
  const glyphs = '★'.repeat(total);
  const empty = Object.assign(document.createElement('span'), { className: 'reviews-list-stars-empty', textContent: glyphs });
  const fill = Object.assign(document.createElement('span'), { className: 'reviews-list-stars-fill', textContent: glyphs });
  empty.setAttribute('aria-hidden', 'true');
  fill.setAttribute('aria-hidden', 'true');
  fill.style.width = `${(clamped / total) * 100}%`;
  stars.append(empty, fill);
  return stars;
}

function fragmentPath(cell) {
  const links = cell.querySelectorAll('a');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

function buildReview(cells) {
  const parsed = parseScore(cells[0].textContent);
  const li = document.createElement('li');
  li.className = 'reviews-list-review';
  const main = document.createElement('div');
  main.className = 'reviews-list-review-body';
  if (parsed) main.append(buildStars(parsed.score, parsed.max));
  const content = cells[1];
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const title = document.createElement('h3');
    title.className = 'reviews-list-review-title';
    title.textContent = heading.textContent.trim();
    heading.replaceWith(title);
  }
  main.append(...content.childNodes);
  li.append(main);
  if (cells[2] && cells[2].textContent.trim()) {
    const details = document.createElement('div');
    details.className = 'reviews-list-review-details';
    details.append(...cells[2].childNodes);
    li.append(details);
  }
  return li;
}

export default async function decorate(block) {
  await Promise.all([...block.querySelectorAll(':scope > div > div')].map(async (cell) => {
    const path = fragmentPath(cell);
    if (!path) return;
    const fragment = await loadFragment(path);
    if (fragment) cell.replaceChildren(...fragment.childNodes);
  }));

  const summary = document.createElement('div');
  summary.className = 'reviews-list-summary';
  const distribution = document.createElement('ul');
  distribution.className = 'reviews-list-distribution';
  const list = document.createElement('ol');
  list.className = 'reviews-list-items';
  const distRows = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    const first = cells[0].textContent.trim();

    if (cells.length >= 2 && DIST_RE.test(first)) {
      const count = parseInt(cells[1].textContent.replace(/[^\d]/g, ''), 10) || 0;
      distRows.push({ label: first, count });
      return;
    }
    if (cells.length >= 2 && parseScore(first)) {
      list.append(buildReview(cells));
      return;
    }
    cells.forEach((cell) => {
      const parsed = parseScore(cell.textContent);
      if (parsed && !cell.querySelector('a')) {
        const overall = document.createElement('div');
        overall.className = 'reviews-list-overall';
        const score = Object.assign(document.createElement('span'), { className: 'reviews-list-score', textContent: String(parsed.score) });
        overall.append(score, buildStars(parsed.score, parsed.max));
        summary.append(overall);
      } else {
        summary.append(...cell.childNodes);
      }
    });
  });

  const total = distRows.reduce((sum, r) => sum + r.count, 0);
  distRows.forEach(({ label, count }) => {
    const li = document.createElement('li');
    const name = Object.assign(document.createElement('span'), { className: 'reviews-list-distribution-label', textContent: label });
    const bar = document.createElement('span');
    bar.className = 'reviews-list-distribution-bar';
    const fill = document.createElement('span');
    fill.style.width = `${total ? (count / total) * 100 : 0}%`;
    bar.append(fill);
    const value = Object.assign(document.createElement('span'), { className: 'reviews-list-distribution-count', textContent: String(count) });
    li.append(name, bar, value);
    distribution.append(li);
  });

  const elements = [];
  if (summary.childNodes.length) elements.push(summary);
  if (distribution.children.length) elements.push(distribution);
  if (list.children.length) elements.push(list);
  if (!elements.length) {
    block.remove();
    return;
  }
  block.replaceChildren(...elements);
}
