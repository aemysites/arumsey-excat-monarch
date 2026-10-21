/* eslint-disable */
/* global WebImporter */

/**
 * accordion-disclosure: one row per disclosure item -> [label | body].
 *
 * Source shapes handled:
 *  - Angular CDS accordion: cds-accordion2-section ([role=heading] label, .cds-accordion2-submenu body)
 *  - AEM core accordion: .cmp-accordion__item (.cmp-accordion__title label, .cmp-accordion__panel body)
 *
 * Variants:
 *  - with-table: body contains a styled data table (table.cds-table or a table with th/thead)
 *  - with-table-borderless-table: body contains a plain legacy table (no header cells)
 *  - plain: no table
 */

const UI_CHROME = [
  'button',
  'cds-icon',
  '[role="img"]:not(img)',
  '[role="presentation"]:not(img)',
  '.citi-accordion__expandall-container',
  '.sr-only',
  '.visually-hidden',
];

function cleanBody(body) {
  UI_CHROME.forEach((sel) => {
    body.querySelectorAll(sel).forEach((el) => {
      // icon wrappers sometimes hold the (empty) duplicate go-back link: drop them entirely;
      // role=img/presentation wrappers that carry text (e.g. footnote <sup>) are kept
      if (el.matches('[role]:not(button)') && !el.matches('button') && el.textContent.trim()) return;
      el.remove();
    });
  });
  body.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    const text = (a.textContent || '').trim();
    if (/^javascript:/i.test(href)) {
      // non-functional "Go back" footnote links: drop
      if (!text || /^go back$/i.test(text)) a.remove();
      else a.replaceWith(...a.childNodes);
      return;
    }
    if (!text && !a.querySelector('img, picture')) {
      // keep footnote anchor targets as ids on their parent when possible
      if (a.id && a.parentElement && !a.parentElement.id) a.parentElement.id = a.id;
      a.remove();
    }
  });
  return body;
}

function getLabel(item) {
  const heading = item.querySelector(
    '.cmp-accordion__title, [role="heading"] h1, [role="heading"] h2, [role="heading"] h3, [role="heading"] h4, .accordion2-header',
  );
  let text = heading ? heading.textContent : '';
  if (!text.trim()) {
    const btn = item.querySelector('button');
    text = (btn && (btn.textContent.trim() || btn.getAttribute('aria-label'))) || '';
  }
  return text.replace(/\s+/g, ' ').trim();
}

function getBody(item) {
  return item.querySelector(':scope > .cds-accordion2-submenu, :scope > .cmp-accordion__panel')
    || item.querySelector('.cds-accordion2-submenu, .cmp-accordion__panel, [role="region"]');
}

function findItems(element) {
  let items = [...element.querySelectorAll('cds-accordion2-section')];
  if (!items.length) items = [...element.querySelectorAll('.cmp-accordion__item')];
  // keep only outermost items (nested accordions stay inside the parent body)
  return items.filter((it) => !items.some((other) => other !== it && other.contains(it)));
}

function detectVariant(element) {
  const tables = [...element.querySelectorAll('table')];
  if (!tables.length) return null;
  const styled = tables.some((t) => t.classList.contains('cds-table') || t.querySelector('th, thead'));
  return styled ? 'with-table' : 'with-table-borderless-table';
}

export default function parse(element, { document, params }) {
  const cells = [];
  const variant = detectVariant(element);

  findItems(element).forEach((item) => {
    const label = getLabel(item);
    const bodySrc = getBody(item);
    const body = document.createElement('div');
    if (bodySrc) {
      cleanBody(bodySrc);
      body.append(...bodySrc.childNodes);
    }
    const hasContent = body.textContent.trim() || body.querySelector('img, picture, table');
    if (!label && !hasContent) return;
    cells.push([label || 'Details', hasContent ? body : '']);
  });

  if (!cells.length) {
    // fallback: whole element as a single disclosure
    const heading = element.querySelector('h1, h2, h3, h4');
    const label = heading ? heading.textContent.trim() : 'Details';
    if (heading) heading.remove();
    cleanBody(element);
    const body = document.createElement('div');
    body.append(...element.childNodes);
    cells.push([label, body]);
  }

  const name = variant ? `accordion-disclosure (${variant})` : 'accordion-disclosure';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
