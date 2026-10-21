# table-rates

Custom **table** block. Purpose: Rate, fee and comparison tables.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: Rows of cells. A leading single-cell row becomes the caption; the first multi-cell row becomes the header when every cell has content (an empty top-left corner cell is allowed; rows holding check marks stay data rows); single-cell rows later in the table become full-width group rows; short rows are padded to the widest row. Cells holding only a check mark or dash (`✓`, `—`) are centred and tinted Citi blue.

Columns share the width equally (fixed layout) so consecutive table-rates blocks with the same column count line up. Each column is at least 160px wide; narrower viewports scroll the table sideways inside the block with the first column pinned.

## Supported variations

| Variation | Option class |
| --- | --- |
| Bordered | `bordered` |

## Universal Editor fields

N/A (Document Authoring project)
