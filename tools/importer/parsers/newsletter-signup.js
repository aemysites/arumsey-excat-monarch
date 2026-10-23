/* eslint-disable */
/* global WebImporter */

/**
 * Parser: newsletter-signup
 * Source: section.column-control holding an AEM email lead-gen form
 *   (.reimagine-form-container: email field, submit button, hidden thank-you
 *   section and error messages).
 * Layout (blocks/newsletter-signup/README.md): one cell:
 *   optional heading/intro, field placeholder paragraph (trailing * = required),
 *   link (text = button label, href = POST endpoint), success message, error message.
 * The source form posts to itself via JS (no action URL), so the endpoint is "#".
 */

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, t) {
  const p = document.createElement('p');
  p.textContent = t;
  return p;
}

export default function parse(element, { document }) {
  const cell = [];

  // optional intro outside the form
  element.querySelectorAll('h1, h2, h3, h4, p').forEach((n) => {
    if (n.closest('form, .thank-you-section, .reimagine-form-container')) return;
    if (text(n)) cell.push(n);
  });

  const form = element.querySelector('form');
  const label = form ? form.querySelector('label') : null;
  const input = form ? form.querySelector('input[type="email"], input[type="text"]') : null;
  const placeholder = text(label) || (input && input.getAttribute('placeholder')) || 'Email*';
  cell.push(para(document, placeholder));

  const button = form ? form.querySelector('button[type="submit" i], button') : null;
  const a = document.createElement('a');
  a.href = (form && form.getAttribute('action')) || '#';
  a.textContent = text(button) || 'Sign up';
  const lp = document.createElement('p');
  lp.append(a);
  cell.push(lp);

  const thanks = element.querySelector('.thank-you-section');
  if (thanks) {
    const h = text(thanks.querySelector('h1, h2, h3'));
    const p = text(thanks.querySelector('p'));
    cell.push(para(document, [h, p].filter(Boolean).join(' ')));
  }
  const err = element.querySelector('.form-submit-error');
  if (err && text(err)) {
    if (!thanks) cell.push(para(document, 'Thanks for signing up!'));
    cell.push(para(document, text(err)));
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'newsletter-signup', cells: [[cell]] });
  element.replaceWith(block);
}
