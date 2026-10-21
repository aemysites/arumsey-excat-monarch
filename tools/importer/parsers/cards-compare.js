/* eslint-disable */
/* global WebImporter */

/**
 * cards-compare: one row per card, one cell holding the card content in order:
 *   [icon image] H3 title, description, <hr>, label + check-list sections
 *   (separated by <hr>), then link-only paragraphs (bottom CTAs).
 *
 * Source families (generic):
 *  A) small-business product banners: .items > div > app-banner > section.banner
 *     (.header h3, .eyebrow-copy, .description, .multifield-description, .banner__content-buttonsection)
 *  B) "grow your relationship" carousel cards: .x-carousel-item > .card-container > .card-row
 *     (header row with optional icon / bar, then one section per card-row)
 *
 * Variants (README option classes), detected from generic source cues:
 *  - coloured-top-bar: carousel cards whose header has a colour bar (.bar-indicator)
 *  - shadow-blue:      banner cards with header images and button CTAs
 *  - shadow:           banner cards with link CTAs or no CTA
 *  - plain:            banner cards with button CTAs and no images; carousel cards without bar
 */

function text(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function strip(root) {
  root.querySelectorAll('cds-icon, cds-icon-wrapper, svg, .sr-only, .visually-hidden, .bar-indicator').forEach((x) => x.remove());
  // presentational wrappers are dropped only when they hold no text (footnote <sup role=presentation> is kept)
  root.querySelectorAll('[role="presentation"]:not(img)').forEach((x) => { if (!text(x)) x.remove(); });
  root.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
}

function cloneImg(document, img) {
  const src = img.getAttribute('src') || img.getAttribute('data-src');
  if (!src) return null;
  const out = document.createElement('img');
  out.src = src;
  out.alt = img.getAttribute('alt') || '';
  return out;
}

function ctaParagraphs(document, root) {
  const out = [];
  root.querySelectorAll('a[href], button').forEach((el) => {
    const label = text(el) || el.getAttribute('aria-label') || '';
    if (!label) return;
    const p = document.createElement('p');
    const href = el.tagName === 'A' ? el.getAttribute('href') : '';
    if (href && !/^javascript:/i.test(href)) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      p.append(a);
    } else {
      // button CTA without a target URL in the DOM: keep its label
      const strong = document.createElement('strong');
      strong.textContent = label;
      p.append(strong);
    }
    out.push(p);
  });
  return out;
}

/** Copy rich-text children (p, ul, ol, headings) of a container; inline-only text becomes a <p>. */
function richContent(document, root) {
  const out = [];
  strip(root);
  root.querySelectorAll('.list-header, .list-eyebrow, .capital-string').forEach((label) => {
    // list labels become bold paragraphs
    if (!text(label)) return;
    const holder = label.closest('p') || label;
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text(label);
    p.append(strong);
    holder.replaceWith(p);
  });
  root.querySelectorAll('li').forEach((li) => {
    if (!text(li)) li.remove();
  });
  const blocks = [...root.querySelectorAll('p, ul, ol, h4, h5, h6, table')]
    .filter((el) => !el.parentElement.closest('p, ul, ol, table'));
  if (blocks.length) {
    blocks.forEach((b) => { if (text(b) || b.querySelector('img')) out.push(b); });
  }
  // loose text (spans / divs with text that are not inside any block element)
  const loose = [...root.querySelectorAll('span, div')].filter((el) => text(el)
    && !el.closest('p, ul, ol, table, h1, h2, h3, h4, h5, h6')
    && ![...el.children].some((c) => text(c) && !/^(SUP|SUB|B|STRONG|EM|I|A|BR|SPAN|U)$/.test(c.tagName)));
  const looseTop = loose.filter((el) => !loose.some((o) => o !== el && o.contains(el)));
  looseTop.forEach((el) => {
    const p = document.createElement('p');
    p.append(...el.childNodes);
    out.push(p);
  });
  return out;
}

function bannerCard(document, banner) {
  const content = [];
  const img = banner.querySelector('.banner__image img, .header img');
  const title = banner.querySelector('.header h1, .header h2, .header h3, .header h4, h3, h2');
  if (img) {
    const c = cloneImg(document, img);
    if (c) content.push(c);
  }
  if (title && text(title)) {
    const h = document.createElement('h3');
    h.append(...title.childNodes);
    content.push(h);
  }
  const head = banner.querySelector('.banner__content-headsection');
  if (head) {
    const eyebrow = head.querySelector('.eyebrow-copy');
    if (eyebrow && text(eyebrow)) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = text(eyebrow);
      p.append(strong);
      content.push(p);
      eyebrow.remove();
    }
    content.push(...richContent(document, head));
  }
  banner.querySelectorAll('.banner__content-multifieldsection, .multifield-description').forEach((sec) => {
    if (sec.parentElement && sec.parentElement.closest('.banner__content-multifieldsection')) return;
    const parts = richContent(document, sec);
    if (parts.length) {
      content.push(document.createElement('hr'));
      content.push(...parts);
    }
  });
  const btns = banner.querySelector('.banner__content-buttonsection');
  if (btns) content.push(...ctaParagraphs(document, btns));
  return content;
}

function carouselCard(document, card) {
  const content = [];
  const rows = [...card.querySelectorAll('.card-row')];
  rows.forEach((row, i) => {
    const header = row.querySelector('.headerWithIcon, .header');
    if (header && i === 0) {
      const img = row.querySelector('img');
      if (img) {
        const c = cloneImg(document, img);
        if (c) content.push(c);
      }
      const h = header.querySelector('h1, h2, h3, h4') || header;
      const nh = document.createElement('h3');
      nh.textContent = text(h);
      if (text(h)) content.push(nh);
      return;
    }
    const btnWrap = row.querySelector('.template-btn');
    if (btnWrap || row.classList.contains('lastRow') && row.querySelector('a[href], button') && !row.querySelector('ul, .description-string, .template')) {
      content.push(...ctaParagraphs(document, btnWrap || row));
      return;
    }
    const parts = richContent(document, row);
    if (parts.length) {
      if (content.length && content[content.length - 1].tagName !== 'HR') content.push(document.createElement('hr'));
      content.push(...parts);
    }
  });
  return content;
}

function detectVariant(element) {
  if (element.querySelector('.x-carousel-item, .card-container')) {
    return element.querySelector('.bar-indicator') ? 'coloured-top-bar' : null;
  }
  const buttons = element.querySelectorAll('.banner__content-buttonsection button').length;
  const links = element.querySelectorAll('.banner__content-buttonsection a[href]').length;
  const images = element.querySelectorAll('section.banner img, .banner__image img').length;
  if (buttons && !links) return images ? 'shadow-blue' : null;
  return 'shadow';
}

export default function parse(element, { document, params }) {
  const variant = detectVariant(element);
  const cells = [];

  let cards = [...element.querySelectorAll('section.banner, .x-carousel-item .card-container, .card-container')];
  cards = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));

  const seen = new Set();
  cards.forEach((card) => {
    const content = card.matches('section.banner') ? bannerCard(document, card) : carouselCard(document, card);
    // drop trailing separators
    while (content.length && content[content.length - 1].tagName === 'HR') content.pop();
    const key = content.map((n) => n.textContent).join('|').replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) return; // carousel clones
    seen.add(key);
    cells.push([content]);
  });

  if (!cells.length) {
    const div = document.createElement('div');
    div.append(...element.childNodes);
    cells.push([div]);
  }

  const name = variant ? `cards-compare (${variant})` : 'cards-compare';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
