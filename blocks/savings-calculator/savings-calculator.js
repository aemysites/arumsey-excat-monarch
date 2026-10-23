/**
 * savings-calculator: S Corp self-employment tax savings estimate.
 *
 * Authored rows, keyed by the first cell (any row may be missing):
 *   Intro   | heading + description
 *   Field   | label | help text (optional) | key (optional)
 *   Button  | Calculate
 *   Result  | result heading | disclaimer text
 *   CTA     | heading, text and a link (rendered as a button)
 *   Wage base | 184500   (optional Social Security wage base override)
 * Unkeyed rows: the first becomes the intro, rows with a short label cell
 * become fields, the rest are appended to the CTA panel.
 *
 * Field keys (or field order when no key is given):
 *   net-income, salary, w2-income, w2-ss-withheld, other-se-income
 *
 * The estimate ports the source calculator (hrblock.com
 * businesstaxsavingscalculator clientlib) formula one to one.
 */

const FIELD_KEYS = ['net-income', 'salary', 'w2-income', 'w2-ss-withheld', 'other-se-income'];
const DEFAULT_WAGE_BASE = 184500;
const MAX_AMOUNT = 10000000;
const SE_FACTOR = 0.9235; // net earnings from self-employment
const SS_RATE = 0.124; // Social Security, employer + employee
const MEDICARE_RATE = 0.029; // Medicare, employer + employee
const EMPLOYEE_SS_RATE = 0.062;
const DEFAULT_SALARY_SHARE = 0.6;
const MIN_SE_EARNINGS = 400;

const PLACEHOLDERS = {
  'net-income': '$ 00,000',
  salary: '$ 00,000',
};

const ERRORS = {
  'net-income': 'Cannot be less than 1 or greater than 10,000,000',
  salary: 'Cannot be less than 0 or greater than 10,000,000',
  'w2-income': 'Cannot be less than 0 or greater than 10,000,000',
  'w2-ss-withheld': 'Cannot be less than 0 or greater than Other W2 Annual Income',
  'other-se-income': 'Cannot be less than -10,000,000 or greater than 10,000,000',
};

const HELP_ICON = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="6" height="8" viewBox="0 0 6 8" fill="none"><path d="M5.133 2.4A2.333 2.333 0 0 0 .467 2.4a.467.467 0 0 0 .933 0 1.4 1.4 0 1 1 1.4 1.4.467.467 0 0 0-.467.467V5.2a.467.467 0 0 0 .934 0v-.513A2.333 2.333 0 0 0 5.133 2.4Z" fill="currentColor"/><circle cx="2.8" cy="6.833" r=".5" fill="currentColor"/></svg>';
const ERROR_ICON = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14.4" height="14.4" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="2"/><rect x="7.2" y="4" width="1.6" height="5.6" rx=".8" fill="currentColor"/><circle cx="8" cy="11.2" r=".8" fill="currentColor"/></svg>';

let idCounter = 0;

function toSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Parses "$-12,345" style input; returns NaN for empty input. */
function parseAmount(value) {
  const cleaned = String(value || '').replace(/[$,\s]/g, '');
  if (!cleaned || cleaned === '-') return NaN;
  return Number(cleaned);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * Estimated yearly savings of an S Corp election versus sole proprietorship
 * self-employment tax. Mirrors the source calculator.
 * @param {Object} values amounts keyed by field key
 * @param {number} wageBase Social Security wage base
 */
export function estimateSavings(values, wageBase = DEFAULT_WAGE_BASE) {
  const v = (key) => (Number.isFinite(values[key]) ? values[key] : 0);
  const net = v('net-income');
  const otherSe = v('other-se-income');
  const w2 = v('w2-income');
  const salaryInput = v('salary');
  const withheldInput = v('w2-ss-withheld');
  const maxSs = EMPLOYEE_SS_RATE * wageBase;
  const maxSsCombined = SS_RATE * wageBase;

  const salary = salaryInput !== 0 ? salaryInput : DEFAULT_SALARY_SHARE * net;
  const w2Withheld = withheldInput > 0 ? withheldInput : Math.min(EMPLOYEE_SS_RATE * w2, maxSs);

  // self-employment tax as a sole proprietor
  const seBase = SE_FACTOR * (net + otherSe);
  let ssWithout = 0;
  if (w2 <= wageBase) {
    ssWithout = wageBase - w2 > seBase ? seBase * SS_RATE : SS_RATE * (wageBase - w2);
  }
  const withoutScorp = MEDICARE_RATE * seBase + ssWithout;

  // payroll tax on the S Corp salary
  let payroll;
  if (salaryInput > 0) {
    payroll = salaryInput > wageBase
      ? maxSsCombined + MEDICARE_RATE * salaryInput
      : (SS_RATE + MEDICARE_RATE) * salaryInput;
  } else {
    const defaultSalary = DEFAULT_SALARY_SHARE * net;
    payroll = defaultSalary > wageBase
      ? maxSsCombined + MEDICARE_RATE * defaultSalary
      : defaultSalary * (SS_RATE + MEDICARE_RATE);
  }

  // self-employment tax still due on other self-employed income
  const otherSeBase = SE_FACTOR * otherSe >= MIN_SE_EARNINGS ? SE_FACTOR * otherSe : 0;
  const ssRoom = Math.max(0, wageBase - w2 - salary);
  const otherSeTax = SS_RATE * Math.min(otherSeBase, ssRoom) + MEDICARE_RATE * otherSeBase;

  // excess employee Social Security withheld across W2 jobs is refunded
  const employeeSs = (salary >= wageBase ? maxSs : EMPLOYEE_SS_RATE * salary) + w2Withheld;
  const excessSs = employeeSs > maxSs ? employeeSs - maxSs : 0;

  return withoutScorp - (payroll + otherSeTax - excessSs);
}

function keyOf(row) {
  const first = row.children[0];
  if (!first || row.children.length < 2) return '';
  const text = first.textContent.trim().toLowerCase();
  return ['intro', 'field', 'button', 'result', 'cta', 'wage base'].includes(text) ? text : '';
}

function moveContent(from, to) {
  if (!from) return;
  if (from.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol, div')) {
    to.append(...from.childNodes);
  } else if (from.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...from.childNodes);
    to.append(p);
  }
}

