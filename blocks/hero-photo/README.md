# hero-photo

Custom **hero** block. Purpose: page-top banner with a full-bleed photo and the heading, short copy and CTA either in a white box on the photo or laid directly over it.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one picture-only cell or row for the background photo; one copy cell (optional eyebrow, heading, text, CTA links). Further text cells are appended to the copy. A short paragraph before the heading becomes the eyebrow; link-only paragraphs become the CTA row (bold link = filled button).

Below 900px the default and `text-on-photo` drop the photo for a solid band (pale blue / Citigold brown), as citi.com does; `centred-heading-only` and `gradient-overlay` keep it. The block is full bleed and needs no section style.

## Supported variations

| Variation | Option class |
| --- | --- |
| Default: copy centred in a white box at the left of the photo | (none) |
| Centred Heading Only: white heading and text centred straight on a dark photo | `centred-heading-only` |
| Gradient Overlay: white box on a photo with a blue gradient; on mobile the box overlaps the bottom of the photo | `gradient-overlay` |
| Text On Photo: dark left-aligned copy and CTAs on a light photo | `text-on-photo` |

## Universal Editor fields

N/A (Document Authoring project)
