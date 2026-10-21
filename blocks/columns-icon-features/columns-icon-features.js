/**
 * columns-icon-features: centred feature columns, each an icon, a heading,
 * a short description and a link. Authors may put features side by side in
 * one row or one feature per row; both lay out as an even grid.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const features = cells.filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img, .icon'));
  if (!features.length) return;

  const list = document.createElement('ul');
  list.className = 'columns-icon-features-list';

  features.forEach((cell) => {
    const item = document.createElement('li');
    item.className = 'columns-icon-features-item';

    // leading icon/image (on its own line, or the first thing in the cell)
    const first = cell.firstElementChild;
    let iconEl = null;
    if (first && first.matches('picture, img, span.icon')) {
      iconEl = first;
    } else if (first && first.matches('p') && !first.textContent.trim()
      && first.querySelector('picture, img, span.icon')) {
      iconEl = first;
    }
    if (iconEl) {
      const icon = document.createElement('div');
      icon.className = 'columns-icon-features-icon';
      icon.append(iconEl);
      item.append(icon);
    }

    const body = document.createElement('div');
    body.className = 'columns-icon-features-body';
    body.append(...cell.childNodes);
    item.append(body);
    list.append(item);
  });

  block.classList.add(`columns-icon-features-${features.length}-items`);
  block.replaceChildren(list);
}
