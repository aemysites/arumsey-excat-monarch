/* eslint-disable */
/* global WebImporter */

/**
 * H&R Block cleanup transformer.
 *
 * beforeTransform:
 *  1. Replay template.pageCleanup[<current page URL>] in order. Each selector
 *     is removed only when it matches exactly one element (none / several =
 *     skipped, as recorded by the catalog).
 *  2. Remove elements still matching the catalog-wide cleanup rules
 *     (migration-work/catalog-template.json cleanup.rules) that live OUTSIDE
 *     main (late-loaded consent banners, popups, chat widgets...).
 *  3. Remove site chrome migrated separately (header / footer / nav / skip
 *     links), tracking widgets and non-authorable tags.
 *
 * afterTransform: final non-authorable leftovers. HTML comments are kept
 * (field hints written by parsers).
 */

// catalog-template.json cleanup.rules[] (copied verbatim, order preserved)
const CATALOG_CLEANUP_RULES = [
  '[id*="truste"]',
  'body [class*="popup"]:not(nav *)',
  'body [class*="modal"]:not(nav *)',
  'body [class*="overlay"]:not(nav *)',
  '[role="dialog"]',
  '[class*="chatbot"]',
];

// Containers that hold authorable content and must never be removed by the
// catalog-wide rules.
const CONTENT_ROOTS = 'main, #site-content, body > div.global-disclaimer-container';

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url, 'https://www.hrblock.com/');
    let p = u.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (!p.endsWith('/')) p += '/';
    return p.toLowerCase();
  } catch (e) {
    return '';
  }
}

function getPageUrl(document, payload) {
  const p = payload || {};
  const candidates = [
    p.params && p.params.originalURL,
    p.originalURL,
    p.url,
  ];
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) candidates.push(canonical.getAttribute('href'));
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) candidates.push(ogUrl.getAttribute('content'));
  return candidates.filter(Boolean);
}

