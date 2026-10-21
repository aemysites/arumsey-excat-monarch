/* eslint-disable */
/* global WebImporter */

/**
 * carousel-cards parser.
 * Block table: one row per slide card -> [image (optional)] [content: eyebrow, heading, text, link].
 * Carousel chrome (arrows, dots, sr-only text) is dropped; cards repeated across
 * sliding-window slides are de-duplicated (heading + text + link).
 *
 * Variants (generic DOM cues):
 *  - centre-card-enlarged : multi-item slider track (.multiitem-slider-track); the
 *                           heading/intro above the slider is kept as default content
 *  - icon-slides-in-box   : .slide-item cards with an icon (inline SVG, omitted)
 *  - icon-slides-in-box-2 : .slide-item cards with an image (.image-style img)
 *  - icon-slides-in-box-3 : .grid-column box-model cards (image + heading + text)
 *  - image                : banner cards with an .icon-top-background wrapper
 *  - plain                : banner cards (section.banner)
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.sr-only, .visually-hidden, .cdk-visually-hidden, .ada-hidden, svg, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || /^javascript:/i.test(href)) a.replaceWith(...a.childNodes);
  });
  clone.removeAttribute('id');
  clone.removeAttribute('class');
  clone.removeAttribute('role');
  return clone;
}

function wrap(document, tag, source) {
  const el = document.createElement(tag);
  el.append(...cleanClone(source).childNodes);
  return el;
}

function imageOf(root, document) {
  const img = root && root.querySelector('img');
  if (!img) return null;
  // lazy-loaded images carry a data: placeholder in src and the real URL in data-src
  const src = [img.getAttribute('src'), img.getAttribute('data-src'), (img.getAttribute('srcset') || '').split(/[\s,]+/)[0]]
    .find((s) => s && !/^data:/i.test(s)) || '';
  if (!src) return null;
  const out = document.createElement('img');
  out.setAttribute('src', src);
  out.setAttribute('alt', (img.getAttribute('alt') || '').trim());
  return out;
}

/** Paragraph-level content of a text container (p / lists), or the container as one paragraph. */
function paragraphs(document, container) {
  if (!container || !textOf(container)) return [];
  const blocks = [...container.querySelectorAll(':scope > p, :scope > ul, :scope > ol')].filter((b) => textOf(b));
  if (blocks.length) return blocks.map((b) => (/^(UL|OL)$/.test(b.tagName) ? cleanClone(b) : wrap(document, 'p', b)));
  return [wrap(document, 'p', container)];
}

