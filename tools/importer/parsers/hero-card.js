/* eslint-disable */
/* global WebImporter */

/**
 * hero-card parser.
 * Block table (blocks/hero-card/README.md):
 *   [optional] picture-only row: background image (full-bleed photo / panel background)
 *   [optional] picture-only row: card image (photo layouts, where the card art sits in the copy)
 *   copy row: copy cell [+ card image cell, in source side order]
 *     copy cell: eyebrow <p>, optional badge <p><em>, heading, text, bold Apply link,
 *     optional highlights <ul> (rates/fees stats)
 *   extras: earn-rate grid (one row, one cell per accelerator card), legal copy +
 *     pricing links (one cell), partner logo (one cell)
 *
 * Source families:
 *   tds-hero-banner (full-bleed photo hero, card art inside the copy)
 *   tds-feature with .feature-layout (panel / side-by-side restatement)
 *   .header-cards (retail card hero: card art + tagline + Apply button)
 *
 * Variants:
 *   photo-centred: tds-hero-banner with the multiplier accelerator cards (.accelerator-card)
 *   photo: other tds-hero-banner heroes
 *   panel: tds-feature restatements on a coloured / image / framed panel
 *     (not the white side-by-side .bg_inline_6_6 layout)
 *   null: .bg_inline_6_6 restatements and .header-cards heroes
 *
 * The eyebrow card name stays an h1 when the source marks it as one (the photo hero on card
 * PDPs, where it is the page's only h1); other eyebrows become the eyebrow paragraph. A retail "Apply Now" button with no URL takes the apply URL
 * of the pricing-terms link (hash removed). Footnote markers without a URL stay
 * as plain superscripts.
 */

const CHROME = 'script, style, noscript, svg, cds-icon, .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, [class*="spacer-"]';

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function realHref(href) {
  const h = (href || '').trim();
  if (!h || h === '#' || /^javascript:/i.test(h)) return '';
  return h;
}

function bestSrc(img) {
  const set = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)[0]).filter((s) => s && !/^data:/i.test(s));
  const candidates = [img.getAttribute('src'), img.getAttribute('data-src')].filter((s) => s && !/^data:/i.test(s));
  return candidates[0] || set[0] || '';
}

function desktopSrc(img) {
  // backgrounds: the widest srcset candidate is the desktop asset
  const set = (img.getAttribute('srcset') || '').split(',').map((s) => {
    const [u, w] = s.trim().split(/\s+/);
    return { u, w: parseInt(w || '0', 10) };
  }).filter((x) => x.u && !/^data:/i.test(x.u));
  if (set.length) return set.sort((a, b) => b.w - a.w)[0].u;
  return bestSrc(img);
}

function makeImg(document, src, alt) {
  if (!src) return null;
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.setAttribute('alt', (alt || '').trim());
  return img;
}

function bgUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/background-image:\s*url\((['"]?|&quot;)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

function inline(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('img, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    if (!realHref(a.getAttribute('href'))) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (!['href', 'target'].includes(a.name)) n.removeAttribute(a.name);
    });
  });
  clone.querySelectorAll('div, p, span, section, h1, h2, h3, h4, h5, h6').forEach((n) => n.replaceWith(...n.childNodes));
  const walker = clone.ownerDocument.createTreeWalker(clone, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.remove());
  return [...clone.childNodes];
}

function wrap(document, tag, el) {
  if (!el || !textOf(el)) return null;
  const out = document.createElement(tag);
  out.append(...inline(el));
  return textOf(out) ? out : null;
}

function linkP(document, href, label, bold) {
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.append(...label);
  if (bold) {
    const strong = document.createElement('strong');
    strong.append(a);
    p.append(strong);
  } else {
    p.append(a);
  }
  return p;
}

