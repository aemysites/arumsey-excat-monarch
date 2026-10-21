/*
 * Form block.
 * Authoring:
 *   | Form |
 *   | https://.../forms/contact.json |      <- link to a sheet / JSON form definition
 *   | Action | https://endpoint.example/submit |  <- optional submission endpoint
 *   | Confirmation | /thank-you |              <- optional redirect after success
 *   | Message | Thanks, we'll be in touch. |   <- optional inline success message
 * Or an inline field-definition table whose first row is the header
 *   | Field | Label | Type | Options | Mandatory | Placeholder | Value |
 */

const CONFIG_KEYS = {
  action: 'action',
  endpoint: 'action',
  submit: 'action',
  'submit-url': 'action',
  'submission-endpoint': 'action',
  confirmation: 'confirmation',
  redirect: 'confirmation',
  'thank-you': 'confirmation',
  message: 'message',
  'success-message': 'message',
  error: 'error',
  'error-message': 'error',
  method: 'method',
};

let formCounter = 0;

const toKey = (s) => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const isTrue = (v) => ['x', 'true', 'yes', 'y', 'required', 'mandatory', '1'].includes(String(v || '').trim().toLowerCase());

/** Normalise a definition row (sheet or table) into a field object. */
function normaliseField(raw) {
  const f = {};
  Object.entries(raw).forEach(([k, v]) => { f[toKey(k)] = typeof v === 'string' ? v.trim() : v; });
  const type = toKey(f.type || 'text') || 'text';
  const options = String(f.options || '')
    .split(/\r?\n|,/)
    .map((o) => o.trim())
    .filter(Boolean);
  return {
    name: f.field || f.name || toKey(f.label),
    label: f.label || '',
    type,
    value: f.value || f.default || '',
    placeholder: f.placeholder || '',
    options,
    required: isTrue(f.mandatory || f.required),
    help: f.help || f.description || '',
    style: f.style || '',
  };
}

async function fetchDefinition(href) {
  const url = new URL(href, window.location.href);
  const resp = await fetch(url.href);
  if (!resp.ok) throw new Error(`Form definition ${url.pathname} returned ${resp.status}`);
  const json = await resp.json();
  let rows = json.data;
  if (!rows && Array.isArray(json[':names']) && json[':names'].length) {
    rows = json[json[':names'][0]]?.data;
  }
  if (!rows && Array.isArray(json.fields)) rows = json.fields;
  return (rows || []).map(normaliseField);
}

function readInlineDefinition(rows) {
  const [header, ...rest] = rows;
  const keys = [...header.children].map((c) => c.textContent.trim());
  return rest.map((row) => {
    const raw = {};
    [...row.children].forEach((cell, i) => {
      if (keys[i]) raw[keys[i]] = cell.textContent;
    });
    return normaliseField(raw);
  }).filter((f) => f.name || f.label || f.type === 'submit');
}

function fieldId(formId, name, suffix = '') {
  return `${formId}-${toKey(name) || 'field'}${suffix ? `-${suffix}` : ''}`;
}

function createLabel(text, forId, required) {
  const label = document.createElement('label');
  if (forId) label.htmlFor = forId;
  label.textContent = text;
  if (required) label.dataset.required = 'true';
  return label;
}

function createChoiceGroup(field, formId) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'form-choice-group';
  if (field.label) {
    const legend = document.createElement('legend');
    legend.textContent = field.label;
    if (field.required) legend.dataset.required = 'true';
    fieldset.append(legend);
  }
  const inputType = field.type.startsWith('checkbox') ? 'checkbox' : 'radio';
  field.options.forEach((option, i) => {
    const id = fieldId(formId, field.name, i);
    const wrap = document.createElement('div');
    wrap.className = `form-choice form-${inputType}`;
    const input = document.createElement('input');
    input.type = inputType;
    input.id = id;
    input.name = field.name;
    input.value = option;
    if (field.value && field.value.split(',').map((v) => v.trim()).includes(option)) input.checked = true;
    if (field.required && inputType === 'radio') input.required = true;
    wrap.append(input, createLabel(option, id));
    fieldset.append(wrap);
  });
  return fieldset;
}

