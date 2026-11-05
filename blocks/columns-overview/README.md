# columns-overview

Custom **columns** block. Purpose: section heading and intro on the left with a ruled list of arrowed service links on the right.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, two cells: [heading + optional intro text | bulleted list of links]; an optional short plain-text paragraph right after the list (e.g. "Load more") becomes a toggle that reveals items beyond the first four.

## Layouts (detected from content, no class needed)

| Content | Layout class added by JS |
| --- | --- |
| text cell + list-only cell (links, or `<strong>` title + `<br>` + description) | `columns-overview-list`: heading 4/12, ruled list 8/12 with arrows on links |
| text cell + image-only cell | `columns-overview-media-last`: text 8/12, image 4/12 |
| image-only cell + text cell | `columns-overview-media-first`: image 4/12, text 8/12 |
| image-only cell + [heading, role, list of tel:/mailto: links, "Read More" link] | `columns-overview-person`: contact card (half width on desktop) |

A heading that opens the text cell gets the orange rule (except on person cards).

## Supported variations

| Variation | Option class |
| --- | --- |
| Grey | `grey` |

## Universal Editor fields

N/A (Document Authoring project)
