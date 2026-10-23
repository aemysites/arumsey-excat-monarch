import { toClassName } from '../../scripts/aem.js';

const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'url', 'date', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'submit'];
const CONFIG_KEYS = {
  action: 'action',
  'form action': 'action',
  'submit url': 'action',
  success: 'success',
  'success message': 'success',
  'thank you': 'success',
  error: 'error',
  'error message': 'error',
};

let formCount = 0;

function inferType(label, name) {
  const key = `${label} ${name}`.toLowerCase();
  if (key.includes('email')) return 'email';
  if (key.includes('phone') || key.includes('tel')) return 'tel';
  if (key.includes('message') || key.includes('comment')) return 'textarea';
  return 'text';
}

function normaliseField(raw) {
  let label = (raw.label || '').trim();
  const required = /\*\s*$/.test(label) || /^(true|yes|x|required)$/i.test((raw.required || '').trim());
  label = label.replace(/\*\s*$/, '').trim();
  const name = (raw.name || '').trim() || toClassName(label);
  let type = (raw.type || '').trim().toLowerCase();
  if (!FIELD_TYPES.includes(type)) type = inferType(label, name);
  const options = (raw.options || '').split(',').map((o) => o.trim()).filter(Boolean);
  return {
    label, name, type, required, options, placeholder: (raw.placeholder || '').trim(),
  };
}

/** Read fields and config from authored rows: Label | Type | Options-or-placeholder. */
function readRows(block) {
  const fields = [];
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children].map((c) => c.textContent.trim());
    if (!cells[0]) return;
    const configKey = CONFIG_KEYS[cells[0].toLowerCase()];
    if (configKey && (cells[1] || row.children[1]?.querySelector('img, picture'))) {
      const cell = row.children[1];
      const link = cell.querySelector('a');
      config[configKey] = configKey === 'action' && link ? link.href : cells[1];
      // messages may be rich (image + heading + copy): keep the authored nodes
      if (configKey !== 'action' && cell.querySelector('h1, h2, h3, h4, h5, h6, p, picture, img')) {
        config[`${configKey}Content`] = cell;
      }
      return;
    }
    const type = (cells[1] || '').toLowerCase();
    const field = normaliseField({
      label: cells[0],
      type,
      options: ['select', 'radio'].includes(type) ? cells[2] : '',
      placeholder: ['select', 'radio'].includes(type) ? '' : cells[2],
    });
    fields.push(field);
  });
  return { fields, config };
}

async function readSpreadsheet(href) {
  const resp = await fetch(href);
  if (!resp.ok) return null;
  const json = await resp.json();
  const rows = json.data || [];
  const fields = [];
  const config = {};
  rows.forEach((row) => {
    const get = (key) => row[key] ?? row[key.toLowerCase()] ?? '';
    const label = get('Label') || get('Field');
    const configKey = CONFIG_KEYS[String(label).toLowerCase()];
    if (configKey) {
      config[configKey] = get('Value') || get('Placeholder');
      return;
    }
    if (!label && !get('Name')) return;
    fields.push(normaliseField({
      label,
      name: get('Name'),
      type: get('Type'),
      required: String(get('Mandatory') || get('Required')),
      options: get('Options'),
      placeholder: get('Placeholder'),
    }));
  });
  return { fields, config };
}

function createControl(field, id) {
  if (field.type === 'textarea') {
    const el = document.createElement('textarea');
    el.rows = 5;
    return el;
  }
  if (field.type === 'select') {
    const el = document.createElement('select');
    // source shows the label text as the in-field placeholder option ("Select a product*")
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = field.placeholder || `${field.label}${field.required ? '*' : ''}` || 'Select…';
    el.append(empty);
    field.options.forEach((o) => {
      const option = document.createElement('option');
      option.value = o;
      option.textContent = o;
      el.append(option);
    });
    return el;
  }
  if (field.type === 'radio') {
    const group = document.createElement('div');
    group.className = 'contact-form-options';
    field.options.forEach((o, idx) => {
      const optionId = `${id}-${idx}`;
      const wrap = document.createElement('div');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = field.name;
      input.value = o;
      input.id = optionId;
      if (field.required) input.required = true;
      const lab = document.createElement('label');
      lab.htmlFor = optionId;
      lab.textContent = o;
      wrap.append(input, lab);
      group.append(wrap);
    });
    return group;
  }
  const el = document.createElement('input');
  el.type = field.type;
  return el;
}

function createField(field, formId) {
  const id = `${formId}-${field.name}`;
  if (field.type === 'submit') return null;
  if (field.type === 'hidden') {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = field.name;
    input.value = field.placeholder;
    return input;
  }

  const wrapper = document.createElement('div');
  wrapper.className = `contact-form-field contact-form-${field.type}`;
  const control = createControl(field, id);
  const label = document.createElement('label');
  label.textContent = field.label;
  if (field.required) {
    const mark = document.createElement('span');
    mark.className = 'contact-form-required';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '*';
    label.append(mark);
  }

  if (field.type === 'radio') {
    const legend = document.createElement('p');
    legend.className = 'contact-form-legend';
    legend.append(...label.childNodes);
    wrapper.append(legend, control);
    return wrapper;
  }

  control.id = id;
  control.name = field.name;
  if (field.required) control.required = true;
  label.htmlFor = id;

  if (field.type === 'checkbox') {
    control.value = 'true';
    wrapper.append(control, label);
  } else {
    // placeholder=" " keeps :placeholder-shown usable for floating labels
    if (control.tagName !== 'SELECT') control.placeholder = field.placeholder || ' ';
    wrapper.append(control, label);
  }

  // inline validation message (source shows it under the field instead of a browser bubble)
  const error = document.createElement('p');
  error.className = 'contact-form-error';
  error.id = `${id}-error`;
  wrapper.append(error);
  control.setAttribute('aria-describedby', error.id);
  wrapper.dataset.label = field.label;
  return wrapper;
}

