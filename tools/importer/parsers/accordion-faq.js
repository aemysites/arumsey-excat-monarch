/* eslint-disable */
/* global WebImporter */

/**
 * Parser: accordion-faq
 * Source: section.faq (AEM accordion component)
 * Layout (blocks/accordion-faq/README.md):
 *   optional single-cell intro row, then one row per question:
 *   [question (h3, as the source) | answer content]
 * Variant: `light` when the section uses the spruce-eggshell theme; `light-2`
 *   for an eggshell FAQ without a heading/intro row (block CSS: no visible heading).
 */

function cleanInline(root) {
  root.querySelectorAll('svg, .icon-svg, span.reader').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    const sym = btn.textContent.replace(/\s+/g, ' ').trim();
    btn.replaceWith(btn.ownerDocument.createTextNode(sym));
  });
  root.querySelectorAll('span.spacer').forEach((n) => n.remove());
}

function hasContent(el) {
  return !!(el && (el.textContent.trim() || el.querySelector('img, picture, iframe, table')));
}

/* Question cell: the source heading level (h3 > button.accordion__btn), h3 by default. */
function questionHeading(src, document) {
  const h = src && src.closest('h1, h2, h3, h4, h5, h6');
  return document.createElement(h ? h.tagName.toLowerCase() : 'h3');
}

export default function parse(element, { document }) {
  const cells = [];
  cleanInline(element);

  // Optional intro (heading + description) above the questions
  const intro = element.querySelector('.intro-common .content-wrap, .intro-common');
  if (intro && !intro.closest('.accordion')) {
    const introParts = [...intro.children].filter((c) => hasContent(c));
    if (introParts.length) cells.push([introParts]);
  }

  const items = [...element.querySelectorAll('div.accordion')].filter(
    (acc) => !acc.parentElement.closest('div.accordion'),
  );

  items.forEach((acc) => {
    const btn = acc.querySelector('.accordion__btn, h3 button, button');
    const qText = btn ? btn.textContent.replace(/\s+/g, ' ').trim() : '';
    if (!qText) return;
    const question = questionHeading(btn, document);
    question.textContent = qText;

    const content = acc.querySelector('.accordion__content');
    const answer = [];
    if (content) {
      [...content.children].forEach((child) => {
        if (child.matches('.btn-container')) {
          if (hasContent(child)) answer.push(...child.querySelectorAll('a'));
          return;
        }
        if (!hasContent(child)) return;
        if (child.tagName === 'DIV') {
          [...child.childNodes].forEach((n) => {
            if (n.nodeType === 1 && hasContent(n)) answer.push(n);
            else if (n.nodeType === 3 && n.textContent.trim()) {
              const p = document.createElement('p');
              p.textContent = n.textContent.trim();
              answer.push(p);
            }
          });
        } else {
          answer.push(child);
        }
      });
    }
    cells.push([question, answer.length ? answer : '']);
  });

  // Drawer accordion (section.accordian-section > ul.accordion > li: header h3.drawer-header,
  // div.detail-div answer + optional .btn-container link; /tax-offices/tax-refund-payment/).
  // Same row shape as above: [title cell | content cell].
  if (!items.length) {
    const drawers = [...element.querySelectorAll('ul.accordion > li')]
      .filter((li) => !li.parentElement.closest('ul.accordion > li'));
    drawers.forEach((li) => {
      const head = li.querySelector('.drawer-header, header h3, header');
      const qText = head ? head.textContent.replace(/\s+/g, ' ').trim() : '';
      if (!qText) return;
      const question = questionHeading(head, document);
      question.textContent = qText;
      const answer = [];
      const detail = li.querySelector('.detail-div');
      if (detail) {
        detail.querySelectorAll('p, ul, ol, table').forEach((n) => {
          const outer = n.parentElement.closest('p, ul, ol, table');
          if (outer && detail.contains(outer)) return;
          if (n.closest('.btn-container')) return;
          if (hasContent(n)) answer.push(n);
        });
        detail.querySelectorAll('.btn-container a[href]').forEach((a) => {
          if (!a.textContent.trim()) return;
          const p = document.createElement('p');
          const link = document.createElement('a');
          link.href = /^javascript:/i.test(a.getAttribute('href')) ? '#' : a.getAttribute('href');
          link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
          p.append(link);
          answer.push(p);
        });
      }
      cells.push([question, answer.length ? answer : '']);
    });
  }

  const isLight = element.matches('.spruce-eggshell-theme')
    || !!element.closest('.spruce-eggshell-theme');
  // light-2: eggshell FAQ list with no heading/intro row (/universal/faqs/)
  const hasIntro = cells.length > items.length || (cells[0] && cells[0].length === 1);
  let name = 'accordion-faq';
  if (isLight) name = hasIntro ? 'accordion-faq (light)' : 'accordion-faq (light-2)';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
