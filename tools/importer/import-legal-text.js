/* eslint-disable */
/* global WebImporter */

import heroSplitParser from './parsers/hero-split.js';
import columnsBannerParser from './parsers/columns-banner.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "legal-text",
  "urls": [
    "https://www.hrblock.com/espanol/terms/",
    "https://www.hrblock.com/guarantees/no-surprise-guarantee/",
    "https://www.hrblock.com/online-tax-filing/guarantees/accuracy-of-calculations/"
  ],
  "description": "Text-only legal/terms page with long body copy and minimal decoration",
  "blocks": [],
  "sections": [
    {
      "id": "legal-intro-eggshell",
      "name": "Legal page title and intro (eggshell)",
      "selector": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type"
      ],
      "style": "eggshell",
      "blocks": [],
      "defaultContent": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type"
      ]
    },
    {
      "id": "legal-body",
      "name": "Legal body copy (headings, paragraphs, lists)",
      "selector": [
        "main div.cmp-container > section.column-control:not(.spruce-eggshell-theme)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main div.cmp-container > section.column-control:not(.spruce-eggshell-theme)"
      ]
    },
    {
      "id": "support-eggshell",
      "name": "Need live support line (eggshell)",
      "selector": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:not(:first-of-type)"
      ],
      "style": "eggshell",
      "blocks": [],
      "defaultContent": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:not(:first-of-type)"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/espanol/terms/": [
      "#truste_0\\.6474426707424129",
      "#ciam-login-app",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "#container-c71683a44e > div:nth-child(4) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1870345024",
      "#container-c71683a44e > div:nth-child(6) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2146120771",
      "#container-c71683a44e > div:nth-child(8) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1918997184",
      "#container-c71683a44e > div:nth-child(10) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_897193958",
      "#container-c71683a44e > div:nth-child(12) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1492953883",
      "#container-c71683a44e > div:nth-child(14) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1040129391",
      "#container-c71683a44e > div:nth-child(16) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1263698580",
      "#container-c71683a44e > div:nth-child(18) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_664375070",
      "#container-c71683a44e > div:nth-child(20) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1858022377",
      "#container-c71683a44e > div:nth-child(22) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1646053541",
      "#container-c71683a44e > div:nth-child(24) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_182437474",
      "#container-c71683a44e > div:nth-child(26) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2137859631",
      "#container-c71683a44e > div:nth-child(28) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_130715482",
      "#container-c71683a44e > div:nth-child(30) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_267793181",
      "#container-c71683a44e > div:nth-child(32) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1897964349",
      "#container-c71683a44e > div:nth-child(34) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_326872927",
      "#container-c71683a44e > div:nth-child(36) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1049255770",
      "h2.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_903175681",
      "#overlay-suggestions-list",
      "#overlay_search",
      "#site-search"
    ],
    "https://www.hrblock.com/guarantees/no-surprise-guarantee/": [
      "#truste_0\\.23309644058120638",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1884123636",
      "#container-2a07d671cd > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1722351454",
      "#container-1695c754b4 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_381092026",
      "#container-68fd4e5dd4 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_32677595",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1599867210",
      "div.modal-body.body_max_width_mid_1191573432",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/guarantees/accuracy-of-calculations/": [
      "#truste_0\\.20705898418094004",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1243078466",
      "div.modal-body.body_max_width_mid_1142684268",
      "div.modal-body.body_max_width_mid_1962700498",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ]
  }
};

const parsers = {

};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'hero-split': heroSplitParser,
  'columns-banner': columnsBannerParser,
  'carousel-testimonial': carouselTestimonialParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'cards-icon': cardsIconParser,
  'columns-stats': columnsStatsParser,
  'cards-article': cardsArticleParser,
};

