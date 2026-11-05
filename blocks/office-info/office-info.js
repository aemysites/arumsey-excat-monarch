/*
 * Office Info block
 * Office address, phone/fax list and description beside a location map.
 * Row cells: [details] [map]. The map cell holds a Google Maps embed link,
 * any Google Maps link (embedded by address), or a picture of the map.
 */

const PIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 682 682.66669" aria-hidden="true" focusable="false"><path d="m216.210938 0c-122.664063 0-222.460938 99.796875-222.460938 222.460938 0 154.175781 222.679688 417.539062 222.679688 417.539062s222.242187-270.945312 222.242187-417.539062c0-122.664063-99.792969-222.460938-222.460937-222.460938zm67.121093 287.597656c-18.507812 18.503906-42.8125 27.757813-67.121093 27.757813-24.304688 0-48.617188-9.253907-67.117188-27.757813-37.011719-37.007812-37.011719-97.226562 0-134.238281 17.921875-17.929687 41.761719-27.804687 67.117188-27.804687 25.355468 0 49.191406 9.878906 67.121093 27.804687 37.011719 37.011719 37.011719 97.230469 0 134.238281zm0 0" fill="currentColor"/></svg>';

const MAP_LINK = /(google\.[a-z.]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps)/i;

function isEmbeddable(href) {
  return /\/maps\/(d\/)?embed/i.test(href) || /[?&]output=embed/i.test(href);
}

function addressText(el) {
  if (!el) return '';
  const clone = el.cloneNode(true);
  clone.querySelectorAll('br').forEach((br) => br.replaceWith(', '));
  return clone.textContent.replace(/\s+/g, ' ').replace(/\s*,\s*(,\s*)+/g, ', ').trim();
}

function iconFor(text) {
  const t = text.toLowerCase();
  if (t.includes('fax') || t.includes('télécopieur')) return 'fax';
  if (t.includes('@') || t.includes('email') || t.includes('courriel')) return 'email';
  if (t.includes('toll') || t.includes('sans frais')) return 'toll-free';
  return 'phone';
}

function buildMap(cell, address, title) {
  const wrapper = document.createElement('div');
  wrapper.className = 'office-info-map';
  const picture = cell?.querySelector('picture');
  const link = cell?.querySelector('a[href]');
  const href = link?.href || '';

  if (picture) {
    if (link) {
      link.textContent = '';
      link.append(picture);
      wrapper.append(link);
    } else {
      wrapper.append(picture);
    }
    return { wrapper, mapsHref: href };
  }

  let src = '';
  if (href && isEmbeddable(href)) src = href;
  else if (address) src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  if (src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title || address || 'Map';
    iframe.loading = 'lazy';
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    wrapper.append(iframe);
  }
  return { wrapper, mapsHref: href && !isEmbeddable(href) ? href : '' };
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const isMapCell = (c) => {
    if (c.querySelector('picture') && !c.querySelector('h1, h2, h3, h4, ul')) return true;
    const links = c.querySelectorAll('a[href]');
    return links.length === 1 && MAP_LINK.test(links[0].href)
      && c.textContent.trim() === links[0].textContent.trim() && !c.querySelector('h1, h2, h3, h4');
  };
  const mapCell = cells.length > 1 ? [...cells].reverse().find(isMapCell) : null;

  const details = document.createElement('div');
  details.className = 'office-info-details';
  cells.filter((c) => c !== mapCell).forEach((c) => details.append(...c.childNodes));

  // address paragraphs: those whose link points at a map
  const addresses = [...details.querySelectorAll('a[href]')]
    .filter((a) => MAP_LINK.test(a.href))
    .map((a) => {
      a.classList.add('office-info-address');
      // keep line breaks readable as text and prefix the source's map-pin icon
      a.querySelectorAll('br').forEach((br) => br.after('\n'));
      if (!a.querySelector('.office-info-pin')) {
        const pin = document.createElement('span');
        pin.className = 'office-info-pin';
        pin.innerHTML = PIN_SVG;
        a.prepend(pin, ' ');
      }
      const p = a.closest('p');
      if (p) p.classList.add('office-info-address-item');
      return a;
    });

  details.querySelectorAll('ul').forEach((ul) => {
    if (ul.closest('.office-info-address-item')) return;
    ul.classList.add('office-info-contacts');
    [...ul.children].forEach((li) => li.classList.add(`office-info-${iconFor(li.textContent)}`));
  });

  block.replaceChildren(details);

  if (mapCell || addresses.length) {
    const firstAddress = addresses[0];
    const address = addressText(firstAddress);
    const title = details.querySelector('h1, h2, h3, h4')?.textContent.trim();
    const { wrapper, mapsHref } = buildMap(mapCell, address, title);
    const openHref = mapsHref || firstAddress?.href;
    if (openHref) {
      const open = document.createElement('p');
      open.className = 'office-info-open';
      const a = document.createElement('a');
      a.href = openHref;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = document.documentElement.lang?.startsWith('fr')
        ? 'Ouvrir dans Maps' : 'Open location in Maps';
      open.append(a);
      wrapper.append(open);
    }
    if (wrapper.children.length) block.append(wrapper);
  }
  block.classList.toggle('office-info-has-map', block.children.length > 1);
}
