const LABELS = {
  previous: 'Previous',
  next: 'Next',
  close: 'Close',
  page: 'Show page',
  roleDescription: 'Gallery',
};

function getPerView(track) {
  const item = track.querySelector('.carousel-gallery-item');
  if (!item || !item.offsetWidth) return 1;
  return Math.max(1, Math.round(track.clientWidth / item.offsetWidth));
}

function update(block) {
  const track = block.querySelector('.carousel-gallery-track');
  const items = [...track.querySelectorAll('.carousel-gallery-item')];
  const perView = getPerView(track);
  const pages = Math.max(1, Math.ceil(items.length / perView));
  const first = items
    .findIndex((item) => item.offsetLeft - track.offsetLeft >= track.scrollLeft - 2);
  const atEnd = track.scrollLeft > 2
    && track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  const page = atEnd
    ? pages - 1
    : Math.min(pages - 1, Math.floor(Math.max(0, first) / perView));

  const dots = block.querySelector('.carousel-gallery-dots');
  if (dots && dots.children.length !== pages) {
    dots.replaceChildren(...Array.from({ length: pages }, (_, i) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${LABELS.page} ${i + 1}`);
      button.addEventListener('click', () => {
        const target = items[i * perView];
        if (target) track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      });
      li.append(button);
      return li;
    }));
  }
  dots?.querySelectorAll('button').forEach((button, i) => {
    if (i === page) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });

  const hideControls = pages < 2;
  block.classList.toggle('carousel-gallery-static', hideControls);
}

function scrollByPage(block, direction) {
  const track = block.querySelector('.carousel-gallery-track');
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  const atStart = track.scrollLeft <= 2;
  if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
  else if (direction < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
  else track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
}

function openLightbox(block, picture, caption) {
  let dialog = block.querySelector('.carousel-gallery-lightbox');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'carousel-gallery-lightbox';
    dialog.innerHTML = `<button type="button" class="carousel-gallery-lightbox-close" aria-label="${LABELS.close}"></button><div class="carousel-gallery-lightbox-content"></div>`;
    dialog.querySelector('.carousel-gallery-lightbox-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    block.append(dialog);
  }
  const content = dialog.querySelector('.carousel-gallery-lightbox-content');
  content.replaceChildren(picture.cloneNode(true));
  if (caption) content.append(caption.cloneNode(true));
  dialog.showModal();
}

export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = 'carousel-gallery-track';

  [...block.children].forEach((row) => {
    const picture = row.querySelector('picture');
    if (!picture && !row.textContent.trim()) {
      row.remove();
      return;
    }
    const li = document.createElement('li');
    li.className = 'carousel-gallery-item';
    if (picture) {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'carousel-gallery-image';
      const img = picture.querySelector('img');
      trigger.setAttribute('aria-label', img?.alt || LABELS.roleDescription);
      trigger.append(picture);
      li.append(trigger);
    }
    const text = [...row.querySelectorAll(':scope > div')]
      .filter((cell) => cell.textContent.trim());
    if (text.length) {
      const caption = document.createElement('div');
      caption.className = 'carousel-gallery-caption';
      text.forEach((cell) => caption.append(...cell.childNodes));
      li.append(caption);
    }
    track.append(li);
    row.remove();
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', LABELS.roleDescription);

  const viewport = document.createElement('div');
  viewport.className = 'carousel-gallery-viewport';
  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-gallery-prev';
  prev.setAttribute('aria-label', LABELS.previous);
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-gallery-next';
  next.setAttribute('aria-label', LABELS.next);
  viewport.prepend(prev);
  viewport.append(next);

  const dots = document.createElement('ol');
  dots.className = 'carousel-gallery-dots';

  block.replaceChildren(viewport, dots);

  prev.addEventListener('click', () => scrollByPage(block, -1));
  next.addEventListener('click', () => scrollByPage(block, 1));
  track.querySelectorAll('.carousel-gallery-image').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const caption = trigger.parentElement.querySelector('.carousel-gallery-caption');
      openLightbox(block, trigger.querySelector('picture'), caption);
    });
  });

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      update(block);
      ticking = false;
    });
  });
  new ResizeObserver(() => update(block)).observe(track);
}
