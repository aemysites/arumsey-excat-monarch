/*
 * Location Selector block
 *
 * Default: a one-line "Products & pricing based on your <x> address | Change" bar.
 *   Row 1: message cell | change-trigger cell (text or link) | optional help cell.
 *   Optional key/value rows: "ZIP label", "Update label", "Cancel label", "Storage key".
 *   "Change" opens an inline ZIP code form; the value is stored in localStorage and a
 *   `location-selector:change` event ({ detail: { zip } }) is dispatched on document.
 *   If the trigger cell holds a real link (not "#"), it is kept as a plain link.
 *
 * lead-form option: a "have us call you" lead form.
 *   Intro row: one cell with headings / text.
 *   Field rows: Label | type (text, tel, email, number, textarea, select) | name | placeholder
 *     (for select, a 5th cell lists options, comma separated).
 *   Submit row: Label | submit.
 *   Optional key/value rows: "Action" (endpoint URL), "Success" (message), "Error" (message).
 *   Any other row is rendered as rich text (consent / disclosure copy).
 *   Without an authored Action the form validates and shows the success message without
 *   sending data anywhere.
 */

const FIELD_TYPES = ['text', 'tel', 'email', 'number', 'textarea', 'select', 'date', 'zip'];
const CONFIG_KEYS = ['zip-label', 'update-label', 'cancel-label', 'storage-key', 'action', 'endpoint', 'success', 'error'];

function key(text) {
  return (text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cellsOf(row) {
  return [...row.children];
}

function readConfigRow(row) {
  const cells = cellsOf(row);
  if (cells.length !== 2) return null;
  const k = key(cells[0].textContent);
  if (!CONFIG_KEYS.includes(k)) return null;
  const link = cells[1].querySelector('a[href]');
  return { key: k, value: link ? link.getAttribute('href') : cells[1].textContent.trim(), cell: cells[1] };
}

let uid = 0;
function nextId(prefix) {
  uid += 1;
  return `${prefix}-${uid}`;
}

/* ---------- default: location bar ---------- */

function storageGet(storageKey) {
  try {
    return window.localStorage.getItem(storageKey) || '';
  } catch (e) {
    return '';
  }
}

function storageSet(storageKey, value) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch (e) {
    // storage unavailable: keep in-memory only
  }
}

function decorateLocationBar(block) {
  const rows = [...block.children];
  const config = {};
  const contentRows = [];
  rows.forEach((row) => {
    const cfg = readConfigRow(row);
    if (cfg) config[cfg.key] = cfg.value;
    else contentRows.push(row);
  });

  const first = contentRows[0];
  const cells = first ? cellsOf(first) : [];
  const messageCell = cells[0];
  const triggerCell = cells[1];
  const helpCell = cells[2];

  const storageKey = config['storage-key'] || 'location-selector-zip';
  const bar = document.createElement('div');
  bar.className = 'location-selector-bar';

  const message = document.createElement('p');
  message.className = 'location-selector-message';
  message.textContent = messageCell ? messageCell.textContent.trim() : '';
  const current = document.createElement('span');
  current.className = 'location-selector-current';
  message.append(current);
  bar.append(message);

  const updateCurrent = (zip) => {
    current.textContent = zip ? ` (${zip})` : '';
  };
  updateCurrent(storageGet(storageKey));

  if (helpCell && helpCell.textContent.trim()) {
    const help = document.createElement('span');
    help.className = 'location-selector-help';
    help.setAttribute('role', 'note');
    help.append(...helpCell.childNodes);
    bar.append(help);
  }

  const triggerLink = triggerCell && triggerCell.querySelector('a[href]');
  const triggerHref = triggerLink ? triggerLink.getAttribute('href') : '';
  if (triggerLink && triggerHref && triggerHref !== '#') {
    triggerLink.classList.add('location-selector-trigger');
    bar.append(triggerLink);
    block.replaceChildren(bar);
    return;
  }

  const triggerText = triggerCell ? triggerCell.textContent.trim() : '';
  if (!triggerText) {
    block.replaceChildren(bar);
    return;
  }

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'location-selector-trigger';
  trigger.textContent = triggerText;
  trigger.setAttribute('aria-expanded', 'false');
  bar.append(trigger);

  const form = document.createElement('form');
  form.className = 'location-selector-form';
  form.id = nextId('location-selector-form');
  form.hidden = true;
  trigger.setAttribute('aria-controls', form.id);

  const inputId = nextId('location-selector-zip');
  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.textContent = config['zip-label'] || 'ZIP code';
  const input = document.createElement('input');
  input.id = inputId;
  input.name = 'zip';
  input.type = 'text';
  input.inputMode = 'numeric';
  input.autocomplete = 'postal-code';
  input.pattern = '\\d{5}';
  input.maxLength = 5;
  input.required = true;
  input.value = storageGet(storageKey);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = config['update-label'] || 'Update';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'location-selector-cancel';
  cancel.textContent = config['cancel-label'] || 'Cancel';
  form.append(label, input, submit, cancel);

  const toggle = (open) => {
    form.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else trigger.focus();
  };

  trigger.addEventListener('click', () => toggle(form.hidden));
  cancel.addEventListener('click', () => toggle(false));
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const zip = input.value.trim();
    storageSet(storageKey, zip);
    updateCurrent(zip);
    document.dispatchEvent(new CustomEvent('location-selector:change', { detail: { zip } }));
    toggle(false);
  });

  block.replaceChildren(bar, form);
}

