const BLOCK = 'country-selector';
const DEFAULT_BUTTON_LABEL = 'Select';

let idCounter = 0;

/**
 * A-Z mode: rows "letter | list of countries". The select picks a letter and the
 * list below shows that letter's countries (guide pages stay links).
 * @param {Element} block
 * @param {{ letter: string, list: Element }[]} groups
 */
function decorateLetters(block, groups) {
  const intro = document.createElement('div');
  intro.className = `${BLOCK}-intro`;
  let buttonLabel = DEFAULT_BUTTON_LABEL;
  const letterRows = new Set(groups.map((g) => g.row));
  [...block.children].forEach((row) => {
    if (letterRows.has(row)) return;
    const text = row.textContent.trim();
    if (!text) return;
    if (!row.querySelector('h1, h2, h3, h4, h5, h6') && text.split(/\s+/).length <= 3) {
      buttonLabel = text;
      return;
    }
    row.querySelectorAll(':scope > div').forEach((cell) => intro.append(...cell.childNodes));
  });

  idCounter += 1;
  const selectId = `${BLOCK}-select-${idCounter}`;
  const resultsId = `${BLOCK}-results-${idCounter}`;
  const form = document.createElement('form');
  form.className = `${BLOCK}-form`;
  const label = document.createElement('label');
  label.className = `${BLOCK}-label`;
  label.htmlFor = selectId;
  label.textContent = intro.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim() || 'Choose a letter';
  const selectWrap = document.createElement('div');
  selectWrap.className = `${BLOCK}-select-wrap`;
  const select = document.createElement('select');
  select.id = selectId;
  select.name = 'letter';
  select.setAttribute('aria-controls', resultsId);
  groups.forEach(({ letter }) => {
    const option = document.createElement('option');
    option.value = letter.toLowerCase();
    option.textContent = letter;
    select.append(option);
  });
  selectWrap.append(select);
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary';
  button.textContent = buttonLabel;
  form.append(label, selectWrap, button);

  const results = document.createElement('div');
  results.className = `${BLOCK}-results`;
  results.id = resultsId;
  results.setAttribute('aria-live', 'polite');
  const show = () => {
    const group = groups.find((g) => g.letter.toLowerCase() === select.value) || groups[0];
    const ul = group.list.cloneNode(true);
    ul.className = `${BLOCK}-list`;
    results.replaceChildren(ul);
  };
  select.addEventListener('change', show);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    show();
  });
  show();

  block.replaceChildren();
  if (intro.children.length) block.append(intro);
  block.append(form, results);
}

/**
 * Country selector.
 *
 * Authoring contract (defensive — cells may be missing or reordered):
 * - Intro content: any cell holding headings/paragraphs without a link list.
 * - A-Z mode: rows whose first cell is a single letter and second cell a list of
 *   countries; the select filters the list by letter (source "All 200+ supported
 *   countries").
 * - Otherwise choices: every link inside a list (or, failing that, every link in
 *   the block) becomes an option; the link text is the label and its href the
 *   destination.
 * - Button label: a cell/paragraph whose only content is plain short text placed
 *   after the list (e.g. "Select"); defaults to "Select".
 * @param {Element} block
 */
export default function decorate(block) {
  const groups = [...block.children].map((row) => {
    const [first, second] = row.children;
    const letter = first?.textContent.trim();
    const list = second?.querySelector('ul, ol');
    return /^[A-Z]$/i.test(letter || '') && list ? { row, letter: letter.toUpperCase(), list } : null;
  }).filter(Boolean);
  if (groups.length > 1) {
    decorateLetters(block, groups);
    return;
  }

  const listLinks = [...block.querySelectorAll('li a[href]')];
  const links = listLinks.length ? listLinks : [...block.querySelectorAll('a[href]')];
  if (!links.length) return; // nothing to select: leave authored content untouched

  const choices = links.map((a) => ({ label: a.textContent.trim(), href: a.href }))
    .filter((c) => c.label);

  // intro: headings + paragraphs that are not part of the choices
  const intro = document.createElement('div');
  intro.className = `${BLOCK}-intro`;
  let buttonLabel = DEFAULT_BUTTON_LABEL;
  block.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((el) => {
    if (el.closest('li') || el.querySelector('a')) return;
    const text = el.textContent.trim();
    if (!text) return;
    // a short paragraph after the choices is the button label
    const afterChoices = Boolean(
      // eslint-disable-next-line no-bitwise
      el.compareDocumentPosition(links[0]) & Node.DOCUMENT_POSITION_PRECEDING,
    );
    const isLabel = el.tagName === 'P' && afterChoices && text.split(/\s+/).length <= 3;
    if (isLabel) {
      buttonLabel = text;
      return;
    }
    intro.append(el);
  });

  // a bare text cell (no wrapping <p>) after the choices can also hold the button label
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (cell.children.length) return;
    const text = cell.textContent.trim();
    // eslint-disable-next-line no-bitwise
    const afterChoices = cell.compareDocumentPosition(links[0]) & Node.DOCUMENT_POSITION_PRECEDING;
    if (text && afterChoices && text.split(/\s+/).length <= 3) buttonLabel = text;
  });

  idCounter += 1;
  const selectId = `${BLOCK}-select-${idCounter}`;

  const form = document.createElement('form');
  form.className = `${BLOCK}-form`;

  const label = document.createElement('label');
  label.className = `${BLOCK}-label`;
  label.htmlFor = selectId;
  label.textContent = intro.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim() || 'Choose a country';

  const selectWrap = document.createElement('div');
  selectWrap.className = `${BLOCK}-select-wrap`;
  const select = document.createElement('select');
  select.id = selectId;
  select.name = 'country';
  choices.forEach(({ label: text, href }) => {
    const option = document.createElement('option');
    option.value = href;
    option.textContent = text;
    select.append(option);
  });
  selectWrap.append(select);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button primary';
  button.textContent = buttonLabel;

  form.append(label, selectWrap, button);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (select.value) window.location.href = select.value;
  });

  block.replaceChildren();
  if (intro.children.length) block.append(intro);
  block.append(form);
}
