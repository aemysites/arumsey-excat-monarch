/* eslint-disable */
/* global WebImporter */

/**
 * hero-photo parser.
 *
 * Block table (one column, see blocks/hero-photo/README.md):
 *   row: background photo (picture-only; from inline background-image or an <img>)
 *   row: copy - optional eyebrow paragraph, heading, text, CTA links (one per paragraph)
 *
 * Variant (always one of the three option classes):
 *   gradient-overlay      - a gradient overlay layer element (class *gradient*)
 *   text-on-photo         - copy has CTAs (buttons/links) or a text box (.text-space)
 *   centred-heading-only  - otherwise (heading, at most a short description)
 *
 * CTA buttons / javascript: links have no URL in the DOM; they are kept as links to
 * "#" so the authored CTA is not lost (authors set the target).
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function imgSrc(img) {
  if (!img) return '';
  const candidates = [
    img.getAttribute('src'),
    img.getAttribute('data-src'),
    (img.getAttribute('srcset') || img.getAttribute('data-srcset') || '').split(/[\s,]+/)[0],
  ];
  return candidates.find((s) => s && !/^data:/i.test(s)) || '';
}

function bgUrl(el) {
  const style = (el && el.getAttribute && el.getAttribute('style')) || '';
  const m = style.match(/background(?:-image)?\s*:[^;]*?url\((['"]?)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.setAttribute('alt', (alt || '').replace(/<[^>]*>/g, '').trim());
  return img;
}

function isRealHref(href) {
  return !!href && !href.startsWith('#') && !/^javascript:/i.test(href);
}

function inlineClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, cds-icon, img, input, button').forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    if (!isRealHref((a.getAttribute('href') || '').trim())) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name !== 'href') n.removeAttribute(a.name); });
  });
  return clone;
}

const EYEBROW = '.banner-sub-title, .hero-eyebrow, .hero-subheader, [class*="eyebrow"], [class*="sub-title"], [class*="subtitle"]';
const SKIP = 'script, style, svg, cds-icon, citi-modal, cds-modal-dialog, [role="dialog"], .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, input';

export default function parse(element, { document, params }) {
  const cells = [];

  // background photo
  const bgHost = [element, ...element.querySelectorAll('[style*="url("]')].find((n) => bgUrl(n));
  let bg = bgUrl(bgHost);
  let bgAlt = '';
  if (!bg) {
    const img = [...element.querySelectorAll('img')].find((i) => imgSrc(i));
    if (img) { bg = imgSrc(img); bgAlt = img.getAttribute('alt') || ''; }
  }
  if (bg) cells.push([[makeImg(document, bg, bgAlt)]]);

  // copy, in document order
  const copy = [];
  const ctas = [];
  let eyebrow = null;
  let heading = null;
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(SKIP)) return;
      const tag = child.tagName;
      if (tag === 'BUTTON' || tag === 'A') {
        const label = textOf(inlineClone(child));
        if (!label) return;
        const href = tag === 'A' ? (child.getAttribute('href') || '').trim() : '';
        ctas.push({ href: isRealHref(href) ? href : '#', label });
        return;
      }
      const isEyebrow = child.matches(EYEBROW) && !child.querySelector('h1, h2, h3, p');
      if (isEyebrow && textOf(child) && !heading) {
        eyebrow = document.createElement('p');
        eyebrow.append(...inlineClone(child).childNodes);
        copy.push(eyebrow);
        return;
      }
      if (/^H[1-6]$/.test(tag)) {
        if (!textOf(child)) return;
        const h = document.createElement(heading ? 'h2' : 'h1');
        h.append(...inlineClone(child).childNodes);
        if (!heading) heading = h;
        copy.push(h);
        return;
      }
      if (tag === 'P' || tag === 'SMALL' || tag === 'UL' || tag === 'OL') {
        if (!textOf(child)) return;
        const el = document.createElement(tag === 'SMALL' ? 'p' : tag.toLowerCase());
        el.append(...inlineClone(child).childNodes);
        copy.push(el);
        return;
      }
      const hasBlockChild = child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, button, a, small');
      if (!hasBlockChild && textOf(child)) {
        const p = document.createElement('p');
        p.append(...inlineClone(child).childNodes);
        copy.push(p);
        return;
      }
      walk(child);
    });
  };
  walk(element);

  ctas.forEach((c, i) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', c.href);
    a.textContent = c.label;
    if (i === 0) {
      const strong = document.createElement('strong');
      strong.append(a);
      p.append(strong);
    } else {
      p.append(a);
    }
    copy.push(p);
  });
  if (copy.length) cells.push([copy]);

  // variant
  let variant = 'centred-heading-only';
  if (element.querySelector('[class*="gradient"]') || /gradient/.test(element.className || '')) {
    variant = 'gradient-overlay';
  } else if (ctas.length || element.querySelector('.text-space, .text-box, [class*="textbox"]')) {
    variant = 'text-on-photo';
  }

  const block = WebImporter.Blocks.createBlock(document, { name: `hero-photo (${variant})`, cells });
  element.replaceWith(block);
}
