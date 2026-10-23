/* eslint-disable */
/* global WebImporter */

import contactFormParser from './parsers/contact-form.js';
import heroSplitParser from './parsers/hero-split.js';
import tableDataParser from './parsers/table-data.js';
import accordionMediaParser from './parsers/accordion-media.js';
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
  "name": "form-page",
  "urls": [
    "https://www.hrblock.com/privacy/optout/",
    "https://www.hrblock.com/tax-software/updates-back-editions/state-forms-available/",
    "https://www.hrblock.com/universal/privacy-contact/"
  ],
  "description": "Utility page whose main content is a form, with little surrounding content",
  "blocks": [
    {
      "name": "contact-form",
      "instances": [
        "main div.cmp-container > section.column-control:has(form.cmp-form)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/privacy/optout/": [
          "body > main"
        ],
        "https://www.hrblock.com/universal/privacy-contact/": [
          "#container-d9c867717c > section.column-control.white-theme.padding-bottom-120"
        ]
      }
    },
    {
      "name": "hero-split",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 select)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-software/updates-back-editions/state-forms-available/": [
          "#container-4c5b187f8b > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "main section.federal-forms table"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-software/updates-back-editions/state-forms-available/": [
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(3)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(7)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(11)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(15)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(19)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(23)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(27)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(31)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(35)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(39)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(43)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(47)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(51)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(55)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(59)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(63)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(67)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(71)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(75)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(79)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(83)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(87)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(91)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(95)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(99)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(103)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(107)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(111)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(115)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(119)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(123)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(127)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(131)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(135)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(139)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(143)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(147)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(151)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(155)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(159)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(163)",
          "#container-4c5b187f8b > section.federal-forms > div > div > table:nth-child(167)"
        ]
      }
    },
    {
      "name": "accordion-media",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(.iconlist li a[href]):not(:has(form))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/universal/privacy-contact/": [
          "#container-d9c867717c > section.column-control.spruce-eggshell-theme.padding-top-120.padding-bottom-100.two-column-control"
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
      "id": "form-intro-white",
      "name": "Form page title, intro and form (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme"
      ],
      "style": null,
      "blocks": [
        "contact-form"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:has(form.cmp-form))"
      ]
    },
    {
      "id": "state-picker-hero",
      "name": "State forms hero with state picker (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(select)"
      ],
      "style": "eggshell",
      "blocks": [
        "hero-split"
      ],
      "defaultContent": []
    },
    {
      "id": "state-forms-list",
      "name": "State form lists: state heading, note, forms table, back to top link",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.federal-forms"
      ],
      "style": null,
      "blocks": [
        "table-data"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.federal-forms h3",
        "main > div.root > div.cmp-container > div.cmp-container > section.federal-forms p",
        "main > div.root > div.cmp-container > div.cmp-container > section.federal-forms a"
      ]
    },
    {
      "id": "additional-resources",
      "name": "Additional resources links (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(:has(select))"
      ],
      "style": "eggshell",
      "blocks": [
        "accordion-media"
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
    "https://www.hrblock.com/privacy/optout/": [
      "#truste_0\\.23577777614440276",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_2019748612",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/state-forms-available/": [
      "#truste_0\\.11655936559882818",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_379430362",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/universal/privacy-contact/": [
      "#truste_0\\.0200073314570276",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1983592125",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1153687583",
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
  'contact-form': contactFormParser,
  'hero-split': heroSplitParser,
  'table-data': tableDataParser,
  'accordion-media': accordionMediaParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'contact-form': contactFormParser,
  'hero-split': heroSplitParser,
  'table-data': tableDataParser,
  'accordion-media': accordionMediaParser,
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
