/* eslint-disable */
/* global WebImporter */

/**
 * cards-icon parser.
 * Block table: one row per item -> [icon cell (optional)], [label + supporting text].
 *
 * Source families (detected from generic DOM cues):
 *  - quick-nav        : a.lob-link items (LOB quick links menu)
 *  - icon-beside-label: .citi-icon-text-tile items (AEM icon text tiles)
 *  - card-cross-sell  : .bt-card-item items (card art + card name link)
 *  - grid / alt       : tds-benefit items (>= 4 items -> grid, else alt)
 *  - plain            : .benefitcards__contentbox-boxmodel items (benefit cards)
 *
 * Icons drawn with inline SVG or CSS data-URI backgrounds have no hosted
 * asset and are omitted; hosted <img> icons are kept.
 */

function hostedImg(root, document) {
  if (!root) return null;
  const img = root.querySelector('img');
  if (!img) return null;
  // lazy-loaded images carry a data: placeholder in src and the real URL in data-src
  const src = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]]
    .find((s) => s && !/^data:/i.test(s)) || '';
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
  return out;
}

/** Clone an element's content, unwrapping anchors that have no href (footnote JS links). */
function cleanClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
  clone.querySelectorAll('svg, button, [aria-hidden="true"]:empty').forEach((n) => n.remove());
  clone.removeAttribute('id');
  clone.removeAttribute('class');
  clone.removeAttribute('role');
  return clone;
}

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function para(document, children) {
  const p = document.createElement('p');
  children.forEach((c) => p.append(c));
  return p;
}

function pushRow(cells, icon, content) {
  const filtered = content.filter((c) => c && textOf(c));
  if (!filtered.length && !icon) return;
  if (icon) cells.push([icon, filtered]);
  else cells.push([filtered]);
}

