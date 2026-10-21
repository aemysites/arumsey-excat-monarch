/* eslint-disable */
/* global WebImporter */

/**
 * hero-login parser (citi.com app-hero-reskin).
 *
 * Block table (one column, see blocks/hero-login/README.md):
 *   row: background picture (from the section's inline background-image), optional
 *   row: product image (desktop card art), optional
 *   row: copy cell - eyebrow, heading, intro text, CTA links
 *   row: sign-on cell - field labels (User ID, Password, Remember User ID) as plain
 *        paragraphs, a "Sign On" link, helper links (Register / Activate,
 *        Forgot User ID or Password), Passwordless Sign On.
 *
 * The decorator rebuilds the form from the labels, so source inputs, show/hide
 * buttons and modal dialogs are dropped. CTA <button>s have no URL in the DOM; the
 * primary CTA takes the href of the product-image link (same offer). Other JS-only
 * CTAs (modal openers) are kept as links to "#" for authors to complete.
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
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/background(?:-image)?:[^;]*url\((['"]?)(.*?)\1\)/i);
  return m && m[2] && !/^data:/i.test(m[2]) ? m[2] : '';
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.setAttribute('src', src);
  // alt text on citi.com sometimes contains escaped markup
  img.setAttribute('alt', (alt || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
  return img;
}

function isRealHref(href) {
  return !!href && !href.startsWith('#') && !/^javascript:/i.test(href);
}

function link(document, href, text) {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.textContent = text;
  return a;
}

function para(document, ...children) {
  const p = document.createElement('p');
  children.forEach((c) => p.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return p;
}

/** Copy inline content without UI chrome. */
function inlineClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, button, cds-icon, img, input').forEach((n) => n.remove());
  clone.querySelectorAll('*').forEach((n) => {
    ['class', 'id', 'style', 'role', 'aria-label', 'aria-hidden', 'title', 'tabindex'].forEach((a) => n.removeAttribute(a));
    [...n.attributes].filter((a) => a.name.startsWith('_ng')).forEach((a) => n.removeAttribute(a.name));
  });
  return clone;
}

function buildCopy(document, col, ctaHref) {
  const out = [];
  if (!col) return out;
  const headingSrc = col.querySelector('h1, h2, h3, .heading-title, [class*="heading-title"]');
  const eyebrow = col.querySelector('.subHeading-title, [class*="subHeading"], .eyebrow');
  if (eyebrow && eyebrow !== headingSrc && textOf(eyebrow)) {
    const p = document.createElement('p');
    p.append(...inlineClone(eyebrow).childNodes);
    out.push(p);
  }
  if (headingSrc && textOf(headingSrc)) {
    const h = document.createElement('h1');
    const clone = inlineClone(headingSrc);
    // drop a wrapping <strong>: the heading is already bold
    const only = clone.children.length === 1 && textOf(clone.children[0]) === textOf(clone) ? clone.children[0] : null;
    h.append(...(only && /^(STRONG|B)$/.test(only.tagName) ? only : clone).childNodes);
    out.push(h);
  }
  col.querySelectorAll('p, .introText').forEach((p) => {
    if (p === headingSrc || p === eyebrow || (headingSrc && headingSrc.contains(p))) return;
    if (out.some((o) => o.__src === p) || !textOf(p)) return;
    const np = document.createElement('p');
    np.append(...inlineClone(p).childNodes);
    np.__src = p;
    out.push(np);
  });
  // CTAs: real links first, then buttons resolved to the offer link
  const ctas = [];
  col.querySelectorAll('a[href], button').forEach((c) => {
    if (c.closest('p') && headingSrc !== c.closest('p') && out.some((o) => o.__src === c.closest('p'))) return;
    const label = textOf(inlineClone(c));
    if (!label) return;
    let href = c.tagName === 'A' ? c.getAttribute('href') : '';
    if (!isRealHref(href) && c.tagName === 'BUTTON' && !ctas.length && ctaHref) href = ctaHref;
    // JS-only CTA (opens a modal): keep the label, authors set the target
    if (!isRealHref(href)) href = '#';
    ctas.push(link(document, href, label));
  });
  ctas.forEach((a, i) => {
    if (i === 0) {
      const strong = document.createElement('strong');
      strong.append(a);
      out.push(para(document, strong));
    } else {
      out.push(para(document, a));
    }
  });
  out.forEach((o) => { delete o.__src; });
  return out;
}

