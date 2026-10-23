/* eslint-disable */
/* global WebImporter */

import cardsPricingParser from './parsers/cards-pricing.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import tableDataParser from './parsers/table-data.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsBannerParser from './parsers/columns-banner.js';
import heroSplitParser from './parsers/hero-split.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "product-cta-hero",
  "urls": [
    "https://www.hrblock.com/best-tax-services/",
    "https://www.hrblock.com/expat-tax-preparation/expat-extension-filing/",
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/audit-support/",
    "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/federal-tax-forms/",
    "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/federal-tax-forms/",
    "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/federal-tax-forms/",
    "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/federal-tax-forms/",
    "https://www.hrblock.com/responsible-disclosure-policy/",
    "https://www.hrblock.com/tax-offices/upfront-pricing/",
    "https://www.hrblock.com/tax-prep-checklist/what-do-i-need-to-file-taxes/",
    "https://www.hrblock.com/tax-software/license/",
    "https://www.hrblock.com/universal/digital-online-mobile-privacy-principles/",
    "https://www.hrblock.com/universal/terms/"
  ],
  "description": "Product page opening with a call-to-action button hero, followed by comparison and feature sections",
  "blocks": [
    {
      "name": "cards-pricing",
      "instances": [
        "main div.cmp-container > section.column-control:has(.category-card_container-v2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/best-tax-services/": [
          "#container-384d9bbe90 > section.column-control.green-dark-theme.padding-top-60.padding-bottom-20"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.cmp-container > section.column-control:not(.two-column-control):has(div.xf-content-height section.column-control li.col-3 .introImageVariant)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/best-tax-services/": [
          "#container-eb30f94f9d > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/upfront-pricing/": [
          "#container-5c81e3f63a > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control li.col-2 article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/best-tax-services/": [
          "#container-384d9bbe90 > div:nth-child(22)"
        ]
      }
    },
    {
      "name": "cards-product",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(li.col-2 div.card-primary article.card-content)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-prep-checklist/what-do-i-need-to-file-taxes/": [
          "#container-9e02b2e8b4 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-120.two-column-control"
        ]
      }
    },
    {
      "name": "columns-feature",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control .image-container):has(.iconlist)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/best-tax-services/": [
          "#container-384d9bbe90 > div:nth-child(11)"
        ]
      }
    },
    {
      "name": "promo-strip",
      "instances": [
        "main div.cmp-container > section.hrb-neon-green:has(.alignBanner)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/best-tax-services/": [
          "#container-384d9bbe90 > section.hrb-neon-green"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "main div.cmp-container > section.container:has(div.table-comparison table)",
        "main div.cmp-container div.modal-body > table.table-chart:has(td[rowspan], th[rowspan], td[colspan], th[colspan])"
      ],
      "pageInstances": {
        "https://www.hrblock.com/best-tax-services/": [
          "#container-384d9bbe90 > section.spruce-forest-theme.container.p-y-80.padding-top-20.padding-bottom-20"
        ]
      }
    },
    {
      "name": "accordion-faq",
      "instances": [
        "main div.cmp-container > section.faq"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/expat-extension-filing/": [
          "#container-2d5449bf74 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/audit-support/": [
          "#container-5ce15e0ade > section.faq.white-theme"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > section.content-two-column",
        "main div.cmp-container > section.column-control.two-column-control:has(.cq-dd-image):not(:has(.iconlist))",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul.column-container > li.col-2 .introDefaultvariant .btn):not(:has(img, .iconlist, article, .category-card_container-v2))",
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul.column-container > li.col-3 .introImageVariant)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/expat-extension-filing/": [
          "#container-2d5449bf74 > section.column-control.white-theme.padding-top-100.padding-bottom-100.two-column-control",
          "#container-2d5449bf74 > section.column-control.spruce-eggshell-theme.padding-bottom-80"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/audit-support/": [
          "#container-5ce15e0ade > section.column-control.white-theme.padding-top-120.padding-bottom-100.two-column-control",
          "#container-5ce15e0ade > section.content-two-column",
          "#container-5ce15e0ade > section.column-control.white-theme.padding-top-40.padding-bottom-120"
        ],
        "https://www.hrblock.com/tax-offices/upfront-pricing/": [
          "#container-94a331c4ca > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-94a331c4ca > section.column-control.white-theme.padding-top-20.padding-bottom-100",
          "#container-94a331c4ca > section:nth-child(4)",
          "#container-94a331c4ca > section.content-two-column"
        ],
        "https://www.hrblock.com/universal/digital-online-mobile-privacy-principles/": [
          "#container-83cc5e3f8f > section.column-control.white-theme.padding-top-60.padding-bottom-40"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero-forest",
      "name": "CTA hero (forest)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:first-of-type)"
      ],
      "style": "forest",
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:first-of-type"
      ]
    },
    {
      "id": "hero-eggshell",
      "name": "CTA hero (eggshell)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type)"
      ],
      "style": "eggshell",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type:not(.two-column-control)"
      ]
    },
    {
      "id": "hero",
      "name": "CTA hero (white)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container):not(:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:first-of-type)):not(:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type))"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:first-of-type:not(.two-column-control)"
      ]
    },
    {
      "id": "pricing-green",
      "name": "Filing options pricing and comparison (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:has(.category-card_container-v2)",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.green-dark-theme"
      ],
      "style": "green",
      "blocks": [
        "cards-pricing"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.green-dark-theme"
      ]
    },
    {
      "id": "feature-band-eggshell",
      "name": "Feature band (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(:first-of-type)",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme"
      ],
      "style": "eggshell",
      "blocks": [
        "columns-feature",
        "columns-banner",
        "cards-icon"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(:first-of-type):has(article.card-stacked)",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme:has(.testimonial-btn)",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme:not(:has(.xf-content-height)):has(.introDefaultvariant)"
      ]
    },
    {
      "id": "switch-strip",
      "name": "Switch promo strip (neon)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.hrb-neon-green"
      ],
      "style": "neon",
      "blocks": [
        "promo-strip"
      ],
      "defaultContent": []
    },
    {
      "id": "comparison-forest",
      "name": "Competitor comparison (forest)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme:not(:first-of-type)"
      ],
      "style": "forest",
      "blocks": [
        "table-data"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:not(:first-of-type)"
      ]
    },
    {
      "id": "guarantees-green",
      "name": "Guarantees and testimonials (green)",
      "selector": [
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(:has(.category-card_container-v2))"
      ],
      "style": "green",
      "blocks": [
        "cards-icon",
        "cards-product"
      ],
      "defaultContent": [
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme:has(.testimonial-btn)",
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme:not(:has(.xf-content-height)):has(.introDefaultvariant)"
      ]
    },
    {
      "id": "feature-band-white",
      "name": "Feature band (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:first-of-type)",
        "main > div.root > div.cmp-container > div.cmp-container > section.content-two-column",
        "main div.cmp-container > div.xf-content-height section.column-control.white-theme"
      ],
      "style": null,
      "blocks": [
        "columns-banner",
        "cards-feature"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:first-of-type):not(.two-column-control):not(:has(.introImageVariant))"
      ]
    },
    {
      "id": "legal-tables",
      "name": "Legal tables (custom HTML)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.hrbcom-customhtml"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.hrbcom-customhtml"
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
        "body > div.global-disclaimer-container",
        "main div.cmp-container > div.global-disclaimer-container:not(.hide)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "body > div.global-disclaimer-container"
      ]
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/best-tax-services/": [
      "#truste_0\\.8151341364427283",
      "#ciam-login-app",
      "#modal-free",
      "#modal-diy-free-software-requirements",
      "#modal-ai",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1970488358",
      "#container-d7911ce63c > div:nth-child(5) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_503368159",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_213089153",
      "div.modal-body.body_max_width_mid_1499871450",
      "#container-acacaf0301 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-7478116072 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7478116072 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-4a23b6b624 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-4a23b6b624 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-extension-filing/": [
      "#truste_0\\.5008456872879737",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_909023952",
      "h2.modal-headline.text-large",
      "#container-b2e32611d3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)",
      "#container-b2e32611d3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-64af1009e6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)",
      "#container-64af1009e6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "p.modal-headline.text-little",
      "div.modal-body.m-t-20",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/audit-support/": [
      "#truste_0\\.034824682056907585",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1339961120",
      "h2.modal-headline.text-large",
      "section.content-two-column > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-jumbo",
      "#container-f4e0a47be2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-f4e0a47be2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-b47cbf4335 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-b47cbf4335 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/federal-tax-forms/": [
      "#truste_0\\.9347964165194307",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1639514361",
      "div.modal-body.body_max_width_mid_382078193",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/federal-tax-forms/": [
      "#truste_0\\.733730460036805",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_874535132",
      "div.modal-body.body_max_width_mid_864862330",
      "div.modal-body.body_max_width_mid_1140766582",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/federal-tax-forms/": [
      "#truste_0\\.14633104908055095",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1815052731",
      "div.modal-body.body_max_width_mid_281187905",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/federal-tax-forms/": [
      "#truste_0\\.36755904405316364",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_713660252",
      "div.modal-body.body_max_width_mid_2047442218",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/responsible-disclosure-policy/": [
      "#truste_0\\.8949566204425539",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "#container-4aa6e518f5 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1409781316",
      "#container-4aa6e518f5 > div:nth-child(4) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_826634647",
      "#container-4aa6e518f5 > div:nth-child(6) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_691436316",
      "#container-4aa6e518f5 > div:nth-child(8) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2095229192",
      "#container-4aa6e518f5 > div:nth-child(10) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1568632813",
      "#container-4aa6e518f5 > div:nth-child(12) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_447186252",
      "#container-4aa6e518f5 > div:nth-child(14) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_848876707",
      "#container-4aa6e518f5 > div:nth-child(16) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_924541663",
      "#container-4aa6e518f5 > div:nth-child(18) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_952074678",
      "h2.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_863880932",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/upfront-pricing/": [
      "#truste_0\\.5245981214744203",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_887578013",
      "a.btn.modal-tool-open",
      "#container-38cbb1f40d > div:nth-child(2) > h2:nth-child(1)",
      "#container-8c14283142 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8c14283142 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ad83591adc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ad83591adc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-0e55a4422a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-22fef5ef3e > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_830585735",
      "div.column-container.valign-center > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1564794364",
      "a.modal-tool-open.track-703097193",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-6edbbd87c7 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6edbbd87c7 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-9ca6a8b553 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-9ca6a8b553 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-prep-checklist/what-do-i-need-to-file-taxes/": [
      "#truste_0\\.9040248910795593",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_823669645",
      "#container-1d94f882ca > div:nth-child(4) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1691336180",
      "#container-1d94f882ca > div:nth-child(6) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_140730743",
      "#container-1d94f882ca > div:nth-child(8) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_928803805",
      "#container-1d94f882ca > div:nth-child(10) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1111673471",
      "#container-1d94f882ca > div:nth-child(12) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_766853071",
      "#container-1d94f882ca > div:nth-child(14) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1606591224",
      "#container-1d94f882ca > div:nth-child(16) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_817556266",
      "#container-1d94f882ca > div:nth-child(18) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1140295670",
      "#container-1d94f882ca > div:nth-child(20) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1251920619",
      "#container-1d94f882ca > div:nth-child(22) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1716258955",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_193393778",
      "#container-1d94f882ca > div:nth-child(26) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_337759119",
      "#container-1d94f882ca > div:nth-child(28) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1531498226",
      "#container-1d94f882ca > div:nth-child(30) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_2096545351",
      "#container-1d94f882ca > div:nth-child(32) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1762647694",
      "#container-1d94f882ca > div:nth-child(34) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_475902732",
      "#container-1d94f882ca > div:nth-child(36) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1005694351",
      "#container-1d94f882ca > div:nth-child(38) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_907848553",
      "#container-1d94f882ca > div:nth-child(40) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1819988259",
      "#container-1d94f882ca > div:nth-child(42) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_2046387760",
      "h3.modal-headline.text-little",
      "div.modal-body.body_max_width_mid_95887445",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1181534750",
      "span.product-modal-price",
      "a.modal-tool-open.track-873490822",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/license/": [
      "#truste_0\\.038652251803249604",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1492466507",
      "h2.modal-headline.text-small",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/universal/digital-online-mobile-privacy-principles/": [
      "#truste_0\\.6836531994409826",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1356402973",
      "#container-bb95c34f76 > div:nth-child(5) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1234844704",
      "div.modal-body.body_max_width_mid_1094468034",
      "#container-bb95c34f76 > div:nth-child(11) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1193580754",
      "#container-bb95c34f76 > div:nth-child(14) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1567775584",
      "div.modal-body.body_max_width_mid_939541567",
      "#container-bb95c34f76 > div:nth-child(19) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_984486291",
      "#container-bb95c34f76 > div:nth-child(22) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1956626891",
      "#container-bb95c34f76 > div:nth-child(25) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1907480901",
      "#container-bb95c34f76 > div:nth-child(28) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_779789214",
      "#container-bb95c34f76 > div:nth-child(31) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1529739338",
      "#container-bb95c34f76 > div:nth-child(34) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_539927555",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1752053302",
      "div.modal-body.body_max_width_mid_2104204221",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/universal/terms/": [
      "#truste_0\\.7833014043503131",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "#container-f4a4c2f44e > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_459781353",
      "#container-f4a4c2f44e > div:nth-child(4) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1681673275",
      "#container-f4a4c2f44e > div:nth-child(6) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_44080745",
      "#container-f4a4c2f44e > div:nth-child(8) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1366502970",
      "#container-f4a4c2f44e > div:nth-child(10) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1594045549",
      "#container-f4a4c2f44e > div:nth-child(12) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_663165485",
      "#container-f4a4c2f44e > div:nth-child(14) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_19923767",
      "div.modal-body.body_max_width_mid_715535543",
      "#container-f4a4c2f44e > div:nth-child(18) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_989452984",
      "#container-f4a4c2f44e > div:nth-child(20) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_956907910",
      "#container-f4a4c2f44e > div:nth-child(22) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620076788",
      "#container-f4a4c2f44e > div:nth-child(24) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1181952071",
      "#container-f4a4c2f44e > div:nth-child(26) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1149087411",
      "#container-f4a4c2f44e > div:nth-child(28) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_843193611",
      "#container-f4a4c2f44e > div:nth-child(30) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1884883304",
      "#container-f4a4c2f44e > div:nth-child(32) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_112677315",
      "#container-f4a4c2f44e > div:nth-child(34) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_859473729",
      "h2.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_1995630700",
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
  'cards-pricing': cardsPricingParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'cards-product': cardsProductParser,
  'columns-feature': columnsFeatureParser,
  'promo-strip': promoStripParser,
  'table-data': tableDataParser,
  'accordion-faq': accordionFaqParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'cards-pricing': cardsPricingParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'cards-product': cardsProductParser,
  'columns-feature': columnsFeatureParser,
  'promo-strip': promoStripParser,
  'table-data': tableDataParser,
  'accordion-faq': accordionFaqParser,
  'columns-banner': columnsBannerParser,
  'hero-split': heroSplitParser,
  'carousel-testimonial': carouselTestimonialParser,
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
