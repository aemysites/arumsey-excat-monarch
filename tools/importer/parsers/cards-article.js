/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Sources (one block per container, one row per card):
 *   - div.expat-hp-countries--grid      -> country-grid (flag + linked country name)
 *   - div.theposts (TIC recommendations) -> image (thumbnail, category, linked title)
 *   - expat resource-center search results (a.ba--pgitem) -> default, text-only cards
 *   - expat article recommended row (a.ba-single--related-post cards) -> default
 *       (thumbnail, category, linked title)
 *   - section.column-control with article.card-stacked.custom-article (most recent articles)
 *       white theme -> with-button, green-dark theme -> with-button-2
 *   - section.column-control with article.card-stacked.stackedContent (eyebrow cards) -> green-light
 * Layout (blocks/cards-article/README.md): [image | body], body = optional
 * eyebrow paragraph, heading (linked), summary, optional final button paragraph.
 */

function cleanInline(root) {
  root.querySelectorAll('svg, span.reader, span.spacer, input, script, style, link, noscript, meta').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, ' ').trim()));
  });
}

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function makeImg(document, src, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  return img;
}

function bgImage(el, document) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const m = style.match(/background-image:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  return m ? makeImg(document, m[1], '') : null;
}

function heading(document, tag, label, href) {
  const h = document.createElement(tag);
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    h.append(a);
  } else {
    h.textContent = label;
  }
  return h;
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else p.append(content);
  return p;
}

function buttonPara(document, a) {
  const link = document.createElement('a');
  link.href = a.getAttribute('href');
  link.textContent = text(a);
  const strong = document.createElement('strong');
  strong.append(link);
  return para(document, strong);
}

export default function parse(element, { document }) {
  cleanInline(element);
  const cells = [];
  let variant = null;

  if (element.matches('.expat-hp-countries--grid') || element.querySelector('.expat-hp-countries--thumb')) {
    // Country grid: each card is a link wrapping a flag + name
    variant = 'country-grid';
    element.querySelectorAll('a[href]').forEach((a) => {
      const img = a.querySelector('img');
      const label = text(a.querySelector('p')) || text(a);
      if (!label) return;
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = label;
      cells.push([img || '', para(document, link)]);
    });
  } else if (element.querySelector('a.ba--pgitem')) {
    // expat resource-center search results (div.search-results > a.ba--pgitem: category
    // label + date, h2 title, excerpt; the whole result is the link): one text-only card
    // per result, all results kept (the source pages them client-side)
    element.querySelectorAll('a.ba--pgitem').forEach((a) => {
      const href = a.getAttribute('href');
      const body = [];
      const cat = text(a.querySelector('.category-label'));
      if (cat) body.push(para(document, cat));
      const title = text(a.querySelector('.post-title, h2, h3'));
      if (title) body.push(heading(document, 'h2', title, href));
      const excerpt = text(a.querySelector('p'));
      if (excerpt) body.push(para(document, excerpt));
      if (body.length) cells.push([body]);
    });
  } else if (element.querySelector('a.ba-single--related-post')) {
    // Expat article recommended posts: each card is a link wrapping
    // div.featured-image img + category label (h3) + title (h2); catalog variant default
    element.querySelectorAll('a.ba-single--related-post').forEach((a) => {
      const href = a.getAttribute('href');
      const img = a.querySelector('.featured-image img, img');
      const body = [];
      const cat = text(a.querySelector('.category-label'));
      if (cat) body.push(para(document, cat));
      const title = text(a.querySelector('.title, h2, h3:not(.category-label)'));
      if (title) body.push(heading(document, 'h3', title, href));
      if (body.length || img) cells.push([img || '', body.length ? body : '']);
    });
  } else if (element.matches('.theposts') || element.querySelector('div.post .tic-post-title')) {
    // TIC recommended articles: thumbnail as background image
    variant = 'image';
    element.querySelectorAll('div.post').forEach((post) => {
      const a = post.querySelector('a[href]');
      const href = a ? a.getAttribute('href') : null;
      const img = post.querySelector('img') || bgImage(post.querySelector('.tic-post-thumbnail'), document);
      const body = [];
      const cat = text(post.querySelector('.tic-green-subhead'));
      if (cat) body.push(para(document, cat));
      const title = text(post.querySelector('.tic-post-title'));
      if (title) body.push(heading(document, 'h3', title, href));
      const excerpt = post.querySelector('.tic-post-excerpt, .excerpt');
      if (excerpt && text(excerpt)) body.push(para(document, text(excerpt)));
      if (body.length) cells.push([img || '', body]);
    });
  } else {
    let articles = [...element.querySelectorAll('article.card-stacked, article')]
      .filter((a, i, arr) => arr.indexOf(a) === i && !a.parentElement.closest('article'));
    // image-overflow cards marked up as div.card-stacked (no <article>)
    if (!articles.length) {
      articles = [...element.querySelectorAll('div.card-stacked')]
        .filter((a) => !a.parentElement.closest('div.card-stacked'));
    }
    const isStacked = articles.some((a) => a.matches('.stackedContent') || a.querySelector('.stacked-eyebrow-row'));
    if (isStacked) variant = 'green-light';
    else variant = element.matches('.green-dark-theme') || element.closest('.green-dark-theme') ? 'with-button-2' : 'with-button';

    articles.forEach((art) => {
      const img = art.querySelector('.cmp-column--image img, img');
      const btn = [...art.querySelectorAll('.btn-container a[href], footer a[href], a.btn[href]')]
        .find((a) => text(a));
      const href = btn ? btn.getAttribute('href') : null;
      const body = [];
      const eyebrow = art.querySelector('.eyebrow-label, .stacked-eyebrow-row');
      if (eyebrow && text(eyebrow)) body.push(para(document, text(eyebrow)));
      const titleEl = art.querySelector('.stacked-title, h3.title, header h3, h3, h2');
      const title = text(titleEl);
      if (title) body.push(heading(document, 'h3', title, href));
      const summary = art.querySelector('.excerpt, .card-body > div:first-child, .card-body');
      if (summary) {
        const ps = [...summary.querySelectorAll('p, ul, ol')].filter((p) => {
          const list = p.parentElement.closest('ul, ol');
          return !(list && summary.contains(list)) && text(p);
        });
        if (ps.length) body.push(...ps);
        else if (text(summary) && (!btn || !summary.contains(btn))) body.push(para(document, text(summary)));
      }
      if (btn) body.push(buttonPara(document, btn));
      if (body.length || img) cells.push([img || '', body.length ? body : '']);
    });
  }

  const name = variant ? `cards-article (${variant})` : 'cards-article';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
