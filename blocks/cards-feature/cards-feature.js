import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICON_LEFT_OPTIONS = ['icon-left', 'icon-left-compact', 'icon-left-download', 'icon-left-photo-background'];
const LINKED_CARD_OPTIONS = ['link-tiles', 'shadow-image', 'grey-image', 'icon-left-download'];
const VIDEO_URL = /youtube\.com|youtu\.be|vimeo\.com|\.mp4(\?|$)/i;

function hasOption(block, options) {
  return options.some((option) => block.classList.contains(option));
}

/** A cell holding only a picture (or an icon span) is the card's media. */
function isMediaCell(cell) {
  const media = cell.querySelectorAll('picture, span.icon');
  if (media.length !== 1) return false;
  const text = cell.textContent.trim();
  return text === '' && !cell.querySelector('a, h1, h2, h3, h4, h5, h6, ul, ol');
}

/** A cell holding a single link and no other text. */
function soleLink(cell) {
  const links = cell.querySelectorAll('a');
  if (links.length !== 1) return null;
  return links[0].textContent.trim() === cell.textContent.trim() ? links[0] : null;
}

function isFragmentLink(link) {
  if (!link) return false;
  const url = new URL(link.href, window.location.href);
  return url.origin === window.location.origin && url.pathname.includes('/fragments/');
}

function buildVideo(link) {
  const url = new URL(link.href, window.location.href);
  const wrapper = document.createElement('div');
  wrapper.className = 'cards-feature-card-video';
  if (/\.mp4(\?|$)/i.test(url.pathname)) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'none';
    video.src = url.href;
    wrapper.append(video);
    return wrapper;
  }
  let src = url.href;
  if (url.hostname.includes('youtu')) {
    const id = url.hostname.includes('youtu.be')
      ? url.pathname.slice(1)
      : url.searchParams.get('v') || url.pathname.split('/').pop();
    src = `https://www.youtube.com/embed/${id}`;
  } else if (url.hostname.includes('vimeo')) {
    src = `https://player.vimeo.com/video/${url.pathname.split('/').filter(Boolean).pop()}`;
  }
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.loading = 'lazy';
  iframe.title = link.textContent.trim() || 'Video';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'encrypted-media; picture-in-picture');
  wrapper.append(iframe);
  return wrapper;
}

const HEADINGS = 'h1, h2, h3, h4, h5, h6';

/**
 * Mark content shapes so the default look can follow the source per shape:
 * - icon paragraph: a body paragraph holding only an icon (imported :name: token)
 * - tile: no heading, and the card's only text is one link
 * - sequence: icon + lead line + text, no heading and no link (claim-steps)
 * - eyebrow / product: a short line before the first heading of an icon card
 */
function classifyCard(li, image, body) {
  body.querySelectorAll(':scope > p').forEach((p) => {
    if (p.children.length === 1 && p.firstElementChild.matches('span.icon') && !p.textContent.trim()) {
      p.classList.add('cards-feature-card-icon');
    }
  });
  const links = li.querySelectorAll('a');
  const hasHeading = !!body.querySelector(HEADINGS);
  const text = body.textContent.trim();
  if (!hasHeading && links.length === 1 && text && text === links[0].textContent.trim()) {
    li.classList.add('cards-feature-card-tile', 'cards-feature-card-linked');
    return;
  }
  const textParas = body.querySelectorAll(':scope > p:not(.cards-feature-card-icon)');
  if (!hasHeading && !links.length && body.querySelector(':scope > .cards-feature-card-icon')
    && textParas.length >= 2) {
    li.classList.add('cards-feature-card-sequence');
    return;
  }
  const [first, second] = body.children;
  if (first && second && first.tagName === 'P' && !first.querySelector('a, span.icon')
    && second.matches(HEADINGS)) {
    first.classList.add('cards-feature-card-eyebrow');
    if (image && image.querySelector('span.icon')) li.classList.add('cards-feature-card-product');
  }
}

/**
 * Turn a card into a toggle: its first heading (or paragraph) opens the rest of the card.
 */
