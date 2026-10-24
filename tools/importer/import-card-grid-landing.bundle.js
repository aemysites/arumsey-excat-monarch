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

  // tools/importer/import-card-grid-landing.js
  var import_card_grid_landing_exports = {};
  __export(import_card_grid_landing_exports, {
    default: () => import_card_grid_landing_default
  });

  // tools/importer/parsers/accordion-faq.js
  function cleanInline(root) {
    root.querySelectorAll("svg, .icon-svg, span.reader").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      const sym = btn.textContent.replace(/\s+/g, " ").trim();
      btn.replaceWith(btn.ownerDocument.createTextNode(sym));
    });
    root.querySelectorAll("span.spacer").forEach((n) => n.remove());
  }
  function hasContent(el) {
    return !!(el && (el.textContent.trim() || el.querySelector("img, picture, iframe, table")));
  }
  function questionHeading(src, document) {
    const h = src && src.closest("h1, h2, h3, h4, h5, h6");
    return document.createElement(h ? h.tagName.toLowerCase() : "h3");
  }
  function parse(element, { document }) {
    const cells = [];
    cleanInline(element);
    const intro = element.querySelector(".intro-common .content-wrap, .intro-common");
    if (intro && !intro.closest(".accordion")) {
      const introParts = [...intro.children].filter((c) => hasContent(c));
      if (introParts.length) cells.push([introParts]);
    }
    const items = [...element.querySelectorAll("div.accordion")].filter(
      (acc) => !acc.parentElement.closest("div.accordion")
    );
    items.forEach((acc) => {
      const btn = acc.querySelector(".accordion__btn, h3 button, button");
      const qText = btn ? btn.textContent.replace(/\s+/g, " ").trim() : "";
      if (!qText) return;
      const question = questionHeading(btn, document);
      question.textContent = qText;
      const content = acc.querySelector(".accordion__content");
      const answer = [];
      if (content) {
        [...content.children].forEach((child) => {
          if (child.matches(".btn-container")) {
            if (hasContent(child)) answer.push(...child.querySelectorAll("a"));
            return;
          }
          if (!hasContent(child)) return;
          if (child.tagName === "DIV") {
            [...child.childNodes].forEach((n) => {
              if (n.nodeType === 1 && hasContent(n)) answer.push(n);
              else if (n.nodeType === 3 && n.textContent.trim()) {
                const p2 = document.createElement("p");
                p2.textContent = n.textContent.trim();
                answer.push(p2);
              }
            });
          } else {
            answer.push(child);
          }
        });
      }
      cells.push([question, answer.length ? answer : ""]);
    });
    if (!items.length) {
      const drawers = [...element.querySelectorAll("ul.accordion > li")].filter((li) => !li.parentElement.closest("ul.accordion > li"));
      drawers.forEach((li) => {
        const head = li.querySelector(".drawer-header, header h3, header");
        const qText = head ? head.textContent.replace(/\s+/g, " ").trim() : "";
        if (!qText) return;
        const question = questionHeading(head, document);
        question.textContent = qText;
        const answer = [];
        const detail = li.querySelector(".detail-div");
        if (detail) {
          detail.querySelectorAll("p, ul, ol, table").forEach((n) => {
            const outer = n.parentElement.closest("p, ul, ol, table");
            if (outer && detail.contains(outer)) return;
            if (n.closest(".btn-container")) return;
            if (hasContent(n)) answer.push(n);
          });
          detail.querySelectorAll(".btn-container a[href]").forEach((a) => {
            if (!a.textContent.trim()) return;
            const p2 = document.createElement("p");
            const link3 = document.createElement("a");
            link3.href = /^javascript:/i.test(a.getAttribute("href")) ? "#" : a.getAttribute("href");
            link3.textContent = a.textContent.replace(/\s+/g, " ").trim();
            p2.append(link3);
            answer.push(p2);
          });
        }
        cells.push([question, answer.length ? answer : ""]);
      });
    }
    const isLight = element.matches(".spruce-eggshell-theme") || !!element.closest(".spruce-eggshell-theme");
    const hasIntro = cells.length > items.length || cells[0] && cells[0].length === 1;
    let name = "accordion-faq";
    if (isLight) name = hasIntro ? "accordion-faq (light)" : "accordion-faq (light-2)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/savings-calculator.js
  var FIELD_KEYS = ["net-income", "salary", "w2-income", "w2-ss-withheld", "other-se-income"];
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function heading(document, tag, label) {
    const h = document.createElement(tag);
    h.textContent = label;
    return h;
  }
  function link(document, a, label) {
    const out = document.createElement("a");
    const href = (a.getAttribute("href") || "").trim();
    out.href = !href || /^javascript:/i.test(href) ? "#" : href;
    out.textContent = label || text(a);
    return out;
  }
  function helpCell(document, tip) {
    if (!tip || !text(tip)) return "";
    const p2 = document.createElement("p");
    tip.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        p2.append(document.createTextNode(n.textContent.replace(/\s+/g, " ")));
      } else if (n.nodeType === 1 && n.tagName === "A") {
        p2.append(link(document, n));
      } else if (n.nodeType === 1 && n.tagName !== "SVG" && text(n)) {
        p2.append(document.createTextNode(` ${text(n)} `));
      }
    });
    p2.innerHTML = p2.innerHTML.replace(/\s{2,}/g, " ").trim();
    return p2;
  }
  function parse2(element, { document }) {
    const root = element.matches(".tax-saving-cal-container") ? element : element.querySelector(".tax-saving-cal-container") || element;
    const rows = [];
    const intro = [];
    const introRoot = root.querySelector(".left-side-tax-cal-heading") || root;
    const h2 = introRoot.querySelector("h1, h2");
    if (h2 && text(h2)) intro.push(heading(document, "h2", text(h2)));
    introRoot.querySelectorAll("p").forEach((p2) => {
      if (text(p2)) intro.push(para(document, text(p2)));
    });
    if (intro.length) rows.push(["Intro", intro]);
    root.querySelectorAll(".form-input-textbox").forEach((box, i) => {
      const label = text(box.querySelector("label"));
      if (!label) return;
      const tip = box.querySelector('button [class*="tooltip-text"], button [role="tooltip"], button span');
      rows.push(["Field", label, helpCell(document, tip), FIELD_KEYS[i] || ""]);
    });
    const submit = root.querySelector('input[type="submit"], button[type="submit"]');
    const buttonLabel = submit ? submit.getAttribute("value") || text(submit) : "";
    if (buttonLabel) rows.push(["Button", buttonLabel.trim()]);
    const upper = root.querySelector(".taxsaving-cal-upper") || root.querySelector(".right-side-calculator");
    if (upper) {
      const rh = [...upper.querySelectorAll("h1, h2, h3")].find((h) => text(h) && !h.querySelector('#calculation-tax-ans, b[role="status"]'));
      const disclaimer = upper.querySelector("h4, p");
      rows.push(["Result", rh ? para(document, text(rh)) : "", disclaimer && text(disclaimer) ? para(document, text(disclaimer)) : ""]);
    }
    const lower = root.querySelector(".right-side-calculator-lower");
    if (lower) {
      const cta = [];
      const hs = [...lower.querySelectorAll("h1, h2, h3, h4, p")].filter((h) => text(h) && !h.closest(".btn-container"));
      hs.forEach((h, i) => cta.push(i === 0 ? heading(document, "h3", text(h)) : para(document, text(h))));
      lower.querySelectorAll(".btn-container a, a.btn").forEach((a) => {
        if (!text(a)) return;
        const strong = document.createElement("strong");
        strong.append(link(document, a));
        cta.push(para(document, strong));
      });
      if (cta.length) rows.push(["CTA", cta]);
    }
    const after = [];
    const quiz = root.querySelector(".tax-saving-quiz-section");
    if (quiz) {
      quiz.querySelectorAll("h1, h2, h3, h4, p").forEach((n) => {
        if (!text(n)) return;
        after.push(/^H[1-6]$/.test(n.tagName) ? heading(document, n.tagName.toLowerCase(), text(n)) : para(document, text(n)));
      });
      quiz.querySelectorAll("a").forEach((a) => {
        if (text(a)) after.push(para(document, link(document, a)));
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "savings-calculator", cells: rows });
    root.replaceWith(block);
    let prev = block;
    after.forEach((n) => {
      prev.after(n);
      prev = n;
    });
    return [block, ...after];
  }

  // tools/importer/parsers/tabs-pill.js
  var BLOCK_SEL = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text2(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline2(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text2(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para2(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text2(el)) link3.append(img);
    else link3.textContent = text2(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text2(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para2(document, strong);
    }
    return para2(document, link3);
  }
  function extract(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para2(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para2(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text2(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text2(b))));
          if (text2(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text2(n) || n.querySelector("img")) out.push(ctaPara(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text2(n)) out.push(ctaPara(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text2(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function pageSlug(params) {
    try {
      const parts = new URL(params && params.originalURL).pathname.split("/").filter(Boolean);
      return (parts[parts.length - 1] || "index").replace(/\.html?$/, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    } catch (e) {
      return "page";
    }
  }
  function topColumns(section) {
    const list = section.querySelector(":scope > .container > ul.column-container") || section.querySelector("ul.column-container");
    if (!list) return [];
    return [...list.children].filter((li) => li.matches("li") && (text2(li) || li.querySelector("img, svg")));
  }
  function isComplex(panel) {
    if (panel.querySelector(".card-v2, article, table, .featurecard, img, picture, iframe, .cq-dd-image")) return true;
    return [...panel.querySelectorAll("section.column-control")].some((s) => topColumns(s).length > 1);
  }
  function pricingCardBody(document, card) {
    const body = [];
    const h = card.querySelector("h1, h2, h3, h4");
    if (h && text2(h)) {
      const nh = document.createElement("h3");
      nh.textContent = text2(h);
      body.push(nh);
    }
    const head = card.querySelector(".card-head") || card;
    head.querySelectorAll(":scope > p").forEach((p2) => {
      if (text2(p2)) body.push(p2);
    });
    const list = head.querySelector("ul");
    if (list && text2(list)) {
      const ul = document.createElement("ul");
      [...list.children].forEach((li) => {
        if (text2(li)) {
          const n = document.createElement("li");
          n.textContent = text2(li);
          ul.append(n);
        }
      });
      body.push(ul);
    }
    card.querySelectorAll(".card-price-section").forEach((sec) => {
      const label = text2(sec.querySelector(".copy-small"));
      if (label) body.push(para2(document, label));
      const price = sec.querySelector(".product-price") || sec.querySelector("strong");
      if (price && text2(price)) body.push(para2(document, text2(price)));
    });
    card.querySelectorAll(".pricingtext").forEach((pt) => {
      pt.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
      if (text2(pt)) body.push(para2(document, text2(pt)));
    });
    card.querySelectorAll(".card-footer a, .card-footer button").forEach((c) => {
      if (text2(c)) body.push(ctaPara(document, c));
    });
    return body;
  }
  function buildUnits(document, node, out) {
    [...node.children].forEach((child) => {
      if (!text2(child) && !child.querySelector("img, picture, iframe, svg")) return;
      if (child.matches(".tax-saving-cal-container")) {
        out.push(...parse2(child, { document }));
        return;
      }
      if (child.matches("section.column-control")) {
        const cols = topColumns(child);
        if (cols.length > 1) {
          const pricing = cols.every((c) => c.querySelector(".card-v2"));
          const stacked = cols.every((c) => c.querySelector("article.card-stacked"));
          if (pricing) {
            const rows = cols.map((c) => {
              const ribbon = !c.closest(".hide-ribbon") ? c.querySelector(".card-ribbon-v2") : null;
              return [ribbon && text2(ribbon) ? text2(ribbon) : "", pricingCardBody(document, c.querySelector(".card-v2"))];
            });
            out.push(WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells: rows }));
          } else if (stacked) {
            const rows = cols.map((c) => {
              const card = c.querySelector("article.card-stacked");
              const img = card.querySelector(".cmp-column--image img");
              if (img) img.closest(".cmp-column--image").remove();
              return [img || "", extract(document, card)];
            });
            out.push(WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells: rows }));
          } else {
            const row = cols.map((c) => {
              c.querySelectorAll(".card-v2").forEach((card) => {
                const wrap = document.createElement("div");
                wrap.append(...pricingCardBody(document, card));
                card.replaceWith(wrap);
              });
              return extract(document, c);
            }).filter((c) => c.length);
            if (row.length) out.push(WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells: [row] }));
          }
          return;
        }
        if (cols.length === 1) {
          buildUnits(document, cols[0], out);
          return;
        }
      }
      if (child.matches("div, section") && child.querySelector("section.column-control")) {
        buildUnits(document, child, out);
        return;
      }
      out.push(...extract(document, { childNodes: [child] }));
    });
  }
  function parse3(element, { document, params }) {
    element.querySelectorAll("span.reader, span.hide").forEach((n) => n.remove());
    cleanInline2(element);
    const tabs = [...element.querySelectorAll('[role="tab"]')].filter((t) => text2(t));
    const panels = [...element.querySelectorAll('[role="tabpanel"]')];
    const slug = pageSlug(params);
    if (params) params.tabsPillCount = (params.tabsPillCount || 0) + 1;
    const prefix = params && params.tabsPillCount > 1 ? `${slug}-${params.tabsPillCount}` : slug;
    const cells = [];
    panels.forEach((panel, i) => {
      panel.removeAttribute("style");
      const label = text2(tabs[i]) || `Tab ${i + 1}`;
      if (isComplex(panel) && params && Array.isArray(params.fragments)) {
        const path = `/fragments/${prefix}-tab-${i + 1}`;
        const fragment = document.createElement("div");
        const units = [];
        buildUnits(document, panel, units);
        fragment.append(...units);
        params.fragments.push({ element: fragment, path });
        const a = document.createElement("a");
        a.href = path;
        a.textContent = path;
        cells.push([label, para2(document, a)]);
      } else {
        const content = extract(document, panel);
        cells.push([label, content.length ? content : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-pill", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/office-locator.js
  function text3(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para3(document, ...nodes) {
    const p2 = document.createElement("p");
    nodes.filter(Boolean).forEach((n) => p2.append(n));
    return p2;
  }
  function link2(document, href, label) {
    const a = document.createElement("a");
    a.href = !href || /^javascript:/i.test(href) ? "#" : href;
    a.textContent = label;
    return a;
  }
  function lines(el) {
    if (!el) return [];
    const clone = el.cloneNode(true);
    clone.querySelectorAll("br").forEach((br) => br.replaceWith(""));
    clone.querySelectorAll("div, p").forEach((n) => n.append(""));
    return clone.textContent.replace(/\s+/g, " ").split("").map((s) => s.trim().replace(/\s+,/g, ",")).filter(Boolean);
  }
  function ctaParagraph(document, container) {
    if (!container) return null;
    const controls = [...container.querySelectorAll("a, button")].filter((c) => text3(c));
    if (!controls.length) return null;
    const p2 = document.createElement("p");
    controls.forEach((c, i) => {
      if (i) p2.append(" ");
      const a = link2(document, c.getAttribute("href"), text3(c));
      if (c.classList.contains("btn")) {
        const strong = document.createElement("strong");
        strong.append(a);
        p2.append(strong);
      } else {
        p2.append(a);
      }
    });
    return p2;
  }
  function parse4(element, { document }) {
    const details = [];
    const mapCell = [];
    const title = element.querySelector("h1.opp-title, h1, h2");
    if (title) {
      const place = title.querySelector(".opp-city-state");
      const placeText = text3(place);
      const clone = title.cloneNode(true);
      const cloneplace = clone.querySelector(".opp-city-state");
      if (cloneplace) cloneplace.remove();
      const eyebrow = text3(clone);
      if (eyebrow && placeText) details.push(para3(document, eyebrow));
      const h = document.createElement("h1");
      h.textContent = placeText || text3(title);
      details.push(h);
    }
    const addressLink = element.querySelector(".opp-address a[href], a.address[href]");
    let addressText = "";
    if (addressLink) {
      const a = document.createElement("a");
      a.href = addressLink.getAttribute("href");
      const parts = lines(addressLink.querySelector(".lbl-address") || addressLink);
      addressText = parts.join(", ");
      parts.forEach((line, i) => {
        if (i) a.append(document.createElement("br"));
        a.append(line);
      });
      details.push(para3(document, a));
    }
    const hours = element.querySelector(".office-hours");
    if (hours) {
      const today = text3(hours.querySelector(".opp-today-open-time, .lbl-open-time"));
      const DAY_RE = /^((?:mon|tues|wednes|thurs|fri|satur|sun)day)\s*(.*)$/i;
      const days = [...hours.querySelectorAll(".lbl-week-times p, .opp-week-open-time p")].map((p2) => {
        const spans = [...p2.querySelectorAll("span")].map(text3).filter(Boolean);
        if (spans.length > 1) return spans;
        const row = text3(p2);
        const m = row.match(DAY_RE);
        if (m) return m[2] ? [m[1], m[2]] : [m[1]];
        return row ? [row] : [];
      }).filter((cells2) => cells2.length);
      if (today) details.push(para3(document, today));
      if (days.length) {
        const ul = document.createElement("ul");
        days.forEach((cells2) => {
          const li = document.createElement("li");
          li.textContent = cells2.length > 1 ? `${cells2[0]}: ${cells2.slice(1).join(" ")}` : cells2[0];
          ul.append(li);
        });
        details.push(ul);
      }
    }
    const tel = element.querySelector('.opp-phone a[href^="tel:"], a[href^="tel:"]');
    if (tel) details.push(para3(document, link2(document, tel.getAttribute("href"), text3(tel))));
    const cta = ctaParagraph(document, element.querySelector(".btn-office-info"));
    if (cta) details.push(cta);
    const mapEl = element.querySelector("[data-latitude][data-longitude]");
    const lat = mapEl && mapEl.getAttribute("data-latitude");
    const lng = mapEl && mapEl.getAttribute("data-longitude");
    let mapHref = "";
    if (lat && lng) mapHref = `https://maps.google.com/maps?q=${lat},${lng}`;
    else if (addressLink) mapHref = addressLink.getAttribute("href");
    if (mapHref) mapCell.push(para3(document, link2(document, mapHref, addressText ? `Map: ${addressText}` : mapHref)));
    const rating = element.querySelector(".office-rating");
    if (rating) {
      const avg = text3(rating.querySelector(".bv_averageRating_component_container"));
      const count = text3(rating.querySelector(".bv_numReviews_component_container")).replace(/[()]/g, "");
      if (avg) mapCell.push(para3(document, `${avg} out of 5 stars${count ? ` (${count} reviews)` : ""}`));
    }
    const cells = [[details.length ? details : "", mapCell.length ? mapCell : ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "office-locator", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-office-services.js
  function text4(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline3(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, svg").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text4(btn)));
    });
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("a.opp-services-seemore, a.opp-services-seeless").forEach((a) => a.remove());
  }
  function parse5(element, { document }) {
    cleanInline3(element);
    const container = element.querySelector(".opp-services-container") || element;
    const rows = [];
    const heading3 = container.querySelector(".opp-services-title, h1, h2, h3");
    if (heading3 && text4(heading3)) {
      const h = document.createElement("h2");
      h.textContent = text4(heading3);
      rows.push([h]);
    }
    const services = [...container.querySelectorAll("ul.opp-services > li")];
    services.forEach((li) => {
      const icon = li.querySelector("img.opp-service-icon, img");
      const iconCell = [];
      if (icon && icon.getAttribute("src")) {
        const img = document.createElement("img");
        img.src = icon.getAttribute("src");
        img.alt = icon.getAttribute("alt") || "";
        iconCell.push(img);
      }
      const body = [];
      const title = text4(li.querySelector(".opp-service-title, strong"));
      if (title) {
        const p2 = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title;
        p2.append(strong);
        body.push(p2);
      }
      const desc = li.querySelector(".opp-service-desc");
      if (desc) {
        const paras = [...desc.querySelectorAll("p")];
        if (paras.length) paras.forEach((p2) => {
          if (text4(p2)) body.push(p2);
        });
        else if (text4(desc)) {
          const p2 = document.createElement("p");
          p2.append(...desc.childNodes);
          body.push(p2);
        }
      }
      if (!iconCell.length && !body.length) return;
      rows.push([iconCell.length ? iconCell : "", body.length ? body : ""]);
    });
    const ctas = [...element.querySelectorAll(".btn-container a[href], a.btn[href]")].filter((a, i, all) => text4(a) && all.indexOf(a) === i);
    if (ctas.length) {
      const p2 = document.createElement("p");
      ctas.forEach((a, i) => {
        if (i) p2.append(" ");
        const link3 = document.createElement("a");
        link3.href = a.getAttribute("href");
        link3.textContent = text4(a);
        const strong = document.createElement("strong");
        strong.append(link3);
        p2.append(strong);
      });
      rows.push([p2]);
    }
    const name = services.length >= 3 ? "cards-office-services (alt)" : "cards-office-services";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: rows.length ? rows : [[""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function text5(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline4(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text5(btn)));
    });
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
  }
  function statLines(el) {
    if (!el) return [];
    const clone = el.cloneNode(true);
    clone.querySelectorAll("br").forEach((br) => br.replaceWith(""));
    return clone.textContent.replace(/\s+/g, " ").split("").map((s) => s.trim()).filter(Boolean);
  }
  function imageOf(document, root) {
    const img = root && root.querySelector("img[src]");
    if (!img) return null;
    const out = document.createElement("img");
    out.src = img.getAttribute("src");
    out.alt = img.getAttribute("alt") || "";
    return out;
  }
  function p(document, content, bold = false) {
    const el = document.createElement("p");
    if (bold) {
      const strong = document.createElement("strong");
      strong.textContent = content;
      el.append(strong);
    } else if (typeof content === "string") {
      el.textContent = content;
    } else if (content) {
      el.append(content);
    }
    return el;
  }
  function parse6(element, { document }) {
    cleanInline4(element);
    const cols = [...element.querySelectorAll("ul.column-container > li.column")].filter((li) => !li.parentElement.closest("li.column"));
    const featureCol = cols.find((li) => li.querySelector(".featurecard, .card-secondary")) || cols[0];
    const listCol = cols.find((li) => li !== featureCol);
    const feature = [];
    if (featureCol) {
      const card = featureCol.querySelector(".featurecard, .card-secondary") || featureCol;
      const photo = imageOf(document, card.querySelector(".card-img") || card);
      if (photo) feature.push(p(document, photo));
      const head = card.querySelector("h1, h2, h3, h4, h5, h6");
      const [figure, ...caption] = statLines(head || card.querySelector("header") || card);
      if (figure) {
        const h = document.createElement("h3");
        h.textContent = figure;
        feature.push(h);
      }
      if (caption.length) feature.push(p(document, caption.join(" ")));
    }
    const items = [];
    if (listCol) {
      const stats = [...listCol.querySelectorAll(".introImageVariant")].filter((n) => !n.parentElement.closest(".introImageVariant"));
      stats.forEach((item) => {
        const icon = imageOf(document, item.querySelector(".cmp-column--image") || item);
        const body = item.querySelector(".modal-body, .left-30") || item;
        const textEl = body.querySelector("h1, h2, h3, h4, h5, h6, p") || body;
        const [figure, ...caption] = statLines(textEl);
        if (!icon && !figure) return;
        if (icon) items.push(p(document, icon));
        if (figure) items.push(p(document, figure, true));
        if (caption.length) items.push(p(document, caption.join(" ")));
      });
    }
    const cells = [[feature.length ? feature : "", items.length ? items : ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/contact-form.js
  function text6(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  var SUPPORTED = ["text", "email", "tel", "number", "url", "date", "textarea", "select", "checkbox", "radio"];
  function parse7(element, { document }) {
    const form = element.querySelector("form") || element;
    const rows = [];
    form.querySelectorAll("input, select, textarea").forEach((control) => {
      const type = control.tagName === "INPUT" ? (control.getAttribute("type") || "text").toLowerCase() : control.tagName.toLowerCase();
      if (!SUPPORTED.includes(type)) return;
      if (control.closest(".g-recaptcha") || control.classList.contains("g-recaptcha-response")) return;
      const id = control.getAttribute("id");
      let label = id ? form.querySelector(`label[for="${id}"]`) : null;
      if (!label) label = control.closest("label") || control.parentElement && control.parentElement.querySelector("label");
      let labelText = text6(label) || control.getAttribute("aria-label") || control.getAttribute("placeholder") || control.getAttribute("name") || "";
      if (!labelText) return;
      if (control.hasAttribute("required") && !labelText.endsWith("*")) labelText += "*";
      let third = control.getAttribute("placeholder") || "";
      if (type === "select") {
        third = [...control.querySelectorAll("option")].filter((o, i) => !(i === 0 && /^(|null|0)$/i.test((o.getAttribute("value") || "").trim()))).map(text6).filter(Boolean).join(", ");
      }
      rows.push([labelText.replace(/\s*\*$/, "*"), type, third]);
    });
    const submit = form.querySelector('button[type="submit" i], input[type="submit" i], button.cmp-form-button');
    rows.push([text6(submit) || (submit == null ? void 0 : submit.getAttribute("value")) || "Submit", "submit", ""]);
    const thanks = element.querySelector(".thank-you-section");
    if (thanks && text6(thanks)) {
      const success = [];
      const img = thanks.querySelector("img[src]");
      if (img) {
        const out = document.createElement("img");
        out.src = img.getAttribute("src");
        out.alt = img.getAttribute("alt") || "";
        success.push(out);
      }
      const seen = /* @__PURE__ */ new Set();
      thanks.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((n, i) => {
        const t = text6(n);
        if (!t || seen.has(t)) return;
        seen.add(t);
        const isHeading = /^H[1-6]$/.test(n.tagName) || i === 0 && n.matches(".text-jumbo, .text-large");
        const out = document.createElement(isHeading ? /^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : "h2" : "p");
        out.textContent = t;
        success.push(out);
      });
      if (success.length) rows.push(["Success", success]);
    }
    const error = element.querySelector(".form-submit-error");
    if (error && text6(error)) rows.push(["Error", text6(error)]);
    const intro = [];
    form.querySelectorAll(".introtext h1, .introtext h2, .introtext h3, .introtext p, .introDefaultvariant h1, .introDefaultvariant h2, .introDefaultvariant h3, .introDefaultvariant p").forEach((n) => {
      if (!text6(n) || intro.some((x) => x.src === n)) return;
      const tag = /^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : "p";
      const out = document.createElement(tag);
      out.textContent = text6(n);
      intro.push({ src: n, out });
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "contact-form", cells: rows });
    element.replaceWith(block);
    intro.forEach(({ out }) => block.before(out));
  }

  // tools/importer/parsers/search-articles.js
  function text7(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse8(element, { document }) {
    const cells = [];
    const form = element.querySelector("form") || element;
    const label = form.querySelector("label");
    const input = form.querySelector('input[type="search"], input[name="q"]');
    const prompt = !input && form.querySelector("select option");
    const labelText = text7(label) || input && input.getAttribute("placeholder") || text7(prompt) || "Search";
    cells.push([labelText]);
    const action = form.getAttribute && form.getAttribute("action");
    if (action && !/^javascript:/i.test(action)) {
      const a = document.createElement("a");
      a.href = action;
      a.textContent = action;
      cells.push([a]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "search-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-data.js
  var BLOCK_SEL2 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text8(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden2(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline5(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text8(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg2(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para4(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara2(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text8(el)) link3.append(img);
    else link3.textContent = text8(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text8(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para4(document, strong);
    }
    return para4(document, link3);
  }
  function extract2(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para4(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden2(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg2(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para4(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text8(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text8(b))));
          if (text8(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text8(n) || n.querySelector("img")) out.push(ctaPara2(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text8(n)) out.push(ctaPara2(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden2(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL2) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text8(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function parse9(element, { document }) {
    element.querySelectorAll("td img[alt], th img[alt]").forEach((img) => {
      const alt = (img.getAttribute("alt") || "").replace(/\s+/g, " ").trim();
      if (!/^(not )?(available|included)$|^unavailable$/i.test(alt)) return;
      const cell = img.closest("td, th");
      const clone = cell.cloneNode(true);
      clone.querySelectorAll("img").forEach((n) => n.remove());
      if (clone.textContent.trim()) return;
      img.replaceWith(document.createTextNode(alt));
    });
    element.querySelectorAll("svg[aria-label]").forEach((svg) => {
      const label = svg.getAttribute("aria-label");
      if (!label || /^(faq list|icon)$/i.test(label)) return;
      let mark = label;
      if (/not included|unavailable|no\b/i.test(label)) mark = "Not included";
      else if (/included|available|yes\b/i.test(label)) mark = "Included";
      svg.replaceWith(document.createTextNode(mark));
    });
    element.querySelectorAll("td svg:not([aria-label])").forEach((svg) => {
      const td = svg.closest("td");
      const clone = td.cloneNode(true);
      clone.querySelectorAll(".hide-large, .feature-title, svg").forEach((n) => n.remove());
      if (!clone.textContent.trim()) svg.replaceWith(document.createTextNode("Included"));
    });
    element.querySelectorAll("thead").forEach((thead) => {
      const locks = [...thead.querySelectorAll("tr.table-lock")];
      const regular = [...thead.querySelectorAll("tr")].filter((tr) => !tr.matches(".table-lock"));
      if (regular.length) locks.forEach((n) => n.remove());
    });
    element.querySelectorAll("tbody tr.table-lock, .hide-large, .feature-title, .reader, a.learn-more:empty").forEach((n) => n.remove());
    cleanInline5(element);
    const table = element.matches("table") ? element : element.querySelector("table");
    const cells = [];
    if (table) {
      const rows = [...table.querySelectorAll("tr")].filter((tr) => tr.closest("table") === table);
      const cellsOf = (tr) => [...tr.children].filter((c) => c.matches("th, td"));
      const span = (cell, attr) => Math.max(1, parseInt(cell.getAttribute(attr), 10) || 1);
      const hasSpans = rows.some((tr) => cellsOf(tr).some((c) => span(c, "rowspan") > 1 || span(c, "colspan") > 1));
      const hasChildRows = rows.some((tr) => tr.matches(".child-form"));
      const content = (cell, tr, c) => {
        const inlineOnly = text8(cell) && !cell.querySelector(BLOCK_SEL2) && !cell.querySelector("img, svg, button");
        const out = inlineOnly ? [para4(document, [...cell.childNodes])] : extract2(document, cell);
        if (hasChildRows && c === 0 && !tr.matches(".child-form") && !tr.closest("thead") && !cell.matches('th[scope="col"]') && out.length) {
          const strong = document.createElement("strong");
          strong.textContent = out.map((n) => text8(n)).join(" ");
          return [para4(document, strong)];
        }
        return out.length ? out : "";
      };
      if (hasSpans) {
        const grid = [];
        rows.forEach((tr, r) => {
          grid[r] = grid[r] || [];
          let col = 0;
          cellsOf(tr).forEach((cell) => {
            while (grid[r][col] !== void 0) col += 1;
            const rs = span(cell, "rowspan");
            const cs = span(cell, "colspan");
            for (let dr = 0; dr < rs; dr += 1) {
              grid[r + dr] = grid[r + dr] || [];
              for (let dc = 0; dc < cs; dc += 1) grid[r + dr][col + dc] = dr || dc ? "" : { cell, tr, cs, c: col };
            }
            col += cs;
          });
        });
        const width = grid.reduce((m, r) => Math.max(m, (r || []).length), 0);
        grid.slice(0, rows.length).forEach((slots) => {
          const real = (slots || []).filter((x) => x && x.cell);
          if (real.length === 1 && real[0].cs >= width && width > 1) {
            const c = content(real[0].cell, real[0].tr, 0);
            if (c) cells.push([c]);
            return;
          }
          const row = [];
          for (let i = 0; i < width; i += 1) {
            const slot = slots && slots[i];
            row.push(slot && slot.cell ? content(slot.cell, slot.tr, i) : "");
          }
          cells.push(row);
        });
      } else {
        let maxCols = 0;
        const built = rows.map((tr) => {
          const row = cellsOf(tr).map((cell, c) => content(cell, tr, c));
          maxCols = Math.max(maxCols, row.length);
          return row;
        }).filter((r) => r.some((c) => c !== ""));
        built.forEach((r) => {
          if (r.length === 1 && maxCols > 1) {
            cells.push(r);
            return;
          }
          while (r.length < maxCols) r.push("");
          cells.push(r);
        });
      }
    }
    const intro = [];
    element.querySelectorAll(".introDefaultvariant h1, .introDefaultvariant h2, .introDefaultvariant h3, .introDefaultvariant h4, .introDefaultvariant p").forEach((n) => {
      if (n.closest("table") || !n.textContent.trim()) return;
      const outer = n.parentElement.closest("p, h1, h2, h3, h4");
      if (outer && element.contains(outer)) return;
      const tag = /^H[1-6]$/.test(n.tagName) ? n.tagName.toLowerCase() : "p";
      const out = document.createElement(tag);
      out.textContent = n.textContent.replace(/\s+/g, " ").trim();
      intro.push(out);
    });
    const name = table && table.matches(".grid-table, .table-grid") ? "table-data (matrix)" : "table-data";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
    intro.forEach((n) => block.before(n));
  }

  // tools/importer/parsers/cards-pricing.js
  function text9(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline6(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, span.hide, span.arrow-wrap, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text9(btn)));
    });
  }
  function para5(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function priceParagraph(document, el) {
    const p2 = document.createElement("p");
    const dels = [...el.querySelectorAll("del, s, strike")];
    if (!dels.length) {
      p2.textContent = text9(el);
      return p2;
    }
    dels.forEach((d) => {
      const del = document.createElement("del");
      del.textContent = text9(d);
      if (p2.childNodes.length) p2.append(" ");
      p2.append(del);
    });
    const clone = el.cloneNode(true);
    clone.querySelectorAll("del, s, strike").forEach((d) => d.remove());
    const current = text9(clone);
    if (current) p2.append(` ${current}`);
    return p2;
  }
  function ctaParagraphs(document, container) {
    const out = [];
    [...container.querySelectorAll("a, button")].filter((c) => text9(c)).forEach((c) => {
      const link3 = document.createElement("a");
      link3.href = c.tagName === "A" && c.getAttribute("href") || "#";
      link3.textContent = text9(c);
      if (c.classList.contains("btn") || c.tagName === "BUTTON") {
        const strong = document.createElement("strong");
        strong.append(link3);
        out.push(para5(document, strong));
      } else {
        out.push(para5(document, link3));
      }
    });
    return out;
  }
  function parse10(element, { document }) {
    cleanInline6(element);
    element.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br").forEach((br) => br.replaceWith(" "));
    const cells = [];
    const cards = [...element.querySelectorAll("div.card-v2")];
    cards.forEach((card) => {
      const col = card.closest("li.column") || card.parentElement;
      const ribbon = col && !col.closest(".hide-ribbon") ? col.querySelector(".card-ribbon-v2") : null;
      const tab = ribbon && text9(ribbon) ? text9(ribbon) : "";
      const body = [];
      const head = card.querySelector(".card-head") || card;
      const headings = [...head.querySelectorAll("h1, h2, h3, h4, h5")];
      const label = headings.find((h) => h.matches(".product-label"));
      const subhead = label ? headings.find((h) => h !== label && h.closest(".subhead")) : null;
      if (label && subhead) {
        body.push(para5(document, text9(label)));
        headings.splice(0, headings.length, subhead, ...headings.filter((h) => h !== label && h !== subhead));
      }
      if (headings.length) {
        const main = headings[0];
        const h = document.createElement(/^H[1-6]$/.test(main.tagName) ? main.tagName.toLowerCase() : "h3");
        const a = main.querySelector("a[href]");
        if (a) {
          const link3 = document.createElement("a");
          link3.href = a.getAttribute("href");
          link3.textContent = text9(main);
          h.append(link3);
        } else {
          h.textContent = text9(main);
        }
        body.push(h);
        headings.slice(1).forEach((sub) => {
          if (text9(sub)) body.push(para5(document, text9(sub)));
        });
      }
      head.querySelectorAll(":scope > p, :scope > div:not(.card-center-head) > p").forEach((p2) => {
        if (text9(p2)) body.push(p2);
      });
      head.querySelectorAll(":scope > div.card-center-head > p").forEach((p2) => {
        const t = text9(p2);
        if (t && !body.some((b) => text9(b) === t)) body.push(p2);
      });
      const list = head.querySelector("ul");
      if (list) {
        const ul = document.createElement("ul");
        [...list.children].forEach((li) => {
          if (!text9(li)) return;
          const item = document.createElement("li");
          const holder = [...li.querySelectorAll(":scope > span")].find((sp) => text9(sp)) || li;
          item.append(...[...holder.childNodes]);
          ul.append(item);
        });
        if (ul.children.length) body.push(ul);
      }
      const footer = card.querySelector(".card-footer") || card;
      const priceSection = footer.querySelector(".card-price-section");
      if (priceSection) {
        const label2 = priceSection.querySelector(".copy-small");
        if (text9(label2)) body.push(para5(document, text9(label2)));
        const price = priceSection.querySelector("strong, .price");
        if (text9(price)) body.push(priceParagraph(document, price));
      }
      footer.querySelectorAll(".state-adnl, .pricingtext").forEach((note) => {
        if (note.matches(".pricingtext") && note.closest(".state-adnl")) return;
        const clone = note.cloneNode(true);
        clone.querySelectorAll("br").forEach((br) => br.replaceWith(""));
        clone.textContent.replace(/\s+/g, " ").split("").map((l) => l.trim()).filter(Boolean).forEach((line) => body.push(para5(document, line)));
      });
      const actions = footer.querySelector(".btn-container") || footer.querySelector(":scope > div.flex-column");
      if (actions) body.push(...ctaParagraphs(document, actions));
      else {
        footer.querySelectorAll("a.btn, button.btn").forEach((b) => body.push(...ctaParagraphs(document, b.parentElement)));
      }
      card.querySelectorAll('[class*="disclaimer_max_width"] p').forEach((p2) => {
        if (text9(p2)) body.push(p2);
      });
      if (body.length) cells.push([tab, body]);
    });
    const centered = cards.length > 0 && cards.some((c) => c.classList.contains("category-card-center"));
    const name = centered ? "cards-pricing (centered)" : "cards-pricing";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-media.js
  var CATALOG_VARIANTS = {
    // card-grid-landing (catalog variants, class selectors stable between catalog and live)
    "/tax-offices/drop-off/": [["section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control", "link-list"]],
    "/tax-offices/office-tax-preparation/": [["section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control", "link-list"]],
    "/tax-offices/virtual-tax-preparation/": [["section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control", "checklist"]],
    // form-page (catalog variant link-list: intro + arrow-link list, no accordion)
    "/universal/privacy-contact/": [["section.column-control.spruce-eggshell-theme.two-column-control:has(.iconlist)", "link-list"]]
  };
  function pagePath(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant(element, params) {
    const entries = CATALOG_VARIANTS[pagePath(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  function cleanInline7(root) {
    root.querySelectorAll("svg, span.reader, a.reader, span.spacer, input, script, style, link, noscript").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, " ").trim()));
    });
  }
  function hasContent2(el) {
    return !!(el && (el.textContent.trim() || el.querySelector("img, picture, iframe")));
  }
  function collectContent(root, document) {
    const out = [];
    [...root.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        if (n.textContent.trim()) {
          const p2 = document.createElement("p");
          p2.textContent = n.textContent.trim();
          out.push(p2);
        }
        return;
      }
      if (n.nodeType !== 1 || !hasContent2(n)) return;
      if (n.tagName === "DIV" || n.tagName === "SECTION") {
        out.push(...collectContent(n, document));
      } else if (n.tagName === "BUTTON") {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = n.textContent.replace(/\s+/g, " ").trim();
        const strong = document.createElement("strong");
        strong.append(a);
        const p2 = document.createElement("p");
        p2.append(strong);
        out.push(p2);
      } else if (n.tagName === "A") {
        const p2 = document.createElement("p");
        p2.append(n);
        out.push(p2);
      } else {
        out.push(n);
      }
    });
    return out;
  }
  function getImage(root) {
    const img = root.querySelector("img");
    return img && img.getAttribute("src") ? img : null;
  }
  function svgToImg3(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function parseChecklist(element, document, catalogName) {
    const checks = [];
    element.querySelectorAll(".iconlist li").forEach((li) => {
      if (li.parentElement.closest(".iconlist li")) return;
      const label = li.querySelector(".icon-text-wrap") || li;
      const t = label.textContent.replace(/\s+/g, " ").trim();
      if (!t) return;
      const p2 = document.createElement("p");
      const link3 = li.querySelector("a[href]");
      if (link3 && link3.textContent.replace(/\s+/g, " ").trim() === t) {
        const a = document.createElement("a");
        const href = link3.getAttribute("href");
        a.href = /^javascript:/i.test(href) ? "#" : href;
        a.textContent = t;
        p2.append(a);
        checks.push(p2);
        return;
      }
      const svg = li.querySelector(".icon-wrap svg, svg");
      const icon = svg ? svgToImg3(document, svg) : null;
      if (icon) p2.append(icon);
      p2.append(document.createTextNode(t));
      checks.push(p2);
    });
    element.querySelectorAll(".iconlist").forEach((n) => n.remove());
    cleanInline7(element);
    const columns = [...element.querySelectorAll("ul.column-container > li.column")].filter((c) => !c.parentElement.closest("li.column"));
    let sideImage = null;
    const intro = [];
    columns.forEach((col) => {
      const img = getImage(col);
      const holder = col.cloneNode(true);
      holder.querySelectorAll("img, picture").forEach((n) => n.remove());
      if (img && !sideImage) sideImage = img;
      if (holder.textContent.trim()) intro.push(...collectContent(holder, document));
    });
    const cells = [];
    const linksOnly = checks.length && checks.every((c) => c.querySelector("a") && !c.querySelector("img"));
    if (catalogName === "link-list" && linksOnly && intro.length) {
      cells.push([intro, checks]);
    } else {
      intro.push(...checks);
      if (intro.length) cells.push([intro]);
    }
    if (sideImage) cells.push([sideImage]);
    const name = catalogName ? `accordion-media (${catalogName})` : "accordion-media (checklist)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }
  function parse11(element, { document, params }) {
    const fromCatalog = catalogVariant(element, params);
    if (!element.querySelector("section.accordian-section") && element.querySelector(".iconlist")) {
      parseChecklist(element, document, fromCatalog);
      return;
    }
    cleanInline7(element);
    const cells = [];
    const accSections = [...element.querySelectorAll("section.accordian-section")];
    const accColumns = new Set(accSections.map((s) => s.closest("li.column") || s.parentElement));
    const columns = [...element.querySelectorAll(":scope > .container > ul.column-container > li.column, :scope ul.column-container > li.column")].filter((c, i, arr) => arr.indexOf(c) === i && !c.parentElement.closest("li.column"));
    const introParts = [];
    const beforeBlock = [];
    let sideImage = null;
    columns.forEach((col) => {
      if (accColumns.has(col)) return;
      const img = getImage(col);
      if (!img && hasContent2(col)) {
        beforeBlock.push(...collectContent(col, document));
        return;
      }
      if (img && !sideImage) sideImage = img;
      const textHolder = col.cloneNode(true);
      textHolder.querySelectorAll("img, picture").forEach((n) => n.remove());
      if (textHolder.textContent.trim()) introParts.push(...collectContent(col, document).filter((n) => !n.querySelector || !n.matches("img")));
    });
    const introClean = introParts.filter((n) => !(n.matches && (n.matches("img, picture") || n.querySelector("img") && !n.textContent.trim())));
    let introPushed = false;
    accSections.forEach((acc, idx) => {
      const heading3 = acc.querySelector(".accordionhead h1, .accordionhead h2, .accordionhead h3, .accordionhead h4, .accordionhead h5, .accordionhead h6");
      if (idx === 0) {
        const intro = [];
        if (heading3) intro.push(heading3);
        intro.push(...introClean);
        if (intro.length) cells.push([intro]);
        introPushed = true;
      } else if (heading3) {
        cells.push([heading3]);
      }
      const items = [...acc.querySelectorAll("ul.accordion > li")];
      items.forEach((li) => {
        const titleEl = li.querySelector(".drawer-header, header h3, header h4, header h5, header");
        const titleText = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
        if (!titleText) return;
        const title = document.createElement("p");
        title.textContent = titleText;
        const panel = li.querySelector('.detail-div, [role="region"]');
        const body = panel ? collectContent(panel, document) : [];
        cells.push([title, body.length ? body : ""]);
      });
      const col = acc.closest("li.column");
      if (col) {
        let sib = acc.nextElementSibling;
        while (sib) {
          if (hasContent2(sib) && !sib.matches("section.accordian-section")) {
            const footer = collectContent(sib, document);
            if (footer.length) cells.push([footer]);
          }
          sib = sib.nextElementSibling;
        }
      }
    });
    if (!introPushed && introClean.length) cells.unshift([introClean]);
    if (sideImage) cells.push([sideImage]);
    let variant = null;
    if (accSections.length > 1) variant = "link-list";
    else if (element.matches(".white-theme")) variant = "dark";
    else if (element.matches(".spruce-eggshell-theme")) variant = "image-light";
    else if (element.querySelector(".introImageVariant")) variant = "light-2";
    else if (!sideImage) variant = "light";
    if (fromCatalog !== void 0) variant = fromCatalog;
    const name = variant ? `accordion-media (${variant})` : "accordion-media";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
    beforeBlock.forEach((n) => block.before(n));
  }

  // tools/importer/parsers/columns-callout.js
  var BLOCK_SEL3 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text10(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden3(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline8(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text10(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg4(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para6(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara3(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text10(el)) link3.append(img);
    else link3.textContent = text10(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text10(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para6(document, strong);
    }
    return para6(document, link3);
  }
  function extract3(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para6(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden3(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg4(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para6(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text10(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text10(b))));
          if (text10(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text10(n) || n.querySelector("img")) out.push(ctaPara3(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text10(n)) out.push(ctaPara3(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden3(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL3) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text10(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function parse12(element, { document }) {
    cleanInline8(element);
    const list = element.querySelector("ul.column-container");
    const columns = list ? [...list.children].filter((c) => c.matches("li")) : [...element.children];
    const row = columns.map((col) => extract3(document, col)).filter((c) => c.length);
    row.forEach((cell) => cell.forEach((n) => {
      if (n.tagName === "UL") {
        n.querySelectorAll('li > span[class*="hrb-icon-link--check"]').forEach((s) => s.replaceWith(...s.childNodes));
      }
    }));
    const first = row[0] || [];
    const withImage = first.length > 0 && first.every((n) => n.tagName === "IMG" || n.tagName === "PICTURE" || n.tagName === "P" && n.querySelector("img") && !text10(n));
    const cells = row.length ? [row] : [];
    const name = withImage ? "columns-callout (with-image)" : "columns-callout";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  var CATALOG_VARIANTS2 = {
    "/expat-tax-preparation/expat-tax-preparation-and-services/": [["section.column-control.two-column-control:has(li.imageOverflow)", "image"]],
    "/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [["section.column-control.two-column-control:has(li.imageOverflow)", "image"]],
    // campaign-full-bleed-hero (catalog variant; class selector stable between catalog and live)
    "/responsibilityisland/": [["section.column-control.two-column-control:has(.video-container)", "video"]]
  };
  function pagePath2(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant2(element, params) {
    const entries = CATALOG_VARIANTS2[pagePath2(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  function text11(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline9(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, span.hide, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text11(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br").forEach((br) => br.replaceWith(" "));
  }
  function para7(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function ctaParagraphs2(document, container) {
    return [...container.querySelectorAll("a, button")].filter((c) => text11(c)).map((c) => {
      const link3 = document.createElement("a");
      link3.href = c.tagName === "A" && c.getAttribute("href") || "#";
      link3.textContent = text11(c);
      const strong = document.createElement("strong");
      strong.append(link3);
      return para7(document, strong);
    });
  }
  function bodyContent(document, holder) {
    const out = [];
    let list = null;
    [...holder.children].forEach((child) => {
      if (!text11(child) && !child.querySelector("img")) return;
      const isCheck = child.tagName === "P" && child.querySelector('[class*="hrb-icon-link--check"]') && text11(child) === text11(child.querySelector('[class*="hrb-icon-link--check"]'));
      if (isCheck) {
        if (!list) {
          list = document.createElement("ul");
          out.push(list);
        }
        const li = document.createElement("li");
        li.textContent = text11(child);
        list.append(li);
        return;
      }
      list = null;
      if (child.tagName === "DIV") out.push(...bodyContent(document, child));
      else out.push(child);
    });
    return out;
  }
  function buildHeading(document, src) {
    const h = document.createElement("h3");
    const a = src.querySelector("a[href]");
    if (a && a.getAttribute("href") !== "#") {
      const link3 = document.createElement("a");
      link3.href = a.getAttribute("href");
      link3.textContent = text11(src);
      h.append(link3);
    } else {
      h.textContent = text11(src);
    }
    return h;
  }
  function parse13(element, { document, params }) {
    const variantFromCatalog = catalogVariant2(element, params);
    element.querySelectorAll(".video-container").forEach((vc) => {
      vc.querySelectorAll(".playbutton-image, button").forEach((n) => n.remove());
      const card = vc.closest("li.column") || vc.parentElement;
      const eyebrow = card && card.querySelector(".eyebrow-label, .color-eyebrow");
      if (eyebrow && text11(eyebrow)) card.setAttribute("data-excat-eyebrow", text11(eyebrow));
      if (eyebrow) eyebrow.remove();
      const url = vc.getAttribute("data-excat-video");
      if (card && url) card.setAttribute("data-excat-video", url);
    });
    cleanInline9(element);
    const cells = [];
    let cards = [...element.querySelectorAll("article.card-stacked, div.card-stacked")].filter((c) => !c.parentElement.closest(".card-stacked"));
    if (!cards.length) cards = [...element.querySelectorAll("li.column")];
    cards.forEach((card) => {
      const primary = card.querySelector("div.card-primary > article.card-content, div.card-primary-grow > article");
      if (primary) {
        const pimg = card.querySelector(".card-img img") || card.querySelector("img");
        const pbody = [];
        const ptitle = primary.querySelector("header h3, header h2, h3, h2");
        if (ptitle) pbody.push(buildHeading(document, ptitle));
        const header = primary.querySelector("header");
        if (header) {
          [...header.children].forEach((child) => {
            if (child === ptitle || !text11(child)) return;
            if (child.matches("ul, ol")) {
              const list = document.createElement("ul");
              child.querySelectorAll(":scope > li").forEach((li) => {
                if (!text11(li)) return;
                const item = document.createElement("li");
                item.textContent = text11(li);
                list.append(item);
              });
              if (list.children.length) pbody.push(list);
            } else pbody.push(para7(document, text11(child)));
          });
        }
        const footer = primary.querySelector("footer");
        if (footer) {
          [...footer.children].forEach((child) => {
            if (child.matches("a, button") || child.querySelector("a, button")) return;
            const t = text11(child);
            if (!t) return;
            if (child.matches("strong")) {
              const s = document.createElement("strong");
              s.textContent = t;
              pbody.push(para7(document, s));
            } else pbody.push(para7(document, t));
          });
          pbody.push(...ctaParagraphs2(document, footer));
        }
        if (pbody.length || pimg) cells.push([pimg || "", pbody.length ? pbody : ""]);
        return;
      }
      const img = card.querySelector(".cmp-column--image img") || card.querySelector("img");
      const body = [];
      const title = card.querySelector(".stacked-title, h3.title, header h3, h3, h2");
      let href = null;
      const btnLinks = [...card.querySelectorAll("footer a[href], .btn-container a[href], a.btn[href]")].filter((a) => text11(a) && a.getAttribute("href") !== "#");
      const eyebrowText = card.getAttribute("data-excat-eyebrow");
      if (eyebrowText) body.push(para7(document, eyebrowText));
      if (title) {
        const h = buildHeading(document, title);
        if (!h.querySelector("a") && card.matches(".custom-article") && btnLinks[0]) {
          href = btnLinks[0].getAttribute("href");
          const link3 = document.createElement("a");
          link3.href = href;
          link3.textContent = h.textContent;
          h.textContent = "";
          h.append(link3);
        }
        body.push(h);
      }
      const pricing = card.querySelector(".pricing-container");
      if (pricing) {
        const priceText = text11(pricing);
        if (priceText) body.push(para7(document, priceText));
      }
      const holder = card.querySelector('[class*="body_max_width"]') || card.querySelector(".excerpt");
      if (holder) body.push(...bodyContent(document, holder));
      const actions = card.querySelector(".btn-container") || card.querySelector("footer");
      if (actions) body.push(...ctaParagraphs2(document, actions));
      const videoUrl = card.getAttribute("data-excat-video");
      if (videoUrl) {
        const a = document.createElement("a");
        a.href = videoUrl;
        a.textContent = "Watch now";
        const strong = document.createElement("strong");
        strong.append(a);
        body.push(para7(document, strong));
      }
      if (!body.length && !img) return;
      cells.push([img || "", body.length ? body : ""]);
    });
    let variant = null;
    const dark = element.matches(".green-dark-theme") || !!element.closest(".green-dark-theme");
    if (element.querySelector("div.card-primary > article.card-content, div.card-primary-grow > article")) variant = "photo-side";
    else if (element.querySelector(".hrb-icon-link--check-white")) variant = "checklist-green-image";
    else if (element.querySelector('.stackedContent [class*="hrb-icon-link--check"]')) variant = "checklist";
    else if (element.querySelector(".mostrecent, article.custom-article") && dark) variant = "article";
    if (variantFromCatalog !== void 0) variant = variantFromCatalog;
    const name = variant ? `cards-product (${variant})` : "cards-product";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-card.js
  var CATALOG_VARIANTS3 = {
    "/easignup/": [["#container-69a88a9f0b > section.column-control.spruce-forest-theme.padding-top-100", "checklist"]],
    "/financial-services/emerald-advance-loan/": [["#container-69a88a9f0b > section.column-control.spruce-forest-theme.padding-top-100", "checklist"]],
    "/financial-services/emerald-card-services/": [["#container-e85b1470d9 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-120", "alt-3"]],
    "/mobile-apps/": [["section.column-control:has(.card-secondary.featurecard .spruce-neon)", "alt-2"]],
    "/offers/gig-worker-side-business-taxes/": [["#container-1ef905b226 > section:nth-child(10)", null]],
    "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
    "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
    "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
    "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > section.column-control.spruce-eggshell-theme.padding-bottom-120", null]],
    "/tax-offices/": [["#container-4bc6fad564 > div:nth-child(10)", null]],
    // card-grid-landing (catalog variants, class selectors stable between catalog and live)
    "/filing-options-and-products/": [["section.column-control.white-theme.padding-top-100.padding-bottom-40", "alt-2"]],
    "/tax-offices/office-tax-preparation/": [["div.xf-content-height:has(.card-secondary)", null]],
    "/tax-offices/tax-refund-payment/": [["div.xf-content-height:has(.spruce-forest-theme)", "alt"]],
    // tool-guide-page (catalog variants: checklist app card, refund xf alt)
    "/tax-prep-checklist/": [["section.column-control:has(.card-secondary.featurecard)", "app"]],
    "/wheres-my-refund/": [["div.xf-content-height:has(.card-secondary)", "alt"]]
  };
  function pagePath3(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant3(element, params) {
    const entries = CATALOG_VARIANTS3[pagePath3(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  var BLOCK_SEL4 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text12(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden4(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline10(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text12(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg5(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para8(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara4(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text12(el)) link3.append(img);
    else link3.textContent = text12(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text12(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para8(document, strong);
    }
    return para8(document, link3);
  }
  function extract4(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para8(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden4(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg5(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para8(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text12(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text12(b))));
          if (text12(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text12(n) || n.querySelector("img")) out.push(ctaPara4(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text12(n)) out.push(ctaPara4(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden4(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL4) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text12(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function parse14(element, { document, params }) {
    element.querySelectorAll("span.hide").forEach((n) => n.remove());
    cleanInline10(element);
    const cards = [...element.querySelectorAll("div.card")].filter((c) => !c.parentElement.closest("div.card"));
    const card = cards[0] || element;
    const imgHolder = card.querySelector(".card-img") || card.querySelector(".cmp-column--image");
    const img = imgHolder ? imgHolder.querySelector("img") : card.querySelector("img");
    const content = card.querySelector("article.card-content") || card;
    content.querySelectorAll("strong.price, .price").forEach((pr) => {
      if (pr.parentElement.closest(".price")) return;
      const p2 = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = text12(pr);
      p2.append(strong);
      pr.replaceWith(p2);
    });
    const checks = [...content.querySelectorAll("p")].filter((p2) => p2.querySelector('[class*="hrb-icon-link--check"]'));
    if (checks.length) {
      const ul = document.createElement("ul");
      checks[0].before(ul);
      checks.forEach((p2) => {
        const li = document.createElement("li");
        li.append(...[...p2.childNodes]);
        li.querySelectorAll('span[class*="hrb-icon-link--check"]').forEach((s) => s.replaceWith(...s.childNodes));
        ul.append(li);
        p2.remove();
      });
    }
    const body = extract4(document, content);
    const cells = [[img || "", body.length ? body : ""]];
    let variant = catalogVariant3(element, params);
    if (variant === void 0) variant = checks.length ? "checklist" : null;
    const name = variant ? `columns-promo-card (${variant})` : "columns-promo-card";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  var CATALOG_VARIANTS4 = {
    "/financial-services/spruce/": [["section.column-control:has(.snackBar)", "dividers"], ["section.column-control:has(.card-secondary.featurecard)", "light-3"]],
    "/tax-calculator/": [["section.column-control.spruce-eggshell-theme:has(.alignBanner)", "light"]],
    "/best-tax-services/": [["section.column-control.green-dark-theme", null]],
    "/corporate/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
    "/support/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
    "/support/contact-options/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
    "/tax-offices/make-appointment/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
    "/tax-offices/our-tax-pros/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
    "/tax-offices/tax-prep/extended-service/": [["section.column-control.spruce-eggshell-theme:has(li.col-1 section.column-control li.col-3 .introImageVariant)", "light"]],
    "/tax-offices/upfront-pricing/": [["section.column-control.spruce-eggshell-theme", "light"]],
    // card-grid-landing (catalog variants, class selectors stable between catalog and live)
    "/dsar/": [["section.column-control.spruce-forest-theme:has(.col-3)", null]],
    "/filing-options-and-products/": [["section.column-control.spruce-forest-theme:has(.col-3)", null]],
    "/tax-offices/drop-off/": [["section.column-control.spruce-forest-theme:has(.col-3)", null], ["section.column-control.spruce-eggshell-theme.padding-bottom-60:has(.spruce-eggshell-theme)", "featured-offer"]],
    "/tax-offices/international/": [["section.column-control.green-dark-theme:has(.col-3)", null]],
    "/tax-offices/office-tax-preparation/": [["section.column-control.spruce-forest-theme:has(.col-3)", null], ["section.column-control.spruce-eggshell-theme.padding-bottom-60", "featured-offer"]],
    "/tax-offices/tax-refund-payment/": [["section.column-control.green-dark-theme:has(.col-3)", null]],
    "/tax-offices/virtual-tax-preparation/": [["section.column-control.spruce-forest-theme:has(.col-3)", null]],
    "/find-a-cpa-or-enrolled-agent/": [["section.column-control.spruce-eggshell-theme:has(.col-3)", "light"]],
    "/no-surprise-guarantee/": [["section.column-control.spruce-eggshell-theme:has(.col-3)", "light"]]
  };
  function pagePath4(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant4(element, params) {
    const entries = CATALOG_VARIANTS4[pagePath4(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  function text13(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline11(root) {
    root.querySelectorAll("span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text13(btn)));
    });
  }
  function svgToImg6(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function iconOf(document, root) {
    const img = root.querySelector("img");
    if (img && img.getAttribute("src")) return img;
    const svg = root.querySelector("svg");
    return svg ? svgToImg6(document, svg) : null;
  }
  function para9(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function ctaParagraph2(document, container) {
    const controls = [...container.querySelectorAll("a, button")].filter((c) => text13(c));
    if (!controls.length) return null;
    const p2 = document.createElement("p");
    controls.forEach((c, i) => {
      if (i) p2.append(" ");
      if (c.tagName === "A" && c.getAttribute("href")) {
        const link3 = document.createElement("a");
        link3.href = /^javascript:/i.test(c.getAttribute("href")) ? "#" : c.getAttribute("href");
        link3.textContent = text13(c);
        if (c.classList.contains("btn")) {
          const strong = document.createElement("strong");
          strong.append(link3);
          p2.append(strong);
        } else {
          p2.append(link3);
        }
      } else {
        const link3 = document.createElement("a");
        link3.href = "#";
        link3.textContent = text13(c);
        const strong = document.createElement("strong");
        strong.append(link3);
        p2.append(strong);
      }
    });
    return p2;
  }
  function blockChildren(holder) {
    return [...holder.querySelectorAll(":scope > p, :scope > ul, :scope > ol, :scope > h2, :scope > h3, :scope > h4, :scope > div > p")].filter((n) => text13(n));
  }
  function parse15(element, { document, params }) {
    const variantFromCatalog = catalogVariant4(element, params);
    cleanInline11(element);
    const cells = [];
    let variant = null;
    let featureCards = [...element.querySelectorAll(".card-secondary.featurecard, .featurecard")].filter((c, i, arr) => arr.indexOf(c) === i);
    const jumbo = !featureCards.length;
    if (jumbo) featureCards = [...element.querySelectorAll(".card-secondary.card-jumbo")];
    const banner = element.querySelector("section.rounded-border, .alignBanner");
    const iconLists = [...element.querySelectorAll("div.iconlist")];
    const snackCols = [...element.querySelectorAll("section.snackBar .snackBar-col")];
    if (snackCols.length) {
      variant = "dividers";
      snackCols.forEach((col) => {
        const icon = iconOf(document, col.querySelector(".snackBar-col__media") || col);
        const content = col.querySelector(".snackBar-col__content") || col;
        const body = [...content.querySelectorAll("h1, h2, h3, h4, h5, p, ul, ol")].filter((n) => {
          if (!text13(n)) return false;
          const outer = n.parentElement.closest("p, ul, ol, h1, h2, h3, h4, h5");
          return !outer || !content.contains(outer);
        });
        body.forEach((n) => n.removeAttribute("style"));
        if (icon || body.length) cells.push([icon || "", body.length ? body : ""]);
      });
    } else if (featureCards.length) {
      featureCards.forEach((card) => {
        variant = card.classList.contains("green-dark-theme") || card.classList.contains("spruce-forest-theme") ? "dark" : "featured-offer";
        const img = card.querySelector(".card-img img") || card.querySelector("img");
        const body = [];
        const content = card.querySelector("article.card-content") || card;
        const h = content.querySelector("h1, h2, h3, h4");
        if (h) body.push(h);
        if (jumbo) {
          content.querySelectorAll("header > div").forEach((div) => body.push(...blockChildren(div)));
        } else {
          const headerBody = content.querySelector('header [class*="body_max_width"], header > div');
          if (headerBody) body.push(...blockChildren(headerBody));
        }
        const price = content.querySelector(".product--state-price") || jumbo && content.querySelector(".card-price-section");
        if (price && text13(price)) body.push(para9(document, text13(price)));
        const btns = content.querySelector(".btn-container, .card-btn");
        if (btns) {
          const cta = ctaParagraph2(document, btns);
          if (cta) body.push(cta);
        }
        const disc = content.querySelector('[class*="disclaimer_max_width"]');
        if (disc) body.push(...blockChildren(disc));
        cells.push([img || "", body.length ? body : ""]);
      });
    } else if (banner) {
      variant = element.matches(".spruce-eggshell-theme") ? "light-3" : "light-2";
      const root = banner.closest("section.rounded-border") || banner;
      const img = root.querySelector(".cmp-column--image img, img");
      const body = [];
      const header = root.querySelector(".skinnyHeader");
      if (header) {
        const spans = [...header.querySelectorAll(":scope > span")].filter((s) => text13(s));
        if (spans.length >= 2) {
          body.push(para9(document, text13(spans[0])));
          const h = document.createElement("h3");
          h.textContent = text13(spans[1]);
          body.push(h);
          spans.slice(2).forEach((s) => body.push(para9(document, text13(s))));
        } else if (text13(header)) {
          const h = document.createElement("h3");
          h.textContent = text13(header);
          body.push(h);
        }
      }
      const copy = root.querySelector(".skinnyBodyCopy");
      if (copy) body.push(...blockChildren(copy));
      const links = root.querySelector(".removeLastPadding, .btn-container");
      if (links) {
        const cta = ctaParagraph2(document, links);
        if (cta) body.push(cta);
      }
      cells.push([img || "", body.length ? body : ""]);
    } else if (iconLists.length) {
      variant = "icon-left";
      iconLists.forEach((list) => {
        list.querySelectorAll("li").forEach((li) => {
          if (li.parentElement.closest(".icon-text-wrap")) return;
          const icon = iconOf(document, li.querySelector(".icon-wrap") || li);
          const holder = li.querySelector(".icon-text-wrap") || li;
          const body = [];
          [...holder.children].forEach((child) => {
            if (!text13(child)) return;
            const onlyBold = child.tagName === "P" && child.children.length === 1 && /^(B|STRONG|SPAN)$/.test(child.firstElementChild.tagName) && child.firstElementChild.matches("b, strong, .font-bold") && text13(child) === text13(child.firstElementChild);
            if (onlyBold && !body.length) {
              const h = document.createElement("h3");
              h.textContent = text13(child);
              body.push(h);
            } else {
              child.querySelectorAll("span.rte-right-arrow").forEach((s) => s.replaceWith(...s.childNodes));
              body.push(child);
            }
          });
          if (icon || body.length) cells.push([icon || "", body.length ? body : ""]);
        });
      });
    } else {
      const cols = [...element.querySelectorAll("li.column")].filter((c) => !c.querySelector("li.column"));
      const items = cols.length ? cols : [...element.querySelectorAll(".introImageVariant")];
      items.forEach((col) => {
        const icon = iconOf(document, col.querySelector(".cmp-column--image") || col);
        const clone = col.cloneNode(true);
        clone.querySelectorAll(".cmp-column--image, svg, img").forEach((n) => n.remove());
        const body = [...clone.querySelectorAll("h1, h2, h3, h4, h5, p, ul, ol")].filter((n) => text13(n) && !n.parentElement.closest("p, ul, ol, h1, h2, h3, h4, h5"));
        const links = clone.querySelector(".btn-container");
        if (links) {
          const cta = ctaParagraph2(document, links);
          if (cta) body.push(cta);
        }
        if (icon || body.length) cells.push([icon || "", body.length ? body : ""]);
      });
    }
    if (variantFromCatalog !== void 0) variant = variantFromCatalog;
    const name = variant ? `cards-icon (${variant})` : "cards-icon";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  var DARK_THEMES = ["green-dark-theme", "spruce-forest-theme", "green-forest-theme", "black-theme"];
  function cleanInline12(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, " ").trim()));
    });
  }
  function svgToImg7(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  var ICON_SVG_SEL = ".stacked-title svg, .card-title svg, .icon-svg svg, .cmp-column--image svg, header svg";
  function captureIcons(element, document) {
    const cards = [...element.querySelectorAll("article")].filter((a) => !a.parentElement.closest("article"));
    cards.forEach((card) => {
      if (card.querySelector("img[src]")) return;
      const svg = [...card.querySelectorAll(ICON_SVG_SEL)].find((s) => !s.closest("a, button") && !s.matches(".svg-hover-push") && s.querySelector("path, rect, circle, g, polygon"));
      const img = svg && svgToImg7(document, svg);
      if (img) svg.replaceWith(img);
    });
  }
  function text14(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para10(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function buildHeading2(document, src) {
    const tag = /^H[1-6]$/.test(src.tagName) ? src.tagName.toLowerCase() : "h3";
    const h = document.createElement(tag);
    const a = src.querySelector("a[href]");
    if (a) {
      const link3 = document.createElement("a");
      link3.href = a.getAttribute("href");
      link3.textContent = text14(src);
      h.append(link3);
    } else {
      h.textContent = text14(src);
    }
    return h;
  }
  function ctaParagraph3(document, container) {
    const controls = [...container.querySelectorAll("a, button")].filter((c) => text14(c));
    if (!controls.length) return null;
    const p2 = document.createElement("p");
    controls.forEach((c, i) => {
      if (i) p2.append(" ");
      if (c.tagName === "A" && c.getAttribute("href")) {
        const link3 = document.createElement("a");
        link3.href = c.getAttribute("href");
        link3.textContent = text14(c);
        const strong = document.createElement("strong");
        strong.append(link3);
        p2.append(strong);
      } else {
        const link3 = document.createElement("a");
        link3.href = "#";
        link3.textContent = text14(c);
        const strong = document.createElement("strong");
        strong.append(link3);
        p2.append(strong);
      }
    });
    return p2;
  }
  function isDark(card) {
    return DARK_THEMES.some((t) => card.classList.contains(t));
  }
  function parse16(element, { document }) {
    captureIcons(element, document);
    cleanInline12(element);
    const cells = [];
    const facts = [...element.querySelectorAll("div.fast-fact")];
    if (element.matches(".fast-facts") || facts.length) {
      facts.forEach((ff) => {
        const img = ff.querySelector("img");
        const body = [...ff.querySelectorAll(":scope > p, :scope > div:not(.ff-image) p, :scope > h3, :scope > h4")].filter((p2) => text14(p2));
        if (!body.length && !img) return;
        cells.push([img || "", body.length ? body : ""]);
      });
    } else {
      const cards = [...element.querySelectorAll("article.card-stacked, article")].filter((a, i, arr) => arr.indexOf(a) === i && !a.parentElement.closest("article"));
      if (!cards.length) {
        element.querySelectorAll("div.chicletDiv").forEach((tile) => {
          const label = text14(tile.querySelector("p.title") || tile);
          if (!label) return;
          const body = [];
          const content = tile.querySelector(".chicletDivContent") || tile;
          if (isDark(content)) body.push(para10(document, "(dark)"));
          const a = tile.querySelector("a[href]");
          const href = a && a.getAttribute("href");
          const h = document.createElement("h3");
          if (href && !/^javascript:/i.test(href)) {
            const link3 = document.createElement("a");
            link3.href = href;
            link3.textContent = label;
            h.append(link3);
          } else h.textContent = label;
          body.push(h);
          cells.push([tile.querySelector("img") || "", body]);
        });
      }
      cards.forEach((card) => {
        const inset = card.closest(".card-inset");
        if (inset && card.querySelector(".word-wrap-card")) {
          const body2 = [];
          if (isDark(inset) || isDark(card)) body2.push(para10(document, "(dark)"));
          const title2 = card.querySelector(".card-title");
          if (title2) {
            const visible = title2.querySelector("span.show-large") || [...title2.querySelectorAll(":scope > span")].find((s) => !s.classList.contains("hide-large"));
            const eyebrow2 = text14(visible || title2);
            const eyebrowLink = title2.querySelector("a[href]");
            if (eyebrow2 && eyebrowLink && text14(eyebrowLink) === eyebrow2) {
              const link3 = document.createElement("a");
              link3.href = eyebrowLink.getAttribute("href");
              link3.textContent = eyebrow2;
              body2.push(para10(document, link3));
            } else if (eyebrow2) body2.push(para10(document, eyebrow2));
          }
          const statements = [...card.querySelectorAll(".word-wrap-card p")].filter((p2) => text14(p2));
          statements.forEach((p2, i) => {
            if (i === 0) {
              const h = document.createElement("h3");
              h.textContent = text14(p2);
              body2.push(h);
            } else body2.push(para10(document, text14(p2)));
          });
          const price = card.querySelector(".pricing-container, .card-price-section");
          if (price && text14(price)) {
            const p2 = document.createElement("p");
            [...price.querySelectorAll(".card-copy-small, .copy-small, strong, .price")].filter((n, i, all) => text14(n) && !all.some((o) => o !== n && o.contains(n))).forEach((n, i) => {
              if (i) p2.append(" ");
              if (n.tagName === "STRONG" || n.classList.contains("price")) {
                const strong = document.createElement("strong");
                strong.textContent = text14(n);
                p2.append(strong);
              } else p2.append(text14(n));
            });
            if (text14(p2)) body2.push(p2);
          }
          const btns = card.querySelector(".card-btn") || card.querySelector(".card-footer");
          const cta = btns && ctaParagraph3(document, btns);
          if (cta) body2.push(cta);
          const img2 = card.querySelector("img");
          if (!body2.some((b) => text14(b) && text14(b) !== "(dark)") && !img2) return;
          cells.push([img2 || "", body2]);
          return;
        }
        const img = card.querySelector(".cmp-column--image img") || card.querySelector("img");
        const body = [];
        if (isDark(card)) body.push(para10(document, "(dark)"));
        const eyebrow = card.querySelector(".eyebrow-label, .stacked-eyebrow-row");
        if (eyebrow && text14(eyebrow)) body.push(para10(document, text14(eyebrow)));
        const title = card.querySelector(".stacked-title, h1, h2, h3, h4");
        if (title && text14(title)) body.push(buildHeading2(document, title));
        const textHolder = card.querySelector('[class*="body_max_width"]') || card.querySelector(".card-body .card-body > div:first-child");
        if (textHolder) {
          [...textHolder.children].forEach((child) => {
            if (text14(child) || child.querySelector("img")) body.push(child);
          });
        }
        const btnContainer = card.querySelector(".btn-container");
        if (btnContainer) {
          const cta = ctaParagraph3(document, btnContainer);
          if (cta) body.push(cta);
        }
        const hasBody = body.some((b) => text14(b) && text14(b) !== "(dark)");
        if (!hasBody && !img) return;
        cells.push([img || "", body.length ? body : ""]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-strip.js
  var CATALOG_VARIANTS5 = {
    "/lp/creator-taxes/": [["#container-d8006e96a0 > section.column-control.spruce-eggshell-theme.padding-top-20.padding-bottom-100", "light"]],
    "/offers/turbotax-price-comparison/": [["#container-e8bf00d4c6 > div:nth-child(8)", null]],
    "/online-assist/": [["#container-33a468b3d9 > div:nth-child(7)", null]],
    "/online-tax-filing/": [["#container-33a468b3d9 > div:nth-child(7)", null]],
    "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > section.spruce-forest-theme", null]],
    "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > div:nth-child(7)", null]],
    "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > section.spruce-forest-theme", null]],
    "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > div:nth-child(6)", null]],
    "/tax-offices/": [["#container-4bc6fad564 > div:nth-child(7)", null]],
    "/tax-reform-and-law-changes/": [["#container-7266953ed0 > section:nth-child(8)", null]],
    "/tax-software/updates-back-editions/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/tax-software/updates-back-editions/2021-back-editions/": [["#container-814bc03364 > div:nth-child(4)", null]],
    "/tax-software/updates-back-editions/2022-back-editions/": [["#container-6b09d829bd > div:nth-child(4)", null]],
    "/tax-software/updates-back-editions/2023-back-editions/": [["#container-fafb80b298 > div:nth-child(4)", null]],
    "/tax-software/updates-back-editions/2024-back-editions/": [["#container-eeac4ab9ae > div:nth-child(4)", null]],
    "/tax-software/updates-back-editions/prior-year/": [["#container-cd5f8a909a > section.spruce-forest-theme", "alt"]],
    "/taxes/products/software/updates/17buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/17mac-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/17macintosh-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/17windows-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/17windows-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/18buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/18mac-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/18macintosh-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/18windows-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/18windows-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/19buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/19mac-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/19macintosh-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/19windows-federal/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/19windows-state/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/taxes/products/software/updates/20buswin-instruct/": [["#container-670ec6f8c6 > div:nth-child(2)", null]],
    "/best-tax-services/": [["section.hrb-neon-green", "dark"]],
    // card-grid-landing (catalog variants, class selectors stable between catalog and live)
    "/filing-options-and-products/": [["section.column-control.green-dark-theme.padding-bottom-100:has(.col-1)", null]],
    "/tax-offices/drop-off/": [["div.xf-content-height:has(.skinnyHeader)", null]],
    "/tax-offices/office-tax-preparation/": [["div.xf-content-height:has(.skinnyHeader)", null]],
    "/tax-offices/virtual-tax-preparation/": [["div.xf-content-height:has(.alignBanner)", null]],
    "/tax-offices/tax-refund-payment/": [["div.xf-content-height:has(.spruce-neon-theme)", "yellow"]],
    "/taxes/products/software/updates/whyrequired/": [["section.spruce-forest-theme", "alt"]]
  };
  function pagePath5(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant5(element, params) {
    const entries = CATALOG_VARIANTS5[pagePath5(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  var BLOCK_SEL5 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text15(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden5(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline13(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text15(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg8(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para11(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara5(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text15(el)) link3.append(img);
    else link3.textContent = text15(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text15(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para11(document, strong);
    }
    return para11(document, link3);
  }
  function extract5(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para11(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden5(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg8(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para11(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text15(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text15(b))));
          if (text15(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text15(n) || n.querySelector("img")) out.push(ctaPara5(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text15(n)) out.push(ctaPara5(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden5(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL5) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text15(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function parse17(element, { document, params }) {
    cleanInline13(element);
    const banner = element.querySelector(".alignBanner") || element;
    const row = [];
    const media = banner.querySelector(":scope > .text-center-sm, .cmp-column--image");
    if (media) {
      const img = media.querySelector("img");
      const svg = media.querySelector("svg");
      const icon = img || (svg ? svgToImg8(document, svg) : null);
      if (icon) row.push(icon);
    }
    const heading3 = banner.querySelector(".skinnyHeader, h1, h2, h3, h4");
    if (heading3 && text15(heading3)) {
      const h = /^H[1-6]$/.test(heading3.tagName) ? heading3 : document.createElement("h2");
      if (h !== heading3) h.textContent = text15(heading3);
      row.push(h);
    }
    const copy = banner.querySelector(".skinnyBodyCopy");
    if (copy) {
      const content = extract5(document, copy);
      if (content.length) row.push(content);
    }
    const actions = banner.querySelector(".removeLastPadding, .btn-container");
    if (actions) {
      const ctas = [...actions.querySelectorAll("a, button")].filter((c) => text15(c)).map((c) => ctaPara5(document, c));
      if (ctas.length) row.push(ctas);
    }
    let variant = catalogVariant5(element, params);
    if (variant === void 0) {
      variant = element.matches("section.column-control") && element.querySelector("section.rounded-border") ? "light" : null;
    }
    const cells = row.length ? [row] : [];
    const name = variant ? `promo-strip (${variant})` : "promo-strip";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  var CATALOG_VARIANTS6 = {
    "/corporate/": [["section.content-two-column:has(.white-theme)", "bleed"]],
    "/corporate/our-company/": [["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"]],
    "/data-security/": [["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"]],
    "/expat-tax-preparation/expat-tax-preparation-and-services/federal-tax-prep/": [["section.column-control.white-theme.two-column-control:has(li.col-2 .image-container)", "bleed"], ["section.column-control.white-theme.two-column-control:has(li.col-2 .introImageVariant img):not(:has(.introDefaultvariant))", "no-panel"], ["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"]],
    "/expat-tax-preparation/offers/saf/": [["section.column-control.spruce-eggshell-theme:not(.two-column-control):has(li.col-4 .introImageVariant)", "pair"]],
    "/expat-tax-preparation/our-team/": [["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"]],
    "/expat-tax-preparation/site-map/": [["section.column-control.spruce-eggshell-theme:not(.two-column-control):has(li.col-3 .introDefaultvariant)", "pair"]],
    "/makeeveryblockbetter/": [["div.mebb--map-hud-box--statcols", "no-panel"]],
    "/offers/refund-advance/": [["section.column-control.white-theme.two-column-control:has(li.col-2 .introImageVariant img):not(:has(.introDefaultvariant))", "no-panel"], ["section.column-control.spruce-eggshell-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "pair"]],
    "/support/": [["div.xf-content-height:has(section.content-two-column)", "bleed"]],
    "/support/contact-options/": [["div.xf-content-height:has(section.content-two-column)", "bleed"]],
    "/tax-offices/extended-tax-services/tax-audit/audit-support/": [["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"], ["section.column-control.spruce-eggshell-theme:not(.two-column-control):has(li.col-3 .introDefaultvariant)", "pair"]],
    "/tax-offices/itin-application/": [["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"]],
    "/tax-offices/our-tax-pros/": [["div.xf-content-height:has(section.content-two-column)", "bleed"], ["section.content-two-column:has(.white-theme)", "bleed"]],
    "/tax-offices/tax-prep/extended-service/": [["section.column-control.spruce-eggshell-theme:not(.two-column-control):has(li.col-4 .introImageVariant)", "pair"]],
    "/womens-equity-in-college-sports/": [["section.column-control.white-theme.two-column-control:has(.cq-dd-image)", "bleed"], ['section.column-control.two-column-control:not([class*="-theme"]):has(.image-container)', "bleed"]],
    "/": [["section.spruce-neon-theme", "strip"], ["section.white-theme.two-column-control:has(.introImageVariant)", "dark-3"], ["section.spruce-forest-theme.two-column-control:has(.cq-dd-image)", null], ["div.xf-content-height:has(.fb-image-wrapper .alignBanner)", "no-panel-image-background"]],
    "/tax-calculator/": [["section.white-theme.two-column-control:has(article.card-stacked)", "no-panel"]],
    "/corporate/income-tax-course/": [["#container-096c529025 > section.column-control.white-theme.padding-top-20", "no-panel"], ["#container-096c529025 > section:nth-child(5)", null], ["#container-096c529025 > section.column-control.white-theme.two-column-control", "bleed"], ["#container-096c529025 > section.column-control.green-dark-theme.padding-top-100.padding-bottom-100.two-column-control", null], ["#container-096c529025 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-40.two-column-control", null]],
    "/easignup/": [["#container-39f3ab7a35 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control", "no-panel"], ["#container-5a359b941f > div:nth-child(9)", null], ["#container-e2a03eafcf > section:nth-child(2)", "pair"]],
    "/expat-tax-preparation/diy-expat-tax-filing-online/": [["#container-458b5749c8 > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-20", "pair"]],
    "/expat-tax-preparation/expat-assisted-tax-filing/": [["#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-40", "pair"], ["#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-20.two-column-control", "pair"]],
    "/expat-tax-preparation/resource-center/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/all-topics/": [["#site-content > section.ba--catall--listing", "no-panel"], ["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/country/australia/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/canada/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/china/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/france/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/germany/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/hong-kong/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/japan/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/mexico/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/netherlands/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/new-zealand/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/philippines/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/singapore/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/switzerland/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/united-arab-emirates/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/country/united-kingdom/": [["#site-content > section.steps-to-prep.container > div", "no-panel"], ["#site-content > section.ba-cta", null], ["#site-content > section.green-due-date-section", "deadline"]],
    "/expat-tax-preparation/resource-center/filing/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/filing/page/2/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/filing/page/3/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/forms/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/forms/page/2/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/forms/page/3/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/income/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/income/page/2/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/post-filing/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/tax-law-and-policy/": [["#site-content > section.ba-cta", null]],
    "/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/": [["div.wp-block-create-block-hrb-expat-ways-to-file", "pair"], ["#site-content > section.ba-cta", null]],
    "/financial-services/emerald-advance-loan-vs-refund-advance/": [["#container-13ba08bd76 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-40.two-column-control", "pair"]],
    "/financial-services/emerald-advance-loan/": [["#container-39f3ab7a35 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control", "no-panel"], ["#container-5a359b941f > div:nth-child(9)", null], ["#container-e2a03eafcf > section:nth-child(2)", "pair"]],
    "/financial-services/emerald-card-services/": [["#container-e85b1470d9 > section.column-control.white-theme.padding-top-20.padding-bottom-120", "no-panel"], ["#container-e85b1470d9 > section.column-control.spruce-eggshell-theme.padding-bottom-40.two-column-control", null], ["#container-e85b1470d9 > section.column-control.white-theme.padding-top-20.padding-bottom-100.two-column-control", "bleed"]],
    "/financial-services/tax-refund-payment/": [["#container-09ef37399b > section.column-control.white-theme.padding-top-60.padding-bottom-80.two-column-control", "no-panel"], ["#container-09ef37399b > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20", "pair"], ["#container-09ef37399b > section.column-control.spruce-eggshell-theme.two-column-control", "pair"]],
    "/lp/creator-taxes/": [["#container-d8006e96a0 > section:nth-child(14)", null], ["#container-d8006e96a0 > section:nth-child(16)", null]],
    "/myblock-benefits/": [["#container-3d6b34a383 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
    "/offers/gig-worker-side-business-taxes/": [["#container-1ef905b226 > section.column-control.white-theme.padding-top-60.padding-bottom-60.two-column-control", "bleed"], ["#container-1ef905b226 > div:nth-child(11)", null]],
    "/online-assist/": [["#container-33a468b3d9 > div:nth-child(14)", null]],
    "/online-tax-filing/": [["#container-33a468b3d9 > div:nth-child(14)", null]],
    "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > div:nth-child(17)", null]],
    "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > div:nth-child(17)", null]],
    "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > div:nth-child(17)", null]],
    "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > div:nth-child(16)", null]],
    "/online-tax-filing/tax-pro-review/": [["#container-f3913af060 > section.column-control.spruce-eggshell-theme.padding-bottom-100", "pair"]],
    "/tax-offices/": [["#container-4bc6fad564 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "bleed"], ["#container-4bc6fad564 > div:nth-child(9)", null]],
    "/tax-offices/business-services/c-corp-taxes/": [["#container-d7d9e378fd > section:nth-child(3)", "no-panel"]],
    "/tax-offices/business-services/partnership-taxes/": [["#container-40d6339cc0 > section:nth-child(3)", "no-panel"]],
    "/tax-offices/business-services/small-business-bookkeeping-services/": [["#container-971cbd754f > section.column-control.white-theme.padding-top-60", "no-panel"], ["#container-971cbd754f > section.spruce-forest-theme", "pair"]],
    "/tax-offices/business-services/small-business-payroll-services/": [["#container-adef7469f1 > section.column-control.white-theme.padding-top-60", "no-panel"]],
    "/tax-offices/business-services/small-business-tax/s-corp-taxes/": [["#container-583d770702 > section:nth-child(3)", "no-panel"]],
    "/tax-offices/extended-tax-services/past-taxes/": [["#container-5f4a923d82 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
    "/tax-offices/manage-appointment/": [["#container-ef70e7427e > section.column-control.white-theme.padding-top-80.padding-bottom-100.two-column-control", null], ["#container-ef70e7427e > section.spruce-forest-theme", "strip"]],
    "/tax-offices/tax-prep/w-2-early-access/": [["body > main > article > section > div > div:nth-child(2) > div > div", "no-panel"], ["body > main > section", "bleed"]],
    "/tax-payment-center/": [["#container-77a8166999 > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", "bleed"]],
    "/tax-reform-and-law-changes/": [["#container-7266953ed0 > section.column-control.white-theme.padding-bottom-60", "strip"]],
    "/tax-software/": [["#container-cc917aa127 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/tax-software/basic-tax-software/": [["#container-0e9e96993e > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-0183d81774 > div:nth-child(6)", null]],
    "/tax-software/deluxe-tax-software/": [["#container-7c3463266f > section:nth-child(9)", "no-panel"], ["#container-1abe367d84 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-7c3463266f > div:nth-child(12)", null]],
    "/tax-software/deluxe-without-state/": [["#container-6a44599bfa > section:nth-child(9)", "no-panel"], ["#container-394f809683 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-6a44599bfa > div:nth-child(12)", null]],
    "/tax-software/premium-small-business-tax-software/": [["#container-70228ce7b0 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-23a1fc841d > div:nth-child(6)", null]],
    "/tax-software/premium-tax-software/": [["#container-21de483afe > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-0f860f40c5 > div:nth-child(6)", null]],
    "/tax-software/state-editions/": [["#container-6d4ad41ada > section.column-control.white-theme.padding-top-20.padding-bottom-100", "no-panel"], ["#container-f481a87487 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-6d4ad41ada > section.product-details-wrapper.p-b-80.no-stateform > div > div", "strip"]],
    "/tax-software/updates-back-editions/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/tax-software/updates-back-editions/2021-back-editions/": [["#container-3530faca90 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/tax-software/updates-back-editions/2022-back-editions/": [["#container-d34ad73b9e > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/tax-software/updates-back-editions/2023-back-editions/": [["#container-8a087c1a91 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/tax-software/updates-back-editions/2024-back-editions/": [["#container-1fda0fe969 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/tax-software/updates-back-editions/prior-year/": [["#container-cd5f8a909a > section:nth-child(4)", "no-panel"], ["#container-7bf0a20b85 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null], ["#container-cd5f8a909a > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
    "/taxes/products/software/updates/17buswin-instruct/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/17mac-state/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/17macintosh-federal/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/17windows-federal/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/17windows-state/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/18buswin-instruct/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/18mac-state/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/18macintosh-federal/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/18windows-federal/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/18windows-state/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/19buswin-instruct/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/19mac-state/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/19macintosh-federal/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/19windows-federal/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/19windows-state/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/taxes/products/software/updates/20buswin-instruct/": [["#container-57d023c222 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/expat-tax-preparation/expat-extension-filing/": [["section.white-theme.two-column-control", "no-panel"], ["section.spruce-eggshell-theme.padding-bottom-80", "pair"]],
    "/expat-tax-preparation/expat-tax-preparation-and-services/audit-support/": [["section.white-theme.two-column-control", "no-panel"], ["section.white-theme.padding-top-40.padding-bottom-120", "no-panel"], ["section.content-two-column", null]],
    "/tax-offices/upfront-pricing/": [["section.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control:not(:has(.cq-dd-image))", "strip"], ["section.white-theme.padding-top-20.padding-bottom-100", "no-panel"], ["section.spruce-eggshell-theme.two-column-control:has(.cq-dd-image)", null], ["section.content-two-column", null]],
    "/corporate/founders/": [["section.spruce-eggshell-theme.two-column-control:has(li.col-2 .introImageVariant)", "pair"], ["section.spruce-forest-theme.two-column-control", "pair"], ["section.white-theme.two-column-control:has(.cq-dd-image)", "bleed"], ["section.two-column-control", null]],
    // catalog placed the one-column privacy notice body here; it is long-form legal text, kept as default content
    "/universal/digital-online-mobile-privacy-principles/": [["section.white-theme.padding-top-60.padding-bottom-40", "!default-content"]],
    // card-grid-landing (catalog variants, class selectors stable between catalog and live)
    "/corporate/tax-franchise/": [["section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "bleed"], ["section.column-control.spruce-eggshell-theme.two-column-control", null]],
    "/espanol/": [["section.content-two-column:has(.white-theme)", "bleed"], ["section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-80.two-column-control", null], ["section.content-two-column:has(.spruce-eggshell-theme)", null], ["section.column-control.green-dark-theme.two-column-control", null]],
    "/expat-tax-preparation/expat-services/": [["section.column-control.white-theme.padding-top-100.padding-bottom-120.two-column-control", "bleed"], ["section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control", null], ["section.column-control.green-dark-theme.padding-top-100.padding-bottom-100.two-column-control", null]],
    "/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [["section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control", "bleed"], ["section.column-control.white-theme.two-column-control", "bleed"], ["section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control", "pair"]],
    "/find-a-cpa-or-enrolled-agent/": [["section.column-control.white-theme.padding-top-40.padding-bottom-80.two-column-control", "bleed"], ["section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control", "bleed"], ["section.column-control.two-column-control:has(.sm-column-reverse)", null], ["section.column-control.two-column-control:has(.justify-end)", null], ["section.column-control.white-theme:has(.col-3)", "no-panel"]],
    "/partners/tax-import-partners/": [["section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control", "bleed"], ["section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
    "/tax-offices/drop-off/": [["section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "bleed"], ["section.column-control.spruce-eggshell-theme.padding-bottom-20:has(.col-4)", "pair"], ["div.xf-content-height:has(.align-left)", null], ["div.xf-content-height:has(.fb-image-wrapper)", "no-panel-image-background"]],
    "/tax-offices/office-tax-preparation/": [["section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "bleed"], ["section.column-control.spruce-eggshell-theme.padding-bottom-20:has(.col-4)", "pair"], ["div.xf-content-height:has(.align-left)", null], ["div.xf-content-height:has(.fb-image-wrapper)", "no-panel-image-background"]],
    "/tax-offices/virtual-tax-preparation/": [["section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control", "bleed"], ["div.xf-content-height:has(.align-left)", null]],
    "/expat-tax-preparation/state-taxes-for-expats/": [["section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
    "/taxes/products/software/updates/whyrequired/": [["section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control", null]],
    "/dsar/": [["section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control", "pair"]],
    "/expat-tax-preparation/foreign-business-tax-returns/": [["section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control", "pair"]],
    "/no-surprise-guarantee/": [["section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control", "pair"]],
    "/tax-offices/business-services/": [["section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control", "pair"], ["section.column-control.green-dark-theme.padding-top-20.two-column-control", null], ["section.column-control.spruce-forest-theme.padding-top-60.padding-bottom-60.two-column-control:has(.sm-md-column-reverse)", null], ["div.xf-content-height:has(.spruce-forest-theme)", null]],
    "/tax-offices/international/": [["section.content-two-column", null], ["section.column-control.spruce-forest-theme.two-column-control", null], ["section.column-control.white-theme:has(.col-5)", "no-panel"]],
    "/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [["section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control", null], ["section.column-control.two-column-control:has(.half-height)", "dark-4"]],
    "/filing-options-and-products/": [["section.column-control.spruce-eggshell-theme.padding-bottom-80.two-column-control", "pair"]],
    "/tax-offices/tax-refund-payment/": [["section.column-control.two-column-control:has(.justify-center)", null], ["section.column-control.two-column-control:has(.sm-md-column-reverse)", null], ["section.column-control.white-theme.padding-bottom-40", "no-panel"]],
    "/taxes-site-index/": [["section.column-control.white-theme.padding-top-40.padding-bottom-40", "no-panel"], ["section.column-control.white-theme.padding-bottom-40", "no-panel"], ["section.column-control.white-theme.padding-bottom-100", "no-panel"]],
    // intro-text-landing (catalog variants: Spruce banner pair; Emerald Card and MyBlock banners default)
    "/financial-services/": [["section.column-control.spruce-eggshell-theme.padding-top-100.two-column-control", "pair"]],
    "/financial-services/emerald-savings/": [["section.column-control.spruce-eggshell-theme.padding-top-100.two-column-control", "pair"]],
    "/online-tax-filing/guarantees/free-in-person-audit-support-terms/": [["div.xf-content-height:has(section.content-two-column)", "bleed"]],
    "/online-tax-filing/guarantees/worry-free-audit-support/": [["div.xf-content-height:has(section.content-two-column)", "bleed"]],
    "/guarantees/": [["section.content-two-column", "bleed"], ["div.xf-content-height:has(section.content-two-column)", "bleed"]],
    // campaign-full-bleed-hero (catalog variants; class selectors stable between catalog and live)
    "/outlook-on-american-life/": [["section.column-control.spruce-eggshell-theme.two-column-control:has(.image-container img)", null], ["section.column-control.spruce-eggshell-theme.two-column-control:has(.introImageVariant)", "pair"]],
    "/responsibilityisland/": [["section.column-control.white-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "no-panel"]],
    // tool-guide-page (catalog variants; class selectors stable between catalog and live)
    "/tax-offices/business-services/business-formation-incorporation-services/": [["section.column-control.spruce-forest-theme:has(li.col-3 .cq-dd-image)", null]],
    "/tax-prep-checklist/": [["section.column-control.white-theme.two-column-control:has(.cq-dd-image)", "bleed"]],
    "/wheres-my-refund/": [["section.column-control.spruce-eggshell-theme:not(.two-column-control):has(li.col-3 .introImageVariant)", "pair"], ["section.column-control.white-theme.two-column-control", "bleed"]]
  };
  function pagePath6(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant6(element, params) {
    const entries = CATALOG_VARIANTS6[pagePath6(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  var BLOCK_SEL6 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text16(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden6(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline14(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text16(btn)));
    });
    root.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
      const ps = [...h.querySelectorAll(":scope > p")];
      if (!ps.length) return;
      ps.reverse().forEach((pEl) => h.after(pEl));
      while (h.lastChild && (h.lastChild.nodeName === "BR" || h.lastChild.nodeType === 3 && !h.lastChild.textContent.trim())) h.lastChild.remove();
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg9(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para12(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara6(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text16(el)) link3.append(img);
    else link3.textContent = text16(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text16(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para12(document, strong);
    }
    return para12(document, link3);
  }
  function extract6(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para12(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden6(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg9(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para12(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text16(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text16(b))));
          if (text16(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text16(n) || n.querySelector("img")) out.push(ctaPara6(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text16(n)) out.push(ctaPara6(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden6(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL6) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text16(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function expandSpans(table, document) {
    const rows = [...table.rows].filter((tr) => tr.closest("table") === table);
    const span = (cell, attr) => Math.max(1, parseInt(cell.getAttribute(attr), 10) || 1);
    if (!rows.some((tr) => [...tr.cells].some((c) => span(c, "rowspan") > 1 || span(c, "colspan") > 1))) return;
    const grid = [];
    rows.forEach((tr, r) => {
      grid[r] = grid[r] || [];
      let col = 0;
      [...tr.cells].forEach((cell) => {
        while (grid[r][col] !== void 0) col += 1;
        const rs = span(cell, "rowspan");
        const cs = span(cell, "colspan");
        for (let dr = 0; dr < rs; dr += 1) {
          grid[r + dr] = grid[r + dr] || [];
          for (let dc = 0; dc < cs; dc += 1) grid[r + dr][col + dc] = dr || dc ? null : cell;
        }
        col += cs;
      });
    });
    const width = grid.reduce((m, r) => Math.max(m, (r || []).length), 0);
    rows.forEach((tr, r) => {
      const slots = grid[r] || [];
      const real = slots.filter(Boolean);
      if (real.length === 1 && span(real[0], "colspan") >= width) return;
      const cells = [];
      for (let i = 0; i < width; i += 1) {
        const cell = slots[i];
        if (cell) {
          cell.removeAttribute("rowspan");
          cell.removeAttribute("colspan");
          cells.push(cell);
        } else cells.push(document.createElement("td"));
      }
      tr.replaceChildren(...cells);
    });
  }
  function columnHost(el) {
    let cur = el;
    while (cur && cur.children.length === 1 && !cur.matches("li.column")) cur = cur.firstElementChild;
    return cur || el;
  }
  function parse18(element, { document, params }) {
    cleanInline14(element);
    if (!element.textContent.trim() && !element.querySelector("img, picture, video, iframe, svg, lottie-player")) return;
    const variantFromCatalog = catalogVariant6(element, params);
    if (variantFromCatalog === "!default-content") {
      element.querySelectorAll("table").forEach((t) => expandSpans(t, document));
      const holder = document.createElement("div");
      holder.append(...extract6(document, element));
      element.replaceWith(holder);
      return;
    }
    let columns = [];
    if (element.matches(".green-due-date-section") || element.querySelector(".featured-due-date")) {
      const date = [...element.querySelectorAll(".featured-due-date")].find((d) => !isHidden6(d)) || element.querySelector(".featured-due-date");
      const cta = element.querySelector(".ways-to-file-cta");
      if (date) columns.push(date);
      if (cta) columns.push(cta);
    } else {
      const columnList = element.matches("ul.column-container") ? element : element.querySelector("ul.column-container");
      if (columnList) {
        columns = [...columnList.children].filter((c) => c.matches("li"));
      } else {
        const host = columnHost(element.querySelector(".ba-cta--grid") || element);
        columns = [...host.children];
        if (element.matches(".ba-cta") || element.querySelector(".ba-cta--grid")) {
          const bg = columns.filter((c) => c.matches('[data-g="bg"]'));
          if (bg.length) columns = [...columns.filter((c) => !bg.includes(c)), ...bg];
        }
      }
    }
    columns = columns.flatMap((col) => {
      const nested = [...col.querySelectorAll("ul.column-container")].find((ul) => ul.closest("li.column") === col);
      if (!nested) return [col];
      const items = [...nested.children].filter((li) => li.matches("li"));
      if (items.length < 2 || !items.every((li) => li.querySelector(".introImageVariant"))) return [col];
      const outside = col.cloneNode(true);
      const twin = [...outside.querySelectorAll("ul.column-container")].find((ul) => ul.closest("li.column") === outside);
      if (twin) twin.remove();
      return text16(outside) ? [col] : items;
    });
    const row = columns.map((col) => extract6(document, col, { icons: true })).filter((content) => content.length);
    const cells = row.length ? [row] : [];
    let variant = variantFromCatalog;
    if (variant === void 0) {
      if (element.matches(".green-due-date-section")) variant = "deadline";
      else if (element.matches(".wp-block-create-block-hrb-expat-ways-to-file")) variant = "pair";
      else if (row.length >= 2 && row.every((cell) => cell.length <= 3 && /^H[1-6]$/.test(cell[0].tagName) && !cell.some((n) => n.matches("img, picture, hr") || n.querySelector("a, img, picture")))) variant = "stats";
      else variant = null;
    }
    const name = variant ? `columns-banner (${variant})` : "columns-banner";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-split.js
  var CATALOG_VARIANTS7 = {
    "/corporate/income-tax-course/": [["#container-096c529025 > section:nth-child(1)", "bleed"]],
    "/easignup/": [["#container-5a359b941f > section.column-control.spruce-eggshell-theme.two-column-control", "bleed"]],
    "/expat-tax-preparation/": [["#container-0f429b6acb > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control", null]],
    "/expat-tax-preparation/diy-expat-tax-filing-online/": [["#container-458b5749c8 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
    "/expat-tax-preparation/expat-assisted-tax-filing/": [["#container-0334f98988 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
    "/financial-services/emerald-advance-loan-vs-refund-advance/": [["#container-6ed98747c7 > section.column-control.spruce-forest-theme.padding-top-80.padding-bottom-60.two-column-control", null]],
    "/financial-services/emerald-advance-loan/": [["#container-5a359b941f > section.column-control.spruce-eggshell-theme.two-column-control", "bleed"]],
    "/financial-services/emerald-card-login/": [["#container-de97732295 > section.column-control.green-dark-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
    "/financial-services/tax-refund-payment/": [["#container-09ef37399b > section.column-control.green-dark-theme.two-column-control", "bleed"]],
    "/lp/creator-taxes/": [["#container-d8006e96a0 > section.column-control.spruce-forest-theme.two-column-control", "bleed"]],
    "/myblock-benefits/": [["#container-3d6b34a383 > section.column-control.spruce-forest-theme.two-column-control", null]],
    "/offers/gig-worker-side-business-taxes/": [["#container-1ef905b226 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
    "/offers/saf/": [["#container-5b3cccfaf0 > section.column-control.white-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
    "/online-assist/": [["#container-33a468b3d9 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control", "bleed"]],
    "/online-tax-filing/": [["#container-33a468b3d9 > section.column-control.spruce-forest-theme.padding-bottom-20.two-column-control", "bleed"]],
    "/online-tax-filing/deluxe-online-tax-filing/": [["#container-20ed47ac3b > section.column-control.white-theme.two-column-control", "pricing"]],
    "/online-tax-filing/free-online-tax-filing/": [["#container-1a9b6ce7f3 > section.column-control.white-theme.two-column-control", "pricing"]],
    "/online-tax-filing/premium-online-tax-filing/": [["#container-43b426931f > section.column-control.white-theme.two-column-control", "pricing"]],
    "/online-tax-filing/self-employed-online-tax-filing/": [["#container-9f6cd44700 > section.column-control.white-theme.two-column-control", "pricing"]],
    "/online-tax-filing/tax-pro-review/": [["#container-f3913af060 > section.column-control.green-dark-theme.padding-top-80.padding-bottom-80.two-column-control", null]],
    "/tax-extension/": [["#container-a975ba0354 > section.column-control.white-theme.two-column-control", null]],
    "/tax-offices/business-services/c-corp-taxes/": [["#container-4518bf9c06 > section", "pricing"]],
    "/tax-offices/business-services/partnership-taxes/": [["#container-305da01dce > section", "pricing"]],
    "/tax-offices/business-services/small-business-bookkeeping-services/": [["#container-971cbd754f > section.column-control.green-dark-theme.two-column-control", null]],
    "/tax-offices/business-services/small-business-payroll-services/": [["#container-adef7469f1 > section.column-control.green-dark-theme.two-column-control", null]],
    "/tax-offices/business-services/small-business-tax/s-corp-taxes/": [["#container-46376042e2 > section", "pricing"]],
    "/tax-offices/product-services/tax-identity-shield/": [["#container-5856a19837 > section.column-control.white-theme.padding-top-80.two-column-control", null]],
    "/tax-reform-and-law-changes/": [["#container-7266953ed0 > section.column-control.spruce-forest-theme.padding-top-60.padding-bottom-60.two-column-control", null]],
    "/tax-software/state-editions/": [["#container-6d4ad41ada > section.product-details-wrapper.p-b-80.no-stateform > div > figure", "bleed"]],
    "/tax-software/updates-back-editions/": [["#container-670ec6f8c6 > section", null]],
    "/tax-software/updates-back-editions/2021-back-editions/": [["#container-814bc03364 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
    "/tax-software/updates-back-editions/2022-back-editions/": [["#container-6b09d829bd > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
    "/tax-software/updates-back-editions/2023-back-editions/": [["#container-fafb80b298 > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
    "/tax-software/updates-back-editions/2024-back-editions/": [["#container-eeac4ab9ae > section.column-control.spruce-eggshell-theme.padding-top-60.two-column-control", null]],
    "/taxes/products/software/updates/17buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/17mac-state/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/17macintosh-federal/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/17windows-federal/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/17windows-state/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/18buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/18mac-state/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/18macintosh-federal/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/18windows-federal/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/18windows-state/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/19buswin-instruct/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/19mac-state/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/19macintosh-federal/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/19windows-federal/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/19windows-state/": [["#container-670ec6f8c6 > section", null]],
    "/taxes/products/software/updates/20buswin-instruct/": [["#container-670ec6f8c6 > section", null]]
  };
  function pagePath7(params) {
    try {
      let p2 = new URL(params && params.originalURL).pathname.replace(/index\.html$/, "").replace(/\.html$/, "/");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function catalogVariant7(element, params) {
    const entries = CATALOG_VARIANTS7[pagePath7(params)];
    if (!entries) return void 0;
    for (const [sel, v] of entries) {
      try {
        if (element.matches(sel)) return v;
      } catch (e) {
      }
    }
    return void 0;
  }
  var BLOCK_SEL7 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text17(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden7(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline15(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text17(btn)));
    });
    root.querySelectorAll("h1 br, h2 br, h3 br, h4 br, h5 br, h6 br").forEach((br) => br.replaceWith(" "));
    root.querySelectorAll('a[href^="javascript:"]').forEach((a) => a.setAttribute("href", "#"));
    root.querySelectorAll("h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow").forEach((h) => {
      const p2 = h.ownerDocument.createElement("p");
      p2.append(...[...h.childNodes]);
      h.replaceWith(p2);
    });
  }
  function svgToImg10(document, svg) {
    try {
      const clone = svg.cloneNode(true);
      if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const markup = clone.outerHTML;
      const b64 = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(markup))) : Buffer.from(markup, "utf8").toString("base64");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml;base64,${b64}`;
      img.alt = svg.getAttribute("aria-label") || "";
      return img;
    } catch (e) {
      return null;
    }
  }
  function para13(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara7(document, el) {
    const link3 = document.createElement("a");
    link3.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text17(el)) link3.append(img);
    else link3.textContent = text17(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text17(el)) {
      const strong = document.createElement("strong");
      strong.append(link3);
      return para13(document, strong);
    }
    return para13(document, link3);
  }
  function extract7(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para13(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden7(n)) return;
        const tag = n.tagName.toUpperCase();
        if (tag === "SVG") {
          if (opts.icons) {
            const img = svgToImg10(document, n);
            if (img) out.push(img);
          }
          return;
        }
        if (tag === "IMG") {
          if (n.getAttribute("src")) out.push(n);
          return;
        }
        if (tag === "HR") {
          out.push(n);
          return;
        }
        if (tag === "PICTURE") {
          out.push(n);
          return;
        }
        if (tag === "IFRAME" || tag === "VIDEO") {
          const src = n.getAttribute("src") || n.querySelector("source") && n.querySelector("source").getAttribute("src");
          if (src) {
            const a = document.createElement("a");
            a.href = src;
            a.textContent = src;
            out.push(para13(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text17(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text17(b))));
          if (text17(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text17(n) || n.querySelector("img")) out.push(ctaPara7(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text17(n)) out.push(ctaPara7(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden7(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL7) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text17(n)) {
          const p2 = document.createElement("p");
          p2.append(...[...n.childNodes]);
          out.push(p2);
          return;
        }
        walk(n);
      });
    };
    walk(root);
    return out;
  }
  function normalizeWidgets(document, element) {
    element.querySelectorAll(".rating-stars").forEach((r) => {
      const summary = text17(r.querySelector(".bv-off-screen"));
      if (summary) r.replaceWith(para13(document, summary));
      else r.remove();
    });
    element.querySelectorAll(".price-block, .pricing-container").forEach((pb) => {
      if (pb.parentElement && pb.parentElement.closest(".price-block, .pricing-container")) return;
      const out = [];
      pb.querySelectorAll(".card-price-section").forEach((sec) => {
        const label = text17(sec.querySelector(".copy-small-t, .copy-small"));
        if (label) out.push(para13(document, label));
        const price = sec.querySelector(".product-price") || sec.querySelector(".price");
        if (price && text17(price)) {
          const strong = document.createElement("strong");
          strong.append(...[...price.childNodes]);
          out.push(para13(document, strong));
        }
      });
      pb.querySelectorAll(".pricingtext").forEach((n) => {
        if (text17(n)) out.push(para13(document, text17(n)));
      });
      pb.replaceWith(...out);
    });
    element.querySelectorAll("lottie-player, [data-lottie-src], .lottie-container").forEach((l) => {
      const player = l.matches("lottie-player") ? l : l.querySelector("lottie-player");
      const src = player && player.getAttribute("src") || l.getAttribute("data-lottie-src");
      if (!src) return;
      const a = document.createElement("a");
      a.href = src;
      a.textContent = player && (player.getAttribute("aria-label") || player.getAttribute("title")) || "Animation";
      (l.closest(".lottie-container") || l).replaceWith(para13(document, a));
    });
  }
  var PICKER_URLS = {
    "back-edition-year-selection": (v) => /^\d{4}$/.test(v) ? `/tax-software/updates-back-editions/${v}-back-editions/` : ""
  };
  function anchorSlug(label) {
    return (label || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-");
  }
  function pickerHref(form, value, label) {
    const v = (value || "").trim();
    if (/^#\S/.test(v)) return `#${anchorSlug(label)}`;
    if (/^(https?:)?\/\//i.test(v) || v.startsWith("/")) return v;
    const map = PICKER_URLS[form.id || form.getAttribute("name") || ""];
    return map ? map(v) : "";
  }
  function normalizePickers(document, element) {
    const hosts = [...element.querySelectorAll("form")];
    element.querySelectorAll("select").forEach((sel) => {
      if (sel.closest("form")) return;
      const host = sel.closest("section.federal-forms") || sel.parentElement && sel.parentElement.parentElement || sel.parentElement;
      if (host && host !== element && !hosts.includes(host)) hosts.push(host);
    });
    hosts.forEach((form) => {
      const select = form.querySelector("select");
      if (!select) return;
      const options = [...select.querySelectorAll("option")];
      const placeholder = options.find((o) => o.getAttribute("value") === "0" || o.getAttribute("value") === "");
      const choices = options.filter((o) => o !== placeholder && text17(o));
      if (!choices.length) return;
      const out = [];
      const label = text17(placeholder) || text17(form.querySelector("label"));
      if (label) out.push(para13(document, label));
      const ul = document.createElement("ul");
      choices.forEach((o) => {
        const li = document.createElement("li");
        const href = pickerHref(form, o.getAttribute("value"), text17(o));
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = text17(o);
          li.append(a);
        } else {
          li.textContent = text17(o);
        }
        ul.append(li);
      });
      out.push(ul);
      const btn = [...form.querySelectorAll(".btn-container a, .btn-container button, a.btn, button.btn")].find((b) => text17(b));
      if (btn) out.push(btn);
      const holder = document.createElement("div");
      holder.append(...out);
      form.replaceWith(holder);
    });
  }
  function parse19(element, { document, params }) {
    element.querySelectorAll("span.hide, button.lottie-btn").forEach((n) => n.remove());
    normalizePickers(document, element);
    cleanInline15(element);
    const hasPrice = !!element.querySelector(".price-block, .pricing-container");
    normalizeWidgets(document, element);
    const columnList = element.querySelector("ul.column-container");
    const columns = columnList ? [...columnList.children].filter((c) => c.matches("li")) : [...element.children];
    const row = columns.map((col) => extract7(document, col)).filter((c) => c.length);
    let variant = catalogVariant7(element, params);
    if (variant === void 0) variant = hasPrice ? "pricing" : null;
    const cells = row.length ? [row] : [];
    const name = variant ? `hero-split (${variant})` : "hero-split";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function text18(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse20(element, { document }) {
    element.querySelectorAll("svg, script, style, link, noscript, button.slick-arrow, ul.slick-dots").forEach((n) => n.remove());
    const cells = [];
    const heading3 = [...element.querySelectorAll(".ts-heading, h1, h2, h3")].find((h) => text18(h));
    if (heading3 && !heading3.closest(".testimonial-slide")) {
      const intro = [heading3];
      const introCol = heading3.closest('[class*="col-"]');
      if (introCol) {
        introCol.querySelectorAll("p").forEach((p2) => {
          if (text18(p2)) intro.push(p2);
        });
      }
      cells.push([intro]);
    }
    const figures = [...element.querySelectorAll("figure.testimonial-card")];
    if (figures.length) {
      let photo = false;
      figures.forEach((fig) => {
        const author = [];
        const img = fig.querySelector(".testimonial-img img, img");
        if (img && img.getAttribute("src")) {
          author.push(img);
          photo = true;
        }
        const cite = fig.querySelector("cite");
        if (text18(cite)) {
          const strong = document.createElement("strong");
          strong.textContent = text18(cite);
          const np = document.createElement("p");
          np.append(strong);
          author.push(np);
        }
        fig.querySelectorAll("address p").forEach((p2) => {
          if (text18(p2)) author.push(p2);
        });
        const quote = [...fig.querySelectorAll("blockquote p")].filter((p2) => text18(p2));
        if (!quote.length && !author.length) return;
        if (author.length) cells.push([author, quote.length ? quote : ""]);
        else cells.push([quote]);
      });
      const name = photo ? "carousel-testimonial (photo)" : "carousel-testimonial";
      element.replaceWith(WebImporter.Blocks.createBlock(document, { name, cells }));
      return;
    }
    let slides = [...element.querySelectorAll(".slick-slide:not(.slick-cloned) .testimonial-slide")];
    if (!slides.length) slides = [...element.querySelectorAll(".testimonial-slide")];
    slides.forEach((slide) => {
      const authorBox = slide.querySelector(".testimonial-author-info");
      const author = [];
      if (authorBox) {
        const img = authorBox.querySelector("img");
        if (img) author.push(img);
        authorBox.querySelectorAll("p").forEach((p2) => {
          if (!text18(p2)) return;
          if (p2.classList.contains("author-name")) {
            const strong = document.createElement("strong");
            strong.textContent = text18(p2);
            const np = document.createElement("p");
            np.append(strong);
            author.push(np);
          } else {
            author.push(p2);
          }
        });
      }
      const quoteBox = slide.querySelector(".testimonial-copy") || slide;
      const quote = [...quoteBox.querySelectorAll("p")].filter((p2) => text18(p2) && !(authorBox && authorBox.contains(p2)));
      if (!quote.length && !author.length) return;
      if (author.length) cells.push([author, quote.length ? quote : ""]);
      else cells.push([quote]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function cleanInline16(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, " ").trim()));
    });
  }
  function text19(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function makeImg(document, src, alt) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    return img;
  }
  function bgImage(el, document) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const m = style.match(/background-image:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    return m ? makeImg(document, m[1], "") : null;
  }
  function heading2(document, tag, label, href) {
    const h = document.createElement(tag);
    if (href) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      h.append(a);
    } else {
      h.textContent = label;
    }
    return h;
  }
  function para14(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function buttonPara(document, a) {
    const link3 = document.createElement("a");
    link3.href = a.getAttribute("href");
    link3.textContent = text19(a);
    const strong = document.createElement("strong");
    strong.append(link3);
    return para14(document, strong);
  }
  function parse21(element, { document }) {
    cleanInline16(element);
    const cells = [];
    let variant = null;
    if (element.matches(".expat-hp-countries--grid") || element.querySelector(".expat-hp-countries--thumb")) {
      variant = "country-grid";
      element.querySelectorAll("a[href]").forEach((a) => {
        const img = a.querySelector("img");
        const label = text19(a.querySelector("p")) || text19(a);
        if (!label) return;
        const link3 = document.createElement("a");
        link3.href = a.getAttribute("href");
        link3.textContent = label;
        cells.push([img || "", para14(document, link3)]);
      });
    } else if (element.querySelector("a.ba--pgitem")) {
      element.querySelectorAll("a.ba--pgitem").forEach((a) => {
        const href = a.getAttribute("href");
        const body = [];
        const cat = text19(a.querySelector(".category-label"));
        if (cat) body.push(para14(document, cat));
        const title = text19(a.querySelector(".post-title, h2, h3"));
        if (title) body.push(heading2(document, "h2", title, href));
        const excerpt = text19(a.querySelector("p"));
        if (excerpt) body.push(para14(document, excerpt));
        if (body.length) cells.push([body]);
      });
    } else if (element.querySelector("a.ba-single--related-post")) {
      element.querySelectorAll("a.ba-single--related-post").forEach((a) => {
        const href = a.getAttribute("href");
        const img = a.querySelector(".featured-image img, img");
        const body = [];
        const cat = text19(a.querySelector(".category-label"));
        if (cat) body.push(para14(document, cat));
        const title = text19(a.querySelector(".title, h2, h3:not(.category-label)"));
        if (title) body.push(heading2(document, "h3", title, href));
        if (body.length || img) cells.push([img || "", body.length ? body : ""]);
      });
    } else if (element.matches(".theposts") || element.querySelector("div.post .tic-post-title")) {
      variant = "image";
      element.querySelectorAll("div.post").forEach((post) => {
        const a = post.querySelector("a[href]");
        const href = a ? a.getAttribute("href") : null;
        const img = post.querySelector("img") || bgImage(post.querySelector(".tic-post-thumbnail"), document);
        const body = [];
        const cat = text19(post.querySelector(".tic-green-subhead"));
        if (cat) body.push(para14(document, cat));
        const title = text19(post.querySelector(".tic-post-title"));
        if (title) body.push(heading2(document, "h3", title, href));
        const excerpt = post.querySelector(".tic-post-excerpt, .excerpt");
        if (excerpt && text19(excerpt)) body.push(para14(document, text19(excerpt)));
        if (body.length) cells.push([img || "", body]);
      });
    } else {
      let articles = [...element.querySelectorAll("article.card-stacked, article")].filter((a, i, arr) => arr.indexOf(a) === i && !a.parentElement.closest("article"));
      if (!articles.length) {
        articles = [...element.querySelectorAll("div.card-stacked")].filter((a) => !a.parentElement.closest("div.card-stacked"));
      }
      const isStacked = articles.some((a) => a.matches(".stackedContent") || a.querySelector(".stacked-eyebrow-row"));
      if (isStacked) variant = "green-light";
      else variant = element.matches(".green-dark-theme") || element.closest(".green-dark-theme") ? "with-button-2" : "with-button";
      articles.forEach((art) => {
        const img = art.querySelector(".cmp-column--image img, img");
        const btn = [...art.querySelectorAll(".btn-container a[href], footer a[href], a.btn[href]")].find((a) => text19(a));
        const href = btn ? btn.getAttribute("href") : null;
        const body = [];
        const eyebrow = art.querySelector(".eyebrow-label, .stacked-eyebrow-row");
        if (eyebrow && text19(eyebrow)) body.push(para14(document, text19(eyebrow)));
        const titleEl = art.querySelector(".stacked-title, h3.title, header h3, h3, h2");
        const title = text19(titleEl);
        if (title) body.push(heading2(document, "h3", title, href));
        const summary = art.querySelector(".excerpt, .card-body > div:first-child, .card-body");
        if (summary) {
          const ps = [...summary.querySelectorAll("p, ul, ol")].filter((p2) => {
            const list = p2.parentElement.closest("ul, ol");
            return !(list && summary.contains(list)) && text19(p2);
          });
          if (ps.length) body.push(...ps);
          else if (text19(summary) && (!btn || !summary.contains(btn))) body.push(para14(document, text19(summary)));
        }
        if (btn) body.push(buttonPara(document, btn));
        if (body.length || img) cells.push([img || "", body.length ? body : ""]);
      });
    }
    const name = variant ? `cards-article (${variant})` : "cards-article";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hrblock-cleanup.js
  var CATALOG_CLEANUP_RULES = [
    '[id*="truste"]',
    'body [class*="popup"]:not(nav *)',
    'body [class*="modal"]:not(nav *)',
    'body [class*="overlay"]:not(nav *)',
    '[role="dialog"]',
    '[class*="chatbot"]'
  ];
  var CONTENT_ROOTS = "main, #site-content, body > div.global-disclaimer-container";
  function normalizeUrl(url) {
    if (!url) return "";
    try {
      const u = new URL(url, "https://www.hrblock.com/");
      let p2 = u.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
      if (!p2.endsWith("/")) p2 += "/";
      return p2.toLowerCase();
    } catch (e) {
      return "";
    }
  }
  function getPageUrl(document, payload) {
    const p2 = payload || {};
    const candidates = [
      p2.params && p2.params.originalURL,
      p2.originalURL,
      p2.url
    ];
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) candidates.push(canonical.getAttribute("href"));
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) candidates.push(ogUrl.getAttribute("content"));
    return candidates.filter(Boolean);
  }
  function findPageCleanup(document, payload) {
    const pageCleanup = payload && payload.template && payload.template.pageCleanup;
    if (!pageCleanup || typeof pageCleanup !== "object") return null;
    const keys = Object.keys(pageCleanup);
    const urls = getPageUrl(document, payload);
    for (const url of urls) {
      if (pageCleanup[url]) return pageCleanup[url];
      const norm = normalizeUrl(url);
      if (!norm) continue;
      const key = keys.find((k) => normalizeUrl(k) === norm);
      if (key) return pageCleanup[key];
    }
    return null;
  }
  function safeQueryAll(root, selector) {
    try {
      return [...root.querySelectorAll(selector)];
    } catch (e) {
      return [];
    }
  }
  var FALSE_MODAL_CONTENT = ".manual-model, .modal-headline, .modal-body, .modal-tool-open";
  var REAL_MODAL = '.modal-overlay, .software-popup, [id^="modal-"], [role="dialog"], [aria-modal="true"], [class*="chatbot"], [class*="popup"]';
  function isFalseModalContent(el) {
    if (!el.closest(CONTENT_ROOTS)) return false;
    if (el.closest(REAL_MODAL)) return false;
    return !!(el.matches(FALSE_MODAL_CONTENT) || el.closest(".manual-model"));
  }
  var CLEANUP_ATTR = "data-excat-cleanup";
  var MAX_DATA_URI_LENGTH = 2e4;
  function isImporterSafeSrc(src) {
    try {
      let decoded = src;
      try {
        decoded = decodeURI(src);
      } catch (e) {
        return false;
      }
      new RegExp(`\\(${decoded.replace(".", "\\.")}\\)`, "gm");
      new RegExp(`\\(${src.replace(".", "\\.")}\\)`, "gm");
      return true;
    } catch (e) {
      return false;
    }
  }
  var CLEANUP_RESOLVED_ATTR = "data-excat-cleanup-resolved";
  function cleanupTargets(document, entries) {
    const targets = [];
    entries.forEach((entry) => {
      const selector = typeof entry === "string" ? entry : entry && entry.selector;
      if (!selector) return;
      const matches = safeQueryAll(document, selector);
      if (matches.length !== 1) return;
      targets.push(matches[0]);
    });
    return targets;
  }
  function removeCleanupTarget(el) {
    if (!el.isConnected) return;
    if (el.matches("html, body, main") || el.querySelector("main")) return;
    if (isFalseModalContent(el)) return;
    el.remove();
  }
  function replayPageCleanup(document, entries) {
    if (document.documentElement.hasAttribute(CLEANUP_RESOLVED_ATTR)) {
      safeQueryAll(document, `[${CLEANUP_ATTR}]`).forEach(removeCleanupTarget);
      safeQueryAll(document, `[${CLEANUP_ATTR}]`).forEach((el) => el.removeAttribute(CLEANUP_ATTR));
      return;
    }
    cleanupTargets(document, entries).forEach(removeCleanupTarget);
  }
  function pruneDisclaimers(document) {
    const triggers = new Set(
      safeQueryAll(document, "[data-disclaimer-trigger]").filter((b) => !b.closest(".global-disclaimer-container, section.page-disclaimer")).map((b) => (b.getAttribute("data-disclaimer-trigger") || "").trim())
    );
    const pruned = /* @__PURE__ */ new Set();
    safeQueryAll(document, ".global-disclaimer-container li[data-disclaimer-target], section.page-disclaimer li[data-disclaimer-target]").forEach((li) => {
      const target = (li.getAttribute("data-disclaimer-target") || "").trim();
      if (triggers.has(target) || !li.classList.contains("hide")) return;
      const list = li.closest("section.page-disclaimer") || li.parentElement;
      li.remove();
      if (list) pruned.add(list);
    });
    pruned.forEach((list) => {
      if (!list.isConnected || list.querySelector("li")) return;
      let el = list;
      while (el.parentElement && !el.parentElement.matches("body, main") && el.parentElement.textContent.trim() === el.textContent.trim()) {
        el = el.parentElement;
      }
      el.remove();
    });
  }
  var MODAL_SEL = 'div.modal-overlay[id^="modal-"]';
  function headingSlug(heading3) {
    return (heading3.textContent || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-").replace(/^\d+-+/, "");
  }
  var HEADINGS_SEL = "h1, h2, h3, h4, h5, h6";
  function visibleDuplicate(document, body) {
    const items = safeQueryAll(body, "li, p").filter((el) => !el.querySelector("li, p")).map((el) => normText(el.textContent)).filter((t) => t.length > 12);
    if (items.length < 3) return null;
    const pageTexts = new Set(safeQueryAll(document.body, "li, p, h1, h2, h3, h4, h5, h6, div, span").filter((el) => !el.closest(MODAL_SEL) && !el.closest("header, footer, nav") && el.closest(CONTENT_ROOTS)).map((el) => normText(el.textContent)));
    const found = items.filter((t) => pageTexts.has(t)).length;
    if (found / items.length < 0.6) return null;
    const pageHeadings = safeQueryAll(document.body, HEADINGS_SEL).filter((h) => !h.closest(MODAL_SEL) && !h.closest("header, footer, nav") && h.closest(CONTENT_ROOTS));
    const modalHeadings = safeQueryAll(body, HEADINGS_SEL).map((h) => normText(h.textContent)).filter(Boolean);
    const match = pageHeadings.find((h) => modalHeadings.includes(normText(h.textContent)));
    return { slug: match ? headingSlug(match) : "" };
  }
  function rescueLinkedModals(document) {
    const seen = /* @__PURE__ */ new Set();
    const rescued = [];
    safeQueryAll(document, MODAL_SEL).forEach((modal) => {
      const root = modal.closest(CONTENT_ROOTS);
      if (!root || modal.closest("header, footer, nav")) return;
      const name = modal.id.slice("modal-".length);
      if (seen.has(name)) {
        modal.remove();
        return;
      }
      const triggers = safeQueryAll(document, `[data-globalmodal="${name}"]`).filter((t) => !t.closest(MODAL_SEL) && !t.closest("header, footer, nav") && t.closest(CONTENT_ROOTS));
      if (!triggers.length) return;
      seen.add(name);
      const body = modal.querySelector(":scope > .modal") || modal;
      safeQueryAll(body, ".modal-close, [data-globalmodalclose]").forEach((b) => b.remove());
      if (!body.textContent.trim()) return;
      const duplicate = visibleDuplicate(document, body);
      if (duplicate) {
        triggers.forEach((t) => {
          if (t.tagName === "A") t.setAttribute("href", duplicate.slug ? `#${duplicate.slug}` : "#");
          t.removeAttribute("data-globalmodal");
          t.removeAttribute("data-target");
        });
        modal.remove();
        return;
      }
      const heading3 = [...body.querySelectorAll("h1, h2, h3, h4, h5, h6")].find((h) => h.textContent.trim() && !h.matches(".eyebrow-label, .color-eyebrow"));
      const slug = heading3 ? headingSlug(heading3) : "";
      triggers.forEach((t) => {
        if (t.tagName === "A") t.setAttribute("href", slug ? `#${slug}` : "#");
        t.removeAttribute("data-globalmodal");
        t.removeAttribute("data-target");
      });
      const wrapper = document.createElement("section");
      wrapper.className = "white-theme excat-modal-content";
      wrapper.append(...body.childNodes);
      [wrapper, ...wrapper.querySelectorAll("*")].forEach((el) => el.removeAttribute(CLEANUP_ATTR));
      const HEADINGS = "h1, h2, h3, h4, h5, h6";
      safeQueryAll(wrapper, 'button, a[href="#"], a[href^="javascript:" i], a[role="button"], a:not([href])').filter((t) => t.closest(HEADINGS) || t.querySelector(HEADINGS)).forEach((t) => {
        t.querySelectorAll("svg").forEach((s) => s.remove());
        if (t.querySelector(HEADINGS)) t.replaceWith(...t.childNodes);
        else t.replaceWith(document.createTextNode(t.textContent.replace(/\s+/g, " ").trim()));
      });
      modal.remove();
      rescued.push({ root, wrapper });
    });
    rescued.forEach(({ root, wrapper }) => root.append(wrapper));
  }
  function applyCatalogRulesOutsideMain(document) {
    CATALOG_CLEANUP_RULES.forEach((rule) => {
      safeQueryAll(document.body || document, rule).forEach((el) => {
        if (!el.isConnected) return;
        if (el.matches("html, body, head") || el.closest("head")) return;
        if (el.closest(CONTENT_ROOTS)) return;
        if (el.querySelector(CONTENT_ROOTS)) return;
        el.remove();
      });
    });
  }
  function removeAll(root, selectors) {
    selectors.forEach((selector) => {
      safeQueryAll(root, selector).forEach((el) => {
        if (el.isConnected) el.remove();
      });
    });
  }
  function isEmptyWidget(el) {
    if (el.matches(CONTENT_ROOTS) || el.querySelector(CONTENT_ROOTS)) return false;
    if (el.querySelector("picture, video, iframe:not(.hidden), table, form")) return false;
    const imgs = [...el.querySelectorAll("img")].filter((img) => {
      const w = img.getAttribute("width");
      const h = img.getAttribute("height");
      return !(w === "0" || h === "0" || w === "1" || h === "1");
    });
    if (imgs.length) return false;
    return el.textContent.replace(/\s+/g, "").length === 0;
  }
  var SOURCE_TABLE_ATTR = "data-excat-src-table";
  function convertSourceTables(element, document) {
    const tables = safeQueryAll(element, `table[${SOURCE_TABLE_ATTR}]`).reverse();
    tables.forEach((table) => {
      if (!table.isConnected) return;
      table.removeAttribute(SOURCE_TABLE_ATTR);
      if (table.parentElement && table.parentElement.closest("table")) return;
      const rows = [...table.rows].filter((tr) => !tr.closest("table") || tr.closest("table") === table);
      const cellsOf = (tr) => [...tr.cells];
      if (rows.length <= 1) {
        const holder = document.createElement("div");
        rows.forEach((tr) => cellsOf(tr).forEach((cell) => {
          const div = document.createElement("div");
          div.append(...cell.childNodes);
          holder.append(div);
        }));
        table.replaceWith(holder);
        return;
      }
      const cells = rows.map((tr) => cellsOf(tr).map((cell) => {
        const div = document.createElement("div");
        div.append(...cell.childNodes);
        return div;
      })).filter((r) => r.some((c) => c.textContent.trim() || c.querySelector("img, picture")));
      if (!cells.length) {
        table.remove();
        return;
      }
      table.replaceWith(WebImporter.Blocks.createBlock(document, { name: "table-data", cells }));
    });
  }
  var HR_PLACEHOLDER = "excat-src-hr";
  var SECTION_MARKER_ATTR = "data-excat-section-style";
  function protectSourceRules(document) {
    safeQueryAll(document.body || document, "hr").forEach((hr) => {
      if (hr.closest("header, footer, nav")) return;
      const div = document.createElement("div");
      div.className = HR_PLACEHOLDER;
      hr.replaceWith(div);
    });
  }
  function restoreSourceRules(document) {
    safeQueryAll(document, `div.${HR_PLACEHOLDER}`).forEach((div) => {
      div.replaceWith(document.createElement("hr"));
    });
  }
  var HIDDEN_AT_DESKTOP = [
    ".hide-large",
    ".show-small:not(.show-large)",
    ".show-medium:not(.show-large)",
    ".show-desk-small:not(.show-large)",
    ".tic-article-detail-bar--mobile",
    "#site-content .post-info.tablet-down-only",
    '#site-content .at-a-glance[style*="display: none"]',
    '#site-content .at-a-glance[style*="display:none"]',
    // hero figure tablet / mobile renditions next to the desktop one (hero-banner
    // keeps herodefaultview; a hero left as default content would show all three)
    "img.herodefaultview ~ img.herotabview",
    "img.herodefaultview ~ img.heromobview"
  ].join(", ");
  function absoluteUrl(href) {
    try {
      return new URL(href, "https://www.hrblock.com/").href;
    } catch (e) {
      return href;
    }
  }
  function dropDesktopHidden(document) {
    const hidden = safeQueryAll(document.body || document, HIDDEN_AT_DESKTOP).filter((el) => !el.parentElement || !el.parentElement.closest(HIDDEN_AT_DESKTOP));
    const allPlayers = safeQueryAll(document, "lottie-player[src]");
    hidden.forEach((el) => {
      if (!el.isConnected) return;
      if (el.matches(CONTENT_ROOTS) || el.querySelector(CONTENT_ROOTS)) return;
      if (el.closest("header, footer, nav")) return;
      if (el.matches("[data-excat-match]") || el.querySelector("[data-excat-match]")) return;
      el.querySelectorAll("lottie-player[src]").forEach((mobile) => {
        const desktop = allPlayers.filter((pl) => pl !== mobile && !pl.closest(HIDDEN_AT_DESKTOP) && pl.compareDocumentPosition(mobile) & 4).pop();
        if (desktop && !desktop.hasAttribute("data-excat-narrow-src")) {
          desktop.setAttribute("data-excat-narrow-src", absoluteUrl(mobile.getAttribute("src")));
        }
      });
      el.remove();
    });
  }
  var BUTTON_SEL = 'a[class*="btn"], button[class*="btn"], a[class*="ba-button"]';
  var NOT_A_CTA = '.btn-medium-t, [role="tab"], .btn-close, .btn-image, .show-hide-toggle, .hide-show-toggle';
  var SECONDARY_RE = /(^|\s)(btn--transparent[\w-]*|[\w-]*--outline)(\s|$)/;
  var buttonRegistry = /* @__PURE__ */ new WeakMap();
  function normText(t) {
    return (t || "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function normHref(href) {
    const h = (href || "").trim();
    if (!h || h === "#" || /^javascript:/i.test(h)) return "#";
    try {
      const u = new URL(h, "https://www.hrblock.com/");
      if (/(^|\.)hrblock\.com$/.test(u.hostname)) return `${u.pathname.replace(/\/$/, "")}${u.search}`;
      return u.href;
    } catch (e) {
      return h;
    }
  }
  function recordButtons(document) {
    const reg = /* @__PURE__ */ new Map();
    safeQueryAll(document.body || document, BUTTON_SEL).forEach((b) => {
      if (b.matches(NOT_A_CTA) || b.closest("header, footer, nav")) return;
      const label = normText(b.textContent);
      if (!label) return;
      const key = `${label}|${normHref(b.getAttribute("href"))}`;
      const kind = SECONDARY_RE.test(b.className || "") ? "secondary" : "primary";
      if (!reg.has(key)) reg.set(key, []);
      reg.get(key).push(kind);
    });
    buttonRegistry.set(document, reg);
  }
  function applyButtonKinds(root, document) {
    const reg = buttonRegistry.get(document);
    if (!reg || !reg.size) return;
    safeQueryAll(root, "a[href]").forEach((a) => {
      const p2 = a.closest("p");
      if (!p2 || a.closest("h1, h2, h3, h4, h5, h6")) return;
      if (a.querySelector("img, picture")) return;
      const label = normText(a.textContent);
      if (!label || normText(p2.textContent) !== label) return;
      const kinds = reg.get(`${label}|${normHref(a.getAttribute("href"))}`);
      if (!kinds || !kinds.length) return;
      const kind = kinds.every((k) => k === kinds[0]) ? kinds[0] : kinds.shift();
      const parent = a.parentElement;
      const wrapped = parent && parent !== p2 && /^(STRONG|B|EM|I)$/.test(parent.tagName) ? parent : null;
      if (kind === "secondary") {
        if (wrapped && /^(EM|I)$/.test(wrapped.tagName) && wrapped.parentElement === p2) return;
        const em = document.createElement("em");
        if (wrapped) {
          wrapped.replaceWith(em);
          em.append(a);
        } else {
          a.replaceWith(em);
          em.append(a);
        }
      } else if (!wrapped && parent === p2) {
        const strong = document.createElement("strong");
        a.replaceWith(strong);
        strong.append(a);
      }
    });
  }
  function normalizeStrikethrough(root, document) {
    safeQueryAll(root, "s, strike").forEach((s) => {
      const del = document.createElement("del");
      del.append(...s.childNodes);
      s.replaceWith(del);
    });
    safeQueryAll(root, "del").forEach((del) => {
      if (!del.textContent.trim()) {
        del.remove();
        return;
      }
      const prev = del.previousSibling;
      const next = del.nextSibling;
      const endsWord = (n) => n && n.textContent && /\S$/.test(n.textContent) && !(n.nodeType === 1 && n.tagName === "BR");
      const startsWord = (n) => n && n.textContent && /^\S/.test(n.textContent) && !(n.nodeType === 1 && n.tagName === "BR");
      if (endsWord(prev)) del.before(document.createTextNode(" "));
      if (startsWord(next)) del.after(document.createTextNode(" "));
    });
  }
  var ICON_HOST_RE = /icon|check|bullet|arrow/i;
  function svgDataUri(cssValue) {
    const v = cssValue || "";
    const start = v.search(/url\(/i);
    if (start < 0) return null;
    let i = start + 4;
    while (v[i] === " ") i += 1;
    const quote = v[i] === '"' || v[i] === "'" ? v[i] : "";
    if (quote) i += 1;
    let end = quote ? v.indexOf(quote, i) : v.indexOf(")", i);
    while (quote && end > 0 && v[end - 1] === "\\") end = v.indexOf(quote, end + 1);
    if (end < 0) return null;
    const uri = quote ? v.slice(i, end).replace(/\\(["'])/g, "$1") : v.slice(i, end).trim();
    if (!/^data:image\/svg\+xml/i.test(uri)) return null;
    const comma = uri.indexOf(",");
    if (comma < 0) return null;
    const meta = uri.slice(0, comma);
    const data = uri.slice(comma + 1);
    if (!data) return null;
    if (/;base64$/i.test(meta)) return `data:image/svg+xml;base64,${data}`;
    let svg = data;
    try {
      svg = decodeURIComponent(data);
    } catch (e) {
    }
    try {
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    } catch (e) {
      return null;
    }
  }
  function convertSvgBackgrounds(root, document) {
    safeQueryAll(root, '[style*="background-image"]').forEach((el) => {
      const value = el.style && el.style.backgroundImage;
      if (!value || !/data:image\/svg\+xml/i.test(value)) return;
      el.style.removeProperty("background-image");
      if (!el.getAttribute("style")) el.removeAttribute("style");
      const isIcon = el.matches("span, i, a, li, p") || ICON_HOST_RE.test(el.className || "");
      if (!isIcon) return;
      const src = svgDataUri(value);
      if (!src) return;
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      el.prepend(img);
    });
  }
  function captureLiveState(document) {
    safeQueryAll(document, ".pricing-tool-section").forEach((tool) => {
      const priceEl = tool.querySelector(".price-box .pricing > span, .price-box .pricing strong");
      if (!priceEl) return;
      const read = () => priceEl.textContent.replace(/\s+/g, "").trim();
      tool.querySelectorAll('.price-pill-list input[type="checkbox"]').forEach((input) => {
        if (input.hasAttribute("data-price") || typeof input.click !== "function") return;
        try {
          const wasChecked = !!input.checked;
          if (wasChecked) input.click();
          const base = read();
          input.click();
          const selected = read();
          input.click();
          if (wasChecked) input.click();
          if (selected && selected !== base) input.setAttribute("data-price", selected);
        } catch (e) {
        }
      });
    });
    const view = document.defaultView;
    if (!view || typeof view.getComputedStyle !== "function") return;
    safeQueryAll(document, "#review-form-selector .button-container-one, #review-form-selector .placeholder-button").forEach((el) => {
      try {
        const content = view.getComputedStyle(el, "::after").content || "";
        const m = content.match(/^["'](.*)["']$/);
        const label = m ? m[1].replace(/\\(.)/g, "$1").trim() : "";
        if (label) el.setAttribute("data-excat-label", label);
      } catch (e) {
      }
    });
  }
  function captureVideoEmbeds(document) {
    safeQueryAll(document, '.video-container .video[data-videotype="youtube"]').forEach((video) => {
      const container = video.closest(".video-container");
      if (!container || container.hasAttribute("data-excat-video")) return;
      const walker = document.createTreeWalker(
        video,
        128
        /* NodeFilter.SHOW_COMMENT */
      );
      let node = walker.nextNode();
      while (node) {
        const m = (node.textContent || "").match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/i);
        if (m) {
          container.setAttribute("data-excat-video", `https://www.youtube.com/watch?v=${m[1]}`);
          return;
        }
        node = walker.nextNode();
      }
    });
  }
  function flattenAngularApp(document) {
    const root = document.querySelector("body > myblock-root");
    if (!root) return;
    const card = root.querySelector("main");
    const out = document.createElement("div");
    if (card) {
      const t = (el) => el.textContent.replace(/\s+/g, " ").trim();
      const seen = /* @__PURE__ */ new Set();
      card.querySelectorAll("h1, h2, h3, hrb-text, button").forEach((el) => {
        const text20 = t(el);
        if (!text20 || seen.has(text20) || el.tagName === "HRB-TEXT" && el.querySelector("h1, h2, h3")) return;
        if (el.tagName === "BUTTON" && el.disabled) return;
        seen.add(text20);
        let node;
        if (/^H[1-3]$/.test(el.tagName)) {
          node = document.createElement(el.tagName.toLowerCase());
          node.textContent = text20;
        } else if (el.tagName === "BUTTON") {
          node = document.createElement("p");
          const strong = document.createElement("strong");
          const a = document.createElement("a");
          a.href = "#";
          a.textContent = text20;
          strong.append(a);
          node.append(strong);
        } else {
          node = document.createElement("p");
          node.textContent = text20;
        }
        out.append(node);
      });
    }
    root.replaceWith(out);
  }
  var INLINE_HIDDEN_SEL = '[style*="display: none"], [style*="display:none"]';
  var BAND_PARENT_SEL = "main, #site-content, .cmp-container, div.root, body";
  var TOGGLED_SEL = '.accordion__content, .accordion, [role="tabpanel"], .tab-pane, .tab-content, .tabs, [aria-hidden], form, table';
  function hasVisibleTrigger(document, el) {
    if (!el.id) return false;
    const id = el.id.replace(/"/g, '\\"');
    return safeQueryAll(document.body, `a[href="#${id}"], [data-target="#${id}"], [aria-controls="${id}"], [data-cta-link="#${id}"]`).some((t) => !el.contains(t) && !t.closest(INLINE_HIDDEN_SEL));
  }
  function dropInlineHidden(document) {
    safeQueryAll(document.body || document, INLINE_HIDDEN_SEL).forEach((el) => {
      if (!el.isConnected || el.closest("header, footer, nav")) return;
      if (!el.closest(CONTENT_ROOTS) || el.matches(CONTENT_ROOTS) || el.querySelector("main, #site-content")) return;
      if (el.matches(TOGGLED_SEL) || el.closest(TOGGLED_SEL)) return;
      if (el.matches(MODAL_SEL) || el.closest(MODAL_SEL)) return;
      const isBand = el.tagName === "SECTION" || el.parentElement && el.parentElement.matches(BAND_PARENT_SEL);
      if (!isBand || !el.textContent.trim()) return;
      if (hasVisibleTrigger(document, el)) return;
      el.remove();
    });
  }
  var NOT_A_JUMP = '.accordion, .accordion *, [role="tab"], [aria-controls], [data-toggle], [data-bs-toggle], [data-globalmodal], [data-disclaimer-trigger]';
  function targetHeading(document, target) {
    const isHeading = (el) => el.matches(HEADINGS_SEL) && el.textContent.trim() && !el.matches(".eyebrow-label, .color-eyebrow") && !el.closest("header, footer, nav");
    if (isHeading(target)) return target;
    const inside = safeQueryAll(target, HEADINGS_SEL).find(isHeading);
    if (inside) return inside;
    const walker = document.createTreeWalker(document.body, 1);
    walker.currentNode = target;
    let node = walker.nextNode();
    while (node) {
      if (isHeading(node) && !target.contains(node)) return node;
      node = walker.nextNode();
    }
    return null;
  }
  function resolveJumpLinks(document) {
    safeQueryAll(document.body || document, 'a[data-cta-link^="#"], button[data-cta-link^="#"], a[href^="#"]').forEach((el) => {
      if (!el.isConnected || el.closest("header, footer, nav") || el.matches(NOT_A_JUMP)) return;
      const raw = (el.getAttribute("data-cta-link") || el.getAttribute("href") || "").trim();
      let id = raw.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch (e) {
      }
      if (!id) return;
      const target = document.getElementById(id);
      if (!target || target === el || target.matches('.accordion__content, [role="tabpanel"]')) return;
      const heading3 = targetHeading(document, target);
      let slug = "";
      if (heading3) {
        const clone = heading3.cloneNode(true);
        clone.querySelectorAll(".reader, .sr-only, .visually-hidden, sup").forEach((n) => n.remove());
        slug = headingSlug(clone);
      }
      if (!slug) return;
      if (el.tagName === "A") {
        el.setAttribute("href", `#${slug}`);
      } else {
        const a = document.createElement("a");
        [...el.attributes].forEach((at) => {
          if (!/^(type|role|onclick)$/i.test(at.name)) a.setAttribute(at.name, at.value);
        });
        a.setAttribute("href", `#${slug}`);
        a.append(...el.childNodes);
        el.replaceWith(a);
      }
    });
  }
  function eyebrowHeadingsToParagraphs(root, document) {
    const h1s = safeQueryAll(root, "h1").filter((h) => h.textContent.trim());
    safeQueryAll(root, "h1.eyebrow-label, h2.eyebrow-label, h3.eyebrow-label, h4.eyebrow-label, h5.eyebrow-label, h6.eyebrow-label, h1.color-eyebrow, h2.color-eyebrow, h3.color-eyebrow, h4.color-eyebrow, h5.color-eyebrow, h6.color-eyebrow").forEach((h) => {
      if (h.closest("table") || !h.textContent.trim()) return;
      if (h.tagName === "H1" && h1s.length === 1) {
        h.textContent = h.textContent.replace(/\s+/g, " ").trim();
        return;
      }
      const p2 = document.createElement("p");
      p2.textContent = h.textContent.replace(/\s+/g, " ").trim();
      h.replaceWith(p2);
    });
  }
  function ctaUnit(a) {
    const parent = a.parentElement;
    if (parent && /^(STRONG|B|EM|I)$/.test(parent.tagName) && normText(parent.textContent) === normText(a.textContent)) return parent;
    return a;
  }
  function isolateCtas(root, document) {
    const ctas = safeQueryAll(root, `${BUTTON_SEL}, .btn-container a[href]`).filter((a) => a.tagName === "A" && !a.closest("table, header, footer, nav, h1, h2, h3, h4, h5, h6") && !(a.closest("li") && !a.closest("li").matches("ul.column-container > li")) && !a.matches(NOT_A_CTA) && normText(a.textContent) && !a.querySelector("img, picture"));
    const units = [...new Set(ctas.map(ctaUnit))];
    const unitSet = new Set(units);
    const paras = [...new Set(units.map((u) => u.parentElement).filter((p2) => p2 && p2.tagName === "P"))];
    paras.forEach((p2) => {
      const kids = [...p2.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
      const own = kids.filter((n) => unitSet.has(n));
      if (own.length < 2 || own.length !== kids.filter((n) => !(n.nodeType === 1 && n.tagName === "BR")).length) return;
      own.forEach((u) => {
        const np = document.createElement("p");
        np.append(u);
        p2.before(np);
      });
      p2.remove();
    });
    units.forEach((u) => {
      if (!u.isConnected || u.closest("p")) return;
      const parent = u.parentElement;
      if (!parent) return;
      const textAround = [...parent.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (textAround) return;
      const p2 = document.createElement("p");
      u.before(p2);
      p2.append(u);
    });
  }
  function inlineFootnoteMarkers(root) {
    safeQueryAll(root, "sup").forEach((sup) => {
      if (sup.closest("p, h1, h2, h3, h4, h5, h6")) return;
      let prev = sup.previousSibling;
      while (prev && prev.nodeType === 3 && !prev.textContent.trim()) prev = prev.previousSibling;
      if (!prev || prev.nodeType !== 1) return;
      let host = null;
      if (prev.matches("p, h1, h2, h3, h4, h5, h6")) host = prev;
      else if (prev.matches("div")) host = [...prev.querySelectorAll("p")].pop() || null;
      if (!host) return;
      host.append(sup);
    });
    const BLOCK_CHILD = "p, div, ul, ol, table, h1, h2, h3, h4, h5, h6, blockquote, figure, picture, img";
    safeQueryAll(root, "li").forEach((li) => {
      if (![...li.children].some((c) => c.tagName === "SUP")) return;
      if ([...li.children].some((c) => c.matches(BLOCK_CHILD))) return;
      const p2 = li.ownerDocument.createElement("p");
      p2.append(...li.childNodes);
      li.append(p2);
    });
    safeQueryAll(root, "sup button").forEach((b) => b.replaceWith(b.ownerDocument.createTextNode(b.textContent.replace(/\s+/g, " ").trim())));
  }
  var EXPAT_ARTICLE_TEMPLATES = ["resource-article", "resource-article-steps", "resource-article-steps-alt", "resource-guide-article"];
  function captureCountryLists(document) {
    const results = document.querySelector(".ac-filtering-results");
    if (!results) return;
    const script = [...document.querySelectorAll("script:not([src])")].find((s) => /var acA\s*=/.test(s.textContent));
    if (!script) return;
    const lists = [];
    const listRe = /var ac([A-Z])\s*=\s*\[([\s\S]*?)\];/g;
    let m = listRe.exec(script.textContent);
    while (m) {
      const items = [];
      const itemRe = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
      let it = itemRe.exec(m[2]);
      while (it) {
        items.push((it[1] !== void 0 ? it[1] : it[2]).replace(/\\(.)/g, "$1"));
        it = itemRe.exec(m[2]);
      }
      if (items.length) lists.push({ letter: m[1].toLowerCase(), items });
      m = listRe.exec(script.textContent);
    }
    if (!lists.length) return;
    results.replaceChildren(...lists.map(({ letter, items }) => {
      const div = document.createElement("div");
      div.className = `countries-list countries-list--${letter}`;
      items.forEach((html) => {
        const p2 = document.createElement("p");
        p2.innerHTML = html;
        div.append(p2);
      });
      return div;
    }));
  }
  function pageTemplate(document, payload) {
    const urls = getPageUrl(document, payload);
    let path = "";
    for (const u of urls) {
      try {
        path = new URL(u, "https://www.hrblock.com/").pathname;
        break;
      } catch (e) {
      }
    }
    if (!/^\/expat-tax-preparation\/resource-center(\/|$)/i.test(path)) return "";
    const tpl = payload && payload.template && payload.template.name;
    const isArticle = !!document.querySelector("section.ba-article, .article-sidebar") || EXPAT_ARTICLE_TEMPLATES.includes(tpl) && /\/resource-center\//i.test(path);
    return isArticle ? "expat-article" : "expat";
  }
  function removeSiteChrome(document) {
    const body = document.body;
    if (!body) return;
    removeAll(document, [
      "body > a:first-child",
      'body > a[aria-hidden="true"]',
      "body > a.skip-links",
      "a.skip-links"
    ]);
    removeAll(document, [
      "body > header.site-header",
      "header.site-header",
      "nav#main-nav",
      "footer.site-footer",
      "body > header.header",
      "body > footer.footer",
      "header.header:not(main *)",
      "footer.footer:not(main *)",
      "#ada-nav-skip",
      // scroll-revealed sticky header CTA (duplicate of the header button)
      ".sticky-header-btn",
      "#consent_blackbar",
      "#hrb_pixel_tracker_div",
      '[id^="batBeacon"]',
      "#kampyleButtonContainer",
      // Medallia (Kampyle) feedback survey frame injected outside main (/login/)
      'iframe[src*="kampyle.com"]',
      "body > iframe",
      'body > input[type="hidden"]',
      // body-level tracking pixels (simpli.fi, googleadservices, bing, ...)
      "body > img",
      // reCAPTCHA challenge frame appended to body (would import as a link); the
      // block has no reCAPTCHA, the in-form widget is skipped by contact-form
      'iframe[src*="google.com/recaptcha"]'
    ]);
    [...body.children].forEach((el) => {
      if (!el.matches("div, span, section, aside")) return;
      if (isEmptyWidget(el)) el.remove();
    });
  }
  function transform(hookName, element, payload) {
    const document = element && element.ownerDocument || payload && payload.document;
    if (!document) return;
    if (hookName === "preprocess") {
      const entries = findPageCleanup(document, payload);
      if (Array.isArray(entries)) {
        cleanupTargets(document, entries).forEach((el) => el.setAttribute(CLEANUP_ATTR, ""));
      }
      document.documentElement.setAttribute(CLEANUP_RESOLVED_ATTR, "true");
      protectSourceRules(document);
      captureCountryLists(document);
      captureLiveState(document);
      captureVideoEmbeds(document);
      resolveJumpLinks(document);
      safeQueryAll(document.body || document, "span").forEach((span) => {
        if (span.attributes.length || span.textContent.trim()) return;
        const kids = [...span.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
        if (kids.length && kids.every((n) => n.nodeType === 1 && /^(br|svg)$/i.test(n.tagName))) span.replaceWith(...kids);
      });
      return;
    }
    if (hookName === "beforeTransform") {
      const tplName = pageTemplate(document, payload);
      if (tplName && payload && payload.params) {
        payload.params.excatMetadata = __spreadProps(__spreadValues({}, payload.params.excatMetadata || {}), { template: tplName });
      }
      dropInlineHidden(document);
      rescueLinkedModals(document);
      const entries = findPageCleanup(document, payload);
      if (Array.isArray(entries)) replayPageCleanup(document, entries);
      pruneDisclaimers(document);
      safeQueryAll(document, "table").forEach((t) => t.setAttribute(SOURCE_TABLE_ATTR, ""));
      removeAll(document, [
        ".showhide-table .hide-show-toggle",
        ".showhide-table .show-hide-toggle",
        // testimonial slider controls (dot pagination + prev/next) would become
        // an empty list in the default-content testimonial list
        "nav.pagination-nav:has(~ button.testimonial-btn)",
        "button.testimonial-btn",
        // star-rating icons (aria-hidden SVGs) of a testimonial card: an empty
        // five-item list once the SVGs are dropped
        "ul.testimonial-ratings",
        // /makeeveryblockbetter/ map: JS-filled state article box ("-- -- --"
        // placeholders until a state is picked)
        "#mebb-component-map--article",
        // international office pages: JS "See more / See less" toggles of the office services
        // list (hidden, no href) would become empty links in default content
        "a.opp-services-seemore",
        "a.opp-services-seeless",
        // screen-reader label of a footnote marker ("*Go to disclaimer 35 for more details"):
        // parsers drop span.reader in blocks; in default content it showed in the heading text
        "button.js-disclaimer-link span.reader",
        "button.symbol-disclaimer span.reader"
      ]);
      restoreSourceRules(document);
      dropDesktopHidden(document);
      recordButtons(document);
      removeAll(document, ["span.hide[content]", '[itemprop="priceCurrency"].hide']);
      safeQueryAll(document, "span.font-bold, span.bold, span.font-weight-bold").forEach((span) => {
        if (span.closest("h1, h2, h3, h4, h5, h6, header, footer, nav")) return;
        if (!span.textContent.trim()) return;
        const strong = document.createElement("strong");
        strong.append(...span.childNodes);
        span.append(strong);
      });
      applyCatalogRulesOutsideMain(document);
      flattenAngularApp(document);
      removeSiteChrome(document);
      removeAll(element, [
        "script",
        "style",
        "noscript",
        "link",
        "template",
        'input[type="hidden"]'
      ]);
    }
    if (hookName === "afterTransform") {
      removeAll(element, [
        "script",
        "style",
        "noscript",
        "link",
        "iframe.hidden",
        'img[src*="bat.bing.com"]',
        'img[src*="doubleclick.net"]',
        'img[src*="facebook.com/tr"]',
        'img[src*="googleadservices.com"]',
        'img[src*="simpli.fi"]',
        // broken placeholders (e.g. <img src=""> icons in comparison tables)
        'img[src=""]',
        "img:not([src])"
      ]);
      safeQueryAll(element, 'img[src^="data:"]').forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.length > MAX_DATA_URI_LENGTH || !isImporterSafeSrc(src)) img.remove();
      });
      convertSourceTables(element, document);
      safeQueryAll(element, `hr:not([${SECTION_MARKER_ATTR}])`).forEach((hr) => {
        if (!hr.closest("table")) hr.remove();
      });
      safeQueryAll(element, `div.${HR_PLACEHOLDER}`).forEach((d) => d.remove());
      convertSvgBackgrounds(element, document);
      normalizeStrikethrough(element, document);
      safeQueryAll(element, 'button[class*="btn"]').forEach((b) => {
        if (!b.isConnected || b.closest("table, form, header, footer, nav") || b.matches(NOT_A_CTA)) return;
        const label = b.textContent.replace(/\s+/g, " ").trim();
        if (!label) return;
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = label;
        if (b.closest("p")) {
          b.replaceWith(a);
          return;
        }
        const p2 = document.createElement("p");
        p2.append(a);
        b.replaceWith(p2);
      });
      eyebrowHeadingsToParagraphs(element, document);
      inlineFootnoteMarkers(element);
      isolateCtas(element, document);
      applyButtonKinds(element, document);
      safeQueryAll(element, 'a[href^="javascript:" i]').forEach((a) => a.setAttribute("href", "#"));
      safeQueryAll(element, "ul.column-container").forEach((ul) => {
        if (!ul.isConnected || ul.closest("table")) return;
        const grid = document.createElement("div");
        [...ul.children].forEach((li) => {
          const cell = document.createElement("div");
          cell.append(...li.childNodes);
          grid.append(cell);
        });
        ul.replaceWith(grid);
      });
      safeQueryAll(element, "[data-track], [data-animation], [onclick], [data-analytics]").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-animation");
        el.removeAttribute("onclick");
        el.removeAttribute("data-analytics");
      });
    }
  }

  // tools/importer/transformers/hrblock-sections.js
  var MARKER = "data-excat-section-style";
  var FRAGMENT_ATTR = "data-excat-fragment-style";
  var NONE = "";
  var THEMES = [
    ["spruce-forest-theme", "forest"],
    ["green-dark-theme", "green"],
    ["spruce-eggshell-theme", "eggshell"],
    ["white-theme", NONE],
    ["black-theme", "black"],
    ["spruce-neon-theme", "neon"],
    ["expat-bg--grey", "light-grey"],
    ["gray-background", "light-grey"]
  ];
  var THEME_TAGS = "section, div.container, div.showhide-table";
  var CONTENT_SEL = "img, picture, video, iframe, table, form, svg, lottie-player, input, select, textarea, button";
  var LAYOUT_ATTR = "data-excat-layout";
  var PAD_STEPS = [0, 20, 40, 60, 80, 100, 120];
  var DEFAULT_PAD = { "": 60, eggshell: 100, forest: 80, neon: 0 };
  var DISCLAIMER_SEL = "div.global-disclaimer-container, section.page-disclaimer";
  var BLOCK_MATCH_ATTR = "data-excat-match";
  var TEXT_SEL = "h1, h2, h3, h4, h5, h6, p, li";
  var MULTI_COLUMN_SEL = ".two-column-control, li.col-2, li.col-3, li.col-4";
  var BREAK_GAP = 60;
  var CHAIN_SKIP = "script, style, link, noscript, template, input, meta";
  function quantize(px) {
    if (px === null || px === void 0 || Number.isNaN(px)) return null;
    return PAD_STEPS.reduce((best, s) => Math.abs(s - px) < Math.abs(best - px) ? s : best, PAD_STEPS[0]);
  }
  function padClass(el, side) {
    const m = el.className && typeof el.className === "string" ? el.className.match(new RegExp(`(?:^|\\s)padding-${side}-(\\d+)(?=\\s|$)`)) : null;
    return m ? parseInt(m[1], 10) : null;
  }
  function wrapperChain(el) {
    const chain = [el];
    let cur = el;
    for (let i = 0; i < 6; i += 1) {
      const kids = [...cur.children].filter((c) => !c.matches(CHAIN_SKIP));
      if (kids.length !== 1) break;
      [cur] = kids;
      chain.push(cur);
    }
    return chain;
  }
  function isLive(document) {
    const view = document.defaultView;
    if (!view || typeof view.getComputedStyle !== "function" || !document.body) return false;
    try {
      return /graphik/i.test(view.getComputedStyle(document.body).fontFamily || "");
    } catch (e) {
      return false;
    }
  }
  function measureBand(el, view, live) {
    const chain = wrapperChain(el);
    let pt = null;
    let pb = null;
    if (live) {
      pt = 0;
      pb = 0;
      chain.forEach((c) => {
        const cs = view.getComputedStyle(c);
        pt += parseFloat(cs.paddingTop) || 0;
        pb += parseFloat(cs.paddingBottom) || 0;
      });
    } else {
      const tops = chain.map((c) => padClass(c, "top")).filter((v) => v !== null);
      const bottoms = chain.map((c) => padClass(c, "bottom")).filter((v) => v !== null);
      if (tops.length || bottoms.length) {
        pt = tops.reduce((a, b) => a + b, 0);
        pb = bottoms.reduce((a, b) => a + b, 0);
      }
    }
    const texts = safeAll(el, TEXT_SEL).filter((t) => t.textContent.trim() && !t.closest(`[${BLOCK_MATCH_ATTR}], header, footer, nav`)).slice(0, 40);
    const first = texts.find((t) => /^H[1-6]$/.test(t.tagName)) || texts[0];
    let align = "";
    if (first) {
      if (live) {
        const ta = view.getComputedStyle(first).textAlign;
        if (ta === "center") align = "c";
        else if (/^(left|start|justify)$/.test(ta)) align = "l";
      } else {
        const holder = first.closest(".text-center, .text-left");
        if (holder && el.contains(holder)) align = holder.classList.contains("text-center") ? "c" : "l";
      }
    }
    let width = "";
    if (!el.matches(MULTI_COLUMN_SEL) && !el.querySelector(MULTI_COLUMN_SEL)) {
      if (live) {
        const widths = texts.filter((t) => t.parentElement && view.getComputedStyle(t.parentElement).display === "block").map((t) => t.getBoundingClientRect().width).filter((w) => w > 0);
        if (widths.length) width = Math.round(Math.max(...widths));
      } else if (chain.some((c) => c.classList && c.classList.contains("container-width-1000"))) {
        width = 860;
      }
    }
    let h2 = "";
    const firstH2 = texts.find((t) => t.tagName === "H2" && !t.matches(".eyebrow-label, .color-eyebrow"));
    if (firstH2) {
      if (live) {
        h2 = Math.round(parseFloat(view.getComputedStyle(firstH2).fontSize) || 0) || "";
      } else {
        const sizes = [["text-jumbo", 56], ["text-large", 40], ["text-medium", 32], ["text-small", 24]];
        const hit = sizes.find(([cls]) => firstH2.classList.contains(cls));
        h2 = hit ? hit[1] : "";
      }
    }
    let hw = "";
    let pw = "";
    if (live && align === "c") {
      const blockBox = (t) => t.parentElement && view.getComputedStyle(t).display === "block";
      if (first && /^H[1-6]$/.test(first.tagName) && blockBox(first)) hw = Math.round(first.getBoundingClientRect().width) || "";
      const para15 = texts.find((t) => t.tagName === "P" && blockBox(t) && t.textContent.trim().length > 120);
      if (para15) pw = Math.round(para15.getBoundingClientRect().width) || "";
    }
    return [pt === null ? "" : Math.round(pt), pb === null ? "" : Math.round(pb), align, width, h2, hw, pw, linkStyle(el, view, live)].join("|");
  }
  var UNDERLINE_LINK_SEL = ".text-underline.color-dark-green";
  function linkStyle(el, view, live) {
    const links = safeAll(el, "p a[href], li a[href]").filter((a) => a.textContent.trim() && !a.closest(`[${BLOCK_MATCH_ATTR}], header, footer, nav`) && !/\bbtn\b/.test(a.className || ""));
    if (!links.length) return "";
    const underlined = links.filter((a) => {
      const marked = a.matches(UNDERLINE_LINK_SEL) ? a : a.querySelector(UNDERLINE_LINK_SEL);
      if (!marked) return false;
      if (!live) return true;
      const cs = view.getComputedStyle(marked);
      return /underline/.test(cs.textDecorationLine || "") && cs.color === "rgb(0, 93, 31)";
    });
    return underlined.length * 2 >= links.length ? "u" : "";
  }
  function readLayout(el) {
    const raw = el && el.getAttribute && el.getAttribute(LAYOUT_ATTR);
    if (!raw) return null;
    const [pt, pb, align, width, h2, hw, pw, links] = raw.split("|");
    const num = (v) => v === "" || v === void 0 ? null : parseFloat(v);
    return {
      pt: num(pt),
      pb: num(pb),
      align: align || "",
      width: num(width),
      h2: num(h2),
      hw: num(hw),
      pw: num(pw),
      links: links || ""
    };
  }
  var HEADING_STEPS = [520, 640, 760, 860, 900, 1e3];
  var TEXT_STEPS = [520, 600, 700, 800, 960];
  function measureToken(prefix, px, steps, def) {
    if (!px || px < 300) return "";
    const step = steps.find((s) => s >= px - 2) || steps[steps.length - 1];
    return step === def ? "" : `${prefix}-${step}`;
  }
  function h2Token(size, centered) {
    if (!size) return "";
    let scale = "medium";
    if (size >= 48) scale = "large";
    else if (size <= 30) scale = "small";
    const def = centered ? "large" : "medium";
    return scale === def ? "" : `h2-${scale}`;
  }
  function widthToken(width) {
    if (!width || width < 300) return "";
    if (width <= 820) return "narrow";
    if (width <= 1e3) return "medium";
    return "";
  }
  function styleOf(g) {
    const tokens = [g.colour || NONE];
    if (g.disclaimer) tokens.push("disclaimer");
    if (g.align === "c" && !g.disclaimer) {
      tokens.push("center");
      tokens.push(measureToken("heading", g.hw, HEADING_STEPS, 860));
      tokens.push(measureToken("text", g.pw, TEXT_STEPS, 700));
    } else if (g.width && !g.disclaimer) tokens.push(g.width);
    if (!g.disclaimer) tokens.push(h2Token(g.h2, g.align === "c"));
    if (g.links === "u") tokens.push("links-underline");
    const def = Object.prototype.hasOwnProperty.call(DEFAULT_PAD, g.colour || NONE) ? DEFAULT_PAD[g.colour || NONE] : DEFAULT_PAD[NONE];
    const pt = quantize(g.pt);
    const pb = quantize(g.pb);
    if (pt !== null && pt !== def) tokens.push(`pad-top-${pt}`);
    if (pb !== null && pb !== def) tokens.push(`pad-bottom-${pb}`);
    return tokens.filter(Boolean).join(", ");
  }
  function bandStyle(el, colour) {
    if (!el) return colour || NONE;
    let parts = el.hasAttribute && el.hasAttribute(LAYOUT_ATTR) ? [el] : [];
    if (!parts.length) {
      const all = safeAll(el, `[${LAYOUT_ATTR}]`);
      parts = all.filter((x) => !all.some((o) => o !== x && o.contains(x)));
    }
    const layouts = parts.map(readLayout).filter(Boolean);
    if (!layouts.length) return colour || NONE;
    const first = layouts[0];
    const last = layouts[layouts.length - 1];
    return styleOf({
      colour: colour || NONE,
      disclaimer: !!(el.matches && el.matches(DISCLAIMER_SEL)),
      align: (layouts.find((l) => l.align) || {}).align || "",
      width: widthToken(first.width),
      h2: (layouts.find((l) => l.h2) || {}).h2 || null,
      hw: (layouts.find((l) => l.hw) || {}).hw || null,
      pw: (layouts.find((l) => l.pw) || {}).pw || null,
      links: (layouts.find((l) => l.links) || {}).links || "",
      pt: first.pt,
      pb: last.pb
    });
  }
  var LAYOUT_ATTRIBUTE = LAYOUT_ATTR;
  function findSourceBands(document) {
    const all = safeAll(document.body, `section, ${DISCLAIMER_SEL}`).filter((el) => !el.closest("header, footer, nav"));
    const set = new Set(all);
    return all.filter((el) => {
      if (el.matches(DISCLAIMER_SEL)) {
        for (let p2 = el.parentElement; p2; p2 = p2.parentElement) if (p2.matches(DISCLAIMER_SEL)) return false;
        return hasContent3(el);
      }
      for (let p2 = el.parentElement; p2; p2 = p2.parentElement) {
        if (set.has(p2) && p2.tagName === "SECTION") return false;
      }
      return hasContent3(el);
    });
  }
  var COLUMN_THEMES = { "rgb(246, 244, 233)": "spruce-eggshell-theme", "rgb(0, 53, 18)": "spruce-forest-theme", "rgb(0, 93, 31)": "green-dark-theme" };
  function themeColumnBands(document, view) {
    safeAll(document.body, "section.content-two-column").forEach((sec) => {
      if (themeStyle(sec) !== void 0 || view.getComputedStyle(sec).backgroundColor !== "rgba(0, 0, 0, 0)") return;
      const secW = sec.getBoundingClientRect().width;
      if (!secW) return;
      const painted = safeAll(sec, "div, li").filter((c) => {
        const r = c.getBoundingClientRect();
        return r.width >= secW * 0.4 && r.height > 100 && view.getComputedStyle(c).backgroundColor !== "rgba(0, 0, 0, 0)";
      });
      const outer = painted.filter((c) => !painted.some((o) => o !== c && o.contains(c)));
      const colours = new Set(outer.map((c) => view.getComputedStyle(c).backgroundColor));
      const covered = outer.reduce((w, c) => w + c.getBoundingClientRect().width, 0);
      if (colours.size === 1 && covered >= secW * 0.95) {
        const cls = COLUMN_THEMES[[...colours][0]];
        if (cls) sec.classList.add(cls);
      }
    });
  }
  function annotateLayout(document, sections) {
    const view = document.defaultView;
    const live = isLive(document);
    if (live) {
      try {
        themeColumnBands(document, view);
      } catch (e) {
      }
    }
    const themeRoots = findThemeRoots(document);
    const cands = /* @__PURE__ */ new Set([...themeRoots, ...findSourceBands(document)]);
    themeRoots.forEach((r) => {
      if (r.parentElement) [...r.parentElement.children].forEach((c) => cands.add(c));
    });
    sectionEntryMatches(document, sections).forEach(({ el }) => cands.add(el));
    cands.forEach((el) => {
      if (!el.isConnected || el.matches("script, style, link, noscript, template, hr")) return;
      try {
        el.setAttribute(LAYOUT_ATTR, measureBand(el, view, live));
      } catch (e) {
      }
    });
  }
  function themeStyle(el) {
    if (!el || !el.classList) return void 0;
    for (const [cls, style] of THEMES) {
      if (el.classList.contains(cls)) return style;
    }
    return void 0;
  }
  function hasContent3(el) {
    if (!el) return false;
    if (el.textContent && el.textContent.replace(/\s+/g, "").length) return true;
    return !!(el.matches && el.matches(CONTENT_SEL)) || !!(el.querySelector && el.querySelector(CONTENT_SEL));
  }
  function safeAll(root, selector) {
    try {
      return [...root.querySelectorAll(selector)];
    } catch (e) {
      return [];
    }
  }
  function isBefore(a, b) {
    return !!(a.compareDocumentPosition(b) & 4);
  }
  function sortByDocument(list, key = (x) => x.el) {
    return list.sort((x, y) => {
      const a = key(x);
      const b = key(y);
      if (a === b) return 0;
      if (a.contains(b)) return -1;
      if (b.contains(a)) return 1;
      return isBefore(a, b) ? -1 : 1;
    });
  }
  function findThemeRoots(document) {
    const scope = document.body;
    const candidates = safeAll(scope, THEME_TAGS).filter((el) => themeStyle(el) !== void 0);
    const set = new Set(candidates);
    return candidates.filter((el) => {
      for (let p2 = el.parentElement; p2; p2 = p2.parentElement) {
        if (set.has(p2)) return false;
        if (themeStyle(p2) !== void 0 && p2.matches(THEME_TAGS)) return false;
      }
      if (el.closest("header, footer, nav, table")) return false;
      return hasContent3(el);
    });
  }
  function sectionEntryMatches(document, sections) {
    const out = [];
    sections.forEach((section, index) => {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector].filter(Boolean);
      const found = [];
      selectors.forEach((selector) => safeAll(document, selector).forEach((el) => {
        if (!found.includes(el)) found.push(el);
      }));
      found.filter((el) => !found.some((o) => o !== el && o.contains(el))).forEach((el) => out.push({ el, style: section.style || NONE, index }));
    });
    return out;
  }
  function breakPoint(el, blockEls, isThemed) {
    let target = el;
    const block = blockEls.filter((b) => b !== el && b.contains(el)).sort((a, b) => a.contains(b) ? -1 : 1)[0];
    if (block) {
      if (!isThemed) return null;
      target = block;
    }
    let lifted = target;
    for (let p2 = target.parentElement; p2; p2 = p2.parentElement) {
      if (p2.matches("ul, ol, table, dl")) lifted = p2;
    }
    return lifted;
  }
  function collectBoundaries(document, sections, blockEls) {
    const themeRoots = findThemeRoots(document);
    const rootSet = new Set(themeRoots);
    const containsRoot = (el) => themeRoots.some((r) => r !== el && el.contains(r));
    const entries = sectionEntryMatches(document, sections);
    const entryStyle = /* @__PURE__ */ new Map();
    entries.forEach(({ el, style }) => {
      if (!entryStyle.has(el)) entryStyle.set(el, style);
    });
    const raw = [];
    themeRoots.forEach((el) => raw.push({ el, style: themeStyle(el), themed: true }));
    const containers = new Set(themeRoots.map((r) => r.parentElement).filter(Boolean));
    containers.forEach((container) => {
      [...container.children].forEach((band) => {
        if (rootSet.has(band) || containsRoot(band)) return;
        if (band.matches("script, style, link, noscript, template, hr")) return;
        if (!hasContent3(band)) return;
        const style = entryStyle.has(band) ? entryStyle.get(band) : NONE;
        raw.push({ el: band, style, themed: style !== NONE });
      });
    });
    entries.forEach(({ el, style }) => {
      if (rootSet.has(el) || containsRoot(el)) return;
      if (!hasContent3(el)) return;
      const enclosing = themeRoots.find((r) => r.contains(el));
      const s = style || (enclosing ? themeStyle(enclosing) : NONE);
      raw.push({ el, style: s, themed: s !== NONE });
    });
    safeAll(document, `[${FRAGMENT_ATTR}]`).forEach((el) => {
      const style = el.getAttribute(FRAGMENT_ATTR) || NONE;
      const enclosing = themeRoots.find((r) => r.contains(el));
      const forced = style !== NONE;
      raw.push({ el, style, themed: true, forced, fragment: forced, resume: enclosing ? themeStyle(enclosing) : NONE });
    });
    findSourceBands(document).forEach((el) => {
      if (rootSet.has(el) || containsRoot(el)) return;
      const enclosing = themeRoots.find((r) => r.contains(el));
      let style = themeStyle(el);
      if (style === void 0) style = entryStyle.has(el) ? entryStyle.get(el) : void 0;
      if (style === void 0 || style === null) style = enclosing ? themeStyle(enclosing) : NONE;
      raw.push({ el, style, themed: style !== NONE, band: true });
    });
    const byPoint = /* @__PURE__ */ new Map();
    raw.forEach((b) => {
      const point = b.fragment ? b.el : breakPoint(b.el, blockEls, b.themed || b.style !== NONE);
      if (!point || !point.parentNode) return;
      const prev = byPoint.get(point);
      if (!prev || b.fragment && !prev.fragment || rootSet.has(b.el) && !prev.fragment && !rootSet.has(prev.el)) {
        byPoint.set(point, __spreadProps(__spreadValues({}, b), { point }));
      }
    });
    return sortByDocument([...byPoint.values()], (b) => b.point);
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    const document = element && element.ownerDocument || payload && payload.document;
    if (!document) return;
    if (hookName === "preprocess") {
      try {
        annotateLayout(document, sections);
      } catch (e) {
      }
      return;
    }
    if (hookName === "beforeTransform") {
      const blockEls = (payload && payload.pageBlocks || []).map((b) => b.element).filter(Boolean);
      const boundaries = collectBoundaries(document, sections, blockEls);
      const groups = [];
      let cur = null;
      const open = (b, extra = {}) => {
        const layout = extra.noLayout ? null : readLayout(b.el);
        const g = {
          point: b.point,
          el: b.el,
          colour: extra.colour !== void 0 ? extra.colour : b.style,
          after: !!extra.after,
          forced: !!extra.forced,
          disclaimer: !extra.noLayout && !!(b.el.matches && b.el.matches(DISCLAIMER_SEL)),
          pt: layout ? layout.pt : null,
          pb: layout ? layout.pb : null,
          align: layout ? layout.align : "",
          width: layout ? widthToken(layout.width) : "",
          h2: layout ? layout.h2 : null,
          hw: layout ? layout.hw : null,
          pw: layout ? layout.pw : null,
          links: layout ? layout.links : "",
          hasLayout: !!layout,
          breakReason: !!extra.breakReason
        };
        groups.push(g);
        return g;
      };
      const shouldBreak = (g, b) => {
        const layout = readLayout(b.el);
        const disclaimer = !!(b.el.matches && b.el.matches(DISCLAIMER_SEL));
        if (disclaimer !== g.disclaimer) return true;
        if (!layout || !g.hasLayout) return false;
        if (g.el && g.el !== b.el && g.el.contains(b.el)) return false;
        const gap = (g.pb || 0) + (layout.pt || 0);
        if ((g.pb !== null || layout.pt !== null) && gap >= BREAK_GAP) return true;
        if (g.align && layout.align && g.align !== layout.align) return true;
        const w = widthToken(layout.width);
        if (g.align && layout.align && g.align !== "c" && layout.align !== "c" && g.width !== w) return true;
        return false;
      };
      boundaries.forEach((b) => {
        if (b.forced) {
          open(b, { forced: true });
          cur = open(b, { colour: b.resume, after: true, noLayout: true, forced: true });
          return;
        }
        if (cur && b.style === cur.colour) {
          if (!shouldBreak(cur, b)) {
            const layout = readLayout(b.el);
            if (layout && !(cur.el && cur.el.contains(b.el))) {
              if (layout.pb !== null) cur.pb = layout.pb;
              if (!cur.align) cur.align = layout.align;
              if (!cur.width) cur.width = widthToken(layout.width);
              if (!cur.h2) cur.h2 = layout.h2;
              if (!cur.hw) cur.hw = layout.hw;
              if (!cur.pw) cur.pw = layout.pw;
              if (!cur.links) cur.links = layout.links;
              cur.hasLayout = true;
            }
            return;
          }
          cur = open(b, { breakReason: true });
          return;
        }
        if (!cur && b.style === NONE) {
          cur = open(b);
          return;
        }
        cur = open(b, { breakReason: true });
      });
      const emit = [];
      let current = NONE;
      groups.forEach((g, i) => {
        const style = styleOf(g);
        if (!g.forced && style === current && !(g.breakReason && i > 0)) return;
        emit.push({ point: g.point, style, after: g.after });
        current = style;
      });
      emit.forEach(({ point, style, after }) => {
        if (!point.parentNode) return;
        const hr = document.createElement("hr");
        hr.setAttribute(MARKER, style || NONE);
        point.parentNode.insertBefore(hr, after ? point.nextSibling : point);
      });
    }
    if (hookName === "afterTransform") {
      safeAll(document, `[${LAYOUT_ATTR}]`).forEach((el) => el.removeAttribute(LAYOUT_ATTR));
      const markers = new Set(safeAll(document, `hr[${MARKER}]`));
      if (!markers.size) return;
      const walker = document.createTreeWalker(document.body, 1 | 4);
      let prevMarker = null;
      let contentSince = false;
      let seenContent = false;
      const drop = /* @__PURE__ */ new Set();
      const leading = /* @__PURE__ */ new Set();
      let node = walker.nextNode();
      while (node) {
        if (node.nodeType === 1 && node.tagName === "HR") {
          if (markers.has(node)) {
            if (!contentSince && prevMarker) drop.add(prevMarker);
            if (!seenContent) leading.add(node);
            prevMarker = node;
            contentSince = false;
          } else {
            contentSince = true;
          }
        } else if (node.nodeType === 3 && node.textContent.trim() || node.nodeType === 1 && node.matches(CONTENT_SEL)) {
          contentSince = true;
          seenContent = true;
        }
        node = walker.nextNode();
      }
      if (prevMarker && !contentSince) drop.add(prevMarker);
      drop.forEach((hr) => {
        markers.delete(hr);
        leading.delete(hr);
        hr.remove();
      });
      markers.forEach((hr) => {
        const style = hr.getAttribute(MARKER);
        if (style && hr.parentNode) {
          const metadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style }
          });
          hr.parentNode.insertBefore(metadata, hr.nextSibling);
        }
        hr.removeAttribute(MARKER);
        if (leading.has(hr)) hr.remove();
      });
    }
  }

  // tools/importer/transformers/hrblock-fragments.js
  var FRAGMENTS = [
    {
      "block": "hero-split",
      "path": "/fragments/software-back-editions-hero",
      "pages": [
        "https://www.hrblock.com/tax-software/updates-back-editions/",
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/"
      ],
      "selector": "main > div.root > div.cmp-container > div.cmp-container > section.column-control.two-column-control:first-of-type",
      "variantId": "v_d9f1559ec23d"
    },
    {
      "block": "columns-banner",
      "path": "/fragments/expat-tax-help-cta",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/all-topics/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/page/3/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/page/3/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/page/2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/search/"
      ],
      "selector": "#site-content > section.ba-cta",
      "variantId": "v_21d4b91fbd3d"
    },
    {
      "block": "columns-banner",
      "path": "/fragments/expat-steps-to-prep",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/"
      ],
      "selector": "#site-content > section.steps-to-prep > div.stp-steps",
      "variantId": "v_fa7ac5da97e7"
    },
    {
      "block": "columns-banner",
      "path": "/fragments/software-updates-banner",
      "pages": [
        "https://www.hrblock.com/tax-software/updates-back-editions/",
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/"
      ],
      "selector": "main div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control:has(ul.sm-md-column-reverse)",
      "variantId": "v_0e77d41ea13d"
    },
    {
      "block": "carousel-testimonial",
      "path": "/fragments/expat-testimonials",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/international-retirement-plan-myths/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/"
      ],
      "selector": "#site-content > section.full-width.gray-background",
      "variantId": "v_72964d82c31a"
    },
    {
      "block": "cards-feature",
      "path": "/fragments/software-guarantees",
      "pages": [
        "https://www.hrblock.com/tax-software/updates-back-editions/",
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/whyrequired/"
      ],
      "selector": "main div.cmp-container > section.column-control:has(li.col-3 article.card-stacked)",
      "variantId": "v_2682772f3903"
    },
    {
      "block": "promo-strip",
      "path": "/fragments/software-update-promo",
      "pages": [
        "https://www.hrblock.com/tax-software/updates-back-editions/",
        "https://www.hrblock.com/taxes/products/software/updates/17buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/17mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/17macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/17windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/18mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/18macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/18windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19buswin-instruct/",
        "https://www.hrblock.com/taxes/products/software/updates/19mac-state/",
        "https://www.hrblock.com/taxes/products/software/updates/19macintosh-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-federal/",
        "https://www.hrblock.com/taxes/products/software/updates/19windows-state/",
        "https://www.hrblock.com/taxes/products/software/updates/20buswin-instruct/"
      ],
      "selector": "main div.cmp-container > div.xf-content-height:has(.alignBanner)",
      "variantId": "v_9bb910e3643f"
    },
    {
      "block": "cards-icon",
      "path": "/fragments/guarantees-cards",
      "pages": [
        "https://www.hrblock.com/corporate/",
        "https://www.hrblock.com/support/",
        "https://www.hrblock.com/support/contact-options/",
        "https://www.hrblock.com/tax-offices/make-appointment/",
        "https://www.hrblock.com/tax-offices/our-tax-pros/",
        "https://www.hrblock.com/tax-offices/tax-prep/extended-service/",
        "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/",
        "https://www.hrblock.com/no-surprise-guarantee/"
      ],
      "selector": "main div.xf-content-height:has(.testimonial-card) div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)",
      "variantId": "v_3bdad2f1bab2"
    },
    {
      "block": "columns-stats",
      "path": "/fragments/office-stats-banner",
      "pages": [
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/",
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/",
        "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/",
        "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/",
        "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/",
        "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/",
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/",
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/",
        "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/",
        "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/",
        "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/",
        "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/",
        "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/",
        "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/",
        "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/",
        "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/",
        "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/",
        "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/",
        "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/",
        "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/",
        "https://www.hrblock.com/international-tax-offices/panama/panama/63312/",
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/",
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/",
        "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/"
      ],
      "selector": "main div.xf-content-height div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .card-secondary.featurecard):has(> div.container > ul > li.col-2 .introImageVariant)",
      "variantId": "v_cf1ee5bfe8db"
    },
    {
      "block": "cards-feature",
      "path": "/fragments/office-more-help-cards",
      "pages": [
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/",
        "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/",
        "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/",
        "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/",
        "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/",
        "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/",
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/",
        "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/",
        "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/",
        "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/",
        "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/",
        "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/",
        "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/",
        "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/",
        "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/",
        "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/",
        "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/",
        "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/",
        "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/",
        "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/",
        "https://www.hrblock.com/international-tax-offices/panama/panama/63312/",
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/",
        "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/",
        "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/"
      ],
      "selector": "main div.cmp-container > section.column-control.spruce-eggshell-theme.two-column-control:has(li.col-2 .card-inset)",
      "variantId": "v_2682772f3903"
    },
    {
      "block": "cards-icon",
      "path": "/fragments/guarantees-cards-forest",
      "pages": [
        "https://www.hrblock.com/dsar/",
        "https://www.hrblock.com/filing-options-and-products/",
        "https://www.hrblock.com/tax-offices/drop-off/",
        "https://www.hrblock.com/tax-offices/office-tax-preparation/",
        "https://www.hrblock.com/tax-offices/virtual-tax-preparation/",
        "https://www.hrblock.com/tax-offices/peace-of-mind-claims/",
        "https://www.hrblock.com/tax-prep-checklist/"
      ],
      "selector": "main div.xf-content-height:has(.testimonial-card) div.cmp-container > section.column-control.spruce-forest-theme:not(.two-column-control):has(> div.container > ul > li.col-1 section.column-control li.col-3 .introImageVariant .icon-svg)",
      "variantId": "v_ffbd17ad1926"
    },
    {
      "block": "cards-article",
      "path": "/fragments/expat-country-grid",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/3/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/page/4/"
      ],
      "selector": "#site-content section.expat-hp-countries div.expat-hp-countries--grid",
      "variantId": "v_b183ecee1a7b"
    },
    {
      "block": "columns-banner",
      "path": "/fragments/expat-ways-to-file",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/the-u-s-canada-tax-treaty-explained/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-canada-dual-citizenship-taxes-5-things-you-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/u-s-tax-guide-for-americans-living-in-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/netherlands/us-expat-taxes-netherlands/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/u-s-expat-taxes-in-the-uae/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/file-fbar-uk/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/the-u-k-u-s-tax-treaty-explained/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/deadlines-and-extensions/tax-deadlines-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-an-fbar/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-to-file-fbar/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/expat-tax-rules-for-u-s-citizens-working-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-pay-file-taxes-as-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/married-to-a-nonresident-alien-spouse-these-are-your-u-s-tax-filing-options/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/the-u-s-expats-guide-to-state-taxes-while-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/us-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/how-to-avoid-u-s-tax-penalties-while-living-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fbar/the-fbar-when-and-how-to-report-money-in-foreign-bank-accounts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fincen-form-114-report-of-foreign-bank-accounts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-2555-how-to-exclude-foreign-income-on-your-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-reporting-foreign-trusts-inheritances-and-gifts-for-americans-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5472/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-926-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-publication-54/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-i-pay-foreign-income-tax-if-im-a-u-s-citizen-working-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/foreign-earned-income-exclusion-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/foreign-trusts/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/investments/pfics-foreign-mutual-fund-reporting-requirements-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/foreign-housing-exclusion-and-deduction/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/can-i-transfer-my-401k-to-an-international-retirement-plan-if-i-move-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/retiring-abroad-heres-how-u-s-taxes-work-in-an-expat-retirement/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-foreign-earned-income-exclusion-2020-qualification-changes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/coronavirus-u-s-expat-taxes-in-2020-2021/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/what-is-fatca/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/u-s-expats-coronavirus-stimulus-checks-top-faqs-for-americans-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-u-s-expat-taxes-in-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/mexico/guide-to-u-s-expat-taxes-in-mexico/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/new-zealand/guide-to-u-s-expat-taxes-in-new-zealand/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/switzerland/u-s-expat-taxes-in-switzerland/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/guide-to-filing-an-fbar-from-the-u-k/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-s-expat-taxes-in-the-united-kingdom/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/20-things-americans-overseas-should-know-about-taxes-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/can-back-taxes-cost-you-your-passport-in-some-cases-yes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1116-how-u-s-expats-claim-the-foreign-tax-credit/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/fbar-vs-fatca-filing-requirements-for-americans-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-td-f-90-22-1/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/am-i-more-likely-to-be-audited-as-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/im-an-expat-and-i-received-a-letter-from-the-irs-what-should-i-do/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-are-the-most-common-notices-that-expats-may-receive/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/post-filing/what-if-my-notice-arrives-late/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/tax-law-and-policy/tax-acts/offshore-voluntary-disclosure-program-ovdp/"
      ],
      "selector": "#site-content > section.container.ba-article div.wp-block-create-block-hrb-expat-ways-to-file",
      "variantId": "v_f021fe2b05b9",
      "all": true
    },
    {
      "block": "cards-article",
      "path": "/fragments/expat-recommended-feie",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/guide-to-filing-an-fbar-from-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/guide-to-filing-an-fbar-from-canada/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/should-i-renounce-my-u-s-citizenship/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-filing-an-fbar-from-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/guide-to-filing-an-fbar-from-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/participating-in-the-german-pension-system/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/germany/u-s-expat-taxes-in-germany/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/minimizing-your-u-s-tax-liability/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/hong-kong/u-s-expat-taxes-in-hong-kong/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/file-fbar-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/u-s-expat-taxes-in-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/philippines/u-s-expats-and-american-taxation-in-the-philippines/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/maximizing-your-u-s-tax-situation-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/singapore/u-s-expat-taxes-in-singapore/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-arab-emirates/what-your-uae-earnings-may-mean-for-your-u-s-expat-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/u-k-pensions-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/australia/file-fbar-australia/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/china/u-s-expat-taxes-in-china/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/france/guide-to-u-s-expat-taxes-in-france/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/japan/guide-to-filing-an-fbar-from-japan/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/united-kingdom/5-things-to-know-about-u-s-u-k-dual-citizenship-taxes/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/"
      ],
      "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
      "variantId": "v_7b405275c780"
    },
    {
      "block": "cards-article",
      "path": "/fragments/expat-recommended-state-taxes",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/controlled-foreign-corporations-cfcs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/foreign-partnership/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/business/i-am-an-owner-of-a-non-u-s-limited-company-what-do-i-need-to-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/can-i-claim-the-child-tax-credit-as-a-u-s-citizen-living-abroad/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/credits/foreign-tax-credit-limitations-rules-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/how-u-s-tax-treaties-help-taxpayers/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/live-abroad-save-money-on-u-s-taxes-with-these-6-tax-saving-strategies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/bona-fide-resident-and-the-bona-fide-residence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/covered-vs-non-covered-expatriates/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/digital-nomad-taxes-10-things-americans-abroad-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/dual-status-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/how-to-report-foreign-income-without-a-w-2/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/physical-presence-test/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/thinking-about-renouncing-your-u-s-citizenship-or-green-card-beware-of-the-exit-tax/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-nonresident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-a-resident-alien/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/status/what-is-an-expat/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/filing/tax-responsibilities-and-penalties/catching-up-what-you-need-to-know-about-streamlined-filing-compliance-procedures-and-delinquent-fbar-penalties/"
      ],
      "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
      "variantId": "v_7b405275c780"
    },
    {
      "block": "cards-article",
      "path": "/fragments/expat-recommended-forms",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/fatca-form/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-1120-f-for-foreign-corporations-doing-business-in-the-u-s/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-3520-a-a-guide-for-u-s-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-5471-basics-u-s-citizens-should-know/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-709-u-s-gift-tax-return-for-expats/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8833/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/form-8854/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/irs-form-8938-what-it-is-and-who-needs-to-file/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/tax-form-8865/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/u-s-tax-form-8621-for-shareholders-of-passive-foreign-investment-companies/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/forms/what-is-form-1040-nr/"
      ],
      "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
      "variantId": "v_7b405275c780"
    },
    {
      "block": "cards-article",
      "path": "/fragments/expat-recommended-income",
      "pages": [
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/foreign/do-expats-pay-u-s-social-security-or-self-employment-tax-on-foreign-earned-income/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/real-estate/reporting-foreign-rental-properties-to-the-irs/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/401k-ira-withdrawals-overseas/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/i-have-a-foreign-pension-plan-what-should-i-know-come-tax-season/",
        "https://www.hrblock.com/expat-tax-preparation/resource-center/income/retirement/what-are-the-rules-on-iras-for-u-s-citizens-living-abroad/"
      ],
      "selector": "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)",
      "variantId": "v_7b405275c780"
    },
    {
      "block": "carousel-testimonial",
      "path": "/fragments/testimonials-forest",
      "pages": [
        "https://www.hrblock.com/dsar/",
        "https://www.hrblock.com/filing-options-and-products/",
        "https://www.hrblock.com/corporate/our-company/",
        "https://www.hrblock.com/financial-services/tax-refund-payment/",
        "https://www.hrblock.com/tax-prep-checklist/"
      ],
      "selector": "main div.xf-content-height div.cmp-container > section.column-control.spruce-forest-theme:has(figure.testimonial-card)"
    }
  ];
  var FRAGMENT_ATTR2 = "data-excat-fragment-style";
  var THEME_TAGS2 = "section, div.container, div.showhide-table";
  function fragmentStyle(source, sections) {
    const own = themeStyle(source);
    if (own !== void 0) return own;
    for (const section of sections) {
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector].filter(Boolean);
      if (selectors.some((sel) => {
        try {
          return source.matches(sel);
        } catch (e) {
          return false;
        }
      })) {
        return section.style || "";
      }
    }
    for (let p2 = source.parentElement; p2; p2 = p2.parentElement) {
      const s = p2.matches(THEME_TAGS2) ? themeStyle(p2) : void 0;
      if (s !== void 0) return s;
    }
    const inner = [...source.querySelectorAll(THEME_TAGS2)].find((el) => themeStyle(el) !== void 0);
    return inner ? themeStyle(inner) : "";
  }
  function pageKey(u) {
    try {
      const { origin, pathname } = new URL(u);
      return `${origin}${pathname.replace(/\/$/, "")}`;
    } catch (e) {
      return u;
    }
  }
  function pageUrl(payload) {
    const { params = {} } = payload;
    return params.originalURL || payload.originalURL || payload.url || "";
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const { document, params = {}, fragmentParsers: fragmentParsers2 = {} } = payload;
    if (!Array.isArray(params.fragments)) params.fragments = [];
    const key = pageKey(pageUrl(payload));
    FRAGMENTS.forEach((frag) => {
      if (!frag.pages.some((p2) => pageKey(p2) === key)) return;
      const parser = fragmentParsers2[frag.block];
      if (!parser) {
        console.warn(`hrblock-fragments: no parser for ${frag.block}; leaving inline`);
        return;
      }
      let matches = [];
      try {
        matches = [...document.querySelectorAll(frag.selector)];
      } catch (e) {
        return;
      }
      if (!matches.length || matches.length > 1 && !frag.all) {
        console.warn(`hrblock-fragments: ${frag.selector} matched ${matches.length} elements on ${key}; leaving inline`);
        return;
      }
      const source = matches[0];
      matches.slice(1).forEach((copy) => {
        const copyLink = document.createElement("a");
        copyLink.href = frag.path;
        copyLink.textContent = frag.path;
        const copyBlock = WebImporter.Blocks.createBlock(document, { name: "Fragment", cells: [[copyLink]] });
        copyBlock.setAttribute(FRAGMENT_ATTR2, fragmentStyle(copy, payload.template && payload.template.sections || []));
        copy.replaceWith(copyBlock);
      });
      const sections = payload.template && payload.template.sections || [];
      const style = fragmentStyle(source, sections);
      const link3 = document.createElement("a");
      link3.href = frag.path;
      link3.textContent = frag.path;
      const fragmentBlock = WebImporter.Blocks.createBlock(document, { name: "Fragment", cells: [[link3]] });
      fragmentBlock.setAttribute(FRAGMENT_ATTR2, style);
      source.replaceWith(fragmentBlock);
      const docStyle = bandStyle(source, style);
      const holder = document.createElement("div");
      holder.append(source);
      try {
        parser(source, { document, url: payload.url, params });
      } catch (e) {
        console.error(`hrblock-fragments: failed to parse ${frag.block} for ${frag.path}:`, e);
      }
      holder.querySelectorAll(`[${LAYOUT_ATTRIBUTE}]`).forEach((el) => el.removeAttribute(LAYOUT_ATTRIBUTE));
      if (docStyle) {
        holder.append(WebImporter.Blocks.createBlock(document, { name: "Section Metadata", cells: { style: docStyle } }));
      }
      params.fragments.push({ element: holder, path: frag.path });
    });
  }

  // tools/importer/transformers/hrblock-dm-images.js
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function detectDynamicMediaUrl(urlStr) {
    if (!urlStr || !/^(https?:\/\/|\/\/)/i.test(urlStr)) return false;
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) return "scene7";
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  function getImageUrl(img) {
    const candidates = [
      img.getAttribute("src"),
      img.getAttribute("data-src"),
      img.getAttribute("data-original")
    ];
    const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset");
    if (srcset) candidates.push(srcset.split(",")[0].trim().split(/\s+/)[0]);
    const picture = img.closest("picture");
    if (picture) {
      picture.querySelectorAll("source").forEach((s) => {
        const ss = s.getAttribute("srcset");
        if (ss) candidates.push(ss.split(",")[0].trim().split(/\s+/)[0]);
      });
    }
    const hit = candidates.find((c) => c && detectDynamicMediaUrl(c));
    if (!hit) return null;
    return hit.startsWith("//") ? `https:${hit}` : hit;
  }
  function isSoleMeaningfulDescendant(anchor, node) {
    const clone = anchor.cloneNode(true);
    const path = [];
    let cur = node;
    while (cur && cur !== anchor) {
      const parent = cur.parentNode;
      path.unshift([...parent.childNodes].indexOf(cur));
      cur = parent;
    }
    let target = clone;
    path.forEach((idx) => {
      target = target.childNodes[idx];
    });
    if (target && target.parentNode) target.parentNode.removeChild(target);
    if (clone.textContent.replace(/\s+/g, "").length) return false;
    if (clone.querySelector("img, picture, video, svg, iframe")) return false;
    return true;
  }
  function transform4(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    if (!element) return;
    const document = element.ownerDocument;
    if (!document) return;
    [...element.querySelectorAll("img")].forEach((img) => {
      if (!img.isConnected) return;
      const dmUrl = getImageUrl(img);
      if (!dmUrl) return;
      const alt = (img.getAttribute("alt") || "").trim() || EMPTY_ALT_SENTINEL;
      const picture = img.closest("picture");
      const node = picture && picture.contains(img) ? picture : img;
      const link3 = img.closest("a");
      if (link3 && element.contains(link3)) {
        if (!isSoleMeaningfulDescendant(link3, node)) {
          console.warn(`[hrblock-dm-images] skipped mixed-content anchor for ${dmUrl}`);
          return;
        }
        link3.setAttribute("title", dmUrl);
        link3.textContent = alt;
        return;
      }
      const a = document.createElement("a");
      a.setAttribute("href", dmUrl);
      a.textContent = alt;
      node.replaceWith(a);
    });
  }

  // tools/importer/import-card-grid-landing.js
  var PAGE_TEMPLATE = {
    "name": "card-grid-landing",
    "urls": [
      "https://www.hrblock.com/corporate/tax-franchise/",
      "https://www.hrblock.com/dsar/",
      "https://www.hrblock.com/espanol/",
      "https://www.hrblock.com/expat-tax-preparation/expat-services/",
      "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/",
      "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/",
      "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/",
      "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/",
      "https://www.hrblock.com/filing-options-and-products/",
      "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/",
      "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/",
      "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/",
      "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/",
      "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/",
      "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/",
      "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/",
      "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/",
      "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/",
      "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/",
      "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/",
      "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/",
      "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/",
      "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/",
      "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/",
      "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/",
      "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/",
      "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/",
      "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/",
      "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/",
      "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/",
      "https://www.hrblock.com/international-tax-offices/panama/panama/63312/",
      "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/",
      "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/",
      "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/",
      "https://www.hrblock.com/no-surprise-guarantee/",
      "https://www.hrblock.com/partners/tax-import-partners/",
      "https://www.hrblock.com/tax-appointment-preparation/",
      "https://www.hrblock.com/tax-offices/business-services/",
      "https://www.hrblock.com/tax-offices/drop-off/",
      "https://www.hrblock.com/tax-offices/international/",
      "https://www.hrblock.com/tax-offices/office-tax-preparation/",
      "https://www.hrblock.com/tax-offices/tax-refund-payment/",
      "https://www.hrblock.com/tax-offices/virtual-tax-preparation/",
      "https://www.hrblock.com/taxes-site-index/",
      "https://www.hrblock.com/taxes/products/software/updates/whyrequired/"
    ],
    "description": "Landing page opening with repeated cards, followed by CTA bands, FAQ accordion and split promo",
    "blocks": [
      {
        "name": "accordion-faq",
        "instances": [
          "main div.cmp-container > section.faq",
          'main div.cmp-container > section.accordian-section[class*="-theme"]:not(li section)'
        ],
        "pageInstances": {
          "https://www.hrblock.com/corporate/tax-franchise/": [
            "#container-b1efe99f69 > section.faq.spruce-eggshell-theme"
          ],
          "https://www.hrblock.com/espanol/": [
            "#container-255e702f13 > section.faq.white-theme"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
            "#container-4629a22216 > section.faq.white-theme"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
            "#container-19212fc5ed > section.faq.spruce-eggshell-theme"
          ],
          "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
            "#container-c566082ee0 > section.faq.white-theme"
          ],
          "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
            "#container-4f037312fd > section.faq.white-theme"
          ],
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-c74219acd4 > section.faq.white-theme"
          ],
          "https://www.hrblock.com/tax-appointment-preparation/": [
            "#container-ee26adcaaa > section.faq.white-theme"
          ],
          "https://www.hrblock.com/tax-offices/international/": [
            "#container-28a219ff3d > section.faq.spruce-eggshell-theme"
          ],
          "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
            "#container-1da07e30fe > section.accordian-section.full-width.white-theme"
          ]
        }
      },
      {
        "name": "tabs-pill",
        "instances": [
          "main div.cmp-container > div.reframe-tabs"
        ],
        "pageInstances": {
          "https://www.hrblock.com/tax-appointment-preparation/": [
            "#container-ee26adcaaa > div"
          ],
          "https://www.hrblock.com/tax-offices/business-services/": [
            "#container-81ca87821d > div.reframe-tabs"
          ]
        }
      },
      {
        "name": "office-locator",
        "instances": [
          "main div.cmp-container > section.column-control:has(.opp-city-state)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
            "#container-5a002b9926 > section:nth-child(1)"
          ]
        }
      },
      {
        "name": "cards-office-services",
        "instances": [
          "main div.cmp-container > section.column-control.two-column-control:has(.opp-service-icon)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
            "#container-5a002b9926 > section.column-control.padding-top-120.padding-bottom-120.two-column-control"
          ]
        }
      },
      {
        "name": "columns-stats",
        "instances": [
          "main div.xf-content-height div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .card-secondary.featurecard):has(> div.container > ul > li.col-2 .introImageVariant)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
            "#container-ff40e6cdd2 > section:nth-child(2)"
          ]
        }
      },
      {
        "name": "contact-form",
        "instances": [
          "main div.cmp-container > section.column-control:has(.hrb-custom-form form)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/partners/tax-import-partners/": [
            "#container-8c5dbff294 > section.column-control.white-theme.padding-top-120.padding-bottom-100"
          ]
        }
      },
      {
        "name": "search-articles",
        "instances": [
          "main div.cmp-container > section.column-control:has(select.select-location)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/corporate/tax-franchise/": [
            "#container-b1efe99f69 > section:nth-child(12)"
          ]
        }
      },
      {
        "name": "table-data",
        "instances": [
          "main div.cmp-container > div.showcontents"
        ],
        "pageInstances": {
          "https://www.hrblock.com/tax-offices/drop-off/": [
            "#container-34b249c794 > div.showcontents.full-width"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > div.showcontents.full-width"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-7228de0508 > div.showcontents.full-width"
          ]
        }
      },
      {
        "name": "cards-pricing",
        "instances": [
          "main div.cmp-container > div.xf-content-height:has(.category-card_container-v2)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-c74219acd4 > div:nth-child(3)"
          ]
        }
      },
      {
        "name": "accordion-media",
        "instances": [
          "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 section.accordian-section ul.accordion)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/tax-offices/drop-off/": [
            "#container-34b249c794 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-7228de0508 > section.column-control.spruce-eggshell-theme.padding-bottom-20.two-column-control"
          ]
        }
      },
      {
        "name": "columns-callout",
        "instances": [
          "main div.cmp-container > section.column-control.two-column-control:has(> div.container > ul > li.col-2 .introDefaultvariant):has(> div.container > ul > li.col-2 article.card-stacked .hrb-icon-link--check, > div.container > ul > li.col-2 article.card-stacked .hrb-icon-link--check-green)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
            "#container-c566082ee0 > section.column-control.padding-top-40.padding-bottom-60.two-column-control"
          ],
          "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
            "#container-4f037312fd > section.column-control.white-theme.padding-top-80.padding-bottom-60.two-column-control"
          ]
        }
      },
      {
        "name": "cards-product",
        "instances": [
          "main div.cmp-container > section.column-control:has(> div.container > ul > li.imageOverflow)",
          "main div.cmp-container > section.column-control.two-column-control:has(li.col-2 div.card-primary article.card-content)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
            "#container-30454cf958 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
            "#container-553737c5aa > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
            "#container-d602b58300 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
            "#container-afd5d13c0e > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
            "#container-e4e1e777e5 > section.column-control.green-dark-theme.padding-top-20.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/no-surprise-guarantee/": [
            "#container-958a931f0a > section.column-control.green-dark-theme.padding-top-20.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-7228de0508 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
          ]
        }
      },
      {
        "name": "columns-promo-card",
        "instances": [
          "main div.cmp-container > section.column-control:has(.card-jumbo)",
          "main div.cmp-container > div.xf-content-height:has(.card-secondary.featurecard):not(:has(section.two-column-control))"
        ],
        "pageInstances": {
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-c74219acd4 > section.column-control.white-theme.padding-top-100.padding-bottom-40"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > div:nth-child(19)"
          ],
          "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
            "#container-1da07e30fe > div:nth-child(7)"
          ]
        }
      },
      {
        "name": "cards-icon",
        "instances": [
          "main div.xf-content-height div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-1 .introImageVariant .icon-svg)",
          "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-1 .alignBanner h2.skinnyHeader):has(> div.container > ul > li.col-1 .alignBanner img)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/dsar/": [
            "#container-a8d6a15d17 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-74c19fe3c5 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
            "#container-485b778d92 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/no-surprise-guarantee/": [
            "#container-7b73822ca6 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/tax-offices/drop-off/": [
            "#container-34b249c794 > section:nth-child(9)",
            "#container-475969aff1 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/tax-offices/international/": [
            "#container-1ddc4dd7f2 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > section.column-control.spruce-eggshell-theme.padding-bottom-60",
            "#container-1df20e8729 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
            "#container-708adc668f > section:nth-child(2)"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-a9faa20768 > section:nth-child(2)"
          ]
        }
      },
      {
        "name": "cards-feature",
        "instances": [
          "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control li.col-2 .card-inset)",
          "main div.cmp-container > section.column-control.two-column-control:has(li.col-2 .card-inset)",
          "main div.cmp-container > section.column-control:has(> div.container > ul > li:is(.col-2, .col-3, .col-4) article.card-stacked):not(:has(.hrb-icon-link--check, .hrb-icon-link--check-green))",
          "main div.cmp-container > section.column-control:not(.two-column-control):has(> div.container > ul > li.col-4 .icon-svg)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
            "#container-f5223be189 > section.column-control.white-theme.padding-top-20"
          ],
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-c74219acd4 > section.column-control.spruce-eggshell-theme.padding-bottom-100"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
            "#container-5a002b9926 > section.column-control.spruce-eggshell-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/no-surprise-guarantee/": [
            "#container-e3d43503e3 > section.column-control.white-theme.padding-top-20.two-column-control",
            "#container-e3d43503e3 > section.column-control.white-theme.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/partners/tax-import-partners/": [
            "#container-8c5dbff294 > section.column-control.white-theme.padding-top-20.two-column-control",
            "#container-8c5dbff294 > section.column-control.white-theme.padding-bottom-120.two-column-control",
            "#container-8c5dbff294 > section.column-control.spruce-eggshell-theme.padding-bottom-40.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/business-services/": [
            "#container-81ca87821d > section.column-control.white-theme.padding-top-60.padding-bottom-60"
          ],
          "https://www.hrblock.com/tax-offices/drop-off/": [
            "#container-34b249c794 > div:nth-child(23)"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > div:nth-child(23)"
          ],
          "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
            "#container-1da07e30fe > section.column-control.spruce-eggshell-theme.padding-top-40.padding-bottom-120.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-7228de0508 > div:nth-child(21)"
          ],
          "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
            "#container-09f0436c75 > section:nth-child(2)"
          ]
        }
      },
      {
        "name": "promo-strip",
        "instances": [
          "main div.cmp-container > section.column-control:has(> div.container > ul > li.col-1 .alignBanner .icon-svg)",
          "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section:only-of-type .alignBanner)",
          "main div.cmp-container > section.spruce-forest-theme:has(> div.alignBanner .icon-svg)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-c74219acd4 > section.column-control.green-dark-theme.padding-bottom-100"
          ],
          "https://www.hrblock.com/tax-offices/drop-off/": [
            "#container-34b249c794 > div:nth-child(10)"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > div:nth-child(10)"
          ],
          "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
            "#container-1da07e30fe > div:nth-child(4)"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-7228de0508 > div:nth-child(8)"
          ],
          "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
            "#container-8ca114bef5 > section.spruce-forest-theme"
          ]
        }
      },
      {
        "name": "columns-banner",
        "instances": [
          "main div.cmp-container > div.xf-content-height:has(.fb-image-wrapper .alignBanner)",
          "main div.cmp-container > div.xf-content-height:has(> div.root > div.cmp-container > section.two-column-control:only-of-type > div.container > ul > li.col-2 .cq-dd-image)",
          "main div.cmp-container > section.content-two-column",
          "main div.cmp-container > section.column-control:not(li section).two-column-control:has(> div.container > ul > li.col-2):not(:has(> div.container > ul > li.hide-large))",
          "main div.cmp-container > section.column-control:not(li section):not(.two-column-control):has(> div.container > ul > li.col-3, > div.container > ul > li.col-4, > div.container > ul > li.col-5)",
          "main section.column-control.spruce-forest-theme:not(.two-column-control):not(li.hide-large section):has(> div.container > ul.column-container > li.col-3 h3.modal-headline > p):not(:has(img, picture, a[href], button, article))"
        ],
        "pageInstances": {
          "https://www.hrblock.com/corporate/tax-franchise/": [
            "#container-b1efe99f69 > section:nth-child(1)",
            "#container-b1efe99f69 > section:nth-child(3)",
            "#container-b1efe99f69 > section.column-control.spruce-eggshell-theme.two-column-control"
          ],
          "https://www.hrblock.com/dsar/": [
            "#container-4d3bf8ff89 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-60.two-column-control"
          ],
          "https://www.hrblock.com/espanol/": [
            "#container-255e702f13 > section.column-control.spruce-eggshell-theme.padding-top-60.padding-bottom-80.two-column-control",
            "#container-255e702f13 > section:nth-child(2)",
            "#container-255e702f13 > section:nth-child(3)",
            "#container-255e702f13 > section:nth-child(4)",
            "#container-255e702f13 > section.column-control.green-dark-theme.two-column-control",
            "#container-255e702f13 > section:nth-child(11)"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
            "#container-f5223be189 > section.column-control.white-theme.padding-top-100.padding-bottom-120.two-column-control",
            "#container-f5223be189 > section.column-control.green-dark-theme.padding-top-100.padding-bottom-100.two-column-control",
            "#container-f5223be189 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
            "#container-4629a22216 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control",
            "#container-4629a22216 > section:nth-child(2)"
          ],
          "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
            "#container-19212fc5ed > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-100.two-column-control",
            "#container-19212fc5ed > section.column-control.white-theme.padding-top-80.padding-bottom-80.two-column-control",
            "#container-19212fc5ed > section:nth-child(3)"
          ],
          "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
            "#container-c566082ee0 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control"
          ],
          "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
            "#container-4f037312fd > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control"
          ],
          "https://www.hrblock.com/filing-options-and-products/": [
            "#container-c74219acd4 > section.column-control.spruce-eggshell-theme.padding-bottom-80.two-column-control"
          ],
          "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
            "#container-fac90de070 > section.column-control.white-theme.padding-top-40.padding-bottom-80.two-column-control",
            "#container-fac90de070 > section:nth-child(2)",
            "#container-fac90de070 > section:nth-child(3)",
            "#container-fac90de070 > section:nth-child(5)",
            "#container-fac90de070 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control"
          ],
          "https://www.hrblock.com/no-surprise-guarantee/": [
            "#container-e3d43503e3 > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control"
          ],
          "https://www.hrblock.com/partners/tax-import-partners/": [
            "#container-8c5dbff294 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-80.two-column-control",
            "#container-8c5dbff294 > section.column-control.white-theme.padding-top-60.padding-bottom-40.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/business-services/": [
            "#container-81ca87821d > section.column-control.green-dark-theme.padding-top-20.two-column-control",
            "#container-81ca87821d > section.column-control.spruce-forest-theme.padding-top-60.padding-bottom-60.two-column-control",
            "#container-81ca87821d > section.column-control.spruce-eggshell-theme.padding-top-100.padding-bottom-80.two-column-control",
            "#container-81ca87821d > div:nth-child(11)"
          ],
          "https://www.hrblock.com/tax-offices/drop-off/": [
            "#container-34b249c794 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
            "#container-34b249c794 > section:nth-child(7)",
            "#container-34b249c794 > div:nth-child(21)",
            "#container-34b249c794 > div:nth-child(24)"
          ],
          "https://www.hrblock.com/tax-offices/international/": [
            "#container-28a219ff3d > section:nth-child(2)",
            "#container-28a219ff3d > section:nth-child(5)",
            "#container-28a219ff3d > section:nth-child(6)",
            "#container-28a219ff3d > section:nth-child(7)",
            "#container-28a219ff3d > section.column-control.spruce-forest-theme.two-column-control"
          ],
          "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
            "#container-f1d4178a07 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
            "#container-f1d4178a07 > section:nth-child(7)",
            "#container-f1d4178a07 > div:nth-child(21)",
            "#container-f1d4178a07 > div:nth-child(24)"
          ],
          "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
            "#container-1da07e30fe > section.column-control.white-theme.padding-bottom-40",
            "#container-1da07e30fe > section:nth-child(5)",
            "#container-1da07e30fe > section:nth-child(6)"
          ],
          "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
            "#container-7228de0508 > section.column-control.white-theme.padding-top-40.padding-bottom-40.two-column-control",
            "#container-7228de0508 > div:nth-child(19)"
          ],
          "https://www.hrblock.com/taxes-site-index/": [
            "#container-2b6c099062 > section.column-control.white-theme.padding-top-40.padding-bottom-40",
            "#container-2b6c099062 > section:nth-child(3)",
            "#container-2b6c099062 > section.column-control.white-theme.padding-bottom-100"
          ],
          "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
            "#container-09f0436c75 > section.column-control.spruce-eggshell-theme.padding-top-80.padding-bottom-20.two-column-control"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "office-details",
        "name": "Office details and map (eggshell)",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(.opp-city-state)"
        ],
        "style": "eggshell",
        "blocks": [
          "office-locator"
        ],
        "defaultContent": []
      },
      {
        "id": "office-services",
        "name": "Office services intro (eggshell)",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(.opp-service-icon):not(.two-column-control)"
        ],
        "style": "eggshell",
        "blocks": [],
        "defaultContent": [
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:has(.opp-service-icon):not(.two-column-control)"
        ]
      },
      {
        "id": "band-green",
        "name": "Feature band (green)",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.green-dark-theme",
          "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.green-dark-theme",
          "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme",
          "main div.cmp-container > div.xf-content-height section.green-dark-theme:not(li section)"
        ],
        "style": "green",
        "blocks": [
          "columns-banner",
          "cards-icon",
          "cards-product",
          "promo-strip",
          "cards-pricing",
          "tabs-pill"
        ],
        "defaultContent": [
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.green-dark-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)",
          "main div.cmp-container > div.xf-content-height section.column-control.green-dark-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
        ]
      },
      {
        "id": "band-eggshell",
        "name": "Feature band (eggshell)",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.spruce-eggshell-theme",
          "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.spruce-eggshell-theme",
          "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme",
          "main div.cmp-container > div.xf-content-height section.spruce-eggshell-theme:not(li section)"
        ],
        "style": "eggshell",
        "blocks": [
          "columns-banner",
          "accordion-faq",
          "cards-icon",
          "cards-feature",
          "cards-product",
          "accordion-media",
          "table-data",
          "columns-promo-card"
        ],
        "defaultContent": [
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.spruce-eggshell-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)",
          "main div.cmp-container > div.xf-content-height section.column-control.spruce-eggshell-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
        ]
      },
      {
        "id": "band-forest",
        "name": "Feature band (forest)",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme",
          "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.spruce-forest-theme",
          "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme",
          "main div.cmp-container > div.xf-content-height section.spruce-forest-theme:not(li section)"
        ],
        "style": "forest",
        "blocks": [
          "columns-banner",
          "cards-icon",
          "promo-strip",
          "columns-promo-card"
        ],
        "defaultContent": [
          "main > div.root > div.cmp-container > div.cmp-container > section.spruce-forest-theme:not(:has(.icon-svg)):has(.alignBanner)",
          "main div.cmp-container > div.xf-content-height section.column-control.spruce-forest-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)"
        ]
      },
      {
        "id": "band-white",
        "name": "Feature band (white)",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.white-theme",
          "main > div.root > div.cmp-container > div.cmp-container > div.showhide-table.white-theme",
          "main div.cmp-container > div.xf-content-height section.column-control.white-theme",
          "main div.cmp-container > div.xf-content-height section.white-theme:not(li section)",
          "main > div.root > div.cmp-container > div.cmp-container > section.content-two-column"
        ],
        "style": null,
        "blocks": [
          "columns-banner",
          "cards-feature",
          "columns-callout",
          "columns-promo-card",
          "contact-form",
          "accordion-faq",
          "columns-stats",
          "cards-office-services"
        ],
        "defaultContent": [
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)",
          "main > div.root > div.cmp-container > div.cmp-container > section.column-control.white-theme:not(.two-column-control):has(> div.container > ul > li.col-1 .alignBanner)",
          "main div.cmp-container > div.xf-content-height section.column-control.white-theme:not(.two-column-control):has(> div.container > ul > li.col-1)"
        ]
      },
      {
        "id": "neon-strip",
        "name": "Neon strip",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.hrb-neon-green",
          "main div.cmp-container > div.xf-content-height section.spruce-neon-theme"
        ],
        "style": "neon",
        "blocks": [
          "promo-strip"
        ],
        "defaultContent": []
      },
      {
        "id": "image-banner",
        "name": "Full-bleed image banner",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper",
          "main div.cmp-container > div.xf-content-height div.fb-image-wrapper"
        ],
        "style": null,
        "blocks": [
          "columns-banner"
        ],
        "defaultContent": [
          "main > div.root > div.cmp-container > div.cmp-container > div.fb-image-wrapper"
        ]
      },
      {
        "id": "unthemed-band",
        "name": "Unthemed band",
        "selector": [
          'main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*="-theme"])',
          "main > div.root > div.cmp-container > div.cmp-container > section.content-two-column"
        ],
        "style": null,
        "blocks": [
          "columns-banner",
          "cards-office-services",
          "columns-callout",
          "search-articles"
        ],
        "defaultContent": [
          'main > div.root > div.cmp-container > div.cmp-container > section.column-control:not([class*="-theme"]):not(.two-column-control):has(> div.container > ul > li.col-1 .introDefaultvariant)'
        ]
      },
      {
        "id": "comparison-table",
        "name": "Compare filing options table",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > div.showcontents"
        ],
        "style": "eggshell",
        "blocks": [
          "table-data"
        ],
        "defaultContent": []
      },
      {
        "id": "tabs",
        "name": "Pill tabs",
        "selector": [
          "main div.cmp-container > div.reframe-tabs"
        ],
        "style": null,
        "blocks": [
          "tabs-pill"
        ],
        "defaultContent": []
      },
      {
        "id": "faq",
        "name": "FAQ",
        "selector": [
          "main > div.root > div.cmp-container > div.cmp-container > section.faq",
          "main > div.root > div.cmp-container > div.cmp-container > section.accordian-section"
        ],
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": []
      },
      {
        "id": "disclaimer",
        "name": "Page disclaimers",
        "selector": [
          "body > div.global-disclaimer-container",
          "main div.cmp-container > div.global-disclaimer-container:not(.hide)"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": [
          "body > div.global-disclaimer-container"
        ]
      }
    ],
    "pageCleanup": {
      "https://www.hrblock.com/corporate/tax-franchise/": [
        "#truste_0\\.11447772096219566",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1892162435",
        "#container-e041895b13 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_722764778",
        "#container-e7cad15789 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1137733242",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_761910111",
        "h2.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_101459884",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/dsar/": [
        "#truste_0\\.16807459537259184",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1968956440",
        "#container-021394c622 > div:nth-child(2) > h2:nth-child(1)",
        "#container-abc7993860 > div:nth-child(2) > h2:nth-child(1)",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-b42b70036f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-b42b70036f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-6f466b147d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-6f466b147d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/espanol/": [
        "#truste_0\\.9679459594053192",
        "#ciam-login-app",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_235456542",
        "#container-255e702f13 > section:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_870408919",
        "#container-255e702f13 > section:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1568443060",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_1236996842",
        "#container-8c8e1f2eb5 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_123283518",
        "h2.modal-headline.text-jumbo",
        "#overlay-suggestions-list",
        "#overlay_search",
        "#site-search"
      ],
      "https://www.hrblock.com/expat-tax-preparation/expat-services/": [
        "#truste_0\\.3684408819263383",
        "div.modal-inner",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.m-t-20",
        "#container-e45a20b5f9 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1251310187",
        "#container-2534c1b064 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1808454855",
        "#container-1f85f8364a > div:nth-child(2) > h2:nth-child(1)",
        "h2.modal-headline.text-jumbo",
        "#signinmodal-window"
      ],
      "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/fbar-filing/": [
        "#truste_0\\.8713795239967789",
        "div.modal-inner",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.m-t-20",
        "#container-e1ba513eb0 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_636457350",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_1937543435",
        "h2.modal-headline.text-jumbo",
        "#signinmodal-window"
      ],
      "https://www.hrblock.com/expat-tax-preparation/expat-tax-preparation-and-services/streamlined/": [
        "#truste_0\\.2292279896486471",
        "div.modal-inner",
        "h1.modal-headline.text-large",
        "div.modal-body.m-t-20",
        "#container-9394116621 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1775143597",
        "h2.modal-headline.text-medium",
        "div.modal-body.body_max_width_mid_183933931",
        "h2.modal-headline.text-jumbo",
        "#signinmodal-window"
      ],
      "https://www.hrblock.com/expat-tax-preparation/foreign-business-tax-returns/": [
        "#truste_0\\.18316116090550794",
        "div.modal-inner",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.m-t-20",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_1769518118",
        "#signinmodal-window"
      ],
      "https://www.hrblock.com/expat-tax-preparation/state-taxes-for-expats/": [
        "#truste_0\\.25856760248111044",
        "div.modal-inner",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.m-t-20",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_90436523",
        "h2.modal-headline.text-jumbo",
        "#signinmodal-window"
      ],
      "https://www.hrblock.com/filing-options-and-products/": [
        "#truste_0\\.5743650548007467",
        "#spike-popup",
        "#ciam-login-app",
        "#container-6165129635 > div:nth-child(1)",
        "#modal-rf-software-state-fees-modal-all",
        "#modal-ai",
        "#modal-free",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "#container-c483791890 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
        "section.spruce-forest-theme.rounded-border > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "#container-a955f82ecd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
        "#container-a955f82ecd > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-e4694a949d > div:nth-child(2) > h2:nth-child(1)",
        "#container-2e01663b08 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-2e01663b08 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "a.btn.modal-tool-open",
        "#container-ca24e36d6e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-ca24e36d6e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-ff38317d78 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-4c2599a971 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-4c2599a971 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-180caac25f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-180caac25f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_1083635356",
        "div.modal-body.body_max_width_mid_1458411927",
        "div.modal-body.body_max_width_mid_184161382",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search",
        "div.chatbot-launcher"
      ],
      "https://www.hrblock.com/find-a-cpa-or-enrolled-agent/": [
        "#truste_0\\.9239006762547822",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1799071666",
        "#container-22ce937538 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_31567332",
        "#container-9fca0746e6 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_2089912705",
        "#container-cc14bcc094 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1020678044",
        "#container-28fb7276f5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-28fb7276f5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-e5a4332923 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-e5a4332923 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-small",
        "#container-da98c22b04 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-d974e045c0 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1181534750",
        "span.product-modal-price",
        "a.modal-tool-open.track-873490822",
        "h2.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1175088645",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_688712216",
        "#container-674505f1c6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-674505f1c6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-1eff1a9e13 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-1eff1a9e13 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/baumholder/62848/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.6791094666449929",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.underline-green",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/baumholder/62961/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.17508345250158053",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/grafenwoehr/62950/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.7937387153541147",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/idar-oberstein/62900/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.4415711322071071",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/kaiserslautern/62854/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.281345941189196",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/ramstein/62948/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.7770204107814388",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/stuttgart/18054/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.46193196575719786",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/stuttgart/62651/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.890938067643223",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/vilseck/62911/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.7675598031776313",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/germany/wiesbaden/62891/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.04150688701504135",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/guam/barrigada/63121/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.9164149828116367",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/guam/dededo/63119/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.4141358591025319",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/italy/fontanafredda-pn/62920/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.9228467682948577",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.underline-green",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/italy/gricignano-di-aversa/62964/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.9298142122905548",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.underline-green",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/italy/sigonella-sr/62296/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.650627363548136",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.underline-green",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/italy/vicenza/62660/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.07193024992659602",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/japan/chatan/63253/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.12044027720155026",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/japan/okinawa/63252/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.7516693404633024",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/japan/tokyo/63240/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.3378076490862626",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/japan/yokosuka/63255/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.8939742604987971",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/panama/panama/63312/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.024958304069846005",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63241/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.7689548804171245",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/south-korea/pyeongtaek/63248/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.9800709689522898",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/international-tax-offices/south-korea/seoul/63245/": [
        "div.gm-style > div:nth-child(3)",
        "#truste_0\\.8560193327487419",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "a.btn.modal-tool-open",
        "a.modal-tool-open.see-all-pro",
        "h2.modal-headline.text-large",
        "#container-24204ccb40 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1833472204",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1466662845",
        "div.modal-body.body_max_width_mid_1747012734",
        "div.modal-body.body_max_width_mid_4644244",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/no-surprise-guarantee/": [
        "#truste_0\\.14096448139192752",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_2085018204",
        "#container-e1026213b1 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
        "#container-bac9ee9a82 > div:nth-child(2) > h2:nth-child(1)",
        "h2.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1181534750",
        "span.product-modal-price",
        "a.modal-tool-open.track-873490822",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_688712216",
        "#container-8738e85e2e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-8738e85e2e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-7f2158b93a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-7f2158b93a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/partners/tax-import-partners/": [
        "body.brandnav-included > div:nth-child(40)",
        "#truste_0\\.45584860834290886",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1056208871",
        "#container-1b96819eaf > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_458483506",
        "#container-4d0fb32331 > div:nth-child(2) > h2:nth-child(1)",
        "#container-fdc7a7d750 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1529502090",
        "h2.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1540260839",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-appointment-preparation/": [
        "#truste_0\\.7257744253224625",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.color-eggshell",
        "div.sm-modal-img-hide",
        "h1.modal-headline.text-jumbo",
        "#taxProModal",
        "#container-8ff816eaf5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
        "#container-8ff816eaf5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
        "#container-81a7184daf > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
        "#container-81a7184daf > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
        "#container-81a7184daf > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > a:nth-child(1)",
        "#container-fd7864ab07 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(2)",
        "#container-fd7864ab07 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
        "#container-e813ef4d64 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
        "#container-e813ef4d64 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-9feb2b1138 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
        "#container-9feb2b1138 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h2.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "a.btn.modal-tool-open",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-offices/business-services/": [
        "#truste_0\\.7261777918727573",
        "#spike-popup",
        "#ciam-login-app",
        "#modal-ai",
        "#modal-rf-software-state-fees-modal-all",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.color-eggshell",
        "div.modal-body.body_max_width_mid_86293899",
        "#container-53dcc442c4 > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
        "#container-d64255ce7d > div:nth-child(5) > a:nth-child(1)",
        "#container-bc7e999f24 > div:nth-child(2) > h3:nth-child(2)",
        "#container-7189286ba6 > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
        "#container-5eafe3eb49 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1)",
        "h3.modal-headline.text-medium",
        "div.modal-body.body_max_width_mid_200149108",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_1866120263",
        "#container-9be067977c > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(2)",
        "#container-9be067977c > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3)",
        "#container-9be067977c > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "h3.modal-headline.text-large",
        "div.modal-body.m-t-20",
        "#container-86c4fba7da > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "a.btn.modal-tool-open",
        "p.modal-headline.text-small",
        "div.modal-body.body_max_width_mid_648620054",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-offices/drop-off/": [
        "#truste_0\\.39889667650502303",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "div.modal-header",
        "#container-34b249c794 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "h1.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_1572246562",
        "#container-f1bb45577b > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
        "#container-e1ae132f91 > div:nth-child(2) > h2:nth-child(1)",
        "#container-9585fafa35 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-9585fafa35 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-5092d308f4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-5092d308f4 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-ce7e9719f0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-ce7e9719f0 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-small",
        "#container-813685cc4b > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-b85c9746c9 > section:nth-child(4) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
        "section.green-dark-theme > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
        "#container-6ff43a79a2 > div:nth-child(2) > h2:nth-child(1)",
        "#container-d2f1cf316e > div:nth-child(2) > h2:nth-child(1)",
        "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(3) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "th.highlighted.hrb-neon-green > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "#container-7b5c568caa > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-527868d79d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-527868d79d > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-12a62c402f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-12a62c402f > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "#container-2e68424fe3 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h2.modal-headline.text-large",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1090251584",
        "h2.modal-headline.text-jumbo",
        "a.btn.modal-tool-open",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-offices/international/": [
        "#truste_0\\.8270468543771324",
        "#spike-popup",
        "#ciam-login-app",
        "#modal-england",
        "#modal-panama",
        "#modal-india",
        "#modal-guam",
        "#modal-japan",
        "#modal-italy",
        "#modal-canada",
        "#modal-australia",
        "#modal-southkorea",
        "#modal-germany",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1086551594",
        "div.modal-body.body_max_width_mid_2014784338",
        "#container-28a219ff3d > section:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1602192793",
        "#container-28a219ff3d > section:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1290645347",
        "#container-28a219ff3d > section:nth-child(7) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_1116070452",
        "h2.modal-headline.text-jumbo",
        "#container-32c03a08c9 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-6a4ae39101 > div:nth-child(2) > h3:nth-child(1)",
        "div.modal-body.body_max_width_mid_1774488032",
        "#container-6a4ae39101 > div:nth-child(4) > h3:nth-child(1)",
        "div.modal-body.body_max_width_mid_1338532142",
        "h3.modal-headline.text-small",
        "div.modal-body.body_max_width_mid_447539872",
        "#container-ce51c0b54e > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-40d34fe086 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-40d34fe086 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-456645d116 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-456645d116 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "h2.modal-headline.text-large",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-offices/office-tax-preparation/": [
        "#truste_0\\.0959320357370993",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "div.modal-header",
        "#container-f1d4178a07 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "h1.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_2037748216",
        "#container-4f84cb50b1 > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
        "#container-972dd921bc > div:nth-child(2) > h2:nth-child(1)",
        "#container-0a0bee9bf8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-0a0bee9bf8 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-5354eea918 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-5354eea918 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-a061c3252a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-a061c3252a > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-small",
        "#container-e8755fa57c > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-a810008cc9 > section:nth-child(4) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
        "section.green-dark-theme > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > a:nth-child(1)",
        "#container-bd5382683b > div:nth-child(2) > h2:nth-child(1)",
        "#container-2b781fbe56 > section:nth-child(1) > div:nth-child(1) > ul:nth-child(2) > li:nth-child(2) > div:nth-child(2) > div:nth-child(2) > a:nth-child(1)",
        "#container-3afa125bc6 > div:nth-child(2) > h2:nth-child(1)",
        "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "th.highlighted.hrb-neon-green > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(4) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "#container-2fdf7429ad > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-f3a120f677 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-f3a120f677 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-10aebd2dc6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-10aebd2dc6 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "#container-ae16b8c39e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h2.modal-headline.text-large",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1090251584",
        "h2.modal-headline.text-jumbo",
        "a.btn.modal-tool-open",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-offices/tax-refund-payment/": [
        "#truste_0\\.19921169439284658",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1757569297",
        "#container-7a5e6b19af > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-7a5e6b19af > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-d47ca1c269 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-d47ca1c269 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-e3bbedaf09 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-e3bbedaf09 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-small",
        "#container-f507989420 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "div.modal-body.body_max_width_mid_1620268425",
        "#container-f80e5cf9a7 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_209278693",
        "#container-69b1d52d92 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_112496514",
        "#container-2933bc082e > div:nth-child(2) > h2:nth-child(1)",
        "h2.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-5db1da0f11 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-5db1da0f11 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-13d680e011 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-13d680e011 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "div.modal-body.m-t-20",
        "h2.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1383939846",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/tax-offices/virtual-tax-preparation/": [
        "#truste_0\\.5921516133231499",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.container.main-nav-container > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "div.modal-header",
        "#container-7228de0508 > div:nth-child(3) > div:nth-child(1) > a:nth-child(1)",
        "h1.modal-headline.text-large",
        "div.modal-body.body_max_width_mid_2126688429",
        "#container-10a83bc85e > div:nth-child(10) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)",
        "#container-9713acc426 > div:nth-child(2) > h2:nth-child(1)",
        "div.left-30.removeLastPadding > div:nth-child(1) > a:nth-child(1)",
        "#container-c5f51262d4 > div:nth-child(2) > h2:nth-child(1)",
        "#container-663db712e2 > div:nth-child(2) > h2:nth-child(1)",
        "th.highlighted.hrb-neon-green > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "table.shtablecomparison.highlight > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(3) > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)",
        "a.btn.modal-tool-open",
        "#container-1d88698633 > div:nth-child(2) > h2:nth-child(1)",
        "div.modal-body.body_max_width_mid_620500244",
        "#container-822200794e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-822200794e > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "#container-35a0df9df5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)",
        "#container-35a0df9df5 > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h3.modal-headline.text-medium",
        "#container-69afc882ff > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)",
        "h2.modal-headline.text-large",
        "div.modal-body.m-t-20",
        "div.modal-body.body_max_width_mid_1090251584",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/taxes-site-index/": [
        "#truste_0\\.20074618391842403",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1700781416",
        "#container-260e906ad3 > div:nth-child(2) > h2:nth-child(1)",
        "#container-5a492f7bb1 > div:nth-child(2) > h2:nth-child(1)",
        "#container-9bdb698670 > div:nth-child(2) > h2:nth-child(1)",
        "#container-3d3d7fb37f > div:nth-child(2) > h2:nth-child(1)",
        "#container-20f652c423 > div:nth-child(2) > h2:nth-child(1)",
        "#container-ca5cba4460 > div:nth-child(2) > h2:nth-child(1)",
        "#container-af5bf044c1 > div:nth-child(2) > h2:nth-child(1)",
        "#container-8be4974a85 > div:nth-child(2) > h2:nth-child(1)",
        "h2.modal-headline.text-small",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ],
      "https://www.hrblock.com/taxes/products/software/updates/whyrequired/": [
        "#truste_0\\.3824566767068578",
        "#spike-popup",
        "#ciam-login-app",
        "div.modal-body.body_max_width_mid_167066974",
        "div.modal-header",
        "h1.modal-headline.text-jumbo",
        "div.modal-body.body_max_width_mid_1694900293",
        "h2.modal-headline.text-jumbo",
        "div.need-help-footer > ul:nth-child(2) > li:nth-child(3) > div:nth-child(1) > button:nth-child(1)",
        "div.spike-content > div:nth-child(5)",
        "#overlay-suggestions-list",
        "#overlay_search",
        "div.spike-content",
        "#site-search"
      ]
    }
  };
  var parsers = {
    "accordion-faq": parse,
    "tabs-pill": parse3,
    "office-locator": parse4,
    "cards-office-services": parse5,
    "columns-stats": parse6,
    "contact-form": parse7,
    "search-articles": parse8,
    "table-data": parse9,
    "cards-pricing": parse10,
    "accordion-media": parse11,
    "columns-callout": parse12,
    "cards-product": parse13,
    "columns-promo-card": parse14,
    "cards-icon": parse15,
    "cards-feature": parse16,
    "promo-strip": parse17,
    "columns-banner": parse18
  };
  var fragmentParsers = {
    "accordion-faq": parse,
    "tabs-pill": parse3,
    "office-locator": parse4,
    "cards-office-services": parse5,
    "columns-stats": parse6,
    "contact-form": parse7,
    "search-articles": parse8,
    "table-data": parse9,
    "cards-pricing": parse10,
    "accordion-media": parse11,
    "columns-callout": parse12,
    "cards-product": parse13,
    "columns-promo-card": parse14,
    "cards-icon": parse15,
    "cards-feature": parse16,
    "promo-strip": parse17,
    "columns-banner": parse18,
    "hero-split": parse19,
    "carousel-testimonial": parse20,
    "cards-article": parse21
  };
  var sectionTransformers = [transform2];
  var transformers = [transform, transform3, transform4, transform2];
  function executeTransformers(hookName, element, payload, list = transformers) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE, fragmentParsers });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var MATCH_ATTR = "data-excat-match";
  var PREPROCESSED_ATTR = "data-excat-preprocessed";
  function pageKey2(u) {
    try {
      const { origin, pathname } = new URL(u);
      return `${origin}${pathname.replace(/\/$/, "")}`;
    } catch (e) {
      return u;
    }
  }
  function blockSelectors(template, url) {
    const key = pageKey2(url);
    const list = [];
    template.blocks.forEach((blockDef, bi) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey2(u) === key);
      (entry ? entry[1] : []).forEach((selector, si) => list.push({ blockDef, selector, token: `p${bi}-${si}` }));
    });
    template.blocks.forEach((blockDef, bi) => (blockDef.instances || []).forEach((selector, si) => list.push({ blockDef, selector, token: `g${bi}-${si}` })));
    return list;
  }
  function tagBlockSelectors(document, template, url) {
    blockSelectors(template, url).forEach(({ selector, token }) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((el) => {
        const tokens = (el.getAttribute(MATCH_ATTR) || "").split(/\s+/).filter(Boolean);
        tokens.push(token);
        el.setAttribute(MATCH_ATTR, tokens.join(" "));
      });
    });
    document.documentElement.setAttribute(PREPROCESSED_ATTR, "true");
  }
  var CONTAINER_BLOCKS = ["article-body"];
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const tagged = document.documentElement.hasAttribute(PREPROCESSED_ATTR);
    const list = blockSelectors(template, url);
    const isContainer = (s) => CONTAINER_BLOCKS.includes(s.blockDef.name);
    [...list.filter(isContainer), ...list.filter((s) => !isContainer(s))].forEach(({ blockDef, selector, token }) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(tagged ? `[${MATCH_ATTR}~="${token}"]` : selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
    document.querySelectorAll(`[${MATCH_ATTR}]`).forEach((el) => el.removeAttribute(MATCH_ATTR));
    return pageBlocks;
  }
  var import_card_grid_landing_default = {
    // Runs on the raw DOM, before helix-importer's own preProcess cleanup.
    preprocess: ({ document, url, params = {} }) => {
      const pageUrl2 = params.originalURL || url;
      tagBlockSelectors(document, PAGE_TEMPLATE, pageUrl2);
      executeTransformers("preprocess", document.body, { document, url, params: __spreadProps(__spreadValues({}, params), { originalURL: pageUrl2 }) });
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      executeTransformers("beforeTransform", main, payload, transformers.filter((fn) => !sectionTransformers.includes(fn)));
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), sectionTransformers);
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
      const metadata = __spreadValues(__spreadValues({}, WebImporter.Blocks.getMetadata(document)), params.excatMetadata || {});
      if (Object.keys(metadata).length) main.append(WebImporter.Blocks.getMetadataBlock(document, metadata));
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach((frag) => {
        executeTransformers("afterTransform", frag.element, payload, transformers.filter((fn) => !sectionTransformers.includes(fn)));
        WebImporter.rules.transformBackgroundImages(frag.element, document);
        WebImporter.rules.adjustImageUrls(frag.element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_card_grid_landing_exports);
})();
