/**
 * Quick links: a bar of task or category links, optionally led by a label
 * (e.g. "I want to:").
 *
 * Authoring: a list of links, or one link per row/cell. With the `label`
 * option, the first row (or any heading/text without links) is the label.
 * Text without links is always treated as the label when present.
 *
 * Options (classes): label.
 */

export default function decorate(block) {
  const rows = [...block.children];
  const hasLabelOption = block.classList.contains('label');
  let labelNodes = [];
  const links = [];

  rows.forEach((row, i) => {
    const rowLinks = [...row.querySelectorAll('a[href]')];
    if (hasLabelOption && i === 0 && rows.length > 1) {
      const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
      if (!rowLinks.length || heading) {
        labelNodes = heading ? [heading] : [...row.querySelectorAll(':scope > div > *')];
        if (!labelNodes.length) labelNodes = [document.createTextNode(row.textContent.trim())];
        return;
      }
    }
    if (rowLinks.length) {
      links.push(...rowLinks);
    } else if (!labelNodes.length && row.textContent.trim()) {
      const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
      labelNodes = heading ? [heading] : [document.createTextNode(row.textContent.trim())];
    }
  });

  const elements = [];
  if (labelNodes.length) {
    const label = document.createElement('div');
    label.className = 'quick-links-label';
    label.append(...labelNodes);
    elements.push(label);
  }

  const ul = document.createElement('ul');
  ul.className = 'quick-links-list';
  links.forEach((a) => {
    const li = document.createElement('li');
    a.className = 'quick-links-link';
    li.append(a);
    ul.append(li);
  });
  elements.push(ul);

  if (labelNodes.length) block.classList.add('quick-links-has-label');
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', labelNodes.length ? labelNodes.map((n) => n.textContent).join(' ').trim() : 'Quick links');
  nav.append(...elements);
  block.replaceChildren(nav);
}
