/* eslint-disable */
/* global WebImporter */

/**
 * H&R Block sections transformer.
 *
 * Section boundaries and styles are derived from the source page itself:
 *
 *  1. Theme roots: outermost <section> / div.container / div.showhide-table
 *     carrying a source theme class (THEMES below). Each root opens a section
 *     styled after its theme (white = no style).
 *  2. Bands: the other element children of a container holding theme roots
 *     (unthemed sections, full-bleed image banners, experience fragments...).
 *     A band with content and no theme root inside opens an unstyled section
 *     (or the style of a matching template.sections[] entry).
 *  3. template.sections[] (catalog superset) as fallback: EVERY element
 *     matching an entry's selectors (nested matches of the same entry
 *     de-duplicated) opens a section with the entry's style, unless it holds
 *     theme roots (those govern; e.g. the hero `main:has(...)` entries).
 *  4. Styled fragment placeholders (hrblock-fragments, data-excat-fragment-style)
 *     get a section of their own: fragment.js only keeps the fragment's own
 *     sections (and Style) when the fragment is alone in its section.
 *
 *  5. Source bands: every outermost <section> (AEM section.column-control,
 *     section.faq, expat section.container...) and the footnote containers
 *     (div.global-disclaimer-container, section.page-disclaimer).
 *
 * Layout (preprocess, live DOM): each candidate band records its own padding
 * (source padding-top-N / padding-bottom-N classes, else computed padding),
 * the alignment of its first default-content heading (computed / .text-center),
 * the width of its text column and the size of its first h2, as
 * data-excat-layout="pt|pb|align|width|h2".
 * These become extra Section Metadata styles: `center` (centred intro),
 * `narrow` (<= 820px reading column) / `medium` (<= 1000px), `h2-large` /
 * `h2-medium` / `h2-small` (first h2 is 56 / 40 / 24px where that differs from
 * the section default: 56 when centred, else 40), `disclaimer`
 * (footnotes) and `pad-top-N` / `pad-bottom-N` (N in 0..120, emitted only when
 * the source differs from the style's default, see DEFAULT_PAD and
 * styles/styles.css).
 *
 * Consecutive boundaries with the same colour merge into one section (source
 * same-theme bands read as one colour band) unless they are distinct source
 * bands separated by real spacing (gap >= 60px), a different alignment / width
 * or footnote role: those keep their own section so their padding survives.
 * A boundary inside a parsed block element is lifted to that block (theme
 * roots) or dropped (bands); one inside a list or table is lifted out of it.
 *
 * beforeTransform (parser targets still exist, payload.pageBlocks = block
 * discovery result): insert marker <hr data-excat-section-style="..."> before
 * every emitted boundary.
 *
 * afterTransform: collapse markers that would open an empty section (no
 * content since the previous marker / page start), insert a Section Metadata
 * block (Style) right after each styled marker, and drop the marker attribute.
 * A marker with no content before it (page start) is removed but its Section
 * Metadata kept, so the first section is styled.
 */

const MARKER = 'data-excat-section-style';
const FRAGMENT_ATTR = 'data-excat-fragment-style';
const NONE = '';

// source theme class -> Section Metadata style ('' = default / white)
const THEMES = [
  ['spruce-forest-theme', 'forest'],
  ['green-dark-theme', 'green'],
  ['spruce-eggshell-theme', 'eggshell'],
  ['white-theme', NONE],
  ['black-theme', 'black'],
  ['spruce-neon-theme', 'neon'],
  ['expat-bg--grey', 'light-grey'],
  ['gray-background', 'light-grey'],
];
const THEME_TAGS = 'section, div.container, div.showhide-table';
const CONTENT_SEL = 'img, picture, video, iframe, table, form, svg, lottie-player, input, select, textarea, button';

// ---------------------------------------------------------------------------
// Source band layout (see header). Keep DEFAULT_PAD in sync with the per-style
// section padding in styles/styles.css (desktop px).
const LAYOUT_ATTR = 'data-excat-layout';
const PAD_STEPS = [0, 20, 40, 60, 80, 100, 120];
const DEFAULT_PAD = { '': 60, eggshell: 100, forest: 80, neon: 0 };
const DISCLAIMER_SEL = 'div.global-disclaimer-container, section.page-disclaimer';
const BLOCK_MATCH_ATTR = 'data-excat-match';
const TEXT_SEL = 'h1, h2, h3, h4, h5, h6, p, li';
const MULTI_COLUMN_SEL = '.two-column-control, li.col-2, li.col-3, li.col-4';
const BREAK_GAP = 60; // same-colour bands this far apart (pb + pt) stay apart
const CHAIN_SKIP = 'script, style, link, noscript, template, input, meta';

