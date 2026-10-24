/* eslint-disable */
/* global WebImporter */

import accordionFaqParser from './parsers/accordion-faq.js';
import tabsPillParser from './parsers/tabs-pill.js';
import productReviewsParser from './parsers/product-reviews.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import breadcrumbParser from './parsers/breadcrumb.js';
import brandBarParser from './parsers/brand-bar.js';
import resultsToolbarParser from './parsers/results-toolbar.js';
import searchArticlesParser from './parsers/search-articles.js';
import heroResourceParser from './parsers/hero-resource.js';
import reviewFilterParser from './parsers/review-filter.js';
import priceEstimatorParser from './parsers/price-estimator.js';
import newsletterSignupParser from './parsers/newsletter-signup.js';
import embedFormParser from './parsers/embed-form.js';
import articleBodyParser from './parsers/article-body.js';
import softwareFinderParser from './parsers/software-finder.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import tableDataParser from './parsers/table-data.js';
import heroBannerParser from './parsers/hero-banner.js';
import lottieAnimationParser from './parsers/lottie-animation.js';
import accordionMediaParser from './parsers/accordion-media.js';
import landingStackParser from './parsers/landing-stack.js';
import cardsTipParser from './parsers/cards-tip.js';
import columnsCalloutParser from './parsers/columns-callout.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsPromoCardParser from './parsers/columns-promo-card.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import promoStripParser from './parsers/promo-strip.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import heroSplitParser from './parsers/hero-split.js';
import softwareDownloadParser from './parsers/software-download.js';
import columnsBannerParser from './parsers/columns-banner.js';
import columnsStatsParser from './parsers/columns-stats.js';
import hrblockCleanupTransformer from './transformers/hrblock-cleanup.js';
import hrblockFragmentsTransformer from './transformers/hrblock-fragments.js';
import hrblockDmImagesTransformer from './transformers/hrblock-dm-images.js';
import hrblockSectionsTransformer from './transformers/hrblock-sections.js';

