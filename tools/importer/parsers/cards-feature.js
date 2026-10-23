/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Sources (one block per container, one row per card):
 *   - div.fast-facts (expat country fast facts): image + text
 *   - section.column-control / div.xf-content-height holding article.card-stacked cards
 * Layout (blocks/cards-feature/README.md): [image (optional) | body], body =
 * optional eyebrow, heading, text, final CTA paragraph. Cards on a dark
 * background (green-dark / spruce-forest theme) get a leading `(dark)` paragraph.
 */

const DARK_THEMES = ['green-dark-theme', 'spruce-forest-theme', 'green-forest-theme', 'black-theme'];

function cleanInline(root) {
  root.querySelectorAll('svg, span.reader, span.spacer, input, script, style, link, noscript, meta').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, ' ').trim()));
  });
}

/* inline <svg> icon -> data-URI <img> (cleanInline drops every svg) */
function svgToImg(document, svg) {
  try {
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const markup = clone.outerHTML;
    const b64 = typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(markup)))
      : Buffer.from(markup, 'utf8').toString('base64');
    const img = document.createElement('img');
    img.src = `data:image/svg+xml;base64,${b64}`;
    img.alt = svg.getAttribute('aria-label') || '';
    return img;
  } catch (e) {
    return null;
  }
}

const ICON_SVG_SEL = '.stacked-title svg, .card-title svg, .icon-svg svg, .cmp-column--image svg, header svg';

/**
 * Card icons are inline SVGs (homepage guarantees h3.stacked-title > svg, office
 * card-inset h3.card-title > svg, w-4 cards): a card without an <img> gets its
 * first icon SVG as an image, so the image cell is not empty.
 */
function captureIcons(element, document) {
  const cards = [...element.querySelectorAll('article')].filter((a) => !a.parentElement.closest('article'));
  cards.forEach((card) => {
    if (card.querySelector('img[src]')) return;
    const svg = [...card.querySelectorAll(ICON_SVG_SEL)]
      .find((s) => !s.closest('a, button') && !s.matches('.svg-hover-push') && s.querySelector('path, rect, circle, g, polygon'));
    const img = svg && svgToImg(document, svg);
    if (img) svg.replaceWith(img);
  });
}

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else p.append(content);
  return p;
}

function buildHeading(document, src) {
  const tag = /^H[1-6]$/.test(src.tagName) ? src.tagName.toLowerCase() : 'h3';
  const h = document.createElement(tag);
  const a = src.querySelector('a[href]');
  if (a) {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(src);
    h.append(link);
  } else {
    h.textContent = text(src);
  }
  return h;
}

function ctaParagraph(document, container) {
  const controls = [...container.querySelectorAll('a, button')].filter((c) => text(c));
  if (!controls.length) return null;
  const p = document.createElement('p');
  controls.forEach((c, i) => {
    if (i) p.append(' ');
    if (c.tagName === 'A' && c.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = c.getAttribute('href');
      link.textContent = text(c);
      const strong = document.createElement('strong');
      strong.append(link);
      p.append(strong);
    } else {
      // JS-only <button> (no URL on the source): keep it as a CTA link to "#"
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = text(c);
      const strong = document.createElement('strong');
      strong.append(link);
      p.append(strong);
    }
  });
  return p;
}

function isDark(card) {
  return DARK_THEMES.some((t) => card.classList.contains(t));
}

