# cards-icon-links

Custom **cards** block. Purpose: a horizontal row of icon + label shortcut links (e.g. credit card categories).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per item; cells: icon image (SVG) and a link whose text is the label (icon and link may share one cell).

## Supported variations

| Variation | Option class |
| --- | --- |
| Light | `light` |

`light` drops the white plate and turns labels/icons white for a dark section; the same treatment applies automatically inside `dark` and `blue` section-metadata bands.

Rows with more than one text block (bold title + description) keep their content in `.cards-icon-links-body` instead of being flattened to a label. Such feature-grid content fits `cards-icon` better.

## Universal Editor fields

N/A (Document Authoring project)
