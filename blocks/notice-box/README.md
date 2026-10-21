# notice-box

Custom **custom** block. Purpose: Boxed notice, disclosure or callout with optional image or icon.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One or more rows; a cell that holds only an image or icon becomes the media, all other cells become the body (heading, text, links). The last stand-alone link is treated as the call to action.

## Supported variations

| Variation | Option class |
| --- | --- |
| Contact | `contact` |
| Note | `note` |
| Icon Callout | `icon-callout` |
| Blue | `blue` |
| With Image | `with-image` |
| With Icon | `with-icon` |

Styling notes:
- `note` with a heading is an eyebrow between rules; `note` with plain text only is a shaded disclaimer strip.
- `contact` with an `h2` is a centred white tile (it overlaps a `hero-photo` directly above it); with an `h3` it is a left-aligned call box, and the first paragraph after the heading (phone number) is set larger.
- `blue` runs full bleed in Citi blue.

## Universal Editor fields

N/A (Document Authoring project)