function quantize(px) {
  if (px === null || px === undefined || Number.isNaN(px)) return null;
  return PAD_STEPS.reduce((best, s) => (Math.abs(s - px) < Math.abs(best - px) ? s : best), PAD_STEPS[0]);
}

function padClass(el, side) {
  const m = (el.className && typeof el.className === 'string')
    ? el.className.match(new RegExp(`(?:^|\\s)padding-${side}-(\\d+)(?=\\s|$)`)) : null;
  return m ? parseInt(m[1], 10) : null;
}

/** The band and its single-child wrapper chain (section > div.container > ul > li > div...). */
function wrapperChain(el) {
  const chain = [el];
  let cur = el;
  for (let i = 0; i < 6; i += 1) {
    const kids = [...cur.children].filter((c) => !c.matches(CHAIN_SKIP));
    if (kids.length !== 1) break;
    [cur] = kids;
    chain.push(cur);
  }
  return chain;
}

function isLive(document) {
  const view = document.defaultView;
  if (!view || typeof view.getComputedStyle !== 'function' || !document.body) return false;
  try {
    return /graphik/i.test(view.getComputedStyle(document.body).fontFamily || '');
  } catch (e) {
    return false;
  }
}

function measureBand(el, view, live) {
  const chain = wrapperChain(el);
  // padding: source spacing classes, else computed (live DOM only)
  let pt = null;
  let pb = null;
  if (live) {
    pt = 0; pb = 0;
    chain.forEach((c) => {
      const cs = view.getComputedStyle(c);
      pt += parseFloat(cs.paddingTop) || 0;
      pb += parseFloat(cs.paddingBottom) || 0;
    });
  } else {
    const tops = chain.map((c) => padClass(c, 'top')).filter((v) => v !== null);
    const bottoms = chain.map((c) => padClass(c, 'bottom')).filter((v) => v !== null);
    if (tops.length || bottoms.length) {
      pt = tops.reduce((a, b) => a + b, 0);
      pb = bottoms.reduce((a, b) => a + b, 0);
    }
  }
  // default-content text of the band (blocks excluded)
  const texts = safeAll(el, TEXT_SEL)
    .filter((t) => t.textContent.trim() && !t.closest(`[${BLOCK_MATCH_ATTR}], header, footer, nav`))
    .slice(0, 40);
  const first = texts.find((t) => /^H[1-6]$/.test(t.tagName)) || texts[0];
  let align = '';
  if (first) {
    if (live) {
      const ta = view.getComputedStyle(first).textAlign;
      if (ta === 'center') align = 'c';
      else if (/^(left|start|justify)$/.test(ta)) align = 'l';
    } else {
      const holder = first.closest('.text-center, .text-left');
      if (holder && el.contains(holder)) align = holder.classList.contains('text-center') ? 'c' : 'l';
    }
  }
  let width = '';
  if (!el.matches(MULTI_COLUMN_SEL) && !el.querySelector(MULTI_COLUMN_SEL)) {
    if (live) {
      const widths = texts
        .filter((t) => t.parentElement && view.getComputedStyle(t.parentElement).display === 'block')
        .map((t) => t.getBoundingClientRect().width)
        .filter((w) => w > 0);
      if (widths.length) width = Math.round(Math.max(...widths));
    } else if (chain.some((c) => c.classList && c.classList.contains('container-width-1000'))) {
      width = 860;
    }
  }
  // size of the band's first h2 (source text-jumbo 56 / text-large 40 / text-small 24)
  let h2 = '';
  const firstH2 = texts.find((t) => t.tagName === 'H2' && !t.matches('.eyebrow-label, .color-eyebrow'));
  if (firstH2) {
    if (live) {
      h2 = Math.round(parseFloat(view.getComputedStyle(firstH2).fontSize) || 0) || '';
    } else {
      const sizes = [['text-jumbo', 56], ['text-large', 40], ['text-medium', 32], ['text-small', 24]];
      const hit = sizes.find(([cls]) => firstH2.classList.contains(cls));
      h2 = hit ? hit[1] : '';
    }
  }
  // centred bands: measure of the first heading and the first wrapping paragraph
  // (source per-heading heading_max_width_* / body_max_width_* classes)
  let hw = '';
  let pw = '';
  if (live && align === 'c') {
    const blockBox = (t) => t.parentElement && view.getComputedStyle(t).display === 'block';
    if (first && /^H[1-6]$/.test(first.tagName) && blockBox(first)) hw = Math.round(first.getBoundingClientRect().width) || '';
    const para = texts.find((t) => t.tagName === 'P' && blockBox(t) && t.textContent.trim().length > 120);
    if (para) pw = Math.round(para.getBoundingClientRect().width) || '';
  }
  return [pt === null ? '' : Math.round(pt), pb === null ? '' : Math.round(pb), align, width, h2, hw, pw, linkStyle(el, view, live)].join('|');
}

