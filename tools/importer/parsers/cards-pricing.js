/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-pricing
 * Source: ul.category-card_container-v2 cards (div.card-v2), optionally with a
 *   ribbon (div.card-ribbon-v2) above the card. Root may be the section or an
 *   experience-fragment wrapper (div.xf-content-height).
 * Layout (blocks/cards-pricing/README.md): one row per plan card:
 *   [tab label (ribbon, optional) | body]
 *   body = heading, description, feature list, "Starting at", price, fee notes, buttons/links.
 * Variant: `centered` when the cards use the centred layout (category-card-center).
 * JS-only <button>s (no URL on the source) become "#" links so they keep rendering as CTAs.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(root) {
  root.querySelectorAll('svg, span.reader, span.spacer, span.hide, span.arrow-wrap, input, script, style, link, noscript, meta').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else p.append(content);
  return p;
}

/**
 * Price paragraph keeping the struck-through old price:
 * <del>$50</del>$40 -> <p><del>$50</del> $40</p> (no stray currency text).
 */
function priceParagraph(document, el) {
  const p = document.createElement('p');
  const dels = [...el.querySelectorAll('del, s, strike')];
  if (!dels.length) {
    p.textContent = text(el);
    return p;
  }
  dels.forEach((d) => {
    const del = document.createElement('del');
    del.textContent = text(d);
    if (p.childNodes.length) p.append(' ');
    p.append(del);
  });
  const clone = el.cloneNode(true);
  clone.querySelectorAll('del, s, strike').forEach((d) => d.remove());
  const current = text(clone);
  if (current) p.append(` ${current}`);
  return p;
}

function ctaParagraphs(document, container) {
  const out = [];
  [...container.querySelectorAll('a, button')].filter((c) => text(c)).forEach((c) => {
    const link = document.createElement('a');
    link.href = (c.tagName === 'A' && c.getAttribute('href')) || '#';
    link.textContent = text(c);
    if (c.classList.contains('btn') || c.tagName === 'BUTTON') {
      const strong = document.createElement('strong');
      strong.append(link);
      out.push(para(document, strong));
    } else {
      out.push(para(document, link));
    }
  });
  return out;
}

export default function parse(element, { document }) {
  cleanInline(element);
  element.querySelectorAll('h1 br, h2 br, h3 br, h4 br, h5 br').forEach((br) => br.replaceWith(' '));
  const cells = [];

  const cards = [...element.querySelectorAll('div.card-v2')];
  cards.forEach((card) => {
    const col = card.closest('li.column') || card.parentElement;
    // every column carries the ribbon markup; .hide-ribbon hides it on the others
    const ribbon = col && !col.closest('.hide-ribbon') ? col.querySelector('.card-ribbon-v2') : null;
    const tab = ribbon && text(ribbon) ? text(ribbon) : '';

    const body = [];
    const head = card.querySelector('.card-head') || card;

    // heading(s)
    const headings = [...head.querySelectorAll('h1, h2, h3, h4, h5')];
    // tier label (h3.product-label, 14px) above a subhead heading (24px): the
    // label is the block eyebrow (text before the first heading), the subhead the heading
    const label = headings.find((h) => h.matches('.product-label'));
    const subhead = label ? headings.find((h) => h !== label && h.closest('.subhead')) : null;
    if (label && subhead) {
      body.push(para(document, text(label)));
      headings.splice(0, headings.length, subhead, ...headings.filter((h) => h !== label && h !== subhead));
    }
    if (headings.length) {
      const main = headings[0];
      const h = document.createElement(/^H[1-6]$/.test(main.tagName) ? main.tagName.toLowerCase() : 'h3');
      const a = main.querySelector('a[href]');
      if (a) {
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = text(main);
        h.append(link);
      } else {
        h.textContent = text(main);
      }
      body.push(h);
      headings.slice(1).forEach((sub) => { if (text(sub)) body.push(para(document, text(sub))); });
    }

    // description paragraphs
    head.querySelectorAll(':scope > p, :scope > div:not(.card-center-head) > p').forEach((p) => {
      if (text(p)) body.push(p);
    });
    // centred cards keep their qualifier line ("~52% of filers qualify") in the
    // centre head; it belongs in the text cell under the heading
    head.querySelectorAll(':scope > div.card-center-head > p').forEach((p) => {
      const t = text(p);
      if (t && !body.some((b) => text(b) === t)) body.push(p);
    });

    // feature list
    const list = head.querySelector('ul');
    if (list) {
      const ul = document.createElement('ul');
      [...list.children].forEach((li) => {
        if (!text(li)) return;
        const item = document.createElement('li');
        const holder = [...li.querySelectorAll(':scope > span')].find((sp) => text(sp)) || li;
        item.append(...[...holder.childNodes]);
        ul.append(item);
      });
      if (ul.children.length) body.push(ul);
    }

    // pricing
    const footer = card.querySelector('.card-footer') || card;
    const priceSection = footer.querySelector('.card-price-section');
    if (priceSection) {
      const label = priceSection.querySelector('.copy-small');
      if (text(label)) body.push(para(document, text(label)));
      const price = priceSection.querySelector('strong, .price');
      if (text(price)) body.push(priceParagraph(document, price));
    }
    footer.querySelectorAll('.state-adnl, .pricingtext').forEach((note) => {
      if (note.matches('.pricingtext') && note.closest('.state-adnl')) return;
      // one paragraph per source line: "+ $0 state additional for paid products<br>*simple
      // returns only" is the fee line and its fine print
      const clone = note.cloneNode(true);
      clone.querySelectorAll('br').forEach((br) => br.replaceWith('\u0001'));
      clone.textContent.replace(/\s+/g, ' ').split('\u0001').map((l) => l.trim()).filter(Boolean)
        .forEach((line) => body.push(para(document, line)));
    });

    // buttons / links
    const actions = footer.querySelector('.btn-container') || footer.querySelector(':scope > div.flex-column');
    if (actions) body.push(...ctaParagraphs(document, actions));
    else {
      footer.querySelectorAll('a.btn, button.btn').forEach((b) => body.push(...ctaParagraphs(document, b.parentElement)));
    }

    // disclaimers inside the card
    card.querySelectorAll('[class*="disclaimer_max_width"] p').forEach((p) => { if (text(p)) body.push(p); });

    if (body.length) cells.push([tab, body]);
  });

  const centered = cards.length > 0 && cards.some((c) => c.classList.contains('category-card-center'));
  const name = centered ? 'cards-pricing (centered)' : 'cards-pricing';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
