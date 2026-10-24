/**
 * Footer block. All copy, links and images come from the footer fragment
 * (content/footer.plain.html); this file only adds layout shells and behaviour.
 */

const HEADING = /^H[1-6]$/;

// media query match that indicates desktop width (link columns instead of accordions)
const isDesktop = window.matchMedia('(width >= 900px)');

/**
 * Loads the footer fragment: /content first (local preview), then the site root (DA / EDS).
 * @returns {Promise<HTMLElement|null>} a container holding the fragment's sections
 */
async function loadFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = await resp.text();
  // relative image paths are relative to the fragment, not the page
  wrapper.querySelectorAll('img[src], source[srcset]').forEach((el) => {
    const attr = el.hasAttribute('src') ? 'src' : 'srcset';
    const value = el.getAttribute(attr);
    if (value && !/^([a-z]+:|\/)/i.test(value)) el.setAttribute(attr, new URL(value, resp.url).pathname);
  });
  return wrapper;
}

/**
 * @param {Element} a link
 * @returns {boolean} true when the link's only content is an image
 */
function isImageLink(a) {
  return !!a.querySelector('img') && !a.textContent.trim();
}

/**
 * @param {Element} ul list
 * @returns {boolean} true when every item of the list is an image link
 */
function isImageLinkList(ul) {
  const links = [...ul.querySelectorAll('a')];
  return links.length > 0 && links.every(isImageLink);
}

/**
 * Decides how a fragment section is laid out, from its content alone.
 * @param {Element} section fragment section
 * @returns {'title'|'media'|'columns'|'legal'} layout kind
 */
function sectionKind(section) {
  const children = [...section.children];
  if (children.length && children.every((c) => HEADING.test(c.tagName))) return 'title';
  if (children.some((c) => c.tagName === 'UL' && isImageLinkList(c))) return 'media';
  const headedLists = children.filter((c, i) => HEADING.test(c.tagName) && children[i + 1]?.tagName === 'UL');
  if (headedLists.length >= 2) return 'columns';
  return 'legal';
}

/**
 * Groups each heading with the elements that follow it, up to the next heading.
 * @param {Element[]} nodes sibling elements
 * @param {string} className class for each group
 * @returns {HTMLDivElement[]} groups
 */
function groupByHeading(nodes, className) {
  const groups = [];
  nodes.forEach((node) => {
    if (HEADING.test(node.tagName) || !groups.length) {
      const group = document.createElement('div');
      group.className = className;
      groups.push(group);
    }
    groups[groups.length - 1].append(node);
  });
  return groups;
}

/**
 * Opens or closes one link column.
 * @param {Element} column footer column
 * @param {boolean} open new state
 */
function setColumnOpen(column, open) {
  column.classList.toggle('is-open', open);
  const toggle = column.querySelector('.footer-column-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/**
 * Mobile: each column heading becomes a toggle button (one column open at a time).
 * Desktop: headings are plain text and every list is shown.
 * @param {Element[]} columns footer columns
 */
function setColumnMode(columns) {
  columns.forEach((column, i) => {
    const heading = column.firstElementChild;
    const list = column.querySelector(':scope > ul');
    if (!heading || !HEADING.test(heading.tagName) || !list) return;
    let toggle = heading.querySelector('.footer-column-toggle');
    if (isDesktop.matches) {
      if (toggle) toggle.replaceWith(...toggle.childNodes);
      setColumnOpen(column, false);
      return;
    }
    if (toggle) return;
    if (!list.id) list.id = `footer-column-${i + 1}`;
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'footer-column-toggle';
    toggle.setAttribute('aria-controls', list.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.append(...heading.childNodes);
    heading.append(toggle);
    toggle.addEventListener('click', () => {
      const open = !column.classList.contains('is-open');
      columns.forEach((c) => setColumnOpen(c, c === column && open));
    });
  });
}

/**
 * Link columns: each heading + list becomes a column.
 * @param {Element} inner section content
 */
function buildColumns(inner) {
  const columns = groupByHeading([...inner.children], 'footer-column');
  inner.append(...columns);
  setColumnMode(columns);
  isDesktop.addEventListener('change', () => setColumnMode(columns));
}

/**
 * Text plus rows of image links (app badges, social icons).
 * @param {Element} inner section content
 */
function buildMedia(inner) {
  const row = document.createElement('div');
  row.className = 'footer-media-row';
  [...inner.children].forEach((child) => {
    if (child.tagName === 'UL' && isImageLinkList(child)) {
      child.classList.add('footer-icon-list');
      row.append(child);
    }
  });
  // off-site image links (store badges, social profiles) open in a new tab, as on the source
  row.querySelectorAll('a').forEach((a) => {
    if (a.hostname && a.hostname !== window.location.hostname) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
  inner.append(row);
}

/**
 * Legal links row followed by disclaimer groups (one per heading).
 * @param {Element} inner section content
 */
function buildLegal(inner) {
  const nodes = [...inner.children];
  const firstHeading = nodes.findIndex((n) => HEADING.test(n.tagName));
  const lead = firstHeading === -1 ? nodes : nodes.slice(0, firstHeading);
  lead.filter((n) => n.tagName === 'UL').forEach((ul) => ul.classList.add('footer-legal-links'));
  if (firstHeading === -1) return;
  const groups = document.createElement('div');
  groups.className = 'footer-legal-groups';
  groups.append(...groupByHeading(nodes.slice(firstHeading), 'footer-legal-group'));
  inner.append(groups);
}

const BUILDERS = { columns: buildColumns, media: buildMedia, legal: buildLegal };

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await loadFooterFragment();
  block.textContent = '';
  if (!fragment) return;

  [...fragment.children].forEach((source) => {
    const kind = sectionKind(source);
    const section = document.createElement('div');
    section.className = `footer-section footer-${kind}`;
    const inner = document.createElement('div');
    inner.className = 'footer-section-inner';
    inner.append(...source.children);
    BUILDERS[kind]?.(inner);
    section.append(inner);
    block.append(section);
  });
}
