/*
 * Accordion Media block
 * Item rows: cell 1 = title (optional leading icon), cell 2 = body, cell 3 = optional image.
 * Single-cell rows before the first item are an intro (heading/text);
 * single-cell rows after the items are a footer (e.g. a "see all" link).
 * A single-cell row holding only an image becomes the shared media panel.
 * When any media exists, the open item's image is shown beside the list.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function hasContent(el) {
  return !!el && (el.textContent.trim() !== '' || !!el.querySelector('img, picture, svg, a'));
}

function isImageOnly(el) {
  return !!el && !!el.querySelector('picture, img') && el.textContent.trim() === '';
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/* pull a leading icon (span.icon, picture or img) out of the title cell */
function extractIcon(label) {
  const first = label.querySelector('span.icon, picture, img');
  if (!first) return null;
  // only treat it as an icon when no text precedes it
  const range = document.createRange();
  range.setStart(label, 0);
  range.setEndBefore(first.closest('picture') || first);
  if (range.toString().trim()) return null;
  const node = first.closest('picture') || first;
  const icon = document.createElement('span');
  icon.className = 'accordion-media-item-icon';
  const parent = node.parentElement;
  icon.append(node);
  if (parent !== label && parent.tagName === 'P' && !hasContent(parent)) parent.remove();
  return icon;
}

/* an <img> whose src is a bare/empty data URI (an inline SVG lost on import) */
function isEmptyDataImage(img) {
  const src = img.getAttribute('src') || '';
  return /^data:image\/[\w+.-]+(;base64)?,?$/i.test(src);
}

/*
 * Paragraph roles used for styling:
 * - a paragraph holding only a link is a call to action (source renders these as CTAs)
 * - a paragraph led by an icon is a check/icon list item; broken (empty) icons are dropped
 *   so the CSS check marker shows instead of an empty image box
 */
function markParagraphs(root) {
  root.querySelectorAll('p').forEach((p) => {
    const link = p.querySelector('a[href]');
    if (link && !link.classList.contains('button') && !link.querySelector('img, picture')
      && p.textContent.trim() === link.textContent.trim()) {
      p.classList.add('accordion-media-cta');
    }
    const first = p.firstElementChild;
    const lead = first && (first.matches('picture, img, span.icon') ? first : null);
    if (!lead || p.firstChild !== lead || !p.textContent.trim()) return;
    p.classList.add('accordion-media-check');
    const img = lead.matches('img') ? lead : lead.querySelector('img');
    if (img && isEmptyDataImage(img)) lead.remove();
    else lead.classList.add('accordion-media-check-icon');
  });
}

/* every block child of the cell is a single link (optionally led by an icon) */
function isLinkList(cell) {
  const items = [...cell.querySelectorAll(':scope > p, :scope > ul > li, :scope > ol > li')];
  if (!items.length || cell.children.length === 0) return false;
  if ([...cell.children].some((c) => !c.matches('p, ul, ol'))) return false;
  return items.every((item) => {
    const links = item.querySelectorAll('a[href]');
    return links.length === 1 && item.textContent.trim() === links[0].textContent.trim();
  });
}

/* intro | links row (source two-column "additional resources": text left, icon links right) */
function isSplitRow(cells) {
  if (cells.length !== 2) return false;
  const [intro, links] = cells;
  return !!intro.querySelector('h1, h2, h3, h4, h5, h6') && intro.children.length > 1 && isLinkList(links);
}

function buildLinks(cell) {
  const ul = document.createElement('ul');
  ul.className = 'accordion-media-links';
  cell.querySelectorAll(':scope > p, :scope > ul > li, :scope > ol > li').forEach((item) => {
    const li = document.createElement('li');
    const link = item.querySelector('a[href]');
    const icon = item.querySelector('span.icon, picture, img');
    if (icon && !link.contains(icon)) {
      const wrap = document.createElement('span');
      wrap.className = 'accordion-media-link-icon';
      wrap.append(icon.closest('picture') || icon);
      li.append(wrap);
      li.classList.add('accordion-media-link-has-icon');
    }
    link.classList.remove('button');
    li.append(link);
    ul.append(li);
  });
  return ul;
}

