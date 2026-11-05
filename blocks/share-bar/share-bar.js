/*
 * Share Bar block
 * Page/article title on the left, social share links on the right.
 * Share URLs are always built from the current page URL so authored links never go stale.
 */

const NETWORKS = {
  linkedin: {
    label: 'Share on LinkedIn',
    match: /linkedin/i,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  facebook: {
    label: 'Share on Facebook',
    match: /facebook/i,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  x: {
    label: 'Share on X',
    match: /twitter|(^|[^a-z])x(\.com)?([^a-z]|$)/i,
    href: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}${title ? `&text=${encodeURIComponent(title)}` : ''}`,
  },
  email: {
    label: 'Share by email',
    match: /e-?mail|mailto/i,
    href: (url, title) => `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(url)}`,
  },
};

const DEFAULT_NETWORKS = ['linkedin', 'facebook', 'x'];

/* Inline glyphs (the source site's share icons), filled with currentColor. */
const ICONS = {
  linkedin: {
    viewBox: '0 0 24 24',
    path: 'm23.994 24v-.001h.006v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07v-2.185h-4.773v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243v7.801zm-23.598-16.023h4.976v16.023h-4.976zm2.486-7.977c-1.591 0-2.882 1.291-2.882 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909c-.001-1.591-1.292-2.882-2.882-2.882z',
  },
  facebook: {
    viewBox: '0 0 512 512',
    path: 'M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z',
  },
  x: {
    viewBox: '0 0 1200 1227',
    path: 'M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z',
  },
  email: {
    viewBox: '0 0 24 24',
    path: 'M3 4h18a1 1 0 0 1 1 1v.6l-10 6.25L2 5.6V5a1 1 0 0 1 1-1zm-1 4 10 6.25L22 8v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z',
  },
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createIcon(key) {
  const { viewBox, path } = ICONS[key];
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('class', `share-bar-icon share-bar-icon-${key}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const p = document.createElementNS(SVG_NS, 'path');
  p.setAttribute('d', path);
  p.setAttribute('fill', 'currentColor');
  svg.append(p);
  return svg;
}

const normalize = (text) => (text || '').replace(/\s+/g, ' ').trim().toLowerCase();

/* Does the title repeat the page title (article bar) rather than a label like "Share this job"? */
function isPageTitle(text) {
  const candidates = [
    document.querySelector('main h1')?.textContent,
    document.querySelector('meta[property="og:title"]')?.content,
    document.title.split('|')[0],
  ].map(normalize).filter(Boolean);
  return candidates.includes(normalize(text));
}

function detectNetworks(cells) {
  const found = [];
  cells.forEach((cell) => {
    const tokens = [
      ...[...cell.querySelectorAll('a[href]')].map((a) => a.href),
      ...cell.textContent.split(/[,\n|]/),
    ].map((t) => t.trim()).filter(Boolean);
    tokens.forEach((token) => {
      const key = Object.keys(NETWORKS).find((k) => NETWORKS[k].match.test(token));
      if (key && !found.includes(key)) found.push(key);
    });
  });
  return found;
}

function getShareUrl() {
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  return canonical || window.location.href.split('#')[0];
}

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const titleCell = cells.find((cell) => cell.querySelector('h1, h2, h3, h4, h5, h6'))
    || cells.find((cell) => cell.textContent.trim() && !cell.querySelector('a[href], ul, ol')
      && !detectNetworks([cell]).length);
  const networkCells = cells.filter((cell) => cell !== titleCell);

  let networks = detectNetworks(networkCells);
  if (!networks.length) networks = DEFAULT_NETWORKS;

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'share-bar-title';
  if (titleCell) titleWrapper.append(...titleCell.childNodes);
  const titleText = titleWrapper.textContent.trim() || document.title;

  const list = document.createElement('ul');
  list.className = 'share-bar-links';
  const pageUrl = getShareUrl();
  networks.forEach((key) => {
    const network = NETWORKS[key];
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = `share-bar-link share-bar-${key}`;
    a.href = network.href(pageUrl, titleText);
    a.setAttribute('aria-label', network.label);
    a.title = network.label;
    if (key !== 'email') {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.append(createIcon(key));
    li.append(a);
    list.append(li);
  });

  // A title that is not the page title is a share label: label above, small filled icons.
  if (titleWrapper.textContent.trim() && !isPageTitle(titleWrapper.textContent)) {
    block.classList.add('label');
  }

  block.replaceChildren();
  if (titleWrapper.childNodes.length) block.append(titleWrapper);
  block.append(list);
}
