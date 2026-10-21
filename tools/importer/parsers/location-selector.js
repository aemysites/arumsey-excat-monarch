/* eslint-disable */
/* global WebImporter */

/**
 * location-selector parser (citi.com zip-code selector / lead form).
 *
 * Default block (see blocks/location-selector/README.md):
 *   row: message | change trigger (text; JS-only links become text) | help (tooltip copy, optional)
 *   optional row: ZIP label | <label from the tooltip/modal>
 *
 * lead-form option (source: app-lead-form / .lead-form):
 *   intro row: headings / text (one cell)
 *   field rows: Label | type | name | placeholder (| options for select)
 *   consent / disclosure row: legal copy (one cell)
 *   submit row: Label | submit
 *
 * Inputs, error messages, tooltips chrome and modal dialogs are dropped; the
 * decorator rebuilds the form controls from the rows.
 */

function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function isRealHref(href) {
  return !!href && !href.startsWith('#') && !/^javascript:/i.test(href);
}

const CHROME = '.ada-hidden, .sr-only, .visually-hidden, .cdk-visually-hidden, svg, cds-icon, citi-icon2, button, input, cds-error, citi-modal, cds-modal-dialog, [role="dialog"]';

function inlineClone(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll(CHROME).forEach((n) => n.remove());
  clone.querySelectorAll('a').forEach((a) => {
    if (!isRealHref((a.getAttribute('href') || '').trim())) a.replaceWith(...a.childNodes);
  });
  clone.querySelectorAll('*').forEach((n) => {
    [...n.attributes].forEach((a) => { if (a.name !== 'href') n.removeAttribute(a.name); });
  });
  return clone;
}

function copyBlockEl(document, src, tag) {
  const el = document.createElement(tag || src.tagName.toLowerCase());
  el.append(...inlineClone(src).childNodes);
  return el;
}

/** Collect headings / paragraphs / lists in document order. */
function richContent(document, root) {
  const out = [];
  if (!root) return out;
  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (child.matches(CHROME) || child.matches('label, fieldset, form [class*="field"]')) return;
      const tag = child.tagName;
      if (/^H[1-6]$/.test(tag) || tag === 'P' || tag === 'UL' || tag === 'OL') {
        if (textOf(child)) out.push(copyBlockEl(document, child));
        return;
      }
      if (!child.querySelector('h1, h2, h3, h4, h5, h6, p, ul, ol, div') && textOf(inlineClone(child))) {
        out.push(copyBlockEl(document, child, 'p'));
        return;
      }
      walk(child);
    });
  };
  walk(root);
  return out;
}

function fieldType(input) {
  if (!input) return 'text';
  const tag = input.tagName;
  if (tag === 'TEXTAREA') return 'textarea';
  if (tag === 'SELECT') return 'select';
  const hint = `${input.getAttribute('formcontrolname') || ''} ${input.getAttribute('name') || ''} ${input.id || ''} ${input.getAttribute('autocomplete') || ''}`;
  const type = (input.getAttribute('type') || 'text').toLowerCase();
  if (/phone|tel/i.test(hint) || input.hasAttribute('cdsphonemask')) return 'tel';
  if (/zip|postal/i.test(hint)) return 'zip';
  if (/e-?mail/i.test(hint) || type === 'email') return 'email';
  if (['number', 'date', 'tel'].includes(type)) return type;
  return 'text';
}

