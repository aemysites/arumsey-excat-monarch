/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import softwareDownloadParser from './parsers/software-download.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import accordionMediaParser from './parsers/accordion-media.js';
import heroBannerParser from './parsers/hero-banner.js';
import lottieAnimationParser from './parsers/lottie-animation.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import heroSplitParser from './parsers/hero-split.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import promoStripParser from './parsers/promo-strip.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "campaign-full-bleed-hero",
  "urls": [
    "https://www.hrblock.com/outlook-on-american-life/",
    "https://www.hrblock.com/responsibilityisland/"
  ],
  "description": "Campaign/report page opening with text over a full-bleed photo, followed by statistic and media sections",
  "blocks": [
    {
      "name": "hero-video",
      "instances": [
        "main div.cmp-container > section.column-control:has(figure.hero-wrapper div.full-width-dynamicmedia)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/responsibilityisland/": [
          "#container-4655d53960 > section:nth-child(3)"
        ]
      }
    },
    {
      "name": "software-download",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .video-container):not(:has(> div.container > ul > li.col-2 + li.col-2 .video-container))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/responsibilityisland/": [
          "#container-4655d53960 > section:nth-child(10)"
        ]
      }
    },
    {
      "name": "cards-product",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .video-container):has(> div.container > ul > li.col-2 + li.col-2 .video-container)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/responsibilityisland/": [
          "#container-4655d53960 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control",
          "#container-4655d53960 > section:nth-child(12)"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introDefaultvariant):has(> div.container > ul > li.col-2 .image-container img):not(:has(.iconlist))",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introImageVariant):not(:has(.introDefaultvariant))",
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-3 .introImageVariant):not(:has(> div.container > ul > li.col-3.hide-medium))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/outlook-on-american-life/": [
          "#container-b62d85ed52 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-60.two-column-control",
          "#container-b62d85ed52 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/responsibilityisland/": [
          "#container-4655d53960 > section:nth-child(16)",
          "#container-4655d53960 > section:nth-child(17)",
          "#container-4655d53960 > section:nth-child(18)"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.cmp-container > section.column-control:has(.card-secondary.featurecard)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/responsibilityisland/": [
          "#container-4655d53960 > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-20"
        ]
      }
    },
    {
      "name": "cards-pricing",
      "instances": [
        "main div.cmp-container > section.column-control:has(ul.category-card_container-v2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/responsibilityisland/": [
          "#container-4655d53960 > section.column-control.green-dark-theme.padding-top-20"
        ]
      }
    },
    {
      "name": "accordion-media",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(.iconlist):has(.image-container img)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/outlook-on-american-life/": [
          "#container-b62d85ed52 > section.column-control.spruce-forest-theme.padding-top-80.padding-bottom-80.two-column-control"
        ]
      }
    },
    {
      "name": "hero-banner",
      "instances": [
        "main div.cmp-container > section.column-control:has(> div.container > ul > li.col-1 figure.hero-wrapper.spruce-eggshell-theme)",
        "main div.cmp-container > figure.hero-wrapper:not(li figure)",
        "main div.cmp-container > section.column-control:has(> div.container > ul > li.col-1 figure.hero-wrapper.white-theme)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/outlook-on-american-life/": [
          "#container-b62d85ed52 > section:nth-child(14)",
          "#container-b62d85ed52 > figure",
          "#container-b62d85ed52 > section:nth-child(22)"
        ]
      }
    },
    {
      "name": "lottie-animation",
      "instances": [
        "main div.cmp-container > section.column-control:has(> div.container > ul > li:not(.hide-large) lottie-player)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/outlook-on-american-life/": [
          "#container-b62d85ed52 > section:nth-child(16)"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-3 article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/outlook-on-american-life/": [
          "#container-b62d85ed52 > section.column-control.green-dark-theme.padding-bottom-120"
        ]
      }
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
      "id": "video-hero",
      "name": "Full-bleed video hero with title lockup and CTAs, wave transition",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*=\"-theme\"])"
      ],
      "style": null,
      "blocks": [
        "hero-video"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*=\"-theme\"]):not(:has(figure.hero-wrapper))"
      ]
    },
    {
      "id": "report-hero-white",
      "name": "Report hero, Gen Z banners and methodology (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme"
      ],
      "style": null,
      "blocks": [
        "hero-banner",
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:has(figure.hero-wrapper)):not(:has(li.col-3 .introImageVariant))",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:has(> div.container > ul > li.col-3.hide-medium)"
      ]
    },
    {
      "id": "eggshell-band",
      "name": "Eggshell bands (good news, side hustles, resource center card, wave images)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme"
      ],
      "style": "eggshell",
      "blocks": [
        "columns-banner",
        "lottie-animation",
        "cards-icon"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control):not(:has(lottie-player)):not(:has(.featurecard))"
      ]
    },
    {
      "id": "forest-band",
      "name": "Forest bands (episodes, debt checklist, generations stats and charts, Gen Z quote)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme",
        "main > div.root > div.cmp-container > div.cmp-container > figure.hero-wrapper.spruce-forest-theme"
      ],
      "style": "forest",
      "blocks": [
        "software-download",
        "cards-product",
        "accordion-media",
        "hero-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control)"
      ]
    },
    {
      "id": "green-band",
      "name": "Green bands (DIY filing options, plan cards, comparison table, free online qualifications; Gen Z goals stats)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.green-dark-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showcontents",
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height"
      ],
      "style": "green",
      "blocks": [
        "cards-pricing",
        "cards-feature"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(:has(ul.category-card_container-v2)):not(:has(article.card-stacked))",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.green-dark-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showcontents",
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height"
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
    "https://www.hrblock.com/outlook-on-american-life/": [
      "#truste_0\\.009325936306580296",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1851014104",
      "#container-bd983033fc > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1808082124",
      "h1.modal-headline.text-center",
      "#container-607078c165 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_674624452",
      "#container-c9fcac21d7 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_401707010",
      "#container-4e1908bacb > div:nth-child(2) > h3:nth-child(2)",
      "div.modal-body.body_max_width_mid_785098232",
      "div.modal-body.body_max_width_mid_2146481836",
      "#container-542226a3a3 > figure:nth-child(1) > figcaption:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_792077400",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1755329252",
      "#container-843f427919 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)",
      "p.modal-headline.text-medium",
      "#container-97d0b04ffe > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2099743819",
      "h2.modal-headline.text-large",
      "h3.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_406359418",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/responsibilityisland/": [
      "#truste_0\\.592363488065139",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-ai",
      "#modal-free",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-46d57f25db > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_606650417",
      "#container-3bc6eea095 > div:nth-child(2) > h3:nth-child(2)",
      "div.modal-body.body_max_width_mid_1464621619",
      "#container-d44781894f > div:nth-child(3) > h3:nth-child(2)",
      "div.modal-body.body_max_width_mid_1680751058",
      "#container-7d5a1f2d38 > div:nth-child(3) > h3:nth-child(2)",
      "div.modal-body.body_max_width_mid_1680394177",
      "#container-6d25d185f6 > div:nth-child(3) > h3:nth-child(2)",
      "div.modal-body.body_max_width_mid_1102537566",
      "h3.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_534386543",
      "#container-9d536fd7d6 > div:nth-child(2) > h2:nth-child(1)",
      "#container-a8d63ff428 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-a8d63ff428 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-896a60ce4f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-896a60ce4f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-fdfd40f4d1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-fdfd40f4d1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-4d94a0b287 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-4d94a0b287 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-7e2e7b0fba > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-7e2e7b0fba > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-17c9c2f655 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-17c9c2f655 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-edbce49f0f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-edbce49f0f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "p.modal-headline.color-dark-green",
      "#container-48e53ca751 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-be87c0a3d9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1970488358",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "#dynamicmedia_128035666_emailShare_dialog > div:nth-child(2)",
      "#dynamicmedia_128035666_embedShare_dialog > div:nth-child(2)",
      "div.s7dialog"
    ]
  }
};

const parsers = {
  'hero-video': heroVideoParser,
  'software-download': softwareDownloadParser,
  'cards-product': cardsProductParser,
  'columns-banner': columnsBannerParser,
  'cards-icon': cardsIconParser,
  'cards-pricing': cardsPricingParser,
  'accordion-media': accordionMediaParser,
  'hero-banner': heroBannerParser,
  'lottie-animation': lottieAnimationParser,
  'cards-feature': cardsFeatureParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'hero-video': heroVideoParser,
  'software-download': softwareDownloadParser,
  'cards-product': cardsProductParser,
  'columns-banner': columnsBannerParser,
  'cards-icon': cardsIconParser,
  'cards-pricing': cardsPricingParser,
  'accordion-media': accordionMediaParser,
  'hero-banner': heroBannerParser,
  'lottie-animation': lottieAnimationParser,
  'cards-feature': cardsFeatureParser,
  'hero-split': heroSplitParser,
  'carousel-testimonial': carouselTestimonialParser,
  'promo-strip': promoStripParser,
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
