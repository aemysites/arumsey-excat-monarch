/*
 * Article Hub
 * Landing page for an article collection (citi.com tkc learning-center /
 * travel-guide hub): photo banner with a white title card and article search,
 * then groups of article cards, each with an optional heading and "View all"
 * link, link lists / resource tiles, then an optional closing note.
 *
 * Authoring (one row per item, in order):
 *  - Row 1 (hero): image cell | text cell (optional eyebrow, H1, description,
 *    optional "Search ..." paragraph used as the search field label).
 *  - Optional search row: "Search" | label text.
 *  - Heading row (one cell, heading + optional "View all" link): starts a group.
 *  - Card row (image cell | text cell with title, description, link).
 *    Card rows without an image render as resource tiles.
 *  - One-cell row right after a heading (e.g. a list of links): group content.
 *  - Any other one-cell row: closing content (note, CTA).
 * Category groups (heading with a "View all" link) show their first
 * CATEGORY_CARDS cards; groups after the first CATEGORY_GROUPS categories are
 * revealed by a "View All Categories" button. The search field filters every
 * card on the page by its text.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'article-hub';
const CATEGORY_CARDS = 4;
const CATEGORY_GROUPS = 3;

function isPictureOnly(cell) {
  return !!cell.querySelector('picture') && !cell.textContent.trim();
}

function hasContent(cell) {
  return !!(cell.textContent.trim() || cell.querySelector('picture, img'));
}

function optimizeImages(root, width) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });
}

/* links decorated as buttons by EDS stay plain text links in the hub */
function plainLinks(root) {
  root.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
    const parent = a.parentElement;
    if (parent && parent.classList.contains('button-container')) {
      parent.classList.remove('button-container');
      if (!parent.classList.length) parent.removeAttribute('class');
    }
  });
}

function buildSearch(labelText) {
  const form = document.createElement('form');
  form.className = `${BLOCK}-search`;
  form.setAttribute('role', 'search');
  const id = `${BLOCK}-search-${Math.random().toString(36).slice(2, 8)}`;
  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText || 'Search articles';
  const field = document.createElement('div');
  field.className = `${BLOCK}-search-field`;
  const input = document.createElement('input');
  input.type = 'search';
  input.id = id;
  input.name = 'q';
  input.autocomplete = 'off';
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = `${BLOCK}-search-button`;
  button.setAttribute('aria-label', 'Search Articles');
  field.append(input, button);
  form.append(label, field);
  return form;
}

function buildHero(row) {
  const hero = document.createElement('div');
  hero.className = `${BLOCK}-hero`;
  const media = document.createElement('div');
  media.className = `${BLOCK}-hero-image`;
  const card = document.createElement('div');
  card.className = `${BLOCK}-hero-card`;

  [...row.children].forEach((cell) => {
    if (isPictureOnly(cell) && !media.children.length) media.append(...cell.childNodes);
    else card.append(...cell.childNodes);
  });

  // bare text in the card cell becomes a paragraph
  [...card.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      node.replaceWith(p);
    }
  });

  let labelText = '';
  [...card.querySelectorAll('p')].forEach((p) => {
    if (/^search\b/i.test(p.textContent.trim()) && !p.querySelector('a')) {
      labelText = p.textContent.trim();
      p.remove();
    }
  });

  const title = card.querySelector('h1, h2');
  if (title) {
    title.classList.add(`${BLOCK}-title`);
    const prev = title.previousElementSibling;
    const hasEyebrow = prev && prev.tagName === 'P';
    if (hasEyebrow) prev.classList.add(`${BLOCK}-eyebrow`);
    const next = title.nextElementSibling;
    // citi.com: large description under an eyebrowed title, caption otherwise
    if (next && next.tagName === 'P') {
      next.classList.add(hasEyebrow ? `${BLOCK}-description` : `${BLOCK}-caption`);
    }
  }

  const search = buildSearch(labelText);
  card.append(search);

  if (media.children.length) hero.append(media);
  hero.append(card);
  return { hero, search };
}

function buildCard(cells) {
  const li = document.createElement('li');
  li.className = `${BLOCK}-card`;
  cells.forEach((cell) => {
    cell.className = isPictureOnly(cell) ? `${BLOCK}-card-image` : `${BLOCK}-card-body`;
    // imported images that never resolved (blob: URLs) keep an empty slot
    cell.querySelectorAll('img[src^="blob:"]').forEach((img) => {
      (img.closest('picture') || img).remove();
      cell.classList.add(`${BLOCK}-card-image-empty`);
    });
    li.append(cell);
  });
  if (!li.querySelector(`.${BLOCK}-card-image`)) li.classList.add(`${BLOCK}-card-text`);
  // make the whole card clickable via its first link
  const link = li.querySelector(`.${BLOCK}-card-body a`);
  if (link) li.classList.add(`${BLOCK}-card-linked`);
  return li;
}

function createGroup(header) {
  const group = document.createElement('div');
  group.className = `${BLOCK}-group`;
  if (header) {
    const head = document.createElement('div');
    head.className = `${BLOCK}-group-header`;
    head.append(...header.childNodes);
    plainLinks(head);
    const links = head.querySelectorAll('a');
    links.forEach((a) => a.classList.add(`${BLOCK}-view-all`));
    if (links.length) group.classList.add(`${BLOCK}-group-category`);
    group.append(head);
  }
  return group;
}

function groupList(group) {
  let list = group.querySelector(`:scope > .${BLOCK}-cards`);
  if (!list) {
    list = document.createElement('ul');
    list.className = `${BLOCK}-cards`;
    group.append(list);
  }
  return list;
}

