/*
 * Listing block
 * Searchable, filterable list of pages read from the site's page index (query-index.json).
 * Variants pick the card: people, insights, events, jobs. Config rows (key | value):
 *   Source (index path, default /query-index.json), Path (only pages under this path),
 *   Filters (comma list of index fields shown as dropdowns), Page size, Sort (field, "-field" for
 *   descending), Heading (optional, above the results).
 * Search text and filters are read from / written to the page URL (?q=, ?<field>=, ?letter=),
 * so links such as /en/insights/directory?insight=Insight open pre-filtered.
 */
import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';

const VARIANTS = ['people', 'insights', 'events', 'jobs'];

const DEFAULTS = {
  people: { sort: 'title', filters: ['region', 'office'], pageSize: 20 },
  insights: { sort: '-published', filters: ['insight', 'theme', 'service'], pageSize: 10 },
  events: { sort: '-published', filters: [], pageSize: 10 },
  jobs: { sort: 'title', filters: ['region'], pageSize: 20 },
};

const FILTER_LABELS = {
  region: 'Regions',
  office: 'Offices',
  insight: 'Type',
  theme: 'Theme',
  service: 'Service Line',
  company: 'Company',
};

const SEARCH_FIELDS = ['title', 'description', 'role', 'office', 'company', 'location'];

const MORE_LABELS = {
  people: 'More Details',
  insights: 'Details',
  events: 'Read More',
  jobs: 'Details',
};

/** Variants with the A–Z row: people by last name, events by title. */
const LETTERS = { people: 'last', events: 'first' };

/** Type label shown on event cards (insight cards show their `insight` value). */
const EVENT_FLAG = 'Community Event';

const EVENT_TYPES = ['event', 'webinar'];

const normalize = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const values = (s) => String(s || '').split(',').map((v) => v.trim()).filter(Boolean);

async function fetchIndex(source) {
  const rows = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    const url = new URL(source, window.location.href);
    url.searchParams.set('offset', offset);
    url.searchParams.set('limit', 1000);
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(url.pathname + url.search);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    const data = json.data || [];
    rows.push(...data);
    total = Number(json.total) || rows.length;
    if (!data.length) break;
    offset += data.length;
  }
  return rows;
}

/** Last name initial of "First Last, CPA, CA" (mode "last"), or the title's first letter. */
function initial(title, mode = 'last') {
  if (mode !== 'last') return normalize(String(title || '').trim()).charAt(0).toUpperCase();
  const name = String(title || '').split(',')[0].trim().split(/\s+/);
  return normalize(name[name.length - 1] || '').charAt(0).toUpperCase();
}

function picture(src, alt) {
  if (!src) return null;
  if (/^(\.?\/)/.test(src)) return createOptimizedPicture(src, alt, false, [{ width: '600' }]);
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  return img;
}

function el(tag, className, content) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (content instanceof Node) n.append(content);
  else if (content) n.textContent = content;
  return n;
}

function link(href, label, className) {
  const a = el('a', className, label);
  a.href = href;
  return a;
}

function card(variant, row) {
  const li = el('li', 'listing-card');
  const img = variant !== 'jobs' ? picture(row.image, variant === 'people' ? row.title : '') : null;
  if (img) {
    const media = el('div', 'listing-card-image');
    const a = link(row.path, '');
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
    a.append(img);
    media.append(a);
    li.append(media);
  }
  const body = el('div', 'listing-card-body');
  let flag = '';
  if (variant === 'insights') [flag = ''] = values(row.insight);
  if (variant === 'events') flag = EVENT_FLAG;
  if (flag) body.append(el('p', 'listing-card-flag', flag));
  // the title icon follows the type: calendar for events and webinars, page for the rest
  if (variant === 'insights' || variant === 'events') {
    li.dataset.type = variant === 'events' || EVENT_TYPES.includes(normalize(flag)) ? 'event' : 'insight';
  }
  if ((variant === 'insights' || variant === 'events') && row.date) body.append(el('p', 'listing-card-date', row.date));
  const h = el('h3', 'listing-card-title');
  h.append(link(row.path, row.title));
  body.append(h);
  if (variant === 'people') {
    if (row.role) body.append(el('p', 'listing-card-role', row.role));
    if (row.office) body.append(el('p', 'listing-card-office', row.office));
    const contact = el('ul', 'listing-card-contact');
    if (row.phone) contact.append(el('li', 'listing-card-phone', link(`tel:${row.phone}`, row.phone)));
    if (row.email) contact.append(el('li', 'listing-card-email', link(`mailto:${row.email}`, row.email)));
    if (contact.children.length) body.append(contact);
  } else if (variant === 'jobs') {
    if (row.company) body.append(el('p', 'listing-card-company', row.company));
    if (row.location) body.append(el('p', 'listing-card-location', row.location));
  } else if (row.description) {
    body.append(el('p', 'listing-card-description', row.description));
  }
  body.append(el('p', 'listing-card-more', link(row.path, MORE_LABELS[variant])));
  li.append(body);
  return li;
}

