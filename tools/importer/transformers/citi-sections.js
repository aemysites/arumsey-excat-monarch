/* eslint-disable */
/* global WebImporter */

/**
 * citi.com sections transformer (template: standard-content-page).
 *
 * beforeTransform (runs after block discovery, before parsing):
 *   - Resolves every element first (template sections and the cta-banner /
 *     hero-card block elements), THEN inserts <hr> markers, so `:nth-child`
 *     page selectors are not shifted by the markers.
 *   - Template sections: <hr> before every found section element except the
 *     first in document order. Styled sections get a marked <hr>
 *     (data-excat-section-id); a styled first section gets a temporary marked
 *     <hr> that is removed in afterTransform.
 *   - Band blocks: a cta-banner or hero-card that sits on a coloured band or a
 *     background photo (its own box, a wrapper inside it covering its content,
 *     or an ancestor has a non-white background colour / background image /
 *     colour class hint) gets its own section: a marked <hr> before it and a
 *     marked <hr> after it.
 *   - Container bands: a columns-choice whose source component (heading + block)
 *     carries a background photo gets that component as its own section (dark
 *     style + `background` image row); the inline photo style is removed.
 *   - Default-content bands: an AEM BG Container (section.bg__container) on an
 *     inline background colour and holding no block gets its own section.
 * afterTransform: inserts Section Metadata for styled sections and bands,
 *   removes the temporary marker attributes / first-section <hr>.
 */

const SECTION_ATTR = 'data-excat-section-id';
const BAND_START_ATTR = 'data-excat-band-start';
const BAND_END_ATTR = 'data-excat-band-end';
const DROP_ATTR = 'data-excat-drop';

const BAND_BLOCKS = ['cta-banner', 'hero-card'];
// Blocks whose whole source component (heading + block) sits on a decorative background photo
// (citi.com twocolumnteaser / table "this or that" promos: <section style="background-image:…">).
// The component becomes a band section that keeps the photo as the section background.
const CONTAINER_BAND_BLOCKS = ['columns-choice'];
const CONTAINER_BAND_DEPTH = 8;
// AEM "BG Container" components: default content (heading, list, link) on an inline background
// colour. Holding no block, they become a band section of their own (e.g. grey).
const DEFAULT_CONTENT_BANDS = ['section.bg__container'];
// The project has no section background-image support (scripts.js decorates
// only section styles), so background photos fall back to the dark style.
const PHOTO_STYLE = 'dark';

/* ---------------------------------------------------------------- helpers */

function pageKey(u) {
  try {
    const { origin, pathname } = new URL(u);
    return `${origin}${pathname.replace(/\/$/, '')}`;
  } catch (e) {
    return u;
  }
}

