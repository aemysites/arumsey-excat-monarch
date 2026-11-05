const VISIBLE_ITEMS = 4;
const LESS_LABEL = document.documentElement.lang?.startsWith('fr') ? 'Réduire' : 'Collapse';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

/*
 * Optional "Load more" toggle: a short plain-text paragraph placed directly after
 * the link list is used as the button label. Lists longer than VISIBLE_ITEMS
 * are collapsed until the button is pressed.
 */
function setupLoadMore(list) {
  const items = [...list.children];
  const next = list.nextElementSibling;
  const isLabel = next && next.tagName === 'P' && !next.querySelector('a, picture, img')
    && next.textContent.trim().length > 0 && next.textContent.trim().length <= 30;
  if (!isLabel) return;

  const moreLabel = next.textContent.trim();
  next.remove();
  if (items.length <= VISIBLE_ITEMS) return;

  list.classList.add('columns-overview-collapsed');
  items.slice(VISIBLE_ITEMS).forEach((li) => li.classList.add('columns-overview-extra'));

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'columns-overview-toggle';
  button.textContent = moreLabel;
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const expanded = list.classList.toggle('columns-overview-collapsed') === false;
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? LESS_LABEL : moreLabel;
  });
  list.after(button);
}

/* a cell holding only an image (optionally linked), no text */
function isMediaCol(col) {
  return !!col.querySelector('picture, img') && !col.textContent.trim();
}

/* a cell whose content is a list (plus an optional label paragraph), no headings or media */
function isListCol(col) {
  const children = [...col.children];
  return children.some((el) => el.tagName === 'UL')
    && children.every((el) => el.tagName === 'UL' || el.tagName === 'P')
    && !col.querySelector('picture, img');
}

/*
 * List item: a leading link or <strong> is the title row; any text after it
 * (after an optional <br>) becomes the description below the rule.
 */
function decorateListItem(li) {
  const first = li.firstElementChild;
  const leading = [...li.childNodes].find((n) => n.nodeType === Node.ELEMENT_NODE
    || n.textContent.trim());
  if (!first || first !== leading || !['A', 'STRONG', 'B'].includes(first.tagName)) return;

  const title = document.createElement('div');
  title.className = 'columns-overview-item-title';
  li.prepend(title);
  title.append(first);
  if (first.tagName === 'A') li.classList.add('columns-overview-link-item');

  const rest = [...li.childNodes].filter((n) => n !== title);
  if (rest[0]?.nodeName === 'BR') rest.shift().remove();
  if (rest.some((n) => n.textContent.trim() || n.nodeType === Node.ELEMENT_NODE)) {
    const desc = document.createElement('p');
    desc.className = 'columns-overview-item-desc';
    rest.forEach((n) => desc.append(n));
    desc.innerHTML = desc.innerHTML.trim();
    li.append(desc);
  } else {
    rest.forEach((n) => n.remove());
  }
}

/* person contact card: [photo | name, role, phone/email list, read-more link] */
function decoratePerson(body) {
  const heading = body.querySelector(HEADINGS);
  const role = heading?.nextElementSibling;
  if (role && role.tagName === 'P' && !role.querySelector('a')) role.classList.add('columns-overview-role');
  body.querySelectorAll(':scope > ul').forEach((ul) => ul.classList.add('columns-overview-contacts'));
  const last = body.lastElementChild;
  if (last && last.tagName === 'P' && last.querySelector('a') && last.textContent.trim().length <= 30) {
    last.classList.add('columns-overview-cta');
  }
}

function markTitle(col) {
  const first = col.firstElementChild;
  if (first && first.matches(HEADINGS)) first.classList.add('columns-overview-title');
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-overview-${cols.length}-cols`);

  const contentCols = cols.filter((col) => col.textContent.trim() || col.querySelector('picture, img'));
  const [firstCol] = contentCols;
  const lastCol = contentCols[contentCols.length - 1];
  const twoCols = contentCols.length === 2;
  const isPerson = twoCols && isMediaCol(firstCol)
    && !!lastCol.querySelector(':scope > ul a[href^="tel:"], :scope > ul a[href^="mailto:"]');

  [...block.children].forEach((row) => {
    row.classList.add('columns-overview-row');
    [...row.children].forEach((col, idx) => {
      if (!col.textContent.trim() && !col.querySelector('picture, img')) {
        col.classList.add('columns-overview-empty-col');
        return;
      }
      if (isMediaCol(col)) {
        col.classList.add('columns-overview-media-col');
        return;
      }
      if (!isPerson && isListCol(col)) {
        col.classList.add('columns-overview-list-col');
        col.querySelectorAll(':scope > ul').forEach((list) => {
          list.classList.add('columns-overview-links');
          list.querySelectorAll(':scope > li').forEach(decorateListItem);
          setupLoadMore(list);
        });
        return;
      }
      col.classList.add(idx === 0 ? 'columns-overview-intro-col' : 'columns-overview-text-col');
      if (isPerson) decoratePerson(col);
    });
  });

  if (isPerson) {
    block.classList.add('columns-overview-person');
  } else if (block.querySelector('.columns-overview-list-col')) {
    block.classList.add('columns-overview-list');
    block.querySelectorAll('.columns-overview-intro-col').forEach(markTitle);
  } else if (twoCols && isMediaCol(lastCol)) {
    block.classList.add('columns-overview-media-last');
    markTitle(firstCol);
  } else if (twoCols && isMediaCol(firstCol)) {
    block.classList.add('columns-overview-media-first');
    markTitle(lastCol);
  }
}