function buildField(label, help, key) {
  idCounter += 1;
  const id = `savings-calculator-${key}-${idCounter}`;
  const errorId = `${id}-error`;
  const wrap = document.createElement('div');
  wrap.className = `savings-calculator-field savings-calculator-field-${key}`;

  const control = document.createElement('div');
  control.className = 'savings-calculator-control';
  const lbl = document.createElement('label');
  lbl.htmlFor = id;
  lbl.textContent = label;
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = key === 'other-se-income' ? 'text' : 'numeric';
  input.id = id;
  input.name = key;
  input.placeholder = PLACEHOLDERS[key] || '$ 0,000';
  input.autocomplete = 'off';
  control.append(lbl, input);

  const describedBy = [errorId];
  if (help && help.textContent.trim()) {
    const helpId = `${id}-help`;
    const helpWrap = document.createElement('div');
    helpWrap.className = 'savings-calculator-help-wrap';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'savings-calculator-help-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', helpId);
    toggle.setAttribute('aria-label', `More information about ${label.replace(/\s*\(optional\)\s*$/i, '')}`);
    toggle.innerHTML = HELP_ICON;
    const tip = document.createElement('div');
    tip.className = 'savings-calculator-help';
    tip.id = helpId;
    tip.setAttribute('role', 'tooltip');
    tip.append(...help.childNodes);
    helpWrap.append(toggle, tip);
    control.append(helpWrap);
    describedBy.unshift(helpId);
  }
  input.setAttribute('aria-describedby', describedBy.join(' '));

  const error = document.createElement('p');
  error.className = 'savings-calculator-error';
  error.id = errorId;
  error.hidden = true;
  error.innerHTML = ERROR_ICON;
  error.append(ERRORS[key] || ERRORS.salary);

  wrap.append(control, error);
  return {
    wrap, control, input, error, key,
  };
}

