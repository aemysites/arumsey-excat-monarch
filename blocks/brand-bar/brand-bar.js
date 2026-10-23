const ACTIVE_MARKER = /\s*\(\s*(active|current)\s*\)\s*/i;

/**
 * True when a link points at the page's own origin root (the current brand).
 * @param {HTMLAnchorElement} a
 * @returns {boolean}
 */
function isCurrentBrand(a) {
  try {
    const url = new URL(a.href, window.location.href);
    return url.origin === window.location.origin && url.pathname === '/';
  } catch {
    return false;
  }
}

/**
 * Strips the "(active)" marker from text nodes; returns true when found.
 * @param {Element} el
 * @returns {boolean}
 */
function stripActiveMarker(el) {
  let found = false;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (ACTIVE_MARKER.test(node.textContent)) {
      node.textContent = node.textContent.replace(ACTIVE_MARKER, ' ').trim();
      found = true;
    }
    node = walker.nextNode();
  }
  return found;
}

/**
 * Builds one brand item from an authored cell or paragraph.
 * @param {Element} source
 * @returns {HTMLLIElement|null}
 */
function buildItem(source) {
  const marked = stripActiveMarker(source);
  // bold links are already turned into primary buttons by decorateButtons
  const bold = !!source.querySelector('strong, b, a.button.primary');
  const link = source.querySelector('a[href]');
  const media = source.querySelector('picture, img, .icon');
  if (!link && !media && !source.textContent.trim()) return null;

  const li = document.createElement('li');
  li.className = 'brand-bar-item';
  let target;
  if (link) {
    target = link;
    // a logo authored next to (not inside) its link moves into it
    if (media && !link.contains(media)) {
      const label = link.textContent.trim();
      link.replaceChildren(media.closest('picture') || media);
      if (label && !link.getAttribute('aria-label')) link.setAttribute('aria-label', label);
    }
    // drop button styling decorateButtons may have applied
    link.className = 'brand-bar-link';
    if (!link.textContent.trim()) {
      const img = link.querySelector('img');
      if (img && img.alt && !link.getAttribute('aria-label')) link.setAttribute('aria-label', img.alt);
    }
  } else {
    target = document.createElement('span');
    target.className = 'brand-bar-link';
    target.append(...source.childNodes);
  }
  li.append(target);

  if (marked || bold || (link && isCurrentBrand(link))) {
    li.classList.add('active');
    if (link) link.setAttribute('aria-current', 'page');
  }
  return li;
}

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Brands');
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      // a cell may hold several brands as separate paragraphs or list items
      const parts = [...cell.querySelectorAll(':scope > p, :scope > ul > li')];
      const sources = parts.length > 1 ? parts : [cell];
      sources.forEach((source) => {
        const item = buildItem(source);
        if (item) ul.append(item);
      });
    });
  });

  // only one brand can be current; keep the first
  [...ul.querySelectorAll('.brand-bar-item.active')].slice(1).forEach((li) => {
    li.classList.remove('active');
    li.querySelector('[aria-current]')?.removeAttribute('aria-current');
  });

  nav.append(ul);
  block.replaceChildren(nav);
}
