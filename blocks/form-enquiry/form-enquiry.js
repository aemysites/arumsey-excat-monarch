/**
 * Enquiry form built from authored config.
 *
 * Authoring (any mix of rows):
 * - Content rows (one cell, or not matching the rows below): heading/intro text
 *   shown above the form.
 * - Config rows, two cells [key] [value]:
 *   `form` (link to a form definition spreadsheet .json), `action` (submit URL),
 *   `submit` (button label), `help` (aside panel content, or a /fragments/ link),
 *   `success` (message after submit), `error` (message on failure),
 *   `required note` (text such as "* denotes required field").
 * - Field rows, [label] [type] [options or placeholder] [required]:
 *   type is one of text, email, tel, number, date, url, textarea, select,
 *   radio, checkbox, heading, hidden. Options are comma separated or a list.
 *   Required is "yes", "true", "required", "*" or "x".
 *
 * Form definition JSON (spreadsheet) columns: Name, Type, Label, Placeholder,
 * Options, Mandatory, Value, Help.
 *
 * Options (classes): alt (compact single-column layout).
 */
import { loadFragment } from '../fragment/fragment.js';

const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'date', 'url', 'textarea', 'select', 'radio', 'checkbox', 'heading', 'hidden', 'submit'];
const CONFIG_KEYS = ['form', 'action', 'submit', 'help', 'success', 'error', 'required-note'];
const TRUTHY = ['yes', 'true', 'required', '*', 'x', 'y', 'mandatory'];

let fieldCount = 0;

function toKey(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cellOptions(cell) {
  if (!cell) return [];
  const items = cell.querySelectorAll('li');
  if (items.length) return [...items].map((li) => li.textContent.trim()).filter(Boolean);
  return cell.textContent.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
}

function pick(obj, ...keys) {
  const match = Object.keys(obj).find((k) => keys.includes(k.toLowerCase()));
  return match ? String(obj[match] ?? '').trim() : '';
}

function fieldsFromDefinition(json) {
  const firstSheet = json?.[':names']?.[0];
  const rows = json?.data || (firstSheet && json[firstSheet]?.data) || [];
  return rows.map((row) => {
    const label = pick(row, 'label');
    const type = (pick(row, 'type') || 'text').toLowerCase();
    const opts = pick(row, 'options');
    return {
      name: pick(row, 'name') || toKey(label),
      type: FIELD_TYPES.includes(type) ? type : 'text',
      label,
      placeholder: pick(row, 'placeholder'),
      options: opts ? opts.split(',').map((s) => s.trim()).filter(Boolean) : [],
      required: TRUTHY.includes(pick(row, 'mandatory', 'required').toLowerCase()),
      value: pick(row, 'value'),
      help: pick(row, 'help', 'description'),
    };
  });
}

function buildControl(field, id) {
  let control;
  if (field.type === 'textarea') {
    control = document.createElement('textarea');
    control.rows = 4;
  } else if (field.type === 'select') {
    control = document.createElement('select');
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = field.placeholder || 'Please select';
    control.append(placeholder);
    field.options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      control.append(option);
    });
  } else {
    control = document.createElement('input');
    control.type = field.type;
    if (field.placeholder) control.placeholder = field.placeholder;
  }
  control.id = id;
  control.name = field.name;
  if (field.value && field.type !== 'select') control.value = field.value;
  if (field.required) {
    control.required = true;
    control.setAttribute('aria-required', 'true');
  }
  return control;
}

function buildChoiceGroup(field, id) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'form-enquiry-choices';
  const legend = document.createElement('legend');
  legend.textContent = field.label;
  if (field.required) legend.append(Object.assign(document.createElement('span'), { className: 'form-enquiry-required', textContent: '*' }));
  fieldset.append(legend);
  const options = field.options.length ? field.options : [field.label];
  options.forEach((opt, i) => {
    const optId = `${id}-${i}`;
    const wrap = document.createElement('div');
    wrap.className = 'form-enquiry-choice';
    const input = document.createElement('input');
    input.type = field.type;
    input.id = optId;
    input.name = field.name;
    input.value = opt;
    if (field.required && field.type === 'radio') input.required = true;
    const label = document.createElement('label');
    label.htmlFor = optId;
    label.textContent = opt;
    wrap.append(input, label);
    fieldset.append(wrap);
  });
  return fieldset;
}

function buildField(field) {
  fieldCount += 1;
  const id = `form-enquiry-${field.name || 'field'}-${fieldCount}`;
  if (field.type === 'heading') {
    const h = document.createElement('h3');
    h.className = 'form-enquiry-heading';
    h.textContent = field.label;
    return h;
  }
  if (field.type === 'hidden') {
    return Object.assign(document.createElement('input'), { type: 'hidden', name: field.name, value: field.value });
  }
  const wrapper = document.createElement('div');
  wrapper.className = `form-enquiry-field form-enquiry-${field.type}`;
  if (field.type === 'radio' || field.type === 'checkbox') {
    wrapper.append(buildChoiceGroup(field, id));
  } else {
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = field.label;
    if (field.required) label.append(Object.assign(document.createElement('span'), { className: 'form-enquiry-required', textContent: '*' }));
    wrapper.append(label);
    if (field.help) {
      const help = document.createElement('p');
      help.className = 'form-enquiry-help';
      help.id = `${id}-help`;
      help.textContent = field.help;
      wrapper.append(help);
    }
    const control = buildControl(field, id);
    if (field.help) control.setAttribute('aria-describedby', `${id}-help`);
    wrapper.append(control);
  }
  return wrapper;
}

