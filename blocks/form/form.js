/*
 * Form block
 * Renders a native form from a spreadsheet (link to a .json field sheet) or
 * embeds a third-party form (any other link) in an iframe. Any other rows/cells
 * are treated as intro content (heading, text, advisors) shown beside or above the form.
 */

let formCount = 0;

function toId(name, idx) {
  const base = String(name || `field-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `form-${formCount}-${base || idx}`;
}

function isTrue(value) {
  return /^(true|x|yes|1)$/i.test(String(value || '').trim());
}

function getValue(fd, key) {
  const match = Object.keys(fd).find((k) => k.toLowerCase() === key.toLowerCase());
  return match ? fd[match] : '';
}

function splitOptions(value) {
  return String(value || '').split(',').map((o) => o.trim()).filter(Boolean);
}

function createLabel(fd, id) {
  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = getValue(fd, 'Label') || getValue(fd, 'Name');
  if (isTrue(getValue(fd, 'Mandatory'))) label.dataset.required = 'true';
  return label;
}

function createField(fd, idx) {
  const type = (getValue(fd, 'Type') || 'text').toLowerCase().trim();
  const name = getValue(fd, 'Name') || `field-${idx}`;
  const id = toId(name, idx);
  const required = isTrue(getValue(fd, 'Mandatory'));
  const wrapper = document.createElement('div');
  wrapper.className = `form-field form-${type.replace(/[^a-z0-9-]/g, '')}-wrapper`;

  if (type === 'heading') {
    const h = document.createElement('h3');
    h.textContent = getValue(fd, 'Label');
    wrapper.append(h);
    return wrapper;
  }
  if (type === 'plaintext') {
    const p = document.createElement('p');
    p.textContent = getValue(fd, 'Label');
    wrapper.append(p);
    return wrapper;
  }
  if (type === 'submit') {
    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'button';
    button.textContent = getValue(fd, 'Label') || 'Submit';
    wrapper.append(button);
    return wrapper;
  }

  let input;
  if (type === 'textarea') {
    input = document.createElement('textarea');
  } else if (type === 'select') {
    input = document.createElement('select');
    const placeholder = getValue(fd, 'Placeholder');
    if (placeholder) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = placeholder;
      opt.disabled = true;
      opt.selected = true;
      input.append(opt);
    }
    splitOptions(getValue(fd, 'Options')).forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      input.append(opt);
    });
  } else if (type === 'checkbox' || type === 'radio') {
    const options = splitOptions(getValue(fd, 'Options'));
    if (type === 'radio' && options.length) {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = getValue(fd, 'Label') || name;
      fieldset.append(legend);
      options.forEach((o, i) => {
        const optId = `${id}-${i}`;
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = name;
        radio.value = o;
        radio.id = optId;
        radio.required = required;
        const label = document.createElement('label');
        label.setAttribute('for', optId);
        label.textContent = o;
        fieldset.append(radio, label);
      });
      wrapper.append(fieldset);
      return wrapper;
    }
    input = document.createElement('input');
    input.type = type;
    input.value = getValue(fd, 'Value') || 'on';
    input.name = name;
    input.id = id;
    input.required = required;
    wrapper.append(input, createLabel(fd, id));
    return wrapper;
  } else {
    input = document.createElement('input');
    input.type = ['email', 'tel', 'number', 'date', 'url', 'hidden', 'file'].includes(type) ? type : 'text';
    if (getValue(fd, 'Value')) input.value = getValue(fd, 'Value');
  }

  input.name = name;
  input.id = id;
  input.required = required;
  const placeholder = getValue(fd, 'Placeholder');
  if (placeholder && type !== 'select') input.placeholder = placeholder;
  if (input.type === 'hidden') {
    wrapper.append(input);
    return wrapper;
  }
  wrapper.append(createLabel(fd, id), input);
  return wrapper;
}

function collectPayload(form) {
  const payload = {};
  [...form.elements].forEach((el) => {
    if (!el.name || el.type === 'submit' || el.disabled) return;
    if (el.type === 'checkbox') {
      if (el.checked) payload[el.name] = payload[el.name] ? `${payload[el.name]},${el.value}` : el.value;
    } else if (el.type === 'radio') {
      if (el.checked) payload[el.name] = el.value;
    } else {
      payload[el.name] = el.value;
    }
  });
  return payload;
}

async function buildNativeForm(href) {
  const url = new URL(href, window.location.href);
  let json;
  try {
    const resp = await fetch(url.pathname + url.search);
    if (!resp.ok) return null;
    json = await resp.json();
  } catch {
    return null;
  }
  const rows = json?.data || json?.[Object.keys(json || {}).find((k) => json[k]?.data)]?.data || [];
  if (!rows.length) return null;

  const form = document.createElement('form');
  form.dataset.action = url.pathname.replace(/\.json$/, '');
  const fields = document.createElement('div');
  fields.className = 'form-fields';
  rows.forEach((fd, idx) => fields.append(createField(fd, idx)));
  if (!fields.querySelector('button[type="submit"]')) {
    fields.append(createField({ Type: 'submit', Label: 'Submit' }, rows.length));
  }
  form.append(fields);

  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  form.append(status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    form.classList.remove('form-error', 'form-success');
    try {
      const res = await fetch(form.dataset.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: collectPayload(form) }),
      });
      if (!res.ok) throw new Error(res.statusText);
      form.classList.add('form-success');
      status.textContent = 'Thank you. Your submission has been received.';
      form.reset();
    } catch {
      form.classList.add('form-error');
      status.textContent = 'Something went wrong. Please try again.';
    } finally {
      if (submit) submit.disabled = false;
    }
  });
  return form;
}

function buildEmbed(href, title) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-embed';
  const iframe = document.createElement('iframe');
  iframe.src = href;
  iframe.title = title || 'Form';
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'clipboard-write');
  wrapper.append(iframe);
  return wrapper;
}

/* A row/cell is the form source when its only content is a single link. */
function findSourceLink(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const isLinkOnly = (cell) => {
    const links = cell.querySelectorAll('a[href]');
    return links.length === 1 && cell.textContent.trim() === links[0].textContent.trim();
  };
  const jsonCell = cells.find((c) => isLinkOnly(c) && /\.json(\?|$)/.test(c.querySelector('a').getAttribute('href')));
  const cell = jsonCell || [...cells].reverse().find(isLinkOnly);
  return cell ? { cell, link: cell.querySelector('a') } : null;
}

/*
 * An advisor card is an intro part that opens with a headshot (a picture on its own)
 * followed by a heading (name), title, bio and contact links. The headshot and the rest
 * are split into two wrappers so CSS can lay them out side by side.
 */
function decorateAdvisor(part) {
  const first = part.firstElementChild;
  if (!first) return;
  const isPhoto = first.matches('picture, img')
    || (first.matches('p') && first.children.length === 1
      && first.firstElementChild.matches('picture, img') && !first.textContent.trim());
  const name = first.nextElementSibling;
  if (!isPhoto || !name?.matches('h2, h3, h4')) return;
  name.classList.add('form-advisor-name');
  if (name.nextElementSibling?.matches('p')) name.nextElementSibling.classList.add('form-advisor-title');
  // the phone/email list and everything after it (the Contact link)
  let contact = part.querySelector(':scope > ul');
  while (contact) {
    contact.classList.add('form-advisor-contact');
    contact = contact.nextElementSibling;
  }
  part.querySelectorAll(':scope > p:not(.form-advisor-title, .form-advisor-contact)')
    .forEach((p) => { if (p !== first) p.classList.add('form-advisor-bio'); });
  const photo = document.createElement('div');
  photo.className = 'form-advisor-photo';
  photo.append(first);
  const info = document.createElement('div');
  info.className = 'form-advisor-info';
  info.append(...part.childNodes);
  part.classList.add('form-advisor');
  part.append(photo, info);
}

export default async function decorate(block) {
  formCount += 1;
  const source = findSourceLink(block);

  const intro = document.createElement('div');
  intro.className = 'form-intro';
  const body = document.createElement('div');
  body.className = 'form-body';

  // Intro content: every non-empty cell other than the form source.
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (source && cell === source.cell) return;
    if (!cell.textContent.trim() && !cell.querySelector('picture, img')) return;
    const part = document.createElement('div');
    part.className = 'form-intro-part';
    part.append(...cell.childNodes);
    intro.append(part);
  });

  const title = intro.querySelector('h1, h2, h3, h4')?.textContent.trim() || source?.link.textContent.trim();

  // Panelled forms (boxed-2, boxed-3) carry their own title: the last heading and
  // the copy after it sit inside the form panel; anything before stays above it.
  if (block.classList.contains('boxed-2') || block.classList.contains('boxed-3')) {
    const headings = intro.querySelectorAll(':scope > .form-intro-part > :is(h1, h2, h3, h4)');
    const heading = headings[headings.length - 1];
    if (heading) {
      const part = heading.parentElement;
      const header = document.createElement('div');
      header.className = 'form-header';
      let node = heading;
      while (node) {
        const next = node.nextSibling;
        header.append(node);
        node = next;
      }
      body.append(header);
      if (!part.textContent.trim() && !part.querySelector('picture, img')) part.remove();
    }
  }

  intro.querySelectorAll(':scope > .form-intro-part').forEach(decorateAdvisor);

  block.replaceChildren();
  if (intro.children.length) block.append(intro);
  block.append(body);
  block.classList.toggle('form-no-intro', !intro.children.length);

  if (!source) {
    block.classList.add('form-unavailable');
    return;
  }
  const href = source.link.getAttribute('href');
  if (/\.json(\?|$)/.test(href)) {
    const form = await buildNativeForm(href);
    // a missing or empty sheet leaves the intro on its own rather than a raw link
    if (form) body.append(form);
    else block.classList.add('form-unavailable');
  } else {
    body.append(buildEmbed(source.link.href, title));
  }
}