function buildTitle(label) {
  const title = document.createElement('span');
  title.className = 'accordion-media-item-title';
  const only = label.children.length === 1 ? label.firstElementChild : null;
  const source = only && /^(P|H[1-6])$/.test(only.tagName) ? only : label;
  title.append(...source.childNodes);
  return title;
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'accordion-media-intro';
  const list = document.createElement('div');
  list.className = 'accordion-media-list';
  const footer = document.createElement('div');
  footer.className = 'accordion-media-footer';
  const media = document.createElement('div');
  media.className = 'accordion-media-media';
  const groupName = `accordion-media-${Math.random().toString(36).slice(2, 8)}`;

  let sharedMedia = null;
  let splitLinks = null;
  const itemMedia = [];
  // single-cell rows after an item: group headings if more items follow, else the footer
  let pending = [];
  const flushPending = () => {
    pending.forEach((nodes) => {
      const heading = document.createElement('div');
      heading.className = 'accordion-media-group';
      heading.append(...nodes);
      list.append(heading);
    });
    pending = [];
  };

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((cell) => hasContent(cell));
    if (!cells.length) return;

    if (isSplitRow(cells) && !list.children.length && !splitLinks) {
      intro.append(...cells[0].childNodes);
      splitLinks = buildLinks(cells[1]);
      return;
    }

    if (cells.length === 1) {
      if (isImageOnly(cells[0]) && !sharedMedia) {
        sharedMedia = document.createElement('div');
        sharedMedia.className = 'accordion-media-media-item';
        sharedMedia.append(...cells[0].childNodes);
        return;
      }
      if (list.children.length) pending.push([...cells[0].childNodes]);
      else intro.append(...cells[0].childNodes);
      return;
    }

    flushPending();
    const [label, body, ...rest] = cells;
    const details = document.createElement('details');
    details.className = 'accordion-media-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-media-item-label';
    const icon = extractIcon(label);
    if (icon) summary.append(icon);
    summary.append(buildTitle(label));

    const panel = document.createElement('div');
    panel.className = 'accordion-media-item-body';

    // a trailing image-only cell is this item's media
    let mediaCell = null;
    if (rest.length && isImageOnly(rest[rest.length - 1])) mediaCell = rest.pop();
    panel.append(...body.childNodes);
    rest.forEach((extra) => panel.append(...extra.childNodes));

    let mediaItem = null;
    if (mediaCell) {
      mediaItem = document.createElement('div');
      mediaItem.className = 'accordion-media-media-item';
      mediaItem.append(...mediaCell.childNodes);
    }
    itemMedia.push(mediaItem);

    details.append(summary, panel);
    list.append(details);
  });

  pending.forEach((nodes) => footer.append(...nodes));

  const items = [...list.querySelectorAll(':scope > details')];
  const hasItemMedia = itemMedia.some(Boolean);

  // first item opens by default
  if (items[0]) items[0].open = true;

  if (hasItemMedia || sharedMedia) {
    block.classList.add('accordion-media-has-media');
    if (sharedMedia) media.append(sharedMedia);
    itemMedia.forEach((m, i) => {
      if (!m) return;
      m.dataset.index = i;
      m.hidden = i !== 0;
      media.append(m);
    });
    if (sharedMedia && hasItemMedia) sharedMedia.hidden = !!itemMedia[0];
  }

  // with per-item media: keep one item open at a time and sync the media panel to it
  if (hasItemMedia) {
    items.forEach((details, i) => {
      details.setAttribute('name', groupName);
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        items.forEach((other) => {
          if (other !== details && other.open) other.open = false;
        });
        media.querySelectorAll('.accordion-media-media-item[data-index]').forEach((m) => {
          m.hidden = m.dataset.index !== String(i);
        });
        if (sharedMedia) sharedMedia.hidden = !!itemMedia[i];
      });
    });
  }

  const content = document.createElement('div');
  content.className = 'accordion-media-content';
  if (intro.childNodes.length) content.append(intro);
  if (splitLinks) {
    block.classList.add('accordion-media-split');
    content.append(splitLinks);
  }
  if (list.children.length || !splitLinks) content.append(list);
  if (footer.childNodes.length) content.append(footer);

  block.replaceChildren(content);
  if (media.children.length) block.append(media);
  markParagraphs(content);
  optimizeImages(block);
}
