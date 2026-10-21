/* eslint-disable */
/* global WebImporter */

/**
 * citi.com cleanup transformer (template: standard-content-page).
 *
 * beforeTransform (runs before block discovery):
 *   1. Replays payload.template.pageCleanup for the current page (matched by
 *      origin + path, no trailing slash: the same key findBlocksOnPage uses for
 *      pageInstances). Each selector in order; a selector is applied only when
 *      it matches exactly one element.
 *   2. On pages NOT listed in pageCleanup, removes what still matches the
 *      catalog cleanup rules outside <main> (late-loading consent popups).
 *   3. On every page, removes site chrome that is not page content.
 * afterTransform: final sweep of script/style/noscript/tracking iframes.
 * HTML comments are never removed (parsers may write field hints).
 */

// catalog-template.json cleanup.rules[] (all type "popup")
const CATALOG_CLEANUP_RULES = [
  'body [class*="modal"]:not(nav *)',
  '[role="dialog"]',
  'body [class*="popup"]:not(nav *)',
];

// Site chrome removed on every page.
const CHROME_SELECTORS = [
  'citi-header',
  'citi-footer',
  'header.pil-stickynav',
  '#footer',
  '#navigationLeft', // primary-nav: migrated separately as the site header
  '#navigationRight', // utility-bar: migrated separately as the site header
  '.cdk-live-announcer-element',
  '.cdk-visually-hidden',
  '[id^="ZN_"]', // Qualtrics survey tag
  '.ensConsentWidget',
  '#ensNotifyBanner',
  '#ensModalWrapper',
  'tds-family-cta-sticky', // credit-card sticky offer bar: repeats the hero offer
  '[id^="batBeacon"]', // Bing ads beacons (hidden 0x0 pixels)
  '.benefitcards__mobilevariation', // hidden mobile copy of the benefit cards (duplicates the desktop row)
  'cds-banner-alert[idstr="clearUser-alert-id"]', // hidden "You've successfully cleared the User ID" alert
  '#a11y-message--new-window', // hidden screen-reader "Opens in a new window" template text (AEM pages)
  'cds-modal2', // cds-* pages: dialogs inside #maincontent, out of reach of the catalog popup rules
  'cds-sticky-nav', // sticky "Open an Account" bar: repeats the page's own CTAs
  '.sticky-pdp-container', // same sticky bar on the older product pages
];

// Lazy images: Citi renders a 1x1 data: placeholder in src and keeps the real URL in data-*. The
// importer turns the placeholder into a blob: URL that never loads, so promote the real URL first.
const LAZY_SRC_ATTRS = ['data-desktop-src', 'data-src', 'data-lazy-src', 'data-original', 'data-mobile-src'];

