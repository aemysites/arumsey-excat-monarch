import { createOptimizedPicture } from '../../scripts/aem.js';
import { isLottieUrl, lazyRenderLottie } from '../../scripts/lottie.js';

function optimizeImages(block) {
  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}

/**
 * lottie-animation: the cell holds a link to a Lottie JSON file (and optionally
 * a fallback image). The player loads lazily; the link/image stays on failure.
 * An optional second JSON link is used below the desktop breakpoint (the source
 * swaps to a narrower composition on small screens).
 * Options: ribbon (full-bleed marquee-style strip).
 * @param {Element} block
 */
export default function decorate(block) {
  const [desktopLink, narrowLink] = [...block.querySelectorAll('a[href]')]
    .filter((a) => isLottieUrl(a.getAttribute('href')));
  const link = narrowLink && !window.matchMedia('(width >= 900px)').matches
    ? narrowLink
    : desktopLink;
  optimizeImages(block);

  const stage = document.createElement('div');
  stage.className = 'lottie-animation-stage';

  // Keep any authored fallback (image, link) inside the stage.
  const fallback = document.createElement('div');
  fallback.className = 'lottie-animation-fallback';
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    fallback.append(...cell.childNodes);
  });
  // Drop empty paragraphs left behind by the authored table.
  fallback.querySelectorAll('p').forEach((p) => {
    if (!p.textContent.trim() && !p.querySelector('picture, img, a')) p.remove();
  });
  stage.append(fallback);
  block.replaceChildren(stage);

  if (!link) return;

  // Lets CSS adapt controls when the wide composition is shown on a small screen.
  stage.dataset.composition = link === narrowLink ? 'narrow' : 'wide';

  const href = link.getAttribute('href');
  const label = (link.title || link.textContent || '').trim();
  // Hide the raw JSON link text; the fallback image (if any) stays visible until loaded.
  const hasImage = !!fallback.querySelector('picture, img');
  [desktopLink, narrowLink].forEach((a, i) => {
    // Keep a single visible text fallback when there is no image.
    if (!a || (!hasImage && i === 0)) return;
    (a.closest('p') || a).classList.add('lottie-animation-source');
  });

  lazyRenderLottie(stage, href, {
    loop: true,
    autoplay: true,
    controls: true,
    label: label && !/\.json$/i.test(label) ? label : '',
  });
}
