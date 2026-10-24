/**
 * Breadcrumb trail.
 *
 * Authoring: a list of links (or one link per row/cell), ordered from home to
 * the current page. The last item may be plain text (the current page).
 * If the block holds no links, the trail is derived from the URL path, ending
 * with the page's H1 (or document title).
 */

function toTitle(segment) {
  const text = decodeURIComponent(segment).replace(/\.html?$/i, '').replace(/[-_]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function authoredCrumbs(block) {
  const crumbs = [];
  const items = block.querySelectorAll('li');
  if (items.length) {
    items.forEach((li) => {
      const a = li.querySelector('a');
      const label = li.textContent.trim();
      if (a) crumbs.push({ label: a.textContent.trim() || label, href: a.href, title: a.title });
      else if (label) crumbs.push({ label });
    });
    return crumbs;
  }
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const links = cell.querySelectorAll('a');
    if (links.length) {
      links.forEach((a) => crumbs.push({ label: a.textContent.trim(), href: a.href }));
    } else if (cell.textContent.trim()) {
      crumbs.push({ label: cell.textContent.trim() });
    }
  });
  return crumbs;
}

function derivedCrumbs() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Home', href: '/' }];
  let path = '';
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    if (i === segments.length - 1) {
      const h1 = document.querySelector('main h1');
      crumbs.push({ label: h1?.textContent.trim() || document.title || toTitle(segment) });
    } else {
      crumbs.push({ label: toTitle(segment), href: path });
    }
  });
  return crumbs;
}

export default function decorate(block) {
  let crumbs = authoredCrumbs(block).filter((c) => c.label || c.href);
  if (!crumbs.some((c) => c.href)) crumbs = derivedCrumbs();

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  crumbs.forEach((crumb, i) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    const isLast = i === crumbs.length - 1;
    const isHome = i === 0 && crumb.href
      && new URL(crumb.href, window.location.href).pathname === '/';
    if (isHome) li.classList.add('breadcrumb-home');
    if (crumb.href && !isLast) {
      const a = document.createElement('a');
      a.href = crumb.href;
      if (isHome) {
        a.classList.add('breadcrumb-home-link');
        const label = document.createElement('span');
        label.className = 'breadcrumb-home-label';
        label.textContent = crumb.label || 'Home';
        const icon = document.createElement('span');
        icon.className = 'breadcrumb-home-icon';
        icon.setAttribute('aria-hidden', 'true');
        a.append(label, icon);
      } else {
        a.textContent = crumb.label || crumb.href;
      }
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.textContent = crumb.label;
      if (isLast) span.setAttribute('aria-current', 'page');
      li.append(span);
    }
    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
