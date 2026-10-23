/**
 * product-reviews: rating snapshot, average ratings, filter/sort and a paged
 * list of customer reviews with optional company responses.
 *
 * Authored rows (keyed rows may be omitted; order is free):
 *   (heading row)  | Reviews
 *   Summary        | 4.5 | 211891 Reviews | list "5 stars: 163665", "4 stars: 24262"...
 *   Ratings        | list "Accuracy & Tax Expertise: 4.5", "Ease of use: 4.6"...
 *   Page size      | 8
 *   Load more      | Load More
 *   (review rows)  | rating (e.g. 5) | review content | sub-ratings list | response
 * Review content: title (heading or bold first line), author, date, body,
 * "Pros: ..." / "Cons: ..." lines and an optional recommend line.
 */

const CONFIG_KEYS = ['summary', 'ratings', 'page size', 'load more'];

function parseRatingList(cell) {
  if (!cell) return [];
  return [...cell.querySelectorAll('li')].map((li) => {
    const m = li.textContent.trim().match(/^(.*?)[\s:–-]+([\d.,]+)\s*$/);
    return m ? { label: m[1].trim(), value: Number(m[2].replace(/,/g, '')) } : null;
  }).filter(Boolean);
}

function stars(value, label) {
  const el = document.createElement('span');
  el.className = 'product-reviews-stars';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', label || `${value} out of 5 stars`);
  el.style.setProperty('--product-reviews-rating', String(Math.min(5, Math.max(0, value))));
  el.textContent = '★★★★★';
  return el;
}

function bar(label, value, max, display) {
  const row = document.createElement('div');
  row.className = 'product-reviews-bar';
  const name = document.createElement('span');
  name.className = 'product-reviews-bar-label';
  name.textContent = label;
  const track = document.createElement('span');
  track.className = 'product-reviews-bar-track';
  track.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('span');
  fill.className = 'product-reviews-bar-fill';
  fill.style.width = `${max ? Math.min(100, (value / max) * 100) : 0}%`;
  track.append(fill);
  const num = document.createElement('span');
  num.className = 'product-reviews-bar-value';
  num.textContent = display ?? String(value);
  row.append(name, track, num);
  return row;
}

function panelLabel(text) {
  const el = document.createElement('p');
  el.className = 'product-reviews-label';
  el.textContent = text;
  return el;
}

function decorateContent(cell) {
  const content = document.createElement('div');
  content.className = 'product-reviews-content';
  content.append(...cell.childNodes);
  const title = content.querySelector('h1, h2, h3, h4, h5, h6')
    || content.querySelector(':scope > p:first-child > strong:only-child')?.parentElement;
  if (title) title.classList.add('product-reviews-title');
  const markPrefix = (p) => {
    const first = p.firstChild;
    if (first?.nodeType !== Node.TEXT_NODE) return;
    const m = first.textContent.match(/^\s*(pros|cons)\s*:?\s*/i);
    if (!m) return;
    const label = document.createElement('strong');
    const [prefix, word] = m;
    label.textContent = word;
    first.textContent = first.textContent.slice(prefix.length);
    p.prepend(label, ' ');
  };
  content.querySelectorAll(':scope > p').forEach((p) => {
    const t = p.textContent.trim();
    if (/^pros\b/i.test(t)) {
      p.classList.add('product-reviews-pros');
      markPrefix(p);
    } else if (/^cons\b/i.test(t)) {
      p.classList.add('product-reviews-cons');
      markPrefix(p);
    } else if (/recommend/i.test(t) && t.length < 60) {
      p.classList.add('product-reviews-recommend');
    } else if (/\bago\b|^\d{1,2}\/\d{1,2}\/\d{2,4}$/i.test(t) && t.length < 30) {
      p.classList.add('product-reviews-date');
    }
  });
  const author = title?.nextElementSibling;
  if (author?.tagName === 'P' && !author.className && author.textContent.trim().length < 40) {
    author.classList.add('product-reviews-author');
  }
  return content;
}

function buildReview(row) {
  const cells = [...row.children];
  let rating = null;
  if (cells.length > 1 && /^\s*\d(\.\d+)?\s*$/.test(cells[0].textContent)) {
    rating = Number(cells.shift().textContent.trim());
  }
  const [contentCell, ratingsCell, responseCell] = cells;
  if (!contentCell || !contentCell.textContent.trim()) return null;

  const article = document.createElement('article');
  article.className = 'product-reviews-review';
  article.dataset.rating = rating ?? '';
  const main = document.createElement('div');
  main.className = 'product-reviews-review-main';
  if (rating !== null) main.append(stars(rating));
  main.append(decorateContent(contentCell));
  article.append(main);

  const sub = parseRatingList(ratingsCell);
  if (sub.length) {
    const aside = document.createElement('div');
    aside.className = 'product-reviews-subratings';
    sub.forEach((s) => aside.append(bar(s.label, s.value, 5, s.value.toFixed(1))));
    article.append(aside);
  }
  if (responseCell && responseCell.textContent.trim()) {
    const response = document.createElement('div');
    response.className = 'product-reviews-response';
    response.append(...responseCell.childNodes);
    article.append(response);
  }
  return { el: article, rating, order: 0 };
}

