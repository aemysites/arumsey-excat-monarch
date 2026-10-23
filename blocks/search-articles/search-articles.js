/*
 * Search Articles block
 * Authoring (each value in its own row, all optional):
 *   - text: the field label / placeholder (e.g. "Search expat topics and questions")
 *   - link to a results page: the form submits there as ?q=
 *   - link to a .json index: data source for inline results
 *     (defaults to /query-index.json)
 * Without a results-page link (or on the results page itself) results render inline.
 */
let instance = 0;

async function fetchIndex(source) {
  try {
    const resp = await fetch(source);
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    return [];
  }
}

function filterData(terms, data) {
  const scored = [];
  data.forEach((item) => {
    const title = `${item.title || ''}`.toLowerCase();
    const meta = `${item.description || ''} ${item.path || ''}`.toLowerCase();
    let score = 0;
    const all = terms.every((term) => {
      if (title.includes(term)) {
        score += 2;
        return true;
      }
      if (meta.includes(term)) {
        score += 1;
        return true;
      }
      return false;
    });
    if (all && item.path) scored.push({ score, item });
  });
  return scored.sort((a, b) => b.score - a.score).map(({ item }) => item);
}

function renderResult(item) {
  const li = document.createElement('li');
  li.className = 'search-articles-result';
  const a = document.createElement('a');
  a.href = item.path;
  a.className = 'search-articles-result-title';
  a.textContent = item.title || item.path;
  li.append(a);
  if (item.description) {
    const p = document.createElement('p');
    p.className = 'search-articles-result-description';
    p.textContent = item.description;
    li.append(p);
  }
  return li;
}

export default async function decorate(block) {
  instance += 1;
  const placeholders = {
    searchPlaceholder: 'Search',
    searchSubmit: 'Submit search',
    searchNoResults: 'No results found.',
  };

  let label = '';
  let action = '';
  let source = '';
  block.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.getAttribute('href'), window.location.href);
    if (/\.json$/i.test(url.pathname)) source = source || url.href.slice(url.origin.length);
    else action = action || url.pathname;
  });
  [...block.querySelectorAll(':scope > div > div')].some((cell) => {
    if (cell.querySelector('a')) return false;
    label = cell.textContent.trim();
    return !!label;
  });
  label = label || placeholders.searchPlaceholder;
  source = source || `${window.hlx?.codeBasePath || ''}/query-index.json`;

  const onResultsPage = !action || action.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
  const inputId = `search-articles-input-${instance}`;

  const form = document.createElement('form');
  form.className = 'search-articles-form';
  form.setAttribute('role', 'search');
  form.method = 'get';
  if (!onResultsPage) form.action = action;

  const fieldLabel = document.createElement('label');
  fieldLabel.className = 'search-articles-label';
  fieldLabel.htmlFor = inputId;
  fieldLabel.textContent = label;

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.id = inputId;
  input.className = 'search-articles-input';
  input.placeholder = label;
  input.autocomplete = 'off';
  input.required = true;

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'search-articles-submit';
  submit.setAttribute('aria-label', placeholders.searchSubmit);

  form.append(fieldLabel, input, submit);
  block.replaceChildren(form);

  if (!onResultsPage) return;

  const results = document.createElement('ul');
  results.className = 'search-articles-results';
  results.setAttribute('aria-live', 'polite');
  block.append(results);

  let data = null;
  const runSearch = async (value) => {
    const terms = value.toLowerCase().split(/\s+/).filter(Boolean);
    results.replaceChildren();
    results.classList.remove('no-results');
    if (!terms.length) return;
    data = data || await fetchIndex(source);
    const matches = filterData(terms, data);
    if (!matches.length) {
      results.classList.add('no-results');
      const li = document.createElement('li');
      li.textContent = placeholders.searchNoResults;
      results.append(li);
      return;
    }
    results.append(...matches.map(renderResult));
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = input;
    const url = new URL(window.location.href);
    url.searchParams.set('q', value);
    window.history.replaceState({}, '', url.toString());
    runSearch(value);
  });

  const q = new URL(window.location.href).searchParams.get('q');
  if (q) {
    input.value = q;
    await runSearch(q);
  }
}
