/*
 * Refinance Calculator block (cash-out refinance)
 *
 * Authoring: key/value rows. Values are defaults; an optional third cell is help text.
 *   Home value          | 550000
 *   Mortgage balance    | 280000
 *   Cash-out amount     | 80000
 *   Loan terms          | 30-Year Fixed, 20-Year Fixed, 15-Year Fixed
 *                         (years are read from each label)
 *   Interest rate       | 7.375
 *   LTV                 | 80        (max loan-to-value %, default 80)
 *   Minimum cash-out    | 15000     (default 15000)
 *   Closing cost        | 2         (percent of the new loan amount, default 2)
 *   Button              | Calculate My Cash-Out Refinance
 *   Result title        | Estimated Cash-Out Amount
 * Any row that is not a known key is rich text: rows before the first key row render above
 * the form, rows after render below it (e.g. "Data entered here may be stored locally...").
 * Labels for the fields come from the first cell, so authors can rename them.
 */

const FIELDS = {
  'home-value': { label: 'Current Home Value', value: 550000, kind: 'money' },
  'mortgage-balance': { label: 'Balance Left On Mortgage', value: 280000, kind: 'money' },
  'cash-out-amount': { label: 'Cash-Out Amount', value: 80000, kind: 'money' },
  'loan-terms': { label: 'New Loan Term', value: '30-Year Fixed, 20-Year Fixed, 15-Year Fixed', kind: 'select' },
  'interest-rate': { label: 'Interest Rate', value: 7.375, kind: 'percent' },
};
const SETTINGS = {
  ltv: 80,
  'minimum-cash-out': 15000,
  'closing-cost': 2,
  button: 'Calculate My Cash-Out Refinance',
  'result-title': 'Estimated Cash-Out Amount',
};
const ALIASES = {
  'current-home-value': 'home-value',
  'balance-left-on-mortgage': 'mortgage-balance',
  balance: 'mortgage-balance',
  'cash-out': 'cash-out-amount',
  'new-loan-term': 'loan-terms',
  'loan-term': 'loan-terms',
  rate: 'interest-rate',
  'loan-to-value': 'ltv',
  'min-cash-out': 'minimum-cash-out',
  'closing-costs': 'closing-cost',
  'button-label': 'button',
};

