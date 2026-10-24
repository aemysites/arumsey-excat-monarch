/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-article
 * Source: suncorp.com.au "Insights and stories" slick carousels of article cards
 * (sg-Carousel > .slick-track > .sg-Carousel-item).
 *
 * Block table (blocks/carousel-article/README.md): one row per article card,
 *   [image] [heading with link, short text]
 * Card images are CSS backgrounds on div.article-img whose URL carries CSS-escaped
 * slashes ("/2f%20content/2f%20dam/..."); they are decoded back to the asset URL.
 * The section heading above the carousel stays as default content; the generated
 * "Showing X of Y" counter and slick clones are dropped.
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function backgroundUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/url\(\s*(?:&quot;|["'])?(.*?)(?:&quot;|["'])?\s*\)/);
  if (!m) return null;
  let url = m[1].replace(/\\2f\s?/gi, '/');
  // CSS-escaped "\2f " serialised as "/2f%20" or "/2f"
  url = url.replace(/\/2f(?:%20|\s)?/gi, '/').replace(/([^:])\/\/+/g, '$1/');
  return url;
}

export default function parse(element, { document, params }) {
  const items = [...element.querySelectorAll('.sg-Carousel-item')]
    .filter((item) => !item.classList.contains('slick-cloned'));

  const cells = items.map((item) => {
    let img = item.querySelector('img');
    if (!img) {
      const src = backgroundUrl(item.querySelector('.article-img, [style*="url("]'));
      if (src) {
        img = document.createElement('img');
        img.src = src;
      }
    }
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    const overlay = item.querySelector('a.carousel-linkContainer, a[href]');
    const href = (heading && heading.querySelector('a[href]') && heading.querySelector('a[href]').getAttribute('href'))
      || (overlay && overlay.getAttribute('href'));
    const content = document.createElement('div');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text(heading);
        h.append(a);
      } else {
        h.textContent = text(heading);
      }
      if (img && !img.alt) img.alt = text(heading);
      content.append(h);
    }
    const desc = item.querySelector('.carousel-description');
    if (desc && text(desc)) {
      const p = document.createElement('p');
      p.textContent = text(desc);
      content.append(p);
    }
    return [img || '', content];
  }).filter(([, content]) => text(content));

  // Section heading above the carousel stays as default content before the block.
  const intro = [...element.querySelectorAll('div.rte')]
    .filter((r) => !r.closest('.sg-Carousel') && text(r))
    .flatMap((r) => [...r.children]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-article', cells });
  if (intro.length) element.before(...intro);
  element.replaceWith(block);
}
