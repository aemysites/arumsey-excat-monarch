/* eslint-disable */
/* global WebImporter */

/**
 * H&R Block shared-content fragments (beforeTransform).
 *
 * For each fragment in FRAGMENTS whose `pages` include the current page, moves
 * the block's element into a holder div, puts a `fragment` block linking to the
 * fragment path in its place, runs the block's parser on the moved element and
 * pushes { element: holder, path } onto params.fragments. Block discovery runs
 * after this transformer, so it never sees the moved element.
 *
 * Generated from migration-work/fragments.json (catalog blocks[].shared groups
 * of 5+ pages). Each import script passes its parsers as payload.fragmentParsers.
 */

import { themeStyle, bandStyle, LAYOUT_ATTRIBUTE } from './hrblock-sections.js';

const FRAGMENTS = [
  {
    "block": "hero-split",
    "path": "/fragments/software-back-editions-hero",
    "pages": [
      "https://www.hrblock.com/tax-software/updates-back-editions/",
      "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
      "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
      "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
      "https://www.hrblock.com/taxes/products/software/updates/17windows-state/",
      "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/",
      "https://www.hrblock.com/taxes/products/software/updates/18mac-state/",
      "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/",
      "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/",
      "https://www.hrblock.com/taxes/products/software/updates/19mac-state/",
      "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/",
      "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/",
      "https://www.hrblock.com/taxes/products/software/updates/19windows-state/",
      "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/"
    ],
    "selector": "main > div.root > div.cmp-container > div.cmp-container > section.column-control.two-column-control:first-of-type",
    "variantId": "v_d9f1559ec23d"
  },
  {
    "block": "columns-banner",
    "path": "/fragments/expat-tax-help-cta",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/all-topics/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/search/"
    ],
    "selector": "#site-content > section.ba-cta",
    "variantId": "v_21d4b91fbd3d"
  },
  {
    "block": "columns-banner",
    "path": "/fragments/expat-steps-to-prep",
    "pages": [
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/"
    ],
    "selector": "#site-content > section.steps-to-prep > div.stp-steps",
    "variantId": "v_fa7ac5da97e7"
  },
  {
    "block": "columns-banner",
    "path": "/fragments/software-updates-banner",
    "pages": [
      "https://www.hrblock.com/tax-software/updates-back-editions/",
      "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
      "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
      "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
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
      "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/"
    ],
    "selector": "main div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control:has(ul.sm-md-column-reverse)",
    "variantId": "v_0e77d41ea13d"
  },
  {
    "block": "carousel-testimonial",
    "path": "/fragments/expat-testimonials",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/"
    ],
    "selector": "#site-content > section.full-width.gray-background",
    "variantId": "v_72964d82c31a"
  },
  {
    "block": "cards-feature",
    "path": "/fragments/software-guarantees",
    "pages": [
      "https://www.hrblock.com/tax-software/updates-back-editions/",
      "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
      "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
      "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
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
      "https://www.hrblock.com/taxes/products/software/updates/whyrequired/"
    ],
    "selector": "main div.cmp-container > section.column-control:has(li.col-3 article.card-stacked)",
    "variantId": "v_2682772f3903"
  },
  {
    "block": "promo-strip",
    "path": "/fragments/software-update-promo",
    "pages": [
      "https://www.hrblock.com/tax-software/updates-back-editions/",
      "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
      "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
      "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
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
      "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/"
    ],
    "selector": "main div.cmp-container > div.xf-content-height:has(.alignBanner)",
    "variantId": "v_9bb910e3643f"
  },
  {
    "block": "cards-icon",
    "path": "/fragments/guarantees-cards",
    "pages": [
      "https://www.hrblock.com/corporate/",
      "https://www.hrblock.com/support/",
      "https://www.hrblock.com/support/contact-options/",
      "https://www.hrblock.com/tax-offices/make-appointment/",
      "https://www.hrblock.com/tax-offices/our-tax-pros/",
      "https://www.hrblock.com/tax-offices/tax-prep/extended-service/",
      "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/",
      "https://www.hrblock.com/no-surprise-guarantee/"
    ],
    "selector": "main div.xf-content-height:has(.testimonial-card) div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)",
    "variantId": "v_3bdad2f1bab2"
  },
  {
    "block": "columns-stats",
    "path": "/fragments/office-stats-banner",
    "pages": [
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
      "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/"
    ],
    "selector": "main div.xf-content-height div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .card-secondary.featurecard):has(> div.container > ul > li.col-2 .introImageVariant)",
    "variantId": "v_cf1ee5bfe8db"
  },
  {
    "block": "cards-feature",
    "path": "/fragments/office-more-help-cards",
    "pages": [
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
      "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/"
    ],
    "selector": "main div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control:has(li.col-2 .card-inset)",
    "variantId": "v_2682772f3903"
  },
  {
    "block": "cards-icon",
    "path": "/fragments/guarantees-cards-forest",
    "pages": [
      "https://www.hrblock.com/dsar/",
      "https://www.hrblock.com/filing-options-and-products/",
      "https://www.hrblock.com/tax-offices/drop-off/",
      "https://www.hrblock.com/tax-offices/office-tax-preparation/",
      "https://www.hrblock.com/tax-offices/virtual-tax-preparation/",
      "https://www.hrblock.com/tax-offices/peace-of-mind-claims/",
      "https://www.hrblock.com/tax-prep-checklist/"
    ],
    "selector": "main div.xf-content-height:has(.testimonial-card) div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)",
    "variantId": "v_ffbd17ad1926"
  },
  {
    "block": "cards-article",
    "path": "/fragments/expat-country-grid",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/"
    ],
    "selector": "#site-content section.expat-hp-countries div.expat-hp-countries--grid",
    "variantId": "v_b183ecee1a7b"
  },
  {
    "block": "columns-banner",
    "path": "/fragments/expat-ways-to-file",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
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
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/"
    ],
    "selector": "#site-content > section.container.ba-article div.wp-block-create-block-hrb-expat-ways-to-file",
    "variantId": "v_f021fe2b05b9",
    "all": true
  },
  {
    "block": "cards-article",
    "path": "/fragments/expat-recommended-feie",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/"
    ],
    "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
    "variantId": "v_7b405275c780"
  },
  {
    "block": "cards-article",
    "path": "/fragments/expat-recommended-state-taxes",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/"
    ],
    "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
    "variantId": "v_7b405275c780"
  },
  {
    "block": "cards-article",
    "path": "/fragments/expat-recommended-forms",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/"
    ],
    "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
    "variantId": "v_7b405275c780"
  },
  {
    "block": "cards-article",
    "path": "/fragments/expat-recommended-income",
    "pages": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/",
      "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/"
    ],
    "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
    "variantId": "v_7b405275c780"
  },
  {
    "block": "carousel-testimonial",
    "path": "/fragments/testimonials-forest",
    "pages": [
      "https://www.hrblock.com/dsar/",
      "https://www.hrblock.com/filing-options-and-products/",
      "https://www.hrblock.com/corporate/our-company/",
      "https://www.hrblock.com/financial-services/tax-refund-payment/",
      "https://www.hrblock.com/tax-prep-checklist/"
    ],
    "selector": "main div.xf-content-height div.cmp-container > section.column-control.spruce-forest-theme:has(figure.testimonial-card)"
  }
];

