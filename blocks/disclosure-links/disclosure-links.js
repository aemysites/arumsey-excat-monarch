import { loadFragment } from '../fragment/fragment.js';

let counter = 0;

/** Resolve a same-page target for a hash link, if any. */
function hashTarget(a) {
  const url = new URL(a.href, window.location.href);
  if (!url.hash || url.pathname !== window.location.pathname) return null;
  try {
    return document.getElementById(decodeURIComponent(url.hash.slice(1)));
  } catch {
    return null;
  }
}

/** Same-origin link to a fragment page. */
function fragmentPath(a) {
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname.replace(/(\.plain)?\.html$/, '');
}

/**
 * Turn a link into a toggle for a disclosure panel.
 * @param {HTMLAnchorElement} a the authored link
 * @param {HTMLElement} li the list item
 * @param {Element|null} inlinePanel authored panel content (second cell)
 */
function buildToggle(a, li, inlinePanel) {
  const fragment = fragmentPath(a);
  if (!inlinePanel && !fragment) {
    // plain or hash link: keep it, open a matching <details> target on click
    a.addEventListener('click', () => {
      const target = hashTarget(a);
      const details = target && (target.closest('details') || target.querySelector('details'));
      if (details) details.open = true;
    });
    return;
  }

  counter += 1;
  const id = `disclosure-links-panel-${counter}`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'disclosure-links-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', id);
  button.append(...a.childNodes);
  // the toggle draws its own +/- indicator; drop an authored trailing "+"
  const lastText = button.lastChild;
  if (lastText && lastText.nodeType === Node.TEXT_NODE) {
    lastText.textContent = lastText.textContent.replace(/\s*\+\s*$/, '');
  }
  a.replaceWith(button);

  const panel = document.createElement('div');
  panel.className = 'disclosure-links-panel';
  panel.id = id;
  panel.hidden = true;
  if (inlinePanel) panel.append(...inlinePanel.childNodes);
  li.append(panel);

  let loaded = !fragment;
  button.addEventListener('click', async () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    if (open && !loaded) {
      loaded = true;
      const main = await loadFragment(fragment);
      if (main) {
        const nodes = [...main.querySelectorAll(':scope > .section > *')];
        panel.append(...(nodes.length ? nodes : [...main.childNodes]));
      }
    }
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'disclosure-links-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const [first, ...rest] = cells.length ? cells : [row];
    if (!first) return;
    const links = [...first.querySelectorAll('a[href]')];
    const panelCell = rest.find((c) => c.textContent.trim() || c.querySelector('picture, a'));

    if (!links.length) {
      // a text-only row: keep it as a plain item
      if (!first.textContent.trim()) return;
      const li = document.createElement('li');
      li.append(...first.childNodes);
      ul.append(li);
      return;
    }

    // one list item per link; a footnote marker (sup) before a link travels with it
    links.forEach((a, i) => {
      const li = document.createElement('li');
      li.className = 'disclosure-links-item';
      let prev = a.previousSibling;
      if (prev && prev.nodeType === Node.TEXT_NODE && !prev.textContent.trim()) {
        prev = prev.previousSibling;
      }
      if (prev && prev.nodeType === Node.ELEMENT_NODE && prev.tagName === 'SUP') li.append(prev);
      li.append(a);
      ul.append(li);
      buildToggle(a, li, i === 0 ? panelCell : null);
    });
  });

  block.replaceChildren(ul);
}
