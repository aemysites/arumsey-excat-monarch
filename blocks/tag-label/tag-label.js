/*
 * Tag Label
 * Small category/status chips (e.g. "Not covered", article topic tags) or a short
 * labelled callout. Every non-empty cell becomes one item:
 *  - a cell with a heading or more than one paragraph -> a callout panel
 *  - anything else -> a chip (a link-only cell becomes a link chip)
 */
function isLinkOnly(el) {
  const links = [...el.querySelectorAll('a[href]')];
  return links.length === 1 && links[0].textContent.trim() === el.textContent.trim();
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'tag-label-list';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim()) return;
      const li = document.createElement('li');
      const isPanel = !!cell.querySelector('h1, h2, h3, h4, h5, h6')
        || cell.querySelectorAll(':scope > p').length > 1
        || !!cell.querySelector('ul, ol');
      if (isPanel) {
        li.className = 'tag-label-panel';
        li.append(...cell.childNodes);
      } else {
        li.className = 'tag-label-item';
        if (isLinkOnly(cell)) li.classList.add('is-link');
        const only = cell.children.length === 1 && cell.firstElementChild.tagName === 'P'
          ? cell.firstElementChild : cell;
        li.append(...only.childNodes);
      }
      list.append(li);
    });
  });

  if (list.querySelector('.tag-label-panel')) block.classList.add('has-panel');
  block.replaceChildren(list);
}
