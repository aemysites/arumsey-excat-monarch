/* eslint-disable */
/* global WebImporter */

/**
 * hero-chevron parser.
 * Block table (blocks/hero-chevron/README.md):
 *   copy row: copy cell + photo cell (source side order; photo usually right)
 *     copy cell: eyebrow <p>, heading, text, optional list, CTA link paragraphs
 *   further rows: product-details strip, one cell per column
 *
 * Source families:
 *   app-hero .hero__background (hero__text + hero__image columns)
 *   hero-mod (tds-hero-banner / cds-right-image: hero-copy-container + hero-image-container)
 *   aem-right-image (copy + CSS background-image photo)
 *   AEM banner (.banner__headline + .banner__card-details image)
 *   hero-card product-details strip (.cross-link-card columns, no copy/photo)
 *
 * Variants (generic cues):
 *   rounded-image-product-details: only product-detail columns (.cross-link-card), no photo
 *   image: the photo is a CSS background-image
 *   rounded-image: AEM banner with a card-details image (.banner__card-details)
 *   rounded-image-chevron-photo: hero-mod rates hero (.rates-hero) with an <img> photo
 *   dark: .hero__background heroes whose CTAs are links (or absent)
 *   null: .hero__background heroes with button CTAs, other hero-mod heroes
 * dark vs null is not a colour cue in the DOM; the CTA-type split matches the
 * catalog grouping and is a heuristic.
 *
 * The eyebrow stays an h1 when it is the source h1 (the block styles an h1
 * followed by the main heading as the eyebrow); other eyebrows become a
 * paragraph before the heading. CTAs without a URL (JS buttons, javascript:void(0) links) are dropped.
 * Dropdown option labels (account-type chooser) become a list.
 */

const CHROME = 'script, style, noscript, svg, cds-icon, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, .lto-ribbon, .ribbon-empty';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function realHref(href) {
  const h = (href || '').trim();
  if (!h || h === '#' || /^javascript:/i.test(h)) return '';
  return h;
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0], img.getAttribute('data-desktop-src')];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function makeImg(document, src, alt) {
  if (!src) return null;
  const img = document.createElement('img');
  img.setAttribute('src', src);
  const a = (alt || '').trim();
  img.setAttribute('alt', /^(image|hero image)$/i.test(a) ? '' : a);
  return img;
}

function bgUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/background-image:\s*url\((['"]?|&quot;)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

function inline(el, keepImgs) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll(keepImgs ? 'button' : 'img, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    if (!realHref(a.getAttribute('href'))) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target', 'src', 'alt'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('img').forEach((img) => {
    if (!img.getAttribute('src') || /^data:/i.test(img.getAttribute('src'))) img.remove();
  });
  clone.querySelectorAll('div, p, span, section, u, h1, h2, h3, h4, h5, h6').forEach((n) => n.replaceWith(...n.childNodes));
  // nested sup (<sup><a><sup>5</sup></a></sup>) collapses to one level
  clone.querySelectorAll('sup sup').forEach((n) => n.replaceWith(...n.childNodes));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes];
}

function wrap(document, tag, el, keepImgs) {
  if (!el || !textOf(el)) return null;
  const out = document.createElement(tag);
  out.append(...inline(el, keepImgs));
  return textOf(out) ? out : null;
}

/** Copy content of a hero text column, in document order. */
function readCopy(document, root, photoRoots) {
  const out = [];
  let sawHeading = false;
  let sawEyebrow = false;
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(CHROME) || photoRoots.some((p) => p === child)) return;
      if (child.matches('[role="combobox"], cds-dropdown2, select, .cds-dropdown2')) {
        const options = [...child.querySelectorAll('[role="option"], option')].map(textOf).filter(Boolean);
        if (options.length) {
          const ul = document.createElement('ul');
          [...child.querySelectorAll('[role="option"], option')].forEach((o) => {
            if (!textOf(o)) return;
            const li = document.createElement('li');
            li.append(...inline(o));
            ul.append(li);
          });
          out.push(ul);
        }
        return;
      }
      if (child.matches('label.sr-only, label.display-none')) return;
      if (/^H[1-6]$/.test(child.tagName)) {
        // the first heading before the main heading is the eyebrow (h1 in the source)
        const laterHeading = [...root.querySelectorAll('h1, h2, h3, h4')].some((h) => h !== child && (child.compareDocumentPosition(h) & 4));
        const isEyebrow = !sawHeading && !sawEyebrow && laterHeading
          && (child.closest('.eyebrow-copy') || /eyebrow|sub-title/i.test(child.className || '') || child.tagName === 'H1');
        if (isEyebrow) {
          sawEyebrow = true;
          // An h1 eyebrow stays the page's h1 (citi.com puts the product name in the h1); the
          // block styles a heading followed by another heading as the eyebrow.
          const p = wrap(document, child.tagName === 'H1' ? 'h1' : 'p', child);
          if (p) out.push(p);
          return;
        }
        const h = wrap(document, child.tagName.toLowerCase(), child);
        if (h) { out.push(h); sawHeading = true; }
        return;
      }
      if (child.matches('ul, ol')) {
        if (!textOf(child)) return;
        const list = document.createElement(child.tagName.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          const item = document.createElement('li');
          item.append(...inline(li, true));
          if (textOf(item)) list.append(item);
        });
        if (list.children.length) out.push(list);
        return;
      }
      if (child.matches('a')) {
        const href = realHref(child.getAttribute('href'));
        if (!href || !textOf(child)) return;
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.append(...inline(child));
        p.append(a);
        out.push(p);
        return;
      }
      if (child.matches('button, img')) return;
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const blockKids = child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, img, button, [role="combobox"]');
      const onlyLinks = !ownText && child.children.length && [...child.children].every((c) => c.matches('a, button'));
      if (child.matches('p') || (textOf(child) && !onlyLinks && (!blockKids || (ownText && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div'))))) {
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

function detailCell(document, col) {
  const cell = [];
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(CHROME)) return;
      if (/^H[1-6]$/.test(child.tagName)) {
        const h = wrap(document, child.tagName.toLowerCase(), child);
        if (h) cell.push(h);
        return;
      }
      if (child.matches('ul, ol')) {
        const list = document.createElement(child.tagName.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          const item = document.createElement('li');
          item.append(...inline(li));
          if (textOf(item)) list.append(item);
        });
        if (list.children.length) cell.push(list);
        return;
      }
      if (child.matches('a')) {
        const href = realHref(child.getAttribute('href'));
        if (!href || !textOf(child)) return;
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.append(...inline(child));
        p.append(a);
        cell.push(p);
        return;
      }
      if (child.matches('p') || (textOf(child) && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, a'))) {
        const p = wrap(document, 'p', child);
        if (p) cell.push(p);
        return;
      }
      walk(child);
    });
  };
  walk(col);
  return cell;
}

export default function parse(element, { document, params }) {
  const cells = [];
  let variant = null;

  const detailCols = [...element.querySelectorAll('.cross-link-card')];
  const photoCol = element.querySelector('.hero__image, .hero-image-container, .banner__card-details, .card-details__image, .banner-image-wrapper');
  const bgEl = [element, ...element.querySelectorAll('[style*="background-image"]')].find((n) => bgUrl(n));
  const textCol = element.querySelector('.hero__text, .hero-copy-container, .banner__headline, .text-space') || null;

  if (detailCols.length && !textCol) {
    const row = detailCols.map((c) => detailCell(document, c)).filter((c) => c.length);
    if (row.length) cells.push(row);
    variant = 'rounded-image-product-details';
  } else {
    const photoImgEl = photoCol ? [...photoCol.querySelectorAll('img')].find((i) => imgSrc(i)) : null;
    let photo = null;
    if (photoImgEl) photo = makeImg(document, imgSrc(photoImgEl), photoImgEl.getAttribute('alt'));
    else if (bgEl) photo = makeImg(document, bgUrl(bgEl), '');
    const photoRoots = photoCol ? [photoCol] : [];
    if (bgEl && bgEl !== element) photoRoots.push(bgEl);
    const copy = readCopy(document, textCol || element, photoRoots);
    const photoFirst = !!(photoCol && textCol && (photoCol.compareDocumentPosition(textCol) & 4));
    const row = [];
    if (photo && photoFirst) row.push([photo]);
    if (copy.length) row.push(copy);
    if (photo && !photoFirst) row.push([photo]);
    if (row.length) cells.push(row);
    // product details below the hero copy
    if (detailCols.length) {
      const extra = detailCols.map((c) => detailCell(document, c)).filter((c) => c.length);
      if (extra.length) cells.push(extra);
    }

    if (!photoImgEl && bgEl) variant = 'image';
    else if (element.querySelector('.banner__card-details, .card-details__image')) variant = 'rounded-image';
    else if (element.querySelector('.rates-hero') || element.matches('.rates-hero')) variant = 'rounded-image-chevron-photo';
    else if (element.matches('.hero__background') || element.querySelector('.hero__background')) {
      const ctaRoot = element.querySelector('.hero__text-cta') || element;
      variant = ctaRoot.querySelector('button') ? null : 'dark';
    }
  }

  const width = Math.max(1, ...cells.map((r) => r.length));
  cells.forEach((r) => { while (r.length < width) r.push(''); });

  const name = variant ? `hero-chevron (${variant})` : 'hero-chevron';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
