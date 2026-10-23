/* eslint-disable */
/* global WebImporter */

import accordionFaqParser from './parsers/accordion-faq.js';
import tabsPillParser from './parsers/tabs-pill.js';
import searchArticlesParser from './parsers/search-articles.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import accordionMediaParser from './parsers/accordion-media.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsIconListParser from './parsers/columns-icon-list.js';
import columnsBannerParser from './parsers/columns-banner.js';
import heroSplitParser from './parsers/hero-split.js';
import promoStripParser from './parsers/promo-strip.js';
import columnsStatsParser from './parsers/columns-stats.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "info-photo-hero",
  "urls": [
    "https://www.hrblock.com/corporate/",
    "https://www.hrblock.com/corporate/our-company/",
    "https://www.hrblock.com/data-security/",
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/",
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/",
    "https://www.hrblock.com/expat-tax-preparation/offers/saf/",
    "https://www.hrblock.com/expat-tax-preparation/our-team/",
    "https://www.hrblock.com/expat-tax-preparation/site-map/",
    "https://www.hrblock.com/login/",
    "https://www.hrblock.com/makeeveryblockbetter/",
    "https://www.hrblock.com/mobile-apps/",
    "https://www.hrblock.com/offers/refund-advance/",
    "https://www.hrblock.com/support/",
    "https://www.hrblock.com/support/contact-options/",
    "https://www.hrblock.com/tax-offices/extended-tax-services/tax-audit/audit-support/",
    "https://www.hrblock.com/tax-offices/itin-application/",
    "https://www.hrblock.com/tax-offices/make-appointment/",
    "https://www.hrblock.com/tax-offices/our-tax-pros/",
    "https://www.hrblock.com/tax-offices/tax-prep/extended-service/",
    "https://www.hrblock.com/universal/faqs/",
    "https://www.hrblock.com/womens-equity-in-college-sports/"
  ],
  "description": "Informational page opening with a prominent photo hero, followed by text-and-media and card sections",
  "blocks": [
    {
      "name": "accordion-faq",
      "instances": [
        "main div.cmp-container > section.faq"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [
          "#container-4109bfcf36 > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/expat-tax-preparation/offers/saf/": [
          "#container-4b1cd42e7a > section.faq.white-theme"
        ],
        "https://www.hrblock.com/offers/refund-advance/": [
          "#container-1e7cf6ea8a > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/tax-offices/itin-application/": [
          "#container-c56d2af943 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/universal/faqs/": [
          "#container-5417dc4bd2 > section.faq.spruce-eggshell-theme"
        ]
      }
    },
    {
      "name": "tabs-pill",
      "instances": [
        "main div.cmp-container > div.reframe-tabs"
      ],
      "pageInstances": {
        "https://www.hrblock.com/support/": [
          "#container-288fdd294b > div.reframe-tabs"
        ],
        "https://www.hrblock.com/support/contact-options/": [
          "#container-288fdd294b > div.reframe-tabs"
        ],
        "https://www.hrblock.com/womens-equity-in-college-sports/": [
          "#container-6cc882a56c > div"
        ]
      }
    },
    {
      "name": "search-articles",
      "instances": [
        "#mebb-component-map div.mebb--map-hud-box > form"
      ],
      "pageInstances": {
        "https://www.hrblock.com/makeeveryblockbetter/": [
          "#mebb-component-map > div.mebb--map-hud-box.show-hide > form"
        ]
      }
    },
    {
      "name": "carousel-testimonial",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(.testimonial-card)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/makeeveryblockbetter/": [
          "#container-ac927d8850 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control"
        ]
      }
    },
    {
      "name": "accordion-media",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(.cq-dd-image):has(.iconlist)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/our-tax-pros/": [
          "#container-a1107eefd2 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-60.two-column-control"
        ]
      }
    },
    {
      "name": "cards-product",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2.imageOverflow)",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .card-primary-grow)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/": [
          "#container-4d377b0328 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [
          "#container-bdba283c0c > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/our-team/": [
          "#container-f490c323c1 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/womens-equity-in-college-sports/": [
          "#container-6cc882a56c > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.column-control li.col-3 article.card-stacked)",
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-3 article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/our-company/": [
          "#container-736538bcf1 > div:nth-child(10)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/our-team/": [
          "#container-3e149bdc07 > section.column-control.spruce-forest-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/makeeveryblockbetter/": [
          "#container-ac927d8850 > section.column-control.spruce-eggshell-theme.padding-bottom-80"
        ],
        "https://www.hrblock.com/tax-offices/extended-tax-services/tax-audit/audit-support/": [
          "#container-e3ef760aec > section:nth-child(4)"
        ],
        "https://www.hrblock.com/womens-equity-in-college-sports/": [
          "#container-6cc882a56c > section:nth-child(17)"
        ]
      }
    },
    {
      "name": "columns-promo-card",
      "instances": [
        "main div.cmp-container > section.column-control:has(.card-secondary.featurecard .spruce-neon)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/mobile-apps/": [
          "#container-24f7bbde94 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-100"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.cmp-container > section.column-control:has(.card-secondary.featurecard):not(:has(.spruce-neon))",
        "main div.cmp-container > section.column-control:has(.card-secondary.card-jumbo)",
        "main div.xf-content-height div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)",
        "main div.cmp-container > section.column-control.two-column-control:has(.introImageVariant .icon-svg):not(:has(.introDefaultvariant))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/": [
          "#container-9617f3669a > section:nth-child(2)"
        ],
        "https://www.hrblock.com/corporate/our-company/": [
          "#container-1ef8e7f6c6 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/our-team/": [
          "#container-3e149bdc07 > section.column-control.white-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/makeeveryblockbetter/": [
          "#container-ac927d8850 > section:nth-child(8)",
          "#container-ac927d8850 > section.column-control.green-dark-theme.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/mobile-apps/": [
          "#container-24f7bbde94 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-20",
          "#container-24f7bbde94 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-20"
        ],
        "https://www.hrblock.com/offers/refund-advance/": [
          "#container-1e7cf6ea8a > section.column-control.spruce-eggshell-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/support/": [
          "#container-97057b99c6 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/support/contact-options/": [
          "#container-97057b99c6 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/make-appointment/": [
          "#container-701a0c4db5 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/our-tax-pros/": [
          "#container-b871774de2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/tax-prep/extended-service/": [
          "#container-28c4137c86 > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "columns-icon-list",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introDefaultvariant):has(> div.container > ul > li.col-2 .introImageVariant .icon-svg):not(:has(.cq-dd-image))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/our-company/": [
          "#container-736538bcf1 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/extended-tax-services/tax-audit/audit-support/": [
          "#container-e3ef760aec > section.column-control.white-theme.padding-top-20.padding-bottom-20.two-column-control"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.content-two-column:only-of-type)",
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control:only-of-type > div.container > ul > li.col-2 .cq-dd-image)",
        "main div.cmp-container > section.content-two-column",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .cq-dd-image)",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .image-container)",
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introImageVariant img):not(:has(.introDefaultvariant))",
        "main div.cmp-container > section.column-control:not(.two-column-control):not(li section):has(> div.container > ul > li.col-3 .introImageVariant)",
        "main div.cmp-container > section.column-control:not(.two-column-control):not(li section):has(> div.container > ul > li.col-4 .introImageVariant)",
        "main div.cmp-container > section.column-control:not(.two-column-control):not(li section):has(> div.container > ul > li.col-3 .introDefaultvariant .btn-container)",
        "#mebb-component-map div.mebb--map-hud-box--statcols"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/": [
          "#container-2b3f41dd67 > section.column-control.green-dark-theme.padding-top-40.padding-bottom-40.two-column-control",
          "#container-2b3f41dd67 > section:nth-child(2)",
          "#container-2b3f41dd67 > section:nth-child(3)",
          "#container-2b3f41dd67 > section:nth-child(4)",
          "#container-2b3f41dd67 > section:nth-child(5)",
          "#container-2b3f41dd67 > section.column-control.green-dark-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/corporate/our-company/": [
          "#container-736538bcf1 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-736538bcf1 > section:nth-child(2)",
          "#container-736538bcf1 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control",
          "#container-736538bcf1 > section:nth-child(6)",
          "#container-736538bcf1 > section:nth-child(8)"
        ],
        "https://www.hrblock.com/data-security/": [
          "#container-65c2d14335 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-65c2d14335 > section:nth-child(3)",
          "#container-65c2d14335 > section.column-control.white-theme.padding-top-80.padding-bottom-120"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/": [
          "#container-e2928462b4 > div:nth-child(3)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [
          "#container-4109bfcf36 > section.column-control.white-theme.padding-top-100.padding-bottom-60.two-column-control",
          "#container-4109bfcf36 > section:nth-child(5)",
          "#container-4109bfcf36 > section.column-control.white-theme.padding-top-60.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/offers/saf/": [
          "#container-4b1cd42e7a > section.column-control.spruce-eggshell-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/expat-tax-preparation/our-team/": [
          "#container-3e149bdc07 > section.column-control.white-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/expat-tax-preparation/site-map/": [
          "#container-031085854c > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-80",
          "#container-031085854c > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/makeeveryblockbetter/": [
          "#mebb-component-map > div.mebb--map-hud-box.show-hide > div.mebb--map-hud-box--statcols"
        ],
        "https://www.hrblock.com/offers/refund-advance/": [
          "#container-1e7cf6ea8a > section.column-control.green-dark-theme.two-column-control",
          "#container-1e7cf6ea8a > section.column-control.spruce-eggshell-theme.padding-bottom-80",
          "#container-1e7cf6ea8a > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/support/": [
          "#container-288fdd294b > section.column-control.green-dark-theme.padding-top-20.two-column-control",
          "#container-288fdd294b > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-60.two-column-control",
          "#container-288fdd294b > div:nth-child(11)"
        ],
        "https://www.hrblock.com/support/contact-options/": [
          "#container-288fdd294b > section.column-control.green-dark-theme.padding-top-20.two-column-control",
          "#container-288fdd294b > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-60.two-column-control",
          "#container-288fdd294b > div:nth-child(11)"
        ],
        "https://www.hrblock.com/tax-offices/extended-tax-services/tax-audit/audit-support/": [
          "#container-e3ef760aec > section.column-control.spruce-eggshell-theme.two-column-control",
          "#container-e3ef760aec > section.column-control.spruce-eggshell-theme.padding-top-60",
          "#container-e3ef760aec > section:nth-child(6)",
          "#container-e3ef760aec > section.column-control.spruce-eggshell-theme.padding-bottom-100",
          "#container-e3ef760aec > section.column-control.white-theme.padding-top-60.padding-bottom-120"
        ],
        "https://www.hrblock.com/tax-offices/itin-application/": [
          "#container-c56d2af943 > section:nth-child(1)",
          "#container-c56d2af943 > section.column-control.white-theme.padding-top-40.padding-bottom-120",
          "#container-c56d2af943 > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-40.two-column-control",
          "#container-c56d2af943 > div"
        ],
        "https://www.hrblock.com/tax-offices/make-appointment/": [
          "#container-236b77f3fd > section.column-control.green-dark-theme.padding-top-20.padding-bottom-20.two-column-control",
          "#container-236b77f3fd > section.content-two-column",
          "#container-236b77f3fd > div:nth-child(4)"
        ],
        "https://www.hrblock.com/tax-offices/our-tax-pros/": [
          "#container-a1107eefd2 > section:nth-child(1)",
          "#container-a1107eefd2 > section:nth-child(2)",
          "#container-a1107eefd2 > section:nth-child(3)",
          "#container-a1107eefd2 > div:nth-child(14)"
        ],
        "https://www.hrblock.com/tax-offices/tax-prep/extended-service/": [
          "#container-7cfb769c95 > section.column-control.green-dark-theme.padding-top-60.padding-bottom-60.two-column-control",
          "#container-7cfb769c95 > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-100",
          "#container-7cfb769c95 > div:nth-child(4)"
        ],
        "https://www.hrblock.com/womens-equity-in-college-sports/": [
          "#container-6cc882a56c > section.column-control.black-theme.two-column-control",
          "#container-6cc882a56c > section.content-two-column",
          "#container-6cc882a56c > section:nth-child(4)",
          "#container-6cc882a56c > section:nth-child(5)",
          "#container-6cc882a56c > section:nth-child(6)",
          "#container-6cc882a56c > section.column-control.white-theme.padding-bottom-40.two-column-control",
          "#container-6cc882a56c > section.column-control.padding-bottom-100.two-column-control",
          "#container-6cc882a56c > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-60.two-column-control"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero-green",
      "name": "Photo hero (green)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.green-dark-theme:first-of-type)"
      ],
      "style": "green",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:first-of-type:not(.two-column-control)"
      ]
    },
    {
      "id": "hero-eggshell",
      "name": "Photo hero (eggshell)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.spruce-eggshell-theme:first-of-type)"
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
      "id": "hero-black",
      "name": "Photo hero (black)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.black-theme:first-of-type)"
      ],
      "style": "black",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "hero-white",
      "name": "Photo hero (white)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container):not(:has(> div.root > div.cmp-container > div.cmp-container > section.green-dark-theme:first-of-type)):not(:has(> div.root > div.cmp-container > div.cmp-container > section.spruce-eggshell-theme:first-of-type)):not(:has(> div.root > div.cmp-container > div.cmp-container > section.black-theme:first-of-type))"
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
      "id": "sign-in-app",
      "name": "Sign-in app (Angular)",
      "selector": [
        "body > myblock-root"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "body > myblock-root main"
      ]
    },
    {
      "id": "feature-band-green",
      "name": "Feature band (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(:first-of-type)",
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme"
      ],
      "style": "green",
      "blocks": [
        "columns-banner",
        "cards-icon",
        "carousel-testimonial"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(:first-of-type):not(.two-column-control)"
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
        "columns-banner",
        "cards-feature",
        "cards-product",
        "cards-icon",
        "columns-promo-card",
        "accordion-media"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(:first-of-type):not(.two-column-control):has(> div.container > ul > li.col-1)"
      ]
    },
    {
      "id": "feature-band-forest",
      "name": "Feature band (forest)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme"
      ],
      "style": "forest",
      "blocks": [
        "cards-feature",
        "cards-icon"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:has(> div.container > ul > li.col-1)"
      ]
    },
    {
      "id": "feature-band-white",
      "name": "Feature band (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:first-of-type)",
        "main > div.root > div.cmp-container > div.cmp-container > section.content-two-column",
        "main div.cmp-container > div.xf-content-height section.content-two-column"
      ],
      "style": null,
      "blocks": [
        "columns-banner",
        "columns-icon-list",
        "cards-icon"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:first-of-type):has(> div.container > ul > li.col-1)"
      ]
    },
    {
      "id": "image-banner",
      "name": "Full-bleed photo banner",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper"
      ]
    },
    {
      "id": "unthemed-band",
      "name": "Unthemed band (photo pair, icon highlights)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*=\"-theme\"])"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*=\"-theme\"]):not(.two-column-control)"
      ]
    },
    {
      "id": "community-map",
      "name": "Community impact map (custom HTML)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.hrbcom-customhtml"
      ],
      "style": null,
      "blocks": [
        "search-articles",
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.hrbcom-customhtml div.mebb--map--svgwrap"
      ]
    },
    {
      "id": "tabs",
      "name": "Pill tabs",
      "selector": [
        "main div.cmp-container > div.reframe-tabs"
      ],
      "style": null,
      "blocks": [
        "tabs-pill"
      ],
      "defaultContent": []
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
    "https://www.hrblock.com/corporate/": [
      "#truste_0\\.020898978177037897",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1905058237",
      "#container-2b3f41dd67 > section:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_940394482",
      "#container-2b3f41dd67 > section:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1674179252",
      "#container-2b3f41dd67 > section:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1540499215",
      "#container-2b3f41dd67 > section:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1800715910",
      "#container-b7b616d16a > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1192379218",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-27744a556b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-27744a556b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-695bb2a03f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-695bb2a03f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/corporate/our-company/": [
      "#truste_0\\.3951054495138817",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_690788226",
      "#container-26d929b52f > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_170558731",
      "#container-a8dcd00695 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1087265355",
      "#container-aebba44e65 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-aebba44e65 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-aebba44e65 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-aebba44e65 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-aebba44e65 > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-aebba44e65 > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-3e188a79f0 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_832016472",
      "#container-8e5297eeb4 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_356577488",
      "#container-5297993d91 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5297993d91 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e12f300efe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e12f300efe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-bbcc9be5b4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-f96bcaee53 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-f96bcaee53 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1346565378",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-ce8acc60b1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ce8acc60b1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d6a14f7d76 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d6a14f7d76 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/data-security/": [
      "#truste_0\\.9448197672864386",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_455480111",
      "h2.modal-headline.text-jumbo",
      "#container-290e9fbae1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-290e9fbae1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-78098bda19 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-78098bda19 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d2870d259b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d2870d259b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-7a0a35d7e5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7a0a35d7e5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d3c32fd7fb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d3c32fd7fb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/": [
      "#truste_0\\.05693584502169613",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1809059292",
      "h3.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1648219636",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [
      "#truste_0\\.012444196930372686",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1809059292",
      "#container-7e29254fc3 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1274383108",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_160760979",
      "#container-67b3d7e9e2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d654d5b9c1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7f8ece0c59 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-28866434b8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-small",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/offers/saf/": [
      "#truste_0\\.15753779555293212",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "#container-106f1354bc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-jumbo",
      "#container-e610741d00 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e610741d00 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-c7b1a0e9c0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c7b1a0e9c0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-4cb91c3b8d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-4cb91c3b8d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/our-team/": [
      "#truste_0\\.10685330099069612",
      "div.modal-inner",
      "#container-e92e1494eb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)",
      "#container-9cad6cbbf5 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1404029822",
      "#container-0efdaa6abe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-small",
      "h3.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1542068836",
      "#container-9d431c6d2e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-9d431c6d2e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-d85256cdbb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p:nth-child(2)",
      "#container-d85256cdbb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "p.modal-headline.color-dark-green",
      "div.modal-body.m-t-20",
      "#container-035ae0d0b0 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/site-map/": [
      "#truste_0\\.8019458537417888",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "#container-734c51a2d9 > div:nth-child(2) > h2:nth-child(1)",
      "#container-ccc70d4f62 > div:nth-child(2) > h2:nth-child(1)",
      "#container-d93750f3e0 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-medium",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/login/": [
      "#truste_0\\.7076629796529761",
      "#mobile-native-modal",
      "#noiact7ae",
      "#global-error-modal",
      "#timeoutModal"
    ],
    "https://www.hrblock.com/makeeveryblockbetter/": [
      "#truste_0\\.9253946876716165",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "div.modal-body.body_max_width_mid_2142102632",
      "#container-a33a19fbb2 > div:nth-child(3) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1722727806",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_438300164",
      "h3.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1079683053",
      "h2.modal-headline.text-jumbo",
      "#container-5d94f3605b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5d94f3605b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a02c3bf614 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-a02c3bf614 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-39e09f61ef > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-39e09f61ef > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/mobile-apps/": [
      "#truste_0\\.35183054574777994",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_847244109",
      "div.modal-body.body_max_width_mid_605770462",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/offers/refund-advance/": [
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_95580628",
      "#container-5e9907b856 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-1c0b32803a > div:nth-child(2) > h2:nth-child(1)",
      "#container-6c201245f4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6c201245f4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-0d96c889fa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-0d96c889fa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-b55a200783 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-b55a200783 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.color-eggshell",
      "#container-900480e3fa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8489ffd059 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.color-eggshell",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1894037279",
      "h3.modal-headline.text-small",
      "#container-fb54515e8c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1383939846",
      "h2.modal-headline.text-jumbo",
      "a.modal-tool-open.track-1797935441",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/support/": [
      "#truste_0\\.866968064871465",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1457007545",
      "#container-ed172fbdd2 > div:nth-child(2) > h3:nth-child(1)",
      "#container-bcca7806ec > div:nth-child(2) > h3:nth-child(1)",
      "#container-d239ef8abd > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-large",
      "#container-bbdeb06060 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_797722747",
      "#container-1edb30d55c > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1842208195",
      "#container-bcc9eb808d > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_2126865134",
      "#container-2eff207f2c > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1616330957",
      "#container-3e7cd3cf38 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_402668526",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_107865651",
      "#container-a793be660d > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1679583930",
      "div.modal-body.body_max_width_mid_3305465",
      "#container-541ce401fe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-541ce401fe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-cf4e3e8dfd > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-bfcf0d31c0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-bfcf0d31c0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-8a9656dc16 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8a9656dc16 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.column-container.valign-center > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
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
    "https://www.hrblock.com/support/contact-options/": [
      "#truste_0\\.39526141781656243",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1457007545",
      "#container-ed172fbdd2 > div:nth-child(2) > h3:nth-child(1)",
      "#container-bcca7806ec > div:nth-child(2) > h3:nth-child(1)",
      "#container-d239ef8abd > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-large",
      "#container-bbdeb06060 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_797722747",
      "#container-1edb30d55c > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1842208195",
      "#container-bcc9eb808d > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_2126865134",
      "#container-2eff207f2c > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1616330957",
      "#container-3e7cd3cf38 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_402668526",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_107865651",
      "#container-a793be660d > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1679583930",
      "div.modal-body.body_max_width_mid_3305465",
      "#container-541ce401fe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-541ce401fe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-cf4e3e8dfd > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-bfcf0d31c0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-bfcf0d31c0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-8a9656dc16 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8a9656dc16 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.column-container.valign-center > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
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
    "https://www.hrblock.com/tax-offices/extended-tax-services/tax-audit/audit-support/": [
      "#truste_0\\.3241388605991554",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_78012108",
      "a.btn.modal-tool-open",
      "#container-eaa20ce526 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1673287938",
      "#container-c4a0ee4e08 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c4a0ee4e08 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-c4a0ee4e08 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c4a0ee4e08 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-c4a0ee4e08 > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c4a0ee4e08 > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-f6fea973de > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1382423688",
      "#container-1ace46222e > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1795162662",
      "#container-6493f03d43 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_137987179",
      "#container-504bbd5979 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_372546998",
      "#container-719fcfd64b > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1559196121",
      "#container-5f71abdc06 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1834772652",
      "#container-12df547260 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_2046123565",
      "#container-332e8606bc > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1396142673",
      "#container-3d722c1d85 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1926161229",
      "h2.modal-headline.text-jumbo",
      "#container-db3d906b87 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-db3d906b87 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-dda65577c5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-dda65577c5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/itin-application/": [
      "#truste_0\\.5101423236606396",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_739453899",
      "#container-a9069af126 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-c0ce793b76 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_733065069",
      "#container-7ccf9dfff8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7ccf9dfff8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-9e023e1b31 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-9e023e1b31 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "#container-061f7b43ae > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_496412782",
      "h2.modal-headline.text-large",
      "#container-54eadea982 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/make-appointment/": [
      "#truste_0\\.2561069408742038",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_449344688",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.track-1006846532",
      "#container-0da80301f8 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_171101008",
      "a.modal-tool-open.track-609815197",
      "#container-572f786412 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_681635185",
      "a.modal-tool-open.track-1532498780",
      "div.column-container.valign-center > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1113967910",
      "#container-b07de5d60e > div:nth-child(2) > h2:nth-child(1)",
      "div.left-30 > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1090251584",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-85a976b7f9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-85a976b7f9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-af9606e0d6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-af9606e0d6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/our-tax-pros/": [
      "#truste_0\\.8888079945271611",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_634558980",
      "#container-a1107eefd2 > section:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-a1107eefd2 > section:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-a1107eefd2 > section:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1207479553",
      "#container-a1107eefd2 > section:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_250273639",
      "#container-6f5ea1665c > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1350233492",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1035386895",
      "#container-f0af95a299 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1742447704",
      "#container-6fc1ea3163 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_984647184",
      "#container-7ebebb077c > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_461548198",
      "#container-1240a584f0 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_82113054",
      "#container-1853adb079 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1579593726",
      "#container-5292a6a878 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_78735331",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_1764934375",
      "#container-3a3541e90e > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-02ca432178 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-02ca432178 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-4ddf20bbab > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-4ddf20bbab > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "#container-1e185e950d > section:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.modal-body.body_max_width_mid_1979106246",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/tax-prep/extended-service/": [
      "#truste_0\\.9922355685747952",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_2065320483",
      "#container-72a4e6c8ca > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-72a4e6c8ca > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-da7bdde048 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_119918736",
      "#container-8bdbafa9aa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8bdbafa9aa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ebd82c6df2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ebd82c6df2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a40cb1dc94 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-a40cb1dc94 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-49c47a8260 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d2f9fdde33 > div:nth-child(2) > h2:nth-child(1)",
      "#container-d2f9fdde33 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-217546edb2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-217546edb2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-af3a84bbfb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-af3a84bbfb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_412122067",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/universal/faqs/": [
      "#truste_0\\.1460189447720205",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/womens-equity-in-college-sports/": [
      "#truste_0\\.5310602420428926",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1631530569",
      "div.column-container.valign-center > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_580865075",
      "#container-91b87ebbb3 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1315748673",
      "#container-64fe48526d > div:nth-child(3) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_609598533",
      "#container-ebd799f834 > div:nth-child(3) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1498101200",
      "#container-9e4cb365de > div:nth-child(3) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1014746594",
      "#container-94bbcd5263 > div:nth-child(3) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_624584983",
      "#container-e2874f15d3 > div:nth-child(2) > h2:nth-child(1)",
      "#container-b7da21c201 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)",
      "#container-b7da21c201 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-742345c7c4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)",
      "#container-742345c7c4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-02d9c4f5d6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)",
      "#container-02d9c4f5d6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "h4.modal-headline.hrb-color--medium-dark-green",
      "#container-d414a8767d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-901a0b00d6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-901a0b00d6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-d9bd233998 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-d9bd233998 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-dee4875fb1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-dee4875fb1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-1e330af3a4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-1e330af3a4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-6c7e4edaff > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-6c7e4edaff > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-f912107045 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-f912107045 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-b1f792142e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-b1f792142e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-f4b5d73bbc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-f4b5d73bbc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-ebf78aef7b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-ebf78aef7b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-4adeae6d1e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-4adeae6d1e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-a3e8a550f3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-a3e8a550f3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-a89a19e122 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-a89a19e122 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-4b26ec90db > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-4b26ec90db > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-687f44ea22 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-687f44ea22 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-5f7e9ec2a8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-5f7e9ec2a8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-c0bc6e9965 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-c0bc6e9965 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-afb8932f5c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-afb8932f5c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-66e371dc26 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-66e371dc26 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-4754b0f793 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-4754b0f793 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-de37a8e725 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-de37a8e725 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-d171e58c50 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-d171e58c50 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-c223facc4a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-c223facc4a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-d30602d574 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-d30602d574 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-f3e2be943d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-f3e2be943d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-4edc1ce8c4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-4edc1ce8c4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-2dc076d748 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-2dc076d748 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-4ec4ef4ecc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-4ec4ef4ecc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-3f1ca2b820 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-3f1ca2b820 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-c2cedcf5dc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-c2cedcf5dc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-efba62e9a0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-efba62e9a0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-7d9c5f9532 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-7d9c5f9532 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-a4fc4b551a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-a4fc4b551a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-f0af46bd9f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-f0af46bd9f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-2b0fdab645 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-2b0fdab645 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-f78019cf16 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-f78019cf16 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-5680cfa3e8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-5680cfa3e8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-19bab22f42 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-19bab22f42 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-133b4053ff > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-133b4053ff > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-d8bbf6560a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-d8bbf6560a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-c22671ac79 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-c22671ac79 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-94d1f8c022 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "div.modal-body.m-t-20",
      "#container-479564d348 > div:nth-child(2) > h3:nth-child(1)",
      "#container-151bc24d3a > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1107117157",
      "div.modal-body.body_max_width_mid_313971084",
      "div.modal-body.body_max_width_mid_696157081",
      "h3.modal-headline.hrb-color--medium-dark-green",
      "#container-b543d87db9 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_685208376",
      "h2.modal-headline.text-large",
      "#container-c8e0aae336 > div:nth-child(2) > div:nth-child(2) > a:nth-child(2)",
      "#container-240c52ec3b > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1307704083",
      "#container-2fdf10cea0 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1675697380",
      "h2.modal-headline.text-jumbo",
      "span.product-modal-price",
      "a.modal-tool-open.track-1587640297",
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
  'tabs-pill': tabsPillParser,
  'search-articles': searchArticlesParser,
  'carousel-testimonial': carouselTestimonialParser,
  'accordion-media': accordionMediaParser,
  'cards-product': cardsProductParser,
  'cards-feature': cardsFeatureParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-icon': cardsIconParser,
  'columns-icon-list': columnsIconListParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'accordion-faq': accordionFaqParser,
  'tabs-pill': tabsPillParser,
  'search-articles': searchArticlesParser,
  'carousel-testimonial': carouselTestimonialParser,
  'accordion-media': accordionMediaParser,
  'cards-product': cardsProductParser,
  'cards-feature': cardsFeatureParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-icon': cardsIconParser,
  'columns-icon-list': columnsIconListParser,
  'columns-banner': columnsBannerParser,
  'hero-split': heroSplitParser,
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
