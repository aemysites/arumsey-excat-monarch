/**
 * Jump select: an authored list of links rendered as a dropdown that navigates
 * to the chosen link.
 *
 * Authoring:
 * - Links: a list of links, or one link per row/cell. Each link is one option.
 * - Optional config rows [key] [value]: `label` (visible field label),
 *   `placeholder` (first, empty option; default "Please select...").
 * - Any other text without links becomes the label when none is configured.
 */

let selectCount = 0;

export default function decorate(block) {
  let label = '';
  let placeholder = '';
  const links = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (cells.length >= 2 && (key === 'label' || key === 'placeholder')) {
      if (key === 'label') label = cells[1].textContent.trim();
      else placeholder = cells[1].textContent.trim();
      return;
    }
    const rowLinks = row.querySelectorAll('a[href]');
    if (rowLinks.length) {
      links.push(...rowLinks);
    } else if (!label && row.textContent.trim()) {
      label = row.textContent.trim();
    }
  });

  if (!links.length) {
    block.remove();
    return;
  }

  selectCount += 1;
  const id = `jump-select-${selectCount}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'jump-select-field';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = id;
  labelEl.textContent = label || placeholder || 'Choose a page';
  if (!label) labelEl.className = 'jump-select-label-hidden';

  const select = document.createElement('select');
  select.id = id;
  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = placeholder || 'Please select...';
  select.append(empty);

  const here = window.location.href.split('#')[0];
  links.forEach((a) => {
    const option = document.createElement('option');
    option.value = a.href;
    option.textContent = a.textContent.trim() || a.href;
    if (a.target === '_blank') option.dataset.newWindow = 'true';
    if (a.href.split('#')[0] === here && !a.hash) option.selected = true;
    select.append(option);
  });

  select.addEventListener('change', () => {
    const option = select.selectedOptions[0];
    if (!option || !option.value) return;
    if (option.dataset.newWindow) {
      window.open(option.value, '_blank', 'noopener');
      select.value = '';
    } else {
      window.location.href = option.value;
    }
  });

  wrapper.append(labelEl, select);
  block.replaceChildren(wrapper);
}