function errorMessage(control) {
  const wrapper = control.closest('.contact-form-field');
  const label = (wrapper?.dataset.label || '').toLowerCase();
  if (control.validity.valueMissing && label) {
    const article = /^[aeiou]/.test(label) ? 'an' : 'a';
    return `Please enter ${article} ${label} to continue.`;
  }
  return control.validationMessage;
}

function setFieldError(control, message) {
  const wrapper = control.closest('.contact-form-field');
  const error = wrapper?.querySelector('.contact-form-error');
  if (!wrapper || !error) return;
  wrapper.classList.toggle('contact-form-invalid', !!message);
  if (message) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
  error.textContent = message || '';
}

function showStatus(form, message, state, content) {
  // rich success content (image + heading + copy) replaces the form, as on the source
  if (content && state === 'success') {
    const panel = document.createElement('div');
    panel.className = 'contact-form-success';
    panel.setAttribute('role', 'status');
    panel.tabIndex = -1;
    panel.append(...[...content.childNodes].map((n) => n.cloneNode(true)));
    form.replaceWith(panel);
    panel.focus();
    return;
  }
  let status = form.querySelector('.contact-form-status');
  if (!status) {
    status = document.createElement('div');
    status.className = 'contact-form-status';
    status.setAttribute('role', 'status');
    form.append(status);
  }
  status.dataset.state = state;
  if (content) status.replaceChildren(...[...content.childNodes].map((n) => n.cloneNode(true)));
  else status.textContent = message;
}

/*
 * Source keeps Submit disabled until the form can be sent: all required fields valid and,
 * for a preference list of optional checkboxes (e.g. email opt-out), at least one ticked.
 */
function canSubmit(form) {
  // :invalid does not fire 'invalid' events, so inline errors stay hidden while typing
  if (form.querySelector(':invalid')) return false;
  const boxes = [...form.querySelectorAll('input[type="checkbox"]')];
  const optional = boxes.filter((b) => !b.required);
  if (optional.length > 1 && optional.length === boxes.length) return boxes.some((b) => b.checked);
  return true;
}

function buildForm(fields, config) {
  formCount += 1;
  const formId = `contact-form-${formCount}`;
  const form = document.createElement('form');
  form.id = formId;
  form.noValidate = false;
  if (config.action) form.action = config.action;

  fields.forEach((field) => {
    const el = createField(field, formId);
    if (el) form.append(el);
  });

  const submitField = fields.find((f) => f.type === 'submit');
  const actions = document.createElement('div');
  actions.className = 'contact-form-actions';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button';
  submit.textContent = submitField?.label || 'Submit';
  actions.append(submit);
  form.append(actions);

  // replace browser bubbles with inline messages; focus the first invalid control
  let firstInvalid = null;
  form.addEventListener('invalid', (e) => {
    e.preventDefault();
    setFieldError(e.target, errorMessage(e.target));
    if (!firstInvalid) {
      firstInvalid = e.target;
      queueMicrotask(() => {
        firstInvalid.focus();
        firstInvalid = null;
      });
    }
  }, true);

  let sending = false;
  const updateSubmit = () => {
    submit.disabled = sending || !canSubmit(form);
  };

  const revalidate = (e) => {
    const control = e.target;
    if (control.closest('.contact-form-invalid')) {
      setFieldError(control, control.checkValidity() ? '' : errorMessage(control));
    }
    updateSubmit();
  };
  form.addEventListener('input', revalidate);
  form.addEventListener('change', revalidate);
  form.addEventListener('reset', () => setTimeout(updateSubmit));
  updateSubmit();

  const successText = config.success || 'Thank you. Your submission has been received.';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity() || !canSubmit(form)) return;
    if (!config.action) {
      showStatus(form, successText, 'success', config.successContent);
      return;
    }
    sending = true;
    updateSubmit();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const resp = await fetch(config.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      form.reset();
      showStatus(form, successText, 'success', config.successContent);
    } catch (err) {
      showStatus(form, config.error || 'Something went wrong. Please try again.', 'error', config.errorContent);
    } finally {
      sending = false;
      updateSubmit();
    }
  });

  return form;
}

export default async function decorate(block) {
  const link = block.querySelector('a[href$=".json"]');
  let model = null;
  if (link) {
    try {
      model = await readSpreadsheet(link.href);
    } catch (e) {
      model = null;
    }
  }
  if (!model || !model.fields.length) model = readRows(block);
  if (!model.fields.length) return;

  block.replaceChildren(buildForm(model.fields, model.config));
}