const FRAGMENT_ATTR = 'data-excat-fragment-style';
const THEME_TAGS = 'section, div.container, div.showhide-table';

/**
 * Section style of the source element: its own theme class, a matching
 * template.sections[] entry, the enclosing themed band, or the first themed
 * band inside it ('' = default).
 */
function fragmentStyle(source, sections) {
  const own = themeStyle(source);
  if (own !== undefined) return own;
  for (const section of sections) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector].filter(Boolean);
    if (selectors.some((sel) => { try { return source.matches(sel); } catch (e) { return false; } })) {
      return section.style || '';
    }
  }
  for (let p = source.parentElement; p; p = p.parentElement) {
    const s = p.matches(THEME_TAGS) ? themeStyle(p) : undefined;
    if (s !== undefined) return s;
  }
  const inner = [...source.querySelectorAll(THEME_TAGS)].find((el) => themeStyle(el) !== undefined);
  return inner ? themeStyle(inner) : '';
}

function pageKey(u) {
  try {
    const { origin, pathname } = new URL(u);
    return `${origin}${pathname.replace(/\/$/, '')}`;
  } catch (e) {
    return u;
  }
}

function pageUrl(payload) {
  const { params = {} } = payload;
  return params.originalURL || payload.originalURL || payload.url || '';
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document, params = {}, fragmentParsers = {} } = payload;
  if (!Array.isArray(params.fragments)) params.fragments = [];
  const key = pageKey(pageUrl(payload));

  FRAGMENTS.forEach((frag) => {
    if (!frag.pages.some((p) => pageKey(p) === key)) return;
    const parser = fragmentParsers[frag.block];
    if (!parser) {
      console.warn(`hrblock-fragments: no parser for ${frag.block}; leaving inline`);
      return;
    }
    let matches = [];
    try { matches = [...document.querySelectorAll(frag.selector)]; } catch (e) { return; }
    // `all: true` fragments recur several times on a page (identical copies):
    // every copy becomes a link, the first one is parsed into the fragment.
    if (!matches.length || (matches.length > 1 && !frag.all)) {
      console.warn(`hrblock-fragments: ${frag.selector} matched ${matches.length} elements on ${key}; leaving inline`);
      return;
    }
    const source = matches[0];
    matches.slice(1).forEach((copy) => {
      const copyLink = document.createElement('a');
      copyLink.href = frag.path;
      copyLink.textContent = frag.path;
      const copyBlock = WebImporter.Blocks.createBlock(document, { name: 'Fragment', cells: [[copyLink]] });
      copyBlock.setAttribute(FRAGMENT_ATTR, fragmentStyle(copy, (payload.template && payload.template.sections) || []));
      copy.replaceWith(copyBlock);
    });
    const sections = (payload.template && payload.template.sections) || [];
    const style = fragmentStyle(source, sections);

    const link = document.createElement('a');
    link.href = frag.path;
    link.textContent = frag.path;
    const fragmentBlock = WebImporter.Blocks.createBlock(document, { name: 'Fragment', cells: [[link]] });
    // hrblock-sections gives the placeholder a section of its own.
    fragmentBlock.setAttribute(FRAGMENT_ATTR, style);
    source.replaceWith(fragmentBlock);

    // layout of the source band (measured by hrblock-sections), read before parsing
    const docStyle = bandStyle(source, style);
    const holder = document.createElement('div');
    holder.append(source);
    try {
      parser(source, { document, url: payload.url, params });
    } catch (e) {
      console.error(`hrblock-fragments: failed to parse ${frag.block} for ${frag.path}:`, e);
    }
    // fragment.js swaps the placeholder's section for the fragment's sections,
    // so the fragment document carries the source band's style itself (colour
    // + the band's measured layout: padding / alignment, see hrblock-sections).
    holder.querySelectorAll(`[${LAYOUT_ATTRIBUTE}]`).forEach((el) => el.removeAttribute(LAYOUT_ATTRIBUTE));
    if (docStyle) {
      holder.append(WebImporter.Blocks.createBlock(document, { name: 'Section Metadata', cells: { style: docStyle } }));
    }
    params.fragments.push({ element: holder, path: frag.path });
  });
}
