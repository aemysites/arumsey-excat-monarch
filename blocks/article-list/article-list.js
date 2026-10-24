/*
 * Article List
 * Lists article pages from the site's page index (/query-index.json), not from authored cards.
 *
 * Default: hub listing with "Most Recent" / "Search" tabs, a card grid and a "Load more" button.
 * `latest`: short sidebar list (thumbnail, title, date) with a "See all articles" link.
 *
 * Optional key/value rows: index, path, template, limit, title, see all (link).
 */
import { createOptimizedPicture, readBlockConfig, toClassName } from '../../scripts/aem.js';

const indexCache = new Map();

async function fetchIndex(indexPath) {
  if (!indexCache.has(indexPath)) {
    indexCache.set(indexPath, (async () => {
      const entries = [];
      const chunk = 500;
      let offset = 0;
      let total = Infinity;
      while (offset < total) {
        const url = new URL(indexPath, window.location.href);
        url.searchParams.set('offset', offset);
        url.searchParams.set('limit', chunk);
        // eslint-disable-next-line no-await-in-loop
        const resp = await fetch(url);
        if (!resp.ok) break;
        // eslint-disable-next-line no-await-in-loop
        const json = await resp.json();
        const data = Array.isArray(json) ? json : (json.data || []);
        entries.push(...data);
        total = Number.isFinite(json.total) ? json.total : entries.length;
        if (!data.length) break;
        offset += data.length;
      }
      return entries;
    })().catch(() => []));
  }
  return indexCache.get(indexPath);
}

function parseDate(value) {
  if (value === undefined || value === null || value === '') return null;
  const str = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(str)) {
    const num = Number(str);
    if (num > 1e11) return new Date(num); // epoch ms
    if (num > 1e8) return new Date(num * 1000); // epoch seconds
    if (num > 20000) return new Date(Math.round((num - 25569) * 86400000)); // spreadsheet serial
    return null;
  }
  const dmy = str.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  const parsed = Date.parse(str);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

function entryDate(entry) {
  return parseDate(entry.date)
    || parseDate(entry.publishDate)
    || parseDate(entry.published)
    || parseDate(entry.lastModified);
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function normalizePath(path) {
  if (!path) return '';
  try {
    return new URL(path, window.location.href).pathname.replace(/\.html$/, '');
  } catch {
    return '';
  }
}

function buildImage(src, alt, eager, widths) {
  if (!src) return null;
  const url = new URL(src, window.location.href);
  if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) {
    const img = document.createElement('img');
    img.src = url.href;
    img.alt = alt;
    img.loading = eager ? 'eager' : 'lazy';
    return img;
  }
  return createOptimizedPicture(url.pathname + url.search, alt, eager, widths);
}

/**
 * Picks the article entries for this block: a folder prefix (explicit, else the current
 * page's folder, else its parent folder), newest first, excluding the current page.
 */
function selectArticles(entries, config) {
  const current = normalizePath(window.location.pathname);
  const usable = entries.filter((entry) => {
    if (!entry || !entry.path || !entry.title) return false;
    const path = normalizePath(entry.path);
    if (path === current) return false;
    if (String(entry.robots || '').toLowerCase().includes('noindex')) return false;
    if (config.template && toClassName(entry.template || '') !== toClassName(config.template)) return false;
    return true;
  });

  const byPrefix = (prefix) => usable
    .filter((entry) => normalizePath(entry.path).startsWith(prefix));
  let selected;
  let folder = null;
  if (config.path) {
    folder = normalizePath(config.path).replace(/\/$/, '');
    selected = byPrefix(`${folder}/`);
  } else {
    const own = current.replace(/\/$/, '');
    const parent = current.substring(0, current.lastIndexOf('/'));
    selected = byPrefix(`${own}/`);
    folder = own;
    if (!selected.length && parent) {
      selected = byPrefix(`${parent}/`);
      folder = parent;
    }
    if (!selected.length) {
      selected = usable;
      folder = null;
    }
  }

  const articles = selected
    .map((entry) => ({ ...entry, parsedDate: entryDate(entry) }))
    .sort((a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0));
  return { articles, folder };
}

