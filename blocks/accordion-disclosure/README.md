# accordion-disclosure

Custom **accordion** block. Purpose: collapsible legal disclosure / terms and conditions with numbered footnotes, Go back / Back to top links and optional tables.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per disclosure: label cell (e.g. Important Terms and Conditions) | body cell (intro text, numbered footnote list, paragraphs, links, optional table); a body cell holding only a /fragments/ link loads that fragment.

## Behaviour

- Items render expanded (as on citi.com); the label toggles them. A URL hash pointing inside an item opens it.
- Fragment bodies are flattened into the item body (no nested sections).
- Links reading "Go back" get the left-arrow icon and "Back to top" the left-chevron icon, each on its own line. A plain-text "Back to top" paragraph or list item becomes a link to the top of the page and is not numbered.
- Numbered footnotes (`ol`) use blue hanging counters.

## Supported variations

| Variation | Option class |
| --- | --- |
| With Table | `with-table` |
| With Table Borderless Table | `with-table-borderless-table` |

## Universal Editor fields

N/A (Document Authoring project)
