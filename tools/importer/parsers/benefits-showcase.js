/* eslint-disable */
/* global WebImporter */

/**
 * benefits-showcase: lifestyle image with an overlaid panel listing benefits.
 *
 * Output rows (padded to 2 columns; the block ignores empty cells):
 *  - image rows (picture only): background image (inline CSS background of the
 *    feature layout), then side / decorative photo (<img> outside the benefit list)
 *  - first text row: panel heading (H2) (+ intro text)
 *  - benefit rows: [optional icon | H3 title + description]
 *
 * Source shapes: tds-feature (credit-card PDP: tds-benefit items) and the
 * banking "plan-invest" tiles (.plan-invest-content items with icons).
 *
 * Variants (README option classes), detected from generic source cues:
 *  - benefit-columns: banking plan-invest tiles (icon + title + text in columns)
 *  - with-side-photo: inline layout (bg_inline_*) with a separate photo next to the panel
 *  - single-benefit:  exactly one benefit and it has no title
 *  - dark:            framed layout whose overlay colour is (near) opaque black (alpha >= 0.85)
 *  - plain:           everything else
 */

const COLS = 2;

function pad(row) {
  while (row.length < COLS) row.push('');
  return row;
}

function text(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function bgImageUrl(el) {
  const style = el.getAttribute('style') || '';
  const m = style.match(/background-image\s*:\s*url\(\s*(?:&quot;|["'])?([^"')]+?)(?:&quot;|["'])?\s*\)/i);
  return m ? m[1] : null;
}

function bgAlpha(el) {
  const style = el.getAttribute('style') || '';
  const m = style.match(/background-color\s*:\s*rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([\d.]+)\s*\)/i);
  if (m) return parseFloat(m[1]);
  return /background-color\s*:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(style) ? 1 : null;
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  return img;
}

function cleanText(root) {
  root.querySelectorAll('button, svg, .sr-only, .visually-hidden, cds-icon').forEach((x) => x.remove());
  root.querySelectorAll('[role="img"]:not(img), [role="presentation"]:not(img)').forEach((x) => { if (!text(x)) x.remove(); });
  // footnote markers without a target: keep the number, drop the empty link
  root.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
}

function detectVariant(element, items) {
  if (element.querySelector('.plan-invest-content')) return 'benefit-columns';
  const layout = element.querySelector('.feature-layout') || element;
  const layoutCls = `${layout.className || ''} ${(element.querySelector('.feature-section') || {}).className || ''}`;
  const sidePhoto = element.querySelector('.feature-layout__right img, .feature-layout__left img');
  if (/\b(bg_)?inline_\d/.test(layoutCls) && sidePhoto) return 'with-side-photo';
  if (items.length === 1 && !items[0].querySelector('h3, h4, .item-heading')) return 'single-benefit';
  const styled = [element, ...element.querySelectorAll('[style]')].find((el) => bgImageUrl(el) || bgAlpha(el) !== null);
  const alpha = styled ? bgAlpha(styled) : null;
  if (alpha !== null && alpha >= 0.85) return 'dark';
  return null;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const items = [...element.querySelectorAll('tds-benefit, .benefit-container, .plan-invest-content')]
    .filter((it, i, arr) => !arr.some((o) => o !== it && o.contains(it)));
  const variant = detectVariant(element, items);

  // --- images: background (inline CSS) first, then photos outside the benefit items
  const seen = new Set();
  const images = [];
  [element, ...element.querySelectorAll('[style]')].forEach((el) => {
    const url = bgImageUrl(el);
    if (url && !seen.has(`bg:${url}`)) {
      seen.add(`bg:${url}`);
      images.push(makeImg(document, url, ''));
    }
  });
  element.querySelectorAll('img').forEach((img) => {
    if (items.some((it) => it.contains(img))) return; // benefit icon
    const src = img.getAttribute('src') || img.getAttribute('data-src');
    if (!src || seen.has(`img:${src}`)) return;
    // the same picture used as background and as <img> is kept once, unless it is the side photo
    if (seen.has(`bg:${src}`) && variant !== 'with-side-photo') return;
    seen.add(`img:${src}`);
    images.push(makeImg(document, src, img.getAttribute('alt') || ''));
  });
  images.forEach((img) => cells.push(pad([img])));

  // --- panel heading (+ intro)
  const heading = [...element.querySelectorAll('.feature-header h1, .feature-header h2, h2.titleTxt, h2, h1')]
    .find((h) => !items.some((it) => it.contains(h)) && text(h));
  const intro = document.createElement('div');
  if (heading) {
    const h = document.createElement('h2');
    h.append(...heading.childNodes);
    intro.append(h);
  }
  // intro paragraphs / CTAs outside benefits (e.g. eyebrow, description, buttons as links)
  element.querySelectorAll('.feature-header p, .feature-list > .gap-1 p, .feature-content > p').forEach((p) => {
    if (items.some((it) => it.contains(p)) || !text(p)) return;
    intro.append(p);
  });
  element.querySelectorAll('a[href]').forEach((a) => {
    if (items.some((it) => it.contains(a)) || intro.contains(a) || !text(a)) return;
    if (/^javascript:/i.test(a.getAttribute('href'))) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text(a);
    p.append(link);
    intro.append(p);
  });
  if (text(intro)) cells.push(pad([intro]));

  // --- benefit rows
  items.forEach((item) => {
    cleanText(item);
    const icon = item.querySelector('img');
    const body = document.createElement('div');
    const title = item.querySelector('h3, h4, .item-heading, .header');
    if (title && text(title)) {
      const h = document.createElement('h3');
      h.append(...title.childNodes);
      body.append(h);
    }
    item.querySelectorAll('p').forEach((p) => {
      if (!text(p) || (title && title.contains(p))) return;
      body.append(p);
    });
    if (!text(body) && !icon) return;
    if (icon) {
      const src = icon.getAttribute('src') || icon.getAttribute('data-src');
      cells.push(pad([makeImg(document, src, icon.getAttribute('alt') || ''), text(body) ? body : '']));
    } else {
      cells.push(pad([body]));
    }
  });

  if (!cells.length) {
    const div = document.createElement('div');
    div.append(...element.childNodes);
    cells.push(pad([div]));
  }

  const name = variant ? `benefits-showcase (${variant})` : 'benefits-showcase';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
