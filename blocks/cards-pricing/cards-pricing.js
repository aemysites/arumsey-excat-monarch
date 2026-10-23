import { createOptimizedPicture } from '../../scripts/aem.js';

const PRICE_PATTERN = /^[+]?\s*[$€£]\s?\d/;

function isPrice(el) {
  const text = el.textContent.trim();
  return PRICE_PATTERN.test(text) && text.length < 24;
}

function isButtonParagraph(el) {
  if (el.classList.contains('button-wrapper')) return true;
  if (el.tagName !== 'P') return false;
  const links = el.querySelectorAll('a');
  return links.length > 0 && el.textContent.trim() === [...links].map((a) => a.textContent).join('').trim();
}

function hasIcon(el) {
  return !!el.querySelector('picture, img, svg, span.icon');
}

function decorateBody(body) {
  const children = [...body.children];
  const firstHeading = children.findIndex((el) => /^H[1-6]$/.test(el.tagName));

  // short text/link above the first heading is the tier label
  if (firstHeading > 0) {
    children.slice(0, firstHeading).forEach((el) => el.classList.add('cards-pricing-eyebrow'));
  }

  body.querySelectorAll('ul, ol').forEach((list) => {
    list.classList.add('cards-pricing-features');
    [...list.children].forEach((li) => {
      if (hasIcon(li)) {
        li.classList.add('cards-pricing-feature-icon');
        return;
      }
      // keep mixed text + inline links in one flow inside the flex row
      const text = document.createElement('span');
      text.className = 'cards-pricing-feature-text';
      text.append(...li.childNodes);
      li.append(text);
    });
  });

  // price group (label, price, fees) and actions are pushed to the bottom
  const priceIdx = children.findIndex((el) => isPrice(el));
  let footerStart = -1;
  if (priceIdx >= 0) {
    children[priceIdx].classList.add('cards-pricing-price');
    footerStart = priceIdx;
    const prev = children[priceIdx - 1];
    if (prev && prev.tagName === 'P' && !prev.querySelector('a') && prev.textContent.trim().length < 40) {
      prev.classList.add('cards-pricing-price-label');
      footerStart = priceIdx - 1;
    }
    children.slice(priceIdx + 1).forEach((el) => {
      if (!isButtonParagraph(el)) el.classList.add('cards-pricing-price-note');
    });
  } else {
    let i = children.length - 1;
    while (i >= 0 && isButtonParagraph(children[i])) i -= 1;
    if (i < children.length - 1) footerStart = i + 1;
  }

  children.forEach((el) => {
    if (isButtonParagraph(el)) el.classList.add('cards-pricing-action');
  });

  if (footerStart >= 0 && footerStart > firstHeading) {
    const footer = document.createElement('div');
    footer.className = 'cards-pricing-footer';
    children.slice(footerStart).forEach((el) => footer.append(el));
    body.append(footer);
  }

  // eyebrow, heading and short description above the feature list form the card head
  if (firstHeading >= 0) {
    const rest = [...body.children];
    const end = rest.findIndex((el) => /^(UL|OL)$/.test(el.tagName)
      || el.classList.contains('cards-pricing-footer'));
    const headEls = rest.slice(0, end < 0 ? rest.length : end);
    if (headEls.length) {
      const head = document.createElement('div');
      head.className = 'cards-pricing-head';
      headEls[0].before(head);
      headEls.forEach((el) => {
        if (el.tagName === 'P' && !el.classList.contains('cards-pricing-eyebrow')) {
          el.classList.add('cards-pricing-desc');
        }
        head.append(el);
      });
    }
  }
}

/**
 * A short leading cell is the tab label (source .card-ribbon-v2 > h4): bare text,
 * one paragraph or one heading (the eyebrow h4). Lists, several elements or
 * long text make it a card body instead.
 */
function isTabCell(cell) {
  if (cell.querySelector('ul, ol, picture, img')) return false;
  if (cell.textContent.trim().length >= 60) return false;
  const els = [...cell.children];
  if (!els.length) return true;
  return els.length === 1 && /^(P|H[1-6])$/.test(els[0].tagName);
}

/**
 * "DO-IT-YOURSELF + TAX PRO REVIEW": the "+ ..." add-on is neon on the source
 * (span.text-color-neon-green). Authored strong/em marks it; otherwise split at " + ".
 */
function decorateTab(cell) {
  const label = cell.querySelector(':scope > :is(p, h1, h2, h3, h4, h5, h6)') || cell;
  const marked = label.querySelectorAll('strong, em');
  if (marked.length) {
    marked.forEach((el) => el.classList.add('cards-pricing-tab-accent'));
    return;
  }
  const textNode = [...label.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && / \+ ?\S/.test(n.textContent));
  if (!textNode || label.children.length) return;
  const idx = textNode.textContent.indexOf(' +');
  const accent = document.createElement('span');
  accent.className = 'cards-pricing-tab-accent';
  accent.textContent = textNode.textContent.slice(idx + 1).trim();
  textNode.textContent = textNode.textContent.slice(0, idx + 1);
  label.append(accent);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
    cells.forEach((cell, idx) => {
      if (cell.children.length === 1 && cell.querySelector(':scope > picture, :scope > p > picture')
        && !cell.textContent.trim()) {
        cell.className = 'cards-pricing-card-image';
      } else if (idx === 0 && cells.length > 1 && isTabCell(cell)) {
        // a short leading cell is the tab label shown above the card
        cell.className = 'cards-pricing-card-tab';
        decorateTab(cell);
      } else {
        cell.className = 'cards-pricing-card-body';
        decorateBody(cell);
      }
      li.append(cell);
    });
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(ul);
}
