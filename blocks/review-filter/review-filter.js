/**
 * review-filter: two dependent selects (review type -> product) and a submit button.
 *
 * Authored rows:
 *  - Config rows, first cell is a key:
 *      "Type label"   | Select review type
 *      "Filter label" | Review filter
 *      "Submit"       | Submit
 *  - Every other row is one review type:
 *      Type name (plain text or a link) | list of product links
 *
 * Submit navigates to the chosen product link, else the type link.
 * The current page preselects the matching type/product.
 */

const CONFIG_KEYS = {
  'type label': 'typeLabel',
  'type placeholder': 'typeLabel',
  'filter label': 'filterLabel',
  'filter placeholder': 'filterLabel',
  submit: 'submit',
  'submit label': 'submit',
};

const indexOf = (select) => (select.value === '' ? -1 : Number(select.value));

let idCounter = 0;
function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function samePage(href) {
  try {
    const url = new URL(href, window.location.href);
    const strip = (p) => p.replace(/(\.html)?\/?$/, '');
    const target = strip(url.pathname);
    const current = strip(window.location.pathname);
    if (target === current) return true;
    // tolerate a path prefix on the current page (e.g. /content/... preview paths)
    return target.length > 1 && current.endsWith(target);
  } catch (e) {
    return false;
  }
}

function parse(block) {
  const config = {
    typeLabel: 'Select review type',
    filterLabel: 'Review filter',
    submit: 'Submit',
  };
  const types = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const key = CONFIG_KEYS[cells[0].textContent.trim().toLowerCase()];
    if (key) {
      const value = cells[1]?.textContent.trim();
      if (value) config[key] = value;
      return;
    }
    const name = cells[0].textContent.trim();
    if (!name) return;
    const typeLink = cells[0].querySelector('a');
    const listCell = cells.slice(1).find((c) => c.querySelector('li, a')) || null;
    const filters = listCell
      ? [...listCell.querySelectorAll('li')].map((li) => {
        const a = li.querySelector('a');
        return { label: li.textContent.trim(), href: a ? a.href : '' };
      }).filter((f) => f.label)
      : [];
    if (listCell && !filters.length) {
      listCell.querySelectorAll('a').forEach((a) => {
        filters.push({ label: a.textContent.trim(), href: a.href });
      });
    }
    types.push({ name, href: typeLink ? typeLink.href : '', filters });
  });
  return { config, types };
}

function makeField(labelText, className) {
  const field = document.createElement('div');
  field.className = `review-filter-field ${className}`;
  const id = nextId(className);
  const label = document.createElement('label');
  label.htmlFor = id;
  label.className = 'review-filter-label';
  label.textContent = labelText;
  const select = document.createElement('select');
  select.id = id;
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = labelText;
  placeholder.disabled = true;
  placeholder.selected = true;
  select.append(placeholder);
  field.append(label, select);
  return { field, select };
}

export default function decorate(block) {
  const { config, types } = parse(block);
  const form = document.createElement('form');
  form.className = 'review-filter-form';

  const type = makeField(config.typeLabel, 'review-filter-type');
  const filter = makeField(config.filterLabel, 'review-filter-product');
  types.forEach((t, i) => {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = t.name;
    type.select.append(option);
  });

  const fillFilters = (typeIndex) => {
    filter.select.querySelectorAll('option:not([value=""])').forEach((o) => o.remove());
    filter.select.value = '';
    const t = types[typeIndex];
    const list = t ? t.filters : [];
    list.forEach((f, i) => {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = f.label;
      filter.select.append(option);
    });
    filter.select.disabled = !list.length;
  };

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary review-filter-submit';
  submit.textContent = config.submit;

  // Preselect from current page.
  let selectedType = -1;
  let selectedFilter = -1;
  types.forEach((t, ti) => {
    t.filters.forEach((f, fi) => {
      if (selectedType < 0 && f.href && samePage(f.href)) {
        selectedType = ti;
        selectedFilter = fi;
      }
    });
    if (selectedType < 0 && t.href && samePage(t.href)) selectedType = ti;
  });
  fillFilters(selectedType);
  if (selectedType >= 0) type.select.value = String(selectedType);
  if (selectedFilter >= 0) filter.select.value = String(selectedFilter);

  const updateSubmit = () => {
    const t = types[indexOf(type.select)];
    const f = t?.filters[indexOf(filter.select)];
    submit.disabled = !(f?.href || t?.href);
  };
  updateSubmit();

  type.select.addEventListener('change', () => {
    fillFilters(indexOf(type.select));
    updateSubmit();
  });
  filter.select.addEventListener('change', updateSubmit);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = types[indexOf(type.select)];
    if (!t) return;
    const f = t.filters[indexOf(filter.select)];
    const href = f?.href || t.href;
    if (href) window.location.href = href;
  });

  form.append(type.field, filter.field, submit);
  block.replaceChildren(form);
}