function resolveLazyImages(root) {
  safeQueryAll(root, 'img').forEach((img) => {
    const src = (img.getAttribute('src') || '').trim();
    if (src && !src.startsWith('data:') && !src.startsWith('blob:')) return;
    const real = LAZY_SRC_ATTRS.map((a) => (img.getAttribute(a) || '').trim()).find((v) => /^(https?:)?\/\//.test(v) || v.startsWith('/'));
    if (real) img.setAttribute('src', real);
  });
}

// Tracking pixels: they otherwise become the page's metadata image or land inside block cells.
const TRACKER_SRC = /bat\.bing\.com|doubleclick|facebook\.com\/tr|demdex|rlcdn|adsrvr|google-analytics|googletagmanager|t\.co\/i\/adsct|analytics\.twitter/i;

function removeTrackingPixels(root) {
  safeQueryAll(root, 'img').forEach((img) => {
    const w = img.getAttribute('width');
    const h = img.getAttribute('height');
    const src = img.getAttribute('src') || '';
    if (TRACKER_SRC.test(src) || w === '0' || h === '0' || (w === '1' && h === '1')) remove(img);
  });
}

const CONSENT_TEXT = /\b(cookie|consent|privacy choices|tracking technolog)/i;

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

function findPageCleanup(template, url) {
  const pageCleanup = (template && template.pageCleanup) || null;
  if (!pageCleanup || !url) return null;
  const key = pageKey(url);
  const entry = Object.entries(pageCleanup).find(([u]) => pageKey(u) === key);
  return entry ? entry[1] || [] : null;
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

function remove(el) {
  if (el && el.parentNode) el.remove();
}

function replayPageCleanup(document, selectors) {
  selectors.forEach((selector) => {
    const matches = safeQueryAll(document, selector);
    if (matches.length !== 1) return; // none or ambiguous: skip
    // Positional selectors can land on the article header (winter-trip-packing-list: eyebrow, h1,
    // date); page content holding the h1 is never a popup.
    if (matches[0].matches('h1') || matches[0].querySelector('h1')) return;
    remove(matches[0]);
  });
}

function applyCatalogRules(document) {
  const main = document.querySelector('main');
  CATALOG_CLEANUP_RULES.forEach((rule) => {
    safeQueryAll(document, rule).forEach((el) => {
      if (!el.isConnected) return;
      if (el === document.body || el === document.documentElement) return;
      if (main && (main.contains(el) || el.contains(main))) return; // only outside main
      remove(el);
    });
  });
}

// Elements a block claims on this page (its pageInstances). Chrome removal must not take them: on the
// travel pages #navigationLeft holds the Citi Travel sub-nav (section-subnav), not the site nav.
function claimedElements(document, template, url) {
  const key = pageKey(url);
  const claimed = [];
  ((template && template.blocks) || []).forEach((block) => {
    const [, selectors = []] = Object.entries(block.pageInstances || {})
      .find(([u]) => pageKey(u) === key) || [];
    selectors.forEach((selector) => claimed.push(...safeQueryAll(document, selector)));
  });
  return claimed;
}

function removeChrome(document, claimed = []) {
  const { body } = document;
  if (!body) return;
  CHROME_SELECTORS.forEach((selector) => {
    safeQueryAll(body, selector).forEach((el) => {
      if (!el.isConnected) return;
      // The element is a block, or part of one: keep it.
      if (claimed.some((c) => c === el || c.contains(el))) return;
      // A block inside the chrome (the travel sub-nav inside citi-header): lift the block out in
      // place, then drop the rest of the chrome.
      claimed
        .filter((c) => el.contains(c) && !claimed.some((o) => o !== c && o.contains(c)))
        .forEach((c) => el.before(c));
      remove(el);
    });
  });

  // Cookie-consent widget: body-level <section> holding the consent widget / text.
  safeQueryAll(body, ':scope > section').forEach((section) => {
    if (section.querySelector('.ensConsentWidget, [class*="ensConsent"], [id^="ens"]')
      || CONSENT_TEXT.test((section.textContent || '').slice(0, 2000))) {
      remove(section);
    }
  });

  // Header banner (logo strip). Keep anything that looks like an authored banner.
  safeQueryAll(body, 'div.banner.ng-star-inserted').forEach((el) => {
    if (el.matches('[role="banner"]') || !el.querySelector('.banner__content, h1, h2, h3')) remove(el);
  });

  // "Skip to Content" links.
  safeQueryAll(body, 'a').forEach((a) => {
    const text = (a.textContent || '').trim();
    if (/^skip to (main )?content$/i.test(text) || /skipnav/i.test(a.className || '')) remove(a);
  });
}

function removeNonContent(document) {
  safeQueryAll(document, 'script, style, noscript, link[rel="stylesheet"], link[rel="preload"]').forEach(remove);
  removeTrackingPixels(document);
  // Tracking pixels / hidden iframes; keep visible embeds (video, maps).
  safeQueryAll(document, 'iframe').forEach((iframe) => {
    const style = (iframe.getAttribute('style') || '').replace(/\s/g, '').toLowerCase();
    const src = iframe.getAttribute('src') || '';
    const hidden = style.includes('display:none')
      || style.includes('visibility:hidden')
      || iframe.getAttribute('aria-hidden') === 'true'
      || iframe.getAttribute('width') === '0'
      || iframe.getAttribute('height') === '0'
      || iframe.getAttribute('width') === '1'
      || iframe.getAttribute('height') === '1';
    if (hidden || !src || /rlcdn|doubleclick|demdex|facebook\.com\/tr|bat\.bing|launchpad/i.test(src)) remove(iframe);
  });
}

// The Angular page is built from custom elements (cbol-core, citi-parent-layout, tds-feature…).
// html2md treats unknown elements as inline, so block tables inside them run together with no
// blank line and the whole page becomes one unparseable grid table. After parsing, a custom element
// holding block content becomes a <div>; an inline one is unwrapped. Deepest first.
const BLOCK_CHILD = 'div, table, p, h1, h2, h3, h4, h5, h6, ul, ol, hr, section, picture, img';

function normalizeCustomElements(root) {
  if (!root || !root.querySelectorAll) return;
  const doc = root.ownerDocument || root;
  [...root.querySelectorAll('*')]
    .filter((el) => el.tagName.includes('-'))
    .reverse()
    .forEach((el) => {
      if (!el.parentNode) return;
      if (el.querySelector(BLOCK_CHILD)) {
        const div = doc.createElement('div');
        while (el.firstChild) div.append(el.firstChild);
        el.replaceWith(div);
      } else {
        el.replaceWith(...el.childNodes);
      }
    });
}

// Loose inline content (text not wrapped in a <p>/heading/list) inside a block container. html2md
// (hast-util-to-mdast "wrap") mishandles a run that holds a link combined with <sup>/<sub>
// (e.g. the sticky CTA "...BONUS MILES<sup><a>2</a></sup>" directly in a <div>): the whole parent
// is then serialized as phrasing, block tables lose the blank line between them ("+---++---+"),
// and md2da cannot parse any grid table on the page. Wrapping each loose run in a <p> is what the
// author would have written and converts cleanly. Table cells are only touched when they mix
// inline and block content (otherwise the cell itself is the paragraph).
const FLOW_TAGS = new Set([
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'CAPTION', 'DD', 'DETAILS', 'DIALOG', 'DIV', 'DL',
  'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'HEADER', 'HGROUP', 'HR', 'LI', 'MAIN', 'MENU', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'SUMMARY',
  'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL',
  // embeds: keep them out of paragraphs
  'IFRAME', 'VIDEO', 'AUDIO', 'OBJECT', 'EMBED', 'CANVAS',
]);
const LOOSE_CONTAINERS = 'div, section, article, aside, main, header, footer, form, figure, td, th';

function isFlow(node) {
  return node.nodeType === 1 && FLOW_TAGS.has(node.tagName);
}

function isNeutral(node) {
  return node.nodeType === 8 || (node.nodeType === 3 && !node.textContent.trim());
}

function wrapLooseInline(root) {
  if (!root || !root.querySelectorAll) return;
  const doc = root.ownerDocument || root;
  const containers = [root, ...root.querySelectorAll(LOOSE_CONTAINERS)];
  containers.forEach((el) => {
    const kids = [...el.childNodes];
    if (/^T[DH]$/.test(el.tagName) && !kids.some(isFlow)) return;
    const runs = [];
    let run = [];
    kids.forEach((n) => {
      if (isFlow(n)) {
        runs.push(run);
        run = [];
      } else {
        run.push(n);
      }
    });
    runs.push(run);
    runs.forEach((nodes) => {
      let start = 0;
      let end = nodes.length;
      while (start < end && isNeutral(nodes[start])) start += 1;
      while (end > start && isNeutral(nodes[end - 1])) end -= 1;
      const content = nodes.slice(start, end);
      if (!content.some((n) => (n.textContent || '').trim())) return;
      const p = doc.createElement('p');
      content[0].before(p);
      p.append(...content);
    });
  });
}

// Headings holding block children (citi.com table header: <h2><b>A Work Perk: </b><p><b>Get a
// rate…</b></p></h2>). A <p> inside a heading is invalid; html2md then writes the heading as raw
// phrasing and the bold markers survive as literal "**A Work Perk:**" text. Unwrap the block
// children in place (space-separated) so the heading stays one line of inline content.
const HEADING_BLOCK_CHILD = 'p, div, section, span.d-block';

function flattenHeadings(root) {
  const doc = root.ownerDocument || root;
  safeQueryAll(root, 'h1, h2, h3, h4, h5, h6').forEach((h) => {
    const inner = [...h.querySelectorAll(HEADING_BLOCK_CHILD)];
    if (!inner.length) return;
    inner.reverse().forEach((el) => {
      if (!el.parentNode) return;
      const prev = el.previousSibling;
      if (prev && (prev.textContent || '').trim() && !/\s$/.test(prev.textContent)) el.before(doc.createTextNode(' '));
      el.replaceWith(...el.childNodes);
    });
  });
}

export default function transform(hookName, element, payload) {
  const document = (element && element.ownerDocument) || (payload && payload.document);
  if (!document) return;

  if (hookName === 'beforeTransform') {
    const template = payload && payload.template;
    const url = pageUrl(payload);
    const selectors = findPageCleanup(template, url);
    if (selectors) {
      replayPageCleanup(document, selectors);
    } else {
      applyCatalogRules(document);
    }
    removeChrome(document, claimedElements(document, template, url));
    resolveLazyImages(document);
    removeNonContent(document);
    flattenHeadings(document);
  }

  if (hookName === 'afterTransform') {
    removeNonContent(document);
    normalizeCustomElements(element || document.body);
    wrapLooseInline(element || document.body);
  }
}
