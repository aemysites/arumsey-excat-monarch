/**
 * Locator search: a search input and button that submit to an authored URL
 * (e.g. a repairer or branch locator), optionally with a state selector.
 *
 * Authoring:
 * - Content rows (heading, intro text): shown above the form.
 * - Config rows [key] [value]:
 *   `action` (required: target URL or link), `param` (query parameter for the
 *   input, default "q"), `label` (input label), `placeholder`, `button`
 *   (button label, default "Search"), `states` (comma separated list or list:
 *   renders a select), `state param` (query parameter for the select, default
 *   "state"), `new window` (yes to open results in a new tab).
 */

const CONFIG_KEYS = ['action', 'param', 'label', 'placeholder', 'button', 'states', 'state-param', 'new-window'];
let formCount = 0;

function toKey(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function listValues(cell) {
  const items = cell.querySelectorAll('li');
  if (items.length) return [...items].map((li) => li.textContent.trim()).filter(Boolean);
  return cell.textContent.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
}

export default function decorate(block) {
  const config = {};
  const intro = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = toKey(cells[0]?.textContent);
    if (cells.length >= 2 && CONFIG_KEYS.includes(key)) {
      [, config[key]] = cells;
    } else {
      cells.forEach((cell) => intro.push(...cell.childNodes));
    }
  });

  formCount += 1;
  const id = `locator-search-${formCount}`;
  const text = (k, fallback = '') => config[k]?.textContent.trim() || fallback;
  const action = config.action?.querySelector('a')?.href || text('action');

  const elements = [];
  if (intro.length) {
    const introEl = document.createElement('div');
    introEl.className = 'locator-search-intro';
    introEl.append(...intro);
    elements.push(introEl);
  }

  const form = document.createElement('form');
  form.className = 'locator-search-form';
  form.method = 'get';
  form.setAttribute('role', 'search');
  if (action) form.action = action;
  if (/^(yes|true)$/i.test(text('new-window'))) form.target = '_blank';

  const field = document.createElement('div');
  field.className = 'locator-search-field';
  const label = document.createElement('label');
  label.htmlFor = id;
  // no authored label (keyword search): keep an accessible name, hide it visually like the source
  const hasLabel = Boolean(text('label'));
  label.textContent = text('label', text('placeholder', 'Search'));
  if (!hasLabel) {
    label.className = 'locator-search-label-hidden';
    form.classList.add('locator-search-inline');
  }
  const input = document.createElement('input');
  input.type = 'search';
  input.id = id;
  input.name = text('param', 'q');
  input.required = true;
  input.autocomplete = hasLabel ? 'postal-code' : 'off';
  if (text('placeholder')) input.placeholder = text('placeholder');
  field.append(label, input);
  form.append(field);

  if (config.states) {
    const states = listValues(config.states);
    if (states.length) {
      const stateField = document.createElement('div');
      stateField.className = 'locator-search-field locator-search-state';
      const stateLabel = document.createElement('label');
      stateLabel.htmlFor = `${id}-state`;
      stateLabel.textContent = 'State';
      const select = document.createElement('select');
      select.id = `${id}-state`;
      select.name = text('state-param', 'state');
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = 'Please select';
      select.append(empty, ...states.map((s) => Object.assign(document.createElement('option'), { value: s, textContent: s })));
      stateField.append(stateLabel, select);
      form.append(stateField);
    }
  }

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary locator-search-submit';
  const buttonText = document.createElement('span');
  buttonText.className = 'locator-search-submit-text';
  buttonText.textContent = text('button', 'Search');
  button.append(buttonText);
  form.append(button);

  form.addEventListener('submit', (e) => {
    if (!action) {
      e.preventDefault();
      return;
    }
    input.value = input.value.trim();
    if (!input.value) {
      e.preventDefault();
      input.focus();
    }
  });

  elements.push(form);
  block.replaceChildren(...elements);
}
