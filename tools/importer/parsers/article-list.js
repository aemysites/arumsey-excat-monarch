/* eslint-disable */
/* global WebImporter */

/**
 * Parser: article-list
 * Source: suncorp.com.au content hub listings and the article sidebar "Latest articles".
 *
 * The block lists articles from /query-index.json, so no cards are ever authored
 * (blocks/article-list/README.md: optional key/value rows only).
 *
 *  - aside.Articleteaserlist (article sidebar) -> 'article-list (latest)' with a single
 *    `see all` row linking to the hub page; the source "See all articles" paragraph
 *    that follows the aside is consumed.
 *  - Hub canvas (ContentHub-ArticleList container, cards loaded by script and often
 *    empty in the capture) -> 'article-list' with a single `path` row linking to the
 *    hub. Other authored content in the canvas (intro heading/text, video, partner
 *    carousel) stays as default content around the block. Any sidebar aside the
 *    sections transformer moved out of the canvas becomes 'article-list (latest)'.
 */

const AEM_ROOT = /^\/content\/suncorp\/website\/en\/home/;
const ORIGIN = 'https://www.suncorp.com.au';

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function link(document, href, label) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label || href;
  return a;
}

function pageUrl(document, params) {
  let u = params && params.originalURL;
  if (!u) {
    try {
      const canonical = document.querySelector('link[rel="canonical"]');
      u = (canonical && canonical.href) || document.location.href;
    } catch (e) { /* ignore */ }
  }
  try { return new URL(u); } catch (e) { return null; }
}

/** "See all articles" paragraph right after the aside (skipping split lines). */
function findSeeAll(aside) {
  let next = aside.nextElementSibling;
  while (next && (next.matches('.SplitLine, hr') || !text(next))) next = next.nextElementSibling;
  if (!next) return null;
  const a = next.matches('a') ? next : next.querySelector('a[href]');
  if (a && /see\s+all/i.test(text(a)) && text(next) === text(a)) return { wrapper: next, a };
  return null;
}

function hubFromTeasers(aside, document, params) {
  const first = aside.querySelector('li a[href]');
  const base = first ? first.href : null;
  let url = null;
  try { url = new URL(base); } catch (e) { url = pageUrl(document, params); }
  if (!url) return null;
  const parts = url.pathname.replace(/\.html?$/, '').split('/').filter(Boolean);
  if (parts.length < 2) return null;
  parts.pop();
  return `${url.origin}/${parts.join('/')}.html`;
}

function latestBlock(aside, document, params) {
  const seeAll = findSeeAll(aside);
  const href = seeAll ? seeAll.a.getAttribute('href') : hubFromTeasers(aside, document, params);
  if (seeAll) seeAll.wrapper.remove();
  const cells = [];
  if (href) cells.push(['see all', link(document, href, 'See all articles')]);
  return WebImporter.Blocks.createBlock(document, { name: 'article-list (latest)', cells });
}

function videoBlock(section, document) {
  const iframe = section.querySelector('iframe[src]');
  const contentUrl = section.querySelector('link[itemprop="contentUrl"]');
  let src = (iframe && iframe.getAttribute('src')) || (contentUrl && contentUrl.getAttribute('href'));
  if (!src) return null;
  const id = (src.match(/embed\/([^?&#/]+)/) || [])[1];
  if (id) src = `https://www.youtube.com/watch?v=${id}`;
  const name = section.querySelector('meta[itemprop="name"]');
  return WebImporter.Blocks.createBlock(document, {
    name: 'embed-video',
    cells: [[link(document, src, (name && name.getAttribute('content')) || src)]],
  });
}

/** Clean authored content that sits next to the hub listing. */
function cleanContent(root, document) {
  root.querySelectorAll('style, textarea, form, input, label, .slick-cloned, .image-data-container, .image-lazyload, .SplitLine')
    .forEach((el) => el.remove());
  root.querySelectorAll('section.video, .youtube-video').forEach((v) => {
    if (!root.contains(v)) return;
    const holder = v.closest('section.video') || v;
    const block = videoBlock(holder, document);
    if (block) holder.replaceWith(block);
  });
  root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
}

function hubPath(container, document, params) {
  const cat = container.querySelector('[data-category-path]');
  const raw = cat && cat.getAttribute('data-category-path');
  if (raw && AEM_ROOT.test(raw)) return `${ORIGIN}${raw.replace(AEM_ROOT, '') || '/'}.html`;
  const url = pageUrl(document, params);
  return url ? `${url.origin}${url.pathname}` : null;
}

export default function parse(element, { document, params }) {
  // Article sidebar: latest list only.
  if (element.matches('aside.Articleteaserlist')) {
    const block = latestBlock(element, document, params);
    element.replaceWith(block);
    return;
  }

  const container = element.matches('.ContentHub-ArticleList--container')
    ? element : element.querySelector('.ContentHub-ArticleList--container');

  // Sidebar asides: inside the canvas, or already moved out by the sections transformer.
  const asides = [...document.querySelectorAll('aside.Articleteaserlist')]
    .filter((a) => !a.closest('table'));
  const outsideAsides = asides.filter((a) => !element.contains(a));
  const insideAsides = asides.filter((a) => element.contains(a));

  const cells = [];
  if (container) {
    const href = hubPath(container, document, params);
    if (href) cells.push(['path', link(document, href)]);
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'article-list', cells });

  if (!container || element === container) {
    element.replaceWith(block);
  } else {
    // Authored content around the listing stays as default content, in order.
    const before = document.createElement('div');
    const after = document.createElement('div');
    const sidebar = document.createElement('div');
    insideAsides.forEach((aside) => {
      const latest = latestBlock(aside, document, params);
      aside.replaceWith(latest);
    });
    const placeholder = document.createElement('span');
    container.replaceWith(placeholder);
    const cols = [...element.querySelectorAll('.sg-Grid-row > [class*="sg-Grid-col"]')]
      .filter((c) => !c.parentElement.closest('[class*="sg-Grid-col"]') || !element.contains(c.parentElement.closest('[class*="sg-Grid-col"]')));
    const regions = cols.length ? cols : [element.querySelector('.Middle-column') || element];
    let seen = false;
    regions.forEach((region) => {
      const hasList = region.contains(placeholder);
      const isSide = !hasList && region.querySelector('table, aside');
      [...region.childNodes].forEach((node) => {
        if (node.nodeType === 1 && (node === placeholder || node.contains(placeholder))) {
          // split a wrapper that holds the listing
          if (node !== placeholder) {
            const kids = [...node.childNodes];
            const idx = kids.findIndex((k) => k === placeholder || (k.nodeType === 1 && k.contains(placeholder)));
            kids.slice(0, idx).forEach((k) => before.append(k));
            kids.slice(idx + 1).forEach((k) => after.append(k));
          }
          seen = true;
          return;
        }
        if (isSide) sidebar.append(node);
        else if (!seen) before.append(node);
        else after.append(node);
      });
      if (hasList) seen = true;
    });
    [before, after, sidebar].forEach((c) => cleanContent(c, document));
    const nodes = [...before.childNodes, block, ...after.childNodes, ...sidebar.childNodes]
      .filter((n) => n.nodeType === 1 || text(n));
    element.replaceWith(...nodes);
  }

  outsideAsides.forEach((aside) => {
    const latest = latestBlock(aside, document, params);
    aside.replaceWith(latest);
  });
}
