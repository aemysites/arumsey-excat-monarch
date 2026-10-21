import { loadFragment } from '../fragment/fragment.js';

/**
 * columns-choice: side-by-side columns, by default two alternatives split by an
 * "or" divider (e.g. "$500 off closing costs" OR "Special pricing").
 * Each authored row is one set of columns; each cell is one column.
 * A short middle cell (e.g. "or") is used as the divider text; otherwise a divider
 * reading "or" is inserted between columns of choice layouts.
 * Options: media-promo (image + text promo), promo-banner (text + image banner),
 * with-tables (columns hold tables), with-icons (centred icon cards).
 * Promo layouts have no divider. Unknown options are ignored.
 * A column holding only a /fragments/ link is replaced by that fragment's content.
 */

const PROMO_OPTIONS = ['media-promo', 'promo-banner'];

function isFragmentLink(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return false;
  try {
    const url = new URL(links[0].href, window.location.href);
    return url.origin === window.location.origin && url.pathname.includes('/fragments/');
  } catch (e) {
    return false;
  }
}

async function inlineFragment(cell) {
  const fragment = await loadFragment(new URL(cell.querySelector('a').href).pathname);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope .section')];
  cell.replaceChildren(...(sections.length
    ? sections.flatMap((s) => [...s.childNodes])
    : [...fragment.childNodes]));
}

function createDivider(text = 'or') {
  const divider = document.createElement('div');
  divider.className = 'columns-choice-divider';
  const label = document.createElement('span');
  label.textContent = text;
  divider.append(label);
  return divider;
}

function isDividerCell(cell) {
  const text = cell.textContent.trim();
  return text.length > 0 && text.length <= 4 && !cell.querySelector('picture, img, a, table');
}

function isLinkOnlyParagraph(p) {
  const links = p.querySelectorAll('a[href]');
  return links.length === 1 && !p.querySelector('img')
    && p.textContent.trim() === links[0].textContent.trim();
}

/**
 * Tags column copy so CSS can follow the citi.com module anatomy:
 * eyebrow (short line above the heading), CTA paragraphs and the fine print after them.
 * Authored formatting wins: links already made buttons by decorateButtons keep their type.
 * Plain CTA links get the button type of the source module: a filled/outlined button in
 * promo layouts, a light button in the first choice column and chevron links elsewhere.
 */
function decorateCopy(col, colIndex, block) {
  const isBanner = block.classList.contains('promo-banner');
  const isPromo = isBanner || block.classList.contains('media-promo');
  const paragraphs = [...col.children].filter((el) => el.tagName === 'P');

  const first = col.firstElementChild;
  if (first && first.tagName === 'P' && !first.querySelector('a, picture, img')
    && /^H[1-6]$/.test(first.nextElementSibling?.tagName || '')) {
    first.classList.add('columns-choice-eyebrow');
  }

  let seenCta = false;
  paragraphs.forEach((p) => {
    if (isLinkOnlyParagraph(p)) {
      p.classList.add('columns-choice-cta');
      const a = p.querySelector('a');
      if (!a.classList.contains('button')) {
        let type = 'accent';
        if (isPromo) type = isBanner ? 'secondary' : 'primary';
        else if (colIndex === 0 && !seenCta) type = 'primary';
        a.classList.add('button', type);
      }
      seenCta = true;
    } else if (seenCta && !p.classList.contains('columns-choice-eyebrow')) {
      p.classList.add('columns-choice-note');
    }
  });
}

export default async function decorate(block) {
  const isPromo = PROMO_OPTIONS.some((option) => block.classList.contains(option));
  const pending = [];
  let maxCols = 0;

  [...block.children].forEach((row) => {
    row.classList.add('columns-choice-row');
    // drop empty cells authors leave behind
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img, table')) cell.remove();
    });

    let cells = [...row.children];
    // an authored short middle cell ("or") becomes the divider
    if (cells.length === 3 && isDividerCell(cells[1])) {
      const divider = createDivider(cells[1].textContent.trim());
      cells[1].replaceWith(divider);
      cells = [cells[0], cells[2]];
    } else if (!isPromo && cells.length === 2) {
      cells[0].after(createDivider());
    }

    let copyIndex = 0;
    cells.forEach((cell) => {
      cell.classList.add('columns-choice-col');
      if (isFragmentLink(cell)) {
        pending.push(inlineFragment(cell));
        return;
      }
      const pic = cell.querySelector('picture');
      if (pic && cell.children.length === 1 && !cell.textContent.trim()) {
        cell.classList.add('columns-choice-img-col');
        return;
      }
      if (cell.querySelector('table')) cell.classList.add('columns-choice-table-col');
      decorateCopy(cell, copyIndex, block);
      copyIndex += 1;
    });
    maxCols = Math.max(maxCols, cells.length);
  });

  block.classList.add(`columns-choice-${maxCols || 1}-cols`);
  await Promise.all(pending);
}
