/* eslint-disable */
/* global WebImporter */

/**
 * notice-box parser.
 *
 * Block table (see blocks/notice-box/README.md): one row; optional media cell
 * (image/icon only) followed by a body cell (heading, text, links; the last
 * stand-alone link is the CTA).
 *
 * Variant detection (generic DOM cues, first match wins):
 *   miranda / FDIC disclosure box (class *miranda*)      -> plain notice-box
 *   image + heading                                      -> icon-callout
 *   image, no heading                                    -> with-image
 *   tel: links or contact-us wrapper                     -> contact
 *   heading + text + link                                -> contact
 *   heading only (no text, no link)                      -> note
 *   text only (no heading, no link)                      -> note
 *   page-level h1 + text                                 -> blue
 *   otherwise                                            -> plain notice-box
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

function isRealHref(href) {
  return !!href && !href.startsWith('#') && !/^javascript:/i.test(href);
}

const SKIP = 'script, style, svg, cds-icon, citi-icon2, citi-modal, cds-modal-dialog, [role="dialog"], .ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, input, button:not([class*="cta"]):not([class*="btn"])';

function inlineClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(`${SKIP}, img, picture, button`).forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    if (!isRealHref((a.getAttribute('href') || '').trim())) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name !== 'href') n.removeAttribute(a.name); });
  });
  // drop empty inline wrappers left behind
  clone.querySelectorAll('b, strong, span, u, i, em').forEach((n) => {
    if (!n.textContent.trim() && !n.querySelector('br')) n.remove();
  });
  return clone;
}

function blockEl(document, tag, src) {
  const el = document.createElement(tag);
  el.append(...inlineClone(src).childNodes);
  return el;
}

/** Body content in document order. */
function bodyContent(document, root) {
  const out = [];
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(SKIP) || child.matches('img, picture')) return;
      const tag = child.tagName;
      if (/^H[1-6]$/.test(tag)) {
        if (textOf(child)) out.push(blockEl(document, tag.toLowerCase(), child));
        return;
      }
      if (tag === 'P' || tag === 'UL' || tag === 'OL') {
        if (textOf(inlineClone(child))) out.push(blockEl(document, tag === 'P' ? 'p' : tag.toLowerCase(), child));
        return;
      }
      if (tag === 'A' || tag === 'BUTTON') {
        const label = textOf(inlineClone(child));
        const href = tag === 'A' ? (child.getAttribute('href') || '').trim() : '';
        if (!label) return;
        const p = document.createElement('p');
        if (isRealHref(href)) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.textContent = label;
          p.append(a);
        } else {
          p.textContent = label;
        }
        out.push(p);
        return;
      }
      const hasBlockChild = child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div, section, img');
      if (!hasBlockChild) {
        if (textOf(inlineClone(child))) out.push(blockEl(document, 'p', child));
        return;
      }
      // mixed: own text runs next to block children -> wrap the text runs
      const ownText = [...child.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (ownText) {
        let run = null;
        [...child.childNodes].forEach((n) => {
          const isBlock = n.nodeType === 1 && n.matches('h1, h2, h3, h4, h5, h6, p, ul, ol, div, section, img');
          if (isBlock) {
            if (run && textOf(run)) out.push(run);
            run = null;
            const wrap = document.createElement('div');
            wrap.append(n.cloneNode(true));
            walk(wrap);
            return;
          }
          if (!run) run = document.createElement('p');
          if (n.nodeType === 3) run.append(document.createTextNode(n.textContent));
          else if (n.nodeType === 1 && !n.matches(SKIP)) run.append(...inlineClone(n).childNodes.length ? [inlineClone(n)] : []);
        });
        if (run && textOf(run)) out.push(run);
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return out;
}

function detectVariant(element, body, img) {
  const hasHeading = body.some((n) => /^H[1-6]$/.test(n.tagName));
  const hasText = body.some((n) => !/^H[1-6]$/.test(n.tagName) && !(n.querySelector('a') && textOf(n) === textOf(n.querySelector('a'))));
  // any source link counts (footnote anchors are unwrapped in the body)
  const hasLink = !!element.querySelector('a[href]') || body.some((n) => n.querySelector && n.querySelector('a[href]'));
  const cls = [element, ...element.querySelectorAll('[class]')].map((n) => n.getAttribute('class') || '').join(' ');
  if (/miranda/i.test(cls)) return null;
  if (img) return hasHeading ? 'icon-callout' : 'with-image';
  if (element.querySelector('a[href^="tel:"]') || /contactus|contact-us/i.test(cls)) return 'contact';
  if (hasHeading && hasText && hasLink) return 'contact';
  if (hasHeading && !hasText && !hasLink) return 'note';
  if (!hasHeading && hasText && !hasLink && element.querySelector('p')) return 'note';
  if (element.querySelector('h1') && hasText) return 'blue';
  return null;
}

export default function parse(element, { document, params }) {
  const imgEl = [...element.querySelectorAll('img')].find((i) => imgSrc(i));
  let media = null;
  if (imgEl) {
    media = document.createElement('img');
    media.setAttribute('src', imgSrc(imgEl));
    media.setAttribute('alt', (imgEl.getAttribute('alt') || '').trim());
  }

  const body = bodyContent(document, element);
  const variant = detectVariant(element, body, media);

  const row = [];
  if (media) row.push([media]);
  if (body.length) row.push(body);
  const cells = row.length ? [row] : [];

  const name = variant ? `notice-box (${variant})` : 'notice-box';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
