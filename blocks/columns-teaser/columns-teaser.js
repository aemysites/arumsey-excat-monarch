import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const LAYOUT_OPTIONS = ['grey', 'shadow'];

function fragmentPath(el) {
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1 || links[0].textContent.trim() !== el.textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

async function inlineFragment(el, path) {
  const fragment = await loadFragment(path);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  el.replaceChildren(...(sections.length
    ? sections.flatMap((section) => [...section.childNodes])
    : [...fragment.childNodes]));
}

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

/**
 * Default teaser: a boxed question that expands to its answer.
 * The first cell is the question; every other cell (or row) is the answer.
 */
function decorateToggle(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const [questionCell, ...answerCells] = cells;
  if (!questionCell) return;

  const trigger = questionCell.querySelector('h1, h2, h3, h4, h5, h6, p') || questionCell;
  const panel = document.createElement('div');
  panel.className = 'columns-teaser-panel';
  panel.id = `columns-teaser-panel-${Math.random().toString(36).slice(2, 8)}`;
  // anything after the question inside its own cell belongs to the answer too
  if (trigger !== questionCell) {
    [...questionCell.children].filter((el) => el !== trigger).forEach((el) => panel.append(el));
  }
  answerCells.forEach((cell) => panel.append(...cell.childNodes));

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'columns-teaser-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', panel.id);
  button.append(...trigger.childNodes);

  const heading = document.createElement(/^H\d$/.test(trigger.tagName) ? trigger.tagName : 'p');
  heading.className = 'columns-teaser-question';
  heading.append(button);

  if (!panel.textContent.trim() && !panel.querySelector('picture, img')) {
    block.replaceChildren(heading);
    button.disabled = true;
    return;
  }

  panel.hidden = true;
  const path = fragmentPath(panel);
  let loaded = !path;
  button.addEventListener('click', async () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    if (!expanded && !loaded) {
      loaded = true;
      await inlineFragment(panel, path);
    }
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });

  block.replaceChildren(heading, panel);
  block.classList.add('columns-teaser-toggle-mode');
}

function decorateColumns(block) {
  const rows = [...block.children];
  const colCount = Math.max(0, ...rows.map((row) => row.children.length));
  if (colCount) block.classList.add(`columns-teaser-${colCount}-cols`);
  rows.forEach((row) => {
    row.classList.add('columns-teaser-row');
    [...row.children].forEach((col) => {
      col.classList.add('columns-teaser-col');
      const clone = col.cloneNode(true);
      clone.querySelectorAll('picture, img').forEach((el) => el.remove());
      if (col.querySelector('picture, img') && !clone.textContent.trim()) {
        col.classList.add('columns-teaser-img-col');
      }
    });
  });
  // shadow: links carrying an icon (":name:" token, may follow the label) show icon first
  block.querySelectorAll('a').forEach((a) => {
    const icon = a.querySelector('span.icon');
    if (!icon) return;
    const label = document.createElement('span');
    label.className = 'columns-teaser-label';
    label.append(...[...a.childNodes].filter((n) => n !== icon));
    label.textContent = label.textContent.trim();
    a.replaceChildren(icon, label);
    a.classList.add('columns-teaser-icon-link');
  });
  // icon + link paragraphs line up on one row
  block.querySelectorAll('p, li').forEach((el) => {
    const first = el.firstElementChild;
    if (first && first.matches('picture, img, span.icon') && el.querySelector('a')) {
      el.classList.add('columns-teaser-icon-link');
    }
  });
  optimizeImages(block);
}

export default function decorate(block) {
  if (LAYOUT_OPTIONS.some((option) => block.classList.contains(option))) {
    decorateColumns(block);
  } else {
    decorateToggle(block);
  }
}
