/**
 * software-finder: intro copy plus a set of tax-situation checkboxes.
 *
 * Authored cells (one row, either cell may be missing):
 *  1. Intro: optional rating line "4.3 (495170)", heading, description.
 *  2. A list of situations, one per item ("Have kids", "Own a home"...).
 *
 * Checked situations are written to the `situations` query parameter and
 * announced with a bubbling `software-finder:change` event
 * (`detail: { selected: ['have-kids', ...] }`). Elements on the page carrying
 * `data-situations="have-kids own-a-home"` get `.software-finder-match`.
 */

const RATING_RE = /^\s*(\d(?:\.\d+)?)\s*(?:\/\s*5)?\s*\(([\d,]+)\)\s*$/;

function toSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildStars(value) {
  const stars = document.createElement('span');
  stars.className = 'software-finder-stars';
  stars.setAttribute('aria-hidden', 'true');
  stars.style.setProperty('--software-finder-rating', String(Math.min(5, Math.max(0, value))));
  stars.textContent = '★★★★★';
  return stars;
}

function decorateRating(intro) {
  const p = [...intro.querySelectorAll('p')].find((el) => RATING_RE.test(el.textContent));
  if (!p) return;
  const [, value, count] = p.textContent.match(RATING_RE);
  p.className = 'software-finder-rating';
  p.setAttribute('aria-label', `Rated ${value} out of 5 from ${count} reviews`);
  const text = document.createElement('span');
  text.textContent = `${value} (${count})`;
  p.replaceChildren(buildStars(Number(value)), text);
}

function applyMatches(selected) {
  document.querySelectorAll('[data-situations]').forEach((el) => {
    const tags = el.dataset.situations.split(/\s+/);
    const match = selected.length > 0 && selected.every((s) => tags.includes(s));
    el.classList.toggle('software-finder-match', match);
  });
}

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);
  const listCell = cells.find((c) => c.querySelector('ul, ol'));
  const introCells = cells.filter((c) => c !== listCell && c.textContent.trim());

  const intro = document.createElement('div');
  intro.className = 'software-finder-intro';
  introCells.forEach((c) => intro.append(...c.childNodes));
  decorateRating(intro);

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'software-finder-filters';
  const legend = document.createElement('legend');
  legend.className = 'software-finder-legend';
  legend.textContent = listCell?.querySelector(':scope > p')?.textContent.trim() || 'Your tax situation';
  fieldset.append(legend);

  const params = new URLSearchParams(window.location.search);
  const initial = (params.get('situations') || '').split(',').filter(Boolean);
  const items = listCell ? [...listCell.querySelectorAll('li')] : [];
  const group = document.createElement('div');
  group.className = 'software-finder-options';

  const emit = () => {
    const selected = [...group.querySelectorAll('input:checked')].map((i) => i.value);
    const url = new URL(window.location.href);
    if (selected.length) url.searchParams.set('situations', selected.join(','));
    else url.searchParams.delete('situations');
    window.history.replaceState({}, '', url);
    applyMatches(selected);
    block.dispatchEvent(new CustomEvent('software-finder:change', {
      bubbles: true,
      detail: { selected },
    }));
  };

  items.forEach((li, i) => {
    const text = li.textContent.trim();
    if (!text) return;
    const id = `software-finder-${toSlug(text)}-${i}`;
    const label = document.createElement('label');
    label.className = 'software-finder-option';
    label.htmlFor = id;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.value = toSlug(text);
    input.checked = initial.includes(input.value);
    input.addEventListener('change', emit);
    const span = document.createElement('span');
    span.textContent = text;
    label.append(input, span);
    group.append(label);
  });
  // fill two columns top-to-bottom (source: two fieldsets, 4 + 3)
  group.style.setProperty('--software-finder-rows', String(Math.ceil(group.children.length / 2) || 1));
  fieldset.append(group);

  const layout = document.createElement('div');
  layout.className = 'software-finder-layout';
  if (intro.childNodes.length) layout.append(intro);
  if (group.children.length) {
    // small screens collapse the filters behind a "See options" disclosure (source .icon-btn)
    fieldset.id = `software-finder-filters-${[...document.querySelectorAll('.software-finder')].indexOf(block)}`;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'software-finder-toggle';
    toggle.setAttribute('aria-controls', fieldset.id);
    toggle.setAttribute('aria-expanded', String(initial.length > 0));
    toggle.innerHTML = '<span>See options</span><svg class="software-finder-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 12h10" stroke="currentColor" stroke-width="2"/><path class="software-finder-toggle-plus" d="M12 7v10" stroke="currentColor" stroke-width="2"/></svg>';
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Hide options' : 'See options';
    });
    if (initial.length) toggle.querySelector('span').textContent = 'Hide options';
    layout.append(toggle, fieldset);
  }
  block.replaceChildren(layout);

  if (initial.length) applyMatches(initial);
}
