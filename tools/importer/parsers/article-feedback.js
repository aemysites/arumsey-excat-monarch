/* eslint-disable */
/* global WebImporter */

/**
 * Parser: article-feedback
 * Source: expat resource-center article vote row
 *   (#site-content section.ba-article div.article-helpful-vote:
 *    p.helpful-heading question + .helpful-buttons a.action--vote options).
 * Layout (blocks/article-feedback/README.md):
 *   row 1: the question
 *   row 2: one cell per answer option (label only; the block CSS supplies the
 *          thumbs up / thumbs down icons, the source images carry a wrong alt)
 * Same table as the article-feedback block the article-body parser emits for
 * Tax Information Center articles.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  const question = text(element.querySelector('.helpful-heading, .helpful-heading-parent'))
    || 'Was this article helpful?';
  const options = [...element.querySelectorAll('.helpful-buttons a, .helpful-buttons button, a.action--vote')]
    .filter((o, i, all) => all.indexOf(o) === i)
    .map((o) => text(o))
    .filter(Boolean);
  const unique = [...new Set(options)];
  if (!unique.length) {
    element.remove();
    return;
  }
  const cells = [
    [question],
    unique.map((label) => {
      const p = document.createElement('p');
      p.textContent = label;
      return p;
    }),
  ];
  const block = WebImporter.Blocks.createBlock(document, { name: 'article-feedback', cells });
  element.replaceWith(block);
}
