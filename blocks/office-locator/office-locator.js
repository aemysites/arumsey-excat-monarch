import { createOptimizedPicture } from '../../scripts/aem.js';

const MAP_HOST_RE = /(^|\.)(google\.[a-z.]+|goo\.gl|maps\.app\.goo\.gl|maps\.apple\.com|bing\.com)$/i;

function parseUrl(href) {
  try {
    return new URL(href, window.location.href);
  } catch (e) {
    return null;
  }
}

function isMapUrl(href) {
  const url = parseUrl(href);
  if (!url) return false;
  if (/maps\.apple\.com|goo\.gl$/i.test(url.hostname)) return true;
  return MAP_HOST_RE.test(url.hostname) && /maps|\/place\/|[?&](q|query|daddr)=/i.test(url.pathname + url.search);
}

/** Google Maps embed URL for a map link, or null when one can't be derived. */
function toEmbedUrl(href, fallbackQuery) {
  const url = parseUrl(href);
  if (!url) return null;
  if (/google\./i.test(url.hostname) && (/\/maps\/embed/.test(url.pathname) || url.searchParams.get('output') === 'embed')) {
    return url.href;
  }
  const query = url.searchParams.get('q')
    || url.searchParams.get('query')
    || url.searchParams.get('daddr')
    || (url.pathname.match(/\/place\/([^/]+)/) || [])[1]?.replace(/\+/g, ' ')
    || fallbackQuery;
  if (!query) return null;
  return `https://maps.google.com/maps?q=${encodeURIComponent(decodeURIComponent(query))}&output=embed`;
}

function optimizeImages(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
}

function decorateDetails(details) {
  const heading = details.querySelector('h1, h2, h3, h4, h5, h6');
  const before = heading && heading.previousElementSibling;
  if (before && before.tagName === 'P') before.classList.add('office-locator-eyebrow');

  const info = document.createElement('div');
  info.className = 'office-locator-info';

  let address = null;
  let phone = null;
  details.querySelectorAll(':scope > p').forEach((p) => {
    if (!phone && p.querySelector('a[href^="tel:"]')) {
      phone = p;
      p.classList.add('office-locator-phone');
    } else if (!address && [...p.querySelectorAll('a[href]')].some((a) => isMapUrl(a.href))) {
      address = p;
      p.classList.add('office-locator-address');
    }
  });

  // Opening hours: a list, summarised by the paragraph or heading before it.
  let hours = null;
  const list = details.querySelector(':scope > ul, :scope > ol, :scope > table');
  if (list) {
    hours = document.createElement('details');
    hours.className = 'office-locator-hours';
    const summary = document.createElement('summary');
    const prev = list.previousElementSibling;
    const prevIsLabel = prev && prev !== heading && prev !== address && prev !== phone
      && !prev.classList.contains('office-locator-eyebrow') && !prev.querySelector('a');
    const label = prevIsLabel ? prev.textContent.replace(/\s+/g, ' ').trim() : 'Hours';
    const status = label.match(/^(open|closed)\b\s*/i);
    if (status) {
      const strong = document.createElement('span');
      strong.className = 'office-locator-hours-status';
      [, strong.textContent] = status;
      summary.append(strong, ` ${label.slice(status[0].length)}`);
    } else {
      summary.textContent = label;
    }
    if (prevIsLabel) prev.remove();
    list.replaceWith(hours);
    hours.append(summary, list);
  }

  const anchor = address || hours || phone;
  if (anchor) {
    anchor.before(info);
    [address, hours, phone].filter(Boolean).forEach((el) => info.append(el));
  }

  // Calls to action: remaining link paragraphs. Bold links become primary
  // buttons, italic links secondary buttons; plain links stay text links.
  details.querySelectorAll(':scope > p').forEach((p) => {
    if (p.classList.contains('office-locator-eyebrow') || !p.querySelector('a[href]')) return;
    p.classList.add('office-locator-actions');
    p.querySelectorAll('strong > a[href], em > a[href]').forEach((a) => {
      const wrapper = a.parentElement;
      if (wrapper.textContent.trim() !== a.textContent.trim()) return;
      const isPrimary = wrapper.tagName === 'STRONG' || wrapper.closest('strong');
      a.classList.add('button', isPrimary ? 'primary' : 'secondary');
      wrapper.replaceWith(a);
    });
  });
}

