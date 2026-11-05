const placeholders = {
  pause: 'Pause',
  play: 'Play',
};

const AUTOPLAY_DELAY = 7000;

function updateActiveSlide(block, slideIndex) {
  block.dataset.activeSlide = slideIndex;

  block.querySelectorAll('.carousel-hero-slide').forEach((slide, idx) => {
    const active = idx === slideIndex;
    slide.setAttribute('aria-hidden', !active);
    slide.querySelectorAll('a, button').forEach((el) => {
      if (active) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', '-1');
    });
  });

  block.querySelectorAll('.carousel-hero-tab').forEach((tab, idx) => {
    const button = tab.querySelector('button');
    if (!button) return;
    if (idx === slideIndex) {
      button.setAttribute('aria-current', 'true');
      tab.classList.add('active');
    } else {
      button.removeAttribute('aria-current');
      tab.classList.remove('active');
    }
  });
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  if (!slides.length) return;
  let realIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realIndex = 0;
  const activeSlide = slides[realIndex];
  block.querySelector('.carousel-hero-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
  updateActiveSlide(block, realIndex);
}

function startAutoplay(block) {
  window.clearInterval(block.autoplayTimer);
  block.autoplayTimer = window.setInterval(() => {
    showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
  }, AUTOPLAY_DELAY);
}

function stopAutoplay(block) {
  window.clearInterval(block.autoplayTimer);
  block.autoplayTimer = null;
}

function bindEvents(block) {
  block.querySelectorAll('.carousel-hero-tab button').forEach((button, idx) => {
    button.addEventListener('click', () => showSlide(block, idx));
  });

  block.querySelector('.slide-prev')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) - 1);
  });
  block.querySelector('.slide-next')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
  });

  const toggle = block.querySelector('.carousel-hero-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const paused = toggle.getAttribute('aria-pressed') === 'true';
      if (paused) {
        toggle.setAttribute('aria-pressed', 'false');
        toggle.textContent = placeholders.pause || 'Pause';
        startAutoplay(block);
      } else {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.textContent = placeholders.play || 'Play';
        stopAutoplay(block);
      }
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveSlide(block, parseInt(entry.target.dataset.slideIndex, 10));
      }
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-hero-slide').forEach((slide) => slideObserver.observe(slide));
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.id = `carousel-hero-${carouselId}-slide-${slideIndex}`;
  slide.classList.add('carousel-hero-slide');

  const cells = [...row.querySelectorAll(':scope > div')];
  const imageCell = cells.find((cell) => cell.querySelector('picture') && !cell.querySelector('h1, h2, h3, h4, h5, h6, p:not(:has(picture))'));
  cells.forEach((cell) => {
    if (cell === imageCell) {
      cell.classList.add('carousel-hero-slide-image');
    } else if (cell.textContent.trim() || cell.children.length) {
      cell.classList.add('carousel-hero-slide-content');
    } else {
      return;
    }
    slide.append(cell);
  });

  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    if (!heading.id) heading.id = `${slide.id}-title`;
    slide.setAttribute('aria-labelledby', heading.id);
  }
  return slide;
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.id = `carousel-hero-${carouselId}`;
  const rows = [...block.querySelectorAll(':scope > div')]
    .filter((row) => row.textContent.trim() || row.querySelector('picture'));
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.roleDescription || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-hero-slides-container');
  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-hero-slides');

  let tabs;
  if (!isSingleSlide) {
    const nav = document.createElement('nav');
    nav.classList.add('carousel-hero-tabs-nav');
    nav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    tabs = document.createElement('ol');
    tabs.classList.add('carousel-hero-tabs');
    nav.append(tabs);

    const navButtons = document.createElement('div');
    navButtons.classList.add('carousel-hero-navigation-buttons');
    navButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    container.append(navButtons);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'carousel-hero-toggle';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = placeholders.pause || 'Pause';
    container.append(toggle);

    block.append(nav);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);
    if (tabs) {
      const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
      const label = heading ? heading.textContent.trim() : `${placeholders.showSlide || 'Show Slide'} ${idx + 1}`;
      const tab = document.createElement('li');
      tab.classList.add('carousel-hero-tab');
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-controls', slide.id);
      button.textContent = label;
      tab.append(button);
      tabs.append(tab);
    }
    row.remove();
  });
  // drop any leftover empty rows
  [...block.querySelectorAll(':scope > div')].forEach((row) => row.remove());

  container.prepend(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
    updateActiveSlide(block, 0);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) startAutoplay(block);
    else {
      const toggle = block.querySelector('.carousel-hero-toggle');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.textContent = placeholders.play || 'Play';
    }
  }
}
