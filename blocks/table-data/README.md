# table-data

Custom **table** block. Purpose: Data and comparison table on a card surface.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One block row per table row; the first row is the column header and the first cell of each body row is the row header. A single-cell row in a multi-column table becomes a full-width group heading.

## Supported variations

| Variation | Option class |
| --- | --- |
| Matrix | `matrix` |

## Automatic layouts (no option class)

- **Legal / data table**: a table with no headings, images or Included/Available marks (and not `matrix`) is laid out left/top aligned with content-sized columns; the first column stays a plain cell. Empty cells left over from source row/col spans are folded back (trailing empty columns dropped, a two-level header gets its rowspan/colspan, trailing empty cells after a value become its colspan).
- **Header bands**: in a section whose first table starts with `FACTS` (GLBA privacy notice), plain-text label cells (header row, row labels, single-cell group rows) render as green bands; bold-led cells stay plain cells.
- **Matrix hierarchy**: in `matrix`, wholly bold row labels are parent rows and the other rows are indented child rows.

## Universal Editor fields

N/A (Document Authoring project)
