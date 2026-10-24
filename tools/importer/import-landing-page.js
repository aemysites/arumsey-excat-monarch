/* eslint-disable */
/* global WebImporter */

import alertBannerParser from './parsers/alert-banner.js';
import heroBannerParser from './parsers/hero-banner.js';
import quickLinksParser from './parsers/quick-links.js';
import columnsLinksParser from './parsers/columns-links.js';
import cardsArticleParser from './parsers/cards-article.js';
import heroTitleParser from './parsers/hero-title.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsProductParser from './parsers/cards-product.js';
import accordionPanelParser from './parsers/accordion-panel.js';
import suncorpCleanupTransformer from './transformers/suncorp-cleanup.js';
import suncorpSectionsTransformer from './transformers/suncorp-sections.js';

const PAGE_TEMPLATE = {"name":"landing-page","urls":["https://www.suncorp.com.au/","https://www.suncorp.com.au/insurance/"],"description":"Hub landing page without breadcrumb: full-width hero with text on photo, quick-action link strip, product link columns, a row of offer cards and a terms accordion","blocks":[{"name":"alert-banner","instances":["div.Page div.sg-Cell.key-event"],"pageInstances":{"https://www.suncorp.com.au/":["body > div.Page > div:nth-child(2)"]}},{"name":"hero-banner","instances":["div:has(> section.BgPlaceholder.contentBoxContainer__section)"],"pageInstances":{"https://www.suncorp.com.au/":["#top-banner-canvas"],"https://www.suncorp.com.au/insurance/":["#kzkhhwh","#storm-score > section > div.Middle-column.Middle-column--Thin---Top.Middle-column--Thin---Bottom > div > div > div > div.aem-Grid.aem-Grid--12.aem-Grid--default--12"]}},{"name":"quick-links","instances":["[data-catalog-page-only=\"quick-links\"]"],"pageInstances":{"https://www.suncorp.com.au/":["body > div.Page > main > div > div:nth-child(5)"]}},{"name":"columns-links","instances":["[data-catalog-page-only=\"columns-links\"]"],"pageInstances":{"https://www.suncorp.com.au/":["#ContentBoxContainer_776c9d1040f44289810aaabe3eb7d001 > div:nth-child(2)"],"https://www.suncorp.com.au/insurance/":["#explore-products"]}},{"name":"cards-article","instances":["[data-catalog-page-only=\"cards-article\"]"],"pageInstances":{"https://www.suncorp.com.au/":["#latest-news"]}},{"name":"hero-title","instances":["[data-catalog-page-only=\"hero-title\"]"],"pageInstances":{"https://www.suncorp.com.au/":["body > div.Page > main > div > div:nth-child(8)"]}},{"name":"columns-media","instances":["[data-catalog-page-only=\"columns-media\"]"],"pageInstances":{"https://www.suncorp.com.au/insurance/":["body > div.Page > main > div > div:nth-child(5)","#contact-options > section > div.Middle-column.Middle-column--Thin---Top.Middle-column--Thin---Bottom > div.sg-Grid.overflow-hidden"]}},{"name":"cards-feature","instances":["[data-catalog-page-only=\"cards-feature\"]"],"pageInstances":{"https://www.suncorp.com.au/insurance/":["#FlexibleTable_8b75007d-3da1-414f-9cab-493dbfc5e123","#FlexibleTable_a49afa61-33f5-439e-9176-864a26a5fdc7"]}},{"name":"cards-product","instances":["[data-catalog-page-only=\"cards-product\"]"],"pageInstances":{"https://www.suncorp.com.au/insurance/":["#insurance-statement"]}},{"name":"accordion-panel","instances":["[data-catalog-page-only=\"accordion-panel\"]"],"pageInstances":{"https://www.suncorp.com.au/insurance/":["#terms"]}}],"sections":[{"id":"alert","name":"Site alert band above the page","selector":["div.Page > div:has(> div > div.key-event)"],"style":null,"position":"start","blocks":["alert-banner"],"defaultContent":[]},{"id":"links-band","name":"Grey quick links band","selector":["div.Main-content > div.canvas__container:has(> div.Middle-column.sg-u-flex--centre)"],"style":"light-grey","blocks":["quick-links","columns-links"],"defaultContent":[]},{"id":"content-1","name":"Content section 1","selector":["div.Main-content > div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-2","name":"Content section 2","selector":["div.Main-content > div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-3","name":"Content section 3","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-4","name":"Content section 4","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-5","name":"Content section 5","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-6","name":"Content section 6","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-7","name":"Content section 7","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-8","name":"Content section 8","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-9","name":"Content section 9","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-10","name":"Content section 10","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-11","name":"Content section 11","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]},{"id":"content-12","name":"Content section 12","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["alert-banner","hero-banner","quick-links","columns-links","cards-article","hero-title","columns-media","cards-feature","cards-product","accordion-panel"],"defaultContent":[]}],"pageCleanup":{"https://www.suncorp.com.au/":["#ContentBoxContainer_501ac982ecd049f5ad7425891fee9c57 > div:nth-child(2) > p:nth-child(1) > span:nth-child(1) > a:nth-child(1)","a.sg-Btn.sg-Btn--primary","#experience-modal","#_im_iframe_overlay__248","#insurancequote","#resilience-options","#privacy-optout-banner","#colorbox"],"https://www.suncorp.com.au/insurance/":["div.colBoxContainer.colBoxContainer--center > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)","#FlexibleTable_a49afa61-33f5-439e-9176-864a26a5fdc7 > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)","#FlexibleTable_dbabf67a-2dda-4cab-9bbe-accd52b8199d > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)","#FlexibleTable_908de546-75eb-4f6e-8671-72b98889b7e1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)","#FlexibleTable_7bf8c9b7-eabc-4fc9-af94-b9a01f19b189 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)","#experience-modal","div.sg-Nav-overlay.sg-Nav-overlay--showOnMobile","#_im_iframe_overlay__248","#all-insured-events","#damage-from-physical-home-building","#fatal-injury-compensation-home-building","#prevention-of-access-home-building","#removal-of-debris-building","#accidental-damage-home-building","#safety-net-home-building","#prevention-of-access-home-contents","#exploratory-costs","#exploratory-costs-1","#security-attendance-fees","#lock-replacement","#mortgage-discharge-costs","#environmental-improvements","#damage-to-gardens-and-plants","#other-repair-rebuilding-costs","#removal-of-debris-home-contents","#energy-costs-for-loss-of-supply","#storage-of-undamaged-contents","#temporary-accommodation-costs-home-contents","#personal-valuables-home-and-contents","#safety-net-home-contents","#collections","#prevention-of-access-contents","#contents-commercial-storage","#contents-temporarily-removed","#financial-transaction-card","#visitors-contents","#food-medication-spoilage","#damage-from-physical-contents","#contents-in-transit","#supplementary-expenses","#contents-on-common","#extra-costs-to-re-establish","#fatal-injury-compensation-contents","#paraplegia-quadriplegia-assistance","#removal-of-debris-contents","#temporary-accommodation","#injury-to-pet-dogs","#motor-burnout","#accidental-damage-home-contents","#portable-advantages","#personal-valuables-contents","#legal-liability","#accidental-damage-at-property","#motor-burnout-landlord","#safety-net-landlord","#accidental-damage-contents","#strata-net-costs","#accidental-glass-breakage","#glass-breakage","#excess-free-glass","#home-assist","#find-out-more","#quote","#retrieve-quote","#claims","#policy","#roadside-assist","#dunas","#dunas-building","#dunas-contents-only","#dunas-renters","#dunas-home-contents","#resilience-options","#privacy-optout-banner","#colorbox"]}};

const parsers = {
  'alert-banner': alertBannerParser,
  'hero-banner': heroBannerParser,
  'quick-links': quickLinksParser,
  'columns-links': columnsLinksParser,
  'cards-article': cardsArticleParser,
  'hero-title': heroTitleParser,
  'columns-media': columnsMediaParser,
  'cards-feature': cardsFeatureParser,
  'cards-product': cardsProductParser,
  'accordion-panel': accordionPanelParser,
};

// Section transformers insert <hr> markers, so their beforeTransform runs after block discovery.
const sectionTransformers = [suncorpSectionsTransformer];
const transformers = [suncorpCleanupTransformer, ...sectionTransformers];

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    executeTransformers('beforeTransform', main, payload, transformers.filter((fn) => !sectionTransformers.includes(fn)));
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL);
    executeTransformers('beforeTransform', main, payload, sectionTransformers);

    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
