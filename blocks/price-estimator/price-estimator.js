/**
 * price-estimator: toggle the tax situations that apply and see a starting price.
 *
 * Authored rows (config rows are keyed by their first cell, any may be missing):
 *   Prompt      | Select all that applied to you in 2025:
 *   Result      | Your estimated starting price:
 *   Price       | $99
 *   Note        | + additional state fee
 * Every other row is one situation:
 *   Situation label | starting price when selected (optional, e.g. $129) | CTA link (optional)
 *
 * The displayed price is the highest price among the base price and the
 * selected situations. Situations without a price only toggle.
 */

const CONFIG_KEYS = {
  prompt: 'prompt',
  question: 'prompt',
  result: 'result',
  'result label': 'result',
  price: 'price',
  'base price': 'price',
  note: 'note',
  'price note': 'note',
};

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function formatPrice(value, template) {
  const currency = (template && template.match(/^[^\d]*/)[0].trim()) || '$';
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `${currency}${fixed}`;
}

export default function decorate(block) {
  const config = {};
  const situations = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const key = CONFIG_KEYS[cells[0].textContent.trim().toLowerCase().replace(/:$/, '')];
    if (key) {
      config[key] = cells[1] || null;
      return;
    }
    const label = cells[0].textContent.trim();
    if (!label) return;
    const priceText = cells[1]?.textContent.trim() || '';
    const cta = cells.slice(1).map((c) => c.querySelector('a')).find(Boolean) || null;
    situations.push({
      label, price: parsePrice(priceText), priceText, cta,
    });
  });

  const basePriceText = config.price?.textContent.trim() || '';
  const basePrice = parsePrice(basePriceText);

  const options = document.createElement('div');
  options.className = 'price-estimator-options';
  if (config.prompt) {
    const prompt = document.createElement('p');
    prompt.className = 'price-estimator-prompt';
    prompt.id = `price-estimator-prompt-${Math.random().toString(36).slice(2, 8)}`;
    prompt.textContent = config.prompt.textContent.trim();
    options.append(prompt);
  }
  const list = document.createElement('ul');
  list.className = 'price-estimator-list';
  const promptEl = options.querySelector('.price-estimator-prompt');
  if (promptEl) list.setAttribute('aria-labelledby', promptEl.id);
  options.append(list);

  const result = document.createElement('div');
  result.className = 'price-estimator-result';
  if (config.result) {
    const heading = document.createElement('p');
    heading.className = 'price-estimator-result-label';
    heading.textContent = config.result.textContent.trim();
    result.append(heading);
  }
  const priceRow = document.createElement('p');
  priceRow.className = 'price-estimator-price-row';
  const priceEl = document.createElement('span');
  priceEl.className = 'price-estimator-price';
  priceEl.setAttribute('aria-live', 'polite');
  priceEl.textContent = basePriceText;
  priceRow.append(priceEl);
  if (config.note) {
    const note = document.createElement('span');
    note.className = 'price-estimator-note';
    note.textContent = config.note.textContent.trim();
    priceRow.append(note);
  }
  if (basePriceText || config.note) result.append(priceRow);
  const ctaSlot = document.createElement('p');
  ctaSlot.className = 'price-estimator-cta';
  ctaSlot.hidden = true;
  result.append(ctaSlot);

  // the source always shows a CTA: default to the first authored one
  const defaultCta = situations.find((s) => s.cta)?.cta || null;

  const update = () => {
    const selected = situations.filter((s) => s.button.getAttribute('aria-pressed') === 'true');
    let best = { price: basePrice, priceText: basePriceText, cta: null };
    selected.forEach((s) => {
      if (s.price !== null && (best.price === null || s.price > best.price)) best = s;
    });
    if (best.price !== null) priceEl.textContent = formatPrice(best.price, best.priceText);
    const cta = best.cta || defaultCta;
    ctaSlot.replaceChildren();
    if (cta) {
      const link = cta.cloneNode(true);
      link.classList.add('button', 'primary');
      ctaSlot.append(link);
    }
    ctaSlot.hidden = !cta;
  };

  situations.forEach((s) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'price-estimator-toggle';
    button.setAttribute('aria-pressed', 'false');
    button.textContent = s.label;
    button.addEventListener('click', () => {
      const pressed = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!pressed));
      update();
    });
    s.button = button;
    li.append(button);
    list.append(li);
  });

  const container = document.createElement('div');
  container.className = 'price-estimator-layout';
  if (situations.length || config.prompt) container.append(options);
  update();
  if (result.children.length) container.append(result);
  block.replaceChildren(container);
}
