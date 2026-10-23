/* eslint-disable */
/* global WebImporter */

import accordionFaqParser from './parsers/accordion-faq.js';
import tabsPillParser from './parsers/tabs-pill.js';
import officeLocatorParser from './parsers/office-locator.js';
import cardsOfficeServicesParser from './parsers/cards-office-services.js';
import columnsStatsParser from './parsers/columns-stats.js';
import contactFormParser from './parsers/contact-form.js';
import searchArticlesParser from './parsers/search-articles.js';
import tableDataParser from './parsers/table-data.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import accordionMediaParser from './parsers/accordion-media.js';
import columnsCalloutParser from './parsers/columns-callout.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import columnsBannerParser from './parsers/columns-banner.js';
import heroSplitParser from './parsers/hero-split.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "card-grid-landing",
  "urls": [
    "https://www.hrblock.com/corporate/tax-franchise/",
    "https://www.hrblock.com/dsar/",
    "https://www.hrblock.com/espanol/",
    "https://www.hrblock.com/expat-tax-preparation/expat-services/",
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/",
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/",
    "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/",
    "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/",
    "https://www.hrblock.com/filing-options-and-products/",
    "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/",
    "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/",
    "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/",
    "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/",
    "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/",
    "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/",
    "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/",
    "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/",
    "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/",
    "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/",
    "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/",
    "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/",
    "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/",
    "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/",
    "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/",
    "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/",
    "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/",
    "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/",
    "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/",
    "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/",
    "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/",
    "https://www.hrblock.com/international-tax-offices/panama/panama/63312/",
    "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/",
    "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/",
    "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/",
    "https://www.hrblock.com/no-surprise-guarantee/",
    "https://www.hrblock.com/partners/tax-import-partners/",
    "https://www.hrblock.com/tax-appointment-preparation/",
    "https://www.hrblock.com/tax-offices/business-services/",
    "https://www.hrblock.com/tax-offices/drop-off/",
    "https://www.hrblock.com/tax-offices/international/",
    "https://www.hrblock.com/tax-offices/office-tax-preparation/",
    "https://www.hrblock.com/tax-offices/tax-refund-payment/",
    "https://www.hrblock.com/tax-offices/virtual-tax-preparation/",
    "https://www.hrblock.com/taxes-site-index/",
    "https://www.hrblock.com/taxes/products/software/updates/whyrequired/"
  ],
  "description": "Landing page opening with repeated cards, followed by CTA bands, FAQ accordion and split promo",
  "blocks": [
    {
      "name": "accordion-faq",
      "instances": [
        "main div.cmp-container > section.faq",
        "main div.cmp-container > section.accordian-section[class*=\"-theme\"]:not(li section)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/tax-franchise/": [
          "#container-b1efe99f69 > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/espanol/": [
          "#container-255e702f13 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
          "#container-4629a22216 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
          "#container-19212fc5ed > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
          "#container-c566082ee0 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
          "#container-4f037312fd > section.faq.white-theme"
        ],
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-c74219acd4 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-appointment-preparation/": [
          "#container-ee26adcaaa > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-offices/international/": [
          "#container-28a219ff3d > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
          "#container-1da07e30fe > section.accordian-section.full-width.white-theme"
        ]
      }
    },
    {
      "name": "tabs-pill",
      "instances": [
        "main div.cmp-container > div.reframe-tabs"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-appointment-preparation/": [
          "#container-ee26adcaaa > div"
        ],
        "https://www.hrblock.com/tax-offices/business-services/": [
          "#container-81ca87821d > div.reframe-tabs"
        ]
      }
    },
    {
      "name": "office-locator",
      "instances": [
        "main div.cmp-container > section.column-control:has(.opp-city-state)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
          "#container-5a002b9926 > section:nth-child(1)"
        ]
      }
    },
    {
      "name": "cards-office-services",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(.opp-service-icon)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
          "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
        ]
      }
    },
    {
      "name": "columns-stats",
      "instances": [
        "main div.xf-content-height div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .card-secondary.featurecard):has(> div.container > ul > li.col-2 .introImageVariant)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
          "#container-ff40e6cdd2 > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "contact-form",
      "instances": [
        "main div.cmp-container > section.column-control:has(.hrb-custom-form form)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/partners/tax-import-partners/": [
          "#container-8c5dbff294 > section.column-control.white-theme.padding-top-120.padding-bottom-100"
        ]
      }
    },
    {
      "name": "search-articles",
      "instances": [
        "main div.cmp-container > section.column-control:has(select.select-location)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/tax-franchise/": [
          "#container-b1efe99f69 > section:nth-child(12)"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "main div.cmp-container > div.showcontents"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/drop-off/": [
          "#container-34b249c794 > div.showcontents.full-width"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > div.showcontents.full-width"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-7228de0508 > div.showcontents.full-width"
        ]
      }
    },
    {
      "name": "cards-pricing",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(.category-card_container-v2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-c74219acd4 > div:nth-child(3)"
        ]
      }
    },
    {
      "name": "accordion-media",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 section.accordian-section ul.accordion)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/drop-off/": [
          "#container-34b249c794 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-7228de0508 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
        ]
      }
    },
    {
      "name": "columns-callout",
      "instances": [
        "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introDefaultvariant):has(> div.container > ul > li.col-2 article.card-stacked .hrb-icon-link--check, > div.container > ul > li.col-2 article.card-stacked .hrb-icon-link--check-green)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
          "#container-c566082ee0 > section.column-control.padding-top-40.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
          "#container-4f037312fd > section.column-control.white-theme.padding-top-80.padding-bottom-60.two-column-control"
        ]
      }
    },
    {
      "name": "cards-product",
      "instances": [
        "main div.cmp-container > section.column-control:has(> div.container > ul > li.imageOverflow)",
        "main div.cmp-container > section.column-control.two-column-control:has(li.col-2 div.card-primary article.card-content)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
          "#container-30454cf958 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
          "#container-553737c5aa > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
          "#container-d602b58300 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
          "#container-afd5d13c0e > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
          "#container-e4e1e777e5 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/no-surprise-guarantee/": [
          "#container-958a931f0a > section.column-control.green-dark-theme.padding-top-20.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-7228de0508 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ]
      }
    },
    {
      "name": "columns-promo-card",
      "instances": [
        "main div.cmp-container > section.column-control:has(.card-jumbo)",
        "main div.cmp-container > div.xf-content-height:has(.card-secondary.featurecard):not(:has(section.two-column-control))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-c74219acd4 > section.column-control.white-theme.padding-top-100.padding-bottom-40"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > div:nth-child(19)"
        ],
        "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
          "#container-1da07e30fe > div:nth-child(7)"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.xf-content-height div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-1 .introImageVariant .icon-svg)",
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-1 .alignBanner h2.skinnyHeader):has(> div.container > ul > li.col-1 .alignBanner img)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/dsar/": [
          "#container-a8d6a15d17 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-74c19fe3c5 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
          "#container-485b778d92 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/no-surprise-guarantee/": [
          "#container-7b73822ca6 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/drop-off/": [
          "#container-34b249c794 > section:nth-child(9)",
          "#container-475969aff1 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/international/": [
          "#container-1ddc4dd7f2 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > section.column-control.spruce-eggshell-theme.padding-bottom-60",
          "#container-1df20e8729 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
          "#container-708adc668f > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-a9faa20768 > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control li.col-2 .card-inset)",
        "main div.cmp-container > section.column-control.two-column-control:has(li.col-2 .card-inset)",
        "main div.cmp-container > section.column-control:has(> div.container > ul > li:is(.col-2, .col-3, .col-4) article.card-stacked):not(:has(.hrb-icon-link--check, .hrb-icon-link--check-green))",
        "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-4 .icon-svg)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
          "#container-f5223be189 > section.column-control.white-theme.padding-top-20"
        ],
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-c74219acd4 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
          "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/no-surprise-guarantee/": [
          "#container-e3d43503e3 > section.column-control.white-theme.padding-top-20.two-column-control",
          "#container-e3d43503e3 > section.column-control.white-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/partners/tax-import-partners/": [
          "#container-8c5dbff294 > section.column-control.white-theme.padding-top-20.two-column-control",
          "#container-8c5dbff294 > section.column-control.white-theme.padding-bottom-120.two-column-control",
          "#container-8c5dbff294 > section.column-control.spruce-eggshell-theme.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/": [
          "#container-81ca87821d > section.column-control.white-theme.padding-top-60.padding-bottom-60"
        ],
        "https://www.hrblock.com/tax-offices/drop-off/": [
          "#container-34b249c794 > div:nth-child(23)"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > div:nth-child(23)"
        ],
        "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
          "#container-1da07e30fe > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-7228de0508 > div:nth-child(21)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
          "#container-09f0436c75 > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "promo-strip",
      "instances": [
        "main div.cmp-container > section.column-control:has(> div.container > ul > li.col-1 .alignBanner .icon-svg)",
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section:only-of-type .alignBanner)",
        "main div.cmp-container > section.spruce-forest-theme:has(> div.alignBanner .icon-svg)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-c74219acd4 > section.column-control.green-dark-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-offices/drop-off/": [
          "#container-34b249c794 > div:nth-child(10)"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > div:nth-child(10)"
        ],
        "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
          "#container-1da07e30fe > div:nth-child(4)"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-7228de0508 > div:nth-child(8)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
          "#container-8ca114bef5 > section.spruce-forest-theme"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(.fb-image-wrapper .alignBanner)",
        "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control:only-of-type > div.container > ul > li.col-2 .cq-dd-image)",
        "main div.cmp-container > section.content-two-column",
        "main div.cmp-container > section.column-control:not(li section).two-column-control:has(> div.container > ul > li.col-2):not(:has(> div.container > ul > li.hide-large))",
        "main div.cmp-container > section.column-control:not(li section):not(.two-column-control):has(> div.container > ul > li.col-3, > div.container > ul > li.col-4, > div.container > ul > li.col-5)",
        "main section.column-control.spruce-forest-theme:not(.two-column-control):not(li.hide-large section):has(> div.container > ul.column-container > li.col-3 h3.modal-headline > p):not(:has(img, picture, a[href], button, article))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/tax-franchise/": [
          "#container-b1efe99f69 > section:nth-child(1)",
          "#container-b1efe99f69 > section:nth-child(3)",
          "#container-b1efe99f69 > section.column-control.spruce-eggshell-theme.two-column-control"
        ],
        "https://www.hrblock.com/dsar/": [
          "#container-4d3bf8ff89 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/espanol/": [
          "#container-255e702f13 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-80.two-column-control",
          "#container-255e702f13 > section:nth-child(2)",
          "#container-255e702f13 > section:nth-child(3)",
          "#container-255e702f13 > section:nth-child(4)",
          "#container-255e702f13 > section.column-control.green-dark-theme.two-column-control",
          "#container-255e702f13 > section:nth-child(11)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
          "#container-f5223be189 > section.column-control.white-theme.padding-top-100.padding-bottom-120.two-column-control",
          "#container-f5223be189 > section.column-control.green-dark-theme.padding-top-100.padding-bottom-100.two-column-control",
          "#container-f5223be189 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
          "#container-4629a22216 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control",
          "#container-4629a22216 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
          "#container-19212fc5ed > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control",
          "#container-19212fc5ed > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-19212fc5ed > section:nth-child(3)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
          "#container-c566082ee0 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
          "#container-4f037312fd > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/filing-options-and-products/": [
          "#container-c74219acd4 > section.column-control.spruce-eggshell-theme.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
          "#container-fac90de070 > section.column-control.white-theme.padding-top-40.padding-bottom-80.two-column-control",
          "#container-fac90de070 > section:nth-child(2)",
          "#container-fac90de070 > section:nth-child(3)",
          "#container-fac90de070 > section:nth-child(5)",
          "#container-fac90de070 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/no-surprise-guarantee/": [
          "#container-e3d43503e3 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/partners/tax-import-partners/": [
          "#container-8c5dbff294 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
          "#container-8c5dbff294 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/": [
          "#container-81ca87821d > section.column-control.green-dark-theme.padding-top-20.two-column-control",
          "#container-81ca87821d > section.column-control.spruce-forest-theme.padding-top-60.padding-bottom-60.two-column-control",
          "#container-81ca87821d > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control",
          "#container-81ca87821d > div:nth-child(11)"
        ],
        "https://www.hrblock.com/tax-offices/drop-off/": [
          "#container-34b249c794 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
          "#container-34b249c794 > section:nth-child(7)",
          "#container-34b249c794 > div:nth-child(21)",
          "#container-34b249c794 > div:nth-child(24)"
        ],
        "https://www.hrblock.com/tax-offices/international/": [
          "#container-28a219ff3d > section:nth-child(2)",
          "#container-28a219ff3d > section:nth-child(5)",
          "#container-28a219ff3d > section:nth-child(6)",
          "#container-28a219ff3d > section:nth-child(7)",
          "#container-28a219ff3d > section.column-control.spruce-forest-theme.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
          "#container-f1d4178a07 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
          "#container-f1d4178a07 > section:nth-child(7)",
          "#container-f1d4178a07 > div:nth-child(21)",
          "#container-f1d4178a07 > div:nth-child(24)"
        ],
        "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
          "#container-1da07e30fe > section.column-control.white-theme.padding-bottom-40",
          "#container-1da07e30fe > section:nth-child(5)",
          "#container-1da07e30fe > section:nth-child(6)"
        ],
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
          "#container-7228de0508 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
          "#container-7228de0508 > div:nth-child(19)"
        ],
        "https://www.hrblock.com/taxes-site-index/": [
          "#container-2b6c099062 > section.column-control.white-theme.padding-top-40.padding-bottom-40",
          "#container-2b6c099062 > section:nth-child(3)",
          "#container-2b6c099062 > section.column-control.white-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
          "#container-09f0436c75 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "office-details",
      "name": "Office details and map (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(.opp-city-state)"
      ],
      "style": "eggshell",
      "blocks": [
        "office-locator"
      ],
      "defaultContent": []
    },
    {
      "id": "office-services",
      "name": "Office services intro (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(.opp-service-icon):not(.two-column-control)"
      ],
      "style": "eggshell",
      "blocks": [],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(.opp-service-icon):not(.two-column-control)"
      ]
    },
    {
      "id": "band-green",
      "name": "Feature band (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.green-dark-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.green-dark-theme",
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme",
        "main div.cmp-container > div.xf-content-height section.green-dark-theme:not(li section)"
      ],
      "style": "green",
      "blocks": [
        "columns-banner",
        "cards-icon",
        "cards-product",
        "promo-strip",
        "cards-pricing",
        "tabs-pill"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)",
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
      ]
    },
    {
      "id": "band-eggshell",
      "name": "Feature band (eggshell)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-eggshell-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.spruce-eggshell-theme",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme",
        "main div.cmp-container > div.xf-content-height section.spruce-eggshell-theme:not(li section)"
      ],
      "style": "eggshell",
      "blocks": [
        "columns-banner",
        "accordion-faq",
        "cards-icon",
        "cards-feature",
        "cards-product",
        "accordion-media",
        "table-data",
        "columns-promo-card"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
      ]
    },
    {
      "id": "band-forest",
      "name": "Feature band (forest)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.spruce-forest-theme",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme",
        "main div.cmp-container > div.xf-content-height section.spruce-forest-theme:not(li section)"
      ],
      "style": "forest",
      "blocks": [
        "columns-banner",
        "cards-icon",
        "promo-strip",
        "columns-promo-card"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme:not(:has(.icon-svg)):has(.alignBanner)",
        "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
      ]
    },
    {
      "id": "band-white",
      "name": "Feature band (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.white-theme",
        "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.white-theme",
        "main div.cmp-container > div.xf-content-height section.column-control.white-theme",
        "main div.cmp-container > div.xf-content-height section.white-theme:not(li section)",
        "main > div.root > div.cmp-container > div.cmp-container > section.content-two-column"
      ],
      "style": null,
      "blocks": [
        "columns-banner",
        "cards-feature",
        "columns-callout",
        "columns-promo-card",
        "contact-form",
        "accordion-faq",
        "columns-stats",
        "cards-office-services"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)",
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .alignBanner)",
        "main div.cmp-container > div.xf-content-height section.column-control.white-theme:not(.two-column-control):has(> div.container > ul > li.col-1)"
      ]
    },
    {
      "id": "neon-strip",
      "name": "Neon strip",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.hrb-neon-green",
        "main div.cmp-container > div.xf-content-height section.spruce-neon-theme"
      ],
      "style": "neon",
      "blocks": [
        "promo-strip"
      ],
      "defaultContent": []
    },
    {
      "id": "image-banner",
      "name": "Full-bleed image banner",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper",
        "main div.cmp-container > div.xf-content-height div.fb-image-wrapper"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper"
      ]
    },
    {
      "id": "unthemed-band",
      "name": "Unthemed band",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*=\"-theme\"])",
        "main > div.root > div.cmp-container > div.cmp-container > section.content-two-column"
      ],
      "style": null,
      "blocks": [
        "columns-banner",
        "cards-office-services",
        "columns-callout",
        "search-articles"
      ],
      "defaultContent": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*=\"-theme\"]):not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
      ]
    },
    {
      "id": "comparison-table",
      "name": "Compare filing options table",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > div.showcontents"
      ],
      "style": "eggshell",
      "blocks": [
        "table-data"
      ],
      "defaultContent": []
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
        "main > div.root > div.cmp-container > div.cmp-container > section.faq",
        "main > div.root > div.cmp-container > div.cmp-container > section.accordian-section"
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
    "https://www.hrblock.com/corporate/tax-franchise/": [
      "#truste_0\\.11447772096219566",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1892162435",
      "#container-e041895b13 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_722764778",
      "#container-e7cad15789 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1137733242",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_761910111",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_101459884",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/dsar/": [
      "#truste_0\\.16807459537259184",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1968956440",
      "#container-021394c622 > div:nth-child(2) > h2:nth-child(1)",
      "#container-abc7993860 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-b42b70036f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-b42b70036f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-6f466b147d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6f466b147d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/espanol/": [
      "#truste_0\\.9679459594053192",
      "#ciam-login-app",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_235456542",
      "#container-255e702f13 > section:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_870408919",
      "#container-255e702f13 > section:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1568443060",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1236996842",
      "#container-8c8e1f2eb5 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_123283518",
      "h2.modal-headline.text-jumbo",
      "#overlay-suggestions-list",
      "#overlay_search",
      "#site-search"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
      "#truste_0\\.3684408819263383",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "#container-e45a20b5f9 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1251310187",
      "#container-2534c1b064 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1808454855",
      "#container-1f85f8364a > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
      "#truste_0\\.8713795239967789",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "#container-e1ba513eb0 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_636457350",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1937543435",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
      "#truste_0\\.2292279896486471",
      "div.modal-inner",
      "h1.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "#container-9394116621 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1775143597",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_183933931",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
      "#truste_0\\.18316116090550794",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1769518118",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
      "#truste_0\\.25856760248111044",
      "div.modal-inner",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_90436523",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/filing-options-and-products/": [
      "#truste_0\\.5743650548007467",
      "#spike-popup",
      "#ciam-login-app",
      "#container-6165129635 > div:nth-child(1)",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-ai",
      "#modal-free",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "#container-c483791890 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "section.spruce-forest-theme.rounded-border > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "#container-a955f82ecd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-a955f82ecd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e4694a949d > div:nth-child(2) > h2:nth-child(1)",
      "#container-2e01663b08 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-2e01663b08 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "a.btn.modal-tool-open",
      "#container-ca24e36d6e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ca24e36d6e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ff38317d78 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-4c2599a971 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-4c2599a971 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-180caac25f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-180caac25f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
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
    ],
    "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
      "#truste_0\\.9239006762547822",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1799071666",
      "#container-22ce937538 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_31567332",
      "#container-9fca0746e6 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2089912705",
      "#container-cc14bcc094 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1020678044",
      "#container-28fb7276f5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-28fb7276f5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e5a4332923 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e5a4332923 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-da98c22b04 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d974e045c0 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1181534750",
      "span.product-modal-price",
      "a.modal-tool-open.track-873490822",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1175088645",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-674505f1c6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-674505f1c6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-1eff1a9e13 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-1eff1a9e13 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.6791094666449929",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.underline-green",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.17508345250158053",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.7937387153541147",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.4415711322071071",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.281345941189196",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.7770204107814388",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.46193196575719786",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.890938067643223",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.7675598031776313",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.04150688701504135",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.9164149828116367",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.4141358591025319",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.9228467682948577",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.underline-green",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.9298142122905548",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.underline-green",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.650627363548136",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.underline-green",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.07193024992659602",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.12044027720155026",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.7516693404633024",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.3378076490862626",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.8939742604987971",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.024958304069846005",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.7689548804171245",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.9800709689522898",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
      "div.gm-style > div:nth-child(3)",
      "#truste_0\\.8560193327487419",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.btn.modal-tool-open",
      "a.modal-tool-open.see-all-pro",
      "h2.modal-headline.text-large",
      "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1833472204",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1466662845",
      "div.modal-body.body_max_width_mid_1747012734",
      "div.modal-body.body_max_width_mid_4644244",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/no-surprise-guarantee/": [
      "#truste_0\\.14096448139192752",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_2085018204",
      "#container-e1026213b1 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-bac9ee9a82 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1181534750",
      "span.product-modal-price",
      "a.modal-tool-open.track-873490822",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-8738e85e2e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8738e85e2e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-7f2158b93a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7f2158b93a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/partners/tax-import-partners/": [
      "body.brandnav-included > div:nth-child(40)",
      "#truste_0\\.45584860834290886",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1056208871",
      "#container-1b96819eaf > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_458483506",
      "#container-4d0fb32331 > div:nth-child(2) > h2:nth-child(1)",
      "#container-fdc7a7d750 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1529502090",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1540260839",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-appointment-preparation/": [
      "#truste_0\\.7257744253224625",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.color-eggshell",
      "div.sm-modal-img-hide",
      "h1.modal-headline.text-jumbo",
      "#taxProModal",
      "#container-8ff816eaf5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
      "#container-8ff816eaf5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-81a7184daf > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
      "#container-81a7184daf > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-81a7184daf > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)",
      "#container-fd7864ab07 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
      "#container-fd7864ab07 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-e813ef4d64 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-e813ef4d64 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-9feb2b1138 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "#container-9feb2b1138 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/business-services/": [
      "#truste_0\\.7261777918727573",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-ai",
      "#modal-rf-software-state-fees-modal-all",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_86293899",
      "#container-53dcc442c4 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-d64255ce7d > div:nth-child(5) > a:nth-child(1)",
      "#container-bc7e999f24 > div:nth-child(2) > h3:nth-child(2)",
      "#container-7189286ba6 > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "#container-5eafe3eb49 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "h3.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_200149108",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1866120263",
      "#container-9be067977c > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-9be067977c > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-9be067977c > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h3.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "#container-86c4fba7da > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "p.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_648620054",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/drop-off/": [
      "#truste_0\\.39889667650502303",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-34b249c794 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1572246562",
      "#container-f1bb45577b > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-e1ae132f91 > div:nth-child(2) > h2:nth-child(1)",
      "#container-9585fafa35 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-9585fafa35 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-5092d308f4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5092d308f4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ce7e9719f0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ce7e9719f0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-813685cc4b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-b85c9746c9 > section:nth-child(4) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
      "section.green-dark-theme > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
      "#container-6ff43a79a2 > div:nth-child(2) > h2:nth-child(1)",
      "#container-d2f1cf316e > div:nth-child(2) > h2:nth-child(1)",
      "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(3) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "th.highlighted.hrb-neon-green > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "#container-7b5c568caa > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-527868d79d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-527868d79d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-12a62c402f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-12a62c402f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-2e68424fe3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1090251584",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/international/": [
      "#truste_0\\.8270468543771324",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-england",
      "#modal-panama",
      "#modal-india",
      "#modal-guam",
      "#modal-japan",
      "#modal-italy",
      "#modal-canada",
      "#modal-australia",
      "#modal-southkorea",
      "#modal-germany",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1086551594",
      "div.modal-body.body_max_width_mid_2014784338",
      "#container-28a219ff3d > section:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1602192793",
      "#container-28a219ff3d > section:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1290645347",
      "#container-28a219ff3d > section:nth-child(7) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1116070452",
      "h2.modal-headline.text-jumbo",
      "#container-32c03a08c9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-6a4ae39101 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1774488032",
      "#container-6a4ae39101 > div:nth-child(4) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1338532142",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_447539872",
      "#container-ce51c0b54e > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-40d34fe086 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-40d34fe086 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-456645d116 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-456645d116 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
      "#truste_0\\.0959320357370993",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-f1d4178a07 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_2037748216",
      "#container-4f84cb50b1 > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-972dd921bc > div:nth-child(2) > h2:nth-child(1)",
      "#container-0a0bee9bf8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-0a0bee9bf8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-5354eea918 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5354eea918 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a061c3252a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-a061c3252a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-e8755fa57c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a810008cc9 > section:nth-child(4) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
      "section.green-dark-theme > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
      "#container-bd5382683b > div:nth-child(2) > h2:nth-child(1)",
      "#container-2b781fbe56 > section:nth-child(1) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-3afa125bc6 > div:nth-child(2) > h2:nth-child(1)",
      "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "th.highlighted.hrb-neon-green > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(4) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "#container-2fdf7429ad > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-f3a120f677 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-f3a120f677 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-10aebd2dc6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-10aebd2dc6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-ae16b8c39e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1090251584",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
      "#truste_0\\.19921169439284658",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1757569297",
      "#container-7a5e6b19af > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7a5e6b19af > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d47ca1c269 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d47ca1c269 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e3bbedaf09 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e3bbedaf09 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-f507989420 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_1620268425",
      "#container-f80e5cf9a7 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_209278693",
      "#container-69b1d52d92 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_112496514",
      "#container-2933bc082e > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-5db1da0f11 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5db1da0f11 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-13d680e011 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-13d680e011 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1383939846",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
      "#truste_0\\.5921516133231499",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-7228de0508 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_2126688429",
      "#container-10a83bc85e > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-9713acc426 > div:nth-child(2) > h2:nth-child(1)",
      "div.left-30.removeLastPadding > div:nth-child(1) > a:nth-child(1)",
      "#container-c5f51262d4 > div:nth-child(2) > h2:nth-child(1)",
      "#container-663db712e2 > div:nth-child(2) > h2:nth-child(1)",
      "th.highlighted.hrb-neon-green > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(3) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "#container-1d88698633 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-822200794e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-822200794e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-35a0df9df5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-35a0df9df5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-69afc882ff > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1090251584",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes-site-index/": [
      "#truste_0\\.20074618391842403",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1700781416",
      "#container-260e906ad3 > div:nth-child(2) > h2:nth-child(1)",
      "#container-5a492f7bb1 > div:nth-child(2) > h2:nth-child(1)",
      "#container-9bdb698670 > div:nth-child(2) > h2:nth-child(1)",
      "#container-3d3d7fb37f > div:nth-child(2) > h2:nth-child(1)",
      "#container-20f652c423 > div:nth-child(2) > h2:nth-child(1)",
      "#container-ca5cba4460 > div:nth-child(2) > h2:nth-child(1)",
      "#container-af5bf044c1 > div:nth-child(2) > h2:nth-child(1)",
      "#container-8be4974a85 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-small",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
      "#truste_0\\.3824566767068578",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1694900293",
      "h2.modal-headline.text-jumbo",
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
  'office-locator': officeLocatorParser,
  'cards-office-services': cardsOfficeServicesParser,
  'columns-stats': columnsStatsParser,
  'contact-form': contactFormParser,
  'search-articles': searchArticlesParser,
  'table-data': tableDataParser,
  'cards-pricing': cardsPricingParser,
  'accordion-media': accordionMediaParser,
  'columns-callout': columnsCalloutParser,
  'cards-product': cardsProductParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'accordion-faq': accordionFaqParser,
  'tabs-pill': tabsPillParser,
  'office-locator': officeLocatorParser,
  'cards-office-services': cardsOfficeServicesParser,
  'columns-stats': columnsStatsParser,
  'contact-form': contactFormParser,
  'search-articles': searchArticlesParser,
  'table-data': tableDataParser,
  'cards-pricing': cardsPricingParser,
  'accordion-media': accordionMediaParser,
  'columns-callout': columnsCalloutParser,
  'cards-product': cardsProductParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'columns-banner': columnsBannerParser,
  'hero-split': heroSplitParser,
  'carousel-testimonial': carouselTestimonialParser,
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
