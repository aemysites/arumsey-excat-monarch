# cards-product

Custom **cards** block. Purpose: product/offer cards with eyebrow, image, heading, text and Apply/Learn More CTAs.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per card; one cell per part, in display order: eyebrow/heading, image, text, list, a final cell of links (first link is the primary CTA, the rest secondary). A cell holding only a /fragments/ link is replaced by the fragment.

Decoration: a leading text-only cell (no heading, image or list) becomes the card eyebrow (`.cards-product-card-eyebrow`). In `stats`, a heading that starts with a number or a capitalised word (`5<sup>%</sup> in Rewards`, `BonusReward`) is split into a large `.cards-product-figure` and a smaller `.cards-product-label`; add a space or keep the figure first so the split is clean.

## Supported variations

| Variation | Option class |
| --- | --- |
| Stats | `stats` |
| Benefit Tiles | `benefit-tiles` |

## Universal Editor fields

N/A (Document Authoring project)