const CLOSING_OPTIONS = [
  { id: 'closing', label: 'Pay at Closing', note: "You'll pay your estimated closing cost at closing time." },
  { id: 'loan', label: 'Add to Loan', note: 'Your estimated closing cost is added to your new loan amount.' },
  { id: 'cash', label: 'Take from Cash-Out Amount', note: 'Your estimated closing cost is deducted from your cash-out amount.' },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const money2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

function key(text) {
  const k = (text || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return ALIASES[k] || k;
}

function num(value) {
  const n = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

let uid = 0;
function nextId(name) {
  uid += 1;
  return `refinance-calculator-${name}-${uid}`;
}

function readBlock(block) {
  const fields = Object.fromEntries(Object.entries(FIELDS).map(([k, v]) => [k, { ...v }]));
  const settings = { ...SETTINGS };
  const before = [];
  const after = [];
  let seenKey = false;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const k = cells.length >= 2 ? key(cells[0].textContent) : '';
    if (fields[k]) {
      seenKey = true;
      fields[k].label = cells[0].textContent.trim() || fields[k].label;
      if (cells[1].textContent.trim()) fields[k].value = cells[1].textContent.trim();
      if (cells[2] && cells[2].textContent.trim()) fields[k].help = cells[2].textContent.trim();
    } else if (k in settings) {
      seenKey = true;
      if (cells[1].textContent.trim()) settings[k] = cells[1].textContent.trim();
    } else {
      const target = seenKey ? after : before;
      cells.forEach((cell) => target.push(...cell.childNodes));
    }
  });
  return {
    fields, settings, before, after,
  };
}

function buildInput(name, field) {
  const id = nextId(name);
  const wrap = document.createElement('div');
  wrap.className = `refinance-calculator-field refinance-calculator-field-${field.kind}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = field.label;
  wrap.append(label);

  let control;
  if (field.kind === 'select') {
    control = document.createElement('select');
    const terms = String(field.value).split(',').map((t) => t.trim()).filter(Boolean);
    terms.forEach((term) => {
      const years = num(term) || 30;
      control.append(new Option(term, String(years)));
    });
  } else {
    control = document.createElement('input');
    control.type = 'text';
    control.inputMode = 'decimal';
    control.value = field.kind === 'money'
      ? num(field.value).toLocaleString('en-US')
      : String(num(field.value));
  }
  control.id = id;
  control.name = name;

  const box = document.createElement('div');
  box.className = 'refinance-calculator-input';
  if (field.kind === 'money') {
    const prefix = document.createElement('span');
    prefix.className = 'refinance-calculator-prefix';
    prefix.textContent = '$';
    box.append(prefix);
  }
  box.append(control);
  if (field.kind === 'percent') {
    const suffix = document.createElement('span');
    suffix.className = 'refinance-calculator-suffix';
    suffix.textContent = '%';
    box.append(suffix);
  }
  wrap.append(box);

  if (field.help) {
    const help = document.createElement('p');
    help.className = 'refinance-calculator-help';
    help.id = `${id}-help`;
    help.textContent = field.help;
    control.setAttribute('aria-describedby', help.id);
    wrap.append(help);
  }
  return { wrap, control };
}

function monthlyPayment(principal, annualRate, years) {
  const n = years * 12;
  if (n <= 0 || principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
}

function stat(label) {
  const el = document.createElement('div');
  el.className = 'refinance-calculator-stat';
  const l = document.createElement('p');
  l.className = 'refinance-calculator-stat-label';
  l.textContent = label;
  const v = document.createElement('p');
  v.className = 'refinance-calculator-stat-value';
  el.append(l, v);
  return { el, value: v };
}

export default function decorate(block) {
  const {
    fields, settings, before, after,
  } = readBlock(block);
  const ltv = num(settings.ltv) || 80;
  const minCash = num(settings['minimum-cash-out']);
  const closingPct = num(settings['closing-cost']);

  /* form */
  const form = document.createElement('form');
  form.className = 'refinance-calculator-form';
  const controls = {};
  Object.entries(fields).forEach(([name, field]) => {
    const { wrap, control } = buildInput(name, field);
    controls[name] = control;
    form.append(wrap);
  });
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button';
  submit.textContent = settings.button;
  form.append(submit);
  if (after.length) {
    const note = document.createElement('div');
    note.className = 'refinance-calculator-note';
    note.append(...after);
    form.append(note);
  }

  /* results */
  const results = document.createElement('div');
  results.className = 'refinance-calculator-results';
  results.setAttribute('aria-live', 'polite');

  const summary = document.createElement('div');
  summary.className = 'refinance-calculator-summary';
  const title = document.createElement('p');
  title.className = 'refinance-calculator-summary-title';
  title.textContent = settings['result-title'];
  const amount = document.createElement('p');
  amount.className = 'refinance-calculator-amount';
  const basis = document.createElement('p');
  basis.className = 'refinance-calculator-basis';
  basis.textContent = `Based on ${ltv}% loan-to-value ratio`;
  summary.append(title, amount, basis);

  const detail = document.createElement('div');
  detail.className = 'refinance-calculator-detail';
  const explain = document.createElement('p');
  explain.className = 'refinance-calculator-explain';

  const sliderId = nextId('slider');
  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'refinance-calculator-slider';
  const sliderLabel = document.createElement('label');
  sliderLabel.htmlFor = sliderId;
  sliderLabel.className = 'refinance-calculator-slider-value';
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = sliderId;
  slider.step = '1000';
  const range = document.createElement('div');
  range.className = 'refinance-calculator-range';
  const rangeMin = document.createElement('span');
  const rangeMax = document.createElement('span');
  range.append(rangeMin, rangeMax);
  sliderWrap.append(sliderLabel, slider, range);

  const closing = document.createElement('div');
  closing.className = 'refinance-calculator-closing';
  const closingGroup = document.createElement('div');
  closingGroup.className = 'refinance-calculator-closing-options';
  closingGroup.setAttribute('role', 'radiogroup');
  closingGroup.setAttribute('aria-label', 'Closing costs');
  const closingNote = document.createElement('p');
  closingNote.className = 'refinance-calculator-closing-note';
  let closingMode = CLOSING_OPTIONS[0].id;
  const closingButtons = CLOSING_OPTIONS.map((opt) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'radio');
    b.dataset.mode = opt.id;
    b.textContent = opt.label;
    closingGroup.append(b);
    return b;
  });
  closing.append(closingGroup, closingNote);

  const stats = document.createElement('div');
  stats.className = 'refinance-calculator-stats';
  const sClosing = stat('Estimated Closing Costs');
  const sPayment = stat('New Monthly Payment');
  const sInterest = stat('New Total Interest');
  const sLoan = stat('Total Loan Amount');
  stats.append(sClosing.el, sPayment.el, sInterest.el, sLoan.el);

  detail.append(explain, sliderWrap, closing, stats);
  results.append(summary, detail);

  const calculate = (source) => {
    const homeValue = num(controls['home-value'].value);
    const balance = num(controls['mortgage-balance'].value);
    const rate = num(controls['interest-rate'].value);
    const years = num(controls['loan-terms'].value) || 30;
    const maxCash = Math.max(0, Math.floor((homeValue * ltv) / 100 - balance));

    let cash = source === 'slider' ? num(slider.value) : num(controls['cash-out-amount'].value);
    cash = Math.min(Math.max(cash, Math.min(minCash, maxCash)), maxCash);

    slider.min = String(Math.min(minCash, maxCash));
    slider.max = String(maxCash);
    slider.value = String(cash);
    slider.disabled = maxCash <= minCash;
    rangeMin.textContent = money.format(Math.min(minCash, maxCash));
    rangeMax.textContent = money.format(maxCash);
    sliderLabel.textContent = money.format(cash);
    if (source === 'slider') controls['cash-out-amount'].value = cash.toLocaleString('en-US');

    if (maxCash < minCash) {
      explain.textContent = `Based on the values entered, the available cash-out is below the ${money.format(minCash)} minimum.`;
    } else {
      explain.textContent = `You may be able to refinance your current mortgage and get a one-time cash out of ${money.format(maxCash)}. If you'd like to cash out less than that amount, slide the bar to see how it affects your payments. The minimum cash-out amount is ${money.format(minCash)}.`;
    }

    const baseLoan = balance + cash;
    const closingCost = (baseLoan * closingPct) / 100;
    const loan = closingMode === 'loan' ? baseLoan + closingCost : baseLoan;
    const netCash = closingMode === 'cash' ? Math.max(0, cash - closingCost) : cash;
    const payment = monthlyPayment(loan, rate, years);
    const totalInterest = Math.max(0, payment * years * 12 - loan);

    amount.textContent = money.format(netCash);
    sClosing.value.textContent = money2.format(closingCost);
    sPayment.value.textContent = money2.format(payment);
    sInterest.value.textContent = money2.format(totalInterest);
    sLoan.value.textContent = money.format(loan);

    closingButtons.forEach((b) => {
      const on = b.dataset.mode === closingMode;
      b.setAttribute('aria-checked', String(on));
      b.classList.toggle('active', on);
    });
    closingNote.textContent = CLOSING_OPTIONS.find((o) => o.id === closingMode).note;
  };

  closingButtons.forEach((b) => b.addEventListener('click', () => {
    closingMode = b.dataset.mode;
    calculate();
  }));
  slider.addEventListener('input', () => calculate('slider'));
  form.addEventListener('change', () => calculate());
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculate();
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  const layout = document.createElement('div');
  layout.className = 'refinance-calculator-layout';
  layout.append(form, results);

  const content = [];
  if (before.length) {
    const intro = document.createElement('div');
    intro.className = 'refinance-calculator-intro';
    intro.append(...before);
    content.push(intro);
  }
  content.push(layout);
  block.replaceChildren(...content);
  calculate();
}