function findPageCleanup(document, payload) {
  const pageCleanup = payload && payload.template && payload.template.pageCleanup;
  if (!pageCleanup || typeof pageCleanup !== 'object') return null;
  const keys = Object.keys(pageCleanup);
  const urls = getPageUrl(document, payload);
  for (const url of urls) {
    if (pageCleanup[url]) return pageCleanup[url];
    const norm = normalizeUrl(url);
    if (!norm) continue;
    const key = keys.find((k) => normalizeUrl(k) === norm);
    if (key) return pageCleanup[key];
  }
  return null;
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

// The catalog's `[class*="modal"]` rule also recorded H&R Block's text
// component, which is not a modal: div.manual-model (intro / introImageVariant)
// holds headings (.modal-headline), body copy (.modal-body) and CTAs
// (a.modal-tool-open, which open a scheduling tool). Real modals are
// div.modal-overlay.software-popup[id^="modal-"] / dialogs.
const FALSE_MODAL_CONTENT = '.manual-model, .modal-headline, .modal-body, .modal-tool-open';
const REAL_MODAL = '.modal-overlay, .software-popup, [id^="modal-"], [role="dialog"], [aria-modal="true"], [class*="chatbot"], [class*="popup"]';

function isFalseModalContent(el) {
  if (!el.closest(CONTENT_ROOTS)) return false;
  if (el.closest(REAL_MODAL)) return false;
  return !!(el.matches(FALSE_MODAL_CONTENT) || el.closest('.manual-model'));
}

// The catalog recorded pageCleanup selectors (many nth-child paths) on the raw
// page. helix-importer's preProcess drops <script>/<hr>/empty inline elements
// before transform(), shifting those paths, so the 'preprocess' hook resolves
// them on the untouched DOM and tags the matches for beforeTransform.
const CLEANUP_ATTR = 'data-excat-cleanup';
// Icons are a few KB; anything this large is an embedded illustration.
// (icons here are at most ~11KB; base64 "+" quantifiers make longer srcs
// overflow the browser regex engine in the importer's markdown step)
const MAX_DATA_URI_LENGTH = 20000;

// Mirrors the importer's replaceSrcInMarkdown pattern construction.
function isImporterSafeSrc(src) {
  try {
    let decoded = src;
    try { decoded = decodeURI(src); } catch (e) { return false; }
    new RegExp(`\\(${decoded.replace('.', '\\.')}\\)`, 'gm'); // eslint-disable-line no-new
    new RegExp(`\\(${src.replace('.', '\\.')}\\)`, 'gm'); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}
const CLEANUP_RESOLVED_ATTR = 'data-excat-cleanup-resolved';

function cleanupTargets(document, entries) {
  const targets = [];
  entries.forEach((entry) => {
    const selector = typeof entry === 'string' ? entry : entry && entry.selector;
    if (!selector) return;
    const matches = safeQueryAll(document, selector);
    if (matches.length !== 1) return; // none or ambiguous: skip
    targets.push(matches[0]);
  });
  return targets;
}

function removeCleanupTarget(el) {
  if (!el.isConnected) return;
  // Never remove a content root itself.
  if (el.matches('html, body, main') || el.querySelector('main')) return;
  // Never remove authorable text-component content (see FALSE_MODAL_CONTENT).
  if (isFalseModalContent(el)) return;
  el.remove();
}

function replayPageCleanup(document, entries) {
  if (document.documentElement.hasAttribute(CLEANUP_RESOLVED_ATTR)) {
    safeQueryAll(document, `[${CLEANUP_ATTR}]`).forEach(removeCleanupTarget);
    safeQueryAll(document, `[${CLEANUP_ATTR}]`).forEach((el) => el.removeAttribute(CLEANUP_ATTR));
    return;
  }
  cleanupTargets(document, entries).forEach(removeCleanupTarget);
}

/**
 * div.global-disclaimer-container is a site-wide library (~66 footnotes) on
 * every page; the site's JS only un-hides the items the page references with
 * [data-disclaimer-trigger="N"]. Keep referenced / visible items only, and drop
 * disclaimer lists (and the container) that end up empty.
 */
function pruneDisclaimers(document) {
  const triggers = new Set(
    safeQueryAll(document, '[data-disclaimer-trigger]')
      .filter((b) => !b.closest('.global-disclaimer-container, section.page-disclaimer'))
      .map((b) => (b.getAttribute('data-disclaimer-trigger') || '').trim()),
  );
  const pruned = new Set();
  safeQueryAll(document, '.global-disclaimer-container li[data-disclaimer-target], section.page-disclaimer li[data-disclaimer-target]')
    .forEach((li) => {
      const target = (li.getAttribute('data-disclaimer-target') || '').trim();
      if (triggers.has(target) || !li.classList.contains('hide')) return;
      const list = li.closest('section.page-disclaimer') || li.parentElement;
      li.remove();
      if (list) pruned.add(list);
    });
  // A pruned disclaimer list with no item left is dropped, with its wrappers
  // when they hold nothing else.
  pruned.forEach((list) => {
    if (!list.isConnected || list.querySelector('li')) return;
    let el = list;
    while (el.parentElement && !el.parentElement.matches('body, main')
      && el.parentElement.textContent.trim() === el.textContent.trim()) {
      el = el.parentElement;
    }
    el.remove();
  });
}

// ---------------------------------------------------------------------------
// In-page modals: div.modal-overlay#modal-<name> opened by a content link
// [data-globalmodal="<name>"] (tech specs, state fees, "who qualifies"...).
// The project has no modal block and the catalog's per-page cleanup removes
// the overlays, which loses that content. A modal the page actually links to
// is moved to the end of the content (its own unstyled section) and its
// trigger links point at the modal's first heading. Orphan modals (no trigger
// in the content: test / promo leftovers) are left to the cleanup.
const MODAL_SEL = 'div.modal-overlay[id^="modal-"]';

// helix-importer heading ids: github-slugger, then leading digits stripped
function headingSlug(heading) {
  return (heading.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-')
    .replace(/^\d+-+/, '');
}

// A modal whose text the page already shows (e.g. #modal-free "Who qualifies for
// Free Online?": its Included / Excluded lists are rendered inline at the end of
// the homepage, w-4-calculator, tax-prep-checklist) is not rescued: importing it
// would duplicate that content. Its triggers point at the visible copy instead.
const HEADINGS_SEL = 'h1, h2, h3, h4, h5, h6';

function visibleDuplicate(document, body) {
  const items = safeQueryAll(body, 'li, p')
    .filter((el) => !el.querySelector('li, p'))
    .map((el) => normText(el.textContent))
    .filter((t) => t.length > 12);
  if (items.length < 3) return null;
  const pageTexts = new Set(safeQueryAll(document.body, 'li, p, h1, h2, h3, h4, h5, h6, div, span')
    .filter((el) => !el.closest(MODAL_SEL) && !el.closest('header, footer, nav') && el.closest(CONTENT_ROOTS))
    .map((el) => normText(el.textContent)));
  const found = items.filter((t) => pageTexts.has(t)).length;
  if (found / items.length < 0.6) return null;
  // link the triggers to the first visible heading the modal shares with the page
  const pageHeadings = safeQueryAll(document.body, HEADINGS_SEL)
    .filter((h) => !h.closest(MODAL_SEL) && !h.closest('header, footer, nav') && h.closest(CONTENT_ROOTS));
  const modalHeadings = safeQueryAll(body, HEADINGS_SEL).map((h) => normText(h.textContent)).filter(Boolean);
  const match = pageHeadings.find((h) => modalHeadings.includes(normText(h.textContent)));
  return { slug: match ? headingSlug(match) : '' };
}

function rescueLinkedModals(document) {
  const seen = new Set();
  const rescued = [];
  safeQueryAll(document, MODAL_SEL).forEach((modal) => {
    const root = modal.closest(CONTENT_ROOTS);
    if (!root || modal.closest('header, footer, nav')) return;
    const name = modal.id.slice('modal-'.length);
    if (seen.has(name)) { modal.remove(); return; }
    const triggers = safeQueryAll(document, `[data-globalmodal="${name}"]`)
      .filter((t) => !t.closest(MODAL_SEL) && !t.closest('header, footer, nav') && t.closest(CONTENT_ROOTS));
    if (!triggers.length) return;
    seen.add(name);
    const body = modal.querySelector(':scope > .modal') || modal;
    safeQueryAll(body, '.modal-close, [data-globalmodalclose]').forEach((b) => b.remove());
    if (!body.textContent.trim()) return;
    const duplicate = visibleDuplicate(document, body);
    if (duplicate) {
      triggers.forEach((t) => {
        if (t.tagName === 'A') t.setAttribute('href', duplicate.slug ? `#${duplicate.slug}` : '#');
        t.removeAttribute('data-globalmodal');
        t.removeAttribute('data-target');
      });
      modal.remove();
      return;
    }
    const heading = [...body.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .find((h) => h.textContent.trim() && !h.matches('.eyebrow-label, .color-eyebrow'));
    const slug = heading ? headingSlug(heading) : '';
    triggers.forEach((t) => {
      if (t.tagName === 'A') t.setAttribute('href', slug ? `#${slug}` : '#');
      t.removeAttribute('data-globalmodal');
      t.removeAttribute('data-target');
    });
    const wrapper = document.createElement('section');
    wrapper.className = 'white-theme excat-modal-content';
    wrapper.append(...body.childNodes);
    [wrapper, ...wrapper.querySelectorAll('*')].forEach((el) => el.removeAttribute(CLEANUP_ATTR));
    // accordion toggles around / inside the modal headings are not links
    const HEADINGS = 'h1, h2, h3, h4, h5, h6';
    safeQueryAll(wrapper, 'button, a[href="#"], a[href^="javascript:" i], a[role="button"], a:not([href])')
      .filter((t) => t.closest(HEADINGS) || t.querySelector(HEADINGS))
      .forEach((t) => {
        t.querySelectorAll('svg').forEach((s) => s.remove());
        if (t.querySelector(HEADINGS)) t.replaceWith(...t.childNodes);
        else t.replaceWith(document.createTextNode(t.textContent.replace(/\s+/g, ' ').trim()));
      });
    modal.remove();
    rescued.push({ root, wrapper });
  });
  rescued.forEach(({ root, wrapper }) => root.append(wrapper));
}

function applyCatalogRulesOutsideMain(document) {
  CATALOG_CLEANUP_RULES.forEach((rule) => {
    safeQueryAll(document.body || document, rule).forEach((el) => {
      if (!el.isConnected) return;
      if (el.matches('html, body, head') || el.closest('head')) return;
      if (el.closest(CONTENT_ROOTS)) return;
      if (el.querySelector(CONTENT_ROOTS)) return;
      el.remove();
    });
  });
}

function removeAll(root, selectors) {
  selectors.forEach((selector) => {
    safeQueryAll(root, selector).forEach((el) => {
      if (el.isConnected) el.remove();
    });
  });
}

function isEmptyWidget(el) {
  if (el.matches(CONTENT_ROOTS) || el.querySelector(CONTENT_ROOTS)) return false;
  if (el.querySelector('picture, video, iframe:not(.hidden), table, form')) return false;
  const imgs = [...el.querySelectorAll('img')].filter((img) => {
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    return !(w === '0' || h === '0' || w === '1' || h === '1');
  });
  if (imgs.length) return false;
  return el.textContent.replace(/\s+/g, '').length === 0;
}

// A source <table> left in default content would become a bogus block named
// after its first cell (e.g. "1099-nec1099-k"). Single-row tables are rich-text
// layout grids: unwrap their cells. Multi-row tables are data: table-data block
// (first row = column header). Tables a parser placed inside a block are left.
const SOURCE_TABLE_ATTR = 'data-excat-src-table';

function convertSourceTables(element, document) {
  const tables = safeQueryAll(element, `table[${SOURCE_TABLE_ATTR}]`).reverse(); // inner first
  tables.forEach((table) => {
    if (!table.isConnected) return;
    table.removeAttribute(SOURCE_TABLE_ATTR);
    if (table.parentElement && table.parentElement.closest('table')) return;
    const rows = [...table.rows].filter((tr) => !tr.closest('table') || tr.closest('table') === table);
    const cellsOf = (tr) => [...tr.cells];
    if (rows.length <= 1) {
      const holder = document.createElement('div');
      rows.forEach((tr) => cellsOf(tr).forEach((cell) => {
        const div = document.createElement('div');
        div.append(...cell.childNodes);
        holder.append(div);
      }));
      table.replaceWith(holder);
      return;
    }
    const cells = rows
      .map((tr) => cellsOf(tr).map((cell) => {
        const div = document.createElement('div');
        div.append(...cell.childNodes);
        return div;
      }))
      .filter((r) => r.some((c) => c.textContent.trim() || c.querySelector('img, picture')));
    if (!cells.length) { table.remove(); return; }
    table.replaceWith(WebImporter.Blocks.createBlock(document, { name: 'table-data', cells }));
  });
}


// ---------------------------------------------------------------------------
// Source <hr> dividers: helix-importer's preProcess drops every <hr> before
// transform(). The preprocess hook swaps them for a placeholder, beforeTransform
// restores them (parsers keep dividers inside blocks, e.g. columns-callout) and
// afterTransform drops the ones left in default content (an <hr> there would
// be a section break).
const HR_PLACEHOLDER = 'excat-src-hr';
const SECTION_MARKER_ATTR = 'data-excat-section-style';

function protectSourceRules(document) {
  safeQueryAll(document.body || document, 'hr').forEach((hr) => {
    if (hr.closest('header, footer, nav')) return;
    const div = document.createElement('div');
    div.className = HR_PLACEHOLDER;
    hr.replaceWith(div);
  });
}

function restoreSourceRules(document) {
  safeQueryAll(document, `div.${HR_PLACEHOLDER}`).forEach((div) => {
    div.replaceWith(document.createElement('hr'));
  });
}

// ---------------------------------------------------------------------------
// Responsive duplicates: the source renders desktop / tablet / mobile copies
// and hides all but one with CSS. Elements hidden at desktop width are dropped
// (verified on the pilot pages: .hide-large; .show-small / .show-medium /
// .show-desk-small without .show-large; the article meta bar mobile copy;
// the expat article post-info mobile meta copy and its hidden Key Takeaways
// excerpt, a truncated duplicate of the first paragraph).
const HIDDEN_AT_DESKTOP = [
  '.hide-large',
  '.show-small:not(.show-large)',
  '.show-medium:not(.show-large)',
  '.show-desk-small:not(.show-large)',
  '.tic-article-detail-bar--mobile',
  '#site-content .post-info.tablet-down-only',
  '#site-content .at-a-glance[style*="display: none"]',
  '#site-content .at-a-glance[style*="display:none"]',
  // hero figure tablet / mobile renditions next to the desktop one (hero-banner
  // keeps herodefaultview; a hero left as default content would show all three)
  'img.herodefaultview ~ img.herotabview',
  'img.herodefaultview ~ img.heromobview',
].join(', ');

function absoluteUrl(href) {
  try { return new URL(href, 'https://www.hrblock.com/').href; } catch (e) { return href; }
}

function dropDesktopHidden(document) {
  const hidden = safeQueryAll(document.body || document, HIDDEN_AT_DESKTOP)
    .filter((el) => !el.parentElement || !el.parentElement.closest(HIDDEN_AT_DESKTOP));
  const allPlayers = safeQueryAll(document, 'lottie-player[src]');
  hidden.forEach((el) => {
    if (!el.isConnected) return;
    if (el.matches(CONTENT_ROOTS) || el.querySelector(CONTENT_ROOTS)) return;
    if (el.closest('header, footer, nav')) return;
    // never drop an element the catalog maps to a block
    if (el.matches('[data-excat-match]') || el.querySelector('[data-excat-match]')) return;
    // mobile Lottie composition: hand its JSON to the preceding desktop player
    el.querySelectorAll('lottie-player[src]').forEach((mobile) => {
      const desktop = allPlayers.filter((pl) => pl !== mobile && !pl.closest(HIDDEN_AT_DESKTOP)
        && (pl.compareDocumentPosition(mobile) & 4)).pop();
      if (desktop && !desktop.hasAttribute('data-excat-narrow-src')) {
        desktop.setAttribute('data-excat-narrow-src', absoluteUrl(mobile.getAttribute('src')));
      }
    });
    el.remove();
  });
}

// ---------------------------------------------------------------------------
// Source buttons: outline buttons (.btn--transparent-*, *--outline) are the
// EDS secondary button (italic link), filled ones primary (bold link).
// Parsers rebuild CTAs from text + href, so the source kinds are recorded
// (in document order, per text + href) before parsing and applied afterwards.
const BUTTON_SEL = 'a[class*="btn"], button[class*="btn"], a[class*="ba-button"]';
const NOT_A_CTA = '.btn-medium-t, [role="tab"], .btn-close, .btn-image, .show-hide-toggle, .hide-show-toggle';
const SECONDARY_RE = /(^|\s)(btn--transparent[\w-]*|[\w-]*--outline)(\s|$)/;
const buttonRegistry = new WeakMap();

function normText(t) {
  return (t || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function normHref(href) {
  const h = (href || '').trim();
  if (!h || h === '#' || /^javascript:/i.test(h)) return '#';
  try {
    const u = new URL(h, 'https://www.hrblock.com/');
    if (/(^|\.)hrblock\.com$/.test(u.hostname)) return `${u.pathname.replace(/\/$/, '')}${u.search}`;
    return u.href;
  } catch (e) {
    return h;
  }
}

function recordButtons(document) {
  const reg = new Map();
  safeQueryAll(document.body || document, BUTTON_SEL).forEach((b) => {
    if (b.matches(NOT_A_CTA) || b.closest('header, footer, nav')) return;
    const label = normText(b.textContent);
    if (!label) return;
    const key = `${label}|${normHref(b.getAttribute('href'))}`;
    const kind = SECONDARY_RE.test(b.className || '') ? 'secondary' : 'primary';
    if (!reg.has(key)) reg.set(key, []);
    reg.get(key).push(kind);
  });
  buttonRegistry.set(document, reg);
}

function applyButtonKinds(root, document) {
  const reg = buttonRegistry.get(document);
  if (!reg || !reg.size) return;
  safeQueryAll(root, 'a[href]').forEach((a) => {
    const p = a.closest('p');
    if (!p || a.closest('h1, h2, h3, h4, h5, h6')) return;
    if (a.querySelector('img, picture')) return;
    const label = normText(a.textContent);
    if (!label || normText(p.textContent) !== label) return;
    const kinds = reg.get(`${label}|${normHref(a.getAttribute('href'))}`);
    if (!kinds || !kinds.length) return;
    const kind = kinds.every((k) => k === kinds[0]) ? kinds[0] : kinds.shift();
    const parent = a.parentElement;
    const wrapped = parent && parent !== p && /^(STRONG|B|EM|I)$/.test(parent.tagName) ? parent : null;
    if (kind === 'secondary') {
      if (wrapped && /^(EM|I)$/.test(wrapped.tagName) && wrapped.parentElement === p) return;
      const em = document.createElement('em');
      if (wrapped) { wrapped.replaceWith(em); em.append(a); } else { a.replaceWith(em); em.append(a); }
    } else if (!wrapped && parent === p) {
      const strong = document.createElement('strong');
      a.replaceWith(strong);
      strong.append(a);
    }
  });
}

// ---------------------------------------------------------------------------
// Strikethrough prices: keep <del> and keep it apart from adjacent text so the
// markdown round-trip (~~...~~ needs a word boundary) does not leave it literal.
function normalizeStrikethrough(root, document) {
  safeQueryAll(root, 's, strike').forEach((s) => {
    const del = document.createElement('del');
    del.append(...s.childNodes);
    s.replaceWith(del);
  });
  safeQueryAll(root, 'del').forEach((del) => {
    if (!del.textContent.trim()) { del.remove(); return; }
    const prev = del.previousSibling;
    const next = del.nextSibling;
    const endsWord = (n) => n && n.textContent && /\S$/.test(n.textContent) && !(n.nodeType === 1 && n.tagName === 'BR');
    const startsWord = (n) => n && n.textContent && /^\S/.test(n.textContent) && !(n.nodeType === 1 && n.tagName === 'BR');
    if (endsWord(prev)) del.before(document.createTextNode(' '));
    if (startsWord(next)) del.after(document.createTextNode(' '));
  });
}

// ---------------------------------------------------------------------------
// CSS icons: helix-importer copies computed background-images into inline
// styles and transformBackgroundImages() keeps only the text before the first
// comma, so data:image/svg+xml icons (e.g. .hrb-icon-link--check) arrive as
// empty images. Serialize them into a proper base64 data URI image instead;
// decorative SVG backgrounds on large containers are dropped.
const ICON_HOST_RE = /icon|check|bullet|arrow/i;

function svgDataUri(cssValue) {
  const v = cssValue || '';
  const start = v.search(/url\(/i);
  if (start < 0) return null;
  let i = start + 4;
  while (v[i] === ' ') i += 1;
  const quote = v[i] === '"' || v[i] === "'" ? v[i] : '';
  if (quote) i += 1;
  let end = quote ? v.indexOf(quote, i) : v.indexOf(')', i);
  while (quote && end > 0 && v[end - 1] === '\\') end = v.indexOf(quote, end + 1);
  if (end < 0) return null;
  const uri = quote ? v.slice(i, end).replace(/\\(["'])/g, '$1') : v.slice(i, end).trim();
  if (!/^data:image\/svg\+xml/i.test(uri)) return null;
  const comma = uri.indexOf(',');
  if (comma < 0) return null;
  const meta = uri.slice(0, comma);
  const data = uri.slice(comma + 1);
  if (!data) return null;
  if (/;base64$/i.test(meta)) return `data:image/svg+xml;base64,${data}`;
  let svg = data;
  try { svg = decodeURIComponent(data); } catch (e) { /* keep raw */ }
  try {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  } catch (e) {
    return null;
  }
}

function convertSvgBackgrounds(root, document) {
  safeQueryAll(root, '[style*="background-image"]').forEach((el) => {
    const value = el.style && el.style.backgroundImage;
    if (!value || !/data:image\/svg\+xml/i.test(value)) return;
    el.style.removeProperty('background-image');
    if (!el.getAttribute('style')) el.removeAttribute('style');
    const isIcon = el.matches('span, i, a, li, p') || ICON_HOST_RE.test(el.className || '');
    if (!isIcon) return;
    const src = svgDataUri(value);
    if (!src) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    el.prepend(img);
  });
}

// ---------------------------------------------------------------------------
// Live page state. Parsers run on a parsed copy of the page (no scripts, no
// styles), so state only the live page has is captured in the preprocess hook
// (which runs on the live DOM) as data attributes:
//  - price-estimator: the starting price of each situation is computed by the
//    page script; toggle each checkbox, read the price box, toggle it back and
//    keep the price as input[data-price] (when it differs from the base price).
//  - review-filter: the dropdown placeholders are CSS generated content
//    (::after); keep them as data-excat-label.
function captureLiveState(document) {
  safeQueryAll(document, '.pricing-tool-section').forEach((tool) => {
    const priceEl = tool.querySelector('.price-box .pricing > span, .price-box .pricing strong');
    if (!priceEl) return;
    const read = () => priceEl.textContent.replace(/\s+/g, '').trim();
    tool.querySelectorAll('.price-pill-list input[type="checkbox"]').forEach((input) => {
      if (input.hasAttribute('data-price') || typeof input.click !== 'function') return;
      try {
        const wasChecked = !!input.checked;
        if (wasChecked) input.click();
        const base = read();
        input.click();
        const selected = read();
        input.click();
        if (wasChecked) input.click();
        if (selected && selected !== base) input.setAttribute('data-price', selected);
      } catch (e) { /* page handler failed: leave the price empty */ }
    });
  });
  const view = document.defaultView;
  if (!view || typeof view.getComputedStyle !== 'function') return;
  safeQueryAll(document, '#review-form-selector .button-container-one, #review-form-selector .placeholder-button').forEach((el) => {
    try {
      const content = view.getComputedStyle(el, '::after').content || '';
      const m = content.match(/^["'](.*)["']$/);
      const label = m ? m[1].replace(/\\(.)/g, '$1').trim() : '';
      if (label) el.setAttribute('data-excat-label', label);
    } catch (e) { /* no computed style */ }
  });
}

/*
 * YouTube video cards (div.video[data-videotype="youtube"], /responsibilityisland/):
 * the player script builds the iframe from an HTML comment inside the card
 * ("<!--<iframe src="https://www.youtube.com/embed/ID?...">-->"), which the
 * parsers never see. Keep the watch URL as data-excat-video on the
 * .video-container (preprocess runs on the untouched DOM). Internal Scene7
 * videos (data-videotype="internalVideo") have no comment and are unchanged.
 */
function captureVideoEmbeds(document) {
  safeQueryAll(document, '.video-container .video[data-videotype="youtube"]').forEach((video) => {
    const container = video.closest('.video-container');
    if (!container || container.hasAttribute('data-excat-video')) return;
    const walker = document.createTreeWalker(video, 128 /* NodeFilter.SHOW_COMMENT */);
    let node = walker.nextNode();
    while (node) {
      const m = (node.textContent || '').match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/i);
      if (m) {
        container.setAttribute('data-excat-video', `https://www.youtube.com/watch?v=${m[1]}`);
        return;
      }
      node = walker.nextNode();
    }
  });
}

/*
 * MyBlock Angular apps (body > myblock-root, /login/): only the rendered sign-in
 * card is page content. The app root also carries hidden dialogs (timeout,
 * errors, browser controls, full legal agreements) that the importer would dump
 * as raw text. Keep the card's heading, copy and button labels as plain
 * default content (JS-only buttons -> "#" links); drop the rest of the app.
 */
function flattenAngularApp(document) {
  const root = document.querySelector('body > myblock-root');
  if (!root) return;
  const card = root.querySelector('main');
  const out = document.createElement('div');
  if (card) {
    const t = (el) => el.textContent.replace(/\s+/g, ' ').trim();
    const seen = new Set();
    card.querySelectorAll('h1, h2, h3, hrb-text, button').forEach((el) => {
      const text = t(el);
      if (!text || seen.has(text) || (el.tagName === 'HRB-TEXT' && el.querySelector('h1, h2, h3'))) return;
      if (el.tagName === 'BUTTON' && el.disabled) return;
      seen.add(text);
      let node;
      if (/^H[1-3]$/.test(el.tagName)) {
        node = document.createElement(el.tagName.toLowerCase());
        node.textContent = text;
      } else if (el.tagName === 'BUTTON') {
        node = document.createElement('p');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = text;
        strong.append(a);
        node.append(strong);
      } else {
        node = document.createElement('p');
        node.textContent = text;
      }
      out.append(node);
    });
  }
  root.replaceWith(out);
}

// ---------------------------------------------------------------------------
// Content hidden on the live page: personalization variants and empty states
// shipped with an inline display:none (small-business-payroll-services hidden
// eggshell bands, resource-center/search #search-page-no-results). Only page
// bands are dropped (a <section>, or a direct child of the content containers),
// never accordion / tab panels, and never when a visible trigger targets them.
const INLINE_HIDDEN_SEL = '[style*="display: none"], [style*="display:none"]';
const BAND_PARENT_SEL = 'main, #site-content, .cmp-container, div.root, body';
const TOGGLED_SEL = '.accordion__content, .accordion, [role="tabpanel"], .tab-pane, .tab-content, .tabs, [aria-hidden], form, table';

function hasVisibleTrigger(document, el) {
  if (!el.id) return false;
  const id = el.id.replace(/"/g, '\\"');
  return safeQueryAll(document.body, `a[href="#${id}"], [data-target="#${id}"], [aria-controls="${id}"], [data-cta-link="#${id}"]`)
    .some((t) => !el.contains(t) && !t.closest(INLINE_HIDDEN_SEL));
}

function dropInlineHidden(document) {
  safeQueryAll(document.body || document, INLINE_HIDDEN_SEL).forEach((el) => {
    if (!el.isConnected || el.closest('header, footer, nav')) return;
    if (!el.closest(CONTENT_ROOTS) || el.matches(CONTENT_ROOTS) || el.querySelector('main, #site-content')) return;
    if (el.matches(TOGGLED_SEL) || el.closest(TOGGLED_SEL)) return;
    if (el.matches(MODAL_SEL) || el.closest(MODAL_SEL)) return; // modals: rescueLinkedModals
    const isBand = el.tagName === 'SECTION' || (el.parentElement && el.parentElement.matches(BAND_PARENT_SEL));
    if (!isBand || !el.textContent.trim()) return;
    if (hasVisibleTrigger(document, el)) return;
    el.remove();
  });
}

// ---------------------------------------------------------------------------
// In-page jump links: AEM CTAs keep their target in data-cta-link="#bloch" (the
// href is javascript:void(0)); TOC links use href="#information". The target
// ids sit on empty anchors (a#bloch.url-deeplink-class) or wrappers that do not
// survive the import, so links point at the EDS id of the heading the target
// introduces (helix heading ids, see headingSlug).
const NOT_A_JUMP = '.accordion, .accordion *, [role="tab"], [aria-controls], [data-toggle], [data-bs-toggle], [data-globalmodal], [data-disclaimer-trigger]';

function targetHeading(document, target) {
  const isHeading = (el) => el.matches(HEADINGS_SEL) && el.textContent.trim()
    && !el.matches('.eyebrow-label, .color-eyebrow') && !el.closest('header, footer, nav');
  if (isHeading(target)) return target;
  const inside = safeQueryAll(target, HEADINGS_SEL).find(isHeading);
  if (inside) return inside;
  const walker = document.createTreeWalker(document.body, 1);
  walker.currentNode = target;
  let node = walker.nextNode();
  while (node) {
    if (isHeading(node) && !target.contains(node)) return node;
    node = walker.nextNode();
  }
  return null;
}

function resolveJumpLinks(document) {
  safeQueryAll(document.body || document, 'a[data-cta-link^="#"], button[data-cta-link^="#"], a[href^="#"]').forEach((el) => {
    if (!el.isConnected || el.closest('header, footer, nav') || el.matches(NOT_A_JUMP)) return;
    const raw = (el.getAttribute('data-cta-link') || el.getAttribute('href') || '').trim();
    let id = raw.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || target === el || target.matches('.accordion__content, [role="tabpanel"]')) return;
    const heading = targetHeading(document, target);
    let slug = '';
    if (heading) {
      // screen-reader labels / footnote markers are not part of the EDS heading text
      const clone = heading.cloneNode(true);
      clone.querySelectorAll('.reader, .sr-only, .visually-hidden, sup').forEach((n) => n.remove());
      slug = headingSlug(clone);
    }
    if (!slug) return;
    if (el.tagName === 'A') {
      el.setAttribute('href', `#${slug}`);
    } else {
      const a = document.createElement('a');
      [...el.attributes].forEach((at) => { if (!/^(type|role|onclick)$/i.test(at.name)) a.setAttribute(at.name, at.value); });
      a.setAttribute('href', `#${slug}`);
      a.append(...el.childNodes);
      el.replaceWith(a);
    }
  });
}

// ---------------------------------------------------------------------------
// Eyebrow labels (source .eyebrow-label / .color-eyebrow pills, 14px) marked up
// as headings stay a short paragraph before the heading in default content
// (scripts.js decorates it as .eyebrow, as blocks do with their eyebrows).
function eyebrowHeadingsToParagraphs(root, document) {
  safeQueryAll(root, 'h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow, h5.color-eyebrow, h6.color-eyebrow').forEach((h) => {
    if (h.closest('table') || !h.textContent.trim()) return;
    const p = document.createElement('p');
    p.textContent = h.textContent.replace(/\s+/g, ' ').trim();
    h.replaceWith(p);
  });
}

// ---------------------------------------------------------------------------
// One paragraph per CTA: source CTAs sit side by side (div.btn-container >
// div > a.btn), which html2md flattens into one run-together paragraph. Each
// CTA left in default content gets its own <p> so applyButtonKinds can make it
// a primary (strong) / secondary (em) button.
function ctaUnit(a) {
  const parent = a.parentElement;
  if (parent && /^(STRONG|B|EM|I)$/.test(parent.tagName) && normText(parent.textContent) === normText(a.textContent)) return parent;
  return a;
}

function isolateCtas(root, document) {
  const ctas = safeQueryAll(root, `${BUTTON_SEL}, .btn-container a[href]`)
    .filter((a) => a.tagName === 'A' && !a.closest('table, header, footer, nav, h1, h2, h3, h4, h5, h6')
      // real list items keep their links (ul.column-container > li is the layout grid)
      && !(a.closest('li') && !a.closest('li').matches('ul.column-container > li'))
      && !a.matches(NOT_A_CTA) && normText(a.textContent) && !a.querySelector('img, picture'));
  const units = [...new Set(ctas.map(ctaUnit))];
  const unitSet = new Set(units);
  // 1. paragraphs holding only CTAs: one paragraph per CTA
  const paras = [...new Set(units.map((u) => u.parentElement).filter((p) => p && p.tagName === 'P'))];
  paras.forEach((p) => {
    const kids = [...p.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
    const own = kids.filter((n) => unitSet.has(n));
    if (own.length < 2 || own.length !== kids.filter((n) => !(n.nodeType === 1 && n.tagName === 'BR')).length) return;
    own.forEach((u) => {
      const np = document.createElement('p');
      np.append(u);
      p.before(np);
    });
    p.remove();
  });
  // 2. CTAs outside any paragraph (div wrappers): wrap each one
  units.forEach((u) => {
    if (!u.isConnected || u.closest('p')) return;
    const parent = u.parentElement;
    if (!parent) return;
    // inline in running text: leave it
    const textAround = [...parent.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (textAround) return;
    const p = document.createElement('p');
    u.before(p);
    p.append(u);
  });
}

// ---------------------------------------------------------------------------
// Footnote markers: <sup>* (button.js-disclaimer-link)</sup> follows the item
// text; when that text is a block (p) the sup became its own paragraph. Keep
// it inline at the end of the preceding text block.
function inlineFootnoteMarkers(root) {
  safeQueryAll(root, 'sup').forEach((sup) => {
    if (sup.closest('p, h1, h2, h3, h4, h5, h6')) return;
    let prev = sup.previousSibling;
    while (prev && prev.nodeType === 3 && !prev.textContent.trim()) prev = prev.previousSibling;
    if (!prev || prev.nodeType !== 1) return;
    let host = null;
    if (prev.matches('p, h1, h2, h3, h4, h5, h6')) host = prev;
    else if (prev.matches('div')) host = [...prev.querySelectorAll('p')].pop() || null;
    if (!host) return;
    host.append(sup);
  });
  // disclaimer buttons inside sup: keep the marker text only
  safeQueryAll(root, 'sup button').forEach((b) => b.replaceWith(b.ownerDocument.createTextNode(b.textContent.replace(/\s+/g, ' ').trim())));
}

// ---------------------------------------------------------------------------
// Page Template metadata (scopes global CSS: body.expat / body.expat-article).
// Only the expat resource center (/expat-tax-preparation/resource-center/...,
// built on WordPress with the charcoal expat theme) is `expat`; its articles
// (section.ba-article, or an article template) are `expat-article`. The other
// expat landing pages are built on AEM like the main site and use its forest
// text colour, so they get no template. Read by the import script's metadata step
// (params.excatMetadata, see migration-work/gen-import.js).
const EXPAT_ARTICLE_TEMPLATES = ['resource-article', 'resource-article-steps', 'resource-article-steps-alt', 'resource-guide-article'];

function pageTemplate(document, payload) {
  const urls = getPageUrl(document, payload);
  let path = '';
  for (const u of urls) {
    try { path = new URL(u, 'https://www.hrblock.com/').pathname; break; } catch (e) { /* next */ }
  }
  if (!/^\/expat-tax-preparation\/resource-center(\/|$)/i.test(path)) return '';
  const tpl = payload && payload.template && payload.template.name;
  const isArticle = !!document.querySelector('section.ba-article, .article-sidebar')
    || (EXPAT_ARTICLE_TEMPLATES.includes(tpl) && /\/resource-center\//i.test(path));
  return isArticle ? 'expat-article' : 'expat';
}

function removeSiteChrome(document) {
  const body = document.body;
  if (!body) return;

  // Skip links / hidden anti-bot anchor at the very start of body
  removeAll(document, [
    'body > a:first-child',
    'body > a[aria-hidden="true"]',
    'body > a.skip-links',
    'a.skip-links',
  ]);

  // Global header / nav / footer (AEM site) and expat sub-site header/footer
  removeAll(document, [
    'body > header.site-header',
    'header.site-header',
    'nav#main-nav',
    'footer.site-footer',
    'body > header.header',
    'body > footer.footer',
    'header.header:not(main *)',
    'footer.footer:not(main *)',
    '#ada-nav-skip',
    // scroll-revealed sticky header CTA (duplicate of the header button)
    '.sticky-header-btn',
    '#consent_blackbar',
    '#hrb_pixel_tracker_div',
    '[id^="batBeacon"]',
    '#kampyleButtonContainer',
    // Medallia (Kampyle) feedback survey frame injected outside main (/login/)
    'iframe[src*="kampyle.com"]',
    'body > iframe',
    'body > input[type="hidden"]',
    // body-level tracking pixels (simpli.fi, googleadservices, bing, ...)
    'body > img',
    // reCAPTCHA challenge frame appended to body (would import as a link); the
    // block has no reCAPTCHA, the in-form widget is skipped by contact-form
    'iframe[src*="google.com/recaptcha"]',
  ]);

  // Body-level wrappers left empty (footer wrapper, tracking divs, ...)
  [...body.children].forEach((el) => {
    if (!el.matches('div, span, section, aside')) return;
    if (isEmptyWidget(el)) el.remove();
  });
}

export default function transform(hookName, element, payload) {
  const document = (element && element.ownerDocument) || (payload && payload.document);
  if (!document) return;

  if (hookName === 'preprocess') {
    // Resolve the catalog's per-page cleanup selectors on the raw DOM.
    const entries = findPageCleanup(document, payload);
    if (Array.isArray(entries)) {
      cleanupTargets(document, entries).forEach((el) => el.setAttribute(CLEANUP_ATTR, ''));
    }
    document.documentElement.setAttribute(CLEANUP_RESOLVED_ATTR, 'true');
    protectSourceRules(document);
    captureLiveState(document);
    captureVideoEmbeds(document);
    // in-page jump links -> EDS heading ids (raw DOM: helix-importer drops the
    // empty target anchors, e.g. a#bloch, before transform)
    resolveJumpLinks(document);
    // <span><br></span> (e.g. "Written by:<span><br></span> name"): helix-importer
    // drops text-less bare spans with their <br>; keep the line break
    safeQueryAll(document.body || document, 'span').forEach((span) => {
      if (span.attributes.length || span.textContent.trim()) return;
      const kids = [...span.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
      if (kids.length && kids.every((n) => n.nodeType === 1 && n.tagName === 'BR')) span.replaceWith(...kids);
    });
    return;
  }

  if (hookName === 'beforeTransform') {
    // page Template metadata (decided on the source DOM, before parsers run)
    const tplName = pageTemplate(document, payload);
    if (tplName && payload && payload.params) {
      payload.params.excatMetadata = { ...(payload.params.excatMetadata || {}), template: tplName };
    }
    // content hidden on the live page (inline display:none bands)
    dropInlineHidden(document);
    // 0. modals the page links to are content (before the per-page cleanup removes them)
    rescueLinkedModals(document);
    // 1. per-page cleanup recorded in the catalog
    const entries = findPageCleanup(document, payload);
    if (Array.isArray(entries)) replayPageCleanup(document, entries);
    pruneDisclaimers(document);

    // Tag source <table>s so afterTransform can tell them from block tables.
    safeQueryAll(document, 'table').forEach((t) => t.setAttribute(SOURCE_TABLE_ATTR, ''));

    // "Compare / Hide options" toggles (a or button) above collapsed comparison
    // tables: table-data has no collapse, the tables are always shown, so the
    // non-functional toggle labels are dropped.
    removeAll(document, [
      '.showhide-table .hide-show-toggle',
      '.showhide-table .show-hide-toggle',
      // testimonial slider controls (dot pagination + prev/next) would become
      // an empty list in the default-content testimonial list
      'nav.pagination-nav:has(~ button.testimonial-btn)',
      'button.testimonial-btn',
      // star-rating icons (aria-hidden SVGs) of a testimonial card: an empty
      // five-item list once the SVGs are dropped
      'ul.testimonial-ratings',
      // /makeeveryblockbetter/ map: JS-filled state article box ("-- -- --"
      // placeholders until a state is picked)
      '#mebb-component-map--article',
      // international office pages: JS "See more / See less" toggles of the office services
      // list (hidden, no href) would become empty links in default content
      'a.opp-services-seemore',
      'a.opp-services-seeless',
      // screen-reader label of a footnote marker ("*Go to disclaimer 35 for more details"):
      // parsers drop span.reader in blocks; in default content it showed in the heading text
      'button.js-disclaimer-link span.reader',
      'button.symbol-disclaimer span.reader',
    ]);

    restoreSourceRules(document);
    dropDesktopHidden(document);
    recordButtons(document);

    // schema.org currency markers (<span class="hide" content="USD">$</span>)
    // would leave a stray "$" before prices.
    removeAll(document, ['span.hide[content]', '[itemprop="priceCurrency"].hide']);
    // source bold utility spans are authored bold text
    safeQueryAll(document, 'span.font-bold, span.bold, span.font-weight-bold').forEach((span) => {
      if (span.closest('h1, h2, h3, h4, h5, h6, header, footer, nav')) return;
      if (!span.textContent.trim()) return;
      // wrap the content (the span may host a CSS icon: inline background-image)
      const strong = document.createElement('strong');
      strong.append(...span.childNodes);
      span.append(strong);
    });

    // 2. catalog-wide rules, outside main only
    applyCatalogRulesOutsideMain(document);

    // 3. chrome + non-authorable tags
    flattenAngularApp(document);
    removeSiteChrome(document);
    removeAll(element, [
      'script',
      'style',
      'noscript',
      'link',
      'template',
      'input[type="hidden"]',
    ]);
  }

  if (hookName === 'afterTransform') {
    removeAll(element, [
      'script',
      'style',
      'noscript',
      'link',
      'iframe.hidden',
      'img[src*="bat.bing.com"]',
      'img[src*="doubleclick.net"]',
      'img[src*="facebook.com/tr"]',
      'img[src*="googleadservices.com"]',
      'img[src*="simpli.fi"]',
      // broken placeholders (e.g. <img src=""> icons in comparison tables)
      'img[src=""]',
      'img:not([src])',
    ]);
    // The importer's markdown step rewrites each image src with a RegExp built
    // from the raw src (only "." escaped). A data URI that makes that pattern
    // invalid, or one that is huge, fails the whole page; drop such images.
    safeQueryAll(element, 'img[src^="data:"]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.length > MAX_DATA_URI_LENGTH || !isImporterSafeSrc(src)) img.remove();
    });
    convertSourceTables(element, document);
    // source dividers kept by parsers live in block cells; elsewhere they would
    // become section breaks (section markers carry SECTION_MARKER_ATTR)
    safeQueryAll(element, `hr:not([${SECTION_MARKER_ATTR}])`).forEach((hr) => {
      if (!hr.closest('table')) hr.remove();
    });
    safeQueryAll(element, `div.${HR_PLACEHOLDER}`).forEach((d) => d.remove());
    convertSvgBackgrounds(element, document);
    normalizeStrikethrough(element, document);
    // JS-only CTA <button>s left in default content (blocks already turned
    // theirs into "#" links) would become plain text: make them "#" links too,
    // so applyButtonKinds styles them like the parsers' CTAs.
    safeQueryAll(element, 'button[class*="btn"]').forEach((b) => {
      if (!b.isConnected || b.closest('table, form, header, footer, nav') || b.matches(NOT_A_CTA)) return;
      const label = b.textContent.replace(/\s+/g, ' ').trim();
      if (!label) return;
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = label;
      if (b.closest('p')) { b.replaceWith(a); return; }
      const p = document.createElement('p');
      p.append(a);
      b.replaceWith(p);
    });
    eyebrowHeadingsToParagraphs(element, document);
    inlineFootnoteMarkers(element);
    isolateCtas(element, document);
    applyButtonKinds(element, document);
    // JS-only links have no destination on EDS
    safeQueryAll(element, 'a[href^="javascript:" i]').forEach((a) => a.setAttribute('href', '#'));
    // ul.column-container > li.column is the site's layout grid, not a list:
    // default content left in it (section intros, CTAs) must not become
    // bullet items. Block tables are already built, so only layout remains.
    safeQueryAll(element, 'ul.column-container').forEach((ul) => {
      if (!ul.isConnected || ul.closest('table')) return;
      const grid = document.createElement('div');
      [...ul.children].forEach((li) => {
        const cell = document.createElement('div');
        cell.append(...li.childNodes);
        grid.append(cell);
      });
      ul.replaceWith(grid);
    });
    // Strip tracking / analytics attributes
    safeQueryAll(element, '[data-track], [data-animation], [onclick], [data-analytics]').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('data-animation');
      el.removeAttribute('onclick');
      el.removeAttribute('data-analytics');
    });
  }
}
