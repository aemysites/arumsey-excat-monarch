# columns-choice

Custom **columns** block. Purpose: side-by-side columns, by default two alternatives separated by an "or" divider.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row with one cell per column (usually two). An optional short middle cell such as "or" sets the divider text. Columns can hold heading, text, links, an image, or a table.

### Copy and CTAs

- A short paragraph directly above a heading is shown as an eyebrow (small caps line).
- A paragraph holding only a link is a CTA. Bold, italic or bold+italic links keep their usual button type. Plain links get the type the citi.com module uses: a light button in the first column and chevron text links in the other columns of choice layouts, a filled button in `media-promo`, and a white outlined button in `promo-banner`.
- Paragraphs after a CTA are shown as fine print (12px).
- Option tables (`with-tables`): the first row of each table is the blue option caption. In value cells, bold text is the large rate and the text after it is the description.

## Supported variations

| Variation | Option class |
| --- | --- |
| Media Promo | `media-promo` |
| Promo Banner | `promo-banner` |
| With Tables | `with-tables` |
| With Icons | `with-icons` |

## Universal Editor fields

N/A (Document Authoring project)
