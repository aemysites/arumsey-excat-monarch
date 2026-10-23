const DEFAULT_PLACEHOLDER = 'Enter email';
const DEFAULT_SUCCESS = 'Thanks for signing up.';
const DEFAULT_ERROR = 'Something went wrong. Please try again.';

let idCounter = 0;

/**
 * newsletter-signup: e-mail field and submit button.
 * Authoring (any order inside the cells):
 *   - optional heading / intro text
 *   - a short paragraph with the field placeholder (e.g. "Enter email*";
 *     a trailing * marks the field required)
 *   - a link: its text is the button label, its href the submit endpoint
 *   - optional paragraphs after the link: success message, then error message
 * The form POSTs the e-mail (field name "email") to the endpoint with fetch.
 * @param {Element} block
 */
export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.children]);

  const linkIndex = nodes.findIndex((el) => el.querySelector('a[href]') || el.matches('a[href]'));
  const linkEl = linkIndex >= 0 ? nodes[linkIndex] : null;
  let link = null;
  if (linkEl) link = linkEl.matches('a') ? linkEl : linkEl.querySelector('a[href]');
  const before = linkIndex >= 0 ? nodes.slice(0, linkIndex) : nodes;
  const after = linkIndex >= 0 ? nodes.slice(linkIndex + 1) : [];

  // The last plain paragraph before the button is the placeholder.
  const placeholderIndex = before.map((el, i) => (el.tagName === 'P' && el.textContent.trim() ? i : -1))
    .filter((i) => i >= 0).pop();
  const placeholderEl = placeholderIndex === undefined ? null : before[placeholderIndex];
  const intro = before.filter((el) => el !== placeholderEl && el.textContent.trim());

  let placeholder = placeholderEl ? placeholderEl.textContent.trim() : DEFAULT_PLACEHOLDER;
  const required = /\*\s*$/.test(placeholder) || !placeholderEl;
  placeholder = placeholder.replace(/\*\s*$/, '').trim() || DEFAULT_PLACEHOLDER;

  const successText = after[0] ? after[0].textContent.trim() : DEFAULT_SUCCESS;
  const errorText = after[1] ? after[1].textContent.trim() : DEFAULT_ERROR;

  idCounter += 1;
  const id = `newsletter-signup-email-${idCounter}`;

  const form = document.createElement('form');
  form.className = 'newsletter-signup-form';
  if (link) {
    form.action = link.href;
    form.method = 'post';
  }

  const label = document.createElement('label');
  label.className = 'newsletter-signup-label';
  label.setAttribute('for', id);
  label.textContent = required ? `${placeholder}*` : placeholder;

  const input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.id = id;
  // a blank placeholder lets CSS float the label (:placeholder-shown) once the field has a value
  input.placeholder = ' ';
  input.autocomplete = 'email';
  input.required = required;

  // floating label: the label sits inside the field and shrinks above the value on focus
  const field = document.createElement('div');
  field.className = 'newsletter-signup-field';
  field.append(input, label);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary';
  button.textContent = link ? link.textContent.trim() : 'Sign up';

  const status = document.createElement('p');
  status.className = 'newsletter-signup-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  form.append(field, button);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.textContent = '';
    block.classList.remove('is-success', 'is-error');
    try {
      if (form.action && link && link.getAttribute('href') !== '#') {
        const resp = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      }
      form.reset();
      status.textContent = successText;
      block.classList.add('is-success');
    } catch (err) {
      status.textContent = errorText;
      block.classList.add('is-error');
    } finally {
      button.disabled = false;
    }
  });

  const children = [];
  if (intro.length) {
    const introEl = document.createElement('div');
    introEl.className = 'newsletter-signup-intro';
    introEl.append(...intro);
    children.push(introEl);
  }
  children.push(form, status);
  block.replaceChildren(...children);
}
