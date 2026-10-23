/* eslint-disable */
/* global WebImporter */

import tabsPillParser from './parsers/tabs-pill.js';
import lottieAnimationParser from './parsers/lottie-animation.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsBannerParser from './parsers/columns-banner.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import promoStripParser from './parsers/promo-strip.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import heroSplitParser from './parsers/hero-split.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "tool-guide-page",
  "urls": [
    "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/",
    "https://www.hrblock.com/tax-prep-checklist/",
    "https://www.hrblock.com/wheres-my-refund/"
  ],
  "description": "Tool or guide page opening with a heading, followed by interactive or checklist sections and FAQs",
  "blocks": [
    {
      "name": "tabs-pill",
      "instances": [
        "main div.cmp-container > div.reframe-tabs"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/": [
          "#container-25fd5a7355 > div.reframe-tabs"
        ]
      }
    },
    {
      "name": "lottie-animation",
      "instances": [
        "main div.cmp-container > section.column-control:has(> div.container > ul > li:not(.hide-large) .lottie-container)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/": [
          "#container-25fd5a7355 > section:nth-child(11)"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-3 article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/": [
          "#container-25fd5a7355 > section:nth-child(13)",
          "#container-25fd5a7355 > section:nth-child(24)"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control):has(> div.container > ul > li.col-3 .cq-dd-image)",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .cq-dd-image)",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introDefaultvariant):has(> div.container > ul > li.col-2 .image-container)",
        "main div.cmp-container > section.column-control:not(.two-column-control):not(li section):has(> div.container > ul > li.col-3 .introImageVariant)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/": [
          "#container-25fd5a7355 > section:nth-child(16)"
        ],
        "https://www.hrblock.com/tax-prep-checklist/": [
          "#container-6f325433cb > section.column-control.white-theme.two-column-control"
        ],
        "https://www.hrblock.com/wheres-my-refund/": [
          "#container-f70feb5715 > section:nth-child(3)",
          "#container-f70feb5715 > section.column-control.white-theme.two-column-control"
        ]
      }
    },
    {
      "name": "accordion-faq",
      "instances": [
        "main div.cmp-container > section.faq"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/": [
          "#container-25fd5a7355 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/wheres-my-refund/": [
          "#container-f70feb5715 > section.faq.white-theme"
        ]
      }
    },
    {
      "name": "promo-strip",
      "instances": [
        "main div.cmp-container > section:has(> div.alignBanner)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-prep-checklist/": [
          "#container-6f325433cb > section.spruce-forest-theme"
        ]
      }
    },
    {
      "name": "cards-pricing",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(ul.category-card_container-v2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-prep-checklist/": [
          "#container-6f325433cb > div:nth-child(9)"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.xf-content-height:has(.testimonial-card) div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-prep-checklist/": [
          "#container-d830a5e7a5 > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "columns-promo-card",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:has(.card-secondary.featurecard)",
        "main div.cmp-container > div.xf-content-height:has(.card-secondary.featurecard)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-prep-checklist/": [
          "#container-6f325433cb > section.column-control.white-theme.padding-top-120.padding-bottom-120"
        ],
        "https://www.hrblock.com/wheres-my-refund/": [
          "#container-f70feb5715 > div"
        ]
      }
    },
    {
      "name": "carousel-testimonial",
      "instances": [
        "main div.xf-content-height div.cmp-container > section.column-control:has(figure.testimonial-card)"
      ]
    }
  ],
  "sections": [
    {
      "id": "page-main",
      "name": "Page main (theme bands inside govern)",
      "selector": [
        "body > main"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": []
    },
    {
      "id": "hero",
      "name": "Page hero: business formation photo banner, checklist title, refund tracking title (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:first-child"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:first-child"
      ]
    },
    {
      "id": "content-white",
      "name": "White content bands (intros, tabs, FAQ, banners, disclaimers text)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.reframe-tabs",
        "main > div.root > div.cmp-container > div.cmp-container > section.faq"
      ],
      "style": null,
      "blocks": [
        "tabs-pill",
        "columns-banner",
        "accordion-faq",
        "columns-promo-card"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(.two-column-control):not(:has(.featurecard))"
      ]
    },
    {
      "id": "eggshell-band",
      "name": "Eggshell bands (structure guide, Block Advisors benefits, insights cards, refund steps, filing options)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme"
      ],
      "style": "eggshell",
      "blocks": [
        "lottie-animation",
        "cards-feature",
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(:has(article.card-stacked)):not(:has(.lottie-container)):not(:has(li.col-3 .introImageVariant))"
      ]
    },
    {
      "id": "forest-band",
      "name": "Forest bands (could pay to form, small business promo strip)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme",
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme:has(> div.alignBanner)"
      ],
      "style": "forest",
      "blocks": [
        "columns-banner",
        "promo-strip"
      ],
      "defaultContent": []
    },
    {
      "id": "experience-fragments",
      "name": "Experience fragments (filing plan cards, trust band with guarantees and testimonials, promo card, free online qualifications)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height"
      ],
      "style": null,
      "blocks": [
        "cards-pricing",
        "cards-icon",
        "columns-promo-card",
        "carousel-testimonial"
      ],
      "defaultContent": [
        "main div.xf-content-height:has(.testimonial-card) div.cmp-container > section.column-control.spruce-forest-theme:not(:has(li.col-3 .introImageVariant .icon-svg))"
      ]
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
    "https://www.hrblock.com/tax-offices/business-services/business-formation-incorporation-services/": [
      "#truste_0\\.3383759778879444",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_95963358",
      "#container-2315477b0c > div:nth-child(2) > h2:nth-child(1)",
      "#container-d37457b91b > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_672919875",
      "#container-19ccdb5c60 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1363004906",
      "#container-19ccdb5c60 > div:nth-child(4) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_2115377611",
      "#container-d0d1d1569d > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1976942251",
      "#container-eed505a7bb > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_915413963",
      "#container-eed505a7bb > div:nth-child(4) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_845805716",
      "#container-de35dce128 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_122259260",
      "#container-1946f5f108 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_97499118",
      "#container-1946f5f108 > div:nth-child(4) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1658260000",
      "#container-3cc05a3847 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1108571968",
      "#container-aa87431f93 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_221666666",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_1158265927",
      "a.btn.modal-tool-open",
      "#container-2cde216710 > div:nth-child(2) > h2:nth-child(1)",
      "p.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_737968837",
      "#container-0f51dbeff8 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_105356227",
      "h3.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_595708351",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1983643304",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-prep-checklist/": [
      "#truste_0\\.8607827899491647",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_853835056",
      "#container-6f0cf7390d > div:nth-child(2) > div:nth-child(3) > a:nth-child(2)",
      "#container-616118837f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-616118837f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_2129953046",
      "div.modal-body.body_max_width_mid_864862330",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-3acecbe018 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-3acecbe018 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d42692293c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d42692293c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382",
      "div.modal-body.body_max_width_mid_1383939846",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ],
    "https://www.hrblock.com/wheres-my-refund/": [
      "#truste_0\\.8968787922233598",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1790471040",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_684349456",
      "#container-2b334d4c22 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5bb81b4431 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_511218410",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1367125441",
      "div.modal-body.body_max_width_mid_1383939846",
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
  'tabs-pill': tabsPillParser,
  'lottie-animation': lottieAnimationParser,
  'cards-feature': cardsFeatureParser,
  'columns-banner': columnsBannerParser,
  'accordion-faq': accordionFaqParser,
  'promo-strip': promoStripParser,
  'cards-pricing': cardsPricingParser,
  'cards-icon': cardsIconParser,
  'columns-promo-card': columnsPromoCardParser,
  'carousel-testimonial': carouselTestimonialParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'tabs-pill': tabsPillParser,
  'lottie-animation': lottieAnimationParser,
  'cards-feature': cardsFeatureParser,
  'columns-banner': columnsBannerParser,
  'accordion-faq': accordionFaqParser,
  'promo-strip': promoStripParser,
  'cards-pricing': cardsPricingParser,
  'cards-icon': cardsIconParser,
  'columns-promo-card': columnsPromoCardParser,
  'carousel-testimonial': carouselTestimonialParser,
  'hero-split': heroSplitParser,
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
