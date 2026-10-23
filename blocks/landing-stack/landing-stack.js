import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'landing-stack';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
let tabsetCount = 0;

/**
 * Optimize same-origin, non-SVG images only (migrated images keep source-site URLs).
 * @param {Element} block
 */
function optimizePictures(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Scene7 pads (letterboxes) a rendition when the requested `wid` exceeds the asset's
 * native width or disagrees with a fixed `hei`. Cap `wid` at the native width encoded
 * in the asset name (e.g. `-1202x998`) and drop `hei` so the aspect ratio is kept.
 * WebP renditions are requested with alpha, matching the source.
 * @param {string} value a URL or srcset
 * @returns {string}
 */
function fitScene7Rendition(value) {
  try {
    const url = new URL(value, window.location.href);
    if (!/scene7\.com$/.test(url.hostname)) return value;
    const size = url.pathname.match(/-(\d+)x(\d+)$/);
    url.searchParams.delete('hei');
    const wid = Number(url.searchParams.get('wid'));
    if (size && wid > Number(size[1])) url.searchParams.set('wid', size[1]);
    // source renditions are cut-outs on transparent canvases (fmt=webp-alpha)
    if (url.searchParams.get('fmt') === 'webp') url.searchParams.set('fmt', 'webp-alpha');
    return url.toString();
  } catch {
    return value;
  }
}

function fitScene7Pictures(block) {
  block.querySelectorAll('picture source[srcset]').forEach((source) => {
    source.srcset = fitScene7Rendition(source.srcset);
  });
  block.querySelectorAll('picture img[src]').forEach((img) => {
    const fitted = fitScene7Rendition(img.src);
    if (fitted !== img.src) img.src = fitted;
  });
}

function isImageOnly(cell) {
  return !!cell.querySelector('picture')
    && cell.querySelectorAll('picture').length === 1
    && cell.textContent.trim() === '';
}

/** A paragraph whose only content is a picture. */
function isPictureParagraph(el) {
  return !!el && el.tagName === 'P' && !!el.querySelector('picture') && el.textContent.trim() === '';
}

function isPictureNode(el) {
  return !!el && (el.tagName === 'PICTURE' || isPictureParagraph(el));
}

/**
 * Cell text wrapping can leave a single <p> holding headings and paragraphs
 * (invalid flow content). Unwrap such paragraphs so children are cell-level.
 * @param {Element} cell
 */
function unwrapWrapperParagraphs(cell) {
  [...cell.children].forEach((child) => {
    if (child.tagName === 'P' && child.querySelector(`:scope > :is(${HEADINGS}, p, ul, ol, table, div)`)) {
      child.replaceWith(...child.childNodes);
    }
  });
}

/**
 * Icon images that failed to import arrive as empty `data:image/svg+xml` placeholders.
 * Drop them and flag the item so CSS can draw the bullet/check.
 * @param {Element} cell
 */
function replacePlaceholderIcons(cell) {
  cell.querySelectorAll('img[src^="data:image/svg+xml"]').forEach((img) => {
    if (img.getAttribute('src').length > 30) return;
    const item = img.closest('p, li');
    (img.closest('picture') || img).remove();
    if (item) item.classList.add(`${BLOCK}-icon-item`);
  });
}

/** Markdown strikethrough that survived the import as literal `~~text~~`. */
function decorateStrikethrough(cell) {
  cell.querySelectorAll(`${HEADINGS}, p, li`).forEach((el) => {
    if (!el.innerHTML.includes('~~')) return;
    el.innerHTML = el.innerHTML.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  });
}

/** Short label paragraph directly before a h1/h2 becomes an eyebrow. */
function decorateEyebrows(cell) {
  cell.querySelectorAll(':scope > p').forEach((p) => {
    const next = p.nextElementSibling;
    if (!next || !/^H[12]$/.test(next.tagName)) return;
    if (p.querySelector('picture, a') || !p.textContent.trim()) return;
    p.classList.add(`${BLOCK}-eyebrow`);
  });
}

/**
 * Price runs authored as flat paragraphs (label, "Starting at", **$price**, "+ $x ...")
 * are grouped into price columns.
 * @param {Element} cell
 */
function decoratePrices(cell) {
  const groups = [];
  [...cell.querySelectorAll(':scope > p')].forEach((p) => {
    const strong = p.querySelector(':scope > strong');
    if (!strong || p.textContent.trim() !== strong.textContent.trim()) return;
    if (!/^\$/.test(strong.textContent.trim())) return;
    const before = [p.previousElementSibling?.previousElementSibling, p.previousElementSibling]
      .filter((el) => el && el.tagName === 'P' && !el.className && !el.querySelector('a, picture'));
    const after = p.nextElementSibling;
    const parts = [...before, p];
    if (after && after.tagName === 'P' && /^\+/.test(after.textContent.trim())) parts.push(after);
    const group = document.createElement('div');
    group.className = `${BLOCK}-price`;
    parts[0].before(group);
    parts.forEach((part, i) => {
      if (part === p) part.classList.add(`${BLOCK}-price-amount`);
      else if (i === 0 && before.length === 2) part.classList.add(`${BLOCK}-price-label`);
      else if (part === after) part.classList.add(`${BLOCK}-price-note`);
      else part.classList.add(`${BLOCK}-price-from`);
      group.append(part);
    });
    groups.push(group);
  });
  if (!groups.length) return;
  const prices = document.createElement('div');
  prices.className = `${BLOCK}-prices`;
  groups[0].before(prices);
  prices.append(...groups);
}

/**
 * Split a cell holding repeated [picture, heading, text...] runs into items.
 * @param {Element} cell
 * @returns {boolean} true when the cell was split
 */
function splitPoints(cell) {
  const children = [...cell.children];
  const starts = children
    .filter((el, i) => isPictureNode(el) && children[i + 1]?.matches(HEADINGS));
  if (starts.length < 2 || !isPictureNode(children[0])) return false;
  let item;
  children.forEach((el) => {
    if (starts.includes(el)) {
      item = document.createElement('div');
      item.className = `${BLOCK}-point`;
      cell.append(item);
    }
    item.append(el);
  });
  return true;
}

/** Move a trailing (or leading) picture into its own media element. */
function extractMedia(cell, picture) {
  const media = document.createElement('div');
  media.className = `${BLOCK}-card-media`;
  media.append(picture.tagName === 'PICTURE' ? picture : picture.querySelector('picture'));
  if (picture.tagName === 'P') picture.remove();
  return media;
}

function wrapChildren(cell, className) {
  const body = document.createElement('div');
  body.className = className;
  body.append(...cell.childNodes);
  cell.append(body);
  return body;
}

/**
 * Classify a panel row by its content so CSS can lay out each landing pattern.
 * @param {Element} row
 * @param {Element[]} cells
 */
function classifyPanel(row, cells) {
  const content = cells.filter((cell) => cell.classList.contains(`${BLOCK}-content`));
  const media = cells.filter((cell) => cell.classList.contains(`${BLOCK}-media`));
  const [first] = content;
  if (!first) return;
  const elements = [...first.children];

  if (first.querySelector('h1')) {
    row.classList.add(`${BLOCK}-hero`);
    return;
  }

  if (cells.length === 1 && elements.length && elements.every((el) => el.matches(HEADINGS))) {
    row.classList.add(`${BLOCK}-intro`);
    if (elements.every((el) => el.tagName === 'H3')) row.classList.add(`${BLOCK}-tab-label`);
    return;
  }

  if (content.length > 1 && content.every((cell) => cell.querySelector('picture') && cell.querySelector(HEADINGS))) {
    row.classList.add(`${BLOCK}-cards`);
    content.forEach((cell) => cell.classList.add(`${BLOCK}-card`));
    return;
  }

  if (content.length === 1 && media.length && elements[0]?.matches('ul, ol')) {
    // list shout-out over a background image, with the remaining content as a card
    row.classList.add(`${BLOCK}-backdrop`);
    const list = elements[0];
    list.classList.add(`${BLOCK}-shout`);
    const card = document.createElement('div');
    card.className = `${BLOCK}-card`;
    card.append(...elements.slice(1));
    first.append(card);
    return;
  }

  if (content.length === 1 && media.length) {
    row.classList.add(`${BLOCK}-split`);
    first.classList.add(`${BLOCK}-card`);
    return;
  }

  if (cells.length === 1 && splitPoints(first)) {
    row.classList.add(`${BLOCK}-points`);
    return;
  }

  if (cells.length === 1 && first.querySelector('h2')) {
    const head = elements[0];
    const tail = elements[elements.length - 1];
    if (isPictureNode(tail) && !isPictureNode(head)) {
      row.classList.add(`${BLOCK}-feature`);
      first.classList.add(`${BLOCK}-card`);
      const mediaEl = extractMedia(first, tail);
      wrapChildren(first, `${BLOCK}-card-body`);
      first.prepend(mediaEl);
    } else if (isPictureNode(head)) {
      row.classList.add(`${BLOCK}-promo`);
      first.classList.add(`${BLOCK}-card`);
      const mediaEl = extractMedia(first, head);
      wrapChildren(first, `${BLOCK}-card-body`);
      first.prepend(mediaEl);
    }
  }
}

function selectTab(tabset, tab, focus = false) {
  tabset.querySelectorAll('[role="tab"]').forEach((t) => {
    const selected = t === tab;
    t.setAttribute('aria-selected', selected);
    t.tabIndex = selected ? 0 : -1;
    const panel = tabset.querySelector(`#${t.getAttribute('aria-controls')}`);
    if (panel) panel.hidden = !selected;
  });
  if (focus) tab.focus();
}

/**
 * Build one tabset from [label row, panel row] pairs.
 * @param {Array<Element[]>} pairs
 * @param {number} setIndex
 */
function createTabset(pairs, setIndex) {
  const tabset = document.createElement('div');
  tabset.className = `${BLOCK}-panel ${BLOCK}-tabs`;
  const tablist = document.createElement('div');
  tablist.className = `${BLOCK}-tablist`;
  tablist.setAttribute('role', 'tablist');
  pairs[0][0].before(tabset);
  tabset.append(tablist);
  pairs.forEach(([label, panel], index) => {
    const id = `${BLOCK}-${setIndex}-${index}`;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `${BLOCK}-tab`;
    tab.id = `${id}-tab`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${id}-panel`);
    tab.textContent = label.textContent.trim();
    tablist.append(tab);
    panel.classList.remove(`${BLOCK}-panel`);
    panel.classList.add(`${BLOCK}-tabpanel`);
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tabset.append(panel);
    label.remove();
  });
  selectTab(tabset, tablist.firstElementChild);
  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) selectTab(tabset, tab);
  });
  tablist.addEventListener('keydown', (e) => {
    const tabs = [...tablist.children];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next;
    if (e.key === 'ArrowRight') next = tabs[(current + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(current - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') [next] = tabs;
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    selectTab(tabset, next, true);
  });
}

/**
 * Consecutive [heading-only h3 row, panel row] pairs are authored tabs:
 * the h3 is the tab label, the following row is its panel.
 * @param {Element} block
 */
function buildTabs(block) {
  const rows = [...block.children];
  const isLabel = (row) => !!row && row.classList.contains(`${BLOCK}-tab-label`);
  const isPanel = (row) => !!row && !row.classList.contains(`${BLOCK}-intro`);
  let i = 0;
  while (i < rows.length) {
    const pairs = [];
    while (isLabel(rows[i]) && isPanel(rows[i + 1])) {
      pairs.push([rows[i], rows[i + 1]]);
      i += 2;
    }
    if (pairs.length >= 2) {
      tabsetCount += 1;
      createTabset(pairs, tabsetCount);
    } else if (!pairs.length) {
      i += 1;
    }
  }
}

/**
 * Landing stack: a stacked run of landing-page panels authored as one block.
 * Each row is a panel; each cell in a row is a column of that panel. Image-only
 * cells are media columns; a row with one image-only cell and nothing else is a
 * full-width image strip. Cells holding several images become an image grid.
 * Panels are classified by content (hero, intro, tabs, backdrop, feature, promo,
 * points, cards) so each landing pattern gets its own layout.
 * @param {Element} block
 */
export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    [...row.children].forEach((cell) => unwrapWrapperParagraphs(cell));
    const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img, iframe'));
    // drop empty cells authors leave behind
    [...row.children].forEach((cell) => { if (!cells.includes(cell)) cell.remove(); });
    if (!cells.length) {
      row.remove();
      return;
    }

    row.classList.add(`${BLOCK}-panel`, `${BLOCK}-panel-${cells.length}-cols`);
    row.dataset.panelIndex = index;

    cells.forEach((cell) => {
      if (isImageOnly(cell)) {
        cell.classList.add(`${BLOCK}-media`);
      } else if (cell.querySelectorAll('picture').length > 1 && !cell.querySelector(HEADINGS)) {
        cell.classList.add(`${BLOCK}-gallery`);
      } else {
        cell.classList.add(`${BLOCK}-content`);
        replacePlaceholderIcons(cell);
        decorateStrikethrough(cell);
        decorateEyebrows(cell);
        decoratePrices(cell);
      }
    });

    if (cells.every((cell) => cell.classList.contains(`${BLOCK}-media`))) {
      row.classList.add(`${BLOCK}-panel-media-only`);
    } else {
      classifyPanel(row, cells);
    }
  });

  buildTabs(block);
  fitScene7Pictures(block);
  optimizePictures(block);
}
