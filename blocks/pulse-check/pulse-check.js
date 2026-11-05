/*
 * Pulse Check block
 * Multi-step self-assessment questionnaire with step tabs and Previous / Next / Finish.
 *
 * Rows:
 *   <step title> | <intro + numbered statements, or a .json field sheet link> | [image]
 *   Scale   | Strongly agree, Agree, Unsure, Disagree, Strongly disagree   (first = highest score)
 *   Submit  | link to the endpoint answers are POSTed to (optional)
 *   Results | content shown after Finish; {score} and {max} are replaced
 */

const CONFIG_KEYS = ['scale', 'submit', 'results'];
const DEFAULT_SCALE = ['Strongly agree', 'Agree', 'Unsure', 'Disagree', 'Strongly disagree'];
let instance = 0;

function cellText(cell) {
  return cell ? cell.textContent.replace(/\s+/g, ' ').trim() : '';
}

function fieldValue(fd, key) {
  const k = Object.keys(fd).find((x) => x.toLowerCase() === key);
  return k ? String(fd[k] ?? '').trim() : '';
}

function buildRating(statement, qIndex, scale) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'pulse-check-question';
  const legend = document.createElement('legend');
  legend.append(...statement.childNodes);
  fieldset.append(legend);
  const choices = document.createElement('div');
  choices.className = 'pulse-check-choices';
  const name = `q${qIndex}`;
  scale.forEach((label, i) => {
    const id = `pulse-check-${instance}-${name}-${i}`;
    const wrap = document.createElement('div');
    wrap.className = 'pulse-check-choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.id = id;
    input.value = String(scale.length - i);
    input.required = true;
    const lab = document.createElement('label');
    lab.setAttribute('for', id);
    lab.textContent = label;
    wrap.append(input, lab);
    choices.append(wrap);
  });
  fieldset.append(choices);
  return fieldset;
}

function buildField(fd, idx) {
  const type = (fieldValue(fd, 'type') || 'text').toLowerCase();
  const name = fieldValue(fd, 'name') || `field${idx}`;
  const id = `pulse-check-${instance}-${name}`;
  const required = /^(true|x|yes|1)$/i.test(fieldValue(fd, 'mandatory'));
  const wrap = document.createElement('div');
  wrap.className = `pulse-check-field pulse-check-field-${type.replace(/[^a-z]/g, '')}`;
  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = fieldValue(fd, 'label') || name;
  if (required) label.dataset.required = 'true';

  let input;
  if (type === 'select') {
    input = document.createElement('select');
    input.append(document.createElement('option'));
    const options = fieldValue(fd, 'options').split(',').map((o) => o.trim());
    options.filter(Boolean).forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      input.append(opt);
    });
  } else if (type === 'textarea') {
    input = document.createElement('textarea');
  } else {
    input = document.createElement('input');
    input.type = ['email', 'tel', 'number', 'checkbox', 'hidden'].includes(type) ? type : 'text';
    if (type === 'checkbox') input.value = fieldValue(fd, 'value') || 'yes';
  }
  input.id = id;
  input.name = name;
  input.required = required;
  if (input.type === 'hidden') {
    input.value = fieldValue(fd, 'value');
    wrap.append(input);
  } else if (input.type === 'checkbox') wrap.append(input, label);
  else wrap.append(label, input);
  return wrap;
}

async function buildFieldSheet(link) {
  const container = document.createElement('div');
  container.className = 'pulse-check-fields';
  try {
    const url = new URL(link.getAttribute('href'), window.location.href);
    const resp = await fetch(url.pathname + url.search);
    if (!resp.ok) throw new Error(resp.statusText);
    const json = await resp.json();
    (json.data || []).forEach((fd, i) => container.append(buildField(fd, i)));
  } catch {
    container.append(link);
  }
  return container;
}

async function buildStep(row, stepIndex, scale, counter) {
  const [titleCell, contentCell, mediaCell] = [...row.children];
  const panel = document.createElement('div');
  panel.className = 'pulse-check-step';
  panel.id = `pulse-check-${instance}-step-${stepIndex}`;
  panel.setAttribute('role', 'tabpanel');

  const title = document.createElement('h3');
  title.className = 'pulse-check-step-title';
  title.textContent = cellText(titleCell) || `Step ${stepIndex + 1}`;
  panel.append(title);

  const body = document.createElement('div');
  body.className = 'pulse-check-step-body';
  if (contentCell) {
    // copy before the statements is the step intro, shown full width above statements and image
    const children = [...contentCell.children];
    const firstList = children.findIndex((el) => el.tagName === 'OL');
    if (firstList > 0) {
      const intro = document.createElement('div');
      intro.className = 'pulse-check-step-intro';
      intro.append(...children.splice(0, firstList));
      panel.append(intro);
    }
    // numbered list items become rating statements; everything else stays as copy
    children.forEach((el) => {
      if (el.tagName === 'OL') {
        [...el.children].forEach((li) => {
          counter.count += 1;
          body.append(buildRating(li, counter.count, scale));
        });
      } else {
        body.append(el);
      }
    });
    const sheetLink = [...body.querySelectorAll('a[href]')]
      .find((a) => /\.json(\?|$)/.test(a.getAttribute('href')));
    if (sheetLink) {
      const holder = sheetLink.closest('p') || sheetLink;
      holder.replaceWith(await buildFieldSheet(sheetLink));
    }
  }
  const content = document.createElement('div');
  content.className = 'pulse-check-step-content';
  content.append(body);
  panel.append(content);

  if (mediaCell && (mediaCell.querySelector('picture, img') || cellText(mediaCell))) {
    const aside = document.createElement('div');
    aside.className = 'pulse-check-step-media';
    aside.append(...mediaCell.childNodes);
    content.append(aside);
    panel.classList.add('pulse-check-step-has-media');
  }
  return { panel, title: title.textContent };
}

