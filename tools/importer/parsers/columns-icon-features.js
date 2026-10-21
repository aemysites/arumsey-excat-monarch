/* eslint-disable */
/* global WebImporter */

/**
 * columns-icon-features parser.
 * Block table: one row, one cell per feature -> icon (own paragraph), heading,
 * description, link.
 * Feature sources (fallback chain): benefit-card boxes (desktop copy only; the
 * mobile carousel duplicate is ignored) | tiles-slider .flex-column tiles |
 * direct children with a heading.
 * Inline SVG icons have no hosted asset and are omitted.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function cleanInline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, button, cds-icon, img').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    ['class', 'id', 'style', 'role', 'aria-label', 'aria-hidden', 'title'].forEach((a) => n.removeAttribute(a));
  });
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return clone;
}

function blockEl(document, tag, source) {
  const el = document.createElement(tag);
  el.append(...cleanInline(source).childNodes);
  return el;
}

function featureContent(document, feature) {
  const content = [];
  const img = [...feature.querySelectorAll('img')].find((i) => imgSrc(i));
  if (img) {
    const p = document.createElement('p');
    const out = document.createElement('img');
    out.setAttribute('src', imgSrc(img));
    out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
    p.append(out);
    content.push(p);
  }
  const headings = [...feature.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  if (headings.length) {
    headings.forEach((h) => { if (textOf(h)) content.push(blockEl(document, 'h3', h)); });
  } else {
    const hc = feature.querySelector('[class*="header"]');
    if (hc && textOf(hc)) content.push(blockEl(document, 'h3', hc));
  }
  const descs = [...feature.querySelectorAll('.boxmodel-description, .description')];
  descs.forEach((d) => {
    const paras = [...d.querySelectorAll(':scope > p, :scope > ul, :scope > ol')].filter((p) => textOf(p));
    if (d.tagName === 'P' || !paras.length) {
      if (textOf(d)) content.push(blockEl(document, 'p', d));
    } else {
      paras.forEach((p) => content.push(/^(UL|OL)$/.test(p.tagName) ? cleanInline(p) : blockEl(document, 'p', p)));
    }
  });
  if (!descs.length) {
    feature.querySelectorAll('p').forEach((p) => { if (textOf(p) && !p.closest('a')) content.push(blockEl(document, 'p', p)); });
  }
  feature.querySelectorAll('a[href]').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) return;
    if (a.closest('p, li, h1, h2, h3, h4, h5, h6, .boxmodel-description, .description')) return;
    const label = textOf(cleanInline(a));
    if (!label) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = label;
    p.append(link);
    content.push(p);
  });
  return content;
}

export default function parse(element, { document, params }) {
  const isMobileCopy = (c) => c.closest('.benefitcards__mobilevariation, [class*="mobilevariation"], .slide');
  let features = [...element.querySelectorAll('.benefitcards__contentbox-boxmodel')].filter((f) => !isMobileCopy(f));
  if (!features.length) features = [...element.querySelectorAll('.flex-column')].filter((f) => f.querySelector('h1, h2, h3, h4, h5, h6'));
  if (!features.length) features = [...element.children].filter((c) => c.querySelector('h1, h2, h3, h4, h5, h6'));
  features = features.filter((f, i) => !features.some((o, j) => j !== i && o.contains(f)));

  const row = features.map((f) => featureContent(document, f)).filter((c) => c.length);
  const cells = row.length ? [row] : [];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-icon-features', cells });
  element.replaceWith(block);
}
