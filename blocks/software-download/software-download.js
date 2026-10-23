import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * software-download: product copy, a version/state picker with a download
 * button, and an optional image.
 *
 * Authored cells (one row; any may be missing, order is free):
 *  - Content: eyebrow, heading, text, price.
 *  - Downloads: a list. Linked items are downloadable versions/states;
 *    plain items (e.g. "Coming Jan. 2027") are shown but disable the button.
 *    An optional paragraph after the list sets the button label
 *    (default "Download").
 *  - Image: a cell with only a picture.
 */

let idCounter = 0;

function classify(cell) {
  if (cell.querySelector('ul, ol')) return 'downloads';
  const text = cell.textContent.trim();
  if (!text && cell.querySelector('picture, img, video, iframe')) return 'media';
  return text ? 'content' : 'empty';
}

function buildPicker(cell) {
  const items = [...cell.querySelectorAll('li')]
    .map((li) => {
      const a = li.querySelector('a');
      return { label: li.textContent.trim(), href: a ? a.href : '' };
    })
    .filter((i) => i.label);
  const extra = [...cell.querySelectorAll(':scope > p')];
  const buttonText = extra.find((p) => !/\d/.test(p.textContent))?.textContent.trim() || 'Download';
  const priceP = extra.find((p) => /\d/.test(p.textContent));

  const picker = document.createElement('div');
  picker.className = 'software-download-picker';
  const button = document.createElement('a');
  button.className = 'button primary software-download-button';
  button.textContent = buttonText;

  const setTarget = (item) => {
    if (item?.href) {
      button.href = item.href;
      button.removeAttribute('aria-disabled');
      button.removeAttribute('tabindex');
    } else {
      button.removeAttribute('href');
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
    }
  };

  if (items.length) {
    idCounter += 1;
    const id = `software-download-select-${idCounter}`;
    const label = document.createElement('label');
    label.className = 'software-download-label';
    label.htmlFor = id;
    label.textContent = 'Choose a version';
    const select = document.createElement('select');
    select.id = id;
    items.forEach((item, i) => {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = item.label;
      select.append(option);
    });
    // a single entry (e.g. "Coming Jan. 2027") is shown but cannot be changed
    if (items.length === 1) select.disabled = true;
    else select.addEventListener('change', () => setTarget(items[Number(select.value)]));
    const field = document.createElement('div');
    field.className = 'software-download-field';
    field.append(select);
    picker.append(label, field);
  }
  setTarget(items[0]);

  const actions = document.createElement('div');
  actions.className = 'software-download-actions';
  if (priceP) {
    priceP.className = 'software-download-price';
    actions.append(priceP);
  }
  actions.append(button);
  picker.append(actions);
  return picker;
}

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const main = document.createElement('div');
  main.className = 'software-download-main';
  let media = null;

  cells.forEach((cell) => {
    const type = classify(cell);
    if (type === 'content') {
      cell.className = 'software-download-content';
      // a short first paragraph directly before a heading acts as the eyebrow
      const first = cell.firstElementChild;
      if (first && first.tagName === 'P' && first.textContent.trim().length < 80
        && /^H[1-6]$/.test(first.nextElementSibling?.tagName || '')
        && !first.querySelector('a, picture')) {
        first.classList.add('software-download-eyebrow');
      }
      main.insertBefore(cell, main.querySelector('.software-download-picker'));
    } else if (type === 'downloads') {
      main.append(buildPicker(cell));
    } else if (type === 'media' && !media) {
      cell.className = 'software-download-media';
      media = cell;
    }
  });

  const layout = document.createElement('div');
  layout.className = 'software-download-layout';
  layout.append(main);
  if (media) {
    layout.append(media);
    block.classList.add('software-download-has-media');
  }
  block.replaceChildren(layout);

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}
