import { createOptimizedPicture } from '../../scripts/aem.js';

const LABELS = {
  region: 'Testimonials',
  controls: 'Testimonial controls',
  previous: 'Previous testimonial',
  next: 'Next testimonial',
  show: 'Show testimonial',
  of: 'of',
};

// the slide list takes the active slide's height (source slider uses adaptive height);
// layouts that stretch slides to the tallest one keep the list's natural height
function syncHeight(block) {
  const list = block.querySelector('.carousel-testimonial-slides');
  if (list && getComputedStyle(list).alignItems === 'stretch') {
    list.style.removeProperty('height');
    return;
  }
  const active = list && list.children[parseInt(block.dataset.activeSlide || 0, 10)];
  if (active) list.style.height = `${active.offsetHeight}px`;
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-testimonial');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;
  syncHeight(block);

  block.querySelectorAll('.carousel-testimonial-slide').forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  block.querySelectorAll('.carousel-testimonial-slide-indicator').forEach((indicator, idx) => {
    const button = indicator.querySelector('button');
    if (idx !== slideIndex) {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    } else {
      button.setAttribute('disabled', true);
      button.setAttribute('aria-current', true);
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-testimonial-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-testimonial-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  block.dataset.activeSlide = 0;
  block.querySelectorAll('.carousel-testimonial-slide-indicator button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const indicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(indicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || 0, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || 0, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-testimonial-slide').forEach((slide) => slideObserver.observe(slide));

  const resizeObserver = new ResizeObserver(() => syncHeight(block));
  block.querySelectorAll('.carousel-testimonial-slide').forEach((slide) => resizeObserver.observe(slide));
}

function isIntroRow(row) {
  const cells = [...row.children];
  return cells.length === 1
    && !!row.querySelector('h1, h2, h3, h4, h5, h6')
    && !row.querySelector('picture, blockquote');
}

function createSlide(row, slideIndex, id) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.id = `carousel-testimonial-${id}-slide-${slideIndex}`;
  slide.classList.add('carousel-testimonial-slide');

  const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
  cells.forEach((cell, idx) => {
    // last cell is the quote; anything before it describes the author
    const isQuote = idx === cells.length - 1;
    cell.classList.add(isQuote ? 'carousel-testimonial-slide-quote' : 'carousel-testimonial-slide-author');
    if (!isQuote) {
      const pic = cell.querySelector('picture');
      if (pic) {
        const wrapper = pic.closest('p') || pic;
        wrapper.classList.add('carousel-testimonial-slide-photo');
      }
      const name = [...cell.children].find((el) => !el.classList.contains('carousel-testimonial-slide-photo')
        && el.textContent.trim());
      if (name) name.classList.add('carousel-testimonial-slide-name');
    }
    slide.append(cell);
  });
  if (cells.length === 1) slide.classList.add('carousel-testimonial-slide-quote-only');

  return slide;
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.id = `carousel-testimonial-${carouselId}`;
  let rows = [...block.querySelectorAll(':scope > div')];

  let intro;
  if (rows.length > 1 && isIntroRow(rows[0])) {
    intro = document.createElement('div');
    intro.className = 'carousel-testimonial-intro';
    while (rows[0].firstElementChild.firstChild) intro.append(rows[0].firstElementChild.firstChild);
    rows[0].remove();
    rows = rows.slice(1);
  }

  const isSingleSlide = rows.length < 2;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', LABELS.region);

  const main = document.createElement('div');
  main.className = 'carousel-testimonial-main';

  const container = document.createElement('div');
  container.className = 'carousel-testimonial-slides-container';

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-testimonial-slides';

  let slideIndicators;
  let indicatorsNav;
  if (!isSingleSlide) {
    indicatorsNav = document.createElement('nav');
    indicatorsNav.setAttribute('aria-label', LABELS.controls);
    slideIndicators = document.createElement('ol');
    slideIndicators.className = 'carousel-testimonial-slide-indicators';
    indicatorsNav.append(slideIndicators);

    const navButtons = document.createElement('div');
    navButtons.className = 'carousel-testimonial-navigation-buttons';
    navButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${LABELS.previous}"></button>
      <button type="button" class="slide-next" aria-label="${LABELS.next}"></button>
    `;
    container.append(navButtons);
  }

  rows.forEach((row, idx) => {
    slidesWrapper.append(createSlide(row, idx, carouselId));
    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.className = 'carousel-testimonial-slide-indicator';
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${LABELS.show} ${idx + 1} ${LABELS.of} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  main.append(container);
  if (indicatorsNav) main.append(indicatorsNav);

  block.replaceChildren(...[intro, main].filter(Boolean));
  if (intro) block.classList.add('carousel-testimonial-has-intro');

  block.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]));
  });

  if (!isSingleSlide) bindEvents(block);
}
