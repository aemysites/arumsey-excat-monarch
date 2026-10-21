/* eslint-disable */
/* global WebImporter */

/**
 * columns-media parser.
 * Block table: one row per media pair; image cell + text cell in source order.
 * Text cell: eyebrow, heading, text, list (icon items for icon-feature-list),
 * CTAs. Text-only sources become text columns (faq) or heading | copy (dark).
 *
 * Variants (generic cues):
 *  - icon-feature-list: the text column holds >= 2 repeated icon + heading + text items
 *  - faq: text-only multi-column layout (columns split by separators), or the
 *    top-aligned banner / payroll-services media modules (tds-banner, *PayrollServicesContainer)
 *  - dark: text-only action module (one heading + detail copy, no image)
 *  - light: home-story media module (image left, text right, on a light panel)
 *  - null: other image + text banners/modules
 *
 * Buttons without a URL get the href of the module's image link when there is one;
 * otherwise the label is kept as plain text so the author can link it.
 */

const CHROME = 'script, style, noscript, svg, cds-icon, aem-tooltip, citi-tooltip, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, [role="tooltip"]';
const HEADING = 'h1, h2, h3, h4, h5, h6';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0], img.getAttribute('data-desktop-src')];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function makeImg(document, img) {
  const src = img && imgSrc(img);
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  const alt = (img.getAttribute('alt') || '').replace(/\s+/g, ' ').trim();
  out.setAttribute('alt', /^\|?empty\|?$|^image$|^banner image$/i.test(alt) ? '' : alt);
  return out;
}

function stripComments(root) {
  const walker = root.ownerDocument.createTreeWalker(root, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
}

/** Inline children of el, cleaned (links keep href, chrome dropped). */
function inline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('img, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('div, p, span, section, article').forEach((n) => n.replaceWith(...n.childNodes));
  stripComments(clone);
  return [...clone.childNodes];
}

function wrap(document, tag, el) {
  if (!el || !textOf(el)) return null;
  const out = document.createElement(tag);
  out.append(...inline(el));
  return textOf(out) ? out : null;
}

function linkP(document, href, labelNodes) {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.append(...labelNodes);
  p.append(a);
  return p;
}

/** Icon feature item (icon + heading + text) -> li */
function iconItem(document, item) {
  const li = document.createElement('li');
  const img = makeImg(document, item.querySelector('img'));
  if (img) li.append(img);
  item.querySelectorAll(`${HEADING}, p`).forEach((n) => {
    if (n.closest(CHROME)) return;
    const tag = /^H/.test(n.tagName) ? n.tagName.toLowerCase() : 'p';
    const w = wrap(document, tag, n);
    if (w) li.append(w);
  });
  return textOf(li) ? li : null;
}

/** Build text cell content from a source subtree, in document order. */
function textContent(document, root, ctx) {
  const out = [];
  const iconItems = [...root.querySelectorAll('.icon-info-wrapper, .icon-feature, .feature-item')]
    .filter((n) => n.querySelector('img') && n.querySelector(HEADING));
  let iconList = null;
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(CHROME)) return;
      if (iconItems.includes(child)) {
        if (!iconList) {
          iconList = document.createElement('ul');
          out.push(iconList);
        }
        const li = iconItem(document, child);
        if (li) iconList.append(li);
        return;
      }
      if (child.matches(HEADING)) {
        const h = wrap(document, child.tagName.toLowerCase(), child);
        if (h) out.push(h);
        return;
      }
      if (child.matches('ul, ol')) {
        const list = document.createElement(child.tagName.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          const item = document.createElement('li');
          const parts = [...li.querySelectorAll(`${HEADING}, p, .list-description, .list-heading`)]
            .filter((n) => !n.closest(CHROME))
            .filter((n, i, all) => !all.some((o, j) => j !== i && o.contains(n)));
          if (parts.length > 1) {
            parts.forEach((n) => {
              const tag = n.matches(HEADING) ? n.tagName.toLowerCase() : 'p';
              const w = wrap(document, tag, n);
              if (w) item.append(w);
            });
          } else {
            item.append(...inline(li));
          }
          if (textOf(item)) list.append(item);
        });
        if (!list.children.length) return;
        // consecutive single-item lists (one <ul> per bullet) merge into one list
        const prev = out[out.length - 1];
        if (prev && prev.tagName === list.tagName && prev.dataset.merge) {
          prev.append(...list.children);
        } else {
          list.dataset.merge = '1';
          out.push(list);
        }
        return;
      }
      if (child.matches('a[href]')) {
        const href = child.getAttribute('href').trim();
        const label = inline(child);
        if (!textOf(child)) return;
        if (/^javascript:/i.test(href)) {
          const p = document.createElement('p');
          p.append(...label);
          out.push(p);
        } else {
          out.push(linkP(document, href, label));
        }
        return;
      }
      if (child.matches('button')) {
        const label = textOf(inline(child).reduce((d, n) => { d.append(n); return d; }, document.createElement('div')));
        if (!label) return;
        if (ctx.fallbackHref) {
          const t = document.createTextNode(label);
          out.push(linkP(document, ctx.fallbackHref, [t]));
        } else {
          const p = document.createElement('p');
          p.textContent = label;
          out.push(p);
        }
        return;
      }
      if (child.matches('img')) return; // images are handled by the image cell
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const hasBlock = child.querySelector(`${HEADING}, p, ul, ol, div, img, button, section, article`);
      if (child.matches('p') || (ownText && !child.querySelector(`${HEADING}, p, ul, ol, div`)) || (!hasBlock && textOf(child) && !child.matches('a'))) {
        const p = wrap(document, 'p', child);
        if (p) out.push(p);
        return;
      }
      walk(child);
    });
  };
  walk(root);
  out.forEach((n) => { if (n.dataset) delete n.dataset.merge; });
  return out;
}