function makeSelect(labelText, options, className) {
  const wrap = document.createElement('div');
  wrap.className = className;
  const id = `${className}-${Math.random().toString(36).slice(2, 8)}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;
  const select = document.createElement('select');
  select.id = id;
  options.forEach(([value, text]) => {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = text;
    select.append(o);
  });
  wrap.append(label, select);
  return { wrap, select };
}

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'product-reviews-header';
  const reviews = [];
  let summary = null;
  let averages = [];
  let pageSize = 8;
  let loadMoreText = 'Load More';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const key = cells[0].textContent.trim().toLowerCase();
    if (CONFIG_KEYS.includes(key) && cells.length > 1) {
      if (key === 'summary') {
        summary = {
          value: Number((cells[1]?.textContent || '').replace(/[^\d.]/g, '')) || 0,
          count: cells[2]?.textContent.trim() || '',
          dist: parseRatingList(cells.find((c) => c.querySelector('li'))),
        };
      } else if (key === 'ratings') {
        averages = parseRatingList(cells[1]);
      } else if (key === 'page size') {
        pageSize = Math.max(1, parseInt(cells[1].textContent, 10) || pageSize);
      } else if (key === 'load more') {
        loadMoreText = cells[1].textContent.trim() || loadMoreText;
      }
      return;
    }
    if (!reviews.length && cells.length === 1 && cells[0].querySelector('h1, h2, h3, h4, h5, h6')) {
      header.append(...cells[0].childNodes);
      return;
    }
    const review = buildReview(row);
    if (review) {
      review.order = reviews.length;
      reviews.push(review);
    }
  });

  const root = document.createElement('div');
  root.className = 'product-reviews-inner';
  if (header.childNodes.length) root.append(header);

  if (summary) {
    const snap = document.createElement('div');
    snap.className = 'product-reviews-snapshot';
    if (summary.dist.length) {
      const dist = document.createElement('div');
      dist.className = 'product-reviews-distribution';
      dist.append(panelLabel('Rating Snapshot'));
      const max = summary.dist.reduce((acc, d) => acc + d.value, 0);
      summary.dist.forEach((d) => {
        dist.append(bar(d.label, d.value, max, String(d.value)));
      });
      snap.append(dist);
    }
    const overallCol = document.createElement('div');
    overallCol.className = 'product-reviews-overall-col';
    overallCol.append(panelLabel('Overall Rating'));
    const overall = document.createElement('div');
    overall.className = 'product-reviews-overall';
    const num = document.createElement('span');
    num.className = 'product-reviews-overall-value';
    num.textContent = String(summary.value);
    const count = document.createElement('span');
    count.className = 'product-reviews-overall-count';
    count.textContent = summary.count;
    overall.append(num, stars(summary.value), count);
    overallCol.append(overall);
    snap.append(overallCol);
    root.append(snap);
  }

  if (averages.length) {
    const avg = document.createElement('div');
    avg.className = 'product-reviews-averages';
    avg.append(panelLabel('Average Customer Ratings'));
    const items = document.createElement('div');
    items.className = 'product-reviews-averages-items';
    averages.forEach((a) => items.append(bar(a.label, a.value, 5, a.value.toFixed(1))));
    avg.append(items);
    root.append(avg);
  }

  if (!reviews.length) {
    block.replaceChildren(root);
    return;
  }

  const hasRatings = reviews.some((r) => r.rating !== null);
  const toolbar = document.createElement('div');
  toolbar.className = 'product-reviews-toolbar';
  const status = document.createElement('p');
  status.className = 'product-reviews-status';
  status.setAttribute('aria-live', 'polite');
  const filter = makeSelect('Filter reviews', [['', 'Rating'], ['5', '5 stars'], ['4', '4 stars'], ['3', '3 stars'], ['2', '2 stars'], ['1', '1 star']], 'product-reviews-filter');
  const sort = makeSelect('Sort by', [['', 'Most recent'], ['high', 'Highest to Lowest Rating'], ['low', 'Lowest to Highest Rating']], 'product-reviews-sort');
  if (hasRatings) toolbar.append(filter.wrap);
  toolbar.append(status);
  if (hasRatings) toolbar.append(sort.wrap);
  root.append(toolbar);

  const list = document.createElement('div');
  list.className = 'product-reviews-list';
  root.append(list);

  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'button primary product-reviews-more';
  more.textContent = loadMoreText;
  root.append(more);

  let visible = pageSize;
  const render = () => {
    const f = filter.select.value;
    let items = reviews.filter((r) => !f || Math.round(r.rating ?? -1) === Number(f));
    if (sort.select.value === 'high') items = [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.order - b.order);
    else if (sort.select.value === 'low') items = [...items].sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0) || a.order - b.order);
    const shown = items.slice(0, visible);
    list.replaceChildren(...shown.map((r) => r.el));
    status.textContent = items.length
      ? `${shown.length ? 1 : 0} – ${shown.length} of ${items.length} Reviews`
      : 'No reviews match this filter.';
    more.hidden = shown.length >= items.length;
  };

  filter.select.addEventListener('change', () => { visible = pageSize; render(); });
  sort.select.addEventListener('change', () => { visible = pageSize; render(); });
  more.addEventListener('click', () => { visible += pageSize; render(); });
  render();

  block.replaceChildren(root);
}
