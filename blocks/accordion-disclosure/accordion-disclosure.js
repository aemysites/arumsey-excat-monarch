/*
 * Accordion Disclosure
 * Collapsible legal / terms-and-conditions disclosure. Each row is one item:
 * first cell = label, second cell = body (rich text, numbered footnotes, tables).
 * A body cell that holds only a fragment link is loaded from that fragment.
 */
import { loadFragment } from '../fragment/fragment.js';

const BLOCK = 'accordion-disclosure';

/** Returns a same-site path when the cell holds nothing but a single link. */
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

/**
 * Unwraps fragment .section / .default-content-wrapper elements so a body holds the
 * same plain rich text as an inline-authored cell (and no nested section styling).
 */
function unwrapSections(nodes) {
  const out = [];
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE
      && (node.classList.contains('section') || node.classList.contains('default-content-wrapper'))) {
      out.push(...unwrapSections([...node.childNodes]));
    } else {
      out.push(node);
    }
  });
  return out;
}

async function fillFromFragment(body) {
  const path = getFragmentPath(body);
  if (!path) return;
  // buildAutoBlocks also loads /fragments/ links and later replaces the link's parent;
  // park the link in a detached holder so that replacement cannot clobber this body
  const holder = document.createElement('div');
  holder.append(body.querySelector('a'));
  body.replaceChildren();
  const fragment = await loadFragment(path);
  if (!fragment) {
    body.append(...holder.childNodes);
    return;
  }
  body.replaceChildren(...unwrapSections([...fragment.childNodes]));
}

/**
 * Marks the footnote navigation links ("Go back", "Back to top") so they get the
 * Citi arrow / chevron treatment, and undoes any button decoration on legal links.
 */
function decorateLinks(body) {
  body.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
    const container = a.closest('.button-container');
    if (container && body.contains(container)) container.classList.remove('button-container');
    const text = a.textContent.trim().toLowerCase();
    if (text === 'go back') a.classList.add(`${BLOCK}-back`);
    if (text === 'back to top') a.classList.add(`${BLOCK}-top`);
  });

  // "Back to top" imported as plain text (no link): make it a working link
  body.querySelectorAll('p, li').forEach((el) => {
    if (el.textContent.trim().toLowerCase() !== 'back to top' || el.querySelector('a')) return;
    const a = document.createElement('a');
    a.href = '#';
    a.className = `${BLOCK}-top`;
    a.textContent = el.textContent.trim();
    el.replaceChildren(a);
  });

  // list items that only hold a "Back to top" link are navigation, not numbered footnotes
  body.querySelectorAll('li').forEach((li) => {
    const top = li.querySelector(`.${BLOCK}-top`);
    if (top && li.textContent.trim() === top.textContent.trim()) li.classList.add(`${BLOCK}-nav-item`);
  });
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

/** Opens the item that contains the element targeted by the URL hash (footnote links). */
function openForHash(block) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target || !block.contains(target)) return;
  const details = target.closest('details');
  if (details && !details.open) {
    details.open = true;
    target.scrollIntoView();
  }
}

export default async function decorate(block) {
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
      // extra cells authored by mistake are appended to the body
      cells.slice(2).forEach((extra) => body.append(...extra.childNodes));
    } else {
      // single cell: first element is the label, the rest is the body
      const [cell] = cells;
      const first = cell.firstElementChild;
      if (first) summary.append(...first.childNodes);
      if (first) first.remove();
      body = cell;
    }

    if (!summary.textContent.trim()) summary.textContent = 'Details';
    // fresh body element: drops a cell already swapped for fragment sections by buildAutoBlocks
    const content = unwrapSections([...body.childNodes]);
    body = document.createElement('div');
    body.className = `${BLOCK}-item-body`;
    body.append(...content);

    const details = document.createElement('details');
    details.className = `${BLOCK}-item`;
    // citi.com renders the legal disclosures expanded; the reader can collapse them
    details.open = true;
    details.append(summary, body);
    row.replaceWith(details);

    pending.push(fillFromFragment(body).then(() => {
      wrapTables(body);
      decorateLinks(body);
    }));
  });

  await Promise.all(pending);
  openForHash(block);
  window.addEventListener('hashchange', () => openForHash(block));
}
