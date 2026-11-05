/*
 * Accordion FAQ Block
 * Collapsible question / answer rows.
 * Each row: [question] [answer]. A row with a single cell is treated as a
 * question with no answer; extra cells are appended to the answer.
 */

export default function decorate(block) {
  const items = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length || !row.textContent.trim()) {
      row.remove();
      return;
    }
    const [label, ...rest] = cells;

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    // unwrap a single heading so the summary keeps the heading semantics
    summary.append(...label.childNodes);

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    rest.forEach((cell) => body.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary);
    if (body.textContent.trim() || body.querySelector('picture, img, iframe')) {
      details.append(body);
    } else {
      details.classList.add('accordion-faq-item-empty');
    }
    items.push(details);
    row.remove();
  });
  block.replaceChildren(...items);
}
