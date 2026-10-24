/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-banner
 * Source: suncorp.com.au responsive-image canvases (canvas__container >
 * section.canvas--responsive_image with a CSS background image and content boxes).
 *
 * Block table (blocks/hero-banner/README.md):
 *   [background picture]  (picture-only cell)
 *   [main text box]       (heading, text, lists, CTA links)
 *   [side panel]          (optional second text box: offer / link / contents panel)
 * The background URL is read from the canvas <style> rules (the cleanup transformer
 * keeps <style> until afterTransform for this); thumbnail renditions are skipped.
 * When the catalog matches only part of a hero (the background div, a tick line),
 * the parser works on the enclosing canvas so the copy is not left behind.
 *
 * Variant classes (from markup, matching the catalog names):
 *   promo-card     - content box with a coloured top border (icon + offer)
 *   text-overlay   - transparent content box straight over the image
 *   text-box-cyan  - cyan (secondary) content box
 *   text-box-2     - neutral (grey, translucent) content box
 *   text-box       - white content box offset by an empty grid column
 *   offer-box      - a second content box (side panel) beside the main box
 *   logo           - the copy box carries a brand image
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

const ORIGIN = 'https://www.suncorp.com.au';

function backgroundImage(root, document) {
  const bg = root.querySelector('.canvas__bg_image') || (root.matches('.canvas__bg_image') ? root : null);
  const scope = root.closest('.canvas__container') || root;
  const styles = [...scope.querySelectorAll('style')];
  const id = bg && bg.id;
  const urls = [];
  styles.forEach((s) => {
    const css = s.textContent || '';
    const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
    let m = re.exec(css);
    while (m) {
      urls.push({ url: m[1], own: id ? css.includes(`#${id}`) : true });
      m = re.exec(css);
    }
  });
  const inline = bg && (bg.getAttribute('style') || '').match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
  if (inline) urls.unshift({ url: inline[1], own: true });
  // A content-box section (no canvas background div in the matched part) carries its
  // image inline on .contentBoxContainer__section__bgImage (e.g. the Haven globe banner).
  if (!bg && !urls.length) {
    const sectionBg = root.querySelector('.contentBoxContainer__section__bgImage[style*="url("]')
      || (root.matches('.contentBoxContainer__section__bgImage') ? root : null);
    const sm = sectionBg && (sectionBg.getAttribute('style') || '').replace(/&quot;/g, '"')
      .match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (sm) {
      const img = document.createElement('img');
      img.src = /^https?:/.test(sm[1]) ? sm[1] : `${ORIGIN}${sm[1].startsWith('/') ? '' : '/'}${sm[1]}`;
      img.alt = sectionBg.getAttribute('title') || '';
      return img;
    }
  }
  const pick = urls.find((u) => u.own && !/\/renditions\//.test(u.url))
    || urls.find((u) => !/\/renditions\//.test(u.url));
  if (!pick) return null;
  const img = document.createElement('img');
  img.src = /^https?:/.test(pick.url) ? pick.url : `${ORIGIN}${pick.url.startsWith('/') ? '' : '/'}${pick.url}`;
  img.alt = (bg && bg.getAttribute('title')) || '';
  return img;
}

function textBoxes(root) {
  const boxes = topLevel(root, '.contentBoxContainer').filter(hasContent);
  const mid = root.querySelector('.Middle-column');
  // A single badge box beside the hero's own heading/text (e.g. "Home Insurance" +
  // "CHOOSE FROM THREE LEVELS..." + tagline): keep the whole text column, in order.
  if (boxes.length === 1 && mid && mid.contains(boxes[0])) {
    const outside = text(mid).replace(text(boxes[0]), '').trim();
    if (outside.length > 15 || mid.querySelector('h1, h2')) return [mid];
  }
  if (boxes.length) return boxes;
  return mid && hasContent(mid) ? [mid] : [];
}

function heroVariant(root, boxes) {
  const main = boxes[0];
  if (!main) return null;
  if (/content-box-border-top-/.test(main.className)) return 'promo-card';
  // logo: the box carries a brand image of its own. An image inline in a text
  // paragraph (e.g. a star-rating strip beside "for value for money") is copy,
  // not a brand mark, so it does not make the hero a logo hero.
  const isInlineImg = (i) => {
    const p = i.closest('p, li');
    return !!(p && main.contains(p) && text(p));
  };
  const boxImgs = [...main.querySelectorAll('img')];
  if (boxImgs.length && !boxImgs.every(isInlineImg) && main !== root.querySelector('.Middle-column')) return 'logo';
  if (boxes.length > 1) return 'offer-box';
  if (/sg-Cell--secondary|sg-u-bgSecondary|cyan/i.test(main.className)) return 'text-box-cyan';
  if (/sg-Cell--neutral/.test(main.className)) return 'text-box-2';
  if (/sg-Cell--light/.test(main.className)) {
    const col = main.closest('[class*="sg-Grid-col"]');
    const prev = col && col.previousElementSibling;
    if (prev && /sg-Grid-col/.test(prev.className) && !hasContent(prev)) return 'text-box';
    return null;
  }
  if (main.matches('.contentBoxContainer')) return 'text-overlay';
  return null;
}

/** Bold type spans become <strong> (the cleanup transformer leaves block cells alone). */
function boldSpans(box, document) {
  box.querySelectorAll('span.sg-Type--bold, span.sg-Type--prominent, span.sg-Type--title').forEach((span) => {
    if (span.closest('h1, h2, h3, h4, h5, h6, strong, b')) return;
    const t = text(span);
    if (!t) return;
    const linkText = [...span.querySelectorAll('a')].map((a) => a.textContent).join('').replace(/\s+/g, '');
    if (linkText && linkText === t.replace(/\s+/g, '')) return;
    const strong = document.createElement('strong');
    strong.append(...span.childNodes);
    span.replaceWith(strong);
  });
}

function boxContent(box, document) {
  cleanNode(box);
  boldSpans(box, document);
  box.querySelectorAll('a.sg-Btn').forEach((a) => {
    a.textContent = text(a);
    a.removeAttribute('class');
  });
  const cell = document.createElement('div');
  cell.append(...flatten([...box.childNodes], document));
  // side-by-side CTA buttons: one paragraph each is fine; drop empty anchors (a[name])
  cell.querySelectorAll('a:not([href])').forEach((a) => { if (!text(a)) a.remove(); });
  return cell;
}

export default function parse(element, { document, params }) {
  // Work on the whole hero canvas when only a part of it was matched.
  // A lone box icon, or a tick/short value cell of a comparison layout, is page text
  // (catalog review rule), not a hero.
  if (element.matches('.sg-Box-icon')) return;
  if (!element.closest('.canvas--responsive_image')
    && !element.matches('.canvas__bg_image, .canvas__container, section')
    && !element.querySelector('h1, h2, h3, h4, img, picture, .canvas__bg_image, .contentBoxContainer')
    && text(element).length < 60) return;

  let root = element;
  const canvas = element.closest('.canvas__container');
  // Climb only for an image hero canvas (or its background div), so a plain text canvas
  // around a small matched part is never swallowed.
  if (!element.querySelector('.canvas__bg_image, .contentBoxContainer, .Middle-column')
    && canvas && (canvas.querySelector('section.canvas--responsive_image') || element.matches('.canvas__bg_image'))) {
    root = canvas;
  }

  // A page-picker dropdown inside the hero (claims hub) is its own jump-select block:
  // keep it out of the hero cells and put it back right after the block.
  const pickers = [...root.querySelectorAll('form.pageTabs')];
  pickers.forEach((form) => form.remove());

  const img = backgroundImage(root, document);
  const boxes = textBoxes(root);
  // the look still comes from the text box itself when the whole column is kept
  const ownBoxes = topLevel(root, '.contentBoxContainer').filter(hasContent);
  const variant = heroVariant(root, ownBoxes.length ? ownBoxes : boxes);

  const cells = [];
  if (img) cells.push([img]);
  boxes.forEach((box) => {
    const cell = boxContent(box, document);
    if (hasContent(cell)) cells.push([cell]);
  });
  if (!boxes.length && root === element && !img) {
    const cell = boxContent(element, document);
    if (hasContent(cell)) cells.push([cell]);
  }

  // Nothing recoverable (isolated background div without its canvas): keep as is.
  if (!cells.length) {
    pickers.forEach((form) => root.append(form));
    return;
  }

  const name = variant ? `hero-banner (${variant})` : 'hero-banner';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  if (root === element) element.replaceWith(block);
  else root.replaceWith(block);
  block.after(...pickers);
}
