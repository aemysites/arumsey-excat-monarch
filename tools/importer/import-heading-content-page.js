/* eslint-disable */
/* global WebImporter */

import accordionFaqParser from './parsers/accordion-faq.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsIconParser from './parsers/cards-icon.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import heroSplitParser from './parsers/hero-split.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "heading-content-page",
  "urls": [
    "https://www.hrblock.com/online-tax-filing/guarantees/free-in-person-audit-support-terms/",
    "https://www.hrblock.com/online-tax-filing/guarantees/worry-free-audit-support/",
    "https://www.hrblock.com/tax-offices/peace-of-mind-claims/"
  ],
  "description": "Content page opening with a heading, followed by several stacked text and accordion sections",
  "blocks": [
    {
      "name": "accordion-faq",
      "instances": [
        "main div.cmp-container > section.faq"
      ],
      "pageInstances": {
        "https://www.hrblock.com/online-tax-filing/guarantees/free-in-person-audit-support-terms/": [
          "#container-5fde8778a6 > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/guarantees/worry-free-audit-support/": [
          "#container-5fde8778a6 > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/tax-offices/peace-of-mind-claims/": [
          "#container-78cfb17ee1 > section.faq.spruce-eggshell-theme"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.content-two-column:only-of-type)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/online-tax-filing/guarantees/free-in-person-audit-support-terms/": [
          "#container-5fde8778a6 > div"
        ],
        "https://www.hrblock.com/online-tax-filing/guarantees/worry-free-audit-support/": [
          "#container-5fde8778a6 > div"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.xf-content-height div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/peace-of-mind-claims/": [
          "#container-5da019f694 > section:nth-child(2)"
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
      "id": "page-title-eggshell",
      "name": "Page title and intro (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type"
      ],
      "style": "eggshell",
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type"
      ]
    },
    {
      "id": "content-white",
      "name": "Stacked text sections (headings, paragraphs, lists)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme"
      ]
    },
    {
      "id": "faq",
      "name": "FAQ (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.faq"
      ],
      "style": "eggshell",
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "find-tax-help",
      "name": "Find tax help CTA banner",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height:has(section.content-two-column)"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "trust-forest",
      "name": "Trust band: 22 million heading, guarantee cards, see all link, testimonials (forest)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.xf-content-height:has(section.spruce-forest-theme)",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme"
      ],
      "style": "forest",
      "blocks": [
        "cards-icon",
        "carousel-testimonial"
      ],
      "defaultContent": [
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme:not(:has(li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg))"
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
    "https://www.hrblock.com/online-tax-filing/guarantees/free-in-person-audit-support-terms/": [
      "#truste_0\\.7932089599939031",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_469020734",
      "#container-7fc9f79c93 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1779958920",
      "div.modal-body.body_max_width_mid_1401935590",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_629770289",
      "div.modal-body.body_max_width_mid_1923428145",
      "div.modal-body.body_max_width_mid_411831752",
      "h2.modal-headline.text-large",
      "section.content-two-column > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.modal-body.body_max_width_mid_1352881603",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/guarantees/worry-free-audit-support/": [
      "#truste_0\\.9072596183020402",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_469020734",
      "#container-7fc9f79c93 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1779958920",
      "div.modal-body.body_max_width_mid_1401935590",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_629770289",
      "div.modal-body.body_max_width_mid_1923428145",
      "div.modal-body.body_max_width_mid_411831752",
      "h2.modal-headline.text-large",
      "section.content-two-column > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.modal-body.body_max_width_mid_1352881603",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/peace-of-mind-claims/": [
      "#truste_0\\.5788053856273677",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1044842877",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-2fe721eca4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-2fe721eca4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d4bdfe611c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d4bdfe611c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
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
  'accordion-faq': accordionFaqParser,
  'columns-banner': columnsBannerParser,
  'cards-icon': cardsIconParser,
  'carousel-testimonial': carouselTestimonialParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'accordion-faq': accordionFaqParser,
  'columns-banner': columnsBannerParser,
  'cards-icon': cardsIconParser,
  'carousel-testimonial': carouselTestimonialParser,
  'hero-split': heroSplitParser,
  'cards-feature': cardsFeatureParser,
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
