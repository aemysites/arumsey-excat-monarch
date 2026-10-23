/* eslint-disable */
/* global WebImporter */

/**
 * Parser: article-body
 * Source: main article section.article-body div.c1 (WordPress Tax Information Center article)
 * Layout (blocks/article-body/README.md):
 *   one-cell row  : category + title (article content only)
 *   two-cell row  : [sidebar meta (read time, date, written by, reviewed by, share links) | article content]
 * The "Was this topic helpful?" vote inside the article is emitted as a
 * sibling article-feedback block (question row + one cell per option).
 */

const SHARE_NAMES = {
  linkedin: 'LinkedIn', facebook: 'Facebook', twitter: 'Twitter', 'x.com': 'X', pinterest: 'Pinterest',
};

function shareLabel(href) {
  const h = (href || '').toLowerCase();
  const key = Object.keys(SHARE_NAMES).find((k) => h.includes(k));
  return key ? SHARE_NAMES[key] : 'Share';
}

function cleanInline(root) {
  root.querySelectorAll('svg, span.reader, span.spacer, input, script, style, link, noscript, meta').forEach((n) => n.remove());
  root.querySelectorAll('button.js-disclaimer-link, button.symbol-disclaimer').forEach((btn) => {
    btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, ' ').trim()));
  });
}

function hasContent(el) {
  const MEDIA = 'img, picture, iframe, table';
  return !!(el && (el.textContent.trim() || (el.matches && el.matches(MEDIA)) || el.querySelector(MEDIA)));
}

function flatten(root, document) {
  const out = [];
  [...root.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = n.textContent.trim();
        out.push(p);
      }
      return;
    }
    if (n.nodeType !== 1 || !hasContent(n)) return;
    if (n.tagName === 'DIV' || n.tagName === 'FIGURE' || n.tagName === 'SECTION') {
      out.push(...flatten(n, document));
    } else if (n.tagName === 'A' || n.tagName === 'IMG') {
      const p = document.createElement('p');
      p.append(n);
      out.push(p);
    } else {
      out.push(n);
    }
  });
  return out;
}

function isHidden(el) {
  return /display\s*:\s*none/i.test((el.getAttribute && el.getAttribute('style')) || '');
}

/* Fragment block table (createBlock 'Fragment') -> its /fragments/ path, else null */
function fragmentLink(el) {
  if (!el || el.tagName !== 'TABLE') return null;
  const first = el.querySelector('tr > th, tr > td');
  if (!first || !/^fragment$/i.test(first.textContent.trim())) return null;
  const a = el.querySelector('a[href*="/fragments/"]');
  return a ? a.getAttribute('href') : null;
}

function voteBlock(element, document) {
  const vote = element.querySelector('.article-helpful-vote');
  if (!vote) return null;
  const q = vote.querySelector('.helpful-heading');
  const options = [...new Set([...vote.querySelectorAll('.helpful-buttons a, .helpful-buttons button')]
    .map((o) => o.textContent.replace(/\s+/g, ' ').trim())
    .filter(Boolean))];
  if (!q || !options.length) return null;
  const fbCells = [[q.textContent.trim()]];
  fbCells.push(options.map((label) => {
    const p = document.createElement('p');
    p.textContent = label;
    return p;
  }));
  return WebImporter.Blocks.createBlock(document, { name: 'article-feedback', cells: fbCells });
}

/* breadcrumb trail (div.ba--breadcrumbs) -> sibling breadcrumb block, same table as parsers/breadcrumb.js */
function crumbBlock(trail, document) {
  if (!trail) return null;
  const ul = document.createElement('ul');
  const crumbs = [...trail.querySelectorAll(':scope > span, :scope > a')]
    .filter((n) => !n.classList.contains('ba--breadcrumbs--divide'));
  (crumbs.length ? crumbs : [...trail.querySelectorAll('a')]).forEach((crumb) => {
    const a = crumb.tagName === 'A' ? crumb : crumb.querySelector('a');
    const label = (a || crumb).textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;
    const li = document.createElement('li');
    if (a && a.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = label;
      li.append(link);
    } else {
      li.textContent = label;
    }
    ul.append(li);
  });
  return ul.children.length
    ? WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells: [[ul]] })
    : null;
}

