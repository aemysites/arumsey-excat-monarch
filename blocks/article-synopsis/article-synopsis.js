/*
 * Article Synopsis Block
 * Synopsis panel: title + read-time meta, summary text with a "Read more"
 * toggle, and an optional list of author bylines.
 *
 * Rows (all optional, detected by content):
 *  - header row: [title] [meta, e.g. "5 Minute Read"] (first text row with 2+ cells)
 *  - text rows: summary copy
 *  - read-more row: a single short link/text such as "Read more"
 *  - author rows: [image] [name (link) + role]
 */

const READ_MORE = /^(read more|en savoir plus|lire la suite)$/i;

function isReadMore(row) {
  const text = row.textContent.trim();
  return text.length > 0 && text.length < 40 && READ_MORE.test(text);
}

function buildAuthor(row) {
  const author = document.createElement('li');
  author.className = 'article-synopsis-author';
  const cells = [...row.children];
  cells.forEach((cell) => {
    if (cell.querySelector('picture, img') && !cell.textContent.trim()) {
      cell.className = 'article-synopsis-author-image';
    } else {
      cell.className = 'article-synopsis-author-info';
    }
    author.append(cell);
  });
  return author;
}

export default function decorate(block) {
  const main = document.createElement('div');
  main.className = 'article-synopsis-main';
  const header = document.createElement('div');
  header.className = 'article-synopsis-header';
  const text = document.createElement('div');
  text.className = 'article-synopsis-text';
  const authors = document.createElement('ul');
  authors.className = 'article-synopsis-authors';
  let readMoreLabel = '';

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('picture, img'));
    if (!cells.length) return;
    if (row.querySelector('picture, img')) {
      authors.append(buildAuthor(row));
    } else if (isReadMore(row)) {
      readMoreLabel = row.textContent.trim();
    } else if (!header.children.length && cells.length >= 2) {
      const [title, ...meta] = cells;
      title.className = 'article-synopsis-title';
      header.append(title);
      meta.forEach((m) => {
        m.className = 'article-synopsis-meta';
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
      button.className = 'article-synopsis-toggle';
      button.textContent = readMoreLabel;
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => {
        const expanded = block.classList.toggle('article-synopsis-expanded');
        button.setAttribute('aria-expanded', String(expanded));
      });
      main.append(button);
    }
  }

  block.replaceChildren(main);
  if (authors.children.length) block.append(authors);
  else block.classList.add('article-synopsis-no-authors');
}
