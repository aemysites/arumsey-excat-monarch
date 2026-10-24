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

  // tools/importer/import-resource-article-steps-alt.js
  var import_resource_article_steps_alt_exports = {};
  __export(import_resource_article_steps_alt_exports, {
    default: () => import_resource_article_steps_alt_default
  });

  // tools/importer/parsers/article-body.js
  var SHARE_NAMES = {
    linkedin: "LinkedIn",
    facebook: "Facebook",
    twitter: "Twitter",
    "x.com": "X",
    pinterest: "Pinterest"
  };
  function shareLabel(href) {
    const h = (href || "").toLowerCase();
    const key = Object.keys(SHARE_NAMES).find((k) => h.includes(k));
    return key ? SHARE_NAMES[key] : "Share";
  }
  function cleanInline(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, " ").trim()));
    });
  }
  function hasContent(el) {
    const MEDIA = "img, picture, iframe, table";
    return !!(el && (el.textContent.trim() || el.matches && el.matches(MEDIA) || el.querySelector(MEDIA)));
  }
  function flatten(root, document) {
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
      if (n.nodeType !== 1 || !hasContent(n)) return;
      if (n.tagName === "DIV" || n.tagName === "FIGURE" || n.tagName === "SECTION") {
        out.push(...flatten(n, document));
      } else if (n.tagName === "A" || n.tagName === "IMG") {
        const p2 = document.createElement("p");
        p2.append(n);
        out.push(p2);
      } else {
        out.push(n);
      }
    });
    return out;
  }
  function isHidden(el) {
    return /display\s*:\s*none/i.test(el.getAttribute && el.getAttribute("style") || "");
  }
  function fragmentLink(el) {
    if (!el || el.tagName !== "TABLE") return null;
    const first = el.querySelector("tr > th, tr > td");
    if (!first || !/^fragment$/i.test(first.textContent.trim())) return null;
    const a = el.querySelector('a[href*="/fragments/"]');
    return a ? a.getAttribute("href") : null;
  }
  function voteBlock(element, document) {
    const vote = element.querySelector(".article-helpful-vote");
    if (!vote) return null;
    const q = vote.querySelector(".helpful-heading");
    const options = [...new Set([...vote.querySelectorAll(".helpful-buttons a, .helpful-buttons button")].map((o) => o.textContent.replace(/\s+/g, " ").trim()).filter(Boolean))];
    if (!q || !options.length) return null;
    const fbCells = [[q.textContent.trim()]];
    fbCells.push(options.map((label) => {
      const p2 = document.createElement("p");
      p2.textContent = label;
      return p2;
    }));
    return WebImporter.Blocks.createBlock(document, { name: "article-feedback", cells: fbCells });
  }
  function crumbBlock(trail, document) {
    if (!trail) return null;
    const ul = document.createElement("ul");
    const crumbs = [...trail.querySelectorAll(":scope > span, :scope > a")].filter((n) => !n.classList.contains("ba--breadcrumbs--divide"));
    (crumbs.length ? crumbs : [...trail.querySelectorAll("a")]).forEach((crumb) => {
      const a = crumb.tagName === "A" ? crumb : crumb.querySelector("a");
      const label = (a || crumb).textContent.replace(/\s+/g, " ").trim();
      if (!label) return;
      const li = document.createElement("li");
      if (a && a.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = label;
        li.append(link);
      } else {
        li.textContent = label;
      }
      ul.append(li);
    });
    return ul.children.length ? WebImporter.Blocks.createBlock(document, { name: "breadcrumb", cells: [[ul]] }) : null;
  }
  function parseExpat(element, document) {
    const sidebar = element.querySelector(".article-sidebar .article-detail-bar.desktop") || element.querySelector(".article-sidebar") || element.querySelector(".article-detail-bar");
    const col = element.querySelector("div.col-8") || element;
    element.querySelectorAll("a.share-page--icon").forEach((a) => {
      a.textContent = shareLabel(a.getAttribute("href"));
    });
    const trail = crumbBlock(col.querySelector(":scope > .ba--breadcrumbs"), document);
    const feedback = voteBlock(col, document);
    cleanInline(element);
    const meta = [];
    if (sidebar) {
      sidebar.querySelectorAll(".article-detail-icon").forEach((item) => {
        const p2 = item.querySelector("p");
        if (p2 && hasContent(p2)) meta.push(p2);
      });
      const share = sidebar.querySelector(".share-page");
      if (share) {
        const heading2 = share.querySelector(".share-page--heading");
        if (heading2 && heading2.textContent.trim()) {
          const hp = document.createElement("p");
          hp.textContent = heading2.textContent.trim();
          meta.push(hp);
        }
        const links = [...share.querySelectorAll("a[href]")];
        if (links.length) {
          const lp = document.createElement("p");
          links.forEach((a, i) => {
            if (i) lp.append(" ");
            lp.append(a);
          });
          meta.push(lp);
        }
      }
    }
    const cells = [];
    const h1 = col.querySelector(":scope > h1");
    if (h1) cells.push([[h1]]);
    const content = [];
    [...col.children].forEach((child) => {
      if (child.matches(".ba--breadcrumbs, .post-info, .article-helpful-vote, hr, h1")) return;
      if (isHidden(child)) return;
      if (child.matches("img") && !child.getAttribute("src")) return;
      const fragLink = fragmentLink(child);
      if (fragLink) {
        const p2 = document.createElement("p");
        const a = document.createElement("a");
        a.href = fragLink;
        a.textContent = fragLink;
        p2.append(a);
        content.push(p2);
        return;
      }
      if (child.matches(".wp-block-create-block-hrb-expat-ways-to-file")) {
        const links = [...child.querySelectorAll("a[href]")];
        if (links.length) {
          const p2 = document.createElement("p");
          links.forEach((a, i) => {
            if (i) p2.append(" ");
            p2.append(a);
          });
          content.push(p2);
        }
        return;
      }
      if (!hasContent(child)) return;
      if (child.tagName === "DIV" || child.tagName === "FIGURE") content.push(...flatten(child, document));
      else if (child.tagName === "IMG" || child.tagName === "A") {
        const p2 = document.createElement("p");
        p2.append(child);
        content.push(p2);
      } else content.push(child);
    });
    if (meta.length || content.length) cells.push([meta.length ? meta : "", content.length ? content : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "article-body", cells });
    element.replaceWith(block);
    if (trail) block.before(trail);
    if (feedback) block.after(feedback);
  }
  function parse(element, { document }) {
    if (element.matches("section.ba-article") || element.querySelector(".ba--breadcrumbs, .article-sidebar")) {
      parseExpat(element, document);
      return;
    }
    element.querySelectorAll("a.share-tic-page--icon").forEach((a) => {
      if (!a.textContent.trim()) a.textContent = shareLabel(a.getAttribute("href"));
    });
    cleanInline(element);
    element.querySelectorAll("h1 > a:not([href]), h2 > a:not([href]), h3 > a:not([href]), h4 > a:not([href])").forEach((a) => {
      if (!a.textContent.trim()) a.remove();
    });
    const cells = [];
    const head = [];
    const category = element.querySelector(".category-abovetitle");
    if (category) {
      const visible = [...category.querySelectorAll(":scope > span:not(.hidden-breadcrumb) a")];
      if (visible.length) {
        const p2 = document.createElement("p");
        visible.forEach((a, i) => {
          if (i) p2.append(" ");
          p2.append(a);
        });
        head.push(p2);
      }
    }
    const h1 = element.querySelector("h1");
    if (h1) head.push(h1);
    if (head.length) cells.push([head]);
    const bar = element.querySelector(".tic-article-detail-bar--desktop") || element.querySelector(".tic-article-detail-bar");
    const meta = [];
    if (bar) {
      bar.querySelectorAll(".tic-article-detail-icon").forEach((item) => {
        const p2 = item.querySelector("p");
        if (p2 && hasContent(p2)) meta.push(p2);
      });
      const share = bar.querySelector(".share-tic-page");
      if (share) {
        const heading2 = share.querySelector(".share-tic-page--heading");
        if (heading2 && heading2.textContent.trim()) {
          const hp = document.createElement("p");
          hp.textContent = heading2.textContent.trim();
          meta.push(hp);
        }
        const links = [...share.querySelectorAll("a[href]")];
        if (links.length) {
          const lp = document.createElement("p");
          links.forEach((a, i) => {
            if (i) lp.append(" ");
            lp.append(a);
          });
          meta.push(lp);
        }
      }
    }
    const content = [];
    const main = element.querySelector(".article-main-content");
    if (main) content.push(...flatten(main, document));
    const author = element.querySelector(".tic-article-author-feature");
    if (author) {
      const img = author.querySelector("img");
      if (img) {
        const p2 = document.createElement("p");
        p2.append(img);
        content.push(p2);
      }
      author.querySelectorAll(".tic-author-name, .tic-author-title, .tic-author-description").forEach((p2) => {
        if (hasContent(p2)) content.push(p2);
      });
      const share = author.querySelector(".share-tic-page");
      if (share) {
        const heading2 = share.querySelector(".share-tic-page--heading");
        const links = [...share.querySelectorAll("a[href]")];
        if (links.length) {
          const lp = document.createElement("p");
          if (heading2 && heading2.textContent.trim()) lp.append(`${heading2.textContent.trim()} `);
          links.forEach((a, i) => {
            if (i) lp.append(" ");
            lp.append(a);
          });
          content.push(lp);
        }
      }
    }
    if (meta.length || content.length) cells.push([meta.length ? meta : "", content.length ? content : ""]);
    const block = WebImporter.Blocks.createBlock(document, { name: "article-body", cells });
    let feedback = null;
    const vote = element.querySelector(".article-helpful-vote");
    if (vote) {
      const q = vote.querySelector(".helpful-heading");
      const options = [...vote.querySelectorAll(".helpful-buttons a, .helpful-buttons button")].map((o) => o.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
      if (q && options.length) {
        const fbCells = [[q.textContent.trim()]];
        fbCells.push(options.map((label) => {
          const p2 = document.createElement("p");
          p2.textContent = label;
          return p2;
        }));
        feedback = WebImporter.Blocks.createBlock(document, { name: "article-feedback", cells: fbCells });
      }
    }
    element.replaceWith(block);
    if (feedback) block.after(feedback);
  }

  // tools/importer/parsers/breadcrumb.js
  function parse2(element, { document }) {
    const ul = document.createElement("ul");
    const crumbs = [...element.querySelectorAll(".ba--breadcrumbs > span, .ba--breadcrumbs > a")].filter((n) => !n.classList.contains("ba--breadcrumbs--divide"));
    const items = crumbs.length ? crumbs : [...element.querySelectorAll("a")];
    items.forEach((crumb) => {
      const a = crumb.tagName === "A" ? crumb : crumb.querySelector("a");
      const text10 = (a || crumb).textContent.replace(/\s+/g, " ").trim();
      if (!text10) return;
      const li = document.createElement("li");
      const isCurrent = crumb.classList.contains("breadcrumb-current") || crumb.getAttribute("aria-current") === "page";
      if (a && a.getAttribute("href") && !isCurrent) {
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = text10;
        li.append(link);
      } else {
        li.textContent = text10;
      }
      ul.append(li);
    });
    const cells = ul.children.length ? [[ul]] : [];
    const block = WebImporter.Blocks.createBlock(document, { name: "breadcrumb", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/article-feedback.js
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse3(element, { document }) {
    const question = text(element.querySelector(".helpful-heading, .helpful-heading-parent")) || "Was this article helpful?";
    const options = [...element.querySelectorAll(".helpful-buttons a, .helpful-buttons button, a.action--vote")].filter((o, i, all) => all.indexOf(o) === i).map((o) => text(o)).filter(Boolean);
    const unique = [...new Set(options)];
    if (!unique.length) {
      element.remove();
      return;
    }
    const cells = [
      [question],
      unique.map((label) => {
        const p2 = document.createElement("p");
        p2.textContent = label;
        return p2;
      })
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "article-feedback", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function cleanInline2(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, " ").trim()));
    });
  }
  function text2(el) {
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
  function heading(document, tag, label, href) {
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
  function para(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function buttonPara(document, a) {
    const link = document.createElement("a");
    link.href = a.getAttribute("href");
    link.textContent = text2(a);
    const strong = document.createElement("strong");
    strong.append(link);
    return para(document, strong);
  }
  function parse4(element, { document }) {
    cleanInline2(element);
    const cells = [];
    let variant = null;
    if (element.matches(".expat-hp-countries--grid") || element.querySelector(".expat-hp-countries--thumb")) {
      variant = "country-grid";
      element.querySelectorAll("a[href]").forEach((a) => {
        const img = a.querySelector("img");
        const label = text2(a.querySelector("p")) || text2(a);
        if (!label) return;
        const link = document.createElement("a");
        link.href = a.getAttribute("href");
        link.textContent = label;
        cells.push([img || "", para(document, link)]);
      });
    } else if (element.querySelector("a.ba--pgitem")) {
      element.querySelectorAll("a.ba--pgitem").forEach((a) => {
        const href = a.getAttribute("href");
        const body = [];
        const cat = text2(a.querySelector(".category-label"));
        if (cat) body.push(para(document, cat));
        const title = text2(a.querySelector(".post-title, h2, h3"));
        if (title) body.push(heading(document, "h2", title, href));
        const excerpt = text2(a.querySelector("p"));
        if (excerpt) body.push(para(document, excerpt));
        if (body.length) cells.push([body]);
      });
    } else if (element.querySelector("a.ba-single--related-post")) {
      element.querySelectorAll("a.ba-single--related-post").forEach((a) => {
        const href = a.getAttribute("href");
        const img = a.querySelector(".featured-image img, img");
        const body = [];
        const cat = text2(a.querySelector(".category-label"));
        if (cat) body.push(para(document, cat));
        const title = text2(a.querySelector(".title, h2, h3:not(.category-label)"));
        if (title) body.push(heading(document, "h3", title, href));
        if (body.length || img) cells.push([img || "", body.length ? body : ""]);
      });
    } else if (element.matches(".theposts") || element.querySelector("div.post .tic-post-title")) {
      variant = "image";
      element.querySelectorAll("div.post").forEach((post) => {
        const a = post.querySelector("a[href]");
        const href = a ? a.getAttribute("href") : null;
        const img = post.querySelector("img") || bgImage(post.querySelector(".tic-post-thumbnail"), document);
        const body = [];
        const cat = text2(post.querySelector(".tic-green-subhead"));
        if (cat) body.push(para(document, cat));
        const title = text2(post.querySelector(".tic-post-title"));
        if (title) body.push(heading(document, "h3", title, href));
        const excerpt = post.querySelector(".tic-post-excerpt, .excerpt");
        if (excerpt && text2(excerpt)) body.push(para(document, text2(excerpt)));
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
        const btn = [...art.querySelectorAll(".btn-container a[href], footer a[href], a.btn[href]")].find((a) => text2(a));
        const href = btn ? btn.getAttribute("href") : null;
        const body = [];
        const eyebrow = art.querySelector(".eyebrow-label, .stacked-eyebrow-row");
        if (eyebrow && text2(eyebrow)) body.push(para(document, text2(eyebrow)));
        const titleEl = art.querySelector(".stacked-title, h3.title, header h3, h3, h2");
        const title = text2(titleEl);
        if (title) body.push(heading(document, "h3", title, href));
        const summary = art.querySelector(".excerpt, .card-body > div:first-child, .card-body");
        if (summary) {
          const ps = [...summary.querySelectorAll("p, ul, ol")].filter((p2) => {
            const list = p2.parentElement.closest("ul, ol");
            return !(list && summary.contains(list)) && text2(p2);
          });
          if (ps.length) body.push(...ps);
          else if (text2(summary) && (!btn || !summary.contains(btn))) body.push(para(document, text2(summary)));
        }
        if (btn) body.push(buttonPara(document, btn));
        if (body.length || img) cells.push([img || "", body.length ? body : ""]);
      });
    }
    const name = variant ? `cards-article (${variant})` : "cards-article";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function text3(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse5(element, { document }) {
    element.querySelectorAll("svg, script, style, link, noscript, button.slick-arrow, ul.slick-dots").forEach((n) => n.remove());
    const cells = [];
    const heading2 = [...element.querySelectorAll(".ts-heading, h1, h2, h3")].find((h) => text3(h));
    if (heading2 && !heading2.closest(".testimonial-slide")) {
      const intro = [heading2];
      const introCol = heading2.closest('[class*="col-"]');
      if (introCol) {
        introCol.querySelectorAll("p").forEach((p2) => {
          if (text3(p2)) intro.push(p2);
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
        if (text3(cite)) {
          const strong = document.createElement("strong");
          strong.textContent = text3(cite);
          const np = document.createElement("p");
          np.append(strong);
          author.push(np);
        }
        fig.querySelectorAll("address p").forEach((p2) => {
          if (text3(p2)) author.push(p2);
        });
        const quote = [...fig.querySelectorAll("blockquote p")].filter((p2) => text3(p2));
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
          if (!text3(p2)) return;
          if (p2.classList.contains("author-name")) {
            const strong = document.createElement("strong");
            strong.textContent = text3(p2);
            const np = document.createElement("p");
            np.append(strong);
            author.push(np);
          } else {
            author.push(p2);
          }
        });
      }
      const quoteBox = slide.querySelector(".testimonial-copy") || slide;
      const quote = [...quoteBox.querySelectorAll("p")].filter((p2) => text3(p2) && !(authorBox && authorBox.contains(p2)));
      if (!quote.length && !author.length) return;
      if (author.length) cells.push([author, quote.length ? quote : ""]);
      else cells.push([quote]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  var CATALOG_VARIANTS = {
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
  var BLOCK_SEL = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text4(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden2(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline3(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text4(btn)));
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
    const link = document.createElement("a");
    link.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text4(el)) link.append(img);
    else link.textContent = text4(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text4(el)) {
      const strong = document.createElement("strong");
      strong.append(link);
      return para2(document, strong);
    }
    return para2(document, link);
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
        if (n.nodeType !== 1 || isHidden2(n)) return;
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
          if (text4(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text4(b))));
          if (text4(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text4(n) || n.querySelector("img")) out.push(ctaPara(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text4(n)) out.push(ctaPara(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden2(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text4(n)) {
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
  function parse6(element, { document, params }) {
    cleanInline3(element);
    if (!element.textContent.trim() && !element.querySelector("img, picture, video, iframe, svg, lottie-player")) return;
    const variantFromCatalog = catalogVariant(element, params);
    if (variantFromCatalog === "!default-content") {
      element.querySelectorAll("table").forEach((t) => expandSpans(t, document));
      const holder = document.createElement("div");
      holder.append(...extract(document, element));
      element.replaceWith(holder);
      return;
    }
    let columns = [];
    if (element.matches(".green-due-date-section") || element.querySelector(".featured-due-date")) {
      const date = [...element.querySelectorAll(".featured-due-date")].find((d) => !isHidden2(d)) || element.querySelector(".featured-due-date");
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
      return text4(outside) ? [col] : items;
    });
    const row = columns.map((col) => extract(document, col, { icons: true })).filter((content) => content.length);
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
  var CATALOG_VARIANTS2 = {
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
  var BLOCK_SEL2 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text5(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden3(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline4(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text5(btn)));
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
  function para3(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara2(document, el) {
    const link = document.createElement("a");
    link.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text5(el)) link.append(img);
    else link.textContent = text5(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text5(el)) {
      const strong = document.createElement("strong");
      strong.append(link);
      return para3(document, strong);
    }
    return para3(document, link);
  }
  function extract2(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para3(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden3(n)) return;
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
            out.push(para3(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text5(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text5(b))));
          if (text5(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text5(n) || n.querySelector("img")) out.push(ctaPara2(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text5(n)) out.push(ctaPara2(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden3(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL2) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text5(n)) {
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
      const summary = text5(r.querySelector(".bv-off-screen"));
      if (summary) r.replaceWith(para3(document, summary));
      else r.remove();
    });
    element.querySelectorAll(".price-block, .pricing-container").forEach((pb) => {
      if (pb.parentElement && pb.parentElement.closest(".price-block, .pricing-container")) return;
      const out = [];
      pb.querySelectorAll(".card-price-section").forEach((sec) => {
        const label = text5(sec.querySelector(".copy-small-t, .copy-small"));
        if (label) out.push(para3(document, label));
        const price = sec.querySelector(".product-price") || sec.querySelector(".price");
        if (price && text5(price)) {
          const strong = document.createElement("strong");
          strong.append(...[...price.childNodes]);
          out.push(para3(document, strong));
        }
      });
      pb.querySelectorAll(".pricingtext").forEach((n) => {
        if (text5(n)) out.push(para3(document, text5(n)));
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
      (l.closest(".lottie-container") || l).replaceWith(para3(document, a));
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
      const choices = options.filter((o) => o !== placeholder && text5(o));
      if (!choices.length) return;
      const out = [];
      const label = text5(placeholder) || text5(form.querySelector("label"));
      if (label) out.push(para3(document, label));
      const ul = document.createElement("ul");
      choices.forEach((o) => {
        const li = document.createElement("li");
        const href = pickerHref(form, o.getAttribute("value"), text5(o));
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = text5(o);
          li.append(a);
        } else {
          li.textContent = text5(o);
        }
        ul.append(li);
      });
      out.push(ul);
      const btn = [...form.querySelectorAll(".btn-container a, .btn-container button, a.btn, button.btn")].find((b) => text5(b));
      if (btn) out.push(btn);
      const holder = document.createElement("div");
      holder.append(...out);
      form.replaceWith(holder);
    });
  }
  function parse7(element, { document, params }) {
    element.querySelectorAll("span.hide, button.lottie-btn").forEach((n) => n.remove());
    normalizePickers(document, element);
    cleanInline4(element);
    const hasPrice = !!element.querySelector(".price-block, .pricing-container");
    normalizeWidgets(document, element);
    const columnList = element.querySelector("ul.column-container");
    const columns = columnList ? [...columnList.children].filter((c) => c.matches("li")) : [...element.children];
    const row = columns.map((col) => extract2(document, col)).filter((c) => c.length);
    let variant = catalogVariant2(element, params);
    if (variant === void 0) variant = hasPrice ? "pricing" : null;
    const cells = row.length ? [row] : [];
    const name = variant ? `hero-split (${variant})` : "hero-split";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  var DARK_THEMES = ["green-dark-theme", "spruce-forest-theme", "green-forest-theme", "black-theme"];
  function cleanInline5(root) {
    root.querySelectorAll("svg, span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(btn.textContent.replace(/\s+/g, " ").trim()));
    });
  }
  function svgToImg3(document, svg) {
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
      const img = svg && svgToImg3(document, svg);
      if (img) svg.replaceWith(img);
    });
  }
  function text6(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function para4(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function buildHeading(document, src) {
    const tag = /^H[1-6]$/.test(src.tagName) ? src.tagName.toLowerCase() : "h3";
    const h = document.createElement(tag);
    const a = src.querySelector("a[href]");
    if (a) {
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = text6(src);
      h.append(link);
    } else {
      h.textContent = text6(src);
    }
    return h;
  }
  function ctaParagraph(document, container) {
    const controls = [...container.querySelectorAll("a, button")].filter((c) => text6(c));
    if (!controls.length) return null;
    const p2 = document.createElement("p");
    controls.forEach((c, i) => {
      if (i) p2.append(" ");
      if (c.tagName === "A" && c.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = c.getAttribute("href");
        link.textContent = text6(c);
        const strong = document.createElement("strong");
        strong.append(link);
        p2.append(strong);
      } else {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = text6(c);
        const strong = document.createElement("strong");
        strong.append(link);
        p2.append(strong);
      }
    });
    return p2;
  }
  function isDark(card) {
    return DARK_THEMES.some((t) => card.classList.contains(t));
  }
  function parse8(element, { document }) {
    captureIcons(element, document);
    cleanInline5(element);
    const cells = [];
    const facts = [...element.querySelectorAll("div.fast-fact")];
    if (element.matches(".fast-facts") || facts.length) {
      facts.forEach((ff) => {
        const img = ff.querySelector("img");
        const body = [...ff.querySelectorAll(":scope > p, :scope > div:not(.ff-image) p, :scope > h3, :scope > h4")].filter((p2) => text6(p2));
        if (!body.length && !img) return;
        cells.push([img || "", body.length ? body : ""]);
      });
    } else {
      const cards = [...element.querySelectorAll("article.card-stacked, article")].filter((a, i, arr) => arr.indexOf(a) === i && !a.parentElement.closest("article"));
      if (!cards.length) {
        element.querySelectorAll("div.chicletDiv").forEach((tile) => {
          const label = text6(tile.querySelector("p.title") || tile);
          if (!label) return;
          const body = [];
          const content = tile.querySelector(".chicletDivContent") || tile;
          if (isDark(content)) body.push(para4(document, "(dark)"));
          const a = tile.querySelector("a[href]");
          const href = a && a.getAttribute("href");
          const h = document.createElement("h3");
          if (href && !/^javascript:/i.test(href)) {
            const link = document.createElement("a");
            link.href = href;
            link.textContent = label;
            h.append(link);
          } else h.textContent = label;
          body.push(h);
          cells.push([tile.querySelector("img") || "", body]);
        });
      }
      cards.forEach((card) => {
        const inset = card.closest(".card-inset");
        if (inset && card.querySelector(".word-wrap-card")) {
          const body2 = [];
          if (isDark(inset) || isDark(card)) body2.push(para4(document, "(dark)"));
          const title2 = card.querySelector(".card-title");
          if (title2) {
            const visible = title2.querySelector("span.show-large") || [...title2.querySelectorAll(":scope > span")].find((s) => !s.classList.contains("hide-large"));
            const eyebrow2 = text6(visible || title2);
            const eyebrowLink = title2.querySelector("a[href]");
            if (eyebrow2 && eyebrowLink && text6(eyebrowLink) === eyebrow2) {
              const link = document.createElement("a");
              link.href = eyebrowLink.getAttribute("href");
              link.textContent = eyebrow2;
              body2.push(para4(document, link));
            } else if (eyebrow2) body2.push(para4(document, eyebrow2));
          }
          const statements = [...card.querySelectorAll(".word-wrap-card p")].filter((p2) => text6(p2));
          statements.forEach((p2, i) => {
            if (i === 0) {
              const h = document.createElement("h3");
              h.textContent = text6(p2);
              body2.push(h);
            } else body2.push(para4(document, text6(p2)));
          });
          const price = card.querySelector(".pricing-container, .card-price-section");
          if (price && text6(price)) {
            const p2 = document.createElement("p");
            [...price.querySelectorAll(".card-copy-small, .copy-small, strong, .price")].filter((n, i, all) => text6(n) && !all.some((o) => o !== n && o.contains(n))).forEach((n, i) => {
              if (i) p2.append(" ");
              if (n.tagName === "STRONG" || n.classList.contains("price")) {
                const strong = document.createElement("strong");
                strong.textContent = text6(n);
                p2.append(strong);
              } else p2.append(text6(n));
            });
            if (text6(p2)) body2.push(p2);
          }
          const btns = card.querySelector(".card-btn") || card.querySelector(".card-footer");
          const cta = btns && ctaParagraph(document, btns);
          if (cta) body2.push(cta);
          const img2 = card.querySelector("img");
          if (!body2.some((b) => text6(b) && text6(b) !== "(dark)") && !img2) return;
          cells.push([img2 || "", body2]);
          return;
        }
        const img = card.querySelector(".cmp-column--image img") || card.querySelector("img");
        const body = [];
        if (isDark(card)) body.push(para4(document, "(dark)"));
        const eyebrow = card.querySelector(".eyebrow-label, .stacked-eyebrow-row");
        if (eyebrow && text6(eyebrow)) body.push(para4(document, text6(eyebrow)));
        const title = card.querySelector(".stacked-title, h1, h2, h3, h4");
        if (title && text6(title)) body.push(buildHeading(document, title));
        const textHolder = card.querySelector('[class*="body_max_width"]') || card.querySelector(".card-body .card-body > div:first-child");
        if (textHolder) {
          [...textHolder.children].forEach((child) => {
            if (text6(child) || child.querySelector("img")) body.push(child);
          });
        }
        const btnContainer = card.querySelector(".btn-container");
        if (btnContainer) {
          const cta = ctaParagraph(document, btnContainer);
          if (cta) body.push(cta);
        }
        const hasBody = body.some((b) => text6(b) && text6(b) !== "(dark)");
        if (!hasBody && !img) return;
        cells.push([img || "", body.length ? body : ""]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-strip.js
  var CATALOG_VARIANTS3 = {
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
  var BLOCK_SEL3 = "div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, section, article, header, footer, table, figure, blockquote, form, aside, nav";
  function text7(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function isHidden4(el) {
    const style = el.getAttribute && el.getAttribute("style") || "";
    return /display\s*:\s*none/i.test(style) || el.hidden === true;
  }
  function cleanInline6(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text7(btn)));
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
  function para5(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else if (Array.isArray(content)) p2.append(...content);
    else p2.append(content);
    return p2;
  }
  function ctaPara3(document, el) {
    const link = document.createElement("a");
    link.href = el.tagName === "A" && el.getAttribute("href") || "#";
    const img = el.querySelector("img");
    if (img && !text7(el)) link.append(img);
    else link.textContent = text7(el);
    const isButton = el.tagName === "BUTTON" || /(^|\s)btn(\s|$)|button/.test(el.className || "");
    if (isButton && text7(el)) {
      const strong = document.createElement("strong");
      strong.append(link);
      return para5(document, strong);
    }
    return para5(document, link);
  }
  function extract3(document, root, opts = {}) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s+/g, " ").trim();
          if (t) out.push(para5(document, t));
          return;
        }
        if (n.nodeType !== 1 || isHidden4(n)) return;
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
            out.push(para5(document, a));
          }
          return;
        }
        if (/^H[1-6]$/.test(tag)) {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          if (text7(n)) out.push(n);
          return;
        }
        if ((tag === "UL" || tag === "OL") && (n.matches('.column-container, .accordion, [role="tablist"]') || n.querySelector(":scope > li > div, :scope > li > section, :scope > li > article, :scope > li > header"))) {
          walk(n);
          return;
        }
        if (tag === "P" || tag === "UL" || tag === "OL" || tag === "TABLE" || tag === "BLOCKQUOTE") {
          n.querySelectorAll("svg").forEach((s) => s.remove());
          n.querySelectorAll("button").forEach((b) => b.replaceWith(document.createTextNode(text7(b))));
          if (text7(n) || n.querySelector("img")) out.push(n);
          return;
        }
        if (tag === "A") {
          if (text7(n) || n.querySelector("img")) out.push(ctaPara3(document, n));
          return;
        }
        if (tag === "BUTTON") {
          if (text7(n)) out.push(ctaPara3(document, n));
          return;
        }
        const hasHidden = [...n.querySelectorAll("[style]")].some((d) => isHidden4(d));
        if (!hasHidden && !n.querySelector(BLOCK_SEL3) && !n.querySelector('img, svg, button, a[class*="btn"], a[class*="button"]') && text7(n)) {
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
  function parse9(element, { document, params }) {
    cleanInline6(element);
    const banner = element.querySelector(".alignBanner") || element;
    const row = [];
    const media = banner.querySelector(":scope > .text-center-sm, .cmp-column--image");
    if (media) {
      const img = media.querySelector("img");
      const svg = media.querySelector("svg");
      const icon = img || (svg ? svgToImg4(document, svg) : null);
      if (icon) row.push(icon);
    }
    const heading2 = banner.querySelector(".skinnyHeader, h1, h2, h3, h4");
    if (heading2 && text7(heading2)) {
      const h = /^H[1-6]$/.test(heading2.tagName) ? heading2 : document.createElement("h2");
      if (h !== heading2) h.textContent = text7(heading2);
      row.push(h);
    }
    const copy = banner.querySelector(".skinnyBodyCopy");
    if (copy) {
      const content = extract3(document, copy);
      if (content.length) row.push(content);
    }
    const actions = banner.querySelector(".removeLastPadding, .btn-container");
    if (actions) {
      const ctas = [...actions.querySelectorAll("a, button")].filter((c) => text7(c)).map((c) => ctaPara3(document, c));
      if (ctas.length) row.push(ctas);
    }
    let variant = catalogVariant3(element, params);
    if (variant === void 0) {
      variant = element.matches("section.column-control") && element.querySelector("section.rounded-border") ? "light" : null;
    }
    const cells = row.length ? [row] : [];
    const name = variant ? `promo-strip (${variant})` : "promo-strip";
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
  function text8(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline7(root) {
    root.querySelectorAll("span.reader, span.spacer, input, script, style, link, noscript, meta").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text8(btn)));
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
  function iconOf(document, root) {
    const img = root.querySelector("img");
    if (img && img.getAttribute("src")) return img;
    const svg = root.querySelector("svg");
    return svg ? svgToImg5(document, svg) : null;
  }
  function para6(document, content) {
    const p2 = document.createElement("p");
    if (typeof content === "string") p2.textContent = content;
    else p2.append(content);
    return p2;
  }
  function ctaParagraph2(document, container) {
    const controls = [...container.querySelectorAll("a, button")].filter((c) => text8(c));
    if (!controls.length) return null;
    const p2 = document.createElement("p");
    controls.forEach((c, i) => {
      if (i) p2.append(" ");
      if (c.tagName === "A" && c.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = /^javascript:/i.test(c.getAttribute("href")) ? "#" : c.getAttribute("href");
        link.textContent = text8(c);
        if (c.classList.contains("btn")) {
          const strong = document.createElement("strong");
          strong.append(link);
          p2.append(strong);
        } else {
          p2.append(link);
        }
      } else {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = text8(c);
        const strong = document.createElement("strong");
        strong.append(link);
        p2.append(strong);
      }
    });
    return p2;
  }
  function blockChildren(holder) {
    return [...holder.querySelectorAll(":scope > p, :scope > ul, :scope > ol, :scope > h2, :scope > h3, :scope > h4, :scope > div > p")].filter((n) => text8(n));
  }
  function parse10(element, { document, params }) {
    const variantFromCatalog = catalogVariant4(element, params);
    cleanInline7(element);
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
          if (!text8(n)) return false;
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
        if (price && text8(price)) body.push(para6(document, text8(price)));
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
        const spans = [...header.querySelectorAll(":scope > span")].filter((s) => text8(s));
        if (spans.length >= 2) {
          body.push(para6(document, text8(spans[0])));
          const h = document.createElement("h3");
          h.textContent = text8(spans[1]);
          body.push(h);
          spans.slice(2).forEach((s) => body.push(para6(document, text8(s))));
        } else if (text8(header)) {
          const h = document.createElement("h3");
          h.textContent = text8(header);
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
            if (!text8(child)) return;
            const onlyBold = child.tagName === "P" && child.children.length === 1 && /^(B|STRONG|SPAN)$/.test(child.firstElementChild.tagName) && child.firstElementChild.matches("b, strong, .font-bold") && text8(child) === text8(child.firstElementChild);
            if (onlyBold && !body.length) {
              const h = document.createElement("h3");
              h.textContent = text8(child);
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
        const body = [...clone.querySelectorAll("h1, h2, h3, h4, h5, p, ul, ol")].filter((n) => text8(n) && !n.parentElement.closest("p, ul, ol, h1, h2, h3, h4, h5"));
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

  // tools/importer/parsers/columns-stats.js
  function text9(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function cleanInline8(root) {
    root.querySelectorAll("span.reader, a.reader, span.spacer, input, script, style, link, noscript, meta, template").forEach((n) => n.remove());
    root.querySelectorAll("button.js-disclaimer-link, button.symbol-disclaimer").forEach((btn) => {
      btn.replaceWith(btn.ownerDocument.createTextNode(text9(btn)));
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
  function parse11(element, { document }) {
    cleanInline8(element);
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
  function headingSlug(heading2) {
    return (heading2.textContent || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-").replace(/^\d+-+/, "");
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
      const heading2 = [...body.querySelectorAll("h1, h2, h3, h4, h5, h6")].find((h) => h.textContent.trim() && !h.matches(".eyebrow-label, .color-eyebrow"));
      const slug = heading2 ? headingSlug(heading2) : "";
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
        const text10 = t(el);
        if (!text10 || seen.has(text10) || el.tagName === "HRB-TEXT" && el.querySelector("h1, h2, h3")) return;
        if (el.tagName === "BUTTON" && el.disabled) return;
        seen.add(text10);
        let node;
        if (/^H[1-3]$/.test(el.tagName)) {
          node = document.createElement(el.tagName.toLowerCase());
          node.textContent = text10;
        } else if (el.tagName === "BUTTON") {
          node = document.createElement("p");
          const strong = document.createElement("strong");
          const a = document.createElement("a");
          a.href = "#";
          a.textContent = text10;
          strong.append(a);
          node.append(strong);
        } else {
          node = document.createElement("p");
          node.textContent = text10;
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
      const heading2 = targetHeading(document, target);
      let slug = "";
      if (heading2) {
        const clone = heading2.cloneNode(true);
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
      const para7 = texts.find((t) => t.tagName === "P" && blockBox(t) && t.textContent.trim().length > 120);
      if (para7) pw = Math.round(para7.getBoundingClientRect().width) || "";
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
        return hasContent2(el);
      }
      for (let p2 = el.parentElement; p2; p2 = p2.parentElement) {
        if (set.has(p2) && p2.tagName === "SECTION") return false;
      }
      return hasContent2(el);
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
  function hasContent2(el) {
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
      return hasContent2(el);
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
        if (!hasContent2(band)) return;
        const style = entryStyle.has(band) ? entryStyle.get(band) : NONE;
        raw.push({ el: band, style, themed: style !== NONE });
      });
    });
    entries.forEach(({ el, style }) => {
      if (rootSet.has(el) || containsRoot(el)) return;
      if (!hasContent2(el)) return;
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
      const link = document.createElement("a");
      link.href = frag.path;
      link.textContent = frag.path;
      const fragmentBlock = WebImporter.Blocks.createBlock(document, { name: "Fragment", cells: [[link]] });
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
      const link = img.closest("a");
      if (link && element.contains(link)) {
        if (!isSoleMeaningfulDescendant(link, node)) {
          console.warn(`[hrblock-dm-images] skipped mixed-content anchor for ${dmUrl}`);
          return;
        }
        link.setAttribute("title", dmUrl);
        link.textContent = alt;
        return;
      }
      const a = document.createElement("a");
      a.setAttribute("href", dmUrl);
      a.textContent = alt;
      node.replaceWith(a);
    });
  }

  // tools/importer/import-resource-article-steps-alt.js
  var PAGE_TEMPLATE = {
    "name": "resource-article-steps-alt",
    "urls": [
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/"
    ],
    "description": "Expat resource-center article (WordPress expat-2022 theme), FBAR filing guide variant: left meta sidebar (read time, date, author, reviewer, share links), breadcrumb, title, Key Takeaways excerpt, featured image, body text with a ways-to-file link pair and a numbered step list, article helpful vote, recommended articles, testimonials and tax help CTA, using the expat sub-site header",
    "blocks": [
      {
        "name": "article-body",
        "instances": [
          "#site-content > section.container.ba-article"
        ]
      },
      {
        "name": "breadcrumb",
        "instances": [
          "#site-content > section.container.ba-article div.ba--breadcrumbs"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/": [
            "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.ba--breadcrumbs"
          ]
        }
      },
      {
        "name": "article-feedback",
        "instances": [
          "#site-content > section.container.ba-article div.article-helpful-vote"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/": [
            "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.row.row--desktop-standard.article-helpful-vote"
          ]
        }
      },
      {
        "name": "cards-article",
        "instances": [
          "#site-content > section.container div.container--desktop-small:has(> div.featured-card a.ba-single--related-post)"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/": [
            "#site-content > section:nth-child(2) > div.row.row--desktop-small.container--desktop-small"
          ]
        }
      },
      {
        "name": "carousel-testimonial",
        "instances": [
          "#site-content > section.full-width.gray-background"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/": [
            "#site-content > section.full-width.gray-background"
          ]
        }
      },
      {
        "name": "columns-banner",
        "instances": [
          "#site-content > section.container.ba-article div.wp-block-create-block-hrb-expat-ways-to-file",
          "#site-content > section.ba-cta"
        ],
        "pageInstances": {
          "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/": [
            "#site-content > section.container.ba-article > div > div.col-8.desktop-small > div.wp-block-create-block-hrb-expat-ways-to-file",
            "#site-content > section.ba-cta"
          ]
        }
      }
    ],
    "sections": [
      {
        "id": "expat-article",
        "name": "Article",
        "selector": [
          "#site-content > section.container.ba-article"
        ],
        "style": null,
        "blocks": [
          "breadcrumb",
          "article-body",
          "columns-banner",
          "article-feedback"
        ],
        "defaultContent": []
      },
      {
        "id": "expat-recommended",
        "name": "Recommended articles",
        "selector": [
          "#site-content > section.container:has(a.ba-single--related-post)"
        ],
        "style": null,
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          "#site-content > section.container h4.recommended-heading"
        ]
      },
      {
        "id": "expat-testimonials",
        "name": "Expat testimonials",
        "selector": [
          "#site-content > section.full-width.gray-background"
        ],
        "style": "light-grey",
        "blocks": [
          "carousel-testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "expat-cta",
        "name": "Tax help CTA",
        "selector": [
          "#site-content > section.ba-cta"
        ],
        "style": "bright-green",
        "blocks": [
          "columns-banner"
        ],
        "defaultContent": []
      }
    ],
    "pageCleanup": {
      "https://www.hrblock.com/expat-tax-preparation/resource-center/country/canada/file-fbar-canada/": [
        "#universal-skip-to-content"
      ]
    }
  };
  var parsers = {
    "article-body": parse,
    "breadcrumb": parse2,
    "article-feedback": parse3,
    "cards-article": parse4,
    "carousel-testimonial": parse5,
    "columns-banner": parse6
  };
  var fragmentParsers = {
    "article-body": parse,
    "breadcrumb": parse2,
    "article-feedback": parse3,
    "cards-article": parse4,
    "carousel-testimonial": parse5,
    "columns-banner": parse6,
    "hero-split": parse7,
    "cards-feature": parse8,
    "promo-strip": parse9,
    "cards-icon": parse10,
    "columns-stats": parse11
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
  var import_resource_article_steps_alt_default = {
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
  return __toCommonJS(import_resource_article_steps_alt_exports);
})();
