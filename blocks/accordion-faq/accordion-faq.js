/*
 * Accordion FAQ block
 * One row per question: cell 1 = question, cell 2 = answer.
 * A single-cell row before the first question is kept as an intro.
 */

function hasContent(el) {
  return !!el && (el.textContent.trim() !== '' || !!el.querySelector('img, picture, a'));
}

export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'accordion-faq-list';
  const intro = document.createElement('div');
  intro.className = 'accordion-faq-intro';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const [label, body] = cells;

    if (!hasContent(label) && !hasContent(body)) {
      row.remove();
      return;
    }

    // single-cell row ahead of any question: treat as intro content
    if (cells.length < 2 && !list.children.length) {
      intro.append(...label.childNodes);
      row.remove();
      return;
    }

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    // a lone heading stays a heading inside the summary (source: h3 > button);
    // a lone paragraph or bare text is unwrapped into an inline title span
    const first = label.firstElementChild;
    const only = label.children.length === 1
      && label.textContent.trim() === first.textContent.trim() ? first : null;
    let title;
    if (only && /^H[1-6]$/.test(only.tagName)) {
      title = only;
    } else {
      title = document.createElement('span');
      const source = only && only.tagName === 'P' ? only : label;
      title.append(...source.childNodes);
    }
    title.classList.add('accordion-faq-item-title');
    summary.append(title);

    const panel = document.createElement('div');
    panel.className = 'accordion-faq-item-body';
    if (body) panel.append(...body.childNodes);
    // any extra cells are appended to the answer
    cells.slice(2).forEach((extra) => panel.append(...extra.childNodes));

    details.append(summary, panel);
    list.append(details);
    row.remove();
  });

  block.replaceChildren();
  if (intro.childNodes.length) block.append(intro);
  block.append(list);
}