/** Keeps "$" + grouped digits; other self-employed income may be negative. */
function formatInput(input, allowNegative) {
  const raw = input.value;
  const negative = allowNegative && /^\$?\s*-/.test(raw);
  const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (!digits) {
    input.value = negative ? '$-' : (raw.trim() && '$');
    return;
  }
  input.value = `$${negative ? '-' : ''}${Number(digits).toLocaleString('en-US')}`;
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'savings-calculator-intro';
  const cta = document.createElement('div');
  cta.className = 'savings-calculator-cta';
  const fields = [];
  let buttonText = 'Calculate';
  let resultHeading = null;
  let disclaimer = null;
  let wageBase = DEFAULT_WAGE_BASE;

  [...block.children].forEach((row) => {
    const key = keyOf(row);
    const cells = [...row.children];
    const rest = key ? cells.slice(1) : cells;
    if (!rest.some((c) => c.textContent.trim() || c.querySelector('picture'))) return;

    let kind = key;
    if (!kind) {
      const first = rest[0];
      const isShortLabel = first.textContent.trim().length < 80
        && !first.querySelector('h1, h2, h3, h4, h5, h6, a, picture');
      if (!intro.childNodes.length && !fields.length) kind = 'intro';
      else if (isShortLabel && !resultHeading) kind = 'field';
      else kind = 'cta';
    }

    if (kind === 'intro') {
      rest.forEach((c) => moveContent(c, intro));
    } else if (kind === 'field') {
      const label = rest[0].textContent.trim();
      const fieldKey = toSlug(rest[2]?.textContent || '') || FIELD_KEYS[fields.length] || `field-${fields.length}`;
      fields.push(buildField(label, rest[1] || null, fieldKey));
    } else if (kind === 'button') {
      buttonText = rest[0].textContent.trim() || buttonText;
    } else if (kind === 'result') {
      [resultHeading, disclaimer] = rest;
    } else if (kind === 'wage base') {
      wageBase = parseAmount(rest[0].textContent) || wageBase;
    } else {
      rest.forEach((c) => moveContent(c, cta));
    }
  });

  const byKey = Object.fromEntries(fields.map((f) => [f.key, f]));

  const form = document.createElement('form');
  form.className = 'savings-calculator-form';
  form.noValidate = true;
  const grid = document.createElement('div');
  grid.className = 'savings-calculator-fields';
  fields.forEach((f) => grid.append(f.wrap));
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary savings-calculator-submit';
  submit.textContent = buttonText;
  form.append(grid, submit);

  const isInvalid = (f) => {
    const n = parseAmount(f.input.value);
    if (Number.isNaN(n)) return false;
    if (f.key === 'other-se-income') return n < -MAX_AMOUNT || n > MAX_AMOUNT;
    if (f.key === 'w2-ss-withheld') {
      const w2 = byKey['w2-income'] ? parseAmount(byKey['w2-income'].input.value) : NaN;
      return n < 0 || (!Number.isNaN(w2) && n > w2) || n > MAX_AMOUNT;
    }
    return n < 0 || n > MAX_AMOUNT;
  };

  const validate = () => {
    let ok = true;
    fields.forEach((f) => {
      const invalid = isInvalid(f);
      f.error.hidden = !invalid;
      f.control.classList.toggle('invalid', invalid);
      f.input.setAttribute('aria-invalid', String(invalid));
      if (invalid) ok = false;
    });
    const required = byKey['net-income'] || fields[0];
    const requiredValue = required ? parseAmount(required.input.value) : NaN;
    submit.disabled = !ok || !(requiredValue > 0);
  };

  fields.forEach((f) => {
    const allowNegative = f.key === 'other-se-income';
    f.input.addEventListener('focus', () => { if (!f.input.value) f.input.value = '$'; });
    f.input.addEventListener('blur', () => {
      if (f.input.value === '$' || f.input.value === '$-') f.input.value = '';
    });
    f.input.addEventListener('input', () => {
      formatInput(f.input, allowNegative);
      validate();
    });
  });
  validate();

  const result = document.createElement('div');
  result.className = 'savings-calculator-result';
  const heading = document.createElement('h3');
  heading.className = 'savings-calculator-result-heading';
  if (resultHeading) {
    const inner = resultHeading.querySelector('h1, h2, h3, h4, h5, h6, p');
    heading.append(...(inner || resultHeading).childNodes);
  }
  if (heading.textContent.trim()) result.append(heading);
  const amount = document.createElement('p');
  amount.className = 'savings-calculator-amount';
  amount.setAttribute('role', 'status');
  amount.setAttribute('aria-live', 'polite');
  amount.setAttribute('aria-atomic', 'true');
  amount.textContent = formatCurrency(0);
  result.append(amount);
  if (disclaimer) {
    const d = document.createElement('div');
    d.className = 'savings-calculator-disclaimer';
    moveContent(disclaimer, d);
    result.append(d);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    validate();
    if (submit.disabled) return;
    const values = {};
    fields.forEach((f) => { values[f.key] = parseAmount(f.input.value); });
    amount.textContent = formatCurrency(estimateSavings(values, wageBase));
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // help tooltips: one open at a time, Escape or an outside click closes
  const toggles = [...form.querySelectorAll('.savings-calculator-help-toggle')];
  const closeAll = (except) => toggles.forEach((t) => {
    if (t !== except) t.setAttribute('aria-expanded', 'false');
  });
  form.addEventListener('click', (e) => {
    const t = e.target.closest('.savings-calculator-help-toggle');
    if (!t) return;
    const open = t.getAttribute('aria-expanded') === 'true';
    closeAll(t);
    t.setAttribute('aria-expanded', String(!open));
  });
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const t = e.target.closest('.savings-calculator-help-wrap')?.querySelector('.savings-calculator-help-toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.savings-calculator-help-wrap')) closeAll();
  });

  const calc = document.createElement('div');
  calc.className = 'savings-calculator-main';
  if (intro.childNodes.length) calc.append(intro);
  if (fields.length) calc.append(form);

  const aside = document.createElement('div');
  aside.className = 'savings-calculator-aside';
  if (fields.length) aside.append(result);
  if (cta.childNodes.length) aside.append(cta);

  const layout = document.createElement('div');
  layout.className = 'savings-calculator-layout';
  layout.append(calc);
  if (aside.children.length) layout.append(aside);
  block.replaceChildren(layout);
}
