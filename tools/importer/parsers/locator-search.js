/* eslint-disable */
/* global WebImporter */

/**
 * Parser: locator-search
 * Source: suncorp.com.au search boxes (home-contents-explained item search,
 * repairer postcode search with state filter) and, as grouped by the catalog,
 * AEM Adaptive Forms (partnership / fraud / life enquiry, repairer application).
 *
 * Search boxes -> 'locator-search' (blocks/locator-search/README.md):
 *   content rows [heading / intro]; config rows [action] [URL], [param] [name],
 *   [label], [placeholder], [button], [states] [comma list], [new window] [yes].
 *   A form without an action attribute is JS-driven on the same page, so the
 *   page URL becomes the action.
 * Adaptive forms -> 'form-enquiry' (same conversion as parsers/form-enquiry.js):
 *   these are multi-field enquiry forms, which the locator-search block cannot
 *   render; the form-enquiry block can.
 */

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function fieldType(node, labelText) {
  const cls = node.className;
  if (/guideDropDownList/.test(cls)) return 'select';
  if (/guideDatePicker/.test(cls)) return 'date';
  if (/guideTextDraw/.test(cls)) return 'heading';
  if (/guideCheckBox|guideRadioButton/.test(cls)) {
    const input = node.querySelector('input[type="radio"], input[type="checkbox"]');
    return input && input.type === 'checkbox' && !/guideRadio/.test(cls) && node.querySelectorAll('input').length > 2
      ? 'checkbox' : 'radio';
  }
  if (node.querySelector('textarea')) return 'textarea';
  const input = node.querySelector('input');
  const t = (input && input.getAttribute('type')) || 'text';
  if (['email', 'tel', 'number', 'date', 'url'].includes(t)) return t;
  if (/e-?mail/i.test(labelText)) return 'email';
  if (/phone|contact number|mobile/i.test(labelText)) return 'tel';
  return 'text';
}

function fieldOptions(node, type) {
  if (type === 'select') {
    return [...node.querySelectorAll('option')].map(text)
      .filter((o, i) => o && !(i === 0 && /^(please\s+)?select/i.test(o)));
  }
  if (type === 'radio' || type === 'checkbox') {
    let items = [...node.querySelectorAll('.guideRadioButtonItem, .guideCheckBoxItem')];
    if (!items.length) items = [...node.querySelectorAll('label')];
    const fieldLabel = text(node.querySelector('.guideFieldLabel'));
    return [...new Set(items.map((l) => text(l)).filter((o) => o && o !== fieldLabel))];
  }
  return [];
}

function parseEnquiry(element, { document, params }) {
  const guide = element.matches('.guideBody') ? element : element.querySelector('.guideBody, form#guideContainerForm');
  const cells = [];

  // Content rows: rich text before the form (outside any side box).
  const inGuide = (el) => guide && (guide.contains(el) || el.contains(guide));
  const sideBoxes = [...element.querySelectorAll('[class*="sg-Grid-col"]')]
    .filter((c) => !inGuide(c) && text(c) && !c.querySelector('[class*="sg-Grid-col"]'));
  [...element.querySelectorAll('div.rte')]
    .filter((r) => !inGuide(r) && !sideBoxes.some((s) => s.contains(r)) && text(r))
    .forEach((r) => {
      const c = document.createElement('div');
      c.append(...r.childNodes);
      cells.push([c, '', '', '']);
    });

  let submit = 'Submit';
  let requiredNote = '';
  const fields = [];
  if (guide) {
    const nodes = [...guide.querySelectorAll('.guideFieldNode')]
      .filter((n) => !n.parentElement.closest('.guideFieldNode'));
    nodes.forEach((node) => {
      if (node.matches('.sg-u-hidden, .hidden') || node.closest('.sg-u-hidden')) return;
      if (/guideButton/.test(node.className)) {
        if (text(node)) submit = text(node);
        return;
      }
      const labelEl = node.querySelector('.guideFieldLabel label, .guideFieldLabel, label');
      let label = /guideTextDraw/.test(node.className) ? text(node) : text(labelEl);
      if (!label || /\(hidden\)/i.test(label)) return;
      if (/guideTextDraw/.test(node.className) && /denotes required/i.test(label)) {
        requiredNote = label;
        return;
      }
      const type = fieldType(node, label);
      const required = /\*\s*$/.test(label)
        || !!node.querySelector('[aria-required="true"], [data-mandatory="true"]');
      label = label.replace(/\s*\*\s*$/, '');
      const options = fieldOptions(node, type);
      const placeholderEl = node.querySelector('input[placeholder], textarea[placeholder]');
      const third = options.length ? options.join(', ') : ((placeholderEl && placeholderEl.getAttribute('placeholder')) || '');
      fields.push([label, type, third, type === 'heading' ? '' : (required ? 'yes' : '')]);
    });
  }

  if (requiredNote) cells.push(['required note', requiredNote, '', '']);
  cells.push(...fields);
  cells.push(['submit', submit, '', '']);

  if (sideBoxes.length) {
    const help = document.createElement('div');
    sideBoxes.forEach((s) => {
      s.querySelectorAll('style, script').forEach((e) => e.remove());
      s.querySelectorAll('div.rte').forEach((r) => help.append(...r.childNodes));
    });
    if (text(help)) cells.push(['help', help, '', '']);
  }

  const box = guide && guide.closest('.contentBoxContainer');
  const alt = !sideBoxes.length && box && /sg-Cell--neutral/.test(box.className);
  const name = alt ? 'form-enquiry (alt)' : 'form-enquiry';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}

