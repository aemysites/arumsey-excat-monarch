/*
 * Link Pills Block
 * Wrapping list of pill-shaped links (e.g. industries).
 * Authors use one row per link, cells with links, or one cell with a list.
 * Items without a link render as plain pills.
 */

function collectItems(block) {
  const listItems = [...block.querySelectorAll('li')];
  if (listItems.length) return listItems;
  return [...block.querySelectorAll(':scope > div > div')].flatMap((cell) => {
    const links = [...cell.querySelectorAll('a')];
    if (links.length > 1) return links;
    return [cell];
  });
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'link-pills-list';

  collectItems(block).forEach((el) => {
    const link = el.tagName === 'A' ? el : el.querySelector('a');
    const label = (link || el).textContent.trim();
    if (!label) return;
    const li = document.createElement('li');
    li.className = 'link-pills-item';
    let pill;
    if (link) {
      pill = document.createElement('a');
      pill.href = link.getAttribute('href');
      if (link.title) pill.title = link.title;
    } else {
      pill = document.createElement('span');
    }
    pill.className = 'link-pills-pill';
    pill.textContent = label;
    li.append(pill);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
