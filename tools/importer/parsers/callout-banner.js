/* eslint-disable */
/* global WebImporter */

/**
 * Parser: callout-banner
 * Source: suncorp.com.au notice panels (PDS / policy booklet callouts, annual report
 * banner, light content boxes, icon list cells).
 *
 * Block table (blocks/callout-banner/README.md): one row per callout,
 *   [image (optional)] [heading, text, links] [action link (optional)]
 * Font icons (<i class="Icon-...">) carry no text and are stripped by the importer
 * before parsing, so only real images become the media cell.
 *
 * Variant classes (from markup, matching the catalog names):
 *   image-light-2 - a single flextable cell with an inline icon (cellIcon)
 *   button        - panel holds an sg-Btn call-to-action
 *   image-light   - dark icon panel + nested text/arrow flextable on a neutral canvas
 *   image         - dark icon panel + nested text/arrow flextable
 *   light         - tinted / bordered content box without icon panel
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function topLevel(root, selector) {
  const all = [...root.querySelectorAll(selector)];
  return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
}

function detectVariant(element) {
  if (element.matches('.sg-Flextable-cell.cellIcon, .cellIcon')) return 'image-light-2';
  if (element.querySelector('a.sg-Btn')) return 'button';
  if (element.querySelector('.sg-Flextable .sg-Flextable')) {
    return element.querySelector('.canvas__bg_image.BgPlaceholder--neutral') ? 'image-light' : 'image';
  }
  const box = element.matches('.contentBoxContainer') ? element : element.querySelector('.contentBoxContainer');
  if (box && /sg-u-bg|sg-u-border/.test(box.className) && !element.querySelector('.sg-Flextable')) return 'light';
  return null;
}

export default function parse(element, { document, params }) {
  const variant = detectVariant(element);

  // Media: real images only (badge duplicates collapsed to the desktop one).
  const img = [...element.querySelectorAll('img')]
    .find((i) => !i.classList.contains('vs-badge-image') || i.classList.contains('badge-desktop'));

  // Action: sg-Btn link (button option) in its own cell.
  const btn = element.querySelector('a.sg-Btn');
  let action = null;
  if (btn) {
    action = document.createElement('a');
    action.href = btn.getAttribute('href');
    action.textContent = text(btn);
    const holder = btn.closest('p');
    if (holder && text(holder) === text(btn)) holder.remove(); else btn.remove();
  }

  const content = document.createElement('div');
  topLevel(element, 'div.rte, .text-wrapper').forEach((rte) => {
    rte.querySelectorAll('style').forEach((s) => s.remove());
    rte.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    content.append(...rte.childNodes);
  });
  // An icon link wrapping a PDS icon is the panel's own target; keep it when the
  // text has no link of its own.
  if (!content.querySelector('a')) {
    const iconLink = [...element.querySelectorAll('a[href]')].find((a) => !content.contains(a) && a !== btn);
    if (iconLink && text(iconLink)) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = iconLink.getAttribute('href');
      a.textContent = text(iconLink);
      p.append(a);
      content.append(p);
    }
  }

  const row = [];
  if (img) row.push(img);
  row.push(content.childNodes.length ? content : '');
  if (action) row.push(action);

  const name = variant ? `callout-banner (${variant})` : 'callout-banner';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
  element.replaceWith(block);
}
