# cards-teaser

Custom **cards** block. Purpose: image-topped teaser cards linking to services or articles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per card; cells: image, body (heading, short text, final paragraph with one link as the CTA). For with-topic-tags, add a read-time line and a bulleted list of tag links.

Decoration: a paragraph placed above the heading (or one reading "N min read") becomes the eyebrow (`cards-teaser-eyebrow`, shown with a clock glyph in with-topic-tags); a final paragraph holding only one link becomes the CTA (`cards-teaser-cta`, chevron link); a list made only of links becomes the tag pills (`cards-teaser-tags`). The light-blue variant is the white rounded tile style used on Citi's blue travel band; put it in a `blue` section.

## Supported variations

| Variation | Option class |
| --- | --- |
| With Topic Tags | `with-topic-tags` |
| Light Blue | `light-blue` |

## Universal Editor fields

N/A (Document Authoring project)