function readConfig(block) {
  const raw = readBlockConfig(block);
  // a lone link to a .json sheet is taken as the index source
  [...block.children].forEach((row) => {
    const link = row.children.length === 1 ? row.querySelector('a[href]') : null;
    if (link && /\.json(\?|$)/.test(link.getAttribute('href')) && !raw.index) {
      raw.index = link.getAttribute('href');
    }
  });
  const pick = (...keys) => keys.map((key) => raw[key]).find((value) => value);
  const limit = parseInt(pick('limit', 'page-size', 'count'), 10);
  return {
    index: pick('index', 'source', 'query-index') || '/query-index.json',
    path: pick('path', 'folder', 'filter'),
    template: pick('template', 'type'),
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    title: pick('title', 'heading'),
    seeAll: pick('see-all', 'see-all-articles', 'link', 'see-all-link'),
    seeAllLabel: pick('see-all-label', 'link-label'),
  };
}

function buildCard(entry) {
  const li = document.createElement('li');
  li.className = 'article-list-card';
  const link = document.createElement('a');
  link.href = entry.path;
  link.className = 'article-list-card-link';

  const picture = buildImage(entry.image, entry.imageAlt || '', false, [{ width: '750' }]);
  if (picture) {
    const image = document.createElement('div');
    image.className = 'article-list-card-image';
    image.append(picture);
    link.append(image);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';
  const title = document.createElement('h3');
  title.textContent = entry.title;
  body.append(title);
  if (entry.description) {
    const description = document.createElement('p');
    description.textContent = entry.description;
    body.append(description);
  }
  link.append(body);
  li.append(link);
  return li;
}

function buildLatestItem(entry) {
  const li = document.createElement('li');
  li.className = 'article-list-latest-item';
  const link = document.createElement('a');
  link.href = entry.path;

  const picture = buildImage(entry.image, entry.imageAlt || '', false, [{ width: '200' }]);
  if (picture) {
    const thumb = document.createElement('span');
    thumb.className = 'article-list-latest-thumb';
    thumb.append(picture);
    link.append(thumb);
  }

  const text = document.createElement('span');
  text.className = 'article-list-latest-text';
  const title = document.createElement('span');
  title.className = 'article-list-latest-title';
  title.textContent = entry.title;
  text.append(title);
  if (entry.parsedDate) {
    const time = document.createElement('time');
    time.className = 'article-list-latest-date';
    time.dateTime = entry.parsedDate.toISOString().slice(0, 10);
    time.textContent = formatDate(entry.parsedDate);
    text.append(time);
  }
  link.append(text);
  li.append(link);
  return li;
}

function renderLatest(block, articles, config, folder) {
  const wrapper = document.createElement('div');
  wrapper.className = 'article-list-latest';

  const heading = document.createElement('h2');
  heading.className = 'article-list-latest-heading';
  heading.textContent = config.title || 'Latest articles';
  wrapper.append(heading);

  const list = document.createElement('ul');
  list.className = 'article-list-latest-list';
  articles.slice(0, config.limit || 4).forEach((entry) => list.append(buildLatestItem(entry)));
  wrapper.append(list);

  const seeAllHref = config.seeAll || folder;
  if (seeAllHref && seeAllHref !== normalizePath(window.location.pathname)) {
    const p = document.createElement('p');
    p.className = 'article-list-see-all';
    const a = document.createElement('a');
    a.href = seeAllHref;
    a.textContent = config.seeAllLabel || 'See all articles';
    p.append(a);
    wrapper.append(p);
  }

  if (!articles.length) list.remove();
  block.replaceChildren(wrapper);
}

let listId = 0;

function renderHub(block, articles, config) {
  listId += 1;
  const pageSize = config.limit || 6;
  const id = `article-list-${listId}`;

  const tabs = document.createElement('div');
  tabs.className = 'article-list-tabs';
  tabs.setAttribute('role', 'tablist');
  const label = document.createElement('span');
  label.className = 'article-list-tabs-label';
  label.textContent = 'Show me:';
  tabs.append(label);

  const makeTab = (key, text, selected) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `article-list-tab article-list-tab-${key}`;
    button.id = `${id}-tab-${key}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${id}-panel-${key}`);
    button.setAttribute('aria-selected', selected);
    button.textContent = text;
    tabs.append(button);
    return button;
  };
  const recentTab = makeTab('recent', 'Most Recent', true);
  const searchTab = makeTab('search', 'Search', false);

  const searchPanel = document.createElement('div');
  searchPanel.className = 'article-list-search';
  searchPanel.id = `${id}-panel-search`;
  searchPanel.setAttribute('role', 'tabpanel');
  searchPanel.setAttribute('aria-labelledby', searchTab.id);
  searchPanel.hidden = true;
  const searchLabel = document.createElement('label');
  searchLabel.htmlFor = `${id}-query`;
  searchLabel.className = 'article-list-search-label';
  searchLabel.textContent = 'Search articles';
  const input = document.createElement('input');
  input.type = 'search';
  input.id = `${id}-query`;
  input.placeholder = 'Search articles';
  input.autocomplete = 'off';
  searchPanel.append(searchLabel, input);

  const resultsPanel = document.createElement('div');
  resultsPanel.className = 'article-list-results';
  resultsPanel.id = `${id}-panel-recent`;
  resultsPanel.setAttribute('role', 'tabpanel');
  resultsPanel.setAttribute('aria-labelledby', recentTab.id);
  const grid = document.createElement('ul');
  grid.className = 'article-list-cards';
  const empty = document.createElement('p');
  empty.className = 'article-list-empty';
  empty.textContent = 'No articles found.';
  empty.hidden = true;
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'article-list-more button secondary';
  more.textContent = 'Load more articles';
  const moreWrapper = document.createElement('p');
  moreWrapper.className = 'article-list-more-wrapper button-wrapper';
  moreWrapper.append(more);
  resultsPanel.append(grid, empty, moreWrapper);

  let current = articles;
  let shown = 0;

  const showNext = () => {
    current.slice(shown, shown + pageSize).forEach((entry) => grid.append(buildCard(entry)));
    shown = Math.min(shown + pageSize, current.length);
    moreWrapper.hidden = shown >= current.length;
    empty.hidden = current.length > 0;
  };

  const reset = (list) => {
    current = list;
    shown = 0;
    grid.replaceChildren();
    showNext();
  };

  const filter = () => {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      reset(articles);
      return;
    }
    reset(articles.filter((entry) => {
      const text = `${entry.title} ${entry.description || ''}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    }));
  };

  const select = (tab) => {
    const isSearch = tab === searchTab;
    recentTab.setAttribute('aria-selected', !isSearch);
    searchTab.setAttribute('aria-selected', isSearch);
    searchPanel.hidden = !isSearch;
    resultsPanel.setAttribute('aria-labelledby', tab.id);
    if (isSearch) {
      input.focus();
    } else {
      input.value = '';
      reset(articles);
    }
  };

  recentTab.addEventListener('click', () => select(recentTab));
  searchTab.addEventListener('click', () => select(searchTab));
  more.addEventListener('click', showNext);
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(filter, 200);
  });

  block.replaceChildren(tabs, searchPanel, resultsPanel);
  showNext();
}

export default async function decorate(block) {
  const config = readConfig(block);
  const isLatest = block.classList.contains('latest');
  block.replaceChildren();
  block.setAttribute('aria-busy', 'true');

  const entries = await fetchIndex(config.index);
  const { articles, folder } = selectArticles(entries, config);

  if (isLatest) renderLatest(block, articles, config, folder);
  else renderHub(block, articles, config);
  block.removeAttribute('aria-busy');
}
