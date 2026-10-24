# hero-title

Custom **hero** block. Purpose: Plain page-title band (heading, optional intro text) without a photo backdrop, optionally with a link-list chooser, a collapsible notice panel or a side image.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one cell with the page heading and optional text, ticked lists and links. A list made only of links becomes a chooser button that reveals the list (the item for the current page, else the first, labels the button). With `cyan-2`, the first line is a header that collapses the rest. A picture-only cell becomes a side image.

## Supported variations

| Variation | Option class |
| --- | --- |
| Cyan | `cyan` |
| Cyan 2 | `cyan-2` |
| Image | `image` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- Chooser: button with `aria-expanded`; closes on Escape or when focus leaves.
- `cyan-2` panel starts expanded.
