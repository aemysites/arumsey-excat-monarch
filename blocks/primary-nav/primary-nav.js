/*
 * primary-nav
 * Horizontal row of top-level section links (Credit Cards, Banking, Lending, ...).
 * Authors may use a bulleted list, one link per cell, or one link per row.
 * A list item with a nested list becomes a disclosure (button + submenu).
 */

let navCount = 0;

function collectItems(block) {
  const items = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const list = cell.querySelector(':scope > ul, :scope > ol');
      if (list) {
        [...list.children].forEach((li) => items.push(li));
        return;
      }
      const paragraphs = [...cell.querySelectorAll(':scope > p')];
      const sources = paragraphs.length ? paragraphs : [cell];
      sources.forEach((source) => {
        if (!source.textContent.trim()) return;
        const li = document.createElement('li');
        li.append(...source.childNodes);
        items.push(li);
      });
    });
  });
  return items;
}

function closeAll(list, except) {
  list.querySelectorAll(':scope > li > button[aria-expanded="true"]').forEach((btn) => {
    if (btn !== except) btn.setAttribute('aria-expanded', 'false');
  });
}

export default function decorate(block) {
  navCount += 1;
  const items = collectItems(block);

  const list = document.createElement('ul');
  list.className = 'primary-nav-list';

  items.forEach((li, i) => {
    li.className = 'primary-nav-item';
    li.querySelectorAll('a').forEach((a) => {
      a.classList.remove('button', 'primary', 'secondary');
      a.closest('.button-container')?.classList.remove('button-container');
    });

    const submenu = li.querySelector(':scope > ul, :scope > ol');
    if (submenu) {
      const submenuId = `primary-nav-${navCount}-submenu-${i + 1}`;
      submenu.className = 'primary-nav-submenu';
      submenu.id = submenuId;
      const labelNodes = [...li.childNodes].filter((node) => node !== submenu);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'primary-nav-toggle';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', submenuId);
      button.textContent = labelNodes.map((node) => node.textContent).join('').trim();
      labelNodes.forEach((node) => node.remove());
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        closeAll(list, button);
        button.setAttribute('aria-expanded', String(!expanded));
      });
      li.prepend(button);
      li.classList.add('primary-nav-has-submenu');
    }
    list.append(li);
  });

  list.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = list.querySelector('button[aria-expanded="true"]');
    if (open) {
      open.setAttribute('aria-expanded', 'false');
      open.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) closeAll(list);
  });

  const nav = document.createElement('nav');
  nav.className = 'primary-nav-nav';
  nav.setAttribute('aria-label', 'Primary');
  nav.append(list);
  block.replaceChildren(nav);
}
