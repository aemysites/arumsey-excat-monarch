/* eslint-disable */
/* global WebImporter */

import MIGRATED_PATHS from '../suncorp-migrated-paths.js';

/**
 * Suncorp cleanup transformer (shared by all templates).
 *
 * beforeTransform:
 *  1. Replays payload.template.pageCleanup[<current page>] (selector by selector,
 *     removing only selectors that match exactly one element).
 *  2. On pages NOT listed in pageCleanup, applies the site-wide popup rules
 *     from catalog-template.json cleanup.rules[] (outside <main> only).
 *  3. Removes non-authorable chrome: header, footer, chatbot, survey,
 *     hidden forms, error messages, inherited paragraph systems, scripts.
 *  4. Removes elements hidden on the source (.sg-u-hidden, [hidden], inline display:none)
 *     inside <main>, except images and the image-data containers parsers read, and hidden
 *     tracking iframes anywhere (e.g. the activate.suncorp.com.au "No Content" frame).
 *  5. Default content only (outside the template's block elements): a <p> whose whole text
 *     is heading-styled (sg-Type--heading1..6) becomes the matching <hN> (heading1 -> h2, the
 *     page keeps one h1); bold type spans (sg-Type--bold / --prominent / --title) become
 *     <strong>, unless the span is just a link (that would turn it into a button).
 * afterTransform:
 *  - Rewrites links to migrated pages on www.suncorp.com.au to site-relative paths without .html.
 *  - Removes empty <a href="#"> anchors (no text, no image).
 *  - Splits a paragraph (or block cell) holding only several strong/em-wrapped links into one
 *    paragraph per link, so scripts.js decorateButtons turns each into a button.
 *  - Removes remaining style/script/noscript/link/iframe chrome and stray
 *    ".lt-ie10" CSS text. HTML comments are never touched.
 *
 * Elements that are (or contain, or sit inside) a template section living
 * outside <main> (e.g. the disclaimer) are protected from removal.
 */

// catalog-template.json -> cleanup.rules[]
const CATALOG_CLEANUP_RULES = [
  'body [class*="overlay"]:not(nav *)',
  '[role="dialog"]',
  'body [class*="modal"]:not(nav *)',
];

const CHROME_SELECTORS = [
  'header.Header',
  'div.qualtrics-survey',
  '#secureapp',
  'body > div.error-msg',
  '#suncorp-chatbot',
  '#suncorp-chatbot-icon-container',
  'div.Page > article',
  'div.Page > div.section',
  'div.Page > div.iparys_inherited',
  // Adobe Audience Manager sync frame (imports as an "Adobe ID Syncing iFrame" link)
  'iframe[title*="Adobe ID Syncing"]',
  'iframe[src*="demdex.net"]',
  // Hidden activation/tracking frame (imports as a "No Content" link)
  'iframe[src*="activate.suncorp.com.au"]',
  'iframe[style*="display: none"]',
  'iframe[style*="display:none"]',
];

const HIDDEN_SELECTORS = '.sg-u-hidden, [hidden], [style*="display: none"], [style*="display:none"]';
// Hidden on the source but read (or deliberately dropped) by parsers.
const HIDDEN_KEEP = 'img, picture, .image-data-container, .image-lazyload';
const MEDIA = 'img, picture, video, iframe, svg';
const INLINE_TAGS = /^(A|STRONG|EM|B|I|U|S|SPAN|BR|SUP|SUB|SMALL|CODE|ABBR|MARK)$/;

const FOOTER_MARKERS = 'div.Footer, div.Footer-content, div.Footer-bottom, div.Footer-onCall, div.footer-mobileapps';

