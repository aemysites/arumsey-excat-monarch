/*
 * Cards Article
 * Teaser cards linking to guide/article pages. One row per card:
 * an optional image cell plus a body cell (optional icon, eyebrow tag, heading, text, links).
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const DATE_RE = /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/;

function isImageOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

function isLinkOnly(el) {
  if (el.tagName !== 'P') return false;
  const links = [...el.querySelectorAll('a[href]')];
  if (!links.length) return false;
  const linkText = links.map((a) => a.textContent).join('').replace(/\s+/g, '');
  return linkText.length > 0 && linkText === el.textContent.replace(/\s+/g, '');
}

function decorateBody(body) {
  const children = [...body.children];
  const heading = children.find((el) => /^H[1-6]$/.test(el.tagName));

  // leading image-only paragraph = icon badge
  const first = children[0];
  if (first && first !== heading && isImageOnly(first)) first.classList.add('cards-article-card-icon');

  // short plain paragraph right before the heading = eyebrow tag
  if (heading) {
    const prev = heading.previousElementSibling;
    if (prev && prev.tagName === 'P' && !prev.classList.contains('cards-article-card-icon')
      && !prev.querySelector('a, picture') && prev.textContent.trim().length <= 60) {
      prev.classList.add('cards-article-card-tag');
    }
  }

  // news teasers have no heading: short eyebrow tag, optional date, then a plain title paragraph
  if (!heading) {
    const plain = children.filter((el) => el.tagName === 'P' && !isLinkOnly(el)
      && !el.querySelector('picture, img') && el.textContent.trim());
    const isDate = (el) => DATE_RE.test(el.textContent.trim());
    plain.filter(isDate).forEach((el) => el.classList.add('cards-article-card-date'));
    const rest = plain.filter((el) => !isDate(el));
    const hasTag = rest.length >= 2 && rest[0].textContent.trim().length <= 30;
    if (hasTag) {
      rest.shift().classList.add('cards-article-card-tag');
    }
    if (rest.length === 1 && plain.length >= 2) {
      rest[0].classList.add('cards-article-card-title');
    } else if (hasTag && rest.length >= 2 && rest[0].textContent.trim().length <= 120) {
      // eyebrow tag + plain title paragraph + body text (feature teasers)
      rest[0].classList.add('cards-article-card-heading');
    }
  }

  // consecutive link-only paragraphs = actions; trailing group pins to card bottom
  let group = null;
  [...body.children].forEach((el) => {
    if (isLinkOnly(el)) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'cards-article-card-actions';
        el.before(group);
      }
      group.append(el);
    } else {
      group = null;
    }
  });
  const last = body.lastElementChild;
  if (last && last.classList.contains('cards-article-card-actions')) last.classList.add('is-last');

  // a news teaser with a single link is clickable as a whole card (as on the source)
  if (body.querySelector('.cards-article-card-title') && body.querySelectorAll('a[href]').length === 1) {
    body.querySelector('a[href]').classList.add('cards-article-card-link');
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    const cells = [...row.children];
    const body = document.createElement('div');
    body.className = 'cards-article-card-body';
    cells.forEach((cell) => {
      if (isImageOnly(cell) && !li.querySelector('.cards-article-card-image') && !body.children.length) {
        cell.className = 'cards-article-card-image';
        li.append(cell);
      } else {
        body.append(...cell.childNodes);
      }
    });
    // wrap stray text nodes
    [...body.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        node.replaceWith(p);
        p.append(node);
      }
    });
    if (body.children.length) {
      decorateBody(body);
      li.append(body);
    }
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const isIcon = !!img.closest('.cards-article-card-icon');
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: isIcon ? '120' : '750' }]));
  });
  block.replaceChildren(ul);
}
