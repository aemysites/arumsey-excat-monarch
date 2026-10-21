/* eslint-disable */
/* global WebImporter */

/**
 * cta-banner parser.
 * Block table:
 *   [optional] row 1: background image only (from an inline background-image url)
 *   row 2: [optional image cell] | copy cell (heading/text) | CTA cell (link-only paragraphs)
 *
 * Source families: app-banner callout (section.banner with headsection + buttonsection),
 * promo banner (.bannerContainer > .item x3), gradient calculator header (spans).
 *
 * Variants:
 *  - light: gradient/tinted header panels (.cds-gradient-*)
 *  - null: everything else (background colour comes from the section style)
 *
 * Speed-bump links (#modal:speedbump:<url>) are unwrapped to their target URL.
 * Buttons without a URL (JS-driven "Request a call") cannot be represented as a
 * link and are dropped.
 */

const CHROME = 'script, style, svg, cds-icon, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0], img.getAttribute('data-desktop-src')];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function bgUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/background-image:\s*url\((['"]?|&quot;)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

function realHref(href) {
  const h = (href || '').trim();
  const bump = h.match(/^#modal:speedbump:(.+)$/i);
  if (bump) return bump[1];
  if (!h || /^javascript:/i.test(h)) return '';
  return h;
}

function inline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('img, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = realHref(a.getAttribute('href'));
    if (!href) a.replaceWith(...a.childNodes);
    else a.setAttribute('href', href);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('div, p, span, section, u').forEach((n) => n.replaceWith(...n.childNodes));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes];
}

function wrap(document, tag, el) {
  if (!el || !textOf(el)) return null;
  const out = document.createElement(tag);
  out.append(...inline(el));
  return textOf(out) ? out : null;
}

function ctaP(document, a) {
  const href = realHref(a.getAttribute('href'));
  if (!href) return null;
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.append(...inline(a));
  if (!textOf(link)) return null;
  const p = document.createElement('p');
  p.append(link);
  return p;
}

/** Copy content (headings, paragraphs, lists) from a subtree, document order. */
function copyOf(document, root, skip) {
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (skip.includes(child) || child.matches(CHROME) || child.matches('button, img')) return;
      if (/^H[1-6]$/.test(child.tagName)) {
        const h = wrap(document, child.tagName.toLowerCase(), child);
        if (h) out.push(h);
        return;
      }
      if (child.matches('ul, ol')) {
        if (!textOf(child)) return;
        const list = document.createElement(child.tagName.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          const item = document.createElement('li');
          item.append(...inline(li));
          list.append(item);
        });
        out.push(list);
        return;
      }
      if (child.matches('p') || (textOf(child) && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, img'))) {
        const p = wrap(document, 'p', child);
        if (p) out.push(p);
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];

  // background image row
  const bgEl = [element, ...element.querySelectorAll('[style*="background-image"]')].find((n) => bgUrl(n));
  if (bgEl) {
    const img = document.createElement('img');
    img.setAttribute('src', bgUrl(bgEl));
    img.setAttribute('alt', '');
    cells.push([img]);
  }

  // CTAs: dedicated button sections first, otherwise button-styled links
  let ctaRoots = [...element.querySelectorAll('.banner__content-buttonsection, .tile-btn, .cta-wrapper')];
  let ctaLinks;
  if (ctaRoots.length) {
    ctaLinks = ctaRoots.flatMap((r) => [...r.querySelectorAll('a[href]')]);
  } else {
    ctaLinks = [...element.querySelectorAll('a.btn[href], a.cds-button[href], a[class*="Btn"][href]')];
    ctaRoots = ctaLinks.map((a) => {
      // the CTA's own column when it holds nothing else
      const col = a.parentElement;
      return col && col !== element && textOf(col) === textOf(a) ? col : a;
    });
  }
  const ctaCell = ctaLinks.map((a) => ctaP(document, a)).filter(Boolean);

  // product image (not the background)
  const imgs = [...element.querySelectorAll('img')].filter((i) => imgSrc(i) && !ctaRoots.some((r) => r.contains(i)));
  let imageCell = null;
  if (imgs.length) {
    const img = document.createElement('img');
    img.setAttribute('src', imgSrc(imgs[0]));
    img.setAttribute('alt', (imgs[0].getAttribute('alt') || '').trim());
    imageCell = [img];
  }

  // copy
  let copy = copyOf(document, element, ctaRoots);
  if (!copy.length) {
    // bare text spans (e.g. gradient header): first span is the lead line. The importer's
    // preprocessing unwraps attribute-less spans, leaving sibling text nodes: treat each
    // direct text node as one span.
    let spans = [...element.querySelectorAll('span')].filter((s) => textOf(s) && !s.querySelector('span'));
    if (!spans.length) {
      spans = [...element.childNodes].filter((n) => n.nodeType === 3 && textOf(n)).map((n) => {
        const s = document.createElement('span');
        s.textContent = textOf(n);
        return s;
      });
    }
    copy = spans.map((s, i) => {
      const p = document.createElement('p');
      if (i === 0 && spans.length > 1) {
        const strong = document.createElement('strong');
        strong.append(...inline(s));
        p.append(strong);
      } else {
        p.append(...inline(s));
      }
      return p;
    });
  }
  // the copy walk sees spans of multi-span headers as one run: split them
  if (copy.length === 1 && !element.querySelector('h1, h2, h3, h4, h5, h6, p')) {
    const spans = [...element.querySelectorAll(':scope > span')].filter((s) => textOf(s));
    if (spans.length > 1) {
      copy = spans.map((s, i) => {
        const p = document.createElement('p');
        if (i === 0) {
          const strong = document.createElement('strong');
          strong.append(...inline(s));
          p.append(strong);
        } else {
          p.append(...inline(s));
        }
        return p;
      });
    }
  }

  const row = [];
  if (imageCell) row.push(imageCell);
  if (copy.length) row.push(copy);
  if (ctaCell.length) row.push(ctaCell);
  if (row.length) cells.push(row);
  else if (cells.length) cells.pop(); // background alone is not a banner

  const variant = element.matches('[class*="cds-gradient"]') || element.querySelector('[class*="cds-gradient"]') ? 'light' : null;
  const name = variant ? `cta-banner (${variant})` : 'cta-banner';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
