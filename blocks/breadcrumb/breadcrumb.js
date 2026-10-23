/*
 * Breadcrumb block
 * Author the trail in order: a list of links, links in separate rows/cells, or
 * links in one paragraph. Plain text (no link) is treated as the current page.
 * The last item is marked aria-current="page".
 */

function collectItems(block) {
  const items = [];
  const listItems = block.querySelectorAll('li');
  if (listItems.length) {
    listItems.forEach((li) => items.push(li));
    return items;
  }
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const parts = cell.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3');
    (parts.length ? [...parts] : [cell]).forEach((part) => {
      const links = part.querySelectorAll('a[href]');
      if (links.length > 1) {
        links.forEach((a) => items.push(a));
        // text after the last link (e.g. "> Current page") is the current page
        const range = document.createRange();
        range.setStartAfter(links[links.length - 1]);
        range.setEnd(part, part.childNodes.length);
        const tail = range.toString().replace(/^[\s>›»/|]+/, '').trim();
        if (tail) items.push(document.createTextNode(tail));
      } else if (part.textContent.trim()) {
        items.push(part);
      }
    });
  });
  return items;
}

export default function decorate(block) {
  const items = collectItems(block);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    const link = item.nodeType === Node.ELEMENT_NODE && item.tagName === 'A'
      ? item : item.querySelector?.('a[href]');
    const isLast = i === items.length - 1;
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      const here = new URL(link.href, window.location.href).pathname.replace(/\/$/, '')
        === window.location.pathname.replace(/\/$/, '');
      if (isLast && here) a.setAttribute('aria-current', 'page');
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.textContent = item.textContent.trim();
      if (isLast) span.setAttribute('aria-current', 'page');
      li.append(span);
    }
    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
