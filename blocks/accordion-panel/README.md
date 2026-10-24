# accordion-panel

Custom **accordion** block. Purpose: bordered collapsible FAQ / "Things you should know" panels.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per question: question label | answer (rich text, or a link to a /fragments/ path to load complex content). Single-cell rows are extra content (intro text, "View all FAQs" link); with the sidebar option the last single-cell row becomes the side column of related links.

## Supported variations

| Variation | Option class |
| --- | --- |
| Terms | `terms` |
| Two Column | `two-column` |
| Sidebar | `sidebar` |
| Lined | `lined` |
| Narrow (single column centred at 8/12 from 900px) | `narrow` |
| Plain (unboxed text toggle; auto-applied to a lone fragment-backed item with no other option) | `plain` |

## Universal Editor fields

N/A (Document Authoring project)
