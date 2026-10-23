/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import columnsBannerParser from './parsers/columns-banner.js';
import heroSplitParser from './parsers/hero-split.js';
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
  "name": "story-heading-page",
  "urls": [
    "https://www.hrblock.com/corporate/founders/"
  ],
  "description": "Long-form story page opening with a heading, alternating text and image sections",
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "main div.cmp-container > figure.hero-wrapper"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/founders/": [
          "#container-b4ad87ec33 > figure"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/founders/": [
          "#container-b4ad87ec33 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-b4ad87ec33 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control",
          "#container-b4ad87ec33 > section:nth-child(9)",
          "#container-b4ad87ec33 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-40.two-column-control",
          "#container-b4ad87ec33 > section.column-control.white-theme.padding-top-20.padding-bottom-60.two-column-control",
          "#container-b4ad87ec33 > section.column-control.spruce-forest-theme.padding-top-80.padding-bottom-60.two-column-control"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "story-intro",
      "name": "Story heading (eggshell)",
      "selector": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control)"
      ],
      "style": "eggshell",
      "blocks": [],
      "defaultContent": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control)"
      ]
    },
    {
      "id": "hero-image",
      "name": "Full-width story photo (eggshell)",
      "selector": [
        "main div.cmp-container > figure.hero-wrapper"
      ],
      "style": "eggshell",
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "story-eggshell",
      "name": "Founder bios and story columns (eggshell)",
      "selector": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control"
      ],
      "style": "eggshell",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "story-green",
      "name": "Story columns (green)",
      "selector": [
        "main div.cmp-container > section.column-control.green-dark-theme.two-column-control"
      ],
      "style": "green",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "did-you-know",
      "name": "Did you know callout",
      "selector": [
        "main div.cmp-container > section.column-control.white-theme:not(.two-column-control)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main div.cmp-container > section.column-control.white-theme:not(.two-column-control)"
      ]
    },
    {
      "id": "story-white",
      "name": "Story photo columns",
      "selector": [
        "main div.cmp-container > section.column-control.white-theme.two-column-control"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "leadership-links",
      "name": "Directors and executives links (forest)",
      "selector": [
        "main div.cmp-container > section.column-control.spruce-forest-theme.two-column-control"
      ],
      "style": "forest",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/corporate/founders/": [
      "#truste_0\\.08049347635822357",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-01cbd766e3 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1567708818",
      "p.modal-headline.heading_max_width_mid_1869069893",
      "#container-840c1a074b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-840c1a074b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-3991c4ecc3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d71b8c3170 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1314021005",
      "#container-e852be14de > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2144992496",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_2065359015",
      "h3.modal-headline.text-jumbo",
      "h3.modal-headline.color-dark-green",
      "#container-a1f1dc39f8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-a1f1dc39f8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
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
  'hero-banner': heroBannerParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'hero-banner': heroBannerParser,
  'columns-banner': columnsBannerParser,
  'hero-split': heroSplitParser,
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
