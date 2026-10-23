const STORAGE_KEY = 'article-feedback';
const DEFAULT_THANKS = 'Thanks for your feedback!';

/**
 * Reads previously given feedback for this page (session scoped).
 * @returns {string|null}
 */
function readStored() {
  try {
    const all = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    return all[window.location.pathname] || null;
  } catch {
    return null;
  }
}

/**
 * Persists the chosen feedback value for this page.
 * @param {string} value
 */
function store(value) {
  try {
    const all = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
    all[window.location.pathname] = value;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable: feedback still works for this view */
  }
}

/**
 * Turns an authored cell into a feedback option button.
 * @param {Element} cell
 * @param {number} index
 * @returns {HTMLButtonElement}
 */
function buildOption(cell, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'article-feedback-option';
  const label = document.createElement('span');
  label.className = 'article-feedback-option-label';
  label.textContent = cell.textContent.trim();
  button.append(label);

  const media = cell.querySelector('picture, img, .icon');
  if (media) {
    const icon = document.createElement('span');
    icon.className = 'article-feedback-option-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.append(media.closest('picture') || media);
    button.append(icon);
  }

  const value = index === 0 ? 'positive' : 'negative';
  button.dataset.value = index > 1 ? `option-${index + 1}` : value;
  button.setAttribute('aria-pressed', 'false');
  return button;
}

export default function decorate(block) {
  // expat resource-center articles: vote row lines up with the 800px article column
  if (document.body.classList.contains('expat-article')) block.classList.add('expat');

  const rows = [...block.children];
  let questionCell = null;
  let optionCells = [];
  let thanksText = '';

  rows.forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img, .icon'));
    if (!cells.length) return;
    if (!questionCell) {
      questionCell = cells.shift();
      // question and options may share the first row
      if (cells.length) optionCells = cells;
    } else if (!optionCells.length) {
      optionCells = cells;
    } else if (!thanksText) {
      thanksText = cells.map((c) => c.textContent.trim()).join(' ');
    }
  });

  if (!questionCell) {
    block.replaceChildren();
    return;
  }

  const question = document.createElement('div');
  question.className = 'article-feedback-question';
  const heading = questionCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    question.append(heading);
  } else {
    const p = document.createElement('p');
    p.textContent = questionCell.textContent.trim();
    question.append(p);
  }
  const questionId = `article-feedback-q-${Math.random().toString(36).slice(2, 8)}`;
  question.firstElementChild.id = questionId;

  // options may also be authored as paragraphs/list items in a single cell
  if (optionCells.length === 1) {
    const parts = [...optionCells[0].querySelectorAll(':scope > p, :scope > ul > li')];
    if (parts.length > 1 && parts.every((part) => part.textContent.trim())) optionCells = parts;
  }

  const options = document.createElement('div');
  options.className = 'article-feedback-options';
  options.setAttribute('role', 'group');
  options.setAttribute('aria-labelledby', questionId);
  const buttons = optionCells.map((cell, i) => buildOption(cell, i));
  options.append(...buttons);

  const thanks = document.createElement('p');
  thanks.className = 'article-feedback-thanks';
  thanks.setAttribute('role', 'status');
  thanks.setAttribute('aria-live', 'polite');
  thanks.hidden = true;

  const select = (button, announce) => {
    buttons.forEach((b) => {
      b.disabled = true;
      b.setAttribute('aria-pressed', String(b === button));
      b.classList.toggle('selected', b === button);
    });
    block.classList.add('answered');
    thanks.hidden = false;
    thanks.textContent = thanksText || DEFAULT_THANKS;
    if (announce) {
      store(button.dataset.value);
      block.dispatchEvent(new CustomEvent('article-feedback', {
        bubbles: true,
        detail: { value: button.dataset.value, label: button.textContent.trim() },
      }));
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button, true));
  });

  const previous = readStored();
  const previousButton = previous && buttons.find((b) => b.dataset.value === previous);
  if (previousButton) select(previousButton, false);

  block.replaceChildren(question, options, thanks);
}
