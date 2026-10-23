/* eslint-disable */
/* global WebImporter */

/**
 * Parser: price-estimator
 * Source: section.pricing-tool-section (situation pills + estimated price box).
 * Layout (blocks/price-estimator/README.md): config rows keyed in the first cell
 *   Prompt | question, Result | result heading, Price | base price, Note | price note,
 *   then one row per situation: label | starting price (optional) | CTA (optional).
 * The source computes per-situation prices in JS (no data attributes or config
 * in the DOM); hrblock-cleanup's preprocess hook toggles each checkbox on the
 * live page and stores the resulting price as input[data-price]. A situation
 * that does not change the base price keeps an empty price cell.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  const cells = [];
  const tool = element.querySelector('.pricing-tool-section') || element;

  const prompt = text(tool.querySelector('.price-pill-box > p, .price-pill-box p'));
  if (prompt) cells.push(['Prompt', prompt]);

  const box = tool.querySelector('.price-box');
  const result = box ? text(box.querySelector('h2, h3, h4')) : '';
  if (result) cells.push(['Result', result]);
  const priceEl = () => (box ? box.querySelector('.pricing > span, .pricing strong, .pricing') : null);
  const priceText = () => {
    const el = priceEl();
    const t = text(el);
    const m = t.match(/[$€£]\s?[\d,.]+/);
    return m ? m[0].replace(/\s/g, '') : '';
  };
  const price = priceText();
  if (price) cells.push(['Price', price]);
  const note = box ? text(box.querySelector('.state-fee-text, .pricing p')) : '';
  if (note) cells.push(['Note', note]);

  const cta = box ? [...box.querySelectorAll('.btn-container a[href]')].find((a) => text(a)) : null;

  tool.querySelectorAll('.price-pill-list > li').forEach((li) => {
    const label = text(li.querySelector('label')) || text(li);
    if (!label) return;
    const input = li.querySelector('input');
    // data-price: captured on the live page by hrblock-cleanup (preprocess)
    const situationPrice = input && (input.getAttribute('data-price') || li.getAttribute('data-price'));
    const row = [label, situationPrice || ''];
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = text(cta);
      row.push(a);
    }
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'price-estimator', cells });
  element.replaceWith(block);
}
