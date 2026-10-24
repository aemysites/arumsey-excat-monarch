/* eslint-disable */
/* global WebImporter */

/**
 * Parser: alert-banner
 * Source: suncorp.com.au site notification band above the page
 * (div.sg-Cell.key-event > .key-event--details, close button .key-event-close-btn).
 *
 * Block table (blocks/alert-banner/README.md): one row, cells
 *   [icon (optional, :name: token)] [message text with links]
 * - The icon font glyph arrives as a :name: token (snapshot preprocessing); the
 *   per-breakpoint copies are already collapsed to one.
 * - The close button is rendered by the block, so it is not imported.
 */

function tokenOf(el) {
  const m = (el && el.textContent ? el.textContent : '').match(/:[a-z][a-z0-9-]*:/);
  return m ? m[0] : '';
}

export default function parse(element, { document }) {
  const details = element.querySelector('.key-event--details') || element;
  const iconHolder = details.querySelector('.image-wrapper');
  const icon = tokenOf(iconHolder);

  const textHolder = details.querySelector('.text-wrapper .rte, .text-wrapper, .rte') || details;
  const message = document.createElement('div');
  const paras = [...textHolder.querySelectorAll('p')].filter((p) => p.textContent.trim());
  if (paras.length) {
    paras.forEach((p) => {
      const np = document.createElement('p');
      np.innerHTML = p.innerHTML;
      message.append(np);
    });
  } else if (textHolder.textContent.trim()) {
    const np = document.createElement('p');
    np.innerHTML = textHolder.innerHTML;
    message.append(np);
  }
  // keep the message free of the icon token and the close control
  message.querySelectorAll('a[href^="javascript"]').forEach((a) => a.remove());

  const cells = [[icon || '', message]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'alert-banner', cells });
  element.replaceWith(block);
}
