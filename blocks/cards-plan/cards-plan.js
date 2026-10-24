/*
 * Cards Plan
 * Cover tier cards with a coloured header bar. One row per card:
 * header cell (title, badge, optional icon) | body cell (text, lists, rules, links).
 * With a single cell, everything up to and including the first heading is the header.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

function isLinkOnly(el) {
  if (el.tagName !== 'P') return false;
  const links = [...el.querySelectorAll('a[href]')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText.length > 0 && linkText === el.textContent.replace(/\s+/g, '');
}

function splitSingleCell(cell) {
  const header = document.createElement('div');
  const body = document.createElement('div');
  const children = [...cell.children];
  const headingIndex = children.findIndex((el) => /^H[1-6]$/.test(el.tagName));
  if (headingIndex < 0) {
    body.append(...cell.childNodes);
    return [null, body];
  }
  // a short badge paragraph directly after the title stays in the header
  let end = headingIndex;
  const next = children[headingIndex + 1];
  if (next && next.tagName === 'P' && !next.querySelector('a') && next.textContent.trim().length <= 40) {
    end += 1;
  }
  children.forEach((el, i) => (i <= end ? header : body).append(el));
  return [header, body];
}

function decorateHeader(header) {
  header.className = 'cards-plan-card-header';
  const children = [...header.children];
  const headingIndex = children.findIndex((el) => /^H[1-6]$/.test(el.tagName));
  children.forEach((el, i) => {
    if (i === headingIndex) return;
    if (el.querySelector('picture, img, .icon') && !el.textContent.trim()) {
      el.classList.add('cards-plan-card-icon');
    } else if (el.tagName === 'P' && headingIndex >= 0 && i > headingIndex) {
      el.classList.add('cards-plan-card-badge');
    }
  });
}

function decorateBody(body) {
  body.className = 'cards-plan-card-body';
  let group = null;
  [...body.children].forEach((el) => {
    if (isLinkOnly(el)) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'cards-plan-card-actions';
        el.before(group);
      }
      group.append(el);
    } else {
      group = null;
    }
  });
  const last = body.lastElementChild;
  if (last && last.classList.contains('cards-plan-card-actions')) last.classList.add('is-last');
  body.querySelectorAll('ul, ol').forEach((list) => {
    if ([...list.children].some((li) => li.querySelector(':scope > picture, :scope > .icon, :scope > p > picture'))) {
      list.classList.add('cards-plan-icon-list');
    }
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    const li = document.createElement('li');
    li.className = 'cards-plan-card';
    let header;
    let body;
    if (cells.length === 1) {
      [header, body] = splitSingleCell(cells[0]);
    } else {
      [header] = cells;
      body = document.createElement('div');
      cells.slice(1).forEach((cell) => body.append(...cell.childNodes));
    }
    [header, body].forEach((part) => {
      if (!part) return;
      [...part.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          node.replaceWith(p);
          p.append(node);
        }
      });
    });
    if (header && header.children.length) {
      decorateHeader(header);
      li.append(header);
    }
    if (body.children.length) {
      decorateBody(body);
      li.append(body);
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
