# office-info

Custom block (no library base). Purpose: Office location details (address, phone, fax, description) beside a map.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One row, two cells. Cell 1: heading, address paragraph(s) linked to Google Maps, a bulleted list of Phone / Toll Free / Fax lines, optional description heading and paragraphs. Cell 2 (optional): a Google Maps embed link (/maps/embed or /maps/d/embed), any Google Maps link, or a map picture; when empty the first address is embedded automatically. An 'Open location in Maps' link is added under the map.

## Supported variations

| Variation | Option class |
| --- | --- |
| Image | `image` |
| Grey | `grey` |

## Universal Editor fields

N/A (Document Authoring project)
