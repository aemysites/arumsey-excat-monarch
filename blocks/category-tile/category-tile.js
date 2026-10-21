/**
 * category-tile: banner-like link tiles, each a short uppercase label plus an icon
 * (e.g. "Certificates of Deposit"). Each authored row is one tile:
 * a label cell (heading, text or link) and an image cell. The first image is the
 * tile background (citi.com blends it over the tile colour); an optional second
 * image is the icon shown at the right.
 * The whole tile is one link when the row contains a link.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const pictures = [...row.querySelectorAll('picture')];
    const looseImgs = [...row.querySelectorAll('img')].filter((img) => !img.closest('picture'));
    const images = [...pictures, ...looseImgs];
    const link = row.querySelector('a[href]');
    const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const text = (heading || link || row).textContent.trim();
    if (!text && !images.length) return;

    const li = document.createElement('li');
    const tile = document.createElement(link ? 'a' : 'div');
    tile.className = 'category-tile-tile';
    if (link) {
      tile.href = link.href;
      if (link.target) tile.target = link.target;
    }

    const background = images.shift();
    const icon = images.shift();

    if (background) {
      const bg = document.createElement('span');
      bg.className = 'category-tile-background';
      const bgImg = background.tagName === 'IMG' ? background : background.querySelector('img');
      if (bgImg) bgImg.alt = '';
      bg.append(background);
      tile.append(bg);
      li.classList.add('category-tile-has-background');
    }

    if (text) {
      const label = document.createElement(heading ? heading.tagName.toLowerCase() : 'span');
      label.className = 'category-tile-label';
      label.textContent = text;
      if (heading && heading.id) label.id = heading.id;
      tile.append(label);
    }

    if (icon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'category-tile-icon';
      const iconImg = icon.tagName === 'IMG' ? icon : icon.querySelector('img');
      if (iconImg && text) iconImg.alt = '';
      iconWrap.append(icon);
      tile.append(iconWrap);
    }

    li.append(tile);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
