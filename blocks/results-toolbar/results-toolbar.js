/**
 * results-toolbar: result count, sort select and reset link above a listing.
 *
 * Authored cells (any may be missing):
 *  1. Result count text, e.g. "29 results" (number is updated by
 *     `results-toolbar:count` events: `detail: { count }`).
 *  2. Sort options as a list. A linked item navigates on select; a plain item
 *     sets the `sort` query parameter and dispatches `results-toolbar:sort`.
 *  3. Reset link, e.g. "Reset Filters".
 */

function toSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function classifyCell(cell) {
  if (cell.querySelector('ul, ol')) return 'sort';
  const text = cell.textContent.trim();
  const link = cell.querySelector('a');
  if (link && link.textContent.trim() === text) return 'reset';
  if (/\d/.test(text) || cell.querySelector('h1, h2, h3, h4, h5, h6')) return 'count';
  return text ? 'count' : 'empty';
}

function buildSort(cell, block) {
  const items = [...cell.querySelectorAll('li')];
  if (!items.length) return null;
  const label = cell.querySelector(':scope > p')?.textContent.trim() || 'Sort by';
  const params = new URLSearchParams(window.location.search);
  const current = params.get('sort');

  const wrapper = document.createElement('div');
  wrapper.className = 'results-toolbar-sort';
  const id = `results-toolbar-sort-${Math.random().toString(36).slice(2, 8)}`;
  const lbl = document.createElement('label');
  lbl.className = 'results-toolbar-sort-label';
  lbl.htmlFor = id;
  lbl.textContent = label;
  const select = document.createElement('select');
  select.id = id;

  items.forEach((li) => {
    const a = li.querySelector('a');
    const option = document.createElement('option');
    option.textContent = li.textContent.trim();
    option.value = toSlug(option.textContent);
    if (a) option.dataset.href = a.href;
    const isCurrent = a
      ? new URL(a.href, window.location.href).pathname === window.location.pathname
      : option.value === current;
    if (isCurrent) option.selected = true;
    select.append(option);
  });

  select.addEventListener('change', () => {
    const option = select.selectedOptions[0];
    if (!option) return;
    if (option.dataset.href) {
      window.location.href = option.dataset.href;
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('sort', option.value);
    window.history.replaceState({}, '', url);
    block.dispatchEvent(new CustomEvent('results-toolbar:sort', {
      bubbles: true,
      detail: { value: option.value, label: option.textContent },
    }));
  });

  wrapper.append(lbl, select);
  return wrapper;
}

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const bar = document.createElement('div');
  bar.className = 'results-toolbar-bar';
  let count;
  let sort;
  let reset;

  cells.forEach((cell) => {
    const type = classifyCell(cell);
    if (type === 'count' && !count) {
      count = document.createElement('div');
      count.className = 'results-toolbar-count';
      count.setAttribute('aria-live', 'polite');
      count.append(...cell.childNodes);
    } else if (type === 'sort' && !sort) {
      sort = buildSort(cell, block);
    } else if (type === 'reset' && !reset) {
      reset = document.createElement('div');
      reset.className = 'results-toolbar-reset';
      reset.append(...cell.childNodes);
      reset.querySelectorAll('a').forEach((a) => a.classList.remove('button', 'primary', 'secondary'));
    }
  });

  [count, sort, reset].filter(Boolean).forEach((el) => bar.append(el));
  block.replaceChildren(bar);

  if (count) {
    document.addEventListener('results-toolbar:count', (e) => {
      const n = e.detail?.count;
      if (typeof n !== 'number') return;
      const target = count.querySelector('h1, h2, h3, h4, h5, h6, p, strong') || count;
      target.textContent = target.textContent.replace(/[\d,]+/, n.toLocaleString());
    });
  }
}
