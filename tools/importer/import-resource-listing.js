/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import cardsArticleParser from './parsers/cards-article.js';
import countrySelectorParser from './parsers/country-selector.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import brandBarParser from './parsers/brand-bar.js';
import columnsBannerParser from './parsers/columns-banner.js';
import heroSplitParser from './parsers/hero-split.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsStatsParser from './parsers/columns-stats.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "resource-listing",
  "urls": [
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/"
  ],
  "description": "Expat resource-center supported countries listing (paginated URLs page 1 to 4 carry identical content): breadcrumb, country guide grid, all-countries letter selector with the A list, deadline banner, latest articles, testimonials and tax help CTA, using the expat sub-site header",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "#site-content section.expat-hp-countries div.breadcrumbs-container"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.breadcrumbs-container"
        ]
      }
    },
    {
      "name": "cards-article",
      "instances": [
        "#site-content section.expat-hp-countries div.expat-hp-countries--grid"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.expat-hp-countries--grid"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.expat-hp-countries--grid"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.expat-hp-countries--grid"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div.expat-hp-countries--grid"
        ]
      }
    },
    {
      "name": "country-selector",
      "instances": [
        "#site-content > section.supported-countries-full-list div.all-countries-intro-row"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/": [
          "#site-content > section.supported-countries-full-list > div > div.all-countries-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
          "#site-content > section.supported-countries-full-list > div > div.all-countries-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/": [
          "#site-content > section.supported-countries-full-list > div > div.all-countries-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
          "#site-content > section.supported-countries-full-list > div > div.all-countries-intro-row"
        ]
      }
    },
    {
      "name": "carousel-testimonial",
      "instances": [
        "#site-content > section.full-width.gray-background"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
          "#site-content > section.full-width.gray-background"
        ]
      }
    },
    {
      "name": "brand-bar",
      "instances": [
        "main div.family-brands-nav:has(.family-brand)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
          "body > header > div.family-brands-nav.show-fbn"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "#site-content > section.green-due-date-section",
        "#site-content > section.ba-cta"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.ba-cta"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "expat-countries",
      "name": "Country guides",
      "selector": [
        "#site-content > section.expat-hp-countries"
      ],
      "style": "light-grey",
      "blocks": [
        "breadcrumb",
        "cards-article"
      ],
      "defaultContent": [
        "#site-content > section.expat-hp-countries > div > h1",
        "#site-content > section.expat-hp-countries > div > p"
      ]
    },
    {
      "id": "expat-all-countries",
      "name": "All supported countries",
      "selector": [
        "#site-content > section.supported-countries-full-list"
      ],
      "style": null,
      "blocks": [
        "country-selector"
      ],
      "defaultContent": [
        "#site-content > section.supported-countries-full-list div.ac-filtering-results"
      ]
    },
    {
      "id": "expat-deadline",
      "name": "Expat tax deadline",
      "selector": [
        "#site-content > section.green-due-date-section"
      ],
      "style": "bright-green",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "expat-articles",
      "name": "More about expat taxes",
      "selector": [
        "#site-content > section.ba--hp-allposts"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "#site-content > section.ba--hp-allposts > div > h2",
        "#site-content > section.ba--hp-allposts div.ba--hp-allposts--lineup > a.hp-all-posts--post",
        "#site-content > section.ba--hp-allposts div.ba--hp-allposts--view-all"
      ]
    },
    {
      "id": "expat-testimonials",
      "name": "Expat testimonials",
      "selector": [
        "#site-content > section.full-width.gray-background"
      ],
      "style": "light-grey",
      "blocks": [
        "carousel-testimonial"
      ],
      "defaultContent": []
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
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/": [
      "#universal-skip-to-content"
    ]
  }
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'cards-article': cardsArticleParser,
  'country-selector': countrySelectorParser,
  'carousel-testimonial': carouselTestimonialParser,
  'brand-bar': brandBarParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'breadcrumb': breadcrumbParser,
  'cards-article': cardsArticleParser,
  'country-selector': countrySelectorParser,
  'carousel-testimonial': carouselTestimonialParser,
  'brand-bar': brandBarParser,
  'columns-banner': columnsBannerParser,
  'hero-split': heroSplitParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'cards-icon': cardsIconParser,
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
