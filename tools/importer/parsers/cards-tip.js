/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-tip
 * Source: section.two-column-control holding tip cards
 *   (article.card-stacked with an inline-SVG icon + h4 tip text + optional links)
 *   and an optional standalone "Learn more ..." link.
 * Layout (blocks/cards-tip/README.md): one row per tip: [icon | tip text + links];
 * a final single-cell row with only a link is the footer link.
 * Inline SVG icons have no image URL on the source, so they are kept as SVG data-URI images.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

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
    img.alt = '';
    return img;
  } catch (e) {
    return null;
  }
}

function linkPara(document, a) {
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = text(a);
  const p = document.createElement('p');
  p.append(link);
  return p;
}

export default function parse(element, { document }) {
  element.querySelectorAll('span.reader, span.spacer, input, script, style, link, noscript').forEach((n) => n.remove());
  element.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(document.createTextNode(text(btn)));
  });

  function cardRow(card) {
    const img = card.querySelector('img');
    const svg = card.querySelector('svg');
    const icon = img || (svg ? svgToImg(document, svg) : null);
    card.querySelectorAll('svg').forEach((s) => s.remove());

    const body = [];
    const title = card.querySelector('.stacked-title, h1, h2, h3, h4, h5');
    if (title && text(title)) {
      const p = document.createElement('p');
      p.textContent = text(title);
      body.push(p);
    }
    const holder = card.querySelector('[class*="body_max_width"]');
    if (holder) [...holder.children].forEach((c) => { if (text(c)) body.push(c); });
    card.querySelectorAll('.btn-container a[href]').forEach((a) => { if (text(a)) body.push(linkPara(document, a)); });

    return (body.length || icon) ? [icon || '', body.length ? body : ''] : null;
  }

  // Tips are interleaved with topic text (div.manual-model: heading, body,
  // CTA) that introduces each tip. Walk both in document order: topic text
  // becomes default content and each run of tip cards becomes one cards-tip
  // block, so no topic text is lost.
  const isTopLevel = (el) => !el.parentElement.closest('article, .manual-model');
  const items = [...element.querySelectorAll('article, .manual-model')].filter(isTopLevel);
  // out: DOM nodes (topic text) and { cells } groups (one cards-tip block each)
  const out = [];
  let group = null;
  const lastGroup = () => (out.length && out[out.length - 1].cells ? out[out.length - 1] : null);

  items.forEach((item) => {
    if (item.tagName === 'ARTICLE') {
      const row = cardRow(item);
      if (!row) return;
      group = lastGroup() || (out.push({ cells: [] }), out[out.length - 1]);
      group.cells.push(row);
      return;
    }
    const heading = item.querySelector('.modal-headline, h1, h2, h3, h4, h5, h6');
    const bodyEls = [...item.querySelectorAll('.modal-body > *')].filter((c) => text(c));
    const links = [...item.querySelectorAll('.btn-container a[href]')].filter((a) => text(a));
    if ((!heading || !text(heading)) && !bodyEls.length) {
      // link-only text component right after tips: the tips' trailing link
      const g = lastGroup();
      links.forEach((a) => (g ? g.cells.push([linkPara(document, a)]) : out.push(linkPara(document, a))));
      return;
    }
    if (heading && text(heading)) {
      const level = /^H[1-6]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h3';
      const h = document.createElement(level);
      h.textContent = text(heading);
      out.push(h);
    }
    out.push(...bodyEls);
    links.forEach((a) => out.push(linkPara(document, a)));
  });

  // standalone links outside cards and topic text -> footer row(s) of the last tips block
  const footerLinks = [...element.querySelectorAll('a[href]')]
    .filter((a) => !a.closest('article, .manual-model') && text(a));
  const tail = [...out].reverse().find((n) => n.cells);
  footerLinks.forEach((a) => (tail ? tail.cells.push([linkPara(document, a)]) : out.push(linkPara(document, a))));

  const wrapper = document.createElement('div');
  out.forEach((n) => wrapper.append(n.cells
    ? WebImporter.Blocks.createBlock(document, { name: 'cards-tip', cells: n.cells })
    : n));
  element.replaceWith(wrapper);
}
