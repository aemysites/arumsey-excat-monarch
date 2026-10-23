/* eslint-disable */
/* global WebImporter */

import articleBodyParser from './parsers/article-body.js';
import breadcrumbParser from './parsers/breadcrumb.js';
import columnsBannerParser from './parsers/columns-banner.js';
import articleFeedbackParser from './parsers/article-feedback.js';
import tableDataParser from './parsers/table-data.js';
import cardsArticleParser from './parsers/cards-article.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import brandBarParser from './parsers/brand-bar.js';
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
  "name": "resource-guide-article",
  "urls": [
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/"
  ],
  "description": "Expat resource-center long country guide article (WordPress expat-2022 theme) with a left meta sidebar (read time, date, author, reviewer, share links), breadcrumb, title, Key Takeaways, featured image, long body copy with lists, tables, images and ways-to-file link pairs, article helpful vote, recommended articles, testimonials and tax help CTA, using the expat sub-site header",
  "blocks": [
    {
      "name": "article-body",
      "instances": [
        "#site-content > section.container.ba-article"
      ]
    },
    {
      "name": "breadcrumb",
      "instances": [
        "#site-content > section.container.ba-article div.ba--breadcrumbs"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "#site-content > section.container.ba-article div.wp-block-create-block-hrb-expat-ways-to-file",
        "#site-content > section.ba-cta"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(9)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(32)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(62)",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ]
      }
    },
    {
      "name": "article-feedback",
      "instances": [
        "#site-content > section.container.ba-article div.article-helpful-vote"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "#site-content > section.container.ba-article div.col-8 > figure.wp-block-table"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(36)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(38)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(29)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(31)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(36)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(39)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure.wp-block-table"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(29)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(31)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure.wp-block-table"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ]
      }
    },
    {
      "name": "cards-article",
      "instances": [
        "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ]
      }
    },
    {
      "name": "carousel-testimonial",
      "instances": [
        "#site-content > section.full-width.gray-background"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
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
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
          "body > header > div.family-brands-nav.show-fbn"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "expat-article",
      "name": "Article",
      "selector": [
        "#site-content > section.container.ba-article"
      ],
      "style": null,
      "blocks": [
        "breadcrumb",
        "article-body",
        "columns-banner",
        "article-feedback",
        "table-data"
      ],
      "defaultContent": []
    },
    {
      "id": "expat-recommended",
      "name": "Recommended articles",
      "selector": [
        "#site-content > section.container:has(a.ba-single--related-post)"
      ],
      "style": null,
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        "#site-content > section.container h4.recommended-heading"
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
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/": [
      "#universal-skip-to-content"
    ]
  }
};

const parsers = {
  'article-body': articleBodyParser,
  'breadcrumb': breadcrumbParser,
  'columns-banner': columnsBannerParser,
  'article-feedback': articleFeedbackParser,
  'table-data': tableDataParser,
  'cards-article': cardsArticleParser,
  'carousel-testimonial': carouselTestimonialParser,
  'brand-bar': brandBarParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'article-body': articleBodyParser,
  'breadcrumb': breadcrumbParser,
  'columns-banner': columnsBannerParser,
  'article-feedback': articleFeedbackParser,
  'table-data': tableDataParser,
  'cards-article': cardsArticleParser,
  'carousel-testimonial': carouselTestimonialParser,
  'brand-bar': brandBarParser,
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
