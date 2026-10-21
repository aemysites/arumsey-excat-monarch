# columns-icon-features

Custom **columns** block. Purpose: centred feature columns: icon, heading, short description and a link.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row with one cell per feature (or one feature per row). Each cell: icon or image, heading, text, link.

## Supported variations

No authored variations. The decorator adds `columns-icon-features-{n}-items` and the layout follows the count:

- 3-6 features (citi.com small-business "benefit cards"): one white rounded card, 40px icons, 14px text,
  thin vertical dividers between columns (5-6 features wrap to rows of three). Mobile: one card per feature.
- 2 features (citi.com cd-account cross-sell tiles): wider soft-shadow card with the two tiles spaced
  around, 55px icons, 16px text and a bold "Learn More" link with a chevron. Mobile: tiles stack, no card.

## Universal Editor fields

N/A (Document Authoring project)
