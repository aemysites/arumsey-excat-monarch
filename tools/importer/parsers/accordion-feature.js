/* eslint-disable */
/* global WebImporter */

/**
 * accordion-feature: one row per item -> [label | panel].
 *
 * Source shapes handled (all generic, no page ids):
 *  - CDS accordion:            cds-accordion2-section (label in [role=heading]/button, panel .cds-accordion2-submenu)
 *  - legacy citi-accordion:    li.citi-accordion-section (.category-title, .accordionSubMenu)
 *  - AEM core accordion:       .cmp-accordion__item (.cmp-accordion__title, .cmp-accordion__panel)
 *  - footnote accordion:       .accordian-footnote (h2.foot-note-heading, .x-foot-note-list)
 *  - retail FAQ (mat list):    .matlist-section (button.accordion-trigger, section.category-content)
 *  - lone call-to-action button that reveals content -> cta-button (one label row)
 *
 * Variants (README option classes):
 *  - no-icons:   legacy citi-accordion (li.citi-accordion-section)
 *  - faq:        CDS accordion inside an app-accordion ".accordion__sections" wrapper
 *  - cta-button: no accordion items, only a button / CTA
 *  - orange/red: cta-button whose button carries an inline background colour (light/warm -> orange, dark -> red)
 *  - plain:      everything else
 */

const ITEM_SELECTOR = [
  'cds-accordion2-section',
  'li.citi-accordion-section',
  '.cmp-accordion__item',
  '.accordian-footnote',
  '.matlist-section',
].join(', ');

const PANEL_SELECTOR = [
  '.cds-accordion2-submenu',
  '.accordionSubMenu',
  '.cmp-accordion__panel',
  'section.category-content',
  '.x-foot-note-list',
  '[role="region"]',
].join(', ');

const LABEL_SELECTOR = [
  '.cmp-accordion__title',
  '.category-title',
  '.foot-note-heading',
  '[role="heading"] h1, [role="heading"] h2, [role="heading"] h3, [role="heading"] h4',
  '.accordion2-header h1, .accordion2-header h2, .accordion2-header h3, .accordion2-header h4',
  'button h1, button h2, button h3, button h4',
].join(', ');

const CHROME_SELECTOR = [
  'button',
  'cds-icon',
  'cds-icon-wrapper',
  'citi-icon2',
  '[role="img"]:not(img)',
  '[role="presentation"]:not(img)',
  '.toggle-accordion',
  '.citi-accordion__expandall-container',
  '.sr-only',
  '.visually-hidden',
].join(', ');

const INLINE_TAGS = new Set(['A', 'ABBR', 'B', 'BR', 'CODE', 'EM', 'I', 'IMG', 'PICTURE', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'U', 'S', 'MARK']);

function stripChrome(root) {
  root.querySelectorAll(CHROME_SELECTOR).forEach((el) => {
    // role=img/presentation wrappers that carry text (e.g. footnote <sup>) are kept
    if (el.matches('[role="img"], [role="presentation"]') && !el.matches('button') && el.textContent.trim()) return;
    el.remove();
  });
  root.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    const text = a.textContent.trim();
    if (/^javascript:/i.test(href)) {
      if (text) a.replaceWith(...a.childNodes); else a.remove();
      return;
    }
    if (!text && !a.querySelector('img, picture')) a.remove();
  });
}

/** Turn text-only divs into paragraphs and role=heading divs into headings so html2md keeps structure. */
function normalizeBody(document, body) {
  body.querySelectorAll('div[role="heading"], span[role="heading"]').forEach((el) => {
    const level = Math.min(Math.max(parseInt(el.getAttribute('aria-level'), 10) || 4, 2), 6);
    const h = document.createElement(`h${level}`);
    h.append(...el.childNodes);
    el.replaceWith(h);
  });
  [...body.querySelectorAll('div')].reverse().forEach((div) => {
    if (!div.textContent.trim()) {
      if (!div.querySelector('img, picture, table, iframe')) div.remove();
      return;
    }
    const allInline = [...div.childNodes].every((n) => n.nodeType === 3 || (n.nodeType === 1 && INLINE_TAGS.has(n.tagName)));
    if (allInline) {
      const p = document.createElement('p');
      p.append(...div.childNodes);
      div.replaceWith(p);
    }
  });
}

function labelFor(document, item) {
  const out = document.createElement('div');
  const heading = item.querySelector(LABEL_SELECTOR);
  if (heading && heading.textContent.trim()) {
    const clone = heading.cloneNode(true);
    stripChrome(clone);
    clone.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
    out.append(...clone.childNodes);
  } else {
    const btn = item.querySelector('button');
    const text = btn ? (btn.textContent.trim() || (btn.getAttribute('aria-label') || '')) : '';
    out.textContent = text.replace(/^heading level \d+\s*/i, '').trim();
  }
  // collapse whitespace-only text nodes at the edges
  return out.textContent.trim() ? out : null;
}

function panelFor(item) {
  const direct = [...item.children].find((c) => c.matches(PANEL_SELECTOR));
  if (direct) return direct;
  const nested = item.querySelector(PANEL_SELECTOR);
  if (nested) return nested;
  // footnote style: trigger container followed by a hidden content container
  const kids = [...item.children];
  return kids.length > 1 ? kids[kids.length - 1] : null;
}

function findItems(element) {
  const all = [element, ...element.querySelectorAll(ITEM_SELECTOR)].filter((el) => el.matches(ITEM_SELECTOR));
  return all.filter((it) => !all.some((other) => other !== it && other.contains(it)));
}

function colourVariant(element) {
  const styled = [element, ...element.querySelectorAll('[style]')]
    .find((el) => /background(-color)?\s*:\s*rgb/i.test(el.getAttribute('style') || ''));
  if (!styled) return null;
  const m = (styled.getAttribute('style') || '').match(/background(?:-color)?\s*:\s*rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return null;
  const [r, g, b] = m.slice(1, 4).map(Number);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.25 ? 'orange' : 'red';
}

function detectVariant(element, items) {
  if (!items.length) return colourVariant(element) || 'cta-button';
  if (items.some((it) => it.matches('li.citi-accordion-section'))) return 'no-icons';
  const inAppAccordion = element.closest('.accordion__sections') || element.querySelector('.accordion__sections');
  if (inAppAccordion && items.some((it) => it.matches('cds-accordion2-section'))) return 'faq';
  return null;
}

export default function parse(element, { document, params }) {
  const cells = [];
  const items = findItems(element);
  const variant = detectVariant(element, items);

  items.forEach((item) => {
    const label = labelFor(document, item);
    const panelSrc = panelFor(item);
    const body = document.createElement('div');
    if (panelSrc) {
      stripChrome(panelSrc);
      body.append(...panelSrc.childNodes);
      normalizeBody(document, body);
    }
    const hasBody = body.textContent.trim() || body.querySelector('img, picture, table');
    if (!label && !hasBody) return;
    cells.push([label || 'Details', hasBody ? body : '']);
  });

  if (!items.length) {
    // cta-button: the button text is the label that reveals the (separately authored) content
    const trigger = element.matches('button, a') ? element : element.querySelector('button, a[href]');
    const text = trigger
      ? (trigger.textContent.trim() || trigger.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim()
      : '';
    const isToggleOnly = !text || /^(expand|collapse) all( sections)?$/i.test(text);
    if (isToggleOnly) {
      // UI-only "Expand all" chrome: nothing to author
      element.remove();
      return;
    }
    cells.push([text, '']);
  }

  const name = variant ? `accordion-feature (${variant})` : 'accordion-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