function parseLeadForm(document, element) {
  const cells = [];
  const intro = element.querySelector('[class*="__heading"], .lead-form__heading')
    || element.querySelector('[class*="first-step"]');
  const introContent = richContent(document, intro);
  if (!introContent.length) {
    // fallback: headings before the first field
    element.querySelectorAll('h1, h2, h3, h4').forEach((h) => { if (textOf(h)) introContent.push(copyBlockEl(document, h)); });
  }
  if (introContent.length) cells.push([introContent]);

  // radio groups with labelled options -> select field
  element.querySelectorAll('fieldset, [role="radiogroup"], cds-radio-group').forEach((group) => {
    if (group.parentElement && group.parentElement.closest('fieldset, [role="radiogroup"], cds-radio-group')) return;
    const options = [...group.querySelectorAll('label')].map(textOf).filter(Boolean);
    if (!options.length) return;
    const legend = textOf(group.querySelector('legend')) || 'Option';
    const input = group.querySelector('input');
    const name = (input && (input.getAttribute('formcontrolname') || input.getAttribute('name'))) || '';
    cells.push([legend, 'select', name, '', options.join(', ')]);
  });

  // labelled fields
  const seen = new Set();
  element.querySelectorAll('label').forEach((label) => {
    if (label.closest('fieldset, [role="radiogroup"], cds-radio-group')) return;
    const forId = label.getAttribute('for');
    let input = forId ? [...element.querySelectorAll('input, textarea, select')].find((i) => i.id === forId) : null;
    if (!input) {
      const field = label.closest('cds-form-field, .form-field, [class*="field"]') || label.parentElement;
      input = field ? field.querySelector('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), textarea, select') : null;
    }
    if (!input || seen.has(input)) return;
    seen.add(input);
    const labelText = textOf(label);
    if (!labelText) return;
    const type = fieldType(input);
    const name = input.getAttribute('formcontrolname') || input.getAttribute('name') || input.id || '';
    const placeholder = input.getAttribute('placeholder') || '';
    const row = [labelText, type, name, placeholder];
    if (type === 'select') {
      row.push([...input.querySelectorAll('option')].map(textOf).filter(Boolean).join(', '));
    }
    cells.push(row);
  });

  // consent / disclosure copy
  const legal = element.querySelector('[class*="__legal"], [class*="disclosure"], [class*="consent"]');
  const legalContent = richContent(document, legal);
  if (legalContent.length) cells.push([legalContent]);

  // submit
  const submit = element.querySelector('button[type="submit"], .submit-btn, [class*="__cta"] button, form button');
  cells.push([textOf(submit) || 'Submit', 'submit']);
  return cells;
}

function parseLocationBar(document, element) {
  const cells = [];
  // innermost tooltip copy first (selectors in priority order, not document order)
  const tooltip = ['.tooltip-body', '[id$="Tooltip-body"]', '[role="tooltip"]', '.tool-tip .content', '.tool-tip']
    .map((s) => element.querySelector(s)).find(Boolean) || null;
  const outsideTooltip = (n) => !(tooltip && (tooltip.contains(n) || n.closest('.tooltip-wrapper, .tool-tip')));

  const messageEl = [...element.querySelectorAll('.informationLabel, [class*="information"], span.fs-16, p, span')]
    .filter(outsideTooltip)
    .find((n) => {
      const t = textOf(inlineClone(n));
      return t && !/^change$/i.test(t) && !n.querySelector('p, div');
    });
  const message = messageEl ? textOf(inlineClone(messageEl)) : '';

  const triggerEl = [...element.querySelectorAll('.changeLabel a, .changeLabel button, a, button')]
    .filter(outsideTooltip)
    .find((n) => /change/i.test(textOf(n)));
  let trigger = '';
  if (triggerEl) {
    const href = triggerEl.tagName === 'A' ? (triggerEl.getAttribute('href') || '').trim() : '';
    if (isRealHref(href)) {
      trigger = document.createElement('a');
      trigger.setAttribute('href', href);
      trigger.textContent = textOf(triggerEl);
    } else {
      trigger = textOf(triggerEl);
    }
  }

  // help: tooltip copy up to the first line break (the rest is a runtime "[zipcode]" readout)
  let help = '';
  let zipLabel = '';
  if (tooltip) {
    const p = document.createElement('p');
    for (const n of [...tooltip.childNodes]) {
      if (n.nodeType === 1 && n.tagName === 'BR') break;
      if (n.nodeType === 3) p.append(document.createTextNode(n.textContent));
      else if (n.nodeType === 1 && !n.matches(CHROME)) p.append(...inlineClone(n).childNodes);
    }
    p.normalize();
    if (textOf(p)) {
      p.innerHTML = p.innerHTML.replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').trim();
      help = p;
    }
    const b = tooltip.querySelector('b, strong');
    if (b && /zip/i.test(textOf(b))) zipLabel = textOf(b).replace(/ /g, ' ');
  }

  if (message || trigger) cells.push([message, trigger, help]);
  if (zipLabel) cells.push(['ZIP label', zipLabel]);
  return cells;
}

export default function parse(element, { document, params }) {
  const isLeadForm = !!element.querySelector('.lead-form, [class*="lead-form"], app-lead-form')
    || element.matches('.lead-form, app-lead-form')
    || element.querySelectorAll('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])').length >= 2;

  const cells = isLeadForm ? parseLeadForm(document, element) : parseLocationBar(document, element);
  const name = isLeadForm ? 'location-selector (lead-form)' : 'location-selector';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
