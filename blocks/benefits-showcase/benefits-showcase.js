/*
 * Benefits Showcase
 * Large lifestyle image with an overlaid panel listing card benefits:
 * a panel heading followed by benefit items (title + description, optional icon).
 *
 * Authoring (rows, in any order for images):
 *  - Image row (only a picture): first = background image,
 *    second = side photo (with-side-photo) or secondary decorative image.
 *  - First text row: panel heading (and optional intro text).
 *  - Further text rows: one benefit each; an optional picture-only cell
 *    in the row is the benefit icon.
 *
 * Options: dark (dark translucent panel), benefit-columns (benefits in a
 * row of columns with icons), single-benefit (heading + text only),
 * with-side-photo (panel beside a separate photo).
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'benefits-showcase';

function hasContent(cell) {
  return !!cell.textContent.trim() || !!cell.querySelector('picture');
}

function isPictureOnly(cell) {
  return !!cell.querySelector('picture') && !cell.textContent.trim();
}

function optimizeImages(root, width) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });
}

export default function decorate(block) {
  const images = [];
  const textRows = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter(hasContent);
    if (!cells.length) return;
    if (cells.every(isPictureOnly)) {
      cells.forEach((cell) => cell.querySelectorAll('picture').forEach((p) => images.push(p)));
    } else {
      textRows.push(cells);
    }
  });

  const panel = document.createElement('div');
  panel.className = `${BLOCK}-panel`;

  textRows.forEach((cells, index) => {
    if (index === 0) {
      const intro = document.createElement('div');
      intro.className = `${BLOCK}-intro`;
      cells.forEach((cell) => intro.append(...cell.childNodes));
      panel.append(intro);
      return;
    }
    const item = document.createElement('div');
    item.className = `${BLOCK}-item`;
    cells.forEach((cell) => {
      if (isPictureOnly(cell)) {
        cell.className = `${BLOCK}-item-icon`;
      } else {
        cell.className = `${BLOCK}-item-body`;
      }
      item.append(cell);
    });
    let list = panel.querySelector(`.${BLOCK}-items`);
    if (!list) {
      list = document.createElement('div');
      list.className = `${BLOCK}-items`;
      panel.append(list);
    }
    list.append(item);
  });

  const children = [];
  if (images[0]) {
    const bg = document.createElement('div');
    bg.className = `${BLOCK}-background`;
    bg.append(images[0]);
    optimizeImages(bg, '2000');
    children.push(bg);
  } else {
    block.classList.add(`${BLOCK}-no-image`);
  }
  children.push(panel);
  images.slice(1).forEach((pic, i) => {
    const photo = document.createElement('div');
    photo.className = `${BLOCK}-photo ${BLOCK}-photo-${i + 1}`;
    photo.append(pic);
    optimizeImages(photo, '900');
    children.push(photo);
  });

  optimizeImages(panel, '200');
  block.replaceChildren(...children);
}