function sortRows(rows, sort) {
  const desc = sort.startsWith('-');
  const key = sort.replace(/^-/, '');
  const numeric = rows.some((r) => r[key] && !Number.isNaN(Number(r[key])));
  return [...rows].sort((a, b) => {
    const cmp = numeric ? (Number(a[key]) || 0) - (Number(b[key]) || 0)
      : normalize(a[key]).localeCompare(normalize(b[key]));
    return desc ? -cmp : cmp;
  });
}

export default async function decorate(block) {
  const variant = VARIANTS.find((v) => block.classList.contains(v)) || 'insights';
  const config = readBlockConfig(block);
  const defaults = DEFAULTS[variant];
  const source = config.source || '/query-index.json';
  const prefix = config.path || '';
  const filters = config.filters ? values(config.filters) : defaults.filters;
  const pageSize = Number(config['page-size']) || defaults.pageSize;
  const sort = config.sort || defaults.sort;
  block.textContent = '';

  // ---- controls ----
  const params = new URLSearchParams(window.location.search);
  const state = {
    q: params.get('q') || '',
    letter: params.get('letter') || '',
    facets: Object.fromEntries(filters.map((f) => [f, params.get(f) || ''])),
    shown: pageSize,
  };

  const uid = Math.random().toString(36).slice(2, 8);
  const form = el('form', 'listing-controls');
  form.setAttribute('role', 'search');

  // "Displaying results for:" + count, beside the search field
  const summary = el('div', 'listing-summary');
  const status = el('p', 'listing-count');
  status.setAttribute('aria-live', 'polite');
  summary.append(el('h2', 'listing-summary-title', 'Displaying results for:'), status);

  const searchLabel = el('label', 'listing-search-label', 'Search');
  const search = el('input', 'listing-search');
  search.type = 'search';
  search.id = `listing-search-${uid}`;
  search.placeholder = 'Search...';
  search.value = state.q;
  searchLabel.setAttribute('for', search.id);
  const searchButton = el('button', 'listing-search-button', el('span', 'listing-search-button-label', 'Search'));
  searchButton.type = 'submit';
  const searchRow = el('div', 'listing-search-row');
  searchRow.append(searchLabel, search, searchButton);
  form.append(summary, searchRow);

  const letterMode = LETTERS[variant];
  let letters = null;
  if (letterMode) {
    letters = el('div', 'listing-letters');
    letters.setAttribute('role', 'group');
    letters.setAttribute('aria-label', letterMode === 'last' ? 'Filter by last name' : 'Filter by first letter');
    [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach((ch) => {
      const b = el('button', 'listing-letter', ch);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(state.letter === ch));
      letters.append(b);
    });
    form.append(letters);
  }

  // "Filter by" toggle and its collapsible panel (the heading leads the panel)
  const toolbar = el('div', 'listing-toolbar');
  const toggle = el('button', 'listing-filter-toggle', 'Filter by');
  toggle.type = 'button';
  const filterRow = el('div', 'listing-filters');
  toolbar.append(toggle);
  const panel = el('div', 'listing-filter-panel');
  panel.id = `listing-panel-${uid}`;
  toggle.setAttribute('aria-controls', panel.id);
  const heading = config.heading ? el('h3', 'listing-heading', config.heading) : null;
  if (heading) panel.append(heading);
  panel.append(filterRow);
  form.append(toolbar, panel);

  const list = el('ul', 'listing-results');
  const moreButton = el('button', 'listing-more', 'Load more');
  moreButton.type = 'button';
  block.append(form, list, moreButton);

  // ---- data ----
  status.textContent = 'Loading…';
  let rows = [];
  try {
    // only pages directly under the path (/en/personnel/<name>, not /en/personnel/<group>/<page>)
    const base = prefix ? `${prefix.replace(/\/$/, '')}/` : '';
    rows = (await fetchIndex(source)).filter((r) => r.path
      && (!base || (r.path.startsWith(base) && !r.path.slice(base.length).replace(/\/$/, '').includes('/')))
      && r.path.replace(/\/$/, '') !== window.location.pathname.replace(/\/$/, '')
      && r.path.replace(/\/$/, '') !== prefix.replace(/\/$/, ''));
  } catch (e) {
    rows = [];
  }
  rows = sortRows(rows, sort);

  const selects = {};
  filters.forEach((field) => {
    const options = [...new Set(rows.flatMap((r) => values(r[field])))]
      .sort((a, b) => a.localeCompare(b));
    if (!options.length) return;
    const id = `listing-${field}-${Math.random().toString(36).slice(2, 8)}`;
    const wrap = el('div', 'listing-filter');
    const label = el('label', 'listing-filter-label', FILTER_LABELS[field] || field);
    label.setAttribute('for', id);
    const select = el('select', 'listing-filter-select');
    select.id = id;
    select.name = field;
    select.append(new Option(`All ${(FILTER_LABELS[field] || field).toLowerCase()}`, ''));
    options.forEach((o) => select.append(new Option(o, o)));
    // a URL value may differ in case/accents from the index value
    const wanted = options.find((o) => normalize(o) === normalize(state.facets[field]));
    select.value = wanted || '';
    state.facets[field] = select.value;
    wrap.append(label, select);
    filterRow.append(wrap);
    selects[field] = select;
  });
  if (!filterRow.children.length) {
    // no filters: no toggle; the heading stays for assistive tech above the results
    toolbar.remove();
    panel.remove();
    if (heading) {
      const h2 = el('h2', 'listing-heading', heading.textContent);
      list.before(h2);
    }
  } else {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };
    // open when the page URL already applies a filter, so the active choice stays visible
    setOpen(Object.values(state.facets).some(Boolean));
    toggle.addEventListener('click', () => setOpen(panel.hidden));
  }

  const syncUrl = () => {
    const url = new URL(window.location.href);
    ['q', 'letter', ...filters].forEach((k) => url.searchParams.delete(k));
    url.searchParams.delete('filter');
    if (state.q) url.searchParams.set('q', state.q);
    if (state.letter) url.searchParams.set('letter', state.letter);
    Object.entries(state.facets).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
    window.history.replaceState(null, '', url);
  };

  const render = () => {
    const q = normalize(state.q);
    const matches = rows.filter((r) => {
      if (q && !SEARCH_FIELDS.some((f) => normalize(r[f]).includes(q))) return false;
      if (state.letter && initial(r.title, letterMode) !== state.letter) return false;
      return Object.entries(state.facets).every(([f, v]) => !v || values(r[f]).includes(v));
    });
    const shown = matches.slice(0, state.shown);
    list.replaceChildren(...shown.map((r) => card(variant, r)));
    if (matches.length) {
      status.replaceChildren('Showing results ', el('strong', '', `1-${shown.length}`), ' of ', el('strong', '', String(matches.length)));
    } else {
      status.textContent = 'No results found.';
    }
    moreButton.hidden = shown.length >= matches.length;
  };

  const update = () => {
    state.shown = pageSize;
    syncUrl();
    render();
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.q = search.value.trim();
    update();
  });
  search.addEventListener('search', () => { state.q = search.value.trim(); update(); });
  Object.entries(selects).forEach(([field, select]) => {
    select.addEventListener('change', () => { state.facets[field] = select.value; update(); });
  });
  letters?.addEventListener('click', (e) => {
    const b = e.target.closest('.listing-letter');
    if (!b) return;
    state.letter = state.letter === b.textContent ? '' : b.textContent;
    letters.querySelectorAll('.listing-letter').forEach((x) => x.setAttribute('aria-pressed', String(x.textContent === state.letter)));
    update();
  });
  moreButton.addEventListener('click', () => {
    state.shown += pageSize;
    render();
  });

  render();
}
