import { loadFragment } from '../fragment/fragment.js';

const HEADING = 'h1, h2, h3, h4, h5, h6';

function fragmentPath(col) {
  const links = col.querySelectorAll('a[href]');
  if (links.length !== 1 || links[0].textContent.trim() !== col.textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

async function inlineFragment(col, path) {
  const fragment = await loadFragment(path);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  col.replaceChildren(...(sections.length
    ? sections.flatMap((section) => [...section.childNodes])
    : [...fragment.childNodes]));
}

function decorateColumn(col) {
  col.classList.add('columns-links-col');

  // image option: an icon paragraph followed by a plain text label (no links) is a title too
  col.querySelectorAll(':scope > p').forEach((p) => {
    const next = p.nextElementSibling;
    if (!p.querySelector('picture, img, span.icon') || p.textContent.trim()
      || !next || !next.matches('p') || next.querySelector('a, picture, img')
      || !next.textContent.trim()) return;
    const title = document.createElement('div');
    title.className = 'columns-links-title';
    next.classList.add('columns-links-label');
    p.before(title);
    title.append(p, next);
  });

  // an icon directly before (or inside) the column heading sits beside it
  col.querySelectorAll(HEADING).forEach((heading) => {
    const prev = heading.previousElementSibling;
    if (prev && prev.matches('p') && prev.querySelector('picture, img, span.icon')
      && !prev.textContent.trim()) {
      const title = document.createElement('div');
      title.className = 'columns-links-title';
      heading.before(title);
      title.append(prev, heading);
    } else if (heading.querySelector('picture, img, span.icon')) {
      heading.classList.add('columns-links-title');
    }
  });

  // standalone link paragraphs and link lists are rendered as link rows
  col.querySelectorAll('ul, ol').forEach((list) => list.classList.add('columns-links-list'));
  col.querySelectorAll(':scope > p').forEach((p) => {
    const link = p.querySelector(':scope > a:only-child, :scope > strong > a:only-child');
    if (link && link.textContent.trim() === p.textContent.trim()) p.classList.add('columns-links-item');
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  const colCount = Math.max(0, ...rows.map((row) => row.children.length));
  if (colCount) block.classList.add(`columns-links-${colCount}-cols`);

  const loads = [];
  rows.forEach((row, index) => {
    row.classList.add('columns-links-row');
    // an intro row: first single-cell row in a multi-column block
    if (index === 0 && rows.length > 1 && row.children.length === 1 && colCount > 1) {
      row.classList.add('columns-links-intro');
    }
    [...row.children].forEach((col) => {
      const path = fragmentPath(col);
      if (path) {
        loads.push(inlineFragment(col, path).then(() => decorateColumn(col)));
      } else {
        decorateColumn(col);
      }
    });
  });
  await Promise.all(loads);
}
