import { loadFragment } from '../fragment/fragment.js';

const ICON_SELECTOR = ':scope > picture, :scope > img, :scope > span.icon';

/**
 * Returns the fragment path when a cell holds nothing but a single fragment link.
 * @param {Element} cell
 * @returns {string|null}
 */
function getFragmentPath(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  const link = links[0];
  if (cell.textContent.trim() !== link.textContent.trim()) return null;
  if (cell.querySelector('picture, img')) return null;
  try {
    const { pathname } = new URL(link.href, window.location.href);
    return pathname.includes('/fragments/') ? pathname : null;
  } catch {
    return null;
  }
}

/**
 * Replaces a fragment-link cell with the fragment's content.
 * @param {Element} cell
 */
async function inlineFragment(cell) {
  const path = getFragmentPath(cell);
  if (!path) return;
  const fragment = await loadFragment(path);
  if (!fragment) return;
  const content = [...fragment.querySelectorAll(':scope > .section > *')];
  if (!content.length) return;
  cell.replaceChildren(...content);
}

/**
 * Marks paragraphs/list items that lead with an icon so they lay out icon + text.
 * @param {Element} cell
 */
function decorateIconItems(cell) {
  cell.querySelectorAll('p, li, h3, h4, h5, h6').forEach((item) => {
    const icon = item.querySelector(ICON_SELECTOR);
    if (!icon || item.firstElementChild !== icon) return;
    if (item.textContent.trim() === '' && item.children.length === 1) {
      // icon on its own line: it leads the next element
      item.classList.add('columns-contact-icon');
      return;
    }
    item.classList.add('columns-contact-icon-item');
  });
}

/**
 * with-select: turn a list of links into a dropdown. A list item without a link
 * becomes the placeholder; a button that follows the list follows the selection.
 * @param {Element} cell
 */
function decorateSelect(cell) {
  cell.querySelectorAll('ul, ol').forEach((list, index) => {
    const items = [...list.querySelectorAll(':scope > li')];
    const linkItems = items.filter((li) => li.querySelector('a[href]'));
    const placeholderItem = items.find((li) => !li.querySelector('a[href]'));
    // a list that is only a placeholder ("Select a CD") still renders as the dropdown
    const placeholderOnly = !linkItems.length && items.length === 1 && placeholderItem;
    if (!linkItems.length && !placeholderOnly) return;

    const select = document.createElement('select');
    select.className = 'columns-contact-select';
    const id = `columns-contact-select-${Math.random().toString(36).slice(2, 8)}-${index}`;
    select.id = id;

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = placeholderItem ? placeholderItem.textContent.trim() : 'Select an option';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.append(placeholder);

    linkItems.forEach((li) => {
      const link = li.querySelector('a[href]');
      const option = document.createElement('option');
      option.value = link.href;
      option.textContent = link.textContent.trim();
      select.append(option);
    });

    const label = document.createElement('label');
    label.className = 'columns-contact-select-label';
    label.htmlFor = id;
    label.textContent = placeholder.textContent;

    const wrapper = document.createElement('div');
    wrapper.className = 'columns-contact-select-wrapper';
    wrapper.append(label, select);

    // a button directly after the list applies the selection
    const next = list.nextElementSibling;
    const button = next && next.matches('.button-wrapper, p') ? next.querySelector('a.button, a[href]') : null;
    if (button && next.textContent.trim() === button.textContent.trim()) {
      button.setAttribute('aria-disabled', 'true');
      select.addEventListener('change', () => {
        button.href = select.value;
        button.removeAttribute('aria-disabled');
      });
      button.addEventListener('click', (e) => {
        if (!select.value) e.preventDefault();
      });
    } else {
      select.addEventListener('change', () => {
        if (select.value) window.location.href = select.value;
      });
    }

    list.replaceWith(wrapper);
  });
}

/**
 * Marks paragraphs that hold a single link: phone numbers vs. chevron text CTAs.
 * @param {Element} cell
 */
function decorateLinkLines(cell) {
  cell.querySelectorAll(':scope > p').forEach((p) => {
    const links = p.querySelectorAll('a[href]');
    if (links.length !== 1 || p.querySelector('picture, img')) return;
    const link = links[0];
    if (p.textContent.trim() !== link.textContent.trim()) return;
    const isPhone = link.getAttribute('href').startsWith('tel:');
    p.classList.add(isPhone ? 'columns-contact-phone' : 'columns-contact-cta');
  });
}

function decorateCell(cell, withSelect) {
  cell.classList.add('columns-contact-col');
  const onlyPicture = cell.children.length === 1 && cell.querySelector('picture')
    && cell.textContent.trim() === '';
  if (onlyPicture) cell.classList.add('columns-contact-img-col');
  if (withSelect) decorateSelect(cell);
  decorateIconItems(cell);
  decorateLinkLines(cell);
  // icon on its own line followed by a sub-heading: icon and heading share a line
  if (!withSelect && cell.querySelector(':scope > .columns-contact-icon + h3')) {
    cell.classList.add('columns-contact-has-icon');
  }
}

/**
 * Cells that open with an h2 start a group; cells without one continue the group
 * before them and stack under it (e.g. "How to open an account": two steps).
 * @param {Element} block
 * @param {Element[]} cells
 */
function decorateGroups(block, cells) {
  const leads = cells.map((cell) => !!cell.querySelector(':scope > h2'));
  if (!leads[0] || leads.every((lead) => lead)) return;
  let group = 0;
  cells.forEach((cell, i) => {
    if (leads[i]) group += 1;
    else cell.classList.add('columns-contact-continued');
    cell.style.setProperty('--columns-contact-group', group);
  });
  block.classList.add('columns-contact-grouped');
  block.style.setProperty('--columns-contact-groups', group);
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const withSelect = block.classList.contains('with-select');

  const maxCols = Math.max(...rows.map((row) => row.children.length), 1);
  block.classList.add(`columns-contact-${maxCols}-cols`);

  const cells = rows.flatMap((row) => {
    row.classList.add('columns-contact-row');
    return [...row.children];
  });

  await Promise.all(cells.map((cell) => inlineFragment(cell).catch(() => {})));
  cells.forEach((cell) => decorateCell(cell, withSelect));
  if (!withSelect) decorateGroups(block, cells);
  // icon above a short h2 (mortgage rates / calculators fragment): tile card look
  if (block.querySelector('.columns-contact-icon + h2')) {
    block.classList.add('columns-contact-icon-tiles');
  }
}
