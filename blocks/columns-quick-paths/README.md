# columns-quick-paths

Custom **columns** block. Purpose: row of 2-3 short, divider-separated columns, each a quick path (icon + heading, optional text, arrow link) or a key term (label, value, fine print).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell per column; each cell holds an optional icon, a heading (or label), optional body text and an optional single-link paragraph as the CTA.

Optional first row with a single cell holding only a heading (e.g. "What would you like to do?") renders as a centred title inside the box, above the columns.

## Supported variations

| Variation | Option class | Renders as |
| --- | --- | --- |
| (default) | none | White rounded box with shadow; icon + heading, chevron link; 2px light-grey dividers between columns (stacked with rules on mobile) |
| In Box With Text | `in-box-with-text` | Same box, with body text under each heading |
| Key Terms | `key-terms` | Rates & fees strip: label (with footnote link), value heading, fine print; 1px dividers |
| Light | `light` | Key-terms layout with white text on the dark card-page background; on a `dark`/`blue` section it uses the band instead of its own background |

## Universal Editor fields

N/A (Document Authoring project)
