# accordion-feature

Custom **accordion** block. Purpose: expandable FAQ, product and pricing information panels, or a call-to-action button that reveals content.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per item: label cell (question or title) | panel cell (rich text, lists, links, tables); a panel cell holding only a /fragments/ link loads that fragment (so a panel can contain other blocks).

## Supported variations

| Variation | Option class | Look |
| --- | --- | --- |
| (default) | none | Credit-card FAQ drawers: 24px label, grey right chevron, ruled rows |
| Footnote | automatic | Set by JS (`is-footnote`) when every label starts with a `<sup>` marker: small bold toggle, blue left chevron, 12px legal text |
| Cta Button | `cta-button` | Centred CDS primary button (#056dae, 8px radius) |
| Faq | `faq` | Light-blue (#eff3f8) question rows, blue left chevron |
| No Icons | `no-icons` | Banking FAQ list: ruled rows, thin blue left chevron, no leading feature icons |
| Red | `red` | Dark-brown (#281814) tier button (Citigold Private Client) |
| Orange | `orange` | Gold (#8e6f32) tier button (Citigold) |

## Universal Editor fields

N/A (Document Authoring project)
