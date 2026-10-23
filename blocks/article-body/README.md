# article-body

Custom **custom** block. Purpose: Article layout with an optional sidebar of article meta beside the article content.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Two-cell rows: cell 1 = sidebar meta (read time, date, written by, reviewed by, share links), cell 2 = article content (headings, text, lists, links, images, tables). One-cell rows: article content only. Without sidebar content the article is a single column.

## Supported variations

Expat (automatic): on pages with Metadata "Template: expat-article" the block gets the `expat` class: 24/32px meta icons (read time, date, author, reviewer) in a two-column bar under the title, then a 1/6 sidebar + 2/3 article column from 992px; a leading "Key Takeaways" paragraph, the first image before the first heading (full column width) and plain tables are styled to the source. The class can also be authored as a block variant.

## Universal Editor fields

N/A (Document Authoring project)
