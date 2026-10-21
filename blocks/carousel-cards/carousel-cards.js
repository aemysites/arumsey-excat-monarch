import { createOptimizedPicture } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * carousel-cards: a scrolling row of cards with prev/next buttons and indicators.
 * Each authored row is one slide: an optional image cell plus a content cell
 * (heading, text, link/button). A cell holding only a /fragments/ link is replaced
 * by that fragment's content.
 * Options: icon-slides-in-box, icon-slides-in-box-2, icon-slides-in-box-3,
 * image-beside-text, centre-card-enlarged, image. Unknown options are ignored.
 * How many slides show at once comes from the CSS custom property
 * --carousel-cards-per-view, so layout stays in CSS. Arrows and indicators page
 * by a full view (one position per slide for centre-card-enlarged) and wrap around.
 */

let carouselId = 0;

function isFragmentLink(cell) {
  const links = cell.querySelectorAll('a[href]');
  if (links.length !== 1 || cell.textContent.trim() !== links[0].textContent.trim()) return false;
  try {
    const url = new URL(links[0].href, window.location.href);
    return url.origin === window.location.origin && url.pathname.includes('/fragments/');
  } catch (e) {
    return false;
  }
}

async function inlineFragment(cell) {
  const fragment = await loadFragment(new URL(cell.querySelector('a').href).pathname);
  if (!fragment) return;
  const sections = [...fragment.querySelectorAll(':scope .section')];
  cell.replaceChildren(...(sections.length
    ? sections.flatMap((s) => [...s.childNodes])
    : [...fragment.childNodes]));
}

function perView(block) {
  const value = parseInt(getComputedStyle(block).getPropertyValue('--carousel-cards-per-view'), 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

export default async function decorate(block) {
  carouselId += 1;
  const id = `carousel-cards-${carouselId}`;
  const centred = block.classList.contains('centre-card-enlarged');

  const slidesList = document.createElement('ul');
  slidesList.className = 'carousel-cards-slides';
  slidesList.id = `${id}-slides`;
  const pending = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
    if (!cells.length) return;
    const slide = document.createElement('li');
    slide.className = 'carousel-cards-slide';
    cells.forEach((cell) => {
      const decorateCell = async () => {
        if (isFragmentLink(cell)) await inlineFragment(cell);
        cell.className = cell.querySelector('picture, img') && !cell.textContent.trim()
          ? 'carousel-cards-slide-image'
          : 'carousel-cards-slide-content';
      };
      pending.push(decorateCell());
      slide.append(cell);
    });
    slidesList.append(slide);
  });

  await Promise.all(pending);

  // a paragraph holding only a plain link is the card's text CTA (chevron link)
  slidesList.querySelectorAll('.carousel-cards-slide-content p').forEach((p) => {
    const links = p.querySelectorAll('a[href]');
    if (links.length === 1 && !links[0].closest('sup')
      && p.textContent.trim() === links[0].textContent.trim()) {
      p.classList.add('carousel-cards-cta');
    }
  });

  slidesList.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  const slides = [...slidesList.children];
  slides.forEach((slide, i) => {
    slide.id = `${id}-slide-${i + 1}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
  });

  const viewport = document.createElement('div');
  viewport.className = 'carousel-cards-viewport';
  viewport.append(slidesList);

  const controls = document.createElement('div');
  controls.className = 'carousel-cards-controls';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-cards-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.setAttribute('aria-controls', slidesList.id);
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-cards-next';
  next.setAttribute('aria-label', 'Next slide');
  next.setAttribute('aria-controls', slidesList.id);
  const indicators = document.createElement('ol');
  indicators.className = 'carousel-cards-indicators';
  controls.append(prev, indicators, next);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.hasAttribute('aria-label')) block.setAttribute('aria-label', 'Carousel');
  block.replaceChildren(viewport, controls);

  let positions = 1;
  let current = 0;

  // centred: one position per slide. Otherwise the carousel pages by a full view
  // (citi.com cds-carousel): 4 cards at 3 per view give 2 pages, 6 at 2 give 3.
  let pageSize = 1;

  const targetLeft = (index) => {
    if (centred) {
      const slide = slides[index];
      if (!slide) return 0;
      return slide.offsetLeft - (slidesList.clientWidth - slide.offsetWidth) / 2;
    }
    const slide = slides[Math.min(index * pageSize, slides.length - 1)];
    if (!slide) return 0;
    // .carousel-cards-slides is position: relative, so offsetLeft is list-relative
    const left = slide.offsetLeft - (parseFloat(getComputedStyle(slidesList).paddingLeft) || 0);
    return Math.max(0, Math.min(left, slidesList.scrollWidth - slidesList.clientWidth));
  };

  const update = () => {
    [...indicators.children].forEach((item, i) => {
      const button = item.firstElementChild;
      if (i === current) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  };

  const goTo = (index, smooth = true) => {
    current = Math.max(0, Math.min(index, positions - 1));
    slidesList.scrollTo({ left: targetLeft(current), behavior: smooth ? 'smooth' : 'auto' });
    update();
  };

  const buildIndicators = () => {
    pageSize = centred ? 1 : Math.min(perView(block), slides.length) || 1;
    const count = centred ? slides.length : Math.max(1, Math.ceil(slides.length / pageSize));
    if (count === positions && indicators.children.length) return;
    positions = count;
    indicators.replaceChildren();
    for (let i = 0; i < positions; i += 1) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Show slide ${i + 1} of ${positions}`);
      button.setAttribute('aria-controls', slidesList.id);
      button.addEventListener('click', () => goTo(i));
      item.append(button);
      indicators.append(item);
    }
    block.classList.toggle('carousel-cards-static', positions <= 1);
    current = Math.min(current, positions - 1);
    update();
  };

  // arrows wrap around, as on citi.com (both arrows stay active)
  const step = (delta) => goTo((current + delta + positions) % positions);
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));

  block.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.target.closest('input, textarea, select')) return;
    e.preventDefault();
    goTo(current + (e.key === 'ArrowRight' ? 1 : -1));
    if (controls.contains(e.target)) {
      const active = indicators.children[current]?.firstElementChild;
      if (e.target.closest('.carousel-cards-indicators') && active) active.focus();
    }
  });

  // keep state in sync with touch / trackpad scrolling
  let scrollTimer;
  slidesList.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < positions; i += 1) {
        const distance = Math.abs(targetLeft(i) - slidesList.scrollLeft);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      }
      if (nearest !== current) {
        current = nearest;
        update();
      }
    }, 100);
  }, { passive: true });

  viewport.tabIndex = 0;

  buildIndicators();
  if (centred && slides.length > 2) {
    // start on the middle card so it shows enlarged with neighbours either side
    requestAnimationFrame(() => goTo(Math.floor(slides.length / 2), false));
  }

  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      buildIndicators();
      slidesList.scrollTo({ left: targetLeft(current) });
    }).observe(block);
  }
}
