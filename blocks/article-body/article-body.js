/*
 * Article Body
 * Editorial article: a hero (background image + card with eyebrow, title,
 * date / read time and optional CTA) followed by the article body card
 * (rich text, headings, lists, tables, inline images).
 *
 * Authoring:
 *  - Row 1 (hero): image cell | text cell (eyebrow, H1, date, optional link).
 *    Recognised when the row has a picture-only cell or an H1.
 *  - Following one-cell rows: article body content, appended in order.
 *  - Following multi-cell rows: inline promo banner (text | CTA | logo).
 *
 * Hero card decoration: eyebrow, title, date / read-time row (meta-list, the
 * read-time paragraph gets a clock icon) and a standalone link as the CTA.
 *
 * Options (styling only, see article-body.css): image / alt (light-blue
 * "article" promo strip), alt-2 (bordered promo strip, 80% tables).
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'article-body';

function isPictureOnly(cell) {
  return !!cell.querySelector('picture') && !cell.textContent.trim();
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}

function buildHero(row) {
  const hero = document.createElement('div');
  hero.className = `${BLOCK}-hero`;
  const media = document.createElement('div');
  media.className = `${BLOCK}-hero-image`;
  const card = document.createElement('div');
  card.className = `${BLOCK}-hero-card`;

  [...row.children].forEach((cell) => {
    if (isPictureOnly(cell) && !media.children.length) media.append(...cell.childNodes);
    else card.append(...cell.childNodes);
  });

  // a lone picture inside the text cell is treated as the hero image
  if (!media.children.length) {
    const pic = card.querySelector('picture');
    if (pic) {
      const parent = pic.parentElement;
      media.append(pic);
      if (parent !== card && !parent.textContent.trim() && !parent.children.length) parent.remove();
    }
  }

  // eyebrow: a short paragraph before the title
  const title = card.querySelector('h1, h2');
  if (title) {
    title.classList.add(`${BLOCK}-title`);
    const prev = title.previousElementSibling;
    if (prev && prev.tagName === 'P') prev.classList.add(`${BLOCK}-eyebrow`);
    // date / read time paragraphs after the title sit on one row
    const siblings = title.parentElement === card ? [...card.children] : [];
    const metas = siblings.slice(siblings.indexOf(title) + 1)
      .filter((el) => el.tagName === 'P' && !el.querySelector('a, picture'));
    if (metas.length) {
      const list = document.createElement('div');
      list.className = `${BLOCK}-meta-list`;
      metas[0].before(list);
      metas.forEach((p) => {
        p.classList.add(`${BLOCK}-meta`);
        if (/read\s*time/i.test(p.textContent)) p.classList.add(`${BLOCK}-read-time`);
        list.append(p);
      });
    }
  }

  // standalone link in the card is the hero CTA
  card.querySelectorAll(':scope > p > a:only-child').forEach((a) => {
    if (a.parentElement.textContent.trim() === a.textContent.trim()) a.classList.add(`${BLOCK}-cta`);
  });

  if (media.children.length) hero.append(media);
  else hero.classList.add(`${BLOCK}-hero-no-image`);
  hero.append(card);
  return hero;
}

function buildPromo(row) {
  const promo = document.createElement('div');
  promo.className = `${BLOCK}-promo`;
  [...row.children].forEach((cell) => {
    if (!cell.textContent.trim() && !cell.querySelector('picture')) return;
    cell.className = isPictureOnly(cell) ? `${BLOCK}-promo-logo` : `${BLOCK}-promo-content`;
    promo.append(cell);
  });
  return promo;
}

function wrapTables(root) {
  root.querySelectorAll('table').forEach((table) => {
    const wrapper = document.createElement('div');
    wrapper.className = `${BLOCK}-table`;
    table.replaceWith(wrapper);
    wrapper.append(table);
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const body = document.createElement('div');
  body.className = `${BLOCK}-content`;
  let hero = null;

  rows.forEach((row, index) => {
    const cells = [...row.children];
    if (!cells.length || (!row.textContent.trim() && !row.querySelector('picture, table'))) return;

    const looksLikeHero = index === 0
      && (cells.some(isPictureOnly) || row.querySelector('h1'));
    if (looksLikeHero) {
      hero = buildHero(row);
      return;
    }

    const contentCells = cells.filter((c) => c.textContent.trim() || c.querySelector('picture, table'));
    if (contentCells.length > 1) {
      body.append(buildPromo(row));
    } else if (contentCells.length === 1) {
      body.append(...contentCells[0].childNodes);
    }
  });

  wrapTables(body);
  optimizeImages(body);
  if (hero) optimizeImages(hero);

  const children = [];
  if (hero) children.push(hero);
  if (body.childNodes.length) children.push(body);
  block.replaceChildren(...children);
}
