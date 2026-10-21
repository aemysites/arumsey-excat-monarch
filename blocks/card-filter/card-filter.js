/*
 * card-filter: a dropdown that shows/hides groups of content that follow it.
 *
 * Authoring: one row per option. Cell 1 = option label, cell 2 (optional) = value.
 * The first row is the "show all" option unless a row's value is "all".
 *
 * Filter targets are resolved in this order:
 *  1. Sections with a `data-filter` attribute (section metadata "Filter").
 *  2. Otherwise, block wrappers that follow this block in the same section.
 * A target's key is its `data-filter`, its table caption, its first heading,
 * or the heading immediately preceding it.
 */

const normalize = (value) => (value || '').trim().toLowerCase();

function readOptions(block) {
  const options = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim();
    if (!label) return;
    const value = cells[1]?.textContent.trim() || label;
    options.push({ label, value });
  });
  return options;
}

/* heading directly before a block: a sibling heading or the last element of
 * the preceding default-content wrapper when that element is a heading */
function precedingHeading(el) {
  const prev = el.previousElementSibling;
  if (!prev) return null;
  const candidate = prev.classList.contains('default-content-wrapper')
    ? prev.lastElementChild : prev;
  return candidate && /^H[1-6]$/.test(candidate.tagName) ? candidate : null;
}

function targetKey(el) {
  if (el.dataset.filter) return normalize(el.dataset.filter);
  const caption = el.querySelector('caption');
  if (caption) return normalize(caption.textContent);
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) return normalize(heading.textContent);
  const label = precedingHeading(el);
  return label ? normalize(label.textContent) : '';
}

function findTargets(block) {
  const main = block.closest('main') || document;
  const sections = [...main.querySelectorAll('.section[data-filter]')];
  if (sections.length) return sections;

  const wrapper = block.closest('.card-filter-wrapper') || block;
  const targets = [];
  let next = wrapper.nextElementSibling;
  while (next) {
    if (next.matches('[class$="-wrapper"]:not(.default-content-wrapper)')
      && !next.querySelector('.card-filter')) {
      targets.push(next);
    }
    next = next.nextElementSibling;
  }
  return targets;
}

function applyFilter(block, value, allValue) {
  const key = normalize(value);
  const showAll = !key || key === 'all' || key === normalize(allValue);
  findTargets(block).forEach((target) => {
    const match = showAll || targetKey(target) === key;
    target.hidden = !match;
    // hide a heading that labels a hidden block
    const label = !target.dataset.filter && precedingHeading(target);
    if (label) label.hidden = !match;
  });
  block.dispatchEvent(new CustomEvent('card-filter:change', { bubbles: true, detail: { value } }));
}

export default function decorate(block) {
  const options = readOptions(block);
  if (!options.length) {
    block.replaceChildren();
    return;
  }

  const id = `card-filter-${Math.random().toString(36).slice(2, 8)}`;
  const label = document.createElement('label');
  label.className = 'card-filter-label';
  label.htmlFor = id;
  label.textContent = 'Filter';

  const field = document.createElement('div');
  field.className = 'card-filter-field';
  const select = document.createElement('select');
  select.id = id;
  select.className = 'card-filter-select';
  options.forEach(({ label: text, value }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.append(option);
  });
  field.append(select);

  const allValue = options[0].value;
  select.addEventListener('change', () => applyFilter(block, select.value, allValue));

  block.replaceChildren(label, field);
}