function ctaParagraph(document, a) {
  const href = (a.getAttribute('href') || '').trim();
  const label = textOf(cleanClone(a));
  if (!href || href.startsWith('#') || /^javascript:/i.test(href) || !label) return null;
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.textContent = label;
  p.append(link);
  return p;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const before = [];
  const seen = new Set();
  let variant = null;

  const addRow = (image, content) => {
    const key = content.map((c) => textOf(c)).join('|') + (image ? image.getAttribute('src') : '');
    if (!content.length && !image) return;
    if (seen.has(key)) return;
    seen.add(key);
    if (image) cells.push([image, content]);
    else cells.push([content]);
  };

  const exclude = (el) => el.closest('.cds-carousel-mid-controls, .tab-panel-wrapper, .navigation-panel, .static-content');

  const multiTrack = element.querySelector('.multiitem-slider-track');
  const slideItems = [...element.querySelectorAll('.slide-item')].filter((s) => !exclude(s));
  const gridColumns = [...element.querySelectorAll('.grid-column')].filter((g) => !exclude(g) && textOf(g));
  let banners = [...element.querySelectorAll('section.banner, .banner__container')].filter((b) => !exclude(b));
  banners = banners.filter((b, i) => !banners.some((o, j) => j !== i && o.contains(b)));

  if (multiTrack) {
    variant = 'centre-card-enlarged';
    // intro above the slider -> default content before the block
    const intro = element.querySelector('aem-heading-desc, .x-headingWrapper');
    if (intro && !multiTrack.contains(intro)) {
      const h = intro.querySelector('h1, h2, h3, h4, h5, h6');
      if (h && textOf(h)) before.push(wrap(document, 'h2', h));
      intro.querySelectorAll('p').forEach((p) => { if (textOf(p)) before.push(wrap(document, 'p', p)); });
    }
    [...multiTrack.querySelectorAll('.slide')].forEach((slide) => {
      const content = [];
      const article = slide.querySelector('article') || slide;
      const h = article.querySelector('h1, h2, h3, h4, h5, h6');
      if (h && textOf(h)) content.push(wrap(document, 'h3', h));
      article.querySelectorAll('p').forEach((p) => { if (textOf(p)) content.push(wrap(document, 'p', p)); });
      article.querySelectorAll('a[href]').forEach((a) => {
        if (a.closest('p')) return;
        const cta = ctaParagraph(document, a);
        if (cta) content.push(cta);
      });
      addRow(imageOf(slide.querySelector('.img-wrapper') || slide, document), content);
    });
  } else if (slideItems.length) {
    // image tiles vs icon tiles: decide by majority (some icon sets mix in a stray image)
    const withImage = slideItems.filter((s) => s.querySelector('.image-style img')).length;
    variant = withImage * 2 > slideItems.length ? 'icon-slides-in-box-2' : 'icon-slides-in-box';
    slideItems.forEach((item) => {
      const content = [];
      const eyebrow = item.querySelector('.item-eyebrow');
      if (eyebrow && textOf(eyebrow)) content.push(wrap(document, 'p', eyebrow));
      const body = item.querySelector('.item-body') || item;
      const h = body.querySelector('h1, h2, h3, h4, h5, h6');
      if (h && textOf(h)) content.push(wrap(document, 'h3', h));
      [...body.querySelectorAll('p, ul, ol')].forEach((p) => {
        if (!textOf(p) || p.closest('h1, h2, h3, h4, h5, h6') || (p.parentElement && p.parentElement.closest('p, ul, ol'))) return;
        content.push(/^(UL|OL)$/.test(p.tagName) ? cleanClone(p) : wrap(document, 'p', p));
      });
      item.querySelectorAll('a.cds-button[href], a.cta[href], .item-cta a[href]').forEach((a) => {
        if (a.closest('p')) return;
        const cta = ctaParagraph(document, a);
        if (cta) content.push(cta);
      });
      addRow(imageOf(item.querySelector('.image-style') || null, document), content);
    });
  } else if (gridColumns.length) {
    variant = 'icon-slides-in-box-3';
    gridColumns.forEach((col) => {
      const content = [];
      const headings = [...col.querySelectorAll('h1, h2, h3, h4, h5, h6')];
      headings.forEach((h) => { if (textOf(h)) content.push(wrap(document, 'h3', h)); });
      if (!headings.length) {
        const hc = col.querySelector('[class*="boxmodel-header"]');
        if (hc && textOf(hc)) content.push(wrap(document, 'h3', hc));
      }
      col.querySelectorAll('.boxmodel-description').forEach((d) => content.push(...paragraphs(document, d)));
      col.querySelectorAll('a.cds-button[href]').forEach((a) => {
        const cta = ctaParagraph(document, a);
        if (cta) content.push(cta);
      });
      addRow(imageOf(col.querySelector('.boxmodel-image, app-image') || col, document), content);
    });
  } else {
    variant = element.querySelector('.icon-top-background') ? 'image' : null;
    banners.forEach((banner) => {
      const content = [];
      const eyebrow = banner.querySelector('.eyebrow');
      if (eyebrow && textOf(eyebrow)) content.push(wrap(document, 'p', eyebrow));
      const h = banner.querySelector('h1, h2, h3, h4, h5, h6');
      if (h && textOf(h)) content.push(wrap(document, 'h3', h));
      banner.querySelectorAll('.description').forEach((d) => content.push(...paragraphs(document, d)));
      banner.querySelectorAll('.banner__content-buttonsection a[href], a.cds-button[href]').forEach((a) => {
        const cta = ctaParagraph(document, a);
        if (cta && !content.some((c) => c.querySelector && c.querySelector('a') && c.querySelector('a').getAttribute('href') === a.getAttribute('href'))) content.push(cta);
      });
      addRow(imageOf(banner.querySelector('.banner__image, .icon-top-background, app-image') || banner, document), content);
    });
  }

  const name = variant ? `carousel-cards (${variant})` : 'carousel-cards';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  before.forEach((n) => element.before(n));
  element.replaceWith(block);
}
