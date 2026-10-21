/**
 * Moves a leading icon/image out of a cell into its own wrapper.
 * @param {Element} cell
 * @returns {Element|null} the icon wrapper
 */
function extractIcon(cell) {
  const first = cell.firstElementChild;
  if (!first) return null;
  let iconEl = null;
  if (first.matches('picture, img, span.icon')) {
    iconEl = first;
  } else if (first.matches('p')) {
    const lead = first.firstElementChild;
    const leadsWithIcon = lead && lead.matches('picture, img, span.icon')
      && first.firstChild === lead;
    if (leadsWithIcon && !first.textContent.trim()) {
      iconEl = first;
    } else if (leadsWithIcon) {
      // icon inline at the start of a text line: split it off
      iconEl = lead;
    }
  }
  if (!iconEl) return null;
  const icon = document.createElement('div');
  icon.className = 'columns-icon-strip-item-icon';
  icon.append(iconEl);
  return icon;
}

/**
 * columns-icon-strip: a title cell followed by icon + eyebrow + link items.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cells = rows.flatMap((row) => [...row.children])
    .filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img, .icon'));
  if (!cells.length) return;

  // first cell is the strip title when it holds a heading or text without links
  const [firstCell] = cells;
  const firstIsTitle = cells.length > 1
    && (firstCell.querySelector('h1, h2, h3, h4, h5, h6') || !firstCell.querySelector('a, picture, img, .icon'));

  const strip = document.createElement('div');
  strip.className = 'columns-icon-strip-inner';

  if (firstIsTitle) {
    const title = document.createElement('div');
    title.className = 'columns-icon-strip-title';
    title.append(...firstCell.childNodes);
    strip.append(title);
  }

  const items = document.createElement('ul');
  items.className = 'columns-icon-strip-items';
  (firstIsTitle ? cells.slice(1) : cells).forEach((cell) => {
    const item = document.createElement('li');
    item.className = 'columns-icon-strip-item';
    const icon = extractIcon(cell);
    if (icon) item.append(icon);
    const body = document.createElement('div');
    body.className = 'columns-icon-strip-item-body';
    body.append(...cell.childNodes);
    item.append(body);
    items.append(item);
  });
  strip.append(items);

  block.classList.add(`columns-icon-strip-${items.children.length}-items`);
  block.replaceChildren(strip);
}
