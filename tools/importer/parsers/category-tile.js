/* eslint-disable */
/* global WebImporter */

/**
 * category-tile parser.
 * Block table: one row per tile -> [label (heading, or link)] [image].
 * Source: tiny-template header tiles (.template-style with a heading over a
 * background image; the icon is an inline SVG and has no hosted asset).
 * The tile's background image (img, or CSS background-image as fallback) is
 * kept as the row's single image.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function bgUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

export default function parse(element, { document, params }) {
  const cells = [];

  let tiles = [...element.querySelectorAll('.template-style')].filter((t) => t.querySelector('h1, h2, h3, h4, h5, h6, a[href]'));
  if (!tiles.length) tiles = [element];

  tiles.forEach((tile) => {
    const heading = tile.querySelector('h1, h2, h3, h4, h5, h6');
    const link = tile.querySelector('a[href]:not([href^="#"]):not([href^="javascript"])');
    const label = textOf(heading) || textOf(link);
    if (!label) return;

    const labelCell = [];
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      if (link && textOf(link)) {
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href'));
        a.textContent = label;
        h.append(a);
      } else {
        h.textContent = label;
      }
      labelCell.push(h);
    } else {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = label;
      p.append(a);
      labelCell.push(p);
    }

    const imageCell = [];
    // lazy-loaded images carry a data: placeholder in src and the real URL in data-src
    const realSrc = (i) => [i.getAttribute('src'), i.getAttribute('data-src'), (i.getAttribute('srcset') || '').split(/[\s,]+/)[0]]
      .find((s) => s && !/^data:/i.test(s)) || '';
    const img = [...tile.querySelectorAll('img')].find((i) => realSrc(i));
    const src = img ? realSrc(img) : bgUrl(tile.querySelector('[style*="background-image"]'));
    if (src) {
      const out = document.createElement('img');
      out.setAttribute('src', src);
      out.setAttribute('alt', img ? (img.getAttribute('alt') || '').trim() : '');
      imageCell.push(out);
    }

    cells.push([labelCell, imageCell.length ? imageCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'category-tile', cells });
  element.replaceWith(block);
}
