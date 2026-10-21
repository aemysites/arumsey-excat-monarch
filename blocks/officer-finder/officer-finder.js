/*
 * Officer Finder block
 * Search for a home lending officer by location or last name.
 *
 * Search mode rows (one per mode): Label | placeholder | query parameter name
 *   e.g. "Search by location | Location | location", "Search by last name | Last name | lastName"
 *   With more than one mode a radio group switches between them.
 * Optional key/value rows:
 *   Endpoint     - JSON search endpoint; called as GET <endpoint>?<param>=<value>.
 *                  Response: an array, or { data: [...] } / { results: [...] }, of objects with
 *                  any of name, title, nmls, phone, email, url, location / city / state.
 *   Results page - page URL to navigate to with ?<param>=<value> when no Endpoint is set.
 *   Button       - search button label (default "Search").
 *   No results   - message shown when the search returns nothing.
 *   Error        - message shown when the endpoint fails or nothing is configured.
 *
 * location-input option: a single location field, no mode switch (first mode or default).
 *
 * Every search also dispatches `officer-finder:search` ({ detail: { param, value } }) on document.
 */

const CONFIG_KEYS = ['endpoint', 'results-page', 'button', 'no-results', 'error'];

function key(text) {
  return (text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function camel(text) {
  return key(text).replace(/-([a-z0-9])/g, (m, c) => c.toUpperCase());
}

let uid = 0;
function nextId(prefix) {
  uid += 1;
  return `${prefix}-${uid}`;
}

function readRows(block) {
  const config = {};
  const modes = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const k = key(cells[0].textContent);
    if (cells.length >= 2 && CONFIG_KEYS.includes(k)) {
      const link = cells[1].querySelector('a[href]');
      config[k] = link ? link.getAttribute('href') : cells[1].textContent.trim();
      return;
    }
    const label = cells[0].textContent.trim();
    if (!label) return;
    const placeholder = cells[1] ? cells[1].textContent.trim() : '';
    const param = (cells[2] && cells[2].textContent.trim())
      || camel(label.replace(/^search by\s+/i, '')) || 'q';
    modes.push({ label, placeholder: placeholder || label.replace(/^search by\s+/i, ''), param });
  });
  return { config, modes };
}

function toList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.results)) return json.results;
  return [];
}

function renderOfficer(officer) {
  const li = document.createElement('li');
  li.className = 'officer-finder-result';
  const name = document.createElement('p');
  name.className = 'officer-finder-name';
  if (officer.url) {
    const a = document.createElement('a');
    a.href = officer.url;
    a.textContent = officer.name || officer.url;
    name.append(a);
  } else {
    name.textContent = officer.name || '';
  }
  li.append(name);

  const place = officer.location || [officer.city, officer.state].filter(Boolean).join(', ');
  [
    ['title', officer.title],
    ['nmls', officer.nmls ? `NMLS# ${officer.nmls}` : ''],
    ['location', place],
  ].forEach(([cls, value]) => {
    if (!value) return;
    const p = document.createElement('p');
    p.className = `officer-finder-${cls}`;
    p.textContent = value;
    li.append(p);
  });

  if (officer.phone) {
    const a = document.createElement('a');
    a.className = 'officer-finder-phone';
    a.href = `tel:${String(officer.phone).replace(/[^\d+]/g, '')}`;
    a.textContent = officer.phone;
    li.append(a);
  }
  if (officer.email) {
    const a = document.createElement('a');
    a.className = 'officer-finder-email';
    a.href = `mailto:${officer.email}`;
    a.textContent = officer.email;
    li.append(a);
  }
  return li;
}

export default function decorate(block) {
  const { config, modes: authoredModes } = readRows(block);
  const locationOnly = block.classList.contains('location-input');

  let modes = authoredModes.length
    ? authoredModes
    : [{ label: 'Search by location', placeholder: 'Location', param: 'location' }];
  if (locationOnly) {
    const loc = modes.find((m) => /location|zip|city/i.test(`${m.param} ${m.label}`));
    modes = [loc || modes[0]];
  }

  const form = document.createElement('form');
  form.className = 'officer-finder-form';
  form.setAttribute('role', 'search');

  const groupName = nextId('officer-finder-mode');
  const inputs = [];

  if (modes.length > 1) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'officer-finder-modes';
    const legend = document.createElement('legend');
    legend.className = 'officer-finder-legend';
    legend.textContent = 'Search type';
    fieldset.append(legend);
    modes.forEach((mode, i) => {
      const id = nextId('officer-finder-radio');
      const wrap = document.createElement('div');
      wrap.className = 'officer-finder-mode';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = groupName;
      radio.id = id;
      radio.value = String(i);
      radio.checked = i === 0;
      const label = document.createElement('label');
      label.htmlFor = id;
      label.textContent = mode.label;
      wrap.append(radio, label);
      fieldset.append(wrap);
    });
    form.append(fieldset);
  }

  const fields = document.createElement('div');
  fields.className = 'officer-finder-fields';
  modes.forEach((mode, i) => {
    const id = nextId('officer-finder-input');
    const wrap = document.createElement('div');
    wrap.className = 'officer-finder-field';
    wrap.hidden = i !== 0;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.className = 'officer-finder-label';
    label.textContent = mode.placeholder;
    const input = document.createElement('input');
    input.type = 'search';
    input.id = id;
    input.name = mode.param;
    input.placeholder = mode.placeholder;
    input.required = i === 0;
    input.disabled = i !== 0;
    if (/location|zip|city/i.test(mode.param)) input.autocomplete = 'postal-code';
    wrap.append(label, input);
    fields.append(wrap);
    inputs.push(input);
  });
  form.append(fields);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button';
  button.textContent = config.button || 'Search';
  form.append(button);

  const status = document.createElement('p');
  status.className = 'officer-finder-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const results = document.createElement('ul');
  results.className = 'officer-finder-results';

  let active = 0;
  form.addEventListener('change', (e) => {
    if (e.target.name !== groupName) return;
    active = Number(e.target.value);
    inputs.forEach((input, i) => {
      input.closest('.officer-finder-field').hidden = i !== active;
      input.disabled = i !== active;
      input.required = i === active;
    });
    inputs[active].focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const { param } = modes[active];
    const value = inputs[active].value.trim();
    document.dispatchEvent(new CustomEvent('officer-finder:search', { detail: { param, value } }));
    results.replaceChildren();
    status.textContent = '';

    if (config.endpoint) {
      button.disabled = true;
      try {
        const url = new URL(config.endpoint, window.location.href);
        url.searchParams.set(param, value);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const list = toList(await resp.json());
        if (!list.length) {
          status.textContent = config['no-results'] || 'No lending officers found. Try another search.';
        } else {
          results.append(...list.map(renderOfficer));
        }
      } catch (err) {
        status.textContent = config.error || 'Search is unavailable right now. Please try again later.';
      } finally {
        button.disabled = false;
      }
      return;
    }

    if (config['results-page']) {
      const url = new URL(config['results-page'], window.location.href);
      url.searchParams.set(param, value);
      window.location.assign(url.href);
      return;
    }

    status.textContent = config.error || 'Search is unavailable right now. Please try again later.';
  });

  block.replaceChildren(form, status, results);
}
