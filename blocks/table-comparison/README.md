# table-comparison

Custom **table** block. Purpose: Accessible data/plan comparison table: column headers for plans or fields, optional row labels, tick/cross cells.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: optional leading single-cell rows (heading, text) become the intro; the next row is the column header row (plan names, optional CTA links); each further row is one table row. The first column becomes row headers when the top-left header cell is empty or holds only a heading, or with `dark`/`image-*`. Cells holding only a tick/cross (or tick/cross icon) are marked included/not included; a ✓/✗ glyph (whole cell, or a leading paragraph before detail text) is drawn as the source tick/cross artwork with an accessible label.

## Supported variations

| Variation | Option class |
| --- | --- |
| Cyan Grey | `cyan-grey` |
| Cyan Grey Light | `cyan-grey-light` |
| Image Cyan Grey Light | `image-cyan-grey-light` |
| Dark | `dark` |
| Image Grey | `image-grey` |
| Image Cyan Grey | `image-cyan-grey` |

## Universal Editor fields

N/A (Document Authoring project)

## Notes

- Header cells get `scope="col"`, row labels `scope="row"`.
- The table sits in a focusable, labelled scroll region on narrow screens (600px min width, 800px for four or more columns). The source hides these tables below its large breakpoint, so horizontal scroll is the usable mobile fallback.
- Missing trailing cells are padded so columns line up.
