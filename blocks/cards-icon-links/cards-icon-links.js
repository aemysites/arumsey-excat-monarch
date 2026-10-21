/**
 * cards-icon-links: a row of icon + label shortcut links (e.g. card categories).
 * Each authored row is one item. A row may hold the icon and the link in one cell
 * or in separate cells; the whole item becomes a single link when one link exists.
 * Rows that carry more than a label (title + description paragraphs) keep their
 * authored content in a body instead of being flattened to one label.
 * Options: light (light foreground on a dark section).
 */
const TEXT_BLOCKS = 'p, h1, h2, h3, h4, h5, h6, ul, ol';

function isRich(row) {
  return [...row.querySelectorAll(TEXT_BLOCKS)]
    .filter((el) => el.textContent.trim()).length > 1;
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const picture = row.querySelector('picture');
    const img = picture ? null : row.querySelector('img');
    const icon = picture || img;
    const rich = isRich(row);
    const links = row.querySelectorAll('a[href]');
    const link = !rich && links.length === 1 ? links[0] : null;
    const text = (link ? link.textContent : row.textContent).trim();
    if (!icon && !text) return;

    const li = document.createElement('li');
    const target = link ? document.createElement('a') : document.createElement('div');
    target.className = 'cards-icon-links-item';
    if (link) {
      target.href = link.href;
      if (link.title) target.title = link.title;
      if (link.target) target.target = link.target;
    }

    if (icon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'cards-icon-links-icon';
      const iconImg = icon.tagName === 'IMG' ? icon : icon.querySelector('img');
      // the label carries the meaning; the icon is decorative next to it
      if (iconImg && text) iconImg.alt = '';
      const iconBox = icon.closest('span.icon') || icon;
      iconWrap.append(iconBox);
      target.append(iconWrap);
    }

    if (rich) {
      li.classList.add('cards-icon-links-rich');
      const body = document.createElement('div');
      body.className = 'cards-icon-links-body';
      [...row.querySelectorAll(TEXT_BLOCKS)]
        .filter((el) => !el.parentElement.closest(TEXT_BLOCKS))
        .forEach((el) => { if (el.textContent.trim()) body.append(el); });
      target.append(body);
    } else if (text) {
      const label = document.createElement('span');
      label.className = 'cards-icon-links-label';
      label.textContent = text;
      target.append(label);
    }

    li.append(target);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
