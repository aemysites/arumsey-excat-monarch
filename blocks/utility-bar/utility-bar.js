/*
 * utility-bar
 * Small row of utility actions shown at the top of the header (e.g. "How can we help?"
 * search entry and "Sign On"). Authors may put each action in its own cell, its own row,
 * or as a list in a single cell; everything is flattened into one list.
 */

function collectItems(block) {
  const items = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const listItems = cell.querySelectorAll(':scope > ul > li, :scope > ol > li');
      if (listItems.length) {
        listItems.forEach((li) => items.push([...li.childNodes]));
        return;
      }
      const paragraphs = cell.querySelectorAll(':scope > p');
      if (paragraphs.length) {
        paragraphs.forEach((p) => {
          if (p.textContent.trim() || p.querySelector('.icon, img')) items.push([...p.childNodes]);
        });
        return;
      }
      if (cell.textContent.trim() || cell.querySelector('.icon, img')) items.push([...cell.childNodes]);
    });
  });
  return items;
}

export default function decorate(block) {
  const items = collectItems(block);

  const list = document.createElement('ul');
  list.className = 'utility-bar-list';
  items.forEach((nodes) => {
    const li = document.createElement('li');
    li.className = 'utility-bar-item';
    li.append(...nodes);
    const link = li.querySelector('a');
    if (link) {
      link.classList.remove('button', 'primary', 'secondary');
      link.closest('.button-container')?.classList.remove('button-container');
      if (li.querySelector('.icon-search')) li.classList.add('utility-bar-search');
    }
    list.append(li);
  });

  const nav = document.createElement('nav');
  nav.className = 'utility-bar-nav';
  nav.setAttribute('aria-label', 'Utility');
  nav.append(list);
  block.replaceChildren(nav);
}
