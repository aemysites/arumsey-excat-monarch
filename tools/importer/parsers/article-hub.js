/* eslint-disable */
/* global WebImporter */

/**
 * article-hub: article collection landing page (Knowledge Center / Travel Guide hubs).
 *
 * Output rows (padded to 2 columns; the block ignores empty cells):
 *  - row 1 (hero):    hero image | eyebrow + H1 + description + "Search ..." label paragraph
 *  - heading row:     [H2 + optional "View all" link]                 -> starts a card group
 *  - card rows:       image | H3 title (linked) + description
 *  - one-cell rows:   closing content (other-category links, notes, CTAs)
 *
 * Source groups: .recommended-articles / .category-item lists of
 * a.category-all__mobile-carousel cards, and the "Additional Resources"
 * icon-text tiles. No variants.
 */

const COLS = 2;

function pad(row) {
  while (row.length < COLS) row.push('');
  return row;
}

function text(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function firstImage(root) {
  if (!root) return null;
  const img = root.querySelector('img');
  if (!img) return null;
  const src = img.getAttribute('src') || img.getAttribute('data-desktop-src') || img.getAttribute('data-src');
  if (!src) return null;
  if (!img.getAttribute('src')) img.setAttribute('src', src);
  return img;
}

function link(document, href, label) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  return a;
}

function heroRow(document, element) {
  const img = firstImage(element.querySelector('[class*="banner-image"]'));
  const details = element.querySelector('.article-details');
  const cell = document.createElement('div');
  if (details) {
    const h1 = details.querySelector('h1');
    [...details.querySelectorAll('h1, h2, h3, h4, p')].forEach((el) => {
      if (!text(el) || (el.parentElement && el.parentElement.closest('p'))) return;
      if (el === h1) {
        const h = document.createElement('h1');
        h.append(...el.childNodes);
        cell.append(h);
        return;
      }
      // eyebrow (before H1) and description (after H1) are plain paragraphs
      const p = document.createElement('p');
      p.append(...el.childNodes);
      cell.append(p);
    });
  }
  const searchLabel = element.querySelector('.cmp-search label.search-article, .cmp-search label:not(.search-warning), .search label');
  if (searchLabel && text(searchLabel)) {
    const p = document.createElement('p');
    const label = text(searchLabel);
    p.textContent = /^search\b/i.test(label) ? label : `Search ${label}`;
    cell.append(p);
  }
  if (!img && !text(cell)) return null;
  return pad([img || '', text(cell) ? cell : '']);
}

function groupHeading(document, container) {
  const titleEl = container.querySelector('.category-title h1, .category-title h2, .category-title h3, .category-all__title h1, .category-all__title h2, .category-all__title h3');
  const viewAll = container.querySelector('.category-page__link[href], .category-all__browse a[href]');
  const cell = document.createElement('div');
  if (titleEl && text(titleEl)) {
    const h = document.createElement('h2');
    h.textContent = text(titleEl);
    cell.append(h);
  }
  if (viewAll && text(viewAll)) {
    const p = document.createElement('p');
    p.append(link(document, viewAll.getAttribute('href'), text(viewAll)));
    cell.append(p);
  }
  return text(cell) ? cell : null;
}

function cardRows(document, container) {
  const rows = [];
  const seen = new Set();
  container.querySelectorAll('.category-all__article-wrapper a[href], .category-all__article-item').forEach((node) => {
    const item = node.matches('a[href]') ? node : node;
    const anchor = node.matches('a[href]') ? node : node.closest('a[href]');
    if (!node.matches('a[href]') && anchor && container.contains(anchor)) return; // handled via its anchor
    const href = anchor ? anchor.getAttribute('href') : '';
    const titleEl = item.querySelector('h3.category-all__article-title, .category-all__article-title:not(h2):not(p), h3, h4');
    const key = href || text(titleEl);
    if (!key || seen.has(key)) return;
    seen.add(key);
    const img = firstImage(item.querySelector('[class*="item-left"]') || item);
    const body = document.createElement('div');
    if (titleEl && text(titleEl)) {
      const h = document.createElement('h3');
      if (href) h.append(link(document, href, text(titleEl)));
      else h.textContent = text(titleEl);
      body.append(h);
    }
    const desc = item.querySelector('.category-all__article-description, p');
    if (desc && desc !== titleEl && text(desc)) {
      const p = document.createElement('p');
      p.textContent = text(desc);
      body.append(p);
    }
    if (!text(body) && !img) return;
    rows.push(pad([img || '', text(body) ? body : '']));
  });
  return rows;
}

