# columns-media

Custom **columns** block. Purpose: image column beside a text column (eyebrow, heading, text, checklist, buttons).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per media pair: image cell + text cell (either order). Text cell: eyebrow, heading, text, optional list with leading icons, buttons. A cell holding only a /fragments/ link is replaced by the fragment. faq: text-only columns split by rules. icon-feature-list: icon + heading + text items. centred-image: text | image | text. dark on text-only: heading | copy split by a rule.

Decoration notes: a short paragraph directly before the heading is styled as the eyebrow; a plain bulleted list
renders as a Citi checkmark list (and switches the default layout to the 422px-image banner); a trailing
paragraph holding only a link becomes the module CTA (filled button by default, chevron text link on `faq`).
In `icon-feature-list`, list items may start with an icon paragraph (`li > p > picture`).

## Supported variations

| Variation | Option class |
| --- | --- |
| Faq | `faq` |
| Light | `light` |
| Dark | `dark` |
| Icon Feature List | `icon-feature-list` |
| Centred Image | `centred-image` |

## Universal Editor fields

N/A (Document Authoring project)