// Inline text links styled green + underlined (source <a><span class="text-underline
// color-dark-green">, or the classes on the <a>); the site default is forest, no underline.
const UNDERLINE_LINK_SEL = '.text-underline.color-dark-green';
function linkStyle(el, view, live) {
  const links = safeAll(el, 'p a[href], li a[href]').filter((a) => a.textContent.trim()
    && !a.closest(`[${BLOCK_MATCH_ATTR}], header, footer, nav`)
    && !/\bbtn\b/.test(a.className || ''));
  if (!links.length) return '';
  // the classes alone are not enough (some pages override them back to forest,
  // no underline): on the live DOM the link must also render green + underlined
  const underlined = links.filter((a) => {
    const marked = a.matches(UNDERLINE_LINK_SEL) ? a : a.querySelector(UNDERLINE_LINK_SEL);
    if (!marked) return false;
    if (!live) return true;
    const cs = view.getComputedStyle(marked);
    return /underline/.test(cs.textDecorationLine || '') && cs.color === 'rgb(0, 93, 31)';
  });
  return underlined.length * 2 >= links.length ? 'u' : '';
}

function readLayout(el) {
  const raw = el && el.getAttribute && el.getAttribute(LAYOUT_ATTR);
  if (!raw) return null;
  const [pt, pb, align, width, h2, hw, pw, links] = raw.split('|');
  const num = (v) => (v === '' || v === undefined ? null : parseFloat(v));
  return {
    pt: num(pt), pb: num(pb), align: align || '', width: num(width), h2: num(h2),
    hw: num(hw), pw: num(pw), links: links || '',
  };
}

// Centred-band measures (keep in sync with --center-heading-width 860 /
// --center-text-width 700 and the heading-N / text-N rules in styles/styles.css):
// the smallest step that holds the source measure, so lines never wrap earlier.
const HEADING_STEPS = [520, 640, 760, 860, 900, 1000];
const TEXT_STEPS = [520, 600, 700, 800, 960];
function measureToken(prefix, px, steps, def) {
  if (!px || px < 300) return '';
  const step = steps.find((s) => s >= px - 2) || steps[steps.length - 1];
  return step === def ? '' : `${prefix}-${step}`;
}

/** h2 scale token when the source h2 differs from the section default (center 56, else 40). */
function h2Token(size, centered) {
  if (!size) return '';
  let scale = 'medium';
  if (size >= 48) scale = 'large';
  else if (size <= 30) scale = 'small';
  const def = centered ? 'large' : 'medium';
  return scale === def ? '' : `h2-${scale}`;
}

function widthToken(width) {
  if (!width || width < 300) return '';
  if (width <= 820) return 'narrow';
  if (width <= 1000) return 'medium';
  return '';
}

