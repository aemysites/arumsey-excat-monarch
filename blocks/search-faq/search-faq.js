/**
 * Search FAQ: a heading and search box that filters FAQ content.
 *
 * Authoring:
 * - Content rows (heading, intro text): shown above the search box.
 * - Config rows [key] [value]:
 *   `source` (optional link to a query index, e.g. /query-index.json; results
 *   are rendered as links), `label`, `placeholder`, `button` (button label),
 *   `no results` (message), `limit` (max results from the source, default 10).
 * - Without `source`, the search filters FAQ items on the current page:
 *   `details` elements and `.accordion-item`/`.faq-item` elements in main.
 */

const CONFIG_KEYS = ['source', 'label', 'placeholder', 'button', 'no-results', 'limit'];
let searchCount = 0;

function toKey(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function terms(query) {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function matches(text, queryTerms) {
  const haystack = text.toLowerCase();
  return queryTerms.every((t) => haystack.includes(t));
}

function pageItems(block) {
  return [...document.querySelectorAll('main details, main .accordion-item, main .faq-item')]
    .filter((el) => !block.contains(el) && !el.parentElement.closest('details, .accordion-item, .faq-item'));
}

export default function decorate(block) {
  const config = {};
  const intro = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = toKey(cells[0]?.textContent);
    if (cells.length >= 2 && CONFIG_KEYS.includes(key)) [, config[key]] = cells;
    else cells.forEach((cell) => intro.push(...cell.childNodes));
  });
  const text = (k, fallback = '') => config[k]?.textContent.trim() || fallback;
  const source = config.source?.querySelector('a')?.href || text('source');
  const limit = parseInt(text('limit', '10'), 10) || 10;
  const noResults = text('no-results', 'No matching questions found.');

  searchCount += 1;
  const id = `search-faq-${searchCount}`;
  const elements = [];
  if (intro.length) {
    const introEl = document.createElement('div');
    introEl.className = 'search-faq-intro';
    introEl.append(...intro);
    elements.push(introEl);
  }

  const form = document.createElement('form');
  form.className = 'search-faq-form';
  form.setAttribute('role', 'search');
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = text('label', 'Search FAQs');
  label.className = config.label ? 'search-faq-label' : 'search-faq-label search-faq-label-hidden';
  const input = document.createElement('input');
  input.type = 'search';
  input.id = id;
  input.name = 'q';
  input.autocomplete = 'off';
  input.placeholder = text('placeholder', 'Search for a question');
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary search-faq-submit';
  const buttonLabel = document.createElement('span');
  buttonLabel.className = 'search-faq-submit-label';
  buttonLabel.textContent = text('button', 'Search');
  button.append(buttonLabel);
  const field = document.createElement('div');
  field.className = 'search-faq-field';
  field.append(input, button);
  form.append(label, field);
  elements.push(form);

  const status = document.createElement('p');
  status.className = 'search-faq-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const results = document.createElement('ul');
  results.className = 'search-faq-results';
  elements.push(status, results);

  let index = null;
  async function loadIndex() {
    if (index) return index;
    try {
      const resp = await fetch(source);
      const json = resp.ok ? await resp.json() : {};
      index = Array.isArray(json) ? json : json.data || [];
    } catch (e) {
      index = [];
    }
    return index;
  }

  async function searchSource(queryTerms) {
    const data = await loadIndex();
    const hits = data.filter((entry) => matches(
      [entry.title, entry.question, entry.description, entry.answer, entry.keywords].filter(Boolean).join(' '),
      queryTerms,
    )).slice(0, limit);
    results.replaceChildren(...hits.map((entry) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = entry.path || entry.url || '#';
      a.textContent = entry.title || entry.question || a.href;
      li.append(a);
      const desc = entry.description || entry.answer;
      if (desc) li.append(Object.assign(document.createElement('p'), { textContent: desc }));
      return li;
    }));
    status.textContent = hits.length ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : noResults;
  }

  function filterPage(queryTerms) {
    const items = pageItems(block);
    let shown = 0;
    items.forEach((item) => {
      const hit = !queryTerms.length || matches(item.textContent, queryTerms);
      item.hidden = !hit;
      if (hit) shown += 1;
    });
    if (!queryTerms.length) status.textContent = '';
    else status.textContent = shown ? `${shown} matching question${shown === 1 ? '' : 's'}` : noResults;
  }

  async function run() {
    const queryTerms = terms(input.value);
    if (source) {
      if (!queryTerms.length) {
        results.replaceChildren();
        status.textContent = '';
        return;
      }
      await searchSource(queryTerms);
    } else {
      filterPage(queryTerms);
    }
  }

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 250);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(timer);
    run();
  });

  block.replaceChildren(...elements);
}
