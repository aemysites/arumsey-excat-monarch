/* eslint-disable */
/* global WebImporter */

/**
 * columns-key-terms parser.
 *
 * Default (key terms row, source .rates-list-item > tds-ratesfees):
 *   one row; one cell per term: label (with pricing footnote sup), value, note.
 *
 * card-picker (source tds-feature with feature-layout__left/__right sides):
 *   one row; image cell + content cell, in source order. The content cell holds
 *   eyebrow, heading, text, a list of card items (thumbnail, spotlight text,
 *   card-name link), CTAs and pricing links.
 *
 * Variants:
 *   - card-picker: tds-feature / .feature-layout markup
 *   - light: card-picker markup whose layout has a transparent content
 *     background (--content-bg: rgba(0, 0, 0, 0)); emitted as
 *     'card-picker, light' because the decorator only builds the card list
 *     for .card-picker.
 */

const CHROME = 'script, style, svg, cds-icon, button, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function makeImg(document, img) {
  const src = img && imgSrc(img);
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
  return out;
}

/** Clone inline content, dropping chrome and attributes (links keep href). */
function inline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('img').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('div, p, span:not([class])').forEach((n) => {
    if (n.tagName !== 'SPAN') n.replaceWith(...n.childNodes);
  });
  clone.querySelectorAll('span').forEach((n) => n.replaceWith(...n.childNodes));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes].filter((n) => n.nodeType !== 8);
}

function wrap(document, tag, el) {
  if (!el || !textOf(el)) return null;
  const out = document.createElement(tag);
  out.append(...inline(el));
  return textOf(out) ? out : null;
}

function keyTerms(document, element) {
  let terms = [...element.querySelectorAll('tds-ratesfees')];
  if (!terms.length) terms = [...element.querySelectorAll('.rates-fees-item')];
  if (!terms.length) terms = [...element.children];
  return terms.map((term) => {
    const cell = [];
    const label = term.querySelector('.eyebrow');
    const value = term.querySelector('.text');
    const note = term.querySelector('.description');
    const l = wrap(document, 'p', label);
    if (l) cell.push(l);
    const v = wrap(document, 'p', value);
    if (v) {
      const strong = document.createElement('strong');
      strong.append(...v.childNodes);
      v.append(strong);
      cell.push(v);
    }
    const n = wrap(document, 'p', note);
    if (n) cell.push(n);
    if (!cell.length) {
      const p = wrap(document, 'p', term);
      if (p) cell.push(p);
    }
    return cell;
  }).filter((c) => c.length);
}

function cardItem(document, item) {
  const li = document.createElement('li');
  const img = makeImg(document, item.querySelector('img'));
  if (img) li.append(img);
  const spot = item.querySelector('.spotlight');
  if (spot && textOf(spot)) {
    li.append(...inline(spot));
    li.append(document.createElement('br'));
  }
  const a = item.querySelector('a[href]');
  if (a) {
    const strong = document.createElement('strong');
    const link = document.createElement('a');
    link.setAttribute('href', a.getAttribute('href'));
    link.append(...inline(a));
    strong.append(link);
    li.append(strong);
  } else {
    const name = item.querySelector('.cardname, h3, h4');
    if (name) li.append(...inline(name));
  }
  return textOf(li) ? li : null;
}

function contentCell(document, side) {
  const out = [];
  const seen = new Set();
  const items = [...side.querySelectorAll('tds-card-item, .card-item')]
    .filter((n, i, all) => !all.some((o, j) => j !== i && o.contains(n)));
  let list = null;
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (seen.has(child)) return;
      if (child.matches(CHROME)) return;
      if (items.includes(child)) {
        if (!list) {
          list = document.createElement('ul');
          out.push(list);
        }
        const li = cardItem(document, child);
        if (li) list.append(li);
        return;
      }
      if (/^H[1-6]$/.test(child.tagName)) {
        const h = wrap(document, child.tagName.toLowerCase(), child);
        if (h) out.push(h);
        return;
      }
      if (child.matches('ul, ol')) {
        // pricing / footer links
        const ul = document.createElement(child.tagName.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          const a = li.querySelector('a[href]');
          if (!a) return; // "Additional Information +" toggles have no URL
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.setAttribute('href', a.getAttribute('href'));
          link.append(...inline(a));
          item.append(link);
          ul.append(item);
        });
        if (ul.children.length) out.push(ul);
        return;
      }
      if (child.matches('a[href]')) {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.setAttribute('href', child.getAttribute('href'));
        link.append(...inline(child));
        if (!textOf(link)) return;
        p.append(link);
        out.push(p);
        return;
      }
      if (child.tagName === 'IMG') {
        const img = makeImg(document, child);
        if (img) {
          const p = document.createElement('p');
          p.append(img);
          out.push(p);
        }
        return;
      }
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const onlyLinks = !ownText && [...child.children].every((c) => c.matches('a[href]'));
      const isTextRun = !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, img, div, tds-card-item') && !onlyLinks && textOf(child);
      if (child.matches('p') || isTextRun) {
        const p = wrap(document, 'p', child);
        if (p) out.push(p);
        return;
      }
      walk(child);
    });
  };
  walk(side);
  return out;
}

function cardPicker(document, element) {
  let sides = [...element.querySelectorAll('.feature-layout__left, .feature-layout__right')]
    .filter((n, i, all) => !all.some((o, j) => j !== i && o.contains(n)));
  if (!sides.length) sides = [element];
  return sides.map((side) => {
    const imgs = [...side.querySelectorAll('img')];
    if (!textOf(side) && imgs.length) {
      const img = makeImg(document, imgs[0]);
      return img ? [img] : [];
    }
    return contentCell(document, side);
  }).filter((c) => c.length);
}

export default function parse(element, { document, params }) {
  const isPicker = element.matches('tds-feature') || !!element.querySelector('tds-feature-layout, .feature-layout');
  let variant = null;
  let row;
  if (isPicker) {
    row = cardPicker(document, element);
    const layout = element.querySelector('[style*="--content-bg"]');
    const bg = layout ? (layout.getAttribute('style').match(/--content-bg:\s*([^;]+)/) || [])[1] || '' : '';
    const transparent = /rgba\([^)]*,\s*0\)|transparent/i.test(bg);
    variant = transparent ? 'card-picker, light' : 'card-picker';
  } else {
    row = keyTerms(document, element);
  }
  const cells = row.length ? [row] : [];
  const name = variant ? `columns-key-terms (${variant})` : 'columns-key-terms';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