/** Collect copy, extras and images from the hero's content subtree. */
function readContent(document, root, ctx) {
  const copy = [];
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(CHROME)) return;
      if (child.matches('tds-card-art, app-card-art, .card-art')) {
        const img = child.querySelector('img');
        if (img && !ctx.cardImg) ctx.cardImg = makeImg(document, bestSrc(img), img.getAttribute('alt'));
        return;
      }
      if (child.matches('.abtest-accelerator-bar, ul') && child.querySelector(':scope > .accelerator-card, :scope > li.accelerator-bar')) {
        const cards = [...child.querySelectorAll(':scope > .accelerator-card, :scope > li.accelerator-bar')];
        const row = cards.map((card) => {
          const cell = [];
          const h = card.querySelector('h1, h2, h3, h4, h5, h6');
          const hh = h && wrap(document, h.tagName.toLowerCase(), h);
          if (hh) cell.push(hh);
          const values = [...card.querySelectorAll('.value')].map(textOf).filter(Boolean);
          if (values.length) {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = values.join(' | ');
            p.append(strong);
            cell.push(p);
          }
          const descs = [...card.querySelectorAll('p, .item-description')]
            .filter((p, i, all) => !all.some((o, j) => j !== i && o.contains(p)));
          descs.forEach((d) => {
            // a description block may hold its own paragraphs: keep them separate
            const inner = [...d.querySelectorAll(':scope > p')];
            if (inner.length && !d.matches('p')) {
              const lead = d.cloneNode(true);
              lead.querySelectorAll(':scope > p').forEach((n) => n.remove());
              const w0 = wrap(document, 'p', lead);
              if (w0) cell.push(w0);
              inner.forEach((ip) => { const w = wrap(document, 'p', ip); if (w) cell.push(w); });
              return;
            }
            const w = wrap(document, 'p', d);
            if (w) cell.push(w);
          });
          return cell;
        }).filter((c) => c.length);
        if (row.length) ctx.extras.push(row);
        return;
      }
      if (child.matches('tds-pdp-pricing, .promo-offer-disclaimer, .pricing-link, .pricing-container')) {
        const legal = [];
        [...child.querySelectorAll('.pricing-section__text, .feature-text, .disclaimer')]
          .filter((t, i, all) => !all.some((o, j) => j !== i && o.contains(t)))
          .forEach((t) => {
          const p = wrap(document, 'p', t);
          if (p) legal.push(p);
        });
        const links = [...child.querySelectorAll('li')].length ? [...child.querySelectorAll('li')] : [...child.querySelectorAll('a')];
        links.forEach((item) => {
          const a = item.tagName === 'A' ? item : item.querySelector('a');
          const sup = item.tagName === 'LI' ? item.querySelector(':scope > sup') : null;
          const p = document.createElement('p');
          if (sup && textOf(sup)) {
            const s = document.createElement('sup');
            s.textContent = textOf(sup);
            p.append(s);
          }
          const href = a ? realHref(a.getAttribute('href')) : '';
          if (a && href) {
            const link = document.createElement('a');
            link.setAttribute('href', href);
            link.append(...inline(a));
            p.append(link);
            if (!ctx.termsHref) ctx.termsHref = href;
          } else if (a) {
            p.append(...inline(a));
          }
          if (textOf(p)) legal.push(p);
        });
        if (legal.length) ctx.legal.push(...legal);
        return;
      }
      if (child.matches('tds-flag, .benefit-flag, .header-feature-flag, .green-tag')) {
        const flag = child.querySelector('.flag, .green-tag-text') || child;
        if (textOf(flag)) {
          const p = document.createElement('p');
          const em = document.createElement('em');
          // badge text keeps its footnote marker but not the link (block badge rule)
          const nodes = inline(flag);
          const holder = document.createElement('div');
          holder.append(...nodes);
          holder.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
          em.append(...holder.childNodes);
          p.append(em);
          copy.push(p);
        }
        return;
      }
      if (child.matches('.eyebrow, .feature-restatement__eyebrow')) {
        // The card name is the page's h1 on the card PDPs: keep the level (the block styles an h1
        // followed by the headline as the eyebrow).
        const p = wrap(document, child.querySelector('h1') ? 'h1' : 'p', child);
        if (p) copy.push(p);
        return;
      }
      if (child.matches('tds-ratesfees-container, .rates-fees-container')) {
        const ul = document.createElement('ul');
        child.querySelectorAll('.rates-fees-item').forEach((item) => {
          const li = document.createElement('li');
          const value = item.querySelector('.text');
          const desc = item.querySelector('.description');
          if (value && textOf(value)) {
            const strong = document.createElement('strong');
            strong.append(...inline(value));
            li.append(strong);
          }
          if (desc && textOf(desc)) {
            if (li.childNodes.length) li.append(' ');
            li.append(...inline(desc));
          }
          if (textOf(li)) ul.append(li);
        });
        // Icon highlights (tds-ratesfees.custom-ratefees: svg icon + "No late fee ever" text).
        // Walk all child nodes: html2md unwraps the class-less <span> before transform, leaving a
        // bare text node next to the footnote <sup>.
        child.querySelectorAll('.custom-ratefees .rate-content').forEach((item) => {
          const li = document.createElement('li');
          li.append(...inline(item));
          if (textOf(li)) ul.append(li);
        });
        if (ul.children.length) copy.push(ul);
        return;
      }
      if (child.matches('tds-cta-section, .cta-wrapper, ui-card-button')) {
        const ctas = [...child.querySelectorAll('a, button')];
        ctas.forEach((c, i) => {
          const label = inline(c);
          if (!textOf(c)) return;
          let href = c.tagName === 'A' ? realHref(c.getAttribute('href')) : '';
          if (!href && /apply/i.test(textOf(c))) {
            ctx.pendingApply = { label, index: copy.length };
            return;
          }
          if (!href) return;
          copy.push(linkP(document, href, label, i === 0));
        });
        return;
      }
      if (/^H[1-6]$/.test(child.tagName)) {
        const h = wrap(document, child.tagName.toLowerCase(), child);
        if (h) copy.push(h);
        return;
      }
      if (child.matches('ul, ol')) {
        if (!textOf(child)) return;
        const list = document.createElement(child.tagName.toLowerCase());
        child.querySelectorAll(':scope > li').forEach((li) => {
          const item = document.createElement('li');
          item.append(...inline(li));
          if (textOf(item)) list.append(item);
        });
        if (list.children.length) copy.push(list);
        return;
      }
      if (child.matches('img')) {
        // partner logo inside the copy area
        const img = makeImg(document, bestSrc(child), child.getAttribute('alt'));
        if (img) ctx.logos.push(img);
        return;
      }
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const hasBlock = child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, img, button, tds-cta-section, tds-flag, tds-ratesfees-container, tds-pdp-pricing, tds-card-art, app-card-art');
      if (child.matches('p') || (textOf(child) && (!hasBlock || (ownText && !child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div'))))) {
        const p = wrap(document, 'p', child);
        if (p) copy.push(p);
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return copy;
}

export default function parse(element, { document, params }) {
  const ctx = { cardImg: null, extras: [], legal: [], logos: [], termsHref: '', pendingApply: null };
  const cells = [];
  let variant = null;

  const isPhotoHero = element.matches('tds-hero-banner') || !!element.querySelector('.hero-feature-grid, tds-feature-hero');
  const layout = element.querySelector('.feature-layout');
  const isHeaderCards = element.matches('.header-cards') || !!element.querySelector('.header-cards');

  let background = null;
  let sideImg = null;
  let imageFirst = false;
  let copyRoot = element;

  if (isPhotoHero) {
    const bgImg = element.querySelector('.hero-feature-grid__img, .hero-placeholder');
    if (bgImg) background = makeImg(document, desktopSrc(bgImg), '');
    copyRoot = element.querySelector('.hero-feature-section__content') || element;
    variant = element.querySelector('.abtest-accelerator-bar, .accelerator-card') ? 'photo-centred' : 'photo';
  } else if (layout) {
    const bg = bgUrl(layout) || bgUrl(element.querySelector('[style*="background-image"]'));
    if (bg) background = makeImg(document, bg, '');
    const sides = [...layout.querySelectorAll(':scope > .feature-layout__left, :scope > .feature-layout__right')];
    const imgSide = sides.find((s) => !textOf(s) && s.querySelector('img'));
    const textSide = sides.find((s) => textOf(s)) || layout;
    if (imgSide) {
      const img = imgSide.querySelector('img');
      sideImg = makeImg(document, bestSrc(img), img.getAttribute('alt'));
      imageFirst = !!(imgSide.compareDocumentPosition(textSide) & 4);
    }
    copyRoot = textSide;
    variant = element.querySelector('.bg_inline_6_6') || element.matches('.bg_inline_6_6') ? null : 'panel';
  } else if (isHeaderCards) {
    const root = element.matches('.header-cards') ? element : element.querySelector('.header-cards');
    copyRoot = root;
  }

  const copy = readContent(document, copyRoot, ctx);
  if (!sideImg && ctx.cardImg) {
    if (isPhotoHero) {
      // card art lives inside the photo hero copy: own picture row after the background
    } else {
      sideImg = ctx.cardImg;
      ctx.cardImg = null;
      imageFirst = isHeaderCards;
    }
  }
  if (ctx.pendingApply) {
    const href = (ctx.termsHref || '').replace(/#.*$/, '');
    const { label, index } = ctx.pendingApply;
    if (href) copy.splice(index, 0, linkP(document, href, label, true));
    else {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.append(...label);
      p.append(strong);
      copy.splice(index, 0, p);
    }
  }

  if (background) cells.push([[background]]);
  if (isPhotoHero && ctx.cardImg) cells.push([[ctx.cardImg]]);
  if (copy.length || sideImg) {
    const row = [];
    if (sideImg && imageFirst) row.push([sideImg]);
    if (copy.length) row.push(copy);
    if (sideImg && !imageFirst) row.push([sideImg]);
    cells.push(row);
  }
  ctx.extras.forEach((row) => cells.push(row));
  if (ctx.legal.length) cells.push([ctx.legal]);
  if (ctx.logos.length) cells.push([ctx.logos.map((img) => { const p = document.createElement('p'); p.append(img); return p; })]);

  // pad rows to a uniform width
  const width = Math.max(1, ...cells.map((r) => r.length));
  cells.forEach((r) => { while (r.length < width) r.push(''); });

  const name = variant ? `hero-card (${variant})` : 'hero-card';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
