# article-body

Custom **custom** block. Purpose: editorial article: hero with background image and title card, then the article body card with headings, text, lists, tables, images and inline promo banners.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1: hero image cell | text cell (eyebrow, H1 title, date / read time, optional CTA link); following one-cell rows: article body content in order; following multi-cell rows: inline promo banner (text | CTA | logo).

## Supported variations

| Variation | Option class | Effect |
| --- | --- | --- |
| Default | (none) | Promo strip is the citi.com "squared" banner: #e6eaf1, 15px radius, indented 48px, pill CTA |
| Image | `image` | Light-blue (#f0f5f7) "article" promo strip at full card width, square CTA in #04208f |
| Alt | `alt` | Same light-blue "article" promo strip, CTA in #002d72 |
| Alt 2 | `alt-2` | Bordered squared promo strip with no indent; tables 80% wide on desktop |

The hero card styles a standalone link as the CTA button (`.article-body-cta`). It groups the date and read-time paragraphs on one row (`.article-body-meta-list`), and a "Read Time" paragraph gets a clock icon.

## Universal Editor fields

N/A (Document Authoring project)
