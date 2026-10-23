/* eslint-disable */
/* global WebImporter */

import articleBodyParser from './parsers/article-body.js';
import breadcrumbParser from './parsers/breadcrumb.js';
import columnsBannerParser from './parsers/columns-banner.js';
import articleFeedbackParser from './parsers/article-feedback.js';
import tableDataParser from './parsers/table-data.js';
import cardsArticleParser from './parsers/cards-article.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
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
  "name": "resource-article",
  "urls": [
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/",
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/"
  ],
  "description": "Expat resource-center article (WordPress expat-2022 theme) with a left meta sidebar (read time, date, author, reviewer, share links), breadcrumb, title, Key Takeaways excerpt, featured image, long body copy with ways-to-file link pairs, tables and images, article helpful vote, recommended articles, testimonials and tax help CTA, using the expat sub-site header",
  "blocks": [
    {
      "name": "article-body",
      "instances": [
        "#site-content > section.container.ba-article"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/": [
          "#site-content > section.container.ba-article"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/": [
          "#site-content > section.container.ba-article"
        ]
      }
    },
    {
      "name": "breadcrumb",
      "instances": [
        "#site-content > section.container.ba-article div.ba--breadcrumbs"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
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
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(9)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(13)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(29)",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(9)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(13)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div:nth-child(29)",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/": [
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
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
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
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
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure.wp-block-table.is-style-stripes"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure.wp-block-table"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(12)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(19)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure.wp-block-table"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(23)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(26)"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(18)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(30)",
          "#site-content > section.container.ba-article > div > div.col-8.desktop-small > figure:nth-child(96)"
        ]
      }
    },
    {
      "name": "cards-article",
      "instances": [
        "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)"
      ],
      "pageInstances": {
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
          "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
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
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
          "#site-content > section.full-width.gray-background"
        ],
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
          "#site-content > section.full-width.gray-background"
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
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/": [
      "#universal-skip-to-content"
    ],
    "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/": [
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
