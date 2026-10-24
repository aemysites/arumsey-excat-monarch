# columns-links

Custom **columns** block. Purpose: Columns of navigational link lists (support links, product directories, sitemap) with optional icon headings.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional first single-cell intro row (heading + text); then one row with 2-3 cells, each holding an optional icon + heading and a list (or run of paragraphs) of links. Nested lists render as bulleted sub-links. A cell holding only a link to a /fragments/ path is replaced by that fragment, for long sitemap columns.

## Supported variations

| Variation | Option class |
| --- | --- |
| Image | `image` |
| Grey | `grey` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- Default: each link row gets a trailing chevron and a divider.
- `image`: icon + heading pairs; chevrons lead each link.
- Long columns (sitemap) can live in a fragment: put just the fragment link in the cell.
