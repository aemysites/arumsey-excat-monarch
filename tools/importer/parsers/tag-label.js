/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tag-label
 * Source: suncorp.com.au tag lines ("NOT COVERED" experience fragment, article topic
 * tag links), short labelled flextable cells and small notice panels.
 *
 * Block table (blocks/tag-label/README.md): one row, each cell one item; a short
 * text or link becomes a chip, a cell with a heading or several paragraphs becomes
 * a callout panel. Topic tag paragraphs give one link cell per tag.
 *
 * Variant classes (from markup, matching the catalog names):
 *   not-covered - tag-lines experience fragment / primary tag line text
 *   alt         - row of topic tag links (sg-Type--tagLine)
 *   cyan        - dark (cyan) flextable label cell
 *   grey        - light flextable label cell
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function detectVariant(element) {
  if (element.matches('.cmp-experiencefragment--tag-lines') || element.querySelector('.cmp-experiencefragment--tag-lines, .sg-Type--tagLinePrimary')) return 'not-covered';
  const tags = element.matches('.sg-Type--tagLine') ? [element] : [...element.querySelectorAll('.sg-Type--tagLine')];
  if (tags.length && tags.some((t) => t.querySelector('a[href]'))) return 'alt';
  const cell = element.matches('.sg-Flextable-cell') ? element : null;
  if (cell && /sg-Flextable-cell--(dark|secondary)/.test(cell.className)) return 'cyan';
  if (cell) return 'grey';
  return null;
}

export default function parse(element, { document, params }) {
  const variant = detectVariant(element);
  element.querySelectorAll('style, script').forEach((e) => e.remove());
  element.querySelectorAll('a[href^="javascript"], a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));

  let row = [];
  if (variant === 'alt') {
    const tags = element.matches('.sg-Type--tagLine') ? [element] : [...element.querySelectorAll('.sg-Type--tagLine')];
    row = tags.map((tag) => {
      const a = tag.querySelector('a[href]');
      if (!a) return text(tag);
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = text(a);
      return link;
    }).filter(Boolean);
  } else {
    const rtes = [...element.querySelectorAll('div.rte')].filter((r) => !r.parentElement.closest('div.rte'));
    const sources = rtes.length ? rtes : [element];
    row = sources.map((r) => {
      const cell = document.createElement('div');
      [...r.children].forEach((child) => {
        if (!text(child) && !child.querySelector('img')) return;
        cell.append(child);
      });
      if (!cell.children.length && text(r)) cell.textContent = text(r);
      return cell;
    }).filter((c) => text(c));
  }

  // Call-to-action links next to the tag (e.g. a card footer with "Get a quote") stay on
  // the page after the block instead of being dropped.
  const used = new Set();
  row.forEach((c) => { if (c && c.querySelectorAll) c.querySelectorAll('a[href]').forEach((a) => used.add(a.getAttribute('href'))); });
  const ctas = [...element.querySelectorAll('a[href]')]
    .filter((a) => text(a) && !used.has(a.getAttribute('href')) && !row.some((c) => c === a || (c.contains && c.contains(a))))
    .map((a) => {
      const p = document.createElement('p');
      const strong = a.closest('strong, em');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = text(a);
      if (strong) {
        const wrap = document.createElement(strong.tagName.toLowerCase());
        wrap.append(link);
        p.append(wrap);
      } else p.append(link);
      return p;
    });

  const name = variant ? `tag-label (${variant})` : 'tag-label';
  const block = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
  element.replaceWith(block);
  block.after(...ctas);
}
