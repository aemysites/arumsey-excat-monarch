/* eslint-disable */
/* global WebImporter */

/**
 * Parser: office-locator
 * Source: international tax office pages (/international-tax-offices/<country>/<city>/<id>/),
 *   section.column-control.spruce-eggshell-theme holding the office "opp" hero:
 *   h1.opp-title ("Tax Services:" + span.opp-city-state), .opp-address (Google
 *   Maps directions link with the street lines), .office-hours (today label +
 *   hidden weekly table), .opp-phone (tel: link), .btn-office-info CTAs, and a
 *   JS Google map (.oppOfficeMapContainer[data-latitude][data-longitude]) with
 *   a Bazaarvoice rating (.office-rating).
 * Layout (blocks/office-locator/README.md): one row, two cells:
 *   cell 1 = eyebrow paragraph, heading, address paragraph linking to Google
 *   Maps, hours label paragraph + list of daily hours, phone paragraph with a
 *   tel: link, CTA paragraph; cell 2 = Google Maps link (rendered as a lazy
 *   embedded map by the block) then the rating text.
 * The map is a live widget, so its link is rebuilt from the office
 * coordinates (or the directions link when there are none). Both catalog
 * variants (default / image) are the same source markup; the source never
 * shows a static map image, so no option class is set.
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, ...nodes) {
  const p = document.createElement('p');
  nodes.filter(Boolean).forEach((n) => p.append(n));
  return p;
}

function link(document, href, label) {
  const a = document.createElement('a');
  a.href = !href || /^javascript:/i.test(href) ? '#' : href;
  a.textContent = label;
  return a;
}

/* Lines of a container split on <br> / block children, as text. */
function lines(el) {
  if (!el) return [];
  const clone = el.cloneNode(true);
  // source markup is indented with newlines, so collapse whitespace first and split on a marker
  clone.querySelectorAll('br').forEach((br) => br.replaceWith('\u0001'));
  clone.querySelectorAll('div, p').forEach((n) => n.append('\u0001'));
  return clone.textContent.replace(/\s+/g, ' ').split('\u0001')
    .map((s) => s.trim().replace(/\s+,/g, ',')).filter(Boolean);
}

function ctaParagraph(document, container) {
  if (!container) return null;
  const controls = [...container.querySelectorAll('a, button')].filter((c) => text(c));
  if (!controls.length) return null;
  const p = document.createElement('p');
  controls.forEach((c, i) => {
    if (i) p.append(' ');
    const a = link(document, c.getAttribute('href'), text(c));
    if (c.classList.contains('btn')) {
      const strong = document.createElement('strong');
      strong.append(a);
      p.append(strong);
    } else {
      p.append(a);
    }
  });
  return p;
}

export default function parse(element, { document }) {
  const details = [];
  const mapCell = [];

  // eyebrow + heading: "Tax Services:<br><span class=opp-city-state>City</span>"
  const title = element.querySelector('h1.opp-title, h1, h2');
  if (title) {
    const place = title.querySelector('.opp-city-state');
    const placeText = text(place);
    const clone = title.cloneNode(true);
    const cloneplace = clone.querySelector('.opp-city-state');
    if (cloneplace) cloneplace.remove();
    const eyebrow = text(clone);
    if (eyebrow && placeText) details.push(para(document, eyebrow));
    const h = document.createElement('h1');
    h.textContent = placeText || text(title);
    details.push(h);
  }

  // address: directions link with one line per street line
  const addressLink = element.querySelector('.opp-address a[href], a.address[href]');
  let addressText = '';
  if (addressLink) {
    const a = document.createElement('a');
    a.href = addressLink.getAttribute('href');
    const parts = lines(addressLink.querySelector('.lbl-address') || addressLink);
    addressText = parts.join(', ');
    parts.forEach((line, i) => {
      if (i) a.append(document.createElement('br'));
      a.append(line);
    });
    details.push(para(document, a));
  }

  // hours: today label + weekly list (hidden toggle on the source)
  const hours = element.querySelector('.office-hours');
  if (hours) {
    const today = text(hours.querySelector('.opp-today-open-time, .lbl-open-time'));
    // each row is <p><span>Day</span><span>hours</span></p> on the source, but the
    // importer unwraps the spans before parsing ("Thursday9:00am - 6:00pm"), so
    // fall back to splitting the leading day name off the row text
    const DAY_RE = /^((?:mon|tues|wednes|thurs|fri|satur|sun)day)\s*(.*)$/i;
    const days = [...hours.querySelectorAll('.lbl-week-times p, .opp-week-open-time p')]
      .map((p) => {
        const spans = [...p.querySelectorAll('span')].map(text).filter(Boolean);
        if (spans.length > 1) return spans;
        const row = text(p);
        const m = row.match(DAY_RE);
        if (m) return m[2] ? [m[1], m[2]] : [m[1]];
        return row ? [row] : [];
      })
      .filter((cells) => cells.length);
    if (today) details.push(para(document, today));
    if (days.length) {
      const ul = document.createElement('ul');
      days.forEach((cells) => {
        const li = document.createElement('li');
        li.textContent = cells.length > 1 ? `${cells[0]}: ${cells.slice(1).join(' ')}` : cells[0];
        ul.append(li);
      });
      details.push(ul);
    }
  }

  // phone
  const tel = element.querySelector('.opp-phone a[href^="tel:"], a[href^="tel:"]');
  if (tel) details.push(para(document, link(document, tel.getAttribute('href'), text(tel))));

  // CTAs (appointment / find an office / see all pros)
  const cta = ctaParagraph(document, element.querySelector('.btn-office-info'));
  if (cta) details.push(cta);

  // map: Google Maps link from the office coordinates
  const mapEl = element.querySelector('[data-latitude][data-longitude]');
  const lat = mapEl && mapEl.getAttribute('data-latitude');
  const lng = mapEl && mapEl.getAttribute('data-longitude');
  let mapHref = '';
  if (lat && lng) mapHref = `https://maps.google.com/maps?q=${lat},${lng}`;
  else if (addressLink) mapHref = addressLink.getAttribute('href');
  if (mapHref) mapCell.push(para(document, link(document, mapHref, addressText ? `Map: ${addressText}` : mapHref)));

  // rating (Bazaarvoice inline rating; rendered only on the live page)
  const rating = element.querySelector('.office-rating');
  if (rating) {
    const avg = text(rating.querySelector('.bv_averageRating_component_container'));
    const count = text(rating.querySelector('.bv_numReviews_component_container')).replace(/[()]/g, '');
    if (avg) mapCell.push(para(document, `${avg} out of 5 stars${count ? ` (${count} reviews)` : ''}`));
  }

  const cells = [[details.length ? details : '', mapCell.length ? mapCell : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'office-locator', cells });
  element.replaceWith(block);
}