/** Turns "4.7 out of 5 stars (60 reviews)" into a star rating. */
function decorateRating(map) {
  const re = /(\d+(?:\.\d+)?)\s*out of\s*(\d+)\s*stars?(?:\s*\(\s*([\d,]+)\s*reviews?\s*\))?/i;
  const p = [...map.querySelectorAll(':scope > p')].find((el) => re.test(el.textContent));
  if (!p || p.querySelector('a, picture, img')) return;
  const [, value, max, count] = p.textContent.match(re);
  const pct = Math.max(0, Math.min(100, (parseFloat(value) / parseFloat(max)) * 100));
  const label = p.textContent.replace(/\s+/g, ' ').trim();

  const stars = document.createElement('span');
  stars.className = 'office-locator-stars';
  stars.style.setProperty('--office-locator-rating', `${pct.toFixed(2)}%`);
  const text = document.createElement('span');
  text.className = 'office-locator-rating-value';
  text.textContent = count ? `${value}(${count})` : value;
  [stars, text].forEach((el) => el.setAttribute('aria-hidden', 'true'));
  const sr = document.createElement('span');
  sr.className = 'office-locator-sr';
  sr.textContent = label;

  p.className = 'office-locator-rating';
  p.replaceChildren(stars, text, sr);
}

function decorateMap(mapCell, block, addressText) {
  if (mapCell.querySelector('picture, img')) {
    block.classList.add('has-map-image');
    optimizeImages(mapCell);
    return;
  }
  const link = [...mapCell.querySelectorAll('a[href]')].find((a) => isMapUrl(a.href));
  if (!link) return;
  const src = toEmbedUrl(link.href, addressText);
  if (!src) return;

  const frame = document.createElement('div');
  frame.className = 'office-locator-frame';
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.title = link.title && link.title !== link.href ? link.title : `Map: ${addressText || 'office location'}`;
  iframe.setAttribute('allowfullscreen', '');
  frame.append(iframe);

  const holder = link.closest('p') || link;
  if (holder.textContent.trim() === link.textContent.trim()) holder.replaceWith(frame);
  else holder.before(frame);
}

/**
 * office-locator: office details (eyebrow, address heading, map-linked
 * address, opening hours, phone) beside a map and rating.
 * The map cell holds a Google Maps link (rendered as a lazy embedded map) or,
 * with the `image` option, a static map image.
 * @param {Element} block
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const isMapCell = (cell) => cell.querySelector('picture, img, iframe')
    || ([...cell.querySelectorAll('a[href]')].some((a) => isMapUrl(a.href))
      && !cell.querySelector('h1, h2, h3, h4, h5, h6, a[href^="tel:"]'));
  const mapCells = cells.filter((cell, i) => i > 0 && isMapCell(cell));
  const detailCells = cells.filter((cell) => !mapCells.includes(cell) && cell.textContent.trim());

  const details = document.createElement('div');
  details.className = 'office-locator-details';
  detailCells.forEach((cell) => details.append(...cell.childNodes));

  const map = document.createElement('div');
  map.className = 'office-locator-map';
  mapCells.forEach((cell) => map.append(...cell.childNodes));

  [details, map].forEach((el) => el.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img, a, .icon')) p.remove();
  }));

  decorateDetails(details);
  const heading = details.querySelector('h1, h2, h3, h4, h5, h6');
  const address = details.querySelector('.office-locator-address');
  const addressText = (address || heading)?.textContent.replace(/\s+/g, ' ').trim() || '';

  block.replaceChildren(details);
  if (map.childNodes.length) {
    block.append(map);
    decorateMap(map, block, addressText);
    decorateRating(map);
  } else {
    block.classList.add('no-map');
  }
}
