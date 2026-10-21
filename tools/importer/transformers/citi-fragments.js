/* eslint-disable */
/* global WebImporter */

/**
 * Fragments: block content that is identical across pages lives once, as its own document.
 *
 * beforeTransform, after cleanup and before block discovery: for each `payload.template.fragments`
 * entry that lists this page, move the block's element into a holder `div`, put a `fragment` block
 * linking to the fragment's path in its place, run the block's parser on the moved element (block
 * discovery never sees it), and push `{ element: holder, path }` onto `params.fragments`.
 *
 * Needs `payload.parsers` (the import script's parser registry).
 */

function pageKey(u) {
  try {
    const { origin, pathname } = new URL(u);
    return `${origin}${pathname.replace(/\/$/, '')}`;
  } catch (e) {
    return u;
  }
}

function query(document, selector) {
  try {
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { template, parsers = {}, params = {} } = payload || {};
  const document = (element && element.ownerDocument) || (payload && payload.document);
  if (!document || !template || !Array.isArray(template.fragments)) return;
  const url = params.originalURL || payload.url || '';
  const key = pageKey(url);
  if (!Array.isArray(params.fragments)) params.fragments = [];

  template.fragments.forEach((fragment) => {
    const parser = parsers[fragment.block];
    const [, selectors = []] = Object.entries(fragment.pages || {}).find(([u]) => pageKey(u) === key) || [];
    if (!parser || selectors.length === 0) return;

    // Resolve every element before moving any, so moves can't shift later :nth-child selectors.
    // `paths` (optional): the n-th selector on a page holds a different shared content group
    // and goes to the n-th path (e.g. two distinct mortgage contact strips on one page).
    const elements = selectors.map((selector, i) => ({ el: query(document, selector), i })).filter((e) => e.el);
    const holders = {};
    let firstText = null;
    elements.forEach(({ el, i }) => {
      if (!el.isConnected) return;
      const path = (Array.isArray(fragment.paths) && fragment.paths[i]) || fragment.path;
      const text = textKey(el);
      if (!fragment.paths) {
        // Without positional paths the content must be identical; leave anything else in place
        // so block discovery parses it as a regular block.
        if (firstText === null) firstText = text;
        else if (text !== firstText) return;
      }
      const link = document.createElement('a');
      link.href = path;
      link.textContent = path;
      const reference = WebImporter.Blocks.createBlock(document, { name: 'Fragment', cells: [[link]] });
      el.replaceWith(reference);
      // The content is identical everywhere it appears, so the fragment document holds it once.
      if (holders[path]) return;
      const holder = document.createElement('div');
      holders[path] = holder;
      holder.append(el);
      try {
        parser(el, { document, url: payload.url, params });
      } catch (e) {
        console.error(`Fragment ${path}: ${fragment.block} parser failed:`, e);
      }
      params.fragments.push({ element: holder, path });
    });
  });
}

function textKey(el) {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}
