/* eslint-disable */
/* global WebImporter */

/**
 * Parser: jump-select
 * Source: suncorp.com.au "pageTabs" dropdowns (form.pageTabs select.sg-pageTabs--dropdown)
 * whose options load sibling pages.
 *
 * Block table (blocks/jump-select/README.md):
 *   [list of links]            one option per link
 *   [placeholder] [text]       from the first, empty option
 *   [label] [text]             when the form carries a visible label
 * Option targets come from data-url (AEM path "/content/suncorp/website/en/home/...
 * <page>.data.html#anchor") mapped to the public page URL; otherwise from value.
 */

const AEM_ROOT = /^\/content\/suncorp\/website\/en\/home/;
const ORIGIN = 'https://www.suncorp.com.au';

function text(el) {
  return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function optionHref(option) {
  const dataUrl = option.getAttribute('data-url') || '';
  if (dataUrl) {
    const [path] = dataUrl.split('#');
    const page = path.replace(AEM_ROOT, '').replace(/\.data\.html$/, '.html');
    return `${ORIGIN}${page.startsWith('/') ? '' : '/'}${page}`;
  }
  const value = option.getAttribute('value') || '';
  if (!value || value === '#0') return null;
  return /^https?:|^\//.test(value) ? value : value;
}

export default function parse(element, { document, params }) {
  const select = element.matches('select') ? element : element.querySelector('select');
  const cells = [];
  let placeholder = '';
  const list = document.createElement('ul');
  if (select) {
    [...select.querySelectorAll('option')].forEach((option, i) => {
      const href = optionHref(option);
      if (!href) {
        if (i === 0 && text(option)) placeholder = text(option);
        return;
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      // the visible option text; data-pagename is an analytics label ("Claims - Car - ...")
      a.textContent = text(option) || option.getAttribute('data-pagename');
      li.append(a);
      list.append(li);
    });
  }
  if (list.children.length) cells.push([list, '']);
  const label = element.querySelector('label');
  if (label && text(label)) cells.push(['label', text(label)]);
  if (placeholder) cells.push(['placeholder', placeholder]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'jump-select', cells });
  element.replaceWith(block);
}
