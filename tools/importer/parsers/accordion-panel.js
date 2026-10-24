/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-panel
 * Source: suncorp.com.au sg-Accordion components (FAQ grids, "Things you should know").
 *
 * Block table (blocks/accordion-panel/README.md):
 *   - one row per question: label | answer
 *   - single-cell rows: extra content (intro heading, "View all FAQs" link)
 *   - `sidebar` option: the last single-cell row is the side column
 * Answers holding complex markup (flextables, grids, tables, images, video) are
 * moved to a fragment: the cell holds the /fragments/ link, the content goes onto
 * params.fragments as { element, path } (the block loads it with loadFragment).
 *
 * Variant classes (decided from markup, matching the catalog names):
 *   terms      - label is pre-selected / panel open (disclaimer style), or the
 *                matched element is the bare accordion button
 *   lined      - accordion lives in a flextable cell (policy-documents lists)
 *   sidebar    - grid where at least one column has accordions and another has none
 *   two-column - grid with accordions in two or more columns
 */

const COMPLEX = '.sg-Flextable, .sg-Grid, table, img, picture, video, iframe, .sg-Accordion, .youtubevideo';

function pagePath(document, params) {
  let u = params && params.originalURL;
  if (!u) {
    try {
      const canonical = document.querySelector('link[rel="canonical"]');
      u = (canonical && canonical.href) || document.location.href;
    } catch (e) { /* ignore */ }
  }
  try {
    const p = new URL(u).pathname.replace(/\.html?$/, '').replace(/^\/+|\/+$/g, '');
    return p || 'index';
  } catch (e) {
    return 'page';
  }
}

