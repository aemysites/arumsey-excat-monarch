/**
 * Callout banner: a notice panel with an optional icon/image panel beside
 * heading, text and links.
 *
 * Authoring: one row per callout. Cells: [icon or image (optional)] [content]
 * [action link (optional)]. A content cell whose only content is a link to a
 * /fragments/ path loads that fragment.
 *
 * Options (classes): image, light, button, image-light, image-light-2.
 * - button: the last link becomes a button in its own action area.
 * - Without `button`, a callout holding exactly one link becomes fully clickable
 *   and gets a chevron.
 */
import { loadFragment } from '../fragment/fragment.js';

function isMediaCell(cell) {
  return !cell.textContent.trim() && !!cell.querySelector('picture, img, .icon, svg');
}

function fragmentPath(cell) {
  const links = cell.querySelectorAll('a');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return null;
  const url = new URL(links[0].href, window.location.href);
  if (url.origin !== window.location.origin || !url.pathname.includes('/fragments/')) return null;
  return url.pathname;
}

async function decorateItem(row, block) {
  const cells = [...row.children];
  const item = document.createElement('div');
  item.className = 'callout-banner-item';

  let media = cells.find(isMediaCell);
  if (!media && !block.matches('.light, .image-light-2')) {
    // source shows a decorative document icon panel; authored content has none
    media = document.createElement('div');
    const icon = document.createElement('span');
    icon.className = 'callout-banner-icon';
    media.append(icon);
    item.classList.add('callout-banner-default-icon');
  }
  if (media) {
    media.className = 'callout-banner-media';
    if (!media.querySelector('picture, img')) media.setAttribute('aria-hidden', 'true');
    item.append(media);
    item.classList.add('callout-banner-has-media');
  }

  const body = document.createElement('div');
  body.className = 'callout-banner-body';
  const contentCells = cells.filter((c) => c !== media);

  await Promise.all(contentCells.map(async (cell) => {
    const path = fragmentPath(cell);
    if (!path) return;
    const fragment = await loadFragment(path);
    if (fragment) cell.replaceChildren(...fragment.childNodes);
  }));
  contentCells.forEach((cell) => body.append(...cell.childNodes));
  if (!body.textContent.trim() && !media) return null;
  item.append(body);

  const links = [...body.querySelectorAll('a')];
  if (block.classList.contains('button') && links.length) {
    const action = links[links.length - 1];
    const actions = document.createElement('div');
    actions.className = 'callout-banner-actions';
    const container = action.closest('p');
    action.classList.add('button');
    actions.append(action);
    if (container && !container.textContent.trim()) container.remove();
    item.append(actions);
  } else if (links.length === 1) {
    const [link] = links;
    item.classList.add('callout-banner-linked');
    const chevron = document.createElement('span');
    chevron.className = 'callout-banner-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    item.append(chevron);
    item.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (window.getSelection()?.toString()) return;
      link.click();
    });
  }
  return item;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const items = (await Promise.all(rows.map((row) => decorateItem(row, block)))).filter(Boolean);
  block.replaceChildren(...items);
}