function serialize(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (data[key] !== undefined) data[key] = `${data[key]}, ${value}`;
    else data[key] = value;
  });
  return data;
}

function readRows(block) {
  const config = {};
  const fields = [];
  const intro = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const first = cells[0];
    if (!first) return;
    const key = toKey(first.textContent);
    if (cells.length >= 2 && CONFIG_KEYS.includes(key)) {
      [, config[key]] = cells;
      return;
    }
    const type = cells.length >= 2 ? toKey(cells[1].textContent) : '';
    if (FIELD_TYPES.includes(type)) {
      if (type === 'submit') {
        config.submit = first;
        return;
      }
      const isChoice = ['select', 'radio', 'checkbox'].includes(type);
      const label = first.textContent.trim();
      fields.push({
        name: toKey(label) || `field-${fields.length + 1}`,
        type,
        label,
        placeholder: !isChoice && cells[2] ? cells[2].textContent.trim() : '',
        options: isChoice ? cellOptions(cells[2]) : [],
        required: TRUTHY.includes((cells[3]?.textContent || '').trim().toLowerCase()) || /\*\s*$/.test(label),
        value: '',
        help: '',
      });
      if (/\*\s*$/.test(label)) fields[fields.length - 1].label = label.replace(/\s*\*\s*$/, '');
      return;
    }
    cells.forEach((cell) => intro.push(...cell.childNodes));
  });
  return { config, fields, intro };
}

async function loadHelp(cell) {
  if (!cell) return null;
  const link = cell.querySelector('a');
  if (link && cell.textContent.trim() === link.textContent.trim()) {
    const url = new URL(link.href, window.location.href);
    if (url.origin === window.location.origin && url.pathname.includes('/fragments/')) {
      const fragment = await loadFragment(url.pathname);
      if (fragment) return [...fragment.childNodes];
    }
  }
  return [...cell.childNodes];
}

export default async function decorate(block) {
  const { config, fields: authoredFields, intro } = readRows(block);
  let fields = authoredFields;

  const formLink = config.form?.querySelector('a')?.href || config.form?.textContent.trim();
  if (formLink) {
    try {
      const resp = await fetch(formLink);
      if (resp.ok) fields = [...fieldsFromDefinition(await resp.json()), ...authoredFields];
    } catch (e) {
      // keep authored fields
    }
  }

  const action = config.action?.querySelector('a')?.href || config.action?.textContent.trim() || '';
  const submitLabel = config.submit?.textContent.trim() || 'Submit';
  const successText = config.success?.textContent.trim() || 'Thank you. Your enquiry has been submitted.';
  const errorText = config.error?.textContent.trim() || 'Sorry, your enquiry could not be submitted. Please try again later.';

  const elements = [];
  if (intro.length) {
    const introEl = document.createElement('div');
    introEl.className = 'form-enquiry-intro';
    introEl.append(...intro);
    elements.push(introEl);
  }

  const layout = document.createElement('div');
  layout.className = 'form-enquiry-layout';

  const form = document.createElement('form');
  form.className = 'form-enquiry-form';
  form.noValidate = false;
  if (action) form.action = action;

  if (fields.some((f) => f.required)) {
    const note = document.createElement('p');
    note.className = 'form-enquiry-required-note';
    note.textContent = config['required-note']?.textContent.trim() || '* denotes required field';
    form.append(note);
  }
  fields.forEach((field) => form.append(buildField(field)));

  const status = document.createElement('div');
  status.className = 'form-enquiry-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button form-enquiry-submit';
  submit.textContent = submitLabel;
  const actions = document.createElement('div');
  actions.className = 'form-enquiry-actions';
  actions.append(submit);
  form.append(actions, status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.className = 'form-enquiry-status';
    if (!action) {
      status.classList.add('form-enquiry-error');
      status.textContent = errorText;
      return;
    }
    submit.disabled = true;
    try {
      const resp = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: serialize(form) }),
      });
      if (!resp.ok) throw new Error(`${resp.status}`);
      form.reset();
      status.classList.add('form-enquiry-success');
      status.textContent = successText;
    } catch (err) {
      status.classList.add('form-enquiry-error');
      status.textContent = errorText;
    } finally {
      submit.disabled = false;
    }
  });

  layout.append(form);

  const helpNodes = await loadHelp(config.help);
  if (helpNodes && helpNodes.length) {
    const aside = document.createElement('aside');
    aside.className = 'form-enquiry-aside';
    aside.append(...helpNodes);
    layout.append(aside);
    layout.classList.add('form-enquiry-has-aside');
  }
  elements.push(layout);

  block.replaceChildren(...elements);
}
