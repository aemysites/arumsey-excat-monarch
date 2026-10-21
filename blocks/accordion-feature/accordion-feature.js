/*
 * Accordion Feature
 * Expandable feature / FAQ / product-information panels. Each row is one item:
 * first cell = label (question or title), second cell = panel content
 * (rich text, lists, tables, links). A panel cell holding only a fragment
 * link (/fragments/...) is loaded from that fragment, so panels can hold blocks.
 *
 * Options: cta-button (label rendered as a call-to-action button),
 * faq (light-blue stacked question rows), no-icons (banking FAQ list: ruled rows,
 * thin left chevron, no leading feature icons), red / orange (dark-brown / gold
 * relationship-tier buttons).
 * A block whose labels all start with a footnote marker (<sup>1</sup>Product &
 * Pricing Information) is flagged `is-footnote` and styled as a legal-footnote toggle.
 */
import { loadFragment } from '../fragment/fragment.js';

const BLOCK = 'accordion-feature';

function getFragmentPath(cell) {
  const links = cell.querySelectorAll('a');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  try {
    const url = new URL(links[0].href, window.location.href);
    if (!url.pathname.includes('/fragments/')) return null;
    return url.pathname.replace(/\.plain\.html$|\.html$/, '');
  } catch (e) {
    return null;
  }
}

async function fillFromFragment(body) {
  const path = getFragmentPath(body);
  if (!path) return;
  const fragment = await loadFragment(path);
  if (fragment) body.replaceChildren(...fragment.childNodes);
}

function wrapTables(body) {
  body.querySelectorAll('table').forEach((table) => {
    if (table.parentElement.classList.contains(`${BLOCK}-table`)) return;
    const wrapper = document.createElement('div');
    wrapper.className = `${BLOCK}-table`;
    table.replaceWith(wrapper);
    wrapper.append(table);
  });
}

// true when the first visible content of a label is a <sup> footnote marker
function startsWithSup(label) {
  let node = label.firstChild;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return false;
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SUP') return true;
      if (node.textContent.trim()) {
        node = node.firstChild;
      } else {
        node = node.nextSibling;
      }
    } else {
      node = node.nextSibling;
    }
  }
  return false;
}

function openForHash(block) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target || !block.contains(target)) return;
  const details = target.closest('details');
  if (details) details.open = true;
}

export default async function decorate(block) {
  const isFaq = block.classList.contains('faq');
  const pending = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length || (!row.textContent.trim() && !row.querySelector('picture, table'))) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = `${BLOCK}-item-label`;
    let body;

    if (cells.length >= 2) {
      summary.append(...cells[0].childNodes);
      [, body] = cells;
      cells.slice(2).forEach((extra) => body.append(...extra.childNodes));
    } else {
      const [cell] = cells;
      const first = cell.firstElementChild;
      if (first) {
        summary.append(...first.childNodes);
        first.remove();
      } else {
        summary.append(...cell.childNodes);
      }
      body = cell;
    }

    // a label authored as a link/button should toggle, not navigate
    summary.querySelectorAll('a').forEach((a) => {
      const span = document.createElement('span');
      span.append(...a.childNodes);
      a.replaceWith(span);
    });

    body.className = `${BLOCK}-item-body`;
    const details = document.createElement('details');
    details.className = `${BLOCK}-item`;
    details.append(summary, body);

    if (isFaq) {
      // exclusive open: one answer visible at a time
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        block.querySelectorAll(`details.${BLOCK}-item[open]`).forEach((other) => {
          if (other !== details) other.open = false;
        });
      });
    }

    row.replaceWith(details);
    pending.push(fillFromFragment(body).then(() => wrapTables(body)));
  });

  const labels = [...block.querySelectorAll(`.${BLOCK}-item-label`)];
  if (labels.length && labels.every(startsWithSup)) block.classList.add('is-footnote');

  await Promise.all(pending);
  openForHash(block);
  window.addEventListener('hashchange', () => openForHash(block));
}
