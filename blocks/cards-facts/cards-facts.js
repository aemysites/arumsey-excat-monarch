/**
 * cards-facts: a grid of key facts. Each row is one fact:
 * label | value (an optional icon or image may precede the value, in its own cell or inline).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('img, picture, .icon'));
    if (!cells.length) return;

    const li = document.createElement('li');
    const label = document.createElement('div');
    label.className = 'cards-facts-label';
    const value = document.createElement('div');
    value.className = 'cards-facts-value';

    if (cells.length === 1) {
      // single cell: first heading/strong/paragraph is the label, the rest is the value
      const [first, ...rest] = [...cells[0].children];
      if (first && rest.length) {
        label.append(first);
        value.append(...rest);
      } else {
        value.append(...cells[0].childNodes);
      }
    } else {
      label.append(...cells[0].childNodes);
      cells.slice(1).forEach((cell) => {
        const iconOnly = !cell.textContent.trim() && cell.querySelector('img, picture, .icon');
        if (iconOnly) {
          const icon = document.createElement('span');
          icon.className = 'cards-facts-icon';
          icon.append(...cell.childNodes);
          value.prepend(icon);
        } else {
          value.append(...cell.childNodes);
        }
      });
    }

    // inline icon at the start of the value
    const leadIcon = value.querySelector(':scope > .icon, :scope > p > .icon:first-child');
    if (leadIcon && !value.querySelector('.cards-facts-icon')) {
      const icon = document.createElement('span');
      icon.className = 'cards-facts-icon';
      leadIcon.replaceWith(icon);
      icon.append(leadIcon);
      value.prepend(icon);
    }

    if (label.textContent.trim()) li.append(label);
    li.append(value);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
