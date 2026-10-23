# accordion-media

Custom **accordion** block. Purpose: Accordion of feature items with optional leading icons, beside an image that follows the open item.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Item rows: cell 1 = title (optional leading icon), cell 2 = body, optional cell 3 = image shown while that item is open. Single-cell rows before the items are an intro (heading/text), after the items a footer (e.g. "See all" link); a single-cell image-only row is a shared side image. A two-cell row whose first cell holds a heading plus copy and whose second cell holds only link paragraphs renders as an intro (left) beside an icon link list (right) instead of an accordion item; links to support, account/login, opt-out and FAQ pages get matching icons, or author a leading icon before the link.

## Supported variations

| Variation | Option class |
| --- | --- |
| Light | `light` |
| Link List | `link-list` |
| Dark | `dark` |
| Image Light | `image-light` |
| Checklist | `checklist` |
| Light 2 | `light-2` |

## Universal Editor fields

N/A (Document Authoring project)
