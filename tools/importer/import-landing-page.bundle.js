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

  // tools/importer/import-landing-page.js
  var import_landing_page_exports = {};
  __export(import_landing_page_exports, {
    default: () => import_landing_page_default
  });

  // tools/importer/parsers/alert-banner.js
  function tokenOf(el) {
    const m = (el && el.textContent ? el.textContent : "").match(/:[a-z][a-z0-9-]*:/);
    return m ? m[0] : "";
  }
  function parse(element, { document }) {
    const details = element.querySelector(".key-event--details") || element;
    const iconHolder = details.querySelector(".image-wrapper");
    const icon = tokenOf(iconHolder);
    const textHolder = details.querySelector(".text-wrapper .rte, .text-wrapper, .rte") || details;
    const message = document.createElement("div");
    const paras = [...textHolder.querySelectorAll("p")].filter((p) => p.textContent.trim());
    if (paras.length) {
      paras.forEach((p) => {
        const np = document.createElement("p");
        np.innerHTML = p.innerHTML;
        message.append(np);
      });
    } else if (textHolder.textContent.trim()) {
      const np = document.createElement("p");
      np.innerHTML = textHolder.innerHTML;
      message.append(np);
    }
    message.querySelectorAll('a[href^="javascript"]').forEach((a) => a.remove());
    const cells = [[icon || "", message]];
    const block = WebImporter.Blocks.createBlock(document, { name: "alert-banner", cells });
    element.replaceWith(block);
  }

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
  function parse2(element, { document, params }) {
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

  // tools/importer/parsers/quick-links.js
  function text2(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function parse3(element, { document, params }) {
    const menu = element.matches("ul") ? element : element.querySelector("ul.sg-Menu, ul");
    const list = document.createElement("ul");
    let label = "";
    let items = menu ? [...menu.querySelectorAll(":scope > li")] : [];
    if (!items.length) {
      items = [...element.querySelectorAll("a.sg-Btn[href], a[href]")].filter((a, i, all) => all.indexOf(a) === i).map((a) => {
        const li = document.createElement("li");
        li.append(a.cloneNode(true));
        return li;
      });
      const heading = element.querySelector("h2, h3, h4");
      if (heading && !heading.querySelector("a") && text2(heading)) label = text2(heading);
    }
    items.forEach((li) => {
      const a = li.querySelector("a[href]");
      if (!a) {
        if (!label && text2(li)) label = text2(li);
        return;
      }
      const href = a.getAttribute("href");
      if (!text2(a) || href === "#") return;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = href;
      link.textContent = text2(a);
      item.append(link);
      list.append(item);
    });
    if (!label) {
      const lead = [...element.querySelectorAll("p, span.sg-Menu-label, .staticLinksMenu-label")].find((el) => !el.closest("li") && text2(el) && !el.querySelector("a"));
      if (lead) label = text2(lead);
    }
    const cells = [];
    if (label) cells.push([label]);
    cells.push([list]);
    const name = label ? "quick-links (label)" : "quick-links";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-links.js
  var JUNK2 = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS2 = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS2 = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text3(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent2(el) {
    return !!(text3(el) || el.querySelector("img"));
  }
  function topLevel2(root, selector) {
    const all = [...root.querySelectorAll(selector)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }
  function flatten2(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text3(para) || para.querySelector("img"))) out.push(para);
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
      if (BLOCK_TAGS2.test(node.tagName)) {
        flush();
        if (text3(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS2.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
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
  function cleanNode2(root) {
    root.querySelectorAll(JUNK2).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  var LONG_COLUMN = 40;
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
  function linkColumns(element) {
    const table = topLevel2(element, ".sg-Flextable")[0];
    if (table) return [...table.children].filter((c) => c.matches(".sg-Flextable-cell") && hasContent2(c));
    const rows = [...element.querySelectorAll(".sg-Grid-row")].filter((r) => [...r.children].filter(hasContent2).length >= 2);
    const outer = rows.filter((r) => !rows.some((o) => o !== r && o.contains(r)));
    if (outer.length) return outer.flatMap((r) => [...r.children].filter(hasContent2));
    return [element];
  }
  function cleanMenus(root, document) {
    root.querySelectorAll("ul.sg-Menu").forEach((menu) => {
      const ul = document.createElement("ul");
      [...menu.children].forEach((li) => {
        const a = li.querySelector("a[href]");
        if (!a || !text3(a)) return;
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = text3(a);
        item.append(link);
        const sub = li.querySelector("ul");
        if (sub) item.append(sub);
        ul.append(item);
      });
      menu.replaceWith(ul);
    });
  }
  function parse4(element, { document, params }) {
    const columns = linkColumns(element);
    let variant = null;
    if (element.querySelector(".sitemap")) variant = "grey";
    else if (columns.some((c) => c.querySelector(".textIcon"))) variant = "image";
    const inColumns = (el) => columns.some((c) => c.contains(el) || el.contains(c));
    const cells = [];
    const pageTitle = [];
    if (columns[0] !== element) {
      const intro = document.createElement("div");
      topLevel2(element, "div.rte").filter((r) => !inColumns(r) && hasContent2(r)).forEach((r) => {
        cleanNode2(r);
        intro.append(...flatten2([...r.childNodes], document));
      });
      intro.querySelectorAll(":scope > h1").forEach((h1) => pageTitle.push(h1));
      pageTitle.forEach((h1) => h1.remove());
      if (hasContent2(intro)) cells.push([intro]);
    }
    const row = columns.map((col, i) => {
      cleanNode2(col);
      cleanMenus(col, document);
      const cell = document.createElement("div");
      cell.append(...flatten2([...col.childNodes], document));
      if (cell.querySelectorAll("a[href]").length > LONG_COLUMN && params && Array.isArray(params.fragments)) {
        const path = `/fragments/${pagePath(document, params)}/column-${i + 1}`;
        params.fragments.push({ element: cell, path });
        const a = document.createElement("a");
        a.href = path;
        a.textContent = path;
        return a;
      }
      return cell;
    });
    cells.push(row);
    const name = variant ? `columns-links (${variant})` : "columns-links";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (pageTitle.length) element.before(...pageTitle);
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  var JUNK3 = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS3 = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS3 = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text4(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent3(el) {
    return !!(text4(el) || el.querySelector("img"));
  }
  function orderOf(cell) {
    const m = (cell.getAttribute("style") || "").match(/(?:^|;)\s*order\s*:\s*(\d+)/);
    return m ? Number(m[1]) : null;
  }
  function colCount(table) {
    const m = table.className.match(/sg-Flextable--(\d+)cols/);
    return m ? Number(m[1]) : 0;
  }
  function flextableCards(table) {
    const cells = [...table.children].filter((c) => c.matches(".sg-Flextable-cell"));
    const cols = colCount(table);
    const orders = cells.map(orderOf);
    if (cols && cells.length > cols && cells.length % cols === 0 && orders.every((o) => o !== null)) {
      const size = cells.length / cols;
      const groups = [];
      for (let i = 0; i < cells.length; i += size) groups.push(cells.slice(i, i + size));
      const ok = groups.every((g) => g.every((c, j) => orderOf(c) === j + 1));
      if (ok) return groups;
    }
    return cells.map((c) => [c]);
  }
  function topLevel3(root, selector) {
    const all = [...root.querySelectorAll(selector)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }
  function cardUnits(element) {
    const sgCards = topLevel3(element, ".sg-Card");
    if (sgCards.length) return { kind: "sg-card", cards: sgCards.map((c) => [c]) };
    const tables = element.matches(".sg-Flextable") ? [element] : topLevel3(element, ".sg-Flextable");
    if (tables.length) {
      return { kind: "flextable", cards: tables.flatMap((t) => flextableCards(t)), tables };
    }
    const rows = [...element.querySelectorAll(".sg-Grid-row")].filter((r) => [...r.children].filter(hasContent3).length >= 2).filter((r) => ![...r.querySelectorAll(".sg-Grid-row")].some((inner) => [...inner.children].filter(hasContent3).length >= 2));
    if (rows.length) return { kind: "grid", cards: rows.flatMap((r) => [...r.children].map((c) => [c])) };
    return { kind: "single", cards: [[element]] };
  }
  function flatten3(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text4(para) || para.querySelector("img"))) out.push(para);
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
      if (BLOCK_TAGS3.test(node.tagName)) {
        flush();
        if (text4(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS3.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
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
  function cleanNode3(root) {
    root.querySelectorAll(JUNK3).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  function mainImage(parts) {
    for (const part of parts) {
      const imgs = part.matches && part.matches("img") ? [part] : [...part.querySelectorAll("img")];
      const img = imgs.find((i) => !i.closest(".rte, p, li"));
      if (img) return img;
    }
    return null;
  }
  function buildCard(parts, document) {
    parts.forEach(cleanNode3);
    const img = mainImage(parts);
    let overlayHref = null;
    const OVERLAY = "a.sg-Card-inner, a.Article--link-mask, a.sg-Card, a.contentBoxContainer, a.Image-linkWrapper";
    parts.forEach((p) => {
      const overlay = p.matches(OVERLAY) ? p : p.querySelector(OVERLAY);
      if (overlay && !overlayHref) overlayHref = overlay.getAttribute("href");
    });
    if (img) {
      const wrap = img.closest(".img-wrapper, .adaptive-image, .image-wrapper, .Image-linkWrapper");
      img.remove();
      if (wrap && !hasContent3(wrap)) wrap.remove();
    }
    const blocks = flatten3(parts.flatMap((p) => [...p.childNodes]), document);
    blocks.forEach((b) => b.querySelectorAll("a.sg-Btn").forEach((a) => {
      a.textContent = text4(a);
      a.removeAttribute("class");
    }));
    if (overlayHref && !blocks.some((b) => b.querySelector("a[href]"))) {
      const target = blocks.slice().reverse().find((b) => /read\s+more|find\s+out\s+more|learn\s+more/i.test(text4(b))) || blocks.find((b) => /^H[1-6]$/.test(b.tagName)) || blocks[blocks.length - 1];
      if (target) {
        const a = document.createElement("a");
        a.href = overlayHref;
        a.append(...target.childNodes);
        target.append(a);
      }
    }
    const body = document.createElement("div");
    body.append(...blocks);
    if (!hasContent3(body) && !img) return null;
    return img ? [img, body] : ["", body];
  }
  function detectVariant(element, units) {
    if (element.querySelector(".cmp-experiencefragment--locations")) return "location";
    if (units.kind === "flextable" && units.cards.some((g) => g.length > 1 && g[0].matches(".sg-Flextable-cell--neutral") && g[0].querySelector("h2, h3, h4, h5") && !g[0].querySelector("p"))) return "location";
    if (units.kind === "sg-card") return "orange-shadow";
    const boxes = [...element.querySelectorAll(".contentBoxContainer")];
    const orange = boxes.some((b) => b.matches(".content-box-border-top-primary"));
    const cyan = boxes.some((b) => b.matches(".content-box-border-top-secondary"));
    if (orange && cyan) return "image-cyan-orange-light";
    if (orange) return "image-orange-light";
    if (cyan) return "cyan-image";
    if (units.kind === "flextable") {
      if (units.cards.some((g) => g.length > 1 && g[0].querySelector("img") && !text4(g[0]))) return "plan";
      if (units.cards.some((g) => g[0].matches(".flexible-table-border-top-secondary"))) return "cyan-image";
    }
    return null;
  }
  function parse5(element, { document, params }) {
    const units = cardUnits(element);
    const variant = detectVariant(element, units);
    const intro = [];
    if (units.kind !== "single") {
      const inCard = (el) => units.cards.some((g) => g.some((c) => c.contains(el) || el.contains(c)));
      topLevel3(element, "div.rte").filter((r) => !inCard(r) && hasContent3(r)).forEach((r) => {
        cleanNode3(r);
        intro.push(...flatten3([...r.childNodes], document));
      });
    }
    const cells = units.cards.map((g) => buildCard(g, document)).filter(Boolean);
    const name = variant ? `cards-article (${variant})` : "cards-article";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (intro.length) element.before(...intro);
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-title.js
  var JUNK4 = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS4 = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS4 = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text5(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent4(el) {
    return !!(text5(el) || el.querySelector("img"));
  }
  function flatten4(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text5(para) || para.querySelector("img"))) out.push(para);
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
      if (BLOCK_TAGS4.test(node.tagName)) {
        flush();
        if (text5(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS4.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
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
  function cleanNode4(root) {
    root.querySelectorAll(JUNK4).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  function titleVariant(element) {
    const bg = element.querySelector(".canvas__bg_image") || element;
    const cyan = /BgPlaceholder--secondary|sg-u-bgSecondary|sg-Cell--secondary/.test(bg.className) || !!element.querySelector(".sg-Cell--secondary");
    if (cyan) {
      const lists = [...element.querySelectorAll("ul, ol")];
      const linkList = lists.some((l) => [...l.children].length > 1 && [...l.children].every((li) => li.querySelector("a") && text5(li.querySelector("a")) === text5(li)));
      return linkList ? "cyan-2" : "cyan";
    }
    if (element.querySelector(".sg-List-tick ul, .sg-List-tick ol")) return "image";
    return null;
  }
  function parse6(element, { document, params }) {
    const variant = titleVariant(element);
    cleanNode4(element);
    const pictures = [...element.querySelectorAll("img")].filter((img) => !img.closest(".rte, p, li")).filter((img) => !img.classList.contains("vs-badge-image") || img.classList.contains("badge-desktop"));
    pictures.forEach((img) => {
      const wrap = img.closest(".adaptive-image, .img-wrapper, .image-wrapper");
      img.remove();
      if (wrap && !hasContent4(wrap)) wrap.remove();
    });
    element.querySelectorAll("a.sg-Btn").forEach((a) => {
      a.textContent = text5(a);
      a.removeAttribute("class");
    });
    const content = document.createElement("div");
    const root = element.querySelector(".Middle-column") || element;
    content.append(...flatten4([...root.childNodes], document));
    content.querySelectorAll("a:not([href])").forEach((a) => {
      if (!text5(a)) a.remove();
    });
    content.querySelectorAll("p").forEach((p) => {
      if (!hasContent4(p)) p.remove();
    });
    const cells = [];
    if (hasContent4(content)) cells.push([content]);
    pictures.forEach((img) => cells.push([img]));
    const name = variant ? `hero-title (${variant})` : "hero-title";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  var JUNK5 = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS5 = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS5 = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text6(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent5(el) {
    return !!(text6(el) || el.querySelector("img"));
  }
  function colCount2(table) {
    const m = table.className.match(/sg-Flextable--(\d+)cols/);
    return m ? Number(m[1]) : 0;
  }
  function topLevel4(root, selector) {
    const all = [...root.querySelectorAll(selector)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }
  function flatten5(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text6(para) || para.querySelector("img"))) out.push(para);
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
      if (BLOCK_TAGS5.test(node.tagName)) {
        flush();
        if (text6(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS5.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
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
  function cleanNode5(root) {
    root.querySelectorAll(JUNK5).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  var COMPLEX = ".sg-Accordion, .sg-Flextable, table, section.video, .youtube-video, .sg-Carousel";
  function pagePath2(document, params) {
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
    return (s || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50).replace(/-+$/, "") || "content";
  }
  function colWidth(col) {
    const m = col.className.match(/sg-Grid-col(\d+)--xlarge/) || col.className.match(/sg-Grid-col(\d+)--large/) || col.className.match(/sg-Grid-col(\d+)(?:\s|$)/);
    return m ? Number(m[1]) : 12;
  }
  function mediaColumns(element) {
    const rows = [...element.querySelectorAll(".sg-Grid-row")].filter((r) => [...r.children].filter(hasContent5).length >= 2);
    const inner = rows.filter((r) => ![...r.querySelectorAll(".sg-Grid-row")].some((o) => rows.includes(o)));
    if (inner.length) return inner.flatMap((r) => [...r.children].filter(hasContent5));
    const tables = topLevel4(element, ".sg-Flextable");
    if (tables.length === 1 && tables[0] !== element) {
      const cells = [...tables[0].children].filter((c) => c.matches(".sg-Flextable-cell") && hasContent5(c));
      const cols = colCount2(tables[0]);
      if (cells.length >= 2 && cells.length === cols && cells.some(isMedia) && !cells.some((c) => c.querySelector(COMPLEX))) return cells;
    }
    return [element];
  }
  function isMedia(col) {
    if (!col.querySelector("img")) return false;
    const clone = col.cloneNode(true);
    clone.querySelectorAll("img, style, script, .image-data-container").forEach((e) => e.remove());
    return !text6(clone) && !clone.querySelector("a[href]:not(.Image-linkWrapper), table, ul, ol");
  }
  function mediaVariant(columns) {
    if (columns.length > 2) return "alt";
    if (columns.length < 2) return null;
    const media = columns.map(isMedia);
    if (media[0] && !media[1]) return "image-left";
    if (media[1] && !media[0]) {
      return columns[1].querySelectorAll("img").length > 1 ? "wide-right" : "image-right";
    }
    if (!media[0] && !media[1]) {
      const [a, b] = columns.map(colWidth);
      if (a < b) return "wide";
      if (a > b) return "image-left-2";
    }
    return null;
  }
  function parse7(element, { document, params }) {
    const columns = mediaColumns(element);
    const variant = mediaVariant(columns);
    const inColumns = (el) => columns.some((c) => c.contains(el) || el.contains(c));
    const before = [];
    if (columns[0] !== element) {
      topLevel4(element, "div.rte").filter((r) => !inColumns(r) && hasContent5(r)).forEach((r) => {
        cleanNode5(r);
        before.push(...flatten5([...r.childNodes], document));
      });
    }
    const row = columns.map((col, i) => {
      if (isMedia(col)) {
        const cell2 = document.createElement("div");
        [...col.querySelectorAll("img")].filter((img) => !img.classList.contains("vs-badge-image") || img.classList.contains("badge-desktop")).forEach((img) => {
          const link = img.closest("a[href]");
          const p = document.createElement("p");
          if (link) {
            const a = document.createElement("a");
            a.href = link.getAttribute("href");
            a.append(img);
            p.append(a);
          } else {
            p.append(img);
          }
          cell2.append(p);
        });
        return cell2;
      }
      const complex = col.querySelector(COMPLEX) && params && Array.isArray(params.fragments);
      cleanNode5(col);
      const cell = document.createElement("div");
      if (complex) {
        cell.append(...col.childNodes);
        const heading = cell.querySelector("h1, h2, h3, h4, h5, h6");
        const base = `/fragments/${pagePath2(document, params)}/${slugify(text6(heading) || `column-${i + 1}`)}`;
        let path = base;
        let n = 2;
        while (params.fragments.some((f) => f.path === path)) {
          path = `${base}-${n}`;
          n += 1;
        }
        params.fragments.push({ element: cell, path });
        const a = document.createElement("a");
        a.href = path;
        a.textContent = path;
        return a;
      }
      col.querySelectorAll("a.sg-Btn").forEach((a) => {
        a.textContent = text6(a);
        a.removeAttribute("class");
      });
      cell.append(...flatten5([...col.childNodes], document));
      return cell;
    });
    const name = variant ? `columns-media (${variant})` : "columns-media";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [row] });
    if (before.length) element.before(...before);
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  var JUNK6 = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS6 = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS6 = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text7(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent6(el) {
    return !!(text7(el) || el.querySelector("img"));
  }
  function orderOf2(cell) {
    const m = (cell.getAttribute("style") || "").match(/(?:^|;)\s*order\s*:\s*(\d+)/);
    return m ? Number(m[1]) : null;
  }
  function colCount3(table) {
    const m = table.className.match(/sg-Flextable--(\d+)cols/);
    return m ? Number(m[1]) : 0;
  }
  function flextableCards2(table) {
    const cells = [...table.children].filter((c) => c.matches(".sg-Flextable-cell"));
    const cols = colCount3(table);
    const orders = cells.map(orderOf2);
    if (cols && cells.length > cols && cells.length % cols === 0 && orders.every((o) => o !== null)) {
      const size = cells.length / cols;
      const groups = [];
      for (let i = 0; i < cells.length; i += size) groups.push(cells.slice(i, i + size));
      const ok = groups.every((g) => g.every((c, j) => orderOf2(c) === j + 1));
      if (ok) return groups;
    }
    return cells.map((c) => [c]);
  }
  function topLevel5(root, selector) {
    const all = [...root.querySelectorAll(selector)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }
  function cardUnits2(element) {
    const sgCards = topLevel5(element, ".sg-Card");
    if (sgCards.length) return { kind: "sg-card", cards: sgCards.map((c) => [c]) };
    const tables = element.matches(".sg-Flextable") ? [element] : topLevel5(element, ".sg-Flextable");
    if (tables.length) {
      return { kind: "flextable", cards: tables.flatMap((t) => flextableCards2(t)), tables };
    }
    const rows = [...element.querySelectorAll(".sg-Grid-row")].filter((r) => [...r.children].filter(hasContent6).length >= 2).filter((r) => ![...r.querySelectorAll(".sg-Grid-row")].some((inner) => [...inner.children].filter(hasContent6).length >= 2));
    if (rows.length) return { kind: "grid", cards: rows.flatMap((r) => [...r.children].map((c) => [c])) };
    const slides = topLevel5(element, ".sg-Carousel-item:not(.slick-cloned)").filter(hasContent6);
    if (slides.length >= 2) return { kind: "carousel", cards: slides.map((s) => [s]) };
    return { kind: "single", cards: [[element]] };
  }
  function flatten6(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text7(para) || para.querySelector("img"))) out.push(para);
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
      if (BLOCK_TAGS6.test(node.tagName)) {
        flush();
        if (text7(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS6.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
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
  function cleanNode6(root) {
    root.querySelectorAll(JUNK6).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  function mainImage2(parts) {
    for (const part of parts) {
      const imgs = part.matches && part.matches("img") ? [part] : [...part.querySelectorAll("img")];
      const img = imgs.find((i) => !i.closest(".rte, p, li"));
      if (img) return img;
    }
    return null;
  }
  function buildCard2(parts, document) {
    parts.forEach(cleanNode6);
    const img = mainImage2(parts);
    let overlayHref = null;
    const OVERLAY = "a.sg-Card-inner, a.Article--link-mask, a.sg-Card, a.contentBoxContainer, a.Image-linkWrapper, a.sg-Flextable-cell[href]";
    parts.forEach((p) => {
      const overlay = p.matches(OVERLAY) ? p : p.querySelector(OVERLAY);
      if (overlay && !overlayHref) overlayHref = overlay.getAttribute("href");
    });
    if (img) {
      const wrap = img.closest(".img-wrapper, .adaptive-image, .image-wrapper, .Image-linkWrapper");
      img.remove();
      if (wrap && !hasContent6(wrap)) wrap.remove();
    }
    const blocks = flatten6(parts.flatMap((p) => [...p.childNodes]), document);
    blocks.forEach((b) => b.querySelectorAll("a.sg-Btn").forEach((a) => {
      a.textContent = text7(a);
      a.removeAttribute("class");
    }));
    if (overlayHref && !blocks.some((b) => b.querySelector("a[href]"))) {
      const target = blocks.slice().reverse().find((b) => /read\s+more|find\s+out\s+more|learn\s+more/i.test(text7(b))) || blocks.find((b) => /^H[1-6]$/.test(b.tagName)) || blocks[blocks.length - 1];
      if (target) {
        const a = document.createElement("a");
        a.href = overlayHref;
        a.append(...target.childNodes);
        target.append(a);
      }
    }
    const body = document.createElement("div");
    body.append(...blocks);
    if (!hasContent6(body) && !img) return null;
    return img ? [img, body] : ["", body];
  }
  var TC_WRAPPER_TAGS = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|FIGURE|SPAN)$/;
  function cellContent(cell, document) {
    cell.querySelectorAll("style, script, noscript, .image-data-container, .image-lazyload, .sg-u-hidden:not(img)").forEach((e) => e.remove());
    cell.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    cell.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
    const icons = [...cell.querySelectorAll('i[class*="Icon-"]')];
    icons.forEach((i) => {
      const tick = /Icon-tick/.test(i.className);
      const cross = /Icon-cross/.test(i.className);
      if (tick || cross) i.replaceWith(document.createTextNode(tick ? "\u2713" : "\u2717"));
      else i.remove();
    });
    cell.querySelectorAll("a.sg-Btn").forEach((a) => {
      a.textContent = text7(a);
      a.removeAttribute("class");
    });
    const out = document.createElement("div");
    const walk = (node, target) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 1 && TC_WRAPPER_TAGS.test(child.tagName) && child.querySelector("p, h1, h2, h3, h4, h5, h6, ul, ol, div")) {
          walk(child, target);
        } else if (child.nodeType === 1 && child.tagName === "DIV") {
          if (text7(child) || child.querySelector("img")) target.append(...child.childNodes);
        } else if (child.nodeType === 1 && child.tagName === "P" && !text7(child) && !child.querySelector("img")) {
        } else {
          target.append(child);
        }
      });
    };
    walk(cell, out);
    if (!text7(out) && !out.querySelector("img")) return "";
    return out;
  }
  function fromHtmlTable(table, document) {
    const rows = [...table.querySelectorAll(":scope > thead > tr, :scope > tbody > tr, :scope > tr, :scope > tfoot > tr")];
    const cols = Math.max(...rows.map((r) => r.children.length), 0);
    return rows.map((tr) => {
      const cells = [...tr.children].map((c) => cellContent(c, document));
      while (cells.length < cols) cells.push("");
      return cells;
    });
  }
  function fromFlextable(flex, document) {
    let cells = [...flex.children].filter((c) => c.matches(".sg-Flextable-cell"));
    const orders = cells.map(orderOf2);
    const groups = /* @__PURE__ */ new Map();
    if (orders.every((o) => o !== null)) {
      cells.forEach((c) => {
        const o = orderOf2(c);
        if (!groups.has(o)) groups.set(o, []);
        groups.get(o).push(c);
      });
    } else {
      const n = Number((flex.className.match(/sg-Flextable--(\d+)cols/) || [])[1]) || 1;
      for (let i = 0; i < cells.length; i += n) groups.set(i, cells.slice(i, i + n));
    }
    let rows = [...groups.keys()].sort((a, b) => a - b).map((k) => groups.get(k));
    const width = Math.max(...rows.map((r) => r.length));
    const hiddenCols = [];
    for (let i = 0; i < width; i += 1) {
      const body = rows.slice(1).filter((r) => r[i]);
      if (body.length && body.every((r) => r[i].matches(".sg-u-visuallyhiddenLarge"))) hiddenCols.push(i);
    }
    rows = rows.map((r) => r.filter((c, i) => !hiddenCols.includes(i) && !c.matches(".sg-u-visuallyhiddenLarge")));
    cells = null;
    const cols = Math.max(...rows.map((r) => r.length));
    return rows.map((r) => {
      const out = r.map((c) => cellContent(c, document));
      while (out.length < cols) out.push("");
      return out;
    }).filter((r) => r.some((c) => c));
  }
  function detectTableVariant(kind, source) {
    if (kind === "flex") {
      const img = !!source.querySelector("img:not(.vs-badge-image), img.badge-desktop");
      const light = !!source.querySelector(":scope > .sg-Flextable-cell--neutral");
      if (img) return light ? "image-cyan-grey-light" : "image-cyan-grey";
      return light ? "cyan-grey-light" : "cyan-grey";
    }
    const firstRow = source.querySelector("tr");
    if (!firstRow) return null;
    const head = [...firstRow.children];
    if (head.some((c) => /sg-u-bg/.test(c.className))) return "image-grey";
    if (head.length > 2 && !text7(head[0]) && !head[0].querySelector("img")) return "dark";
    return null;
  }
  function convertComparison(element, document) {
    let target = element;
    let table = null;
    let flex = null;
    if (element.matches("tr, td, th, thead, tbody")) {
      table = element.closest("table");
      target = table.closest(".sg-Overflow-container") || table;
    } else if (element.matches("table")) {
      table = element;
    } else {
      table = element.querySelector("table");
      if (!table) flex = element.matches(".sg-Flextable") ? element : topLevel5(element, ".sg-Flextable")[0];
    }
    const cells = [];
    if (target === element && !element.matches("table, .sg-Flextable")) {
      const tableEl = table || flex;
      topLevel5(element, "div.rte").filter((r) => tableEl && !tableEl.contains(r) && text7(r)).filter((r) => r.compareDocumentPosition(tableEl) & 4).forEach((r) => {
        r.querySelectorAll(".sg-u-mediumAndSmallHidden").forEach((s) => s.classList.remove("sg-u-mediumAndSmallHidden"));
        const c = document.createElement("div");
        c.append(...r.childNodes);
        cells.push([c]);
      });
    }
    let rows = [];
    let variant = null;
    if (table) {
      variant = detectTableVariant("table", table);
      rows = fromHtmlTable(table, document);
    } else if (flex) {
      variant = detectTableVariant("flex", flex);
      rows = fromFlextable(flex, document);
    }
    cells.push(...rows);
    const name = variant ? `table-comparison (${variant})` : "table-comparison";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    return { target, block };
  }
  function videoLink(section, document) {
    const iframe = section.querySelector("iframe[src]");
    const contentUrl = section.querySelector('link[itemprop="contentUrl"]');
    let src = iframe && iframe.getAttribute("src") || contentUrl && contentUrl.getAttribute("href");
    if (!src) return null;
    const id = (src.match(/embed\/([^?&#/]+)/) || [])[1];
    if (id) src = `https://www.youtube.com/watch?v=${id}`;
    const a = document.createElement("a");
    a.href = src;
    a.textContent = src;
    return a;
  }
  function detectCardsVariant(element, units) {
    const boxes = [...element.querySelectorAll(".contentBoxContainer")];
    if (element.matches(".contentBoxContainer")) boxes.push(element);
    const linkedBoxes = boxes.filter((b) => b.matches("a.sg-Card, a.contentBoxContainer"));
    const neutral = (el) => el.matches(".sg-Cell--neutral, .sg-Flextable-cell--neutral") || !!el.querySelector(".canvas__bg_image.BgPlaceholder--neutral, .canvas__bg_image.BgPlaceholder--grey");
    if (linkedBoxes.length) return neutral(element) || linkedBoxes.some(neutral) ? "grey-image" : "shadow-image";
    if (boxes.some((b) => /sg-u-boxShadow/.test(b.className))) {
      if (element.querySelector("a.sg-Btn") && boxes.some((b) => b.matches(".content-box-border-top-secondary"))) return "link-tiles";
      return "shadow";
    }
    if (boxes.some((b) => /sg-u-border(?!TopNone)/.test(b.className) && !/u-noBorder/.test(b.className))) return "boxed";
    if (element.querySelector("section.video, .youtube-video")) return "boxed";
    if (units.kind === "flextable") {
      const first = units.cards.map((g) => g[0]);
      if (first.some((c) => c.matches(".flexible-table-border-bottom-default")) && units.cards.some((g) => g.length > 1)) return "cyan";
      if (first.every((c) => c.matches(".sg-Flextable-cell--neutral"))) return "grey";
    }
    if (units.kind === "grid" && neutral(element)) return "grey-light";
    return null;
  }
  function parse8(element, { document, params }) {
    if (element.matches("tr, td, th") && element.closest("table")) {
      const { target, block: block2 } = convertComparison(element, document);
      target.replaceWith(block2);
      return;
    }
    element.querySelectorAll("section.video, .youtube-video").forEach((v) => {
      const holder = v.closest("section.video") || v;
      if (!element.contains(holder) || !holder.isConnected) return;
      const a = videoLink(holder, document);
      if (!a) {
        holder.remove();
        return;
      }
      const p = document.createElement("p");
      p.append(a);
      holder.replaceWith(p);
    });
    const units = cardUnits2(element);
    const variant = detectCardsVariant(element, units);
    const cells = [];
    if (units.kind !== "single") {
      const inCard = (el) => units.cards.some((g) => g.some((c) => c.contains(el) || el.contains(c)));
      const intro = [];
      topLevel5(element, "div.rte").filter((r) => !inCard(r) && hasContent6(r)).forEach((r) => {
        cleanNode6(r);
        intro.push(...flatten6([...r.childNodes], document));
      });
      if (intro.length) {
        const c = document.createElement("div");
        c.append(...intro);
        cells.push([c]);
      }
    }
    units.cards.map((g) => buildCard2(g, document)).filter(Boolean).forEach((row) => {
      if (units.kind === "single" && row[0] === "") {
        const first = row[1].firstElementChild;
        if (first && first.tagName === "P" && /^:[a-z0-9-]+:$/.test(text7(first)) && row[1].children.length > 1) {
          const media2 = document.createElement("div");
          media2.append(first);
          row[0] = media2;
        }
      }
      const [media, body] = row;
      const lone = body.children.length === 1 && body.querySelector('a[href*="youtube.com/watch"]');
      cells.push(lone ? [media, body] : row);
    });
    const name = variant ? `cards-feature (${variant})` : "cards-feature";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  var JUNK7 = "style, script, noscript, textarea, .image-data-container, .image-lazyload, .adaptive-image > div[data-src], .slick-cloned, .SplitLine, .sg-u-hidden:not(img)";
  var BLOCK_TAGS7 = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DL)$/;
  var WRAPPER_TAGS7 = /^(DIV|SECTION|HEADER|FOOTER|ARTICLE|ASIDE|MAIN|NAV|FIGURE|CENTER|FORM)$/;
  function text8(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent7(el) {
    return !!(text8(el) || el.querySelector("img"));
  }
  function orderOf3(cell) {
    const m = (cell.getAttribute("style") || "").match(/(?:^|;)\s*order\s*:\s*(\d+)/);
    return m ? Number(m[1]) : null;
  }
  function colCount4(table) {
    const m = table.className.match(/sg-Flextable--(\d+)cols/);
    return m ? Number(m[1]) : 0;
  }
  function flextableCards3(table) {
    const cells = [...table.children].filter((c) => c.matches(".sg-Flextable-cell"));
    const cols = colCount4(table);
    const orders = cells.map(orderOf3);
    if (cols && cells.length > cols && cells.length % cols === 0 && orders.every((o) => o !== null)) {
      const size = cells.length / cols;
      const groups = [];
      for (let i = 0; i < cells.length; i += size) groups.push(cells.slice(i, i + size));
      const ok = groups.every((g) => g.every((c, j) => orderOf3(c) === j + 1));
      if (ok) return groups;
    }
    return cells.map((c) => [c]);
  }
  function topLevel6(root, selector) {
    const all = [...root.querySelectorAll(selector)];
    return all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  }
  function cardUnits3(element) {
    const sgCards = topLevel6(element, ".sg-Card");
    if (sgCards.length) return { kind: "sg-card", cards: sgCards.map((c) => [c]) };
    const tables = element.matches(".sg-Flextable") ? [element] : topLevel6(element, ".sg-Flextable");
    if (tables.length) {
      return { kind: "flextable", cards: tables.flatMap((t) => flextableCards3(t)), tables };
    }
    const rows = [...element.querySelectorAll(".sg-Grid-row")].filter((r) => [...r.children].filter(hasContent7).length >= 2).filter((r) => ![...r.querySelectorAll(".sg-Grid-row")].some((inner) => [...inner.children].filter(hasContent7).length >= 2));
    if (rows.length) return { kind: "grid", cards: rows.flatMap((r) => [...r.children].map((c) => [c])) };
    return { kind: "single", cards: [[element]] };
  }
  function flatten7(nodes, document) {
    const out = [];
    let para = null;
    const flush = () => {
      if (para && (text8(para) || para.querySelector("img"))) out.push(para);
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
      if (BLOCK_TAGS7.test(node.tagName)) {
        flush();
        if (text8(node) || node.querySelector("img")) out.push(node);
        return;
      }
      if (WRAPPER_TAGS7.test(node.tagName) || node.tagName === "A" && node.querySelector("div, p, h1, h2, h3, h4, h5, h6, header, section")) {
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
  function cleanNode7(root) {
    root.querySelectorAll(JUNK7).forEach((el) => el.remove());
    root.querySelectorAll('a[href^="javascript"], a:not([href]), a.js-Tooltip, a[data-toggle="modal"]').forEach((a) => a.replaceWith(...a.childNodes));
    root.querySelectorAll("img.vs-badge-image:not(.badge-desktop)").forEach((img) => img.remove());
  }
  function mainImage3(parts) {
    for (const part of parts) {
      const imgs = part.matches && part.matches("img") ? [part] : [...part.querySelectorAll("img")];
      const img = imgs.find((i) => !i.closest(".rte, p, li"));
      if (img) return img;
    }
    return null;
  }
  function buildCard3(parts, document) {
    parts.forEach(cleanNode7);
    const img = mainImage3(parts);
    let overlayHref = null;
    const OVERLAY = "a.sg-Card-inner, a.Article--link-mask, a.sg-Card, a.contentBoxContainer, a.Image-linkWrapper";
    parts.forEach((p) => {
      const overlay = p.matches(OVERLAY) ? p : p.querySelector(OVERLAY);
      if (overlay && !overlayHref) overlayHref = overlay.getAttribute("href");
    });
    if (img) {
      const wrap = img.closest(".img-wrapper, .adaptive-image, .image-wrapper, .Image-linkWrapper");
      img.remove();
      if (wrap && !hasContent7(wrap)) wrap.remove();
    }
    const blocks = flatten7(parts.flatMap((p) => [...p.childNodes]), document);
    blocks.forEach((b) => b.querySelectorAll("a.sg-Btn").forEach((a) => {
      a.textContent = text8(a);
      a.removeAttribute("class");
    }));
    if (overlayHref && !blocks.some((b) => b.querySelector("a[href]"))) {
      const target = blocks.slice().reverse().find((b) => /read\s+more|find\s+out\s+more|learn\s+more/i.test(text8(b))) || blocks.find((b) => /^H[1-6]$/.test(b.tagName)) || blocks[blocks.length - 1];
      if (target) {
        const a = document.createElement("a");
        a.href = overlayHref;
        a.append(...target.childNodes);
        target.append(a);
      }
    }
    const body = document.createElement("div");
    body.append(...blocks);
    if (!hasContent7(body) && !img) return null;
    return img ? [img, body] : ["", body];
  }
  function iconName(li) {
    const m = li.className.match(/(?:^|\s)Icon-([A-Za-z0-9]+)--/);
    if (!m || /^tick$/i.test(m[1])) return null;
    return m[1].replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  function productVariant(element, units) {
    if (units.kind === "flextable" && units.cards.every((g) => g.length === 1) && element.querySelector('.sg-Type--strikeBehind, li[class*="Icon-"]:not([class*="Icon-tick"])')) return "compare";
    if (units.kind === "sg-card") return "shadow";
    if (units.cards.some((g) => g.some((c) => c.matches(".sg-Flextable-cell--neutral, .sg-Cell--neutral")))) return "grey-light";
    if (units.kind === "flextable" && !element.querySelector("img")) return "light";
    return null;
  }
  function parse9(element, { document, params }) {
    const units = cardUnits3(element);
    const variant = productVariant(element, units);
    element.querySelectorAll('li[class*="Icon-"]').forEach((li) => {
      const name2 = iconName(li);
      if (name2 && !/^:[a-z0-9-]+:/.test(text8(li))) li.prepend(`:${name2}: `);
    });
    const cells = units.cards.map((g) => buildCard3(g, document)).filter(Boolean).map(([img, body]) => {
      const cell = document.createElement("div");
      if (img) {
        const p = document.createElement("p");
        p.append(img);
        cell.append(p);
      }
      cell.append(...body.childNodes);
      return [cell];
    });
    const intro = [];
    if (units.kind !== "single") {
      const inCard = (el) => units.cards.some((g) => g.some((c) => c.contains(el) || el.contains(c)));
      topLevel6(element, "div.rte").filter((r) => !inCard(r) && hasContent7(r)).forEach((r) => {
        cleanNode7(r);
        intro.push(...flatten7([...r.childNodes], document));
      });
    }
    const name = variant ? `cards-product (${variant})` : "cards-product";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (intro.length) element.before(...intro);
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-panel.js
  var COMPLEX2 = ".sg-Flextable, .sg-Grid, table, img, picture, video, iframe, .sg-Accordion, .youtubevideo";
  function pagePath3(document, params) {
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
  function slugify2(s) {
    return (s || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "item";
  }
  function fragmentPath(document, params, label) {
    const base = `/fragments/${pagePath3(document, params)}/${slugify2(label)}`;
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
  function text9(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function hasContent8(el) {
    return !!(text9(el) || el.querySelector("img, picture, video, iframe, table"));
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
    const labelText = text9(label) || "Details";
    const body = document.createElement("div");
    if (panel) {
      cleanTree(panel);
      body.append(...panel.childNodes);
      if (acc.matches("button")) panel.remove();
    }
    let bodyCell = body.childNodes.length ? body : "";
    if (body.querySelector(COMPLEX2) && params && Array.isArray(params.fragments)) {
      const path = fragmentPath(document, params, labelText);
      params.fragments.push({ element: body, path });
      const link = document.createElement("a");
      link.href = path;
      link.textContent = path;
      bodyCell = link;
    }
    if (label && /^H[1-6]$/.test(label.tagName) && text9(label)) {
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
      const cols = [...row.children].filter((c) => /sg-Grid-col/.test(c.className) && hasContent8(c));
      const withAcc = cols.filter((c) => c.querySelector(".sg-Accordion"));
      if (cols.length >= 2 && withAcc.length >= 1 && withAcc.length < cols.length) return "sidebar";
      if (withAcc.length >= 2) return "two-column";
    }
    return null;
  }
  function parse10(element, { document, params }) {
    const accordions = topAccordions(element);
    const variant = detectVariant2(element, accordions);
    const cells = [];
    let asideCols = [];
    if (variant === "sidebar") {
      const row = element.querySelector(".sg-Grid-row");
      asideCols = [...row.children].filter((c) => /sg-Grid-col/.test(c.className) && hasContent8(c) && !c.querySelector(".sg-Accordion"));
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
        } else if (hasContent8(unit)) {
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
          const text10 = span.textContent.trim();
          if (!text10) return;
          const linkText = [...span.querySelectorAll("a")].map((a) => a.textContent).join("").trim();
          if (linkText && linkText.replace(/\s+/g, "") === text10.replace(/\s+/g, "")) return;
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
    let hasContent9 = false;
    let pendingMeta = [];
    let prevHr = null;
    const toRemove = [];
    const visit = (node) => {
      if (node.nodeType === 3) {
        if (node.nodeValue.trim()) hasContent9 = true;
        return;
      }
      if (node.nodeType !== 1) return;
      if (node.tagName === "HR") {
        if (!hasContent9) {
          toRemove.push(prevHr || node, ...pendingMeta);
          if (!prevHr) {
            pendingMeta = [];
            return;
          }
        }
        prevHr = node;
        hasContent9 = false;
        pendingMeta = [];
        return;
      }
      if (isSectionMetadata(node)) {
        pendingMeta.push(node);
        return;
      }
      if (CONTENT_ELEMENTS.has(node.tagName)) {
        hasContent9 = true;
        return;
      }
      [...node.childNodes].forEach(visit);
    };
    [...main.childNodes].forEach(visit);
    if (prevHr && !hasContent9) toRemove.push(prevHr, ...pendingMeta);
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

  // tools/importer/import-landing-page.js
  var PAGE_TEMPLATE = { "name": "landing-page", "urls": ["https://www.suncorp.com.au/", "https://www.suncorp.com.au/insurance/"], "description": "Hub landing page without breadcrumb: full-width hero with text on photo, quick-action link strip, product link columns, a row of offer cards and a terms accordion", "blocks": [{ "name": "alert-banner", "instances": ["div.Page div.sg-Cell.key-event"], "pageInstances": { "https://www.suncorp.com.au/": ["body > div.Page > div:nth-child(2)"] } }, { "name": "hero-banner", "instances": ["div:has(> section.BgPlaceholder.contentBoxContainer__section)"], "pageInstances": { "https://www.suncorp.com.au/": ["#top-banner-canvas"], "https://www.suncorp.com.au/insurance/": ["#kzkhhwh", "#storm-score > section > div.Middle-column.Middle-column--Thin---Top.Middle-column--Thin---Bottom > div > div > div > div.aem-Grid.aem-Grid--12.aem-Grid--default--12"] } }, { "name": "quick-links", "instances": ['[data-catalog-page-only="quick-links"]'], "pageInstances": { "https://www.suncorp.com.au/": ["body > div.Page > main > div > div:nth-child(5)"] } }, { "name": "columns-links", "instances": ['[data-catalog-page-only="columns-links"]'], "pageInstances": { "https://www.suncorp.com.au/": ["#ContentBoxContainer_776c9d1040f44289810aaabe3eb7d001 > div:nth-child(2)"], "https://www.suncorp.com.au/insurance/": ["#explore-products"] } }, { "name": "cards-article", "instances": ['[data-catalog-page-only="cards-article"]'], "pageInstances": { "https://www.suncorp.com.au/": ["#latest-news"] } }, { "name": "hero-title", "instances": ['[data-catalog-page-only="hero-title"]'], "pageInstances": { "https://www.suncorp.com.au/": ["body > div.Page > main > div > div:nth-child(8)"] } }, { "name": "columns-media", "instances": ['[data-catalog-page-only="columns-media"]'], "pageInstances": { "https://www.suncorp.com.au/insurance/": ["body > div.Page > main > div > div:nth-child(5)", "#contact-options > section > div.Middle-column.Middle-column--Thin---Top.Middle-column--Thin---Bottom > div.sg-Grid.overflow-hidden"] } }, { "name": "cards-feature", "instances": ['[data-catalog-page-only="cards-feature"]'], "pageInstances": { "https://www.suncorp.com.au/insurance/": ["#FlexibleTable_8b75007d-3da1-414f-9cab-493dbfc5e123", "#FlexibleTable_a49afa61-33f5-439e-9176-864a26a5fdc7"] } }, { "name": "cards-product", "instances": ['[data-catalog-page-only="cards-product"]'], "pageInstances": { "https://www.suncorp.com.au/insurance/": ["#insurance-statement"] } }, { "name": "accordion-panel", "instances": ['[data-catalog-page-only="accordion-panel"]'], "pageInstances": { "https://www.suncorp.com.au/insurance/": ["#terms"] } }], "sections": [{ "id": "alert", "name": "Site alert band above the page", "selector": ["div.Page > div:has(> div > div.key-event)"], "style": null, "position": "start", "blocks": ["alert-banner"], "defaultContent": [] }, { "id": "links-band", "name": "Grey quick links band", "selector": ["div.Main-content > div.canvas__container:has(> div.Middle-column.sg-u-flex--centre)"], "style": "light-grey", "blocks": ["quick-links", "columns-links"], "defaultContent": [] }, { "id": "content-1", "name": "Content section 1", "selector": ["div.Main-content > div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-2", "name": "Content section 2", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-3", "name": "Content section 3", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-4", "name": "Content section 4", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-5", "name": "Content section 5", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-6", "name": "Content section 6", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-7", "name": "Content section 7", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-8", "name": "Content section 8", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-9", "name": "Content section 9", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-10", "name": "Content section 10", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-11", "name": "Content section 11", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }, { "id": "content-12", "name": "Content section 12", "selector": ["div.Main-content > div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container ~ div.canvas__container"], "style": null, "blocks": ["alert-banner", "hero-banner", "quick-links", "columns-links", "cards-article", "hero-title", "columns-media", "cards-feature", "cards-product", "accordion-panel"], "defaultContent": [] }], "pageCleanup": { "https://www.suncorp.com.au/": ["#ContentBoxContainer_501ac982ecd049f5ad7425891fee9c57 > div:nth-child(2) > p:nth-child(1) > span:nth-child(1) > a:nth-child(1)", "a.sg-Btn.sg-Btn--primary", "#experience-modal", "#_im_iframe_overlay__248", "#insurancequote", "#resilience-options", "#privacy-optout-banner", "#colorbox"], "https://www.suncorp.com.au/insurance/": ["div.colBoxContainer.colBoxContainer--center > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)", "#FlexibleTable_a49afa61-33f5-439e-9176-864a26a5fdc7 > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)", "#FlexibleTable_dbabf67a-2dda-4cab-9bbe-accd52b8199d > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)", "#FlexibleTable_908de546-75eb-4f6e-8671-72b98889b7e1 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)", "#FlexibleTable_7bf8c9b7-eabc-4fc9-af94-b9a01f19b189 > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(1) > a:nth-child(1)", "#experience-modal", "div.sg-Nav-overlay.sg-Nav-overlay--showOnMobile", "#_im_iframe_overlay__248", "#all-insured-events", "#damage-from-physical-home-building", "#fatal-injury-compensation-home-building", "#prevention-of-access-home-building", "#removal-of-debris-building", "#accidental-damage-home-building", "#safety-net-home-building", "#prevention-of-access-home-contents", "#exploratory-costs", "#exploratory-costs-1", "#security-attendance-fees", "#lock-replacement", "#mortgage-discharge-costs", "#environmental-improvements", "#damage-to-gardens-and-plants", "#other-repair-rebuilding-costs", "#removal-of-debris-home-contents", "#energy-costs-for-loss-of-supply", "#storage-of-undamaged-contents", "#temporary-accommodation-costs-home-contents", "#personal-valuables-home-and-contents", "#safety-net-home-contents", "#collections", "#prevention-of-access-contents", "#contents-commercial-storage", "#contents-temporarily-removed", "#financial-transaction-card", "#visitors-contents", "#food-medication-spoilage", "#damage-from-physical-contents", "#contents-in-transit", "#supplementary-expenses", "#contents-on-common", "#extra-costs-to-re-establish", "#fatal-injury-compensation-contents", "#paraplegia-quadriplegia-assistance", "#removal-of-debris-contents", "#temporary-accommodation", "#injury-to-pet-dogs", "#motor-burnout", "#accidental-damage-home-contents", "#portable-advantages", "#personal-valuables-contents", "#legal-liability", "#accidental-damage-at-property", "#motor-burnout-landlord", "#safety-net-landlord", "#accidental-damage-contents", "#strata-net-costs", "#accidental-glass-breakage", "#glass-breakage", "#excess-free-glass", "#home-assist", "#find-out-more", "#quote", "#retrieve-quote", "#claims", "#policy", "#roadside-assist", "#dunas", "#dunas-building", "#dunas-contents-only", "#dunas-renters", "#dunas-home-contents", "#resilience-options", "#privacy-optout-banner", "#colorbox"] } };
  var parsers = {
    "alert-banner": parse,
    "hero-banner": parse2,
    "quick-links": parse3,
    "columns-links": parse4,
    "cards-article": parse5,
    "hero-title": parse6,
    "columns-media": parse7,
    "cards-feature": parse8,
    "cards-product": parse9,
    "accordion-panel": parse10
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
  var import_landing_page_default = {
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
  return __toCommonJS(import_landing_page_exports);
})();