/** Section Metadata style of a band group: colour + layout tokens. */
function styleOf(g) {
  const tokens = [g.colour || NONE];
  if (g.disclaimer) tokens.push('disclaimer');
  if (g.align === 'c' && !g.disclaimer) {
    tokens.push('center');
    tokens.push(measureToken('heading', g.hw, HEADING_STEPS, 860));
    tokens.push(measureToken('text', g.pw, TEXT_STEPS, 700));
  } else if (g.width && !g.disclaimer) tokens.push(g.width);
  if (!g.disclaimer) tokens.push(h2Token(g.h2, g.align === 'c'));
  if (g.links === 'u') tokens.push('links-underline');
  const def = Object.prototype.hasOwnProperty.call(DEFAULT_PAD, g.colour || NONE) ? DEFAULT_PAD[g.colour || NONE] : DEFAULT_PAD[NONE];
  const pt = quantize(g.pt);
  const pb = quantize(g.pb);
  if (pt !== null && pt !== def) tokens.push(`pad-top-${pt}`);
  if (pb !== null && pb !== def) tokens.push(`pad-bottom-${pb}`);
  return tokens.filter(Boolean).join(', ');
}

/**
 * Section style for a fragment document cut from a source band (hrblock-fragments):
 * the colour plus the band's layout tokens. The band is `el` itself when it was
 * measured, else its outermost measured bands (first one's top, last one's bottom).
 */
export function bandStyle(el, colour) {
  if (!el) return colour || NONE;
  let parts = el.hasAttribute && el.hasAttribute(LAYOUT_ATTR) ? [el] : [];
  if (!parts.length) {
    const all = safeAll(el, `[${LAYOUT_ATTR}]`);
    parts = all.filter((x) => !all.some((o) => o !== x && o.contains(x)));
  }
  const layouts = parts.map(readLayout).filter(Boolean);
  if (!layouts.length) return colour || NONE;
  const first = layouts[0];
  const last = layouts[layouts.length - 1];
  return styleOf({
    colour: colour || NONE,
    disclaimer: !!(el.matches && el.matches(DISCLAIMER_SEL)),
    align: (layouts.find((l) => l.align) || {}).align || '',
    width: widthToken(first.width),
    h2: (layouts.find((l) => l.h2) || {}).h2 || null,
    hw: (layouts.find((l) => l.hw) || {}).hw || null,
    pw: (layouts.find((l) => l.pw) || {}).pw || null,
    links: (layouts.find((l) => l.links) || {}).links || '',
    pt: first.pt,
    pb: last.pb,
  });
}

export const LAYOUT_ATTRIBUTE = LAYOUT_ATTR;

/** Outermost source <section>s (+ footnote containers) outside header / footer / nav. */
function findSourceBands(document) {
  const all = safeAll(document.body, `section, ${DISCLAIMER_SEL}`)
    .filter((el) => !el.closest('header, footer, nav'));
  const set = new Set(all);
  return all.filter((el) => {
    if (el.matches(DISCLAIMER_SEL)) {
      // outermost footnote container only
      for (let p = el.parentElement; p; p = p.parentElement) if (p.matches(DISCLAIMER_SEL)) return false;
      return hasContent(el);
    }
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (set.has(p) && p.tagName === 'SECTION') return false;
    }
    return hasContent(el);
  });
}

// Two-column CTA fragments (section.content-two-column) carry no theme class; their
// colour is painted on the columns. Live DOM: give the section the theme of its
// columns when every column shares one known background.
const COLUMN_THEMES = { 'rgb(246, 244, 233)': 'spruce-eggshell-theme', 'rgb(0, 53, 18)': 'spruce-forest-theme', 'rgb(0, 93, 31)': 'green-dark-theme' };
function themeColumnBands(document, view) {
  safeAll(document.body, 'section.content-two-column').forEach((sec) => {
    if (themeStyle(sec) !== undefined || view.getComputedStyle(sec).backgroundColor !== 'rgba(0, 0, 0, 0)') return;
    const secW = sec.getBoundingClientRect().width;
    if (!secW) return;
    const painted = safeAll(sec, 'div, li').filter((c) => {
      const r = c.getBoundingClientRect();
      return r.width >= secW * 0.4 && r.height > 100 && view.getComputedStyle(c).backgroundColor !== 'rgba(0, 0, 0, 0)';
    });
    const outer = painted.filter((c) => !painted.some((o) => o !== c && o.contains(c)));
    const colours = new Set(outer.map((c) => view.getComputedStyle(c).backgroundColor));
    const covered = outer.reduce((w, c) => w + c.getBoundingClientRect().width, 0);
    if (colours.size === 1 && covered >= secW * 0.95) {
      const cls = COLUMN_THEMES[[...colours][0]];
      if (cls) sec.classList.add(cls);
    }
  });
}

