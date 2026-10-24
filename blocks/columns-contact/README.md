# columns-contact

Custom **columns** block. Purpose: Side-by-side contact details (department heading, phone numbers, operating hours, postal/email addresses).

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row with 2-3 cells; each cell holds a bold label or heading, then paragraphs with phone (tel:) or email (mailto:) links and opening hours. Extra rows stack below.

## Supported variations

| Variation | Option class |
| --- | --- |
| Image | `image` |
| Alt | `alt` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- `tel:` links get `columns-contact-phone`, `mailto:` links get `columns-contact-email`.
- A paragraph that starts with an icon or image keeps the icon on the same line as the text.
