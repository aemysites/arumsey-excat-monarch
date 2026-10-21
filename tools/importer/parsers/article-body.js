/* eslint-disable */
/* global WebImporter */

/**
 * article-body: editorial article (citi.com Knowledge Center / Travel Guide).
 *
 * Output rows (all padded to 3 columns; the block ignores empty cells):
 *  - row 1 (hero):   hero image | eyebrow + H1 + date / read time + optional CTA
 *  - body rows:      one content cell (rich text, headings, lists, tables, images, resource tiles)
 *  - promo rows:     banner text | CTA link | logo image   (inline promo banners)
 *
 * Variants (README option classes), detected from generic source cues:
 *  - image: large hero image (.tkc-article-banner-image-large) or travel-guide article (recommended articles)
 *  - alt:   article without the "Additional Resources" strip, using the tkc promo banner
 *  - alt-2: article without the "Additional Resources" strip, using the ckc promo banner
 *  - plain: everything else
 */

const UNIT_SELECTOR = [
  '.tkc-article-banner-image',
  '.tkc-article-banner-image-large',
  '.article-details',
  '.tkc-button-explore',
  '.ckcbanner',
  '[class*="banner__container"]',
  '.citi-rte',
  '.cmp-text',
  'div.image',
  '.citi-title',
  '.citi-icon-text-tile-container',
  '.recommended-articles',
].join(', ');

const COLS = 3;

function pad(row) {
  while (row.length < COLS) row.push('');
  return row;
}

function cleanInline(root) {
  root.querySelectorAll('button, [aria-hidden="true"]:not(img), .sr-only, .visually-hidden, svg, script, style').forEach((el) => el.remove());
}

function firstImage(root) {
  const img = root.querySelector('img');
  if (!img) return null;
  const src = img.getAttribute('src') || img.getAttribute('data-desktop-src') || img.getAttribute('data-src');
  if (!src) return null;
  if (!img.getAttribute('src')) img.setAttribute('src', src);
  return img;
}

function detectVariant(element) {
  if (element.querySelector('.tkc-article-banner-image-large, .tkc-recommended-articles')) return 'image';
  const hasResources = element.querySelector('.tkc-additional-resource-container, .tkc-article-additional-resource-title');
  if (hasResources) return null;
  if (element.querySelector('.tkc-banner__container')) return 'alt';
  if (element.querySelector('.ckc-banner__container')) return 'alt-2';
  return null;
}

function buildHeroText(document, detailsList, ctaWrappers) {
  const text = document.createElement('div');
  if (detailsList.length) {
    const find = (sel) => detailsList.map((d) => d.querySelector(sel)).find(Boolean);
    const h1 = find('h1, .tkc-article-title');
    let eyebrow = find('.tkc-article-category-name');
    if (!eyebrow && h1) {
      const prev = h1.previousElementSibling;
      if (prev && prev.tagName === 'P') eyebrow = prev;
    }
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      text.append(p);
    }
    if (h1) {
      const h = document.createElement('h1');
      h.append(...h1.childNodes);
      text.append(h);
    }
    // date / read time lines (icons dropped)
    const seen = new Set();
    detailsList.forEach((details) => {
      details.querySelectorAll('.tkc-article-list p, .tkc-article-time-text').forEach((p) => {
        const t = p.textContent.replace(/\s+/g, ' ').trim();
        if (!t || seen.has(t)) return;
        seen.add(t);
        const np = document.createElement('p');
        np.textContent = t;
        text.append(np);
      });
    });
  }
  ctaWrappers.forEach((w) => {
    w.querySelectorAll('a[href]').forEach((a) => {
      if (!a.textContent.trim()) return;
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      p.append(link);
      text.append(p);
    });
  });
  return text;
}

function buildPromo(document, banner) {
  cleanInline(banner);
  const ctaLinks = [...banner.querySelectorAll('.banner__cta a[href], a.cta-primary-btn')]
    .filter((a, i, arr) => a.textContent.trim() && arr.indexOf(a) === i);
  const logoImg = firstImage(banner.querySelector('.banner__citi-logo, .banner__card-image, .banner__logo') || document.createElement('div'));

  const cta = document.createElement('div');
  ctaLinks.forEach((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    p.append(link);
    cta.append(p);
    a.remove();
  });

  const textCell = document.createElement('div');
  const headline = banner.querySelector('.banner__headline') || banner;
  headline.querySelectorAll('.banner__cta, .banner__citi-logo, .banner__card-image').forEach((el) => el.remove());
  headline.querySelectorAll('h1, h2, h3, h4, p').forEach((el) => {
    if (!el.textContent.trim()) return;
    if (el.closest('p') && el.closest('p') !== el) return;
    textCell.append(el);
  });
  if (!textCell.children.length && headline.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = headline.textContent.replace(/\s+/g, ' ').trim();
    textCell.append(p);
  }
  if (!textCell.textContent.trim() && !cta.textContent.trim() && !logoImg) return null;
  return [textCell.textContent.trim() ? textCell : '', cta.textContent.trim() ? cta : '', logoImg || ''];
}

