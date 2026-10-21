/* eslint-disable */
/* global WebImporter */

/**
 * form parser.
 * The form block accepts an inline field-definition table whose first row is
 * the column header: Field | Label | Type | Options | Mandatory | Placeholder | Value | Help.
 * The source form's controls are read in document order and emitted as rows:
 *  - input (text/number/email/tel/date/...), textarea, select (options from <option>)
 *  - radio / checkbox groups (grouped by name; label from legend/group label)
 *  - submit buttons (type=submit) become a submit row; icon-only/remove buttons are UI chrome
 * Repeated field groups (e.g. one group per debt) get a numeric suffix so field
 * names stay unique. Visible inline validation messages become the Help text.
 * The source has no submission endpoint in the DOM (client-side calculator),
 * so no Action row is emitted.
 */

const HEADER = ['Field', 'Label', 'Type', 'Options', 'Mandatory', 'Placeholder', 'Value', 'Help'];

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function toKey(s) {
  return String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function labelFor(control, root) {
  const id = control.getAttribute('id');
  if (id) {
    const byFor = [...root.querySelectorAll('label[for]')].find((l) => l.getAttribute('for') === id);
    if (byFor && textOf(byFor)) return textOf(byFor);
  }
  const wrapLabel = control.closest('label');
  if (wrapLabel && textOf(wrapLabel)) return textOf(wrapLabel);
  // nearest field wrapper with a label
  let n = control.parentElement;
  while (n && n !== root) {
    const l = n.querySelector('label, .cds-label, legend');
    if (l && textOf(l)) return textOf(l);
    n = n.parentElement;
  }
  return (control.getAttribute('aria-label') || '').trim();
}

function helpFor(control, root) {
  let n = control.parentElement;
  while (n && n !== root) {
    const err = n.querySelector('cds-error [role="alert"], .cds-error [role="alert"], .form-help, .help-text, [id$="-help"]');
    if (err && textOf(err)) return textOf(err);
    // the importer's preprocessing unwraps the bare role="alert" span: read the message
    // wrapper instead, without the screen-reader "Error." prefix and the icon
    const wrapper = n.querySelector('cds-error .cds-error-msg-wrapper, .cds-error .cds-error-msg-wrapper');
    if (wrapper) {
      const clone = wrapper.cloneNode(true);
      clone.querySelectorAll('.sr-only, cds-icon, svg').forEach((x) => x.remove());
      if (textOf(clone)) return textOf(clone);
    }
    if (n.matches('cds-form-field, .form-field, .form-group')) break;
    n = n.parentElement;
  }
  return '';
}

function groupLabel(inputs, root) {
  const fs = inputs[0].closest('fieldset');
  if (fs) {
    const legend = fs.querySelector('legend');
    if (legend && textOf(legend)) return textOf(legend);
  }
  const group = inputs[0].closest('[role="radiogroup"], [role="group"]');
  if (group && group.getAttribute('aria-label')) return group.getAttribute('aria-label').trim();
  return '';
}

function optionLabel(input, root) {
  const id = input.getAttribute('id');
  if (id) {
    const l = [...root.querySelectorAll('label[for]')].find((x) => x.getAttribute('for') === id);
    if (l && textOf(l)) return textOf(l);
  }
  const wrapLabel = input.closest('label');
  if (wrapLabel && textOf(wrapLabel)) return textOf(wrapLabel);
  return input.getAttribute('value') || '';
}

export default function parse(element, { document, params }) {
  const form = element.matches('form') ? element : (element.querySelector('form') || element);
  const controls = [...form.querySelectorAll('input, select, textarea, button')];
  const rows = [];
  const used = {};
  const seenGroups = new Set();

  const uniqueName = (base) => {
    const key = toKey(base) || 'field';
    used[key] = (used[key] || 0) + 1;
    return used[key] === 1 ? key : `${key}-${used[key]}`;
  };

  controls.forEach((c) => {
    const tag = c.tagName.toLowerCase();
    const type = (c.getAttribute('type') || (tag === 'button' ? 'submit' : 'text')).toLowerCase();
    if (tag === 'button' || (tag === 'input' && ['submit', 'button', 'reset', 'image'].includes(type))) {
      const label = tag === 'button' ? textOf(c) : (c.getAttribute('value') || '');
      // icon-only / remove / toggle buttons are UI chrome
      if (!label || type === 'button' || type === 'reset') return;
      rows.push([uniqueName('submit'), label, 'submit', '', '', '', '', '']);
      return;
    }
    if (tag === 'input' && type === 'hidden') {
      const name = c.getAttribute('name') || c.getAttribute('formcontrolname');
      if (!name) return;
      rows.push([uniqueName(name), '', 'hidden', '', '', '', c.getAttribute('value') || '', '']);
      return;
    }
    if (tag === 'input' && (type === 'radio' || type === 'checkbox')) {
      const name = c.getAttribute('name') || c.getAttribute('formcontrolname') || '';
      const group = name ? [...form.querySelectorAll(`input[type="${type}"]`)].filter((i) => (i.getAttribute('name') || i.getAttribute('formcontrolname')) === name) : [c];
      if (seenGroups.has(group[0])) return;
      seenGroups.add(group[0]);
      if (type === 'checkbox' && group.length === 1) {
        rows.push([uniqueName(name || optionLabel(c, form)), optionLabel(c, form), 'checkbox', '', c.required ? 'x' : '', '', '', '']);
        return;
      }
      const options = group.map((i) => optionLabel(i, form)).filter(Boolean);
      const checked = group.filter((i) => i.hasAttribute('checked')).map((i) => optionLabel(i, form));
      rows.push([uniqueName(name || groupLabel(group, form)), groupLabel(group, form), type === 'radio' ? 'radio' : 'checkbox-group',
        options.join(', '), group.some((i) => i.required) ? 'x' : '', '', checked.join(', '), '']);
      return;
    }
    const label = labelFor(c, form);
    const name = uniqueName(c.getAttribute('name') || c.getAttribute('formcontrolname') || label);
    if (tag === 'select') {
      const opts = [...c.querySelectorAll('option')];
      const placeholderOpt = opts.find((o) => !o.getAttribute('value') && o.hasAttribute('disabled'));
      const options = opts.filter((o) => o !== placeholderOpt).map((o) => textOf(o)).filter(Boolean);
      const selected = opts.find((o) => o.hasAttribute('selected') && o !== placeholderOpt);
      rows.push([name, label, 'select', options.join(', '), c.required ? 'x' : '', placeholderOpt ? textOf(placeholderOpt) : '', selected ? textOf(selected) : '', helpFor(c, form)]);
      return;
    }
    const fieldType = tag === 'textarea' ? 'textarea' : (['email', 'tel', 'number', 'date', 'url', 'password', 'time', 'month', 'search', 'file'].includes(type) ? type : 'text');
    rows.push([name, label, fieldType, '', c.hasAttribute('required') ? 'x' : '', c.getAttribute('placeholder') || '',
      tag === 'textarea' ? textOf(c) : (c.getAttribute('value') || ''), helpFor(c, form)]);
  });

  const cells = rows.length ? [HEADER, ...rows] : [];
  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
