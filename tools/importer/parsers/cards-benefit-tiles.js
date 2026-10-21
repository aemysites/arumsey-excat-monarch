/* eslint-disable */
/* global WebImporter */

/**
 * cards-benefit-tiles: one row per tile -> [background image | title (+ detail)].
 *
 * Source: tds-primary-benefits > tds-primary-benefit. The tile photo is an inline
 * CSS background (background: linear-gradient(...), url(...)) on
 * .primaryBenefits-container; the title is the benefit heading. The "+" toggle is
 * UI chrome. Detail text, when present in the DOM (.benefit-description etc.),
 * follows the title in the same cell.
 *
 * Variant "blue": at least one tile has a solid colour background instead of a photo.
 */

function text(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function bgUrl(el) {
  const style = (el && el.getAttribute('style')) || '';
  const m = style.match(/url\(\s*(?:&quot;|["'])?([^"')]+?)(?:&quot;|["'])?\s*\)/i);
  return m ? m[1] : null;
}

function hasSolidColour(el) {
  const style = (el && el.getAttribute('style')) || '';
  return /background(-color)?\s*:\s*rgba?\(/i.test(style) && !/url\(/i.test(style);
}

export default function parse(element, { document, params }) {
  const cells = [];
  let tiles = [...element.querySelectorAll('tds-primary-benefit, .main-pb-container, .primaryBenefits-container')];
  tiles = tiles.filter((t) => !tiles.some((o) => o !== t && o.contains(t)));

  let solid = false;
  tiles.forEach((tile) => {
    const container = tile.matches('.primaryBenefits-container') ? tile : (tile.querySelector('.primaryBenefits-container') || tile);
    const styled = [container, ...container.querySelectorAll('[style]')].find((e) => bgUrl(e) || hasSolidColour(e));
    if (styled && hasSolidColour(styled)) solid = true;

    let img = null;
    const url = styled ? bgUrl(styled) : null;
    if (url) {
      img = document.createElement('img');
      img.src = url;
      img.alt = '';
    } else {
      const srcImg = tile.querySelector('img');
      if (srcImg && srcImg.getAttribute('src')) img = srcImg;
    }

    // strip toggle chrome
    tile.querySelectorAll('[role="button"], button, cds-icon, svg, .state-icon').forEach((x) => x.remove());
    // footnote markers without a target: keep the number, drop the empty link
    tile.querySelectorAll('a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));

    const content = document.createElement('div');
    const heading = tile.querySelector('h1, h2, h3, h4, .item-heading');
    if (heading && text(heading)) {
      const h = document.createElement('h3');
      h.append(...heading.childNodes);
      content.append(h);
    }
    tile.querySelectorAll('p, ul, ol').forEach((el) => {
      if (!text(el) || (el.parentElement && el.parentElement.closest('p, ul, ol'))) return;
      if (heading && heading.contains(el)) return;
      content.append(el);
    });

    if (!text(content) && !img) return;
    cells.push([img || '', text(content) ? content : '']);
  });

  if (!cells.length) {
    const div = document.createElement('div');
    div.append(...element.childNodes);
    cells.push(['', div]);
  }

  const name = solid ? 'cards-benefit-tiles (blue)' : 'cards-benefit-tiles';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
