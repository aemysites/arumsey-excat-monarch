/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-message-page.js
  var import_message_page_exports = {};
  __export(import_message_page_exports, {
    default: () => import_message_page_default
  });

  // tools/importer/parsers/hero-banner.js
  var JUNK = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent(el) {
    return !!(text(el) || el.querySelector("img"));
  }
  function topLevel(root, selector) {
    const all = [...root.querySelectorAll(selector)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }
  function flatten(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text(para) || para.querySelector("img"))) out.push(para);
      para = null;
    };
    const walk = (node) => {
      if (node.nodeType === 3) {
        if (!node.textContent.trim()) {
          if (para) para.append(node);
          return;
        }
        if (!para) para = document.createElement("p");
        para.append(node);
        return;
      }
      if (node.nodeType !== 1) return;
      if (BLOCK_TAGS.test(node.tagName)) {
        flush();
        if (text(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
        flush();
        [...node.childNodes].forEach(walk);
        flush();
        return;
      }
      if (node.tagName === "BR" && !para) return;
      if (!para) para = document.createElement("p");
      para.append(node);
    };
    nodes.forEach((n) => walk(n));
    flush();
    return out;
  }
  function cleanNode(root) {
    root.querySelectorAll(JUNK).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  var ORIGIN = "https://www.suncorp.com.au";
  function backgroundImage(root, document) {
    const bg = root.querySelector(".canvas__bg_image") || (root.matches(".canvas__bg_image") ? root : null);
    const scope = root.closest(".canvas__container") || root;
    const styles = [...scope.querySelectorAll("style")];
    const id = bg && bg.id;
    const urls = [];
    styles.forEach((s) => {
      const css = s.textContent || "";
      const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
      let m = re.exec(css);
      while (m) {
        urls.push({ url: m[1], own: id ? css.includes(`#${id}`) : true });
        m = re.exec(css);
      }
    });
    const inline = bg && (bg.getAttribute("style") || "").match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (inline) urls.unshift({ url: inline[1], own: true });
    if (!bg && !urls.length) {
      const sectionBg = root.querySelector('.contentBoxContainer__section__bgImage[style*="url("]') || (root.matches(".contentBoxContainer__section__bgImage") ? root : null);
      const sm = sectionBg && (sectionBg.getAttribute("style") || "").replace(/&quot;/g, '"').match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
      if (sm) {
        const img2 = document.createElement("img");
        img2.src = /^https?:/.test(sm[1]) ? sm[1] : `${ORIGIN}${sm[1].startsWith("/") ? "" : "/"}${sm[1]}`;
        img2.alt = sectionBg.getAttribute("title") || "";
        return img2;
      }
    }
    const pick = urls.find((u) => u.own && !/\/renditions\//.test(u.url)) || urls.find((u) => !/\/renditions\//.test(u.url));
    if (!pick) return null;
    const img = document.createElement("img");
    img.src = /^https?:/.test(pick.url) ? pick.url : `${ORIGIN}${pick.url.startsWith("/") ? "" : "/"}${pick.url}`;
    img.alt = bg && bg.getAttribute("title") || "";
    return img;
  }
  function textBoxes(root) {
    const boxes = topLevel(root, ".contentBoxContainer").filter(hasContent);
    const mid = root.querySelector(".Middle-column");
    if (boxes.length === 1 && mid && mid.contains(boxes[0])) {
      const outside = text(mid).replace(text(boxes[0]), "").trim();
      if (outside.length > 15 || mid.querySelector("h1, h2")) return [mid];
    }
    if (boxes.length) return boxes;
    return mid && hasContent(mid) ? [mid] : [];
  }
  function heroVariant(root, boxes) {
    const main = boxes[0];
    if (!main) return null;
    if (/content-box-border-top-/.test(main.className)) return "promo-card";
    const isInlineImg = (i) => {
      const p = i.closest("p, li");
      return !!(p && main.contains(p) && text(p));
    };
    const boxImgs = [...main.querySelectorAll("img")];
    if (boxImgs.length && !boxImgs.every(isInlineImg) && main !== root.querySelector(".Middle-column")) return "logo";
    if (boxes.length > 1) return "offer-box";
    if (/sg-Cell--secondary|sg-u-bgSecondary|cyan/i.test(main.className)) return "text-box-cyan";
    if (/sg-Cell--neutral/.test(main.className)) return "text-box-2";
    if (/sg-Cell--light/.test(main.className)) {
      const col = main.closest('[class*="sg-Grid-col"]');
      const prev = col && col.previousElementSibling;
      if (prev && /sg-Grid-col/.test(prev.className) && !hasContent(prev)) return "text-box";
      return null;
    }
    if (main.matches(".contentBoxContainer")) return "text-overlay";
    return null;
  }
  function boldSpans(box, document) {
    box.querySelectorAll("span.sg-Type--bold, span.sg-Type--prominent, span.sg-Type--title").forEach((span) => {
      if (span.closest("h1, h2, h3, h4, h5, h6, strong, b")) return;
      const t = text(span);
      if (!t) return;
      const linkText = [...span.querySelectorAll("a")].map((a) => a.textContent).join("").replace(/\s+/g, "");
      if (linkText && linkText === t.replace(/\s+/g, "")) return;
      const strong = document.createElement("strong");
      strong.append(...span.childNodes);
      span.replaceWith(strong);
    });
  }
  function boxContent(box, document) {
    cleanNode(box);
    boldSpans(box, document);
    box.querySelectorAll("a.sg-Btn").forEach((a) => {
      a.textContent = text(a);
      a.removeAttribute("class");
    });
    const cell = document.createElement("div");
    cell.append(...flatten([...box.childNodes], document));
    cell.querySelectorAll("a:not([href])").forEach((a) => {
      if (!text(a)) a.remove();
    });
    return cell;
  }
  function parse(element, { document, params }) {
    if (element.matches(".sg-Box-icon")) return;
    if (!element.closest(".canvas--responsive_image") && !element.matches(".canvas__bg_image, .canvas__container, section") && !element.querySelector("h1, h2, h3, h4, img, picture, .canvas__bg_image, .contentBoxContainer") && text(element).length < 60) return;
    let root = element;
    const canvas = element.closest(".canvas__container");
    if (!element.querySelector(".canvas__bg_image, .contentBoxContainer, .Middle-column") && canvas && (canvas.querySelector("section.canvas--responsive_image") || element.matches(".canvas__bg_image"))) {
      root = canvas;
    }
    const pickers = [...root.querySelectorAll("form.pageTabs")];
    pickers.forEach((form) => form.remove());
    const img = backgroundImage(root, document);
    const boxes = textBoxes(root);
    const ownBoxes = topLevel(root, ".contentBoxContainer").filter(hasContent);
    const variant = heroVariant(root, ownBoxes.length ? ownBoxes : boxes);
    const cells = [];
    if (img) cells.push([img]);
    boxes.forEach((box) => {
      const cell = boxContent(box, document);
      if (hasContent(cell)) cells.push([cell]);
    });
    if (!boxes.length && root === element && !img) {
      const cell = boxContent(element, document);
      if (hasContent(cell)) cells.push([cell]);
    }
    if (!cells.length) {
      pickers.forEach((form) => root.append(form));
      return;
    }
    const name = variant ? `hero-banner (${variant})` : "hero-banner";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (root === element) element.replaceWith(block);
    else root.replaceWith(block);
    block.after(...pickers);
  }

  // tools/importer/parsers/tag-label.js
  function text2(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function detectVariant(element) {
    if (element.matches(".cmp-experiencefragment--tag-lines") || element.querySelector(".cmp-experiencefragment--tag-lines, .sg-Type--tagLinePrimary")) return "not-covered";
    const tags = element.matches(".sg-Type--tagLine") ? [element] : [...element.querySelectorAll(".sg-Type--tagLine")];
    if (tags.length && tags.some((t) => t.querySelector("a[href]"))) return "alt";
    const cell = element.matches(".sg-Flextable-cell") ? element : null;
    if (cell && /sg-Flextable-cell--(dark|secondary)/.test(cell.className)) return "cyan";
    if (cell) return "grey";
    return null;
  }
  function parse2(element, { document, params }) {
    const variant = detectVariant(element);
    element.querySelectorAll("style, script").forEach((e) => e.remove());
    element.querySelectorAll('a[href^="javascript"], a:not([href])').forEach((a) => a.replaceWith(...a.childNodes));
    let row = [];
    if (variant === "alt") {
      const tags = element.matches(".sg-Type--tagLine") ? [element] : [...element.querySelectorAll(".sg-Type--tagLine")];
      row = tags.map((tag) => {
        const a = tag.querySelector("a[href]");
        if (!a) return text2(tag);
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = text2(a);
        return link;
      }).filter(Boolean);
    } else {
      const rtes = [...element.querySelectorAll("div.rte")].filter((r) => !r.parentElement.closest("div.rte"));
      const sources = rtes.length ? rtes : [element];
      row = sources.map((r) => {
        const cell = document.createElement("div");
        [...r.children].forEach((child) => {
          if (!text2(child) && !child.querySelector("img")) return;
          cell.append(child);
        });
        if (!cell.children.length && text2(r)) cell.textContent = text2(r);
        return cell;
      }).filter((c) => text2(c));
    }
    const used = /* @__PURE__ */ new Set();
    row.forEach((c) => {
      if (c && c.querySelectorAll) c.querySelectorAll("a[href]").forEach((a) => used.add(a.getAttribute("href")));
    });
    const ctas = [...element.querySelectorAll("a[href]")].filter((a) => text2(a) && !used.has(a.getAttribute("href")) && !row.some((c) => c === a || c.contains && c.contains(a))).map((a) => {
      const p = document.createElement("p");
      const strong = a.closest("strong, em");
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = text2(a);
      if (strong) {
        const wrap = document.createElement(strong.tagName.toLowerCase());
        wrap.append(link);
        p.append(wrap);
      } else p.append(link);
      return p;
    });
    const name = variant ? `tag-label (${variant})` : "tag-label";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
    element.replaceWith(block);
    block.after(...ctas);
  }

  // tools/importer/parsers/accordion-panel.js
  var COMPLEX = ".sg-Flextable, .sg-Grid, table, img, picture, video, iframe, .sg-Accordion, .youtubevideo";
  function pagePath(document, params) {
    let u = params && params.originalURL;
    if (!u) {
      try {
        const canonical = document.querySelector('link[rel="canonical"]');
        u = canonical && canonical.href || document.location.href;
      } catch (e) {
      }
    }
    try {
      const p = new URL(u).pathname.replace(/\.html?$/, "").replace(/^\/+|\/+$/g, "");
      return p || "index";
    } catch (e) {
      return "page";
    }
  }
  function slugify(s) {
    return (s || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "item";
  }
  function fragmentPath(document, params, label) {
    const base = `/fragments/${pagePath(document, params)}/${slugify(label)}`;
    const used = params && params.fragments ? params.fragments.map((f) => f.path) : [];
    let path = base;
    let n = 2;
    while (used.includes(path)) {
      path = `${base}-${n}`;
      n += 1;
    }
    return path;
  }
  function cleanTree(root) {
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
    root.querySelectorAll("style").forEach((s) => s.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
  }
  function text3(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent2(el) {
    return !!(text3(el) || el.querySelector("img, picture, video, iframe, table"));
  }
  function topAccordions(root) {
    if (root.matches(".sg-Accordion")) return [root];
    return [...root.querySelectorAll(".sg-Accordion")].filter((acc) => !acc.parentElement.closest(".sg-Accordion") || !root.contains(acc.parentElement.closest(".sg-Accordion")));
  }
  function buildItem(acc, document, params) {
    const label = acc.matches("button") ? acc : acc.querySelector(
      ":scope > .sg-Accordion-label, :scope > button, :scope > div > .sg-Accordion-label, :scope > div > button"
    );
    let panel = null;
    if (label && label.getAttribute("aria-controls")) {
      const id = label.getAttribute("aria-controls");
      panel = [...(acc.matches("button") ? acc.parentElement || acc : acc).querySelectorAll(".sg-Accordion-content")].find((p) => p.id === id) || null;
      if (!panel && acc.matches("button")) {
        const next = acc.nextElementSibling;
        if (next && next.matches(".sg-Accordion-content")) panel = next;
      }
    }
    if (!panel && !acc.matches("button")) {
      panel = acc.querySelector(":scope > .sg-Accordion-content, :scope > div > .sg-Accordion-content");
    }
    const labelText = text3(label) || "Details";
    const body = document.createElement("div");
    if (panel) {
      cleanTree(panel);
      body.append(...panel.childNodes);
      if (acc.matches("button")) panel.remove();
    }
    let bodyCell = body.childNodes.length ? body : "";
    if (body.querySelector(COMPLEX) && params && Array.isArray(params.fragments)) {
      const path = fragmentPath(document, params, labelText);
      params.fragments.push({ element: body, path });
      const link = document.createElement("a");
      link.href = path;
      link.textContent = path;
      bodyCell = link;
    }
    if (label && /^H[1-6]$/.test(label.tagName) && text3(label)) {
      const h = document.createElement(label.tagName.toLowerCase());
      h.textContent = labelText;
      return [h, bodyCell];
    }
    return [labelText, bodyCell];
  }
  function detectVariant2(element, accordions) {
    const first = accordions[0];
    const label = first && (first.matches("button") ? first : first.querySelector(".sg-Accordion-label"));
    if (element.matches("button")) return "terms";
    if (label && (label.classList.contains("is-selected") || first.querySelector && first.querySelector(":scope > .sg-Accordion-content.is-open"))) return "terms";
    if (element.matches(".sg-Flextable-cell, .sg-Flextable") || element.closest(".sg-Flextable-cell")) return "lined";
    const row = element.querySelector(".sg-Grid-row");
    if (row) {
      const cols = [...row.children].filter((c) => /sg-Grid-col/.test(c.className) && hasContent2(c));
      const withAcc = cols.filter((c) => c.querySelector(".sg-Accordion"));
      if (cols.length >= 2 && withAcc.length >= 1 && withAcc.length < cols.length) return "sidebar";
      if (withAcc.length >= 2) return "two-column";
    }
    return null;
  }
  function parse3(element, { document, params }) {
    const accordions = topAccordions(element);
    const variant = detectVariant2(element, accordions);
    const cells = [];
    let asideCols = [];
    if (variant === "sidebar") {
      const row = element.querySelector(".sg-Grid-row");
      asideCols = [...row.children].filter((c) => /sg-Grid-col/.test(c.className) && hasContent2(c) && !c.querySelector(".sg-Accordion"));
    }
    const inAside = (el) => asideCols.some((c) => c.contains(el));
    if (element.matches("button, .sg-Accordion")) {
      cells.push(buildItem(element, document, params));
      if (element.matches(".sg-Accordion")) {
        let next = element.nextElementSibling;
        while (next && next.matches(".sg-Accordion") && !next.querySelector(":scope > .sg-Accordion-content.is-open")) {
          const following = next.nextElementSibling;
          cells.push(buildItem(next, document, params));
          next.remove();
          next = following;
        }
      }
    } else {
      const units = [...element.querySelectorAll(".sg-Accordion, div.rte, .contentBoxContainer")].filter((el) => !inAside(el)).filter((el) => {
        const outer = el.parentElement && el.parentElement.closest(".sg-Accordion, div.rte, .contentBoxContainer");
        return !outer || !element.contains(outer);
      });
      units.forEach((unit) => {
        if (unit.matches(".sg-Accordion")) {
          cells.push(buildItem(unit, document, params));
        } else if (hasContent2(unit)) {
          cleanTree(unit);
          const cell = document.createElement("div");
          cell.append(...unit.childNodes);
          cells.push([cell]);
        }
      });
    }
    if (asideCols.length) {
      const aside = document.createElement("div");
      asideCols.forEach((col) => {
        cleanTree(col);
        aside.append(...col.childNodes);
      });
      cells.push([aside]);
    }
    const name = variant ? `accordion-panel (${variant})` : "accordion-panel";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/suncorp-migrated-paths.js
  var suncorp_migrated_paths_default = ["/", "/about-us", "/about-us/legal", "/about-us/legal/accessibility", "/about-us/legal/code-of-conduct", "/about-us/legal/cookie-and-data-policy", "/about-us/legal/foreign-tax-compliance", "/about-us/legal/online-terms", "/about-us/legal/privacy", "/about-us/legal/privacy/complaints", "/about-us/partnerships", "/about-us/partnerships/get-ready-qld", "/about-us/partnerships/netball-australia", "/about-us/partnerships/new-sponsorships", "/about-us/partnerships/north-queensland-cowboys", "/about-us/partnerships/qld-ses", "/about-us/partnerships/suncorp-stadium", "/about-us/partnerships/teamgirls", "/about-us/partnerships/teamgirls/confident-girls-foundation", "/about-us/partnerships/teamgirls/partners", "/about-us/partnerships/teamgirls/suncorp-netsetgo", "/contact-us", "/contact-us/barristers-professional-indemnity", "/contact-us/car-vehicle", "/contact-us/ctp", "/contact-us/health-insurance", "/contact-us/home-property", "/contact-us/insurance-fraud", "/contact-us/life-income", "/contact-us/service-legal-documents", "/contact-us/thank-you", "/distributor-disclosure", "/help-support", "/home-c", "/home-contents-explained", "/home-contents-explained/contents", "/home-contents-explained/contents/Items-that-are-part-of-a-unit", "/home-contents-explained/contents/a-motor-vehicle-motor-bike-motorcycle", "/home-contents-explained/contents/accessories-and-spare-parts", "/home-contents-explained/contents/accidental-breakage-of-glass-contents", "/home-contents-explained/contents/accidental-damage-at-home-contents", "/home-contents-explained/contents/anything-defined-as-the-home", "/home-contents-explained/contents/bicycle", "/home-contents-explained/contents/broken-electrical-items", "/home-contents-explained/contents/carpets-and-rugs-hand-woven-or-hand-knotted", "/home-contents-explained/contents/cash-smart-cards-phone-cards-and-documents-able-to-be-cashed-or-traded", "/home-contents-explained/contents/clothing", "/home-contents-explained/contents/collections-sets-and-memorabilia", "/home-contents-explained/contents/common-property", "/home-contents-explained/contents/contents-in-a-vehicle-designed-for-the-temporary-accommodation-of-people-and-animals", "/home-contents-explained/contents/contents-in-commercial-storage", "/home-contents-explained/contents/contents-in-transit", "/home-contents-explained/contents/contents-on-common-property", "/home-contents-explained/contents/contents-temporarily-removed", "/home-contents-explained/contents/costs-to-re-establish-important-documents", "/home-contents-explained/contents/cryptocurrency-or-non-fungible-tokens-nfts", "/home-contents-explained/contents/damage-from-physical-injury-or-incident", "/home-contents-explained/contents/drones", "/home-contents-explained/contents/electronic-files-for-which-you-do-not-have-a-licence", "/home-contents-explained/contents/fatal-injury-compensation-contents", "/home-contents-explained/contents/floating-floors", "/home-contents-explained/contents/floating-wooden-floors-units-only", "/home-contents-explained/contents/food-and-medication-spoilage", "/home-contents-explained/contents/furniture-and-furnishings", "/home-contents-explained/contents/general-contents", "/home-contents-explained/contents/golf-cart-and-buggy-wheelchairs-and-mobility-scooters-or-similar-aids", "/home-contents-explained/contents/home-computers-and-electronic-tablets-laptops-phones-unfixed-electrical-goods-and-appliances", "/home-contents-explained/contents/if-contents-are-insured-in-a-unit", "/home-contents-explained/contents/injury-to-pet-dogs-and-cats-contents-only", "/home-contents-explained/contents/internal-blinds-drapes-and-curtains", "/home-contents-explained/contents/items-that-are-or-were-stock-or-samples-related-to-any-business-activities", "/home-contents-explained/contents/jewellery-and-watches", "/home-contents-explained/contents/keys-vehicle-watercraft-or-aircraft", "/home-contents-explained/contents/lino-units-only", "/home-contents-explained/contents/lock-replacement-contents", "/home-contents-explained/contents/loose-compacted-sand-soil-lawn-artificial-grass-gravel-pebbles-rocks-granular-rubber-or-water", "/home-contents-explained/contents/matching-undamaged-parts-contents", "/home-contents-explained/contents/medical-equipment-and-aids", "/home-contents-explained/contents/motor-burnout-contents", "/home-contents-explained/contents/personal-valuables-specified-items", "/home-contents-explained/contents/personal-valuables-unspecified-items", "/home-contents-explained/contents/pets-or-animals", "/home-contents-explained/contents/plants-trees-shrubs-and-hedges-in-the-ground", "/home-contents-explained/contents/portable-advantages", "/home-contents-explained/contents/pot-plants", "/home-contents-explained/contents/prevention-of-access-when-you-have-contents-cover", "/home-contents-explained/contents/remote-controlled-model-or-toy-model-car", "/home-contents-explained/contents/remote-controlled-model-or-toy-watercraft-or-aircraft", "/home-contents-explained/contents/removal-of-debris-contents", "/home-contents-explained/contents/ride-on-mowers", "/home-contents-explained/contents/security-attendance-fees-contents", "/home-contents-explained/contents/spas-and-air-conditioners-units-only", "/home-contents-explained/contents/storage-of-undamaged-contents", "/home-contents-explained/contents/supplementary-living-expenses-contents", "/home-contents-explained/contents/surfboards-sailboards-kite-surfing-equipment-canoes-kayaks-and-non-motorised-surf-skis", "/home-contents-explained/contents/temporary-accommodation-for-tenants-and-strata-title-owners", "/home-contents-explained/contents/tools-of-trade", "/home-contents-explained/contents/uncut-and-unset-gems-gold-or-silver-nuggets-bullion-and-ingots", "/home-contents-explained/contents/unfitted-accessories-of-any-vehicle-watercraft-or-aircraft", "/home-contents-explained/contents/unlicensed-or-unregistered-firearms", "/home-contents-explained/contents/used-or-applied-chemicals-fertilisers-and-pesticides", "/home-contents-explained/contents/visitors-contents", "/home-contents-explained/contents/wall-paint-and-paper-nsw-units-only", "/home-contents-explained/contents/wear-tear-or-deterioration-contents", "/home-contents-explained/contents/works-of-art", "/home-contents-explained/events", "/home-contents-explained/events/actions-or-movements-of-the-sea", "/home-contents-explained/events/aircraft-shock-waves", "/home-contents-explained/events/asbestos", "/home-contents-explained/events/biological-chemical-other-pollutant-or-containment", "/home-contents-explained/events/breaking-the-law", "/home-contents-explained/events/building-extensions-alterations-or-renovations", "/home-contents-explained/events/bushfires-storms-storm-surges-floods-tsunamis-first-72-hours-of-cover", "/home-contents-explained/events/chemical-damage-when-cleaning", "/home-contents-explained/events/chips-and-scratches", "/home-contents-explained/events/communicable-disease", "/home-contents-explained/events/computer-virus-or-computer-hacking", "/home-contents-explained/events/confiscation-or-damage-by-legal-authority", "/home-contents-explained/events/damage-by-an-animal", "/home-contents-explained/events/defects-faults-or-workmanship", "/home-contents-explained/events/deliberate-damage-to-a-reservoir-or-dam", "/home-contents-explained/events/deliberate-or-reckless-actions", "/home-contents-explained/events/earthquake-and-tsunami", "/home-contents-explained/events/escape-of-liquid", "/home-contents-explained/events/explosion", "/home-contents-explained/events/extra-costs-or-other-losses-following-an-incident-covered-by-your-policy", "/home-contents-explained/events/fire-including-bushfire", "/home-contents-explained/events/floods", "/home-contents-explained/events/ground-movement", "/home-contents-explained/events/hazardous-materials", "/home-contents-explained/events/home-unit-or-contents-that-are-not-in-good-condition", "/home-contents-explained/events/impact", "/home-contents-explained/events/legal-liability", "/home-contents-explained/events/legal-liability-agreements-you-enter-into", "/home-contents-explained/events/legal-liability-animals", "/home-contents-explained/events/legal-liability-buildings-property-or-land-not-at-the-insured-address", "/home-contents-explained/events/legal-liability-business-activity", "/home-contents-explained/events/legal-liability-caravans-or-trailers", "/home-contents-explained/events/legal-liability-committee-members-or-officials", "/home-contents-explained/events/legal-liability-death-or-injury", "/home-contents-explained/events/legal-liability-defamation-or-copyright", "/home-contents-explained/events/legal-liability-drones-aerial-devices-or-other-autonomously-piloted-aircraft", "/home-contents-explained/events/legal-liability-fines-penalties-and-other-damages", "/home-contents-explained/events/legal-liability-legal-actions-in-other-countries", "/home-contents-explained/events/legal-liability-motor-vehicles-or-motorcycles", "/home-contents-explained/events/legal-liability-property-owned-by-you-or-property-in-your-physical-or-legal-custody", "/home-contents-explained/events/legal-liability-watercraft", "/home-contents-explained/events/legal-liability-your-employees", "/home-contents-explained/events/lightning", "/home-contents-explained/events/malicious-acts-and-vandalism", "/home-contents-explained/events/mechanical-or-electrical-breakdown-or-failure", "/home-contents-explained/events/medical-equipment-and-aids", "/home-contents-explained/events/mould-or-mildew", "/home-contents-explained/events/not-complying-with-building-laws-or-regulations", "/home-contents-explained/events/photographs-electronic-data-and-images", "/home-contents-explained/events/power-surge", "/home-contents-explained/events/radioactivity-nuclear-materials", "/home-contents-explained/events/renting-entire-home-or-unit", "/home-contents-explained/events/replacement-of-water", "/home-contents-explained/events/revolution-war", "/home-contents-explained/events/riot-civil-commotion-or-public-disturbance", "/home-contents-explained/events/roots-of-trees-shrubs-and-plants", "/home-contents-explained/events/rust-or-corrosion", "/home-contents-explained/events/sale-of-home-contents-or-personal-valuables", "/home-contents-explained/events/sanctions", "/home-contents-explained/events/scooters-skateboards-ebicycles-unicycles-hoverboards-one-wheels-or-segways", "/home-contents-explained/events/seepage-of-water", "/home-contents-explained/events/silica-and-its-derivatives", "/home-contents-explained/events/squatters-or-trespassers", "/home-contents-explained/events/storm-including-hail", "/home-contents-explained/events/storm-surge", "/home-contents-explained/events/structural-improvements-at-units", "/home-contents-explained/events/terrorism", "/home-contents-explained/events/theft-or-burglary", "/home-contents-explained/events/tree-lopping", "/home-contents-explained/events/wear-tear-and-gradual-deterioration", "/home-contents-explained/home", "/home-contents-explained/home/Accidental-damage-at-home", "/home-contents-explained/home/a-hotel-motel-or-boarding-house", "/home-contents-explained/home/accidental-breakage-of-glass-home", "/home-contents-explained/home/air-conditioners-attached-within-a-window", "/home-contents-explained/home/any-building-or-part-of-a-building-which-is-legally-part-of-a-strata-title-building", "/home-contents-explained/home/any-new-building-under-construction", "/home-contents-explained/home/anything-defined-as-contents", "/home-contents-explained/home/boat-jetties-pontoons-mooring-poles-and-their-attachments-and-accessories", "/home-contents-explained/home/build-it-back-better", "/home-contents-explained/home/carpets-rugs-blinds-drapes-or-curtains", "/home-contents-explained/home/common-property", "/home-contents-explained/home/damage-from-physical-injury-or-incident", "/home-contents-explained/home/damage-to-gardens-and-plants", "/home-contents-explained/home/dead-weight-moorings", "/home-contents-explained/home/decks-pergolas-pagodas-verandas-and-balconies", "/home-contents-explained/home/emergency-repairs-and-other-repair-rebuilding-cost", "/home-contents-explained/home/energy-costs-for-loss-of-supply-of-renewable-energy", "/home-contents-explained/home/excess-free-glass-cover", "/home-contents-explained/home/exploratory-costs-where-the-leak-is-not-covered-under-insured-event-escape-of-liquid", "/home-contents-explained/home/fatal-injury-compensation", "/home-contents-explained/home/fencing", "/home-contents-explained/home/fixed-swimming-pools-and-spas", "/home-contents-explained/home/floating-wooden-floors", "/home-contents-explained/home/garages-and-carports", "/home-contents-explained/home/garden-borders-sealed-pathways-and-paved-or-concreted-floor-areas", "/home-contents-explained/home/gas-appliances-permanently-plumbed-to-a-gas-supply", "/home-contents-explained/home/granny-flats-sheds-and-outbuildings", "/home-contents-explained/home/home-used-for-farming", "/home-contents-explained/home/inflatable-or-portable-swimming-pools-and-spas", "/home-contents-explained/home/lino-installed-whether-permanently-attached-or-not", "/home-contents-explained/home/lock-replacement", "/home-contents-explained/home/loose-or-compacted-soil-sand-lawn-artificial-grass-gravel-pebbles-or-rocks", "/home-contents-explained/home/matching-undamaged-parts", "/home-contents-explained/home/mortgage-discharge-costs", "/home-contents-explained/home/motor-burnout-at-home", "/home-contents-explained/home/other-repair-rebuilding-costs", "/home-contents-explained/home/outdoor-walls-gates-and-retaining-walls", "/home-contents-explained/home/paraplegia-or-quadriplegia-assistance", "/home-contents-explained/home/permanently-attached-fixtures-including-wall-ceiling-and-floor-coverings", "/home-contents-explained/home/permanently-fixed-outdoor-items", "/home-contents-explained/home/plants-trees-shrubs-and-hedges-in-the-ground", "/home-contents-explained/home/prevention-of-access-when-you-have-home-cover", "/home-contents-explained/home/removal-of-debris-home", "/home-contents-explained/home/safety-net-home-protection", "/home-contents-explained/home/sealed-driveways-and-sealed-roads", "/home-contents-explained/home/security-attendance-fees", "/home-contents-explained/home/services-eg-a-water-or-waste-line", "/home-contents-explained/home/storage-tanks", "/home-contents-explained/home/suncorp-insurance-home-assist", "/home-contents-explained/home/supplementary-living-expenses-home", "/home-contents-explained/home/temporary-accommodation-when-you-have-home-cover", "/home-contents-explained/home/temporary-or-mobile-structures", "/home-contents-explained/home/tennis-courts", "/home-contents-explained/home/uninstalled-building-fittings-fixtures-and-materials", "/home-contents-explained/home/used-or-applied-chemicals-fertilisers-or-pesticides", "/home-contents-explained/home/wear-tear-or-deterioration", "/home-contents-explained/search", "/insurance", "/insurance/awards", "/insurance/barristers-professional-indemnity", "/insurance/barristers-professional-indemnity/claims", "/insurance/barristers-professional-indemnity/payments", "/insurance/boat", "/insurance/boat/claims", "/insurance/boat/comparison", "/insurance/car", "/insurance/car/comprehensive", "/insurance/car/comprehensive/claims", "/insurance/car/comprehensive/comparison", "/insurance/car/comprehensive/roadside-assistance", "/insurance/car/motor-repairer-network", "/insurance/car/payments-renewals", "/insurance/car/repairer", "/insurance/car/roadside-assist-terms-and-conditions", "/insurance/car/third-party", "/insurance/car/third-party/claims", "/insurance/caravan", "/insurance/caravan/claims", "/insurance/caravan/payments-renewals", "/insurance/claims", "/insurance/claims/barristers-professional-indemnity", "/insurance/claims/boat-insurance", "/insurance/claims/car-third-party-insurance", "/insurance/claims/comprehensive-car", "/insurance/claims/ctp-insurance", "/insurance/claims/home-insurance", "/insurance/claims/motorcycle-comprehensive", "/insurance/claims/motorcycle-third-party-fire-and-theft", "/insurance/claims/motorhome-caravan-trailer", "/insurance/claims/strata-insurance", "/insurance/claims/travel", "/insurance/community-support-resources", "/insurance/contact-us/customer-relations-complaints", "/insurance/contact-us/customer-relations-complaints/ctp", "/insurance/contact-us/customer-relations-complaints/general-insurance", "/insurance/contact-us/customer-relations-complaints/health", "/insurance/ctp", "/insurance/ctp/certificate", "/insurance/ctp/claims", "/insurance/ctp/payments-renewals", "/insurance/ctp/qld-ctp-claims-explained", "/insurance/customer-remediation", "/insurance/customer-support-locations", "/insurance/difficult-circumstances", "/insurance/domestic-and-family-violence-policy", "/insurance/extreme-weather-assistance", "/insurance/extreme-weather-assistance/bushfire", "/insurance/extreme-weather-assistance/cash-settlements", "/insurance/extreme-weather-assistance/cyclone", "/insurance/extreme-weather-assistance/earthquake", "/insurance/extreme-weather-assistance/emotional-readiness-guide", "/insurance/extreme-weather-assistance/emotional-recovery-guide", "/insurance/extreme-weather-assistance/faqs", "/insurance/extreme-weather-assistance/faqs/bushfire", "/insurance/extreme-weather-assistance/faqs/cyclone", "/insurance/extreme-weather-assistance/faqs/earthquake", "/insurance/extreme-weather-assistance/faqs/floodstorm", "/insurance/extreme-weather-assistance/faqs/hail", "/insurance/extreme-weather-assistance/floodstorm", "/insurance/extreme-weather-assistance/hail", "/insurance/extreme-weather-assistance/helping-others-prepare-guide", "/insurance/extreme-weather-assistance/helping-others-recover-guide", "/insurance/extreme-weather-assistance/home-maintenance-guide", "/insurance/extreme-weather-assistance/rebuilding-your-home", "/insurance/extreme-weather-assistance/safety-with-lithium-ion-batteries", "/insurance/extreme-weather-assistance/temporary-accommodation", "/insurance/extreme-weather-assistance/third-party-claims-representatives-home-insurance", "/insurance/faqs", "/insurance/faqs/boat", "/insurance/faqs/boat/boat-cover", "/insurance/faqs/boat/boat-options", "/insurance/faqs/boat/geographic-limit", "/insurance/faqs/boat/lay-up", "/insurance/faqs/boat/motor-break-down", "/insurance/faqs/boat/theft", "/insurance/faqs/boat/towing-my-boat", "/insurance/faqs/boat/water-skier", "/insurance/faqs/car", "/insurance/faqs/car/cancel-policy", "/insurance/faqs/car/covered-drivers", "/insurance/faqs/car/hire-car", "/insurance/faqs/car/increasing-premium", "/insurance/faqs/car/roadside-assist", "/insurance/faqs/car/suncorp-cover-ride-sharing-services", "/insurance/faqs/ctp", "/insurance/faqs/ctp/accident-my-fault", "/insurance/faqs/ctp/change-address", "/insurance/faqs/ctp/claim-serious-injury", "/insurance/faqs/ctp/complaint-or-resolve-dispute", "/insurance/faqs/ctp/ctp-check", "/insurance/faqs/ctp/damage-cover", "/insurance/faqs/ctp/death-loved-one", "/insurance/faqs/ctp/difference-between-ctp-comprehensive", "/insurance/faqs/ctp/do-i-need-to-report-the-accident-to-the-police", "/insurance/faqs/ctp/how-are-general-damages-calculated", "/insurance/faqs/ctp/how-do-i-make-a-claim-for-my-child", "/insurance/faqs/ctp/how-do-i-receive-treatment-and-rehabilitation-of-my-injuries", "/insurance/faqs/ctp/how-is-liability-determined-for-ctp-claim", "/insurance/faqs/ctp/how-long-do-i-have-to-lodge-my-claim", "/insurance/faqs/ctp/how-long-does-a-ctp-claim-take", "/insurance/faqs/ctp/moving-interstate", "/insurance/faqs/ctp/register-complaint-dispute", "/insurance/faqs/ctp/renew-ctp-policy", "/insurance/faqs/ctp/what-are-general-damages", "/insurance/faqs/ctp/what-can-i-claim-for", "/insurance/faqs/ctp/what-clearances-required-other-statutory-before-settlement-paid", "/insurance/faqs/ctp/what-do-i-need-to-start-my-claim", "/insurance/faqs/ctp/what-evidence-is-used-to-assess-general-damages", "/insurance/faqs/ctp/what-happens-after-ive-lodged-my-claim", "/insurance/faqs/ctp/what-happens-when-i-accept-offer-of-settlement-ctp", "/insurance/faqs/ctp/what-if-I-have-multiple-injuries-from-one-incident", "/insurance/faqs/ctp/what-if-im-unsure-which-provider-to-go-with-for-my-treatment", "/insurance/faqs/ctp/what-is-economic-loss", "/insurance/faqs/ctp/what-is-independent-medical-examination", "/insurance/faqs/ctp/what-is-medical-certificate-and-how-do-i-get-ctp", "/insurance/faqs/ctp/what-is-medicare-compensation-recovery", "/insurance/faqs/ctp/what-medical-expenses-can-i-claim", "/insurance/faqs/ctp/what-other-benefits-can-I-access-while-making-my-ctp-claim", "/insurance/faqs/ctp/when-can-settle-my-ctp-claim", "/insurance/faqs/ctp/when-will-i-receive-my-compensation", "/insurance/faqs/ctp/why-do-I-need-to-sign-a-claim-form", "/insurance/faqs/ctp/why-need-ctp-insurance", "/insurance/faqs/funeral", "/insurance/faqs/funeral/beneficiary", "/insurance/faqs/funeral/early-payment-benefit", "/insurance/faqs/funeral/financial-hardship", "/insurance/faqs/funeral/joint-policy", "/insurance/faqs/funeral/make-a-claim", "/insurance/faqs/funeral/nz-citizen", "/insurance/faqs/funeral/policy-owner", "/insurance/faqs/funeral/pre-paid-funeral-plans", "/insurance/faqs/funeral/premium-frequency", "/insurance/faqs/general", "/insurance/faqs/general/How-long-can-I-delay-debit-for", "/insurance/faqs/general/accessing-suncorp-insurance-app-overseas", "/insurance/faqs/general/am-i-eligible-to-access-my-home", "/insurance/faqs/general/can-i-add-my-own-personal-home-maintenance-tasks-to-the-app", "/insurance/faqs/general/can-i-complete-the-task-more-often", "/insurance/faqs/general/can-i-lodge-a-claim-in-suncorp-insurance-app", "/insurance/faqs/general/certificate-of-currency", "/insurance/faqs/general/certificate-of-insurance", "/insurance/faqs/general/difference-between-suncorp-insurance-app-my-suncorp", "/insurance/faqs/general/do-you-have-professional-tradespeople", "/insurance/faqs/general/does-my-home-require-internet-connection", "/insurance/faqs/general/error-linking-policies-suncorp-insurance-app", "/insurance/faqs/general/excess-premiums-home-car", "/insurance/faqs/general/feedback-on-suncorp-insurance-app", "/insurance/faqs/general/finalised-claim", "/insurance/faqs/general/find-my-policy-number", "/insurance/faqs/general/forgot-my-suncorp-insurance-app-pin-password", "/insurance/faqs/general/how-do-I-add-an-authorised-contact-to-my-policy", "/insurance/faqs/general/how-do-I-add-an-interested-party-to-my-policy", "/insurance/faqs/general/how-do-i-access-my-home", "/insurance/faqs/general/how-do-i-link-update-or-delete-my-card", "/insurance/faqs/general/how-does-my-home-work", "/insurance/faqs/general/how-does-suncorp-develop-and-distribute-its-insurance-products", "/insurance/faqs/general/how-is-my-information-handled", "/insurance/faqs/general/how-secure-is-my-information-suncorp-insurance-app", "/insurance/faqs/general/how-secure-is-suncorp-insurance-app", "/insurance/faqs/general/how-to-download-suncorp-insurance-app", "/insurance/faqs/general/how-to-find-policy-number-suncorp-insurance-app", "/insurance/faqs/general/how-to-link-CTP-policy-suncorp-insurance-app", "/insurance/faqs/general/how-to-link-my-policies-suncorp-insurance-app", "/insurance/faqs/general/how-to-track-my-claim-suncorp-insurance-app", "/insurance/faqs/general/how-will-my-data-be-used", "/insurance/faqs/general/i-am-having-technical-issues", "/insurance/faqs/general/i-have-more-than-one-property", "/insurance/faqs/general/is-there-in-app-support", "/insurance/faqs/general/joint-customer-list-of-tasks", "/insurance/faqs/general/make-sure-your-details-are-up-to-date", "/insurance/faqs/general/paying-by-instalments-home-car", "/insurance/faqs/general/payment-receipt", "/insurance/faqs/general/personal-details", "/insurance/faqs/general/phone-or-software-to-access-suncorp-insurance-app", "/insurance/faqs/general/problems-installing-using-suncorp-insurance-app", "/insurance/faqs/general/rewards-eligibility-what-do-need-to-do", "/insurance/faqs/general/secure-information", "/insurance/faqs/general/sum-insured-for-home-policies", "/insurance/faqs/general/track-claim-online", "/insurance/faqs/general/what-are-my-home-rewards", "/insurance/faqs/general/what-are-the-different-types-or-rewards-offers", "/insurance/faqs/general/what-are-the-full-terms-and-conditions", "/insurance/faqs/general/what-data-does-my-home-record", "/insurance/faqs/general/what-devices-can-i-use-to-access-my-home", "/insurance/faqs/general/what-happens-if-i-am-being-investigated-on-an-insurance-claim", "/insurance/faqs/general/what-happens-if-i-change-or-cancel-my-suncorp-home-policy", "/insurance/faqs/general/what-happens-if-something-goes-wrong-with-accessing-the-rewards-or-using-the-app", "/insurance/faqs/general/what-if-i-do-not-complete-all-tasks", "/insurance/faqs/general/what-is-the-rewards-cashback-process", "/insurance/faqs/general/what-relevant-information-will-help-my-claim-investigation", "/insurance/faqs/general/where-can-i-review-the-cashback-ive-received", "/insurance/faqs/general/who-are-the-retailers-in-the-rewards-program", "/insurance/faqs/general/who-can-i-contact-if-i-have-questions-or-concern", "/insurance/faqs/general/who-is-the-suncorp-insurance-app-for", "/insurance/faqs/general/why-are-my-tasks-not-being-recorded", "/insurance/faqs/general/why-cant-i-select-a-non-binary-gender-insurance-quote", "/insurance/faqs/general/will-i-be-able-to-use-my-home-as-a-renter", "/insurance/faqs/general/will-i-be-covered-at-claims-time", "/insurance/faqs/general/will-my-policy-be-cancelled-if-I-miss-a-payment", "/insurance/faqs/general/will-not-performing-the-tasks-raise-my-home-insurance-premium", "/insurance/faqs/general/will-performing-these-tasks-reduce-my-premium", "/insurance/faqs/general/will-there-be-more-tasks-available", "/insurance/faqs/health", "/insurance/faqs/health/do-i-need-hospital-cover-for-the-entire-year", "/insurance/faqs/health/does-my-family-income-affect-the-mls", "/insurance/faqs/health/does-suncorp-extras-cover-help-me-avoid-the-mls", "/insurance/faqs/health/what-happens-if-i-only-have-hospital-cover-for-part-of-the-year", "/insurance/faqs/health/where-can-i-check-the-latest-mls-rates-and-thresholds", "/insurance/faqs/health/will-lifetime-health-cover-lhs-loading-interact-with-the-mls", "/insurance/faqs/home", "/insurance/faqs/home/can-i-do-repairs-to-my-home-before-making-a-claim", "/insurance/faqs/home/cash-settlement", "/insurance/faqs/home/direct-debit", "/insurance/faqs/home/flood-cover", "/insurance/faqs/home/home-assessment", "/insurance/faqs/home/how-do-i-pay-my-excess", "/insurance/faqs/home/how-do-i-send-through-things-like-proof-of-ownership-invoices-and-receipts", "/insurance/faqs/home/ive-found-more-damage-stolen-items-since-making-my-claim", "/insurance/faqs/home/transit-and-storage-cover", "/insurance/faqs/home/update-credit-card-details", "/insurance/faqs/home/what-is-legal-liability-cover", "/insurance/faqs/income-protection", "/insurance/faqs/income-protection/cancel-my-policy", "/insurance/faqs/income-protection/claim-income-protection-insurance-and-work-cover", "/insurance/faqs/income-protection/claim-payout", "/insurance/faqs/income-protection/difference-between-life-insurance-income-protection", "/insurance/faqs/income-protection/how-to-claim-on-income-protection-insurance", "/insurance/faqs/income-protection/income-protection-cover", "/insurance/faqs/income-protection/income-protection-insurance-cover-redundancy", "/insurance/faqs/income-protection/income-protection-insurance-covers-injuries-playing-sports", "/insurance/faqs/income-protection/income-protection-insurance-through-super", "/insurance/faqs/income-protection/income-protection-self-employed", "/insurance/faqs/income-protection/is-income-protection-insurance-tax-deductable", "/insurance/faqs/income-protection/premium-payments", "/insurance/faqs/income-protection/preparing-to-claim", "/insurance/faqs/income-protection/same-injury-illness", "/insurance/faqs/income-protection/underwriting", "/insurance/faqs/income-protection/waiting-period", "/insurance/faqs/landlord", "/insurance/faqs/landlord/direct-debit", "/insurance/faqs/landlord/do-i-need-landlord-insurance", "/insurance/faqs/landlord/flood-cover", "/insurance/faqs/life-protect", "/insurance/faqs/life-protect/beneficiaries-claim", "/insurance/faqs/life-protect/benefit-payout", "/insurance/faqs/life-protect/cancellation", "/insurance/faqs/life-protect/change-of-mind", "/insurance/faqs/life-protect/how-does-optional-illness-cover-work", "/insurance/faqs/life-protect/making-a-claim", "/insurance/faqs/life-protect/terminal-illness", "/insurance/faqs/life-protect/trauma-or-tpd-cover", "/insurance/faqs/life-protect/who-can-apply", "/insurance/faqs/life-protect/whole-life-insurance", "/insurance/faqs/motorhome-caravan-and-trailer", "/insurance/faqs/motorhome-caravan-and-trailer/caravan-contents", "/insurance/faqs/motorhome-caravan-and-trailer/caravan-modifications", "/insurance/faqs/motorhome-caravan-and-trailer/motorhome-coverage", "/insurance/faqs/motorhome-caravan-and-trailer/types", "/insurance/financial-hardship-policy", "/insurance/haven", "/insurance/haven/personal-information-collection-notice", "/insurance/health", "/insurance/health/apr-may-terms-26", "/insurance/health/aug-sep-terms-26", "/insurance/health/compare-extras-cover", "/insurance/health/compare-hospital-cover/basic-plus", "/insurance/health/compare-hospital-cover/bronze", "/insurance/health/compare-hospital-cover/gold", "/insurance/health/compare-hospital-cover/silver-advantage", "/insurance/health/compare-hospital-cover/silver-everyday", "/insurance/health/feb-mar-terms-26", "/insurance/health/jun-jul-terms-26", "/insurance/health/lifestage-guide", "/insurance/health/lifestage-guide/health-insurance-for-couples", "/insurance/health/lifestage-guide/health-insurance-for-families", "/insurance/health/lifestage-guide/health-insurance-for-seniors", "/insurance/health/lifestage-guide/health-insurance-for-singles", "/insurance/health/lifestage-guide/health-insurance-for-students", "/insurance/health/medicare-levy-surcharge-explained", "/insurance/health/oct-terms-26", "/insurance/home", "/insurance/home/build-it-back-better", "/insurance/home/calculators", "/insurance/home/claims", "/insurance/home/contents-only", "/insurance/home/contents-only/comparison", "/insurance/home/excess-free-glass", "/insurance/home/home-and-contents", "/insurance/home/home-and-contents/comparison", "/insurance/home/home-assist", "/insurance/home/home-building", "/insurance/home/home-building/comparison", "/insurance/home/landlord", "/insurance/home/payments-renewals", "/insurance/home/renters", "/insurance/home/strata", "/insurance/identifying-scams", "/insurance/insurance-app", "/insurance/insurance-app/privacy", "/insurance/insurance-app/terms-and-conditions", "/insurance/life", "/insurance/life/accidental-death/claims", "/insurance/life/buying-a-home", "/insurance/life/claims-philosophy", "/insurance/life/couples", "/insurance/life/empty-nesters", "/insurance/life/families", "/insurance/life/family-death-or-illness", "/insurance/life/financial-hardship-policy", "/insurance/life/funeral", "/insurance/life/funeral/claims", "/insurance/life/general-advice", "/insurance/life/getting-married", "/insurance/life/having-children", "/insurance/life/income-protection", "/insurance/life/income-protection/claims", "/insurance/life/life-insurance", "/insurance/life/life-insurance/claims", "/insurance/life/mystyle/claims", "/insurance/life/payments-renewals", "/insurance/life/seniors", "/insurance/life/young-people", "/insurance/manual-payments", "/insurance/motorcycle", "/insurance/motorcycle/claims-motorcycle-comprehensive", "/insurance/motorcycle/claims-motorcycle-third-party-fire-and-theft", "/insurance/motorcycle/payments-renewals", "/insurance/motorhome", "/insurance/motorhome/payments-renewals", "/insurance/my-home", "/insurance/my-home-terms-and-conditions", "/insurance/payments-renewals", "/insurance/payments-renewals/car-insurance", "/insurance/payments-renewals/ctp-insurance", "/insurance/payments-renewals/home-insurance", "/insurance/payments-renewals/professional-indemnity", "/insurance/policy-documents", "/insurance/premiums", "/insurance/resilience", "/insurance/resilience/resilience-road", "/insurance/sum-insured", "/insurance/suncorp-home-blitz-conditions", "/learn-about", "/learn-about/business", "/learn-about/business/self-employed-car-insurance", "/learn-about/business/working-from-home-risks-and-challenges", "/learn-about/buying-a-car", "/learn-about/buying-a-car/buying-from-dealership", "/learn-about/buying-a-car/buying-private-vs-dealer", "/learn-about/buying-a-car/buying-your-first-car", "/learn-about/buying-a-car/car-accident-when-you-are-not-insured", "/learn-about/buying-a-car/car-term-glossary", "/learn-about/buying-a-car/insuring-an-SUV", "/learn-about/buying-a-car/is-riding-gear-covered-by-motorcycle-insurance", "/learn-about/buying-a-car/negotiate-buying-car", "/learn-about/buying-a-car/planning-a-road-trip", "/learn-about/buying-a-car/popular-car-insurance-myths-debunked", "/learn-about/buying-a-car/purchasing-a-new-car", "/learn-about/buying-a-car/test-driving-a-car", "/learn-about/buying-a-car/what-insurance-do-i-need-for-a-dirt-bike", "/learn-about/buying-a-car/what-is-roadside-assistance-and-why-you-need-it", "/learn-about/buying-a-car/windscreen-cover-insurance-options", "/learn-about/buying-a-home/calculating-home-insurance-before-you-buy", "/learn-about/buying-a-home/how-much-should-i-insure-my-house-for", "/learn-about/buying-a-home/insurance-before-settlement", "/learn-about/future-of-cars", "/learn-about/future-of-cars/electric-cars-in-australia", "/learn-about/future-of-cars/future-automotive-industry", "/learn-about/future-of-cars/modern-car-safety-features", "/learn-about/future-of-cars/preparing-for-driverless-cars", "/learn-about/health", "/learn-about/health/5-ways-taking-health-insurance-now-can-help-you-save", "/learn-about/health/benefits-of-family-exercise", "/learn-about/health/children-screentime", "/learn-about/health/detox-2021", "/learn-about/health/essential-stretches", "/learn-about/health/every-thing-you-need-to-know-about-movember", "/learn-about/health/health-and-wellbeing-at-home", "/learn-about/health/health-checks-in-your-20s", "/learn-about/health/health-checks-in-your-30s-and-40s", "/learn-about/health/health-checks-over-50s", "/learn-about/health/health-insurance-myths", "/learn-about/health/health-insurance-terms", "/learn-about/health/how-to-boost-your-immunity-winter", "/learn-about/health/services-you-could-claim-on-extras", "/learn-about/health/telehealth", "/learn-about/health/things-to-do-before-going-to-hospital", "/learn-about/health/tips-for-organising-your-phone", "/learn-about/health/tips-to-avoid-colds-and-flus", "/learn-about/health/wfh-stay-active", "/learn-about/health/what-makes-a-happy-person", "/learn-about/injury-recovery-and-ctp", "/learn-about/injury-recovery-and-ctp/ctp-medical-certificate-guide-for-general-practitioners", "/learn-about/injury-recovery-and-ctp/difference-between-ctp-and-third-party", "/learn-about/injury-recovery-and-ctp/do-i-need-ctp-insurance-for-my-motorcycle", "/learn-about/injury-recovery-and-ctp/how-exercise-physiologists-help-you-exercise-right", "/learn-about/injury-recovery-and-ctp/how-to-avoid-scams-for-car-accident-injury-claims", "/learn-about/injury-recovery-and-ctp/how-to-claim-for-a-car-accident-injury", "/learn-about/injury-recovery-and-ctp/how-to-optimise-recovery-for-whiplash-associated-disorder", "/learn-about/injury-recovery-and-ctp/how-we-can-help-with-motor-accident-injury-claim", "/learn-about/injury-recovery-and-ctp/personal-injury-claims-guide-for-healthcare-providers", "/learn-about/injury-recovery-and-ctp/road-accident-treatment-plan-guide", "/learn-about/injury-recovery-and-ctp/what-compensation-can-I-claim-for-car-accident-injury", "/learn-about/injury-recovery-and-ctp/what-you-need-to-know-about-whiplash-injury", "/learn-about/injury-recovery-and-ctp/why-you-have-compulsory-third-party", "/learn-about/life-insurance", "/learn-about/life-insurance/5-myths-about-life-insurance", "/learn-about/life-insurance/a-guide-to-funeral-insurance-for-pensioners", "/learn-about/life-insurance/buying-funeral-insurance-guide", "/learn-about/life-insurance/calculating-my-life-insurance-needs", "/learn-about/life-insurance/can-a-life-insurance-policy-help-cover-my-mortgage", "/learn-about/life-insurance/can-i-afford-income-protection", "/learn-about/life-insurance/common-life-insurance-terms", "/learn-about/life-insurance/compare-income-protection-policies", "/learn-about/life-insurance/comparing-funeral-insurance-policies", "/learn-about/life-insurance/difference-between-life-and-health-insurance", "/learn-about/life-insurance/do-couples-need-life-insurance", "/learn-about/life-insurance/does-your-family-need-insurance", "/learn-about/life-insurance/funeral-insurance-myths", "/learn-about/life-insurance/funeral-insurance-vs-a-will", "/learn-about/life-insurance/how-can-life-insurance-help-me", "/learn-about/life-insurance/how-does-life-insurance-work", "/learn-about/life-insurance/how-income-protection-protects-your-family", "/learn-about/life-insurance/how-to-help-cover-the-cost-of-your-funeral", "/learn-about/life-insurance/how-to-pay-for-your-funeral", "/learn-about/life-insurance/how-will-indexation-affect-my-insurance", "/learn-about/life-insurance/income-protection-coverage-through-superannuation-vs-direct-insurers", "/learn-about/life-insurance/income-protection-what-is-covered-what-is-not", "/learn-about/life-insurance/insurance-through-your-superannuation", "/learn-about/life-insurance/is-income-protection-tax-deductible", "/learn-about/life-insurance/leading-causes-of-death-australia", "/learn-about/life-insurance/life-insurance-and-income-protection", "/learn-about/life-insurance/life-insurance-and-suicide", "/learn-about/life-insurance/life-insurance-cost-in-australia", "/learn-about/life-insurance/life-insurance-vs-income-protection", "/learn-about/life-insurance/life-insurance-without-medical-exam", "/learn-about/life-insurance/should-i-wait-to-take-out-life-insurance", "/learn-about/life-insurance/smoker-getting-life-insurance", "/learn-about/life-insurance/the-benefits-of-funeral-insurance", "/learn-about/life-insurance/three-types-of-people-who-should-consider-life-insurance", "/learn-about/life-insurance/top-tips-when-getting-life-insurance", "/learn-about/life-insurance/understanding-how-probate-works", "/learn-about/life-insurance/waiting-period-and-benefit-period", "/learn-about/life-insurance/what-can-you-claim-on-at-tax-time", "/learn-about/life-insurance/what-to-look-for-in-a-life-insurance-policy", "/learn-about/life-insurance/what-will-your-funeral-look-life", "/learn-about/life-insurance/what-you-need-to-know-about-funeral-insurance", "/learn-about/life-insurance/what-you-need-to-know-when-taking-out-funeral-insurance", "/learn-about/life-insurance/when-is-the-best-time-to-get-income-protection", "/learn-about/life-insurance/when-to-consider-taking-out-funeral-insurance", "/learn-about/life-insurance/when-you-need-a-power-of-attorney", "/learn-about/life-insurance/why-you-might-need-life-insurance-if-youre-young", "/learn-about/life-insurance/will-superannuation-life-insurance-be-sufficient", "/learn-about/life-insurance/workers-compensation-vs-income-protection-insurance", "/learn-about/life-insurance/writing-your-will", "/learn-about/life-insurance/your-eofy-life-insurance-stocktake", "/learn-about/lifestyle", "/learn-about/lifestyle/aussie-destinations-need-tourism", "/learn-about/lifestyle/building-climate-resilient-landscapes-through-cultural-burning", "/learn-about/lifestyle/futureproof-home", "/learn-about/lifestyle/planning-ahead-for-christmas", "/learn-about/lifestyle/protecting-account-with-multi-factor-authentication", "/learn-about/lifestyle/seven-family-holiday-locations", "/learn-about/lifestyle/solar-power", "/learn-about/maintaining-a-home", "/learn-about/maintaining-a-home/10-tips-to-protect-your-home-and-contents", "/learn-about/maintaining-a-home/10-ways-to-cool-your-home", "/learn-about/maintaining-a-home/5-common-incidents-where-personal-valuables-insurance-can-help", "/learn-about/maintaining-a-home/5-sustainable-housing-materials-for-climate-resistant-home", "/learn-about/maintaining-a-home/How-to-insure-your-engagement-ring", "/learn-about/maintaining-a-home/am-i-covered-for-additional-damage-in-home", "/learn-about/maintaining-a-home/are-aircons-covered-by-home-insurance", "/learn-about/maintaining-a-home/are-decks-covered-by-home-insurance", "/learn-about/maintaining-a-home/are-fences-covered-by-home-insurance", "/learn-about/maintaining-a-home/are-garages-covered-by-home-insurance", "/learn-about/maintaining-a-home/avoid-water-damage", "/learn-about/maintaining-a-home/balcony-garden", "/learn-about/maintaining-a-home/best-energy-plan", "/learn-about/maintaining-a-home/bicycle-insurance-whats-covered", "/learn-about/maintaining-a-home/building-a-bushfire-resilient-home", "/learn-about/maintaining-a-home/clever-ways-to-extend-your-home", "/learn-about/maintaining-a-home/common-home-insurance-claims", "/learn-about/maintaining-a-home/creating-a-home-inventory", "/learn-about/maintaining-a-home/cyclone-preparation-checklist", "/learn-about/maintaining-a-home/do-i-need-landlord-insurance", "/learn-about/maintaining-a-home/does-contents-insurance-cover-carpets", "/learn-about/maintaining-a-home/does-home-insurance-cover-pool-damage", "/learn-about/maintaining-a-home/does-home-insurance-cover-tree-damage", "/learn-about/maintaining-a-home/does-home-insurance-cover-vandalism", "/learn-about/maintaining-a-home/does-insurance-cover-pest-control", "/learn-about/maintaining-a-home/does-landlord-insurance-cover-airbnb-and-short-term-rentals", "/learn-about/maintaining-a-home/does-your-home-insurance-cover-blocked-gutters", "/learn-about/maintaining-a-home/does-your-home-insurance-cover-fire-damage", "/learn-about/maintaining-a-home/eofy-home-and-property-maintenance-jobs", "/learn-about/maintaining-a-home/flood-resilience-and-flood-coverage", "/learn-about/maintaining-a-home/guide-to-preventative-home-maintenance", "/learn-about/maintaining-a-home/hazards-and-risks-in-the-home", "/learn-about/maintaining-a-home/home-insurance-claim-assessment-settlement-repair-guide", "/learn-about/maintaining-a-home/home-insurance-claim-tips", "/learn-about/maintaining-a-home/home-insurance-claims-who-repairs-my-home", "/learn-about/maintaining-a-home/home-insurance-let-me-rebuild", "/learn-about/maintaining-a-home/home-security-tips", "/learn-about/maintaining-a-home/house-modifications-for-people-with-disabilities", "/learn-about/maintaining-a-home/how-home-maintenance-reduces-risk-of-denied-claims", "/learn-about/maintaining-a-home/how-to-claim-a-tax-deduction-for-home-office", "/learn-about/maintaining-a-home/how-to-claim-after-storm", "/learn-about/maintaining-a-home/how-to-minimise-mould", "/learn-about/maintaining-a-home/how-to-prepare-for-a-flood", "/learn-about/maintaining-a-home/how-to-prevent-a-house-fire", "/learn-about/maintaining-a-home/how-to-prevent-mould-in-your-house", "/learn-about/maintaining-a-home/how-to-protect-your-home-against-hailstorms", "/learn-about/maintaining-a-home/how-to-unblock-a-drain", "/learn-about/maintaining-a-home/instagram-interiors", "/learn-about/maintaining-a-home/insurance-claim-without-receipts", "/learn-about/maintaining-a-home/is-my-granny-flat-or-shed-covered-by-insurance", "/learn-about/maintaining-a-home/kerbside-appeal", "/learn-about/maintaining-a-home/legal-liability-with-your-home-insurance", "/learn-about/maintaining-a-home/make-your-home-more-eco-friendly", "/learn-about/maintaining-a-home/make-your-home-storm-and-cyclone-ready", "/learn-about/maintaining-a-home/mobile-phone-insurance-whats-covered", "/learn-about/maintaining-a-home/pricey-expenses-that-insurance-could-help-cover", "/learn-about/maintaining-a-home/protect-your-home-from-wild-weather", "/learn-about/maintaining-a-home/smart-home-security", "/learn-about/maintaining-a-home/storm-preparation-checklist", "/learn-about/maintaining-a-home/sun-and-ses-make-qld-stronger", "/learn-about/maintaining-a-home/the-flood-recovery-guide", "/learn-about/maintaining-a-home/the-impacts-of-water-damage-at-home", "/learn-about/maintaining-a-home/things-you-didnt-know-were-covered", "/learn-about/maintaining-a-home/traditional-modern-twist", "/learn-about/maintaining-a-home/unoccupied-home-insurance-guide", "/learn-about/maintaining-a-home/ways-to-update-your-home", "/learn-about/maintaining-a-home/what-affects-home-insurance-renewal-price", "/learn-about/maintaining-a-home/what-insurance-do-i-need-when-renovating", "/learn-about/maintaining-a-home/what-plumber-you-need", "/learn-about/maintaining-a-home/what-to-do-after-making-a-home-insurance-claim", "/learn-about/maintaining-a-home/when-do-you-need-an-electrician", "/learn-about/maintaining-a-home/your-guide-to-personal-valuables-insurance", "/learn-about/my-car", "/learn-about/my-car/Your-guide-to-car-maintenance-and-servicing", "/learn-about/my-car/are-you-covered-for-offroad-driving", "/learn-about/my-car/artificial-intelligence-making-your-life-easier", "/learn-about/my-car/avoid-car-insurance-voids", "/learn-about/my-car/be-informed-about-scam-tow-truck-operators", "/learn-about/my-car/can-I-renew-my-expired-car-insurance", "/learn-about/my-car/car-insurance-for-p-platers", "/learn-about/my-car/car-insurance-tips-for-L-platers", "/learn-about/my-car/car-maintenance-checks", "/learn-about/my-car/difference-between-market-value-and-amount-covered", "/learn-about/my-car/different-type-car-excess", "/learn-about/my-car/do-demerit-points-affect-car-insurance-in-australia", "/learn-about/my-car/do-hail-protectors-really-work", "/learn-about/my-car/does-car-insurance-cover-additional-drivers", "/learn-about/my-car/does-car-insurance-cover-trailers-or-towed-caravans", "/learn-about/my-car/driving-in-australia-quiz", "/learn-about/my-car/driving-in-the-rain-hints-and-tips", "/learn-about/my-car/essential-car-maintenance-checks", "/learn-about/my-car/hire-car-scams-after-an-incident", "/learn-about/my-car/how-dash-cams-can-affect-your-car-insurance", "/learn-about/my-car/how-do-we-calculate-the-cost-of-caravan-insurance-premiums", "/learn-about/my-car/how-long-does-petrol-last-in-your-car", "/learn-about/my-car/how-much-to-register-a-vehicle-in-australia", "/learn-about/my-car/how-often-should-you-service-your-car", "/learn-about/my-car/how-to-change-a-flat-tyre", "/learn-about/my-car/how-to-clean-interior", "/learn-about/my-car/how-to-make-a-claim-after-a-minor-car-accident", "/learn-about/my-car/how-to-prevent-car-theft", "/learn-about/my-car/how-to-wash-your-car-at-home", "/learn-about/my-car/insurance-claims-assessment-and-repairs-guide", "/learn-about/my-car/insuring-4wd-accessories", "/learn-about/my-car/most-common-car-insurance-claims", "/learn-about/my-car/new-for-old-car-replacement", "/learn-about/my-car/protect-your-car-from-hail-and-storm-damage", "/learn-about/my-car/real-cost-car-service", "/learn-about/my-car/registering-your-car-qld-nsw-act", "/learn-about/my-car/rideshare-insurance-for-brisbane-drivers", "/learn-about/my-car/roadside-emergency-car-kit", "/learn-about/my-car/safe-driving-tips", "/learn-about/my-car/scratches-and-dents-simple-car-repair-options", "/learn-about/my-car/signs-of-tyre-wear", "/learn-about/my-car/travelling-with-pets-in-cars", "/learn-about/my-car/what-happens-when-my-car-is-a-total-loss", "/learn-about/my-car/what-insurance-do-i-need", "/learn-about/my-car/what-to-consider-when-going-for-a-weekend-getaway", "/learn-about/my-car/what-to-do-if-your-car-is-stolen", "/learn-about/my-car/what-to-do-in-a-not-at-fault-car-accident", "/learn-about/my-car/what-to-do-when-someone-hits-your-parked-car", "/learn-about/my-car/who-makes-the-most-motorbike-claims", "/learn-about/my-car/why-you-should-check-your-amount-covered-at-renewal-time", "/learn-about/my-car/why-you-should-know-how-to-drive-a-manual-car", "/learn-about/renting", "/learn-about/renting/does-contents-insurance-cover-food-spoilage", "/learn-about/renting/finding-great-housemates", "/learn-about/renting/how-to-secure-a-pet-friendly-rental-home", "/learn-about/selling-a-car", "/learn-about/selling-a-car/handling-the-car-handover-process", "/learn-about/selling-a-car/issues-with-private-sell", "/learn-about/selling-a-car/letting-people-test-drive-your-car", "/learn-about/selling-a-car/trading-in", "/learn-about/selling-a-car/whats-my-car-worth", "/learn-about/selling-a-car/when-to-sell", "/learn-about/teamgirls", "/learn-about/teamgirls/7-technology-rules-for-your-household", "/learn-about/teamgirls/ais-coaching", "/learn-about/teamgirls/ais-wisc", "/learn-about/teamgirls/blacks-toughest-battle", "/learn-about/teamgirls/boost-your-daughters-body-image", "/learn-about/teamgirls/carridehome", "/learn-about/teamgirls/clare-ferguson-on-positive-coaching", "/learn-about/teamgirls/goal-setting-101", "/learn-about/teamgirls/how-to-talk-about-body-image", "/learn-about/teamgirls/indroduce-your-daughter-to-social-media", "/learn-about/teamgirls/laradunkley", "/learn-about/teamgirls/laura-geitz-podcast", "/learn-about/teamgirls/laura-geitz-teamgirls-story", "/learn-about/teamgirls/laura-geitz-top-tips", "/learn-about/teamgirls/letter-to-my-netball-playing-niece", "/learn-about/teamgirls/life-drills", "/learn-about/teamgirls/mysupportteam-bryanfletcher", "/learn-about/teamgirls/mysupportteam-caitlinbassett", "/learn-about/teamgirls/mysupportteam-maddyproud", "/learn-about/teamgirls/mysupportteam-sharellemcmahon", "/learn-about/teamgirls/netballandsocialmedia", "/learn-about/teamgirls/off-court-all-stars", "/learn-about/teamgirls/pro-athletes-guide-to-resilience", "/learn-about/teamgirls/rebecca-sparrow-welcomes-teamgirls", "/learn-about/teamgirls/six-books-for-your-daughters-bookshelf", "/learn-about/teamgirls/staying-in-the-game", "/learn-about/teamgirls/support-crew-stories", "/learn-about/teamgirls/team-girl-pressures", "/learn-about/teamgirls/teamgirls-in-10-podcasts", "/learn-about/teamgirls/truth-about-teen-girls-and-sport", "/learn-about/teamgirls/what-does-friendship-look-like", "/learn-about/teamgirls/why-Glasgow-was-desperate-to-return-west", "/learn-about/teamgirls/why-i-want-my-daughter-to-play-a-team-sport", "/learn-about/teamgirls/why-wallam-chooses-fear-over-comfort", "/learn-about/teamgirls/why-your-childs-self-esteem-is-important", "/learn-about/teamgirls/winning-and-losing", "/learn-about/teamgirls/women-in-sport-underestimated", "/life-complaint-handling-process", "/renewalgiftback", "/sitemap", "/vulnerability-disclosure-program"];

  // tools/importer/transformers/suncorp-cleanup.js
  var CATALOG_CLEANUP_RULES = [
    'body [class*="overlay"]:not(nav *)',
    '[role="dialog"]',
    'body [class*="modal"]:not(nav *)'
  ];
  var CHROME_SELECTORS = [
    "header.Header",
    "div.qualtrics-survey",
    "#secureapp",
    "body > div.error-msg",
    "#suncorp-chatbot",
    "#suncorp-chatbot-icon-container",
    "div.Page > article",
    "div.Page > div.section",
    "div.Page > div.iparys_inherited",
    // Adobe Audience Manager sync frame (imports as an "Adobe ID Syncing iFrame" link)
    'iframe[title*="Adobe ID Syncing"]',
    'iframe[src*="demdex.net"]',
    // Hidden activation/tracking frame (imports as a "No Content" link)
    'iframe[src*="activate.suncorp.com.au"]',
    'iframe[style*="display: none"]',
    'iframe[style*="display:none"]'
  ];
  var HIDDEN_SELECTORS = '.sg-u-hidden, [hidden], [style*="display: none"], [style*="display:none"]';
  var HIDDEN_KEEP = "img, picture, .image-data-container, .image-lazyload";
  var MEDIA = "img, picture, video, iframe, svg";
  var INLINE_TAGS = /^(A|STRONG|EM|B|I|U|S|SPAN|BR|SUP|SUB|SMALL|CODE|ABBR|MARK)$/;
  var FOOTER_MARKERS = "div.Footer, div.Footer-content, div.Footer-bottom, div.Footer-onCall, div.footer-mobileapps";
  function normalizeUrl(raw) {
    if (!raw) return null;
    try {
      const u = new URL(raw);
      return `${u.origin}${u.pathname}`.replace(/\/+$/, "");
    } catch (e) {
      return null;
    }
  }
  function getPageUrl(document, payload) {
    const candidates = [
      payload && payload.url,
      payload && payload.params && payload.params.originalURL,
      payload && payload.originalURL
    ];
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) candidates.push(canonical.getAttribute("href"));
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) candidates.push(ogUrl.getAttribute("content"));
    try {
      if (document.location && /^https?:/.test(document.location.href)) {
        candidates.push(document.location.href);
      }
    } catch (e) {
    }
    for (const c of candidates) {
      const n = normalizeUrl(c);
      if (n) return n;
    }
    return null;
  }
  function findPageCleanup(pageCleanup, pageUrl) {
    if (!pageCleanup || typeof pageCleanup !== "object" || !pageUrl) return null;
    if (Array.isArray(pageCleanup[pageUrl])) return pageCleanup[pageUrl];
    const key = Object.keys(pageCleanup).find((k) => normalizeUrl(k) === pageUrl);
    return key ? pageCleanup[key] : null;
  }
  function safeQueryAll(root, selector) {
    try {
      return [...root.querySelectorAll(selector)];
    } catch (e) {
      return [];
    }
  }
  function firstMatch(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function getProtected(document, payload) {
    const main = document.querySelector("main");
    const sections = payload && payload.template && payload.template.sections || [];
    const out = [];
    sections.forEach((s) => {
      const el = firstMatch(document, s.selector);
      if (el && (!main || !main.contains(el))) out.push(el);
    });
    return out;
  }
  function makeRemover(protectedEls) {
    return (el) => {
      if (!el || !el.parentNode) return false;
      if (protectedEls.some((p) => p === el || el.contains(p) || p.contains(el))) return false;
      el.remove();
      return true;
    };
  }
  function isWrappedLink(node) {
    if (!node || node.nodeType !== 1 || !/^(STRONG|EM|B|I)$/.test(node.tagName)) return false;
    const kids = [...node.childNodes].filter((c) => c.nodeType !== 3 || c.nodeValue.trim());
    if (kids.length !== 1 || kids[0].nodeType !== 1) return false;
    if (kids[0].tagName === "A") return true;
    return isWrappedLink(kids[0]);
  }
  function wrappedLinksOnly(nodes) {
    const links = [];
    for (const n of nodes) {
      if (n.nodeType === 3) {
        if (n.nodeValue.trim()) return null;
      } else if (n.nodeType === 1) {
        if (n.tagName === "BR") continue;
        if (n.tagName === "SPAN" && !n.textContent.trim() && !n.querySelector(MEDIA)) continue;
        if (!isWrappedLink(n)) return null;
        links.push(n);
      } else if (n.nodeType !== 8) {
        return null;
      }
    }
    return links;
  }
  function splitButtonGroup(document, container) {
    const toParagraphs = (links) => links.map((l) => {
      const p = document.createElement("p");
      p.append(l);
      return p;
    });
    if (container.tagName === "P") {
      const links = wrappedLinksOnly([...container.childNodes]);
      if (links && links.length > 1) container.replaceWith(...toParagraphs(links));
      return;
    }
    const runs = [[]];
    [...container.childNodes].forEach((n) => {
      if (n.nodeType === 1 && !INLINE_TAGS.test(n.tagName)) runs.push([]);
      else runs[runs.length - 1].push(n);
    });
    runs.forEach((run) => {
      const links = wrappedLinksOnly(run);
      if (!links || links.length < 2) return;
      const anchor = document.createTextNode("");
      run[0].before(anchor);
      anchor.replaceWith(...toParagraphs(links));
      run.forEach((n) => {
        if (n.parentNode === container) n.remove();
      });
    });
  }
  var HEADING_TYPES = [
    ["sg-Type--heading1", 2],
    ["sg-Type--heading2", 2],
    ["sg-Type--heading3", 3],
    ["sg-Type--heading4", 4],
    ["sg-Type--heading5", 5],
    ["sg-Type--heading6", 6]
  ];
  var HEADING_SELECTOR = HEADING_TYPES.map(([c]) => `.${c}`).join(", ");
  var BOLD_TYPES = "span.sg-Type--bold, span.sg-Type--prominent, span.sg-Type--title";
  function getBlockElements(document, template, pageUrl) {
    const out = [];
    (template.blocks || []).forEach((blockDef) => {
      const selectors = [...blockDef.instances || []];
      const pageKey = Object.keys(blockDef.pageInstances || {}).find((k) => normalizeUrl(k) === pageUrl);
      if (pageKey) selectors.push(...blockDef.pageInstances[pageKey] || []);
      selectors.forEach((sel) => out.push(...safeQueryAll(document, sel)));
    });
    return out;
  }
  function headingLevel(el) {
    const hit = HEADING_TYPES.find(([c]) => el.classList.contains(c));
    return hit ? hit[1] : 0;
  }
  function paragraphToHeading(document, p) {
    let level = headingLevel(p);
    let spans = [];
    if (!level) {
      spans = [...p.querySelectorAll(HEADING_SELECTOR)].filter((s) => !s.parentElement.closest(HEADING_SELECTOR));
      if (!spans.length) return;
      const levels = new Set(spans.map(headingLevel));
      if (levels.size !== 1) return;
      [level] = [...levels];
      const inSpans = spans.map((s) => s.textContent).join("").replace(/\s+/g, "");
      if (!inSpans || inSpans !== p.textContent.replace(/\s+/g, "")) return;
    }
    if (p.querySelector("img, picture, table, ul, ol")) return;
    const h = document.createElement(`h${level}`);
    spans.forEach((s) => s.replaceWith(...s.childNodes));
    h.append(...p.childNodes);
    p.replaceWith(h);
  }
  function isOutsideMain(document, el) {
    const main = document.querySelector("main");
    if (!main) return true;
    return !main.contains(el) && !el.contains(main);
  }
  function transform(hookName, element, payload) {
    const document = payload && payload.document || element.ownerDocument;
    const root = element || document.body;
    if (hookName === "beforeTransform") {
      const content = document.querySelector("main") || root;
      safeQueryAll(content, 'i[class*="Icon-tick--"]').forEach((el) => {
        el.textContent = "\u2713";
      });
      safeQueryAll(content, 'i[class*="Icon-cross--error"], .sg-Flextable i[class*="Icon-cross--"]').forEach((el) => {
        el.textContent = "\u2717";
      });
      safeQueryAll(content, "a.sg-Btn").forEach((a) => {
        if (a.closest("strong, em")) return;
        let kind = "accent";
        if (a.classList.contains("sg-Btn--primary")) kind = "primary";
        else if (a.classList.contains("sg-Btn--secondary")) kind = "secondary";
        const outer = document.createElement(kind === "secondary" ? "em" : "strong");
        a.replaceWith(outer);
        if (kind === "accent") {
          const inner = document.createElement("em");
          outer.append(inner);
          inner.append(a);
        } else {
          outer.append(a);
        }
      });
      const protectedEls = getProtected(document, payload);
      const remove = makeRemover(protectedEls);
      const template = payload && payload.template || {};
      const pageUrl = getPageUrl(document, payload);
      const pageSelectors = findPageCleanup(template.pageCleanup, pageUrl);
      if (pageSelectors) {
        pageSelectors.forEach((sel) => {
          const matches = safeQueryAll(document, sel);
          if (matches.length === 1) remove(matches[0]);
        });
      } else {
        CATALOG_CLEANUP_RULES.forEach((rule) => {
          safeQueryAll(document, rule).filter((el) => isOutsideMain(document, el)).forEach((el) => remove(el));
        });
      }
      CHROME_SELECTORS.forEach((sel) => {
        safeQueryAll(document, sel).forEach((el) => remove(el));
      });
      const main = document.querySelector("main");
      safeQueryAll(document, "div.Page > *").forEach((child) => {
        if (child.matches("main") || main && child.contains(main)) return;
        if (child.matches(FOOTER_MARKERS) || child.querySelector(FOOTER_MARKERS)) remove(child);
      });
      safeQueryAll(document, "footer, div.Footer").forEach((el) => {
        if (!main || !main.contains(el)) remove(el);
      });
      const definitions = [];
      const seenTitles = /* @__PURE__ */ new Set();
      safeQueryAll(document, ".sg-Tooltip.js-TooltipContent").forEach((tip) => {
        const titleEl = tip.querySelector(".sg-Tooltip-headerTitle");
        const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
        const body = tip.querySelector(".sg-Tooltip-body .rte") || tip.querySelector(".sg-Tooltip-body");
        if (title && body && body.textContent.trim() && !seenTitles.has(title.toLowerCase())) {
          seenTitles.add(title.toLowerCase());
          const answer = document.createElement("div");
          answer.append(...body.cloneNode(true).childNodes);
          definitions.push([title, answer]);
        }
        tip.remove();
      });
      safeQueryAll(document, "a.js-Tooltip").forEach((a) => a.replaceWith(...a.childNodes));
      if (definitions.length && main) {
        const holder = main.querySelector("div.Main-content") || main;
        const heading = document.createElement("h2");
        heading.textContent = "Definitions";
        holder.append(heading, WebImporter.Blocks.createBlock(document, { name: "accordion-panel", cells: definitions }));
      }
      safeQueryAll(document, ".article-carousel-text span, .article-carousel-text p").filter((el) => /^Showing \d+(\s*-\s*\d+)? of \d+/.test(el.textContent.trim())).forEach((el) => remove(el));
      if (main) {
        safeQueryAll(main, HIDDEN_SELECTORS).forEach((el) => {
          if (!el.isConnected || el.matches(HIDDEN_KEEP) || el.querySelector(MEDIA)) return;
          if (el.closest(".image-data-container")) return;
          remove(el);
        });
      }
      if (main) {
        const blockEls = getBlockElements(document, template, pageUrl);
        const inBlock = (el) => blockEls.some((b) => b === el || b.contains(el));
        safeQueryAll(main, "p").forEach((p) => {
          if (p.isConnected && !inBlock(p)) paragraphToHeading(document, p);
        });
        safeQueryAll(main, BOLD_TYPES).forEach((span) => {
          if (!span.isConnected || inBlock(span) || span.closest("h1, h2, h3, h4, h5, h6, strong, b")) return;
          const text4 = span.textContent.trim();
          if (!text4) return;
          const linkText = [...span.querySelectorAll("a")].map((a) => a.textContent).join("").trim();
          if (linkText && linkText.replace(/\s+/g, "") === text4.replace(/\s+/g, "")) return;
          const strong = document.createElement("strong");
          strong.append(...span.childNodes);
          span.replaceWith(strong);
        });
      }
      safeQueryAll(root, "script, noscript").forEach((el) => el.remove());
    }
    if (hookName === "afterTransform") {
      const SITE = "https://www.suncorp.com.au";
      const migrated = new Set(suncorp_migrated_paths_default);
      safeQueryAll(root, "a[href]").forEach((a) => {
        const raw = a.getAttribute("href");
        if (!raw || /^(#|mailto:|tel:|javascript:)/i.test(raw)) return;
        let u;
        try {
          u = new URL(raw, SITE);
        } catch (e) {
          return;
        }
        if (!/^(www\.)?suncorp\.com\.au$/i.test(u.hostname)) return;
        ["intCMP", "_ga"].forEach((p) => u.searchParams.delete(p));
        const path = u.pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/";
        if (migrated.has(path) && !u.search) a.setAttribute("href", `${path.toLowerCase()}${u.hash}`);
      });
      safeQueryAll(root, 'style, script, noscript, link, iframe[src*="mbox"], #c-target-global-mbox').forEach((el) => el.remove());
      safeQueryAll(root, "table").forEach((table) => {
        const head = table.querySelector("th");
        if (!head || !/^\s*breadcrumb/i.test(head.textContent)) return;
        const tw = document.createTreeWalker(table, document.defaultView && document.defaultView.NodeFilter ? document.defaultView.NodeFilter.SHOW_TEXT : 4);
        for (let t = tw.nextNode(); t; t = tw.nextNode()) {
          if (/:[a-z][a-z0-9-]*:/.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/:[a-z][a-z0-9-]*:/g, "");
        }
      });
      safeQueryAll(root, "div.textIcon").forEach((row) => {
        if (row.closest("table")) return;
        const icon = row.querySelector(":scope > .image-wrapper");
        const token = icon && icon.textContent.trim();
        if (!token || !/^(:[a-z][a-z0-9-]*:\s*)+$/.test(token) || icon.querySelector("img")) return;
        const first = row.querySelector(".text-wrapper p, .text-wrapper h2, .text-wrapper h3, .text-wrapper h4");
        if (!first) return;
        first.prepend(document.createTextNode(`${token} `));
        icon.remove();
      });
      safeQueryAll(root, 'a[href="#"]').forEach((a) => {
        if (a.textContent.trim() || a.querySelector(MEDIA)) return;
        const parent = a.parentElement;
        a.remove();
        if (!parent || parent === root || !/^(P|LI|STRONG|EM)$/.test(parent.tagName)) return;
        const target = root.contains(parent.closest("p, li")) && parent.closest("p, li") || parent;
        if (!target.textContent.trim() && !target.querySelector(`${MEDIA}, a, table, hr`)) target.remove();
      });
      const groups = /* @__PURE__ */ new Set();
      safeQueryAll(root, "strong > a, em > a, b > a, i > a").forEach((a) => {
        let top = a.parentElement;
        while (top.parentElement && top.parentElement !== root && isWrappedLink(top.parentElement)) {
          top = top.parentElement;
        }
        const container = top.parentElement;
        if (container && isWrappedLink(top) && /^(P|DIV|TD|TH)$/.test(container.tagName)) groups.add(container);
      });
      groups.forEach((el) => {
        if (el.isConnected) splitButtonGroup(document, el);
      });
      const NodeFilterRef = document.defaultView && document.defaultView.NodeFilter || { SHOW_TEXT: 4 };
      const walker = document.createTreeWalker(root, NodeFilterRef.SHOW_TEXT);
      const stray = [];
      let n = walker.nextNode();
      while (n) {
        if (n.nodeValue && n.nodeValue.indexOf(".lt-ie10") !== -1) stray.push(n);
        n = walker.nextNode();
      }
      stray.forEach((t) => {
        const parent = t.parentNode;
        t.remove();
        if (parent && parent !== root && parent.nodeType === 1 && !parent.textContent.trim() && !parent.querySelector("img, picture, video, iframe, table, a, hr")) {
          parent.remove();
        }
      });
    }
  }

  // tools/importer/transformers/suncorp-sections.js
  var MARKER = "data-excat-section-id";
  var CENTER = "data-excat-center";
  var BG_STYLES = [
    ["BgPlaceholder--neutral", "light-grey"],
    ["BgPlaceholder--grey", "grey"],
    ["BgPlaceholder--secondary", "teal"],
    ["sg-u-bgSUN2020lightestgreen", "light-teal"],
    ["sg-u-bgONESUNlightestgreen", "light-teal"],
    ["sg-u-bgONESUNcoolgreen", "cool-green"],
    ["BgPlaceholder--dark", "dark"]
  ];
  var RTE_TEXT = ["h1", "h2", "h3", "h4", "h5", "h6", "p"].map((t) => `div.default.rte ${t}`).join(", ");
  var CONTENT_ELEMENTS = /* @__PURE__ */ new Set(["IMG", "PICTURE", "VIDEO", "IFRAME", "TABLE", "SVG", "svg"]);
  var SOCIAL_ICONS = [
    'i[class*="Icon-twitter"]',
    'i[class*="Icon-linkedin"]',
    'i[class*="Icon-facebook"]',
    'i[class*="Icon-instagram"]',
    'a.u-Icon--link[href*="x.com"]',
    'a.u-Icon--link[href*="twitter.com"]',
    'a.u-Icon--link[href*="linkedin.com"]',
    'a.u-Icon--link[href*="facebook.com"]',
    'a.u-Icon--link[href*="instagram.com"]'
  ].join(", ");
  var resolvedByDoc = /* @__PURE__ */ new WeakMap();
  function firstMatch2(document, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      try {
        const el = document.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function removeSocialFollow(container) {
    const tables = /* @__PURE__ */ new Set();
    container.querySelectorAll(SOCIAL_ICONS).forEach((icon) => {
      const table = icon.closest(".sg-Flextable");
      if (table && container.contains(table)) tables.add(table);
    });
    tables.forEach((table) => {
      let target = table;
      while (target.parentElement && target.parentElement !== container && target.parentElement.children.length === 1) {
        target = target.parentElement;
      }
      let prev = target.previousElementSibling;
      while (prev && !prev.textContent.trim() && !prev.querySelector("img, picture")) {
        prev = prev.previousElementSibling;
      }
      if (prev && /^\s*follow\s+us\b/i.test(prev.textContent) && prev.textContent.trim().length < 60) {
        prev.remove();
      }
      target.remove();
    });
    container.querySelectorAll("p, h2, h3, h4, h5, h6, strong").forEach((el) => {
      if (el.isConnected && /^\s*follow\s+us\s*$/i.test(el.textContent)) (el.closest("p") || el).remove();
    });
  }
  function backgroundStyle(el) {
    let bg = null;
    try {
      bg = el.querySelector(":scope > section > div.canvas__bg_image");
    } catch (e) {
    }
    if (!bg && el.matches && el.matches("div.canvas__bg_image")) bg = el;
    if (!bg) return null;
    const hit = BG_STYLES.find(([cls]) => bg.classList.contains(cls));
    return hit ? hit[1] : null;
  }
  function isCentred(textEl, stop) {
    for (let n = textEl; n && n !== stop; n = n.parentElement) {
      if (/text-align\s*:\s*center/i.test(n.getAttribute("style") || "")) return true;
      if (n.matches("div.default.rte")) break;
    }
    return false;
  }
  function tagAlignment(el) {
    el.querySelectorAll(RTE_TEXT).forEach((t) => {
      if (!t.textContent.trim()) return;
      t.setAttribute(CENTER, isCentred(t, el) ? "1" : "0");
    });
  }
  function mostlyCentred(el) {
    if (!el || !el.isConnected) return false;
    const texts = [...el.querySelectorAll(`[${CENTER}]`)].filter((t) => !t.closest("table") && t.textContent.trim());
    if (!texts.length) return false;
    const centred = texts.filter((t) => t.getAttribute(CENTER) === "1").length;
    return centred * 2 > texts.length;
  }
  function isSectionMetadata(el) {
    if (el.tagName !== "TABLE") return false;
    const cell = el.querySelector("th, td");
    return !!cell && /^\s*section[\s-]metadata\s*$/i.test(cell.textContent);
  }
  function collapseEmptySections(document) {
    const main = document.querySelector("main") || document.body;
    if (!main) return;
    let hasContent3 = false;
    let pendingMeta = [];
    let prevHr = null;
    const toRemove = [];
    const visit = (node) => {
      if (node.nodeType === 3) {
        if (node.nodeValue.trim()) hasContent3 = true;
        return;
      }
      if (node.nodeType !== 1) return;
      if (node.tagName === "HR") {
        if (!hasContent3) {
          toRemove.push(prevHr || node, ...pendingMeta);
          if (!prevHr) {
            pendingMeta = [];
            return;
          }
        }
        prevHr = node;
        hasContent3 = false;
        pendingMeta = [];
        return;
      }
      if (isSectionMetadata(node)) {
        pendingMeta.push(node);
        return;
      }
      if (CONTENT_ELEMENTS.has(node.tagName)) {
        hasContent3 = true;
        return;
      }
      [...node.childNodes].forEach(visit);
    };
    [...main.childNodes].forEach(visit);
    if (prevHr && !hasContent3) toRemove.push(prevHr, ...pendingMeta);
    toRemove.forEach((n) => {
      if (n.parentNode) n.remove();
    });
  }
  function resolveSections(document, sections) {
    const main = document.querySelector("main");
    const seen = /* @__PURE__ */ new Set();
    const resolved = [];
    sections.forEach((section) => {
      const el = firstMatch2(document, section.selector);
      if (!el || seen.has(el)) return;
      seen.add(el);
      resolved.push({ section, el });
    });
    if (main) {
      const outside = resolved.filter((r) => !main.contains(r.el) && !r.el.contains(main));
      outside.filter((r) => r.section.position !== "start").forEach((r) => main.append(r.el));
      outside.filter((r) => r.section.position === "start").reverse().forEach((r) => main.prepend(r.el));
    }
    resolved.forEach((r) => {
      let outer = null;
      resolved.forEach((o) => {
        if (o !== r && o.el.contains(r.el) && (!outer || o.el.contains(outer.el))) outer = o;
      });
      if (outer) outer.el.after(r.el);
    });
    resolved.sort((a, b) => {
      if (a.el === b.el) return 0;
      return a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1;
    });
    return resolved;
  }
  function transform2(hookName, element, payload) {
    const document = payload && payload.document || element.ownerDocument;
    const sections = payload && payload.template && payload.template.sections || [];
    if (!sections.length) return;
    if (hookName === "beforeTransform") {
      const resolved = resolveSections(document, sections);
      resolved.forEach((r) => {
        if (r.section.id === "sidebar" || r.section.style === "sidebar") removeSocialFollow(r.el);
      });
      resolved.forEach((r) => {
        r.style = r.section.style || backgroundStyle(r.el);
        tagAlignment(r.el);
      });
      for (let i = resolved.length - 1; i >= 0; i -= 1) {
        const { section, el } = resolved[i];
        const hr = document.createElement("hr");
        hr.setAttribute(MARKER, section.id);
        if (i === 0) hr.setAttribute("data-excat-first", "true");
        el.before(hr);
      }
      resolvedByDoc.set(document, resolved);
    }
    if (hookName === "afterTransform") {
      const resolved = resolvedByDoc.get(document) || [];
      for (let i = resolved.length - 1; i >= 0; i -= 1) {
        const r = resolved[i];
        const { section } = r;
        const marker = document.querySelector(`hr[${MARKER}="${section.id}"]`);
        const el = r.el && r.el.isConnected ? r.el : null;
        if (!marker && !el) continue;
        const style = [r.style, mostlyCentred(el) ? "center" : null].filter(Boolean).join(", ");
        if (style) {
          const block = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style }
          });
          if (el) el.after(block);
          else marker.after(block);
        }
        if (marker) {
          if (marker.getAttribute("data-excat-first") === "true") marker.remove();
          else marker.removeAttribute(MARKER);
        }
      }
      document.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
        if (hr.getAttribute("data-excat-first") === "true") hr.remove();
        else hr.removeAttribute(MARKER);
      });
      document.querySelectorAll(`[${CENTER}]`).forEach((t) => t.removeAttribute(CENTER));
      collapseEmptySections(document);
      resolvedByDoc.delete(document);
    }
  }

  // tools/importer/import-message-page.js
  var PAGE_TEMPLATE = { "name": "message-page", "urls": ["https://www.suncorp.com.au/contact-us/thank-you.html", "https://www.suncorp.com.au/insurance/faqs/ctp/difference-between-ctp-comprehensive.html"], "description": "Short page with no breadcrumb: photo banner carrying a boxed title, then a single centred message panel with one call-to-action", "blocks": [{ "name": "hero-banner", "instances": ["main div:has(> section.BgPlaceholder.canvas--responsive_image.canvas__contents--align_bottom)"], "pageInstances": { "https://www.suncorp.com.au/contact-us/thank-you.html": ["body > div.Page > main > div > div:nth-child(1)"] } }, { "name": "tag-label", "instances": ['[data-catalog-page-only="tag-label"]'], "pageInstances": { "https://www.suncorp.com.au/contact-us/thank-you.html": ["body > div.Page > main > div > div:nth-child(2)"] } }, { "name": "accordion-panel", "instances": ["main div.sg-Accordion.sg-Accordion--block"], "pageInstances": { "https://www.suncorp.com.au/insurance/faqs/ctp/difference-between-ctp-comprehensive.html": ["main div.sg-Accordion.sg-Accordion--block"] } }], "sections": [{ "id": "content-1", "name": "Content section 1", "selector": ["div.Main-content > div.canvas__container"], "style": null, "blocks": ["hero-banner", "tag-label", "accordion-panel"], "defaultContent": [] }, { "id": "content-2", "name": "Content section 2", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["hero-banner", "tag-label", "accordion-panel"], "defaultContent": [] }, { "id": "content-3", "name": "Content section 3", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["hero-banner", "tag-label", "accordion-panel"], "defaultContent": [] }, { "id": "content-4", "name": "Content section 4", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["hero-banner", "tag-label", "accordion-panel"], "defaultContent": [] }], "pageCleanup": { "https://www.suncorp.com.au/contact-us/thank-you.html": ["#_im_iframe_overlay__248", "#privacy-optout-banner", "#colorbox"], "https://www.suncorp.com.au/insurance/faqs/ctp/difference-between-ctp-comprehensive.html": ["#experience-modal", "div.sg-Nav-overlay.sg-Nav-overlay--showOnMobile", "#_im_iframe_overlay__248", "#privacy-optout-banner", "#colorbox"] } };
  var parsers = {
    "hero-banner": parse,
    "tag-label": parse2,
    "accordion-panel": parse3
  };
  var sectionTransformers = [transform2];
  var transformers = [transform, ...sectionTransformers];
  function executeTransformers(hookName, element, payload, list = transformers) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  var import_message_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      executeTransformers("beforeTransform", main, payload, transformers.filter((fn) => !sectionTransformers.includes(fn)));
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL);
      executeTransformers("beforeTransform", main, payload, sectionTransformers);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_message_page_exports);
})();
