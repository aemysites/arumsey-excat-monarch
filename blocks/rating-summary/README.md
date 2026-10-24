# rating-summary

Custom **custom** block. Purpose: review badge, star rating, score and review-count link; stars derive from the authored numeric score.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: cells (any order): [badge image] [score, e.g. "(4.3 out of 5)"] [review count link, e.g. "1770 Car Reviews"]; optional key/value rows [score] [4.3], [max] [5], [count] [link], [badge] [image]. With intro-text, extra cells (heading, paragraphs) render beside the rating.

Rendering: stars are an outlined strip with a filled strip cropped to the score (CSS SVG backgrounds, 5 x 17px stars over 114px, partial fill measured on the star glyph). A leading "Read all" in the count link is visually hidden (kept for screen readers), matching the source.

Compact form: key/value rows only (score, count) with no badge and no intro render as a left-aligned row of 20px teal stars (grey empty part), the score ("4.3") and the count number as "(1770)" linked to the page reviews anchor (the sibling rating-summary link, else `#reviews`). The block gets the `rating-summary-compact` class automatically.

## Supported variations

| Variation | Option class |
| --- | --- |
| Intro Text | `intro-text` |

## Universal Editor fields

N/A (Document Authoring project)
