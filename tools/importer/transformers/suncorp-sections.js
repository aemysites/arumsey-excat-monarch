/* eslint-disable */
/* global WebImporter */

/**
 * Suncorp sections transformer (shared by all templates).
 *
 * Uses payload.template.sections[] ({ id, selector[], style }):
 *  - each selector array is tried in order, first match wins;
 *  - sections that live outside <main> (e.g. the disclaimer) are moved to the
 *    end of <main> so they become the last section;
 *  - sections nested inside another section (e.g. the sidebar column inside an
 *    article grid row) are moved right after their enclosing section so the
 *    article section closes before them and they open their own section;
 *  - the sidebar's share/follow icon table (and its "Follow us" heading) is removed;
 *  - beforeTransform inserts <hr> breaks (each marked with data-excat-section-id; the first
 *    section's break is temporary), afterTransform adds Section Metadata blocks;
 *  - a section without a template `style` takes one from its source background class
 *    (canvas__container > section > div.canvas__bg_image, see BG_STYLES);
 *  - a section whose default-content text (div.default.rte headings / paragraphs) is mostly
 *    centred on the source (inline text-align: center) also gets `center` ("grey, center");
 *  - afterTransform finally collapses empty sections (two breaks with nothing between them).
 */

const MARKER = 'data-excat-section-id';
const CENTER = 'data-excat-center';

// Source section background classes -> section styles (white, noBackground and the photo
// backgrounds, BgPlaceholder--responsive-image / --image, get none).
const BG_STYLES = [
  ['BgPlaceholder--neutral', 'light-grey'],
  ['BgPlaceholder--grey', 'grey'],
  ['BgPlaceholder--secondary', 'teal'],
  ['sg-u-bgSUN2020lightestgreen', 'light-teal'],
  ['sg-u-bgONESUNlightestgreen', 'light-teal'],
  ['sg-u-bgONESUNcoolgreen', 'cool-green'],
  ['BgPlaceholder--dark', 'dark'],
];
const RTE_TEXT = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map((t) => `div.default.rte ${t}`).join(', ');
// Content that makes a section non-empty.
const CONTENT_ELEMENTS = new Set(['IMG', 'PICTURE', 'VIDEO', 'IFRAME', 'TABLE', 'SVG', 'svg']);
// The importer's preProcess drops empty <i> icon fonts before transformers run, so also match the
// icon links that wrap them.
const SOCIAL_ICONS = [
  'i[class*="Icon-twitter"]', 'i[class*="Icon-linkedin"]', 'i[class*="Icon-facebook"]', 'i[class*="Icon-instagram"]',
  'a.u-Icon--link[href*="x.com"]', 'a.u-Icon--link[href*="twitter.com"]', 'a.u-Icon--link[href*="linkedin.com"]',
  'a.u-Icon--link[href*="facebook.com"]', 'a.u-Icon--link[href*="instagram.com"]',
].join(', ');

// Resolved section elements, carried from beforeTransform to afterTransform.
const resolvedByDoc = new WeakMap();

function firstMatch(document, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    try {
      const el = document.querySelector(sel);
      if (el) return el;
    } catch (e) { /* invalid selector, try next */ }
  }
  return null;
}

function removeSocialFollow(container) {
  const tables = new Set();
  container.querySelectorAll(SOCIAL_ICONS).forEach((icon) => {
    const table = icon.closest('.sg-Flextable');
    if (table && container.contains(table)) tables.add(table);
  });
  tables.forEach((table) => {
    // Climb wrappers that hold nothing but this table.
    let target = table;
    while (target.parentElement && target.parentElement !== container
      && target.parentElement.children.length === 1) {
      target = target.parentElement;
    }
    // "Follow us" heading right before it (possibly in a preceding wrapper).
    let prev = target.previousElementSibling;
    while (prev && !prev.textContent.trim() && !prev.querySelector('img, picture')) {
      prev = prev.previousElementSibling;
    }
    if (prev && /^\s*follow\s+us\b/i.test(prev.textContent) && prev.textContent.trim().length < 60) {
      prev.remove();
    }
    target.remove();
  });
  // A "Follow us" heading the icon table no longer sits next to (the icons were in another wrapper).
  container.querySelectorAll('p, h2, h3, h4, h5, h6, strong').forEach((el) => {
    if (el.isConnected && /^\s*follow\s+us\s*$/i.test(el.textContent)) (el.closest('p') || el).remove();
  });
}

/** Section style from the source background class of a canvas__container section. */
function backgroundStyle(el) {
  let bg = null;
  try {
    bg = el.querySelector(':scope > section > div.canvas__bg_image');
  } catch (e) { /* :scope unsupported */ }
  if (!bg && el.matches && el.matches('div.canvas__bg_image')) bg = el;
  if (!bg) return null;
  const hit = BG_STYLES.find(([cls]) => bg.classList.contains(cls));
  return hit ? hit[1] : null;
}

function isCentred(textEl, stop) {
  for (let n = textEl; n && n !== stop; n = n.parentElement) {
    if (/text-align\s*:\s*center/i.test(n.getAttribute('style') || '')) return true;
    if (n.matches('div.default.rte')) break;
  }
  return false;
}

