/**
 * Alert banner: a site-wide notice bar with an optional icon, a message
 * (text + inline links) and a dismiss button. Dismissal lasts for the session.
 *
 * Authoring: one row. Cells: [icon (optional)] [message].
 * A cell holding only a picture or an icon is treated as the icon.
 */

function isMediaCell(cell) {
  if (!cell) return false;
  const text = cell.textContent.trim();
  return !text && !!cell.querySelector('picture, img, .icon, svg');
}

function storageKey(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash * 31) + text.charCodeAt(i)) % 2147483647;
  }
  return `alert-banner-dismissed-${hash}`;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const iconCell = cells.find(isMediaCell);
  const messageCells = cells.filter((c) => c !== iconCell && c.textContent.trim());

  if (!messageCells.length && !iconCell) {
    block.closest('.section')?.classList.add('alert-banner-empty');
    block.remove();
    return;
  }

  const key = storageKey(messageCells.map((c) => c.textContent.trim()).join(' '));
  try {
    if (window.sessionStorage.getItem(key)) {
      block.hidden = true;
      return;
    }
  } catch (e) {
    // storage unavailable: always show
  }

  const inner = document.createElement('div');
  inner.className = 'alert-banner-inner';

  if (iconCell) {
    iconCell.className = 'alert-banner-icon';
    iconCell.setAttribute('aria-hidden', 'true');
    inner.append(iconCell);
  }

  const message = document.createElement('div');
  message.className = 'alert-banner-message';
  messageCells.forEach((cell) => message.append(...cell.childNodes));
  inner.append(message);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'alert-banner-close';
  close.setAttribute('aria-label', 'Dismiss notice');
  close.innerHTML = '<span aria-hidden="true">&times;</span>';
  close.addEventListener('click', () => {
    block.hidden = true;
    try {
      window.sessionStorage.setItem(key, '1');
    } catch (e) {
      // ignore
    }
  });
  inner.append(close);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Notice');
  block.replaceChildren(inner);
}
