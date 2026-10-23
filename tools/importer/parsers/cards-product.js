/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-product
 * Source: section.column-control holding product/feature cards
 *   (div.card-stacked.card-overflow, article.card-stacked.stackedContent, or
 *   "most recent" article cards).
 * Layout (blocks/cards-product/README.md): one row per card:
 *   [image (optional) | heading (may be linked), optional price line, text, list, button(s)]
 * Variants (catalog lookup by page + instance wins; otherwise DOM cues):
 *   photo-side            - div.card-primary / div.card-primary-grow product cards
 *   image                 - image-overflow cards on the expat services pages (catalog)
 *   checklist-green-image - stacked cards with white check-icon lists (dark section)
 *   checklist             - stacked cards with green check-icon paragraphs
 *   article               - "most recent" article cards on a dark section
 *   (none)                - image-overflow product cards / article cards on light sections
 */

// catalog-template.json: page path -> [[instance selector, variant class|null]]
const CATALOG_VARIANTS = {
  "/expat-tax-preparation/expat-tax-preparation-and-services/": [["section.column-control.two-column-control:has(li.imageOverflow)", "image"]],
  "/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [["section.column-control.two-column-control:has(li.imageOverflow)", "image"]],
  // campaign-full-bleed-hero (catalog variant; class selector stable between catalog and live)
  "/responsibilityisland/": [["section.column-control.two-column-control:has(.video-container)", "video"]],
};

function pagePath(params) {
  try {
    let p = new URL(params && params.originalURL).pathname.replace(/index\.html$/, '').replace(/\.html$/, '/');
    if (!p.endsWith('/')) p += '/';
    return p.toLowerCase();
  } catch (e) {
    return '';
  }
}

/* variant class recorded by the catalog for this page + instance; undefined when unknown */
function catalogVariant(element, params) {
  const entries = CATALOG_VARIANTS[pagePath(params)];
  if (!entries) return undefined;
  for (const [sel, v] of entries) {
    try { if (element.matches(sel)) return v; } catch (e) { /* invalid selector */ }
  }
  return undefined;
}

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(root) {
  root.querySelectorAll('svg, span.reader, span.spacer, span.hide, input, script, style, link, noscript, meta').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
  root.querySelectorAll('h1 br, h2 br, h3 br, h4 br, h5 br').forEach((br) => br.replaceWith(' '));
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else p.append(content);
  return p;
}

function ctaParagraphs(document, container) {
  return [...container.querySelectorAll('a, button')].filter((c) => text(c)).map((c) => {
    const link = document.createElement('a');
    link.href = (c.tagName === 'A' && c.getAttribute('href')) || '#';
    link.textContent = text(c);
    const strong = document.createElement('strong');
    strong.append(link);
    return para(document, strong);
  });
}

/* Turn runs of check-icon paragraphs into a list; keep other children */
function bodyContent(document, holder) {
  const out = [];
  let list = null;
  [...holder.children].forEach((child) => {
    if (!text(child) && !child.querySelector('img')) return;
    const isCheck = child.tagName === 'P' && child.querySelector('[class*="hrb-icon-link--check"]')
      && text(child) === text(child.querySelector('[class*="hrb-icon-link--check"]'));
    if (isCheck) {
      if (!list) { list = document.createElement('ul'); out.push(list); }
      const li = document.createElement('li');
      li.textContent = text(child);
      list.append(li);
      return;
    }
    list = null;
    if (child.tagName === 'DIV') out.push(...bodyContent(document, child));
    else out.push(child);
  });
  return out;
}

function buildHeading(document, src) {
  const h = document.createElement('h3');
  const a = src.querySelector('a[href]');
  if (a && a.getAttribute('href') !== '#') {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(src);
    h.append(link);
  } else {
    h.textContent = text(src);
  }
  return h;
}