// Section transformers insert <hr> markers, so their beforeTransform runs after block discovery.
const sectionTransformers = [hrblockSectionsTransformer];
const transformers = [hrblockCleanupTransformer, hrblockFragmentsTransformer, hrblockDmImagesTransformer, hrblockSectionsTransformer];

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE, fragmentParsers };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

// helix-importer's preProcess drops <script>, <hr>, empty <a>/<p>/inline
// elements before transform(), which shifts the catalog's nth-child selectors
// (recorded on the raw page) onto the wrong element. preprocess() therefore
// resolves every block selector on the untouched DOM and tags the matches;
// findBlocksOnPage() then claims tagged elements (raw selectors as fallback).
const MATCH_ATTR = 'data-excat-match';
const PREPROCESSED_ATTR = 'data-excat-preprocessed';

function pageKey(u) {
  try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
  catch { return u; }
}

function blockSelectors(template, url) {
  const key = pageKey(url);
  const list = [];
  template.blocks.forEach((blockDef, bi) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector, si) => list.push({ blockDef, selector, token: `p${bi}-${si}` }));
  });
  template.blocks.forEach((blockDef, bi) => (blockDef.instances || [])
    .forEach((selector, si) => list.push({ blockDef, selector, token: `g${bi}-${si}` })));
  return list;
}

function tagBlockSelectors(document, template, url) {
  blockSelectors(template, url).forEach(({ selector, token }) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((el) => {
      const tokens = (el.getAttribute(MATCH_ATTR) || '').split(/\s+/).filter(Boolean);
      tokens.push(token);
      el.setAttribute(MATCH_ATTR, tokens.join(' '));
    });
  });
  document.documentElement.setAttribute(PREPROCESSED_ATTR, 'true');
}

// Container blocks whose parser emits the blocks nested in them itself (article-body:
// breadcrumb before, article-feedback after, ways-to-file fragment link inside).
// They are claimed first, so a nested block's selector cannot pre-empt them.
const CONTAINER_BLOCKS = ['article-body'];

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const tagged = document.documentElement.hasAttribute(PREPROCESSED_ATTR);
  const list = blockSelectors(template, url);
  const isContainer = (s) => CONTAINER_BLOCKS.includes(s.blockDef.name);
  [...list.filter(isContainer), ...list.filter((s) => !isContainer(s))].forEach(({ blockDef, selector, token }) => {
    let matches = [];
    try { matches = document.querySelectorAll(tagged ? `[${MATCH_ATTR}~="${token}"]` : selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  });
  document.querySelectorAll(`[${MATCH_ATTR}]`).forEach((el) => el.removeAttribute(MATCH_ATTR));
  return pageBlocks;
}

export default {
  // Runs on the raw DOM, before helix-importer's own preProcess cleanup.
  preprocess: ({ document, url, params = {} }) => {
    const pageUrl = params.originalURL || url;
    tagBlockSelectors(document, PAGE_TEMPLATE, pageUrl);
    executeTransformers('preprocess', document.body, { document, url, params: { ...params, originalURL: pageUrl } });
  },

  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    executeTransformers('beforeTransform', main, payload, transformers.filter((fn) => !sectionTransformers.includes(fn)));
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL);
    // Section boundaries are lifted onto parsed block elements, so they get the discovery result.
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, sectionTransformers);

    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    // page metadata (title, description, image) + values set by transformers
    // (params.excatMetadata, e.g. Template from hrblock-cleanup)
    const metadata = { ...WebImporter.Blocks.getMetadata(document), ...(params.excatMetadata || {}) };
    if (Object.keys(metadata).length) main.append(WebImporter.Blocks.getMetadataBlock(document, metadata));
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // Fragment documents get the same image handling as the page (sections excluded).
    params.fragments.forEach((frag) => {
      executeTransformers('afterTransform', frag.element, payload, transformers.filter((fn) => !sectionTransformers.includes(fn)));
      WebImporter.rules.transformBackgroundImages(frag.element, document);
      WebImporter.rules.adjustImageUrls(frag.element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