/* ---------- lead-form option ---------- */

function isFieldRow(row) {
  const cells = cellsOf(row);
  return cells.length >= 2 && FIELD_TYPES.includes(key(cells[1].textContent));
}

function isSubmitRow(row) {
  const cells = cellsOf(row);
  return cells.length >= 2 && key(cells[1].textContent) === 'submit';
}

function buildField(row) {
  const cells = cellsOf(row);
  const labelText = cells[0].textContent.trim();
  const type = key(cells[1].textContent);
  const name = (cells[2] && cells[2].textContent.trim()) || key(labelText) || nextId('field');
  const placeholder = cells[3] ? cells[3].textContent.trim() : '';
  const id = nextId(`location-selector-${key(name) || 'field'}`);

  const wrapper = document.createElement('div');
  wrapper.className = `location-selector-field location-selector-field-${type}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;

  let control;
  if (type === 'textarea') {
    control = document.createElement('textarea');
  } else if (type === 'select') {
    control = document.createElement('select');
    const opts = cells[4] ? cells[4].textContent.split(',').map((o) => o.trim()).filter(Boolean) : [];
    if (placeholder) {
      const opt = new Option(placeholder, '');
      opt.disabled = true;
      opt.selected = true;
      control.append(opt);
    }
    opts.forEach((o) => control.append(new Option(o, o)));
  } else {
    control = document.createElement('input');
    if (type === 'zip') {
      control.type = 'text';
      control.inputMode = 'numeric';
      control.pattern = '\\d{5}';
      control.autocomplete = 'postal-code';
    } else {
      control.type = type;
    }
    if (type === 'email') control.autocomplete = 'email';
    if (type === 'tel') control.autocomplete = 'tel';
  }
  control.id = id;
  control.name = name;
  control.required = true;
  if (placeholder && type !== 'select') control.placeholder = placeholder;

  wrapper.append(label, control);
  return wrapper;
}

function decorateLeadForm(block) {
  const config = {};
  const form = document.createElement('form');
  form.className = 'location-selector-form';
  form.noValidate = false;

  const intro = document.createElement('div');
  intro.className = 'location-selector-intro';
  const fields = document.createElement('div');
  fields.className = 'location-selector-fields';
  const legal = document.createElement('div');
  legal.className = 'location-selector-legal';
  const actions = document.createElement('div');
  actions.className = 'location-selector-actions';

  let submitLabel = '';
  [...block.children].forEach((row) => {
    const cfg = readConfigRow(row);
    if (cfg) {
      config[cfg.key] = cfg.value;
      return;
    }
    if (isSubmitRow(row)) {
      submitLabel = cellsOf(row)[0].textContent.trim();
      return;
    }
    if (isFieldRow(row)) {
      fields.append(buildField(row));
      return;
    }
    const target = fields.children.length ? legal : intro;
    cellsOf(row).forEach((cell) => target.append(...cell.childNodes));
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button';
  submit.textContent = submitLabel || 'Submit';
  actions.append(submit);

  const status = document.createElement('p');
  status.className = 'location-selector-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  form.append(fields, legal, actions, status);

  const endpoint = config.action || config.endpoint || '';
  const successMsg = config.success || 'Thank you. We will be in touch soon.';
  const errorMsg = config.error || 'Sorry, something went wrong. Please try again later.';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = '';
    if (!endpoint) {
      // no endpoint authored: validate only, never send data
      form.classList.add('location-selector-submitted');
      status.textContent = successMsg;
      return;
    }
    submit.disabled = true;
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      form.reset();
      form.classList.add('location-selector-submitted');
      status.textContent = successMsg;
    } catch (err) {
      status.textContent = errorMsg;
    } finally {
      submit.disabled = false;
    }
  });

  const content = [];
  if (intro.childNodes.length) content.push(intro);
  content.push(form);
  block.replaceChildren(...content);
}

export default function decorate(block) {
  if (block.classList.contains('lead-form')) decorateLeadForm(block);
  else decorateLocationBar(block);
}
