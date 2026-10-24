# callout-banner

Custom **custom** block. Purpose: notice panel with an icon/image panel beside a heading, text and links (e.g. PDS / policy booklet notices, annual report link).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per callout; cells: [icon or image (optional)] [heading, text, links; or a /fragments/ link] [action link (optional)]. A single link makes the whole panel clickable with a chevron; with the button option the last link renders as a button. If there is no icon/image cell, a decorative document icon is added: `/icons/pds.svg` for the default look, `/icons/file.svg` for the others. The `light` and `image-light-2` looks get no icon.

## Supported variations

| Variation | Option class |
| --- | --- |
| Image | `image` |
| Light | `light` |
| Button | `button` |
| Image Light | `image-light` |
| Image Light 2 | `image-light-2` |

## Universal Editor fields

N/A (Document Authoring project)
