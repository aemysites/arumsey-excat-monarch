/*
 * Breadcrumb Block
 * Trail of parent links. Authors list the links (one per row, or as a list in
 * one cell); the last item is the current page and may be plain text.
 * If the block is empty, a trail is built from the URL path.
 */

function titleCase(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function itemsFromContent(block) {
  const items = [];
  const listItems = block.querySelectorAll('li');
  const sources = listItems.length
    ? [...listItems]
    : [...block.querySelectorAll(':scope > div > div')].flatMap((cell) => {
      const links = cell.querySelectorAll('a');
      if (links.length > 1) return [...links];
      return [cell];
    });
  sources.forEach((el) => {
    const link = el.tagName === 'A' ? el : el.querySelector('a');
    const label = (link || el).textContent.trim();
    if (!label) return;
    items.push({ label, href: link ? link.getAttribute('href') : null });
  });
  return items;
}

function itemsFromPath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const items = [{ label: 'Home', href: '/' }];
  let path = '';
  segments.forEach((segment) => {
    path += `/${segment}`;
    items.push({ label: titleCase(segment), href: path });
  });
  return items;
}

export default function decorate(block) {
  let items = itemsFromContent(block);
  if (!items.length) items = itemsFromPath();

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  items.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    const isLast = idx === items.length - 1;
    // the current page renders as a link to itself, as on the source site
    const href = item.href || (isLast ? window.location.pathname : null);
    const el = document.createElement(href ? 'a' : 'span');
    if (href) el.href = href;
    el.textContent = item.label;
    if (isLast) {
      li.classList.add('active');
      el.setAttribute('aria-current', 'page');
    }
    li.append(el);
    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
