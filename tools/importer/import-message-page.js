/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import tagLabelParser from './parsers/tag-label.js';
import accordionPanelParser from './parsers/accordion-panel.js';
import suncorpCleanupTransformer from './transformers/suncorp-cleanup.js';
import suncorpSectionsTransformer from './transformers/suncorp-sections.js';

const PAGE_TEMPLATE = {"name":"message-page","urls":["https://www.suncorp.com.au/contact-us/thank-you.html","https://www.suncorp.com.au/insurance/faqs/ctp/difference-between-ctp-comprehensive.html"],"description":"Short page with no breadcrumb: photo banner carrying a boxed title, then a single centred message panel with one call-to-action","blocks":[{"name":"hero-banner","instances":["main div:has(> section.BgPlaceholder.canvas--responsive_image.canvas__contents--align_bottom)"],"pageInstances":{"https://www.suncorp.com.au/contact-us/thank-you.html":["body > div.Page > main > div > div:nth-child(1)"]}},{"name":"tag-label","instances":["[data-catalog-page-only=\"tag-label\"]"],"pageInstances":{"https://www.suncorp.com.au/contact-us/thank-you.html":["body > div.Page > main > div > div:nth-child(2)"]}},{"name":"accordion-panel","instances":["main div.sg-Accordion.sg-Accordion--block"],"pageInstances":{"https://www.suncorp.com.au/insurance/faqs/ctp/difference-between-ctp-comprehensive.html":["main div.sg-Accordion.sg-Accordion--block"]}}],"sections":[{"id":"content-1","name":"Content section 1","selector":["div.Main-content > div.canvas__container"],"style":null,"blocks":["hero-banner","tag-label","accordion-panel"],"defaultContent":[]},{"id":"content-2","name":"Content section 2","selector":["div.Main-content > div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["hero-banner","tag-label","accordion-panel"],"defaultContent":[]},{"id":"content-3","name":"Content section 3","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["hero-banner","tag-label","accordion-panel"],"defaultContent":[]},{"id":"content-4","name":"Content section 4","selector":["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"],"style":null,"blocks":["hero-banner","tag-label","accordion-panel"],"defaultContent":[]}],"pageCleanup":{"https://www.suncorp.com.au/contact-us/thank-you.html":["#_im_iframe_overlay__248","#privacy-optout-banner","#colorbox"],"https://www.suncorp.com.au/insurance/faqs/ctp/difference-between-ctp-comprehensive.html":["#experience-modal","div.sg-Nav-overlay.sg-Nav-overlay--showOnMobile","#_im_iframe_overlay__248","#privacy-optout-banner","#colorbox"]}};

const parsers = {
  'hero-banner': heroBannerParser,
  'tag-label': tagLabelParser,
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
