import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizeImages(root, eager) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, eager, [{ width: '750' }]));
  });
}

function removeEmptyParagraphs(root) {
  root.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img, a, .icon')) p.remove();
  });
}

function decorateMain(main) {
  const heading = main.querySelector('h1, h2, h3, h4, h5, h6');

  // Breadcrumb: a paragraph with links directly before the heading.
  const before = heading && heading.previousElementSibling;
  if (before && before.tagName === 'P' && before.querySelector('a') && !before.classList.contains('button-wrapper')) {
    const nav = document.createElement('nav');
    nav.className = 'hero-resource-breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    before.replaceWith(nav);
    nav.append(before);
  }

  // Share line: "Share…" followed by social links.
  main.querySelectorAll(':scope > p').forEach((p) => {
    if (/^\s*share\b/i.test(p.textContent) && p.querySelector('a')) {
      p.classList.add('hero-resource-share');
      p.querySelectorAll('a').forEach((a) => {
        if (!a.textContent.trim() && !a.getAttribute('aria-label')) {
          const icon = a.querySelector('.icon');
          const name = icon ? [...icon.classList].find((c) => c.startsWith('icon-')) : '';
          if (name) a.setAttribute('aria-label', name.replace('icon-', ''));
        }
      });
    }
  });

  const buttons = [...main.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const group = document.createElement('div');
    group.className = 'hero-resource-actions';
    buttons[0].before(group);
    group.append(...buttons);
  }
}

/** Builds an item (image + text) from an element's children. */
function buildItem(nodes) {
  const item = document.createElement('li');
  item.className = 'hero-resource-item';
  const media = document.createElement('div');
  media.className = 'hero-resource-item-media';
  const body = document.createElement('div');
  body.className = 'hero-resource-item-body';
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && (node.matches('picture, img') || (node.matches('p') && node.querySelector('picture') && !node.textContent.trim()))) {
      media.append(node);
    } else {
      body.append(node);
    }
  });
  removeEmptyParagraphs(body);
  if (media.childNodes.length) item.append(media);
  item.append(body);
  return item;
}

function decorateAside(aside, extraRows, block) {
  const featuredList = block.classList.contains('featured-list');
  const featuredArticle = block.classList.contains('featured-article')
    || block.classList.contains('featured-article-2');

  if (featuredList) {
    const items = [];
    // Items authored as a list in the aside cell…
    aside.querySelectorAll(':scope > ul > li').forEach((li) => items.push(buildItem([...li.childNodes])));
    aside.querySelectorAll(':scope > ul').forEach((ul) => ul.remove());
    // …or as one row per item.
    extraRows.forEach((row) => {
      const nodes = [...row.querySelectorAll(':scope > div')].flatMap((cell) => [...cell.childNodes]);
      if (nodes.some((n) => n.textContent.trim() || n.nodeName === 'PICTURE')) items.push(buildItem(nodes));
    });
    if (items.length) {
      const list = document.createElement('ul');
      list.className = 'hero-resource-items';
      list.append(...items);
      aside.append(list);
    }
    return;
  }

  // Other options: fold extra rows into the aside.
  extraRows.forEach((row) => row.querySelectorAll(':scope > div').forEach((cell) => aside.append(...cell.childNodes)));
  removeEmptyParagraphs(aside);

  if (featuredArticle) {
    const card = document.createElement('div');
    card.className = 'hero-resource-card';
    const media = document.createElement('div');
    media.className = 'hero-resource-card-media';
    const body = document.createElement('div');
    body.className = 'hero-resource-card-body';
    const firstPicture = aside.querySelector('picture');
    const pictureHolder = firstPicture && (firstPicture.closest('p') || firstPicture);
    [...aside.childNodes].forEach((node) => {
      if (node === pictureHolder) media.append(node);
      else body.append(node);
    });
    if (media.childNodes.length) card.append(media);
    card.append(body);
    aside.append(card);

    // Make the whole card clickable through its first text link.
    const link = body.querySelector('a[href]');
    if (link) {
      card.classList.add('is-linked');
      link.classList.add('hero-resource-card-link');
    }
    return;
  }

  // Default: section navigation links (often with icons).
  // Each item gets a data-link slug of its text so CSS can show the matching section icon.
  aside.querySelectorAll(':scope > ul').forEach((ul) => {
    ul.classList.add('hero-resource-links');
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const slug = li.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (slug) li.dataset.link = slug;
    });
  });
}

/**
 * hero-resource: resource-centre hero with an intro column (breadcrumb,
 * heading, text, CTAs, share links) and an aside.
 * Options: featured-article / featured-article-2 (aside is a linked article
 * card), featured-list (aside lists articles, one row or list item each),
 * illustration (aside is a single illustration). Default aside: icon link list.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const [firstRow, ...extraRows] = rows;
  const firstCells = firstRow ? [...firstRow.querySelectorAll(':scope > div')] : [];

  const main = document.createElement('div');
  main.className = 'hero-resource-main';
  if (firstCells[0]) main.append(...firstCells[0].childNodes);

  const aside = document.createElement('div');
  aside.className = 'hero-resource-aside';
  firstCells.slice(1).forEach((cell) => aside.append(...cell.childNodes));

  removeEmptyParagraphs(main);
  removeEmptyParagraphs(aside);
  decorateMain(main);
  decorateAside(aside, extraRows, block);

  block.replaceChildren(main);
  if (aside.childNodes.length) block.append(aside);
  else block.classList.add('no-aside');

  const section = block.closest('.section');
  const eager = !section || !section.previousElementSibling;
  optimizeImages(block, eager);
}