const PAGE_TEMPLATE = {
  "name": "product-split-hero",
  "urls": [
    "https://www.hrblock.com/amending-your-tax-return/",
    "https://www.hrblock.com/corporate/income-tax-course/",
    "https://www.hrblock.com/easignup/",
    "https://www.hrblock.com/expat-tax-preparation/",
    "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/",
    "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/all-topics/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/",
    "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/",
    "https://www.hrblock.com/financial-services/emerald-advance-loan/",
    "https://www.hrblock.com/financial-services/emerald-card-login/",
    "https://www.hrblock.com/financial-services/emerald-card-services/",
    "https://www.hrblock.com/financial-services/tax-refund-payment/",
    "https://www.hrblock.com/lp/creator-taxes/",
    "https://www.hrblock.com/myblock-benefits/",
    "https://www.hrblock.com/offers/gig-worker-side-business-taxes/",
    "https://www.hrblock.com/offers/saf/",
    "https://www.hrblock.com/offers/turbotax-price-comparison/",
    "https://www.hrblock.com/online-assist/",
    "https://www.hrblock.com/online-tax-filing/",
    "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/",
    "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/",
    "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/",
    "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/",
    "https://www.hrblock.com/online-tax-filing/tax-pro-review/",
    "https://www.hrblock.com/reviews/",
    "https://www.hrblock.com/reviews/basic-tax-software-reviews/",
    "https://www.hrblock.com/reviews/deluxe-online-tax-filing-reviews/",
    "https://www.hrblock.com/reviews/deluxe-tax-software-reviews/",
    "https://www.hrblock.com/reviews/free-online-tax-filing-reviews/",
    "https://www.hrblock.com/reviews/online-filing-reviews/",
    "https://www.hrblock.com/reviews/premium-online-tax-filing-reviews/",
    "https://www.hrblock.com/reviews/premium-small-business-tax-software-reviews/",
    "https://www.hrblock.com/reviews/premium-tax-software-reviews/",
    "https://www.hrblock.com/reviews/software-filing-reviews/",
    "https://www.hrblock.com/tax-extension/",
    "https://www.hrblock.com/tax-offices/",
    "https://www.hrblock.com/tax-offices/business-services/c-corp-taxes/",
    "https://www.hrblock.com/tax-offices/business-services/partnership-taxes/",
    "https://www.hrblock.com/tax-offices/business-services/self-employed-taxes/",
    "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/",
    "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/",
    "https://www.hrblock.com/tax-offices/business-services/small-business-tax/s-corp-taxes/",
    "https://www.hrblock.com/tax-offices/extended-tax-services/past-taxes/",
    "https://www.hrblock.com/tax-offices/manage-appointment/",
    "https://www.hrblock.com/tax-offices/product-services/tax-identity-shield/",
    "https://www.hrblock.com/tax-offices/tax-prep/w-2-early-access/",
    "https://www.hrblock.com/tax-payment-center/",
    "https://www.hrblock.com/tax-reform-and-law-changes/",
    "https://www.hrblock.com/tax-software/",
    "https://www.hrblock.com/tax-software/basic-tax-software/",
    "https://www.hrblock.com/tax-software/deluxe-tax-software/",
    "https://www.hrblock.com/tax-software/deluxe-without-state/",
    "https://www.hrblock.com/tax-software/premium-small-business-tax-software/",
    "https://www.hrblock.com/tax-software/premium-tax-software/",
    "https://www.hrblock.com/tax-software/state-editions/",
    "https://www.hrblock.com/tax-software/updates-back-editions/",
    "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/",
    "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/",
    "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/",
    "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/",
    "https://www.hrblock.com/tax-software/updates-back-editions/federal-mac/",
    "https://www.hrblock.com/tax-software/updates-back-editions/federal-windows/",
    "https://www.hrblock.com/tax-software/updates-back-editions/prior-year/",
    "https://www.hrblock.com/tax-software/updates-back-editions/state-mac/",
    "https://www.hrblock.com/tax-software/updates-back-editions/state-windows/",
    "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
    "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/17windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/17windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/",
    "https://www.hrblock.com/taxes/products/software/updates/18mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/18windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/",
    "https://www.hrblock.com/taxes/products/software/updates/19mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/19windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/",
    "https://www.hrblock.com/taxes/products/software/updates/20mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/20macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/20windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/20windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/21mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/21macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/21windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/21windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/22mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/22macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/22windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/22windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/23mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/23macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/23windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/23windows-state/",
    "https://www.hrblock.com/taxes/products/software/updates/24mac-state/",
    "https://www.hrblock.com/taxes/products/software/updates/24macintosh-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/24windows-federal/",
    "https://www.hrblock.com/taxes/products/software/updates/24windows-state/"
  ],
  "description": "Product/service page opening with a side-by-side hero (text beside image), followed by accordion, feature and FAQ sections",
  "blocks": [
    {
      "name": "accordion-faq",
      "instances": [
        "main div.cmp-container > section.faq"
      ],
      "pageInstances": {
        "https://www.hrblock.com/amending-your-tax-return/": [
          "#container-e7335a08eb > section.faq.white-theme"
        ],
        "https://www.hrblock.com/corporate/income-tax-course/": [
          "#container-096c529025 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/easignup/": [
          "#container-5a359b941f > section:nth-child(14)",
          "#container-5a359b941f > section:nth-child(16)",
          "#container-5a359b941f > section:nth-child(18)",
          "#container-5a359b941f > section:nth-child(20)"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/": [
          "#container-6ed98747c7 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan/": [
          "#container-5a359b941f > section:nth-child(14)",
          "#container-5a359b941f > section:nth-child(16)",
          "#container-5a359b941f > section:nth-child(18)",
          "#container-5a359b941f > section:nth-child(20)"
        ],
        "https://www.hrblock.com/financial-services/emerald-card-services/": [
          "#container-e85b1470d9 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/financial-services/tax-refund-payment/": [
          "#container-09ef37399b > section.faq.spruce-eggshell-theme"
        ],
        "https://www.hrblock.com/myblock-benefits/": [
          "#container-3d6b34a383 > section.faq"
        ],
        "https://www.hrblock.com/offers/saf/": [
          "#container-5b3cccfaf0 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
          "#container-f3913af060 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-extension/": [
          "#container-a975ba0354 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-offices/": [
          "#container-4bc6fad564 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-971cbd754f > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
          "#container-adef7469f1 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-offices/extended-tax-services/past-taxes/": [
          "#container-5f4a923d82 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-offices/product-services/tax-identity-shield/": [
          "#container-5856a19837 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-payment-center/": [
          "#container-77a8166999 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#container-5dc21ea7b0 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/basic-tax-software/": [
          "#container-0183d81774 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
          "#container-7c3463266f > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/deluxe-without-state/": [
          "#container-6a44599bfa > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
          "#container-23a1fc841d > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/premium-tax-software/": [
          "#container-0f860f40c5 > section.faq.white-theme"
        ],
        "https://www.hrblock.com/tax-software/state-editions/": [
          "#container-6d4ad41ada > section.faq.white-theme"
        ]
      }
    },
    {
      "name": "tabs-pill",
      "instances": [
        "main div.cmp-container > div.reframe-tabs"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/": [
          "#container-458b5749c8 > div.reframe-tabs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/": [
          "#container-0334f98988 > div.reframe-tabs"
        ],
        "https://www.hrblock.com/myblock-benefits/": [
          "#container-3d6b34a383 > div"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > div.reframe-tabs"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > div.reframe-tabs"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > div.reframe-tabs"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > div.reframe-tabs"
        ],
        "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
          "#container-f3913af060 > div.reframe-tabs"
        ],
        "https://www.hrblock.com/tax-offices/business-services/c-corp-taxes/": [
          "#container-40cb70ec4f > div"
        ],
        "https://www.hrblock.com/tax-offices/business-services/partnership-taxes/": [
          "#container-d3bbb3dac1 > div"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-tax/s-corp-taxes/": [
          "#container-2ab7203784 > div"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-e2ebc4c413 > div"
        ]
      }
    },
    {
      "name": "product-reviews",
      "instances": [
        "main div.cmp-container > section.hrbcom-reviews"
      ],
      "pageInstances": {
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#hrbcom-reviewlist-mid_1212407601"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#hrbcom-reviewlist-mid_732668660"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#hrbcom-reviewlist-mid_732668660"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#hrbcom-reviewlist-mid_2098531322"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#hrbcom-reviewlist-mid_1421199959"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#hrbcom-reviewlist-mid_444473526"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#hrbcom-reviewlist-mid_140288685"
        ],
        "https://www.hrblock.com/reviews/": [
          "#hrbcom-reviewlist-mid_1906047494"
        ],
        "https://www.hrblock.com/reviews/basic-tax-software-reviews/": [
          "#hrbcom-reviewlist-mid_1208302633"
        ],
        "https://www.hrblock.com/reviews/deluxe-online-tax-filing-reviews/": [
          "#hrbcom-reviewlist-mid_1243101788"
        ],
        "https://www.hrblock.com/reviews/deluxe-tax-software-reviews/": [
          "#hrbcom-reviewlist-mid_1481247208"
        ],
        "https://www.hrblock.com/reviews/free-online-tax-filing-reviews/": [
          "#hrbcom-reviewlist-mid_1575248369"
        ],
        "https://www.hrblock.com/reviews/online-filing-reviews/": [
          "#hrbcom-reviewlist-mid_1716689314"
        ],
        "https://www.hrblock.com/reviews/premium-online-tax-filing-reviews/": [
          "#hrbcom-reviewlist-mid_1102024488"
        ],
        "https://www.hrblock.com/reviews/premium-small-business-tax-software-reviews/": [
          "#hrbcom-reviewlist-mid_352785755"
        ],
        "https://www.hrblock.com/reviews/premium-tax-software-reviews/": [
          "#hrbcom-reviewlist-mid_264793372"
        ],
        "https://www.hrblock.com/reviews/software-filing-reviews/": [
          "#hrbcom-reviewlist-mid_214578442"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#hrbcom-reviewlist-mid_2066728732"
        ],
        "https://www.hrblock.com/tax-software/basic-tax-software/": [
          "#hrbcom-reviewlist-mid_1339210957"
        ],
        "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
          "#hrbcom-reviewlist-mid_1264228812"
        ],
        "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
          "#hrbcom-reviewlist-mid_221257873"
        ],
        "https://www.hrblock.com/tax-software/premium-tax-software/": [
          "#hrbcom-reviewlist-mid_2130813020"
        ]
      }
    },
    {
      "name": "carousel-testimonial",
      "instances": [
        "#site-content > section.full-width.gray-background"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/": [
          "#site-content > section.full-width.gray-background"
        ]
      }
    },
    {
      "name": "breadcrumb",
      "instances": [
        "#site-content div.breadcrumbs-container"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.breadcrumbs-container"
        ]
      }
    },
    {
      "name": "brand-bar",
      "instances": [
        "main div.family-brands-nav:has(.family-brand)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
          "body > header > div.family-brands-nav.show-fbn"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
          "body > header > div.family-brands-nav.show-fbn"
        ]
      }
    },
    {
      "name": "results-toolbar",
      "instances": [
        "#site-content div.search-result-metrics.ba--allposts-box"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/": [
          "#site-content > section.ba-search--page > div > div.search-result-metrics.ba--allposts-box"
        ]
      }
    },
    {
      "name": "search-articles",
      "instances": [
        "#site-content div.ba-search-box--controls",
        "#site-content > section.expat-hp-search"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/": [
          "#site-content > section.expat-hp-search.expat-bg--grey"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/": [
          "#site-content > section.ba-search--page > div > div.ba-search-box--controls.modify--for-topic"
        ]
      }
    },
    {
      "name": "hero-resource",
      "instances": [
        "#site-content > section.expat-homepage-hero",
        "#site-content > section.ba--catall--header",
        "#site-content > section.ba--catsingle--header",
        "#site-content div.tax-help-intro-row"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/": [
          "#site-content > section.expat-homepage-hero.expat-bg--grey"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/all-topics/": [
          "#site-content > section.ba--catall--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/": [
          "#site-content > section.country-guide-hero.expat-bg--grey > div > div.tax-help-intro-row"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/": [
          "#site-content > section.ba--catsingle--header"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/": [
          "#site-content > section.ba--catsingle--header"
        ]
      }
    },
    {
      "name": "review-filter",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(.dropdown-container-one)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/reviews/": [
          "#container-d76e475a04 > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/basic-tax-software-reviews/": [
          "#container-e8ac0db58e > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/deluxe-online-tax-filing-reviews/": [
          "#container-6a4169bc40 > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/deluxe-tax-software-reviews/": [
          "#container-fb6a562fc5 > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/free-online-tax-filing-reviews/": [
          "#container-e065c7613e > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/online-filing-reviews/": [
          "#container-1a46e70555 > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/premium-online-tax-filing-reviews/": [
          "#container-6feec6ed8a > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/premium-small-business-tax-software-reviews/": [
          "#container-a9a561172e > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/premium-tax-software-reviews/": [
          "#container-908a641099 > div.xf-content-height"
        ],
        "https://www.hrblock.com/reviews/software-filing-reviews/": [
          "#container-cf06b8eb4d > div.xf-content-height"
        ]
      }
    },
    {
      "name": "price-estimator",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(.pricing-tool-section)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/": [
          "#container-4bc6fad564 > div:nth-child(6)"
        ]
      }
    },
    {
      "name": "newsletter-signup",
      "instances": [
        "main div.cmp-container > section.column-control:has(.reimagine-form-container)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-003a037d23 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
          "#container-1464d8a406 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ]
      }
    },
    {
      "name": "embed-form",
      "instances": [
        "main div.cmp-container > section.column-control:has(.mbsy-integration)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/offers/saf/": [
          "#container-5b3cccfaf0 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-40"
        ]
      }
    },
    {
      "name": "article-body",
      "instances": [
        "main article section.article-body div.c1"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/tax-prep/w-2-early-access/": [
          "body > main > article > section > div > div.c1"
        ]
      }
    },
    {
      "name": "software-finder",
      "instances": [
        "main div.cmp-container > section:has(.assist-card-checkbox)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-software/": [
          "#container-5dc21ea7b0 > section:nth-child(4)"
        ]
      }
    },
    {
      "name": "cards-pricing",
      "instances": [
        "main div.cmp-container > section.column-control:has(.category-card_container-v2)",
        "main div.cmp-container > div.xf-content-height:has(.category-card_container-v2):not(:has(section.column-control))",
        "main section.column-control:not([style*=\"display: none\"]):has(> div.container > ul.category-card_container-v2 .card-v2)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/": [
          "#container-0f429b6acb > section.column-control.spruce-eggshell-theme.padding-top-20.two-column-control"
        ],
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-e8bf00d4c6 > div:nth-child(5)"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-971cbd754f > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-20"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
          "#container-adef7469f1 > section.column-control.spruce-eggshell-theme.padding-bottom-20"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#container-d1407dcc3b > section",
          "#container-a85f2645d0 > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/basic-tax-software/": [
          "#container-ba47bd00bb > section.column-control.green-dark-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
          "#container-ca1f8bfc92 > section.column-control.green-dark-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/deluxe-without-state/": [
          "#container-557fdfe710 > section.column-control.green-dark-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
          "#container-e02c07c98b > section.column-control.green-dark-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/premium-tax-software/": [
          "#container-1f3839a407 > section.column-control.green-dark-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
          "#container-814bc03364 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-80"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
          "#container-6b09d829bd > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-80"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
          "#container-fafb80b298 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-80"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
          "#container-eeac4ab9ae > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-80"
        ]
      }
    },
    {
      "name": "table-data",
      "instances": [
        "main div.cmp-container > section.pricing-card-table",
        "main div.cmp-container > section.container:has(.footer-inview)",
        "main div.showcontents section.container:has(table.shtablecomparison)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/": [
          "#container-6ed98747c7 > section.green-dark-theme.container.p-y-80.padding-top-20.padding-bottom-100"
        ],
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-e8bf00d4c6 > section.green-dark-theme.container.p-y-80.padding-top-20.padding-bottom-20"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > section.pricing-card-table.spruce-forest-theme.padding-top-40.padding-bottom-40"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > section.pricing-card-table.spruce-forest-theme.padding-top-40.padding-bottom-40"
        ]
      }
    },
    {
      "name": "hero-banner",
      "instances": [
        "main div.cmp-container > section.teaser",
        "main div.cmp-container > div.fb-image-wrapper:has(.rating-stars)",
        "main div.cmp-container > section.column-control:has(.herodefaultview)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-e8bf00d4c6 > div.fb-image-wrapper",
          "#container-e8bf00d4c6 > section:nth-child(12)"
        ],
        "https://www.hrblock.com/tax-payment-center/": [
          "#container-77a8166999 > section.teaser"
        ]
      }
    },
    {
      "name": "lottie-animation",
      "instances": [
        "main div.cmp-container > section.column-control:not(.two-column-control):has(li.col-1.hide-small .lottie-container)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section:nth-child(7)"
        ]
      }
    },
    {
      "name": "accordion-media",
      "instances": [
        "main div.cmp-container > section.two-column-control:has(.accordian-section):has(img)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/amending-your-tax-return/": [
          "#container-e7335a08eb > section.column-control.green-dark-theme.padding-top-100.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/easignup/": [
          "#container-214a9dabb9 > section.column-control.green-dark-theme.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/": [
          "#container-0f429b6acb > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan/": [
          "#container-214a9dabb9 > section.column-control.green-dark-theme.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-extension/": [
          "#container-a975ba0354 > section.column-control.green-dark-theme.padding-top-40.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control"
        ]
      }
    },
    {
      "name": "landing-stack",
      "instances": [
        "body.brandnav-included > main:has(ba-tax-prep-checklist):has(ba-help-me-choose)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/business-services/self-employed-taxes/": [
          "body > main"
        ]
      }
    },
    {
      "name": "cards-tip",
      "instances": [
        "main div.cmp-container > section.two-column-control:has(.stacked-body-title-only)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section.column-control.white-theme.two-column-control"
        ]
      }
    },
    {
      "name": "columns-callout",
      "instances": [
        "main div.cmp-container > section.two-column-control:has(.custom_li_rte):has(hr)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/tax-offices/extended-tax-services/past-taxes/": [
          "#container-5f4a923d82 > section.column-control.white-theme.padding-top-80.padding-bottom-100.two-column-control"
        ]
      }
    },
    {
      "name": "cards-product",
      "instances": [
        "main div.cmp-container > section.column-control:has(.imageOverflow)",
        "main div.cmp-container > section.column-control:has(.hrb-icon-link--check-white)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/": [
          "#container-e671af01cd > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/": [
          "#container-8af0c31fe7 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/": [
          "#container-6ed98747c7 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > section.column-control.spruce-eggshell-theme.padding-bottom-20"
        ],
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-e8bf00d4c6 > section:nth-child(16)"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section.column-control.green-dark-theme.padding-bottom-80"
        ]
      }
    },
    {
      "name": "cards-article",
      "instances": [
        "#site-content section.expat-hp-countries div.expat-hp-countries--grid",
        "main div.tic-article-recommended-articles > div.theposts",
        "main div.cmp-container > section.column-control:has(.stacked-eyebrow-row)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/": [
          "#site-content > section.expat-hp-countries.expat-bg--grey > div > div"
        ],
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section.column-control.white-theme.padding-top-100"
        ],
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-c7fe0e696c > section.column-control.white-theme.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
          "#container-f3913af060 > section.column-control.white-theme.padding-bottom-60"
        ],
        "https://www.hrblock.com/tax-offices/tax-prep/w-2-early-access/": [
          "#single_recommendations_box > div"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section:nth-child(17)"
        ]
      }
    },
    {
      "name": "columns-promo-card",
      "instances": [
        "main div.cmp-container > section.column-control:has(.card-jumbo)",
        "main div.cmp-container > section.column-control:has(.spruce-color--green-neon)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/easignup/": [
          "#container-69a88a9f0b > section.column-control.spruce-forest-theme.padding-top-100"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan/": [
          "#container-69a88a9f0b > section.column-control.spruce-forest-theme.padding-top-100"
        ],
        "https://www.hrblock.com/financial-services/emerald-card-services/": [
          "#container-e85b1470d9 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-120"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > section:nth-child(10)"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > section.column-control.spruce-eggshell-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > section.column-control.spruce-eggshell-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > section.column-control.spruce-eggshell-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > section.column-control.spruce-eggshell-theme.padding-bottom-120"
        ],
        "https://www.hrblock.com/tax-offices/": [
          "#container-4bc6fad564 > div:nth-child(10)"
        ]
      }
    },
    {
      "name": "cards-icon",
      "instances": [
        "main div.cmp-container > section.column-control:has(.card-secondary.featurecard)",
        "main div.cmp-container > section.column-control:has(li.col-3 .iconlist):not(.two-column-control)",
        "main div.cmp-container > section.column-control:has(.sm-card-img-hide)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/income-tax-course/": [
          "#container-096c529025 > section.column-control.spruce-eggshell-theme.padding-top-120.padding-bottom-120"
        ],
        "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/": [
          "#container-458b5749c8 > section.column-control.white-theme.padding-top-40.padding-bottom-20",
          "#container-458b5749c8 > section:nth-child(16)",
          "#container-458b5749c8 > section.column-control.white-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/": [
          "#container-0334f98988 > section.column-control.white-theme.padding-top-40.padding-bottom-20",
          "#container-0334f98988 > section:nth-child(18)",
          "#container-0334f98988 > section.column-control.white-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/financial-services/tax-refund-payment/": [
          "#container-e1510af4b4 > section:nth-child(2)",
          "#container-09ef37399b > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-120"
        ],
        "https://www.hrblock.com/myblock-benefits/": [
          "#container-3d6b34a383 > section.column-control.white-theme.padding-top-80.padding-bottom-20"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > section:nth-child(7)"
        ],
        "https://www.hrblock.com/offers/saf/": [
          "#container-5b3cccfaf0 > section:nth-child(11)"
        ],
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-e8bf00d4c6 > section:nth-child(7)",
          "#container-131724614d > section:nth-child(2)"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > section.column-control.white-theme.padding-top-100",
          "#container-cb8de0b0a9 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > section.column-control.white-theme.padding-top-100",
          "#container-cb8de0b0a9 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > section.column-control.white-theme.padding-top-60.padding-bottom-100"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > section.column-control.white-theme.padding-top-60.padding-bottom-100"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > section.column-control.white-theme.padding-top-60.padding-bottom-100"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > section.column-control.white-theme.padding-top-60.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-offices/": [
          "#container-219068d7bc > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-payment-center/": [
          "#container-77a8166999 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#container-5dc21ea7b0 > section.column-control.green-dark-theme.padding-bottom-80",
          "#container-5dc21ea7b0 > section.column-control.green-dark-theme.padding-top-80"
        ]
      }
    },
    {
      "name": "cards-feature",
      "instances": [
        "#site-content section.country-fast-facts div.fast-facts",
        "main div.cmp-container > section.column-control:has(.stacked-eyebrow-icon)",
        "main div.cmp-container > div.xf-content-height:has(.half-height)",
        "main div.cmp-container > section.column-control:has(li.col-3 article.card-stacked):not(:has(.iconlist))",
        "main div.cmp-container > section.column-control:has(li.col-4 article.card-stacked)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/": [
          "#site-content > section.country-fast-facts > div > div"
        ],
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section:nth-child(15)"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > div:nth-child(12)"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > div:nth-child(12)"
        ],
        "https://www.hrblock.com/tax-offices/": [
          "#container-4bc6fad564 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-offices/business-services/c-corp-taxes/": [
          "#container-c342e46d54 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/partnership-taxes/": [
          "#container-99aff14651 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-971cbd754f > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-40"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
          "#container-adef7469f1 > section.column-control.white-theme.padding-top-20.padding-bottom-40"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-tax/s-corp-taxes/": [
          "#container-de9ca87d45 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/manage-appointment/": [
          "#container-ef70e7427e > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/product-services/tax-identity-shield/": [
          "#container-5856a19837 > section.column-control.spruce-eggshell-theme.padding-top-40",
          "#container-5856a19837 > section.column-control.spruce-eggshell-theme.padding-bottom-40"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#container-cc917aa127 > section:nth-child(2)",
          "#container-e89c3b2217 > section:nth-child(2)",
          "#container-e89c3b2217 > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control",
          "#container-5dc21ea7b0 > div:nth-child(17)"
        ],
        "https://www.hrblock.com/tax-software/basic-tax-software/": [
          "#container-0e9e96993e > section:nth-child(2)",
          "#container-575934382b > section:nth-child(2)",
          "#container-575934382b > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control",
          "#container-0183d81774 > div:nth-child(9)"
        ],
        "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
          "#container-1abe367d84 > section:nth-child(2)",
          "#container-8850cc5378 > section:nth-child(2)",
          "#container-8850cc5378 > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control",
          "#container-7c3463266f > div:nth-child(15)"
        ],
        "https://www.hrblock.com/tax-software/deluxe-without-state/": [
          "#container-394f809683 > section:nth-child(2)",
          "#container-c0ed9e531d > section:nth-child(2)",
          "#container-c0ed9e531d > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control",
          "#container-6a44599bfa > div:nth-child(14)"
        ],
        "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
          "#container-70228ce7b0 > section:nth-child(2)",
          "#container-593f7c2fef > section:nth-child(2)",
          "#container-593f7c2fef > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control",
          "#container-23a1fc841d > div:nth-child(9)"
        ],
        "https://www.hrblock.com/tax-software/premium-tax-software/": [
          "#container-21de483afe > section:nth-child(2)",
          "#container-8c18e12907 > section:nth-child(2)",
          "#container-8c18e12907 > section.column-control.spruce-eggshell-theme.padding-bottom-100.two-column-control",
          "#container-0f860f40c5 > div:nth-child(9)"
        ],
        "https://www.hrblock.com/tax-software/state-editions/": [
          "#container-f481a87487 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
          "#container-3530faca90 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
          "#container-d34ad73b9e > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
          "#container-8a087c1a91 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
          "#container-1fda0fe969 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/prior-year/": [
          "#container-7bf0a20b85 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-federal/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/": [
          "#container-57d023c222 > section:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/": [
          "#container-57d023c222 > section:nth-child(2)"
        ]
      }
    },
    {
      "name": "promo-strip",
      "instances": [
        "main div.cmp-container > div.xf-content-height:has(.alignBanner)",
        "main div.cmp-container > section.spruce-forest-theme:has(> div.alignBanner)",
        "main div.cmp-container > section.column-control:has(> div.container > ul > li > div.cmp-container > section.rounded-border .alignBanner)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-100"
        ],
        "https://www.hrblock.com/offers/turbotax-price-comparison/": [
          "#container-e8bf00d4c6 > div:nth-child(8)"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > div:nth-child(7)"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > div:nth-child(7)"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > section.spruce-forest-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > div:nth-child(7)"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > section.spruce-forest-theme"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > div:nth-child(6)"
        ],
        "https://www.hrblock.com/tax-offices/": [
          "#container-4bc6fad564 > div:nth-child(7)"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section:nth-child(8)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
          "#container-814bc03364 > div:nth-child(4)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
          "#container-6b09d829bd > div:nth-child(4)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
          "#container-fafb80b298 > div:nth-child(4)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
          "#container-eeac4ab9ae > div:nth-child(4)"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/prior-year/": [
          "#container-cd5f8a909a > section.spruce-forest-theme"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-federal/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/": [
          "#container-670ec6f8c6 > div:nth-child(2)"
        ]
      }
    },
    {
      "name": "columns-feature",
      "instances": [
        "main div.cmp-container > section.two-column-control:has(.iconlist):has(.cq-dd-image):not(:first-of-type)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/offers/saf/": [
          "#container-5b3cccfaf0 > section.column-control.spruce-eggshell-theme.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > div:nth-child(6)"
        ],
        "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
          "#container-f3913af060 > section.column-control.white-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-971cbd754f > section.column-control.white-theme.padding-top-80.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/extended-tax-services/past-taxes/": [
          "#container-5f4a923d82 > section.column-control.white-theme.padding-top-60.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#container-5dc21ea7b0 > div:nth-child(14)"
        ],
        "https://www.hrblock.com/tax-software/basic-tax-software/": [
          "#container-0183d81774 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
          "#container-7c3463266f > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/deluxe-without-state/": [
          "#container-6a44599bfa > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
          "#container-23a1fc841d > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/premium-tax-software/": [
          "#container-0f860f40c5 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ]
      }
    },
    {
      "name": "hero-split",
      "instances": [
        "main > div.root > div.cmp-container > div.cmp-container > section.two-column-control:first-of-type:has(.eyebrow-label):has(.cq-dd-image)",
        "main div.product-details-container > figure.product-details-figure"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/income-tax-course/": [
          "#container-096c529025 > section:nth-child(1)"
        ],
        "https://www.hrblock.com/easignup/": [
          "#container-5a359b941f > section.column-control.spruce-eggshell-theme.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/": [
          "#container-0f429b6acb > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/": [
          "#container-458b5749c8 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/": [
          "#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/": [
          "#container-6ed98747c7 > section.column-control.spruce-forest-theme.padding-top-80.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan/": [
          "#container-5a359b941f > section.column-control.spruce-eggshell-theme.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-card-login/": [
          "#container-de97732295 > section.column-control.green-dark-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/tax-refund-payment/": [
          "#container-09ef37399b > section.column-control.green-dark-theme.two-column-control"
        ],
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section.column-control.spruce-forest-theme.two-column-control"
        ],
        "https://www.hrblock.com/myblock-benefits/": [
          "#container-3d6b34a383 > section.column-control.spruce-forest-theme.two-column-control"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/offers/saf/": [
          "#container-5b3cccfaf0 > section.column-control.white-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > section.column-control.white-theme.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > section.column-control.white-theme.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > section.column-control.white-theme.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > section.column-control.white-theme.two-column-control"
        ],
        "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
          "#container-f3913af060 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-extension/": [
          "#container-a975ba0354 > section.column-control.white-theme.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/c-corp-taxes/": [
          "#container-4518bf9c06 > section"
        ],
        "https://www.hrblock.com/tax-offices/business-services/partnership-taxes/": [
          "#container-305da01dce > section"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-971cbd754f > section.column-control.green-dark-theme.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
          "#container-adef7469f1 > section.column-control.green-dark-theme.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-tax/s-corp-taxes/": [
          "#container-46376042e2 > section"
        ],
        "https://www.hrblock.com/tax-offices/product-services/tax-identity-shield/": [
          "#container-5856a19837 > section.column-control.white-theme.padding-top-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section.column-control.spruce-forest-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/state-editions/": [
          "#container-6d4ad41ada > section.product-details-wrapper.p-b-80.no-stateform > div > figure"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
          "#container-814bc03364 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
          "#container-6b09d829bd > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
          "#container-fafb80b298 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
          "#container-eeac4ab9ae > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-federal/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/": [
          "#container-670ec6f8c6 > section"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/": [
          "#container-670ec6f8c6 > section"
        ]
      }
    },
    {
      "name": "software-download",
      "instances": [
        "main div.cmp-container > section.two-column-control:has(.standaloneform-dropdown):has(.cq-dd-image)",
        "main div.cmp-container > section.two-column-control:has(.button-pricing)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/amending-your-tax-return/": [
          "#container-e7335a08eb > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-card-services/": [
          "#container-e85b1470d9 > section.column-control.green-dark-theme.padding-top-40.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
          "#container-814bc03364 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
          "#container-6b09d829bd > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
          "#container-fafb80b298 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
          "#container-eeac4ab9ae > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/federal-mac/": [
          "#container-3bbb7769f1 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/federal-windows/": [
          "#container-8b72d90278 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/state-mac/": [
          "#container-62e44eb0aa > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/state-windows/": [
          "#container-7c8206b8d4 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20mac-state/": [
          "#container-62a74fc296 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20macintosh-federal/": [
          "#container-95ee986511 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20windows-federal/": [
          "#container-509bc34bf1 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20windows-state/": [
          "#container-61c18a55af > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/21mac-state/": [
          "#container-a9e9f7a2ca > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/21macintosh-federal/": [
          "#container-754775f969 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/21windows-federal/": [
          "#container-80ec1008f7 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/21windows-state/": [
          "#container-3a999bcadc > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/22mac-state/": [
          "#container-eec5ebd578 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/22macintosh-federal/": [
          "#container-f4cef2d4d9 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/22windows-federal/": [
          "#container-f49e8259cc > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/22windows-state/": [
          "#container-b0a872fffd > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/23mac-state/": [
          "#container-7b8daa2b37 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/23macintosh-federal/": [
          "#container-f29bfd99b9 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/23windows-federal/": [
          "#container-1b643a475c > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/23windows-state/": [
          "#container-59449d396f > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/24mac-state/": [
          "#container-c56bb7aaca > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/24macintosh-federal/": [
          "#container-dab93fbfd6 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/24windows-federal/": [
          "#container-ebca8ef71d > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/24windows-state/": [
          "#container-ca8e446add > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-40.two-column-control"
        ]
      }
    },
    {
      "name": "columns-banner",
      "instances": [
        "#site-content > section.ba-cta",
        "#site-content > section.green-due-date-section",
        "#site-content > section.ba--catall--listing",
        "#site-content section.steps-to-prep > div.stp-steps",
        "main div.tic-single-related-topics > div.tic-single-related-topics-row",
        "main.tic-single > section.tic-footer-cta-banner",
        "main div.cmp-container > div.xf-content-height:has(.justify-end)",
        "main section.column-control.spruce-forest-theme:not(.two-column-control):not(li.hide-large section):has(> div.container > ul.column-container > li.col-3 h3.modal-headline > p):not(:has(img, picture, a[href], button, article))"
      ],
      "pageInstances": {
        "https://www.hrblock.com/corporate/income-tax-course/": [
          "#container-096c529025 > section.column-control.white-theme.padding-top-20",
          "#container-096c529025 > section:nth-child(5)",
          "#container-096c529025 > section.column-control.white-theme.two-column-control",
          "#container-096c529025 > section.column-control.green-dark-theme.padding-top-100.padding-bottom-100.two-column-control",
          "#container-096c529025 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/easignup/": [
          "#container-e2a03eafcf > section:nth-child(2)",
          "#container-39f3ab7a35 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control",
          "#container-5a359b941f > div:nth-child(9)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/": [
          "#container-458b5749c8 > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-20"
        ],
        "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/": [
          "#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-40",
          "#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/all-topics/": [
          "#site-content > section.ba--catall--listing",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/": [
          "#site-content > section.green-due-date-section",
          "#site-content > section.steps-to-prep.container > div",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/": [
          "#container-13ba08bd76 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/emerald-advance-loan/": [
          "#container-e2a03eafcf > section:nth-child(2)",
          "#container-39f3ab7a35 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control",
          "#container-5a359b941f > div:nth-child(9)"
        ],
        "https://www.hrblock.com/financial-services/emerald-card-services/": [
          "#container-e85b1470d9 > section.column-control.white-theme.padding-top-20.padding-bottom-120",
          "#container-e85b1470d9 > section.column-control.white-theme.padding-top-20.padding-bottom-100.two-column-control",
          "#container-e85b1470d9 > section.column-control.spruce-eggshell-theme.padding-bottom-40.two-column-control"
        ],
        "https://www.hrblock.com/financial-services/tax-refund-payment/": [
          "#container-09ef37399b > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20",
          "#container-09ef37399b > section.column-control.white-theme.padding-top-60.padding-bottom-80.two-column-control",
          "#container-09ef37399b > section.column-control.spruce-eggshell-theme.two-column-control"
        ],
        "https://www.hrblock.com/lp/creator-taxes/": [
          "#container-d8006e96a0 > section:nth-child(14)",
          "#container-d8006e96a0 > section:nth-child(16)"
        ],
        "https://www.hrblock.com/myblock-benefits/": [
          "#container-3d6b34a383 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
          "#container-1ef905b226 > div:nth-child(11)",
          "#container-1ef905b226 > section.column-control.white-theme.padding-top-60.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/online-assist/": [
          "#container-33a468b3d9 > div:nth-child(14)"
        ],
        "https://www.hrblock.com/online-tax-filing/": [
          "#container-33a468b3d9 > div:nth-child(14)"
        ],
        "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
          "#container-20ed47ac3b > div:nth-child(17)"
        ],
        "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
          "#container-1a9b6ce7f3 > div:nth-child(17)"
        ],
        "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
          "#container-43b426931f > div:nth-child(17)"
        ],
        "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
          "#container-9f6cd44700 > div:nth-child(16)"
        ],
        "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
          "#container-f3913af060 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
        ],
        "https://www.hrblock.com/tax-offices/": [
          "#container-4bc6fad564 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
          "#container-4bc6fad564 > div:nth-child(9)"
        ],
        "https://www.hrblock.com/tax-offices/business-services/c-corp-taxes/": [
          "#container-d7d9e378fd > section:nth-child(3)"
        ],
        "https://www.hrblock.com/tax-offices/business-services/partnership-taxes/": [
          "#container-40d6339cc0 > section:nth-child(3)"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
          "#container-971cbd754f > section.spruce-forest-theme",
          "#container-971cbd754f > section.column-control.white-theme.padding-top-60"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
          "#container-adef7469f1 > section.column-control.white-theme.padding-top-60"
        ],
        "https://www.hrblock.com/tax-offices/business-services/small-business-tax/s-corp-taxes/": [
          "#container-583d770702 > section:nth-child(3)"
        ],
        "https://www.hrblock.com/tax-offices/extended-tax-services/past-taxes/": [
          "#container-5f4a923d82 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-60.two-column-control"
        ],
        "https://www.hrblock.com/tax-offices/manage-appointment/": [
          "#container-ef70e7427e > section.column-control.white-theme.padding-top-80.padding-bottom-100.two-column-control",
          "#container-ef70e7427e > section.spruce-forest-theme"
        ],
        "https://www.hrblock.com/tax-offices/tax-prep/w-2-early-access/": [
          "body > main > article > section > div > div:nth-child(2) > div > div",
          "body > main > section"
        ],
        "https://www.hrblock.com/tax-payment-center/": [
          "#container-77a8166999 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control"
        ],
        "https://www.hrblock.com/tax-reform-and-law-changes/": [
          "#container-7266953ed0 > section.column-control.white-theme.padding-bottom-60"
        ],
        "https://www.hrblock.com/tax-software/": [
          "#container-cc917aa127 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/basic-tax-software/": [
          "#container-0e9e96993e > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control",
          "#container-0183d81774 > div:nth-child(6)"
        ],
        "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
          "#container-7c3463266f > section:nth-child(9)",
          "#container-1abe367d84 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control",
          "#container-7c3463266f > div:nth-child(12)"
        ],
        "https://www.hrblock.com/tax-software/deluxe-without-state/": [
          "#container-6a44599bfa > section:nth-child(9)",
          "#container-394f809683 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control",
          "#container-6a44599bfa > div:nth-child(12)"
        ],
        "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
          "#container-70228ce7b0 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control",
          "#container-23a1fc841d > div:nth-child(6)"
        ],
        "https://www.hrblock.com/tax-software/premium-tax-software/": [
          "#container-21de483afe > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control",
          "#container-0f860f40c5 > div:nth-child(6)"
        ],
        "https://www.hrblock.com/tax-software/state-editions/": [
          "#container-6d4ad41ada > section.product-details-wrapper.p-b-80.no-stateform > div > div",
          "#container-6d4ad41ada > section.column-control.white-theme.padding-top-20.padding-bottom-100",
          "#container-f481a87487 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
          "#container-3530faca90 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
          "#container-d34ad73b9e > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
          "#container-8a087c1a91 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
          "#container-1fda0fe969 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/tax-software/updates-back-editions/prior-year/": [
          "#container-cd5f8a909a > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control",
          "#container-cd5f8a909a > section:nth-child(4)",
          "#container-7bf0a20b85 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-federal/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ],
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/": [
          "#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero-eggshell",
      "name": "Split hero (eggshell)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type)"
      ],
      "style": "eggshell",
      "blocks": [
        "hero-split",
        "software-download",
        "review-filter",
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "hero-green",
      "name": "Split hero (green)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:first-of-type)"
      ],
      "style": "green",
      "blocks": [
        "hero-split",
        "software-download"
      ],
      "defaultContent": []
    },
    {
      "id": "hero-forest",
      "name": "Split hero (forest)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:first-of-type)"
      ],
      "style": "forest",
      "blocks": [
        "hero-split",
        "columns-promo-card",
        "cards-icon"
      ],
      "defaultContent": []
    },
    {
      "id": "hero",
      "name": "Split hero (white)",
      "selector": [
        "body > main:has(> div.root > div.cmp-container > div.cmp-container):not(:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:first-of-type)):not(:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:first-of-type)):not(:has(> div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:first-of-type))"
      ],
      "style": null,
      "blocks": [
        "hero-split",
        "hero-banner",
        "software-finder",
        "landing-stack",
        "columns-banner"
      ],
      "defaultContent": [
        "main div.cmp-container > section.alert-banner",
        "main div.product-details-container > figure.product-details-figure figcaption"
      ]
    },
    {
      "id": "feature-band-white",
      "name": "Feature band (white)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(:first-of-type)",
        "main div.cmp-container > div.xf-content-height section.column-control.white-theme"
      ],
      "style": null,
      "blocks": [
        "cards-icon",
        "columns-feature",
        "columns-callout",
        "cards-tip",
        "cards-article",
        "columns-banner",
        "accordion-media"
      ],
      "defaultContent": [
        "main div.cmp-container > section.column-control.white-theme > div.container > ul > li > div.cmp-container > div.introDefaultvariant"
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
        "cards-feature",
        "cards-icon",
        "cards-pricing",
        "cards-product",
        "columns-promo-card",
        "columns-banner",
        "columns-feature",
        "newsletter-signup",
        "lottie-animation",
        "software-download"
      ],
      "defaultContent": [
        "main div.cmp-container > section.column-control.spruce-eggshell-theme:has(.introDefaultvariant):not(:has(.cq-dd-image, .card, article.card-stacked))",
        "main div.cmp-container > section.column-control:has(.iconlist):has(article.card-stacked)"
      ]
    },
    {
      "id": "feature-band-green",
      "name": "Feature band (green)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(:first-of-type)",
        "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme",
        "main > div.root > div.cmp-container > div.cmp-container > section.green-dark-theme.container"
      ],
      "style": "green",
      "blocks": [
        "accordion-media",
        "cards-pricing",
        "cards-icon",
        "cards-feature",
        "cards-article",
        "cards-product",
        "embed-form",
        "table-data",
        "columns-banner"
      ],
      "defaultContent": [
        "main div.cmp-container > div.showhide-table.green-dark-theme"
      ]
    },
    {
      "id": "feature-band-forest",
      "name": "Feature band (forest)",
      "selector": [
        "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-forest-theme:not(:first-of-type)",
        "main > div.root > div.cmp-container > div.cmp-container > section.pricing-card-table.spruce-forest-theme"
      ],
      "style": "forest",
      "blocks": [
        "table-data",
        "cards-icon",
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "promo-banner",
      "name": "Promo banner (forest)",
      "selector": [
        "main div.cmp-container section.spruce-forest-theme:has(> div.alignBanner)"
      ],
      "style": "forest",
      "blocks": [
        "promo-strip",
        "columns-banner"
      ],
      "defaultContent": []
    },
    {
      "id": "tabs",
      "name": "Feature tabs",
      "selector": [
        "main div.cmp-container > div.reframe-tabs"
      ],
      "style": null,
      "blocks": [
        "tabs-pill"
      ],
      "defaultContent": [
        "main div.cmp-container > div.showhide-table.white-theme"
      ]
    },
    {
      "id": "faq",
      "name": "FAQ",
      "selector": [
        "main div.cmp-container > section.faq:not(.spruce-eggshell-theme)"
      ],
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "faq-eggshell",
      "name": "FAQ (eggshell)",
      "selector": [
        "main div.cmp-container > section.faq.spruce-eggshell-theme"
      ],
      "style": "eggshell",
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "reviews",
      "name": "Customer reviews",
      "selector": [
        "main div.cmp-container > section.hrbcom-reviews"
      ],
      "style": null,
      "blocks": [
        "product-reviews"
      ],
      "defaultContent": []
    },
    {
      "id": "disclaimer",
      "name": "Page disclaimers",
      "selector": [
        "body > div.global-disclaimer-container",
        "main div.cmp-container > section.page-disclaimer",
        "main div.cmp-container > div.global-disclaimer-container:not(.hide)"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "body > div.global-disclaimer-container",
        "main div.cmp-container > section.page-disclaimer",
        "main div.cmp-container > div.global-disclaimer-container"
      ]
    },
    {
      "id": "expat-hero",
      "name": "Expat resource hero",
      "selector": [
        "#site-content > section.country-guide-hero",
        "#site-content > section.expat-homepage-hero",
        "#site-content > section.ba--catsingle--header",
        "#site-content > section.ba--catall--header"
      ],
      "style": "light-grey",
      "blocks": [
        "breadcrumb",
        "hero-resource"
      ],
      "defaultContent": []
    },
    {
      "id": "expat-search",
      "name": "Expat topic search",
      "selector": [
        "#site-content > section.expat-hp-search"
      ],
      "style": "light-grey",
      "blocks": [
        "search-articles"
      ],
      "defaultContent": []
    },
    {
      "id": "expat-countries",
      "name": "Supported countries",
      "selector": [
        "#site-content > section.expat-hp-countries"
      ],
      "style": "light-grey",
      "blocks": [
        "cards-article"
      ],
      "defaultContent": [
        "#site-content > section.expat-hp-countries > div > h2",
        "#site-content > section.expat-hp-countries > div > p"
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
      "name": "Helpful expat articles",
      "selector": [
        "#site-content > section.ba--hp-allposts"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "#site-content > section.ba--hp-allposts > div > h2",
        "#site-content > section.ba--hp-allposts div.ba--hp-allposts--lineup > a.hp-all-posts--post",
        "#site-content > section.ba--hp-allposts div.ba-post--loadmore",
        "#site-content > section.ba--hp-allposts div.ba--hp-allposts--view-all"
      ]
    },
    {
      "id": "expat-fast-facts",
      "name": "Country fast facts",
      "selector": [
        "#site-content > section.country-fast-facts"
      ],
      "style": "bright-green",
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": [
        "#site-content > section.country-fast-facts > div > h2"
      ]
    },
    {
      "id": "expat-steps",
      "name": "Steps to prep",
      "selector": [
        "#site-content > section.steps-to-prep"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": [
        "#site-content > section.steps-to-prep > h3"
      ]
    },
    {
      "id": "expat-article-search",
      "name": "Topic article search",
      "selector": [
        "#site-content > section.ba-search--page"
      ],
      "style": null,
      "blocks": [
        "search-articles",
        "results-toolbar"
      ],
      "defaultContent": [
        "#site-content > section.ba-search--page div.search-results > a.ba--pgitem",
        "#site-content > section.ba-search--page div.ba-post--loadmore"
      ]
    },
    {
      "id": "expat-topics",
      "name": "All topics listing",
      "selector": [
        "#site-content > section.ba--catall--listing"
      ],
      "style": null,
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
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
    },
    {
      "id": "article-topics",
      "name": "Article topic bar",
      "selector": [
        "main.tic-single > div.ba-catbar"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "main.tic-single > div.ba-catbar > ul"
      ]
    },
    {
      "id": "article",
      "name": "Article",
      "selector": [
        "main.tic-single > article.catbar-margin-top"
      ],
      "style": null,
      "blocks": [
        "article-body",
        "columns-banner",
        "cards-article"
      ],
      "defaultContent": [
        "main.tic-single article div.tic-single-related-topics h2",
        "#recs_single_title"
      ]
    },
    {
      "id": "article-cta",
      "name": "Article CTA banner",
      "selector": [
        "main.tic-single > section.tic-footer-cta-banner"
      ],
      "style": "eggshell",
      "blocks": [
        "columns-banner"
      ],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.hrblock.com/amending-your-tax-return/": [
      "#truste_0\\.6283964874748965",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-35eafd590c > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_2001983583",
      "h2.modal-headline.text-jumbo",
      "a.modal-tool-open.track-946706792",
      "a.modal-tool-open.track-1013713545",
      "a.modal-tool-open.track-1147727051",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/corporate/income-tax-course/": [
      "#truste_0\\.8562461821678359",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_366483885",
      "#container-0752e4e04f > div:nth-child(2) > h2:nth-child(1)",
      "#container-15d5232ef8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-cc1834ca71 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-21aa2a0fca > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-small",
      "#container-b55dc781e1 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_208196642",
      "div.modal-body.body_max_width_mid_1521520623",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_442839781",
      "#container-db5af2b6bb > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_260670298",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1232551095",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/easignup/": [
      "#truste_0\\.18494868589178015",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.color-forest-green",
      "div.modal-body.body_max_width_mid_249059003",
      "#container-b96e62c32e > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.flex-column.card-btn > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-body.body_max_width_mid_1464248382",
      "#container-a47ce03e8d > div:nth-child(2) > h2:nth-child(1)",
      "#container-84fdcc2af6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-84fdcc2af6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-05537b34b1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-05537b34b1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-46598a4d17 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-0e26d537e9 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "h3.modal-headline.color-eggshell",
      "h4.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1015882336",
      "div.modal-body.body_max_width_mid_889919662",
      "#container-2e799cc866 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1752218744",
      "#container-077e35f28a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)",
      "#container-077e35f28a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "h4.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1383939846",
      "h2.modal-headline.color-forest-green",
      "div.modal-body.body_max_width_mid_1408447950",
      "#mid_1171954344-10-0 > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/expat-tax-preparation/": [
      "#truste_0\\.5127394355285065",
      "div.modal-inner",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1634626026",
      "#container-43302fbe35 > div:nth-child(2) > h3:nth-child(1)",
      "#container-34638f9092 > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-color-neon-green",
      "#container-ef65b0bf7a > div:nth-child(2) > h3:nth-child(1)",
      "#container-802374b182 > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.color-eggshell",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1924607655",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/diy-expat-tax-filing-online/": [
      "#truste_0\\.7476879239434328",
      "div.modal-inner",
      "#container-95d4e56309 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
      "#container-95d4e56309 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-5d0357ff3b > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_278746161",
      "#container-2633ae6861 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_1990052724",
      "h3.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_2141816003",
      "div.modal-body.body_max_width_mid_1664655675",
      "#container-57d27ee4ef > div:nth-child(2) > h2:nth-child(1)",
      "#container-c48564709a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c48564709a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-8e1b433555 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8e1b433555 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a1b9140174 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-a1b9140174 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "h3.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1725312102",
      "div.modal-body.body_max_width_mid_722821736",
      "div.modal-body.body_max_width_mid_1233355913",
      "#container-90a9fb910f > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_220228662",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window"
    ],
    "https://www.hrblock.com/expat-tax-preparation/expat-assisted-tax-filing/": [
      "button.btn.btn-medium",
      "#truste_0\\.2452352023927935",
      "div.modal-inner",
      "#container-7ef9ba73b5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
      "#container-7ef9ba73b5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "#container-7ef9ba73b5 > div:nth-child(7) > div:nth-child(2) > a:nth-child(1)",
      "div.modal-body.body_max_width_mid_1266141437",
      "div.modal-body.body_max_width_mid_1426760472",
      "div.modal-body.body_max_width_mid_1717466807",
      "h3.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1568373700",
      "div.modal-body.body_max_width_mid_103575943",
      "#container-3ccb855caf > div:nth-child(2) > h2:nth-child(1)",
      "#container-91b67d8af3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-91b67d8af3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-932666922e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-932666922e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-09baf49aaa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-09baf49aaa > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-eeb34e148c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-eeb34e148c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "a.btn.modal-tool-open",
      "h3.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_476235750",
      "div.modal-body.body_max_width_mid_1960474828",
      "div.modal-body.body_max_width_mid_630120052",
      "div.modal-body.body_max_width_mid_1850672667",
      "div.modal-body.body_max_width_mid_1449940651",
      "div.modal-body.body_max_width_mid_40270687",
      "div.modal-body.body_max_width_mid_475139044",
      "div.modal-body.body_max_width_mid_177884019",
      "#container-be9b3295c3 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1754224121",
      "h2.modal-headline.text-jumbo",
      "#signinmodal-window",
      "div.p-40.m-0"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/all-topics/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/financial-services/emerald-advance-loan-vs-refund-advance/": [
      "#truste_0\\.46953428076540005",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_2032615219",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.color-eggshell",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_78856676",
      "#container-0633b51c8c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)",
      "#container-0633b51c8c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "h4.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1383939846",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/financial-services/emerald-advance-loan/": [
      "#truste_0\\.45608977827391917",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.color-forest-green",
      "div.modal-body.body_max_width_mid_249059003",
      "#container-b96e62c32e > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.flex-column.card-btn > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-body.body_max_width_mid_1464248382",
      "#container-a47ce03e8d > div:nth-child(2) > h2:nth-child(1)",
      "#container-84fdcc2af6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-84fdcc2af6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-05537b34b1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-05537b34b1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-46598a4d17 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-0e26d537e9 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "h3.modal-headline.color-eggshell",
      "h4.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1015882336",
      "div.modal-body.body_max_width_mid_889919662",
      "#container-2e799cc866 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1752218744",
      "#container-077e35f28a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)",
      "#container-077e35f28a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "h4.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1383939846",
      "h2.modal-headline.color-forest-green",
      "div.modal-body.body_max_width_mid_1408447950",
      "#mid_1171954344-10-0 > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/financial-services/emerald-card-login/": [
      "#truste_0\\.20386028784422472",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_621557742",
      "div.modal-body.body_max_width_mid_1112334717",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/financial-services/emerald-card-services/": [
      "#truste_0\\.06795239277387155",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_13613868",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-jumbo",
      "#container-c98a8560dc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c98a8560dc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ba5e708c26 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ba5e708c26 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-b07aa5091c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-b07aa5091c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-little",
      "#container-73758a23da > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-4da9bde11d > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_236503823",
      "h2.modal-headline.text-large",
      "#container-ad0b07082f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1112334717",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/financial-services/tax-refund-payment/": [
      "#truste_0\\.5479391794981737",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-304b6c55b1 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_377115416",
      "#container-713c0023fa > div:nth-child(2) > h2:nth-child(1)",
      "#container-e559297425 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e559297425 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-6c553883fd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6c553883fd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-137f551ac0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-137f551ac0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-755f38404d > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1197086908",
      "#container-51ec33b7a9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
      "#container-51ec33b7a9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "h3.modal-headline.text-small",
      "#container-6fba103bd0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
      "div.modal-body.body_max_width_mid_1383939846",
      "div.modal-body.body_max_width_mid_2016743025",
      "#container-6afc631a92 > div:nth-child(2) > h2:nth-child(1)",
      "#container-243b656f10 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-243b656f10 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-little",
      "#container-45d5fda9ad > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "div.modal-body.body_max_width_mid_850946228",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-d16e4cd494 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d16e4cd494 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-7deb33ae8c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-7deb33ae8c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-jumbo",
      "a.modal-tool-open.track-875352661",
      "div.modal-body.body_max_width_mid_1012449108",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/lp/creator-taxes/": [
      "#truste_0\\.9007881003745594",
      "#ciam-login-app",
      "#modal-free-tpr-promo",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_349586517",
      "#container-b67f62b7b9 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "#container-645ca0915f > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_864996749",
      "#container-645ca0915f > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "p.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_1206612160",
      "h2.modal-headline.text-large",
      "#container-fe28351293 > article:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-6045219188 > article:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_993076535",
      "a.btn.modal-tool-open"
    ],
    "https://www.hrblock.com/myblock-benefits/": [
      "#truste_0\\.7561897190390228",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "#container-744cc3ed4f > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_686442763",
      "#container-8c38d35871 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1851743804",
      "#container-29a3d2e212 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_184838423",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_85392555",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_708961617",
      "div.modal-body.body_max_width_mid_467945459",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/offers/gig-worker-side-business-taxes/": [
      "#truste_0\\.019988190242063664",
      "#ciam-login-app",
      "#modal-side-hustle",
      "#modal-ai",
      "div.main-nav-container.container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "#container-1ef905b226 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1910276851",
      "#container-1ff8e84a97 > div:nth-child(2) > div:nth-child(2) > a:nth-child(2)",
      "#container-0eafc93892 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_685368573",
      "#accordion-panel-1 > div:nth-child(2) > a:nth-child(1)",
      "a.modal-tool-open.track-1516666147",
      "#container-51699c6ee4 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1609729958",
      "#container-e08e6bbb1f > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1495962521",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_786700443",
      "p.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_289435701"
    ],
    "https://www.hrblock.com/offers/saf/": [
      "#truste_0\\.18973076222399454",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_775061242",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1879429182",
      "div.modal-body.body_max_width_mid_499803536",
      "div.modal-body.body_max_width_mid_71203971",
      "div.modal-body.body_max_width_mid_212614700",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/offers/turbotax-price-comparison/": [
      "#truste_0\\.4631584334600546",
      "#ciam-login-app",
      "#modal-free",
      "#modal-free-tpr-promo",
      "#modal-ai",
      "h1.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_120982348",
      "#container-d8b9eae811 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "#container-f548bd0bcd > section:nth-child(3) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(4) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
      "h2.modal-headline.text-medium",
      "p.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_618748748",
      "#container-36642f1f98 > div:nth-child(2) > h2:nth-child(1)",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-e8a51db5f5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e8a51db5f5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-6dda6cfecb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6dda6cfecb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_921159293",
      "div.modal-body.body_max_width_mid_1083635356",
      "div.modal-body.body_max_width_mid_1458411927",
      "div.modal-body.body_max_width_mid_184161382"
    ],
    "https://www.hrblock.com/online-assist/": [
      "#truste_0\\.560191800154483",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-ai",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1821649127",
      "div.modal-body.body_max_width_mid_1954612817",
      "#container-ac1e2efcf5 > div:nth-child(2) > h2:nth-child(1)",
      "#container-36cbc78ddc > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-ab0b589f91 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ab0b589f91 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-15cd2cd8be > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-15cd2cd8be > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-56f630943c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
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
    "https://www.hrblock.com/online-tax-filing/": [
      "#truste_0\\.6212655991326456",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-ai",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1821649127",
      "div.modal-body.body_max_width_mid_1954612817",
      "#container-ac1e2efcf5 > div:nth-child(2) > h2:nth-child(1)",
      "#container-36cbc78ddc > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_620500244",
      "#container-ab0b589f91 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ab0b589f91 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-15cd2cd8be > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-15cd2cd8be > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-56f630943c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
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
    "https://www.hrblock.com/online-tax-filing/deluxe-online-tax-filing/": [
      "#truste_0\\.943565894018454",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-online-tech-specs",
      "#modal-diy-deluxe-software-requirements",
      "#modal-sign-in-test-modal",
      "#modal-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "p.modal-headline.text-left",
      "h1.modal-headline.text-jumbo",
      "#container-cd81f11a0c > div:nth-child(2) > h2:nth-child(1)",
      "#container-aa73f9a3b2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-aa73f9a3b2 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-1181d60801 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-1181d60801 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-31cd3af053 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-31cd3af053 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a27935538a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-a27935538a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ee45f38dbb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ee45f38dbb > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-318c063d52 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-318c063d52 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-d0acdcd7ee > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/free-online-tax-filing/": [
      "#truste_0\\.6881248103476462",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#container-809be78dca > div:nth-child(1)",
      "#modal-diy-free-software-requirements",
      "#modal-online-tech-specs",
      "#modal-ai",
      "#modal-free",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "p.modal-headline.text-left",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_918170037",
      "#container-2a13853a91 > div:nth-child(5) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_503368159",
      "#container-ef4af8adcf > div:nth-child(2) > h2:nth-child(1)",
      "#container-d4ffeb367c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d4ffeb367c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-85415f2068 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-85415f2068 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-0c843445fc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-0c843445fc > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-461b51fc9d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-461b51fc9d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-6ab772216a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6ab772216a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-cbd3638090 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-cbd3638090 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-ec301a907d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
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
    "https://www.hrblock.com/online-tax-filing/premium-online-tax-filing/": [
      "#truste_0\\.4611598667441682",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-online-tech-specs",
      "#modal-diy-premium-requirements-modal",
      "#modal-sign-in-test-modal",
      "#modal-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "p.modal-headline.text-left",
      "h1.modal-headline.text-jumbo",
      "#container-c1f499e72e > div:nth-child(2) > h2:nth-child(1)",
      "#container-8f9e6178d5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-8f9e6178d5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-dab501b55b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-dab501b55b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-bfdcdf1c3f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-bfdcdf1c3f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ac92f90c29 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ac92f90c29 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-c7c737c3b7 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c7c737c3b7 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-c30fdd0650 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-c30fdd0650 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-becd814a85 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/self-employed-online-tax-filing/": [
      "#truste_0\\.7853338696130427",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-online-tech-specs",
      "#modal-diy-self-employed-requirements-modal",
      "#modal-sign-in-test-modal",
      "#modal-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "p.modal-headline.text-left",
      "h1.modal-headline.text-jumbo",
      "#container-0c1403cbd8 > div:nth-child(2) > h2:nth-child(1)",
      "#container-9f07e7b953 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-9f07e7b953 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-9d15c0634e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-9d15c0634e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-54b3bfbd51 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-54b3bfbd51 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-86b3d0401b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-86b3d0401b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-5e4cac3559 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5e4cac3559 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-ad558eabc6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ad558eabc6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "#container-63c155f7f1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/online-tax-filing/tax-pro-review/": [
      "#truste_0\\.7647250569614242",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-diy-free-software-requirements",
      "#modal-diy-deluxe-software-requirements",
      "#modal-diy-premium-requirements-modal",
      "#modal-diy-self-employed-requirements-modal",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_348591577",
      "#container-581e770cb8 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_2105894522",
      "#container-a55af66eb0 > div:nth-child(2) > h2:nth-child(1)",
      "#container-44174aa8fd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-44174aa8fd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e203adfac3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e203adfac3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-0c41b27098 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-0c41b27098 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1852931884",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/": [
      "#truste_0\\.5310296769629236",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/basic-tax-software-reviews/": [
      "#truste_0\\.5807780905027567",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/deluxe-online-tax-filing-reviews/": [
      "#truste_0\\.6227247506272875",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/deluxe-tax-software-reviews/": [
      "#truste_0\\.2617977286270281",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/free-online-tax-filing-reviews/": [
      "#truste_0\\.9870625665233541",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/online-filing-reviews/": [
      "#truste_0\\.6567790350107864",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/premium-online-tax-filing-reviews/": [
      "#truste_0\\.26230666632738153",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/premium-small-business-tax-software-reviews/": [
      "#truste_0\\.8170680360462685",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/premium-tax-software-reviews/": [
      "#truste_0\\.027391524400458556",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/reviews/software-filing-reviews/": [
      "#truste_0\\.7135906043618812",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-extension/": [
      "#truste_0\\.7677400198182526",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_197106743",
      "#container-2b2ce4a84e > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)",
      "h2.modal-headline.text-large",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ],
    "https://www.hrblock.com/tax-offices/": [
      "#truste_0\\.6057049171313393",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1050383542",
      "#container-2d8e6d6f1b > div:nth-child(10) > div:nth-child(2) > a:nth-child(1)",
      "#container-2d8e6d6f1b > div:nth-child(10) > div:nth-child(2) > a:nth-child(1)",
      "#container-786267439a > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_925055029",
      "#container-8e5aa559ff > article:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-14a60cd595 > article:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-714b5be48e > article:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "h3.modal-headline.color-forest-green",
      "div.modal-body.body_max_width_mid_229728063",
      "div.price-box > div:nth-child(3) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "#container-b53f4fb870 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_688712216",
      "#container-ddde4b413e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-ddde4b413e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-728e559817 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-728e559817 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-medium",
      "#container-3ffb6fc584 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.modal-body.body_max_width_mid_1090251584",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "#chatOverlay",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ],
    "https://www.hrblock.com/tax-offices/business-services/c-corp-taxes/": [
      "#truste_0\\.054553755355812084",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-4518bf9c06 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1576873676",
      "#container-7355082c8a > div:nth-child(10) > div:nth-child(2) > a:nth-child(1)",
      "#container-d689e58756 > div:nth-child(2) > h2:nth-child(1)",
      "#container-e8703b05e4 > article:nth-child(5) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-jumbo",
      "#container-f535b29b1a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-f535b29b1a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-18eef860f6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-18eef860f6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-6ed361e8d3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-6ed361e8d3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.color-dark-green",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/business-services/partnership-taxes/": [
      "#truste_0\\.008915976806209813",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-305da01dce > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_158169084",
      "#container-c450a8e537 > div:nth-child(10) > div:nth-child(2) > a:nth-child(1)",
      "#container-29068f402e > div:nth-child(2) > h2:nth-child(1)",
      "#container-d019beef9e > article:nth-child(5) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-jumbo",
      "#container-3d60fabbfe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-3d60fabbfe > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-a0d01506f7 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-a0d01506f7 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-08c5768736 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-08c5768736 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.color-dark-green",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/business-services/self-employed-taxes/": [
      "#truste_0\\.07904795301542",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-ecf10a9f9d > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_954911182",
      "#container-20f42c8ebf > div:nth-child(10) > div:nth-child(2) > a:nth-child(1)",
      "#container-902171b28f > div:nth-child(2) > h2:nth-child(1)",
      "#container-c9e7938a0f > article:nth-child(5) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "div.btn-container.stackButtons > div:nth-child(1) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-jumbo",
      "#container-d3d1254098 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d3d1254098 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-67eac2d5ae > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-67eac2d5ae > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-dd1b4b869a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-dd1b4b869a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.color-dark-green",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/business-services/small-business-bookkeeping-services/": [
      "#truste_0\\.9963921261361569",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_978352620",
      "#container-1de5211825 > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "#container-1a09dbad56 > div:nth-child(2) > h2:nth-child(1)",
      "#container-a3eed2d76d > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "#container-f3da3b7203 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-body.body_max_width_mid_376959840",
      "div.left-30.removeLastPadding > div:nth-child(1) > a:nth-child(1)",
      "#container-0e07cd4249 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-17eaed2883 > div:nth-child(2) > h2:nth-child(1)",
      "#container-2a63e14f56 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-2a63e14f56 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e82263683c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e82263683c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "#container-d3b2fb2971 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-39a7a1a780 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1871850031",
      "a.modal-tool-open.track-1967492706",
      "a.modal-tool-open.track-1894884765",
      "h2.modal-headline.text-large",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/business-services/small-business-payroll-services/": [
      "#truste_0\\.7425379006637862",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1622189857",
      "#container-7c4415f036 > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)",
      "#container-e5967f0cdf > div:nth-child(2) > h2:nth-child(1)",
      "#container-676a678a3f > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-07274249f8 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-d34ad2bae1 > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-body.body_max_width_mid_519106907",
      "#container-f7d3bbc7e7 > div:nth-child(2) > h2:nth-child(1)",
      "#container-457b22994c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-457b22994c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-2ffd4f9796 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-2ffd4f9796 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "#container-360839e768 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
      "#container-fec6d47fcd > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1871850031",
      "h2.modal-headline.text-large",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/business-services/small-business-tax/s-corp-taxes/": [
      "#truste_0\\.5480603992601248",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "div.container.main-nav-container > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
      "div.modal-header",
      "#container-46376042e2 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
      "#container-46376042e2 > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_78339396",
      "#container-0a034bf42f > div:nth-child(10) > div:nth-child(2) > a:nth-child(1)",
      "#container-b457d547ed > div:nth-child(2) > h2:nth-child(1)",
      "#container-0e29a71ff2 > article:nth-child(5) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "h2.modal-headline.text-jumbo",
      "#container-e4c130351c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-e4c130351c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-d43c32a391 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-d43c32a391 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-5106cea887 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5106cea887 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.color-dark-green",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-large",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/extended-tax-services/past-taxes/": [
      "#truste_0\\.17824465428291347",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1271559817",
      "div.btn-container.removeLastPadding > a:nth-child(1)",
      "div.modal-body.body_max_width_mid_446603931",
      "p.modal-headline.text-large",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1368928425",
      "div.modal-body.body_max_width_mid_1715160765",
      "div.modal-body.body_max_width_mid_1288993231",
      "#container-42f3e6375e > div:nth-child(11) > div:nth-child(2) > a:nth-child(1)",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/manage-appointment/": [
      "#truste_0\\.8278352969435648",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_808177327",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search",
      "div.chatbot-launcher"
    ],
    "https://www.hrblock.com/tax-offices/product-services/tax-identity-shield/": [
      "#truste_0\\.8422181357341068",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_65210913",
      "div.modal-body.m-t-20",
      "h2.modal-headline.color-eggshell",
      "div.modal-body.body_max_width_mid_659327317",
      "#container-977ac2867b > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_1714973711",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1142539195",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-offices/tax-prep/w-2-early-access/": [
      "#spike-popup",
      "#ciam-login-app",
      "a.modal-tool-open.track-1313854578",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "div.need-help-footer > div:nth-child(4) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-payment-center/": [
      "#truste_0\\.06838143748430037",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_553717000",
      "#container-6548577759 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_666432564",
      "h2.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1374387721",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-reform-and-law-changes/": [
      "#truste_0\\.5628557870177109",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "a.modal-tool-open.track-2051614536",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_67867166",
      "#container-e2286287c4 > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)",
      "#container-7266953ed0 > section:nth-child(8) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_5565614",
      "#container-c39d62bc4c > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-c39d62bc4c > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-5e480f322e > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-5e480f322e > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-e58a929b28 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-e58a929b28 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-0a38d7352b > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-0a38d7352b > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-90eee8a3f0 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-90eee8a3f0 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-b965b312fc > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-b965b312fc > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
      "#container-c70639d571 > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "a.btn.modal-tool-open",
      "#container-6a31c38e53 > div:nth-child(3) > h2:nth-child(1)",
      "#container-8e6e8fb53e > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_680449344",
      "#container-8e6e8fb53e > div:nth-child(5) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_561630770",
      "#container-a364be3175 > div:nth-child(2) > h3:nth-child(1)",
      "div.modal-body.body_max_width_mid_51096593",
      "h3.modal-headline.text-small",
      "div.modal-body.body_max_width_mid_780109951",
      "#container-ad4eb79238 > div:nth-child(2) > h2:nth-child(1)",
      "div.modal-body.body_max_width_mid_52652948",
      "div.sm-modal-img-hide",
      "h2.modal-headline.text-large",
      "div.modal-body.m-t-20",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/": [
      "#truste_0\\.038908484458780146",
      "div.chatbot-popup",
      "#spike-popup",
      "#ciam-login-app",
      "#container-d0f12dac21 > div:nth-child(1)",
      "#modal-software-ai",
      "#modal-free",
      "#modal-rf-software-state-fees-modal-all",
      "#floatingBtn",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#assist-product-selector > fieldset:nth-child(1) > div:nth-child(2) > button:nth-child(4)",
      "#assist-product-selector > fieldset:nth-child(1) > div:nth-child(3) > div:nth-child(3) > button:nth-child(2)",
      "div.modal-2.modal-open",
      "#container-a59ae2c8b6 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_393831112",
      "div.modal-body.body_max_width_mid_143590194",
      "div.modal-body.body_max_width_mid_1243214528",
      "#container-16ef6f691c > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
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
    "https://www.hrblock.com/tax-software/basic-tax-software/": [
      "#truste_0\\.4203777378039596",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-rf-software-requirements-modal-t1",
      "#modal-software-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1875232238",
      "#container-fb7b29ec07 > div:nth-child(2) > h2:nth-child(1)",
      "#container-d5cf7eeb5e > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/deluxe-tax-software/": [
      "#truste_0\\.41110360723055395",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-rf-software-requirements-modal-t1",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-software-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_233494197",
      "#container-f629711fcd > div:nth-child(2) > h2:nth-child(1)",
      "#container-eac4b6469a > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/deluxe-without-state/": [
      "#truste_0\\.48670507825521914",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-rf-software-requirements-modal-t1",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-software-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1919884238",
      "#container-172a7537c3 > div:nth-child(2) > h2:nth-child(1)",
      "#container-f830e08871 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/premium-small-business-tax-software/": [
      "#truste_0\\.6016312361792288",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-rf-software-requirements-modal-t1",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-software-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_781206566",
      "#container-aed5b58364 > div:nth-child(2) > h2:nth-child(1)",
      "#container-d36af9ee5f > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/premium-tax-software/": [
      "#truste_0\\.7222594159157558",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-free",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-rf-software-requirements-modal-t1",
      "#modal-software-ai",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1316668603",
      "#container-bdbbbcb5c1 > div:nth-child(2) > h2:nth-child(1)",
      "#container-ca3b0011e7 > div:nth-child(2) > h2:nth-child(1)",
      "h2.modal-headline.text-jumbo",
      "a.btn.modal-tool-open",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/state-editions/": [
      "#truste_0\\.30394446731649893",
      "#spike-popup",
      "#ciam-login-app",
      "#modal-rf-software-requirements-modal-t1",
      "#modal-rf-software-state-fees-modal-all",
      "#modal-state-coming-soon",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "div.prod-lookup-modal-cta",
      "h2.modal-headline.text-large",
      "#container-48b6769749 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-48b6769749 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "#container-5e30d0bdca > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
      "#container-5e30d0bdca > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
      "h3.modal-headline.text-small",
      "div.modal-body.m-t-20",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/": [
      "#truste_0\\.00013079975969443325",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/2021-back-editions/": [
      "#truste_0\\.9691237942373547",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-da9840f779 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_1771279078",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1309684780",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/2022-back-editions/": [
      "#truste_0\\.02603469289611582",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-d98f4720c0 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_961791621",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_2119172237",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/2023-back-editions/": [
      "#truste_0\\.3883907367420917",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-236dc08ad2 > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_152304164",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1366307602",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/2024-back-editions/": [
      "#truste_0\\.9247864712184706",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "#container-7b35a5391c > div:nth-child(2) > h2:nth-child(2)",
      "div.modal-body.body_max_width_mid_657183293",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_556820145",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/federal-mac/": [
      "#truste_0\\.901316901132994",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_421987969",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/federal-windows/": [
      "#truste_0\\.7706038728685582",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_658820403",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/prior-year/": [
      "#truste_0\\.4708809348946361",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h1.modal-headline.text-jumbo",
      "div.modal-body.body_max_width_mid_1675740621",
      "#container-c753e16b04 > div:nth-child(2) > h2:nth-child(1)",
      "#container-8f71725b97 > div:nth-child(2) > h3:nth-child(1)",
      "#container-806202d1fc > div:nth-child(2) > h3:nth-child(1)",
      "h2.modal-headline.text-large",
      "#container-a30d77cca6 > div:nth-child(2) > h3:nth-child(1)",
      "#container-eed98f40ce > div:nth-child(2) > h3:nth-child(1)",
      "#container-87dd675607 > div:nth-child(2) > h3:nth-child(1)",
      "h3.modal-headline.text-small",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/state-mac/": [
      "#truste_0\\.025817078991113407",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1134111565",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/tax-software/updates-back-editions/state-windows/": [
      "#truste_0\\.8118403918106752",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_2135551591",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/": [
      "#truste_0\\.5337165811378457",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/17mac-state/": [
      "#truste_0\\.6425727363414568",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/": [
      "#truste_0\\.7968222226157031",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/17windows-federal/": [
      "#truste_0\\.5823947447550928",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/17windows-state/": [
      "#truste_0\\.0920883639174761",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/": [
      "#truste_0\\.15374098900568423",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/18mac-state/": [
      "#truste_0\\.8661875133619508",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/": [
      "#truste_0\\.9477470733057973",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/": [
      "#truste_0\\.8709908718448087",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/18windows-state/": [
      "#truste_0\\.9845467900778093",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/": [
      "#truste_0\\.648869272156981",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/19mac-state/": [
      "#truste_0\\.4968048157749717",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/": [
      "#truste_0\\.6809674340869344",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/": [
      "#truste_0\\.8427026020492028",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/19windows-state/": [
      "#truste_0\\.6857296650015413",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/": [
      "#truste_0\\.05143994864534018",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-large",
      "div.modal-body.body_max_width_mid_1295493824",
      "h2.modal-headline.text-jumbo",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/20mac-state/": [
      "#truste_0\\.2946356418130849",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1396691874",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/20macintosh-federal/": [
      "#truste_0\\.5249961133721216",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1735946465",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/20windows-federal/": [
      "#truste_0\\.45843140895168555",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_20981218",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/20windows-state/": [
      "#truste_0\\.18517860511104023",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_281656430",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/21mac-state/": [
      "#truste_0\\.05539530964604922",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1699540157",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/21macintosh-federal/": [
      "#truste_0\\.2107695250885827",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1572438142",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/21windows-federal/": [
      "#truste_0\\.4596144188145207",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1814861629",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/21windows-state/": [
      "#truste_0\\.9919978284977405",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_412990577",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/22mac-state/": [
      "#truste_0\\.16879261471563045",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_500804892",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/22macintosh-federal/": [
      "#truste_0\\.4251025875509359",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_585855453",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/22windows-federal/": [
      "#truste_0\\.1260343703876976",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_644262820",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/22windows-state/": [
      "#truste_0\\.13218162201199524",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1107637584",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/23mac-state/": [
      "#truste_0\\.41920530717637816",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_697930373",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/23macintosh-federal/": [
      "#truste_0\\.7714745296407453",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_400727236",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/23windows-federal/": [
      "#truste_0\\.35255300454439553",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1191580027",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/23windows-state/": [
      "#truste_0\\.3461908273409432",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1802284591",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/24mac-state/": [
      "#truste_0\\.7586757524919954",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1896665638",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/24macintosh-federal/": [
      "#truste_0\\.8913579485856388",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1387309925",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/24windows-federal/": [
      "#truste_0\\.7190998696942046",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1267544422",
      "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
      "div.spike-content > div:nth-child(5)",
      "#overlay-suggestions-list",
      "#overlay_search",
      "div.spike-content",
      "#site-search"
    ],
    "https://www.hrblock.com/taxes/products/software/updates/24windows-state/": [
      "#truste_0\\.33516966177932506",
      "#spike-popup",
      "#ciam-login-app",
      "div.modal-body.body_max_width_mid_167066974",
      "div.modal-header",
      "h2.modal-headline.text-jumbo",
      "h2.modal-headline.text-medium",
      "div.modal-body.body_max_width_mid_1798035698",
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
  'product-reviews': productReviewsParser,
  'carousel-testimonial': carouselTestimonialParser,
  'breadcrumb': breadcrumbParser,
  'brand-bar': brandBarParser,
  'results-toolbar': resultsToolbarParser,
  'search-articles': searchArticlesParser,
  'hero-resource': heroResourceParser,
  'review-filter': reviewFilterParser,
  'price-estimator': priceEstimatorParser,
  'newsletter-signup': newsletterSignupParser,
  'embed-form': embedFormParser,
  'article-body': articleBodyParser,
  'software-finder': softwareFinderParser,
  'cards-pricing': cardsPricingParser,
  'table-data': tableDataParser,
  'hero-banner': heroBannerParser,
  'lottie-animation': lottieAnimationParser,
  'accordion-media': accordionMediaParser,
  'landing-stack': landingStackParser,
  'cards-tip': cardsTipParser,
  'columns-callout': columnsCalloutParser,
  'cards-product': cardsProductParser,
  'cards-article': cardsArticleParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'columns-feature': columnsFeatureParser,
  'hero-split': heroSplitParser,
  'software-download': softwareDownloadParser,
  'columns-banner': columnsBannerParser,
};

// Parsers the fragments transformer may need (includes blocks shared from other templates).
const fragmentParsers = {
  'accordion-faq': accordionFaqParser,
  'tabs-pill': tabsPillParser,
  'product-reviews': productReviewsParser,
  'carousel-testimonial': carouselTestimonialParser,
  'breadcrumb': breadcrumbParser,
  'brand-bar': brandBarParser,
  'results-toolbar': resultsToolbarParser,
  'search-articles': searchArticlesParser,
  'hero-resource': heroResourceParser,
  'review-filter': reviewFilterParser,
  'price-estimator': priceEstimatorParser,
  'newsletter-signup': newsletterSignupParser,
  'embed-form': embedFormParser,
  'article-body': articleBodyParser,
  'software-finder': softwareFinderParser,
  'cards-pricing': cardsPricingParser,
  'table-data': tableDataParser,
  'hero-banner': heroBannerParser,
  'lottie-animation': lottieAnimationParser,
  'accordion-media': accordionMediaParser,
  'landing-stack': landingStackParser,
  'cards-tip': cardsTipParser,
  'columns-callout': columnsCalloutParser,
  'cards-product': cardsProductParser,
  'cards-article': cardsArticleParser,
  'columns-promo-card': columnsPromoCardParser,
  'cards-icon': cardsIconParser,
  'cards-feature': cardsFeatureParser,
  'promo-strip': promoStripParser,
  'columns-feature': columnsFeatureParser,
  'hero-split': heroSplitParser,
  'software-download': softwareDownloadParser,
  'columns-banner': columnsBannerParser,
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
