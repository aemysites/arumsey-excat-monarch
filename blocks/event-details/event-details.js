/*
 * Event Details Block
 * Details panel for events and insight pages: title + meta (date/time or
 * read time), description with a "Read more" toggle, optional presenter list.
 *
 * Rows (all optional, detected by content):
 *  - header row: [title] [meta] (first text row with 2+ cells)
 *  - text rows: description copy
 *  - read-more row: a single short "Read more" text/link
 *  - presenter rows: [headshot image] [name (link) + role]
 */

const READ_MORE = /^(read more|en savoir plus|lire la suite)$/i;

function isReadMore(row) {
  const text = row.textContent.trim();
  return text.length > 0 && text.length < 40 && READ_MORE.test(text);
}

function buildPresenter(row) {
  const item = document.createElement('li');
  item.className = 'event-details-presenter';
  [...row.children].forEach((cell) => {
    if (cell.querySelector('picture, img') && !cell.textContent.trim()) {
      cell.className = 'event-details-presenter-image';
    } else {
      cell.className = 'event-details-presenter-info';
    }
    item.append(cell);
  });
  return item;
}

export default function decorate(block) {
  const main = document.createElement('div');
  main.className = 'event-details-main';
  const header = document.createElement('div');
  header.className = 'event-details-header';
  const text = document.createElement('div');
  text.className = 'event-details-text';
  const presenters = document.createElement('ul');
  presenters.className = 'event-details-presenters';
  let readMoreLabel = '';

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    if (row.querySelector('picture, img')) {
      presenters.append(buildPresenter(row));
    } else if (isReadMore(row)) {
      readMoreLabel = row.textContent.trim();
    } else if (!header.children.length && cells.length >= 2) {
      const [title, ...meta] = cells;
      title.className = 'event-details-title';
      header.append(title);
      meta.forEach((m) => {
        m.className = 'event-details-meta';
        header.append(m);
      });
    } else {
      cells.forEach((c) => text.append(...c.childNodes));
    }
  });

  if (header.children.length) main.append(header);
  if (text.children.length || text.textContent.trim()) {
    main.append(text);
    if (readMoreLabel) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'event-details-toggle';
      button.textContent = readMoreLabel;
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => {
        const expanded = block.classList.toggle('event-details-expanded');
        button.setAttribute('aria-expanded', String(expanded));
      });
      main.append(button);
    }
  }

  block.replaceChildren(main);
  if (presenters.children.length) block.append(presenters);
}