function pageUrl(payload) {
  const params = (payload && payload.params) || {};
  return params.originalURL || (payload && payload.url) || '';
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

function findSectionElement(document, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (let i = 0; i < selectors.length; i += 1) {
    const [el] = safeQueryAll(document, selectors[i]);
    if (el) return el;
  }
  return null;
}

/** Same claim logic as findBlocksOnPage: pageInstances first, then instances, no overlaps. */
function discoverBlocks(document, template, url) {
  const claims = [];
  const key = url ? pageKey(url) : null;
  const claim = (name, selector) => {
    safeQueryAll(document, selector).forEach((el) => {
      if (claims.some((c) => c.element === el || c.element.contains(el) || el.contains(c.element))) return;
      claims.push({ name, element: el });
    });
  };
  const blocks = (template && template.blocks) || [];
  if (key) {
    blocks.forEach((b) => {
      const entry = Object.entries(b.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((s) => claim(b.name, s));
    });
  }
  blocks.forEach((b) => (b.instances || []).forEach((s) => claim(b.name, s)));
  return claims;
}

function byDocumentOrder(a, b) {
  if (a === b) return 0;
  // 4 = DOCUMENT_POSITION_FOLLOWING
  return (a.compareDocumentPosition(b) & 4) ? -1 : 1;
}

function hasMeaningfulContent(node) {
  if (!node) return false;
  if (node.nodeType === 3) return !!node.textContent.trim();
  if (node.nodeType !== 1) return false;
  if (node.tagName === 'HR') return false;
  if (node.textContent.trim()) return true;
  return !!(node.matches('img, picture, video, iframe, svg')
    || node.querySelector('img, picture, video, iframe'));
}

/** True when meaningful content precedes (dir=-1) or follows (dir=1) el inside body. */
function hasContentAround(el, dir) {
  const { body } = el.ownerDocument;
  let node = el;
  while (node && node !== body) {
    let sib = dir < 0 ? node.previousSibling : node.nextSibling;
    while (sib) {
      if (hasMeaningfulContent(sib)) return true;
      sib = dir < 0 ? sib.previousSibling : sib.nextSibling;
    }
    node = node.parentNode;
  }
  return false;
}

function adjacentHr(el, dir) {
  let sib = dir < 0 ? el.previousSibling : el.nextSibling;
  while (sib && sib.nodeType === 3 && !sib.textContent.trim()) {
    sib = dir < 0 ? sib.previousSibling : sib.nextSibling;
  }
  return sib && sib.nodeType === 1 && sib.tagName === 'HR' ? sib : null;
}

/* ------------------------------------------------------ colour detection */

const NAMED = {
  white: [255, 255, 255], black: [0, 0, 0], navy: [0, 0, 128], blue: [0, 0, 255],
  grey: [128, 128, 128], gray: [128, 128, 128], silver: [192, 192, 192],
  whitesmoke: [245, 245, 245], lightgrey: [211, 211, 211], lightgray: [211, 211, 211],
  lightblue: [173, 216, 230], aliceblue: [240, 248, 255],
};

function parseColor(str) {
  if (!str) return null;
  const s = str.trim().toLowerCase();
  if (!s || s === 'transparent' || s === 'none' || s === 'inherit' || s === 'initial'
    || s === 'unset' || s === 'currentcolor' || s.startsWith('var(')) return null;
  let m = s.match(/^#([0-9a-f]{3,8})\b/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)/);
  if (m) {
    let a = 1;
    if (m[4] !== undefined) a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  }
  const word = s.split(/\s+/)[0];
  if (NAMED[word]) return [...NAMED[word], 1];
  return null;
}

/** Map a colour to a section style: dark | blue | grey | light-blue, or null for white/transparent. */
function classifyColor(rgba) {
  if (!rgba) return null;
  const [r, g, b, a] = rgba;
  if (a < 0.15) return null;
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const d = max - min;
  if (l >= 0.97) return null; // white / near-white
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    const rn = r / 255; const gn = g / 255; const bn = b / 255;
    if (max === rn) h = 60 * (((gn - bn) / d) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / d + 2);
    else h = 60 * ((rn - gn) / d + 4);
    if (h < 0) h += 360;
  }
  if (s < 0.2 || d < 0.1) return l < 0.3 ? 'dark' : 'grey'; // neutrals
  if (h >= 185 && h <= 250) { // blues
    if (l < 0.25) return 'dark'; // navy
    if (l >= 0.82) return 'light-blue';
    return 'blue';
  }
  return l >= 0.82 ? 'grey' : 'dark'; // other tints / saturated bands with light text
}

function hasPhotoUrl(value) {
  const urls = [...(value || '').matchAll(/url\(\s*(['"]|&quot;)?([^'")]*?)\1?\s*\)/gi)];
  return urls.some((u) => {
    const src = (u[2] || '').replace(/&quot;/g, '').trim();
    return src && src !== 'none' && !/^data:image\/(svg|gif)/i.test(src);
  });
}

function firstGradientColor(value) {
  const m = (value || '').match(/gradient\(([^)]*\)?[^)]*)\)/i);
  if (!m) return null;
  const c = m[1].match(/(#[0-9a-f]{3,8}|rgba?\([^)]*\))/i);
  return c ? parseColor(c[1]) : null;
}

function parseStyle(styleAttr) {
  const decls = {};
  (styleAttr || '').split(';').forEach((part) => {
    const idx = part.indexOf(':');
    if (idx < 0) return;
    decls[part.slice(0, idx).trim().toLowerCase()] = part.slice(idx + 1).trim();
  });
  return decls;
}

const CLASS_HINT_TOKEN = /(^|[-_])(bg|background|gradient|band|theme)([-_]|$)|^(bg|gradient)[a-z]/i;

function styleFromClasses(el) {
  const tokens = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (CLASS_HINT_TOKEN.test(t)) {
      const low = t.toLowerCase();
      if (/light[-_]?blue|sky/.test(low)) return 'light-blue';
      if (/navy|dark|black|midnight/.test(low)) return 'dark';
      if (/blue/.test(low)) return 'blue';
      if (/gr[ae]y|silver|neutral/.test(low)) return 'grey';
    }
  }
  return null;
}

/** Style hint carried by a single element (inline style, bgcolor, class tokens). */
function styleOf(el) {
  if (!el || el.nodeType !== 1) return null;
  const decls = parseStyle(el.getAttribute('style'));
  const bgImage = decls['background-image'] || '';
  const bg = decls.background || '';
  if (hasPhotoUrl(bgImage) || hasPhotoUrl(bg)) return { style: PHOTO_STYLE, photo: true };
  const gradient = firstGradientColor(bgImage) || firstGradientColor(bg);
  const gradientStyle = classifyColor(gradient);
  if (gradientStyle) return { style: gradientStyle };
  const colorStyle = classifyColor(parseColor(decls['background-color']))
    || classifyColor(parseColor(bg.replace(/url\([^)]*\)/gi, '').trim()))
    || classifyColor(parseColor(el.getAttribute('bgcolor')));
  if (colorStyle) return { style: colorStyle };
  // custom properties such as --banner-bg-color / --content-bg
  const varKey = Object.keys(decls).find((k) => k.startsWith('--') && /(bg|background)/.test(k)
    && classifyColor(parseColor(decls[k])));
  if (varKey) return { style: classifyColor(parseColor(decls[varKey])) };
  const classStyle = styleFromClasses(el);
  if (classStyle) return { style: classStyle };
  return null;
}

/**
 * The band style for a block element: its own box first (the element and the
 * chain of wrappers inside it that still hold ~all of its content), then its
 * ancestors nearest-first up to <main>/<body>.
 */
function bandStyle(el) {
  const total = (el.textContent || '').trim().length;
  let node = el;
  for (let depth = 0; node && depth < 10; depth += 1) {
    const hit = styleOf(node);
    if (hit) return hit;
    const kids = [...node.children].filter((c) => !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(c.tagName));
    const next = kids.length === 1 ? kids[0]
      : kids.find((c) => total > 0 && (c.textContent || '').trim().length >= total * 0.9);
    node = next || null;
  }
  const { body } = el.ownerDocument;
  let anc = el.parentElement;
  while (anc && anc !== body && anc.tagName !== 'MAIN' && anc.tagName !== 'HTML') {
    const hit = styleOf(anc);
    if (hit) return hit;
    anc = anc.parentElement;
  }
  return null;
}

/* ------------------------------------------------------------- transform */

function createHr(document, attrs = {}) {
  const hr = document.createElement('hr');
  Object.entries(attrs).forEach(([k, v]) => hr.setAttribute(k, v));
  return hr;
}

function sectionMetadata(document, style, background) {
  const cells = { style };
  if (background) {
    const img = document.createElement('img');
    img.setAttribute('src', background);
    img.setAttribute('alt', '');
    cells.background = img;
  }
  return WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells,
  });
}

function photoUrl(el) {
  const decls = parseStyle(el.getAttribute('style'));
  const value = decls['background-image'] || decls.background || '';
  if (!hasPhotoUrl(value)) return '';
  const m = value.match(/url\(\s*(['"]|&quot;)?([^'")]*?)\1?\s*\)/i);
  return m ? m[2].replace(/&quot;/g, '').trim() : '';
}

/**
 * The nearest ancestor (self included) of a container-band block carrying a background photo,
 * provided it holds no other claimed block. Returns { root, url } or null.
 */
function photoContainer(el, claims) {
  let node = el;
  for (let depth = 0; node && depth < CONTAINER_BAND_DEPTH; depth += 1) {
    if (node.tagName === 'BODY' || node.tagName === 'MAIN') return null;
    const url = node.nodeType === 1 ? photoUrl(node) : '';
    if (url) {
      const others = claims.some((c) => c.element !== el && node.contains(c.element));
      return others ? null : { root: node, url };
    }
    node = node.parentElement;
  }
  return null;
}

function beforeTransform(element, payload) {
  const document = element.ownerDocument;
  const template = (payload && payload.template) || {};
  const sections = template.sections || [];

  // 1. Resolve everything before inserting any marker.
  const found = sections
    .map((section) => ({ section, el: findSectionElement(document, section) }))
    .filter((f) => f.el);
  found.sort((a, b) => byDocumentOrder(a.el, b.el));

  const claims = discoverBlocks(document, template, pageUrl(payload));
  const bands = claims
    .filter((c) => BAND_BLOCKS.includes(c.name) && c.element.isConnected)
    .map((c) => ({ ...c, hint: bandStyle(c.element) }))
    .filter((c) => c.hint && c.hint.style);
  claims
    .filter((c) => CONTAINER_BAND_BLOCKS.includes(c.name) && c.element.isConnected)
    .forEach((c) => {
      const hit = photoContainer(c.element, claims);
      if (!hit || bands.some((b) => b.element === hit.root)) return;
      // The photo moves to the section metadata; drop it from the element so the importer's
      // background-image rule does not also insert it as an inline image.
      const decls = parseStyle(hit.root.getAttribute('style'));
      delete decls['background-image'];
      delete decls.background;
      const rest = Object.entries(decls).map(([k, v]) => `${k}: ${v}`).join('; ');
      if (rest) hit.root.setAttribute('style', rest);
      else hit.root.removeAttribute('style');
      bands.push({ name: c.name, element: hit.root, hint: { style: PHOTO_STYLE, photo: true, background: hit.url } });
    });
  DEFAULT_CONTENT_BANDS.forEach((selector) => safeQueryAll(document, selector).forEach((el) => {
    if (claims.some((c) => el.contains(c.element) || c.element.contains(el))) return;
    if (bands.some((b) => b.element === el)) return;
    const hint = styleOf(el);
    if (hint && hint.style && !hint.photo) bands.push({ name: 'default-content', element: el, hint });
  }));
  bands.sort((a, b) => byDocumentOrder(a.element, b.element));

  // 2. Template section breaks (reverse document order).
  for (let i = found.length - 1; i >= 0; i -= 1) {
    const { section, el } = found[i];
    if (!el.parentNode) continue;
    if (i > 0) {
      const attrs = section.style ? { [SECTION_ATTR]: section.id } : {};
      el.before(createHr(document, attrs));
    } else if (section.style) {
      el.before(createHr(document, { [SECTION_ATTR]: section.id, [DROP_ATTR]: 'true' }));
    }
  }

  // 3. Band sections around coloured / photo cta-banner and hero-card blocks.
  bands.forEach((band, idx) => {
    const el = band.element;
    if (!el.parentNode) return;
    const id = `${band.name}-${idx}`;
    const before = adjacentHr(el, -1);
    if (before) {
      before.setAttribute(BAND_START_ATTR, id);
    } else if (hasContentAround(el, -1)) {
      el.before(createHr(document, { [BAND_START_ATTR]: id }));
    }
    const after = adjacentHr(el, 1);
    if (after && !after.hasAttribute(BAND_START_ATTR)) {
      after.setAttribute(BAND_END_ATTR, id);
      after.setAttribute('data-excat-band-style', band.hint.style);
      if (band.hint.background) after.setAttribute('data-excat-band-bg', band.hint.background);
    } else {
      const attrs = { [BAND_END_ATTR]: id, 'data-excat-band-style': band.hint.style };
      if (band.hint.background) attrs['data-excat-band-bg'] = band.hint.background;
      // No content after the band: the end marker only carries the metadata position.
      if (!hasContentAround(el, 1)) attrs[DROP_ATTR] = 'true';
      el.after(createHr(document, attrs));
    }
  });
}

function afterTransform(element, payload) {
  const document = element.ownerDocument;
  const template = (payload && payload.template) || {};
  const sections = template.sections || [];

  // Bands: metadata closes the band section, right before its end marker.
  const ends = [...document.querySelectorAll(`hr[${BAND_END_ATTR}]`)].reverse();
  ends.forEach((hr) => {
    const style = hr.getAttribute('data-excat-band-style');
    if (style) hr.before(sectionMetadata(document, style, hr.getAttribute('data-excat-band-bg')));
    hr.removeAttribute(BAND_END_ATTR);
    hr.removeAttribute('data-excat-band-style');
    hr.removeAttribute('data-excat-band-bg');
    if (hr.hasAttribute(DROP_ATTR)) hr.remove();
  });
  document.querySelectorAll(`hr[${BAND_START_ATTR}]`).forEach((hr) => hr.removeAttribute(BAND_START_ATTR));

  // Styled template sections (reverse order). Metadata goes at the end of the section:
  // right before the next <hr> following the marker, or after the surviving element.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section.style) continue;
    const marker = document.querySelector(`hr[${SECTION_ATTR}="${section.id}"]`);
    const el = marker ? null : findSectionElement(document, section);
    if (!marker && !el) continue;
    const meta = sectionMetadata(document, section.style);
    if (marker) {
      let next = marker.nextElementSibling;
      while (next && next.tagName !== 'HR') next = next.nextElementSibling;
      if (next) next.before(meta);
      else marker.parentNode.append(meta);
      if (marker.hasAttribute(DROP_ATTR)) marker.remove();
      else marker.removeAttribute(SECTION_ATTR);
    } else {
      el.after(meta);
    }
  }
  document.querySelectorAll(`hr[${DROP_ATTR}]`).forEach((hr) => hr.remove());
}

export default function transform(hookName, element, payload) {
  if (!element || !element.ownerDocument) return;
  if (hookName === 'beforeTransform') beforeTransform(element, payload);
  if (hookName === 'afterTransform') afterTransform(element, payload);
}