export default function parse(element, { document, params }) {
  const variantFromCatalog = catalogVariant(element, params);
  // video cards (div.video-container: poster still + "play" overlay image; hrblock-cleanup
  // keeps the YouTube URL as data-excat-video): drop the overlay, keep the eyebrow label
  // (cleanInline turns eyebrow headings into plain paragraphs) and add a video link
  element.querySelectorAll('.video-container').forEach((vc) => {
    vc.querySelectorAll('.playbutton-image, button').forEach((n) => n.remove());
    const card = vc.closest('li.column') || vc.parentElement;
    const eyebrow = card && card.querySelector('.eyebrow-label, .color-eyebrow');
    if (eyebrow && text(eyebrow)) card.setAttribute('data-excat-eyebrow', text(eyebrow));
    if (eyebrow) eyebrow.remove();
    const url = vc.getAttribute('data-excat-video');
    if (card && url) card.setAttribute('data-excat-video', url);
  });
  cleanInline(element);
  const cells = [];

  let cards = [...element.querySelectorAll('article.card-stacked, div.card-stacked')]
    .filter((c) => !c.parentElement.closest('.card-stacked'));
  if (!cards.length) cards = [...element.querySelectorAll('li.column')];

  cards.forEach((card) => {
    // primary product cards (div.card-primary > article.card-content + side photo):
    // row = [image | linked title, text, check list, Starting at, price, fee note, button]
    const primary = card.querySelector('div.card-primary > article.card-content, div.card-primary-grow > article');
    if (primary) {
      const pimg = card.querySelector('.card-img img') || card.querySelector('img');
      const pbody = [];
      const ptitle = primary.querySelector('header h3, header h2, h3, h2');
      if (ptitle) pbody.push(buildHeading(document, ptitle));
      const header = primary.querySelector('header');
      if (header) {
        [...header.children].forEach((child) => {
          if (child === ptitle || !text(child)) return;
          if (child.matches('ul, ol')) {
            const list = document.createElement('ul');
            child.querySelectorAll(':scope > li').forEach((li) => {
              if (!text(li)) return;
              const item = document.createElement('li');
              item.textContent = text(li);
              list.append(item);
            });
            if (list.children.length) pbody.push(list);
          } else pbody.push(para(document, text(child)));
        });
      }
      const footer = primary.querySelector('footer');
      if (footer) {
        [...footer.children].forEach((child) => {
          if (child.matches('a, button') || child.querySelector('a, button')) return;
          const t = text(child);
          if (!t) return;
          if (child.matches('strong')) {
            const s = document.createElement('strong');
            s.textContent = t;
            pbody.push(para(document, s));
          } else pbody.push(para(document, t));
        });
        pbody.push(...ctaParagraphs(document, footer));
      }
      if (pbody.length || pimg) cells.push([pimg || '', pbody.length ? pbody : '']);
      return;
    }
    const img = card.querySelector('.cmp-column--image img') || card.querySelector('img');
    const body = [];
    const title = card.querySelector('.stacked-title, h3.title, header h3, h3, h2');
    let href = null;

    // "Read more" style article cards link the title to the button target
    const btnLinks = [...card.querySelectorAll('footer a[href], .btn-container a[href], a.btn[href]')]
      .filter((a) => text(a) && a.getAttribute('href') !== '#');
    const eyebrowText = card.getAttribute('data-excat-eyebrow');
    if (eyebrowText) body.push(para(document, eyebrowText));
    if (title) {
      const h = buildHeading(document, title);
      if (!h.querySelector('a') && card.matches('.custom-article') && btnLinks[0]) {
        href = btnLinks[0].getAttribute('href');
        const link = document.createElement('a');
        link.href = href;
        link.textContent = h.textContent;
        h.textContent = '';
        h.append(link);
      }
      body.push(h);
    }

    // price line: "Starting at $124 + $49 per FBAR"
    const pricing = card.querySelector('.pricing-container');
    if (pricing) {
      const priceText = text(pricing);
      if (priceText) body.push(para(document, priceText));
    }

    // text, lists
    const holder = card.querySelector('[class*="body_max_width"]') || card.querySelector('.excerpt');
    if (holder) body.push(...bodyContent(document, holder));

    // buttons
    const actions = card.querySelector('.btn-container') || card.querySelector('footer');
    if (actions) body.push(...ctaParagraphs(document, actions));
    const videoUrl = card.getAttribute('data-excat-video');
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.textContent = 'Watch now';
      const strong = document.createElement('strong');
      strong.append(a);
      body.push(para(document, strong));
    }

    if (!body.length && !img) return;
    cells.push([img || '', body.length ? body : '']);
  });

  let variant = null;
  const dark = element.matches('.green-dark-theme') || !!element.closest('.green-dark-theme');
  if (element.querySelector('div.card-primary > article.card-content, div.card-primary-grow > article')) variant = 'photo-side';
  else if (element.querySelector('.hrb-icon-link--check-white')) variant = 'checklist-green-image';
  else if (element.querySelector('.stackedContent [class*="hrb-icon-link--check"]')) variant = 'checklist';
  else if (element.querySelector('.mostrecent, article.custom-article') && dark) variant = 'article';

  if (variantFromCatalog !== undefined) variant = variantFromCatalog;
  const name = variant ? `cards-product (${variant})` : 'cards-product';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
