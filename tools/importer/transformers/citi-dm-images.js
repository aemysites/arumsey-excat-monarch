/* eslint-disable */
/* global WebImporter */

/**
 * citi.com Dynamic Media / Scene7 image transformer.
 *
 * afterTransform only (parsers need the <img> nodes before then). Rewrites
 * every DM <img> (Scene7 `/is/image/` or DM Open API `/adobe/assets/urn:`)
 * into an anchor that survives the markdown round-trip:
 *   - unlinked image: <a href="DM-URL">alt</a>
 *   - image that is the only content of a link: keep the link href, put the
 *     DM URL in `title`, replace the link content with the alt text
 *   - link that mixes the image with other content: skipped (warning)
 * Empty alt becomes the visible sentinel "Image without alt text"; the
 * scripts.js auto-block turns it back into alt="".
 * Source DM URLs are kept as-is (query parameters, literal `$`).
 */

const EMPTY_ALT_SENTINEL = 'Image without alt text';

// Keep byte-compatible with detectDynamicMediaUrl in the scripts.js auto-block.
function detectDynamicMediaUrl(urlStr) {
  if (!/^(https?:\/\/|\/\/)/i.test(urlStr || '')) return false;
  let u;
  try { u = new URL(urlStr, 'https://x/'); } catch (e) { return false; }
  if (u.pathname.startsWith('/is/image/')) return 'scene7';
  if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname)
    && u.pathname.startsWith('/adobe/assets/urn:')) return 'dm-openapi';
  return false;
}

function firstSrcsetUrl(srcset) {
  if (!srcset) return '';
  const first = srcset.split(',')[0] || '';
  return first.trim().split(/\s+/)[0] || '';
}

/** The DM URL for an image: src, then lazy-load attributes, then <picture> sources. */
function dmUrlOf(img) {
  const candidates = [
    img.getAttribute('src'),
    img.getAttribute('data-src'),
    img.getAttribute('data-lazy-src'),
    firstSrcsetUrl(img.getAttribute('srcset')),
    firstSrcsetUrl(img.getAttribute('data-srcset')),
  ];
  const picture = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : null;
  if (picture) {
    picture.querySelectorAll('source').forEach((s) => candidates.push(firstSrcsetUrl(s.getAttribute('srcset'))));
  }
  const hit = candidates.find((c) => c && detectDynamicMediaUrl(c.trim()));
  if (!hit) return null;
  const url = hit.trim();
  return url.startsWith('//') ? `https:${url}` : url;
}

/** True when the anchor holds nothing but this image (no text, no other media). */
function isSoleContent(anchor, imageNode) {
  if (anchor.textContent.trim()) return false;
  const media = anchor.querySelectorAll('img, picture, video, svg, iframe');
  return [...media].every((m) => m === imageNode || imageNode.contains(m) || m.contains(imageNode));
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  if (!element || !element.ownerDocument) return;
  const document = element.ownerDocument;

  [...element.querySelectorAll('img')].forEach((img) => {
    if (!img.isConnected) return;
    const dmUrl = dmUrlOf(img);
    if (!dmUrl) return;

    const alt = (img.getAttribute('alt') || '').trim() || EMPTY_ALT_SENTINEL;
    const picture = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : null;
    const imageNode = picture || img;
    const link = imageNode.closest('a');

    if (link) {
      if (!isSoleContent(link, imageNode)) {
        console.warn(`[citi-dm-images] skipped DM image inside mixed-content link: ${dmUrl}`);
        return;
      }
      link.setAttribute('title', dmUrl);
      link.textContent = alt;
      return;
    }

    const a = document.createElement('a');
    a.setAttribute('href', dmUrl);
    a.textContent = alt;
    imageNode.replaceWith(a);
  });
}
