# hero-chevron

Custom **hero** block. Purpose: banking / mortgage page hero: eyebrow, heading, short copy and one or two CTAs on the left, a photo cropped to a chevron (or rounded) shape on the right.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional picture-only row(s) for the photo, then the copy cell (eyebrow paragraph, heading, text, optional list, CTA links); the photo may instead share the copy's row (cell order sets the photo side). Further rows become a product-details strip, one column per cell. A cell holding only a link to a /fragments/ page is replaced by that fragment. Background colour comes from the section style (dark, blue) or the dark option.

## Supported variations

| Variation | Option class |
| --- | --- |
| Dark | `dark` |
| Rounded Image | `rounded-image` |
| Rounded Image Chevron Photo | `rounded-image-chevron-photo` |
| Rounded Image Product Details | `rounded-image-product-details` |
| Image | `image` |

## Universal Editor fields

N/A (Document Authoring project)