/* category groups show a few cards; extra categories wait behind a button */
function collapseCategories(groupsEl) {
  const categories = [...groupsEl.querySelectorAll(`.${BLOCK}-group-category`)];
  categories.forEach((group) => {
    [...group.querySelectorAll(`.${BLOCK}-card`)].forEach((card, i) => {
      if (i >= CATEGORY_CARDS) card.classList.add(`${BLOCK}-card-more`);
    });
  });
  const extra = categories.slice(CATEGORY_GROUPS);
  if (!extra.length) return null;
  extra.forEach((group) => group.classList.add(`${BLOCK}-group-more`));

  const more = document.createElement('div');
  more.className = `${BLOCK}-more`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${BLOCK}-more-button`;
  button.textContent = 'View All Categories';
  more.append(button);
  categories[CATEGORY_GROUPS - 1].after(more);
  return more;
}

function wireCards(block) {
  block.addEventListener('click', (e) => {
    const card = e.target.closest(`.${BLOCK}-card-linked`);
    if (!card || e.target.closest('a')) return;
    const link = card.querySelector(`.${BLOCK}-card-body a`);
    if (link) link.click();
  });

  block.addEventListener('click', (e) => {
    const button = e.target.closest(`.${BLOCK}-more-button`);
    if (!button) return;
    block.classList.add(`${BLOCK}-expanded`);
    const first = block.querySelector(`.${BLOCK}-group-more`);
    button.closest(`.${BLOCK}-more`).remove();
    first?.querySelector('h2, h3, h4, h5, h6')?.setAttribute('tabindex', '-1');
    first?.querySelector('h2, h3, h4, h5, h6')?.focus();
  });
}

function wireSearch(block, search) {
  const input = search.querySelector('input');
  const groupsEl = block.querySelector(`.${BLOCK}-groups`);
  const status = document.createElement('h2');
  status.className = `${BLOCK}-results`;
  status.hidden = true;
  status.setAttribute('aria-live', 'polite');
  groupsEl.prepend(status);

  const run = () => {
    const raw = input.value.trim();
    const q = raw.toLowerCase();
    let count = 0;
    block.querySelectorAll(`.${BLOCK}-card`).forEach((card) => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.classList.toggle(`${BLOCK}-card-hidden`, !match);
      if (match && q) count += 1;
    });
    block.querySelectorAll(`.${BLOCK}-group`).forEach((group) => {
      const hide = !!q && !group.querySelector(`.${BLOCK}-card:not(.${BLOCK}-card-hidden)`);
      group.classList.toggle(`${BLOCK}-group-hidden`, hide);
    });
    block.classList.toggle(`${BLOCK}-searching`, !!q);
    status.hidden = !q;
    status.textContent = q ? `Showing ${count} results for "${raw}"` : '';
  };

  search.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });
  input.addEventListener('search', run);
  input.addEventListener('input', () => {
    if (!input.value.trim()) run();
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const groups = document.createElement('div');
  groups.className = `${BLOCK}-groups`;
  const footer = document.createElement('div');
  footer.className = `${BLOCK}-footer`;
  let heroParts = null;
  let searchLabel = '';
  let current = null;

  rows.forEach((row, index) => {
    const cells = [...row.children].filter(hasContent);
    if (!cells.length) return;

    if (index === 0 && (cells.some(isPictureOnly) || row.querySelector('h1'))) {
      heroParts = buildHero(row);
      return;
    }

    // "Search" | label row: the search field label
    if (cells.length === 2 && /^search$/i.test(cells[0].textContent.trim())) {
      searchLabel = cells[1].textContent.trim();
      return;
    }

    if (cells.length > 1) {
      if (!current) {
        current = createGroup(null);
        groups.append(current);
      }
      groupList(current).append(buildCard(cells));
      return;
    }

    const [cell] = cells;
    if (cell.querySelector('h2, h3, h4, h5, h6') && !cell.querySelector('ul, ol')
      && !(current && cell.querySelector('h3 a') && !cell.querySelector('h2'))) {
      current = createGroup(cell);
      groups.append(current);
    } else if (current && !current.querySelector(`.${BLOCK}-cards, .${BLOCK}-group-content`)
      && cell.querySelector('ul, ol')) {
      // a list of links under a heading (e.g. "Other categories")
      const content = document.createElement('div');
      content.className = `${BLOCK}-group-content`;
      content.append(...cell.childNodes);
      plainLinks(content);
      current.classList.add(`${BLOCK}-group-links`);
      current.append(content);
    } else if (current && cell.querySelector('h3 a')) {
      // single-cell tile (heading link only)
      groupList(current).append(buildCard([cell]));
    } else {
      footer.append(...cell.childNodes);
    }
  });

  // groups whose cards carry no images are resource tiles
  groups.querySelectorAll(`.${BLOCK}-group`).forEach((group) => {
    const cards = group.querySelectorAll(`.${BLOCK}-card`);
    if (cards.length && [...cards].every((c) => c.classList.contains(`${BLOCK}-card-text`))) {
      group.classList.add(`${BLOCK}-group-resources`);
    }
  });

  optimizeImages(groups, '750');
  collapseCategories(groups);

  const children = [];
  if (heroParts) {
    optimizeImages(heroParts.hero, '2000');
    if (searchLabel) heroParts.search.querySelector('label').textContent = searchLabel;
    children.push(heroParts.hero);
  }
  children.push(groups);
  if (footer.childNodes.length) {
    plainLinks(footer);
    children.push(footer);
  }
  block.replaceChildren(...children);

  wireCards(block);
  if (heroParts) wireSearch(block, heroParts.search);
}
