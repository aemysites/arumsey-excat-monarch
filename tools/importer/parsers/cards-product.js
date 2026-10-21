/* eslint-disable */
/* global WebImporter */

/**
 * cards-product parser.
 * Block table: one row per card; one cell per card part in display order
 * (eyebrow, image, heading + text, links). Cards in one block may have
 * different cell counts; rows are padded to the widest row.
 *
 * Variants (generic DOM cues):
 *  - benefit-tiles : .accelerator-bar tiles (heading + description)
 *  - stats         : .bubble-section tiles (lead-in, large figure heading, body)
 *  - plain         : .card-container product cards (eyebrow, image, headline,
 *                    description, CTA buttons)
 *
 * Product-card CTAs are <button>s without URLs; the primary CTA takes the
 * card's image link URL. Buttons that only open an (empty) modal are dropped.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, button').forEach((n) => n.remove());
  clone.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
  clone.removeAttribute('id');
  clone.removeAttribute('class');
  clone.removeAttribute('role');
  return clone;
}

function wrap(document, tag, source) {
  const el = document.createElement(tag);
  el.append(...cleanClone(source).childNodes);
  return el;
}

function link(document, href, text) {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.textContent = text;
  return a;
}

export default function parse(element, { document, params }) {
  const rows = [];
  let variant = null;

  const accelerators = [...element.querySelectorAll('.accelerator-bar')];
  const bubbles = [...element.querySelectorAll('.bubble-section')];
  const cards = [...element.querySelectorAll('.card-container')];

  if (accelerators.length) {
    variant = 'benefit-tiles';
    accelerators.forEach((tile) => {
      const row = [];
      const h = tile.querySelector('h1, h2, h3, h4, h5, h6');
      if (h && textOf(h)) row.push([wrap(document, 'h3', h)]);
      const desc = [...tile.querySelectorAll('.item-description')].filter((d) => textOf(d));
      if (desc.length) row.push(desc.map((d) => wrap(document, 'p', d)));
      tile.querySelectorAll('a.cds-button[href], a.cta[href]').forEach((a) => {
        row.push([link(document, a.getAttribute('href'), textOf(a))]);
      });
      if (row.length) rows.push(row);
    });
  } else if (bubbles.length) {
    variant = 'stats';
    bubbles.forEach((bubble) => {
      const row = [];
      [...bubble.children].forEach((part) => {
        if (!textOf(part)) return;
        if (/^H[1-6]$/.test(part.tagName)) {
          row.push([wrap(document, 'h3', part)]);
          return;
        }
        const content = [];
        const blockChildren = [...part.children].filter((c) => /^(P|H[1-6]|UL|OL|DIV)$/.test(c.tagName));
        if (blockChildren.length) {
          blockChildren.forEach((c) => {
            if (!textOf(c)) return;
            const tag = /^H[1-6]$/.test(c.tagName) ? 'h3' : (/^(UL|OL)$/.test(c.tagName) ? null : 'p');
            content.push(tag ? wrap(document, tag, c) : cleanClone(c));
          });
        } else {
          content.push(wrap(document, 'p', part));
        }
        if (content.length) row.push(content);
      });
      if (row.length) rows.push(row);
    });
  } else {
    cards.forEach((card) => {
      const row = [];
      const eyebrow = card.querySelector('.eyebrow');
      if (eyebrow && textOf(eyebrow)) row.push([wrap(document, 'p', eyebrow)]);

      const img = card.querySelector('img');
      const imgLink = img ? img.closest('a[href]') : null;
      if (img) {
        const out = document.createElement('img');
        // lazy-loaded images carry a data: placeholder in src and the real URL in data-src
        out.setAttribute('src', [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]]
          .find((s) => s && !/^data:/i.test(s)) || '');
        out.setAttribute('alt', (img.getAttribute('alt') || '').replace(/\s+/g, ' ').trim());
        if (out.getAttribute('src')) row.push([out]);
      }

      const body = [];
      let headlines = [...card.querySelectorAll('.headline')];
      if (!headlines.length) headlines = [...card.querySelectorAll('h1, h2, h3, h4')];
      headlines.forEach((h) => {
        if (textOf(h)) body.push(wrap(document, 'h3', h));
      });
      card.querySelectorAll('.description').forEach((d) => {
        if (textOf(d)) body.push(wrap(document, 'p', d));
      });
      if (body.length) row.push(body);

      const actions = [];
      const seen = new Set();
      card.querySelectorAll('a.cds-button[href], button.cds-button, app-reskin-cta a[href]').forEach((cta, i) => {
        const label = textOf(cleanClone(cta));
        if (!label || seen.has(label)) return;
        let href = cta.getAttribute('href');
        if (!href && cta.tagName === 'BUTTON' && /primary/.test(cta.className) && imgLink) {
          href = imgLink.getAttribute('href');
        }
        if (!href) return; // modal-only button, nothing to link to
        seen.add(label);
        actions.push(link(document, href, label));
      });
      if (actions.length) {
        const p = document.createElement('p');
        actions.forEach((a, i) => {
          if (i) p.append(' ');
          p.append(a);
        });
        row.push([p]);
      }
      if (row.length) rows.push(row);
    });
  }

  const width = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const cells = rows.map((r) => {
    const padded = [...r];
    while (padded.length < width) padded.push('');
    return padded;
  });

  const name = variant ? `cards-product (${variant})` : 'cards-product';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
