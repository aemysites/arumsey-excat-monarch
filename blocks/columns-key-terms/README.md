# columns-key-terms

Custom **columns** block. Purpose: key card terms row (label, value, note) split by rules; card-picker: image beside a heading and list of card links.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: default: one row; one cell per term: label, value, note. card-picker: one row; image cell + content cell with heading and a list whose items hold thumbnail, title, text and a link.

Decoration: default cells get `columns-key-terms-label` / `-value` (the paragraph that is only bold text) / `-note`. card-picker list items become `columns-key-terms-card` with `-card-thumb`, `-card-eyebrow` (loose text before the link) and `-card-title`; the image column is hidden below 900px, as on citi.com.

## Supported variations

| Variation | Option class |
| --- | --- |
| Card Picker | `card-picker` |
| Light | `light` |

## Universal Editor fields

N/A (Document Authoring project)
