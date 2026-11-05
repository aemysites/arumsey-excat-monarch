/*
 * Job Details Block
 * Location and employment-type strip with a pin icon.
 * Authors use one row with cells (location, employment type, ...) or a single
 * cell with values separated by "|".
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
// map-pin artwork as used on the source site
const PIN_PATH = 'm216.210938 0c-122.664063 0-222.460938 99.796875-222.460938 222.460938 0 154.175781 222.679688 417.539062 222.679688 417.539062s222.242187-270.945312 222.242187-417.539062c0-122.664063-99.792969-222.460938-222.460937-222.460938zm67.121093 287.597656c-18.507812 18.503906-42.8125 27.757813-67.121093 27.757813-24.304688 0-48.617188-9.253907-67.117188-27.757813-37.011719-37.007812-37.011719-97.226562 0-134.238281 17.921875-17.929687 41.761719-27.804687 67.117188-27.804687 25.355468 0 49.191406 9.878906 67.121093 27.804687 37.011719 37.011719 37.011719 97.230469 0 134.238281zm0 0';

function createPin() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 682 682.667');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('job-details-icon');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', PIN_PATH);
  path.setAttribute('fill', '#2a667e');
  svg.append(path);
  return svg;
}

export default function decorate(block) {
  const values = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const hasMarkup = cell.querySelector('a, strong, em');
      if (hasMarkup) {
        if (cell.textContent.trim()) values.push(cell);
        return;
      }
      cell.textContent.split('|').map((t) => t.trim()).filter(Boolean)
        .forEach((t) => values.push(t));
    });
  });

  const list = document.createElement('ul');
  list.className = 'job-details-list';
  values.forEach((value, idx) => {
    const li = document.createElement('li');
    li.className = 'job-details-item';
    if (idx === 0) li.classList.add('job-details-location');
    if (typeof value === 'string') li.textContent = value;
    else li.append(...value.childNodes);
    list.append(li);
  });

  block.replaceChildren(createPin(), list);
}