function createControl(field, formId) {
  const id = fieldId(formId, field.name);
  let control;
  switch (field.type) {
    case 'textarea':
      control = document.createElement('textarea');
      control.value = field.value;
      break;
    case 'select': {
      control = document.createElement('select');
      if (field.placeholder) {
        const ph = document.createElement('option');
        ph.value = '';
        ph.textContent = field.placeholder;
        ph.disabled = true;
        ph.selected = !field.value;
        control.append(ph);
      }
      field.options.forEach((o) => {
        const opt = document.createElement('option');
        opt.value = o;
        opt.textContent = o;
        if (o === field.value) opt.selected = true;
        control.append(opt);
      });
      break;
    }
    default:
      control = document.createElement('input');
      control.type = ['text', 'email', 'tel', 'number', 'date', 'url', 'password', 'hidden', 'file', 'time', 'month', 'search']
        .includes(field.type) ? field.type : 'text';
      if (field.value) control.value = field.value;
  }
  control.id = id;
  control.name = field.name;
  if (field.placeholder && control.tagName !== 'SELECT') control.placeholder = field.placeholder;
  if (field.required) control.required = true;
  return control;
}

function createField(field, formId) {
  const wrapper = document.createElement('div');
  wrapper.className = `form-field form-${field.type}-wrapper`;
  if (field.style) wrapper.classList.add(...field.style.split(/\s+/).map(toKey).filter(Boolean));

  switch (field.type) {
    case 'heading': {
      const h = document.createElement('h3');
      h.textContent = field.label || field.value;
      wrapper.append(h);
      return wrapper;
    }
    case 'plaintext':
    case 'text-block': {
      const p = document.createElement('p');
      p.textContent = field.label || field.value;
      wrapper.append(p);
      return wrapper;
    }
    case 'submit':
    case 'button': {
      const button = document.createElement('button');
      button.type = field.type === 'submit' ? 'submit' : 'button';
      button.className = 'button';
      button.textContent = field.label || field.value || 'Submit';
      wrapper.append(button);
      return wrapper;
    }
    case 'radio':
    case 'radio-group':
    case 'checkbox-group':
      wrapper.append(createChoiceGroup(field, formId));
      return wrapper;
    case 'checkbox':
      if (field.options.length > 1) {
        wrapper.append(createChoiceGroup(field, formId));
        return wrapper;
      }
      {
        const control = createControl({ ...field, type: 'text' }, formId);
        control.type = 'checkbox';
        control.value = field.value || 'on';
        wrapper.classList.add('form-choice');
        wrapper.append(control, createLabel(field.label, control.id, field.required));
      }
      return wrapper;
    default: {
      const control = createControl(field, formId);
      if (field.type === 'hidden') {
        wrapper.hidden = true;
        wrapper.append(control);
        return wrapper;
      }
      if (field.label) wrapper.append(createLabel(field.label, control.id, field.required));
      wrapper.append(control);
    }
  }
  if (field.help) {
    const help = document.createElement('p');
    help.className = 'form-help';
    help.textContent = field.help;
    wrapper.append(help);
  }
  return wrapper;
}

/**
 * Wraps repeated field sets (e.g. balance/apr/monthlypayment followed by
 * balance-2/apr-2/monthlypayment-2) into numbered groups. Leaves the form
 * untouched unless at least two consecutive runs share the same base field names.
 */