function isIcon(img) {
  const w = parseInt(img.getAttribute('width') || '0', 10);
  return /icon/i.test(img.className || '') || !!img.closest('.icon-wrapper, .icon-info-wrapper') || (w > 0 && w <= 48);
}

function lca(a, b) {
  let n = a;
  while (n && !n.contains(b)) n = n.parentElement;
  return n;
}

export default function parse(element, { document, params }) {
  // drop duplicate mobile copies and empty lazy placeholders
  const work = element.cloneNode(true);
  work.querySelectorAll(CHROME).forEach((n) => n.remove());
  work.querySelectorAll('[class*="MobileView"], [class*="mobile-only"], .d-lg-none, .visible-xs').forEach((n) => n.remove());

  const mainImgs = [...work.querySelectorAll('img')].filter((i) => imgSrc(i) && !isIcon(i));
  const firstHeading = work.querySelector(HEADING) || [...work.querySelectorAll('p, div')].find((n) => textOf(n));
  const imgLink = [...work.querySelectorAll('a[href]')].find((a) => a.querySelector('img') && !/^javascript:|^#/.test(a.getAttribute('href')));
  const ctx = { fallbackHref: imgLink ? imgLink.getAttribute('href') : '' };

  const separators = work.querySelectorAll('.seperator, .separator, .vertical-seperator, .divider');
  let textCols = [...work.querySelectorAll('.col-size.col')];
  if (!textCols.length && separators.length) {
    const parent = separators[0].parentElement;
    textCols = [...parent.children].filter((c) => !c.matches('.seperator, .separator, .vertical-seperator, .divider') && textOf(c));
  }

  let variant = null;
  let rows = [];
  const iconFeature = work.querySelectorAll('.icon-info-wrapper').length >= 2
    || [...work.querySelectorAll('img')].filter((i) => isIcon(i) && i.closest('div') && i.closest('div').parentElement.querySelector(HEADING)).length >= 2;

  if (!mainImgs.length) {
    if (textCols.length > 1) {
      variant = 'faq';
      rows = [textCols.map((c) => textContent(document, c, ctx)).filter((c) => c.length)];
    } else {
      // text-only: heading | copy
      const heading = work.querySelector(HEADING);
      const copy = textContent(document, work, ctx).filter((n) => !(heading && n.tagName === heading.tagName && textOf(n) === textOf(heading)));
      const h = heading ? wrap(document, heading.tagName.toLowerCase(), heading) : null;
      variant = 'dark';
      rows = [[h ? [h] : '', copy]];
    }
  } else {
    const img = mainImgs[0];
    const anchor = firstHeading && !img.contains(firstHeading) ? firstHeading : null;
    let imageCell = [makeImg(document, img)];
    let container = anchor ? lca(img, anchor) : img.parentElement;
    if (!container) container = work;
    const sides = [...container.children];
    const imgSide = sides.find((s) => s.contains(img));
    const cells = [];
    sides.forEach((side) => {
      if (side === imgSide) {
        // the image side may also carry text (rare): keep image only, text goes to text cell
        cells.push({ kind: 'img', content: imageCell });
        const rest = textOf(side) ? textContent(document, side, ctx) : [];
        if (rest.length) cells.push({ kind: 'text', content: rest });
        return;
      }
      if (!textOf(side)) return;
      cells.push({ kind: 'text', content: textContent(document, side, ctx) });
    });
    // merge consecutive text cells into one text column
    const merged = [];
    cells.forEach((c) => {
      const prev = merged[merged.length - 1];
      if (prev && prev.kind === 'text' && c.kind === 'text') prev.content.push(...c.content);
      else merged.push({ kind: c.kind, content: [...c.content] });
    });
    // anything outside the container (e.g. a heading above the pair) leads the text cell
    const outside = [];
    if (container !== work) {
      let n = container;
      while (n && n !== work) {
        const parent = n.parentElement;
        if (!parent) break;
        [...parent.children].forEach((sib) => {
          if (sib !== n && textOf(sib) && !sib.contains(container)) {
            const before = sib.compareDocumentPosition(n) & 4;
            outside.push({ before: !!before, nodes: textContent(document, sib, ctx) });
          }
        });
        n = parent;
      }
    }
    const textCell = merged.find((c) => c.kind === 'text');
    if (textCell) {
      outside.filter((o) => o.before).reverse().forEach((o) => textCell.content.unshift(...o.nodes));
      outside.filter((o) => !o.before).forEach((o) => textCell.content.push(...o.nodes));
    } else if (outside.length) {
      merged.push({ kind: 'text', content: outside.flatMap((o) => o.nodes) });
    }
    rows = [merged.map((c) => c.content).filter((c) => c.length)];

    if (iconFeature) variant = 'icon-feature-list';
    else if (element.matches('home-story') || element.querySelector('home-story, .home-story-img')) variant = 'light';
    else if (element.matches('tds-banner') || element.querySelector('tds-banner, [class*="ayrollServicesContainer"]') || /ayrollServicesContainer/.test(element.className || '')) variant = 'faq';
  }

  rows = rows.filter((r) => r.length);
  const name = variant ? `columns-media (${variant})` : 'columns-media';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: rows });
  element.replaceWith(block);
}
