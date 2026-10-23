# cards-feature

Custom **cards** block. Purpose: Grid of feature/promo cards with optional photo or icon, heading, text and a link or button pinned to the bottom.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: image or icon (optional, own cell) | body cell with optional eyebrow, heading, text and a final paragraph of links/buttons (rendered as the card CTA). Mark an individual card dark by starting a paragraph with `(dark)` (e.g. a `(dark)` paragraph on its own) or by adding an extra cell containing `dark`; the marker is stripped and the card gets the `.dark` card styling.

## Supported variations

| Variation | Option class |
| --- | --- |
| Dark | `dark` |

## Universal Editor fields

N/A (Document Authoring project)