function groupRepeatedFields(form) {
  const runs = [];
  [...form.children].forEach((wrapper) => {
    const control = wrapper.querySelector('input, select, textarea');
    if (!control || wrapper.hidden || control.type === 'hidden') {
      runs.push(null);
      return;
    }
    const [, base, n] = control.name.match(/^(.+?)(?:-(\d+))?$/) || [];
    const index = Number(n || 1);
    const last = runs[runs.length - 1];
    if (last && last.index === index) {
      last.wrappers.push(wrapper);
      last.bases.push(base);
    } else {
      runs.push({ index, wrappers: [wrapper], bases: [base] });
    }
  });
  const groups = runs.filter(Boolean);
  const signature = groups[0]?.bases.join('|');
  const repeated = groups.length > 1
    && groups.every((g) => g.wrappers.length > 1 && g.bases.join('|') === signature);
  if (!repeated) return;

  groups.forEach((group, i) => {
    const el = document.createElement('div');
    el.className = 'form-group';
    el.setAttribute('role', 'group');
    const badge = document.createElement('span');
    badge.className = 'form-group-index';
    badge.id = `${form.id}-group-${i + 1}`;
    badge.textContent = i + 1;
    el.setAttribute('aria-labelledby', badge.id);
    const fields = document.createElement('div');
    fields.className = 'form-group-fields';
    group.wrappers[0].before(el);
    fields.append(...group.wrappers);
    el.append(badge, fields);
  });
}

function serialise(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (value instanceof File) return;
    if (key in data) data[key] = [].concat(data[key], value).join(', ');
    else data[key] = value;
  });
  return data;
}

function setStatus(form, text, state) {
  let status = form.querySelector('.form-status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.append(status);
  }
  status.textContent = text;
  status.dataset.state = state;
}

function attachSubmit(form, config) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!config.action) {
      setStatus(form, config.error || 'This form has no submission endpoint configured.', 'error');
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try {
      const resp = await fetch(config.action, {
        method: (config.method || 'POST').toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: serialise(form) }),
      });
      if (!resp.ok) throw new Error(`Submission failed: ${resp.status}`);
      if (config.confirmation) {
        window.location.href = new URL(config.confirmation, window.location.href).href;
        return;
      }
      form.reset();
      setStatus(form, config.message || 'Thank you. Your submission has been received.', 'success');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setStatus(form, config.error || 'Something went wrong. Please try again.', 'error');
    } finally {
      if (submit) submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  const config = {};
  let definitionHref = null;
  let fields = null;

  const firstCells = rows[0] ? [...rows[0].children].map((c) => toKey(c.textContent)) : [];
  const inlineTable = firstCells.includes('type') && (firstCells.includes('field') || firstCells.includes('name') || firstCells.includes('label'));

  if (inlineTable) {
    fields = readInlineDefinition(rows);
  } else {
    rows.forEach((row) => {
      const cells = [...row.children];
      const key = cells.length > 1 ? CONFIG_KEYS[toKey(cells[0].textContent)] : null;
      if (key) {
        const valueCell = cells[1];
        const link = valueCell.querySelector('a[href]');
        config[key] = link && key !== 'message' && key !== 'error' ? link.href : valueCell.textContent.trim();
        return;
      }
      const link = row.querySelector('a[href]');
      if (!definitionHref && link) definitionHref = link.href;
      else if (!definitionHref && /\.json(\?|$)/.test(row.textContent.trim())) definitionHref = row.textContent.trim();
    });
  }

  // a data-action attribute (e.g. set by a script) also configures the endpoint
  if (!config.action && block.dataset.action) config.action = block.dataset.action;

  if (!fields && definitionHref) {
    try {
      fields = await fetchDefinition(definitionHref);
      // a sheet-backed form submits back to its own sheet unless an endpoint is set
      if (!config.action) config.action = new URL(definitionHref, window.location.href).pathname;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  if (!fields || !fields.length) {
    // leave authored content visible rather than rendering an empty form
    block.classList.add('form-unavailable');
    return;
  }

  formCounter += 1;
  const formId = `form-${formCounter}`;
  const form = document.createElement('form');
  form.id = formId;
  if (config.action) form.dataset.action = config.action;

  fields.forEach((field) => form.append(createField(field, formId)));
  groupRepeatedFields(form);
  if (!form.querySelector('button[type="submit"]') && config.action) {
    form.append(createField({
      type: 'submit', label: 'Submit', name: 'submit', options: [],
    }, formId));
  }

  attachSubmit(form, config);
  block.replaceChildren(form);
}
