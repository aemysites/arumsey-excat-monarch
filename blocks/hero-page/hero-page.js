/*
 * Hero Page block
 * Inner-page title hero. Two layouts:
 *  - split (default, `split`, `split-cyan`): image half beside a title/CTA panel
 *  - overlay (`image-dark`, `dark`, `intro-strip*`): full-bleed background photo with the
 *    title over it; `intro-strip*` options add a text strip beneath the photo.
 */

const OVERLAY_OPTIONS = [
  'image-dark',
  'dark',
  'intro-strip',
  'intro-strip-stacked',
  'intro-strip-cyan-dark',
  'intro-strip-stacked-cyan-dark',
];

const HEADING = 'h1, h2, h3, h4, h5, h6';

function isEmptyCell(cell) {
  return !cell.textContent.trim() && !cell.querySelector('picture, img');
}

export default function decorate(block) {
  const cells = [...block.children].flatMap((row) => [...row.children]);

  const media = document.createElement('div');
  media.className = 'hero-page-media';
  const content = document.createElement('div');
  content.className = 'hero-page-content';
  const strip = document.createElement('div');
  strip.className = 'hero-page-strip';

  let seenHeading = false;
  cells.forEach((cell) => {
    if (isEmptyCell(cell)) return;
    const hasHeading = !!cell.querySelector(HEADING);
    const pictures = [...cell.querySelectorAll('picture')];
    const textOnly = !pictures.length;

    // a cell that is only images feeds the media area (first image wins, extras stay)
    if (pictures.length && !hasHeading && !cell.textContent.trim()) {
      pictures.forEach((pic) => media.append(pic));
      return;
    }

    if (hasHeading) {
      // move any inline picture out of the content cell into the media area
      pictures.forEach((pic) => {
        const wrapper = pic.parentElement;
        media.append(pic);
        if (wrapper && wrapper.tagName === 'P' && isEmptyCell(wrapper)) wrapper.remove();
      });
      content.append(...cell.childNodes);
      seenHeading = true;
      return;
    }

    if (textOnly && seenHeading) {
      // text after the title cell becomes the intro strip
      strip.append(...cell.childNodes);
      return;
    }

    content.append(...cell.childNodes);
  });

  // mark the CTA link(s) in the content panel
  content.querySelectorAll('a[href]').forEach((a) => {
    const parent = a.parentElement;
    if (parent && parent.textContent.trim() === a.textContent.trim()) {
      parent.classList.add('hero-page-cta');
    }
  });

  const isOverlay = OVERLAY_OPTIONS.some((opt) => block.classList.contains(opt));
  block.classList.add(isOverlay ? 'hero-page-layout-overlay' : 'hero-page-layout-split');
  if (!media.querySelector('picture, img')) block.classList.add('hero-page-no-image');

  const inner = document.createElement('div');
  inner.className = 'hero-page-inner';
  if (media.children.length) inner.append(media);
  inner.append(content);

  block.replaceChildren(inner);
  if (strip.textContent.trim()) {
    block.classList.add('hero-page-has-strip');
    block.append(strip);
  }
}
