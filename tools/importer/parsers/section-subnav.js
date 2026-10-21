/* eslint-disable */
/* global WebImporter */

/**
 * section-subnav parser.
 *
 * Block table (see blocks/section-subnav/README.md): one or more rows; each cell in a
 * row is a column. A picture-only cell is a media column; any other cell is a text
 * column (heading, text, lists, links) whose leading picture paragraph is its icon.
 *
 * Column detection (one parser for every source layout):
 *   1. media layout - exactly one content image next to headed copy (app-banner,
 *      tds-feature, card-list-dual-col): [media cell, text cell] in document order.
 *   2. repeating units - descend through single-content wrappers until a node has
 *      2+ similar block-level children with content (tds-benefit, .tile-container,
 *      cds-column, .col-size, .rw-content, .card-mod__container-box, ...); each is a column.
 *   3. otherwise the whole element is one text column.
 *   More than 4 columns are split into rows of 3 (padded with empty cells).
 *
 * Variants (generic cues):
 *   media-feature - layout 1 (one content image + heading)
 *   light-2       - inverted (light-on-dark) icon tiles (class *filter-invert*)
 *   light         - CTA-only row with a primary button and no headings / images
 *   plain         - everything else
 * dark-promo cannot be told apart from media-feature in the DOM (the dark band comes
 * from a page-level theme), so those instances fall back to media-feature.
 *
 * Sprite-sheet icons (img.sprite-image) are dropped: they are CSS-cropped sheets, not
 * standalone icons. Footnote anchors inside <sup> are unwrapped to text; stand-alone
 * JS-only CTAs (href "#", "javascript:", "null") are kept as links to "#".
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanHref(href) {
  const h = (href || '').trim();
  if (!h || h === 'null' || h === 'undefined' || /^javascript:/i.test(h)) return '#';
  return h;
}

function isRealHref(href) {
  const h = cleanHref(href);
  return h !== '#' && !h.startsWith('#');
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

function isContentImg(img) {
  if (!imgSrc(img)) return false;
  if (/sprite/i.test(`${img.getAttribute('class') || ''} ${imgSrc(img)}`)) return false;
  return true;
}

function makeImg(document, img) {
  const n = document.createElement('img');
  n.setAttribute('src', imgSrc(img));
  const alt = (img.getAttribute('alt') || '').trim();
  n.setAttribute('alt', alt === 'null' ? '' : alt);
  return n;
}

const SKIP = 'script, style, svg, cds-icon, citi-icon2, citi-modal, cds-modal-dialog, [role="dialog"], .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, input, select, textarea, noscript, template';
const BLOCKISH = 'h1, h2, h3, h4, h5, h6, p, ul, ol, div, section, article, table, img, picture, li';

function hasContent(el) {
  return !!(textOf(el) || [...el.querySelectorAll('img')].some(isContentImg) || (el.tagName === 'IMG' && isContentImg(el)));
}

/** Inline copy: keep text, formatting and real links; unwrap footnote/JS anchors. */
function inlineClone(document, el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(`${SKIP}, img, picture, button`).forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = cleanHref(a.getAttribute('href'));
    // footnote references (in <sup> / .foot-note) without a real target -> plain text;
    // other in-page / JS-only anchors stay links ("#..." kept, JS -> "#")
    const footnote = a.closest('sup') || /foot-?note/i.test(a.getAttribute('class') || '');
    if (!isRealHref(href) && footnote) { a.replaceWith(...a.childNodes); return; }
    a.setAttribute('href', href);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name !== 'href') n.removeAttribute(a.name); });
  });
  // unwrap layout wrappers and framework custom elements (e.g. <app-image>)
  clone.querySelectorAll('span, div, font').forEach((n) => n.replaceWith(...n.childNodes));
  [...clone.querySelectorAll('*')].reverse().forEach((n) => {
    if (n.tagName.includes('-')) n.replaceWith(...n.childNodes);
  });
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  clone.querySelectorAll('b, strong, i, em, u, sup, sub').forEach((n) => {
    if (!n.textContent.trim()) n.remove();
  });
  return clone;
}