function buildToggle(li, index) {
  const trigger = li.querySelector('h1, h2, h3, h4, h5, h6, p');
  if (!trigger) return;
  const owner = trigger.closest('.cards-feature-card > div');
  const panel = document.createElement('div');
  panel.className = 'cards-feature-card-panel';
  panel.id = `cards-feature-panel-${index}-${Math.random().toString(36).slice(2, 8)}`;
  [...owner.children].filter((el) => el !== trigger).forEach((el) => panel.append(el));
  [...li.children].filter((cell) => cell !== owner).forEach((cell) => panel.append(cell));
  if (!panel.textContent.trim() && !panel.querySelector('picture, img')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cards-feature-card-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', panel.id);
  button.append(...trigger.childNodes);
  trigger.replaceChildren(button);
  panel.hidden = true;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
  owner.append(panel);
}

export default async function decorate(block) {
  const rows = [...block.children];
  const iconLeft = hasOption(block, ICON_LEFT_OPTIONS);
  const linkedCards = hasOption(block, LINKED_CARD_OPTIONS);

  // Optional background row (icon-left-photo-background): a first row holding only a picture.
  if (block.classList.contains('icon-left-photo-background') && rows.length > 1) {
    const [first] = rows;
    if (first.children.length === 1 && isMediaCell(first.firstElementChild)) {
      first.className = 'cards-feature-background';
      rows.shift();
    }
  }

  // Optional intro row: a first single-cell row that holds a heading and no media.
  let intro;
  if (rows.length > 1) {
    const [first] = rows;
    const cell = first.firstElementChild;
    if (first.children.length === 1 && cell && cell.querySelector('h1, h2, h3, h4, h5, h6')
      && !cell.querySelector('picture') && !cell.querySelector('a')) {
      intro = first;
      intro.className = 'cards-feature-intro';
      rows.shift();
    }
  }

  const ul = document.createElement('ul');
  const fragmentLoads = [];

  rows.forEach((row, index) => {
    const li = document.createElement('li');
    li.className = 'cards-feature-card';
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((cell) => {
      if (cell.textContent.trim() === '' && !cell.querySelector('picture, span.icon, img')) {
        cell.remove();
        return;
      }
      if (isMediaCell(cell)) {
        cell.className = 'cards-feature-card-image';
        return;
      }
      cell.className = 'cards-feature-card-body';
      const link = soleLink(cell);
      if (isFragmentLink(link)) {
        fragmentLoads.push(loadFragment(new URL(link.href).pathname).then((fragment) => {
          if (fragment) {
            const sections = [...fragment.querySelectorAll(':scope > .section')];
            cell.replaceChildren(...(sections.length
              ? sections.flatMap((section) => [...section.childNodes])
              : [...fragment.childNodes]));
          }
        }));
      } else if (link && VIDEO_URL.test(link.href)) {
        cell.className = 'cards-feature-card-media';
        cell.replaceChildren(buildVideo(link));
      }
    });

    const image = li.querySelector(':scope > .cards-feature-card-image');
    const body = li.querySelector(':scope > .cards-feature-card-body');
    if (body) classifyCard(li, image, body);

    if (block.classList.contains('steps') && !image) {
      const step = document.createElement('div');
      step.className = 'cards-feature-card-step';
      step.innerHTML = `<span>Step</span><strong>${index + 1}</strong>`;
      li.prepend(step);
    }

    // icon-left family: pair the icon with the card title.
    if (iconLeft && image && body) {
      const heading = body.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
      if (heading && !block.classList.contains('icon-left-download')) {
        const title = document.createElement('div');
        title.className = 'cards-feature-card-title';
        heading.before(title);
        title.append(image, heading);
      }
    }

    // Link tiles: a card with one link becomes clickable as a whole.
    if (linkedCards) {
      const links = li.querySelectorAll('a');
      if (links.length === 1) li.classList.add('cards-feature-card-linked');
    }

    if (li.children.length) ul.append(li);
  });

  // list-level shape markers (no option class = the source's default centred icon cards)
  const cards = [...ul.children];
  const variant = [...block.classList].some((c) => !['cards-feature', 'block'].includes(c));
  if (!variant) {
    ul.classList.add('cards-feature-default');
    if (cards.length && cards.every((li) => li.classList.contains('cards-feature-card-tile'))) {
      ul.classList.add('cards-feature-tiles');
    }
    if (cards.length > 2 && cards.every((li) => li.classList.contains('cards-feature-card-sequence'))) {
      ul.classList.add('cards-feature-sequence');
    }
  }

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  const background = block.querySelector(':scope > .cards-feature-background');
  block.replaceChildren(...[background, intro, ul].filter(Boolean));
  await Promise.all(fragmentLoads);

  if (block.classList.contains('partner')) {
    ul.querySelectorAll(':scope > li').forEach((li, index) => buildToggle(li, index));
  }
}
