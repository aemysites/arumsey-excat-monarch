import { createOptimizedPicture } from '../../scripts/aem.js';

/** A cell holding only a picture (no text, links or lists). */
function isPictureCell(cell) {
  if (!cell.querySelector('picture')) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture').forEach((el) => el.remove());
  return clone.textContent.trim() === '' && !clone.querySelector('a, ul, ol, img');
}

function optimize(picture, eager, width) {
  const img = picture.querySelector('img');
  if (!img) return picture;
  const url = new URL(img.src, window.location.href);
  if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) {
    if (eager) img.loading = 'eager';
    return picture;
  }
  const optimized = createOptimizedPicture(img.src, img.alt, eager, [
    { media: '(min-width: 900px)', width: String(width) },
    { width: '750' },
  ]);
  picture.replaceWith(optimized);
  return optimized;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const pictureCells = cells.filter(isPictureCell);
  const contentCells = cells.filter((cell) => !pictureCells.includes(cell)
    && (cell.textContent.trim() || cell.querySelector('picture, img, span.icon')));

  const isLogo = block.classList.contains('logo');
  const background = document.createElement('div');
  background.className = 'hero-banner-background';
  const foreground = document.createElement('div');
  foreground.className = 'hero-banner-foreground';

  pictureCells.forEach((cell, index) => {
    const picture = cell.querySelector('picture');
    // logo: the picture is a brand mark beside the copy, not a backdrop
    if (isLogo) {
      const logo = document.createElement('div');
      logo.className = 'hero-banner-logo';
      logo.append(optimize(picture, false, 600));
      foreground.append(logo);
    } else if (index === 0) {
      background.append(optimize(picture, true, 2000));
    } else {
      // a further picture (offer-box badge, foreground cut-out) sits with the copy
      const media = document.createElement('div');
      media.className = 'hero-banner-media';
      media.append(optimize(picture, false, 750));
      foreground.append(media);
    }
  });

  contentCells.forEach((cell, index) => {
    const panel = document.createElement('div');
    // first content cell is the main text box; any later one is a side panel
    // (offer box, link panel, contents panel)
    panel.className = index === 0 ? 'hero-banner-content' : 'hero-banner-aside';
    panel.append(...cell.childNodes);
    panel.querySelectorAll('picture').forEach((picture) => optimize(picture, false, 750));
    foreground.insertBefore(panel, foreground.querySelector('.hero-banner-logo, .hero-banner-media'));
  });

  // CTA paragraphs that sit side by side
  foreground.querySelectorAll('p').forEach((p) => {
    const links = p.querySelectorAll(':scope > a, :scope > strong > a, :scope > em > a');
    const linkText = [...links].map((a) => a.textContent).join('').replace(/\s+/g, '');
    if (links.length > 1 && p.textContent.replace(/\s+/g, '') === linkText) {
      p.classList.add('hero-banner-actions');
    }
  });

  const children = [];
  if (background.children.length) {
    children.push(background);
    block.classList.add('hero-banner-has-background');
  }
  children.push(foreground);
  block.replaceChildren(...children);
}
