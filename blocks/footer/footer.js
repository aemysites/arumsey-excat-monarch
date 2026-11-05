/**
 * Fetches the footer fragment: /content first (local preview), then the site root (DA/EDS).
 * @returns {Promise<Element|null>} wrapper holding the fragment's sections
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = await resp.text();
  // image paths in the fragment are relative to the fragment, not to the page
  wrapper.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  return wrapper;
}

const onlyImages = (section) => section.querySelector('img')
  && !section.textContent.trim() && !section.querySelector('a');
const onlyText = (section) => !section.querySelector('a, img, ul, h2, h3') && section.textContent.trim();

/**
 * Turns a section that ends with a bold-only paragraph (the call to action) into a sign-up form:
 * the paragraph before it becomes the field label.
 * @param {Element} section the column section
 */
function buildSignupForm(section) {
  const cta = [...section.querySelectorAll(':scope > p')].find((p) => p.querySelector(':scope > strong:only-child'));
  if (!cta) return;
  const labelP = cta.previousElementSibling?.tagName === 'P' ? cta.previousElementSibling : null;
  const form = document.createElement('form');
  form.className = 'footer-signup';
  form.addEventListener('submit', (e) => e.preventDefault());
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.autocomplete = 'email';
  label.append(labelP ? labelP.textContent.trim() : '', input);
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = cta.textContent.trim();
  form.append(label, button);
  labelP?.remove();
  cta.replaceWith(form);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.children];
  const brand = sections.filter(onlyImages);
  const notes = sections.filter((s) => !brand.includes(s) && onlyText(s));
  const columns = sections.filter((s) => !brand.includes(s) && !notes.includes(s));

  const main = document.createElement('div');
  main.className = 'footer-main';
  const grid = document.createElement('div');
  grid.className = 'footer-columns';
  columns.forEach((section, i) => {
    const column = document.createElement('div');
    column.className = `footer-column footer-column-${i + 1}`;
    column.append(...section.childNodes);
    // a heading followed by an icon list is the social group: it gets its own grid cell
    const iconList = [...column.querySelectorAll(':scope > ul')].find((ul) => [...ul.children]
      .every((li) => li.querySelector('a img') && !li.textContent.trim()));
    if (iconList && column.querySelector(':scope > ul') !== iconList) {
      const social = document.createElement('div');
      social.className = 'footer-social';
      const heading = iconList.previousElementSibling?.matches('h2, h3') ? iconList.previousElementSibling : null;
      if (heading) social.append(heading);
      social.append(iconList);
      grid.append(column, social);
    } else {
      grid.append(column);
    }
    buildSignupForm(column);
  });
  main.append(grid);
  notes.forEach((section) => {
    section.className = 'footer-legal';
    main.append(section);
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-inner';
  wrapper.append(main);
  brand.forEach((section) => {
    section.className = 'footer-brand';
    wrapper.append(section);
  });
  block.append(wrapper);
}
