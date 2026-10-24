function labelIconLinks(block) {
  block.querySelectorAll('a[href]').forEach((link) => {
    if (link.textContent.trim() || link.getAttribute('aria-label')) return;
    const icon = link.querySelector('span.icon');
    const img = link.querySelector('img');
    const iconName = icon && [...icon.classList].find((c) => c.startsWith('icon-') && c !== 'icon');
    const label = (img && img.alt) || (iconName && iconName.replace(/^icon-/, '').replace(/-/g, ' '));
    if (label) link.setAttribute('aria-label', label);
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const colCount = Math.max(0, ...rows.map((row) => row.children.length));
  if (colCount) block.classList.add(`columns-footer-${colCount}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-footer-row');
    [...row.children].forEach((col) => col.classList.add('columns-footer-col'));
  });

  if (block.classList.contains('social')) {
    // social: a list (or run of links) of icon links rendered as one inline row
    block.querySelectorAll('ul').forEach((ul) => ul.classList.add('columns-footer-social-list'));
    labelIconLinks(block);
  }
}