function annotateLayout(document, sections) {
  const view = document.defaultView;
  const live = isLive(document);
  if (live) {
    try { themeColumnBands(document, view); } catch (e) { /* optional */ }
  }
  const themeRoots = findThemeRoots(document);
  const cands = new Set([...themeRoots, ...findSourceBands(document)]);
  themeRoots.forEach((r) => {
    if (r.parentElement) [...r.parentElement.children].forEach((c) => cands.add(c));
  });
  sectionEntryMatches(document, sections).forEach(({ el }) => cands.add(el));
  cands.forEach((el) => {
    if (!el.isConnected || el.matches('script, style, link, noscript, template, hr')) return;
    try { el.setAttribute(LAYOUT_ATTR, measureBand(el, view, live)); } catch (e) { /* skip */ }
  });
}

export function themeStyle(el) {
  if (!el || !el.classList) return undefined;
  for (const [cls, style] of THEMES) {
    if (el.classList.contains(cls)) return style;
  }
  return undefined;
}

function hasContent(el) {
  if (!el) return false;
  if (el.textContent && el.textContent.replace(/\s+/g, '').length) return true;
  return !!(el.matches && el.matches(CONTENT_SEL)) || !!(el.querySelector && el.querySelector(CONTENT_SEL));
}

function safeAll(root, selector) {
  try { return [...root.querySelectorAll(selector)]; } catch (e) { return []; }
}

function isBefore(a, b) {
  // DOCUMENT_POSITION_FOLLOWING = 4
  return !!(a.compareDocumentPosition(b) & 4);
}

function sortByDocument(list, key = (x) => x.el) {
  return list.sort((x, y) => {
    const a = key(x);
    const b = key(y);
    if (a === b) return 0;
    if (a.contains(b)) return -1;
    if (b.contains(a)) return 1;
    return isBefore(a, b) ? -1 : 1;
  });
}

function contentRoot(document) {
  return document.querySelector('#site-content') || document.querySelector('main') || document.body;
}

function findThemeRoots(document) {
  const scope = document.body;
  const candidates = safeAll(scope, THEME_TAGS).filter((el) => themeStyle(el) !== undefined);
  const set = new Set(candidates);
  return candidates.filter((el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (set.has(p)) return false;
      if (themeStyle(p) !== undefined && p.matches(THEME_TAGS)) return false;
    }
    if (el.closest('header, footer, nav, table')) return false;
    return hasContent(el);
  });
}

function sectionEntryMatches(document, sections) {
  const out = [];
  sections.forEach((section, index) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector].filter(Boolean);
    const found = [];
    selectors.forEach((selector) => safeAll(document, selector).forEach((el) => {
      if (!found.includes(el)) found.push(el);
    }));
    // de-duplicate nested matches of the same entry (keep the outermost)
    found
      .filter((el) => !found.some((o) => o !== el && o.contains(el)))
      .forEach((el) => out.push({ el, style: section.style || NONE, index }));
  });
  return out;
}

/** Where a boundary's <hr> goes: out of lists/tables, onto the enclosing block. */
function breakPoint(el, blockEls, isThemed) {
  let target = el;
  const block = blockEls.filter((b) => b !== el && b.contains(el))
    .sort((a, b) => (a.contains(b) ? -1 : 1))[0];
  if (block) {
    if (!isThemed) return null;
    target = block;
  }
  let lifted = target;
  for (let p = target.parentElement; p; p = p.parentElement) {
    if (p.matches('ul, ol, table, dl')) lifted = p;
  }
  return lifted;
}

