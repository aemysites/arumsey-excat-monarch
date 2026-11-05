# embed-interactive

Custom **embed** block. Purpose: embedded third-party content: a single YouTube/Vimeo video, a row of several videos side by side, or an external iframe tool/form (e.g. client file upload), optionally introduced by a heading and text.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional first row(s) without a link = intro heading/text; each following row (or each cell of a row, for side-by-side videos) holds the embed URL as a link, an optional placeholder image (click to play) and optional caption text. YouTube and Vimeo get a 16:9 player; any other https URL is embedded as an iframe.

## Supported variations

| Variation | Option class |
| --- | --- |
| Dark | `dark` |

## Universal Editor fields

N/A (Document Authoring project)
