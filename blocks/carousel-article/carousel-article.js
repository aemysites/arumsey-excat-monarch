/*
 * Carousel Article
 * Scrolling row of article cards with previous/next arrows and a "Showing X of Y" count.
 * One row per card: optional image cell | content cell (heading/link, text).
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

let carouselId = 0;

function isImageOnly(el) {
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

function buildSlide(row, index, id) {
  const slide = document.createElement('li');
  slide.className = 'carousel-article-slide';
  slide.id = `${id}-slide-${index}`;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  const content = document.createElement('div');
  content.className = 'carousel-article-slide-content';
  [...row.children].forEach((cell) => {
    if (isImageOnly(cell) && !slide.querySelector('.carousel-article-slide-image') && !content.childNodes.length) {
      cell.className = 'carousel-article-slide-image';
      slide.append(cell);
    } else {
      content.append(...cell.childNodes);
    }
  });
  if (content.childNodes.length) slide.append(content);

  // make the whole card clickable via the first heading link
  const link = content.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a') || content.querySelector('a[href]');
  if (link) slide.classList.add('has-link');
  return slide;
}

/**
 * The importer can leave the source's static "Showing X of Y articles" text as a
 * paragraph right before the block; the block renders a live count instead.
 */
function removeStaticStatus(block) {
  const wrapper = block.parentElement;
  const prevEl = wrapper && wrapper.previousElementSibling;
  if (!prevEl || !prevEl.classList.contains('default-content-wrapper')) return;
  const para = prevEl.lastElementChild;
  if (!para || para.tagName !== 'P' || para.children.length) return;
  if (!/^(\s*showing\s+\d+\s+of\s+\d+\s+articles?)+\s*$/i.test(para.textContent)) return;
  para.remove();
  if (!prevEl.children.length) prevEl.remove();
}

export default function decorate(block) {
  removeStaticStatus(block);
  // a carousel introduced by its own heading (product pages: "Insights and stories")
  // uses the source's larger card titles; one after a columns intro keeps the small titles
  const prevEl = block.parentElement && block.parentElement.previousElementSibling;
  const intro = prevEl && prevEl.classList.contains('default-content-wrapper') && prevEl.lastElementChild;
  if (intro && /^H[1-6]$/.test(intro.tagName)) block.classList.add('is-headed');
  carouselId += 1;
  const id = `carousel-article-${carouselId}`;
  block.id = id;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');

  const rows = [...block.children].filter((row) => row.textContent.trim() || row.querySelector('picture, img'));
  const track = document.createElement('ul');
  track.className = 'carousel-article-slides';
  track.id = `${id}-slides`;
  rows.forEach((row, i) => track.append(buildSlide(row, i, id)));
  const slides = [...track.children];
  slides.forEach((slide, i) => slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`));

  const status = document.createElement('p');
  status.className = 'carousel-article-status';
  status.setAttribute('aria-live', 'polite');

  const viewport = document.createElement('div');
  viewport.className = 'carousel-article-viewport';
  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-article-prev';
  prev.setAttribute('aria-label', 'Previous articles');
  prev.setAttribute('aria-controls', track.id);
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-article-next';
  next.setAttribute('aria-label', 'Next articles');
  next.setAttribute('aria-controls', track.id);
  viewport.append(prev, next);

  const visibleCount = () => {
    const trackBox = track.getBoundingClientRect();
    return slides.filter((slide) => {
      const box = slide.getBoundingClientRect();
      return box.left >= trackBox.left - 2 && box.right <= trackBox.right + 2;
    }).length;
  };

  const update = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll - 2;
    const scrollable = maxScroll > 2;
    block.classList.toggle('is-scrollable', scrollable);
    const shown = Math.max(visibleCount(), 1);
    status.textContent = `Showing ${Math.min(shown, slides.length)} of ${slides.length} articles`;
  };

  const step = (dir) => {
    // one slide incl. the gap between slides
    const [first, second] = slides;
    let width = first ? first.getBoundingClientRect().width : track.clientWidth;
    if (first && second) width = second.offsetLeft - first.offsetLeft;
    track.scrollBy({ left: dir * width, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  }, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(update).observe(track);

  track.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  block.replaceChildren(status, viewport);
  if (slides.length < 2) block.classList.add('is-single');
  requestAnimationFrame(update);
}
