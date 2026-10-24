/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-video
 * Source: suncorp.com.au YouTube embeds (section.video / .youtube-video with
 * schema.org meta), optional heading/text, transcript accordions, poster images.
 *
 * Block table (blocks/embed-video/README.md), one row per content unit in order:
 *   [poster picture (optional) + video link]
 *   [heading / text / CTA]                      (optional)
 *   ['Read transcript' label] [transcript text] (optional, two-cell row)
 * Single-cell rows are padded to two cells so the table stays rectangular.
 *
 * Variant classes (from markup, matching the catalog names):
 *   image - the embed has a poster thumbnail (click to play)
 *   light - video inside a neutral (light grey) flextable cell / box
 *   dark  - grey/dark canvas behind the video, or the video sits in a half-width
 *           grid column beside other content
 */

const JUNK = 'style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)';
const BLOCK_TAGS = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
const WRAPPER_TAGS = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function hasContent(el) {
  return !!(text(el) || el.querySelector('img'));
}

function orderOf(cell) {
  const m = (cell.getAttribute('style') || '').match(/(?:^|;)\s*order\s*:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

function colCount(table) {
  const m = table.className.match(/sg-Flextable--(\d+)cols/);
  return m ? Number(m[1]) : 0;
}

/** Group flextable cells into per-card lists. */
function flextableCards(table) {
  const cells = [...table.children].filter((c) => c.matches('.sg-Flextable-cell'));
  const cols = colCount(table);
  const orders = cells.map(orderOf);
  if (cols && cells.length > cols && cells.length % cols === 0 && orders.every((o) => o !== null)) {
    const size = cells.length / cols;
    const groups = [];
    for (let i = 0; i < cells.length; i += size) groups.push(cells.slice(i, i + size));
    const ok = groups.every((g) => g.every((c, j) => orderOf(c) === j + 1));
    if (ok) return groups;
  }
  return cells.map((c) => [c]);
}

function topLevel(root, selector) {
  const all = [...root.querySelectorAll(selector)];
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
}

/** Returns { kind, cards: Element[][] } for the element. */
function cardUnits(element) {
  const sgCards = topLevel(element, '.sg-Card');
  if (sgCards.length) return { kind: 'sg-card', cards: sgCards.map((c) => [c]) };
  const tables = element.matches('.sg-Flextable') ? [element] : topLevel(element, '.sg-Flextable');
  if (tables.length) {
    return { kind: 'flextable', cards: tables.flatMap((t) => flextableCards(t)), tables };
  }
  // innermost grid row with 2+ content columns
  const rows = [...element.querySelectorAll('.sg-Grid-row')]
    .filter((r) => [...r.children].filter(hasContent).length >= 2)
    .filter((r) => ![...r.querySelectorAll('.sg-Grid-row')].some((inner) => [...inner.children].filter(hasContent).length >= 2));
  if (rows.length) return { kind: 'grid', cards: rows.flatMap((r) => [...r.children].map((c) => [c])) };
  return { kind: 'single', cards: [[element]] };
}

/** Flattens layout wrappers into block-level nodes (p, h*, ul, ol, table). */
function flatten(nodes, document) {
  const out = [];
  let para = null;
  const flush = () => {
    if (para && (text(para) || para.querySelector('img'))) out.push(para);
    para = null;
  };
  const walk = (node) => {
    if (node.nodeType === 3) {
      if (!node.textContent.trim()) { if (para) para.append(node); return; }
      if (!para) para = document.createElement('p');
      para.append(node);
      return;
    }
    if (node.nodeType !== 1) return;
    if (BLOCK_TAGS.test(node.tagName)) {
      flush();
      if (text(node) || node.querySelector('img')) out.push(node);
      return;
    }
    if (WRAPPER_TAGS.test(node.tagName) || (node.tagName === 'A' && node.querySelector('div, p, h1, h2, h3, h4, h5, h6, header, section'))) {
      flush();
      [...node.childNodes].forEach(walk);
      flush();
      return;
    }
    if (node.tagName === 'BR' && !para) return;
    if (!para) para = document.createElement('p');
    para.append(node);
  };
  nodes.forEach((n) => walk(n));
  flush();
  return out;
}

function cleanNode(root) {
  root.querySelectorAll(JUNK).forEach((el) => el.remove());
  root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
  root.querySelectorAll('img.vs-badge-image:not(.badge-desktop)').forEach((img) => img.remove());
}

/** Main card image: first img outside rich text (img-wrapper / adaptive image). */
function mainImage(parts) {
  for (const part of parts) {
    const imgs = part.matches && part.matches('img') ? [part] : [...part.querySelectorAll('img')];
    const img = imgs.find((i) => !i.closest('.rte, p, li'));
    if (img) return img;
  }
  return null;
}

function buildCard(parts, document) {
  parts.forEach(cleanNode);
  const img = mainImage(parts);
  // Overlay card link (a.sg-Card-inner wraps the whole card).
  let overlayHref = null;
  const OVERLAY = 'a.sg-Card-inner, a.Article--link-mask, a.sg-Card, a.contentBoxContainer, a.Image-linkWrapper';
  parts.forEach((p) => {
    const overlay = p.matches(OVERLAY) ? p : p.querySelector(OVERLAY);
    if (overlay && !overlayHref) overlayHref = overlay.getAttribute('href');
  });
  if (img) {
    const wrap = img.closest('.img-wrapper, .adaptive-image, .image-wrapper, .Image-linkWrapper');
    img.remove();
    if (wrap && !hasContent(wrap)) wrap.remove();
  }
  const blocks = flatten(parts.flatMap((p) => [...p.childNodes]), document);
  // sg-Btn links: plain links in their own paragraph.
  blocks.forEach((b) => b.querySelectorAll('a.sg-Btn').forEach((a) => {
    a.textContent = text(a);
    a.removeAttribute('class');
  }));
  if (overlayHref && !blocks.some((b) => b.querySelector('a[href]'))) {
    // Rebuild the overlay link on the "Read more" line, else on the title.
    const target = blocks.slice().reverse().find((b) => /read\s+more|find\s+out\s+more|learn\s+more/i.test(text(b)))
      || blocks.find((b) => /^H[1-6]$/.test(b.tagName)) || blocks[blocks.length - 1];
    if (target) {
      const a = document.createElement('a');
      a.href = overlayHref;
      a.append(...target.childNodes);
      target.append(a);
    }
  }
  const body = document.createElement('div');
  body.append(...blocks);
  if (!hasContent(body) && !img) return null;
  return img ? [img, body] : ['', body];
}

const TRANSCRIPT = /^(read\s+)?transcript(ion)?\b/i;

function videoUrl(section) {
  const iframe = section.querySelector('iframe[src]');
  const contentUrl = section.querySelector('link[itemprop="contentUrl"], meta[itemprop="embedUrl"]');
  let src = (iframe && iframe.getAttribute('src'))
    || (contentUrl && (contentUrl.getAttribute('href') || contentUrl.getAttribute('content')));
  if (!src) return null;
  const id = (src.match(/youtube(?:-nocookie)?\.com\/embed\/([^?&#/]+)/) || [])[1];
  if (id) src = `https://www.youtube.com/watch?v=${id}`;
  return src;
}

function embedVariant(element, sections) {
  if (sections.some((s) => s.querySelector('img.video-thumbnail, .js-startvideo img'))) return 'image';
  const inNeutral = (el) => el.closest('.sg-Flextable-cell--neutral, .sg-Cell--neutral');
  if (sections.some(inNeutral) || element.matches('.sg-Flextable-cell--neutral, .sg-Cell--neutral')) return 'light';
  if (element.querySelector('.canvas__bg_image.BgPlaceholder--grey, .canvas__bg_image.BgPlaceholder--dark, .canvas__bg_image.BgPlaceholder--secondary')) return 'dark';
  if (sections.some((s) => {
    const col = s.closest('[class*="sg-Grid-col"]');
    return col && element.contains(col) && /sg-Grid-col6--xlarge|sg-Grid-col6--large/.test(col.className);
  })) return 'dark';
  return null;
}

export default function parse(element, { document, params }) {
  const sections = element.matches('section.video, .youtube-video, .youtubevideo')
    ? [element] : topLevel(element, 'section.video, .youtube-video, .youtubevideo');
  const variant = embedVariant(element, sections);
  const rows = [];

  // Units in document order: videos, rich text outside accordions, transcript accordions.
  const units = topLevel(element, 'section.video, .youtube-video, .youtubevideo, .sg-Accordion, div.rte, a.sg-Btn')
    .filter((u) => !u.closest('.sg-Accordion') || u.matches('.sg-Accordion'));
  if (!units.length && sections.length) units.push(...sections);
  if (element.matches('section.video, .youtube-video, .youtubevideo')) units.splice(0, units.length, element);

  units.forEach((unit) => {
    if (unit.matches('section.video, .youtube-video, .youtubevideo')) {
      const src = videoUrl(unit);
      if (!src) return;
      const cell = document.createElement('div');
      const poster = unit.querySelector('img.video-thumbnail, .js-startvideo img');
      if (poster) {
        const img = document.createElement('img');
        img.src = poster.getAttribute('src');
        const name = unit.querySelector('meta[itemprop="name"]');
        img.alt = (name && name.getAttribute('content')) || poster.getAttribute('alt') || '';
        cell.append(img);
      }
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = src;
      a.textContent = src;
      p.append(a);
      cell.append(p);
      rows.push([cell, '']);
    } else if (unit.matches('.sg-Accordion')) {
      const label = unit.querySelector('.sg-Accordion-label, button');
      const panel = unit.querySelector('.sg-Accordion-content');
      const labelText = text(label);
      if (!panel) return;
      cleanNode(panel);
      const body = document.createElement('div');
      body.append(...flatten([...panel.childNodes], document));
      body.querySelectorAll('a.sg-Btn').forEach((b) => {
        b.textContent = text(b);
        b.removeAttribute('class');
      });
      const p = document.createElement('p');
      p.textContent = TRANSCRIPT.test(labelText) ? labelText : `Transcript: ${labelText}`;
      rows.push([p, body]);
    } else if (hasContent(unit)) {
      cleanNode(unit);
      const cell = document.createElement('div');
      if (unit.matches('a')) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = unit.getAttribute('href');
        a.textContent = text(unit);
        p.append(a);
        cell.append(p);
      } else {
        cell.append(...flatten([...unit.childNodes], document));
      }
      if (hasContent(cell)) rows.push([cell, '']);
    }
  });

  const name = variant ? `embed-video (${variant})` : 'embed-video';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: rows });
  element.replaceWith(block);
}
