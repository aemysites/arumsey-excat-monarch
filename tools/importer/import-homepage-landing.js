/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import heroSplitParser from './parsers/hero-split.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsBannerParser from './parsers/columns-banner.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import columnsStatsParser from './parsers/columns-stats.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "homepage-landing",
  "urls": [
    "https://www.hrblock.com/",
    "https://www.hrblock.com/financial-services/spruce/",
    "https://www.hrblock.com/tax-calculator/",
    "https://www.hrblock.com/w-4-calculator/"
  ],
  "description": "Marketing landing page opening with a large heading hero, followed by stacked feature, card and promo sections",
  "blocks": [
    {
      "name": "hero-banner",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper:first-of-type"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/spruce/": [
          "#container-86f0dbc134 > div:nth-child(3)"
        ]
      }
    },
    {
      "name": "hero-split",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme.two-column-control:has(.emailsignupform)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/spruce/": [
          "#container-86f0dbc134 > section.column-control.green-dark-theme.padding-top-20.two-column-control"
        ]
      }
    },
    {
      "name": "cards-pricing",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height:has(.category-card_container-v2)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:has(.category-card_container-v2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/": [
          "#container-7e88131d2f > div:nth-child(6)"
        ],
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section:nth-child(16)"
        ],
        "https://www.hrblock.com/w-4-calculator/": [
          "#container-240d563da4 > div:nth-child(11)"
        ]
      }
    },
    {
      "name": "accordion-faq",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.faq"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/spruce/": [
          "#container-86f0dbc134 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section.faq.white-theme"
        ],
        "https://www.hrblock.com/w-4-calculator/": [
          "#container-240d563da4 > section.faq.white-theme"
        ]
      }
    },
    {
      "name": "cards-article",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:has(.imageOverflow .card-overflow)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section:nth-child(7)"
        ]
      }
    },
    {
      "name": "columns-feature",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme.two-column-control:has(.iconlist):has(.image-container)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/w-4-calculator/": [
          "#container-240d563da4 > section.column-control.white-theme.two-column-control"
        ]
      }
    },
    {
      "name": "promo-strip",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme:has(> div.alignBanner)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:has(.rounded-border .alignBanner)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/spruce/": [
          "#container-86f0dbc134 > section:nth-child(13)"
        ],
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section.column-control.white-theme.padding-top-60.padding-bottom-100"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:has(.snackBar)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:has(.card-secondary.featurecard)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control):has(.alignBanner)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/spruce/": [
          "#container-86f0dbc134 > section.column-control.spruce-forest-theme.padding-bottom-100",
          "#container-86f0dbc134 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section:nth-child(12)"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control:has(article.card-stacked)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control):has(article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/": [
          "#container-7e88131d2f > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control",
          "#container-7e88131d2f > section:nth-child(14)"
        ],
        "https://www.hrblock.com/financial-services/spruce/": [
          "#container-86f0dbc134 > section:nth-child(7)",
          "#container-86f0dbc134 > section:nth-child(8)"
        ],
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section.column-control.spruce-eggshell-theme.padding-top-40.two-column-control",
          "#container-22739de76f > section.column-control.spruce-eggshell-theme.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/w-4-calculator/": [
          "#container-240d563da4 > section:nth-child(7)",
          "#container-240d563da4 > section.column-control.spruce-eggshell-theme.padding-bottom-40.two-column-control"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-neon-theme:has(.alignBanner)",
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height:has(.fb-image-wrapper .alignBanner)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme.two-column-control:has(.introImageVariant)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme.two-column-control:has(.cq-dd-image)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme.two-column-control:has(article.card-stacked):not(:has(.imageOverflow))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/": [
          "#container-7e88131d2f > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control",
          "#container-7e88131d2f > section.spruce-neon-theme",
          "#container-7e88131d2f > section.column-control.spruce-forest-theme.padding-top-80.padding-bottom-20.two-column-control",
          "#container-7e88131d2f > div:nth-child(16)"
        ],
        "https://www.hrblock.com/tax-calculator/": [
          "#container-22739de76f > section.column-control.white-theme.padding-bottom-60.two-column-control"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero",
      "name": "Image hero",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper:first-of-type"
      ],
      "style": null,
      "blocks": [
        "hero-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "pricing-green",
      "name": "Filing options pricing (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height:has(section.green-dark-theme .category-card_container-v2)"
      ],
      "style": "green",
      "blocks": [
        "cards-pricing"
      ],
      "defaultContent": []
    },
    {
      "id": "signup-green",
      "name": "Sign-up band (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme.two-column-control"
      ],
      "style": "green",
      "blocks": [
        "hero-split"
      ],
      "defaultContent": []
    },
    {
      "id": "feature-band-white",
      "name": "Feature band (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme"
      ],
      "style": null,
      "blocks": [
        "columns-banner",
        "columns-feature",
        "cards-article",
        "promo-strip"
      ],
      "defaultContent": []
    },
    {
      "id": "feature-band-eggshell",
      "name": "Feature band (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme"
      ],
      "style": "eggshell",
      "blocks": [
        "cards-feature",
        "cards-icon",
        "cards-pricing"
      ],
      "defaultContent": []
    },
    {
      "id": "spruce-strip",
      "name": "Spruce promo strip (neon)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-neon-theme"
      ],
      "style": "neon",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "feature-band-forest",
      "name": "Feature band (forest)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme"
      ],
      "style": "forest",
      "blocks": [
        "columns-banner",
        "cards-feature",
        "cards-icon",
        "promo-strip"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control):not(:has(article.card-stacked, .snackBar, .alignBanner, .card))"
      ]
    },
    {
      "id": "image-banner",
      "name": "Find an office image banner",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height:has(.fb-image-wrapper)"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "photo-note",
      "name": "Illustrative photo band",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper:not(:first-of-type)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper:not(:first-of-type)"
      ]
    },
    {
      "id": "faq",
      "name": "FAQ",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.faq"
      ],
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "disclaimer",
      "name": "Page disclaimers",
      "selector": [
        "body > div.global-disclaimer-container"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "body > div.global-disclaimer-container"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/": [
      "#truste_0\\.7196006410760243",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-ai",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_970974824",
      "#container-18bb418849 > div:nth-child(2) > h2:nth-child(1)",
      "#container-e3440c607e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "h2.modal-headline.text-large",
      "#container-3c23d93d7e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)",
      "#container-3c23d93d7e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-50e2aea397 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)",
      "#container-50e2aea397 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "p.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "#container-6f1785b302 > article:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "#chatOverlay",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ],
    "https://www.hrblock.com/financial-services/spruce/": [
      "#truste_0\\.863390816857574",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_938354088",
      "div.modal-body.body_max_width_mid_1770845835",
      "#container-a464a6c661 > div:nth-child(2) > h2:nth-child(1)",
      "h3.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_503824740",
      "h2.modal-headline.text-jumbo-2",
      "div.modal-body.body_max_width_mid_1823566937",
      "div.modal-body.body_max_width_mid_605770462",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-calculator/": [
      "#truste_0\\.8487022291304859",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1137346903",
      "#container-2b50a8414b > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)",
      "#container-e2406d1f45 > div:nth-child(2) > h2:nth-child(1)",
      "section.green-dark-theme.rounded-border > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "#container-b584f78fb0 > div:nth-child(2) > h2:nth-child(1)",
      "#container-d338c2e517 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_864862330",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "#chatOverlay",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ],
    "https://www.hrblock.com/w-4-calculator/": [
      "#truste_0\\.5527400719660989",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_774802889",
      "#container-9253a26b25 > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "#container-33f989274d > div:nth-child(2) > h2:nth-child(1)",
      "#container-33f989274d > div:nth-child(7) > div:nth-child(2) > a:nth-child(1)",
      "#container-6564c997f9 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_115388080",
      "#container-874dad7e12 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1970488358",
      "a.btn.modal-tool-open",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ]
  }
};

const parsers = {
  'hero-banner': heroBannerParser,
  'hero-split': heroSplitParser,
  'cards-pricing': cardsPricingParser,
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'columns-feature': columnsFeatureParser,
  'promo-strip': promoStripParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'hero-banner': heroBannerParser,
  'hero-split': heroSplitParser,
  'cards-pricing': cardsPricingParser,
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'columns-feature': columnsFeatureParser,
  'promo-strip': promoStripParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'columns-banner': columnsBannerParser,
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