export default function parse(element, { document }) {
  captureIcons(element, document);
  cleanInline(element);
  const cells = [];

  const facts = [...element.querySelectorAll('div.fast-fact')];
  if (element.matches('.fast-facts') || facts.length) {
    facts.forEach((ff) => {
      const img = ff.querySelector('img');
      const body = [...ff.querySelectorAll(':scope > p, :scope > div:not(.ff-image) p, :scope > h3, :scope > h4')]
        .filter((p) => text(p));
      if (!body.length && !img) return;
      cells.push([img || '', body.length ? body : '']);
    });
  } else {
    const cards = [...element.querySelectorAll('article.card-stacked, article')]
      .filter((a, i, arr) => arr.indexOf(a) === i && !a.parentElement.closest('article'));
    // Chiclet tiles (li.col-4 > div.chicletDiv: icon + p.title, whole tile is the link;
    // business-services "Small business taxes" row) carry no article: one card per tile.
    if (!cards.length) {
      element.querySelectorAll('div.chicletDiv').forEach((tile) => {
        const label = text(tile.querySelector('p.title') || tile);
        if (!label) return;
        const body = [];
        const content = tile.querySelector('.chicletDivContent') || tile;
        if (isDark(content)) body.push(para(document, '(dark)'));
        const a = tile.querySelector('a[href]');
        const href = a && a.getAttribute('href');
        const h = document.createElement('h3');
        if (href && !/^javascript:/i.test(href)) {
          const link = document.createElement('a');
          link.href = href;
          link.textContent = label;
          h.append(link);
        } else h.textContent = label;
        body.push(h);
        cells.push([tile.querySelector('img') || '', body]);
      });
    }
    cards.forEach((card) => {
      // inset cards (div.card-inset > article: h3.card-title eyebrow with desktop/mobile
      // spans, large .word-wrap-card statement, optional static price, .card-btn CTA),
      // e.g. office pages "Block Advisors" / "Hablas Espanol", tax-offices Tax Identity Shield.
      // Same card row as the other sources: image cell | text cell.
      const inset = card.closest('.card-inset');
      if (inset && card.querySelector('.word-wrap-card')) {
        const body = [];
        if (isDark(inset) || isDark(card)) body.push(para(document, '(dark)'));
        const title = card.querySelector('.card-title');
        if (title) {
          const visible = title.querySelector('span.show-large') || [...title.querySelectorAll(':scope > span')].find((s) => !s.classList.contains('hide-large'));
          const eyebrow = text(visible || title);
          // the eyebrow links to the card destination (mobile span carries the <a>)
          const eyebrowLink = title.querySelector('a[href]');
          if (eyebrow && eyebrowLink && text(eyebrowLink) === eyebrow) {
            const link = document.createElement('a');
            link.href = eyebrowLink.getAttribute('href');
            link.textContent = eyebrow;
            body.push(para(document, link));
          } else if (eyebrow) body.push(para(document, eyebrow));
        }
        const statements = [...card.querySelectorAll('.word-wrap-card p')].filter((p) => text(p));
        statements.forEach((p, i) => {
          if (i === 0) {
            const h = document.createElement('h3');
            h.textContent = text(p);
            body.push(h);
          } else body.push(para(document, text(p)));
        });
        const price = card.querySelector('.pricing-container, .card-price-section');
        if (price && text(price)) {
          const p = document.createElement('p');
          [...price.querySelectorAll('.card-copy-small, .copy-small, strong, .price')]
            .filter((n, i, all) => text(n) && !all.some((o) => o !== n && o.contains(n)))
            .forEach((n, i) => {
              if (i) p.append(' ');
              if (n.tagName === 'STRONG' || n.classList.contains('price')) {
                const strong = document.createElement('strong');
                strong.textContent = text(n);
                p.append(strong);
              } else p.append(text(n));
            });
          if (text(p)) body.push(p);
        }
        const btns = card.querySelector('.card-btn') || card.querySelector('.card-footer');
        const cta = btns && ctaParagraph(document, btns);
        if (cta) body.push(cta);
        const img = card.querySelector('img');
        if (!body.some((b) => text(b) && text(b) !== '(dark)') && !img) return;
        cells.push([img || '', body]);
        return;
      }
      const img = card.querySelector('.cmp-column--image img') || card.querySelector('img');
      const body = [];
      if (isDark(card)) body.push(para(document, '(dark)'));

      const eyebrow = card.querySelector('.eyebrow-label, .stacked-eyebrow-row');
      if (eyebrow && text(eyebrow)) body.push(para(document, text(eyebrow)));

      const title = card.querySelector('.stacked-title, h1, h2, h3, h4');
      if (title && text(title)) body.push(buildHeading(document, title));

      const textHolder = card.querySelector('[class*="body_max_width"]')
        || card.querySelector('.card-body .card-body > div:first-child');
      if (textHolder) {
        [...textHolder.children].forEach((child) => {
          if (text(child) || child.querySelector('img')) body.push(child);
        });
      }

      const btnContainer = card.querySelector('.btn-container');
      if (btnContainer) {
        const cta = ctaParagraph(document, btnContainer);
        if (cta) body.push(cta);
      }

      const hasBody = body.some((b) => text(b) && text(b) !== '(dark)');
      if (!hasBody && !img) return;
      cells.push([img || '', body.length ? body : '']);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
