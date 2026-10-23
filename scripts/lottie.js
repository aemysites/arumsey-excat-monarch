import { loadScript } from './aem.js';

/**
 * Shared Lottie loader used by the lottie-animation and hero-split blocks.
 * lottie-web is pinned and loaded from a CDN only when an animation nears the
 * viewport (no build step in this project).
 */
const LOTTIE_SRC = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js';

let lottieLoader;

/**
 * Whether a URL points at a Lottie JSON file.
 * @param {string} href
 * @returns {boolean}
 */
export function isLottieUrl(href) {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.href);
    return /\.json$/i.test(url.pathname);
  } catch (e) {
    return false;
  }
}

/**
 * Finds the first link to a Lottie JSON file inside an element.
 * @param {Element} el
 * @returns {HTMLAnchorElement|null}
 */
export function findLottieLink(el) {
  return [...el.querySelectorAll('a[href]')].find((a) => isLottieUrl(a.getAttribute('href'))) || null;
}

/**
 * @returns {boolean} true when the user asked for reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Loads lottie-web once and resolves with the global player.
 * @returns {Promise<object>}
 */
export function loadLottie() {
  if (!lottieLoader) {
    lottieLoader = loadScript(LOTTIE_SRC)
      .then(() => {
        if (!window.lottie) throw new Error('lottie-web did not initialise');
        return window.lottie;
      })
      .catch((e) => {
        lottieLoader = undefined;
        throw e;
      });
  }
  return lottieLoader;
}

function buildToggle(animation, playing) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lottie-toggle';
  const setState = (isPlaying) => {
    button.setAttribute('aria-pressed', String(!isPlaying));
    button.setAttribute('aria-label', isPlaying ? 'Pause animation' : 'Play animation');
    button.dataset.state = isPlaying ? 'playing' : 'paused';
  };
  let isPlaying = playing;
  setState(isPlaying);
  button.addEventListener('click', () => {
    if (isPlaying) animation.pause();
    else animation.play();
    isPlaying = !isPlaying;
    setState(isPlaying);
  });
  return button;
}

/**
 * Renders a Lottie animation into a container.
 * Does not autoplay when the user prefers reduced motion.
 * @param {Element} container element that receives the player
 * @param {string} url Lottie JSON URL
 * @param {object} [options]
 * @param {boolean} [options.loop=true]
 * @param {boolean} [options.autoplay=true]
 * @param {boolean} [options.controls=true] add a play/pause toggle
 * @param {string} [options.label] accessible label for the animation
 * @returns {Promise<object>} the lottie AnimationItem
 */
export async function renderLottie(container, url, options = {}) {
  const {
    loop = true, autoplay = true, controls = true, label = '',
  } = options;
  const lottie = await loadLottie();
  const shouldPlay = autoplay && !prefersReducedMotion();

  const player = document.createElement('div');
  player.className = 'lottie-player';
  player.setAttribute('role', 'img');
  if (label) player.setAttribute('aria-label', label);
  container.append(player);

  const animation = lottie.loadAnimation({
    container: player,
    renderer: 'svg',
    loop,
    autoplay: shouldPlay,
    path: new URL(url, window.location.href).href,
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  });

  await new Promise((resolve, reject) => {
    animation.addEventListener('DOMLoaded', resolve);
    animation.addEventListener('data_failed', () => reject(new Error(`Failed to load ${url}`)));
  }).catch((e) => {
    animation.destroy();
    player.remove();
    throw e;
  });

  if (controls) container.append(buildToggle(animation, shouldPlay));
  return animation;
}

/**
 * Renders a Lottie animation once the container nears the viewport.
 * On failure the container's original content (link / image) is kept.
 * @param {Element} container
 * @param {string} url
 * @param {object} [options] see renderLottie
 * @returns {Promise<object|null>} AnimationItem, or null when loading failed
 */
export function lazyRenderLottie(container, url, options = {}) {
  return new Promise((resolve) => {
    const fallback = [...container.childNodes];
    const run = async () => {
      container.classList.add('lottie-loading');
      try {
        const animation = await renderLottie(container, url, options);
        fallback.forEach((node) => node.remove());
        container.classList.add('lottie-loaded');
        resolve(animation);
      } catch (e) {
        container.classList.add('lottie-failed');
        resolve(null);
      } finally {
        container.classList.remove('lottie-loading');
      }
    };

    if (!('IntersectionObserver' in window)) {
      run();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        run();
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(container);
  });
}
