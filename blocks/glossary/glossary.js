import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

let glossaryCounter = 0;

const hasContent = (el) => !!(el && (el.textContent.trim() || el.querySelector('picture, img, a')));

const isPictureOnly = (el) => !!el.querySelector('picture, img') && !el.textContent.trim();

/** Same-origin link to a /fragments/ page, when that is all the cell holds. */
function fragmentPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname.replace(/(\.plain)?\.html$/, '');
}

async function appendCell(target, cell) {
  const path = fragmentPath(cell);
  if (path) {
    const main = await loadFragment(path);
    if (main) {
      const nodes = [...main.querySelectorAll(':scope > .section > *')];
      target.append(...(nodes.length ? nodes : [...main.childNodes]));
      return;
    }
  }
  target.append(...cell.childNodes);
}

/** Split a single cell "<strong>Term:</strong> definition" into its two parts. */
function splitSingleCell(cell) {
  const first = cell.firstElementChild;
  if (!first) return null;
  if (/^H[1-6]$/.test(first.tagName) && cell.children.length > 1) {
    const def = document.createElement('div');
    def.append(...[...cell.children].slice(1));
    return { term: first.textContent.trim(), definition: def };
  }
  const strong = first.querySelector(':scope > strong:first-child, :scope > b:first-child');
  if (first.tagName === 'P' && strong && first.textContent.trim().startsWith(strong.textContent.trim())) {
    const term = strong.textContent.trim();
    strong.remove();
    const def = document.createElement('div');
    if (first.textContent.trim()) def.append(first);
    def.append(...[...cell.children].filter((c) => c !== first));
    return { term, definition: def };
  }
  return null;
}

function letterFor(term) {
  const ch = term.normalize('NFD').replace(/[^A-Za-z0-9]/g, '').charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

export default async function decorate(block) {
  glossaryCounter += 1;
  const uid = `glossary-${glossaryCounter}`;
  const intro = document.createElement('div');
  intro.className = 'glossary-intro-panel';
  const outro = document.createElement('div');
  outro.className = 'glossary-outro';
  let background = null;
  let searchLabel = 'Search Word Terms';
  let emptyText = 'No matching terms found.';
  const terms = [];
  const pending = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter(hasContent);
    if (!cells.length) return;

    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      if (key === 'search' || key === 'search label') {
        searchLabel = cells[1].textContent.trim() || searchLabel;
        return;
      }
      if (key === 'no results' || key === 'empty') {
        emptyText = cells[1].textContent.trim() || emptyText;
        return;
      }
      const def = document.createElement('div');
      cells.slice(1).forEach((c) => def.append(...c.childNodes));
      terms.push({ term: cells[0].textContent.trim(), definition: def });
      return;
    }

    const [cell] = cells;
    const text = cell.textContent.trim();
    if (!terms.length && !background && isPictureOnly(cell)) {
      background = cell;
      return;
    }
    // letter headings are generated, so authored ones are dropped
    if (/^[A-Z#]$/i.test(text) && !cell.querySelector('picture, a')) return;

    const split = (terms.length || cell.querySelector('strong, b')) ? splitSingleCell(cell) : null;
    if (split && (terms.length || /:\s*$/.test(split.term))) {
      terms.push(split);
      return;
    }
    pending.push(appendCell(terms.length ? outro : intro, cell));
  });
  await Promise.all(pending);

  // intro: title, disclaimer, sub heading and the search field over an optional background
  const introWrap = document.createElement('div');
  introWrap.className = 'glossary-intro';
  if (background) {
    const bg = document.createElement('div');
    bg.className = 'glossary-background';
    bg.append(...background.childNodes);
    introWrap.append(bg);
    block.classList.add('glossary-has-background');
  }
  const search = document.createElement('div');
  search.className = 'glossary-search';
  const label = document.createElement('label');
  label.htmlFor = `${uid}-search`;
  label.textContent = searchLabel;
  const input = document.createElement('input');
  input.type = 'search';
  input.id = `${uid}-search`;
  input.autocomplete = 'off';
  input.setAttribute('aria-controls', `${uid}-results`);
  search.append(label, input);
  intro.append(search);
  introWrap.append(intro);

  // group terms by letter, in authored order within each letter
  const groups = new Map();
  terms.forEach((t) => {
    const letter = letterFor(t.term);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(t);
  });
  const letters = [...groups.keys()].sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  const nav = document.createElement('div');
  nav.className = 'glossary-letters';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Glossary letters');
  const results = document.createElement('div');
  results.className = 'glossary-results';
  results.id = `${uid}-results`;

  const tabs = [];
  const panels = [];
  letters.forEach((letter) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'glossary-letter';
    tab.id = `${uid}-tab-${letter === '#' ? 'num' : letter}`;
    tab.textContent = letter;
    tab.setAttribute('role', 'tab');
    nav.append(tab);
    tabs.push(tab);

    const panel = document.createElement('dl');
    panel.className = 'glossary-group';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.id = `${tab.id}-panel`;
    tab.setAttribute('aria-controls', panel.id);
    groups.get(letter).forEach(({ term, definition }) => {
      const item = document.createElement('div');
      item.className = 'glossary-item';
      const dt = document.createElement('dt');
      // the colon after the term is drawn by CSS, so drop an authored one
      dt.textContent = term.replace(/\s*:\s*$/, '');
      const dd = document.createElement('dd');
      dd.append(...definition.childNodes);
      item.append(dt, dd);
      panel.append(item);
    });
    results.append(panel);
    panels.push(panel);
  });

  const empty = document.createElement('p');
  empty.className = 'glossary-empty';
  empty.hidden = true;
  empty.textContent = emptyText;
  results.append(empty);

  let active = 0;
  const showLetter = (index) => {
    active = index;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
      panels[i].querySelectorAll('.glossary-item').forEach((item) => { item.hidden = false; });
    });
    empty.hidden = panels.length > 0;
  };

  const filter = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      block.classList.remove('glossary-searching');
      showLetter(active);
      return;
    }
    block.classList.add('glossary-searching');
    let matches = 0;
    panels.forEach((panel, i) => {
      let panelMatches = 0;
      panel.querySelectorAll('.glossary-item').forEach((item) => {
        const hit = item.textContent.toLowerCase().includes(q);
        item.hidden = !hit;
        if (hit) panelMatches += 1;
      });
      panel.hidden = panelMatches === 0;
      tabs[i].setAttribute('aria-selected', 'false');
      matches += panelMatches;
    });
    empty.hidden = matches > 0;
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      input.value = '';
      block.classList.remove('glossary-searching');
      showLetter(i);
    });
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  });
  input.addEventListener('input', () => filter(input.value));

  const body = document.createElement('div');
  body.className = 'glossary-body';
  body.append(nav, results);

  block.replaceChildren(introWrap, body);
  if (outro.childNodes.length) block.append(outro);
  showLetter(0);

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isBg = !!img.closest('.glossary-background');
    img.closest('picture').replaceWith(createOptimizedPicture(
      img.src,
      img.alt,
      isBg,
      isBg ? [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }] : [{ width: '750' }],
    ));
  });
}