function otherLinksRow(document, container) {
  const links = [...container.querySelectorAll('.category-all__other-article-wrapper a[href], ul a[href]')]
    .filter((a, i, arr) => text(a) && arr.indexOf(a) === i);
  if (!links.length) return null;
  const cell = document.createElement('div');
  const titleEl = container.querySelector('.category-all__title, h2, h3');
  if (titleEl && text(titleEl)) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text(titleEl);
    p.append(strong);
    cell.append(p);
  }
  const ul = document.createElement('ul');
  links.forEach((a) => {
    const li = document.createElement('li');
    li.append(link(document, a.getAttribute('href'), text(a)));
    ul.append(li);
  });
  cell.append(ul);
  return pad([cell]);
}

function tileGroup(document, container) {
  const rows = [];
  const title = container.querySelector('.citi-title h1, .citi-title h2, .citi-title h3');
  if (title && text(title)) {
    const h = document.createElement('h2');
    h.textContent = text(title);
    rows.push(pad([h]));
  }
  container.querySelectorAll('.citi-icon-text-tile-container').forEach((tile) => {
    const img = firstImage(tile.querySelector('[class*="image-wrapper"]') || tile);
    const body = document.createElement('div');
    const heading = tile.querySelector('[class*="tile-heading"] h2, [class*="tile-heading"] h3, [class*="tile-heading"] h4, h3');
    if (heading && text(heading)) {
      heading.querySelectorAll('[aria-hidden="true"]').forEach((x) => x.remove());
      const a = heading.querySelector('a[href]');
      const h = document.createElement('h3');
      if (a) h.append(link(document, a.getAttribute('href'), text(a)));
      else h.textContent = text(heading);
      body.append(h);
    }
    tile.querySelectorAll('[class*="tile-description"] p').forEach((p) => {
      if (!text(p)) return;
      const np = document.createElement('p');
      np.append(...p.childNodes);
      body.append(np);
    });
    if (text(body) || img) rows.push(pad([img || '', text(body) ? body : '']));
  });
  return rows;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const hero = heroRow(document, element);
  if (hero) cells.push(hero);

  const footer = [];
  const UNITS = [
    '.category-item',
    '.recommended-articles',
    '.search-results',
    '.tkc-additional-resource-container',
    '.ckcbanner',
    '.citi-rte',
  ].join(', ');
  const accepted = [];
  [...element.querySelectorAll(UNITS)].forEach((unit) => {
    if (accepted.some((a) => a.contains(unit))) return;
    if (unit.closest('.article-details')) return; // hero content
    if (unit.matches('.recommended-articles') && unit.querySelector('.category-item')) return; // descend into items
    accepted.push(unit);

    if (unit.matches('.category-item, .recommended-articles, .search-results')) {
      const cards = cardRows(document, unit);
      if (cards.length) {
        const heading = groupHeading(document, unit);
        if (heading) cells.push(pad([heading]));
        cells.push(...cards);
        return;
      }
      const others = otherLinksRow(document, unit);
      if (others) footer.push(others);
      return;
    }
    if (unit.matches('.tkc-additional-resource-container')) {
      cells.push(...tileGroup(document, unit));
      return;
    }
    // promo banners / stray rich text: closing one-cell content
    unit.querySelectorAll('button, svg, [aria-hidden="true"]:not(img)').forEach((x) => x.remove());
    const cell = document.createElement('div');
    unit.querySelectorAll('h1, h2, h3, h4, p, ul, ol, img').forEach((el) => {
      if (el.parentElement && el.parentElement.closest('p, ul, ol')) return;
      if (!text(el) && el.tagName !== 'IMG') return;
      cell.append(el);
    });
    unit.querySelectorAll('a[href].cta-primary-btn').forEach((a) => {
      if (cell.contains(a) || !text(a)) return;
      const p = document.createElement('p');
      p.append(link(document, a.getAttribute('href'), text(a)));
      cell.append(p);
    });
    if (text(cell)) footer.push(pad([cell]));
  });
  cells.push(...footer);

  if (!cells.length) {
    const div = document.createElement('div');
    div.append(...element.childNodes);
    cells.push(pad([div]));
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-hub', cells });
  element.replaceWith(block);
}
