/* eslint-disable */
/* global WebImporter */

/**
 * Parser: savings-calculator
 * Source: div.tax-saving-cal-container (Block Advisors S Corp savings calculator,
 *   /tax-offices/business-services/business-formation-incorporation-services/,
 *   inside the "LLC + S Corp" tab panel of div.reframe-tabs):
 *   .left-side-tax-cal-heading (h2 + p), #saving-cal-form .form-input-textbox
 *   fields (label, input, tooltip button span = help text), the Calculate
 *   submit input, .right-side-calculator result panel (h3 heading, $0 amount,
 *   h4 disclaimer) and CTA panel (h3 heading, h3 text, Get started link), plus a
 *   "Still not sure?" quiz strip (.tax-saving-quiz-section).
 * Layout (blocks/savings-calculator/README.md): rows keyed in the first cell:
 *   Intro | heading + description
 *   Field | label | help text | key (net-income, salary, w2-income, w2-ss-withheld, other-se-income)
 *   Button | Calculate
 *   Result | result heading | disclaimer
 *   CTA | heading, text, link
 * The page's wage base is not exposed in the markup, so no Wage base row (block default).
 * The quiz strip is not part of the calculator: it stays default content after the block.
 * Also called by the tabs-pill parser for the calculator inside a tab panel fragment.
 * No variants.
 */

const FIELD_KEYS = ['net-income', 'salary', 'w2-income', 'w2-ss-withheld', 'other-se-income'];

function text(el) {
  return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function para(document, content) {
  const p = document.createElement('p');
  if (typeof content === 'string') p.textContent = content;
  else p.append(content);
  return p;
}

function heading(document, tag, label) {
  const h = document.createElement(tag);
  h.textContent = label;
  return h;
}

function link(document, a, label) {
  const out = document.createElement('a');
  const href = (a.getAttribute('href') || '').trim();
  out.href = !href || /^javascript:/i.test(href) ? '#' : href;
  out.textContent = label || text(a);
  return out;
}

/* tooltip help text, keeping inline links ("see this article") */
function helpCell(document, tip) {
  if (!tip || !text(tip)) return '';
  const p = document.createElement('p');
  tip.childNodes.forEach((n) => {
    if (n.nodeType === 3) {
      p.append(document.createTextNode(n.textContent.replace(/\s+/g, ' ')));
    } else if (n.nodeType === 1 && n.tagName === 'A') {
      p.append(link(document, n));
    } else if (n.nodeType === 1 && n.tagName !== 'SVG' && text(n)) {
      p.append(document.createTextNode(` ${text(n)} `));
    }
  });
  p.innerHTML = p.innerHTML.replace(/\s{2,}/g, ' ').trim();
  return p;
}

export default function parse(element, { document }) {
  const root = element.matches('.tax-saving-cal-container') ? element
    : (element.querySelector('.tax-saving-cal-container') || element);
  const rows = [];

  // Intro
  const intro = [];
  const introRoot = root.querySelector('.left-side-tax-cal-heading') || root;
  const h2 = introRoot.querySelector('h1, h2');
  if (h2 && text(h2)) intro.push(heading(document, 'h2', text(h2)));
  introRoot.querySelectorAll('p').forEach((p) => { if (text(p)) intro.push(para(document, text(p))); });
  if (intro.length) rows.push(['Intro', intro]);

  // Fields (source order)
  root.querySelectorAll('.form-input-textbox').forEach((box, i) => {
    const label = text(box.querySelector('label'));
    if (!label) return;
    const tip = box.querySelector('button [class*="tooltip-text"], button [role="tooltip"], button span');
    rows.push(['Field', label, helpCell(document, tip), FIELD_KEYS[i] || '']);
  });

  // Button
  const submit = root.querySelector('input[type="submit"], button[type="submit"]');
  const buttonLabel = submit ? (submit.getAttribute('value') || text(submit)) : '';
  if (buttonLabel) rows.push(['Button', buttonLabel.trim()]);

  // Result
  const upper = root.querySelector('.taxsaving-cal-upper') || root.querySelector('.right-side-calculator');
  if (upper) {
    const rh = [...upper.querySelectorAll('h1, h2, h3')].find((h) => text(h) && !h.querySelector('#calculation-tax-ans, b[role="status"]'));
    const disclaimer = upper.querySelector('h4, p');
    rows.push(['Result', rh ? para(document, text(rh)) : '', disclaimer && text(disclaimer) ? para(document, text(disclaimer)) : '']);
  }

  // CTA
  const lower = root.querySelector('.right-side-calculator-lower');
  if (lower) {
    const cta = [];
    const hs = [...lower.querySelectorAll('h1, h2, h3, h4, p')].filter((h) => text(h) && !h.closest('.btn-container'));
    hs.forEach((h, i) => cta.push(i === 0 ? heading(document, 'h3', text(h)) : para(document, text(h))));
    lower.querySelectorAll('.btn-container a, a.btn').forEach((a) => {
      if (!text(a)) return;
      const strong = document.createElement('strong');
      strong.append(link(document, a));
      cta.push(para(document, strong));
    });
    if (cta.length) rows.push(['CTA', cta]);
  }

  // quiz strip after the calculator: default content
  const after = [];
  const quiz = root.querySelector('.tax-saving-quiz-section');
  if (quiz) {
    quiz.querySelectorAll('h1, h2, h3, h4, p').forEach((n) => {
      if (!text(n)) return;
      after.push(/^H[1-6]$/.test(n.tagName) ? heading(document, n.tagName.toLowerCase(), text(n)) : para(document, text(n)));
    });
    quiz.querySelectorAll('a').forEach((a) => { if (text(a)) after.push(para(document, link(document, a))); });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'savings-calculator', cells: rows });
  root.replaceWith(block);
  let prev = block;
  after.forEach((n) => { prev.after(n); prev = n; });
  return [block, ...after];
}
