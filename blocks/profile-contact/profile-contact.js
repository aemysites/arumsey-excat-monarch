/*
 * Profile Contact block
 * Contact grid on a person profile: phone, toll-free, email, fax, office address, social links.
 * Each row (or cell, or list item) is one contact item; each item gets an inline icon.
 */

const SOCIAL = [
  ['linkedin', /linkedin\.com/i, 'LinkedIn'],
  ['twitter', /(twitter\.com|\/\/x\.com)/i, 'X'],
  ['facebook', /facebook\.com/i, 'Facebook'],
  ['instagram', /instagram\.com/i, 'Instagram'],
];

/* Icon artwork as used on the source site: [viewBox, fill, ...path data] */
const ICONS = {
  phone: ['0 0 512 512', '#2a667e',
    'M436.992,74.953c-99.989-99.959-262.08-99.935-362.039,0.055s-99.935,262.08,0.055,362.039s262.08,99.935,362.039-0.055 c48.006-48.021,74.968-113.146,74.953-181.047C511.986,188.055,485.005,122.951,436.992,74.953z M387.703,356.605 c-0.011,0.011-0.022,0.023-0.034,0.034v-0.085l-12.971,12.885c-16.775,16.987-41.206,23.976-64.427,18.432 c-23.395-6.262-45.635-16.23-65.877-29.525c-18.806-12.019-36.234-26.069-51.968-41.899 c-14.477-14.371-27.483-30.151-38.827-47.104c-12.408-18.242-22.229-38.114-29.184-59.051 c-7.973-24.596-1.366-51.585,17.067-69.717l15.189-15.189c4.223-4.242,11.085-4.257,15.326-0.034 c0.011,0.011,0.023,0.022,0.034,0.034l47.957,47.957c4.242,4.223,4.257,11.085,0.034,15.326c-0.011,0.011-0.022,0.022-0.034,0.034 l-28.16,28.16c-8.08,7.992-9.096,20.692-2.389,29.867c10.185,13.978,21.456,27.131,33.707,39.339 c13.659,13.718,28.508,26.197,44.373,37.291c9.167,6.394,21.595,5.316,29.525-2.56l27.221-27.648 c4.223-4.242,11.085-4.257,15.326-0.034c0.011,0.011,0.022,0.022,0.034,0.034l48.043,48.128 C391.911,345.502,391.926,352.363,387.703,356.605z'],
  'toll-free': ['0 0 24 24', '#2a667e',
    'm16.87 15c.13-1 .13-2 .13-3s-.05-2-.13-3h5.7a10.68 10.68 0 0 1 0 6zm-2.24-8c-.63-3.91-1.88-6-2.63-6s-2 2.09-2.63 6zm-5.26 10c.62 3.91 1.88 6 2.63 6s2-2.09 2.63-6zm5.5-8h-5.74c-.08.93-.13 1.92-.13 3s.05 2.07.13 3h5.74c.08-.93.13-1.92.13-3s0-2.07-.13-3zm-7.87 3c0-1 0-2 .13-3h-5.7a10.68 10.68 0 0 0 0 6h5.7c-.08-1-.13-2-.13-3zm.36 5h-5.15a11 11 0 0 0 6.79 5.56 18.35 18.35 0 0 1 -1.64-5.56zm9.28 0a18.35 18.35 0 0 1 -1.64 5.56 11 11 0 0 0 6.79-5.56zm0-10h5.15a11 11 0 0 0 -6.79-5.56 18.35 18.35 0 0 1 1.64 5.56zm-9.28 0a18.35 18.35 0 0 1 1.64-5.56 11 11 0 0 0 -6.79 5.56z'],
  email: ['0 0 512 512', '#3b7e89',
    'M10.688,95.156C80.958,154.667,204.26,259.365,240.5,292.01c4.865,4.406,10.083,6.646,15.5,6.646 c5.406,0,10.615-2.219,15.469-6.604c36.271-32.677,159.573-137.385,229.844-196.896c4.375-3.698,5.042-10.198,1.5-14.719 C494.625,69.99,482.417,64,469.333,64H42.667c-13.083,0-25.292,5.99-33.479,16.438C5.646,84.958,6.313,91.458,10.688,95.156z',
    'M505.813,127.406c-3.781-1.76-8.229-1.146-11.375,1.542C416.51,195.01,317.052,279.688,285.76,307.885 c-17.563,15.854-41.938,15.854-59.542-0.021c-33.354-30.052-145.042-125-208.656-178.917c-3.167-2.688-7.625-3.281-11.375-1.542 C2.417,129.156,0,132.927,0,137.083v268.25C0,428.865,19.135,448,42.667,448h426.667C492.865,448,512,428.865,512,405.333 v-268.25C512,132.927,509.583,129.146,505.813,127.406z'],
  fax: ['0 0 32 32', '#2a667e',
    'M29,9H27V3a1,1,0,0,0-1-1H16a1,1,0,0,0-1,1V9H14a3,3,0,0,0-3-3H9A3,3,0,0,0,6,9H3a1,1,0,0,0-1,1V26a1,1,0,0,0,1,1H6a3,3,0,0,0,3,3h2a3,3,0,0,0,3-3H29a1,1,0,0,0,1-1V10A1,1,0,0,0,29,9ZM12,12.77l-.9,1.81A1.13,1.13,0,0,0,11,15v6a1,1,0,0,0,.11.45L12,23.24V27a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V23.24l.89-1.79A1,1,0,0,0,9,21V15a1,1,0,0,0-.11-.45L8,12.76V9A1,1,0,0,1,9,8h2a1,1,0,0,1,1,1ZM17,4h8V9H17Zm1,19H16V21h2Zm0-4H16V17h2Zm0-4H16V13h2Zm4,8H20V21h2Zm0-4H20V17h2Zm0-4H20V13h2Zm4,8H24V21h2Zm0-4H24V17h2Zm0-4H24V13h2Z'],
  address: ['0 0 682 682.667', '#2a667e',
    'm216.210938 0c-122.664063 0-222.460938 99.796875-222.460938 222.460938 0 154.175781 222.679688 417.539062 222.679688 417.539062s222.242187-270.945312 222.242187-417.539062c0-122.664063-99.792969-222.460938-222.460937-222.460938zm67.121093 287.597656c-18.507812 18.503906-42.8125 27.757813-67.121093 27.757813-24.304688 0-48.617188-9.253907-67.117188-27.757813-37.011719-37.007812-37.011719-97.226562 0-134.238281 17.921875-17.929687 41.761719-27.804687 67.117188-27.804687 25.355468 0 49.191406 9.878906 67.121093 27.804687 37.011719 37.011719 37.011719 97.230469 0 134.238281zm0 0'],
  linkedin: ['0 0 24 24', '#2a667e', 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm6 0h3.8v1.7h.05c.53-1 1.84-2.05 3.79-2.05C20.6 8.65 21 11.3 21 14.7V21h-4v-5.6c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95V21H9z'],
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createIcon(type) {
  const icon = ICONS[type];
  if (!icon) return null;
  const [viewBox, fill, ...paths] = icon;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('profile-contact-icon');
  paths.forEach((d) => {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    svg.append(path);
  });
  return svg;
}

function classify(item) {
  const link = item.querySelector('a[href]');
  const href = link?.getAttribute('href') || '';
  const text = item.textContent.trim();
  const social = SOCIAL.find(([, re]) => re.test(href));
  if (social) {
    const [type, , label] = social;
    if (!link.textContent.trim() || link.textContent.trim() === href) {
      // icon-only link when there is artwork for it, otherwise a readable label
      link.textContent = ICONS[type] ? '' : label;
      link.setAttribute('aria-label', label);
    }
    link.target = '_blank';
    link.rel = 'noopener';
    return type;
  }
  if (href.startsWith('tel:')) return /toll/i.test(text) ? 'toll-free' : 'phone';
  if (href.startsWith('mailto:')) return 'email';
  if (/^fax\b/i.test(text)) return 'fax';
  return 'address';
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  const addItem = (nodes) => {
    const li = document.createElement('li');
    const body = document.createElement('div');
    body.className = 'profile-contact-text';
    body.append(...nodes);
    li.append(body);
    if (!li.textContent.trim() && !li.querySelector('a[href], picture, img')) return;
    const type = classify(li);
    li.className = `profile-contact-item profile-contact-${type}`;
    const icon = createIcon(type);
    if (icon) {
      const link = body.querySelector('a[href]');
      // icon-only social links carry the icon inside the link
      if (link && !link.textContent.trim()) link.append(icon);
      else li.prepend(icon);
    }
    ul.append(li);
  };

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const lists = cell.querySelectorAll(':scope > ul > li');
    if (lists.length) {
      lists.forEach((li) => addItem([...li.childNodes]));
      return;
    }
    // a cell with several paragraphs each holding a link yields one item per paragraph
    const paras = [...cell.querySelectorAll(':scope > p')];
    if (paras.length > 1 && paras.every((p) => p.querySelector('a[href]'))) {
      paras.forEach((p) => addItem([...p.childNodes]));
      return;
    }
    addItem([...cell.childNodes]);
  });

  block.replaceChildren(ul);
}
