# columns-banner

Custom **columns** block. 

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, two or more cells: text (heading, copy, CTA links/buttons) beside a photo, illustration or icon; options change the split (pair, bleed, strip, no-panel, overlay).

## Supported variations

| Variation | Option class |
| --- | --- |
| Pair | `pair` |
| No Panel | `no-panel` |
| Bleed | `bleed` |
| Deadline | `deadline` |
| No Panel Image Background | `no-panel-image-background` |
| Strip | `strip` |
| Dark 4 | `dark-4` |
| Dark 3 | `dark-3` |
| Stats | `stats` (one cell per figure: heading + caption) |

Layouts detected by the block JS (no option needed):

- `pair` whose cells each hold one bare link: green ways-to-file link panel (`columns-banner-link-panel`).
- Variant-less banner in a `bright-green` section: full-bleed tax-help CTA band, photo right (`columns-banner-cta`).
- Cells that start with a photo followed by a heading and copy: centred photo bios (`columns-banner-photos`).
- `deadline` first cell without a flag picture: date-only deadline disc.

## Universal Editor fields

N/A (Document Authoring project)