// ---- locator-search ---------------------------------------------------------

function pageHref(document, params) {
  let u = params && params.originalURL;
  if (!u) {
    try {
      const canonical = document.querySelector('link[rel="canonical"]');
      u = (canonical && canonical.href) || document.location.href;
    } catch (e) { /* ignore */ }
  }
  try {
    const url = new URL(u);
    return `${url.origin}${url.pathname}`;
  } catch (e) {
    return null;
  }
}

export default function parse(element, { document, params }) {
  // Adaptive (multi-field) forms the catalog grouped here are enquiry forms.
  if (element.matches('.guideBody') || element.querySelector('.guideBody, form#guideContainerForm')) {
    parseEnquiry(element, { document, params });
    return;
  }

  const form = element.matches('form') ? element : element.querySelector('form');
  const scope = form || element;
  const input = scope.querySelector('input[type="text"], input[type="search"], input:not([type])');
  const cells = [];

  // Content rows: headings / intro text in the form area.
  [...element.querySelectorAll('div.rte, h1, h2, h3')]
    .filter((el) => !el.parentElement.closest('div.rte'))
    .filter((el) => el.matches('div.rte') || !el.closest('div.rte'))
    .forEach((el) => {
      if (!text(el)) return;
      const c = document.createElement('div');
      if (el.matches('div.rte')) c.append(...el.childNodes); else c.append(el);
      cells.push([c, '']);
    });

  const actionAttr = form && form.getAttribute('action');
  const action = actionAttr
    ? (/^https?:/.test(actionAttr) ? actionAttr : `https://www.suncorp.com.au${actionAttr.startsWith('/') ? '' : '/'}${actionAttr}`)
    : pageHref(document, params);
  if (action) {
    const a = document.createElement('a');
    a.href = action;
    a.textContent = action;
    cells.push(['action', a]);
  }
  const param = input && (input.getAttribute('name') || '');
  if (param && param !== 'q') cells.push(['param', param]);

  const labelEl = (input && input.id && scope.querySelector(`label[for="${input.id}"]`)) || scope.querySelector('label.sg-Form-label');
  const label = labelEl && !labelEl.matches('.sg-u-hidden') ? text(labelEl) : '';
  if (label) cells.push(['label', label]);
  const placeholder = input && input.getAttribute('placeholder');
  if (placeholder) cells.push(['placeholder', placeholder]);
  const button = scope.querySelector('button[type="submit"], button');
  const buttonText = button ? text(button.querySelector('.sg-u-mediumAndSmallHidden') || button) : '';
  if (buttonText && buttonText.toLowerCase() !== 'search') cells.push(['button', buttonText]);

  // State filter (radio buttons / select) -> states list.
  const radios = [...scope.querySelectorAll('input[type="radio"]')];
  if (radios.length) {
    const states = radios.map((r) => {
      const l = r.closest('label');
      return text(l) || r.value;
    }).filter(Boolean);
    if (states.length) cells.push(['states', [...new Set(states)].join(', ')]);
  }

  if (form && form.getAttribute('target') === '_blank') cells.push(['new window', 'yes']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'locator-search', cells });
  element.replaceWith(block);
}
