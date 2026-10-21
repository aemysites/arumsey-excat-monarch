/* eslint-disable */
/* global WebImporter */

/**
 * cards-teaser parser.
 * Block table: one row per card -> [image] [heading, text, CTA paragraph (one link)].
 * Source: carousel slide track of app-banner / section.banner teasers. Cards are
 * de-duplicated (carousel clones) by heading + CTA URL.
 * Only the plain variant occurs in the source (no topic tags, no light-blue cue).
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.sr-only, .visually-hidden, .cdk-visually-hidden, svg, button').forEach((n) => n.remove());
  // in-page footnote anchors and script links: keep the text only
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.removeAttribute('id');
  clone.removeAttribute('class');
  return clone;
}

function wrap(document, tag, source) {
  const el = document.createElement(tag);
  el.append(...cleanClone(source).childNodes);
  return el;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const seen = new Set();

  let cards = [...element.querySelectorAll('section.banner, .banner__container')];
  cards = cards.filter((c, i) => !cards.some((o, j) => j !== i && o.contains(c)));
  if (!cards.length) cards = [...element.querySelectorAll('app-banner')];
  cards = cards.filter((c) => !c.closest('.slide.clone, .slide-clone, [class*="cloned"]'));

  cards.forEach((card) => {
    const img = card.querySelector('.banner__image img, img');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    const ctaSrc = card.querySelector('.banner__content-buttonsection a[href], a.cds-button[href]');
    const key = `${textOf(heading)}|${ctaSrc ? ctaSrc.getAttribute('href') : ''}`;
    if (seen.has(key)) return;
    seen.add(key);

    const imageCell = [];
    // lazy-loaded images carry a data: placeholder in src and the real URL in data-src
    const src = img ? [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]]
      .find((s) => s && !/^data:/i.test(s)) : '';
    if (src) {
      const out = document.createElement('img');
      out.setAttribute('src', src);
      out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
      imageCell.push(out);
    }

    const body = [];
    if (heading && textOf(heading)) body.push(wrap(document, 'h3', heading));
    card.querySelectorAll('.description').forEach((d) => {
      const paras = [...d.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
      if (paras.length) paras.forEach((p) => { if (textOf(p)) body.push(cleanClone(p)); });
      else if (textOf(d)) body.push(wrap(document, 'p', d));
    });
    if (ctaSrc && textOf(ctaSrc)) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', ctaSrc.getAttribute('href'));
      a.textContent = textOf(ctaSrc);
      p.append(a);
      body.push(p);
    }

    if (!imageCell.length && !body.length) return;
    cells.push([imageCell.length ? imageCell : '', body.length ? body : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
