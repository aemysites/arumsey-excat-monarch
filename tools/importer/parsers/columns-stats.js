/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-stats
 * Source: international tax office pages, the "Putting 70 years of tax
 *   knowledge to work for you" experience fragment: section.column-control
 *   .two-column-control whose first column holds a forest .card-secondary
 *   .featurecard (h3 "20 million+" <br> "filed with us in 2024" + tax pro
 *   photo) and whose second column holds .introImageVariant stat items
 *   (illustration + "5 million+" <br> caption), separated by <hr> dividers.
 * Layout (columns convention, blocks/columns-stats/README.md): one row, two
 *   cells side by side (the source's two columns): cell 1 = one photo plus
 *   the figure (heading starting with a number) and its caption; cell 2 =
 *   items, each an icon paragraph followed by the figure (bold paragraph)
 *   and caption paragraph.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function cleanInline(root) {
  root.querySelectorAll('span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(text(btn)));
  });
  root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute('href', '#'));
}

/* Text lines of a stat element split on <br>: [figure, caption...]. */
function statLines(el) {
  if (!el) return [];
  const clone = el.cloneNode(true);
  // source markup is indented with newlines, so collapse whitespace first and split on a marker
  clone.querySelectorAll('br').forEach((br) => br.replaceWith('\u0001'));
  return clone.textContent.replace(/\s+/g, ' ').split('\u0001').map((s) => s.trim()).filter(Boolean);
}

function imageOf(document, root) {
  const img = root && root.querySelector('img[src]');
  if (!img) return null;
  const out = document.createElement('img');
  out.src = img.getAttribute('src');
  out.alt = img.getAttribute('alt') || '';
  return out;
}

function p(document, content, bold = false) {
  const el = document.createElement('p');
  if (bold) {
    const strong = document.createElement('strong');
    strong.textContent = content;
    el.append(strong);
  } else if (typeof content === 'string') {
    el.textContent = content;
  } else if (content) {
    el.append(content);
  }
  return el;
}

export default function parse(element, { document }) {
  cleanInline(element);
  const cols = [...element.querySelectorAll('ul.column-container > li.column')]
    .filter((li) => !li.parentElement.closest('li.column'));
  const featureCol = cols.find((li) => li.querySelector('.featurecard, .card-secondary')) || cols[0];
  const listCol = cols.find((li) => li !== featureCol);

  const feature = [];
  if (featureCol) {
    const card = featureCol.querySelector('.featurecard, .card-secondary') || featureCol;
    const photo = imageOf(document, card.querySelector('.card-img') || card);
    if (photo) feature.push(p(document, photo));
    const head = card.querySelector('h1, h2, h3, h4, h5, h6');
    const [figure, ...caption] = statLines(head || card.querySelector('header') || card);
    if (figure) {
      const h = document.createElement('h3');
      h.textContent = figure;
      feature.push(h);
    }
    if (caption.length) feature.push(p(document, caption.join(' ')));
  }

  const items = [];
  if (listCol) {
    const stats = [...listCol.querySelectorAll('.introImageVariant')]
      .filter((n) => !n.parentElement.closest('.introImageVariant'));
    stats.forEach((item) => {
      const icon = imageOf(document, item.querySelector('.cmp-column--image') || item);
      const body = item.querySelector('.modal-body, .left-30') || item;
      const textEl = body.querySelector('h1, h2, h3, h4, h5, h6, p') || body;
      const [figure, ...caption] = statLines(textEl);
      if (!icon && !figure) return;
      if (icon) items.push(p(document, icon));
      if (figure) items.push(p(document, figure, true));
      if (caption.length) items.push(p(document, caption.join(' ')));
    });
  }

  const cells = [[feature.length ? feature : '', items.length ? items : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
