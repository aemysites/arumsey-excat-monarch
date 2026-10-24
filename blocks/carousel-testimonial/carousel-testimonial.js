/*
 * Carousel Testimonial
 * Scrolling row of customer review quotes with previous/next arrows.
 * One row per review. Cells/paragraphs are read as:
 *  - a rating (e.g. "5", "4.5/5", "5 stars" or "★★★★★") -> star rating
 *  - a paragraph starting with "-" or an en/em dash -> reviewer name
 *  - everything else -> the quote
 */
let carouselId = 0;

function parseRating(text) {
  const value = text.trim();
  if (/^[★☆]+$/.test(value)) return [...value].filter((c) => c === '★').length;
  const match = value.match(/^(\d(?:\.\d)?)\s*(?:\/\s*5)?\s*(?:stars?)?$/i);
  if (!match) return null;
  const rating = parseFloat(match[1]);
  return rating >= 0 && rating <= 5 ? rating : null;
}

function buildStars(rating) {
  const stars = document.createElement('p');
  stars.className = 'carousel-testimonial-rating';
  stars.setAttribute('role', 'img');
  stars.setAttribute('aria-label', `Rated ${rating} out of 5`);
  stars.style.setProperty('--rating', rating);
  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('span');
    star.setAttribute('aria-hidden', 'true');
    star.className = 'carousel-testimonial-star';
    if (i <= rating) star.classList.add('is-full');
    else if (i - 0.5 <= rating) star.classList.add('is-half');
    star.textContent = '★';
    stars.append(star);
  }
  return stars;
}

function buildSlide(row, index, id) {
  const slide = document.createElement('li');
  slide.className = 'carousel-testimonial-slide';
  slide.id = `${id}-slide-${index}`;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');

  const parts = [];
  [...row.children].forEach((cell) => {
    const blocks = [...cell.children];
    if (!blocks.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      parts.push(p);
    } else {
      parts.push(...blocks);
    }
  });

  let rating = null;
  const quote = document.createElement('blockquote');
  quote.className = 'carousel-testimonial-quote';
  let author = null;
  parts.forEach((el) => {
    const text = el.textContent.trim();
    if (!text && !el.querySelector('picture, img')) return;
    const parsed = rating === null ? parseRating(text) : null;
    if (parsed !== null) {
      rating = parsed;
    } else if (/^[-–—]\s*\S/.test(text)) {
      author = el;
      author.classList.add('carousel-testimonial-author');
    } else {
      quote.append(el);
    }
  });

  if (rating !== null) slide.append(buildStars(rating));
  if (quote.children.length) slide.append(quote);
  if (author) slide.append(author);
  return slide;
}

export default function decorate(block) {
  carouselId += 1;
  const id = `carousel-testimonial-${carouselId}`;
  block.id = id;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Customer reviews');

  const rows = [...block.children].filter((row) => row.textContent.trim());
  const track = document.createElement('ul');
  track.className = 'carousel-testimonial-slides';
  track.id = `${id}-slides`;
  rows.forEach((row, i) => track.append(buildSlide(row, i, id)));
  const slides = [...track.children];
  slides.forEach((slide, i) => slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`));

  const viewport = document.createElement('div');
  viewport.className = 'carousel-testimonial-viewport';
  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-testimonial-prev';
  prev.setAttribute('aria-label', 'Previous reviews');
  prev.setAttribute('aria-controls', track.id);
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-testimonial-next';
  next.setAttribute('aria-label', 'Next reviews');
  next.setAttribute('aria-controls', track.id);
  viewport.append(prev, next);

  const update = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll - 2;
    block.classList.toggle('is-scrollable', maxScroll > 2);
  };

  const step = (dir) => {
    // distance between slide starts, so the step includes the slide margins
    let width = track.clientWidth;
    if (slides[1]) width = slides[1].offsetLeft - slides[0].offsetLeft;
    else if (slides[0]) width = slides[0].getBoundingClientRect().width;
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

  block.replaceChildren(viewport);
  requestAnimationFrame(update);
}
