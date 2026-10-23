/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-video
 * Source: section.column-control > li.col-1 > figure.hero-wrapper whose
 *   div.full-width-dynamicmedia holds a Scene7 video viewer
 *   (div.s7dm-dynamic-media[data-asset-path="<company>/<name>-AVS"],
 *   data-asset-type="videoavs"), with a figcaption overlay (title lockup
 *   image + CTA buttons).
 * Layout (hero convention, blocks/hero-video/README.md): one column, two rows:
 *   row 1 = background media: link to the .mp4 video + poster picture
 *   row 2 = eyebrow, heading or title image, text, CTA links
 *   (blocks/hero-video/hero-video.js finds the media cell by its video link.)
 * The Scene7 player streams an adaptive set (HLS); EDS needs a progressive
 * file whose path ends in .mp4, so known adaptive sets map to their 720p
 * rendition (Scene7 req=set,json); other sets fall back to the set's
 * progressive URL. The poster is the set's Scene7 still.
 * No variants.
 */

const S7_IMAGE = 'https://hrbent.scene7.com/is/image/';
const S7_CONTENT = 'https://hrbent.scene7.com/is/content/';

// adaptive video set -> progressive .mp4 rendition (hrbent.scene7.com req=set,json, 1280x720)
const AVS_RENDITIONS = {
  'hrblock/ri-marquee-video-gradient-AVS': 'https://hrbent.scene7.com/is/content/hrblock/_media_/fdb/fdbd627b-2b6a-4451-9b44-5b6b6dc61199.mp4',
};

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, node) {
  const p = document.createElement('p');
  p.append(node);
  return p;
}

function videoSource(element) {
  const viewer = element.querySelector('[data-asset-path]');
  const assetPath = viewer ? (viewer.getAttribute('data-asset-path') || '').trim() : '';
  let href = '';
  if (assetPath) href = AVS_RENDITIONS[assetPath] || `${S7_CONTENT}${assetPath.replace(/-AVS$/i, '')}`;
  if (!href) {
    const direct = [...element.querySelectorAll('video[src], video source[src]')]
      .map((v) => v.getAttribute('src'))
      .find((src) => src && !/^blob:/i.test(src));
    if (direct) href = direct;
  }
  let poster = '';
  if (assetPath) poster = `${S7_IMAGE}${assetPath}?fit=constrain,1&wid=1440&hei=810`;
  else {
    const v = element.querySelector('video[poster]');
    if (v) poster = v.getAttribute('poster');
  }
  return { href, poster, name: viewer ? viewer.getAttribute('data-asset-name') || '' : '' };
}

function cta(document, a) {
  const label = text(a);
  if (!label) return null;
  const link = document.createElement('a');
  const href = a.getAttribute('href') || '';
  link.href = !href || /^javascript:/i.test(href) ? '#' : href;
  link.textContent = label;
  const secondary = /(^|\s)(btn--transparent[\w-]*|[\w-]*--outline)(\s|$)/.test(a.className || '');
  const wrap = document.createElement(secondary ? 'em' : 'strong');
  wrap.append(link);
  return para(document, wrap);
}

export default function parse(element, { document }) {
  const { href, poster, name } = videoSource(element);

  // row 1: background media
  const media = [];
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = href;
    media.push(para(document, a));
  }
  if (poster) {
    const img = document.createElement('img');
    img.src = poster;
    img.alt = name ? name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ') : '';
    media.push(img);
  }

  // row 2: overlay (eyebrow / heading / title lockup image / text / CTAs), in source order
  const caption = element.querySelector('figcaption') || element;
  const content = [];
  caption.querySelectorAll('h1, h2, h3, h4, h5, h6, .modal-body p, .cmp-column--image img, .image-container img, .btn-container a, .btn-container button').forEach((n) => {
    if (n.closest('.s7dm-dynamic-media, [data-asset-path]')) return;
    if (n.tagName === 'IMG') {
      if (n.getAttribute('src')) content.push(n);
      return;
    }
    if (n.tagName === 'A' || n.tagName === 'BUTTON') {
      const p = cta(document, n);
      if (p) content.push(p);
      return;
    }
    const t = text(n);
    if (!t) return;
    if (/^H[1-6]$/.test(n.tagName) && n.matches('.eyebrow-label, .color-eyebrow')) {
      const p = document.createElement('p');
      p.textContent = t;
      content.push(p);
      return;
    }
    if (/^H[1-6]$/.test(n.tagName)) {
      const h = document.createElement(n.tagName.toLowerCase());
      h.textContent = t;
      content.push(h);
      return;
    }
    const p = document.createElement('p');
    p.textContent = t;
    content.push(p);
  });

  const cells = [];
  if (media.length) cells.push([media]);
  if (content.length) cells.push([content]);
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
