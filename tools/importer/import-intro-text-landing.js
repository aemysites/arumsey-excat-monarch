/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import searchArticlesParser from './parsers/search-articles.js';
import resultsToolbarParser from './parsers/results-toolbar.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsBannerParser from './parsers/columns-banner.js';
import tableDataParser from './parsers/table-data.js';
import cardsArticleParser from './parsers/cards-article.js';
import heroSplitParser from './parsers/hero-split.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import columnsStatsParser from './parsers/columns-stats.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "intro-text-landing",
  "urls": [
    "https://www.hrblock.com/expat-tax-preparation/resource-center/search/",
    "https://www.hrblock.com/financial-services/",
    "https://www.hrblock.com/financial-services/emerald-savings/",
    "https://www.hrblock.com/financial-services/privacy-statement/"
  ],
  "description": "Landing page that opens with a short intro text line instead of a hero (financial services hub, AEM site) or with a breadcrumb and search box (expat resource-center search, WordPress expat theme), followed by card, banner and promo sections or search results; includes a text-only privacy statement page",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "#site-content > section.bc-search-container div.breadcrumbs-container"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/search/": [
          "#site-content > section.container.bc-search-container"
        ]
      }
    },
    {
      "name": "search-articles",
      "instances": [
        "#site-content > section.ba-search--page div.ba-search-box--controls"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/search/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls"
        ]
      }
    },
    {
      "name": "results-toolbar",
      "instances": [
        "#site-content > section.ba-search--page div.search-result-metrics.ba--allposts-box"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/search/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main div.cmp-container > section.column-control.green-dark-theme.two-column-control:has(> div.container > ul > li.col-2 article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/": [
          "#container-43d4aec8a4 > section:nth-child(2)",
          "#container-43d4aec8a4 > section.column-control.green-dark-theme.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-savings/": [
          "#container-43d4aec8a4 > section:nth-child(2)",
          "#container-43d4aec8a4 > section.column-control.green-dark-theme.padding-bottom-40.two-column-control"
        ]
      }
    },
    {
      "name": "promo-strip",
      "instances": [
        "main div.cmp-container > section.spruce-forest-theme:has(> div.alignBanner)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/": [
          "#container-43d4aec8a4 > section.spruce-forest-theme"
        ],
        "https://www.hrblock.com/financial-services/emerald-savings/": [
          "#container-43d4aec8a4 > section.spruce-forest-theme"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.column-control:not(.two-column-control) > div.container > ul > li.col-1 .card-secondary.featurecard)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/": [
          "#container-43d4aec8a4 > div:nth-child(11)"
        ],
        "https://www.hrblock.com/financial-services/emerald-savings/": [
          "#container-43d4aec8a4 > div:nth-child(11)"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "#site-content > section.ba-cta",
        "main div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control:has(> div.container > ul > li.col-2 .cq-dd-image)",
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.column-control.two-column-control > div.container > ul > li.col-2 .introImageVariant)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/search/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/financial-services/": [
          "#container-43d4aec8a4 > section.column-control.spruce-eggshell-theme.padding-top-100.two-column-control",
          "#container-43d4aec8a4 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-43d4aec8a4 > div:nth-child(12)"
        ],
        "https://www.hrblock.com/financial-services/emerald-savings/": [
          "#container-43d4aec8a4 > section.column-control.spruce-eggshell-theme.padding-top-100.two-column-control",
          "#container-43d4aec8a4 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-43d4aec8a4 > div:nth-child(12)"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "main div.cmp-container table.first-col-th:has(td[rowspan], th[rowspan], td[colspan], th[colspan])"
      ]
    },
    {
      "name": "cards-article",
      "instances": [
        "#site-content > section.ba-search--page div.search-results.ba-search--page--results"
      ]
    }
  ],
  "sections": [
    {
      "id": "expat-search-breadcrumb",
      "name": "Search breadcrumb",
      "selector": [
        "#site-content > section.bc-search-container"
      ],
      "style": null,
      "blocks": [
        "breadcrumb"
      ],
      "defaultContent": []
    },
    {
      "id": "expat-article-search",
      "name": "Article search",
      "selector": [
        "#site-content > section.ba-search--page"
      ],
      "style": null,
      "blocks": [
        "search-articles",
        "results-toolbar",
        "cards-article"
      ],
      "defaultContent": [
        "#site-content > section.ba-search--page div.ba-post--loadmore"
      ]
    },
    {
      "id": "expat-cta",
      "name": "Tax help CTA",
      "selector": [
        "#site-content > section.ba-cta"
      ],
      "style": "bright-green",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "fs-intro",
      "name": "Intro and product cards",
      "selector": [
        "main div.cmp-container > section.column-control.green-dark-theme"
      ],
      "style": "green",
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": [
        "main div.cmp-container > section.column-control.green-dark-theme:not(.two-column-control) .introDefaultvariant"
      ]
    },
    {
      "id": "fs-spruce",
      "name": "Spruce and Emerald Card banners",
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
      "id": "fs-refund-transfer",
      "name": "Refund Transfer promo",
      "selector": [
        "main div.cmp-container > section.spruce-forest-theme"
      ],
      "style": "forest",
      "blocks": [
        "promo-strip"
      ],
      "defaultContent": []
    },
    {
      "id": "fs-loans",
      "name": "Loans offer card",
      "selector": [
        "main div.cmp-container > div.xf-content-height:has(section.spruce-eggshell-theme .card-secondary)"
      ],
      "style": "eggshell",
      "blocks": [
        "cards-icon"
      ],
      "defaultContent": []
    },
    {
      "id": "fs-myblock",
      "name": "MyBlock banner",
      "selector": [
        "main div.cmp-container > div.xf-content-height:has(section.green-dark-theme .introImageVariant)"
      ],
      "style": "green",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "fs-disclaimers",
      "name": "Disclaimers",
      "selector": [
        "body > div.global-disclaimer-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "body > div.global-disclaimer-container"
      ]
    },
    {
      "id": "privacy-statement",
      "name": "Privacy statement text",
      "selector": [
        "body > main"
      ],
      "style": null,
      "blocks": [
        "table-data"
      ],
      "defaultContent": [
        "body > main"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/expat-tax-preparation/resource-center/search/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/financial-services/": [
      "#truste_0\\.2651358631777362",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_106214818",
      "div.modal-body.body_max_width_mid_1771216764",
      "div.modal-body.body_max_width_mid_2007133784",
      "p.modal-headline.text-left",
      "div.modal-body.body_max_width_mid_1777299335",
      "#container-6777525be9 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_966414292",
      "h2.modal-headline.text-large",
      "#container-71ee391c26 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1383939846",
      "div.modal-body.body_max_width_mid_1562387733",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/financial-services/emerald-savings/": [
      "#truste_0\\.7124389663350379",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_106214818",
      "div.modal-body.body_max_width_mid_1771216764",
      "div.modal-body.body_max_width_mid_2007133784",
      "p.modal-headline.text-left",
      "div.modal-body.body_max_width_mid_1777299335",
      "#container-6777525be9 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_966414292",
      "h2.modal-headline.text-large",
      "#container-71ee391c26 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1383939846",
      "div.modal-body.body_max_width_mid_1562387733",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/financial-services/privacy-statement/": [
      "#truste_0\\.1888721236678801",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
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
  'breadcrumb': breadcrumbParser,
  'search-articles': searchArticlesParser,
  'results-toolbar': resultsToolbarParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'cards-icon': cardsIconParser,
  'columns-banner': columnsBannerParser,
  'table-data': tableDataParser,
  'cards-article': cardsArticleParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'breadcrumb': breadcrumbParser,
  'search-articles': searchArticlesParser,
  'results-toolbar': resultsToolbarParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'cards-icon': cardsIconParser,
  'columns-banner': columnsBannerParser,
  'table-data': tableDataParser,
  'cards-article': cardsArticleParser,
  'hero-split': heroSplitParser,
  'carousel-testimonial': carouselTestimonialParser,
  'columns-stats': columnsStatsParser,
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