export default function parse(element, { document, params }) {
  const cells = [];
  let variant = null;
  const before = [];
  const after = [];

  const lobLinks = [...element.querySelectorAll('a.lob-link')];
  const iconTiles = [...element.querySelectorAll('.citi-icon-text-tile')];
  const btItems = [...element.querySelectorAll('.bt-card-item')];
  const benefits = [...element.querySelectorAll('tds-benefit')];
  const boxModels = [...element.querySelectorAll('.benefitcards__contentbox-boxmodel')]
    .filter((b) => !b.closest('.benefitcards__mobilevariation, .slide'));

  if (lobLinks.length) {
    variant = 'quick-nav';
    lobLinks.forEach((a) => {
      const full = a.querySelector('.lob-text-full');
      const label = textOf(full) || (a.getAttribute('aria-label') || '').trim() || textOf(a);
      if (!label) return;
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href') || '');
      link.textContent = label;
      cells.push([[para(document, [link])]]);
    });
  } else if (iconTiles.length) {
    variant = 'icon-beside-label';
    iconTiles.forEach((tile) => {
      const icon = hostedImg(tile.querySelector('.citi-icon-text-tile__image-wrapper') || tile, document);
      const heading = tile.querySelector('.citi-icon-text-tile-heading');
      const desc = tile.querySelector('.citi-icon-text-tile-description');
      const content = [];
      if (heading) {
        const inner = heading.querySelector('p, h1, h2, h3, h4, h5, h6');
        const h = document.createElement('p');
        const strong = document.createElement('strong');
        strong.append(...cleanClone(inner || heading).childNodes);
        h.append(strong);
        content.push(h);
      }
      if (desc && textOf(desc)) {
        const blocks = [...desc.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
        if (blocks.length) blocks.forEach((b) => content.push(cleanClone(b)));
        else content.push(para(document, [...cleanClone(desc).childNodes]));
      }
      pushRow(cells, icon, content);
    });
  } else if (btItems.length) {
    variant = 'card-cross-sell';
    const heading = element.querySelector('h1, h2, h3, h4');
    if (heading && !btItems.some((i) => i.contains(heading))) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.append(...cleanClone(heading).childNodes);
      before.push(h);
    }
    btItems.forEach((item) => {
      const a = item.querySelector('a[href]');
      const icon = hostedImg(item, document);
      const label = textOf(item.querySelector('.bt-card-text')) || (a && a.getAttribute('aria-label')) || textOf(item);
      if (!label) return;
      let labelNode;
      if (a) {
        labelNode = document.createElement('a');
        labelNode.setAttribute('href', a.getAttribute('href'));
        labelNode.textContent = label;
      } else {
        labelNode = document.createTextNode(label);
      }
      pushRow(cells, icon, [para(document, [labelNode])]);
    });
    element.querySelectorAll('a.cds-button[href], tds-cta-section a[href]').forEach((cta) => {
      if (btItems.some((i) => i.contains(cta))) return;
      const text = textOf(cta);
      if (!text || after.some((p) => textOf(p) === text)) return;
      const link = document.createElement('a');
      link.setAttribute('href', cta.getAttribute('href'));
      link.textContent = text;
      after.push(para(document, [link]));
    });
  } else if (benefits.length) {
    variant = benefits.length >= 4 ? 'grid' : 'alt';
    benefits.forEach((b) => {
      const icon = hostedImg(b.querySelector('.benefit-icon-container'), document);
      const content = [];
      const h = b.querySelector('.benefit-header h1, .benefit-header h2, .benefit-header h3, .benefit-header h4, .item-heading');
      if (h) {
        const heading = document.createElement('h3');
        heading.append(...cleanClone(h).childNodes);
        content.push(heading);
      }
      b.querySelectorAll('.benefit-description').forEach((d) => {
        const p = document.createElement('p');
        p.append(...cleanClone(d).childNodes);
        content.push(p);
      });
      b.querySelectorAll('.text-container a.cds-button[href], .text-container a.cta[href]').forEach((a) => {
        const link = document.createElement('a');
        link.setAttribute('href', a.getAttribute('href'));
        link.textContent = textOf(a);
        content.push(para(document, [link]));
      });
      pushRow(cells, icon, content);
    });
  } else if (boxModels.length) {
    variant = null;
    boxModels.forEach((box) => {
      const icon = hostedImg(box, document);
      const content = [];
      const headings = [...box.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      if (!headings.length) {
        // header text without a heading tag
        headings.push(...[...box.querySelectorAll('[class*="boxmodel-header"]')].filter((h) => textOf(h)));
      }
      headings.forEach((h) => {
        const heading = document.createElement('h3');
        heading.append(...cleanClone(h).childNodes);
        content.push(heading);
      });
      box.querySelectorAll('.boxmodel-description').forEach((d) => {
        const blocks = [...d.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
        if (blocks.length) blocks.forEach((x) => content.push(cleanClone(x)));
        else if (textOf(d)) content.push(para(document, [...cleanClone(d).childNodes]));
      });
      box.querySelectorAll('a[href]').forEach((a) => {
        if (a.closest('.boxmodel-description, h1, h2, h3, h4, h5, h6')) return;
        const link = document.createElement('a');
        link.setAttribute('href', a.getAttribute('href'));
        link.textContent = textOf(a);
        content.push(para(document, [link]));
      });
      pushRow(cells, icon, content);
    });
  } else {
    // Generic fallback: list items or direct children with heading/text.
    const items = [...element.querySelectorAll('li')].length
      ? [...element.querySelectorAll('li')]
      : [...element.children];
    items.forEach((item) => {
      const icon = hostedImg(item, document);
      const content = [];
      item.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((n) => content.push(cleanClone(n)));
      if (!content.length && textOf(item)) content.push(para(document, [...cleanClone(item).childNodes]));
      pushRow(cells, icon, content);
    });
  }

  const name = variant ? `cards-icon (${variant})` : 'cards-icon';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  before.forEach((n) => element.before(n));
  after.reverse().forEach((n) => element.after(n));
  element.replaceWith(block);
}