function collectBoundaries(document, sections, blockEls) {
  const themeRoots = findThemeRoots(document);
  const rootSet = new Set(themeRoots);
  const containsRoot = (el) => themeRoots.some((r) => r !== el && el.contains(r));
  const entries = sectionEntryMatches(document, sections);
  const entryStyle = new Map();
  entries.forEach(({ el, style }) => { if (!entryStyle.has(el)) entryStyle.set(el, style); });

  const raw = [];
  // 1. theme roots
  themeRoots.forEach((el) => raw.push({ el, style: themeStyle(el), themed: true }));
  // 2. bands: siblings of theme roots
  const containers = new Set(themeRoots.map((r) => r.parentElement).filter(Boolean));
  containers.forEach((container) => {
    [...container.children].forEach((band) => {
      if (rootSet.has(band) || containsRoot(band)) return;
      if (band.matches('script, style, link, noscript, template, hr')) return;
      if (!hasContent(band)) return;
      const style = entryStyle.has(band) ? entryStyle.get(band) : NONE;
      raw.push({ el: band, style, themed: style !== NONE });
    });
  });
  // 3. template.sections[] fallback
  entries.forEach(({ el, style }) => {
    if (rootSet.has(el) || containsRoot(el)) return;
    if (!hasContent(el)) return;
    // inside a theme root: inherit its style unless the entry has its own
    const enclosing = themeRoots.find((r) => r.contains(el));
    const s = style || (enclosing ? themeStyle(enclosing) : NONE);
    raw.push({ el, style: s, themed: s !== NONE });
  });
  // 4. fragment placeholders: own section, then resume the enclosing style
  safeAll(document, `[${FRAGMENT_ATTR}]`).forEach((el) => {
    const style = el.getAttribute(FRAGMENT_ATTR) || NONE;
    const enclosing = themeRoots.find((r) => r.contains(el));
    // fragment.js merges a fragment that shares its section into it (losing the
    // fragment's own Section Metadata), so only a styled fragment is forced apart
    const forced = style !== NONE;
    raw.push({ el, style, themed: true, forced, fragment: forced, resume: enclosing ? themeStyle(enclosing) : NONE });
  });
  // 5. source bands (outermost <section>s, footnote containers): colour from
  //    their own theme, a matching template entry, or the enclosing theme root
  findSourceBands(document).forEach((el) => {
    if (rootSet.has(el) || containsRoot(el)) return;
    const enclosing = themeRoots.find((r) => r.contains(el));
    let style = themeStyle(el);
    if (style === undefined) style = entryStyle.has(el) ? entryStyle.get(el) : undefined;
    if (style === undefined || style === null) style = enclosing ? themeStyle(enclosing) : NONE;
    raw.push({ el, style, themed: style !== NONE, band: true });
  });

  // resolve break points, de-duplicate (first by priority: theme > fragment > band/entry)
  const byPoint = new Map();
  raw.forEach((b) => {
    const point = b.fragment ? b.el : breakPoint(b.el, blockEls, b.themed || b.style !== NONE);
    if (!point || !point.parentNode) return;
    const prev = byPoint.get(point);
    if (!prev || (b.fragment && !prev.fragment) || (rootSet.has(b.el) && !prev.fragment && !rootSet.has(prev.el))) {
      byPoint.set(point, { ...b, point });
    }
  });
  return sortByDocument([...byPoint.values()], (b) => b.point);
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  const document = (element && element.ownerDocument) || (payload && payload.document);
  if (!document) return;

  if (hookName === 'preprocess') {
    // live DOM (computed styles available): record each band's own layout
    try { annotateLayout(document, sections); } catch (e) { /* layout is optional */ }
    return;
  }

  if (hookName === 'beforeTransform') {
    const blockEls = ((payload && payload.pageBlocks) || []).map((b) => b.element).filter(Boolean);
    const boundaries = collectBoundaries(document, sections, blockEls);
    const groups = [];
    let cur = null;
    const open = (b, extra = {}) => {
      const layout = extra.noLayout ? null : readLayout(b.el);
      const g = {
        point: b.point,
        el: b.el,
        colour: extra.colour !== undefined ? extra.colour : b.style,
        after: !!extra.after,
        forced: !!extra.forced,
        disclaimer: !extra.noLayout && !!(b.el.matches && b.el.matches(DISCLAIMER_SEL)),
        pt: layout ? layout.pt : null,
        pb: layout ? layout.pb : null,
        align: layout ? layout.align : '',
        width: layout ? widthToken(layout.width) : '',
        h2: layout ? layout.h2 : null,
        hw: layout ? layout.hw : null,
        pw: layout ? layout.pw : null,
        links: layout ? layout.links : '',
        hasLayout: !!layout,
        breakReason: !!extra.breakReason,
      };
      groups.push(g);
      return g;
    };
    const shouldBreak = (g, b) => {
      const layout = readLayout(b.el);
      const disclaimer = !!(b.el.matches && b.el.matches(DISCLAIMER_SEL));
      if (disclaimer !== g.disclaimer) return true;
      if (!layout || !g.hasLayout) return false;
      // nested element of the current band (template entry inside it): same band
      if (g.el && g.el !== b.el && g.el.contains(b.el)) return false;
      const gap = (g.pb || 0) + (layout.pt || 0);
      if ((g.pb !== null || layout.pt !== null) && gap >= BREAK_GAP) return true;
      if (g.align && layout.align && g.align !== layout.align) return true;
      const w = widthToken(layout.width);
      if (g.align && layout.align && g.align !== 'c' && layout.align !== 'c' && g.width !== w) return true;
      return false;
    };
    boundaries.forEach((b) => {
      if (b.forced) {
        open(b, { forced: true });
        cur = open(b, { colour: b.resume, after: true, noLayout: true, forced: true });
        return;
      }
      if (cur && b.style === cur.colour) {
        if (!shouldBreak(cur, b)) {
          // same visual band: extend it (bottom padding / alignment of the last part)
          const layout = readLayout(b.el);
          if (layout && !(cur.el && cur.el.contains(b.el))) {
            if (layout.pb !== null) cur.pb = layout.pb;
            if (!cur.align) cur.align = layout.align;
            if (!cur.width) cur.width = widthToken(layout.width);
            if (!cur.h2) cur.h2 = layout.h2;
            if (!cur.hw) cur.hw = layout.hw;
            if (!cur.pw) cur.pw = layout.pw;
            if (!cur.links) cur.links = layout.links;
            cur.hasLayout = true;
          }
          return;
        }
        cur = open(b, { breakReason: true });
        return;
      }
      if (!cur && b.style === NONE) {
        // first band on the default (white) background: style it only if it has layout
        cur = open(b);
        return;
      }
      cur = open(b, { breakReason: true });
    });
    const emit = [];
    let current = NONE;
    groups.forEach((g, i) => {
      const style = styleOf(g);
      // an unstyled first group / a same-style continuation needs no break
      if (!g.forced && style === current && !(g.breakReason && i > 0)) return;
      emit.push({ point: g.point, style, after: g.after });
      current = style;
    });
    emit.forEach(({ point, style, after }) => {
      if (!point.parentNode) return;
      const hr = document.createElement('hr');
      hr.setAttribute(MARKER, style || NONE);
      point.parentNode.insertBefore(hr, after ? point.nextSibling : point);
    });
  }

  if (hookName === 'afterTransform') {
    safeAll(document, `[${LAYOUT_ATTR}]`).forEach((el) => el.removeAttribute(LAYOUT_ATTR));
    const markers = new Set(safeAll(document, `hr[${MARKER}]`));
    if (!markers.size) return;
    // Walk the document in order: a marker with no content since the previous
    // one would open an empty section; the later marker (next section's style) wins.
    const walker = document.createTreeWalker(document.body, 1 | 4); // elements + text
    let prevMarker = null;
    let contentSince = false;
    let seenContent = false;
    const drop = new Set();
    const leading = new Set();
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 1 && node.tagName === 'HR') {
        if (markers.has(node)) {
          if (!contentSince && prevMarker) drop.add(prevMarker);
          if (!seenContent) leading.add(node);
          prevMarker = node;
          contentSince = false;
        } else {
          contentSince = true;
        }
      } else if ((node.nodeType === 3 && node.textContent.trim())
        || (node.nodeType === 1 && node.matches(CONTENT_SEL))) {
        contentSince = true;
        seenContent = true;
      }
      node = walker.nextNode();
    }
    // trailing marker with nothing after it
    if (prevMarker && !contentSince) drop.add(prevMarker);
    drop.forEach((hr) => { markers.delete(hr); leading.delete(hr); hr.remove(); });

    markers.forEach((hr) => {
      const style = hr.getAttribute(MARKER);
      if (style && hr.parentNode) {
        const metadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style },
        });
        hr.parentNode.insertBefore(metadata, hr.nextSibling);
      }
      hr.removeAttribute(MARKER);
      // The first section needs no break, only its metadata.
      if (leading.has(hr)) hr.remove();
    });
  }
}
