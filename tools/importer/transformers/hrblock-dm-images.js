/* eslint-disable */
/* global WebImporter */

/**
 * H&R Block Dynamic Media (Scene7) image transformer.
 *
 * afterTransform only (parsers need the <img> nodes first). Rewrites
 * Scene7 /is/image/ and DM Open API <img> elements into anchors that survive
 * the markdown round-trip; the scripts.js auto-block rebuilds <picture>.
 *  - Unlinked image: <a href="DM-URL">alt</a>
 *  - Linked image (image is the only meaningful content of the link): keep
 *    the navigation href, move the DM URL to title, link text = alt.
 *  - Mixed-content anchors are skipped (warning logged).
 * Empty alt becomes the visible sentinel "Image without alt text".
 */

const EMPTY_ALT_SENTINEL = 'Image without alt text';

function detectDynamicMediaUrl(urlStr) {
  if (!urlStr || !/^(https?:\/\/|\/\/)/i.test(urlStr)) return false;
  let u;
  try { u = new URL(urlStr, 'https://x/'); } catch (e) { return false; }
  if (u.pathname.startsWith('/is/image/')) return 'scene7';
  if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname)
      && u.pathname.startsWith('/adobe/assets/urn:')) {
    return 'dm-openapi';
  }
  return false;
}

function getImageUrl(img) {
  const candidates = [
    img.getAttribute('src'),
    img.getAttribute('data-src'),
    img.getAttribute('data-original'),
  ];
  const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
  if (srcset) candidates.push(srcset.split(',')[0].trim().split(/\s+/)[0]);
  const picture = img.closest('picture');
  if (picture) {
    picture.querySelectorAll('source').forEach((s) => {
      const ss = s.getAttribute('srcset');
      if (ss) candidates.push(ss.split(',')[0].trim().split(/\s+/)[0]);
    });
  }
  const hit = candidates.find((c) => c && detectDynamicMediaUrl(c));
  if (!hit) return null;
  return hit.startsWith('//') ? `https:${hit}` : hit;
}

function isSoleMeaningfulDescendant(anchor, node) {
  const clone = anchor.cloneNode(true);
  // Remove the image (and its picture wrapper) from the clone, then check
  // nothing meaningful remains.
  const path = [];
  let cur = node;
  while (cur && cur !== anchor) {
    const parent = cur.parentNode;
    path.unshift([...parent.childNodes].indexOf(cur));
    cur = parent;
  }
  let target = clone;
  path.forEach((idx) => { target = target.childNodes[idx]; });
  if (target && target.parentNode) target.parentNode.removeChild(target);
  if (clone.textContent.replace(/\s+/g, '').length) return false;
  if (clone.querySelector('img, picture, video, svg, iframe')) return false;
  return true;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  if (!element) return;
  const document = element.ownerDocument;
  if (!document) return;

  [...element.querySelectorAll('img')].forEach((img) => {
    if (!img.isConnected) return;
    const dmUrl = getImageUrl(img);
    if (!dmUrl) return;

    const alt = (img.getAttribute('alt') || '').trim() || EMPTY_ALT_SENTINEL;
    const picture = img.closest('picture');
    const node = picture && picture.contains(img) ? picture : img;
    const link = img.closest('a');

    if (link && element.contains(link)) {
      if (!isSoleMeaningfulDescendant(link, node)) {
        console.warn(`[hrblock-dm-images] skipped mixed-content anchor for ${dmUrl}`);
        return;
      }
      link.setAttribute('title', dmUrl);
      link.textContent = alt;
      return;
    }

    const a = document.createElement('a');
    a.setAttribute('href', dmUrl);
    a.textContent = alt;
    node.replaceWith(a);
  });
}