function collect(form) {
  const data = {};
  let score = 0;
  let max = 0;
  const seen = new Set();
  [...form.elements].forEach((el) => {
    if (!el.name) return;
    if (el.type === 'radio') {
      if (!seen.has(el.name)) {
        seen.add(el.name);
        max += Math.max(...[...form.querySelectorAll(`input[name="${el.name}"]`)].map((r) => Number(r.value) || 0));
      }
      if (el.checked) {
        data[el.name] = el.value;
        score += Number(el.value) || 0;
      }
    } else if (el.type === 'checkbox') {
      if (el.checked) data[el.name] = el.value;
    } else if (el.tagName !== 'BUTTON') {
      data[el.name] = el.value;
    }
  });
  data.score = String(score);
  return { data, score, max };
}

export default async function decorate(block) {
  instance += 1;
  const rows = [...block.children];
  const config = {};
  const stepRows = [];
  rows.forEach((row) => {
    const key = cellText(row.children[0]).toLowerCase().replace(/[^a-z]/g, '');
    if (CONFIG_KEYS.includes(key) && row.children.length > 1) {
      [, config[key]] = row.children;
    } else if (row.children.length) stepRows.push(row);
  });

  const scaleText = cellText(config.scale);
  const scale = scaleText ? scaleText.split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_SCALE;

  const form = document.createElement('form');
  form.className = 'pulse-check-form';
  form.noValidate = true;
  const tabs = document.createElement('ol');
  tabs.className = 'pulse-check-tabs';
  tabs.setAttribute('role', 'tablist');
  const panels = document.createElement('div');
  panels.className = 'pulse-check-panels';

  const counter = { count: 0 };
  const steps = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [i, row] of stepRows.entries()) {
    // eslint-disable-next-line no-await-in-loop
    steps.push(await buildStep(row, i, scale, counter));
  }
  if (!steps.length) return;

  steps.forEach(({ panel, title }, i) => {
    const li = document.createElement('li');
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'pulse-check-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    tab.dataset.step = i;
    tab.innerHTML = `<span class="pulse-check-tab-number">${i + 1}.</span> `;
    tab.append(title);
    li.append(tab);
    tabs.append(li);
    panels.append(panel);
  });

  const actions = document.createElement('div');
  actions.className = 'pulse-check-actions';
  const mkButton = (label, cls, type = 'button') => {
    const b = document.createElement('button');
    b.type = type;
    b.className = `button pulse-check-${cls}`;
    b.textContent = label;
    return b;
  };
  const fr = document.documentElement.lang?.startsWith('fr');
  const prev = mkButton(fr ? 'Précédent' : 'Previous', 'prev');
  const next = mkButton(fr ? 'Suivant' : 'Next', 'next');
  const finish = mkButton(fr ? 'Terminer' : 'Finish', 'finish', 'submit');
  actions.append(prev, next, finish);

  const status = document.createElement('div');
  status.className = 'pulse-check-results';
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;

  let current = 0;
  let reached = 0;
  const show = (idx) => {
    current = Math.max(0, Math.min(idx, steps.length - 1));
    reached = Math.max(reached, current);
    steps.forEach(({ panel }, i) => { panel.hidden = i !== current; });
    [...tabs.querySelectorAll('.pulse-check-tab')].forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === current);
      tab.disabled = i > reached;
      tab.closest('li').classList.toggle('current', i === current);
      tab.closest('li').classList.toggle('done', i < current);
    });
    prev.disabled = current === 0;
    next.hidden = current === steps.length - 1;
    finish.hidden = current !== steps.length - 1;
  };
  const stepValid = (idx) => {
    const fields = [...steps[idx].panel.querySelectorAll('input, select, textarea')];
    const invalid = fields.find((f) => !f.checkValidity());
    steps[idx].panel.classList.toggle('pulse-check-invalid', !!invalid);
    if (invalid) {
      invalid.reportValidity();
      return false;
    }
    return true;
  };

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => { if (stepValid(current)) show(current + 1); });
  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.pulse-check-tab');
    if (tab && !tab.disabled) show(Number(tab.dataset.step));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!stepValid(current)) return;
    const { data, score, max } = collect(form);
    finish.disabled = true;
    const endpoint = config.submit?.querySelector('a[href]')?.getAttribute('href');
    if (endpoint) {
      try {
        await fetch(endpoint.replace(/\.json$/, ''), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });
      } catch {
        // submission failure does not block showing the result
      }
    }
    status.replaceChildren();
    if (config.results) {
      const html = config.results.innerHTML
        .replaceAll('{score}', String(score))
        .replaceAll('{max}', String(max));
      status.innerHTML = html;
    } else {
      const p = document.createElement('p');
      p.textContent = `${score} / ${max}`;
      status.append(p);
    }
    status.hidden = false;
    form.hidden = true;
    block.classList.add('pulse-check-complete');
  });

  form.append(tabs, panels, actions);
  block.replaceChildren(form, status);
  show(0);
}
