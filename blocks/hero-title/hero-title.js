import { createOptimizedPicture } from '../../scripts/aem.js';

let uid = 0;
const nextId = (prefix) => {
  uid += 1;
  return `${prefix}-${uid}`;
};

function isPictureCell(cell) {
  if (!cell.querySelector('picture')) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture').forEach((el) => el.remove());
  return clone.textContent.trim() === '' && !clone.querySelector('a, ul, ol');
}

/** A list made only of links (one per item, no other text). */
function isLinkList(list) {
  const items = [...list.children];
  return items.length > 1 && items.every((li) => {
    const links = li.querySelectorAll('a');
    return links.length === 1 && links[0].textContent.trim() === li.textContent.trim();
  });
}

/** Link-list chooser: a button that reveals the list (e.g. "Barristers ▾"). */
function buildChooser(list) {
  const links = [...list.querySelectorAll('a')];
  const here = window.location.pathname.replace(/\.html$/, '');
  const current = links.find((a) => new URL(a.href, window.location.href).pathname
    .replace(/\.html$/, '') === here) || links[0];

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-title-chooser';
  list.id = nextId('hero-title-chooser');
  list.hidden = true;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-title-chooser-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', list.id);
  button.textContent = current.textContent.trim();

  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    list.hidden = true;
  };
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    list.hidden = expanded;
  });
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      button.focus();
    }
  });
  wrapper.addEventListener('focusout', (e) => {
    if (!wrapper.contains(e.relatedTarget)) close();
  });

  list.before(wrapper);
  wrapper.append(button, list);
}

/** cyan-2: the first line is a header that collapses the rest (open by default). */
function buildPanel(content) {
  const trigger = content.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6, p)');
  if (!trigger || !trigger.nextElementSibling) return;
  const panel = document.createElement('div');
  panel.className = 'hero-title-panel';
  panel.id = nextId('hero-title-panel');
  while (trigger.nextElementSibling) panel.append(trigger.nextElementSibling);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-title-panel-toggle';
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-controls', panel.id);
  button.append(...trigger.childNodes);
  trigger.replaceChildren(button);
  trigger.classList.add('hero-title-panel-header');
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
  content.append(panel);
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const content = document.createElement('div');
  content.className = 'hero-title-content';
  let media;

  cells.forEach((cell) => {
    if (isPictureCell(cell)) {
      if (!media) {
        media = document.createElement('div');
        media.className = 'hero-title-media';
      }
      media.append(...cell.querySelectorAll('picture'));
    } else {
      content.append(...cell.childNodes);
    }
  });

  content.querySelectorAll(':scope > ul').forEach((list) => {
    if (isLinkList(list)) buildChooser(list);
  });

  if (block.classList.contains('cyan-2')) buildPanel(content);

  if (media) {
    media.querySelectorAll('picture > img').forEach((img) => {
      const url = new URL(img.src, window.location.href);
      if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '750' }]));
    });
    block.classList.add('hero-title-has-media');
  }

  block.replaceChildren(...[content, media].filter(Boolean));
}