/** Tags rte headings/paragraphs with their source alignment (inline styles may not survive). */
function tagAlignment(el) {
  el.querySelectorAll(RTE_TEXT).forEach((t) => {
    if (!t.textContent.trim()) return;
    t.setAttribute(CENTER, isCentred(t, el) ? '1' : '0');
  });
}

/** True when most of the section's remaining default-content text (not in blocks) is centred. */
function mostlyCentred(el) {
  if (!el || !el.isConnected) return false;
  const texts = [...el.querySelectorAll(`[${CENTER}]`)].filter((t) => !t.closest('table') && t.textContent.trim());
  if (!texts.length) return false;
  const centred = texts.filter((t) => t.getAttribute(CENTER) === '1').length;
  return centred * 2 > texts.length;
}

function isSectionMetadata(el) {
  if (el.tagName !== 'TABLE') return false;
  const cell = el.querySelector('th, td');
  return !!cell && /^\s*section[\s-]metadata\s*$/i.test(cell.textContent);
}

/**
 * Removes section breaks that would open an empty section: a break with no content between it
 * and the previous break (or the start of main), and a trailing break. A section holding only
 * Section Metadata counts as empty (its metadata goes too).
 */
function collapseEmptySections(document) {
  const main = document.querySelector('main') || document.body;
  if (!main) return;
  let hasContent = false;
  let pendingMeta = [];
  let prevHr = null;
  const toRemove = [];
  const visit = (node) => {
    if (node.nodeType === 3) {
      if (node.nodeValue.trim()) hasContent = true;
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.tagName === 'HR') {
      if (!hasContent) {
        // Empty section before this break: drop the break that opened it (or this one at the start).
        toRemove.push(prevHr || node, ...pendingMeta);
        if (!prevHr) { pendingMeta = []; return; }
      }
      prevHr = node;
      hasContent = false;
      pendingMeta = [];
      return;
    }
    if (isSectionMetadata(node)) { pendingMeta.push(node); return; }
    if (CONTENT_ELEMENTS.has(node.tagName)) { hasContent = true; return; }
    [...node.childNodes].forEach(visit);
  };
  [...main.childNodes].forEach(visit);
  if (prevHr && !hasContent) toRemove.push(prevHr, ...pendingMeta);
  toRemove.forEach((n) => { if (n.parentNode) n.remove(); });
}

function resolveSections(document, sections) {
  const main = document.querySelector('main');
  const seen = new Set();
  const resolved = [];
  sections.forEach((section) => {
    const el = firstMatch(document, section.selector);
    if (!el || seen.has(el)) return;
    seen.add(el);
    resolved.push({ section, el });
  });

  // Sections outside <main> -> end of <main>, in template order; `position: "start"` (a site
  // alert above the page) goes to the start instead.
  if (main) {
    const outside = resolved.filter((r) => !main.contains(r.el) && !r.el.contains(main));
    outside.filter((r) => r.section.position !== 'start').forEach((r) => main.append(r.el));
    outside.filter((r) => r.section.position === 'start').reverse().forEach((r) => main.prepend(r.el));
  }

  // Nested sections -> right after the outermost enclosing section.
  resolved.forEach((r) => {
    let outer = null;
    resolved.forEach((o) => {
      if (o !== r && o.el.contains(r.el) && (!outer || o.el.contains(outer.el))) outer = o;
    });
    if (outer) outer.el.after(r.el);
  });

  // Document order.
  resolved.sort((a, b) => {
    if (a.el === b.el) return 0;
    // eslint-disable-next-line no-bitwise
    return a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1;
  });
  return resolved;
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument;
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (!sections.length) return;

  if (hookName === 'beforeTransform') {
    const resolved = resolveSections(document, sections);

    resolved.forEach((r) => {
      if (r.section.id === 'sidebar' || r.section.style === 'sidebar') removeSocialFollow(r.el);
    });

    resolved.forEach((r) => {
      // Template style wins; otherwise the source background colour.
      r.style = r.section.style || backgroundStyle(r.el);
      tagAlignment(r.el);
    });

    // Every break is marked (the first one temporary): `center` is only known after parsing.
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      const hr = document.createElement('hr');
      hr.setAttribute(MARKER, section.id);
      if (i === 0) hr.setAttribute('data-excat-first', 'true');
      el.before(hr);
    }
    resolvedByDoc.set(document, resolved);
  }

  if (hookName === 'afterTransform') {
    const resolved = resolvedByDoc.get(document) || [];
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const r = resolved[i];
      const { section } = r;
      const marker = document.querySelector(`hr[${MARKER}="${section.id}"]`);
      const el = r.el && r.el.isConnected ? r.el : null;
      if (!marker && !el) continue;
      const style = [r.style, mostlyCentred(el) ? 'center' : null].filter(Boolean).join(', ');
      if (style) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style },
        });
        if (el) el.after(block);
        else marker.after(block);
      }
      if (marker) {
        if (marker.getAttribute('data-excat-first') === 'true') marker.remove();
        else marker.removeAttribute(MARKER);
      }
    }
    // Drop any leftover markers (sections whose content disappeared).
    document.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
      if (hr.getAttribute('data-excat-first') === 'true') hr.remove();
      else hr.removeAttribute(MARKER);
    });
    document.querySelectorAll(`[${CENTER}]`).forEach((t) => t.removeAttribute(CENTER));
    collapseEmptySections(document);
    resolvedByDoc.delete(document);
  }
}
