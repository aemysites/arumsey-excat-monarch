# columns-teaser

Custom **columns** block. Purpose: Boxed expandable question teaser (default), framed image + text promo (grey) and framed icon-link row (shadow).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: default: first cell is the question; the remaining cells or rows are the answer (text, links), or a single link to a /fragments/ path that is loaded on first expand. grey: one row with an image cell and a text cell (heading, text, CTA). shadow: one row of cells, each an icon + link.

## Supported variations

| Variation | Option class |
| --- | --- |
| Grey | `grey` |
| Shadow | `shadow` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- Default: the question becomes a button (`aria-expanded`/`aria-controls`); a fragment answer loads lazily on first open.
- `grey` and `shadow` switch the block to a column layout.