/** Trim leading/trailing <br> and whitespace inside an element (and its links). */
function tidy(el) {
  const edge = (pick) => {
    for (let n = pick(el); n; n = pick(el)) {
      if ((n.nodeType === 1 && n.tagName === 'BR') || (n.nodeType === 3 && !n.textContent.trim())) n.remove();
      else break;
    }
  };
  edge((e) => e.firstChild);
  edge((e) => e.lastChild);
  [el, ...el.querySelectorAll('a')].forEach((n) => {
    const f = n.firstChild;
    if (f && f.nodeType === 3) f.textContent = f.textContent.replace(/^\s+/, '');
    const l = n.lastChild;
    if (l && l.nodeType === 3) l.textContent = l.textContent.replace(/\s+$/, '');
  });
  return el;
}

function blockEl(document, tag, src) {
  const el = document.createElement(tag);
  el.append(...inlineClone(document, src).childNodes);
  return tidy(el);
}

function linkPara(document, a) {
  const label = textOf(inlineClone(document, a));
  if (!label) return null;
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.setAttribute('href', cleanHref(a.getAttribute('href')));
  link.append(...inlineClone(document, a).childNodes);
  tidy(link);
  p.append(link);
  return p;
}

/** Column content in document order; images become their own paragraphs. */
function columnContent(document, root, { skipImgs } = {}) {
  const out = [];
  const pushImg = (img) => {
    if (skipImgs || !isContentImg(img)) return;
    const p = document.createElement('p');
    p.append(makeImg(document, img));
    out.push(p);
  };
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(SKIP)) return;
      const tag = child.tagName;
      if (tag === 'IMG') { pushImg(child); return; }
      if (/^H[1-6]$/.test(tag)) {
        if (textOf(child)) out.push(blockEl(document, tag.toLowerCase(), child));
        return;
      }
      if (tag === 'P') {
        child.querySelectorAll('img').forEach(pushImg);
        if (textOf(inlineClone(document, child))) out.push(blockEl(document, 'p', child));
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        const list = document.createElement(tag.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          if (!textOf(li)) return;
          const item = document.createElement('li');
          // headed list items (h3 + description) -> bold lead-in
          const h = li.querySelector('h1, h2, h3, h4, h5, h6');
          if (h) {
            const strong = document.createElement('strong');
            strong.append(...inlineClone(document, h).childNodes);
            item.append(strong);
            const rest = li.cloneNode(true);
            rest.querySelector('h1, h2, h3, h4, h5, h6').remove();
            const restInline = inlineClone(document, rest);
            if (textOf(restInline)) item.append(document.createElement('br'), ...restInline.childNodes);
          } else {
            const links = li.querySelectorAll('a[href]');
            item.append(...inlineClone(document, li).childNodes);
            // keep nav-style links that inlineClone dropped (JS-only hrefs)
            if (!item.querySelector('a') && links.length === 1 && textOf(links[0]) === textOf(li)) {
              item.replaceChildren(linkPara(document, links[0]).firstChild);
            }
          }
          list.append(item);
        });
        if (list.children.length) out.push(list);
        return;
      }
      if (tag === 'A' || tag === 'BUTTON') {
        child.querySelectorAll('img').forEach(pushImg);
        if (tag === 'A') {
          const p = linkPara(document, child);
          if (p) out.push(p);
        } else if (textOf(child)) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.setAttribute('href', '#');
          a.textContent = textOf(child);
          p.append(a);
          out.push(p);
        }
        return;
      }
      if (tag === 'TABLE') {
        out.push(child.cloneNode(true));
        return;
      }
      const hasBlockChild = child.querySelector(BLOCKISH);
      if (!hasBlockChild) {
        if (textOf(inlineClone(document, child))) {
          const eyebrow = /eyebrow/i.test(child.getAttribute('class') || '');
          out.push(blockEl(document, 'p', child));
          if (eyebrow) { /* eyebrow kept as a plain paragraph */ }
        }
        return;
      }
      // inline run with own text next to block children (e.g. <b>text</b> + <sup>)
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (ownText && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, section, table')) {
        child.querySelectorAll('img').forEach(pushImg);
        out.push(blockEl(document, 'p', child));
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return out;
}