function normalizeUrl(raw) {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname}`.replace(/\/+$/, '');
  } catch (e) {
    return null;
  }
}

function getPageUrl(document, payload) {
  const candidates = [
    payload && payload.url,
    payload && payload.params && payload.params.originalURL,
    payload && payload.originalURL,
  ];
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) candidates.push(canonical.getAttribute('href'));
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) candidates.push(ogUrl.getAttribute('content'));
  try {
    if (document.location && /^https?:/.test(document.location.href)) {
      candidates.push(document.location.href);
    }
  } catch (e) { /* ignore */ }
  for (const c of candidates) {
    const n = normalizeUrl(c);
    if (n) return n;
  }
  return null;
}

function findPageCleanup(pageCleanup, pageUrl) {
  if (!pageCleanup || typeof pageCleanup !== 'object' || !pageUrl) return null;
  if (Array.isArray(pageCleanup[pageUrl])) return pageCleanup[pageUrl];
  const key = Object.keys(pageCleanup).find((k) => normalizeUrl(k) === pageUrl);
  return key ? pageCleanup[key] : null;
}

function safeQueryAll(root, selector) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    return [];
  }
}

function firstMatch(root, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) { /* invalid selector, try next */ }
  }
  return null;
}

/** Section elements that live outside <main> (e.g. disclaimer) must survive cleanup. */
function getProtected(document, payload) {
  const main = document.querySelector('main');
  const sections = (payload && payload.template && payload.template.sections) || [];
  const out = [];
  sections.forEach((s) => {
    const el = firstMatch(document, s.selector);
    if (el && (!main || !main.contains(el))) out.push(el);
  });
  return out;
}

function makeRemover(protectedEls) {
  return (el) => {
    if (!el || !el.parentNode) return false;
    if (protectedEls.some((p) => p === el || el.contains(p) || p.contains(el))) return false;
    el.remove();
    return true;
  };
}

/** A strong/em wrapper (possibly strong > em) around exactly one link and nothing else. */
function isWrappedLink(node) {
  if (!node || node.nodeType !== 1 || !/^(STRONG|EM|B|I)$/.test(node.tagName)) return false;
  const kids = [...node.childNodes].filter((c) => c.nodeType !== 3 || c.nodeValue.trim());
  if (kids.length !== 1 || kids[0].nodeType !== 1) return false;
  if (kids[0].tagName === 'A') return true;
  return isWrappedLink(kids[0]);
}

/** The wrapped links of a run of inline nodes, or null if the run holds anything else. */
function wrappedLinksOnly(nodes) {
  const links = [];
  for (const n of nodes) {
    if (n.nodeType === 3) {
      if (n.nodeValue.trim()) return null;
    } else if (n.nodeType === 1) {
      if (n.tagName === 'BR') continue;
      // whitespace-only spans the importer leaves between source buttons
      if (n.tagName === 'SPAN' && !n.textContent.trim() && !n.querySelector(MEDIA)) continue;
      if (!isWrappedLink(n)) return null;
      links.push(n);
    } else if (n.nodeType !== 8) {
      return null;
    }
  }
  return links;
}

/**
 * Splits a run of 2+ wrapped links (plus whitespace / <br>) into one paragraph per link: the
 * whole <p>, or, in a cell / wrapper div, each inline run between block children (the
 * converter would otherwise join the run into one paragraph).
 */
function splitButtonGroup(document, container) {
  const toParagraphs = (links) => links.map((l) => {
    const p = document.createElement('p');
    p.append(l);
    return p;
  });
  if (container.tagName === 'P') {
    const links = wrappedLinksOnly([...container.childNodes]);
    if (links && links.length > 1) container.replaceWith(...toParagraphs(links));
    return;
  }
  const runs = [[]];
  [...container.childNodes].forEach((n) => {
    if (n.nodeType === 1 && !INLINE_TAGS.test(n.tagName)) runs.push([]);
    else runs[runs.length - 1].push(n);
  });
  runs.forEach((run) => {
    const links = wrappedLinksOnly(run);
    if (!links || links.length < 2) return;
    const anchor = document.createTextNode('');
    run[0].before(anchor);
    anchor.replaceWith(...toParagraphs(links));
    run.forEach((n) => { if (n.parentNode === container) n.remove(); });
  });
}

// Source type classes -> heading level.
const HEADING_TYPES = [
  ['sg-Type--heading1', 2], ['sg-Type--heading2', 2], ['sg-Type--heading3', 3],
  ['sg-Type--heading4', 4], ['sg-Type--heading5', 5], ['sg-Type--heading6', 6],
];
const HEADING_SELECTOR = HEADING_TYPES.map(([c]) => `.${c}`).join(', ');
const BOLD_TYPES = 'span.sg-Type--bold, span.sg-Type--prominent, span.sg-Type--title';

/** Elements the import script will hand to block parsers (template instances + this page's). */
function getBlockElements(document, template, pageUrl) {
  const out = [];
  (template.blocks || []).forEach((blockDef) => {
    const selectors = [...(blockDef.instances || [])];
    const pageKey = Object.keys(blockDef.pageInstances || {}).find((k) => normalizeUrl(k) === pageUrl);
    if (pageKey) selectors.push(...(blockDef.pageInstances[pageKey] || []));
    selectors.forEach((sel) => out.push(...safeQueryAll(document, sel)));
  });
  return out;
}

function headingLevel(el) {
  const hit = HEADING_TYPES.find(([c]) => el.classList.contains(c));
  return hit ? hit[1] : 0;
}

/** <p> whose entire text sits in heading-type element(s) of one level -> <hN>. */
function paragraphToHeading(document, p) {
  let level = headingLevel(p);
  let spans = [];
  if (!level) {
    spans = [...p.querySelectorAll(HEADING_SELECTOR)].filter((s) => !s.parentElement.closest(HEADING_SELECTOR));
    if (!spans.length) return;
    const levels = new Set(spans.map(headingLevel));
    if (levels.size !== 1) return;
    [level] = [...levels];
    const inSpans = spans.map((s) => s.textContent).join('').replace(/\s+/g, '');
    if (!inSpans || inSpans !== p.textContent.replace(/\s+/g, '')) return;
  }
  if (p.querySelector('img, picture, table, ul, ol')) return;
  const h = document.createElement(`h${level}`);
  spans.forEach((s) => s.replaceWith(...s.childNodes));
  h.append(...p.childNodes);
  p.replaceWith(h);
}

function isOutsideMain(document, el) {
  const main = document.querySelector('main');
  if (!main) return true;
  return !main.contains(el) && !el.contains(main);
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument;
  const root = element || document.body;

  if (hookName === 'beforeTransform') {
    // 0. Tick/cross icon fonts are empty <i> elements, which the importer drops: give the ones in
    // main content text, so comparison tables keep their covered / not-covered marks.
    const content = document.querySelector('main') || root;
    safeQueryAll(content, 'i[class*="Icon-tick--"]').forEach((el) => { el.textContent = '✓'; });
    safeQueryAll(content, 'i[class*="Icon-cross--error"], .sg-Flextable i[class*="Icon-cross--"]')
      .forEach((el) => { el.textContent = '✗'; });

    // 0b. Source buttons become EDS button markup (scripts.js decorateButtons): yellow primary in
    // <strong>, outlined secondary in <em>, the filled teal sg-Btn in <strong><em> (accent), so
    // they don't import as plain text links.
    safeQueryAll(content, 'a.sg-Btn').forEach((a) => {
      if (a.closest('strong, em')) return;
      let kind = 'accent';
      if (a.classList.contains('sg-Btn--primary')) kind = 'primary';
      else if (a.classList.contains('sg-Btn--secondary')) kind = 'secondary';
      const outer = document.createElement(kind === 'secondary' ? 'em' : 'strong');
      a.replaceWith(outer);
      if (kind === 'accent') {
        const inner = document.createElement('em');
        outer.append(inner);
        inner.append(a);
      } else {
        outer.append(a);
      }
    });

    const protectedEls = getProtected(document, payload);
    const remove = makeRemover(protectedEls);
    const template = (payload && payload.template) || {};
    const pageUrl = getPageUrl(document, payload);
    const pageSelectors = findPageCleanup(template.pageCleanup, pageUrl);

    // 1. Per-page cleanup replay: one selector at a time, exactly-one-match only.
    if (pageSelectors) {
      pageSelectors.forEach((sel) => {
        const matches = safeQueryAll(document, sel);
        if (matches.length === 1) remove(matches[0]);
      });
    } else {
      // 2. Catalog-wide popup rules for pages not listed in cleanup.pages.
      CATALOG_CLEANUP_RULES.forEach((rule) => {
        safeQueryAll(document, rule)
          .filter((el) => isOutsideMain(document, el))
          .forEach((el) => remove(el));
      });
    }

    // 3. Site chrome.
    CHROME_SELECTORS.forEach((sel) => {
      safeQueryAll(document, sel).forEach((el) => remove(el));
    });

    // Site footer: the div.Page child that holds the footer parts (migrated separately).
    const main = document.querySelector('main');
    safeQueryAll(document, 'div.Page > *').forEach((child) => {
      if (child.matches('main') || (main && child.contains(main))) return;
      if (child.matches(FOOTER_MARKERS) || child.querySelector(FOOTER_MARKERS)) remove(child);
    });
    safeQueryAll(document, 'footer, div.Footer').forEach((el) => {
      if (!main || !main.contains(el)) remove(el);
    });

    // Hidden tooltip popups (definitions opened from dotted tip links) become one accordion-panel
    // of definitions (title | text) at the end of the page content; the tip links stay as text.
    const definitions = [];
    const seenTitles = new Set();
    safeQueryAll(document, '.sg-Tooltip.js-TooltipContent').forEach((tip) => {
      const titleEl = tip.querySelector('.sg-Tooltip-headerTitle');
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
      const body = tip.querySelector('.sg-Tooltip-body .rte') || tip.querySelector('.sg-Tooltip-body');
      if (title && body && body.textContent.trim() && !seenTitles.has(title.toLowerCase())) {
        seenTitles.add(title.toLowerCase());
        const answer = document.createElement('div');
        answer.append(...body.cloneNode(true).childNodes);
        definitions.push([title, answer]);
      }
      tip.remove();
    });
    safeQueryAll(document, 'a.js-Tooltip').forEach((a) => a.replaceWith(...a.childNodes));
    if (definitions.length && main) {
      const holder = main.querySelector('div.Main-content') || main;
      const heading = document.createElement('h2');
      heading.textContent = 'Definitions';
      holder.append(heading, WebImporter.Blocks.createBlock(document, { name: 'accordion-panel', cells: definitions }));
    }

    // Article carousels print a static "Showing X of Y articles" per breakpoint; the
    // carousel-article block renders its own live count.
    safeQueryAll(document, '.article-carousel-text span, .article-carousel-text p')
      .filter((el) => /^Showing \d+(\s*-\s*\d+)? of \d+/.test(el.textContent.trim()))
      .forEach((el) => remove(el));

    // 4. Elements hidden on the source inside main (tabs/accordion panels are not hidden this
    // way in the captured DOM; images and image-data containers are left for the parsers).
    if (main) {
      safeQueryAll(main, HIDDEN_SELECTORS).forEach((el) => {
        if (!el.isConnected || el.matches(HIDDEN_KEEP) || el.querySelector(MEDIA)) return;
        if (el.closest('.image-data-container')) return;
        remove(el);
      });
    }

    // 5. Source type styles in default content (block cells are left to their parsers).
    if (main) {
      const blockEls = getBlockElements(document, template, pageUrl);
      const inBlock = (el) => blockEls.some((b) => b === el || b.contains(el));
      safeQueryAll(main, 'p').forEach((p) => {
        if (p.isConnected && !inBlock(p)) paragraphToHeading(document, p);
      });
      safeQueryAll(main, BOLD_TYPES).forEach((span) => {
        if (!span.isConnected || inBlock(span) || span.closest('h1, h2, h3, h4, h5, h6, strong, b')) return;
        const text = span.textContent.trim();
        if (!text) return;
        const linkText = [...span.querySelectorAll('a')].map((a) => a.textContent).join('').trim();
        if (linkText && linkText.replace(/\s+/g, '') === text.replace(/\s+/g, '')) return;
        const strong = document.createElement('strong');
        strong.append(...span.childNodes);
        span.replaceWith(strong);
      });
    }

    // Scripts / noscript (style kept until afterTransform so parsers can read bg images).
    safeQueryAll(root, 'script, noscript').forEach((el) => el.remove());
  }

  if (hookName === 'afterTransform') {
    // Links to migrated pages become site-relative (no .html); everything else keeps its URL.
    const SITE = 'https://www.suncorp.com.au';
    const migrated = new Set(MIGRATED_PATHS);
    safeQueryAll(root, 'a[href]').forEach((a) => {
      const raw = a.getAttribute('href');
      if (!raw || /^(#|mailto:|tel:|javascript:)/i.test(raw)) return;
      let u;
      try { u = new URL(raw, SITE); } catch (e) { return; }
      if (!/^(www\.)?suncorp\.com\.au$/i.test(u.hostname)) return;
      // internal campaign tracking only; functional parameters (mcode, pageId...) are kept
      ['intCMP', '_ga'].forEach((p) => u.searchParams.delete(p));
      const path = u.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/';
      // migrated documents are saved under lowercase paths (as EDS serves them)
      if (migrated.has(path) && !u.search) a.setAttribute('href', `${path.toLowerCase()}${u.hash}`);
    });

    safeQueryAll(root, 'style, script, noscript, link, iframe[src*="mbox"], #c-target-global-mbox')
      .forEach((el) => el.remove());

    // An icon token alone in a default-content paragraph (e.g. the article date's clock) sits
    // inline before the text that follows it, as on the source.
    // The breadcrumb block draws its own home icon: drop the source's icon-font token there.
    safeQueryAll(root, 'table').forEach((table) => {
      const head = table.querySelector('th');
      if (!head || !/^\s*breadcrumb/i.test(head.textContent)) return;
      const tw = document.createTreeWalker(table, (document.defaultView && document.defaultView.NodeFilter
        ? document.defaultView.NodeFilter.SHOW_TEXT : 4));
      for (let t = tw.nextNode(); t; t = tw.nextNode()) {
        if (/:[a-z][a-z0-9-]*:/.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/:[a-z][a-z0-9-]*:/g, '');
      }
    });

    // Source "text-image textIcon" rows (icon wrapper + text wrapper) keep the icon inline at the
    // start of the text. Block tables are skipped: their cells keep the shape their parser chose.
    safeQueryAll(root, 'div.textIcon').forEach((row) => {
      if (row.closest('table')) return;
      const icon = row.querySelector(':scope > .image-wrapper');
      const token = icon && icon.textContent.trim();
      if (!token || !/^(:[a-z][a-z0-9-]*:\s*)+$/.test(token) || icon.querySelector('img')) return;
      const first = row.querySelector('.text-wrapper p, .text-wrapper h2, .text-wrapper h3, .text-wrapper h4');
      if (!first) return;
      first.prepend(document.createTextNode(`${token} `));
      icon.remove();
    });

    // Empty "#" anchors (icon-only links whose <i> the importer dropped), and the paragraph
    // they leave empty.
    safeQueryAll(root, 'a[href="#"]').forEach((a) => {
      if (a.textContent.trim() || a.querySelector(MEDIA)) return;
      const parent = a.parentElement;
      a.remove();
      if (!parent || parent === root || !/^(P|LI|STRONG|EM)$/.test(parent.tagName)) return;
      const target = (root.contains(parent.closest('p, li')) && parent.closest('p, li')) || parent;
      if (!target.textContent.trim() && !target.querySelector(`${MEDIA}, a, table, hr`)) target.remove();
    });

    // Button groups: one paragraph per strong/em-wrapped link.
    const groups = new Set();
    safeQueryAll(root, 'strong > a, em > a, b > a, i > a').forEach((a) => {
      let top = a.parentElement;
      while (top.parentElement && top.parentElement !== root && isWrappedLink(top.parentElement)) {
        top = top.parentElement;
      }
      const container = top.parentElement;
      if (container && isWrappedLink(top) && /^(P|DIV|TD|TH)$/.test(container.tagName)) groups.add(container);
    });
    groups.forEach((el) => { if (el.isConnected) splitButtonGroup(document, el); });

    // Stray ".lt-ie10" inline CSS text blocks.
    const NodeFilterRef = (document.defaultView && document.defaultView.NodeFilter) || { SHOW_TEXT: 4 };
    const walker = document.createTreeWalker(root, NodeFilterRef.SHOW_TEXT);
    const stray = [];
    let n = walker.nextNode();
    while (n) {
      if (n.nodeValue && n.nodeValue.indexOf('.lt-ie10') !== -1) stray.push(n);
      n = walker.nextNode();
    }
    stray.forEach((t) => {
      const parent = t.parentNode;
      t.remove();
      if (parent && parent !== root && parent.nodeType === 1 && !parent.textContent.trim()
        && !parent.querySelector('img, picture, video, iframe, table, a, hr')) {
        parent.remove();
      }
    });
  }
}
