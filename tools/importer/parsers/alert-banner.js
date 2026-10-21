/* eslint-disable */
/* global WebImporter */

/**
 * alert-banner: one row, one cell holding the message text (with its link).
 * The info icon (inline SVG) and close button are UI chrome rendered by the block.
 * An <img> icon, when the source has one, goes into an optional second cell.
 */
export default function parse(element, { document, params }) {
  const cells = [];

  // strip UI chrome: close buttons, icon SVG wrappers, screen-reader duplicates
  element.querySelectorAll('button, .sr-only, .visually-hidden, .cds-banner-alert-close-wrap').forEach((el) => el.remove());

  const iconImg = element.querySelector('.cds-banner-alert-icon img, [class*="alert-icon"] img');
  element.querySelectorAll('cds-icon, [role="img"]:not(img), svg').forEach((el) => el.remove());

  let messages = [...element.querySelectorAll('.cds-banner-alert-content, [class*="alert-content"] p')];
  messages = messages.filter((m) => !messages.some((o) => o !== m && o.contains(m)));
  if (!messages.length) {
    messages = [...element.querySelectorAll('p')];
  }

  const content = [];
  messages.forEach((m) => {
    if (!m.textContent.trim()) return;
    const p = document.createElement('p');
    // unwrap span wrappers, keep links / emphasis
    [...m.childNodes].forEach((n) => {
      if (n.nodeType === 1 && n.tagName === 'SPAN') p.append(...n.childNodes);
      else p.append(n);
    });
    content.push(p);
  });

  if (!content.length && element.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = element.textContent.replace(/\s+/g, ' ').trim();
    content.push(p);
  }

  if (iconImg) cells.push([content, iconImg]);
  else cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'alert-banner', cells });
  element.replaceWith(block);
}