/** Signature used to decide whether siblings are a repeating unit. */
function sig(el) {
  const first = ((el.getAttribute('class') || '').split(/\s+/).filter((c) => c && !/^(ng-|col-|d-|p[xytblr]?-|m[xytblr]?-|w-|h-|align-|justify-|flex-|tile-\d|offset-)/.test(c))[0]) || '';
  return `${el.tagName}.${first}`;
}

const INLINE_TAGS = /^(A|SPAN|B|STRONG|I|EM|U|SUP|SUB|BUTTON|SMALL|BR|LABEL|H[1-6]|P|LI|UL|OL|IMG|PICTURE|TABLE)$/;

function findUnits(element) {
  let node = element;
  for (let depth = 0; depth < 15 && node; depth += 1) {
    const kids = [...node.children].filter((c) => !c.matches(SKIP) && hasContent(c));
    if (!kids.length) return [node];
    if (kids.length === 1) {
      if (INLINE_TAGS.test(kids[0].tagName)) return [node];
      node = kids[0];
      continue;
    }
    if (kids.some((k) => INLINE_TAGS.test(k.tagName))) return [node];
    const sigs = kids.map(sig);
    const tags = new Set(kids.map((k) => k.tagName));
    if (new Set(sigs).size === 1 || tags.size === 1) return kids;
    return [node];
  }
  return [element];
}

/** Media layout: the one content image and the copy beside it. */
function mediaLayout(document, element, img) {
  let side = img;
  while (side.parentElement && side.parentElement !== element) {
    const parent = side.parentElement;
    const others = [...parent.children].filter((c) => c !== side && !c.matches(SKIP) && textOf(c));
    if (others.length) break;
    side = parent;
  }
  const parent = side.parentElement;
  if (!parent) return null;
  const textSides = [...parent.children].filter((c) => c !== side && !c.matches(SKIP) && textOf(c));
  if (!textSides.length) return null;
  const textCell = [];
  textSides.forEach((t) => textCell.push(...columnContent(document, t)));
  if (!textCell.length) return null;
  const mediaCell = [makeImg(document, img)];
  // keep the image's position (image-left vs image-right). citi.com banners keep the image
  // first in the DOM and flip it with an `image-right` / `image-left` class, so the class wins.
  const posClass = [element, ...element.querySelectorAll('[class]')]
    .map((n) => (n.getAttribute('class') || '').match(/(?:^|\s)image-(right|left)(?:\s|$)/))
    .find(Boolean);
  // eslint-disable-next-line no-bitwise
  const imgFirst = posClass ? posClass[1] === 'left' : !!(side.compareDocumentPosition(textSides[0]) & 4);
  return imgFirst ? [mediaCell, textCell] : [textCell, mediaCell];
}

export default function parse(element, { document, params }) {
  const cells = [];
  const imgs = [...element.querySelectorAll('img')].filter(isContentImg);
  const hasHeading = !!element.querySelector('h1, h2, h3, h4, h5, h6');
  let variant = null;

  let row = null;
  if (imgs.length === 1 && hasHeading) {
    row = mediaLayout(document, element, imgs[0]);
    if (row) variant = 'media-feature';
  }

  if (!row) {
    const units = findUnits(element);
    row = units.map((u) => columnContent(document, u)).filter((c) => c.length);
  }

  if (row.length > 4) {
    const width = 3;
    for (let i = 0; i < row.length; i += width) {
      const chunk = row.slice(i, i + width);
      while (chunk.length < width) chunk.push('');
      cells.push(chunk);
    }
  } else if (row.length) {
    cells.push(row);
  }

  if (!variant) {
    const cls = [element, ...element.querySelectorAll('[class]')].map((n) => n.getAttribute('class') || '').join(' ');
    const linkText = [...element.querySelectorAll('a, button')].map(textOf).join('');
    const ctaOnly = !hasHeading && !imgs.length && linkText.replace(/\s/g, '') === textOf(element).replace(/\s/g, '')
      && !!element.querySelector('[class*="button-primary"], .btn-primary');
    if (/filter-invert/.test(cls)) variant = 'light-2';
    else if (ctaOnly) variant = 'light';
  }

  const name = variant ? `section-subnav (${variant})` : 'section-subnav';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
