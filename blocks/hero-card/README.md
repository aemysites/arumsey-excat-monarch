# hero-card

Custom **hero** block. Purpose: credit-card product hero: eyebrow, offer heading, short copy, Apply now button and legal links beside a card image, optionally inside a coloured panel or over a full-bleed photo.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional picture-only rows (with two, the first is the background and the second the card image; with one, it is the card image, or the background for photo / photo-centred); then the copy cell (eyebrow paragraph, optional italic badge, heading, text, bold Apply link, optional highlights list), which may share its row with the image cell (cell order sets the image side); any further rows are extras (one cell: legal copy or APR box; several cells: an earn-rate grid). A cell holding only a link to a /fragments/ page is replaced by that fragment. Colour comes from the section style (dark, blue, grey, light, light-blue) or the background image, not from block classes.

## Supported variations

| Variation | Option class |
| --- | --- |
| Panel | `panel` |
| Photo | `photo` |
| Photo Centred | `photo-centred` |

## Universal Editor fields

N/A (Document Authoring project)