function buildSignOn(document, root) {
  const out = [];
  if (!root) return out;
  const title = root.querySelector('.cds-signon-title, h2, h3, h4');
  if (title && textOf(title)) {
    const h = document.createElement('h3');
    h.textContent = textOf(title);
    out.push(h);
  }
  // field labels (plain paragraphs) - the decorator rebuilds inputs from them
  const labels = [];
  root.querySelectorAll('label').forEach((l) => {
    const t = textOf(l);
    if (t && !labels.includes(t)) labels.push(t);
  });
  labels.forEach((t) => out.push(para(document, t)));

  // account-type select options, if any
  const select = root.querySelector('select');
  if (select) {
    const ul = document.createElement('ul');
    select.querySelectorAll('option').forEach((o) => {
      if (!textOf(o)) return;
      const li = document.createElement('li');
      li.textContent = textOf(o);
      ul.append(li);
    });
    if (ul.children.length) out.push(ul);
  }

  // submit button -> "Sign On" link
  const submit = [...root.querySelectorAll('button')].find((b) => /^sign\s*on$/i.test(textOf(b)));
  if (submit || labels.length) {
    const form = root.querySelector('form[action]');
    const action = form && isRealHref(form.getAttribute('action')) ? form.getAttribute('action') : '#';
    out.push(para(document, link(document, action, submit ? textOf(submit) : 'Sign On')));
  }

  // helper links grouped by their row: Register / Activate, Forgot User ID or Password
  const used = new Set();
  const groups = [];
  const anchorContainers = root.querySelectorAll('.register-activate, .cds-signon-anchor.register > div, .readLine');
  const groupOf = (a) => a.closest('.register-activate') || a.closest('.cds-signon-anchor.register > div') || a;
  root.querySelectorAll('a[href]').forEach((a) => {
    if (!textOf(a) || !isRealHref(a.getAttribute('href'))) return;
    const g = anchorContainers.length ? groupOf(a) : a;
    if (!groups.includes(g)) groups.push(g);
  });
  groups.forEach((g) => {
    const p = document.createElement('p');
    if (g.tagName === 'A') {
      p.append(link(document, g.getAttribute('href'), textOf(g)));
    } else {
      // walk text and links in order, keeping connectors ("/", "Forgot", "or")
      const walk = (n) => {
        n.childNodes.forEach((c) => {
          if (c.nodeType === 3) {
            const t = c.textContent.replace(/\s+/g, ' ');
            if (t.trim()) p.append(document.createTextNode(` ${t.trim()} `));
            return;
          }
          if (c.nodeType !== 1 || c.matches('.ada-hidden, .sr-only, .visually-hidden, button, svg, cds-icon')) return;
          if (c.tagName === 'A') {
            if (isRealHref(c.getAttribute('href')) && textOf(c)) p.append(link(document, c.getAttribute('href'), textOf(c)));
            used.add(c);
            return;
          }
          walk(c);
        });
      };
      walk(g);
      // normalise whitespace between nodes
      const first = p.firstChild;
      if (first && first.nodeType === 3) first.textContent = first.textContent.replace(/^\s+/, '');
      const last = p.lastChild;
      if (last && last.nodeType === 3) last.textContent = last.textContent.replace(/\s+$/, '');
    }
    if (textOf(p)) out.push(p);
  });

  // other buttons with a label (e.g. Passwordless Sign On) - kept as plain text
  root.querySelectorAll('button').forEach((b) => {
    if (b === submit) return;
    const t = textOf(inlineClone(b));
    if (!t || /^(show|hide)/i.test(t) || b.closest('cds-input-button, .showHideBtn, .cds-modal')) return;
    if (out.some((o) => textOf(o) === t)) return;
    out.push(para(document, t));
  });
  return out;
}

export default function parse(element, { document, params }) {
  const cells = [];

  // background picture: inline style on the section (or the element itself)
  const bgHost = [element, ...element.querySelectorAll('[style*="url("]')].find((n) => bgUrl(n));
  const bg = bgUrl(bgHost);
  if (bg) cells.push([[makeImg(document, bg, '')]]);

  // columns: copy / product image / sign-on (fallback chain for layout drift)
  const signOnRoot = element.querySelector('cds-signon2, nga-login, app-hero-signon-wrapper, .passwordLoginBoxContainer, form');
  const signOnCol = signOnRoot ? (signOnRoot.closest('cds-column, .column-three, [class*="col-"]') || signOnRoot) : null;
  const allCols = [...element.querySelectorAll('cds-column, .cds-column')];
  const cols = allCols.length ? allCols : [...element.querySelectorAll('[class*="col-lg-"], [class*="col-md-"]')];
  const isMobileCol = (c) => /mobile/i.test(c.className || '');
  const copyCol = cols.find((c) => c !== signOnCol && !isMobileCol(c) && !(signOnCol && signOnCol.contains(c))
    && c.querySelector('p, h1, h2, h3, .heading-title, .subHeading-title') && textOf(c))
    || null;

  // product image: desktop copy preferred, mobile copy as fallback
  const imgs = [...element.querySelectorAll('img')].filter((i) => imgSrc(i) && !(signOnCol && signOnCol.contains(i)));
  const productImg = imgs.find((i) => !i.closest('[class*="mobile" i]')) || imgs[0];
  let ctaHref = '';
  if (productImg) {
    const a = productImg.closest('a[href]');
    if (a && isRealHref(a.getAttribute('href'))) ctaHref = a.getAttribute('href');
    cells.push([[makeImg(document, imgSrc(productImg), productImg.getAttribute('alt'))]]);
  }

  const copy = buildCopy(document, copyCol, ctaHref);
  if (copy.length) cells.push([copy]);

  const signOn = buildSignOn(document, signOnCol);
  if (signOn.length) cells.push([signOn]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-login', cells });
  element.replaceWith(block);
}