/**
 * Expat resource-center article (section.ba-article, WordPress expat-2022 theme):
 * left sidebar meta (div.article-sidebar .article-detail-bar.desktop) beside the
 * content column (div.col-8). The breadcrumb trail and the helpful vote become
 * sibling breadcrumb / article-feedback blocks (blocks cannot nest); the
 * ways-to-file link pair becomes a paragraph of the two links; the mobile meta
 * copy, hidden excerpt and hidden placeholder featured image are dropped.
 */
function parseExpat(element, document) {
  const sidebar = element.querySelector('.article-sidebar .article-detail-bar.desktop')
    || element.querySelector('.article-sidebar')
    || element.querySelector('.article-detail-bar');
  const col = element.querySelector('div.col-8') || element;

  // share icon links -> network label text (block CSS renders the icons)
  element.querySelectorAll('a.share-page--icon').forEach((a) => {
    a.textContent = shareLabel(a.getAttribute('href'));
  });
  const trail = crumbBlock(col.querySelector(':scope > .ba--breadcrumbs'), document);
  const feedback = voteBlock(col, document);
  cleanInline(element);

  const meta = [];
  if (sidebar) {
    sidebar.querySelectorAll('.article-detail-icon').forEach((item) => {
      const p = item.querySelector('p');
      if (p && hasContent(p)) meta.push(p);
    });
    const share = sidebar.querySelector('.share-page');
    if (share) {
      const heading = share.querySelector('.share-page--heading');
      if (heading && heading.textContent.trim()) {
        const hp = document.createElement('p');
        hp.textContent = heading.textContent.trim();
        meta.push(hp);
      }
      const links = [...share.querySelectorAll('a[href]')];
      if (links.length) {
        const lp = document.createElement('p');
        links.forEach((a, i) => { if (i) lp.append(' '); lp.append(a); });
        meta.push(lp);
      }
    }
  }

  const cells = [];
  const h1 = col.querySelector(':scope > h1');
  if (h1) cells.push([[h1]]);

  const content = [];
  [...col.children].forEach((child) => {
    if (child.matches('.ba--breadcrumbs, .post-info, .article-helpful-vote, hr, h1')) return;
    if (isHidden(child)) return;
    if (child.matches('img') && !child.getAttribute('src')) return;
    // shared-content placeholder (hrblock-fragments, e.g. the ways-to-file pair):
    // blocks cannot nest, so the fragment stays a link paragraph that
    // scripts.js buildAutoBlocks swaps for the fragment content.
    const fragLink = fragmentLink(child);
    if (fragLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = fragLink;
      a.textContent = fragLink;
      p.append(a);
      content.push(p);
      return;
    }
    if (child.matches('.wp-block-create-block-hrb-expat-ways-to-file')) {
      const links = [...child.querySelectorAll('a[href]')];
      if (links.length) {
        const p = document.createElement('p');
        links.forEach((a, i) => { if (i) p.append(' '); p.append(a); });
        content.push(p);
      }
      return;
    }
    if (!hasContent(child)) return;
    if (child.tagName === 'DIV' || child.tagName === 'FIGURE') content.push(...flatten(child, document));
    else if (child.tagName === 'IMG' || child.tagName === 'A') {
      const p = document.createElement('p');
      p.append(child);
      content.push(p);
    } else content.push(child);
  });
  if (meta.length || content.length) cells.push([meta.length ? meta : '', content.length ? content : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-body', cells });
  element.replaceWith(block);
  if (trail) block.before(trail);
  if (feedback) block.after(feedback);
}

export default function parse(element, { document }) {
  if (element.matches('section.ba-article') || element.querySelector('.ba--breadcrumbs, .article-sidebar')) {
    parseExpat(element, document);
    return;
  }
  // Pull share links out before cleanup strips their svg icons, and label them.
  element.querySelectorAll('a.share-tic-page--icon').forEach((a) => {
    if (!a.textContent.trim()) a.textContent = shareLabel(a.getAttribute('href'));
  });
  cleanInline(element);
  // empty anchors used as heading jump targets
  element.querySelectorAll('h1 > a:not([href]), h2 > a:not([href]), h3 > a:not([href]), h4 > a:not([href])').forEach((a) => {
    if (!a.textContent.trim()) a.remove();
  });

  const cells = [];

  // Row 1: category + title
  const head = [];
  const category = element.querySelector('.category-abovetitle');
  if (category) {
    const visible = [...category.querySelectorAll(':scope > span:not(.hidden-breadcrumb) a')];
    if (visible.length) {
      const p = document.createElement('p');
      visible.forEach((a, i) => { if (i) p.append(' '); p.append(a); });
      head.push(p);
    }
  }
  const h1 = element.querySelector('h1');
  if (h1) head.push(h1);
  if (head.length) cells.push([head]);

  // Sidebar meta (prefer desktop bar, fall back to mobile)
  const bar = element.querySelector('.tic-article-detail-bar--desktop') || element.querySelector('.tic-article-detail-bar');
  const meta = [];
  if (bar) {
    bar.querySelectorAll('.tic-article-detail-icon').forEach((item) => {
      const p = item.querySelector('p');
      if (p && hasContent(p)) meta.push(p);
    });
    const share = bar.querySelector('.share-tic-page');
    if (share) {
      const heading = share.querySelector('.share-tic-page--heading');
      if (heading && heading.textContent.trim()) {
        const hp = document.createElement('p');
        hp.textContent = heading.textContent.trim();
        meta.push(hp);
      }
      const links = [...share.querySelectorAll('a[href]')];
      if (links.length) {
        const lp = document.createElement('p');
        links.forEach((a, i) => { if (i) lp.append(' '); lp.append(a); });
        meta.push(lp);
      }
    }
  }

  // Article content
  const content = [];
  const main = element.querySelector('.article-main-content');
  if (main) content.push(...flatten(main, document));

  // Author feature at the end of the article
  const author = element.querySelector('.tic-article-author-feature');
  if (author) {
    const img = author.querySelector('img');
    if (img) { const p = document.createElement('p'); p.append(img); content.push(p); }
    author.querySelectorAll('.tic-author-name, .tic-author-title, .tic-author-description').forEach((p) => {
      if (hasContent(p)) content.push(p);
    });
    const share = author.querySelector('.share-tic-page');
    if (share) {
      const heading = share.querySelector('.share-tic-page--heading');
      const links = [...share.querySelectorAll('a[href]')];
      if (links.length) {
        const lp = document.createElement('p');
        if (heading && heading.textContent.trim()) lp.append(`${heading.textContent.trim()} `);
        links.forEach((a, i) => { if (i) lp.append(' '); lp.append(a); });
        content.push(lp);
      }
    }
  }

  if (meta.length || content.length) cells.push([meta.length ? meta : '', content.length ? content : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-body', cells });

  // "Was this topic helpful?" -> article-feedback block after the article
  let feedback = null;
  const vote = element.querySelector('.article-helpful-vote');
  if (vote) {
    const q = vote.querySelector('.helpful-heading');
    const options = [...vote.querySelectorAll('.helpful-buttons a, .helpful-buttons button')]
      .map((o) => o.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (q && options.length) {
      const fbCells = [[q.textContent.trim()]];
      fbCells.push(options.map((label) => {
        const p = document.createElement('p');
        p.textContent = label;
        return p;
      }));
      feedback = WebImporter.Blocks.createBlock(document, { name: 'article-feedback', cells: fbCells });
    }
  }

  element.replaceWith(block);
  if (feedback) block.after(feedback);
}
