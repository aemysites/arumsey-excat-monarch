/* eslint-disable */
/* global WebImporter */

/**
 * Parser: contact-form
 * Source: /partners/tax-import-partners/ partnership form:
 *   section.column-control > .reimagine-form-container > .hrb-custom-form >
 *   form.cmp-form with .cmp-form-text fields (input + label "First name*"),
 *   hidden error spans (.form-submit-error ...), a reCAPTCHA widget, a
 *   button.cmp-form-button "Submit", and a hidden thank-you section.
 * Layout (blocks/contact-form/README.md): one row per field: label (trailing
 *   * = required) | type | placeholder or options; then config rows
 *   Success | post-submit content (image, heading, copy) and Error | message.
 *   The extra hidden status messages (duplicate / invalid email) and checkbox group
 *   legends have no row in the block model, so they are not written. The AEM form posts back to the
 *   source page (no reusable endpoint), so no Action row is written; the
 *   reCAPTCHA widget is not migrated (not built in the block).
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

const SUPPORTED = ['text', 'email', 'tel', 'number', 'url', 'date', 'textarea', 'select', 'checkbox', 'radio'];

export default function parse(element, { document }) {
  const form = element.querySelector('form') || element;
  const rows = [];

  form.querySelectorAll('input, select, textarea').forEach((control) => {
    const type = control.tagName === 'INPUT' ? (control.getAttribute('type') || 'text').toLowerCase() : control.tagName.toLowerCase();
    if (!SUPPORTED.includes(type)) return;
    if (control.closest('.g-recaptcha') || control.classList.contains('g-recaptcha-response')) return;
    const id = control.getAttribute('id');
    let label = id ? form.querySelector(`label[for="${id}"]`) : null;
    if (!label) label = control.closest('label') || (control.parentElement && control.parentElement.querySelector('label'));
    let labelText = text(label) || control.getAttribute('aria-label') || control.getAttribute('placeholder') || control.getAttribute('name') || '';
    if (!labelText) return;
    if (control.hasAttribute('required') && !labelText.endsWith('*')) labelText += '*';
    let third = control.getAttribute('placeholder') || '';
    if (type === 'select') {
      // the leading prompt option (value "", "null" or "0", e.g. "Select a product*") is not a choice
      third = [...control.querySelectorAll('option')]
        .filter((o, i) => !(i === 0 && /^(|null|0)$/i.test((o.getAttribute('value') || '').trim())))
        .map(text).filter(Boolean).join(', ');
    }
    rows.push([labelText.replace(/\s*\*$/, '*'), type, third]);
  });

  const submit = form.querySelector('button[type="submit" i], input[type="submit" i], button.cmp-form-button');
  rows.push([text(submit) || submit?.getAttribute('value') || 'Submit', 'submit', '']);

  const thanks = element.querySelector('.thank-you-section');
  if (thanks && text(thanks)) {
    // post-submit state that replaces the form: illustration, heading ("Thanks for your
    // submission!", h2 or a text-jumbo p on the source) and copy, kept as structured content
    const success = [];
    const img = thanks.querySelector('img[src]');
    if (img) {
      const out = document.createElement('img');
      out.src = img.getAttribute('src');
      out.alt = img.getAttribute('alt') || '';
      success.push(out);
    }
    const seen = new Set();
    thanks.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((n, i) => {
      const t = text(n);
      if (!t || seen.has(t)) return;
      seen.add(t);
      const isHeading = /^H[1-6]$/.test(n.tagName) || (i === 0 && n.matches('.text-jumbo, .text-large'));
      const out = document.createElement(isHeading ? (/^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : 'h2') : 'p');
      out.textContent = t;
      success.push(out);
    });
    if (success.length) rows.push(['Success', success]);
  }
  const error = element.querySelector('.form-submit-error');
  if (error && text(error)) rows.push(['Error', text(error)]);

  // The form's intro (heading + text inside the AEM form) is not a field: keep it as
  // default content right before the block.
  const intro = [];
  form.querySelectorAll('.introtext h1, .introtext h2, .introtext h3, .introtext p, .introDefaultvariant h1, .introDefaultvariant h2, .introDefaultvariant h3, .introDefaultvariant p')
    .forEach((n) => {
      if (!text(n) || intro.some((x) => x.src === n)) return;
      const tag = /^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : 'p';
      const out = document.createElement(tag);
      out.textContent = text(n);
      intro.push({ src: n, out });
    });

  const block = WebImporter.Blocks.createBlock(document, { name: 'contact-form', cells: rows });
  element.replaceWith(block);
  intro.forEach(({ out }) => block.before(out));
}
