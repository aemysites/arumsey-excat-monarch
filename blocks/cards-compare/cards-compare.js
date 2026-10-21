import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * cards-compare: side-by-side product comparison cards.
 * Each card: header (title + optional icon or background image), body
 * (description, labelled lists, separators) and a footer of CTAs pinned to
 * the bottom.
 *
 * Authoring: one row per card. Cells are merged in order; the first heading
 * (plus an image next to it) becomes the header, trailing paragraphs that
 * contain only a link or only bold text become the footer. A <hr> or a new
 * cell starts a new body section.
 *
 * Cards are laid out on a CSS subgrid: the list exposes the number of rows
 * (header + body sections + footer) so matching sections line up across
 * cards, as they do on citi.com.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function isLinkOnly(el) {
  if (!el || el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a');
  if (!links.length) return false;
  const text = [...links].reduce((acc, a) => acc + a.textContent, '');
  return el.textContent.replace(/\s/g, '') === text.replace(/\s/g, '');
}

/* a paragraph whose whole text is bold: a label, or (when trailing) a CTA */
function isStrongOnly(el) {
  if (!el || el.tagName !== 'P' || el.querySelector('a, picture, img')) return false;
  const strong = el.querySelector(':scope > strong, :scope > b');
  return !!strong && el.textContent.trim() !== '' && el.textContent.trim() === strong.textContent.trim();
}

function isIconOnly(el) {
  return el && el.querySelector('picture, img, .icon') && el.textContent.trim() === '';
}

/*
 * A leading image is either a small icon shown beside the title or a wide
 * header artwork used as the title band background (citi.com uses both).
 */
function classifyHeaderImage(header, wrapper) {
  const img = wrapper.querySelector('img');
  if (!img) return;
  const apply = () => {
    const { naturalWidth: w, naturalHeight: h } = img;
    if (w && h && w / h > 2.5) {
      wrapper.classList.replace('cards-compare-icon', 'cards-compare-header-image');
      header.classList.add('has-image');
    }
  };
  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener('load', apply, { once: true });
}

function buildCard(row) {
  const li = document.createElement('li');
  const header = document.createElement('div');
  header.className = 'cards-compare-header';
  const body = document.createElement('div');
  body.className = 'cards-compare-body';
  const footer = document.createElement('div');
  footer.className = 'cards-compare-footer';

  // collect nodes, inserting an hr between cells so each cell is its own section
  const nodes = [];
  [...row.children].forEach((cell, i) => {
    if (i > 0 && nodes.length) nodes.push(document.createElement('hr'));
    nodes.push(...[...cell.children]);
    if (!cell.children.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      nodes.push(p);
    }
  });

  // header: first heading, plus an icon immediately before/after it
  const headingIndex = nodes.findIndex((n) => n.matches?.(HEADING));
  if (headingIndex >= 0 && headingIndex <= 2) {
    const start = headingIndex > 0 && isIconOnly(nodes[headingIndex - 1])
      ? headingIndex - 1 : headingIndex;
    let end = headingIndex + 1;
    if (isIconOnly(nodes[end])) end += 1;
    const headNodes = nodes.splice(start, end - start);
    headNodes.forEach((n) => {
      if (isIconOnly(n)) {
        n.classList.add('cards-compare-icon');
      }
      header.append(n);
    });
    // drop a separator directly after the header
    if (nodes[0]?.tagName === 'HR') nodes.shift();
  }

  // footer: trailing link-only paragraphs and bold-only CTA labels
  const footNodes = [];
  while (nodes.length) {
    const last = nodes[nodes.length - 1];
    if (isLinkOnly(last)) {
      footNodes.unshift(nodes.pop());
    } else if (isStrongOnly(last)) {
      // citi.com renders these as <button>s; the import kept only the label
      last.classList.add('cards-compare-cta');
      footNodes.unshift(nodes.pop());
    } else break;
  }
  while (nodes.length && nodes[nodes.length - 1].tagName === 'HR') nodes.pop();
  footer.append(...footNodes);

  // body: split into sections on hr
  let section = document.createElement('div');
  section.className = 'cards-compare-section';
  nodes.forEach((n) => {
    if (n.tagName === 'HR') {
      if (section.children.length) body.append(section);
      section = document.createElement('div');
      section.className = 'cards-compare-section';
      return;
    }
    // bold-only paragraph introducing following content: an eyebrow label
    if (isStrongOnly(n)) n.classList.add('cards-compare-label');
    section.append(n);
  });
  if (section.children.length) body.append(section);

  li.append(header, body, footer);
  if (!header.children.length) header.classList.add('is-empty');
  if (!footer.children.length) footer.classList.add('is-empty');
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    ul.append(buildCard(row));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  ul.querySelectorAll('.cards-compare-icon').forEach((icon) => {
    classifyHeaderImage(icon.closest('.cards-compare-header'), icon);
  });

  // subgrid sizing: header row + the most body sections of any card + footer row
  const sections = Math.max(1, ...[...ul.children].map((li) => li.querySelector('.cards-compare-body').children.length));
  ul.style.setProperty('--cards-compare-sections', sections);
  ul.style.setProperty('--cards-compare-cols', Math.max(1, ul.children.length));
  block.replaceChildren(ul);
}
