# columns-media

Custom **columns** block. Purpose: Two-column media/text splits: text beside an image, app mockup, badge or stacked photos, plus text/side-panel and heading/content pairs.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row (or more) with 2 cells: a text cell (heading, paragraphs, lists, CTA links, optional leading icon, optional inline table) and a media cell (one picture, or several stacked pictures), or two text cells. Authored cell order is the visual order. A cell holding only a link to a /fragments/ path is replaced by that fragment, for complex content such as nested tables and FAQ panels.

## Supported variations

| Variation | Option class |
| --- | --- |
| Wide Right | `wide-right` |
| Boxed | `boxed` |
| Image Left | `image-left` |
| Image Left 2 | `image-left-2` |
| Image Right | `image-right` |
| Image Right 2 | `image-right-2` |
| Image Left App | `image-left-app` |
| Wide | `wide` |
| Image Right 3 | `image-right-3` |
| Image | `image` |
| Image Right 4 | `image-right-4` |
| Heading Left | `heading-left` |
| Image Right 5 | `image-right-5` |
| Image Light | `image-light` |
| Image Right 6 | `image-right-6` |
| Boxed 2 | `boxed-2` |
| Image Left 3 | `image-left-3` |
| Image Light 2 | `image-light-2` |
| Boxed 3 | `boxed-3` |
| Alt | `alt` |
| Image Orange | `image-orange` |
| Image Right 7 | `image-right-7` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- Columns keep the authored order on every option; put the image cell first to show it on the left.
- A cell with only pictures becomes a media column; several pictures stack vertically.
- Tables inside a cell are wrapped in a horizontally scrolling container.
