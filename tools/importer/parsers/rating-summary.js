/* eslint-disable */
/* global WebImporter */

/**
 * rating-summary parser (citi.com Zillow lender rating banner).
 *
 * Block table (see blocks/rating-summary/README.md), static parts only:
 *   one content row:
 *     cell 1 = "How this rating is calculated" link
 *     cell 2 = Zillow logo + copyright line with the Terms of Use link
 *
 * The captured score, star fill, review count and "as of" date come from a live
 * Zillow feed at runtime and are NOT imported. No endpoint row and no reviews row
 * are emitted (the block hides the score row when no endpoint is configured).
 *
 * The source links are JS placeholders ("#1", "#5"); they are kept as authored so
 * authors can point them at the final targets.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  if (!img) return '';
  const candidates = [
    img.getAttribute('src'),
    img.getAttribute('data-src'),
    (img.getAttribute('srcset') || img.getAttribute('data-srcset') || '').split(/[\s,]+/)[0],
  ];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function link(document, href, text) {
  const a = document.createElement('a');
  a.setAttribute('href', href || '#');
  a.textContent = text;
  return a;
}

/** Copy a paragraph keeping text and links only (no classes / chrome). */
function copyLine(document, src) {
  const p = document.createElement('p');
  const walk = (node, target) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        target.append(document.createTextNode(n.textContent));
        return;
      }
      if (n.nodeType !== 1 || n.matches('.sr-only, .ada-hidden, .visually-hidden, svg, img, button')) return;
      if (n.tagName === 'A') {
        if (textOf(n)) target.append(link(document, (n.getAttribute('href') || '').trim(), textOf(n)));
        return;
      }
      if (/^(B|STRONG|EM|I|SUP|SUB)$/.test(n.tagName)) {
        const el = document.createElement(n.tagName.toLowerCase());
        walk(n, el);
        if (textOf(el)) target.append(el);
        return;
      }
      walk(n, target);
    });
  };
  walk(src, p);
  p.innerHTML = p.innerHTML.replace(/\s+/g, ' ').trim();
  return p;
}

export default function parse(element, { document, params }) {
  // cell 1: "How this rating is calculated" link
  const calcSrc = [...element.querySelectorAll('a, button')]
    .find((a) => /how this rating|rating is calculated/i.test(textOf(a)))
    || element.querySelector('.zillow-link');
  const cell1 = [];
  if (calcSrc) {
    const p = document.createElement('p');
    p.append(link(document, calcSrc.tagName === 'A' ? (calcSrc.getAttribute('href') || '').trim() : '#', textOf(calcSrc)));
    cell1.push(p);
  }

  // cell 2: Zillow logo + copyright line (with Terms of Use link)
  const cell2 = [];
  const copyrightSection = element.querySelector('.zillow-copyright-section') || element;
  const logo = [...copyrightSection.querySelectorAll('img')]
    .find((i) => /zillow/i.test(`${i.getAttribute('alt') || ''} ${imgSrc(i)}`) && !/star/i.test(imgSrc(i)));
  if (logo) {
    const img = document.createElement('img');
    img.setAttribute('src', imgSrc(logo));
    img.setAttribute('alt', (logo.getAttribute('alt') || 'Zillow Logo').trim());
    const p = document.createElement('p');
    p.append(img);
    cell2.push(p);
  }
  const copyright = element.querySelector('.zillow-copyright p, .zillow-copyright')
    || [...element.querySelectorAll('p')].find((p) => /zillow,? inc|terms of use|©/i.test(textOf(p)));
  if (copyright && textOf(copyright)) cell2.push(copyLine(document, copyright));

  const cells = [];
  if (cell1.length || cell2.length) cells.push([cell1.length ? cell1 : '', cell2.length ? cell2 : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'rating-summary', cells });
  element.replaceWith(block);
}