function slugify(s) {
  return (s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'item';
}

function fragmentPath(document, params, label) {
  const base = `/fragments/${pagePath(document, params)}/${slugify(label)}`;
  const used = (params && params.fragments) ? params.fragments.map((f) => f.path) : [];
  let path = base;
  let n = 2;
  while (used.includes(path)) { path = `${base}-${n}`; n += 1; }
  return path;
}

function cleanTree(root) {
  // Flextable badge images are repeated once per breakpoint; keep the desktop one.
  root.querySelectorAll('img.vs-badge-image:not(.badge-desktop)').forEach((img) => img.remove());
  root.querySelectorAll('style').forEach((s) => s.remove());
  // Tooltip triggers (javascript: links) become plain text.
  root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
}

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function hasContent(el) {
  return !!(text(el) || el.querySelector('img, picture, video, iframe, table'));
}

/** Outermost accordion containers under root (root itself when it is one). */
function topAccordions(root) {
  if (root.matches('.sg-Accordion')) return [root];
  return [...root.querySelectorAll('.sg-Accordion')]
    .filter((acc) => !acc.parentElement.closest('.sg-Accordion') || !root.contains(acc.parentElement.closest('.sg-Accordion')));
}

function buildItem(acc, document, params) {
  // The label and panel sit directly in .sg-Accordion or inside one wrapper div.
  const label = acc.matches('button') ? acc : acc.querySelector(
    ':scope > .sg-Accordion-label, :scope > button, :scope > div > .sg-Accordion-label, :scope > div > button',
  );
  let panel = null;
  if (label && label.getAttribute('aria-controls')) {
    const id = label.getAttribute('aria-controls');
    panel = [...(acc.matches('button') ? acc.parentElement || acc : acc).querySelectorAll('.sg-Accordion-content')]
      .find((p) => p.id === id) || null;
    if (!panel && acc.matches('button')) {
      const next = acc.nextElementSibling;
      if (next && next.matches('.sg-Accordion-content')) panel = next;
    }
  }
  if (!panel && !acc.matches('button')) {
    panel = acc.querySelector(':scope > .sg-Accordion-content, :scope > div > .sg-Accordion-content');
  }

  const labelText = text(label) || 'Details';
  const body = document.createElement('div');
  if (panel) {
    cleanTree(panel);
    body.append(...panel.childNodes);
    if (acc.matches('button')) panel.remove();
  }

  let bodyCell = body.childNodes.length ? body : '';
  if (body.querySelector(COMPLEX) && params && Array.isArray(params.fragments)) {
    const path = fragmentPath(document, params, labelText);
    params.fragments.push({ element: body, path });
    const link = document.createElement('a');
    link.href = path;
    link.textContent = path;
    bodyCell = link;
  }
  // A question authored as a heading (FAQ answer pages: <h2 class="sg-Accordion-label">)
  // keeps its heading level in the label cell; the block unwraps a lone heading into
  // its <summary>, so rendering is unchanged. Button / div labels stay plain text.
  if (label && /^H[1-6]$/.test(label.tagName) && text(label)) {
    const h = document.createElement(label.tagName.toLowerCase());
    h.textContent = labelText;
    return [h, bodyCell];
  }
  return [labelText, bodyCell];
}

function detectVariant(element, accordions) {
  const first = accordions[0];
  const label = first && (first.matches('button') ? first : first.querySelector('.sg-Accordion-label'));
  if (element.matches('button')) return 'terms';
  if (label && (label.classList.contains('is-selected')
    || (first.querySelector && first.querySelector(':scope > .sg-Accordion-content.is-open')))) return 'terms';
  if (element.matches('.sg-Flextable-cell, .sg-Flextable') || element.closest('.sg-Flextable-cell')) return 'lined';
  const row = element.querySelector('.sg-Grid-row');
  if (row) {
    const cols = [...row.children].filter((c) => /sg-Grid-col/.test(c.className) && hasContent(c));
    const withAcc = cols.filter((c) => c.querySelector('.sg-Accordion'));
    if (cols.length >= 2 && withAcc.length >= 1 && withAcc.length < cols.length) return 'sidebar';
    if (withAcc.length >= 2) return 'two-column';
  }
  return null;
}

export default function parse(element, { document, params }) {
  const accordions = topAccordions(element);
  const variant = detectVariant(element, accordions);
  const cells = [];

  // Side column (sidebar option): grid columns without any accordion.
  let asideCols = [];
  if (variant === 'sidebar') {
    const row = element.querySelector('.sg-Grid-row');
    asideCols = [...row.children].filter((c) => /sg-Grid-col/.test(c.className)
      && hasContent(c) && !c.querySelector('.sg-Accordion'));
  }
  const inAside = (el) => asideCols.some((c) => c.contains(el));

  if (element.matches('button, .sg-Accordion')) {
    cells.push(buildItem(element, document, params));
    // Each FAQ item is often matched on its own; fold directly adjacent sibling
    // accordions into this block (the importer skips detached elements).
    if (element.matches('.sg-Accordion')) {
      let next = element.nextElementSibling;
      while (next && next.matches('.sg-Accordion')
        && !next.querySelector(':scope > .sg-Accordion-content.is-open')) {
        const following = next.nextElementSibling;
        cells.push(buildItem(next, document, params));
        next.remove();
        next = following;
      }
    }
  } else {
    // Walk content units in document order: accordions become item rows, other
    // rich-text / content boxes become single-cell rows.
    const units = [...element.querySelectorAll('.sg-Accordion, div.rte, .contentBoxContainer')]
      .filter((el) => !inAside(el))
      .filter((el) => {
        const outer = el.parentElement && el.parentElement.closest('.sg-Accordion, div.rte, .contentBoxContainer');
        return !outer || !element.contains(outer);
      });
    units.forEach((unit) => {
      if (unit.matches('.sg-Accordion')) {
        cells.push(buildItem(unit, document, params));
      } else if (hasContent(unit)) {
        cleanTree(unit);
        const cell = document.createElement('div');
        cell.append(...unit.childNodes);
        cells.push([cell]);
      }
    });
  }

  if (asideCols.length) {
    const aside = document.createElement('div');
    asideCols.forEach((col) => {
      cleanTree(col);
      aside.append(...col.childNodes);
    });
    cells.push([aside]);
  }

  // Item rows have 2 cells; single-cell rows are intentional (extra content).
  const name = variant ? `accordion-panel (${variant})` : 'accordion-panel';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
