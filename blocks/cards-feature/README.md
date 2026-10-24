# cards-feature

Custom **cards** block. Purpose: Grid of feature cards (icon or image, heading, short text, optional CTA) used for benefits, ways to help, payment options, download tiles, steps and expandable FAQ tiles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per card; each row has an optional icon/image cell + body cell (heading, text, lists, CTA links). An optional first single-cell row with a heading becomes the block intro; with `icon-left-photo-background` an optional first picture-only row becomes the background. A body cell holding only a link to a /fragments/ path is replaced by that fragment; a cell holding only a YouTube/Vimeo/MP4 link becomes an embedded video.

## Supported variations

| Variation | Option class |
| --- | --- |
| Persona | `persona` |
| Link Tiles | `link-tiles` |
| Shadow Image | `shadow-image` |
| Shadow | `shadow` |
| Icon Left | `icon-left` |
| Boxed | `boxed` |
| Cyan | `cyan` |
| Partner | `partner` |
| Grey Image | `grey-image` |
| Light | `light` |
| Icon Left Compact | `icon-left-compact` |
| Cyan 2 | `cyan-2` |
| Grey Light | `grey-light` |
| Icon Left Download | `icon-left-download` |
| Icon Left Photo Background | `icon-left-photo-background` |
| Grey | `grey` |
| Steps | `steps` |
| Cyan Grey | `cyan-grey` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- `partner`: each card collapses to its first heading or paragraph; activating it reveals the rest of the card.
- `steps`: cards without an image get a generated "Step N" badge.
- Link-tile options make the whole card clickable when the card holds exactly one link.
- Colour options (`cyan`, `grey`, `light`, ...) only add a bordered shell here; colours come from the design pass.