function buildTile(document, tile) {
  const out = [];
  const img = firstImage(tile.querySelector('[class*="image-wrapper"]') || tile);
  if (img) {
    const p = document.createElement('p');
    p.append(img);
    out.push(p);
  }
  const heading = tile.querySelector('[class*="tile-heading"] h1, [class*="tile-heading"] h2, [class*="tile-heading"] h3, [class*="tile-heading"] h4, h3, h4');
  if (heading) {
    cleanInline(heading);
    const h = document.createElement('h3');
    h.append(...heading.childNodes);
    out.push(h);
  }
  tile.querySelectorAll('[class*="tile-description"]').forEach((desc) => {
    const paras = desc.querySelectorAll('p');
    (paras.length ? [...paras] : [desc]).forEach((p) => {
      if (!p.textContent.trim()) return;
      const np = document.createElement('p');
      np.append(...p.childNodes);
      out.push(np);
    });
  });
  return out;
}

function buildRecommended(document, rec) {
  const out = [];
  const title = rec.querySelector('h2, h3');
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title.textContent.trim();
    out.push(h);
  }
  const browse = rec.querySelector('[class*="browse"] a[href]');
  if (browse && browse.textContent.trim()) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = browse.getAttribute('href');
    a.textContent = browse.textContent.replace(/\s+/g, ' ').trim();
    p.append(a);
    out.push(p);
  }
  const seen = new Set();
  rec.querySelectorAll('[class*="article-wrapper"] a[href], [class*="article-item"]').forEach((node) => {
    const link = node.matches('a[href]') ? node : node.closest('a[href]');
    const item = node.matches('a[href]') ? node : node;
    const href = link ? link.getAttribute('href') : '';
    const key = href || item.textContent.trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    const img = firstImage(item);
    if (img) {
      const p = document.createElement('p');
      p.append(img);
      out.push(p);
    }
    const t = item.querySelector('[class*="article-title"], h3, h4');
    if (t) {
      const h = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = t.textContent.trim();
        h.append(a);
      } else {
        h.textContent = t.textContent.trim();
      }
      out.push(h);
    }
    const d = item.querySelector('[class*="article-description"]');
    if (d && d.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = d.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

export default function parse(element, { document, params }) {
  const variant = detectVariant(element);
  const rows = [];

  let heroImage = null;
  const heroDetails = [];
  const heroCtas = [];
  let body = [];

  const flushBody = () => {
    const nodes = body.filter((n) => n && (n.textContent.trim() || (n.querySelector && n.querySelector('img, picture, table')) || n.tagName === 'IMG' || n.tagName === 'TABLE'));
    if (nodes.length) rows.push(pad([nodes]));
    body = [];
  };

  const accepted = [];
  [...element.querySelectorAll(UNIT_SELECTOR)].forEach((unit) => {
    if (accepted.some((a) => a.contains(unit))) return;
    accepted.push(unit);

    if (unit.matches('.tkc-article-banner-image, .tkc-article-banner-image-large')) {
      if (!heroImage) heroImage = firstImage(unit);
      return;
    }
    if (unit.matches('.article-details')) {
      heroDetails.push(unit);
      return;
    }
    if (unit.matches('.tkc-button-explore')) {
      heroCtas.push(unit);
      return;
    }
    if (unit.matches('.ckcbanner, [class*="banner__container"]')) {
      const promo = buildPromo(document, unit);
      if (promo) {
        flushBody();
        rows.push(pad(promo));
      }
      return;
    }
    if (unit.matches('.citi-rte, .cmp-text')) {
      cleanInline(unit);
      // drop empty paragraphs / spacer elements
      [...unit.children].forEach((c) => {
        if (!c.textContent.trim() && !c.querySelector('img, picture, table') && !['IMG', 'TABLE', 'HR'].includes(c.tagName)) c.remove();
      });
      body.push(...[...unit.childNodes].filter((n) => n.nodeType === 1));
      return;
    }
    if (unit.matches('div.image')) {
      const img = firstImage(unit);
      if (img) {
        const p = document.createElement('p');
        const link = unit.querySelector('a[href]');
        if (link && link.contains(img)) {
          const a = document.createElement('a');
          a.href = link.getAttribute('href');
          a.append(img);
          p.append(a);
        } else {
          p.append(img);
        }
        body.push(p);
      }
      return;
    }
    if (unit.matches('.citi-title')) {
      const h = unit.querySelector('h1, h2, h3, h4, h5, h6');
      if (h && h.textContent.trim()) {
        const nh = document.createElement(h.tagName === 'H1' ? 'h2' : h.tagName.toLowerCase());
        nh.textContent = h.textContent.trim();
        body.push(nh);
      }
      return;
    }
    if (unit.matches('.citi-icon-text-tile-container')) {
      body.push(...buildTile(document, unit));
      return;
    }
    if (unit.matches('.recommended-articles')) {
      body.push(...buildRecommended(document, unit));
    }
  });
  flushBody();

  const heroText = buildHeroText(document, heroDetails, heroCtas);
  if (heroImage || heroText.textContent.trim()) {
    rows.unshift(pad([heroImage || '', heroText.textContent.trim() ? heroText : '']));
  }

  if (!rows.length) {
    // fallback: whole element as article body
    cleanInline(element);
    const div = document.createElement('div');
    div.append(...element.childNodes);
    rows.push(pad([[div]]));
  }

  const name = variant ? `article-body (${variant})` : 'article-body';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: rows });
  element.replaceWith(block);
}
