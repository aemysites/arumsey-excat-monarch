/*
 * Alert Banner
 * Dismissible site notice: info icon + message text with an optional link,
 * and a close button. One row, one cell (message). An optional second cell
 * may hold a custom icon picture. Dismissal is remembered for the session.
 */
const BLOCK = 'alert-banner';

function storageKey(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash * 31) + text.charCodeAt(i)) % 2147483647;
  }
  return `${BLOCK}-dismissed-${hash}`;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (!cells.length) {
    block.remove();
    return;
  }

  const message = document.createElement('div');
  message.className = `${BLOCK}-message`;
  const icon = document.createElement('span');
  icon.className = `${BLOCK}-icon`;
  icon.setAttribute('aria-hidden', 'true');

  cells.forEach((cell) => {
    const onlyPicture = cell.children.length === 1 && cell.querySelector('picture') && !cell.textContent.trim();
    if (onlyPicture) {
      icon.replaceChildren(...cell.childNodes);
      icon.classList.add(`${BLOCK}-icon-custom`);
    } else {
      message.append(...cell.childNodes);
    }
  });

  if (!message.textContent.trim()) {
    block.remove();
    return;
  }

  const key = storageKey(message.textContent.trim());
  try {
    if (sessionStorage.getItem(key)) {
      block.closest(`.${BLOCK}-wrapper`)?.remove();
      block.remove();
      return;
    }
  } catch (e) {
    // storage unavailable; always show
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = `${BLOCK}-close`;
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', () => {
    try {
      sessionStorage.setItem(key, '1');
    } catch (e) {
      // ignore
    }
    const wrapper = block.closest(`.${BLOCK}-wrapper`);
    (wrapper || block).remove();
  });

  block.setAttribute('role', 'status');
  block.replaceChildren(icon, message, close);
}
